import { and, asc, count, desc, eq, inArray } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { protectedProcedure, router } from '@/server/trpc'
import {
    auditAssignees,
    auditExports,
    auditFindings,
    auditPages,
    audits,
    auditStatus,
    clients,
    member,
    pageType,
    rgaaCriteria,
    user,
} from '@/db/schema'
import {
    assertMembersInOrg,
    buildAssigneeRows,
    getAssigneesByAudit,
} from '@/server/assignees'
import { assertAuditInOrg } from '@/server/audit-guards'
import {
    getThemeProgress,
    getTreatedCountByAudit,
} from '@/server/audit-compliance'
import { buildAuditExcel } from '@/server/audit-excel'
import { uploadFile } from '@/lib/storage'
import { loadOccurrences } from '@/server/audit-occurrences'
import { auditFindingProcedures } from '@/server/routers/audit-findings'
import { auditPageProcedures } from '@/server/routers/audit-pages'

// Router du cycle de vie des audits : listes, création, statut, assignés,
// livrable Excel. Les procédures d'édition de la grille (findings) et de
// l'échantillon (pages) vivent dans audit-findings.ts et audit-pages.ts, et sont
// fusionnées ici — l'API exposée reste `audits.*`.

const XLSX_MIME =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

const normalizeUrlField = (v: string) =>
    v && !/^https?:\/\//i.test(v) ? `https://${v}` : v

const samplePageInput = z.object({
    label: z.string().trim().min(1, 'Le libellé est obligatoire.').max(200),
    url: z
        .string()
        .trim()
        .min(1, "L'URL de la page est obligatoire.")
        .max(2000)
        .transform(normalizeUrlField),
    type: z.enum(pageType.enumValues),
})

const createAuditInput = z.object({
    clientId: z.string().min(1),
    name: z.string().trim().min(1, "Le nom de l'audit est obligatoire.").max(200),
    siteUrl: z
        .string()
        .trim()
        .min(1, "L'URL du site est obligatoire.")
        .max(2000)
        .transform(normalizeUrlField),
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
    ...auditFindingProcedures,
    ...auditPageProcedures,

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
            ctx.organizationId,
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
            const assigneesByAudit = await getAssigneesByAudit(
                ctx.db,
                [audit.id],
                ctx.organizationId,
            )
            const assignees = assigneesByAudit.get(audit.id) ?? []
            return { ...audit, assignees, themeProgress }
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
                    id: auditFindings.id,
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

            const occurrencesByFinding = await loadOccurrences(
                ctx.db,
                input.auditId,
            )

            const workbook = await buildAuditExcel({
                clientName: audit.client.name,
                findings: findings.map((finding) => ({
                    ...finding,
                    occurrences: occurrencesByFinding.get(finding.id) ?? [],
                })),
                pageLabelById: new Map(
                    audit.pages.map((page) => [page.id, page.label]),
                ),
            })

            // Le livrable est archivé tel qu'il a été transmis : la grille
            // continue d'évoluer, le fichier daté ne bouge plus.
            const buffer = Buffer.from(workbook.base64, 'base64')
            const [archived] = await ctx.db
                .insert(auditExports)
                .values({
                    auditId: input.auditId,
                    filename: workbook.filename,
                    storageKey: '',
                    fileSize: buffer.byteLength,
                    generatedBy: ctx.user.id,
                })
                .returning({ id: auditExports.id })
            if (!archived) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: "L'archivage de l'export a échoué.",
                })
            }

            // La clé porte l'id de la ligne : le fichier n'est atteignable qu'à
            // travers la route authentifiée qui vérifie le cabinet.
            const storageKey = `audit-exports/${input.auditId}/${archived.id}.xlsx`
            await uploadFile(storageKey, buffer, XLSX_MIME)
            await ctx.db
                .update(auditExports)
                .set({ storageKey })
                .where(eq(auditExports.id, archived.id))

            return workbook
        }),

    // Historique des livrables générés, du plus récent au plus ancien.
    listExports: protectedProcedure
        .input(z.object({ auditId: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
            await assertAuditInOrg(ctx.db, input.auditId, ctx.organizationId)

            return ctx.db
                .select({
                    id: auditExports.id,
                    filename: auditExports.filename,
                    fileSize: auditExports.fileSize,
                    generatedAt: auditExports.generatedAt,
                    generatedByName: user.name,
                })
                .from(auditExports)
                .leftJoin(user, eq(auditExports.generatedBy, user.id))
                .where(eq(auditExports.auditId, input.auditId))
                .orderBy(desc(auditExports.generatedAt))
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
            const assigneesByAudit = await getAssigneesByAudit(
                ctx.db,
                [input.auditId],
                ctx.organizationId,
            )
            return {
                auditId: input.auditId,
                assignees: assigneesByAudit.get(input.auditId) ?? [],
            }
        }),
})
