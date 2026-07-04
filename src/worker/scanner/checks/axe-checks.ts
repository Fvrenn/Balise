import type { AxeResults, NodeResult, Result as AxeRule } from 'axe-core'

import type { Check } from '@/worker/scanner/checks/types'

// Checks adossés à axe-core : mapping règle(s) axe → critère RGAA.

// Règles axe-core exploitées : le scanner ne fait tourner que celles-ci (gain de
// temps et de mémoire par page).
export const AXE_RULES = [
    'image-alt',
    'role-img-alt',
    'area-alt',
    'input-image-alt',
    'svg-img-alt',
    'color-contrast',
    'link-name',
    'label',
    'list',
    'listitem',
    'definition-list',
    'dlitem',
    'meta-viewport',
    'button-name',
    'autocomplete-valid',
] as const

function findViolation(
    axeResults: AxeResults,
    ruleId: string,
): AxeRule | undefined {
    return axeResults.violations.find((violation) => violation.id === ruleId)
}

export function countViolations(
    axeResults: AxeResults,
    ruleIds: readonly string[],
): number {
    return ruleIds.reduce(
        (total, ruleId) =>
            total + (findViolation(axeResults, ruleId)?.nodes.length ?? 0),
        0,
    )
}

// Mappe une ou plusieurs règles axe vers un critère RGAA. violationOnly = le
// check ne peut prouver que la non-conformité : sans violation il ne pose rien
// (jamais de « conforme » de complaisance sur un critère partiellement couvert).
export function axeRuleCheck(input: {
    name: string
    ruleIds: readonly string[]
    criterionId: string
    comment: (count: number) => string
    violationOnly?: boolean
}): Check {
    return {
        name: input.name,
        run: async ({ axeResults }) => {
            const count = countViolations(axeResults, input.ruleIds)
            if (count > 0) {
                return [
                    {
                        criterionId: input.criterionId,
                        status: 'non_conforme',
                        comment: input.comment(count),
                    },
                ]
            }
            if (input.violationOnly) return []
            return [{ criterionId: input.criterionId, status: 'conforme' }]
        },
    }
}

// ─── Contraste des textes (3.2) ───────────────────────────────────────────────
// Tous les tests de contraste de texte relèvent du critère 3.2 (tests 3.2.1 à
// 3.2.4 : 4.5:1 en taille courante, 3:1 dès 24px ou 18,5px gras — seuils que
// axe-core applique déjà). Le critère 3.3 (contraste des composants d'interface)
// n'est pas automatisable par axe et n'est pas couvert.

interface ContrastCheckData {
    contrastRatio?: number
}

function contrastRatioOf(node: NodeResult): number | null {
    const check = node.any.find((item) => item.id === 'color-contrast')
    if (!check || typeof check.data !== 'object' || check.data === null) {
        return null
    }
    const ratio = (check.data as ContrastCheckData).contrastRatio
    return typeof ratio === 'number' ? ratio : null
}

export const colorContrastCheck: Check = {
    name: 'contraste des textes 3.2',
    run: async ({ axeResults }) => {
        const nodes = findViolation(axeResults, 'color-contrast')?.nodes ?? []
        if (nodes.length === 0) {
            return [{ criterionId: '3.2', status: 'conforme' }]
        }
        const ratios = nodes
            .map(contrastRatioOf)
            .filter((ratio): ratio is number => ratio !== null)
        const worst =
            ratios.length > 0 ? `${Math.min(...ratios).toFixed(1)}:1` : 'inconnu'
        return [
            {
                criterionId: '3.2',
                status: 'non_conforme',
                comment: `${nodes.length} texte(s) avec contraste insuffisant (pire ratio détecté : ${worst} — seuil RGAA : 4.5:1, ou 3:1 pour les textes agrandis)`,
            },
        ]
    },
}
