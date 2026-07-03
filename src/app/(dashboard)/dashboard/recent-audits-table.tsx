"use client"

import Link from "next/link"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import {
  createAssignedToColumn,
  createAuditDateColumn,
  createAuditNameColumn,
  createAuditStatusColumn,
  createComplianceColumn,
} from "@/components/audit/audit-column-helpers"
import { AssigneeBadges } from "@/components/audit/assignee-badges"

import type { ColumnDef } from "@tanstack/react-table"
import type { RouterOutputs } from "@/trpc/types"

type RecentAudit = RouterOutputs["audits"]["list"][number]

const recentAuditColumns: ColumnDef<RecentAudit>[] = [
  createAuditNameColumn<RecentAudit>(),
  {
    accessorKey: "clientName",
    header: "Client",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.clientName}</span>
    ),
  },
  createAssignedToColumn<RecentAudit>({
    cell: ({ row }) => <AssigneeBadges assignees={row.original.assignees} />,
  }),
  createAuditStatusColumn<RecentAudit>(),
  createComplianceColumn<RecentAudit>(),
  createAuditDateColumn<RecentAudit>("updatedAt"),
]

export function RecentAuditsTable({ audits }: { audits: RecentAudit[] }) {
  return (
    <DataTable
      columns={recentAuditColumns}
      data={audits}
      getRowHref={(audit) => `/audits/${audit.id}`}
      emptyState={<NoAudits />}
    />
  )
}

function NoAudits() {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <p className="text-sm font-medium text-foreground">
        Aucun audit pour le moment
      </p>
      <Link href="/audits/new" className={cn(buttonVariants())}>
        <Plus />
        Créer le premier audit
      </Link>
    </div>
  )
}
