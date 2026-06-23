import { getServerApi } from "@/trpc/server"
import { assertOwner, handleServerError } from "@/lib/server-utils"

import { CabinetSettings } from "./cabinet-settings"

export default async function CabinetSettingsPage() {
  const api = await getServerApi()
  const [member, cabinet] = await Promise.all([
    api.member.current(),
    api.cabinet.get(),
  ]).catch(handleServerError)

  // Paramètres réservés aux owners — les auditeurs repartent au dashboard.
  assertOwner(member)

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
