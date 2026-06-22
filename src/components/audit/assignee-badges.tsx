"use client"

import { Badge } from "@/components/ui/badge"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

// Forme minimale d'un assigné côté UI : nom pour le badge, email pour la carte au
// survol. Structurellement identique à ce que renvoient les procédures tRPC.
export type AssigneeSummary = { userId: string; name: string; email: string }

// Badge(s) résumant les assignés : nom du premier (le plus ancien) puis « +N » s'il
// en reste d'autres. Sans assigné (cas limite, normalement empêché par le minimum à
// un), affiche un tiret. Bloc visuel réutilisé tel quel comme déclencheur du survol
// et du popover d'édition.
export function AssigneeBadgesInline({
  assignees,
}: {
  assignees: AssigneeSummary[]
}) {
  if (assignees.length === 0) {
    return <span className="text-muted-foreground">—</span>
  }
  const [first, ...rest] = assignees
  return (
    <span className="inline-flex items-center gap-1">
      <Badge variant="secondary" className="max-w-[10rem] truncate">
        {first.name}
      </Badge>
      {rest.length > 0 ? <Badge variant="outline">+{rest.length}</Badge> : null}
    </span>
  )
}

// Liste complète nom + email — contenu de la carte affichée au survol des badges.
export function AssigneeHoverList({
  assignees,
}: {
  assignees: AssigneeSummary[]
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">
        {assignees.length > 1
          ? `${assignees.length} auditeurs assignés`
          : "Auditeur assigné"}
      </p>
      <ul className="space-y-1.5">
        {assignees.map((assignee) => (
          <li key={assignee.userId} className="leading-tight">
            <span className="text-sm font-medium text-foreground">
              {assignee.name}
            </span>
            <span className="block text-xs text-muted-foreground">
              {assignee.email}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Affichage en lecture seule : badges + liste complète au survol. Pour les tableaux
// non éditables (tableau de bord, fiche client). `relative z-10` place les badges
// au-dessus du lien étiré d'une ligne cliquable, pour que le survol fonctionne.
export function AssigneeBadges({
  assignees,
}: {
  assignees: AssigneeSummary[]
}) {
  if (assignees.length === 0) {
    return <span className="text-muted-foreground">—</span>
  }
  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <span className="relative z-10 inline-flex w-fit cursor-default items-center" />
        }
      >
        <AssigneeBadgesInline assignees={assignees} />
      </HoverCardTrigger>
      <HoverCardContent>
        <AssigneeHoverList assignees={assignees} />
      </HoverCardContent>
    </HoverCard>
  )
}
