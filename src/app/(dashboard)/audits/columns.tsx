"use client"

import {
  createAssignedToColumn,
  createAuditDateColumn,
  createAuditNameColumn,
  createAuditStatusColumn,
  createComplianceColumn,
} from "@/components/audit/audit-column-helpers"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

import { AssigneesCell } from "./assignees-cell"

import type { ColumnDef } from "@tanstack/react-table"
import type { inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "@/server/routers/_app"

export type AuditListRow =
  inferRouterOutputs<AppRouter>["audits"]["list"][number]

export const auditColumns: ColumnDef<AuditListRow>[] = [
  createAuditNameColumn<AuditListRow>(),
  {
    id: "clientName",
    accessorFn: (row) => row.clientName,
    enableSorting: true,
    enableGlobalFilter: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.clientName}</span>
    ),
  },
  {
    id: "siteUrl",
    accessorFn: (row) => row.siteUrl,
    enableSorting: true,
    enableGlobalFilter: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Site audité" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.siteUrl}</span>
    ),
  },
  createAssignedToColumn<AuditListRow>({
    cell: ({ row }) => (
      <AssigneesCell
        auditId={row.original.id}
        assignees={row.original.assignees}
      />
    ),
  }),
  createAuditStatusColumn<AuditListRow>(),
  createComplianceColumn<AuditListRow>(),
  createAuditDateColumn<AuditListRow>("updatedAt"),
]
