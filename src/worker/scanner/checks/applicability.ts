import type { Check, CheckResult } from '@/worker/scanner/checks/types'

// Applicabilité : familles de critères sans sujet sur la page. L'absence de
// sujet est un fait objectif du DOM : sans tableau, les critères de la
// thématique 5 sont non applicables pour cette page (méthodologie RGAA).
// Périmètre volontairement limité au niveau *page* : les critères de niveau site
// (12.x navigation, plan du site…) ne sont jamais posés N/A automatiquement.

interface ApplicabilityFamily {
    name: string
    // Présence d'UN SEUL élément correspondant = la famille s'applique, on ne
    // pose rien ; zéro élément = toute la famille passe non applicable.
    selector: string
    criterionIds: readonly string[]
    comment: string
}

const APPLICABILITY_FAMILIES: readonly ApplicabilityFamily[] = [
    {
        name: 'images',
        // Le RGAA range aussi dans les images : les objets/embarqués de type
        // image (tests 1.1.6/1.1.7) et les canvas (test 1.1.8).
        selector:
            'img, svg, area, input[type="image"], [role="img"], canvas, object[type^="image/"], embed[type^="image/"]',
        criterionIds: ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9'],
        comment: 'Aucune image sur la page (posé automatiquement par le scan)',
    },
    {
        name: 'cadres',
        selector: 'iframe, frame',
        criterionIds: ['2.1', '2.2'],
        comment: 'Aucun cadre (iframe) sur la page (posé automatiquement par le scan)',
    },
    {
        name: 'multimédia',
        // Les object/embed de type image relèvent de la thématique 1 (images),
        // pas du multimédia.
        selector:
            'audio, video, object:not([type^="image/"]), embed:not([type^="image/"])',
        criterionIds: [
            '4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8', '4.9',
            '4.10', '4.11', '4.12', '4.13',
        ],
        comment:
            'Aucun média (audio, vidéo, objet embarqué) sur la page (posé automatiquement par le scan)',
    },
    {
        name: 'tableaux',
        selector: 'table, [role="table"], [role="grid"]',
        criterionIds: ['5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8'],
        comment: 'Aucun tableau sur la page (posé automatiquement par le scan)',
    },
    {
        name: 'formulaires',
        selector:
            'input, select, textarea, button, [role="textbox"], [role="combobox"], [role="checkbox"], [role="radio"], [role="button"]',
        criterionIds: [
            '11.1', '11.2', '11.3', '11.4', '11.5', '11.6', '11.7', '11.8',
            '11.9', '11.10', '11.11', '11.12', '11.13',
        ],
        comment:
            'Aucun champ de formulaire ni bouton sur la page (posé automatiquement par le scan)',
    },
]

export const applicabilityCheck: Check = {
    name: 'applicabilité (sujets absents)',
    run: async ({ page }) => {
        const selectors = APPLICABILITY_FAMILIES.map(
            (family) => family.selector,
        )
        const isPresent = await page.evaluate(
            (familySelectors: string[]) =>
                familySelectors.map(
                    (selector) => document.querySelector(selector) !== null,
                ),
            selectors,
        )
        const results: CheckResult[] = []
        APPLICABILITY_FAMILIES.forEach((family, index) => {
            if (isPresent[index]) return
            for (const criterionId of family.criterionIds) {
                results.push({
                    criterionId,
                    status: 'non_applicable',
                    comment: family.comment,
                })
            }
        })
        return results
    },
}
