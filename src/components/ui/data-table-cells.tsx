import type { ComponentProps, ReactNode } from "react"
import { format, formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

// Rendus de cellule récurrents dans Balise — purs et isomorphes (utilisables
// côté serveur comme client). Volontairement séparés de DataTable, qui est un
// module « use client » : un Server Component (ex. les cartes du dashboard) ne
// peut pas invoquer une fonction définie dans un module client.

type BadgeVariant = ComponentProps<typeof Badge>["variant"]

const AUDIT_STATUS_BADGES: Record<
  string,
  { label: string; variant: BadgeVariant }
> = {
  in_progress: { label: "En cours", variant: "warning" },
  pending_review: { label: "À relire", variant: "secondary" },
  completed: { label: "Terminé", variant: "success" },
}

export function createStatusBadge(status: string): ReactNode {
  const badge = AUDIT_STATUS_BADGES[status] ?? {
    label: status,
    variant: "secondary" as const,
  }
  return <Badge variant={badge.variant}>{badge.label}</Badge>
}

export function createComplianceCell(rate: number | null): ReactNode {
  if (rate === null) return <span className="text-muted-foreground">—</span>

  const value = Math.round(rate)
  return (
    <span className={cn("font-semibold tabular-nums", complianceTone(value))}>
      {value}%
    </span>
  )
}

function complianceTone(rate: number): string {
  if (rate < 50) return "text-destructive"
  if (rate <= 75) return "text-primary"
  return "text-success"
}

export function createDateCell(date: Date | null): ReactNode {
  if (date === null) return <span className="text-muted-foreground">—</span>
  return <span className="tabular-nums">{format(date, "dd/MM/yyyy")}</span>
}

export function createRelativeDate(date: Date): ReactNode {
  return formatDistanceToNow(date, { addSuffix: true, locale: fr })
}
