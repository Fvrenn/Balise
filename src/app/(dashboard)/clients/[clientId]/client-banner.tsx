import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarDays, ClipboardList, Globe, Mail, MapPin, Phone, User } from "lucide-react"

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
    contactName?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    website?: string | null
    address?: string | null
    siret?: string | null
    note?: string | null
    createdAt: Date
    audits: unknown[]
  }
}

export function ClientBanner({ client }: ClientBannerProps) {
  const auditCount = client.audits.length

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <div className="flex items-start gap-5 px-7 py-6">
        <div className="font-heading flex size-16 shrink-0 items-center justify-center rounded-md bg-secondary text-xl font-bold text-secondary-foreground uppercase select-none">
          {getInitials(client.name)}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="font-heading truncate text-2xl font-bold text-foreground">
            {client.name}
          </h1>
          {client.siret && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              SIRET {client.siret}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5">
            {client.contactName && (
              <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                <User className="size-3.5 shrink-0" />
                {client.contactName}
              </span>
            )}
            {client.contactEmail && (
              <a
                href={`mailto:${client.contactEmail}`}
                className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="size-3.5 shrink-0" />
                {client.contactEmail}
              </a>
            )}
            {client.contactPhone && (
              <a
                href={`tel:${client.contactPhone}`}
                className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="size-3.5 shrink-0" />
                {client.contactPhone}
              </a>
            )}
            {client.website && (
              <a
                href={client.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Globe className="size-3.5 shrink-0" />
                {client.website.replace(/^https?:\/\//, "")}
              </a>
            )}
            {client.address && (
              <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                <MapPin className="size-3.5 shrink-0" />
                {client.address}
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

          {client.note && (
            <p className="mt-3 text-sm text-muted-foreground italic">{client.note}</p>
          )}
        </div>

        <ClientEditDialog client={client} />
      </div>
    </div>
  )
}
