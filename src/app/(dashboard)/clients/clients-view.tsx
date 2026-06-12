"use client"

import { useMemo, useState } from "react"
import { Building2, Search } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

import type { inferRouterOutputs } from "@trpc/server"
import { trpc } from "@/trpc/react"
import { HeaderActions } from "@/components/header-slot"
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
import { ClientsStats } from "./clients-stats"

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
    <div className="grid [&>div]:max-h-70 [&>div]:rounded-lg [&>div]:border">
      <Table>
        <TableHeader className="bg-surface-2">
          <TableRow>
            <TableHead className="text-ink-3 px-3 py-4">Client</TableHead>
            <TableHead className="text-ink-3 px-3 py-4">CLIENT DEPUIS</TableHead>
            <TableHead className="text-right text-ink-3 px-3 py-4">AUDITS</TableHead>
            <TableHead className="text-right text-ink-3 px-3 py-4">SITES AUDITÉS</TableHead>
            <TableHead className="text-ink-3 px-3 py-4">DERNIER AUDIT</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-surface">
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="px-3 py-4">
                <div className="flex items-center gap-3">
                  <div className="font-heading uppercase flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-bold text-secondary-foreground select-none">
                    {getInitials(client.name)}
                  </div>
                  <span className="font-semibold text-foreground">{client.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground px-3 py-4">
                {formatDistanceToNow(client.createdAt, { locale: fr })}
              </TableCell>
              <TableCell className="text-right tabular-nums px-3 py-4">
                {client.auditCount}
              </TableCell>
              <TableCell className="text-right tabular-nums px-3 py-4">
                {client.siteCount}
              </TableCell>
              <TableCell className="text-muted-foreground px-3 py-4">
                {client.lastAuditAt
                  ? format(client.lastAuditAt, "dd/MM/yyyy")
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

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
