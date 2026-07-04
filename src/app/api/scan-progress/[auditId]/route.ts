import IORedis from 'ioredis'
import { and, eq } from 'drizzle-orm'

import { auth } from '@/lib/auth'
import { db } from '@/db'
import { audits, member } from '@/db/schema'
import { scanChannel, type ScanProgressEvent } from '@/lib/scan-events'

// Relaye la progression d'un scan (publiée dans Redis par le worker) vers le
// navigateur en Server-Sent Events. Une connexion = un abonnement Redis dédié
// (le mode subscribe d'ioredis monopolise sa connexion), fermé avec le stream.

const STREAM_TIMEOUT_MS = 5 * 60 * 1000

export async function GET(
    request: Request,
    { params }: { params: Promise<{ auditId: string }> },
) {
    const { auditId } = await params

    // Même barrière multi-tenant que les procédures tRPC : connecté ET membre du
    // cabinet auquel l'audit appartient, sinon on ne révèle rien (404).
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) {
        return new Response('Non autorisé', { status: 401 })
    }
    const [audit] = await db
        .select({ id: audits.id })
        .from(audits)
        .innerJoin(
            member,
            and(
                eq(member.organizationId, audits.organizationId),
                eq(member.userId, session.user.id),
            ),
        )
        .where(eq(audits.id, auditId))
        .limit(1)
    if (!audit) {
        return new Response('Audit introuvable', { status: 404 })
    }

    const redisUrl = process.env.REDIS_URL
    if (!redisUrl) {
        return new Response('Redis non configuré', { status: 500 })
    }
    const subscriber = new IORedis(redisUrl)
    const encoder = new TextEncoder()

    let closed = false
    let timeout: ReturnType<typeof setTimeout> | null = null
    const cleanup = () => {
        if (closed) return
        closed = true
        if (timeout) clearTimeout(timeout)
        subscriber.quit().catch(() => undefined)
    }

    const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
            const close = () => {
                const wasClosed = closed
                cleanup()
                if (wasClosed) return
                try {
                    controller.close()
                } catch {
                    // Stream déjà fermé côté client : rien à faire.
                }
            }

            timeout = setTimeout(close, STREAM_TIMEOUT_MS)

            subscriber.on('message', (_channel, message) => {
                if (closed) return
                try {
                    controller.enqueue(encoder.encode(`data: ${message}\n\n`))
                } catch {
                    close()
                    return
                }
                // Dernier événement du scan : on ferme proprement côté serveur,
                // le client saura ne pas retenter la connexion.
                let event: ScanProgressEvent | null = null
                try {
                    event = JSON.parse(message) as ScanProgressEvent
                } catch {
                    return
                }
                if (
                    event.type === 'scan_complete' ||
                    event.type === 'scan_error'
                ) {
                    close()
                }
            })

            try {
                await subscriber.subscribe(scanChannel(auditId))
                // Commentaire SSE initial : ouvre le flux immédiatement côté client.
                controller.enqueue(encoder.encode(': connected\n\n'))
            } catch {
                close()
            }
        },
        // Le client a coupé (fermeture d'onglet, navigation) : on libère Redis.
        cancel() {
            cleanup()
        },
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
        },
    })
}
