import Link from "next/link"
import { Plus } from "lucide-react"

import { getServerApi } from "@/trpc/server"
import { handleServerError } from "@/lib/server-utils"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { HeaderActions } from "@/components/header-slot"

import { AuditsStats } from "./audits-stats"
import { AuditsTable } from "./audits-table"

export default async function AuditsPage() {
  const api = await getServerApi()
  const audits = await api.audits.list().catch(handleServerError)

  // Les cartes de synthèse se déduisent de la liste déjà chargée (chaque ligne
  // porte son statut) — inutile d'appeler `audits.stats` en plus.
  const stats = {
    inProgress: audits.filter((audit) => audit.status === "in_progress").length,
    pendingReview: audits.filter((audit) => audit.status === "pending_review")
      .length,
    completed: audits.filter((audit) => audit.status === "completed").length,
  }

  return (
    <div className="mx-12 space-y-6 px-6 py-10">
      <HeaderActions>
        <Link href="/audits/new" className={cn(buttonVariants())}>
          <Plus />
          Nouvel audit
        </Link>
      </HeaderActions>

      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Audits
        </h1>
        <p className="text-sm text-muted-foreground">
          Tous les audits réalisés par votre cabinet.
        </p>
      </div>

      <AuditsStats
        inProgress={stats.inProgress}
        pendingReview={stats.pendingReview}
        completed={stats.completed}
      />

      <AuditsTable audits={audits} />
    </div>
  )
}
