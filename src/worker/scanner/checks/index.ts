import type { Page } from 'playwright'
import type { AxeResults } from 'axe-core'

import {
    AXE_RULES,
    axeRuleCheck,
    colorContrastCheck,
} from '@/worker/scanner/checks/axe-checks'
import { applicabilityCheck } from '@/worker/scanner/checks/applicability'
import {
    htmlLangCheck,
    innerLangCheck,
} from '@/worker/scanner/checks/lang'
import {
    autoplayCheck,
    doctypeCheck,
    duplicateIdsCheck,
    frameTitleCheck,
    headingHierarchyCheck,
    layoutTablesCheck,
    mainLandmarkCheck,
    marqueeCheck,
    metaRefreshCheck,
    pageTitleCheck,
    presentationalTagsCheck,
    readingDirectionCheck,
    requiredFieldsCheck,
    skipLinkCheck,
} from '@/worker/scanner/checks/dom-checks'
import {
    decorativeImagesCheck,
    imagesAlternativesCheck,
} from '@/worker/scanner/checks/images'
import type {
    Check,
    CheckResult,
    Occurrence,
} from '@/worker/scanner/checks/types'

// Composition et exécution des checks automatiques RGAA. Les checks eux-mêmes
// vivent par famille : axe-checks (règles axe → critères), applicability
// (sujets absents → N/A), lang (8.3/8.4/8.8) et dom-checks (le reste du DOM).

export { AXE_RULES }
export type { CheckResult, Occurrence }

const ALL_CHECKS: Check[] = [
    applicabilityCheck,
    imagesAlternativesCheck,
    decorativeImagesCheck,
    frameTitleCheck,
    colorContrastCheck,
    autoplayCheck,
    layoutTablesCheck,
    axeRuleCheck({
        name: 'liens 6.2',
        ruleIds: ['link-name'],
        criterionId: '6.2',
        comment: (count) => `${count} lien(s) sans intitulé accessible`,
    }),
    doctypeCheck,
    duplicateIdsCheck,
    htmlLangCheck,
    pageTitleCheck,
    innerLangCheck,
    presentationalTagsCheck,
    readingDirectionCheck,
    headingHierarchyCheck,
    axeRuleCheck({
        name: 'listes 9.3',
        ruleIds: ['list', 'listitem', 'definition-list', 'dlitem'],
        criterionId: '9.3',
        comment: (count) =>
            `${count} liste(s) mal structurée(s) (contenu direct autre que li dans ul/ol, ou dl mal formée)`,
        // Le test officiel part des listes *visuelles* : une liste faite en <div>
        // échappe au DOM, on ne peut donc jamais conclure conforme.
        violationOnly: true,
    }),
    axeRuleCheck({
        name: 'zoom texte 10.4',
        ruleIds: ['meta-viewport'],
        criterionId: '10.4',
        comment: () =>
            'Le zoom du texte est bloqué par la balise meta viewport (user-scalable=no ou maximum-scale insuffisant)',
        violationOnly: true,
    }),
    axeRuleCheck({
        name: 'labels 11.1',
        ruleIds: ['label'],
        criterionId: '11.1',
        comment: (count) => `${count} champ(s) de formulaire sans label`,
    }),
    axeRuleCheck({
        name: 'intitulés de boutons 11.9',
        ruleIds: ['button-name'],
        criterionId: '11.9',
        comment: (count) => `${count} bouton(s) sans intitulé accessible`,
        // La pertinence d'un intitulé présent reste un jugement humain.
        violationOnly: true,
    }),
    requiredFieldsCheck,
    axeRuleCheck({
        name: 'autocomplétion 11.13',
        ruleIds: ['autocomplete-valid'],
        criterionId: '11.13',
        comment: (count) =>
            `${count} champ(s) avec une valeur d'attribut autocomplete invalide`,
        violationOnly: true,
    }),
    mainLandmarkCheck,
    skipLinkCheck,
    metaRefreshCheck,
    marqueeCheck,
]

// Deux checks peuvent viser le même critère (ex : axe conclut « conforme » sur
// 1.1 faute d'image quand l'applicabilité pose « non applicable ») : une
// violation prouvée l'emporte toujours, puis le N/A (sujet absent), puis le
// conforme, qui serait vide de sens sans sujet.
const STATUS_PRECEDENCE: Record<CheckResult['status'], number> = {
    non_conforme: 2,
    non_applicable: 1,
    conforme: 0,
}

// Exécute tous les checks sur une page déjà chargée. Chaque check est isolé dans
// son propre try/catch : un check qui plante (DOM inattendu, page exotique…) est
// loggué et ignoré, les autres continuent. Retourne au plus un verdict par
// critère (précédence ci-dessus).
export async function runChecks(
    page: Page,
    axeResults: AxeResults,
): Promise<CheckResult[]> {
    const byCriterion = new Map<string, CheckResult>()
    for (const check of ALL_CHECKS) {
        try {
            for (const result of await check.run({ page, axeResults })) {
                const existing = byCriterion.get(result.criterionId)
                if (
                    !existing ||
                    STATUS_PRECEDENCE[result.status] >
                        STATUS_PRECEDENCE[existing.status]
                ) {
                    byCriterion.set(result.criterionId, result)
                }
            }
        } catch (error) {
            console.error(`[worker] check "${check.name}" en échec :`, error)
        }
    }
    return [...byCriterion.values()]
}
