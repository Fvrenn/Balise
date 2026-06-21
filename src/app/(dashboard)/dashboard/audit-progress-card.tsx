import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"

import { cn } from "@/lib/utils"
import { RGAA_CRITERIA_COUNT } from "@/lib/rgaa"
import { buttonVariants } from "@/components/ui/button"
import { createComplianceCell } from "@/components/ui/data-table-cells"
import type { RouterOutputs } from "@/trpc/types"

type MyAudit = RouterOutputs["audits"]["listMine"][number]

export function AuditProgressCard({ audit }: { audit: MyAudit }) {
  const progression = Math.round(
    (audit.treatedCount / RGAA_CRITERIA_COUNT) * 100,
  )

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">
          {audit.clientName}
        </p>
        <h3 className="font-heading text-base font-semibold text-foreground">
          {audit.name}
        </h3>
        <a
          href={audit.siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex max-w-full items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ExternalLink className="size-3 shrink-0" />
          <span className="truncate">{audit.siteUrl}</span>
        </a>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {audit.treatedCount}/{RGAA_CRITERIA_COUNT} critères traités
          </span>
          <span className="font-medium tabular-nums text-foreground">
            {progression}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${progression}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-muted-foreground">Conformité</span>
          {audit.treatedCount > 0 ? (
            createComplianceCell(audit.complianceRate)
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
        <Link
          href={`/audits/${audit.id}/criteria`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Continuer l&apos;audit
          <ArrowRight />
        </Link>
      </div>
    </div>
  )
}
