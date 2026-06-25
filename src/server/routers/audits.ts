import { and, asc, count, desc, eq, inArray, sql } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import ExcelJS from 'exceljs'

import { protectedProcedure, router } from '@/server/trpc'
import type { Database } from '@/db'
import {
    auditAssignees,
    auditFindings,
    auditPages,
    audits,
    auditStatus,
    clients,
    findingStatus,
    member,
    pageType,
    rgaaCriteria,
    user,
} from '@/db/schema'
import {
    assertMembersInOrg,
    buildAssigneeRows,
    getAssigneesByAudit,
    type AssigneeSummary,
} from '@/server/assignees'
import {
    aggregateCriterionStatus,
    buildThemeProgress,
    computeComplianceRate,
    sumStatusCounts,
    type FindingStatus,
    type ThemeProgress,
} from '@/lib/rgaa'

const samplePageInput = z.object({
    label: z.string().trim().min(1, 'Le libellé est obligatoire.').max(200),
    url: z.string().trim().min(1, "L'URL de la page est obligatoire.").max(2000),
    type: z.enum(pageType.enumValues),
})

// Agrège les findings page par page d'un audit en avancement par thématique au niveau
// critère (chaque critère réduit à un statut global), dans l'ordre RGAA (theme 1 → 13).
async function getThemeProgress(
    db: Database,
    auditId: string,
): Promise<ThemeProgress[]> {
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

    return buildThemeProgress(rows)
}

// Recalcule le taux de conformité mis en cache sur l'audit à partir de l'état
// courant de ses findings, puis le persiste. Appelé après chaque modification.
// Le taux s'appuie sur le statut *global* de chaque critère (toutes pages agrégées),
// d'où la réutilisation de getThemeProgress.
async function recomputeComplianceRate(
    db: Database,
    auditId: string,
): Promise<number | null> {
    const themeProgress = await getThemeProgress(db, auditId)
    const complianceRate = computeComplianceRate(sumStatusCounts(themeProgress))
    await db
        .update(audits)
        .set({ complianceRate, updatedAt: new Date() })
        .where(eq(audits.id, auditId))

    return complianceRate
}

// Nombre de critères « traités » par audit, agrégé en une seule requête (pas de N+1
// sur la liste). Un critère est traité dès qu'une page le déclare non conforme
// (verdict acquis) ou qu'aucune de ses pages n'est plus « à traiter » — exactement la
// définition du statut global non « pending ».
async function getTreatedCountByAudit(
    db: Database,
    auditIds: string[],
): Promise<Map<string, number>> {
    if (auditIds.length === 0) return new Map()

    const perCriterion = db
        .select({
            auditId: auditFindings.auditId,
            criterionId: auditFindings.criterionId,
            isTreated:
                sql<boolean>`bool_or(${auditFindings.status} = 'non_conforme') or not bool_or(${auditFindings.status} = 'pending')`.as(
                    'is_treated',
                ),
        })
        .from(auditFindings)
        .where(inArray(auditFindings.auditId, auditIds))
        .groupBy(auditFindings.auditId, auditFindings.criterionId)
        .as('per_criterion')

    const rows = await db
        .select({
            auditId: perCriterion.auditId,
            treatedCount: sql<number>`count(*) filter (where ${perCriterion.isTreated})::int`,
        })
        .from(perCriterion)
        .groupBy(perCriterion.auditId)

    return new Map(rows.map((row) => [row.auditId, row.treatedCount]))
}

// Garantit qu'un finding appartient bien à un audit du cabinet courant. Retourne
// l'auditId associé, ou lève NOT_FOUND (pas de fuite inter-cabinets).
async function assertFindingInOrg(
    db: Database,
    findingId: string,
    organizationId: string,
): Promise<string> {
    const [row] = await db
        .select({ auditId: auditFindings.auditId })
        .from(auditFindings)
        .innerJoin(audits, eq(auditFindings.auditId, audits.id))
        .where(
            and(
                eq(auditFindings.id, findingId),
                eq(audits.organizationId, organizationId),
            ),
        )
        .limit(1)
    if (!row) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Finding introuvable.' })
    }
    return row.auditId
}

// Garantit qu'un audit appartient au cabinet courant, sinon NOT_FOUND.
async function assertAuditInOrg(
    db: Database,
    auditId: string,
    organizationId: string,
): Promise<void> {
    const audit = await db.query.audits.findFirst({
        where: and(
            eq(audits.id, auditId),
            eq(audits.organizationId, organizationId),
        ),
        columns: { id: true },
    })
    if (!audit) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Audit introuvable.' })
    }
}

const FINDING_STATUS_LABELS: Record<FindingStatus, string> = {
    pending: 'À traiter',
    conforme: 'Conforme',
    non_conforme: 'Non conforme',
    non_applicable: 'Non applicable',
    non_teste: 'Non testé',
}

const createAuditInput = z.object({
    clientId: z.string().min(1),
    name: z.string().trim().min(1, "Le nom de l'audit est obligatoire.").max(200),
    siteUrl: z.string().trim().min(1, "L'URL du site est obligatoire.").max(2000),
    // Au moins un auditeur assigné ; le formulaire pré-coche l'utilisateur courant.
    assigneeIds: z
        .array(z.string().min(1))
        .min(1, 'Assignez au moins un auditeur.'),
    contactName: z.string().trim().max(200).optional(),
    contactEmail: z.string().trim().email('Email du référent invalide.').optional(),
    pages: z.array(samplePageInput).min(1, 'Ajoutez au moins une page à auditer.'),
})

const updateAssigneesInput = z.object({
    auditId: z.string().min(1),
    assigneeIds: z
        .array(z.string().min(1))
        .min(1, 'Au moins un auditeur doit rester assigné.'),
})

export const auditsRouter = router({
    // Compteurs par statut pour les cartes de synthèse de la page Audits.
    stats: protectedProcedure.query(async ({ ctx }) => {
        const rows = await ctx.db
            .select({
                status: audits.status,
                count: count(),
            })
            .from(audits)
            .where(eq(audits.organizationId, ctx.organizationId))
            .groupBy(audits.status)

        let inProgress = 0
        let pendingReview = 0
        let completed = 0
        for (const row of rows) {
            if (row.status === 'in_progress') inProgress = row.count
            else if (row.status === 'pending_review') pendingReview = row.count
            else if (row.status === 'completed') completed = row.count
        }
        return { inProgress, pendingReview, completed }
    }),

    // Les audits assignés à l'utilisateur connecté, du plus récemment modifié au
    // plus ancien. En plus des champs de `list`, chaque ligne porte le nombre de
    // critères déjà traités sur les 106 — « traité » = tout statut sauf `pending`,
    // exactement comme `treatedCount` côté client (cf. @/lib/rgaa). Calculé en une
    // seule agrégation plutôt qu'un getThemeProgress par audit (qui serait N+1).
    listMine: protectedProcedure.query(async ({ ctx }) => {
        // « Mes audits » = ceux dont l'utilisateur courant est l'un des assignés.
        const myAuditIds = ctx.db
            .select({ auditId: auditAssignees.auditId })
            .from(auditAssignees)
            .where(eq(auditAssignees.userId, ctx.user.id))

        const rows = await ctx.db
            .select({
                id: audits.id,
                name: audits.name,
                siteUrl: audits.siteUrl,
                status: audits.status,
                complianceRate: audits.complianceRate,
                updatedAt: audits.updatedAt,
                clientName: clients.name,
            })
            .from(audits)
            .innerJoin(clients, eq(audits.clientId, clients.id))
            .where(
                and(
                    eq(audits.organizationId, ctx.organizationId),
                    inArray(audits.id, myAuditIds),
                ),
            )
            .orderBy(desc(audits.updatedAt))

        const treatedByAudit = await getTreatedCountByAudit(
            ctx.db,
            rows.map((row) => row.id),
        )
        return rows.map((row) => ({
            ...row,
            treatedCount: treatedByAudit.get(row.id) ?? 0,
        }))
    }),

    // Tous les audits du cabinet, du plus récemment modifié au plus ancien, avec le
    // nom du client (toujours présent) et le tableau des auditeurs assignés (au moins
    // un), trié du plus ancien assigné au plus récent.
    list: protectedProcedure.query(async ({ ctx }) => {
        const rows = await ctx.db
            .select({
                id: audits.id,
                name: audits.name,
                siteUrl: audits.siteUrl,
                status: audits.status,
                complianceRate: audits.complianceRate,
                createdAt: audits.createdAt,
                updatedAt: audits.updatedAt,
                clientName: clients.name,
            })
            .from(audits)
            .innerJoin(clients, eq(audits.clientId, clients.id))
            .where(eq(audits.organizationId, ctx.organizationId))
            .orderBy(desc(audits.updatedAt))

        const assigneesByAudit = await getAssigneesByAudit(
            ctx.db,
            rows.map((row) => row.id),
        )
        return rows.map((row) => ({
            ...row,
            assignees: assigneesByAudit.get(row.id) ?? [],
        }))
    }),

    // Audit complet du cabinet courant avec ses pages d'échantillon (ordonnées). Le
    // filtre sur organizationId garantit qu'aucun audit d'un autre cabinet ne fuite
    // (sinon NOT_FOUND).
    getById: protectedProcedure
        .input(z.object({ id: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
            const audit = await ctx.db.query.audits.findFirst({
                where: and(
                    eq(audits.id, input.id),
                    eq(audits.organizationId, ctx.organizationId),
                ),
                // Seuls les champs réellement lus par les vues : le header (name,
                // siteUrl, status) et la grille (pages). themeProgress est agrégé
                // plus bas, le taux de conformité y est recalculé côté client.
                columns: { id: true, name: true, siteUrl: true, status: true },
                with: {
                    pages: {
                        // id + label pour les cases « pages concernées » ; url + type
                        // restent disponibles pour les livrables.
                        columns: { id: true, label: true, url: true, type: true },
                        orderBy: (fields, operators) => [
                            operators.asc(fields.sortOrder),
                        ],
                    },
                    assignees: {
                        orderBy: (fields, operators) => [
                            operators.asc(fields.assignedAt),
                            operators.asc(fields.id),
                        ],
                        with: {
                            user: {
                                columns: { id: true, name: true, email: true },
                            },
                        },
                    },
                },
            })
            if (!audit) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Audit introuvable.',
                })
            }

            // Avancement par thématique : alimente la barre de progression du header
            // et le tableau de la vue d'ensemble.
            const themeProgress = await getThemeProgress(ctx.db, audit.id)
            const assignees: AssigneeSummary[] = audit.assignees.map(
                (assignee) => ({
                    userId: assignee.user.id,
                    name: assignee.user.name,
                    email: assignee.user.email,
                }),
            )
            return { ...audit, assignees, themeProgress }
        }),

    // Les 106 × N findings de l'audit (un par critère par page) avec leur critère
    // RGAA, triés selon l'ordre officiel du référentiel. La grille les regroupe par
    // page (onglets) ; l'avancement global agrège toutes les pages côté client.
    getFindings: protectedProcedure
        .input(z.object({ auditId: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
            await assertAuditInOrg(ctx.db, input.auditId, ctx.organizationId)

            return ctx.db
                .select({
                    id: auditFindings.id,
                    status: auditFindings.status,
                    comment: auditFindings.comment,
                    pageId: auditFindings.pageId,
                    copiedFromPageId: auditFindings.copiedFromPageId,
                    criterionId: rgaaCriteria.id,
                    themeId: rgaaCriteria.themeId,
                    themeName: rgaaCriteria.themeName,
                    title: rgaaCriteria.title,
                    sortOrder: rgaaCriteria.sortOrder,
                })
                .from(auditFindings)
                .innerJoin(
                    rgaaCriteria,
                    eq(auditFindings.criterionId, rgaaCriteria.id),
                )
                .where(eq(auditFindings.auditId, input.auditId))
                .orderBy(asc(rgaaCriteria.sortOrder))
        }),

    // Met à jour un finding (statut, commentaire) pour une page donnée puis recalcule
    // le taux de conformité de l'audit. Cœur de la sauvegarde automatique. Toute
    // édition manuelle efface l'indicateur de propagation : le finding n'est plus une
    // simple copie d'une autre page.
    updateFinding: protectedProcedure
        .input(
            z.object({
                findingId: z.string().min(1),
                status: z.enum(findingStatus.enumValues),
                comment: z.string().max(5000).nullish(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const auditId = await assertFindingInOrg(
                ctx.db,
                input.findingId,
                ctx.organizationId,
            )

            const [finding] = await ctx.db
                .update(auditFindings)
                .set({
                    status: input.status,
                    comment: input.comment ?? null,
                    copiedFromPageId: null,
                    updatedBy: ctx.user.id,
                    updatedAt: new Date(),
                })
                .where(eq(auditFindings.id, input.findingId))
                .returning()

            const complianceRate = await recomputeComplianceRate(ctx.db, auditId)
            return { finding, complianceRate }
        }),

    // Propage un finding (statut + commentaire) vers les mêmes critères d'autres pages
    // de l'audit. Les findings cibles héritent de copiedFromPageId = page source, pour
    // afficher « Propagé depuis … » tant qu'ils ne sont pas réédités à la main.
    copyFindingToPages: protectedProcedure
        .input(
            z.object({
                findingId: z.string().min(1),
                targetPageIds: z
                    .array(z.string().min(1))
                    .min(1, 'Sélectionnez au moins une page.'),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const auditId = await assertFindingInOrg(
                ctx.db,
                input.findingId,
                ctx.organizationId,
            )

            const [source] = await ctx.db
                .select({
                    criterionId: auditFindings.criterionId,
                    pageId: auditFindings.pageId,
                    status: auditFindings.status,
                    comment: auditFindings.comment,
                })
                .from(auditFindings)
                .where(eq(auditFindings.id, input.findingId))
                .limit(1)
            if (!source) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Finding introuvable.',
                })
            }

            // On ne propage jamais un finding sur sa propre page. Le filtre sur
            // (auditId, criterionId) restreint la copie au même audit du cabinet —
            // une page d'un autre audit ne matche jamais aucun finding ici, et l'index
            // unique (audit, critère, page) garantit au plus un finding touché par page.
            const targetPageIds = input.targetPageIds.filter(
                (pageId) => pageId !== source.pageId,
            )
            if (targetPageIds.length === 0) return { complianceRate: null }

            await ctx.db
                .update(auditFindings)
                .set({
                    status: source.status,
                    comment: source.comment,
                    copiedFromPageId: source.pageId,
                    updatedBy: ctx.user.id,
                    updatedAt: new Date(),
                })
                .where(
                    and(
                        eq(auditFindings.auditId, auditId),
                        eq(auditFindings.criterionId, source.criterionId),
                        inArray(auditFindings.pageId, targetPageIds),
                    ),
                )

            const complianceRate = await recomputeComplianceRate(ctx.db, auditId)
            return { complianceRate }
        }),

    // Passe toute une thématique en « non applicable » en un geste, puis recalcule le
    // taux de conformité. Restreignable à certaines pages via pageIds (vide ou absent
    // = toutes les pages de l'audit).
    markThemeNA: protectedProcedure
        .input(
            z.object({
                auditId: z.string().min(1),
                themeId: z.number().int().min(1).max(13),
                pageIds: z.array(z.string().min(1)).optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            await assertAuditInOrg(ctx.db, input.auditId, ctx.organizationId)

            const criteria = await ctx.db
                .select({ id: rgaaCriteria.id })
                .from(rgaaCriteria)
                .where(eq(rgaaCriteria.themeId, input.themeId))
            const criterionIds = criteria.map((criterion) => criterion.id)
            if (criterionIds.length === 0) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Thématique RGAA inconnue.',
                })
            }

            const conditions = [
                eq(auditFindings.auditId, input.auditId),
                inArray(auditFindings.criterionId, criterionIds),
            ]
            if (input.pageIds && input.pageIds.length > 0) {
                conditions.push(inArray(auditFindings.pageId, input.pageIds))
            }

            await ctx.db
                .update(auditFindings)
                .set({
                    status: 'non_applicable',
                    copiedFromPageId: null,
                    updatedBy: ctx.user.id,
                    updatedAt: new Date(),
                })
                .where(and(...conditions))

            const complianceRate = await recomputeComplianceRate(
                ctx.db,
                input.auditId,
            )
            return { complianceRate }
        }),

    // Bascule le statut de l'audit (in_progress ↔ completed). Marqueur visuel
    // uniquement : l'audit reste modifiable dans les deux états.
    updateAuditStatus: protectedProcedure
        .input(
            z.object({
                auditId: z.string().min(1),
                status: z.enum(auditStatus.enumValues),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            await assertAuditInOrg(ctx.db, input.auditId, ctx.organizationId)

            const [audit] = await ctx.db
                .update(audits)
                .set({ status: input.status, updatedAt: new Date() })
                .where(eq(audits.id, input.auditId))
                .returning()
            return audit
        }),

    // Génère la grille d'audit RGAA au format Excel (ExcelJS) et la renvoie encodée
    // en base64 — le client la reconvertit en fichier téléchargeable.
    exportExcel: protectedProcedure
        .input(z.object({ auditId: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const audit = await ctx.db.query.audits.findFirst({
                where: and(
                    eq(audits.id, input.auditId),
                    eq(audits.organizationId, ctx.organizationId),
                ),
                with: {
                    client: { columns: { name: true } },
                    pages: { columns: { id: true, label: true } },
                },
            })
            if (!audit) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Audit introuvable.',
                })
            }

            const findings = await ctx.db
                .select({
                    criterionId: rgaaCriteria.id,
                    themeName: rgaaCriteria.themeName,
                    title: rgaaCriteria.title,
                    sortOrder: rgaaCriteria.sortOrder,
                    status: auditFindings.status,
                    comment: auditFindings.comment,
                    pageId: auditFindings.pageId,
                })
                .from(auditFindings)
                .innerJoin(
                    rgaaCriteria,
                    eq(auditFindings.criterionId, rgaaCriteria.id),
                )
                .where(eq(auditFindings.auditId, input.auditId))
                .orderBy(asc(rgaaCriteria.sortOrder))

            const pageLabelById = new Map(
                audit.pages.map((page) => [page.id, page.label]),
            )

            // Choix d'export : une ligne par critère (106 lignes) avec son statut
            // *global* agrégé — le format le plus exploitable pour les devs du client,
            // qui veulent d'abord le verdict par critère. Le détail page par page des
            // non-conformités (page + commentaire) est reporté dans deux colonnes
            // dédiées, pour rester actionnable sans noyer la grille sous 106 × N lignes.
            interface CriterionExport {
                criterionId: string
                themeName: string
                title: string
                sortOrder: number
                statuses: FindingStatus[]
                nonConformeDetails: { label: string; comment: string }[]
            }

            const byCriterion = new Map<string, CriterionExport>()
            for (const finding of findings) {
                let row = byCriterion.get(finding.criterionId)
                if (!row) {
                    row = {
                        criterionId: finding.criterionId,
                        themeName: finding.themeName,
                        title: finding.title,
                        sortOrder: finding.sortOrder,
                        statuses: [],
                        nonConformeDetails: [],
                    }
                    byCriterion.set(finding.criterionId, row)
                }
                row.statuses.push(finding.status)
                if (finding.status === 'non_conforme') {
                    row.nonConformeDetails.push({
                        label:
                            pageLabelById.get(finding.pageId) ?? finding.pageId,
                        comment: finding.comment ?? '',
                    })
                }
            }

            const criterionRows = [...byCriterion.values()].sort(
                (a, b) => a.sortOrder - b.sortOrder,
            )

            const workbook = new ExcelJS.Workbook()
            const sheet = workbook.addWorksheet('Grille RGAA')
            sheet.columns = [
                { header: 'N° critère', key: 'criterion', width: 12 },
                { header: 'Thématique', key: 'theme', width: 28 },
                { header: 'Intitulé', key: 'title', width: 70 },
                { header: 'Statut global', key: 'status', width: 16 },
                { header: 'Pages non conformes', key: 'pages', width: 32 },
                { header: 'Détail des non-conformités', key: 'details', width: 60 },
            ]
            sheet.getRow(1).font = { bold: true }

            for (const row of criterionRows) {
                const globalStatus = aggregateCriterionStatus(row.statuses)
                const nonConformePages = row.nonConformeDetails
                    .map((detail) => detail.label)
                    .join(', ')
                const details = row.nonConformeDetails
                    .filter((detail) => detail.comment.trim().length > 0)
                    .map((detail) => `${detail.label} : ${detail.comment}`)
                    .join('\n')
                sheet.addRow({
                    criterion: row.criterionId,
                    theme: row.themeName,
                    title: row.title,
                    status: FINDING_STATUS_LABELS[globalStatus],
                    pages: nonConformePages,
                    details,
                })
            }

            const buffer = await workbook.xlsx.writeBuffer()
            const base64 = Buffer.from(buffer).toString('base64')
            const date = new Date().toISOString().slice(0, 10)
            const slug = audit.client.name
                .normalize('NFD')
                .replace(/[̀-ͯ]/g, '')
                .replace(/[^a-zA-Z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
            return {
                base64,
                filename: `Audit-RGAA-${slug || 'client'}-${date}.xlsx`,
            }
        }),

    // Membres du cabinet courant pour alimenter le sélecteur « Assigné à ».
    listMembers: protectedProcedure.query(({ ctx }) => {
        return ctx.db
            .select({
                userId: member.userId,
                name: user.name,
                email: user.email,
                role: member.role,
            })
            .from(member)
            .innerJoin(user, eq(member.userId, user.id))
            .where(eq(member.organizationId, ctx.organizationId))
            .orderBy(asc(user.name))
    }),

    create: protectedProcedure
        .input(createAuditInput)
        .mutation(async ({ ctx, input }) => {
            // Le client doit appartenir au cabinet courant.
            const client = await ctx.db.query.clients.findFirst({
                where: and(
                    eq(clients.id, input.clientId),
                    eq(clients.organizationId, ctx.organizationId),
                ),
                columns: { id: true },
            })
            if (!client) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Client introuvable.',
                })
            }

            // Tous les auditeurs assignés doivent être membres du cabinet — pas
            // d'assignation hors cabinet. On dédoublonne au cas où.
            const assigneeIds = [...new Set(input.assigneeIds)]
            await assertMembersInOrg(ctx.db, ctx.organizationId, assigneeIds)

            // Tout ou rien : l'audit, ses pages d'échantillon et un finding « pending »
            // par critère RGAA *et par page* sont créés dans une seule transaction. Si
            // une étape échoue — notamment un référentiel RGAA non initialisé — rien
            // n'est persisté (rollback complet).
            return ctx.db.transaction(async (tx) => {
                const [audit] = await tx
                    .insert(audits)
                    .values({
                        organizationId: ctx.organizationId,
                        clientId: input.clientId,
                        name: input.name,
                        siteUrl: input.siteUrl,
                        contactName: input.contactName || null,
                        contactEmail: input.contactEmail || null,
                    })
                    .returning()
                if (!audit) {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: "La création de l'audit a échoué.",
                    })
                }

                const insertedPages = await tx
                    .insert(auditPages)
                    .values(
                        input.pages.map((page, index) => ({
                            auditId: audit.id,
                            label: page.label,
                            url: page.url,
                            type: page.type,
                            sortOrder: index,
                        })),
                    )
                    .returning({ id: auditPages.id })

                const criteria = await tx
                    .select({ id: rgaaCriteria.id })
                    .from(rgaaCriteria)
                if (criteria.length === 0) {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message:
                            "Référentiel RGAA non initialisé : impossible de créer l'audit.",
                    })
                }

                // 106 critères × N pages de « pending » : la grille est travaillée
                // page par page.
                const findingRows = insertedPages.flatMap((page) =>
                    criteria.map((criterion) => ({
                        auditId: audit.id,
                        criterionId: criterion.id,
                        pageId: page.id,
                    })),
                )
                await tx.insert(auditFindings).values(findingRows)

                await tx
                    .insert(auditAssignees)
                    .values(buildAssigneeRows(audit.id, assigneeIds))

                return audit
            })
        }),

    // Remplace entièrement la liste des assignés d'un audit (supprime les lignes
    // existantes, recrée selon la nouvelle liste). Accessible à tout membre du
    // cabinet : les audits sont partagés au sein du cabinet, donc réassignables par
    // n'importe lequel de ses membres. Au moins un auditeur doit rester assigné.
    updateAssignees: protectedProcedure
        .input(updateAssigneesInput)
        .mutation(async ({ ctx, input }) => {
            await assertAuditInOrg(ctx.db, input.auditId, ctx.organizationId)

            const assigneeIds = [...new Set(input.assigneeIds)]
            await assertMembersInOrg(ctx.db, ctx.organizationId, assigneeIds)

            await ctx.db.transaction(async (tx) => {
                await tx
                    .delete(auditAssignees)
                    .where(eq(auditAssignees.auditId, input.auditId))
                await tx
                    .insert(auditAssignees)
                    .values(buildAssigneeRows(input.auditId, assigneeIds))
            })

            // Renvoie la liste fraîche et mise en forme pour que le client reflète
            // immédiatement le nouvel état.
            const assigneesByAudit = await getAssigneesByAudit(ctx.db, [
                input.auditId,
            ])
            return {
                auditId: input.auditId,
                assignees: assigneesByAudit.get(input.auditId) ?? [],
            }
        }),
})
