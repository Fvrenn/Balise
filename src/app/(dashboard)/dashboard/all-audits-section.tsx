import Link from "next/link"

import { getServerApi } from "@/trpc/server"
import { handleServerError } from "@/lib/server-utils"

import { RecentAuditsTable } from "./recent-audits-table"

const RECENT_AUDITS_LIMIT = 5

// Aperçu des audits récents du cabinet : fetche list puis streame le tableau.
export async function AllAuditsSection() {
  const api = await getServerApi()
  const cabinetAudits = await api.audits.list().catch(handleServerError)
  const recentAudits = cabinetAudits.slice(0, RECENT_AUDITS_LIMIT)

  return (
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
  )
}
