import { eq, inArray, sql } from 'drizzle-orm'

import type { Database } from '@/db'
import { auditFindings, audits, rgaaCriteria } from '@/db/schema'
import {
    buildThemeProgress,
    computeComplianceRate,
    sumStatusCounts,
    type ThemeProgress,
} from '@/lib/rgaa'

// Agrégats d'avancement et de conformité d'un audit, côté serveur. Les formules
// (statut global d'un critère, taux de conformité) vivent dans @/lib/rgaa ; ici
// on ne fait que les alimenter depuis la base et persister le résultat.

// Agrège les findings page par page d'un audit en avancement par thématique au niveau
// critère (chaque critère réduit à un statut global), dans l'ordre RGAA (theme 1 → 13).
export async function getThemeProgress(
    db: Database,
    auditId: string,
): Promise<ThemeProgress[]> {
    const rows = await db
        .select({
            criterionId: rgaaCriteria.id,
            themeId: rgaaCriteria.themeId,
            themeName: rgaaCriteria.themeName,
            status: auditFindings.status,
        })
        .from(auditFindings)
        .innerJoin(rgaaCriteria, eq(auditFindings.criterionId, rgaaCriteria.id))
        .where(eq(auditFindings.auditId, auditId))

    return buildThemeProgress(rows)
}

// Recalcule le taux de conformité mis en cache sur l'audit à partir de l'état
// courant de ses findings, puis le persiste. Appelé après chaque modification.
// Le taux s'appuie sur le statut *global* de chaque critère (toutes pages agrégées),
// d'où la réutilisation de getThemeProgress.
export async function recomputeComplianceRate(
    db: Database,
    auditId: string,
): Promise<number | null> {
    const themeProgress = await getThemeProgress(db, auditId)
    const complianceRate = computeComplianceRate(sumStatusCounts(themeProgress))
    await db
        .update(audits)
        .set({ complianceRate, updatedAt: new Date() })
        .where(eq(audits.id, auditId))

    return complianceRate
}

// Nombre de critères « traités » par audit, agrégé en une seule requête (pas de N+1
// sur la liste). Un critère est traité dès qu'une page le déclare non conforme
// (verdict acquis) ou qu'aucune de ses pages n'est plus « à traiter » — exactement la
// définition du statut global non « pending ».
export async function getTreatedCountByAudit(
    db: Database,
    auditIds: string[],
): Promise<Map<string, number>> {
    if (auditIds.length === 0) return new Map()

    const perCriterion = db
        .select({
            auditId: auditFindings.auditId,
            criterionId: auditFindings.criterionId,
            isTreated:
                sql<boolean>`bool_or(${auditFindings.status} = 'non_conforme') or not bool_or(${auditFindings.status} = 'pending')`.as(
                    'is_treated',
                ),
        })
        .from(auditFindings)
        .where(inArray(auditFindings.auditId, auditIds))
        .groupBy(auditFindings.auditId, auditFindings.criterionId)
        .as('per_criterion')

    const rows = await db
        .select({
            auditId: perCriterion.auditId,
            treatedCount: sql<number>`count(*) filter (where ${perCriterion.isTreated})::int`,
        })
        .from(perCriterion)
        .groupBy(perCriterion.auditId)

    return new Map(rows.map((row) => [row.auditId, row.treatedCount]))
}
