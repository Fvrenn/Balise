import 'server-only'

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

// ─── Couche d'abstraction de stockage ────────────────────────────────────────
// Interface volontairement minimale (uploadFile / deleteFile) : les appelants ne
// savent pas si les fichiers vivent sur le disque ou dans le cloud. Migrer vers
// Cloudflare R2 plus tard ne doit toucher QUE ce fichier — remplacer le corps de
// uploadFile/deleteFile par des appels S3 (cf. @/lib/r2) et laisser readStoredFile
// + la route /api/uploads inutilisés (R2 sert ses objets directement).

// Racine de stockage, hors de l'arborescence du code pour survivre aux
// redéploiements. UPLOADS_DIR la surcharge en production (ex. /var/balise/uploads) ;
// fallback ./uploads à la racine du projet en dev local (ignoré par git).
const UPLOADS_ROOT = process.env.UPLOADS_DIR ?? path.join(process.cwd(), 'uploads')

// Préfixe de l'URL publique. En V1 disque, les fichiers sont servis par la route
// Next /api/uploads ; l'URL est relative à l'origine de l'app. Un backend R2
// renverrait à la place l'URL absolue du bucket.
const PUBLIC_URL_PREFIX = '/api/uploads'

// Types MIME servis depuis le disque, indexés par extension de fichier. Toute
// extension inconnue retombe sur un type binaire générique.
const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    svg: 'image/svg+xml',
    webp: 'image/webp',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

const FALLBACK_CONTENT_TYPE = 'application/octet-stream'

// Écrit un fichier sous `key` (les dossiers manquants sont créés récursivement) et
// renvoie son URL publique d'accès.
export async function uploadFile(
    key: string,
    buffer: Buffer,
    contentType: string,
): Promise<string> {
    if (!contentType.trim()) {
        throw new Error('uploadFile : un type de contenu est requis.')
    }

    const absolutePath = resolveStoredPath(key)
    await mkdir(path.dirname(absolutePath), { recursive: true })
    await writeFile(absolutePath, buffer)

    return `${PUBLIC_URL_PREFIX}/${key}`
}

// Supprime le fichier `key` s'il existe. Idempotent : `force` ne lève rien quand le
// fichier est déjà absent, ce qui permet de nettoyer sans vérification préalable.
export async function deleteFile(key: string): Promise<void> {
    await rm(resolveStoredPath(key), { force: true })
}

// Lecture d'un fichier stocké pour la route API qui le sert — spécifique au backend
// disque. Renvoie null si le fichier n'existe pas (la route répondra 404).
export async function readStoredFile(
    key: string,
): Promise<{ data: Buffer; contentType: string } | null> {
    try {
        const data = await readFile(resolveStoredPath(key))
        return { data, contentType: contentTypeForKey(key) }
    } catch (error) {
        if (isFileNotFound(error)) {
            return null
        }
        throw error
    }
}

// Résout une clé en chemin absolu en garantissant qu'il reste sous UPLOADS_ROOT :
// barrière anti-traversée de répertoire, car la clé peut provenir d'une URL publique
// (segments « ../ », clé absolue…).
function resolveStoredPath(key: string): string {
    const root = path.resolve(UPLOADS_ROOT)
    const absolutePath = path.resolve(root, key)
    if (absolutePath !== root && !absolutePath.startsWith(root + path.sep)) {
        throw new Error(`Clé de stockage invalide : ${key}`)
    }
    return absolutePath
}

function contentTypeForKey(key: string): string {
    const extension = path.extname(key).slice(1).toLowerCase()
    return CONTENT_TYPE_BY_EXTENSION[extension] ?? FALLBACK_CONTENT_TYPE
}

function isFileNotFound(error: unknown): boolean {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: string }).code === 'ENOENT'
    )
}
