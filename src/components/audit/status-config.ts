import type { FindingStatus, ThemeTone } from '@/lib/rgaa'

// Ordre d'affichage des statuts dans les barres segmentées et les légendes :
// du plus « positif » au plus « neutre ».
export const STATUS_SEGMENTS: readonly FindingStatus[] = [
    'conforme',
    'non_conforme',
    'non_applicable',
    'pending',
]

export const STATUS_LABELS: Record<FindingStatus, string> = {
    conforme: 'Conforme',
    non_conforme: 'Non conforme',
    non_applicable: 'N/A',
    pending: 'À traiter',
}

// Libellés courts pour les légendes (« 12 conf. · 3 non conf. … »).
export const STATUS_LEGEND_LABELS: Record<FindingStatus, string> = {
    conforme: 'conformes',
    non_conforme: 'non conf.',
    non_applicable: 'N/A',
    pending: 'à traiter',
}

// Couleur de fond (segments de barre, pastilles de légende).
export const STATUS_BG_CLASS: Record<FindingStatus, string> = {
    conforme: 'bg-success',
    non_conforme: 'bg-destructive',
    non_applicable: 'bg-na',
    pending: 'bg-border',
}

// Couleur de tracé (segments du donut SVG).
export const STATUS_STROKE_CLASS: Record<FindingStatus, string> = {
    conforme: 'stroke-success',
    non_conforme: 'stroke-destructive',
    non_applicable: 'stroke-na',
    pending: 'stroke-border',
}

// Pastille d'avancement d'une thématique dans la sidebar.
export const THEME_TONE_DOT_CLASS: Record<ThemeTone, string> = {
    success: 'bg-success',
    error: 'bg-destructive',
    partial: 'bg-primary',
    idle: 'bg-muted-foreground/30',
}
