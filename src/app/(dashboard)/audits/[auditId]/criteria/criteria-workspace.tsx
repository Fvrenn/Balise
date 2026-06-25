"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { toast } from "sonner"

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
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ThemeSidebar } from "@/components/audit/theme-sidebar"
import {
  CriterionRow,
  type FindingState,
} from "./criterion-row"

const SAVE_DEBOUNCE_MS = 800

type FilterTab = "all" | "auto" | "review" | "manual"

interface ThemeSection {
  themeId: number
  themeName: string
  findings: AuditFindingRow[]
}

export function CriteriaWorkspace({ auditId }: { auditId: string }) {
  const utils = trpc.useUtils()
  const findingsQuery = trpc.audits.getFindings.useQuery({ auditId })
  const auditQuery = trpc.audits.getById.useQuery({ id: auditId })

  const findings = useMemo(
    () => findingsQuery.data ?? [],
    [findingsQuery.data],
  )
  const pages = useMemo(
    () => auditQuery.data?.pages ?? [],
    [auditQuery.data?.pages],
  )

  // Onglet de page actif porté par l'URL (?page=…) pour permettre le lien direct ;
  // par défaut la première page de l'échantillon.
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const pageParam = searchParams.get("page")
  const activePageId =
    pages.find((page) => page.id === pageParam)?.id ?? pages[0]?.id ?? null

  const selectPage = useCallback(
    (pageId: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", pageId)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  // État local optimiste : chaque interaction le met à jour immédiatement, la
  // sauvegarde réseau suit en arrière-plan (débounce). Clé = id de finding, donc
  // une entrée par (critère, page).
  const [stateById, setStateById] = useState<Map<string, FindingState>>(
    () => new Map(),
  )
  const [filter, setFilter] = useState<FilterTab>("all")
  const [search, setSearch] = useState("")
  const [activeThemeId, setActiveThemeId] = useState<number | null>(null)
  const [themeToConfirm, setThemeToConfirm] = useState<number | null>(null)
  const [naPageIds, setNaPageIds] = useState<string[]>([])

  // Miroir du state pour lire la dernière valeur dans les timers de sauvegarde.
  const stateRef = useRef(stateById)
  stateRef.current = stateById
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  // Index (critère → page → id de finding) pour retrouver les findings cibles d'une
  // propagation, et accès direct par id pour la page/critère source.
  const findingById = useMemo(
    () => new Map(findings.map((finding) => [finding.id, finding])),
    [findings],
  )
  const findingIdByCriterionPage = useMemo(() => {
    const byCriterion = new Map<string, Map<string, string>>()
    for (const finding of findings) {
      let byPage = byCriterion.get(finding.criterionId)
      if (!byPage) {
        byPage = new Map()
        byCriterion.set(finding.criterionId, byPage)
      }
      byPage.set(finding.pageId, finding.id)
    }
    return byCriterion
  }, [findings])

  // Seed unique à l'arrivée des findings ; ensuite l'état local fait foi (on ne
  // refetch jamais getFindings pour ne pas écraser des éditions en cours).
  useEffect(() => {
    if (findingsQuery.data && stateById.size === 0) {
      const seeded = new Map<string, FindingState>()
      for (const finding of findingsQuery.data) {
        seeded.set(finding.id, {
          status: finding.status,
          comment: finding.comment ?? "",
          copiedFromPageId: finding.copiedFromPageId ?? null,
        })
      }
      setStateById(seeded)
    }
  }, [findingsQuery.data, stateById.size])

  const saveFinding = trpc.audits.updateFinding.useMutation({
    onSuccess: () => utils.audits.getById.invalidate({ id: auditId }),
    onError: () => toast.error("La sauvegarde a échoué."),
  })
  const markThemeNA = trpc.audits.markThemeNA.useMutation({
    onSuccess: () => utils.audits.getById.invalidate({ id: auditId }),
    onError: () => toast.error("L'action a échoué."),
  })
  const copyFindingToPages = trpc.audits.copyFindingToPages.useMutation({
    onSuccess: () => utils.audits.getById.invalidate({ id: auditId }),
    onError: () => toast.error("La copie a échoué."),
  })

  const scheduleSave = useCallback(
    (findingId: string) => {
      const timers = timersRef.current
      const existing = timers.get(findingId)
      if (existing) clearTimeout(existing)
      const timer = setTimeout(() => {
        timers.delete(findingId)
        const state = stateRef.current.get(findingId)
        if (!state) return
        saveFinding.mutate({
          findingId,
          status: state.status,
          comment: state.comment || null,
        })
      }, SAVE_DEBOUNCE_MS)
      timers.set(findingId, timer)
    },
    [saveFinding],
  )

  // Vide les timers en attente au démontage.
  useEffect(() => {
    const timers = timersRef.current
    return () => timers.forEach((timer) => clearTimeout(timer))
  }, [])

  // Édition manuelle : on met à jour l'état optimiste et on efface l'indicateur de
  // propagation (le finding n'est plus une copie). La sauvegarde serveur fait de même.
  const patchFinding = useCallback(
    (findingId: string, patch: Partial<FindingState>) => {
      setStateById((prev) => {
        const current = prev.get(findingId)
        if (!current) return prev
        const next = new Map(prev)
        next.set(findingId, { ...current, ...patch, copiedFromPageId: null })
        return next
      })
      scheduleSave(findingId)
    },
    [scheduleSave],
  )

  const handleStatusChange = useCallback(
    (findingId: string, status: FindingStatus) =>
      patchFinding(findingId, { status }),
    [patchFinding],
  )
  const handleCommentChange = useCallback(
    (findingId: string, comment: string) =>
      patchFinding(findingId, { comment }),
    [patchFinding],
  )

  // Propagation : copie le statut + commentaire du finding source vers les findings
  // des mêmes critères sur d'autres pages, en marquant copiedFromPageId. Met à jour
  // l'état optimiste de toutes les pages cibles (sans déclencher la sauvegarde par
  // page : la mutation copyFindingToPages persiste l'ensemble).
  const handleCopyToPages = useCallback(
    (sourceFindingId: string, targetPageIds: string[]) => {
      const source = findingById.get(sourceFindingId)
      const sourceState = stateRef.current.get(sourceFindingId)
      if (!source || !sourceState) return
      const byPage = findingIdByCriterionPage.get(source.criterionId)
      if (!byPage) return

      setStateById((prev) => {
        const next = new Map(prev)
        for (const pageId of targetPageIds) {
          if (pageId === source.pageId) continue
          const targetId = byPage.get(pageId)
          if (!targetId || !next.has(targetId)) continue
          next.set(targetId, {
            status: sourceState.status,
            comment: sourceState.comment,
            copiedFromPageId: source.pageId,
          })
        }
        return next
      })

      copyFindingToPages.mutate({ findingId: sourceFindingId, targetPageIds })
    },
    [copyFindingToPages, findingById, findingIdByCriterionPage],
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
    if (filter === "auto" || filter === "review") return []

    const query = search.trim().toLowerCase()
    const visible = activeFindings.filter((finding) => {
      if (activeThemeId !== null && finding.themeId !== activeThemeId) {
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
  }, [activeFindings, filter, search, activeThemeId])

  function openThemeNA(themeId: number) {
    setNaPageIds(pages.map((page) => page.id))
    setThemeToConfirm(themeId)
  }

  function confirmMarkThemeNA(themeId: number, pageIds: string[]) {
    if (pageIds.length === 0) return
    const pageSet = new Set(pageIds)
    setStateById((prev) => {
      const next = new Map(prev)
      for (const finding of findings) {
        if (finding.themeId !== themeId) continue
        if (!pageSet.has(finding.pageId)) continue
        const current = next.get(finding.id)
        if (current) {
          next.set(finding.id, {
            ...current,
            status: "non_applicable",
            copiedFromPageId: null,
          })
        }
      }
      return next
    })
    markThemeNA.mutate({ auditId, themeId, pageIds })
    setThemeToConfirm(null)
  }

  if (
    findingsQuery.isLoading ||
    auditQuery.isLoading ||
    stateById.size === 0 ||
    !activePageId
  ) {
    return (
      <p className="px-6 py-10 text-sm text-muted-foreground">
        Chargement de la grille…
      </p>
    )
  }

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "Tous les critères", count: activeFindings.length },
    { key: "auto", label: "Automatique", count: 0 },
    { key: "review", label: "À revoir", count: 0 },
    { key: "manual", label: "Test manuel", count: activeFindings.length },
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Barre d'onglets de pages — le bg-background naturel de l'app crée le contraste */}
      <div className="isolate px-6 pt-5 pb-0">
        <div
          className="flex w-full items-end gap-1.5 overflow-x-auto pl-3"
          role="tablist"
          aria-label="Pages de l'échantillon"
        >
          {pages.map((page) => {
            const isActive = page.id === activePageId
            return (
              <button
                key={page.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => selectPage(page.id)}
                className={cn(
                  "whitespace-nowrap text-sm font-medium transition-colors",
                  isActive
                    ? "tab-inverted-radius z-10 rounded-t-xl bg-surface px-6 py-3 text-foreground"
                    : "mb-0.5 rounded-t-lg bg-secondary px-5 py-2.5 text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                )}
              >
                {page.label}
              </button>
            )
          })}
        </div>
      </div>

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
            <div className="flex flex-wrap items-center gap-2">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilter(tab.key)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                    filter === tab.key
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      "text-xs tabular-nums",
                      filter === tab.key
                        ? "text-background/70"
                        : "text-muted-foreground",
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

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

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-10">
            {sections.length === 0 ? (
            <p className="rounded-xl border border-border bg-surface px-4 py-10 text-center text-sm text-muted-foreground">
              Aucun critère ne correspond à ce filtre.
            </p>
          ) : (
            sections.map((section) => {
              const progress = pageProgressById.get(section.themeId)
              return (
                <section
                  key={section.themeId}
                  className="overflow-hidden rounded-xl border border-border bg-surface"
                >
                  <div className="flex items-center justify-between gap-4 border-b border-border bg-surface-2 px-4 py-3">
                    <h2 className="font-heading text-base font-semibold text-foreground">
                      {section.themeId}. {section.themeName}
                      {progress ? (
                        <span className="ml-2 text-sm font-normal text-muted-foreground tabular-nums">
                          {treatedCount(progress)}/{progress.total}
                        </span>
                      ) : null}
                    </h2>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => openThemeNA(section.themeId)}
                    >
                      Tout marquer N/A
                    </Button>
                  </div>

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
                          onCopyToPages={handleCopyToPages}
                        />
                      )
                    })}
                  </div>
                </section>
              )
            }))}
          </div>
        </div>
      </div>

      <Dialog
        open={themeToConfirm !== null}
        onOpenChange={(open) => {
          if (!open) setThemeToConfirm(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marquer toute la thématique en N/A ?</DialogTitle>
            <DialogDescription>
              Tous les critères de cette thématique passeront en « non
              applicable » sur les pages sélectionnées. Vous pourrez les
              modifier individuellement ensuite.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Pages concernées
            </p>
            <div className="max-h-56 space-y-0.5 overflow-y-auto">
              {pages.map((page) => (
                <label
                  key={page.id}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-accent"
                >
                  <Checkbox
                    checked={naPageIds.includes(page.id)}
                    onCheckedChange={(checked) =>
                      setNaPageIds((prev) =>
                        checked
                          ? [...prev, page.id]
                          : prev.filter((id) => id !== page.id),
                      )
                    }
                  />
                  <span className="text-sm text-foreground">{page.label}</span>
                </label>
              ))}
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Annuler
            </DialogClose>
            <Button
              type="button"
              disabled={naPageIds.length === 0}
              onClick={() => {
                if (themeToConfirm !== null) {
                  confirmMarkThemeNA(themeToConfirm, naPageIds)
                }
              }}
            >
              Marquer en N/A
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
