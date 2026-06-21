import { FileSpreadsheet, FileText } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExportExcelButton } from "@/components/audit/export-excel-button"

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ auditId: string }>
}) {
  const { auditId } = await params

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-6 py-8">
      <div className="space-y-1">
        <h1 className="font-heading text-lg font-semibold text-foreground">
          Livrables
        </h1>
        <p className="text-sm text-muted-foreground">
          Exportez la grille d&apos;audit ou générez le rapport de conformité.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-5">
        <div className="flex items-start gap-3">
          <FileSpreadsheet className="mt-0.5 size-6 text-success" />
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">
              Grille d&apos;audit RGAA (Excel)
            </p>
            <p className="text-sm text-muted-foreground">
              Tous les critères, statuts, commentaires et pages concernées.
            </p>
          </div>
        </div>
        <ExportExcelButton auditId={auditId}>Télécharger</ExportExcelButton>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-5">
        <div className="flex items-start gap-3">
          <FileText className="mt-0.5 size-6 text-muted-foreground" />
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">
                Rapport d&apos;audit (PDF)
              </p>
              <Badge variant="secondary">Bientôt disponible</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Synthèse de conformité mise en forme, prête à transmettre.
            </p>
          </div>
        </div>
        <Button type="button" variant="outline" disabled>
          Télécharger
        </Button>
      </div>
    </div>
  )
}
