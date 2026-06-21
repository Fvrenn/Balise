import { eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { ownerProcedure, protectedProcedure, router } from '@/server/trpc'
import { organization } from '@/db/schema'
import { deleteFile, uploadFile } from '@/lib/storage'

// 2 Mo : un logo de cabinet (PNG/SVG) tient largement en dessous.
const MAX_LOGO_BYTES = 2 * 1024 * 1024

// Source unique des formats acceptés : type MIME → extension de fichier. Le type
// LogoContentType en est dérivé, pas redéclaré.
const LOGO_EXTENSIONS = {
    'image/png': 'png',
    'image/svg+xml': 'svg',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
} as const

type LogoContentType = keyof typeof LOGO_EXTENSIONS

// Clé de stockage du logo : un dossier par cabinet, fichier nommé « logo.<ext> ».
// Le nom fixe garantit qu'un nouvel upload de même extension écrase l'ancien.
function logoStorageKey(organizationId: string, extension: string): string {
    return `logos/${organizationId}/logo.${extension}`
}

// Détermine le type d'image à partir du contenu réel (magic bytes) plutôt que du
// type déclaré par le client, auquel on ne fait jamais confiance. Renvoie null si
// le contenu ne correspond à aucun format autorisé.
function detectLogoContentType(buffer: Buffer): LogoContentType | null {
    if (
        buffer.length >= 8 &&
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47 &&
        buffer[4] === 0x0d &&
        buffer[5] === 0x0a &&
        buffer[6] === 0x1a &&
        buffer[7] === 0x0a
    ) {
        return 'image/png'
    }
    if (
        buffer.length >= 3 &&
        buffer[0] === 0xff &&
        buffer[1] === 0xd8 &&
        buffer[2] === 0xff
    ) {
        return 'image/jpeg'
    }
    // WEBP : conteneur RIFF « RIFF....WEBP ».
    if (
        buffer.length >= 12 &&
        buffer.toString('ascii', 0, 4) === 'RIFF' &&
        buffer.toString('ascii', 8, 12) === 'WEBP'
    ) {
        return 'image/webp'
    }
    // SVG : XML texte sans magic bytes fixes — on cherche une balise <svg dans le
    // début du fichier (tolère BOM, prologue <?xml … ?> et espaces).
    const head = buffer.toString('utf8', 0, Math.min(buffer.length, 1024))
    if (/<svg[\s>]/i.test(head)) {
        return 'image/svg+xml'
    }
    return null
}

// Champ texte optionnel : « » (vidé par l'utilisateur) est accepté et vaudra null
// en base ; toute autre valeur doit respecter le format demandé.
const optionalWebsite = z
    .string()
    .trim()
    .url('Adresse du site web invalide.')
    .max(2000)
    .or(z.literal(''))
    .optional()

const optionalContactEmail = z
    .string()
    .trim()
    .email('Email de contact invalide.')
    .max(200)
    .or(z.literal(''))
    .optional()

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
                name: z
                    .string()
                    .trim()
                    .min(1, 'Le nom du cabinet est obligatoire.')
                    .max(200),
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
                // transporte telle quelle ; le serveur la décode en Buffer. Le type
                // n'est pas transmis : il est déduit du contenu, jamais déclaré.
                dataBase64: z.string().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const buffer = Buffer.from(input.dataBase64, 'base64')
            if (buffer.length === 0) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Fichier image vide ou invalide.',
                })
            }
            if (buffer.length > MAX_LOGO_BYTES) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Le logo dépasse la taille maximale de 2 Mo.',
                })
            }

            const contentType = detectLogoContentType(buffer)
            if (!contentType) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message:
                        'Format non supporté. Utilisez un fichier PNG, JPG, SVG ou WEBP.',
                })
            }

            // Supprime tout logo précédent quelle que soit son extension : sans ça,
            // un changement de format (png → svg) laisserait l'ancien fichier
            // orphelin et l'URL en base pourrait pointer vers un fichier supprimé.
            await Promise.all(
                Object.values(LOGO_EXTENSIONS).map((extension) =>
                    deleteFile(logoStorageKey(ctx.organizationId, extension)),
                ),
            )

            const logoUrl = await uploadFile(
                logoStorageKey(ctx.organizationId, LOGO_EXTENSIONS[contentType]),
                buffer,
                contentType,
            )

            const [updated] = await ctx.db
                .update(organization)
                .set({ logo: logoUrl })
                .where(eq(organization.id, ctx.organizationId))
                .returning({ logo: organization.logo })
            return updated
        }),
})
