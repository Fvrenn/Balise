import { eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { authedProcedure, router } from '@/server/trpc'
import { auth } from '@/lib/auth'
import { storeOrganizationLogo } from '@/lib/logo'
import {
    cabinetName,
    optionalContactEmail,
    optionalWebsite,
} from '@/server/validation'
import { member, organization } from '@/db/schema'
import type { Database } from '@/db'

// Transforme un nom de cabinet en slug URL-safe (le plugin organization exige un
// slug unique). Retombe sur « cabinet » si le nom ne contient aucun caractère
// exploitable (ex. uniquement des emojis).
function slugify(name: string): string {
    const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '') // supprime les diacritiques décomposés
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 50)
    return slug || 'cabinet'
}

// Garantit l'unicité du slug : suffixe aléatoire court si la base en garde déjà un
// identique. createOrganization revérifie de son côté, ce pré-contrôle évite juste
// l'erreur dans le cas courant.
async function generateUniqueSlug(
    db: Database,
    name: string,
): Promise<string> {
    const base = slugify(name)
    const existing = await db.query.organization.findFirst({
        where: eq(organization.slug, base),
        columns: { id: true },
    })
    if (!existing) return base
    return `${base}-${crypto.randomUUID().slice(0, 6)}`
}

// Convertit une erreur Better Auth (APIError) en TRPCError lisible : le message
// utile se trouve dans `body.message`.
function toReadableError(error: unknown): TRPCError {
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
        message: 'La création du cabinet a échoué.',
    })
}

export const onboardingRouter = router({
    // Crée le cabinet d'un Owner fraîchement arrivé (sans organisation) et le
    // rattache comme owner. createOrganization (plugin organization) crée à la fois
    // l'organization ET le membership owner du créateur — on ne duplique donc pas
    // le membership ici. website/contactEmail et le logo sont propres à Balise :
    // posés ensuite par une mise à jour directe.
    createCabinet: authedProcedure
        .input(
            z.object({
                name: cabinetName,
                website: optionalWebsite,
                contactEmail: optionalContactEmail,
                // Logo optionnel encodé en base64 (sans préfixe data:), validé côté
                // serveur. Téléversé seulement après création du cabinet (sa clé de
                // stockage dépend de l'id du cabinet).
                logoBase64: z.string().min(1).optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            // Un compte déjà rattaché ne passe pas par l'onboarding : il gérerait son
            // cabinet via les paramètres. Garde-fou contre un double envoi.
            const existingMembership = await ctx.db.query.member.findFirst({
                where: eq(member.userId, ctx.user.id),
                columns: { id: true },
            })
            if (existingMembership) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: 'Vous appartenez déjà à un cabinet.',
                })
            }

            const slug = await generateUniqueSlug(ctx.db, input.name)

            let organizationId: string
            try {
                const created = await auth.api.createOrganization({
                    body: {
                        name: input.name,
                        slug,
                        // L'organisation active est résolue côté contexte tRPC à
                        // partir de l'appartenance la plus ancienne ; pas besoin de
                        // muter le cookie de session ici.
                        keepCurrentActiveOrganization: true,
                    },
                    headers: ctx.headers,
                })
                if (!created?.id) {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'La création du cabinet a échoué.',
                    })
                }
                organizationId = created.id
            } catch (error) {
                if (error instanceof TRPCError) throw error
                throw toReadableError(error)
            }

            const logo = input.logoBase64
                ? await storeOrganizationLogo(organizationId, input.logoBase64)
                : null

            await ctx.db
                .update(organization)
                .set({
                    website: input.website ? input.website : null,
                    contactEmail: input.contactEmail
                        ? input.contactEmail
                        : null,
                    ...(logo ? { logo } : {}),
                })
                .where(eq(organization.id, organizationId))

            return { organizationId }
        }),
})
