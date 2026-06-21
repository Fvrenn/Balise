import { NextResponse } from 'next/server'

import { readStoredFile } from '@/lib/storage'

// Sert les fichiers téléversés depuis le disque (logos de cabinet…). On passe par
// une route dédiée plutôt que /public pour garder la main sur l'accès et les
// en-têtes. Avec un backend objet (R2), les URLs pointeraient vers le bucket et
// cette route ne serait plus sollicitée.
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ path: string[] }> },
) {
    const { path: segments } = await params
    const key = segments.join('/')

    let file: Awaited<ReturnType<typeof readStoredFile>>
    try {
        file = await readStoredFile(key)
    } catch {
        // resolveStoredPath lève sur une clé hors racine (tentative de traversée).
        return new NextResponse('Chemin invalide.', { status: 400 })
    }

    if (!file) {
        return new NextResponse('Fichier introuvable.', { status: 404 })
    }

    return new NextResponse(new Uint8Array(file.data), {
        status: 200,
        headers: {
            'Content-Type': file.contentType,
            'Cache-Control': 'public, max-age=3600',
            // Empêche le navigateur de renifler/ré-interpréter le type, et bloque
            // l'exécution de scripts d'un SVG téléversé s'il est ouvert directement.
            'X-Content-Type-Options': 'nosniff',
            'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
        },
    })
}
