"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Search } from "lucide-react"
import { toast } from "sonner"

import { trpc } from "@/trpc/react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemeSidebar } from "@/components/audit/theme-sidebar"
import { buildThemeAggregates, themeTreated } from "@/components/audit/rgaa"
import type { FindingStatus } from "@/components/audit/rgaa"

import { useAuditWorkspace } from "../audit-workspace-context"
import { CriterionRow } from "./criterion-row"
import { MarkThemeNADialog } from "./mark-na-dialog"

const SAVE_DEBOUNCE_MS = 800

interface LocalFinding {
  id: string
  criterionId: string
  title: string
  themeId: number
  themeName: string
  sortOrder: number
  status: FindingStatus
  comment: string
  concernedPageIds: string[]
}

const FILTER_TABS = [
  { id: "all", label: "Tous les critères" },
  { id: "auto", label: "Automatique" },
  { id: "review", label: "À revoir" },
  { id: "manual", label: "Test manuel" },
] as const
type FilterTab = (typeof FILTER_TABS)[number]["id"]

export function CriteriaGrid({ auditId }: { auditId: string }) {
  const { pages, setSaveState } = useAuditWorkspace()
  const utils = trpc.useUtils()
  const findingsQuery = trpc.audits.getFindings.useQuery({ auditId })

  const [findings, setFindings] = useState<LocalFinding[] | null>(null)
  const [activeThemeId, setActiveThemeId] = useState<number | "all">("all")
  const [activeTab, setActiveTab] = useState<FilterTab>("all")
  const [search, setSearch] = useState("")

  const findingsRef = useRef<LocalFinding[]>([])
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>())
  const updateFinding = trpc.audits.updateFinding.useMutation()
  const updateFindingRef = useRef(updateFinding)
  updateFindingRef.current = updateFinding
  const markThemeNA = trpc.audits.markThemeNA.useMutation()
  const markThemeNARef = useRef(markThemeNA)
  markThemeNARef.current = markThemeNA

  // État local initialisé une seule fois depuis le serveur ; ensuite source de
  // vérité (on ne refetch pas la liste après chaque sauvegarde).
  useEffect(() => {
    if (findingsQuery.data && findings === null) {
      setFindings(
        findingsQuery.data.map((finding) => ({
          id: finding.id,
          criterionId: finding.criterionId,
          title: finding.title,
          themeId: finding.themeId,
          themeName: finding.themeName,
          sortOrder: finding.sortOrder,
          status: finding.status,
          comment: finding.comment ?? "",
          concernedPageIds: finding.concernedPageIds ?? [],
        })),
      )
    }
  }, [findingsQuery.data, findings])

  useEffect(() => {
    if (findings) findingsRef.current = findings
  }, [findings])

  useEffect(() => {
    const timers = timersRef.current
    return () => timers.forEach((timer) => clearTimeout(timer))
  }, [])

  const scheduleSave = useCallback(
    (findingId: string) => {
      const timers = timersRef.current
      const existing = timers.get(findingId)
      if (existing) clearTimeout(existing)
      timers.set(
        findingId,
        setTimeout(() => {
          timers.delete(findingId)
          const finding = findingsRef.current.find(
            (item) => item.id === findingId,
          )
          if (!finding) return
          setSaveState("saving")
          updateFindingRef.current.mutate(
            {
              findingId,
              status: finding.status,
              comment: finding.comment || undefined,
              concernedPageIds: finding.concernedPageIds,
            },
            {
              onSuccess: () => {
                setSaveState("saved")
                utils.audits.getById.invalidate({ id: auditId })
              },
              onError: () => {
                setSaveState("error")
                toast.error("L'enregistrement a échoué.")
              },
            },
          )
        }, SAVE_DEBOUNCE_MS),
      )
    },
    [auditId, setSaveState, utils],
  )

  const handleStatusChange = useCallback(
    (findingId: string, status: FindingStatus) => {
      setFindings((prev) =>
        prev
          ? prev.map((finding) =>
              finding.id === findingId ? { ...finding, status } : finding,
            )
          : prev,
      )
      scheduleSave(findingId)
    },
    [scheduleSave],
  )

  const handleCommentChange = useCallback(
    (findingId: string, comment: string) => {
      setFindings((prev) =>
        prev
          ? prev.map((finding) =>
              finding.id === findingId
                ? { ...finding, comment }
                : finding,
            )
          : prev,
      )
      scheduleSave(findingId)
    },
    [scheduleSave],
  )

  const handlePagesChange = useCallback(
    (findingId: string, concernedPageIds: string[]) => {
      setFindings((prev) =>
        prev
          ? prev.map((finding) =>
              finding.id === findingId
                ? { ...finding, concernedPageIds }
                : finding,
            )
          : prev,
      )
      scheduleSave(findingId)
    },
    [scheduleSave],
  )

  const handleMarkThemeNA = useCallback(
    (themeId: number) => {
      setSaveState("saving")
      setFindings((prev) =>
        prev
          ? prev.map((finding) =>
              finding.themeId === themeId
                ? { ...finding, status: "non_applicable" }
                : finding,
            )
          : prev,
      )
      markThemeNARef.current.mutate(
        { auditId, themeId },
        {
          onSuccess: () => {
            setSaveState("saved")
            utils.audits.getById.invalidate({ id: auditId })
          },
          onError: () => {
            setSaveState("error")
            toast.error("L'opération a échoué.")
          },
        },
      )
    },
    [auditId, setSaveState, utils],
  )

  const { themes, summary } = useMemo(
    () => buildThemeAggregates(findings ?? []),
    [findings],
  )

  const term = search.trim().toLowerCase()
  const sections = useMemo(() => {
    if (!findings) return []
    const grouped = new Map<number, LocalFinding[]>()
    for (const finding of findings) {
      if (activeThemeId !== "all" && finding.themeId !== activeThemeId) continue
      if (activeTab === "auto" || activeTab === "review") continue
      if (
        term &&
        !finding.title.toLowerCase().includes(term) &&
        !finding.criterionId.toLowerCase().includes(term)
      ) {
        continue
      }
      const items = grouped.get(finding.themeId) ?? []
      items.push(finding)
      grouped.set(finding.themeId, items)
    }
    return [...grouped.entries()]
      .map(([themeId, items]) => ({
        themeId,
        themeName: items[0].themeName,
        items: [...items].sort((a, b) => a.sortOrder - b.sortOrder),
        aggregate: themes.find((theme) => theme.themeId === themeId),
      }))
      .sort((a, b) => a.themeId - b.themeId)
  }, [findings, activeThemeId, activeTab, term, themes])

  if (!findings) return <GridSkeleton />

  const tabCounts: Record<FilterTab, number> = {
    all: findings.length,
    auto: 0,
    review: 0,
    manual: findings.length,
  }

  return (
    <div className="flex gap-6">
      <aside className="hidden self-start lg:block">
        <ThemeSidebar
          themes={themes}
          totals={summary}
          activeThemeId={activeThemeId === "all" ? null : activeThemeId}
          onSelect={(themeId) => setActiveThemeId(themeId ?? "all")}
        />
      </aside>

      <div className="min-w-0 flex-1 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                {tab.label}
                <span className="tabular-nums text-xs text-muted-foreground">
                  {tabCounts[tab.id]}
                </span>
              </button>
            ))}
          </div>
          <div className="relative w-56">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un critère…"
              className="bg-surface pl-8"
            />
          </div>
        </div>

        {sections.length === 0 ? (
          <p className="rounded-lg border border-border bg-surface py-12 text-center text-sm text-muted-foreground">
            Aucun critère ne correspond.
          </p>
        ) : (
          sections.map((section) => (
            <section
              key={section.themeId}
              className="overflow-hidden rounded-xl border border-border bg-surface"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface-2 px-4 py-3">
                <h2 className="font-heading text-sm font-bold text-foreground">
                  {section.themeId}. {section.themeName}
                  {section.aggregate ? (
                    <span className="ml-2 text-xs font-normal text-muted-foreground tabular-nums">
                      {themeTreated(section.aggregate)}/{section.aggregate.total}
                    </span>
                  ) : null}
                </h2>
                <MarkThemeNADialog
                  themeName={section.themeName}
                  onConfirm={() => handleMarkThemeNA(section.themeId)}
                />
              </div>
              <div>
                {section.items.map((finding) => (
                  <CriterionRow
                    key={finding.id}
                    finding={finding}
                    state={{
                      status: finding.status,
                      comment: finding.comment,
                      concernedPageIds: finding.concernedPageIds,
                    }}
                    pages={pages}
                    onStatusChange={handleStatusChange}
                    onCommentChange={handleCommentChange}
                    onPagesChange={handlePagesChange}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  )
}

function GridSkeleton() {
  return (
    <div className="flex gap-6">
      <div className="hidden w-56 shrink-0 space-y-2 lg:block">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-7 w-full" />
        ))}
      </div>
      <div className="min-w-0 flex-1 space-y-4">
        <Skeleton className="h-9 w-full" />
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
