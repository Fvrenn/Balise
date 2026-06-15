import Link from "next/link"
import { redirect } from "next/navigation"
import { Plus } from "lucide-react"
import { TRPCError } from "@trpc/server"

import { getServerApi } from "@/trpc/server"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { HeaderActions } from "@/components/header-slot"

import { AuditsTable } from "./audits-table"

export default async function AuditsPage() {
  const api = await getServerApi()
  const audits = await api.audits.list().catch((error: unknown) => {
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

      <AuditsTable audits={audits} />
    </div>
  )
}
