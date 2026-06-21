"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Search } from "lucide-react"
import { toast } from "sonner"

import { trpc } from "@/trpc/react"
import { cn } from "@/lib/utils"
import {
  emptyStatusCounts,
  sumStatusCounts,
  treatedCount,
  type FindingStatus,
  type ThemeProgress,
} from "@/lib/rgaa"
import type { AuditFindingRow } from "@/trpc/types"
import { Button } from "@/components/ui/button"
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
  const pages = auditQuery.data?.pages ?? []

  // État local optimiste : chaque interaction le met à jour immédiatement, la
  // sauvegarde réseau suit en arrière-plan (débounce).
  const [stateById, setStateById] = useState<Map<string, FindingState>>(
    () => new Map(),
  )
  const [filter, setFilter] = useState<FilterTab>("all")
  const [search, setSearch] = useState("")
  const [activeThemeId, setActiveThemeId] = useState<number | null>(null)
  const [themeToConfirm, setThemeToConfirm] = useState<number | null>(null)

  // Miroir du state pour lire la dernière valeur dans les timers de sauvegarde.
  const stateRef = useRef(stateById)
  stateRef.current = stateById
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  // Seed unique à l'arrivée des findings ; ensuite l'état local fait foi (on ne
  // refetch jamais getFindings pour ne pas écraser des éditions en cours).
  useEffect(() => {
    if (findingsQuery.data && stateById.size === 0) {
      const seeded = new Map<string, FindingState>()
      for (const finding of findingsQuery.data) {
        seeded.set(finding.id, {
          status: finding.status,
          comment: finding.comment ?? "",
          concernedPageIds: finding.concernedPageIds ?? [],
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
          concernedPageIds: state.concernedPageIds,
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

  const patchFinding = useCallback(
    (findingId: string, patch: Partial<FindingState>) => {
      setStateById((prev) => {
        const current = prev.get(findingId)
        if (!current) return prev
        const next = new Map(prev)
        next.set(findingId, { ...current, ...patch })
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
  const handlePagesChange = useCallback(
    (findingId: string, concernedPageIds: string[]) =>
      patchFinding(findingId, { concernedPageIds }),
    [patchFinding],
  )

  // Avancement par thématique recalculé en continu depuis l'état local : la
  // sidebar et les scores de section réagissent instantanément.
  const themeProgress = useMemo<ThemeProgress[]>(() => {
    const byTheme = new Map<number, ThemeProgress>()
    for (const finding of findings) {
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
    return [...byTheme.values()].sort((a, b) => a.themeId - b.themeId)
  }, [findings, stateById])

  const totals = useMemo(
    () => sumStatusCounts(themeProgress),
    [themeProgress],
  )

  const sections = useMemo<ThemeSection[]>(() => {
    if (filter === "auto" || filter === "review") return []

    const query = search.trim().toLowerCase()
    const visible = findings.filter((finding) => {
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
  }, [findings, filter, search, activeThemeId])

  function confirmMarkThemeNA(themeId: number) {
    setStateById((prev) => {
      const next = new Map(prev)
      for (const finding of findings) {
        if (finding.themeId !== themeId) continue
        const current = next.get(finding.id)
        if (current) next.set(finding.id, { ...current, status: "non_applicable" })
      }
      return next
    })
    markThemeNA.mutate({ auditId, themeId })
    setThemeToConfirm(null)
  }

  if (findingsQuery.isLoading || stateById.size === 0) {
    return (
      <p className="px-6 py-10 text-sm text-muted-foreground">
        Chargement de la grille…
      </p>
    )
  }

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "Tous les critères", count: findings.length },
    { key: "auto", label: "Automatique", count: 0 },
    { key: "review", label: "À revoir", count: 0 },
    { key: "manual", label: "Test manuel", count: findings.length },
  ]

  const progressById = new Map(themeProgress.map((t) => [t.themeId, t]))

  return (
    <div className="flex gap-6 px-6 py-6">
      <aside className="sticky top-4 hidden self-start lg:block">
        <ThemeSidebar
          themes={themeProgress}
          totals={totals}
          activeThemeId={activeThemeId}
          onSelect={setActiveThemeId}
        />
      </aside>

      <div className="min-w-0 flex-1 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm transition-colors",
                  filter === tab.key
                    ? "bg-secondary font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {tab.label}
                <span className="text-xs tabular-nums text-muted-foreground">
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

        {sections.length === 0 ? (
          <p className="rounded-xl border border-border bg-surface px-4 py-10 text-center text-sm text-muted-foreground">
            Aucun critère ne correspond à ce filtre.
          </p>
        ) : (
          sections.map((section) => {
            const progress = progressById.get(section.themeId)
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
                    onClick={() => setThemeToConfirm(section.themeId)}
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
                        onStatusChange={handleStatusChange}
                        onCommentChange={handleCommentChange}
                        onPagesChange={handlePagesChange}
                      />
                    )
                  })}
                </div>
              </section>
            )
          })
        )}
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
              applicable ». Vous pourrez les modifier individuellement ensuite.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Annuler
            </DialogClose>
            <Button
              type="button"
              onClick={() => {
                if (themeToConfirm !== null) confirmMarkThemeNA(themeToConfirm)
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
