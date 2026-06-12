"use client"

import { useMemo, useState } from "react"
import { Building2, Search } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

import type { inferRouterOutputs } from "@trpc/server"
import { trpc } from "@/trpc/react"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { AppRouter } from "@/server/routers/_app"
import { ClientCreateDialog } from "./client-create-dialog"

type ClientRow = inferRouterOutputs<AppRouter>["clients"]["list"][number]

export function ClientsView() {
  const [search, setSearch] = useState("")
  const clientsQuery = trpc.clients.list.useQuery()

  const filteredClients = useMemo(() => {
    const clients = clientsQuery.data ?? []
    const term = search.trim().toLowerCase()
    if (!term) return clients
    return clients.filter((client) => client.name.toLowerCase().includes(term))
  }, [clientsQuery.data, search])

  const hasClients = (clientsQuery.data?.length ?? 0) > 0

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Clients
          </h1>
          <p className="text-sm text-muted-foreground">
            Les entreprises auditées par votre cabinet.
          </p>
        </div>
        <ClientCreateDialog />
      </header>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher un client…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-8"
        />
      </div>

      {clientsQuery.isLoading ? (
        <ClientsTableSkeleton />
      ) : !hasClients ? (
        <EmptyState />
      ) : (
        <ClientsTable
          clients={filteredClients}
          hasActiveSearch={search.trim().length > 0}
        />
      )}
    </div>
  )
}

function ClientsTable({
  clients,
  hasActiveSearch,
}: {
  clients: ClientRow[]
  hasActiveSearch: boolean
}) {
  if (clients.length === 0 && hasActiveSearch) {
    return (
      <p className="rounded-lg border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">
        Aucun client ne correspond à cette recherche.
      </p>
    )
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Site web</TableHead>
            <TableHead className="text-right">Audits</TableHead>
            <TableHead>Dernier audit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium text-foreground">
                {client.name}
              </TableCell>
              <TableCell>
                {client.website ? (
                  <a
                    href={toHref(client.website)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {client.website}
                  </a>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {client.auditCount}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {client.lastAuditAt
                  ? formatDistanceToNow(client.lastAuditAt, {
                      addSuffix: true,
                      locale: fr,
                    })
                  : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function ClientsTableSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-9 w-full" />
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border px-6 py-16 text-center">
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

function toHref(website: string) {
  if (website.startsWith("http://") || website.startsWith("https://")) {
    return website
  }
  return `https://${website}`
}
