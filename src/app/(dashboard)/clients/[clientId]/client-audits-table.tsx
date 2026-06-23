"use client"

import Link from "next/link"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"

import { clientAuditColumns, type ClientAudit } from "./audit-columns"

interface ClientAuditsTableProps {
  audits: ClientAudit[]
  clientId: string
}

export function ClientAuditsTable({ audits, clientId }: ClientAuditsTableProps) {
  return (
    <DataTable
      columns={clientAuditColumns}
      data={audits}
      emptyState={<NoAudits clientId={clientId} />}
    />
  )
}

function NoAudits({ clientId }: { clientId: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <p className="text-sm font-medium text-foreground">
        Aucun audit pour ce client
      </p>
      <Link
        href={`/audits/new?clientId=${clientId}`}
        className={cn(buttonVariants())}
      >
        <Plus />
        Nouvel audit
      </Link>
    </div>
  )
}
