import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { HeaderActions } from "@/components/header-slot"
import { Skeleton } from "@/components/ui/skeleton"
import { CardGridSkeleton, TableSkeleton } from "@/components/ui/skeletons"

import { AllAuditsSection } from "./all-audits-section"
import { DashboardGreeting } from "./dashboard-greeting"
import { MyAuditsSection } from "./my-audits-section"

// La page ne fetche plus rien : la structure s'affiche immédiatement et chaque
// section de données streame indépendamment derrière son propre Suspense.
export default function DashboardPage() {
  return (
    <div className="mx-12 space-y-8 px-6 py-10">
      <HeaderActions>
        <Link href="/audits/new" className={cn(buttonVariants())}>
          <Plus />
          Nouvel audit
        </Link>
      </HeaderActions>

      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Tableau de bord
        </h1>
        <Suspense fallback={<Skeleton className="h-5 w-44" />}>
          <DashboardGreeting />
        </Suspense>
      </div>

      <Suspense fallback={<CardGridSkeleton count={3} />}>
        <MyAuditsSection />
      </Suspense>

      <Suspense fallback={<TableSkeleton rows={5} cols={6} />}>
        <AllAuditsSection />
      </Suspense>
    </div>
  )
}
