import { eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { ownerProcedure, protectedProcedure, router } from '@/server/trpc'
import { organization } from '@/db/schema'
import { storeOrganizationLogo } from '@/lib/logo'
import {
    cabinetName,
    optionalContactEmail,
    optionalWebsite,
} from '@/server/validation'

export const cabinetRouter = router({
    // Infos du cabinet courant pour le formulaire de paramètres. Lecture ouverte à
    // tout membre ; seules les modifications sont réservées aux owners.
    get: protectedProcedure.query(async ({ ctx }) => {
        const cabinet = await ctx.db.query.organization.findFirst({
            where: eq(organization.id, ctx.organizationId),
            columns: { name: true, logo: true, website: true, contactEmail: true },
        })
        if (!cabinet) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Cabinet introuvable.',
            })
        }
        return cabinet
    }),

    // Met à jour l'identité du cabinet. website/contactEmail sont des colonnes
    // propres à Balise (absentes du modèle Better Auth), d'où une mise à jour
    // Drizzle directe plutôt que auth.api.updateOrganization.
    update: ownerProcedure
        .input(
            z.object({
                name: cabinetName,
                website: optionalWebsite,
                contactEmail: optionalContactEmail,
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const [updated] = await ctx.db
                .update(organization)
                .set({
                    name: input.name,
                    website: input.website ? input.website : null,
                    contactEmail: input.contactEmail ? input.contactEmail : null,
                })
                .where(eq(organization.id, ctx.organizationId))
                .returning({
                    name: organization.name,
                    logo: organization.logo,
                    website: organization.website,
                    contactEmail: organization.contactEmail,
                })
            return updated
        }),

    // Téléverse le logo du cabinet via la couche de stockage (disque en V1,
    // migrable vers R2) et enregistre son URL publique. Réservé aux owners.
    uploadLogo: ownerProcedure
        .input(
            z.object({
                // Image encodée en base64 (sans le préfixe data:). superjson la
                // transporte telle quelle ; le serveur la décode et valide son
                // contenu réel. Le type n'est pas transmis : il est déduit, jamais
                // déclaré.
                dataBase64: z.string().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const logoUrl = await storeOrganizationLogo(
                ctx.organizationId,
                input.dataBase64,
            )

            const [updated] = await ctx.db
                .update(organization)
                .set({ logo: logoUrl })
                .where(eq(organization.id, ctx.organizationId))
                .returning({ logo: organization.logo })
            return updated
        }),
})
