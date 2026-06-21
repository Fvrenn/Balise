import { redirect } from "next/navigation"
import { TRPCError } from "@trpc/server"

import { getServerApi } from "@/trpc/server"

import { CabinetSettings } from "./cabinet-settings"

export default async function CabinetSettingsPage() {
  const api = await getServerApi()
  const [member, cabinet] = await Promise.all([
    api.member.current(),
    api.cabinet.get(),
  ]).catch((error: unknown) => {
    // Pas de session → UNAUTHORIZED ; session sans cabinet → FORBIDDEN.
    if (
      error instanceof TRPCError &&
      (error.code === "FORBIDDEN" || error.code === "UNAUTHORIZED")
    ) {
      redirect("/login")
    }
    throw error
  })

  // Paramètres réservés aux owners — les auditeurs repartent au dashboard.
  if (member.role !== "owner") {
    redirect("/dashboard")
  }

  return (
    <div className="mx-12 max-w-2xl space-y-8 px-6 py-10">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Paramètres du cabinet
        </h1>
        <p className="text-sm text-muted-foreground">
          L&apos;identité de votre cabinet, partagée par toute l&apos;équipe.
        </p>
      </div>

      <CabinetSettings initialCabinet={cabinet} />
    </div>
  )
}
