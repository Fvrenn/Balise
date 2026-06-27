"use client"

import { useMemo } from "react"
import { Building2, Eye, Search, X } from "lucide-react"
import type { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { Input } from "@/components/ui/input"
import { createDateCell } from "@/components/ui/data-table-cells"

import type { ColumnDef } from "@tanstack/react-table"
import type { RouterOutputs } from "@/trpc/types"

type Cabinet = RouterOutputs["admin"]["listCabinets"][number]

const columns: ColumnDef<Cabinet>[] = [
  {
    id: "name",
    accessorFn: (row) => row.name,
    enableSorting: true,
    enableGlobalFilter: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.name}</span>
    ),
  },
  {
    id: "memberCount",
    accessorFn: (row) => row.memberCount,
    enableSorting: true,
    enableGlobalFilter: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Membres" />
    ),
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">
        {row.original.memberCount}{" "}
        {row.original.memberCount > 1 ? "membres" : "membre"}
      </span>
    ),
  },
  {
    id: "createdAt",
    accessorFn: (row) => row.createdAt,
    enableSorting: true,
    enableGlobalFilter: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Créé le" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {createDateCell(row.original.createdAt)}
      </span>
    ),
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.createdAt?.getTime() ?? 0
      const b = rowB.original.createdAt?.getTime() ?? 0
      return a - b
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    enableSorting: false,
    enableGlobalFilter: false,
    cell: () => (
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" disabled>
          <Eye />
          Voir le détail
        </Button>
      </div>
    ),
  },
]

function CabinetsTableToolbar({ table }: { table: Table<Cabinet> }) {
  const globalFilter = (table.getState().globalFilter as string) ?? ""

  return (
    <div className="flex items-center gap-2">
      <div className="relative min-w-48 flex-1 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un cabinet…"
          value={globalFilter}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="h-9 bg-white pl-9"
        />
      </div>
      {globalFilter.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-2 text-muted-foreground"
          onClick={() => table.setGlobalFilter("")}
        >
          Réinitialiser
          <X className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

export function CabinetsTable({ cabinets }: { cabinets: Cabinet[] }) {
  const tableColumns = useMemo(() => columns, [])

  return (
    <DataTable
      columns={tableColumns}
      data={cabinets}
      emptyState={<NoCabinets />}
      toolbar={(table) => <CabinetsTableToolbar table={table} />}
    />
  )
}

function NoCabinets() {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <Building2 className="size-8 text-muted-foreground" />
      <p className="text-sm font-medium text-foreground">
        Aucun cabinet sur la plateforme
      </p>
      <p className="max-w-xs text-sm text-muted-foreground">
        Créez un Owner : il créera son cabinet à sa première connexion.
      </p>
    </div>
  )
}
