import { chromium, type Browser, type Page } from 'playwright'

// Budget maximal par page : chargement + analyse compris, une page lente ne doit
// pas bloquer le scan entier.
export const PAGE_TIMEOUT_MS = 30_000

// Un seul process Chromium par scan ; les options no-sandbox / dev-shm / gpu sont
// requises pour tourner en conteneur Linux (Docker) sans privilèges.
export async function launchScanBrowser(): Promise<Browser> {
    return chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    })
}

// Charge une URL dans un context isolé, exécute `analyze`, puis ferme TOUJOURS le
// context (donc la page) — c'est la garantie anti fuite mémoire du worker : chaque
// page analysée repart de zéro.
export async function withPage<T>(
    browser: Browser,
    url: string,
    analyze: (page: Page) => Promise<T>,
): Promise<T> {
    const context = await browser.newContext()
    try {
        // Les runners TypeScript (tsx/esbuild) instrumentent les fonctions nommées
        // avec un helper __name ; page.evaluate sérialise nos callbacks tels quels
        // vers le navigateur, où ce helper n'existe pas (ReferenceError). Ce shim
        // le neutralise pour tous les checks. Impérativement en chaîne brute : un
        // callback serait lui-même instrumenté par tsx… et planterait sur __name.
        await context.addInitScript(
            "Object.defineProperty(globalThis, '__name', { value: function (target) { return target }, configurable: true })",
        )
        const page = await context.newPage()
        page.setDefaultTimeout(PAGE_TIMEOUT_MS)
        page.setDefaultNavigationTimeout(PAGE_TIMEOUT_MS)

        await page.goto(url, { waitUntil: 'domcontentloaded' })
        // Laisse le réseau se calmer pour les contenus injectés en JS, sans faire
        // échouer le scan si le site ne s'apaise jamais (polling, analytics…).
        await page
            .waitForLoadState('networkidle', { timeout: 10_000 })
            .catch(() => undefined)

        return await analyze(page)
    } finally {
        await context.close()
    }
}
