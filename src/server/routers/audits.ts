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
    computeComplianceRate,
    emptyStatusCounts,
    sumStatusCounts,
    type FindingStatus,
    type StatusCounts,
    type ThemeProgress,
} from '@/lib/rgaa'

const samplePageInput = z.object({
    label: z.string().trim().min(1, 'Le libellé est obligatoire.').max(200),
    url: z.string().trim().min(1, "L'URL de la page est obligatoire.").max(2000),
    type: z.enum(pageType.enumValues),
})

// Agrège les findings d'un audit par thématique, dans l'ordre RGAA (theme 1 → 13).
async function getThemeProgress(
    db: Database,
    auditId: string,
): Promise<ThemeProgress[]> {
    const rows = await db
        .select({
            themeId: rgaaCriteria.themeId,
            themeName: rgaaCriteria.themeName,
            status: auditFindings.status,
        })
        .from(auditFindings)
        .innerJoin(rgaaCriteria, eq(auditFindings.criterionId, rgaaCriteria.id))
        .where(eq(auditFindings.auditId, auditId))

    const byTheme = new Map<number, ThemeProgress>()
    for (const row of rows) {
        let theme = byTheme.get(row.themeId)
        if (!theme) {
            theme = {
                themeId: row.themeId,
                themeName: row.themeName,
                total: 0,
                ...emptyStatusCounts(),
            }
            byTheme.set(row.themeId, theme)
        }
        theme.total += 1
        theme[row.status] += 1
    }

    return [...byTheme.values()].sort((a, b) => a.themeId - b.themeId)
}

// Recalcule le taux de conformité mis en cache sur l'audit à partir de l'état
// courant de ses findings, puis le persiste. Appelé après chaque modification.
async function recomputeComplianceRate(
    db: Database,
    auditId: string,
): Promise<number | null> {
    const rows = await db
        .select({ status: auditFindings.status, total: count() })
        .from(auditFindings)
        .where(eq(auditFindings.auditId, auditId))
        .groupBy(auditFindings.status)

    const counts: StatusCounts = emptyStatusCounts()
    for (const row of rows) counts[row.status] = row.total

    const complianceRate = computeComplianceRate(counts)
    await db
        .update(audits)
        .set({ complianceRate, updatedAt: new Date() })
        .where(eq(audits.id, auditId))

    return complianceRate
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
    listMine: protectedProcedure.query(({ ctx }) => {
        // « Mes audits » = ceux dont l'utilisateur courant est l'un des assignés.
        const myAuditIds = ctx.db
            .select({ auditId: auditAssignees.auditId })
            .from(auditAssignees)
            .where(eq(auditAssignees.userId, ctx.user.id))

        return ctx.db
            .select({
                id: audits.id,
                name: audits.name,
                siteUrl: audits.siteUrl,
                status: audits.status,
                complianceRate: audits.complianceRate,
                updatedAt: audits.updatedAt,
                clientName: clients.name,
                treatedCount: sql<number>`coalesce(sum(case when ${auditFindings.status} <> 'pending' then 1 else 0 end), 0)::int`,
            })
            .from(audits)
            .innerJoin(clients, eq(audits.clientId, clients.id))
            .leftJoin(auditFindings, eq(auditFindings.auditId, audits.id))
            .where(
                and(
                    eq(audits.organizationId, ctx.organizationId),
                    inArray(audits.id, myAuditIds),
                ),
            )
            .groupBy(audits.id, clients.name)
            .orderBy(desc(audits.updatedAt))
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
                with: {
                    pages: {
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
            // Agrégat global de l'audit (somme des thématiques) : compteurs par
            // statut + total des critères. Calculé côté serveur pour ne pas dupliquer
            // la logique d'agrégation dans chaque consommateur.
            const summary = {
                ...sumStatusCounts(themeProgress),
                total: themeProgress.reduce((sum, theme) => sum + theme.total, 0),
            }
            const assignees: AssigneeSummary[] = audit.assignees.map(
                (assignee) => ({
                    userId: assignee.user.id,
                    name: assignee.user.name,
                    email: assignee.user.email,
                }),
            )
            return { ...audit, assignees, themeProgress, summary }
        }),

    // Les 106 findings de l'audit avec leur critère RGAA, triés selon l'ordre
    // officiel du référentiel. Base de travail de la grille des critères.
    getFindings: protectedProcedure
        .input(z.object({ auditId: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
            await assertAuditInOrg(ctx.db, input.auditId, ctx.organizationId)

            return ctx.db
                .select({
                    id: auditFindings.id,
                    status: auditFindings.status,
                    comment: auditFindings.comment,
                    concernedPageIds: auditFindings.concernedPageIds,
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

    // Met à jour un finding (statut, commentaire, pages concernées) puis recalcule
    // le taux de conformité de l'audit. Cœur de la sauvegarde automatique.
    updateFinding: protectedProcedure
        .input(
            z.object({
                findingId: z.string().min(1),
                status: z.enum(findingStatus.enumValues),
                comment: z.string().max(5000).nullish(),
                concernedPageIds: z.array(z.string().min(1)).nullish(),
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
                    concernedPageIds: input.concernedPageIds ?? null,
                    updatedBy: ctx.user.id,
                    updatedAt: new Date(),
                })
                .where(eq(auditFindings.id, input.findingId))
                .returning()

            const complianceRate = await recomputeComplianceRate(ctx.db, auditId)
            return { finding, complianceRate }
        }),

    // Passe toute une thématique en « non applicable » en un geste, puis recalcule
    // le taux de conformité.
    markThemeNA: protectedProcedure
        .input(
            z.object({
                auditId: z.string().min(1),
                themeId: z.number().int().min(1).max(13),
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

            await ctx.db
                .update(auditFindings)
                .set({
                    status: 'non_applicable',
                    updatedBy: ctx.user.id,
                    updatedAt: new Date(),
                })
                .where(
                    and(
                        eq(auditFindings.auditId, input.auditId),
                        inArray(auditFindings.criterionId, criterionIds),
                    ),
                )

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
                    status: auditFindings.status,
                    comment: auditFindings.comment,
                    concernedPageIds: auditFindings.concernedPageIds,
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

            const workbook = new ExcelJS.Workbook()
            const sheet = workbook.addWorksheet('Grille RGAA')
            sheet.columns = [
                { header: 'N° critère', key: 'criterion', width: 12 },
                { header: 'Thématique', key: 'theme', width: 28 },
                { header: 'Intitulé', key: 'title', width: 70 },
                { header: 'Statut', key: 'status', width: 16 },
                { header: 'Commentaire', key: 'comment', width: 50 },
                { header: 'Pages concernées', key: 'pages', width: 40 },
            ]
            sheet.getRow(1).font = { bold: true }

            for (const finding of findings) {
                const concernedLabels = (finding.concernedPageIds ?? [])
                    .map((pageId) => pageLabelById.get(pageId))
                    .filter((label): label is string => Boolean(label))
                sheet.addRow({
                    criterion: finding.criterionId,
                    theme: finding.themeName,
                    title: finding.title,
                    status: FINDING_STATUS_LABELS[finding.status],
                    comment: finding.comment ?? '',
                    pages: concernedLabels.join(', '),
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
            // par critère RGAA sont créés dans une seule transaction. Si une étape
            // échoue — notamment un référentiel RGAA non initialisé — rien n'est
            // persisté (rollback complet).
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

                await tx.insert(auditPages).values(
                    input.pages.map((page, index) => ({
                        auditId: audit.id,
                        label: page.label,
                        url: page.url,
                        type: page.type,
                        sortOrder: index,
                    })),
                )

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

                await tx.insert(auditFindings).values(
                    criteria.map((criterion) => ({
                        auditId: audit.id,
                        criterionId: criterion.id,
                    })),
                )

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
