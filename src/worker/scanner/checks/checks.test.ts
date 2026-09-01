import assert from 'node:assert/strict'
import { after, before, describe, test } from 'node:test'
import { AxeBuilder } from '@axe-core/playwright'
import type { Browser } from 'playwright'

import {
    launchScanBrowser,
    SCANNER_INIT_SCRIPT,
} from '@/worker/scanner/browser'
import { AXE_RULES, runChecks } from '@/worker/scanner/checks'
import type { CheckResult } from '@/worker/scanner/checks'

// Tests des checks automatiques RGAA, critère par critère. Chaque bloc décrit
// comment le scanner décide du verdict :
//   - conforme        → le test couvre tout le périmètre du critère et ne trouve rien
//   - non conforme    → violation prouvée, avec un commentaire expliquant pourquoi
//   - non applicable  → le sujet du critère est absent de la page (aucune image…)
//   - aucun verdict   → le check ne peut prouver que la violation (« violation
//                       seulement ») : sans violation il laisse le critère à
//                       l'appréciation de l'auditrice
//
// Les fixtures passent par le vrai pipeline du worker : Chromium headless,
// axe-core (règles AXE_RULES) puis runChecks — exactement comme un scan réel.
//
// Lancement : pnpm test:scan

type Verdicts = Map<string, CheckResult>

let browser: Browser

// Analyse un HTML dans un context isolé et retourne les verdicts par critère.
async function scanHtml(html: string): Promise<Verdicts> {
    const context = await browser.newContext()
    try {
        // Aucune requête réseau ne doit sortir : les src factices échouent
        // proprement et un meta refresh ne peut pas naviguer hors de la fixture.
        await context.route('**/*', (route) => route.abort())
        // Exactement le script du worker : les checks dépendent des helpers
        // qu'il injecte (__name, __baliseElementInfo).
        await context.addInitScript(SCANNER_INIT_SCRIPT)
        const page = await context.newPage()
        await page.setContent(html)
        const axeResults = await new AxeBuilder({ page })
            .withRules([...AXE_RULES])
            .analyze()
        const results = await runChecks(page, axeResults)
        return new Map(results.map((result) => [result.criterionId, result]))
    } finally {
        await context.close()
    }
}

function expectStatus(
    verdicts: Verdicts,
    criterionId: string,
    status: CheckResult['status'],
): CheckResult {
    const verdict = verdicts.get(criterionId)
    assert.ok(verdict, `aucun verdict posé pour le critère ${criterionId}`)
    assert.equal(
        verdict.status,
        status,
        `critère ${criterionId} : attendu "${status}", obtenu "${verdict.status}" (${verdict.comment ?? 'sans commentaire'})`,
    )
    return verdict
}

// Vérifie le verdict non conforme ET le texte explicatif attaché au finding.
function expectNonConforme(
    verdicts: Verdicts,
    criterionId: string,
    commentPattern: RegExp,
): void {
    const verdict = expectStatus(verdicts, criterionId, 'non_conforme')
    assert.ok(
        verdict.comment !== undefined && commentPattern.test(verdict.comment),
        `critère ${criterionId} : commentaire attendu ${commentPattern}, obtenu "${verdict.comment ?? '(vide)'}"`,
    )
}

function expectAucunVerdict(verdicts: Verdicts, criterionId: string): void {
    const verdict = verdicts.get(criterionId)
    assert.equal(
        verdict,
        undefined,
        `critère ${criterionId} : aucun verdict attendu, obtenu "${verdict?.status}"`,
    )
}

// Occurrences attachées à un verdict non conforme : les éléments fautifs que
// l'auditrice doit pouvoir retrouver dans la page.
function occurrencesOf(
    verdicts: Verdicts,
    criterionId: string,
): NonNullable<CheckResult['occurrences']> {
    const verdict = expectStatus(verdicts, criterionId, 'non_conforme')
    const occurrences = verdict.occurrences ?? []
    assert.ok(
        occurrences.length > 0,
        `critère ${criterionId} : aucune occurrence remontée`,
    )
    return occurrences
}

// Vérifie qu'une preuve précise accompagne la première occurrence du critère.
function expectDetail(
    verdicts: Verdicts,
    criterionId: string,
    key: string,
    expected: RegExp,
): void {
    const [occurrence] = occurrencesOf(verdicts, criterionId)
    const value = occurrence?.details?.[key]
    assert.ok(
        value !== undefined && expected.test(value),
        `critère ${criterionId} : détail "${key}" attendu ${expected}, obtenu "${value ?? '(absent)'}"`,
    )
}

// ─── Fixtures partagées ───────────────────────────────────────────────────────

// Page entièrement conforme : chaque sujet est présent ET correct, pour vérifier
// que les checks bidirectionnels concluent « conforme » et que les checks
// « violation seulement » ne posent rien.
const PAGE_CONFORME = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Page de démonstration conforme</title>
</head>
<body>
    <a href="#contenu">Aller au contenu</a>
    <main id="contenu">
        <h1>Titre principal</h1>
        <h2>Sous-titre</h2>
        <p>Texte noir sur fond blanc, <strong>important</strong> et <em>accentué</em>.</p>
        <p><span lang="en">Hello world</span> — <span dir="rtl">שלום</span></p>
        <img src="logo.png" alt="Logo de la société">
        <img src="deco.png" alt="">
        <iframe title="Carte interactive" srcdoc="<p>carte</p>"></iframe>
        <video controls src="clip.mp4"></video>
        <table>
            <caption>Effectifs</caption>
            <tr><th scope="col">Année</th><th scope="col">Total</th></tr>
            <tr><td>2025</td><td>12</td></tr>
        </table>
        <ul><li>Premier</li><li>Second</li></ul>
        <a href="/contact">Nous contacter</a>
        <form>
            <label for="email">Email *</label>
            <input id="email" type="email" autocomplete="email" required>
            <button type="submit">Envoyer</button>
        </form>
    </main>
</body>
</html>`

// Page cumulant une violation par critère automatisable : pas de doctype, pas de
// lang, pas de titre, pas de main, pas de lien d'évitement, et un élément fautif
// par check. Sert à vérifier chaque verdict non conforme et son commentaire.
const PAGE_NON_CONFORME = `<html>
<head>
    <meta http-equiv="refresh" content="30">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
</head>
<body>
    <a href="/article">Lire la suite</a>
    <a href="/promo"></a>
    <img src="photo.jpg">
    <img src="deco.png" alt="" aria-label="décoration">
    <iframe srcdoc="<p>pub</p>"></iframe>
    <p style="color:#999;background-color:#fff;">Texte gris trop pâle sur fond blanc</p>
    <video autoplay src="clip.mp4"></video>
    <table role="presentation"><tr><th>Colonne</th></tr><tr><td>x</td></tr></table>
    <div id="bloc">premier</div><div id="bloc">doublon</div>
    <span lang="zz">texte étranger</span>
    <b>gras décoratif</b> <u>souligné</u>
    <div dir="vertical">sens invalide</div>
    <h1>Titre</h1>
    <h3>Sous-partie sans h2</h3>
    <ul><div>élément hors li</div></ul>
    <label for="nom">Nom</label><input id="nom" type="text" required>
    <input type="text">
    <input type="text" autocomplete="banane">
    <button></button>
    <marquee>Promotion en cours</marquee>
</body>
</html>`

// Enveloppe une portion de body dans une page saine (doctype, lang, title,
// main…) : les fixtures dédiées ne testent que le sujet qu'elles contiennent.
const pageAvec = (body: string) =>
    `<!DOCTYPE html><html lang="fr"><head><title>Fixture</title></head><body><a href="#c">Aller au contenu</a><main id="c"><h1>Titre</h1>${body}</main></body></html>`

// Page minimale sans image, cadre, média, tableau ni formulaire : les familles
// concernées doivent passer entièrement « non applicable ».
const PAGE_SANS_SUJETS = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><title>Page vide</title></head>
<body>
    <a href="#contenu">Aller au contenu</a>
    <main id="contenu"><h1>Bonjour</h1><p>Un simple paragraphe.</p></main>
</body>
</html>`

let conforme: Verdicts
let nonConforme: Verdicts
let sansSujets: Verdicts

before(
    async () => {
        browser = await launchScanBrowser()
        ;[conforme, nonConforme, sansSujets] = await Promise.all([
            scanHtml(PAGE_CONFORME),
            scanHtml(PAGE_NON_CONFORME),
            scanHtml(PAGE_SANS_SUJETS),
        ])
    },
    { timeout: 120_000 },
)

after(async () => {
    await browser.close()
})

// ─── Thématique 1 : Images ────────────────────────────────────────────────────

describe('1.1 — Chaque image porteuse d’information a-t-elle une alternative textuelle ?', () => {
    // Méthodologie officielle (tests 1.1.1 à 1.1.8) : le critère n'est conforme
    // que si TOUS les sous-tests applicables passent.
    //   1.1.1 <img> et [role="img"] : alternative parmi aria-labelledby,
    //         aria-label, alt, title (aria seulement pour role="img") — axe.
    //   1.1.2 <area> : alt ou aria-label — axe.
    //   1.1.3 <input type="image"> : alt, title ou aria — axe.
    //   1.1.4 <img ismap> : le mécanisme alternatif (liens équivalents) n'est
    //         pas détectable → le scanner ne conclut jamais en sa présence.
    //   1.1.5 <svg> informatif : role="img" ET alternative (title, aria…). Un
    //         svg nommé sans role="img" = violation ; un svg nu = indéterminable.
    //   1.1.6/1.1.7 <object>/<embed type="image/…"> : role="img" + alternative,
    //         contenu de repli (object) ou lien/bouton adjacent.
    //   1.1.8 <canvas> : mêmes conditions, avec contenu de repli accepté.
    // Tout sujet invérifiable (svg nu, canvas muet, ismap) bloque le verdict
    // « conforme » : le scanner ne pose rien et laisse l'auditrice trancher.

    test('1.1.1 conforme : toutes les <img> ont un alt (informatif ou vide)', () => {
        expectStatus(conforme, '1.1', 'conforme')
    })
    test('1.1.1 non conforme : une <img> sans attribut alt — commentaire citant le test 1.1.1', () => {
        expectNonConforme(
            nonConforme,
            '1.1',
            /image\(s\) <img> sans alternative textuelle \(test 1\.1\.1\)/,
        )
    })
    test('1.1.1 non conforme : un élément [role="img"] sans aria-label ni aria-labelledby', async () => {
        const verdicts = await scanHtml(
            pageAvec('<div role="img" style="width:40px;height:40px;background:#ccc"></div>'),
        )
        expectNonConforme(
            verdicts,
            '1.1',
            /élément\(s\) role="img" sans alternative textuelle \(test 1\.1\.1\)/,
        )
    })
    test('1.1.2 non conforme : une zone <area> cliquable sans alt ni aria-label', async () => {
        const verdicts = await scanHtml(
            pageAvec(
                '<img src="plan.png" alt="Plan du site" usemap="#zones"><map name="zones"><area shape="rect" coords="0,0,20,20" href="/zone"></map>',
            ),
        )
        expectNonConforme(
            verdicts,
            '1.1',
            /zone\(s\) <area> sans alternative textuelle \(test 1\.1\.2\)/,
        )
    })
    test('1.1.3 non conforme : un bouton image (<input type="image">) sans alternative', async () => {
        const verdicts = await scanHtml(
            pageAvec('<form><input type="image" src="ok.png"><label for="q">Recherche *</label><input id="q" type="text"></form>'),
        )
        expectNonConforme(
            verdicts,
            '1.1',
            /bouton\(s\) image \(<input type="image">\) sans alternative textuelle \(test 1\.1\.3\)/,
        )
    })
    test('1.1.4 aucun verdict : une image réactive serveur (img[ismap]) — le mécanisme alternatif n’est pas détectable', async () => {
        const verdicts = await scanHtml(
            pageAvec('<a href="/carte"><img src="carte.png" alt="Carte de France" ismap></a>'),
        )
        expectAucunVerdict(verdicts, '1.1')
    })
    test('1.1.5 conforme : un <svg role="img"> avec aria-label', async () => {
        const verdicts = await scanHtml(
            pageAvec(
                '<svg role="img" aria-label="Répartition des ventes" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4"/></svg>',
            ),
        )
        expectStatus(verdicts, '1.1', 'conforme')
    })
    test('1.1.5 non conforme : un <svg role="img"> sans alternative textuelle', async () => {
        const verdicts = await scanHtml(
            pageAvec('<svg role="img" viewBox="0 0 10 10"><rect width="10" height="10"/></svg>'),
        )
        expectNonConforme(
            verdicts,
            '1.1',
            /<svg role="img"> sans alternative textuelle \(test 1\.1\.5\)/,
        )
    })
    test('1.1.5 non conforme : un <svg> nommé (aria-label) mais sans role="img" — les deux conditions sont exigées', async () => {
        const verdicts = await scanHtml(
            pageAvec('<svg aria-label="Statistiques" viewBox="0 0 10 10"><rect width="10" height="10"/></svg>'),
        )
        expectNonConforme(
            verdicts,
            '1.1',
            /<svg> porteur\(s\) d'une alternative textuelle mais sans role="img" \(test 1\.1\.5\)/,
        )
    })
    test('1.1.5 aucun verdict : un <svg> nu — décoratif ou informatif ? jugement humain', async () => {
        const verdicts = await scanHtml(
            pageAvec('<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4"/></svg>'),
        )
        expectAucunVerdict(verdicts, '1.1')
    })
    test('1.1.5 conforme : un <svg> d’icône dans un bouton déjà nommé est ignoré', async () => {
        const verdicts = await scanHtml(
            pageAvec(
                '<button>Fermer <svg viewBox="0 0 10 10"><path d="M0 0 10 10"/></svg></button><img src="l.png" alt="Logo">',
            ),
        )
        expectStatus(verdicts, '1.1', 'conforme')
    })
    test('1.1.6 conforme : une image objet avec role="img" et aria-label', async () => {
        const verdicts = await scanHtml(
            pageAvec(
                '<object type="image/png" data="graph.png" role="img" aria-label="Graphique des ventes"></object>',
            ),
        )
        expectStatus(verdicts, '1.1', 'conforme')
    })
    test('1.1.6 aucun verdict : une image objet muette — informative ou décorative ? jugement humain', async () => {
        const verdicts = await scanHtml(
            pageAvec('<object type="image/png" data="deco.png"></object>'),
        )
        expectAucunVerdict(verdicts, '1.1')
    })
    test('1.1.8 conforme : un <canvas> avec contenu de repli textuel', async () => {
        const verdicts = await scanHtml(
            pageAvec(
                '<canvas width="100" height="50">Évolution du chiffre d’affaires 2025</canvas>',
            ),
        )
        expectStatus(verdicts, '1.1', 'conforme')
    })
    test('1.1.8 aucun verdict : un <canvas> muet, sans repli ni alternative adjacente', async () => {
        const verdicts = await scanHtml(
            pageAvec('<canvas width="100" height="50"></canvas>'),
        )
        expectAucunVerdict(verdicts, '1.1')
    })
    test('non applicable : la page ne contient aucune image (img, svg, area, canvas, object/embed image…)', () => {
        const verdict = expectStatus(sansSujets, '1.1', 'non_applicable')
        assert.match(verdict.comment ?? '', /Aucune image sur la page/)
    })
})

describe('1.2 — Chaque image de décoration est-elle correctement ignorée ?', () => {
    // Méthodologie (tests 1.2.1 à 1.2.6) : une image déclarée décorative
    // (alt="", role="presentation"/"none" ou aria-hidden="true") ne doit porter
    // AUCUNE alternative textuelle — ni aria-label/aria-labelledby/title (img,
    // area, embed), ni <title>/<desc> ou attribut title enfant (svg), ni contenu
    // de repli textuel (object, canvas). Le caractère décoratif d'une image non
    // déclarée relève du jugement humain : sans image déclarée décorative,
    // aucun verdict.
    test('1.2.1 conforme : les images décoratives (alt="") ne portent aucune alternative contradictoire', () => {
        expectStatus(conforme, '1.2', 'conforme')
    })
    test('1.2.1 non conforme : une image alt="" avec aria-label — commentaire citant les tests 1.2.x', () => {
        expectNonConforme(
            nonConforme,
            '1.2',
            /déclarée\(s\) décorative\(s\).*aria-label, aria-labelledby, title.*tests 1\.2\.1 à 1\.2\.6/,
        )
    })
    test('1.2.1 non conforme : une image alt="" avec un title non vide', async () => {
        const verdicts = await scanHtml(
            pageAvec('<img src="deco.png" alt="" title="Décor floral">'),
        )
        expectNonConforme(verdicts, '1.2', /tests 1\.2\.1 à 1\.2\.6/)
    })
    test('1.2.2 non conforme : une zone <area> sans href avec un alt non vide', async () => {
        const verdicts = await scanHtml(
            pageAvec(
                '<img src="plan.png" alt="Plan" usemap="#m"><map name="m"><area shape="rect" coords="0,0,10,10" alt="décor"></map>',
            ),
        )
        expectNonConforme(verdicts, '1.2', /tests 1\.2\.1 à 1\.2\.6/)
    })
    test('1.2.4 non conforme : un <svg aria-hidden="true"> contenant un <title> renseigné', async () => {
        const verdicts = await scanHtml(
            pageAvec(
                '<svg aria-hidden="true" viewBox="0 0 10 10"><title>Décor</title><circle cx="5" cy="5" r="4"/></svg>',
            ),
        )
        expectNonConforme(verdicts, '1.2', /tests 1\.2\.1 à 1\.2\.6/)
    })
    test('1.2.4 conforme : un <svg aria-hidden="true"> muet est correctement ignoré', async () => {
        const verdicts = await scanHtml(
            pageAvec(
                '<svg aria-hidden="true" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4"/></svg>',
            ),
        )
        expectStatus(verdicts, '1.2', 'conforme')
    })
    test('1.2.5 non conforme : un <canvas aria-hidden="true"> avec un contenu de repli textuel', async () => {
        const verdicts = await scanHtml(
            pageAvec(
                '<canvas aria-hidden="true" width="50" height="50">Graphique décoratif</canvas>',
            ),
        )
        expectNonConforme(verdicts, '1.2', /tests 1\.2\.1 à 1\.2\.6/)
    })
    test('non applicable : aucune image du tout sur la page', () => {
        expectStatus(sansSujets, '1.2', 'non_applicable')
    })
    test('aucun verdict : des images existent mais aucune n’est déclarée décorative (jugement humain requis)', async () => {
        const verdicts = await scanHtml(
            pageAvec('<img src="p.jpg" alt="Photo du produit">'),
        )
        expectAucunVerdict(verdicts, '1.2')
    })
})

describe('1.3 à 1.9 — Famille images : non applicable quand la page n’a aucune image', () => {
    // Décision : l'absence de tout img/svg/area/input image/[role=img] dans le DOM
    // est un fait objectif → toute la thématique 1 passe « non applicable ».
    for (const criterionId of ['1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9']) {
        test(`${criterionId} : non applicable sans image — commentaire « Aucune image sur la page »`, () => {
            const verdict = expectStatus(sansSujets, criterionId, 'non_applicable')
            assert.match(verdict.comment ?? '', /Aucune image sur la page/)
        })
    }
})

// ─── Thématique 2 : Cadres ────────────────────────────────────────────────────

describe('2.1 — Chaque cadre a-t-il un titre de cadre ?', () => {
    // Méthodologie (test 2.1.1) : chaque <iframe>/<frame> doit posséder un
    // attribut title — c'est bien l'attribut qui est exigé, un aria-label ne
    // suffit pas. Les cadres masqués (aria-hidden, hidden, display:none) sont
    // ignorés (cadres techniques de tracking).
    test('conforme : toutes les iframes ont un attribut title', () => {
        expectStatus(conforme, '2.1', 'conforme')
    })
    test('non conforme : une iframe sans title — commentaire citant le test 2.1.1', () => {
        expectNonConforme(
            nonConforme,
            '2.1',
            /cadre\(s\) <iframe> sans attribut title \(test 2\.1\.1/,
        )
    })
    test('non conforme : une iframe avec aria-label mais sans attribut title — le RGAA exige title', async () => {
        const verdicts = await scanHtml(
            pageAvec('<iframe srcdoc="<p>pub</p>" aria-label="Publicité"></iframe>'),
        )
        expectNonConforme(
            verdicts,
            '2.1',
            /un aria-label ne suffit pas/,
        )
    })
    test('non applicable : aucun cadre sur la page', () => {
        const verdict = expectStatus(sansSujets, '2.1', 'non_applicable')
        assert.match(verdict.comment ?? '', /Aucun cadre/)
    })
})

describe('2.2 — Famille cadres : non applicable sans iframe', () => {
    test('2.2 : non applicable quand la page ne contient aucun cadre', () => {
        expectStatus(sansSujets, '2.2', 'non_applicable')
    })
})

// ─── Thématique 3 : Couleurs ──────────────────────────────────────────────────

describe('3.2 — Le contraste entre le texte et son arrière-plan est-il suffisant ?', () => {
    // Décision : règle axe color-contrast (seuils WCAG = RGAA : 4.5:1 en taille
    // courante, 3:1 dès 24px ou 18,5px gras). Le commentaire cite le pire ratio.
    test('conforme : tous les textes atteignent le ratio requis', () => {
        expectStatus(conforme, '3.2', 'conforme')
    })
    test('non conforme : texte #999 sur blanc (≈2.8:1) — commentaire « contraste insuffisant » + pire ratio', () => {
        expectNonConforme(
            nonConforme,
            '3.2',
            /contraste insuffisant.*pire ratio détecté/,
        )
    })
})

// ─── Thématique 4 : Multimédia ────────────────────────────────────────────────

describe('4.10 — Chaque son déclenché automatiquement est-il contrôlable ?', () => {
    // Décision : un <audio>/<video> en autoplay, non muet et sans attribut
    // controls est une violation. Violation seulement : un player JS custom peut
    // offrir des contrôles invisibles dans le DOM, on ne conclut jamais conforme.
    test('non conforme : <video autoplay> sans controls ni muted — commentaire « lecture automatique avec du son, sans contrôle utilisateur »', () => {
        expectNonConforme(
            nonConforme,
            '4.10',
            /lecture automatique avec du son, sans contrôle utilisateur/,
        )
    })
    test('aucun verdict : le média présent n’est pas en autoplay (contrôles à vérifier humainement)', () => {
        expectAucunVerdict(conforme, '4.10')
    })
    test('non applicable : aucun média sur la page', () => {
        const verdict = expectStatus(sansSujets, '4.10', 'non_applicable')
        assert.match(verdict.comment ?? '', /Aucun média/)
    })
})

describe('4.1 à 4.13 — Famille multimédia : non applicable sans audio/vidéo/objet', () => {
    for (const criterionId of ['4.1', '4.5', '4.13']) {
        test(`${criterionId} : non applicable — commentaire « Aucun média (audio, vidéo, objet embarqué) »`, () => {
            const verdict = expectStatus(sansSujets, criterionId, 'non_applicable')
            assert.match(verdict.comment ?? '', /Aucun média/)
        })
    }
})

// ─── Thématique 5 : Tableaux ──────────────────────────────────────────────────

describe('5.8 — Chaque tableau de mise en forme ne doit pas utiliser d’éléments propres aux tableaux de données', () => {
    // Méthodologie (test 5.8.1) : un <table role="presentation"|"none"> ne doit
    // porter ni attribut summary, ni caption/th/thead/tfoot, ni attributs
    // scope/headers/axis, ni role="rowheader"/"columnheader". Violation
    // seulement : repérer un tableau de mise en forme NON déclaré demande un
    // jugement humain.
    test('non conforme : table role="presentation" avec un <th> — commentaire citant le test 5.8.1', () => {
        expectNonConforme(
            nonConforme,
            '5.8',
            /mise en forme.*éléments ou attributs de tableau de données.*test 5\.8\.1/,
        )
    })
    test('non conforme : table role="presentation" avec un attribut summary', async () => {
        const verdicts = await scanHtml(
            pageAvec(
                '<table role="presentation" summary="mise en page"><tr><td>x</td></tr></table>',
            ),
        )
        expectNonConforme(verdicts, '5.8', /test 5\.8\.1/)
    })
    test('aucun verdict : les tableaux présents sont des tableaux de données', () => {
        expectAucunVerdict(conforme, '5.8')
    })
    test('non applicable : aucun tableau sur la page', () => {
        const verdict = expectStatus(sansSujets, '5.8', 'non_applicable')
        assert.match(verdict.comment ?? '', /Aucun tableau/)
    })
})

describe('5.1 à 5.7 — Famille tableaux : non applicable sans <table>', () => {
    for (const criterionId of ['5.1', '5.4', '5.7']) {
        test(`${criterionId} : non applicable — commentaire « Aucun tableau sur la page »`, () => {
            const verdict = expectStatus(sansSujets, criterionId, 'non_applicable')
            assert.match(verdict.comment ?? '', /Aucun tableau/)
        })
    }
})

// ─── Thématique 6 : Liens ─────────────────────────────────────────────────────

describe('6.2 — Chaque lien a-t-il un intitulé ?', () => {
    // Décision : règle axe link-name — tout lien sans texte, aria-label ni
    // contenu accessible est une violation ; aucune violation = conforme.
    test('conforme : tous les liens ont un intitulé accessible', () => {
        expectStatus(conforme, '6.2', 'conforme')
    })
    test('non conforme : un <a href> vide — commentaire « N lien(s) sans intitulé accessible »', () => {
        expectNonConforme(nonConforme, '6.2', /lien\(s\) sans intitulé accessible/)
    })
})

// ─── Thématique 8 : Éléments obligatoires ─────────────────────────────────────

describe('8.1 — La page est-elle définie par un type de document ?', () => {
    // Décision : seul <!DOCTYPE html> (HTML5, sans publicId ni systemId) est
    // accepté ; doctype absent ou ancien = non conforme.
    test('conforme : la page déclare <!DOCTYPE html>', () => {
        expectStatus(conforme, '8.1', 'conforme')
    })
    test('non conforme : doctype absent — commentaire « DOCTYPE absent du document »', () => {
        expectNonConforme(nonConforme, '8.1', /DOCTYPE absent du document/)
    })
    test('non conforme : doctype HTML 4 — commentaire « DOCTYPE non HTML5 détecté »', async () => {
        const verdicts = await scanHtml(
            '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><html lang="fr"><head><title>Vieille page</title></head><body><p>x</p></body></html>',
        )
        expectNonConforme(verdicts, '8.1', /DOCTYPE non HTML5 détecté/)
    })
})

describe('8.2 — Le code source est-il valide ? (ids dupliqués)', () => {
    // Décision : un id présent deux fois dans le DOM est une invalidité objective.
    // Violation seulement : la validité complète exigerait un validateur W3C.
    test('non conforme : deux éléments id="bloc" — commentaire listant les ids dupliqués', () => {
        expectNonConforme(nonConforme, '8.2', /id dupliqué\(s\).*bloc/)
    })
    test('aucun verdict : tous les ids sont uniques (validité complète non prouvable)', () => {
        expectAucunVerdict(conforme, '8.2')
    })
})

describe('8.3 — La langue par défaut est-elle présente ?', () => {
    // Méthodologie (test 8.3.1) : l'indication de langue est donnée par lang
    // et/ou xml:lang sur <html>, non vide.
    test('conforme : <html lang="fr">', () => {
        expectStatus(conforme, '8.3', 'conforme')
    })
    test('conforme : <html xml:lang="fr"> (XHTML) est accepté par le test 8.3.1', async () => {
        const verdicts = await scanHtml(
            '<!DOCTYPE html><html xml:lang="fr"><head><title>x</title></head><body><p>x</p></body></html>',
        )
        expectStatus(verdicts, '8.3', 'conforme')
    })
    test('non conforme : <html> sans lang ni xml:lang — commentaire citant le test 8.3.1', () => {
        expectNonConforme(nonConforme, '8.3', /Attribut lang \(ou xml:lang\) absent ou vide/)
    })
})

describe('8.4 — Le code de langue est-il pertinent ?', () => {
    // Décision : la valeur de lang doit être un code BCP47 dont le sous-tag
    // primaire est un code ISO 639-1 connu. Ne se prononce que si lang existe
    // (sinon c'est 8.3 qui tombe).
    test('conforme : lang="fr" est un code valide', () => {
        expectStatus(conforme, '8.4', 'conforme')
    })
    test('non conforme : lang="zz" (code inconnu) — commentaire citant la valeur et le format attendu', async () => {
        const verdicts = await scanHtml(
            '<!DOCTYPE html><html lang="zz"><head><title>x</title></head><body><p>x</p></body></html>',
        )
        expectStatus(verdicts, '8.3', 'conforme')
        expectNonConforme(verdicts, '8.4', /lang invalide : "zz".*BCP47 attendu/)
    })
    test('aucun verdict : sans attribut lang, 8.4 ne se prononce pas (8.3 porte déjà la non-conformité)', () => {
        expectAucunVerdict(nonConforme, '8.4')
    })
})

describe('8.5 — Chaque page a-t-elle un titre de page ?', () => {
    // Décision : document.title non vide après trim.
    test('conforme : la page a un <title> renseigné', () => {
        expectStatus(conforme, '8.5', 'conforme')
    })
    test('non conforme : <title> absent — commentaire « Titre de page (<title>) absent ou vide »', () => {
        expectNonConforme(nonConforme, '8.5', /Titre de page.*absent ou vide/)
    })
})

describe('8.8 — Chaque changement de langue est-il indiqué avec un code valide ?', () => {
    // Décision : les attributs lang posés sur des éléments internes doivent être
    // des codes BCP47 valides. Violation seulement : un passage étranger SANS lang
    // est indétectable automatiquement.
    test('non conforme : <span lang="zz"> — commentaire « changement(s) de langue avec un code invalide »', () => {
        expectNonConforme(
            nonConforme,
            '8.8',
            /changement\(s\) de langue avec un code invalide.*"zz"/,
        )
    })
    test('aucun verdict : les lang internes présents sont valides (pertinence humaine)', () => {
        expectAucunVerdict(conforme, '8.8')
    })
})

describe('8.9 — Les balises ne doivent pas être utilisées uniquement à des fins de présentation', () => {
    // Méthodologie (test 8.9.1) : les balises de présentation dépréciées
    // (u, font, big, center, s, strike, tt, blink, basefont) sont des violations
    // certaines — la mise en forme relève du CSS. <b> et <i> ne figurent pas
    // dans la liste RGAA (sémantique conservée en HTML5). Violation seulement :
    // le détournement d'éléments sémantiques (div utilisé comme paragraphe,
    // titre comme légende…) reste un jugement humain, jamais de « conforme ».
    test('non conforme : un <u> présent — commentaire citant le test 8.9.1 et renvoyant au CSS', () => {
        expectNonConforme(
            nonConforme,
            '8.9',
            /balise\(s\) de présentation dépréciée\(s\).*CSS \(test 8\.9\.1\)/,
        )
    })
    test('aucun verdict : <strong>/<em> seulement — l’usage détourné d’éléments sémantiques n’est pas prouvable', () => {
        expectAucunVerdict(conforme, '8.9')
    })
    test('aucun verdict : <b> et <i> sont tolérés (absents de la liste RGAA, sémantique HTML5)', async () => {
        const verdicts = await scanHtml(
            pageAvec('<p><b>gras</b> et <i>italique</i></p>'),
        )
        expectAucunVerdict(verdicts, '8.9')
    })
})

describe('8.10 — Les changements du sens de lecture sont-ils signalés correctement ?', () => {
    // Décision : les attributs dir doivent valoir ltr, rtl ou auto (valide en
    // HTML). Violation seulement : un passage rtl non signalé est indétectable.
    test('non conforme : dir="vertical" — commentaire citant la valeur invalide et les valeurs attendues', () => {
        expectNonConforme(
            nonConforme,
            '8.10',
            /dir avec une valeur invalide.*"vertical".*ltr ou rtl/,
        )
    })
    test('aucun verdict : les dir présents sont valides (rtl)', () => {
        expectAucunVerdict(conforme, '8.10')
    })
})

// ─── Thématique 9 : Structuration ─────────────────────────────────────────────

describe('9.1 — L’information est-elle structurée par des titres hiérarchisés ?', () => {
    // Méthodologie (test 9.1.1) : la hiérarchie couvre les <hx> ET les titres
    // ARIA (role="heading" + aria-level, niveau implicite 2 sans aria-level) ;
    // un saut de niveau dans l'ordre du DOM est une violation. La pertinence du
    // contenu des titres (9.1.2) et le balisage des titres visuels (9.1.3)
    // restent à l'appréciation de l'auditrice.
    test('9.1.1 conforme : hiérarchie h1 → h2 sans saut', () => {
        expectStatus(conforme, '9.1', 'conforme')
    })
    test('9.1.1 non conforme : h1 suivi de h3 — commentaire « Saut de niveau détecté : h1 suivi de h3 »', () => {
        expectNonConforme(nonConforme, '9.1', /Saut de niveau détecté : h1 suivi de h3/)
    })
    test('9.1.1 non conforme : un titre ARIA (role="heading" aria-level="4") après un h1 compte dans la hiérarchie', async () => {
        const verdicts = await scanHtml(
            pageAvec('<div role="heading" aria-level="4">Sous-section</div>'),
        )
        expectNonConforme(verdicts, '9.1', /Saut de niveau détecté : h1 suivi de h4/)
    })
})

describe('9.3 — Chaque liste est-elle correctement structurée ?', () => {
    // Décision : règles axe list/listitem/definition-list/dlitem (enfant direct
    // autre que <li> dans un ul/ol…). Violation seulement : une liste visuelle
    // faite en <div> échappe au DOM, on ne peut jamais conclure conforme.
    test('non conforme : <div> enfant direct d’un <ul> — commentaire « liste(s) mal structurée(s) »', () => {
        expectNonConforme(nonConforme, '9.3', /liste\(s\) mal structurée\(s\)/)
    })
    test('aucun verdict : les listes balisées sont correctes (listes visuelles non détectables)', () => {
        expectAucunVerdict(conforme, '9.3')
    })
})

// ─── Thématique 10 : Présentation ─────────────────────────────────────────────

describe('10.4 — Le texte reste-t-il lisible quand la taille des caractères est augmentée ?', () => {
    // Décision : règle axe meta-viewport — user-scalable=no ou maximum-scale < 2
    // bloque le zoom. Violation seulement : la lisibilité réelle à 200 % reste à
    // vérifier humainement.
    test('non conforme : meta viewport avec user-scalable=no — commentaire « zoom du texte est bloqué »', () => {
        expectNonConforme(nonConforme, '10.4', /zoom du texte est bloqué/)
    })
    test('aucun verdict : le viewport n’empêche pas le zoom', () => {
        expectAucunVerdict(conforme, '10.4')
    })
})

// ─── Thématique 11 : Formulaires ──────────────────────────────────────────────

describe('11.1 — Chaque champ de formulaire a-t-il une étiquette ?', () => {
    // Décision : règle axe label — tout input/select/textarea sans label associé,
    // aria-label ni aria-labelledby est une violation ; sinon conforme.
    test('conforme : tous les champs ont un label associé', () => {
        expectStatus(conforme, '11.1', 'conforme')
    })
    test('non conforme : un <input> sans label — commentaire « N champ(s) de formulaire sans label »', () => {
        expectNonConforme(nonConforme, '11.1', /champ\(s\) de formulaire sans label/)
    })
    test('non applicable : aucun champ ni bouton sur la page', () => {
        const verdict = expectStatus(sansSujets, '11.1', 'non_applicable')
        assert.match(verdict.comment ?? '', /Aucun champ de formulaire/)
    })
})

describe('11.9 — L’intitulé de chaque bouton est-il pertinent ?', () => {
    // Décision : règle axe button-name — un bouton sans intitulé accessible est
    // une violation. Violation seulement : la pertinence d'un intitulé présent
    // reste un jugement humain.
    test('non conforme : <button></button> vide — commentaire « N bouton(s) sans intitulé accessible »', () => {
        expectNonConforme(nonConforme, '11.9', /bouton\(s\) sans intitulé accessible/)
    })
    test('aucun verdict : les boutons ont un intitulé (pertinence non automatisable)', () => {
        expectAucunVerdict(conforme, '11.9')
    })
})

describe('11.10 — Le contrôle de saisie est-il utilisé de manière pertinente ? (test 11.10.2)', () => {
    // Décision : chaque champ required/aria-required doit annoncer son caractère
    // obligatoire dans son étiquette (label, aria-label, aria-labelledby) via
    // « * », « obligatoire », « requis » ou « required ». Violation seulement :
    // les autres tests du critère (messages d'erreur…) restent humains.
    test('non conforme : champ required avec label « Nom » sans indication — commentaire « sans indication visible du caractère obligatoire »', () => {
        expectNonConforme(
            nonConforme,
            '11.10',
            /obligatoire\(s\).*sans indication visible du caractère obligatoire/,
        )
    })
    test('aucun verdict : le label « Email * » signale le caractère obligatoire', () => {
        expectAucunVerdict(conforme, '11.10')
    })
})

describe('11.13 — La finalité d’un champ de saisie peut-elle être déduite ? (autocomplete)', () => {
    // Décision : règle axe autocomplete-valid — une valeur d'autocomplete hors
    // vocabulaire HTML est une violation. Violation seulement : l'absence
    // d'autocomplete sur un champ qui le mériterait n'est pas prouvable.
    test('non conforme : autocomplete="banane" — commentaire « valeur d’attribut autocomplete invalide »', () => {
        expectNonConforme(nonConforme, '11.13', /autocomplete invalide/)
    })
    test('aucun verdict : les autocomplete présents sont valides (email)', () => {
        expectAucunVerdict(conforme, '11.13')
    })
})

describe('11.2 à 11.12 — Famille formulaires : non applicable sans champ ni bouton', () => {
    for (const criterionId of ['11.2', '11.6', '11.12']) {
        test(`${criterionId} : non applicable — commentaire « Aucun champ de formulaire ni bouton »`, () => {
            const verdict = expectStatus(sansSujets, criterionId, 'non_applicable')
            assert.match(verdict.comment ?? '', /Aucun champ de formulaire ni bouton/)
        })
    }
})

// ─── Thématique 12 : Navigation ───────────────────────────────────────────────

describe('12.6 — Les zones de regroupement peuvent-elles être atteintes ou évitées ?', () => {
    // Décision : l'absence de landmark main (<main> ou role="main") est une
    // violation certaine. Violation seulement : sa présence ne prouve pas que
    // toutes les zones (header, nav, footer) sont atteignables.
    test('non conforme : aucun <main> ni role="main" — commentaire « aucun landmark main »', () => {
        expectNonConforme(nonConforme, '12.6', /aucun landmark main/)
    })
    test('aucun verdict : un <main> existe (les autres zones restent à vérifier)', () => {
        expectAucunVerdict(conforme, '12.6')
    })
})

describe('12.7 — Un lien d’évitement ou d’accès rapide est-il présent ?', () => {
    // Décision : l'un des 10 premiers liens de la page doit contenir « contenu »,
    // « navigation », « skip » ou « aller au » (texte ou aria-label).
    test('conforme : premier lien « Aller au contenu »', () => {
        expectStatus(conforme, '12.7', 'conforme')
    })
    test('non conforme : aucun lien d’évitement en début de page — commentaire explicite', () => {
        expectNonConforme(
            nonConforme,
            '12.7',
            /Aucun lien d'évitement.*détecté en début de page/,
        )
    })
})

// ─── Thématique 13 : Consultation ─────────────────────────────────────────────

describe('13.1 — L’utilisateur a-t-il le contrôle de chaque limite de temps ? (meta refresh)', () => {
    // Décision : un <meta http-equiv="refresh"> avec 0 < délai < 20 h et sans
    // mécanisme de contrôle viole le test 13.1.1. Un délai nul (redirection
    // immédiate) ou ≥ 20 h est validé d'office par le référentiel — le check ne
    // pose alors rien. Violation seulement (redirections script non détectables).
    test('non conforme : refresh avec délai de 30 s — commentaire citant le délai et le test 13.1.1', () => {
        expectNonConforme(
            nonConforme,
            '13.1',
            /délai de 30s, sans mécanisme de contrôle \(test 13\.1\.1\)/,
        )
    })
    test('aucun verdict : redirection immédiate (délai 0) — validée par le test 13.1.2', async () => {
        // Cible = ancre du même document : le navigateur exécute bien le refresh
        // immédiat mais sans détruire la page (une vraie URL couperait le test en
        // pleine analyse). Le check ne lit que le délai, pas la cible.
        const verdicts = await scanHtml(
            '<!DOCTYPE html><html lang="fr"><head><title>Redirection</title><meta http-equiv="refresh" content="0;url=#contenu"></head><body><p id="contenu">Redirection…</p></body></html>',
        )
        expectAucunVerdict(verdicts, '13.1')
    })
    test('aucun verdict : délai de 24 h (≥ 20 h) — validé d’office par le référentiel', async () => {
        const verdicts = await scanHtml(
            '<!DOCTYPE html><html lang="fr"><head><title>Session</title><meta http-equiv="refresh" content="86400"></head><body><p>x</p></body></html>',
        )
        expectAucunVerdict(verdicts, '13.1')
    })
})

describe('13.8 — Chaque contenu en mouvement ou clignotant est-il contrôlable ?', () => {
    // Méthodologie (tests 13.8.1 et 13.8.2) : <marquee> (mouvement) et <blink>
    // (clignotement) n'offrent aucun mécanisme d'arrêt = violations certaines.
    // Violation seulement : les animations CSS/JS ne sont pas détectées.
    test('13.8.1 non conforme : un <marquee> — commentaire citant les tests 13.8.1/13.8.2', () => {
        expectNonConforme(
            nonConforme,
            '13.8',
            /<marquee> ou <blink>.*sans mécanisme de contrôle \(tests 13\.8\.1 et 13\.8\.2\)/,
        )
    })
    test('13.8.2 non conforme : un <blink> (contenu clignotant)', async () => {
        const verdicts = await scanHtml(pageAvec('<blink>Promotion</blink>'))
        expectNonConforme(verdicts, '13.8', /<marquee> ou <blink>/)
    })
    test('aucun verdict : aucun <marquee> ni <blink> sur la page', () => {
        expectAucunVerdict(conforme, '13.8')
    })
})

// ─── Précédence des verdicts ──────────────────────────────────────────────────

describe('Précédence : non conforme > non applicable > conforme', () => {
    // Sans image, axe conclut « conforme » sur 1.1 (aucune violation) alors que
    // l'applicabilité pose « non applicable » : le N/A doit gagner, un conforme
    // sans sujet serait vide de sens.
    test('page sans image : 1.1 est non applicable, pas conforme', () => {
        expectStatus(sansSujets, '1.1', 'non_applicable')
    })
    // À l'inverse, une violation prouvée doit gagner sur tout le reste.
    test('page avec violation : 1.1 reste non conforme malgré le verdict conforme candidat d’axe sur d’autres règles', () => {
        expectStatus(nonConforme, '1.1', 'non_conforme')
    })
})


// ─── Localisation des non-conformités ─────────────────────────────────────────

// Un compteur (« 2 champs sans indication ») n'est pas exploitable : chaque
// verdict non conforme doit désigner les éléments fautifs, avec un sélecteur
// utilisable dans le navigateur et les preuves propres au check.
describe('Occurrences : où se trouve la non-conformité', () => {
    test('1.2 — l’attribut contradictoire est nommé', () => {
        expectDetail(
            nonConforme,
            '1.2',
            'Alternatives en contradiction',
            /aria-label/,
        )
    })
    test('2.1 — le cadre sans title est désigné avec sa source', () => {
        expectDetail(nonConforme, '2.1', 'Cadre', /^iframe$/)
    })
    test('4.10 — le média en autoplay est désigné', () => {
        expectDetail(nonConforme, '4.10', 'Média', /^video$/)
    })
    test('5.8 — le marqueur de tableau de données est cité', () => {
        expectDetail(
            nonConforme,
            '5.8',
            'Marqueurs de tableau de données',
            /<th>/,
        )
    })
    test('8.2 — l’id dupliqué est nommé et l’occurrence pointe le doublon', () => {
        expectDetail(nonConforme, '8.2', 'Identifiant dupliqué', /^bloc$/)
        const [occurrence] = occurrencesOf(nonConforme, '8.2')
        // Le sélecteur ne peut pas être #bloc : deux éléments le portent.
        assert.ok(
            occurrence !== undefined && !occurrence.selector.includes('#bloc'),
            `sélecteur ambigu pour un id dupliqué : "${occurrence?.selector}"`,
        )
    })
    test('8.8 — le code de langue invalide est cité', () => {
        expectDetail(nonConforme, '8.8', 'Code de langue', /^zz$/)
    })
    test('8.9 — la balise dépréciée est nommée', () => {
        expectDetail(nonConforme, '8.9', 'Balise dépréciée', /^<u>$/)
    })
    test('8.10 — la valeur de dir invalide est citée', () => {
        expectDetail(nonConforme, '8.10', 'Valeur de dir', /^vertical$/)
    })
    test('9.1 — le titre qui saute un niveau est désigné', () => {
        expectDetail(nonConforme, '9.1', 'Niveau de ce titre', /^h3$/)
        expectDetail(nonConforme, '9.1', 'Niveau attendu', /^h2 au plus$/)
    })
    test('11.10 — le champ obligatoire et son étiquette sont cités', () => {
        expectDetail(nonConforme, '11.10', 'Champ', /^nom$/)
        expectDetail(nonConforme, '11.10', 'Étiquette', /« Nom »/)
        expectDetail(nonConforme, '11.10', 'Marqueur technique', /^required$/)
    })
    test('13.8 — la balise en mouvement est nommée', () => {
        expectDetail(nonConforme, '13.8', 'Balise', /^<marquee>$/)
    })

    test('le sélecteur remonté retrouve bien l’élément dans la page', async () => {
        const verdicts = await scanHtml(
            pageAvec('<p><u>souligné</u></p>'),
        )
        const [occurrence] = occurrencesOf(verdicts, '8.9')
        assert.ok(occurrence)
        assert.match(occurrence.selector, /u$/)
        assert.equal(occurrence.text, 'souligné')
        assert.equal(occurrence.landmark, 'Contenu principal')
        assert.match(occurrence.html, /^<u>/)
    })

    test('une non-conformité répétée est plafonnée à 5 occurrences', async () => {
        const verdicts = await scanHtml(
            pageAvec('<p>' + '<u>x</u>'.repeat(9) + '</p>'),
        )
        const occurrences = occurrencesOf(verdicts, '8.9')
        assert.equal(occurrences.length, 5)
        // Le compte réel reste dans le commentaire du verdict.
        expectNonConforme(verdicts, '8.9', /^9 balise\(s\)/)
    })
})
