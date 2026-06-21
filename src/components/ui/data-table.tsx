"use client"

import * as React from "react"
import Link from "next/link"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const SKELETON_ROW_COUNT = 5

interface DataTableProps<TData extends object> {
  columns: ColumnDef<TData>[]
  data: TData[]
  isLoading?: boolean
  emptyState?: React.ReactNode
  onRowClick?: (row: TData) => void
  // Navigation par ligne. Préférer getRowHref : un vrai lien donne le focus clavier,
  // Ctrl/clic du milieu et « ouvrir dans un nouvel onglet ». onRowClick reste pour les
  // actions non navigantes (rendu accessible au clavier : role link + Entrée/Espace).
  getRowHref?: (row: TData) => string
  className?: string
}

export function DataTable<TData extends object>({
  columns,
  data,
  isLoading = false,
  emptyState,
  onRowClick,
  getRowHref,
  className,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const rows = table.getRowModel().rows
  const isRowInteractive = Boolean(onRowClick) || Boolean(getRowHref)

  return (
    <div className={cn("overflow-hidden rounded-lg border", className)}>
      <Table>
        <TableHeader className="bg-surface-2">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-ink-3 px-3 py-4">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody className="bg-surface">
          {isLoading ? (
            <DataTableSkeletonRows columnCount={columns.length} />
          ) : rows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={columns.length}
                className="h-48 text-center align-middle"
              >
                {emptyState ?? (
                  <span className="text-sm text-muted-foreground">
                    Aucun résultat.
                  </span>
                )}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              const href = getRowHref?.(row.original)
              // Avec getRowHref, le <Link> de la cellule principale porte la
              // navigation (et donc le focus clavier, Ctrl/clic du milieu). Sans
              // href, la ligne elle-même devient le contrôle : role + focus +
              // activation Entrée/Espace.
              const isKeyboardRow = Boolean(onRowClick) && !href
              return (
                <TableRow
                  key={row.id}
                  onClick={
                    isKeyboardRow ? () => onRowClick?.(row.original) : undefined
                  }
                  onKeyDown={
                    isKeyboardRow
                      ? (event) =>
                          activateRowOnKey(event, () =>
                            onRowClick?.(row.original),
                          )
                      : undefined
                  }
                  role={isKeyboardRow ? "link" : undefined}
                  tabIndex={isKeyboardRow ? 0 : undefined}
                  className={cn(
                    isRowInteractive && "cursor-pointer",
                    href && "relative",
                    isKeyboardRow &&
                      "outline-none focus-visible:ring-inset focus-visible:ring-3 focus-visible:ring-ring/50",
                  )}
                >
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <TableCell key={cell.id} className="px-3 py-4">
                      {href && cellIndex === 0 ? (
                        // Lien étiré : l'ancre couvre toute la ligne via ::after,
                        // tout en gardant le nom comme intitulé accessible.
                        <Link
                          href={href}
                          className="rounded-md outline-none after:absolute after:inset-0 focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Link>
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}

// Entrée/Espace activent une ligne rendue comme contrôle (role="link"), à parité
// avec le clic souris. preventDefault sur Espace empêche le scroll de page.
function activateRowOnKey(
  event: React.KeyboardEvent<HTMLTableRowElement>,
  activate: () => void,
) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault()
    activate()
  }
}

function DataTableSkeletonRows({ columnCount }: { columnCount: number }) {
  return (
    <>
      {Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className="hover:bg-transparent">
          {Array.from({ length: columnCount }).map((_, cellIndex) => (
            <TableCell key={cellIndex} className="px-3 py-4">
              <Skeleton className="h-5 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

// Les rendus de cellule (createStatusBadge, createComplianceCell, createDateCell…)
// vivent dans un module à part, sans « use client », pour rester invocables aussi
// bien côté serveur que client : @/components/ui/data-table-cells.
