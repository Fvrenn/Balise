import { and, eq } from 'drizzle-orm'

import { protectedProcedure, router } from '@/server/trpc'
import { member } from '@/db/schema'

type OrganizationRole = 'owner' | 'auditor'

export const memberRouter = router({
    // L'utilisateur connecté et son rôle dans le cabinet actif. Sert au layout
    // pour afficher le footer et conditionner la section réservée aux owners.
    current: protectedProcedure.query(async ({ ctx }) => {
        const membership = await ctx.db.query.member.findFirst({
            where: and(
                eq(member.userId, ctx.user.id),
                eq(member.organizationId, ctx.organizationId),
            ),
            columns: { role: true },
        })

        return {
            id: ctx.user.id,
            name: ctx.user.name,
            email: ctx.user.email,
            image: ctx.user.image,
            // Défaut prudent : auditor (rôle le moins privilégié) si aucun rôle
            // explicite n'est trouvé.
            role: (membership?.role ?? 'auditor') as OrganizationRole,
        }
    }),
})
