import { Download } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

// Historique des livrables générés : un export fige l'état de la grille au
// moment où il a été produit, c'est ce fichier-là que le client a reçu.

interface ExportRow {
  id: string
  filename: string
  fileSize: number
  generatedAt: Date
  generatedByName: string | null
}

function formatFileSize(bytes: number): string {
  const kilobytes = bytes / 1024
  if (kilobytes < 1024) return `${Math.round(kilobytes)} Ko`
  return `${(kilobytes / 1024).toFixed(1)} Mo`
}

export function ExportHistory({
  auditId,
  exports,
}: {
  auditId: string
  exports: ExportRow[]
}) {
  if (exports.length === 0) return null

  return (
    <section className="space-y-3">
      <h2 className="font-heading text-sm font-semibold text-foreground">
        Exports générés
      </h2>
      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
        {exports.map((archived) => (
          <li
            key={archived.id}
            className="flex items-center justify-between gap-4 px-5 py-3"
          >
            <div className="min-w-0 space-y-0.5">
              <p className="truncate text-sm text-foreground">
                {archived.filename}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(archived.generatedAt, "d MMMM yyyy à HH:mm", {
                  locale: fr,
                })}
                {archived.generatedByName && ` — ${archived.generatedByName}`} ·{" "}
                {formatFileSize(archived.fileSize)}
              </p>
            </div>
            <a
              href={`/api/audits/${auditId}/exports/${archived.id}`}
              className="inline-flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              <Download className="size-4" />
              Télécharger
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
