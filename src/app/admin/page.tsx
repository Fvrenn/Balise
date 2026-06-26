import { getServerApi } from "@/trpc/server"
import { HeaderActions } from "@/components/header-slot"

import { CabinetsTable } from "./cabinets-table"
import { CreateOwnerDialog } from "./create-owner-dialog"

// La garde isAdmin est faite par le layout admin : la page ne rend que pour un
// Admin, elle peut donc interroger admin.listCabinets sans risque de FORBIDDEN.
export default async function AdminCabinetsPage() {
  const api = await getServerApi()
  const cabinets = await api.admin.listCabinets()

  return (
    <div className="mx-12 px-6 py-10">
      <div className="space-y-6">
        <HeaderActions>
          <CreateOwnerDialog />
        </HeaderActions>

        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Cabinets
          </h1>
          <p className="text-sm text-muted-foreground">
            Les cabinets de conseil présents sur la plateforme.
          </p>
        </div>

        <CabinetsTable cabinets={cabinets} />
      </div>
    </div>
  )
}
