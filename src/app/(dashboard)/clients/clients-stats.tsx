import { Building2, CircleCheck, Clock } from "lucide-react"

import { StatCard } from "@/components/ui/stat-card"

import type { RouterOutputs } from "@/trpc/types"

export function ClientsStats({
  stats,
}: {
  stats: RouterOutputs["clients"]["stats"]
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard label="Clients" value={stats.clientCount} icon={Building2} />
      <StatCard
        label="Audits réalisés"
        value={stats.auditsCompleted}
        icon={CircleCheck}
      />
      <StatCard
        label="Audits en cours"
        value={stats.auditsInProgress}
        icon={Clock}
      />
    </div>
  )
}
