"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Check, ChevronDown, Search } from "lucide-react"

import { trpc } from "@/trpc/react"
import { cn } from "@/lib/utils"
import {
  buildThemeProgress,
  emptyStatusCounts,
  sumStatusCounts,
  treatedCount,
  type FindingStatus,
  type ThemeProgress,
} from "@/lib/rgaa"
import type { AuditFindingRow } from "@/trpc/types"
import { Button } from "@/components/ui/button"
import {
  FacetedFilterButton,
  type FacetedFilterOption,
} from "@/components/ui/data-table-faceted-filter"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingMessage } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { STATUS_LABELS, STATUS_SEGMENTS } from "@/components/audit/status-config"
import { ThemeSidebar } from "@/components/audit/theme-sidebar"
import { useHeaderCollapse } from "../header-collapse-context"
import { CriterionRow } from "./criterion-row"
import { PageScanButton } from "./page-scan-button"
import { SamplePageTabs } from "./sample-page-tabs"
import { ThemeNaDialog } from "./theme-na-dialog"
import { useFindingEditor } from "./use-finding-editor"

const STATUS_FILTER_OPTIONS: FacetedFilterOption[] = STATUS_SEGMENTS.map(
  (status) => ({ value: status, label: STATUS_LABELS[status] }),
)

interface ThemeSection {
  themeId: number
  themeName: string
  findings: AuditFindingRow[]
}

export function CriteriaWorkspace({ auditId }: { auditId: string }) {
  const auditQuery = trpc.audits.getById.useQuery({ id: auditId })
  const { collapseOnce } = useHeaderCollapse()
  const autoCollapsedRef = useRef(false)

  const {
    findings,
    isLoading: findingsLoading,
    stateById,
    stateRef,
    findingIdByCriterionPage,
    patchFinding,
    copyToPages,
    markThemeNAForPages,
  } = useFindingEditor(auditId)

  const pages = useMemo(
    () => auditQuery.data?.pages ?? [],
    [auditQuery.data?.pages],
  )

  // Onglet de page actif porté par l'URL (?page=…) ; par défaut la première
  // page de l'échantillon.
  const searchParams = useSearchParams()
  const pageParam = searchParams.get("page")
  const activePageId =
    pages.find((page) => page.id === pageParam)?.id ?? pages[0]?.id ?? null

  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [showScanOnly, setShowScanOnly] = useState(false)
  const [search, setSearch] = useState("")
  const [activeThemeId, setActiveThemeId] = useState<number | null>(null)
  const [themeToConfirm, setThemeToConfirm] = useState<number | null>(null)
  const [collapsedThemeIds, setCollapsedThemeIds] = useState<Set<number>>(
    () => new Set(),
  )

  const toggleThemeCollapse = useCallback((themeId: number) => {
    setCollapsedThemeIds((previous) => {
      const next = new Set(previous)
      if (next.has(themeId)) next.delete(themeId)
      else next.add(themeId)
      return next
    })
  }, [])

  const handleStatusChange = useCallback(
    (findingId: string, status: FindingStatus) => {
      if (!autoCollapsedRef.current) {
        autoCollapsedRef.current = true
        collapseOnce()
      }
      patchFinding(findingId, { status })
    },
    [patchFinding, collapseOnce],
  )
  const handleCommentChange = useCallback(
    (findingId: string, comment: string) =>
      patchFinding(findingId, { comment }),
    [patchFinding],
  )

  // Avancement par thématique (statut global du critère, toutes pages agrégées) :
  // alimente la sidebar et la barre de progression du header.
  const themeProgress = useMemo<ThemeProgress[]>(() => {
    return buildThemeProgress(
      findings.map((finding) => ({
        criterionId: finding.criterionId,
        themeId: finding.themeId,
        themeName: finding.themeName,
        status: stateById.get(finding.id)?.status ?? finding.status,
      })),
    )
  }, [findings, stateById])

  const totals = useMemo(() => sumStatusCounts(themeProgress), [themeProgress])

  // Findings de la page active uniquement (la grille est éditée page par page).
  const activeFindings = useMemo(
    () => findings.filter((finding) => finding.pageId === activePageId),
    [findings, activePageId],
  )

  // Avancement par thématique *de la page active* — affiché dans l'en-tête de chaque
  // section pour refléter le travail restant sur cette page précise.
  const pageProgressById = useMemo(() => {
    const byTheme = new Map<number, ThemeProgress>()
    for (const finding of activeFindings) {
      const status = stateById.get(finding.id)?.status ?? finding.status
      let theme = byTheme.get(finding.themeId)
      if (!theme) {
        theme = {
          themeId: finding.themeId,
          themeName: finding.themeName,
          total: 0,
          ...emptyStatusCounts(),
        }
        byTheme.set(finding.themeId, theme)
      }
      theme.total += 1
      theme[status] += 1
    }
    return byTheme
  }, [activeFindings, stateById])

  const sections = useMemo<ThemeSection[]>(() => {
    const query = search.trim().toLowerCase()
    const selectedStatuses = new Set(statusFilter)
    const visible = activeFindings.filter((finding) => {
      if (activeThemeId !== null && finding.themeId !== activeThemeId) {
        return false
      }
      // Statut et source vivent dans l'état client (stateById), qui prime sur
      // la valeur serveur : un finding modifié à l'instant est filtré selon
      // sa nouvelle valeur, sans attendre la sauvegarde.
      const state = stateById.get(finding.id)
      if (showScanOnly && state?.source !== "scan") return false
      const status = state?.status ?? finding.status
      if (selectedStatuses.size > 0 && !selectedStatuses.has(status)) {
        return false
      }
      if (!query) return true
      return (
        finding.title.toLowerCase().includes(query) ||
        finding.criterionId.toLowerCase().includes(query)
      )
    })

    const byTheme = new Map<number, ThemeSection>()
    for (const finding of visible) {
      let section = byTheme.get(finding.themeId)
      if (!section) {
        section = {
          themeId: finding.themeId,
          themeName: finding.themeName,
          findings: [],
        }
        byTheme.set(finding.themeId, section)
      }
      section.findings.push(finding)
    }
    return [...byTheme.values()].sort((a, b) => a.themeId - b.themeId)
  }, [activeFindings, statusFilter, showScanOnly, stateById, search, activeThemeId])

  if (
    findingsLoading ||
    auditQuery.isLoading ||
    stateById.size === 0 ||
    !activePageId
  ) {
    return <LoadingMessage>Chargement de la grille…</LoadingMessage>
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Barre d'onglets de pages — le bg-background naturel de l'app crée le contraste */}
      <SamplePageTabs pages={pages} activePageId={activePageId} />

      {/* Contenu principal — bg-surface (blanc) = même couleur que le tab actif */}
      <div className="flex gap-6 bg-surface px-6 py-6 flex-1 min-h-0">
        <aside className="hidden self-start lg:block w-64 shrink-0 h-full overflow-y-auto pr-2">
          <ThemeSidebar
            themes={themeProgress}
            totals={totals}
            activeThemeId={activeThemeId}
            onSelect={setActiveThemeId}
          />
        </aside>

        <div className="min-w-0 flex-1 flex flex-col h-full">
          <div className="flex flex-wrap items-center justify-between gap-3 shrink-0 mb-4">
            <div className="flex flex-wrap items-center gap-4">
              <FacetedFilterButton
                title="Statut"
                options={STATUS_FILTER_OPTIONS}
                value={statusFilter}
                onChange={setStatusFilter}
              />
              <div className="flex items-center gap-2">
                <Switch
                  id="scan-only-filter"
                  checked={showScanOnly}
                  onCheckedChange={setShowScanOnly}
                />
                <Label
                  htmlFor="scan-only-filter"
                  className="cursor-pointer text-sm font-normal text-muted-foreground"
                >
                  Remplis par le scanner
                </Label>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <PageScanButton pageId={activePageId} />
              <div className="relative w-full sm:w-64">
                <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Rechercher un critère…"
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-10">
            {sections.length === 0 ? (
            <p className="rounded-xl border border-border bg-surface px-4 py-10 text-center text-sm text-muted-foreground">
              Aucun critère ne correspond à ce filtre.
            </p>
          ) : (
            sections.map((section) => {
              const progress = pageProgressById.get(section.themeId)
              const isCollapsed = collapsedThemeIds.has(section.themeId)
              const isSectionDone =
                progress !== undefined &&
                progress.total > 0 &&
                treatedCount(progress) === progress.total
              return (
                <section
                  key={section.themeId}
                  // content-visibility : le navigateur ne calcule pas le layout
                  // des sections hors écran — le montage des ~106 critères au
                  // changement de page ne bloque plus le rendu initial.
                  className={cn(
                    "overflow-hidden rounded-xl border bg-surface [content-visibility:auto] [contain-intrinsic-size:auto_800px]",
                    isSectionDone ? "border-success/40" : "border-border",
                  )}
                >
                  <div
                    className={cn(
                      "relative flex items-center justify-between gap-4 px-4 py-3",
                      isSectionDone ? "bg-success/5" : "bg-surface-2",
                      !isCollapsed &&
                        (isSectionDone
                          ? "border-b border-success/20"
                          : "border-b border-border"),
                    )}
                  >
                    {/* Le pseudo-élément after étend la zone cliquable du bouton à
                        tout le bandeau ; le bouton N/A repasse au-dessus via
                        position:relative. */}
                    <button
                      type="button"
                      onClick={() => toggleThemeCollapse(section.themeId)}
                      aria-expanded={!isCollapsed}
                      className="group flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left outline-none after:absolute after:inset-0 focus-visible:ring-3 focus-visible:ring-ring/40"
                    >
                      <ChevronDown
                        aria-hidden
                        className={cn(
                          "size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:text-foreground",
                          isCollapsed && "-rotate-90",
                        )}
                      />
                      <h2 className="font-heading text-base font-semibold text-foreground">
                        {section.themeId}. {section.themeName}
                        {progress ? (
                          <span
                            className={cn(
                              "ml-2 text-sm font-normal tabular-nums",
                              isSectionDone
                                ? "font-medium text-success"
                                : "text-muted-foreground",
                            )}
                          >
                            {treatedCount(progress)}/{progress.total}
                          </span>
                        ) : null}
                      </h2>
                      {isSectionDone ? (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                          <Check className="size-3" aria-hidden />
                          Terminé
                        </span>
                      ) : null}
                    </button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="relative"
                      onClick={() => setThemeToConfirm(section.themeId)}
                    >
                      Tout marquer N/A
                    </Button>
                  </div>

                  {isCollapsed ? null : (
                    <div>
                      {section.findings.map((finding) => {
                        const state = stateById.get(finding.id)
                        if (!state) return null
                        return (
                          <CriterionRow
                            key={finding.id}
                            finding={finding}
                            state={state}
                            pages={pages}
                            findingIdByCriterionPage={findingIdByCriterionPage}
                            stateRef={stateRef}
                            onStatusChange={handleStatusChange}
                            onCommentChange={handleCommentChange}
                            onCopyToPages={copyToPages}
                          />
                        )
                      })}
                    </div>
                  )}
                </section>
              )
            }))}
          </div>
        </div>
      </div>

      <ThemeNaDialog
        open={themeToConfirm !== null}
        pages={pages}
        onOpenChange={(open) => {
          if (!open) setThemeToConfirm(null)
        }}
        onConfirm={(pageIds) => {
          if (themeToConfirm !== null) {
            markThemeNAForPages(themeToConfirm, pageIds)
          }
          setThemeToConfirm(null)
        }}
      />
    </div>
  )
}
