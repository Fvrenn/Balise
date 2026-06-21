import 'server-only'

import { TRPCError } from '@trpc/server'

import { deleteFile, uploadFile } from '@/lib/storage'

// ─── Logo du cabinet ──────────────────────────────────────────────────────────
// Validation et stockage du logo, partagés par la création du cabinet (onboarding)
// et la mise à jour des paramètres (settings). Le contenu réel fait foi : on ne
// fait jamais confiance au type déclaré par le client.

// 2 Mo : un logo de cabinet (PNG/SVG) tient largement en dessous.
export const MAX_LOGO_BYTES = 2 * 1024 * 1024

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

// Valide une image encodée en base64 (sans préfixe data:), remplace tout logo
// précédent du cabinet quelle que soit son extension — sinon un changement de
// format (png → svg) laisserait un fichier orphelin — puis téléverse le nouveau.
// Renvoie l'URL publique. Lève une TRPCError BAD_REQUEST si l'image est invalide.
export async function storeOrganizationLogo(
    organizationId: string,
    dataBase64: string,
): Promise<string> {
    const buffer = Buffer.from(dataBase64, 'base64')
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

    await Promise.all(
        Object.values(LOGO_EXTENSIONS).map((extension) =>
            deleteFile(logoStorageKey(organizationId, extension)),
        ),
    )

    return uploadFile(
        logoStorageKey(organizationId, LOGO_EXTENSIONS[contentType]),
        buffer,
        contentType,
    )
}
