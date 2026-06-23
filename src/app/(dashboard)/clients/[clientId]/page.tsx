import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { TRPCError } from "@trpc/server"

import { getServerApi } from "@/trpc/server"
import { handleServerError } from "@/lib/server-utils"

import { ClientAuditsTable } from "./client-audits-table"
import { ClientBanner } from "./client-banner"
import { ClientHeaderActions } from "./client-header-actions"

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ clientId: string }>
}) {
  const { clientId } = await params

  const api = await getServerApi()
  const client = await api.clients
    .getById({ id: clientId })
    .catch((error: unknown) => {
      if (error instanceof TRPCError && error.code === "NOT_FOUND") notFound()
      return handleServerError(error)
    })

  return (
    <div className="mx-12 space-y-8 px-6 py-10">
      <Link
        href="/clients"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Clients
      </Link>

      <ClientHeaderActions client={{ id: client.id }} />

      <ClientBanner client={client} />

      <ClientAuditsTable audits={client.audits} clientId={client.id} />
    </div>
  )
}
