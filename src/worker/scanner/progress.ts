import IORedis from 'ioredis'

import { scanChannel, type ScanProgressEvent } from '@/lib/scan-events'

// Publie la progression d'un scan dans Redis pub/sub ; la route SSE Next.js
// (/api/scan-progress/[auditId]) relaie ces événements au navigateur.

let publisher: IORedis | null = null

function getPublisher(): IORedis {
    if (!publisher) {
        const url = process.env.REDIS_URL
        if (!url) {
            throw new Error(
                'REDIS_URL manquant : impossible de publier la progression du scan.',
            )
        }
        publisher = new IORedis(url)
    }
    return publisher
}

export async function publishScanProgress(
    auditId: string,
    event: ScanProgressEvent,
): Promise<void> {
    try {
        await getPublisher().publish(scanChannel(auditId), JSON.stringify(event))
    } catch (error) {
        // La progression est un confort d'affichage : sa panne ne doit jamais faire
        // échouer le scan lui-même.
        console.error('[worker] publication de progression échouée :', error)
    }
}
