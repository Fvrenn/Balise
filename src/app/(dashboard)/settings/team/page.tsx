import { redirect } from "next/navigation"
import { TRPCError } from "@trpc/server"

import { getServerApi } from "@/trpc/server"

import { InviteMemberDialog } from "./invite-member-dialog"
import { TeamContent } from "./team-content"

export default async function TeamPage() {
  const api = await getServerApi()
  const member = await api.member.current().catch((error: unknown) => {
    // Pas de session → UNAUTHORIZED ; session sans cabinet → FORBIDDEN.
    if (
      error instanceof TRPCError &&
      (error.code === "FORBIDDEN" || error.code === "UNAUTHORIZED")
    ) {
      redirect("/login")
    }
    throw error
  })

  // Gestion d'équipe réservée aux owners — les auditeurs repartent au dashboard.
  if (member.role !== "owner") {
    redirect("/dashboard")
  }

  return (
    <div className="mx-12 space-y-8 px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Équipe
          </h1>
          <p className="text-sm text-muted-foreground">
            Gérez les membres de votre cabinet
          </p>
        </div>
        <InviteMemberDialog />
      </div>

      <TeamContent currentUserId={member.id} />
    </div>
  )
}
