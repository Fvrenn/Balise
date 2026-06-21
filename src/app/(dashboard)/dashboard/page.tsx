import Link from "next/link"
import { redirect } from "next/navigation"
import { Plus } from "lucide-react"
import { TRPCError } from "@trpc/server"

import { getServerApi } from "@/trpc/server"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { HeaderActions } from "@/components/header-slot"

import { AuditProgressCard } from "./audit-progress-card"
import { RecentAuditsTable } from "./recent-audits-table"

const RECENT_AUDITS_LIMIT = 5

export default async function DashboardPage() {
  const api = await getServerApi()

  const [member, myAudits, cabinetAudits] = await Promise.all([
    api.member.current(),
    api.audits.listMine(),
    api.audits.list(),
  ]).catch((error: unknown) => {
    // Session valide mais sans cabinet → FORBIDDEN ; pas de session → UNAUTHORIZED.
    // On renvoie vers le login plutôt que de laisser le rendu serveur planter.
    if (
      error instanceof TRPCError &&
      (error.code === "FORBIDDEN" || error.code === "UNAUTHORIZED")
    ) {
      redirect("/login")
    }
    throw error
  })

  const firstName = member.name.trim().split(/\s+/)[0]
  const myAuditsInProgress = myAudits.filter(
    (audit) => audit.status === "in_progress",
  )
  const recentAudits = cabinetAudits.slice(0, RECENT_AUDITS_LIMIT)

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
        <p className="text-sm text-muted-foreground">Bienvenue, {firstName}</p>
      </div>

      {myAuditsInProgress.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Mes audits en cours
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {myAuditsInProgress.map((audit) => (
              <AuditProgressCard key={audit.id} audit={audit} />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Tous les audits du cabinet
          </h2>
          <Link
            href="/audits"
            className="text-sm font-medium text-primary hover:underline"
          >
            Voir tout
          </Link>
        </div>
        <RecentAuditsTable audits={recentAudits} />
      </section>
    </div>
  )
}
