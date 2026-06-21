"use client"

import { cn } from "@/lib/utils"
import {
  RGAA_CRITERIA_COUNT,
  themeTone,
  treatedCount,
  type StatusCounts,
  type ThemeProgress,
} from "@/lib/rgaa"
import { THEME_TONE_DOT_CLASS } from "@/components/audit/status-config"

interface ThemeSidebarProps {
  themes: ThemeProgress[]
  totals: StatusCounts
  // null = « Toutes les thématiques » sélectionné.
  activeThemeId: number | null
  onSelect: (themeId: number | null) => void
}

// Navigation latérale partagée entre la grille et la vue d'ensemble : liste des 13
// thématiques avec leur score et un indicateur coloré d'avancement.
export function ThemeSidebar({
  themes,
  totals,
  activeThemeId,
  onSelect,
}: ThemeSidebarProps) {
  return (
    <nav className="flex w-56 shrink-0 flex-col gap-1" aria-label="Thématiques">
      <p className="px-2 pb-2 text-xs font-medium tracking-wide text-muted-foreground">
        THÉMATIQUES · {RGAA_CRITERIA_COUNT} CRITÈRES
      </p>

      <ThemeSidebarItem
        label="Toutes les thématiques"
        score={`${treatedCount(totals)}/${RGAA_CRITERIA_COUNT}`}
        isActive={activeThemeId === null}
        onClick={() => onSelect(null)}
      />

      <div className="my-1 h-px bg-border" />

      {themes.map((theme) => (
        <ThemeSidebarItem
          key={theme.themeId}
          label={`${theme.themeId}. ${theme.themeName}`}
          score={`${treatedCount(theme)}/${theme.total}`}
          tone={themeTone(theme)}
          isActive={activeThemeId === theme.themeId}
          onClick={() => onSelect(theme.themeId)}
        />
      ))}
    </nav>
  )
}

interface ThemeSidebarItemProps {
  label: string
  score: string
  tone?: ReturnType<typeof themeTone>
  isActive: boolean
  onClick: () => void
}

function ThemeSidebarItem({
  label,
  score,
  tone,
  isActive,
  onClick,
}: ThemeSidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
        isActive
          ? "bg-secondary font-medium text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {tone ? (
        <span
          className={cn(
            "size-2 shrink-0 rounded-full",
            THEME_TONE_DOT_CLASS[tone],
          )}
          aria-hidden
        />
      ) : (
        <span className="size-2 shrink-0" aria-hidden />
      )}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
        {score}
      </span>
    </button>
  )
}
