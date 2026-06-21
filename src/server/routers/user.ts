import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

import { auth } from '@/lib/auth'
import { protectedProcedure, router } from '@/server/trpc'
import { member } from '@/db/schema'

type OrganizationRole = 'owner' | 'auditor'

export const userRouter = router({
    // Profil de l'utilisateur connecté pour la page /settings/profile : identité
    // (name/email du compte) et rattachement au cabinet courant (rôle, ancienneté).
    getProfile: protectedProcedure.query(async ({ ctx }) => {
        const membership = await ctx.db.query.member.findFirst({
            where: and(
                eq(member.userId, ctx.user.id),
                eq(member.organizationId, ctx.organizationId),
            ),
            columns: { role: true, createdAt: true },
        })

        return {
            name: ctx.user.name,
            email: ctx.user.email,
            role: (membership?.role ?? 'auditor') as OrganizationRole,
            memberSince: membership?.createdAt ?? null,
        }
    }),

    // Met à jour le nom affiché. L'email n'est pas modifiable ici : le changer
    // touche à la vérification d'email, hors périmètre MVP. On délègue à
    // auth.api.updateUser plutôt qu'un UPDATE Drizzle direct pour rester aligné
    // sur la logique Better Auth (updatedAt, hooks, invalidation de session).
    updateProfile: protectedProcedure
        .input(
            z.object({
                name: z
                    .string()
                    .trim()
                    .min(1, 'Le nom est obligatoire.')
                    .max(200),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            await auth.api.updateUser({
                body: { name: input.name },
                headers: ctx.headers,
            })
            return { name: input.name }
        }),
})
