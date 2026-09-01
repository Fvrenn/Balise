import { countViolations } from '@/worker/scanner/checks/axe-checks'
import {
    axeOccurrences,
    buildOccurrences,
    MAX_OCCURRENCES,
    type CollectedElement,
} from '@/worker/scanner/checks/occurrences'
import type { Check } from '@/worker/scanner/checks/types'

// Facettes de 1.1 couvertes par axe ; les autres (svg sans role,
// object/embed/canvas) sont détectées en page.evaluate et désignent leur
// élément fautif elles-mêmes.
const IMAGE_AXE_RULES = [
    'image-alt',
    'role-img-alt',
    'area-alt',
    'input-image-alt',
    'svg-img-alt',
] as const

// Critères 1.1 et 1.2 suivant la méthodologie officielle (docs/RGAA.md).
// Le verdict reste au niveau du critère, mais il n'est « conforme » que si TOUS
// les sous-tests applicables passent. Les sujets présents mais dont le caractère
// informatif/décoratif relève du jugement humain (svg nu, canvas sans repli…)
// empêchent le scanner de conclure : il ne pose alors aucun verdict.

interface ImageDomFindings {
    // 1.1.5 — svg porteur d'une alternative (title, aria-label…) mais sans
    // role="img" : le test exige les deux conditions.
    svgMissingRole: number
    // 1.1.6 / 1.1.7 / 1.1.8 — object/embed image ou canvas clairement informatif
    // (alternative textuelle présente) mais sans role="img" ni alternative
    // adjacente ou de repli.
    objectViolations: number
    embedViolations: number
    canvasViolations: number
    // Sujets dont le caractère informatif est invérifiable automatiquement
    // (img[ismap] — test 1.1.4, svg/canvas/object nus) : on ne conclut pas.
    undeterminedCount: number
    // Éléments fautifs des facettes ci-dessus, pour les situer dans la page.
    elements: CollectedElement[]
}

const imagesAlternativesCheck: Check = {
    name: 'images 1.1 (tests 1.1.1 à 1.1.8)',
    run: async ({ page, axeResults }) => {
        // Facettes couvertes par axe : img (1.1.1), [role="img"] (1.1.1),
        // area (1.1.2), input image (1.1.3), svg role="img" (1.1.5).
        const axeCounts = {
            img: countViolations(axeResults, ['image-alt']),
            roleImg: countViolations(axeResults, ['role-img-alt']),
            area: countViolations(axeResults, ['area-alt']),
            inputImage: countViolations(axeResults, ['input-image-alt']),
            svg: countViolations(axeResults, ['svg-img-alt']),
        }

        const dom = await page.evaluate((): ImageDomFindings => {
            const hasTextAlternative = (element: Element) =>
                (element.getAttribute('aria-label') ?? '').trim() !== '' ||
                element.hasAttribute('aria-labelledby') ||
                (element.getAttribute('title') ?? '').trim() !== ''
            const isDeclaredDecorative = (element: Element) =>
                element.getAttribute('aria-hidden') === 'true' ||
                ['presentation', 'none'].includes(
                    element.getAttribute('role') ?? '',
                )
            // « Immédiatement suivi d'un lien ou bouton adjacent » (1.1.6 à 1.1.8).
            const hasAdjacentAlternative = (element: Element) =>
                element.nextElementSibling?.matches('a[href], button') ?? false
            const hasFallbackContent = (element: Element) =>
                (element.textContent ?? '').trim().length > 0

            const findings: ImageDomFindings = {
                svgMissingRole: 0,
                objectViolations: 0,
                embedViolations: 0,
                canvasViolations: 0,
                undeterminedCount: 0,
                elements: [],
            }

            // 1.1.4 — image réactive serveur : l'existence d'un mécanisme
            // alternatif (liste de liens équivalents) n'est pas détectable.
            findings.undeterminedCount +=
                document.querySelectorAll('img[ismap]').length

            // 1.1.5 — svg : un svg informatif doit porter role="img" ET une
            // alternative. Ceux avec role="img" sont vérifiés par axe ; un svg
            // nommé sans role est une violation ; un svg nu est indéterminable
            // (sauf déclaré décoratif ou icône dans un lien/bouton déjà nommé).
            for (const svg of Array.from(document.querySelectorAll('svg'))) {
                if (isDeclaredDecorative(svg)) continue
                if (svg.closest('a[href], button, [role="button"]')) continue
                if (svg.getAttribute('role') === 'img') continue
                const hasSvgTitle = Array.from(svg.children).some(
                    (child) =>
                        child.tagName.toLowerCase() === 'title' &&
                        (child.textContent ?? '').trim() !== '',
                )
                if (hasTextAlternative(svg) || hasSvgTitle) {
                    findings.svgMissingRole += 1
                    findings.elements.push(
                        __baliseElementInfo(svg, {
                            Élément: '<svg>',
                            Test: '1.1.5',
                            Problème:
                                'alternative textuelle présente, mais role="img" absent',
                        }),
                    )
                } else {
                    findings.undeterminedCount += 1
                }
            }

            // 1.1.6 / 1.1.7 / 1.1.8 — object/embed image et canvas : validés par
            // role="img" + alternative, un contenu de repli (object/canvas) ou un
            // lien/bouton adjacent. Nommés sans rien de tout ça = violation ;
            // muets = indéterminable (informatif ou décoratif ?).
            const embeddedSubjects: {
                selector: string
                allowsFallback: boolean
                test: string
                key: 'objectViolations' | 'embedViolations' | 'canvasViolations'
            }[] = [
                {
                    selector: 'object[type^="image/"]',
                    allowsFallback: true,
                    test: '1.1.6',
                    key: 'objectViolations',
                },
                {
                    selector: 'embed[type^="image/"]',
                    allowsFallback: false,
                    test: '1.1.7',
                    key: 'embedViolations',
                },
                {
                    selector: 'canvas',
                    allowsFallback: true,
                    test: '1.1.8',
                    key: 'canvasViolations',
                },
            ]
            for (const subject of embeddedSubjects) {
                for (const element of Array.from(
                    document.querySelectorAll(subject.selector),
                )) {
                    if (isDeclaredDecorative(element)) continue
                    if (element.getAttribute('role') === 'img') {
                        // Avec alternative : validé. Sans : axe role-img-alt le signale.
                        continue
                    }
                    if (subject.allowsFallback && hasFallbackContent(element)) {
                        continue
                    }
                    if (hasAdjacentAlternative(element)) continue
                    if (hasTextAlternative(element)) {
                        findings[subject.key] += 1
                        findings.elements.push(
                            __baliseElementInfo(element, {
                                Élément: `<${element.tagName.toLowerCase()}>`,
                                Test: subject.test,
                                Problème:
                                    'alternative textuelle non exposée : ni role="img", ni contenu de repli, ni lien ou bouton adjacent',
                            }),
                        )
                    } else {
                        findings.undeterminedCount += 1
                    }
                }
            }

            return findings
        })

        const violations: string[] = []
        if (axeCounts.img > 0) {
            violations.push(
                `${axeCounts.img} image(s) <img> sans alternative textuelle (test 1.1.1)`,
            )
        }
        if (axeCounts.roleImg > 0) {
            violations.push(
                `${axeCounts.roleImg} élément(s) role="img" sans alternative textuelle (test 1.1.1)`,
            )
        }
        if (axeCounts.area > 0) {
            violations.push(
                `${axeCounts.area} zone(s) <area> sans alternative textuelle (test 1.1.2)`,
            )
        }
        if (axeCounts.inputImage > 0) {
            violations.push(
                `${axeCounts.inputImage} bouton(s) image (<input type="image">) sans alternative textuelle (test 1.1.3)`,
            )
        }
        if (axeCounts.svg > 0) {
            violations.push(
                `${axeCounts.svg} <svg role="img"> sans alternative textuelle (test 1.1.5)`,
            )
        }
        if (dom.svgMissingRole > 0) {
            violations.push(
                `${dom.svgMissingRole} <svg> porteur(s) d'une alternative textuelle mais sans role="img" (test 1.1.5)`,
            )
        }
        if (dom.objectViolations > 0) {
            violations.push(
                `${dom.objectViolations} image(s) objet (<object type="image/…">) sans alternative valide (test 1.1.6)`,
            )
        }
        if (dom.embedViolations > 0) {
            violations.push(
                `${dom.embedViolations} image(s) embarquée(s) (<embed type="image/…">) sans alternative valide (test 1.1.7)`,
            )
        }
        if (dom.canvasViolations > 0) {
            violations.push(
                `${dom.canvasViolations} image(s) bitmap (<canvas>) sans alternative valide (test 1.1.8)`,
            )
        }

        if (violations.length > 0) {
            return [
                {
                    criterionId: '1.1',
                    status: 'non_conforme',
                    comment: violations.join(' ; '),
                    occurrences: [
                        ...(await axeOccurrences({
                            page,
                            axeResults,
                            ruleIds: IMAGE_AXE_RULES,
                        })),
                        ...(await buildOccurrences(page, dom.elements)),
                    ].slice(0, MAX_OCCURRENCES),
                },
            ]
        }
        // Des sujets restent à qualifier humainement : ne rien conclure plutôt
        // qu'un « conforme » non prouvé.
        if (dom.undeterminedCount > 0) return []
        return [{ criterionId: '1.1', status: 'conforme' }]
    },
}

// 1.2 — Images de décoration correctement ignorées (tests 1.2.1 à 1.2.6) : une
// image déclarée décorative (alt="", role="presentation"/"none" ou
// aria-hidden="true") ne doit porter aucune alternative textuelle — ni
// aria-label/aria-labelledby/title (1.2.1/1.2.2), ni <title>/<desc> ou attribut
// title chez un svg (1.2.4), ni contenu de repli textuel chez object/canvas
// (1.2.3/1.2.5) — contradiction pour les lecteurs d'écran. Sans image déclarée
// décorative, le check ne se prononce pas (le caractère décoratif d'une image
// non déclarée relève du jugement humain).
const decorativeImagesCheck: Check = {
    name: 'images décoratives 1.2 (tests 1.2.1 à 1.2.6)',
    run: async ({ page }) => {
        const { declaredCount, misused } = await page.evaluate(() => {
            const declared = Array.from(
                document.querySelectorAll(
                    'img[alt=""], img[role="presentation"], img[role="none"], img[aria-hidden="true"], area:not([href]), svg[aria-hidden="true"], canvas[aria-hidden="true"], object[type^="image/"][aria-hidden="true"], embed[type^="image/"][aria-hidden="true"]',
                ),
            )

            const misused: CollectedElement[] = []
            for (const element of declared) {
                const reasons: string[] = []
                if (element.hasAttribute('aria-label')) reasons.push('aria-label')
                if (element.hasAttribute('aria-labelledby')) {
                    reasons.push('aria-labelledby')
                }
                if ((element.getAttribute('title') ?? '').trim() !== '') {
                    reasons.push('attribut title')
                }
                if (element.getAttribute('role') === 'img') {
                    reasons.push('role="img"')
                }

                const tag = element.tagName.toLowerCase()
                if (
                    tag === 'area' &&
                    (element.getAttribute('alt') ?? '').trim() !== ''
                ) {
                    reasons.push('attribut alt renseigné')
                }
                if (tag === 'svg') {
                    // 1.2.4 : un svg décoratif ne doit contenir ni <title>/<desc>
                    // renseignés ni attribut title sur ses enfants.
                    const hasNamedChild = Array.from(
                        element.querySelectorAll('title, desc'),
                    ).some((child) => (child.textContent ?? '').trim() !== '')
                    if (hasNamedChild) reasons.push('<title> ou <desc> renseigné')
                    if (element.querySelector('[title]')) {
                        reasons.push('attribut title sur un enfant')
                    }
                }
                if (
                    (tag === 'canvas' || tag === 'object') &&
                    (element.textContent ?? '').trim() !== ''
                ) {
                    // 1.2.3 / 1.2.5 : pas de texte faisant office d'alternative
                    // entre les balises d'une image décorative.
                    reasons.push('contenu de repli textuel')
                }

                if (reasons.length === 0) continue
                misused.push(
                    __baliseElementInfo(element, {
                        Élément: `<${tag}>`,
                        'Déclarée décorative par':
                            element.getAttribute('aria-hidden') === 'true'
                                ? 'aria-hidden="true"'
                                : (element.getAttribute('role') ??
                                  'alt="" ou absence de href'),
                        'Alternatives en contradiction': reasons.join(', '),
                    }),
                )
            }
            return { declaredCount: declared.length, misused }
        })
        if (declaredCount === 0) return []
        if (misused.length > 0) {
            return [
                {
                    criterionId: '1.2',
                    status: 'non_conforme',
                    comment: `${misused.length} image(s) déclarée(s) décorative(s) (alt="", role="presentation" ou aria-hidden) portant aussi une alternative textuelle (aria-label, aria-labelledby, title ou <title>/<desc>) — tests 1.2.1 à 1.2.6`,
                    occurrences: await buildOccurrences(page, misused),
                },
            ]
        }
        return [{ criterionId: '1.2', status: 'conforme' }]
    },
}

export { decorativeImagesCheck, imagesAlternativesCheck }
