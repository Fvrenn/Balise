import { and, asc, eq, inArray } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { protectedProcedure } from '@/server/trpc'
import { auditFindings, findingStatus, rgaaCriteria } from '@/db/schema'
import { assertAuditInOrg, assertFindingInOrg } from '@/server/audit-guards'
import { recomputeComplianceRate } from '@/server/audit-compliance'

// Procédures de la grille de critères : lecture et édition des findings d'un
// audit (un finding = un critère × une page). Exposées sous `audits.*` — le
// router audits les fusionne par spread, l'API tRPC reste inchangée.

export const auditFindingProcedures = {
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
                    source: auditFindings.source,
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
                    // Toute édition manuelle reprend la main sur un résultat de
                    // scan : le badge « Scanner » disparaît.
                    source: 'manual',
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
                    source: 'manual',
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
                    source: 'manual',
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
}
