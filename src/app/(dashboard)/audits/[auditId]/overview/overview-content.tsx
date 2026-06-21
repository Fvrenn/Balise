"use client"

import { useState } from "react"
import Link from "next/link"
import { FileSpreadsheet, FileText } from "lucide-react"

import { trpc } from "@/trpc/react"
import { cn } from "@/lib/utils"
import {
  computeComplianceRate,
  sumStatusCounts,
  treatedCount,
} from "@/lib/rgaa"
import type { AuditDetail } from "@/trpc/types"
import { SegmentedBar } from "@/components/audit/segmented-bar"
import { StatusDonut } from "@/components/audit/status-donut"
import { ExportExcelButton } from "@/components/audit/export-excel-button"
import { ThemeSidebar } from "@/components/audit/theme-sidebar"
import {
  STATUS_BG_CLASS,
  STATUS_LABELS,
  STATUS_SEGMENTS,
} from "@/components/audit/status-config"

interface OverviewContentProps {
  auditId: string
  initialAudit: AuditDetail
}

export function OverviewContent({
  auditId,
  initialAudit,
}: OverviewContentProps) {
  const { data: audit } = trpc.audits.getById.useQuery(
    { id: auditId },
    { initialData: initialAudit },
  )
  const [activeThemeId, setActiveThemeId] = useState<number | null>(null)

  const totals = sumStatusCounts(audit.themeProgress)
  const complianceRate = computeComplianceRate(totals)
  const applicableTested = totals.conforme + totals.non_conforme

  return (
    <div className="flex gap-6 px-6 py-6">
      <aside className="sticky top-4 hidden self-start lg:block">
        <ThemeSidebar
          themes={audit.themeProgress}
          totals={totals}
          activeThemeId={activeThemeId}
          onSelect={setActiveThemeId}
        />
      </aside>

      <div className="min-w-0 flex-1 space-y-6">
        <section className="overflow-hidden rounded-xl border border-border bg-surface">
          <h2 className="border-b border-border px-4 py-3 font-heading text-base font-semibold text-foreground">
            Avancement par thématique
          </h2>
          <ul className="divide-y divide-border">
            {audit.themeProgress.map((theme) => (
              <li
                key={theme.themeId}
                className="flex items-center gap-4 px-4 py-3"
              >
                <span className="w-44 shrink-0 truncate text-sm text-foreground">
                  {theme.themeId}. {theme.themeName}
                </span>
                <SegmentedBar counts={theme} className="flex-1" />
                <span className="w-12 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                  {treatedCount(theme)}/{theme.total}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-medium tracking-wide text-muted-foreground">
            LIVRABLES
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <DeliverableCard
              icon={<FileSpreadsheet className="size-5 text-success" />}
              title="Grille d'audit RGAA (Excel)"
              description="Toutes les évaluations, commentaires et pages concernées."
              action={
                <ExportExcelButton auditId={auditId} size="sm">
                  Télécharger
                </ExportExcelButton>
              }
            />
            <DeliverableCard
              icon={<FileText className="size-5 text-muted-foreground" />}
              title="Rapport d'audit (PDF)"
              description="Synthèse de conformité prête à transmettre au client."
              action={
                <Link
                  href={`/audits/${auditId}/reports`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Ouvrir les livrables
                </Link>
              }
            />
          </div>
        </section>
      </div>

      <aside className="hidden w-80 shrink-0 space-y-6 xl:block">
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface p-5">
          <StatusDonut
            counts={totals}
            centerValue={complianceRate === null ? "—" : `${complianceRate}%`}
            centerLabel="de conformité"
          />
          <ul className="grid w-full grid-cols-2 gap-2">
            {STATUS_SEGMENTS.map((status) => (
              <li key={status} className="flex items-center gap-1.5 text-sm">
                <span
                  className={cn("size-2.5 rounded-sm", STATUS_BG_CLASS[status])}
                  aria-hidden
                />
                <span className="tabular-nums text-foreground">
                  {totals[status]}
                </span>
                <span className="text-muted-foreground">
                  {STATUS_LABELS[status]}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-xs font-medium tracking-wide text-muted-foreground">
            TAUX DE CONFORMITÉ
          </p>
          <p className="mt-1 font-heading text-4xl font-bold text-foreground">
            {complianceRate === null ? "—" : `${complianceRate}%`}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            des critères applicables sont conformes
          </p>
          <p className="mt-3 text-sm tabular-nums text-foreground">
            {totals.conforme} conformes / {applicableTested} applicables testés
          </p>
        </div>
      </aside>
    </div>
  )
}

interface DeliverableCardProps {
  icon: React.ReactNode
  title: string
  description: string
  action: React.ReactNode
}

function DeliverableCard({
  icon,
  title,
  description,
  action,
}: DeliverableCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5">{icon}</span>
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div>{action}</div>
    </div>
  )
}
