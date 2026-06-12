import { and, desc, eq, sql } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { protectedProcedure, router } from '@/server/trpc'
import { audits, clients } from '@/db/schema'

const createClientInput = z.object({
    name: z.string().trim().min(1, 'Le nom est obligatoire.').max(200),
    // Description libre, optionnelle — ni URL ni contact ici (le contact est porté
    // par l'audit, qui cible un site précis).
    note: z.string().trim().max(2000).optional(),
})

const updateClientInput = createClientInput.extend({
    id: z.string().min(1),
})

export const clientsRouter = router({
    // Tous les clients du cabinet, du plus récent au plus ancien, avec le nombre
    // d'audits, le nombre de sites distincts audités et la date du dernier audit
    // (agrégés en une seule requête).
    list: protectedProcedure.query(({ ctx }) => {
        return ctx.db
            .select({
                id: clients.id,
                name: clients.name,
                createdAt: clients.createdAt,
                auditCount: sql<number>`count(${audits.id})::int`,
                siteCount: sql<number>`count(distinct ${audits.siteUrl})::int`,
                lastAuditAt: sql<Date | null>`max(${audits.createdAt})`,
            })
            .from(clients)
            .leftJoin(audits, eq(audits.clientId, clients.id))
            .where(eq(clients.organizationId, ctx.organizationId))
            .groupBy(clients.id)
            .orderBy(desc(clients.createdAt))
    }),

    // Chiffres clés affichés en tête de la page Clients : nombre de clients et
    // répartition des audits par statut, le tout limité au cabinet courant.
    stats: protectedProcedure.query(async ({ ctx }) => {
        const [clientStats] = await ctx.db
            .select({ count: sql<number>`count(*)::int` })
            .from(clients)
            .where(eq(clients.organizationId, ctx.organizationId))

        const auditsByStatus = await ctx.db
            .select({
                status: audits.status,
                count: sql<number>`count(*)::int`,
            })
            .from(audits)
            .where(eq(audits.organizationId, ctx.organizationId))
            .groupBy(audits.status)

        let auditsCompleted = 0
        let auditsInProgress = 0
        for (const row of auditsByStatus) {
            if (row.status === 'completed') auditsCompleted = row.count
            else if (row.status === 'in_progress') auditsInProgress = row.count
        }

        return {
            clientCount: clientStats?.count ?? 0,
            auditsCompleted,
            auditsInProgress,
        }
    }),

    getById: protectedProcedure
        .input(z.object({ id: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
            const client = await ctx.db.query.clients.findFirst({
                where: and(
                    eq(clients.id, input.id),
                    eq(clients.organizationId, ctx.organizationId),
                ),
            })
            if (!client) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Client introuvable.',
                })
            }
            return client
        }),

    create: protectedProcedure
        .input(createClientInput)
        .mutation(async ({ ctx, input }) => {
            const [created] = await ctx.db
                .insert(clients)
                .values({
                    organizationId: ctx.organizationId,
                    name: input.name,
                    note: input.note || null,
                })
                .returning()
            if (!created) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'La création du client a échoué.',
                })
            }
            return created
        }),

    update: protectedProcedure
        .input(updateClientInput)
        .mutation(async ({ ctx, input }) => {
            // Le filtre sur organizationId fait double emploi avec l'id : un client
            // d'un autre cabinet ne matche aucune ligne → NOT_FOUND, jamais de fuite.
            const [updated] = await ctx.db
                .update(clients)
                .set({
                    name: input.name,
                    note: input.note || null,
                    updatedAt: new Date(),
                })
                .where(
                    and(
                        eq(clients.id, input.id),
                        eq(clients.organizationId, ctx.organizationId),
                    ),
                )
                .returning()
            if (!updated) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Client introuvable.',
                })
            }
            return updated
        }),
})
