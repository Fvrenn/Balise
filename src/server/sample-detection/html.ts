// Extraction des liens d'une page sans DOM ni dépendance : la détection n'a
// besoin que du couple (URL, texte du lien), ce qu'une lecture des balises <a>
// suffit à donner. Un vrai parseur ne changerait rien au résultat ici.

const ANCHOR_PATTERN = /<a\b[^>]*\bhref\s*=\s*("[^"]*"|'[^']*'|[^\s">]+)[^>]*>([\s\S]*?)<\/a>/gi
const SITEMAP_LOCATION_PATTERN = /<loc>\s*([^<\s]+)\s*<\/loc>/gi

export interface PageLink {
    url: string
    text: string
}

function unquote(value: string): string {
    const trimmed = value.trim()
    if (
        (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
        return trimmed.slice(1, -1)
    }
    return trimmed
}

// Texte visible d'un lien : on retire le balisage interne (icônes, <span>) et on
// normalise les espaces pour pouvoir comparer à un libellé attendu.
export function stripTags(html: string): string {
    return html
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&#39;|&apos;/gi, "'")
        .replace(/\s+/g, ' ')
        .trim()
}

// Deux URL qui ne diffèrent que par leur ancre ou leur slash final désignent la
// même page : sans cette normalisation l'échantillon contiendrait des doublons.
export function canonicalizeUrl(url: URL): string {
    url.hash = ''
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
        url.pathname = url.pathname.slice(0, -1)
    }
    return url.toString()
}

// Liens internes d'une page, dédoublonnés. Les liens sortants, les ancres et les
// schémas non navigables (mailto:, tel:, javascript:) sont écartés.
export function extractInternalLinks(html: string, baseUrl: URL): PageLink[] {
    const links = new Map<string, PageLink>()

    for (const match of html.matchAll(ANCHOR_PATTERN)) {
        const rawHref = unquote(match[1] ?? '')
        if (rawHref === '' || rawHref.startsWith('#')) continue

        let resolved: URL
        try {
            resolved = new URL(rawHref, baseUrl)
        } catch {
            continue
        }
        if (resolved.protocol !== 'http:' && resolved.protocol !== 'https:') {
            continue
        }
        if (resolved.hostname !== baseUrl.hostname) continue

        const canonical = canonicalizeUrl(resolved)
        const text = stripTags(match[2] ?? '')
        const existing = links.get(canonical)
        // Un même lien apparaît souvent deux fois (menu + pied de page), parfois
        // sans libellé la première fois : on garde la version qui en a un.
        if (!existing || (existing.text === '' && text !== '')) {
            links.set(canonical, { url: canonical, text })
        }
    }

    return [...links.values()]
}

// URL déclarées dans un sitemap.xml (ou un index de sitemaps). Complète les
// liens de navigation : beaucoup de sites n'exposent pas les mentions légales
// dans leur menu principal.
export function extractSitemapUrls(xml: string, baseUrl: URL): string[] {
    const urls = new Set<string>()
    for (const match of xml.matchAll(SITEMAP_LOCATION_PATTERN)) {
        try {
            const resolved = new URL(match[1] ?? '', baseUrl)
            if (resolved.hostname !== baseUrl.hostname) continue
            urls.add(canonicalizeUrl(resolved))
        } catch {
            continue
        }
    }
    return [...urls]
}
