"use client"

import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"

import type { RouterOutputs } from "@/trpc/types"
import type { FindingStatus } from "@/lib/rgaa"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { FormDialog } from "@/components/ui/form-dialog"

import type { ColumnDef } from "@tanstack/react-table"

// Modale « Des données existent déjà » affichée avant un scan quand des critères
// du périmètre sont déjà renseignés. Présentation pure : le ScanProvider décide
// quand l'ouvrir et relance la mutation selon le choix (écraser ou compléter).

export type ScanConfirmation = Extract<
  RouterOutputs["scan"]["start"],
  { requiresConfirmation: true }
>
type FilledDetail = ScanConfirmation["filledDetails"][number]

const FINDING_STATUS_LABELS: Record<FindingStatus, string> = {
  pending: "À traiter",
  conforme: "Conforme",
  non_conforme: "Non conforme",
  non_applicable: "Non applicable",
  non_teste: "Non testé",
}

const detailColumns: ColumnDef<FilledDetail>[] = [
  {
    accessorKey: "criterionId",
    header: "Critère",
    cell: ({ row }) => (
      <span className="font-mono text-xs tabular-nums">
        {row.original.criterionId}
      </span>
    ),
  },
  { accessorKey: "pageLabel", header: "Page" },
  {
    id: "status",
    header: "Statut actuel",
    cell: ({ row }) => FINDING_STATUS_LABELS[row.original.status],
  },
]

export function ScanConfirmationDialog({
  confirmation,
  isPageScope,
  isLoading,
  onOpenChange,
  onChoose,
}: {
  confirmation: ScanConfirmation | null
  // true = scan restreint à une page : la modale adapte son libellé.
  isPageScope: boolean
  isLoading: boolean
  onOpenChange: (open: boolean) => void
  onChoose: (overwriteExisting: boolean) => void
}) {
  const [showDetails, setShowDetails] = useState(false)
  const open = confirmation !== null

  // Chaque ouverture repart de la vue « choix » — le détail consulté pour un
  // scan précédent ne doit pas réapparaître.
  useEffect(() => {
    if (open) setShowDetails(false)
  }, [open])

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Des données existent déjà"
      description={`${confirmation?.filledCount ?? 0} critère(s) ont déjà été renseignés sur ${isPageScope ? "cette page" : "cet audit"}. Que souhaitez-vous faire ?`}
      isLoading={isLoading}
      footer={
        <div className="flex w-full flex-wrap items-center justify-end gap-2">
          {!showDetails && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowDetails(true)}
            >
              Voir le détail
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => onChoose(false)}
          >
            Ne pas écraser
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isLoading}
            onClick={() => onChoose(true)}
          >
            Écraser tout
          </Button>
        </div>
      }
    >
      {showDetails ? (
        <div className="space-y-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(false)}
          >
            <ArrowLeft />
            Retour
          </Button>
          <div className="max-h-72 overflow-y-auto">
            <DataTable
              columns={detailColumns}
              data={confirmation?.filledDetails ?? []}
            />
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          « Ne pas écraser » ne renseigne que les critères encore à traiter.
          « Écraser tout » remplace aussi les statuts déjà saisis par les
          résultats du scan.
        </p>
      )}
    </FormDialog>
  )
}
