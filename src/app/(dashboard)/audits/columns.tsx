"use client"

import {
  createAuditDateColumn,
  createAuditNameColumn,
  createAuditStatusColumn,
  createComplianceColumn,
} from "@/components/audit/audit-column-helpers"

import { AssigneesCell } from "./assignees-cell"

import type { ColumnDef } from "@tanstack/react-table"
import type { inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "@/server/routers/_app"

export type AuditListRow =
  inferRouterOutputs<AppRouter>["audits"]["list"][number]

export const auditColumns: ColumnDef<AuditListRow>[] = [
  createAuditNameColumn<AuditListRow>(),
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
  createAuditStatusColumn<AuditListRow>(),
  createComplianceColumn<AuditListRow>(),
  createAuditDateColumn<AuditListRow>("updatedAt"),
]
