"use client"

import Link from "next/link"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"

import { auditColumns, type AuditListRow } from "./columns"

interface AuditsTableProps {
  audits: AuditListRow[]
}

export function AuditsTable({ audits }: AuditsTableProps) {
  return (
    <DataTable
      columns={auditColumns}
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
        Nouvel audit
      </Link>
    </div>
  )
}
