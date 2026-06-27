"use client"

import { Search, X } from "lucide-react"
import type { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter"

import type { AuditListRow } from "./columns"

const STATUS_OPTIONS = [
  { value: "in_progress", label: "En cours" },
  { value: "pending_review", label: "À relire" },
  { value: "completed", label: "Terminé" },
]

interface AuditsTableToolbarProps {
  table: Table<AuditListRow>
}

export function AuditsTableToolbar({ table }: AuditsTableToolbarProps) {
  const globalFilter = (table.getState().globalFilter as string) ?? ""
  const statusColumn = table.getColumn("status")
  const statusFilter =
    (statusColumn?.getFilterValue() as string[] | undefined) ?? []
  const hasActiveFilters = globalFilter.length > 0 || statusFilter.length > 0

  function clearFilters() {
    table.setGlobalFilter("")
    statusColumn?.setFilterValue(undefined)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-48 flex-1 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un audit, client…"
          value={globalFilter}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="h-9 bg-white pl-9"
        />
      </div>

      {statusColumn && (
        <DataTableFacetedFilter
          column={statusColumn}
          title="Statut"
          options={STATUS_OPTIONS}
        />
      )}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-2 text-muted-foreground"
          onClick={clearFilters}
        >
          Réinitialiser
          <X className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
