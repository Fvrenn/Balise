import type { PageLink } from '@/server/sample-detection/html'

// Pages que la méthodologie RGAA impose de retrouver dans l'échantillon. On les
// reconnaît sur deux signaux : le libellé du lien (fiable quand il existe) et le
// segment d'URL (fiable même quand le lien est une icône).

export interface MandatoryPageDefinition {
    key: string
    label: string
    // Une page requise manquante déclenche un avertissement au lancement de
    // l'audit ; les autres sont proposées seulement si le site les expose.
    isRequired: boolean
    textPattern: RegExp
    pathPattern: RegExp
}

export const MANDATORY_PAGES: readonly MandatoryPageDefinition[] = [
    {
        key: 'contact',
        label: 'Contact',
        isRequired: true,
        textPattern: /contact/i,
        pathPattern: /(^|\/)(nous[-_])?contact(e[rz]|s)?([-_]nous)?(\/|$|\.)/i,
    },
    {
        key: 'legal',
        label: 'Mentions légales',
        isRequired: true,
        textPattern: /mentions? l[ée]gales?|informations? l[ée]gales?/i,
        pathPattern: /(^|\/)(mentions?[-_]?l[ée]gales?|legal)(\/|$|\.)/i,
    },
    {
        key: 'privacy',
        label: 'Confidentialité',
        isRequired: true,
        textPattern:
            /confidentialit[ée]|(protection|traitement) des donn[ée]es|donn[ée]es personnelles|vie priv[ée]e|privacy|rgpd/i,
        pathPattern:
            /(^|\/)(politique[-_]?de[-_]?)?(confidentialite|protection[-_]?des[-_]?donnees|donnees[-_]?personnelles|vie[-_]?privee|privacy|rgpd)(\/|$|\.)/i,
    },
    {
        key: 'sitemap',
        label: 'Plan du site',
        isRequired: true,
        textPattern: /plan du site|sitemap/i,
        pathPattern: /(^|\/)(plan[-_]?(du[-_]?)?site|sitemap)(\/|$|\.)/i,
    },
    {
        key: 'accessibility',
        label: "Déclaration d'accessibilité",
        isRequired: true,
        textPattern: /accessibilit[ée]/i,
        pathPattern: /(^|\/)(declaration[-_]?d?[-_]?)?accessibilite(\/|$|\.)/i,
    },
    {
        key: 'help',
        label: 'Aide',
        isRequired: false,
        textPattern: /\baide\b|\bfaq\b|foire aux questions|centre d.aide/i,
        pathPattern: /(^|\/)(aide|faq|help|assistance)(\/|$|\.)/i,
    },
    {
        key: 'login',
        label: 'Connexion',
        isRequired: false,
        textPattern:
            /connexion|se connecter|s.identifier|espace client|mon compte/i,
        pathPattern:
            /(^|\/)(connexion|login|signin|se[-_]?connecter|mon[-_]?compte)(\/|$|\.)/i,
    },
    {
        key: 'search',
        label: 'Résultats de recherche',
        isRequired: false,
        textPattern: /rechercher|résultats de recherche/i,
        pathPattern: /(^|\/)(recherche|search|resultats)(\/|$|\.)/i,
    },
]

// Un libellé de navigation est court (« Contactez-nous ») ; un lien de contenu
// qui contient le même mot est une phrase (« Contacter le médiateur de la Ville
// de Lyon »). La longueur départage donc les deux quand l'URL ne dit rien.
const NAVIGATION_LABEL_MAX_LENGTH = 30

// Un lien correspond d'autant mieux que ses deux signaux concordent : on
// privilégie le libellé + l'URL, puis l'URL seule, puis un libellé de
// navigation, et en dernier un simple mot trouvé dans une phrase. Sans ce
// classement, un lien « Contacter le médiateur » du corps de page l'emporterait
// sur le « Contactez-nous » de l'en-tête.
function matchScore(link: PageLink, definition: MandatoryPageDefinition): number {
    let path: string
    try {
        path = new URL(link.url).pathname
    } catch {
        return 0
    }
    const matchesPath = definition.pathPattern.test(path)
    const matchesText = definition.textPattern.test(link.text)
    if (matchesPath && matchesText) return 4
    if (matchesPath) return 3
    if (!matchesText) return 0
    return link.text.length <= NAVIGATION_LABEL_MAX_LENGTH ? 2 : 1
}

// Meilleur candidat pour une page obligatoire parmi les liens collectés, ou null
// si le site ne semble pas l'exposer.
export function findMandatoryPage(
    links: PageLink[],
    definition: MandatoryPageDefinition,
): PageLink | null {
    let best: PageLink | null = null
    let bestScore = 0
    for (const link of links) {
        const score = matchScore(link, definition)
        if (score > bestScore) {
            best = link
            bestScore = score
        }
    }
    return best
}
