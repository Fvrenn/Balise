import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="mx-12 space-y-6 px-6 py-10">
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-80 w-full rounded-lg" />
    </div>
  )
}
