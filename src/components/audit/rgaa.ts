// Couche de présentation de la grille RGAA (couleurs du design system, agrégats
// par thématique pour l'affichage). Les TYPES et compteurs de base proviennent de
// @/lib/rgaa — source unique partagée avec le serveur et les composants existants
// (ThemeSidebar, SegmentedBar, CriterionRow). On évite ainsi un second système de
// types parallèle : ici on n'ajoute que ce qui relève du rendu.

import {
  emptyStatusCounts,
  sumStatusCounts,
  treatedCount,
  type FindingStatus,
  type StatusCounts,
  type ThemeProgress,
} from "@/lib/rgaa"

export type { FindingStatus, StatusCounts, ThemeProgress }

// Un agrégat de thématique n'est rien d'autre que son avancement : alias conservé
// pour les appelants qui le nommaient explicitement.
export type ThemeAggregate = ThemeProgress

interface StatusMeta {
  label: string
  shortLabel: string
  barClass: string
  color: string
  opacity: number
}

// `color` cible un token du design system (utilisé en SVG pour le donut) ;
// `barClass` est l'équivalent Tailwind pour les barres segmentées.
export const STATUS_META: Record<FindingStatus, StatusMeta> = {
  conforme: {
    label: "Conformes",
    shortLabel: "conformes",
    barClass: "bg-success",
    color: "var(--success)",
    opacity: 1,
  },
  non_conforme: {
    label: "Non conformes",
    shortLabel: "non conf.",
    barClass: "bg-destructive",
    color: "var(--destructive)",
    opacity: 1,
  },
  non_applicable: {
    label: "Non applicables",
    shortLabel: "N/A",
    barClass: "bg-muted-foreground/40",
    color: "var(--muted-foreground)",
    opacity: 0.4,
  },
  pending: {
    label: "À traiter",
    shortLabel: "à traiter",
    barClass: "bg-muted",
    color: "var(--muted-foreground)",
    opacity: 0.15,
  },
}

export const STATUS_ORDER: FindingStatus[] = [
  "conforme",
  "non_conforme",
  "non_applicable",
  "pending",
]

// Les compteurs de StatusCounts portent déjà le nom de leur statut : la clé d'un
// statut est le statut lui-même. Conservé pour les composants qui indexent les
// compteurs par statut (donut, en-tête).
export const STATUS_COUNT_KEY: Record<FindingStatus, keyof StatusCounts> = {
  conforme: "conforme",
  non_conforme: "non_conforme",
  non_applicable: "non_applicable",
  pending: "pending",
}

// Agrège une liste de findings par thématique (ordre RGAA) et calcule l'agrégat
// global. Renvoie des ThemeProgress directement consommables par ThemeSidebar.
export function buildThemeAggregates(
  findings: ReadonlyArray<{
    themeId: number
    themeName: string
    status: FindingStatus
  }>,
): { themes: ThemeProgress[]; summary: StatusCounts & { total: number } } {
  const byTheme = new Map<number, ThemeProgress>()
  for (const finding of findings) {
    let theme = byTheme.get(finding.themeId)
    if (!theme) {
      theme = {
        themeId: finding.themeId,
        themeName: finding.themeName,
        total: 0,
        ...emptyStatusCounts(),
      }
      byTheme.set(finding.themeId, theme)
    }
    theme.total += 1
    theme[finding.status] += 1
  }

  const themes = [...byTheme.values()].sort((a, b) => a.themeId - b.themeId)
  const counts = sumStatusCounts(themes)
  const total = themes.reduce((sum, theme) => sum + theme.total, 0)
  return { themes, summary: { ...counts, total } }
}

// Nombre de critères déjà traités d'une thématique (tout sauf « à traiter »).
export function themeTreated(theme: ThemeProgress): number {
  return treatedCount(theme)
}

export type ThemeIndicator = "success" | "destructive" | "muted"

// Pastille de la sidebar : rouge si non-conformités, gris si non commencé,
// vert sinon (en cours ou terminé sans non-conformité).
export function themeIndicator(theme: ThemeProgress): ThemeIndicator {
  if (theme.non_conforme > 0) return "destructive"
  if (theme.pending === theme.total) return "muted"
  return "success"
}

export function progressionPercent(counts: { pending: number; total: number }) {
  if (counts.total === 0) return 0
  return Math.round(((counts.total - counts.pending) / counts.total) * 100)
}
