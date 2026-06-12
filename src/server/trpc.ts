import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'

import type { createTRPCContext } from '@/server/context'

type Context = Awaited<ReturnType<typeof createTRPCContext>>

// superjson sérialise correctement les Date (createdAt, expiresAt…) de bout en bout.
const t = initTRPC.context<Context>().create({
    transformer: superjson,
})

export const router = t.router
export const createCallerFactory = t.createCallerFactory

// Accessible sans authentification.
export const publicProcedure = t.procedure

// Garantit que l'appelant est connecté ET rattaché à une organisation, puis
// injecte `user`, `session` et `organizationId` non-nuls dans le contexte. Toutes
// les procédures protégées filtrent ensuite sur cet organizationId : c'est la
// barrière d'isolation multi-tenant, jamais de données d'un autre cabinet.
const enforceOrgMembership = t.middleware(({ ctx, next }) => {
    if (!ctx.user || !ctx.session) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Vous devez être connecté.',
        })
    }
    if (!ctx.organizationId) {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: "Vous n'appartenez à aucune organisation.",
        })
    }
    return next({
        ctx: {
            user: ctx.user,
            session: ctx.session,
            organizationId: ctx.organizationId,
        },
    })
})

export const protectedProcedure = t.procedure.use(enforceOrgMembership)
