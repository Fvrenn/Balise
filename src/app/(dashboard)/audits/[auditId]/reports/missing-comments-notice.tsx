import Link from "next/link"
import { TriangleAlert } from "lucide-react"

// Règle métier §7 : une non-conformité doit être motivée avant de partir chez le
// client. On avertit sans bloquer — l'auditrice peut avoir besoin d'un export
// intermédiaire en cours d'audit.

interface MissingCommentFinding {
  findingId: string
  criterionId: string
  title: string
  pageId: string
  pageLabel: string
}

// Au-delà, la liste noierait l'avertissement : le compte total dit l'ampleur.
const MAX_LISTED = 8

export function MissingCommentsNotice({
  auditId,
  findings,
}: {
  auditId: string
  findings: MissingCommentFinding[]
}) {
  if (findings.length === 0) return null

  const listed = findings.slice(0, MAX_LISTED)
  const remaining = findings.length - listed.length

  return (
    <div className="space-y-3 rounded-xl border border-warning/40 bg-warning/5 p-5">
      <div className="flex items-start gap-3">
        <TriangleAlert className="mt-0.5 size-5 shrink-0 text-warning" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            {findings.length} non-conformité{findings.length > 1 ? "s" : ""} sans
            commentaire
          </p>
          <p className="text-sm text-muted-foreground">
            Un critère non conforme doit expliquer ce qui a été observé. Les
            livrables restent générables, mais le client n&apos;aura aucune
            indication sur ces points.
          </p>
        </div>
      </div>

      <ul className="space-y-1 pl-8">
        {listed.map((finding) => (
          <li key={finding.findingId} className="text-sm">
            <Link
              href={`/audits/${auditId}/criteria?page=${finding.pageId}`}
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              <span className="font-medium text-foreground">
                {finding.criterionId}
              </span>{" "}
              {finding.title}{" "}
              <span className="text-muted-foreground">
                — {finding.pageLabel}
              </span>
            </Link>
          </li>
        ))}
        {remaining > 0 && (
          <li className="text-sm text-muted-foreground">
            et {remaining} autre{remaining > 1 ? "s" : ""}…
          </li>
        )}
      </ul>
    </div>
  )
}
