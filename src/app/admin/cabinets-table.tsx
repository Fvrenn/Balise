"use client"

import { useMemo } from "react"
import { Building2, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { createDateCell } from "@/components/ui/data-table-cells"

import type { ColumnDef } from "@tanstack/react-table"
import type { RouterOutputs } from "@/trpc/types"

type Cabinet = RouterOutputs["admin"]["listCabinets"][number]

const columns: ColumnDef<Cabinet>[] = [
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "memberCount",
    header: "Membres",
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">
        {row.original.memberCount}{" "}
        {row.original.memberCount > 1 ? "membres" : "membre"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Créé le",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {createDateCell(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: () => (
      <div className="flex justify-end">
        {/* Détail du cabinet : fonctionnalité à venir, désactivée pour l'instant. */}
        <Button variant="ghost" size="sm" disabled>
          <Eye />
          Voir le détail
        </Button>
      </div>
    ),
  },
]

export function CabinetsTable({ cabinets }: { cabinets: Cabinet[] }) {
  // Mémo défensif : columns est constant, mais on garde la même référence au
  // cas où le composant re-rend pour d'autres raisons (cohérent avec les autres
  // tables du projet).
  const tableColumns = useMemo(() => columns, [])

  return (
    <DataTable
      columns={tableColumns}
      data={cabinets}
      emptyState={<NoCabinets />}
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
