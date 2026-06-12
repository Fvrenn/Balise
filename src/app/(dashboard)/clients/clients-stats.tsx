"use client"

import { Building2, CircleCheck, Clock, type LucideIcon } from "lucide-react"

import { trpc } from "@/trpc/react"
import { Skeleton } from "@/components/ui/skeleton"

// Cartes de synthèse en tête de la page Clients. Les trois chiffres proviennent
// d'une seule requête `clients.stats` (cabinet courant uniquement).
export function ClientsStats() {
  const statsQuery = trpc.clients.stats.useQuery()
  const stats = statsQuery.data
  const isLoading = statsQuery.isLoading

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        label="Clients"
        value={stats?.clientCount}
        icon={Building2}
        isLoading={isLoading}
      />
      <StatCard
        label="Audits réalisés"
        value={stats?.auditsCompleted}
        icon={CircleCheck}
        isLoading={isLoading}
      />
      <StatCard
        label="Audits en cours"
        value={stats?.auditsInProgress}
        icon={Clock}
        isLoading={isLoading}
      />
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  isLoading,
}: {
  label: string
  value: number | undefined
  icon: LucideIcon
  isLoading: boolean
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Icon className="size-5 shrink-0 text-muted-foreground" />
      </div>
      {isLoading ? (
        <Skeleton className="mt-3 h-9 w-16" />
      ) : (
        <p className="mt-2 font-heading text-3xl font-bold tabular-nums text-foreground">
          {value ?? 0}
        </p>
      )}
    </div>
  )
}
