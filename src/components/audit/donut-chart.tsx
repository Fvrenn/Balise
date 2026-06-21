import { STATUS_COUNT_KEY, STATUS_META, STATUS_ORDER } from "./rgaa"
import type { StatusCounts } from "./rgaa"

const SIZE = 160
const STROKE = 26
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface DonutChartProps {
  counts: StatusCounts
  total: number
  centerValue: string
  centerLabel?: string
}

export function DonutChart({
  counts,
  total,
  centerValue,
  centerLabel,
}: DonutChartProps) {
  let cumulativeFraction = 0
  const segments = STATUS_ORDER.map((status) => {
    const value = counts[STATUS_COUNT_KEY[status]]
    const fraction = total > 0 ? value / total : 0
    const segment = {
      status,
      length: fraction * CIRCUMFERENCE,
      offset: cumulativeFraction * CIRCUMFERENCE,
    }
    cumulativeFraction += fraction
    return segment
  })

  return (
    <div className="relative mx-auto size-40">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="size-full -rotate-90"
        aria-hidden
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={STROKE}
        />
        {segments.map((segment) =>
          segment.length <= 0 ? null : (
            <circle
              key={segment.status}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={STATUS_META[segment.status].color}
              strokeOpacity={STATUS_META[segment.status].opacity}
              strokeWidth={STROKE}
              strokeDasharray={`${segment.length} ${CIRCUMFERENCE - segment.length}`}
              strokeDashoffset={-segment.offset}
            />
          ),
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-3xl font-bold text-foreground">
          {centerValue}
        </span>
        {centerLabel ? (
          <span className="text-xs text-muted-foreground">{centerLabel}</span>
        ) : null}
      </div>
    </div>
  )
}
