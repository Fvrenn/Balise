"use client"

import { useMemo, useState } from "react"
import { Building2, Search } from "lucide-react"

import { trpc } from "@/trpc/react"
import { HeaderActions } from "@/components/header-slot"
import { DataTable } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"

import { clientColumns } from "./columns"
import { ClientCreateDialog } from "./client-create-dialog"
import { ClientsStats } from "./clients-stats"

export function ClientsView() {
  const [search, setSearch] = useState("")
  const clientsQuery = trpc.clients.list.useQuery()

  const filteredClients = useMemo(() => {
    const clients = clientsQuery.data ?? []
    const term = search.trim().toLowerCase()
    if (!term) return clients
    return clients.filter((client) => client.name.toLowerCase().includes(term))
  }, [clientsQuery.data, search])

  const hasActiveSearch = search.trim().length > 0

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
            className="pl-8 bg-surface"
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

      <ClientsStats />

      <DataTable
        columns={clientColumns}
        data={filteredClients}
        isLoading={clientsQuery.isLoading}
        emptyState={hasActiveSearch ? <NoSearchResults /> : <NoClients />}
        getRowHref={(client) => `/clients/${client.id}`}
      />
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
