"use client"

import { Suspense, use, useMemo, useState } from "react"
import { Building2, Search } from "lucide-react"

import { SERVER_DATA_STALE_TIME, trpc } from "@/trpc/react"
import { HeaderActions } from "@/components/header-slot"
import { DataTable } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { TableSkeleton } from "@/components/ui/skeletons"

import type { RouterOutputs } from "@/trpc/types"
import { clientColumns } from "./columns"
import { ClientCreateDialog } from "./client-create-dialog"
import { ClientsStats } from "./clients-stats"

export interface ClientsData {
  clients: RouterOutputs["clients"]["list"]
  stats: RouterOutputs["clients"]["stats"]
}

// La barre de recherche et le bouton de création n'ont pas besoin des données :
// ils s'affichent immédiatement. Le terme de recherche reste colocalisé avec le
// tableau qu'il pilote (passé en prop), conformément au choix du header-slot de ne
// pas remonter cet état. Seuls les résultats (stats + tableau) streament.
export function ClientsView({
  clientsPromise,
}: {
  clientsPromise: Promise<ClientsData>
}) {
  const [search, setSearch] = useState("")

  return (
    <div className="space-y-6">
      <HeaderActions>
        <div className="relative w-64">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un client…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-8 bg-white"
          />
        </div>
        <ClientCreateDialog />
      </HeaderActions>

      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Clients
        </h1>
        <p className="text-sm text-muted-foreground">
          Les entreprises auditées par votre cabinet.
        </p>
      </div>

      <Suspense fallback={<ClientsResultsSkeleton />}>
        <ClientsResults clientsPromise={clientsPromise} search={search} />
      </Suspense>
    </div>
  )
}

function ClientsResults({
  clientsPromise,
  search,
}: {
  clientsPromise: Promise<ClientsData>
  search: string
}) {
  // use() suspend jusqu'à la résolution du fetch serveur streamé, puis sert de
  // snapshot initial à la requête — qui reste invalidable (création de client).
  const { clients, stats } = use(clientsPromise)
  const clientsQuery = trpc.clients.list.useQuery(undefined, {
    initialData: clients,
    staleTime: SERVER_DATA_STALE_TIME,
  })

  const filteredClients = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return clientsQuery.data
    return clientsQuery.data.filter((client) =>
      client.name.toLowerCase().includes(term),
    )
  }, [clientsQuery.data, search])

  const hasActiveSearch = search.trim().length > 0

  return (
    <div className="space-y-6">
      <ClientsStats stats={stats} />

      <DataTable
        columns={clientColumns}
        data={filteredClients}
        emptyState={hasActiveSearch ? <NoSearchResults /> : <NoClients />}
        getRowHref={(client) => `/clients/${client.id}`}
      />
    </div>
  )
}

function ClientsResultsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-lg" />
        ))}
      </div>
      <TableSkeleton rows={6} cols={5} />
    </div>
  )
}

function NoClients() {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <Building2 className="size-8 text-muted-foreground" />
      <p className="text-sm font-medium text-foreground">
        Aucun client pour le moment
      </p>
      <p className="max-w-xs text-sm text-muted-foreground">
        Créez votre premier client pour commencer à organiser vos audits.
      </p>
    </div>
  )
}

function NoSearchResults() {
  return (
    <p className="py-12 text-sm text-muted-foreground">
      Aucun client ne correspond à cette recherche.
    </p>
  )
}
