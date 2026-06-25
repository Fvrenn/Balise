import { cn } from '@/lib/utils'
import type { StatusCounts } from '@/lib/rgaa'
import { STATUS_BG_CLASS, STATUS_SEGMENTS } from '@/components/audit/status-config'

interface SegmentedBarProps {
    counts: StatusCounts
    className?: string
}

// Barre de progression multi-couleurs : un segment par statut, largeur
// proportionnelle. Le fond gris affleure tant qu'aucun critère n'est traité.
export function SegmentedBar({ counts, className }: SegmentedBarProps) {
    const total =
        counts.conforme +
        counts.non_conforme +
        counts.non_applicable +
        counts.non_teste +
        counts.pending

    return (
        <div
            className={cn(
                'flex h-2 w-full overflow-hidden rounded-full bg-muted',
                className,
            )}
        >
            {STATUS_SEGMENTS.map((status) => {
                const value = counts[status]
                if (value === 0 || total === 0) return null
                return (
                    <div
                        key={status}
                        className={STATUS_BG_CLASS[status]}
                        style={{ width: `${(value / total) * 100}%` }}
                    />
                )
            })}
        </div>
    )
}
