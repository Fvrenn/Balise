import ExcelJS from 'exceljs'

import { aggregateCriterionStatus, type FindingStatus } from '@/lib/rgaa'

// Construction du livrable Excel « Grille RGAA ». Fonction pure vis-à-vis de la
// base : elle reçoit les findings déjà chargés et rend le classeur encodé en
// base64 — la procédure tRPC ne garde que la lecture des données et la barrière
// multi-tenant.

const FINDING_STATUS_LABELS: Record<FindingStatus, string> = {
    pending: 'À traiter',
    conforme: 'Conforme',
    non_conforme: 'Non conforme',
    non_applicable: 'Non applicable',
    non_teste: 'Non testé',
}

export interface ExcelFindingRow {
    criterionId: string
    themeName: string
    title: string
    sortOrder: number
    status: FindingStatus
    comment: string | null
    pageId: string
}

interface CriterionExport {
    criterionId: string
    themeName: string
    title: string
    sortOrder: number
    statuses: FindingStatus[]
    nonConformeDetails: { label: string; comment: string }[]
}

// Choix d'export : une ligne par critère (106 lignes) avec son statut *global*
// agrégé — le format le plus exploitable pour les devs du client, qui veulent
// d'abord le verdict par critère. Le détail page par page des non-conformités
// (page + commentaire) est reporté dans deux colonnes dédiées, pour rester
// actionnable sans noyer la grille sous 106 × N lignes.
export async function buildAuditExcel(input: {
    clientName: string
    findings: ExcelFindingRow[]
    pageLabelById: Map<string, string>
}): Promise<{ base64: string; filename: string }> {
    const byCriterion = new Map<string, CriterionExport>()
    for (const finding of input.findings) {
        let row = byCriterion.get(finding.criterionId)
        if (!row) {
            row = {
                criterionId: finding.criterionId,
                themeName: finding.themeName,
                title: finding.title,
                sortOrder: finding.sortOrder,
                statuses: [],
                nonConformeDetails: [],
            }
            byCriterion.set(finding.criterionId, row)
        }
        row.statuses.push(finding.status)
        if (finding.status === 'non_conforme') {
            row.nonConformeDetails.push({
                label:
                    input.pageLabelById.get(finding.pageId) ?? finding.pageId,
                comment: finding.comment ?? '',
            })
        }
    }

    const criterionRows = [...byCriterion.values()].sort(
        (a, b) => a.sortOrder - b.sortOrder,
    )

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Grille RGAA')
    sheet.columns = [
        { header: 'N° critère', key: 'criterion', width: 12 },
        { header: 'Thématique', key: 'theme', width: 28 },
        { header: 'Intitulé', key: 'title', width: 70 },
        { header: 'Statut global', key: 'status', width: 16 },
        { header: 'Pages non conformes', key: 'pages', width: 32 },
        { header: 'Détail des non-conformités', key: 'details', width: 60 },
    ]
    sheet.getRow(1).font = { bold: true }

    for (const row of criterionRows) {
        const globalStatus = aggregateCriterionStatus(row.statuses)
        const nonConformePages = row.nonConformeDetails
            .map((detail) => detail.label)
            .join(', ')
        const details = row.nonConformeDetails
            .filter((detail) => detail.comment.trim().length > 0)
            .map((detail) => `${detail.label} : ${detail.comment}`)
            .join('\n')
        sheet.addRow({
            criterion: row.criterionId,
            theme: row.themeName,
            title: row.title,
            status: FINDING_STATUS_LABELS[globalStatus],
            pages: nonConformePages,
            details,
        })
    }

    const buffer = await workbook.xlsx.writeBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const date = new Date().toISOString().slice(0, 10)
    const slug = input.clientName
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    return {
        base64,
        filename: `Audit-RGAA-${slug || 'client'}-${date}.xlsx`,
    }
}
