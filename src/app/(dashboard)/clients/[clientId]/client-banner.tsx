import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarDays, ClipboardList, FileText } from "lucide-react"

import { ClientEditDialog } from "./client-edit-dialog"

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

interface ClientBannerProps {
  client: {
    id: string
    name: string
    note?: string | null
    createdAt: Date
    audits: unknown[]
  }
}

export function ClientBanner({ client }: ClientBannerProps) {
  const auditCount = client.audits.length

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <div className="flex items-center gap-5 px-7 py-6">
        <div className="font-heading flex size-16 shrink-0 items-center justify-center rounded-md bg-secondary text-xl font-bold text-secondary-foreground uppercase select-none">
          {getInitials(client.name)}
        </div>

        {/* Infos principales */}
        <div className="min-w-0 flex-1">
          <h1 className="font-heading truncate text-2xl font-bold text-foreground">
            {client.name}
          </h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
            {client.note && (
              <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                <FileText className="size-3.5 shrink-0" />
                {client.note}
              </span>
            )}
            <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <ClipboardList className="size-3.5 shrink-0" />
              {auditCount === 0
                ? "Aucun audit"
                : auditCount === 1
                  ? "1 audit"
                  : `${auditCount} audits`}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <CalendarDays className="size-3.5 shrink-0" />
              Client depuis {format(client.createdAt, "MMMM yyyy", { locale: fr })}
            </span>
          </div>
        </div>

        <ClientEditDialog
          client={{ id: client.id, name: client.name, note: client.note ?? null }}
        />
      </div>
    </div>
  )
}
