import type { Page } from 'playwright'
import type { AxeResults, NodeResult } from 'axe-core'

import type { Occurrence } from '@/worker/scanner/checks/types'

// Construction des occurrences : à partir d'un élément fautif (nœud axe ou
// sélecteur maison), produire un repère exploitable par l'auditrice — où se
// trouve l'élément dans la page, ce qu'il contient, et les preuves du check.

// Une non-conformité récurrente (un même défaut sur tout un menu) ne doit pas
// noyer la grille : au-delà, le commentaire du check porte déjà le compte total.
export const MAX_OCCURRENCES = 5

const MAX_HTML_LENGTH = 300
const MAX_TEXT_LENGTH = 140
const MAX_LANDMARK_LENGTH = 80

function truncate(value: string, maxLength: number): string {
    const normalized = value.replace(/\s+/g, ' ').trim()
    if (normalized.length <= maxLength) return normalized
    return `${normalized.slice(0, maxLength - 1)}…`
}

// axe exprime sa cible comme une liste de sélecteurs (un par niveau d'iframe
// traversé) : le dernier désigne l'élément lui-même dans son document.
function axeSelector(node: NodeResult): string {
    const flat = ([] as unknown[])
        .concat(...(node.target as unknown[]))
        .filter((part): part is string => typeof part === 'string')
    return flat[flat.length - 1] ?? ''
}

// Contexte de situation résolu dans le navigateur : texte visible et repère de
// position. Un seul aller-retour pour tous les sélecteurs d'un même check.
interface ResolvedContext {
    text: string | null
    landmark: string | null
}

async function resolveContexts(
    page: Page,
    selectors: string[],
): Promise<ResolvedContext[]> {
    if (selectors.length === 0) return []
    return page.evaluate((targets: string[]): ResolvedContext[] => {
        const LANDMARK_LABELS: [string, string][] = [
            ['main, [role="main"]', 'Contenu principal'],
            ['header, [role="banner"]', 'En-tête'],
            ['footer, [role="contentinfo"]', 'Pied de page'],
            ['nav, [role="navigation"]', 'Navigation'],
            ['aside, [role="complementary"]', 'Contenu annexe'],
            ['form, [role="form"]', 'Formulaire'],
        ]
        // Un landmark nommé (aria-label) lève l'ambiguïté quand la page en compte
        // plusieurs du même type — « Navigation : fil d'Ariane » plutôt que « Navigation ».
        const nameOf = (element: Element) => {
            const label = (element.getAttribute('aria-label') ?? '').trim()
            return label === '' ? null : label
        }
        // À défaut de landmark, le titre de section qui précède situe presque
        // aussi bien l'élément dans la page.
        const previousHeading = (element: Element) => {
            const headings = Array.from(
                document.querySelectorAll('h1, h2, h3, h4, h5, h6'),
            )
            let found: string | null = null
            for (const heading of headings) {
                const position = heading.compareDocumentPosition(element)
                if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
                    const title = (
                        heading instanceof HTMLElement
                            ? heading.innerText
                            : (heading.textContent ?? '')
                    ).trim()
                    if (title !== '') found = title
                }
            }
            return found
        }

        return targets.map((selector) => {
            let element: Element | null = null
            try {
                element = document.querySelector(selector)
            } catch {
                element = null
            }
            if (!element) return { text: null, landmark: null }

            // innerText rend le texte tel qu'il s'affiche : un <br> devient un
            // espace là où textContent collerait les mots entre eux.
            const text = (
                element instanceof HTMLElement
                    ? element.innerText
                    : (element.textContent ?? '')
            ).trim()
            let landmark: string | null = null
            for (const [candidate, label] of LANDMARK_LABELS) {
                const container = element.closest(candidate)
                if (!container) continue
                const name = nameOf(container)
                landmark = name === null ? label : `${label} : ${name}`
                break
            }
            if (landmark === null) {
                const heading = previousHeading(element)
                if (heading !== null) landmark = `Section « ${heading} »`
            }
            return { text: text === '' ? null : text, landmark }
        })
    }, selectors)
}

// Élément fautif tel que le navigateur le décrit, avant enrichissement côté
// worker. C'est le format que rend __baliseElementInfo, et celui qu'attend
// buildOccurrences — les checks DOM et les nœuds axe convergent dessus.
export type CollectedElement = {
    selector: string
    html: string
    details?: Record<string, string>
}

declare global {
    // Injecté dans chaque page analysée par SCANNER_INIT_SCRIPT (browser.ts).
    // page.evaluate sérialise ses callbacks : ils ne peuvent capturer aucune
    // fonction du worker, d'où ce global.
    function __baliseElementInfo(
        element: Element,
        details?: Record<string, string>,
    ): CollectedElement
}

// Occurrences à partir d'éléments déjà identifiés par un sélecteur — checks DOM
// maison comme nœuds axe passent par ici, la résolution du contexte est commune.
export async function buildOccurrences(
    page: Page,
    elements: CollectedElement[],
): Promise<Occurrence[]> {
    const capped = elements.filter((element) => element.selector !== '').slice(0, MAX_OCCURRENCES)
    const contexts = await resolveContexts(
        page,
        capped.map((element) => element.selector),
    )

    return capped.map((element, index) => {
        const context = contexts[index]
        const occurrence: Occurrence = {
            selector: element.selector,
            html: truncate(element.html, MAX_HTML_LENGTH),
        }
        const text = context?.text
        if (text) occurrence.text = truncate(text, MAX_TEXT_LENGTH)
        if (context?.landmark) {
            occurrence.landmark = truncate(context.landmark, MAX_LANDMARK_LENGTH)
        }
        if (element.details) occurrence.details = element.details
        return occurrence
    })
}

// Occurrences issues des violations axe d'une ou plusieurs règles. `detailsOf`
// extrait les preuves propres à la règle (couleurs et ratio pour le contraste,
// rien pour la plupart des autres).
export async function axeOccurrences(input: {
    page: Page
    axeResults: AxeResults
    ruleIds: readonly string[]
    detailsOf?: (node: NodeResult) => Record<string, string> | undefined
}): Promise<Occurrence[]> {
    const nodes = input.ruleIds.flatMap(
        (ruleId) =>
            input.axeResults.violations.find(
                (violation) => violation.id === ruleId,
            )?.nodes ?? [],
    )
    return buildOccurrences(
        input.page,
        nodes.map((node) => ({
            selector: axeSelector(node),
            html: node.html,
            details: input.detailsOf?.(node),
        })),
    )
}
