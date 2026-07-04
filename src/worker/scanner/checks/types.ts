import type { Page } from 'playwright'
import type { AxeResults } from 'axe-core'

// Contrat commun des checks automatiques RGAA 4.1.2 — numérotation alignée sur
// le référentiel officiel (docs/RGAA.md). Trois familles :
//   - checks « bidirectionnels » : le test couvre tout le périmètre du critère
//     sur la page, ils concluent conforme OU non conforme ;
//   - checks « violation seulement » : une violation est prouvable, mais son
//     absence ne prouve pas la conformité (facettes non automatisables) — ils ne
//     posent alors rien, le finding reste à l'appréciation de l'auditrice ;
//   - check d'applicabilité : quand le sujet d'une famille de critères est
//     prouvablement absent du DOM (aucune image, aucun tableau…), les critères
//     de la famille sont posés « non applicable », comme le ferait une auditrice.

export type CheckResult = {
    criterionId: string // ex: "1.1"
    status: 'conforme' | 'non_conforme' | 'non_applicable'
    comment?: string // description de la non-conformité ou du motif de N/A
}

export interface CheckContext {
    page: Page
    axeResults: AxeResults
}

export interface Check {
    name: string
    run: (ctx: CheckContext) => Promise<CheckResult[]>
}
