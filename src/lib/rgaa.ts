import type { findingStatus } from '@/db/schema'

// Le référentiel RGAA 4.1.2 compte exactement 106 critères. Constante centrale :
// elle sert au calcul du taux de conformité et aux scores affichés.
export const RGAA_CRITERIA_COUNT = 106

export type FindingStatus = (typeof findingStatus.enumValues)[number]

// Décompte des findings d'un audit (ou d'une thématique) par statut.
export interface StatusCounts {
    conforme: number
    non_conforme: number
    non_applicable: number
    pending: number
}

export function emptyStatusCounts(): StatusCounts {
    return { conforme: 0, non_conforme: 0, non_applicable: 0, pending: 0 }
}

// Avancement d'une thématique : ses 4 compteurs de statut + son total. Alimente la
// sidebar de navigation, la barre de progression et le tableau de la vue d'ensemble.
export interface ThemeProgress extends StatusCounts {
    themeId: number
    themeName: string
    total: number
}

// Nombre de critères déjà traités (tout sauf « à traiter »).
export function treatedCount(counts: StatusCounts): number {
    return counts.conforme + counts.non_conforme + counts.non_applicable
}

// Additionne les compteurs de plusieurs thématiques en un total d'audit.
export function sumStatusCounts(items: StatusCounts[]): StatusCounts {
    return items.reduce<StatusCounts>((total, item) => {
        total.conforme += item.conforme
        total.non_conforme += item.non_conforme
        total.non_applicable += item.non_applicable
        total.pending += item.pending
        return total
    }, emptyStatusCounts())
}

// Tonalité de l'indicateur d'une thématique dans la sidebar :
//   idle    → non commencée
//   error   → au moins une non-conformité
//   success → entièrement traitée sans non-conformité
//   partial → en cours, sans non-conformité pour l'instant
export type ThemeTone = 'idle' | 'error' | 'success' | 'partial'

export function themeTone(counts: StatusCounts): ThemeTone {
    if (treatedCount(counts) === 0) return 'idle'
    if (counts.non_conforme > 0) return 'error'
    if (counts.pending === 0) return 'success'
    return 'partial'
}

// Taux de conformité officiel RGAA : part des critères *applicables* qui sont
// conformes. Les critères non applicables sortent du dénominateur.
//   taux = conforme / (106 - non_applicable) * 100
// Retourne null tant qu'aucun critère n'a été traité (audit vierge) : afficher
// « — » plutôt qu'un 0 % trompeur.
export function computeComplianceRate(counts: StatusCounts): number | null {
    const treated = counts.conforme + counts.non_conforme + counts.non_applicable
    if (treated === 0) return null

    const applicable = RGAA_CRITERIA_COUNT - counts.non_applicable
    if (applicable <= 0) return null

    return Math.round((counts.conforme / applicable) * 100)
}
