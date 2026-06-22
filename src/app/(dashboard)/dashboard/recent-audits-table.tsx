"use client"

import Link from "next/link"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import {
  createComplianceCell,
  createDateCell,
  createStatusBadge,
} from "@/components/ui/data-table-cells"
import { AssigneeBadges } from "@/components/audit/assignee-badges"

import type { ColumnDef } from "@tanstack/react-table"
import type { RouterOutputs } from "@/trpc/types"

type RecentAudit = RouterOutputs["audits"]["list"][number]

const recentAuditColumns: ColumnDef<RecentAudit>[] = [
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
    id: "assignedTo",
    header: "Assigné à",
    cell: ({ row }) => <AssigneeBadges assignees={row.original.assignees} />,
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
