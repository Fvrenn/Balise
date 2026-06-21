"use client"

import { CircleCheck, Clock, Eye } from "lucide-react"

import { trpc } from "@/trpc/react"
import { StatCard } from "@/components/ui/stat-card"

export function AuditsStats() {
  const statsQuery = trpc.audits.stats.useQuery()
  const stats = statsQuery.data
  const isLoading = statsQuery.isLoading

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        label="En cours"
        value={stats?.inProgress}
        icon={Clock}
        isLoading={isLoading}
      />
      <StatCard
        label="À relire"
        value={stats?.pendingReview}
        icon={Eye}
        isLoading={isLoading}
      />
      <StatCard
        label="Terminés"
        value={stats?.completed}
        icon={CircleCheck}
        isLoading={isLoading}
      />
    </div>
  )
}
