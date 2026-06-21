"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ExternalLink, FileDown } from "lucide-react"

import { trpc } from "@/trpc/react"
import { cn } from "@/lib/utils"
import {
  RGAA_CRITERIA_COUNT,
  sumStatusCounts,
  treatedCount,
} from "@/lib/rgaa"
import type { AuditDetail } from "@/trpc/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SegmentedBar } from "@/components/audit/segmented-bar"
import { ExportExcelButton } from "@/components/audit/export-excel-button"
import {
  STATUS_BG_CLASS,
  STATUS_LEGEND_LABELS,
  STATUS_SEGMENTS,
} from "@/components/audit/status-config"

const TABS = [
  { segment: "criteria", label: "Grille des critères" },
  { segment: "overview", label: "Vue d'ensemble" },
  { segment: "reports", label: "Livrables" },
] as const

interface AuditHeaderProps {
  auditId: string
  organizationName: string | null
  initialAudit: AuditDetail
}

export function AuditHeader({
  auditId,
  organizationName,
  initialAudit,
}: AuditHeaderProps) {
  const pathname = usePathname()
  const utils = trpc.useUtils()

  // initialData = données rendues côté serveur ; la barre de progression se
  // rafraîchit ensuite via l'invalidation déclenchée par la grille.
  const { data: audit } = trpc.audits.getById.useQuery(
    { id: auditId },
    { initialData: initialAudit },
  )

  const updateStatus = trpc.audits.updateAuditStatus.useMutation({
    onSuccess: () => {
      utils.audits.getById.invalidate({ id: auditId })
      utils.audits.list.invalidate()
      utils.audits.stats.invalidate()
    },
  })

  const totals = sumStatusCounts(audit.themeProgress)
  const progression = Math.round(
    (treatedCount(totals) / RGAA_CRITERIA_COUNT) * 100,
  )
  const isCompleted = audit.status === "completed"
  const isPendingReview = audit.status === "pending_review"
  const activeSegment =
    TABS.find((tab) => pathname.endsWith(`/${tab.segment}`))?.segment ??
    "criteria"

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface">
      <div className="space-y-4 px-6 pt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="truncate">{organizationName ?? "Cabinet"}</span>
              <span aria-hidden>/</span>
              <Link href="/audits" className="hover:text-foreground">
                Audits
              </Link>
              <span aria-hidden>/</span>
              <span className="truncate text-foreground">{audit.name}</span>
            </nav>

            <div className="flex items-center gap-3">
              <h1 className="font-heading text-xl font-bold text-foreground">
                {audit.name}
              </h1>
              <a
                href={audit.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Badge variant="secondary" className="gap-1">
                  {audit.siteUrl}
                  <ExternalLink className="size-3" />
                </Badge>
              </a>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {isCompleted ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={updateStatus.isPending}
                onClick={() =>
                  updateStatus.mutate({ auditId, status: "in_progress" })
                }
              >
                Réouvrir
              </Button>
            ) : isPendingReview ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={updateStatus.isPending}
                  onClick={() =>
                    updateStatus.mutate({ auditId, status: "in_progress" })
                  }
                >
                  Réouvrir
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  disabled={updateStatus.isPending}
                  onClick={() =>
                    updateStatus.mutate({ auditId, status: "completed" })
                  }
                >
                  Valider
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={updateStatus.isPending}
                onClick={() =>
                  updateStatus.mutate({ auditId, status: "pending_review" })
                }
              >
                Soumettre à relecture
              </Button>
            )}

            <span className="inline-flex items-center gap-1.5 text-sm text-success">
              <span className="size-2 rounded-full bg-success" aria-hidden />
              Enregistré
            </span>

            <ExportExcelButton auditId={auditId} size="sm" />

            <Button
              type="button"
              size="sm"
              render={<Link href={`/audits/${auditId}/reports`} />}
            >
              <FileDown />
              Générer les livrables
            </Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="font-medium text-foreground">
              Progression {progression}%
            </span>
            <ul className="flex items-center gap-3 text-xs text-muted-foreground">
              {STATUS_SEGMENTS.map((status) => (
                <li key={status} className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      STATUS_BG_CLASS[status],
                    )}
                    aria-hidden
                  />
                  <span className="tabular-nums text-foreground">
                    {totals[status]}
                  </span>
                  {STATUS_LEGEND_LABELS[status]}
                </li>
              ))}
            </ul>
          </div>
          <SegmentedBar counts={totals} />
        </div>

        <nav className="flex items-center gap-6" aria-label="Onglets de l'audit">
          {TABS.map((tab) => {
            const isActive = tab.segment === activeSegment
            return (
              <Link
                key={tab.segment}
                href={`/audits/${auditId}/${tab.segment}`}
                className={cn(
                  "-mb-px border-b-2 pb-2.5 text-sm transition-colors",
                  isActive
                    ? "border-primary font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
