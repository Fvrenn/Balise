// Récupération des pages sondées pendant la détection d'échantillon. Ce sont des
// requêtes sortantes déclenchées par une URL saisie par l'utilisateur : elles
// doivent être bornées en temps, en taille, et ne jamais servir à atteindre le
// réseau interne de l'hébergeur.

const FETCH_TIMEOUT_MS = 8_000
// Au-delà, on ne lit plus : les pages utiles pèsent quelques centaines de Ko et
// une réponse énorme ne ferait que bloquer la détection.
const MAX_RESPONSE_BYTES = 3_000_000

// En-tête HTTP : ASCII uniquement, une valeur accentuée fait échouer la requête.
const USER_AGENT = 'Balise/1.0 (RGAA sample detection; +https://balise.app)'

// Hôtes qui ne désignent jamais un site à auditer mais l'infrastructure qui fait
// la requête : les autoriser transformerait la détection en scanner interne.
const BLOCKED_HOSTNAMES = new Set([
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '::1',
    'metadata.google.internal',
])

const PRIVATE_IPV4 =
    /^(10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/

export function isPubliclyFetchable(url: URL): boolean {
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false
    const hostname = url.hostname.toLowerCase()
    if (BLOCKED_HOSTNAMES.has(hostname)) return false
    if (hostname.endsWith('.localhost') || hostname.endsWith('.internal')) {
        return false
    }
    if (PRIVATE_IPV4.test(hostname)) return false
    return true
}

export interface FetchedPage {
    html: string
    // URL après redirections : « exemple.fr » sert souvent « www.exemple.fr »,
    // dont tous les liens seraient jugés externes si on gardait l'URL saisie.
    finalUrl: URL
}

// Contenu d'une page, ou null si elle est inatteignable — une page manquante
// n'est pas une erreur de détection, juste une piste en moins.
export async function fetchPage(url: URL): Promise<FetchedPage | null> {
    if (!isPubliclyFetchable(url)) return null

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
    try {
        const response = await fetch(url, {
            signal: controller.signal,
            redirect: 'follow',
            headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,*/*' },
        })
        if (!response.ok) return null

        const contentType = response.headers.get('content-type') ?? ''
        if (!/text\/html|application\/xhtml|text\/xml|application\/xml/i.test(contentType)) {
            return null
        }

        let finalUrl: URL
        try {
            finalUrl = new URL(response.url)
        } catch {
            finalUrl = url
        }
        if (!isPubliclyFetchable(finalUrl)) return null

        const body = await response.text()
        return { html: body.slice(0, MAX_RESPONSE_BYTES), finalUrl }
    } catch {
        // Timeout, DNS, TLS, redirection en boucle… : la page est simplement
        // considérée comme non trouvée.
        return null
    } finally {
        clearTimeout(timeout)
    }
}
