import { Queue, type ConnectionOptions } from 'bullmq'

// Frontière entre l'app Next.js et le worker : ce module est le SEUL fichier de
// src/worker/ importable côté Next (producteur de jobs). Il ne doit jamais tirer
// de dépendance du scanner (Playwright…) — le worker, lui, importe tout.

export const SCAN_QUEUE_NAME = 'scan-queue'

export interface ScanJobData {
    auditId: string
    scanRunId: string
    overwriteExisting: boolean
    // Restreint le scan à une seule page de l'échantillon ; absent = toutes.
    pageId?: string
}

export function scanRedisConnection(): ConnectionOptions {
    const url = process.env.REDIS_URL
    if (!url) {
        throw new Error(
            'REDIS_URL manquant : impossible de se connecter à Redis (queue de scan).',
        )
    }
    // BullMQ exige maxRetriesPerRequest: null (les commandes bloquantes du worker
    // ne doivent jamais être abandonnées par ioredis).
    return { url, maxRetriesPerRequest: null }
}

// Singleton — évite d'accumuler des connexions Redis lors du hot-reload en dev.
const globalForQueue = globalThis as unknown as {
    scanQueue: Queue<ScanJobData> | undefined
}

export const scanQueue: Queue<ScanJobData> =
    globalForQueue.scanQueue ??
    new Queue<ScanJobData>(SCAN_QUEUE_NAME, {
        connection: scanRedisConnection(),
    })

if (process.env.NODE_ENV !== 'production') globalForQueue.scanQueue = scanQueue

export async function addScanJob(input: ScanJobData): Promise<void> {
    await scanQueue.add('scan', input, {
        // Un job raté n'est pas retenté automatiquement : relancer un scan est une
        // action utilisateur explicite. On garde un petit historique pour debug.
        attempts: 1,
        removeOnComplete: { count: 20 },
        removeOnFail: { count: 20 },
    })
}
