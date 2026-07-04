import { Worker } from 'bullmq'

import {
    scanRedisConnection,
    SCAN_QUEUE_NAME,
    type ScanJobData,
} from '@/worker/queue'
import { runScan } from '@/worker/scanner'

// Process Node.js autonome, lancé séparément de Next.js (pnpm dev:worker en dev).
// Consomme les jobs de scan : chaque job exécute le scanner complet sur un audit.
// Un scan qui échoue marque son job « failed » sans jamais tuer le worker.

const worker = new Worker<ScanJobData>(
    SCAN_QUEUE_NAME,
    async (job) => {
        await runScan(job.data)
    },
    {
        connection: scanRedisConnection(),
        concurrency: 2,
    },
)

worker.on('ready', () => {
    console.log(`[worker] prêt — queue "${SCAN_QUEUE_NAME}" (concurrency 2)`)
})

worker.on('active', (job) => {
    console.log(`[worker] scan démarré — audit ${job.data.auditId}`)
})

worker.on('completed', (job) => {
    console.log(`[worker] scan terminé — audit ${job.data.auditId}`)
})

worker.on('failed', (job, error) => {
    console.error(
        `[worker] scan échoué — audit ${job?.data.auditId ?? 'inconnu'} :`,
        error,
    )
})

// Erreurs de la machinerie BullMQ/Redis (hors jobs) : logguées, le worker survit
// et se reconnecte tout seul.
worker.on('error', (error) => {
    console.error('[worker] erreur BullMQ :', error)
})

async function shutdown(signal: string) {
    console.log(`[worker] ${signal} reçu, arrêt en cours…`)
    await worker.close()
    process.exit(0)
}

process.on('SIGINT', () => void shutdown('SIGINT'))
process.on('SIGTERM', () => void shutdown('SIGTERM'))
