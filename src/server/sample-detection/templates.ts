// Détection des pages « gabarit » : les pages représentatives d'un composant
// dont l'accessibilité se joue sur des critères précis (carrousel, carte,
// formulaire, vidéo, tableau de données). Une signature se lit dans le HTML
// servi — un composant monté uniquement en JavaScript échappe à la détection,
// l'auditrice complète alors l'échantillon à la main.

export interface TemplateSignature {
    key: string
    label: string
    matches: (html: string) => boolean
}

// Les bibliothèques de carrousel se trahissent toutes par leur nom de classe.
const CAROUSEL_PATTERN =
    /class\s*=\s*["'][^"']*\b(carousel|slider|swiper|slick|glide|splide|flickity)\b/i

const MAP_PATTERN =
    /leaflet|mapbox|maps\.google\.[a-z.]+\/|google\.[a-z.]+\/maps|openstreetmap|<div[^>]+\bid\s*=\s*["']map["']/i

const VIDEO_PATTERN =
    /<video\b|youtube(-nocookie)?\.com\/embed|player\.vimeo\.com|dailymotion\.com\/embed/i

// Un <table> de mise en forme ne fait pas un gabarit « tableau de données » :
// on exige un marqueur d'en-tête.
const DATA_TABLE_PATTERN = /<table\b[\s\S]{0,4000}?<(th|caption|thead)\b/i

// Un formulaire de recherche seul ne justifie pas une page gabarit : on demande
// au moins trois champs, ce qui caractérise un vrai formulaire de saisie.
function hasRichForm(html: string): boolean {
    for (const form of html.matchAll(/<form\b[\s\S]*?<\/form>/gi)) {
        const fields = form[0].match(/<(input|select|textarea)\b/gi) ?? []
        const visibleFields = fields.filter(
            (field) => !/type\s*=\s*["']?hidden/i.test(field),
        )
        if (visibleFields.length >= 3) return true
    }
    return false
}

export const TEMPLATE_SIGNATURES: readonly TemplateSignature[] = [
    {
        key: 'carousel',
        label: 'Gabarit — Carrousel',
        matches: (html) => CAROUSEL_PATTERN.test(html),
    },
    {
        key: 'map',
        label: 'Gabarit — Carte interactive',
        matches: (html) => MAP_PATTERN.test(html),
    },
    {
        key: 'form',
        label: 'Gabarit — Formulaire',
        matches: hasRichForm,
    },
    {
        key: 'video',
        label: 'Gabarit — Vidéo',
        matches: (html) => VIDEO_PATTERN.test(html),
    },
    {
        key: 'table',
        label: 'Gabarit — Tableau de données',
        matches: (html) => DATA_TABLE_PATTERN.test(html),
    },
]
