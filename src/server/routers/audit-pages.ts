import { and, asc, eq, inArray, max, sql } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { protectedProcedure } from '@/server/trpc'
import {
    auditFindings,
    auditPages,
    audits,
    pageType,
    rgaaCriteria,
} from '@/db/schema'
import type { Database } from '@/db'
import { assertAuditInOrg } from '@/server/audit-guards'
import { recomputeComplianceRate } from '@/server/audit-compliance'
import {
    detectSample,
    SiteUnreachableError,
    type SampleDetection,
} from '@/server/sample-detection'

// Gestion de l'échantillon d'un audit après sa création : ajouter, modifier ou
// retirer une page. Chaque page porte ses propres 106 findings — les créer et
// les supprimer relève donc de la même transaction que la page elle-même.
// Fusionné dans le router `audits.*` (cf. audits.ts).

const normalizeUrlField = (v: string) =>
    v && !/^https?:\/\//i.test(v) ? `https://${v}` : v

const pageLabel = z
    .string()
    .trim()
    .min(1, 'Le libellé est obligatoire.')
    .max(200)

const pageUrl = z
    .string()
    .trim()
    .min(1, "L'URL de la page est obligatoire.")
    .max(2000)
    .transform(normalizeUrlField)

// Garantit qu'une page appartient à un audit du cabinet courant. Retourne
// l'auditId, ou lève NOT_FOUND (pas de fuite inter-cabinets).
async function assertPageInOrg(
    db: Database,
    pageId: string,
    organizationId: string,
): Promise<string> {
    const [row] = await db
        .select({ auditId: auditPages.auditId })
        .from(auditPages)
        .innerJoin(audits, eq(auditPages.auditId, audits.id))
        .where(
            and(
                eq(auditPages.id, pageId),
                eq(audits.organizationId, organizationId),
            ),
        )
        .limit(1)
    if (!row) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Page introuvable.' })
    }
    return row.auditId
}

// La détection est un appel réseau vers un site tiers : ses échecs prévisibles
// (site injoignable, URL privée) sont des messages pour l'auditrice, pas des 500.
async function runDetection(input: {
    siteUrl: string
    excludeUrls?: string[]
}): Promise<SampleDetection> {
    try {
        return await detectSample(input)
    } catch (error) {
        if (error instanceof SiteUnreachableError) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: error.message })
        }
        throw error
    }
}

export const auditPageProcedures = {
    // Étape 2 de la création d'audit : proposer un échantillon à partir de la
    // seule URL racine, avant que l'audit n'existe en base.
    detectSample: protectedProcedure
        .input(z.object({ siteUrl: pageUrl }))
        .mutation(({ input }) => runDetection({ siteUrl: input.siteUrl })),

    // Relance depuis l'écran d'échantillon : mêmes règles, mais les pages déjà
    // en place ne sont pas reproposées.
    detectMissingPages: protectedProcedure
        .input(z.object({ auditId: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            await assertAuditInOrg(ctx.db, input.auditId, ctx.organizationId)

            const [audit] = await ctx.db
                .select({ siteUrl: audits.siteUrl })
                .from(audits)
                .where(eq(audits.id, input.auditId))
                .limit(1)
            if (!audit) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Audit introuvable.',
                })
            }

            const existing = await ctx.db
                .select({ url: auditPages.url })
                .from(auditPages)
                .where(eq(auditPages.auditId, input.auditId))

            return runDetection({
                siteUrl: audit.siteUrl,
                excludeUrls: existing.map((page) => page.url),
            })
        }),

    // Échantillon complet avec, pour chaque page, le nombre de critères déjà
    // renseignés : c'est ce qui permet d'avertir avant une suppression.
    listPages: protectedProcedure
        .input(z.object({ auditId: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
            await assertAuditInOrg(ctx.db, input.auditId, ctx.organizationId)

            const pages = await ctx.db
                .select({
                    id: auditPages.id,
                    label: auditPages.label,
                    url: auditPages.url,
                    type: auditPages.type,
                    sortOrder: auditPages.sortOrder,
                    filledCount: sql<number>`count(*) filter (where ${auditFindings.status} <> 'pending')`
                        .mapWith(Number)
                        .as('filled_count'),
                })
                .from(auditPages)
                .leftJoin(
                    auditFindings,
                    eq(auditFindings.pageId, auditPages.id),
                )
                .where(eq(auditPages.auditId, input.auditId))
                .groupBy(auditPages.id)
                .orderBy(asc(auditPages.sortOrder))

            return pages
        }),

    // Ajout groupé : une page saisie à la main comme les pages retenues après une
    // détection passent par ici, avec la même création de grille.
    addPages: protectedProcedure
        .input(
            z.object({
                auditId: z.string().min(1),
                pages: z
                    .array(
                        z.object({
                            label: pageLabel,
                            url: pageUrl,
                            type: z.enum(pageType.enumValues),
                        }),
                    )
                    .min(1, 'Aucune page à ajouter.'),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            await assertAuditInOrg(ctx.db, input.auditId, ctx.organizationId)

            const created = await ctx.db.transaction(async (tx) => {
                const [{ highest } = { highest: null }] = await tx
                    .select({ highest: max(auditPages.sortOrder) })
                    .from(auditPages)
                    .where(eq(auditPages.auditId, input.auditId))

                const insertedPages = await tx
                    .insert(auditPages)
                    .values(
                        input.pages.map((page, index) => ({
                            auditId: input.auditId,
                            label: page.label,
                            url: page.url,
                            type: page.type,
                            sortOrder: (highest ?? -1) + 1 + index,
                        })),
                    )
                    .returning({ id: auditPages.id })

                // Chaque nouvelle page démarre avec sa grille complète en
                // « pending », comme celles créées avec l'audit.
                const criteria = await tx
                    .select({ id: rgaaCriteria.id })
                    .from(rgaaCriteria)
                await tx.insert(auditFindings).values(
                    insertedPages.flatMap((page) =>
                        criteria.map((criterion) => ({
                            auditId: input.auditId,
                            criterionId: criterion.id,
                            pageId: page.id,
                        })),
                    ),
                )

                return insertedPages
            })

            // Une page de plus, ce sont 106 critères « pending » de plus : le taux
            // de conformité de l'audit change.
            const complianceRate = await recomputeComplianceRate(
                ctx.db,
                input.auditId,
            )
            return { addedCount: created.length, complianceRate }
        }),

    updatePage: protectedProcedure
        .input(
            z.object({
                pageId: z.string().min(1),
                label: pageLabel,
                url: pageUrl,
                type: z.enum(pageType.enumValues),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            await assertPageInOrg(ctx.db, input.pageId, ctx.organizationId)

            const [page] = await ctx.db
                .update(auditPages)
                .set({
                    label: input.label,
                    url: input.url,
                    type: input.type,
                })
                .where(eq(auditPages.id, input.pageId))
                .returning()

            return { page }
        }),

    // Supprime une page et, en cascade, ses 106 findings et leurs occurrences.
    // Le travail déjà saisi sur cette page est donc perdu : l'appelant confirme.
    deletePage: protectedProcedure
        .input(z.object({ pageId: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const auditId = await assertPageInOrg(
                ctx.db,
                input.pageId,
                ctx.organizationId,
            )

            const remaining = await ctx.db
                .select({ id: auditPages.id })
                .from(auditPages)
                .where(eq(auditPages.auditId, auditId))
            if (remaining.length <= 1) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message:
                        "Un audit doit conserver au moins une page. Ajoutez-en une autre avant de supprimer celle-ci.",
                })
            }

            await ctx.db.delete(auditPages).where(eq(auditPages.id, input.pageId))

            const complianceRate = await recomputeComplianceRate(ctx.db, auditId)
            return { auditId, complianceRate }
        }),

    // Réordonne l'échantillon : l'ordre des pages est celui des onglets de la
    // grille, l'auditrice doit pouvoir le maîtriser.
    reorderPages: protectedProcedure
        .input(
            z.object({
                auditId: z.string().min(1),
                pageIds: z.array(z.string().min(1)).min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            await assertAuditInOrg(ctx.db, input.auditId, ctx.organizationId)

            const pages = await ctx.db
                .select({ id: auditPages.id })
                .from(auditPages)
                .where(
                    and(
                        eq(auditPages.auditId, input.auditId),
                        inArray(auditPages.id, input.pageIds),
                    ),
                )
            // La liste envoyée doit décrire l'échantillon en entier : un ordre
            // partiel laisserait des pages avec un sortOrder incohérent.
            if (pages.length !== input.pageIds.length) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: "L'ordre envoyé ne correspond pas à l'échantillon.",
                })
            }

            await ctx.db.transaction(async (tx) => {
                for (const [index, pageId] of input.pageIds.entries()) {
                    await tx
                        .update(auditPages)
                        .set({ sortOrder: index })
                        .where(eq(auditPages.id, pageId))
                }
            })

            return { auditId: input.auditId }
        }),
}
