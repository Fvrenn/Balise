"use client"

import { ExternalLink } from "lucide-react"

import { RGAA_CRITERIA_DETAILS } from "@/lib/rgaa-criteria-details"
import type { FindingStatus } from "@/lib/rgaa"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

// Panneau latéral détaillant un critère RGAA : son intitulé, le statut retenu
// et la liste de ses sous-tests officiels (docs/RGAA.md). S'ouvre au clic sur
// une ligne de la grille. Construit sur Sheet (drawer Base UI du projet) plutôt
// que sur une dépendance externe.

const STATUS_LABELS: Record<FindingStatus | "pending", string> = {
  pending: "À traiter",
  conforme: "Conforme",
  non_conforme: "Non conforme",
  non_applicable: "Non applicable",
  non_teste: "Non testé",
}

const STATUS_BADGE_CLASS: Record<FindingStatus | "pending", string> = {
  pending: "bg-muted text-muted-foreground",
  conforme: "bg-success text-success-foreground",
  non_conforme: "bg-destructive text-destructive-foreground",
  non_applicable: "bg-foreground text-background",
  non_teste: "bg-nt text-nt-foreground",
}

export function CriterionDetailDrawer({
  criterionId,
  title,
  status,
  open,
  onOpenChange,
}: {
  criterionId: string
  title: string
  status: FindingStatus | "pending"
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const detail = RGAA_CRITERIA_DETAILS[criterionId]
  const themeId = criterionId.split(".")[0]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="gap-2 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              Critère {criterionId}
            </span>
            <Badge
              className={STATUS_BADGE_CLASS[status]}
              // Badge décoratif : le statut réel reste piloté depuis la ligne.
            >
              {STATUS_LABELS[status]}
            </Badge>
          </div>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            {detail
              ? `${detail.subTests.length} test${detail.subTests.length > 1 ? "s" : ""} à vérifier pour statuer sur ce critère.`
              : "Aucun détail de test disponible pour ce critère."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {detail ? (
            <ol className="space-y-2.5">
              {detail.subTests.map((subTest) => (
                <li
                  key={subTest.id}
                  className="rounded-lg border border-border bg-surface-2 p-3"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="shrink-0 font-mono text-xs font-medium text-foreground tabular-nums">
                      {subTest.id}
                    </span>
                    <p className="text-sm text-foreground">{subTest.title}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : null}

          <a
            href={`https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#${criterionId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Consulter le critère {criterionId} sur le référentiel RGAA (thématique{" "}
            {themeId})
            <ExternalLink className="size-3" />
          </a>
        </div>
      </SheetContent>
    </Sheet>
  )
}
