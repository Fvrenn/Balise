// Contrat des événements de progression d'un scan, partagé entre le worker (qui
// publie dans Redis) et la route SSE Next.js (qui relaie au navigateur). Ce module
// ne contient que des types et des constantes : il est importable des deux côtés
// sans jamais tirer de code worker dans Next.js, ni l'inverse.

export type ScanProgressEvent = {
    type: 'page_start' | 'page_done' | 'scan_complete' | 'scan_error'
    pageIndex: number
    totalPages: number
    pageLabel: string
    pageUrl: string
    // Renseigné sur scan_complete : nombre de findings mis à jour (toast final).
    updatedCount?: number
    // Renseigné sur scan_error : message affichable à l'utilisateur.
    message?: string
}

// Channel Redis pub/sub dédié à un audit : le worker y publie, la route SSE s'y
// abonne. Un seul scan à la fois par audit (garanti par scan.start).
export function scanChannel(auditId: string): string {
    return `scan:${auditId}`
}
