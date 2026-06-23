"use client"

import { useState } from "react"

import type { StatusCounts, ThemeProgress } from "@/lib/rgaa"
import { ThemeSidebar } from "@/components/audit/theme-sidebar"

interface ThemeSidebarClientProps {
  themes: ThemeProgress[]
  totals: StatusCounts
}

// Seul îlot client de la vue d'ensemble : isole l'état de surbrillance de la
// thématique pour que tout le reste du rendu (tableau, donut, livrables) puisse
// rester côté serveur.
export function ThemeSidebarClient({ themes, totals }: ThemeSidebarClientProps) {
  const [activeThemeId, setActiveThemeId] = useState<number | null>(null)

  return (
    <ThemeSidebar
      themes={themes}
      totals={totals}
      activeThemeId={activeThemeId}
      onSelect={setActiveThemeId}
    />
  )
}
