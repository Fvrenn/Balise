import { NextResponse } from 'next/server'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'

import { db } from '@/db'
import { auditExports, audits } from '@/db/schema'
import { createTRPCContext } from '@/server/context'
import { readStoredFile } from '@/lib/storage'

// Re-téléchargement d'un livrable archivé. Route dédiée plutôt que /api/uploads :
// un export contient les données d'audit d'un client, il ne doit être servi qu'à
// un membre du cabinet propriétaire — la jointure sur organizationId est la même
// barrière multi-tenant que celle des procédures tRPC.

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ auditId: string; exportId: string }> },
) {
    const { auditId, exportId } = await params
    const { organizationId } = await createTRPCContext({
        headers: new Headers(await headers()),
    })
    if (!organizationId) {
        return new NextResponse('Non autorisé.', { status: 401 })
    }

    const [archived] = await db
        .select({
            filename: auditExports.filename,
            storageKey: auditExports.storageKey,
        })
        .from(auditExports)
        .innerJoin(audits, eq(auditExports.auditId, audits.id))
        .where(
            and(
                eq(auditExports.id, exportId),
                eq(auditExports.auditId, auditId),
                eq(audits.organizationId, organizationId),
            ),
        )
        .limit(1)
    // Même réponse qu'un export inexistant : on ne révèle pas l'existence d'un
    // livrable appartenant à un autre cabinet.
    if (!archived) {
        return new NextResponse('Export introuvable.', { status: 404 })
    }

    const file = await readStoredFile(archived.storageKey)
    if (!file) {
        return new NextResponse(
            "Le fichier de cet export n'est plus disponible.",
            { status: 404 },
        )
    }

    return new NextResponse(new Uint8Array(file.data), {
        status: 200,
        headers: {
            'Content-Type': file.contentType,
            'Content-Disposition': `attachment; filename="${archived.filename}"`,
            // Données d'audit : jamais mises en cache par un intermédiaire.
            'Cache-Control': 'private, no-store',
            'X-Content-Type-Options': 'nosniff',
        },
    })
}
