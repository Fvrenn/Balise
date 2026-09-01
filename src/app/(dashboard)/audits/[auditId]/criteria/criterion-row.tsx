import { Fragment, memo, useState } from "react"
import { Check, Copy, MapPin } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import type { FindingSource, FindingStatus } from "@/lib/rgaa"
import type { AuditDetail, AuditFindingRow } from "@/trpc/types"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { CriterionDetailDrawer } from "./criterion-detail-drawer"

// État éditable d'un finding (pour une page donnée) côté client : source de vérité
// optimiste de la grille. copiedFromPageId, non null, marque une valeur propagée
// depuis une autre page tant qu'elle n'a pas été rééditée à la main.
export interface FindingState {
  status: FindingStatus
  comment: string
  copiedFromPageId: string | null
  // 'scan' = résultat posé par le scanner automatique (badge « Scanner ») ;
  // repasse à 'manual' dès que l'auditrice modifie le finding.
  source: FindingSource
}

type SamplePage = AuditDetail["pages"][number]
type Occurrence = AuditFindingRow["occurrences"][number]

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
    selectedClass: "bg-foreground text-background border-foreground",
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
  findingIdByCriterionPage: Map<string, Map<string, string>>
  stateRef: React.MutableRefObject<Map<string, FindingState>>
  onStatusChange: (findingId: string, status: FindingStatus) => void
  onCommentChange: (findingId: string, comment: string) => void
  onCopyToPages: (findingId: string, targetPageIds: string[]) => void
}

// Une ligne de critère pour la page active. Mémoïsée : seule la ligne dont l'état
// change est re-rendue, la grille reste fluide avec 106 items.
function CriterionRowComponent({
  finding,
  state,
  pages,
  findingIdByCriterionPage,
  stateRef,
  onStatusChange,
  onCommentChange,
  onCopyToPages,
}: CriterionRowProps) {
  const [detailOpen, setDetailOpen] = useState(false)
  const showNonConformeDetails = state.status === "non_conforme"
  const canCopy = state.status !== "pending"
  const otherPages = pages.filter((page) => page.id !== finding.pageId)
  const sourceLabel =
    state.copiedFromPageId === null
      ? null
      : (pages.find((page) => page.id === state.copiedFromPageId)?.label ?? null)

  return (
    <div className="space-y-3 border-b border-border px-4 py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        {/* Zone cliquable : ouvre le panneau de détail du critère (sous-tests).
            Bouton dédié pour rester accessible au clavier sans capturer les
            clics sur les boutons de statut voisins. */}
        <button
          type="button"
          onClick={() => setDetailOpen(true)}
          className="group -mx-2 -my-1 min-w-0 cursor-pointer space-y-1 rounded-md px-2 py-1 text-left outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40"
          aria-haspopup="dialog"
          title="Voir le détail du critère et ses tests"
        >
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {finding.criterionId}
            </span>
            <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Test manuel
            </span>
          </div>
          <p className="text-sm text-foreground group-hover:underline">
            {finding.title}
          </p>
        </button>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <div className="flex items-center gap-2">
            {state.source === "scan" ? (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground" />
                  }
                >
                  Scanner
                </TooltipTrigger>
                <TooltipContent>
                  Résultat posé par le scan automatique — à vérifier.
                </TooltipContent>
              </Tooltip>
            ) : null}
            <div className="flex gap-1">
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

          {sourceLabel || (canCopy && otherPages.length > 0) ? (
            <div className="flex items-center gap-2">
              {sourceLabel ? (
                <span className="text-xs text-muted-foreground">
                  Propagé depuis {sourceLabel}
                </span>
              ) : null}
              {canCopy && otherPages.length > 0 ? (
                <CopyToPagesPopover
                  finding={finding}
                  state={state}
                  pages={otherPages}
                  findingIdByCriterionPage={findingIdByCriterionPage}
                  stateRef={stateRef}
                  onCopy={(targetPageIds) =>
                    onCopyToPages(finding.id, targetPageIds)
                  }
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {showNonConformeDetails && finding.occurrences.length > 0 ? (
        <OccurrenceList occurrences={finding.occurrences} />
      ) : null}

      {showNonConformeDetails ? (
        <div className="space-y-1.5 rounded-lg bg-surface-2 p-3">
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
      ) : null}

      <CriterionDetailDrawer
        criterionId={finding.criterionId}
        title={finding.title}
        status={state.status}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}

// Les éléments précis relevés par le scanner pour ce critère : ils répondent à la
// question que le commentaire laisse ouverte (« 2 textes au contraste
// insuffisant » — lesquels ?). L'auditrice les vérifie sur la page, puis ils
// alimentent le livrable client.
function OccurrenceList({ occurrences }: { occurrences: Occurrence[] }) {
  return (
    <div className="space-y-2 rounded-lg border border-border bg-surface-2 p-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        Éléments concernés · {occurrences.length}
      </p>
      <ul className="space-y-2">
        {occurrences.map((occurrence, index) => (
          <li key={`${occurrence.selector}-${index}`}>
            <OccurrenceCard occurrence={occurrence} />
          </li>
        ))}
      </ul>
    </div>
  )
}

// Une valeur de preuve qui est une couleur s'affiche en pastille : c'est
// immédiatement parlant, là où un code hexadécimal seul demande un effort.
const COLOR_VALUE = /^#[0-9a-f]{3,8}$/i

function OccurrenceCard({ occurrence }: { occurrence: Occurrence }) {
  const [isCopied, setIsCopied] = useState(false)
  const details = Object.entries(occurrence.details ?? {})

  async function handleCopySelector() {
    try {
      await navigator.clipboard.writeText(occurrence.selector)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 1500)
    } catch {
      toast.error(
        "Copie impossible — sélectionnez le sélecteur à la main pour le coller dans les outils de développement.",
      )
    }
  }

  return (
    <div className="space-y-1.5 rounded-md border border-border bg-background p-2.5">
      <div className="flex items-start justify-between gap-3">
        {occurrence.landmark ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
            <MapPin className="size-3 shrink-0 text-muted-foreground" />
            {occurrence.landmark}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">
            Emplacement non déterminé
          </span>
        )}
        <button
          type="button"
          onClick={handleCopySelector}
          title="Copier le sélecteur CSS pour le coller dans les outils de développement"
          className="inline-flex shrink-0 items-center gap-1 rounded px-1 py-0.5 font-mono text-[11px] text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          {isCopied ? (
            <Check className="size-3 text-success" />
          ) : (
            <Copy className="size-3" />
          )}
          {occurrence.selector}
        </button>
      </div>

      {occurrence.text ? (
        <p className="text-sm text-foreground">« {occurrence.text} »</p>
      ) : null}

      {details.length > 0 ? (
        <dl className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {details.map(([label, value]) => (
            <div key={label} className="flex items-center gap-1.5">
              <dt className="text-[11px] text-muted-foreground">{label}</dt>
              <dd className="flex items-center gap-1 text-xs font-medium text-foreground">
                {COLOR_VALUE.test(value) ? (
                  <span
                    // Couleur relevée sur le site audité : valeur dynamique, hors
                    // design system par nature.
                    style={{ backgroundColor: value }}
                    className="size-3 rounded-full border border-border"
                    aria-hidden
                  />
                ) : null}
                {value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      <code className="block overflow-x-auto whitespace-pre rounded bg-muted px-2 py-1 font-mono text-[11px] text-muted-foreground">
        {occurrence.html}
      </code>
    </div>
  )
}

const STATUS_LABELS: Record<string, string> = {
  conforme: "Conforme",
  non_conforme: "Non conforme",
  non_applicable: "Non applicable",
  non_teste: "Non testé",
  pending: "En attente"
}

interface CopyToPagesPopoverProps {
  finding: AuditFindingRow
  state: FindingState
  pages: SamplePage[]
  findingIdByCriterionPage: Map<string, Map<string, string>>
  stateRef: React.MutableRefObject<Map<string, FindingState>>
  onCopy: (targetPageIds: string[]) => void
}

function CopyToPagesPopover({ finding, state, pages, findingIdByCriterionPage, stateRef, onCopy }: CopyToPagesPopoverProps) {
  const [open, setOpen] = useState(false)
  const [copiedTo, setCopiedTo] = useState<Set<string>>(new Set())

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      setTimeout(() => setCopiedTo(new Set()), 200)
    }
  }

  function handleCopyAll() {
    onCopy(pages.map(p => p.id))
    setCopiedTo(new Set(pages.map(p => p.id)))
  }

  function handleCopySingle(pageId: string) {
    onCopy([pageId])
    setCopiedTo(new Set(copiedTo).add(pageId))
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Copy className="size-3" />
            Propager…
          </button>
        }
      />
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex flex-col">
          <div className="border-b border-border p-2">
            <Button size="sm" variant="secondary" className="w-full text-xs font-medium" onClick={handleCopyAll}>
              Propager à toutes les autres pages
            </Button>
          </div>
          <div className="max-h-64 overflow-y-auto p-1.5 space-y-0.5">
            {pages.map((page) => {
              const targetFindingId = findingIdByCriterionPage.get(finding.criterionId)?.get(page.id)
              const targetState = targetFindingId ? stateRef.current.get(targetFindingId) : undefined

              const isSameStatus = targetState?.status === state.status
              const isSameComment = targetState?.comment === state.comment
              const isSame = isSameStatus && isSameComment
              const isCopied = copiedTo.has(page.id) || isSame

              return (
                <div
                  key={page.id}
                  className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{page.label}</span>
                    <span className="text-[10px] uppercase text-muted-foreground">
                      {STATUS_LABELS[targetState?.status || "pending"]}
                    </span>
                  </div>
                  {isCopied ? (
                    <span className="text-success text-xs font-medium px-2">À jour ✓</span>
                  ) : (
                    <Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={() => handleCopySingle(page.id)}>
                      Appliquer
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export const CriterionRow = memo(CriterionRowComponent)
