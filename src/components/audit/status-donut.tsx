import { cn } from '@/lib/utils'
import type { StatusCounts } from '@/lib/rgaa'
import {
    STATUS_SEGMENTS,
    STATUS_STROKE_CLASS,
} from '@/components/audit/status-config'

interface StatusDonutProps {
    counts: StatusCounts
    // Valeur affichée au centre (ex. « 87 % ») et son libellé.
    centerValue: string
    centerLabel: string
    className?: string
}

const RADIUS = 60
const STROKE_WIDTH = 22
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

// Donut SVG de répartition des statuts. Chaque segment est un arc dont la longueur
// est proportionnelle à sa part ; rendu sans dépendance externe (pas de recharts).
export function StatusDonut({
    counts,
    centerValue,
    centerLabel,
    className,
}: StatusDonutProps) {
    const total =
        counts.conforme +
        counts.non_conforme +
        counts.non_applicable +
        counts.pending

    let offset = 0
    const segments = STATUS_SEGMENTS.map((status) => {
        const value = counts[status]
        const fraction = total === 0 ? 0 : value / total
        const segment = { status, fraction, offset }
        offset += fraction
        return segment
    })

    return (
        <div className={cn('relative size-44', className)}>
            <svg viewBox="0 0 160 160" className="size-full -rotate-90">
                <circle
                    cx="80"
                    cy="80"
                    r={RADIUS}
                    fill="none"
                    strokeWidth={STROKE_WIDTH}
                    className="stroke-muted"
                />
                {segments.map((segment) =>
                    segment.fraction === 0 ? null : (
                        <circle
                            key={segment.status}
                            cx="80"
                            cy="80"
                            r={RADIUS}
                            fill="none"
                            strokeWidth={STROKE_WIDTH}
                            className={STATUS_STROKE_CLASS[segment.status]}
                            strokeDasharray={`${segment.fraction * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                            strokeDashoffset={-segment.offset * CIRCUMFERENCE}
                        />
                    ),
                )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-2xl font-bold text-foreground">
                    {centerValue}
                </span>
                <span className="text-xs text-muted-foreground">
                    {centerLabel}
                </span>
            </div>
        </div>
    )
}
