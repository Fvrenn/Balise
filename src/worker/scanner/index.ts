import { AxeBuilder } from '@axe-core/playwright'
import { and, asc, eq } from 'drizzle-orm'

import { db } from '@/db'
import {
    auditFindings,
    auditPages,
    audits,
    rgaaCriteria,
    scanRuns,
} from '@/db/schema'
import {
    buildThemeProgress,
    computeComplianceRate,
    sumStatusCounts,
} from '@/lib/rgaa'
import { launchScanBrowser, withPage } from '@/worker/scanner/browser'
import {
    AXE_RULES,
    runChecks,
    type CheckResult,
} from '@/worker/scanner/checks'
import { publishScanProgress } from '@/worker/scanner/progress'
import type { ScanJobData } from '@/worker/queue'

// Orchestrateur d'un scan : charge chaque page de l'échantillon dans Playwright,
// exécute axe-core + les checks custom, met à jour les findings en base et publie
// la progression. Une page qui échoue (site down, timeout…) est ignorée et le scan
// continue ; seule une erreur d'infrastructure fait échouer le run entier.

export async function runScan(job: ScanJobData): Promise<void> {
    const { auditId, scanRunId, overwriteExisting, pageId } = job
    const scanStartedAt = Date.now()

    try {
        const pageFilter = pageId
            ? and(eq(auditPages.auditId, auditId), eq(auditPages.id, pageId))
            : eq(auditPages.auditId, auditId)
        const pages = await db
            .select({
                id: auditPages.id,
                label: auditPages.label,
                url: auditPages.url,
            })
            .from(auditPages)
            .where(pageFilter)
            .orderBy(asc(auditPages.sortOrder))
        if (pages.length === 0) {
            throw new Error(
                pageId
                    ? 'Page d’échantillon introuvable : rien à scanner.'
                    : 'Audit sans page d’échantillon : rien à scanner.',
            )
        }

        console.log(
            `[worker] scan ${scanRunId} — audit ${auditId} : ${pageId ? `page unique « ${pages[0]?.label} »` : `${pages.length} page(s)`}, mode ${overwriteExisting ? 'écrasement (tous les findings)' : 'complément (findings « à traiter » uniquement)'}`,
        )

        await db
            .update(scanRuns)
            .set({
                status: 'running',
                startedAt: new Date(),
                pagesTotal: pages.length,
            })
            .where(eq(scanRuns.id, scanRunId))

        let updatedCount = 0
        const failedPages: string[] = []

        const browser = await launchScanBrowser()
        try {
            for (const [pageIndex, page] of pages.entries()) {
                await publishScanProgress(auditId, {
                    type: 'page_start',
                    pageIndex,
                    totalPages: pages.length,
                    pageLabel: page.label,
                    pageUrl: page.url,
                })

                try {
                    console.log(
                        `[worker] page ${pageIndex + 1}/${pages.length} « ${page.label} » (${page.url})`,
                    )
                    const results = await withPage(
                        browser,
                        page.url,
                        async (playwrightPage) => {
                            const axeResults = await new AxeBuilder({
                                page: playwrightPage,
                            })
                                .withRules([...AXE_RULES])
                                .analyze()
                            return runChecks(playwrightPage, axeResults)
                        },
                    )
                    const { updated, skipped } = await applyCheckResults({
                        auditId,
                        pageId: page.id,
                        results,
                        overwrite: overwriteExisting,
                    })
                    updatedCount += updated
                    logPageResults(results, updated, skipped)
                } catch (error) {
                    // Page inaccessible ou analyse plantée : on la saute, le scan
                    // continue sur les pages suivantes.
                    failedPages.push(page.label)
                    console.error(
                        `[worker] page "${page.label}" (${page.url}) en échec :`,
                        error,
                    )
                }

                await db
                    .update(scanRuns)
                    .set({ pagesDone: pageIndex + 1 })
                    .where(eq(scanRuns.id, scanRunId))
                await publishScanProgress(auditId, {
                    type: 'page_done',
                    pageIndex,
                    totalPages: pages.length,
                    pageLabel: page.label,
                    pageUrl: page.url,
                })
            }
        } finally {
            await browser.close()
        }

        await recomputeAuditComplianceRate(auditId)

        await db
            .update(scanRuns)
            .set({
                status: 'completed',
                finishedAt: new Date(),
                error:
                    failedPages.length > 0
                        ? `Pages non analysées : ${failedPages.join(', ')}`
                        : null,
            })
            .where(eq(scanRuns.id, scanRunId))

        const durationSeconds = Math.round((Date.now() - scanStartedAt) / 1000)
        console.log(
            `[worker] scan ${scanRunId} terminé : ${updatedCount} finding(s) mis à jour sur ${pages.length} page(s) en ${durationSeconds}s${failedPages.length > 0 ? ` — pages en échec : ${failedPages.join(', ')}` : ''}`,
        )

        await publishScanProgress(auditId, {
            type: 'scan_complete',
            pageIndex: pages.length,
            totalPages: pages.length,
            pageLabel: '',
            pageUrl: '',
            updatedCount,
        })
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Erreur inconnue'
        await db
            .update(scanRuns)
            .set({ status: 'failed', finishedAt: new Date(), error: message })
            .where(eq(scanRuns.id, scanRunId))
        await publishScanProgress(auditId, {
            type: 'scan_error',
            pageIndex: 0,
            totalPages: 0,
            pageLabel: '',
            pageUrl: '',
            message,
        })
        // Relance pour que BullMQ marque le job « failed » (visible dans la queue).
        throw error
    }
}

// Bilan console d'une page analysée : synthèse des verdicts, puis le détail de
// chaque non-conformité (critère + constat) pour suivre le scan sans ouvrir l'UI.
function logPageResults(
    results: CheckResult[],
    updated: number,
    skipped: number,
): void {
    const nonConformes = results.filter(
        (result) => result.status === 'non_conforme',
    )
    const conformes = results.filter((result) => result.status === 'conforme')
    const nonApplicables = results.filter(
        (result) => result.status === 'non_applicable',
    )
    console.log(
        `[worker]   ${results.length} verdict(s) : ${conformes.length} conforme(s), ${nonConformes.length} non conforme(s), ${nonApplicables.length} non applicable(s) — ${updated} finding(s) mis à jour${skipped > 0 ? `, ${skipped} conservé(s) (déjà renseignés)` : ''}`,
    )
    if (conformes.length > 0) {
        console.log(
            `[worker]   C  ${conformes.map((result) => result.criterionId).join(', ')}`,
        )
    }
    if (nonApplicables.length > 0) {
        console.log(
            `[worker]   NA ${nonApplicables.map((result) => result.criterionId).join(', ')}`,
        )
    }
    for (const result of nonConformes) {
        console.log(
            `[worker]   NC ${result.criterionId} : ${result.comment ?? 'sans détail'}`,
        )
    }
}

// Applique les résultats des checks aux findings de la page. Les findings existent
// depuis la création de l'audit (un par critère par page) : un résultat sans
// finding correspondant est une anomalie, logguée et ignorée. Sans overwrite, seuls
// les findings encore « pending » sont touchés — jamais une saisie d'auditrice.
// Retourne le nombre de findings mis à jour et le nombre conservés (déjà
// renseignés, mode complément).
async function applyCheckResults(input: {
    auditId: string
    pageId: string
    results: CheckResult[]
    overwrite: boolean
}): Promise<{ updated: number; skipped: number }> {
    const existingFindings = await db
        .select({
            id: auditFindings.id,
            criterionId: auditFindings.criterionId,
            status: auditFindings.status,
        })
        .from(auditFindings)
        .where(
            and(
                eq(auditFindings.auditId, input.auditId),
                eq(auditFindings.pageId, input.pageId),
            ),
        )
    const findingByCriterion = new Map(
        existingFindings.map((finding) => [finding.criterionId, finding]),
    )

    let updated = 0
    let skipped = 0
    for (const result of input.results) {
        const finding = findingByCriterion.get(result.criterionId)
        if (!finding) {
            console.warn(
                `[worker] finding introuvable pour le critère ${result.criterionId} (page ${input.pageId}) — résultat ignoré`,
            )
            continue
        }
        if (!input.overwrite && finding.status !== 'pending') {
            skipped++
            continue
        }

        await db
            .update(auditFindings)
            .set({
                status: result.status,
                comment: result.comment ?? null,
                source: 'scan',
                copiedFromPageId: null,
                updatedBy: null,
                updatedAt: new Date(),
            })
            .where(eq(auditFindings.id, finding.id))
        updated++
    }
    return { updated, skipped }
}

// Même recalcul que côté app (updateFinding & co) : le taux mis en cache sur
// l'audit doit refléter les statuts posés par le scan.
async function recomputeAuditComplianceRate(auditId: string): Promise<void> {
    const rows = await db
        .select({
            criterionId: rgaaCriteria.id,
            themeId: rgaaCriteria.themeId,
            themeName: rgaaCriteria.themeName,
            status: auditFindings.status,
        })
        .from(auditFindings)
        .innerJoin(rgaaCriteria, eq(auditFindings.criterionId, rgaaCriteria.id))
        .where(eq(auditFindings.auditId, auditId))

    const complianceRate = computeComplianceRate(
        sumStatusCounts(buildThemeProgress(rows)),
    )
    await db
        .update(audits)
        .set({ complianceRate, updatedAt: new Date() })
        .where(eq(audits.id, auditId))
}
