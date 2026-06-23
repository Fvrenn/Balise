import { CircleCheck, Clock, Eye } from "lucide-react"

import { StatCard } from "@/components/ui/stat-card"

interface AuditsStatsProps {
  inProgress: number
  pendingReview: number
  completed: number
}

export function AuditsStats({
  inProgress,
  pendingReview,
  completed,
}: AuditsStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard label="En cours" value={inProgress} icon={Clock} />
      <StatCard label="À relire" value={pendingReview} icon={Eye} />
      <StatCard label="Terminés" value={completed} icon={CircleCheck} />
    </div>
  )
}
