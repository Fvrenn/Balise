import type { LucideIcon } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"

interface StatCardProps {
  label: string
  value: number | undefined
  icon: LucideIcon
  isLoading: boolean
}

export function StatCard({ label, value, icon: Icon, isLoading }: StatCardProps) {
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
