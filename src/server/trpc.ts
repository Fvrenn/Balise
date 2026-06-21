import { initTRPC, TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import superjson from 'superjson'

import { member } from '@/db/schema'
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

// Exige une session valide mais PAS de rattachement à un cabinet : pour les
// procédures que l'utilisateur appelle justement avant d'avoir une organisation,
// typiquement la création de son cabinet à l'onboarding (un Owner créé par l'Admin
// n'a encore aucune appartenance). Voir CLAUDE.md « Modèle d'accès ».
const enforceAuth = t.middleware(({ ctx, next }) => {
    if (!ctx.user || !ctx.session) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Vous devez être connecté.',
        })
    }
    return next({
        ctx: {
            user: ctx.user,
            session: ctx.session,
        },
    })
})

export const authedProcedure = t.procedure.use(enforceAuth)

// Restreint aux owners du cabinet courant : invitations, gestion des membres et
// paramètres du cabinet s'appuient dessus plutôt que de répéter la vérification.
// S'enchaîne après protectedProcedure, donc `user` et `organizationId` sont déjà
// garantis non-nuls.
export const ownerProcedure = protectedProcedure.use(async ({ ctx, next }) => {
    const membership = await ctx.db.query.member.findFirst({
        where: and(
            eq(member.userId, ctx.user.id),
            eq(member.organizationId, ctx.organizationId),
        ),
        columns: { role: true },
    })
    if (membership?.role !== 'owner') {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Réservé aux administrateurs du cabinet.',
        })
    }
    return next()
})
