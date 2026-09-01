import {
    buildOccurrences,
    type CollectedElement,
} from '@/worker/scanner/checks/occurrences'
import type { Check } from '@/worker/scanner/checks/types'

// Checks DOM purs (page.evaluate), hors langue et images — un check par facette
// automatisable du référentiel.
// Contrainte : page.evaluate sérialise les callbacks vers le navigateur — ils
// doivent rester autonomes, sans fonction interne nommée. Les seuls appels
// autorisés sont les helpers injectés par SCANNER_INIT_SCRIPT (browser.ts),
// dont __baliseElementInfo qui décrit un élément fautif pour en faire une
// occurrence.

// 2.1 — Titre de cadre : le test 2.1.1 exige un attribut title sur chaque
// iframe/frame — un aria-label ne suffit pas pour le RGAA. Les cadres masqués
// (aria-hidden, hidden, display:none) sont ignorés (cadres techniques).
export const frameTitleCheck: Check = {
    name: 'titres de cadres 2.1',
    run: async ({ page }) => {
        const untitledFrames = await page.evaluate(() =>
            Array.from(document.querySelectorAll('iframe, frame'))
                .filter(
                    (frame) =>
                        frame.getAttribute('aria-hidden') !== 'true' &&
                        !frame.hasAttribute('hidden') &&
                        getComputedStyle(frame).display !== 'none' &&
                        (frame.getAttribute('title') ?? '').trim() === '',
                )
                .map((frame) =>
                    __baliseElementInfo(frame, {
                        Cadre: frame.tagName.toLowerCase(),
                        Source: frame.getAttribute('src') ?? 'aucun attribut src',
                    }),
                ),
        )
        if (untitledFrames.length > 0) {
            return [
                {
                    criterionId: '2.1',
                    status: 'non_conforme',
                    comment: `${untitledFrames.length} cadre(s) <iframe> sans attribut title (test 2.1.1 — l'attribut title est requis, un aria-label ne suffit pas)`,
                    occurrences: await buildOccurrences(page, untitledFrames),
                },
            ]
        }
        return [{ criterionId: '2.1', status: 'conforme' }]
    },
}

// 4.10 — Son déclenché automatiquement : un média en autoplay non muet doit
// exposer un contrôle utilisateur. Violation seulement (un player JS custom
// peut offrir des contrôles que le DOM ne révèle pas).
export const autoplayCheck: Check = {
    name: 'sons automatiques 4.10',
    run: async ({ page }) => {
        const noisyMedia = await page.evaluate(() =>
            Array.from(
                document.querySelectorAll<HTMLMediaElement>(
                    'audio[autoplay], video[autoplay]',
                ),
            )
                .filter((media) => !media.muted && !media.controls)
                .map((media) =>
                    __baliseElementInfo(media, {
                        Média: media.tagName.toLowerCase(),
                        Source:
                            media.getAttribute('src') ??
                            media
                                .querySelector('source')
                                ?.getAttribute('src') ??
                            'source définie en JavaScript',
                    }),
                ),
        )
        if (noisyMedia.length === 0) return []
        return [
            {
                criterionId: '4.10',
                status: 'non_conforme',
                comment: `${noisyMedia.length} média(s) en lecture automatique avec du son, sans contrôle utilisateur (autoplay sans controls ni muted)`,
                occurrences: await buildOccurrences(page, noisyMedia),
            },
        ]
    },
}

// 5.8 — Tableaux de mise en forme (test 5.8.1) : un tableau explicitement
// déclaré de présentation (role="presentation"/"none") ne doit porter ni
// attribut summary, ni éléments/attributs propres aux tableaux de données
// (caption, th, thead, tfoot, scope, headers, axis, role rowheader/columnheader).
// Violation seulement (identifier un tableau de mise en forme non déclaré
// demande un jugement humain).
export const layoutTablesCheck: Check = {
    name: 'tableaux de mise en forme 5.8',
    run: async ({ page }) => {
        const dataLikeTables = await page.evaluate(() => {
            const tables = Array.from(
                document.querySelectorAll(
                    'table[role="presentation"], table[role="none"]',
                ),
            )

            const collected: CollectedElement[] = []
            for (const table of tables) {
                const summary = (table.getAttribute('summary') ?? '').trim()
                const dataElement = table.querySelector(
                    'th, caption, thead, tfoot, [scope], [headers], [axis], [role="rowheader"], [role="columnheader"]',
                )
                if (summary === '' && !dataElement) continue

                const reasons: string[] = []
                if (summary !== '') {
                    reasons.push(`attribut summary (« ${summary.slice(0, 80)} »)`)
                }
                if (dataElement) {
                    reasons.push(`<${dataElement.tagName.toLowerCase()}>`)
                }
                collected.push(
                    __baliseElementInfo(table, {
                        'Role déclaré': table.getAttribute('role') ?? '',
                        'Marqueurs de tableau de données': reasons.join(', '),
                    }),
                )
            }
            return collected
        })
        if (dataLikeTables.length === 0) return []
        return [
            {
                criterionId: '5.8',
                status: 'non_conforme',
                comment: `${dataLikeTables.length} tableau(x) de mise en forme (role="presentation") utilisant des éléments ou attributs de tableau de données (summary, caption, th, thead, tfoot, scope, headers, axis ou role rowheader/columnheader) — test 5.8.1`,
                occurrences: await buildOccurrences(page, dataLikeTables),
            },
        ]
    },
}

// 8.1 — DOCTYPE absent ou invalide : seul <!DOCTYPE html> (HTML5, sans publicId
// ni systemId) est accepté.
export const doctypeCheck: Check = {
    name: 'doctype 8.1',
    run: async ({ page }) => {
        const doctype = await page.evaluate(() => {
            const node = document.doctype
            return node
                ? {
                      name: node.name,
                      publicId: node.publicId,
                      systemId: node.systemId,
                  }
                : null
        })
        if (!doctype) {
            return [
                {
                    criterionId: '8.1',
                    status: 'non_conforme',
                    comment: 'DOCTYPE absent du document',
                },
            ]
        }
        const isHtml5 =
            doctype.name.toLowerCase() === 'html' &&
            doctype.publicId === '' &&
            doctype.systemId === ''
        if (!isHtml5) {
            return [
                {
                    criterionId: '8.1',
                    status: 'non_conforme',
                    comment: `DOCTYPE non HTML5 détecté (${doctype.name}${doctype.publicId ? ` ${doctype.publicId}` : ''})`,
                },
            ]
        }
        return [{ criterionId: '8.1', status: 'conforme' }]
    },
}

// 8.2 — Code source valide : les ids dupliqués sont une invalidité objective.
// Violation seulement (la validité complète exige un validateur W3C).
export const duplicateIdsCheck: Check = {
    name: 'ids dupliqués 8.2',
    run: async ({ page }) => {
        const duplicates = await page.evaluate(() => {
            const groups = new Map<string, Element[]>()
            for (const element of Array.from(
                document.querySelectorAll('[id]'),
            )) {
                if (!element.id) continue
                const group = groups.get(element.id)
                if (group) group.push(element)
                else groups.set(element.id, [element])
            }

            const ids: string[] = []
            const collected: CollectedElement[] = []
            for (const [id, elements] of Array.from(groups.entries())) {
                if (elements.length < 2) continue
                ids.push(id)
                // On pointe le doublon, pas le premier porteur : c'est lui qui
                // est en trop dans le document.
                const duplicate = elements[1]
                if (!duplicate) continue
                collected.push(
                    __baliseElementInfo(duplicate, {
                        'Identifiant dupliqué': id,
                        Occurrences: `${elements.length} éléments portent cet id`,
                    }),
                )
            }
            return { ids, collected }
        })
        if (duplicates.ids.length === 0) return []
        const sample = duplicates.ids.slice(0, 5).join(', ')
        return [
            {
                criterionId: '8.2',
                status: 'non_conforme',
                comment: `${duplicates.ids.length} id dupliqué(s) dans le document (code source invalide) : ${sample}${duplicates.ids.length > 5 ? '…' : ''}`,
                occurrences: await buildOccurrences(page, duplicates.collected),
            },
        ]
    },
}

// 8.5 — Titre de page absent ou vide.
export const pageTitleCheck: Check = {
    name: 'titre 8.5',
    run: async ({ page }) => {
        const title = await page.evaluate(() => document.title)
        if (title.trim() === '') {
            return [
                {
                    criterionId: '8.5',
                    status: 'non_conforme',
                    comment: 'Titre de page (<title>) absent ou vide',
                },
            ]
        }
        return [{ criterionId: '8.5', status: 'conforme' }]
    },
}

// 8.9 — Balises utilisées à des fins de présentation (test 8.9.1) : les balises
// de présentation dépréciées n'ont jamais leur place (la mise en forme relève du
// CSS). <b> et <i> ne sont PAS dans la liste RGAA (ils gardent une sémantique en
// HTML5). Violation seulement : le détournement d'éléments sémantiques (div
// utilisé comme paragraphe, titre comme légende…) reste un jugement humain, on
// ne peut donc jamais conclure conforme.
export const presentationalTagsCheck: Check = {
    name: 'balises de présentation 8.9',
    run: async ({ page }) => {
        const deprecatedTags = await page.evaluate(() =>
            Array.from(
                document.querySelectorAll(
                    'basefont, big, blink, center, font, s, strike, tt, u',
                ),
            ).map((element) =>
                __baliseElementInfo(element, {
                    'Balise dépréciée': `<${element.tagName.toLowerCase()}>`,
                }),
            ),
        )
        if (deprecatedTags.length === 0) return []
        return [
            {
                criterionId: '8.9',
                status: 'non_conforme',
                comment: `${deprecatedTags.length} balise(s) de présentation dépréciée(s) détectée(s) (u, font, big, center, s, strike, tt, blink ou basefont) — la mise en forme relève du CSS (test 8.9.1)`,
                occurrences: await buildOccurrences(page, deprecatedTags),
            },
        ]
    },
}

// 8.10 — Sens de lecture : les valeurs de dir doivent être valides. "auto" est
// du HTML valide, on ne le signale pas. Violation seulement (un passage rtl non
// signalé est indétectable automatiquement).
export const readingDirectionCheck: Check = {
    name: 'sens de lecture 8.10',
    run: async ({ page }) => {
        const invalid = await page.evaluate(() => {
            const values: string[] = []
            const collected: CollectedElement[] = []
            for (const element of Array.from(
                document.querySelectorAll('[dir]'),
            )) {
                const value = element.getAttribute('dir') ?? ''
                if (['ltr', 'rtl', 'auto'].includes(value.toLowerCase())) {
                    continue
                }
                values.push(value)
                collected.push(
                    __baliseElementInfo(element, {
                        'Valeur de dir': value === '' ? '(vide)' : value,
                        'Valeurs attendues': 'ltr ou rtl',
                    }),
                )
            }
            return { values, collected }
        })
        if (invalid.values.length === 0) return []
        return [
            {
                criterionId: '8.10',
                status: 'non_conforme',
                comment: `${invalid.values.length} attribut(s) dir avec une valeur invalide (ex : "${invalid.values[0]}") — valeurs attendues : ltr ou rtl`,
                occurrences: await buildOccurrences(page, invalid.collected),
            },
        ]
    },
}

// 9.1 — Hiérarchie des titres (test 9.1.1) : pas de saut de niveau dans l'ordre
// du DOM (h1 → h3 sans h2 intermédiaire). Les titres ARIA (role="heading" +
// aria-level) comptent au même titre que les <hx> ; sans aria-level, le niveau
// implicite d'un role="heading" est 2 (spécification ARIA).
export const headingHierarchyCheck: Check = {
    name: 'hiérarchie des titres 9.1',
    run: async ({ page }) => {
        const skips = await page.evaluate(() => {
            const headings = Array.from(
                document.querySelectorAll(
                    'h1, h2, h3, h4, h5, h6, [role="heading"]',
                ),
            )
            const levels = headings.map((heading) => {
                const ariaLevel = Number(heading.getAttribute('aria-level'))
                if (Number.isInteger(ariaLevel) && ariaLevel >= 1) {
                    return ariaLevel
                }
                const tagLevel = Number(heading.tagName.charAt(1))
                return Number.isInteger(tagLevel) && tagLevel >= 1
                    ? tagLevel
                    : 2
            })
            const detected: { from: number; to: number }[] = []
            const collected: CollectedElement[] = []
            for (let i = 1; i < levels.length; i++) {
                const previous = levels[i - 1]
                const current = levels[i]
                const heading = headings[i]
                if (
                    previous === undefined ||
                    current === undefined ||
                    heading === undefined ||
                    current <= previous + 1
                ) {
                    continue
                }
                detected.push({ from: previous, to: current })
                collected.push(
                    __baliseElementInfo(heading, {
                        'Titre précédent': `h${previous}`,
                        'Niveau de ce titre': `h${current}`,
                        'Niveau attendu': `h${previous + 1} au plus`,
                    }),
                )
            }
            return { detected, collected }
        })
        if (skips.detected.length > 0) {
            const details = skips.detected
                .map((skip) => `h${skip.from} suivi de h${skip.to}`)
                .join(', ')
            return [
                {
                    criterionId: '9.1',
                    status: 'non_conforme',
                    comment: `Saut de niveau détecté : ${details}`,
                    occurrences: await buildOccurrences(page, skips.collected),
                },
            ]
        }
        return [{ criterionId: '9.1', status: 'conforme' }]
    },
}

// 11.10 — Contrôle de saisie (test 11.10.2) : un champ portant required ou
// aria-required doit annoncer visiblement son caractère obligatoire dans son
// étiquette ou le texte associé. Sans champ obligatoire, le check ne se
// prononce pas ; les autres tests du critère (messages d'erreur…) restent humains,
// donc violation seulement.
export const requiredFieldsCheck: Check = {
    name: 'champs obligatoires 11.10',
    run: async ({ page }) => {
        const unmarkedFields = await page.evaluate(() => {
            const selector = ['input', 'select', 'textarea']
                .flatMap((tag) => [
                    `${tag}[required]`,
                    `${tag}[aria-required="true"]`,
                ])
                .join(', ')
            const fields = Array.from(document.querySelectorAll(selector))

            const collected: CollectedElement[] = []
            for (const field of fields) {
                const texts: string[] = []
                const id = field.getAttribute('id')
                if (id) {
                    document
                        .querySelectorAll(`label[for="${CSS.escape(id)}"]`)
                        .forEach((label) => texts.push(label.textContent ?? ''))
                }
                const wrappingLabel = field.closest('label')
                if (wrappingLabel) texts.push(wrappingLabel.textContent ?? '')
                const ariaLabel = field.getAttribute('aria-label')
                if (ariaLabel) texts.push(ariaLabel)
                const labelledby = field.getAttribute('aria-labelledby')
                if (labelledby) {
                    for (const ref of labelledby.split(/\s+/)) {
                        const target = document.getElementById(ref)
                        if (target) texts.push(target.textContent ?? '')
                    }
                }
                const label = texts.join(' ').replace(/\s+/g, ' ').trim()
                const lowered = label.toLowerCase()
                if (
                    lowered.includes('*') ||
                    lowered.includes('obligatoire') ||
                    lowered.includes('requis') ||
                    lowered.includes('required')
                ) {
                    continue
                }

                collected.push(
                    __baliseElementInfo(field, {
                        Champ:
                            field.getAttribute('name') ??
                            id ??
                            field.tagName.toLowerCase(),
                        'Étiquette':
                            label === ''
                                ? 'aucune étiquette trouvée'
                                : `« ${label.slice(0, 120)} »`,
                        'Marqueur technique': field.hasAttribute('required')
                            ? 'required'
                            : 'aria-required="true"',
                    }),
                )
            }
            return collected
        })
        if (unmarkedFields.length === 0) return []
        return [
            {
                criterionId: '11.10',
                status: 'non_conforme',
                comment: `${unmarkedFields.length} champ(s) obligatoire(s) (required/aria-required) sans indication visible du caractère obligatoire dans leur étiquette (test 11.10.2)`,
                occurrences: await buildOccurrences(page, unmarkedFields),
            },
        ]
    },
}

// 12.6 — Zones de regroupement : l'absence de landmark main est une violation
// certaine ; sa seule présence ne prouve pas que toutes les zones (en-tête,
// navigation, pied de page…) sont atteignables — violation seulement.
export const mainLandmarkCheck: Check = {
    name: 'landmark main 12.6',
    run: async ({ page }) => {
        const hasMain = await page.evaluate(
            () => document.querySelector('main, [role="main"]') !== null,
        )
        if (hasMain) return []
        return [
            {
                criterionId: '12.6',
                status: 'non_conforme',
                comment:
                    'Zone de contenu principal non identifiable : aucun landmark main (<main> ou role="main") sur la page',
            },
        ]
    },
}

// 12.7 — Lien d'évitement : un des premiers liens de la page doit permettre de
// sauter au contenu ou à la navigation.
export const skipLinkCheck: Check = {
    name: "lien d'évitement 12.7",
    run: async ({ page }) => {
        const hasSkipLink = await page.evaluate(() => {
            const links = Array.from(
                document.querySelectorAll('a[href]'),
            ).slice(0, 10)
            const pattern = /contenu|navigation|skip|aller au/i
            return links.some((link) => {
                const text = `${link.textContent ?? ''} ${link.getAttribute('aria-label') ?? ''}`
                return pattern.test(text)
            })
        })
        if (!hasSkipLink) {
            return [
                {
                    criterionId: '12.7',
                    status: 'non_conforme',
                    comment:
                        "Aucun lien d'évitement (accès rapide au contenu ou à la navigation) détecté en début de page",
                },
            ]
        }
        return [{ criterionId: '12.7', status: 'conforme' }]
    },
}

// 13.1 — Limites de temps : un meta refresh à délai non nul (et < 20 h) sans
// mécanisme de contrôle est une violation (test 13.1.1). Une redirection à délai
// nul est, elle, validée (test 13.1.2). Les autres facettes (redirections script,
// sessions) ne sont pas automatisables — violation seulement.
export const metaRefreshCheck: Check = {
    name: 'meta refresh 13.1',
    run: async ({ page }) => {
        const refresh = await page.evaluate(() => {
            const meta = document.querySelector(
                'meta[http-equiv="refresh" i][content]',
            )
            if (!meta) return null
            const content = meta.getAttribute('content') ?? ''
            const delay = Number.parseFloat(content)
            return Number.isNaN(delay) ? null : { delay }
        })
        // 20 heures = seuil au-delà duquel le test 13.1.1 est validé d'office.
        const TWENTY_HOURS_S = 20 * 3600
        if (!refresh || refresh.delay === 0 || refresh.delay >= TWENTY_HOURS_S) {
            return []
        }
        return [
            {
                criterionId: '13.1',
                status: 'non_conforme',
                comment: `Rafraîchissement ou redirection automatique via <meta http-equiv="refresh"> avec un délai de ${refresh.delay}s, sans mécanisme de contrôle (test 13.1.1)`,
            },
        ]
    },
}

// 13.8 — Contenu en mouvement ou clignotant (tests 13.8.1 et 13.8.2) :
// <marquee> défile et <blink> clignote sans aucun mécanisme d'arrêt. Violation
// seulement (les animations CSS/JS ne sont pas détectées).
export const marqueeCheck: Check = {
    name: 'contenu en mouvement 13.8',
    run: async ({ page }) => {
        const movingElements = await page.evaluate(() =>
            Array.from(document.querySelectorAll('marquee, blink')).map(
                (element) =>
                    __baliseElementInfo(element, {
                        Balise: `<${element.tagName.toLowerCase()}>`,
                    }),
            ),
        )
        if (movingElements.length === 0) return []
        return [
            {
                criterionId: '13.8',
                status: 'non_conforme',
                comment: `${movingElements.length} élément(s) <marquee> ou <blink> détecté(s) : contenu en mouvement ou clignotant sans mécanisme de contrôle (tests 13.8.1 et 13.8.2)`,
                occurrences: await buildOccurrences(page, movingElements),
            },
        ]
    },
}
