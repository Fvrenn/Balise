import { randomBytes } from 'node:crypto'
import { count, desc, eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { adminProcedure, router } from '@/server/trpc'
import { auth } from '@/lib/auth'
import { member, organization, user } from '@/db/schema'

// Mot de passe temporaire de l'Owner créé depuis le panel : affiché une seule fois
// à l'Admin, qui le transmet hors-bande. 12 octets en base64url ≈ 16 caractères,
// bien au-dessus du minimum de 8 imposé par Better Auth.
function generateTemporaryPassword(): string {
    return randomBytes(12).toString('base64url')
}

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

    // Crée le compte d'un Owner (isAdmin false, sans cabinet) et renvoie un mot de
    // passe temporaire à afficher une seule fois. Même résultat que `pnpm
    // create:owner` : à sa première connexion, l'Owner sera redirigé vers
    // /onboarding/cabinet pour créer son cabinet (cf. CLAUDE.md « Modèle d'accès »).
    //
    // On crée l'utilisateur via l'adaptateur interne de Better Auth, pas via
    // auth.api.signUpEmail : ce dernier ouvre une session pour le nouveau compte et,
    // par le plugin nextCookies, écraserait le cookie de session de l'Admin (qui se
    // retrouverait connecté en tant que l'Owner). L'adaptateur interne n'écrit qu'en
    // base, sans toucher à la session courante.
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

            const temporaryPassword = generateTemporaryPassword()

            try {
                const authContext = await auth.$context
                const hashedPassword =
                    await authContext.password.hash(temporaryPassword)
                const createdUser = await authContext.internalAdapter.createUser({
                    email,
                    name: input.name,
                    emailVerified: false,
                })
                // Compte « credential » Better Auth : il porte le hash du mot de passe
                // et autorise la connexion email/mot de passe.
                await authContext.internalAdapter.linkAccount({
                    userId: createdUser.id,
                    providerId: 'credential',
                    accountId: createdUser.id,
                    password: hashedPassword,
                })
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'La création du compte Owner a échoué.',
                    cause: error,
                })
            }

            return { email, temporaryPassword }
        }),
})
