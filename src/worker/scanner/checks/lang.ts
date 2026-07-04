import type { Check, CheckResult } from '@/worker/scanner/checks/types'

// Checks de langue (critères 8.3, 8.4, 8.8) et validation des codes BCP47.

// Codes ISO 639-1 courants — suffisant pour valider le sous-tag primaire d'un code
// BCP47 sur les sites audités (sites français et internationaux usuels).
const ISO_639_1_CODES = new Set([
    'aa', 'ab', 'af', 'am', 'ar', 'az', 'be', 'bg', 'bn', 'br', 'bs', 'ca',
    'co', 'cs', 'cy', 'da', 'de', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa',
    'fi', 'fo', 'fr', 'ga', 'gd', 'gl', 'he', 'hi', 'hr', 'hu', 'hy', 'id',
    'is', 'it', 'ja', 'ka', 'kk', 'km', 'ko', 'ku', 'ky', 'la', 'lb', 'lt',
    'lv', 'mk', 'mn', 'ms', 'mt', 'nb', 'ne', 'nl', 'nn', 'no', 'oc', 'pl',
    'ps', 'pt', 'ro', 'ru', 'sk', 'sl', 'sq', 'sr', 'sv', 'sw', 'ta', 'th',
    'tr', 'uk', 'ur', 'uz', 'vi', 'zh',
])

// Forme générale d'un code BCP47 : sous-tag primaire de 2-3 lettres puis des
// sous-tags alphanumériques de 1 à 8 caractères séparés par des tirets.
const BCP47_PATTERN = /^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{1,8})*$/

function isValidLang(lang: string): boolean {
    if (!BCP47_PATTERN.test(lang)) return false
    const primary = lang.split('-')[0]?.toLowerCase() ?? ''
    return ISO_639_1_CODES.has(primary)
}

// 8.3 — lang absent sur <html> / 8.4 — lang présent mais invalide. Un seul
// passage DOM pour les deux critères : 8.4 ne se prononce que si lang existe.
// Le test 8.3.1 accepte lang et/ou xml:lang (XHTML).
export const htmlLangCheck: Check = {
    name: 'lang 8.3/8.4',
    run: async ({ page }) => {
        const lang = await page.evaluate(
            () =>
                document.documentElement.getAttribute('lang') ??
                document.documentElement.getAttribute('xml:lang') ??
                '',
        )
        const trimmed = lang.trim()
        if (trimmed === '') {
            return [
                {
                    criterionId: '8.3',
                    status: 'non_conforme',
                    comment:
                        'Attribut lang (ou xml:lang) absent ou vide sur <html> (test 8.3.1)',
                },
            ]
        }
        const results: CheckResult[] = [
            { criterionId: '8.3', status: 'conforme' },
        ]
        if (isValidLang(trimmed)) {
            results.push({ criterionId: '8.4', status: 'conforme' })
        } else {
            results.push({
                criterionId: '8.4',
                status: 'non_conforme',
                comment: `Valeur de l'attribut lang invalide : "${trimmed}" (code BCP47 attendu, ex : "fr", "en-US")`,
            })
        }
        return results
    },
}

// 8.8 — Changements de langue : les codes lang posés sur des éléments internes
// doivent être valides. Violation seulement (la *pertinence* du code reste
// humaine, et l'absence de lang sur un passage étranger est indétectable).
export const innerLangCheck: Check = {
    name: 'changements de langue 8.8',
    run: async ({ page }) => {
        const langs = await page.evaluate(() =>
            Array.from(document.querySelectorAll('[lang]'))
                .filter((element) => element !== document.documentElement)
                .map((element) => element.getAttribute('lang') ?? ''),
        )
        const invalid = langs.filter(
            (lang) => lang.trim() !== '' && !isValidLang(lang.trim()),
        )
        if (invalid.length === 0) return []
        return [
            {
                criterionId: '8.8',
                status: 'non_conforme',
                comment: `${invalid.length} changement(s) de langue avec un code invalide (ex : "${invalid[0]}")`,
            },
        ]
    },
}
