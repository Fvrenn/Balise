"use client"

import type { ColumnDef } from "@tanstack/react-table"

import {
  createComplianceCell,
  createDateCell,
  createStatusBadge,
} from "@/components/ui/data-table-cells"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

// Fabriques des colonnes d'audit communes aux trois tableaux (liste des audits,
// audits récents du dashboard, audits d'une fiche client).

const DATE_COLUMN_HEADERS = {
  createdAt: "Date",
  updatedAt: "Dernière modification",
} as const

// Le tri alphabétique des statuts bruts ("completed" < "in_progress") ne
// correspond ni au cycle de vie ni aux libellés français : on trie par étape.
const AUDIT_STATUS_SORT_RANK: Record<string, number> = {
  in_progress: 0,
  pending_review: 1,
  completed: 2,
}

export function createAuditNameColumn<TData extends { name: string }>(
  opts: { header?: string } = {},
): ColumnDef<TData> {
  return {
    id: "name",
    accessorFn: (row) => row.name,
    enableSorting: true,
    enableGlobalFilter: true,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={opts.header ?? "Nom de l'audit"}
      />
    ),
    cell: ({ row }) => (
      <span className="font-semibold text-foreground">{row.original.name}</span>
    ),
  }
}

export function createAuditStatusColumn<
  TData extends { status: string },
>(): ColumnDef<TData> {
  return {
    id: "status",
    accessorFn: (row) => row.status,
    enableSorting: true,
    enableGlobalFilter: false,
    filterFn: (row, columnId, filterValue: string[]) => {
      if (!filterValue?.length) return true
      return filterValue.includes(row.getValue(columnId) as string)
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Statut" />
    ),
    cell: ({ row }) => createStatusBadge(row.original.status),
    sortingFn: (rowA, rowB) => {
      const a = AUDIT_STATUS_SORT_RANK[rowA.original.status] ?? -1
      const b = AUDIT_STATUS_SORT_RANK[rowB.original.status] ?? -1
      return a - b
    },
  }
}

export function createAssignedToColumn<
  TData extends { assignees: { name: string }[] },
>(opts: { cell: ColumnDef<TData>["cell"] }): ColumnDef<TData> {
  return {
    id: "assignedTo",
    accessorFn: (row) => row.assignees[0]?.name ?? "",
    enableSorting: true,
    enableGlobalFilter: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigné à" />
    ),
    cell: opts.cell,
    // Le comparateur par défaut compare les points de code, ce qui classe les
    // noms accentués ("Émile") après "Z" : on impose la collation française.
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.assignees[0]?.name ?? ""
      const b = rowB.original.assignees[0]?.name ?? ""
      return a.localeCompare(b, "fr", { sensitivity: "base" })
    },
  }
}

export function createComplianceColumn<
  TData extends { complianceRate: number | null },
>(): ColumnDef<TData> {
  return {
    id: "complianceRate",
    accessorFn: (row) => row.complianceRate,
    enableSorting: true,
    enableGlobalFilter: false,
    header: ({ column }) => (
      <div className="text-right">
        <DataTableColumnHeader column={column} title="Taux de conformité" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right">
        {createComplianceCell(row.original.complianceRate)}
      </div>
    ),
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.complianceRate ?? -1
      const b = rowB.original.complianceRate ?? -1
      return a - b
    },
  }
}

export function createAuditDateColumn<
  TData extends { createdAt: Date | null; updatedAt: Date | null },
>(
  field: "createdAt" | "updatedAt",
  header: string = DATE_COLUMN_HEADERS[field],
): ColumnDef<TData> {
  return {
    id: field,
    accessorFn: (row) => row[field],
    enableSorting: true,
    enableGlobalFilter: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={header} />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {createDateCell(row.original[field])}
      </span>
    ),
    sortingFn: (rowA, rowB) => {
      const a = rowA.original[field]?.getTime() ?? 0
      const b = rowB.original[field]?.getTime() ?? 0
      return a - b
    },
  }
}
