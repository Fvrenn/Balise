import { asc, count, desc, eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { adminProcedure, router } from '@/server/trpc'
import { auth } from '@/lib/auth'
import { member, organization, user } from '@/db/schema'

export const adminRouter = router({
    // Cabinets de la plateforme avec leur nombre de membres, du plus récent au plus
    // ancien. Lecture seule : l'Admin observe, il n'administre pas les cabinets.
    listCabinets: adminProcedure.query(({ ctx }) => {
        return ctx.db
            .select({
                id: organization.id,
                name: organization.name,
                createdAt: organization.createdAt,
                memberCount: count(member.id),
            })
            .from(organization)
            .leftJoin(member, eq(member.organizationId, organization.id))
            .groupBy(organization.id)
            .orderBy(desc(organization.createdAt))
    }),

    // Crée le compte d'un Owner (isAdmin false, sans cabinet) puis lui envoie un
    // email pour qu'il définisse son mot de passe. Même résultat que `pnpm
    // create:owner` : à sa première connexion, l'Owner sera redirigé vers
    // /onboarding/cabinet pour créer son cabinet (cf. CLAUDE.md « Modèle d'accès »).
    //
    // On crée l'utilisateur via l'adaptateur interne de Better Auth, pas via
    // auth.api.signUpEmail : ce dernier ouvre une session pour le nouveau compte et,
    // par le plugin nextCookies, écraserait le cookie de session de l'Admin (qui se
    // retrouverait connecté en tant que l'Owner). L'adaptateur interne n'écrit qu'en
    // base, sans toucher à la session courante. On ne crée pas de compte credential
    // ici : resetPassword le créera avec le mot de passe choisi par l'Owner.
    createOwner: adminProcedure
        .input(
            z.object({
                email: z
                    .string()
                    .trim()
                    .email('Adresse email invalide.')
                    .max(200),
                name: z.string().trim().min(1, 'Le nom est obligatoire.').max(200),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const email = input.email.toLowerCase()

            const existing = await ctx.db.query.user.findFirst({
                where: eq(user.email, email),
                columns: { id: true },
            })
            if (existing) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: 'Un compte existe déjà pour cet email.',
                })
            }

            try {
                const authContext = await auth.$context
                await authContext.internalAdapter.createUser({
                    email,
                    name: input.name,
                    emailVerified: false,
                })
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'La création du compte Owner a échoué.',
                    cause: error,
                })
            }

            // Envoie l'email « Définissez votre mot de passe » via le même flux que
            // /forgot-password. redirectTo pointe vers la page publique de définition,
            // où Better Auth redirige avec le token validé en query (?token=…).
            // Appel serveur sans requête : le contrôle d'origine est ignoré.
            try {
                await auth.api.requestPasswordReset({
                    body: { email, redirectTo: '/reset-password' },
                })
            } catch (error) {
                // Le compte est créé mais l'email n'est pas parti : on le signale sans
                // masquer que le compte existe désormais (l'Admin pourra relancer
                // l'envoi via /forgot-password pour cet email).
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message:
                        "Le compte a été créé mais l'email de définition du mot de passe n'a pas pu être envoyé.",
                    cause: error,
                })
            }

            return { email }
        }),

    // Tous les utilisateurs de la plateforme, du plus récent au plus ancien, avec
    // leur rattachement à un cabinet (nom + rôle) quand il existe. organizationName
    // et role sont null pour l'Admin plateforme et pour un Owner en attente
    // d'onboarding — aucun des deux n'a encore d'appartenance.
    listUsers: adminProcedure.query(async ({ ctx }) => {
        const users = await ctx.db
            .select({
                id: user.id,
                name: user.name,
                email: user.email,
                emailVerified: user.emailVerified,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt,
            })
            .from(user)
            .orderBy(desc(user.createdAt))

        // Appartenances résolues à part puis recollées en mémoire : un leftJoin
        // dupliquerait l'utilisateur s'il appartenait à plusieurs cabinets. On
        // retient la plus ancienne (asc + premier gagnant), comme le contexte tRPC.
        const memberships = await ctx.db
            .select({
                userId: member.userId,
                role: member.role,
                organizationName: organization.name,
            })
            .from(member)
            .innerJoin(organization, eq(organization.id, member.organizationId))
            .orderBy(asc(member.createdAt))

        const membershipByUser = new Map<
            string,
            { organizationName: string; role: string }
        >()
        for (const membership of memberships) {
            if (!membershipByUser.has(membership.userId)) {
                membershipByUser.set(membership.userId, {
                    organizationName: membership.organizationName,
                    role: membership.role,
                })
            }
        }

        return users.map((account) => {
            const membership = membershipByUser.get(account.id) ?? null
            return {
                ...account,
                organizationName: membership?.organizationName ?? null,
                role: membership?.role ?? null,
            }
        })
    }),

    // Supprime un utilisateur et, par cascade des clés étrangères (sessions,
    // comptes, appartenances, assignations d'audit, invitations émises), toutes ses
    // données rattachées. updated_by des findings passe à null (set null). Deux
    // garde-fous : on ne supprime ni son propre compte, ni un autre Admin Balise.
    deleteUser: adminProcedure
        .input(z.object({ userId: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            if (input.userId === ctx.user.id) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Vous ne pouvez pas supprimer votre propre compte.',
                })
            }

            const target = await ctx.db.query.user.findFirst({
                where: eq(user.id, input.userId),
                columns: { id: true, isAdmin: true },
            })
            if (!target) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Utilisateur introuvable.',
                })
            }
            if (target.isAdmin) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Impossible de supprimer un administrateur Balise.',
                })
            }

            await ctx.db.delete(user).where(eq(user.id, input.userId))

            return { id: input.userId }
        }),
})
