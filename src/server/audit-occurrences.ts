import { asc, eq } from 'drizzle-orm'

import type { Database } from '@/db'
import { auditFindings, findingOccurrences } from '@/db/schema'

// Lecture des occurrences d'un audit — les éléments précis relevés par le
// scanner à l'appui d'une non-conformité. Partagée entre la grille de critères
// et l'export Excel, qui les présentent différemment mais partent des mêmes lignes.

export type FindingOccurrenceRow = {
    selector: string
    html: string
    text: string | null
    landmark: string | null
    details: Record<string, string> | null
}

// Indexées par finding. Requête séparée plutôt qu'une jointure sur getFindings :
// un finding porte 0 à 5 occurrences, la jointure dupliquerait les 106 × N lignes
// de la grille.
export async function loadOccurrences(
    db: Database,
    auditId: string,
): Promise<Map<string, FindingOccurrenceRow[]>> {
    const rows = await db
        .select({
            findingId: findingOccurrences.findingId,
            selector: findingOccurrences.selector,
            html: findingOccurrences.html,
            text: findingOccurrences.text,
            landmark: findingOccurrences.landmark,
            details: findingOccurrences.details,
        })
        .from(findingOccurrences)
        .innerJoin(
            auditFindings,
            eq(findingOccurrences.findingId, auditFindings.id),
        )
        .where(eq(auditFindings.auditId, auditId))
        .orderBy(asc(findingOccurrences.sortOrder))

    const byFinding = new Map<string, FindingOccurrenceRow[]>()
    for (const { findingId, ...occurrence } of rows) {
        const existing = byFinding.get(findingId)
        if (existing) existing.push(occurrence)
        else byFinding.set(findingId, [occurrence])
    }
    return byFinding
}
