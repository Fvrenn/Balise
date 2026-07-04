"use client"

import { useCallback } from "react"
import { usePathname, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"

// Onglets des pages de l'échantillon. L'onglet actif est porté par l'URL
// (?page=…) pour permettre le lien direct — la sélection passe par un
// replaceState natif (shallow routing) plutôt que router.replace : le paramètre
// n'est lu que côté client, un aller-retour serveur par clic serait inutile.

interface SamplePageTab {
  id: string
  label: string
}

export function SamplePageTabs({
  pages,
  activePageId,
}: {
  pages: SamplePageTab[]
  activePageId: string
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const selectPage = useCallback(
    (pageId: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", pageId)
      window.history.replaceState(null, "", `${pathname}?${params.toString()}`)
    },
    [pathname, searchParams],
  )

  return (
    <div className="isolate px-6 pt-5 pb-0">
      <div
        className="flex w-full items-end gap-1.5 overflow-x-auto pl-3"
        role="tablist"
        aria-label="Pages de l'échantillon"
      >
        {pages.map((page) => {
          const isActive = page.id === activePageId
          return (
            <button
              key={page.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => selectPage(page.id)}
              className={cn(
                "whitespace-nowrap text-sm font-medium transition-colors",
                isActive
                  ? "tab-inverted-radius z-10 rounded-t-xl bg-surface px-6 py-3 text-foreground"
                  : "mb-0.5 rounded-t-lg bg-secondary px-5 py-2.5 text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
              )}
            >
              {page.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
