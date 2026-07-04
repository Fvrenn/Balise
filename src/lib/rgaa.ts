import type { findingSource, findingStatus } from '@/db/schema'

// Le référentiel RGAA 4.1.2 compte exactement 106 critères. Constante centrale :
// elle sert au calcul du taux de conformité et aux scores affichés.
export const RGAA_CRITERIA_COUNT = 106

export type FindingStatus = (typeof findingStatus.enumValues)[number]
export type FindingSource = (typeof findingSource.enumValues)[number]

// Décompte des findings d'un audit (ou d'une thématique) par statut.
export interface StatusCounts {
    conforme: number
    non_conforme: number
    non_applicable: number
    non_teste: number
    pending: number
}

export function emptyStatusCounts(): StatusCounts {
    return {
        conforme: 0,
        non_conforme: 0,
        non_applicable: 0,
        non_teste: 0,
        pending: 0,
    }
}

// Avancement d'une thématique : ses compteurs de statut + son total. Alimente la
// sidebar de navigation, la barre de progression et le tableau de la vue d'ensemble.
export interface ThemeProgress extends StatusCounts {
    themeId: number
    themeName: string
    total: number
}

// Nombre de critères déjà traités (tout sauf « à traiter »). Un critère « non testé »
// a été statué délibérément : il compte donc comme traité.
export function treatedCount(counts: StatusCounts): number {
    return (
        counts.conforme +
        counts.non_conforme +
        counts.non_applicable +
        counts.non_teste
    )
}

// Additionne les compteurs de plusieurs thématiques en un total d'audit.
export function sumStatusCounts(items: StatusCounts[]): StatusCounts {
    return items.reduce<StatusCounts>((total, item) => {
        total.conforme += item.conforme
        total.non_conforme += item.non_conforme
        total.non_applicable += item.non_applicable
        total.non_teste += item.non_teste
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

// Statut global d'un critère, agrégé depuis ses findings page par page. L'ordre des
// tests encode la priorité du référentiel :
//   1. une seule page non conforme suffit à rendre le critère non conforme — le
//      verdict négatif est acquis quel que soit l'état des autres pages ;
//   2. sinon, tant qu'une page reste « à traiter », le critère l'est aussi ;
//   3. sinon, un critère conforme sur au moins une page (et non conforme nulle part)
//      est conforme : les pages N/A ou non testées ne le pénalisent pas ;
//   4. sinon ne restent que des pages N/A et/ou non testées — non testé s'il y en a
//      au moins une, non applicable si toutes les pages sont N/A.
export function aggregateCriterionStatus(
    statuses: FindingStatus[],
): FindingStatus {
    if (statuses.length === 0) return 'pending'
    if (statuses.some((status) => status === 'non_conforme')) return 'non_conforme'
    if (statuses.some((status) => status === 'pending')) return 'pending'
    if (statuses.some((status) => status === 'conforme')) return 'conforme'
    if (statuses.some((status) => status === 'non_teste')) return 'non_teste'
    return 'non_applicable'
}

// Un finding rattaché à son critère et sa thématique, tel que renvoyé par la base ou
// reconstruit côté client depuis l'état optimiste. Brique d'entrée de buildThemeProgress.
export interface CriterionStatusRow {
    criterionId: string
    themeId: number
    themeName: string
    status: FindingStatus
}

// Réduit des findings page par page en avancement par thématique au niveau critère :
// chaque critère est d'abord ramené à un statut global (aggregateCriterionStatus),
// puis compté dans sa thématique. La somme des `total` vaut donc le nombre de critères
// (106), pas le nombre de findings. Partagé entre le serveur et la grille optimiste
// pour garantir un calcul identique des deux côtés.
export function buildThemeProgress(rows: CriterionStatusRow[]): ThemeProgress[] {
    const byCriterion = new Map<
        string,
        { themeId: number; themeName: string; statuses: FindingStatus[] }
    >()
    for (const row of rows) {
        let criterion = byCriterion.get(row.criterionId)
        if (!criterion) {
            criterion = {
                themeId: row.themeId,
                themeName: row.themeName,
                statuses: [],
            }
            byCriterion.set(row.criterionId, criterion)
        }
        criterion.statuses.push(row.status)
    }

    const byTheme = new Map<number, ThemeProgress>()
    for (const criterion of byCriterion.values()) {
        const status = aggregateCriterionStatus(criterion.statuses)
        let theme = byTheme.get(criterion.themeId)
        if (!theme) {
            theme = {
                themeId: criterion.themeId,
                themeName: criterion.themeName,
                total: 0,
                ...emptyStatusCounts(),
            }
            byTheme.set(criterion.themeId, theme)
        }
        theme.total += 1
        theme[status] += 1
    }

    return [...byTheme.values()].sort((a, b) => a.themeId - b.themeId)
}

// Taux de conformité officiel RGAA : part des critères *applicables* qui sont
// conformes. Les critères non applicables et non testés sortent du dénominateur.
//   taux = conforme / (106 - non_applicable - non_teste) * 100
// Retourne null tant qu'aucun critère n'a été traité (audit vierge) : afficher
// « — » plutôt qu'un 0 % trompeur.
export function computeComplianceRate(counts: StatusCounts): number | null {
    if (treatedCount(counts) === 0) return null

    const applicable =
        RGAA_CRITERIA_COUNT - counts.non_applicable - counts.non_teste
    if (applicable <= 0) return null

    return Math.round((counts.conforme / applicable) * 100)
}
