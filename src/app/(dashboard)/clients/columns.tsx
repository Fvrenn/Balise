"use client"

import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

import { createDateCell } from "@/components/ui/data-table"

import type { ColumnDef } from "@tanstack/react-table"
import type { inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "@/server/routers/_app"

export type ClientRow = inferRouterOutputs<AppRouter>["clients"]["list"][number]

export const clientColumns: ColumnDef<ClientRow>[] = [
  {
    accessorKey: "name",
    header: "Client",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="font-heading flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-bold text-secondary-foreground uppercase select-none">
          {getInitials(row.original.name)}
        </div>
        <span className="font-semibold text-foreground">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "CLIENT DEPUIS",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDistanceToNow(row.original.createdAt, { locale: fr })}
      </span>
    ),
  },
  {
    accessorKey: "auditCount",
    header: () => <div className="text-right">AUDITS</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">{row.original.auditCount}</div>
    ),
  },
  {
    accessorKey: "siteCount",
    header: () => <div className="text-right">SITES AUDITÉS</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">{row.original.siteCount}</div>
    ),
  },
  {
    accessorKey: "lastAuditAt",
    header: "DERNIER AUDIT",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {createDateCell(row.original.lastAuditAt)}
      </div>
    ),
  },
]

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
