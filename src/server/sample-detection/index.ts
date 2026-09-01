import { fetchPage, isPubliclyFetchable } from '@/server/sample-detection/fetch-page'
import {
    canonicalizeUrl,
    extractInternalLinks,
    extractSitemapUrls,
    type PageLink,
} from '@/server/sample-detection/html'
import {
    findMandatoryPage,
    MANDATORY_PAGES,
} from '@/server/sample-detection/mandatory-pages'
import { TEMPLATE_SIGNATURES } from '@/server/sample-detection/templates'

// Détection de l'échantillon (spec 4.6, étape 2) : à partir de la seule URL
// racine, proposer les pages obligatoires du RGAA et les pages gabarit du site.
// Volontairement en HTTP simple, sans navigateur : la détection doit répondre
// dans le formulaire de création, là où un scan Playwright prendrait une minute.
// Contrepartie assumée : un site entièrement rendu côté client livre peu de
// liens, l'auditrice complète alors l'échantillon à la main.

// Sonder tout le site coûterait des dizaines de requêtes pour un gain marginal :
// une page par grande rubrique suffit à croiser les gabarits usuels.
const MAX_PROBED_PAGES = 8

export interface DetectedPage {
    key: string
    label: string
    url: string | null
    // Une page obligatoire non trouvée est renvoyée quand même (url: null) :
    // l'auditrice doit voir ce qui manque pour le renseigner ou l'écarter.
    isRequired: boolean
    isFound: boolean
}

export interface SampleDetection {
    mandatory: DetectedPage[]
    templates: DetectedPage[]
}

export class SiteUnreachableError extends Error {}

// Une page par première rubrique d'URL : c'est ce qui maximise les chances de
// croiser des composants différents pour un budget de requêtes fixe.
function pickProbeCandidates(links: PageLink[], excluded: Set<string>): PageLink[] {
    const bySection = new Map<string, PageLink>()
    for (const link of links) {
        if (excluded.has(link.url)) continue
        let section: string
        try {
            section = new URL(link.url).pathname.split('/')[1] ?? ''
        } catch {
            continue
        }
        if (section === '') continue
        if (!bySection.has(section)) bySection.set(section, link)
        if (bySection.size >= MAX_PROBED_PAGES) break
    }
    return [...bySection.values()]
}

async function fetchSitemapLinks(baseUrl: URL): Promise<PageLink[]> {
    const sitemap = await fetchPage(new URL('/sitemap.xml', baseUrl))
    if (!sitemap) return []
    // Sans libellé : ces URL n'apportent que le signal « chemin », ce que
    // findMandatoryPage sait exploiter.
    return extractSitemapUrls(sitemap.html, baseUrl).map((url) => ({
        url,
        text: '',
    }))
}

function detectMandatoryPages(
    baseUrl: URL,
    links: PageLink[],
    excluded: Set<string>,
): DetectedPage[] {
    const home = canonicalizeUrl(new URL(baseUrl))
    const pages: DetectedPage[] = []

    if (!excluded.has(home)) {
        pages.push({
            key: 'home',
            label: 'Accueil',
            url: home,
            isRequired: true,
            isFound: true,
        })
    }

    for (const definition of MANDATORY_PAGES) {
        const match = findMandatoryPage(links, definition)
        if (match && excluded.has(match.url)) continue
        // Une page facultative introuvable n'a rien à faire dans la proposition :
        // tous les sites n'ont pas d'aide ni d'espace client.
        if (!match && !definition.isRequired) continue
        pages.push({
            key: definition.key,
            label: definition.label,
            url: match?.url ?? null,
            isRequired: definition.isRequired,
            isFound: match !== null,
        })
    }

    return pages
}

// Première page sondée exhibant chaque signature. Les pages déjà proposées ont
// été écartées des sondages en amont : un gabarit ne peut donc jamais faire
// doublon avec une page obligatoire ou une page déjà dans l'échantillon.
function detectTemplates(probes: { url: string; html: string }[]): DetectedPage[] {
    const templates: DetectedPage[] = []

    for (const signature of TEMPLATE_SIGNATURES) {
        const probe = probes.find((candidate) => signature.matches(candidate.html))
        if (!probe) continue
        templates.push({
            key: signature.key,
            label: signature.label,
            url: probe.url,
            isRequired: false,
            isFound: true,
        })
    }

    return templates
}

export async function detectSample(input: {
    siteUrl: string
    // URL déjà présentes dans l'échantillon : une relance de détection propose
    // les nouveautés sans reproposer ce qui est en place.
    excludeUrls?: string[]
}): Promise<SampleDetection> {
    let requestedUrl: URL
    try {
        requestedUrl = new URL(input.siteUrl)
    } catch {
        throw new SiteUnreachableError("L'URL du site est invalide.")
    }
    if (!isPubliclyFetchable(requestedUrl)) {
        throw new SiteUnreachableError(
            "Cette adresse ne désigne pas un site public analysable.",
        )
    }

    const homepage = await fetchPage(requestedUrl)
    if (homepage === null) {
        throw new SiteUnreachableError(
            "Le site n'a pas répondu. Vérifiez l'URL, ou saisissez les pages manuellement.",
        )
    }
    // Tout se compare à l'URL réellement servie : sinon « exemple.fr » redirigé
    // vers « www.exemple.fr » ne verrait plus aucun de ses propres liens.
    const baseUrl = homepage.finalUrl

    const excluded = new Set(
        (input.excludeUrls ?? []).flatMap((url) => {
            try {
                return [canonicalizeUrl(new URL(url))]
            } catch {
                return []
            }
        }),
    )

    const homeLinks = extractInternalLinks(homepage.html, baseUrl)
    const sitemapLinks = await fetchSitemapLinks(baseUrl)
    const mandatory = detectMandatoryPages(
        baseUrl,
        [...homeLinks, ...sitemapLinks],
        excluded,
    )

    // Toute page déjà proposée (obligatoire) ou déjà dans l'échantillon est hors
    // sondage : y trouver un gabarit ne ferait que dupliquer une URL.
    const offLimits = new Set([
        ...excluded,
        ...mandatory.flatMap((page) => (page.url ? [page.url] : [])),
        canonicalizeUrl(new URL(baseUrl)),
    ])
    const candidates = pickProbeCandidates(homeLinks, offLimits)
    const probed = await Promise.all(
        candidates.map(async (candidate) => {
            const page = await fetchPage(new URL(candidate.url))
            return page === null ? null : { url: candidate.url, html: page.html }
        }),
    )

    return {
        mandatory,
        templates: detectTemplates(probed.filter((probe) => probe !== null)),
    }
}
