import { and, desc, eq, sql } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { protectedProcedure, router } from '@/server/trpc'
import { audits, clients } from '@/db/schema'

const createClientInput = z.object({
    name: z.string().trim().min(1, 'Le nom est obligatoire.').max(200),
    website: z.string().trim().max(500).optional(),
    contact: z.string().trim().max(500).optional(),
})

const updateClientInput = createClientInput.extend({
    id: z.string().min(1),
})

export const clientsRouter = router({
    // Tous les clients du cabinet, du plus récent au plus ancien, avec le nombre
    // d'audits et la date du dernier audit (agrégés en une requête).
    list: protectedProcedure.query(({ ctx }) => {
        return ctx.db
            .select({
                id: clients.id,
                name: clients.name,
                website: clients.website,
                contact: clients.contact,
                createdAt: clients.createdAt,
                updatedAt: clients.updatedAt,
                auditCount: sql<number>`count(${audits.id})::int`,
                lastAuditAt: sql<Date | null>`max(${audits.createdAt})`,
            })
            .from(clients)
            .leftJoin(audits, eq(audits.clientId, clients.id))
            .where(eq(clients.organizationId, ctx.organizationId))
            .groupBy(clients.id)
            .orderBy(desc(clients.createdAt))
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
                    website: input.website || null,
                    contact: input.contact || null,
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
                    website: input.website || null,
                    contact: input.contact || null,
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
