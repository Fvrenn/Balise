"use client"

import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  createComplianceCell,
  createDateCell,
  createStatusBadge,
} from "@/components/ui/data-table"

import type { ColumnDef } from "@tanstack/react-table"
import type { inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "@/server/routers/_app"

export type ClientAudit =
  inferRouterOutputs<AppRouter>["clients"]["getById"]["audits"][number]

export const auditColumns: ColumnDef<ClientAudit>[] = [
  {
    accessorKey: "name",
    header: "Nom de l'audit",
    cell: ({ row }) => (
      <span className="font-semibold text-foreground">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "siteUrl",
    header: "Site audité",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.siteUrl}</span>
    ),
  },
  {
    accessorKey: "contactName",
    header: "Contact",
    cell: ({ row }) => row.original.contactName ?? <EmptyValue />,
  },
  {
    id: "assignedTo",
    header: "Assigné à",
    cell: ({ row }) => row.original.assignedTo?.name ?? <EmptyValue />,
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => createStatusBadge(row.original.status),
  },
  {
    accessorKey: "complianceRate",
    header: () => <div className="text-right">Taux de conformité</div>,
    cell: ({ row }) => (
      <div className="text-right">
        {createComplianceCell(row.original.complianceRate)}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {createDateCell(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <Link
          href={`/audits/${row.original.id}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Voir
        </Link>
      </div>
    ),
  },
]

function EmptyValue() {
  return <span className="text-muted-foreground">—</span>
}
