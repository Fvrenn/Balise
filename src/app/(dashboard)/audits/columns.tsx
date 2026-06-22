"use client"

import {
  createComplianceCell,
  createDateCell,
  createStatusBadge,
} from "@/components/ui/data-table-cells"

import { AssigneesCell } from "./assignees-cell"

import type { ColumnDef } from "@tanstack/react-table"
import type { inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "@/server/routers/_app"

export type AuditListRow =
  inferRouterOutputs<AppRouter>["audits"]["list"][number]

export const auditColumns: ColumnDef<AuditListRow>[] = [
  {
    accessorKey: "name",
    header: "Nom de l'audit",
    cell: ({ row }) => (
      <span className="font-semibold text-foreground">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "clientName",
    header: "Client",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.clientName}</span>
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
    id: "assignedTo",
    header: "Assigné à",
    cell: ({ row }) => (
      <AssigneesCell
        auditId={row.original.id}
        assignees={row.original.assignees}
      />
    ),
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
    accessorKey: "updatedAt",
    header: "Dernière modification",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {createDateCell(row.original.updatedAt)}
      </span>
    ),
  },
]
