import { Fragment, memo } from "react"

import { cn } from "@/lib/utils"
import type { FindingStatus } from "@/lib/rgaa"
import type { AuditDetail, AuditFindingRow } from "@/trpc/types"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// État éditable d'un finding côté client (source de vérité optimiste de la grille).
export interface FindingState {
  status: FindingStatus
  comment: string
  concernedPageIds: string[]
}

type SamplePage = AuditDetail["pages"][number]

interface StatusOption {
  value: FindingStatus
  label: string
  selectedClass: string
  // Affichée au survol du bouton quand le libellé seul est ambigu (N/A, NT).
  description?: string
}

// Seuls ces quatre statuts sont sélectionnables ; « pending » est l'état initial,
// implicite (aucun bouton actif).
const STATUS_OPTIONS: StatusOption[] = [
  {
    value: "conforme",
    label: "Conforme",
    selectedClass: "bg-success text-success-foreground border-success",
  },
  {
    value: "non_conforme",
    label: "Non conforme",
    selectedClass:
      "bg-destructive text-destructive-foreground border-destructive",
  },
  {
    value: "non_applicable",
    label: "N/A",
    selectedClass: "bg-muted text-muted-foreground border-transparent",
    description:
      "Ce critère ne s'applique pas à ce site (ex : critère sur les formulaires, mais le site n'a pas de formulaire).",
  },
  {
    value: "non_teste",
    label: "NT",
    selectedClass: "bg-nt text-nt-foreground border-transparent",
    description:
      "Le critère s'applique mais n'a pas pu être testé (bug, accès impossible, etc.).",
  },
]

interface CriterionRowProps {
  finding: AuditFindingRow
  state: FindingState
  pages: SamplePage[]
  onStatusChange: (findingId: string, status: FindingStatus) => void
  onCommentChange: (findingId: string, comment: string) => void
  onPagesChange: (findingId: string, pageIds: string[]) => void
}

// Une ligne de critère. Mémoïsée : seule la ligne dont l'état change est re-rendue,
// la grille reste fluide avec 106 items.
function CriterionRowComponent({
  finding,
  state,
  pages,
  onStatusChange,
  onCommentChange,
  onPagesChange,
}: CriterionRowProps) {
  const showNonConformeDetails = state.status === "non_conforme"

  function togglePage(pageId: string) {
    const next = state.concernedPageIds.includes(pageId)
      ? state.concernedPageIds.filter((id) => id !== pageId)
      : [...state.concernedPageIds, pageId]
    onPagesChange(finding.id, next)
  }

  return (
    <div className="space-y-3 border-b border-border px-4 py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {finding.criterionId}
            </span>
            <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Test manuel
            </span>
          </div>
          <p className="text-sm text-foreground">{finding.title}</p>
        </div>

        <div className="flex shrink-0 gap-1">
          {STATUS_OPTIONS.map((option) => {
            const isSelected = state.status === option.value
            const button = (
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onStatusChange(finding.id, option.value)}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                  isSelected
                    ? option.selectedClass
                    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            )
            if (!option.description) {
              return <Fragment key={option.value}>{button}</Fragment>
            }
            return (
              <Tooltip key={option.value}>
                <TooltipTrigger render={button} />
                <TooltipContent>{option.description}</TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </div>

      {showNonConformeDetails ? (
        <div className="space-y-3 rounded-lg bg-surface-2 p-3">
          <div className="space-y-1.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-destructive">
              Commentaire d&apos;audit · Requis
            </p>
            <textarea
              value={state.comment}
              onChange={(event) =>
                onCommentChange(finding.id, event.target.value)
              }
              rows={3}
              placeholder="Décrire la non-conformité constatée, l'élément concerné et la recommandation de correction…"
              className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
          </div>

          {pages.length > 0 ? (
            <div className="space-y-1.5">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Pages concernées
              </p>
              <div className="flex flex-wrap gap-3">
                {pages.map((page) => (
                  <label
                    key={page.id}
                    className="flex items-center gap-1.5 text-sm text-foreground"
                  >
                    <input
                      type="checkbox"
                      checked={state.concernedPageIds.includes(page.id)}
                      onChange={() => togglePage(page.id)}
                      className="size-4 accent-primary"
                    />
                    {page.label}
                  </label>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export const CriterionRow = memo(CriterionRowComponent)
