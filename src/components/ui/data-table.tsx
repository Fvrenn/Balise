"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"
import { format, formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
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
  className?: string
}

export function DataTable<TData extends object>({
  columns,
  data,
  isLoading = false,
  emptyState,
  onRowClick,
  className,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const rows = table.getRowModel().rows
  const isRowClickable = Boolean(onRowClick)

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
            rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                className={cn(isRowClickable && "cursor-pointer")}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-3 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
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

// ---------------------------------------------------------------------------
// Helpers de colonnes — rendus de cellule récurrents dans Balise.
// ---------------------------------------------------------------------------

type BadgeVariant = React.ComponentProps<typeof Badge>["variant"]

const AUDIT_STATUS_BADGES: Record<
  string,
  { label: string; variant: BadgeVariant }
> = {
  in_progress: { label: "En cours", variant: "warning" },
  completed: { label: "Terminé", variant: "success" },
}

export function createStatusBadge(status: string): React.ReactNode {
  const badge = AUDIT_STATUS_BADGES[status] ?? {
    label: status,
    variant: "secondary" as const,
  }
  return <Badge variant={badge.variant}>{badge.label}</Badge>
}

export function createComplianceCell(rate: number | null): React.ReactNode {
  if (rate === null) return <span className="text-muted-foreground">—</span>

  const value = Math.round(rate)
  return (
    <span className={cn("font-semibold tabular-nums", complianceTone(value))}>
      {value}%
    </span>
  )
}

function complianceTone(rate: number): string {
  if (rate < 50) return "text-destructive"
  if (rate <= 75) return "text-primary"
  return "text-success"
}

export function createDateCell(date: Date | null): React.ReactNode {
  if (date === null) return <span className="text-muted-foreground">—</span>
  return <span className="tabular-nums">{format(date, "dd/MM/yyyy")}</span>
}

export function createRelativeDate(date: Date): React.ReactNode {
  return formatDistanceToNow(date, { addSuffix: true, locale: fr })
}
