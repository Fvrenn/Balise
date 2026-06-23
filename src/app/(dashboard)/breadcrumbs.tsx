"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

// Libellés lisibles pour les segments d'URL connus de l'espace applicatif.
const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Tableau de bord",
  clients: "Clients",
  audits: "Audits",
  settings: "Paramètres",
  team: "Équipe",
  cabinet: "Cabinet",
  profile: "Profil",
}

function labelFor(segment: string) {
  return (
    SEGMENT_LABELS[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1)
  )
}

export function Breadcrumbs({
  organizationName,
}: {
  organizationName: string | null
}) {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0) return null

  // Construit les items : [nom du cabinet] + segments de l'URL
  type BreadcrumbItem = { label: string; href: string | null; isLast: boolean }
  const items: BreadcrumbItem[] = []

  // Premier item : nom du cabinet (pas de lien — c'est le contexte courant)
  if (organizationName) {
    items.push({ label: organizationName, href: null, isLast: false })
  }

  // Segments de l'URL
  segments.forEach((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`
    items.push({ label: labelFor(segment), href, isLast: false })
  })

  // Seul le dernier item (cabinet ou segment) est marqué comme courant.
  items.forEach((item, i) => {
    item.isLast = i === items.length - 1
  })

  return (
    <nav aria-label="Fil d'Ariane" className="min-w-0">
      <ol className="flex items-center gap-1.5 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex min-w-0 items-center gap-1.5">
            {index > 0 && (
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            )}
            {item.isLast || item.href === null ? (
              <span
                className={
                  item.isLast
                    ? "truncate font-medium text-foreground"
                    : "truncate font-medium text-muted-foreground"
                }
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="truncate text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
