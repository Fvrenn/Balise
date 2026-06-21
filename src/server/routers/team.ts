import { and, asc, count, eq, sql } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { ownerProcedure, protectedProcedure, router } from '@/server/trpc'
import { auth } from '@/lib/auth'
import type { Database } from '@/db'
import { invitation, member, user } from '@/db/schema'

const teamRole = z.enum(['owner', 'auditor'])

const inviteInput = z.object({
    email: z.string().trim().email('Adresse email invalide.').max(200),
    role: teamRole,
})

// Nombre d'owners du cabinet — sert à protéger le dernier owner restant.
async function countOwners(
    db: Database,
    organizationId: string,
): Promise<number> {
    const [row] = await db
        .select({ total: count() })
        .from(member)
        .where(
            and(
                eq(member.organizationId, organizationId),
                eq(member.role, 'owner'),
            ),
        )
    return row?.total ?? 0
}

// Convertit une erreur Better Auth (APIError) en TRPCError lisible. Le message
// utile se trouve dans `body.message`.
function toInvitationError(error: unknown): TRPCError {
    if (error && typeof error === 'object') {
        const candidate = error as {
            body?: { message?: string }
            message?: string
        }
        const message = candidate.body?.message ?? candidate.message
        if (message) {
            return new TRPCError({ code: 'BAD_REQUEST', message })
        }
    }
    return new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: "L'envoi de l'invitation a échoué.",
    })
}

export const teamRouter = router({
    // Membres actifs du cabinet (rattachement existant), du plus ancien au plus
    // récent. Les invitations encore en attente sont, elles, exposées par
    // `listInvitations` et affichées à part — d'où un statut toujours « active »
    // ici.
    list: protectedProcedure.query(async ({ ctx }) => {
        const rows = await ctx.db
            .select({
                memberId: member.id,
                userId: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                role: member.role,
                joinedAt: member.createdAt,
            })
            .from(member)
            .innerJoin(user, eq(member.userId, user.id))
            .where(eq(member.organizationId, ctx.organizationId))
            .orderBy(asc(member.createdAt))

        return rows.map((row) => ({
            ...row,
            role: row.role as z.infer<typeof teamRole>,
            status: 'active' as const,
        }))
    }),

    // Invitations en attente du cabinet (ni acceptées, ni annulées, ni expirées
    // côté statut), les plus proches de l'expiration d'abord.
    listInvitations: protectedProcedure.query(({ ctx }) => {
        return ctx.db
            .select({
                id: invitation.id,
                email: invitation.email,
                role: invitation.role,
                expiresAt: invitation.expiresAt,
            })
            .from(invitation)
            .where(
                and(
                    eq(invitation.organizationId, ctx.organizationId),
                    eq(invitation.status, 'pending'),
                ),
            )
            .orderBy(asc(invitation.expiresAt))
    }),

    // Invite un email dans le cabinet via Better Auth (génération du token,
    // expiration et envoi de l'email gérés par le plugin organization).
    invite: ownerProcedure
        .input(inviteInput)
        .mutation(async ({ ctx, input }) => {
            const email = input.email.toLowerCase()

            // Empêche d'inviter quelqu'un qui est déjà membre (message clair plutôt
            // que l'erreur générique de Better Auth). Comparaison insensible à la
            // casse de l'email.
            const alreadyMember = await ctx.db
                .select({ id: member.id })
                .from(member)
                .innerJoin(user, eq(member.userId, user.id))
                .where(
                    and(
                        eq(member.organizationId, ctx.organizationId),
                        sql`lower(${user.email}) = ${email}`,
                    ),
                )
                .limit(1)
            if (alreadyMember.length > 0) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: 'Cette personne est déjà membre du cabinet.',
                })
            }

            try {
                await auth.api.createInvitation({
                    body: {
                        email,
                        role: input.role,
                        organizationId: ctx.organizationId,
                        // Rafraîchit l'invitation si l'email a déjà été invité,
                        // plutôt que d'échouer.
                        resend: true,
                    },
                    headers: ctx.headers,
                })
            } catch (error) {
                throw toInvitationError(error)
            }

            return { email }
        }),

    // Bascule le rôle d'un membre. Interdit de modifier son propre accès et de
    // rétrograder le dernier owner du cabinet.
    updateRole: ownerProcedure
        .input(z.object({ memberId: z.string().min(1), role: teamRole }))
        .mutation(async ({ ctx, input }) => {
            const target = await ctx.db.query.member.findFirst({
                where: and(
                    eq(member.id, input.memberId),
                    eq(member.organizationId, ctx.organizationId),
                ),
                columns: { id: true, userId: true, role: true },
            })
            if (!target) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Membre introuvable.',
                })
            }

            if (target.userId === ctx.user.id) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Vous ne pouvez pas modifier votre propre accès.',
                })
            }

            // Rétrograder le dernier owner laisserait le cabinet sans administrateur.
            if (target.role === 'owner' && input.role !== 'owner') {
                const owners = await countOwners(ctx.db, ctx.organizationId)
                if (owners <= 1) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message:
                            'Impossible de rétrograder le dernier owner du cabinet.',
                    })
                }
            }

            const [updated] = await ctx.db
                .update(member)
                .set({ role: input.role })
                .where(eq(member.id, target.id))
                .returning({ memberId: member.id, role: member.role })
            return updated
        }),

    // Retire un membre du cabinet. Interdit de se retirer soi-même et de retirer
    // le dernier owner. Ne supprime que le rattachement : le compte et ses audits
    // assignés restent intacts.
    removeMember: ownerProcedure
        .input(z.object({ memberId: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const target = await ctx.db.query.member.findFirst({
                where: and(
                    eq(member.id, input.memberId),
                    eq(member.organizationId, ctx.organizationId),
                ),
                columns: { id: true, userId: true, role: true },
            })
            if (!target) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Membre introuvable.',
                })
            }

            if (target.userId === ctx.user.id) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Vous ne pouvez pas modifier votre propre accès.',
                })
            }

            if (target.role === 'owner') {
                const owners = await countOwners(ctx.db, ctx.organizationId)
                if (owners <= 1) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message:
                            'Impossible de retirer le dernier owner du cabinet.',
                    })
                }
            }

            await ctx.db.delete(member).where(eq(member.id, target.id))
            return { memberId: target.id }
        }),

    // Annule une invitation encore en attente du cabinet courant.
    cancelInvitation: ownerProcedure
        .input(z.object({ invitationId: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const [canceled] = await ctx.db
                .update(invitation)
                .set({ status: 'canceled' })
                .where(
                    and(
                        eq(invitation.id, input.invitationId),
                        eq(invitation.organizationId, ctx.organizationId),
                        eq(invitation.status, 'pending'),
                    ),
                )
                .returning({ id: invitation.id })
            if (!canceled) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Invitation introuvable ou déjà traitée.',
                })
            }
            return { invitationId: canceled.id }
        }),
})
