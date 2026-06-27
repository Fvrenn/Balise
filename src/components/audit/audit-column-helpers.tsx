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
    enableSorting: false,
    enableGlobalFilter: false,
    filterFn: (row, columnId, filterValue: string[]) => {
      if (!filterValue?.length) return true
      return filterValue.includes(row.getValue(columnId) as string)
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Statut" />
    ),
    cell: ({ row }) => createStatusBadge(row.original.status),
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
