"use client"

import { ScanSearch } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

import { useScan } from "./scan-context"

// Bouton « Lancer le scan » du header d'audit (scan de toutes les pages) ;
// pendant un scan — complet ou mono-page — il laisse place à l'indicateur de
// progression. La logique (SSE, modale, toasts) vit dans ScanProvider.

export function ScanLauncher() {
  const { progress, isStarting, startScan } = useScan()

  if (progress) {
    // totalPages = 0 tant que le worker n'a pas émis son premier événement :
    // on affiche alors une barre indéterminée plutôt qu'un faux 0 %.
    const hasTotal = progress.totalPages > 0
    const percent = hasTotal
      ? Math.round((progress.doneCount / progress.totalPages) * 100)
      : 0

    return (
      <div
        role="status"
        className="flex w-72 shrink-0 items-center gap-3 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2"
      >
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"
        >
          <ScanSearch className="size-4.5 animate-pulse" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate text-xs font-medium text-foreground">
              {hasTotal
                ? `Scan — page ${Math.max(progress.currentPage, 1)}/${progress.totalPages}`
                : "Scan en cours…"}
              {progress.pageLabel ? ` · ${progress.pageLabel}` : ""}
            </span>
            {hasTotal ? (
              <span className="shrink-0 text-xs font-semibold tabular-nums text-primary">
                {percent}%
              </span>
            ) : null}
          </div>

          {hasTotal ? (
            <Progress
              value={progress.doneCount}
              max={progress.totalPages}
              className="mt-1.5 h-1.5"
            />
          ) : (
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-primary/20">
              <div className="h-full w-1/3 rounded-full bg-primary animate-progress-indeterminate" />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isStarting}
      onClick={() => startScan()}
    >
      <ScanSearch />
      Lancer le scan
    </Button>
  )
}
