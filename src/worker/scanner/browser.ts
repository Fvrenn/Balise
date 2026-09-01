import { chromium, type Browser, type Page } from 'playwright'

// Budget maximal par page : chargement + analyse compris, une page lente ne doit
// pas bloquer le scan entier.
export const PAGE_TIMEOUT_MS = 30_000

// Script injecté avant tout script de la page analysée. page.evaluate sérialise
// ses callbacks vers le navigateur : ils ne capturent rien du worker, tout ce
// dont les checks ont besoin doit donc être posé ici, en chaîne brute.
//   - __name : les runners TypeScript (tsx/esbuild) instrumentent les fonctions
//     nommées avec ce helper, absent du navigateur (ReferenceError). Impérativement
//     en chaîne brute — un callback serait lui-même instrumenté… et planterait.
//   - __baliseElementInfo : décrit un élément fautif (sélecteur CSS unique +
//     extrait de code) pour que les checks DOM sachent désigner ce qu'ils comptent,
//     comme axe le fait pour ses propres nœuds.
export const SCANNER_INIT_SCRIPT = `
Object.defineProperty(globalThis, '__name', {
  value: function (target) { return target },
  configurable: true
});
Object.defineProperty(globalThis, '__baliseElementInfo', {
  value: function (element, details) {
    var segments = [];
    var node = element;
    while (node && node.nodeType === 1 && node !== document.documentElement) {
      var id = node.getAttribute('id');
      if (id && document.querySelectorAll('#' + CSS.escape(id)).length === 1) {
        segments.unshift('#' + CSS.escape(id));
        break;
      }
      var parent = node.parentElement;
      var segment = node.tagName.toLowerCase();
      if (parent) {
        var current = node;
        var twins = Array.prototype.filter.call(parent.children, function (child) {
          return child.tagName === current.tagName;
        });
        if (twins.length > 1) {
          segment += ':nth-of-type(' + (twins.indexOf(current) + 1) + ')';
        }
      }
      segments.unshift(segment);
      node = parent;
    }
    if (segments.length === 0) segments.push('html');
    return {
      selector: segments.join(' > '),
      html: (element.outerHTML || '').slice(0, 1000),
      details: details
    };
  },
  configurable: true
});
`

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
        await context.addInitScript(SCANNER_INIT_SCRIPT)
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
