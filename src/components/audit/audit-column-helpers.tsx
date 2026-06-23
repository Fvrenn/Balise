import type { ColumnDef } from "@tanstack/react-table"

import {
  createComplianceCell,
  createDateCell,
  createStatusBadge,
} from "@/components/ui/data-table-cells"

// Fabriques des colonnes d'audit communes aux trois tableaux (liste des audits,
// audits récents du dashboard, audits d'une fiche client). Chaque fabrique est
// générique sur la ligne tant qu'elle porte le champ requis et renvoie une
// ColumnDef directement consommable par le DataTable. Les colonnes spécifiques à un
// contexte (client, site, assignation, actions) restent définies sur place.
//
// Les colonnes utilisent `id` plutôt que `accessorKey` : le DataTable ne fait ni tri
// ni filtre, l'accesseur n'est donc jamais lu — l'identifiant de colonne et le rendu
// restent identiques à l'ancienne définition.

const DATE_COLUMN_HEADERS = {
  createdAt: "Date",
  updatedAt: "Dernière modification",
} as const

// Colonne « Nom de l'audit ». La navigation de ligne est portée par le DataTable
// (lien étiré via getRowHref), la cellule reste donc un simple libellé en évidence.
export function createAuditNameColumn<TData extends { name: string }>(opts: {
  header?: string
} = {}): ColumnDef<TData> {
  return {
    id: "name",
    header: opts.header ?? "Nom de l'audit",
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
    header: "Statut",
    cell: ({ row }) => createStatusBadge(row.original.status),
  }
}

export function createComplianceColumn<
  TData extends { complianceRate: number | null },
>(): ColumnDef<TData> {
  return {
    id: "complianceRate",
    header: () => <div className="text-right">Taux de conformité</div>,
    cell: ({ row }) => (
      <div className="text-right">
        {createComplianceCell(row.original.complianceRate)}
      </div>
    ),
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
    header,
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {createDateCell(row.original[field])}
      </span>
    ),
  }
}
