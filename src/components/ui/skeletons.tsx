import { Skeleton } from "@/components/ui/skeleton"

// Squelette de tableau calqué sur DataTable (conteneur arrondi bordé, en-tête
// surface-2, lignes surface) pour limiter le saut de mise en page à l'arrivée
// des données.
export function TableSkeleton({
  rows = 5,
  cols = 4,
}: {
  rows?: number
  cols?: number
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="flex items-center gap-4 bg-surface-2 px-3 py-4">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="h-4 flex-1" />
        ))}
      </div>
      <div className="divide-y divide-border bg-surface">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-4 px-3 py-4">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-5 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// Grille de cartes calquée sur AuditProgressCard (en-tête, barre de progression,
// pied conformité + action).
export function CardGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, cardIndex) => (
        <div
          key={cardIndex}
          className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5"
        >
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-36 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Squelette du header de page d'audit (fil d'Ariane, titre + badge URL, actions,
// barre de progression, onglets) calqué sur AuditHeader.
export function AuditHeaderSkeleton() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface">
      <div className="space-y-4 px-6 pt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <Skeleton className="h-3 w-52" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-56" />
              <Skeleton className="h-6 w-44 rounded-md" />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Skeleton className="h-8 w-40 rounded-md" />
            <Skeleton className="h-8 w-44 rounded-md" />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>

        <div className="flex items-center gap-6 pb-2.5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </header>
  )
}
