"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

// Libellés de page de l'espace Admin, indexés par chemin complet : « Cabinets »
// est la racine /admin, pas un segment « admin » à mapper.
const PAGE_LABELS: Record<string, string> = {
  "/admin": "Cabinets",
  "/admin/users": "Utilisateurs",
}

// Fil d'Ariane de l'espace Admin : « Administration » (contexte courant, sans
// lien) suivi du libellé de la page active. Calqué sur le Breadcrumbs du
// dashboard pour une barre d'en-tête cohérente entre les deux espaces.
export function AdminBreadcrumbs() {
  const pathname = usePathname()
  const pageLabel = PAGE_LABELS[pathname]

  return (
    <nav aria-label="Fil d'Ariane" className="min-w-0">
      <ol className="flex items-center gap-1.5 text-sm">
        <li className="flex min-w-0 items-center gap-1.5">
          <Link
            href="/admin"
            className="truncate font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Administration
          </Link>
        </li>
        {pageLabel ? (
          <li className="flex min-w-0 items-center gap-1.5">
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate font-medium text-foreground">
              {pageLabel}
            </span>
          </li>
        ) : null}
      </ol>
    </nav>
  )
}
