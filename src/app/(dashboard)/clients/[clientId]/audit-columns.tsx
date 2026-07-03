"use client"

import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  createAssignedToColumn,
  createAuditDateColumn,
  createAuditNameColumn,
  createAuditStatusColumn,
  createComplianceColumn,
} from "@/components/audit/audit-column-helpers"
import { AssigneeBadges } from "@/components/audit/assignee-badges"

import type { ColumnDef } from "@tanstack/react-table"
import type { inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "@/server/routers/_app"

export type ClientAudit =
  inferRouterOutputs<AppRouter>["clients"]["getById"]["audits"][number]

export const clientAuditColumns: ColumnDef<ClientAudit>[] = [
  createAuditNameColumn<ClientAudit>(),
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
  createAssignedToColumn<ClientAudit>({
    cell: ({ row }) => <AssigneeBadges assignees={row.original.assignees} />,
  }),
  createAuditStatusColumn<ClientAudit>(),
  createComplianceColumn<ClientAudit>(),
  createAuditDateColumn<ClientAudit>("createdAt"),
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
