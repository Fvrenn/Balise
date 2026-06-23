import { getServerApi } from "@/trpc/server"
import { handleServerError } from "@/lib/server-utils"

import { AuditProgressCard } from "./audit-progress-card"

// Audits en cours de l'utilisateur : fetche listMine puis streame ses cartes.
// La section entière disparaît s'il n'y en a aucun (comportement inchangé).
export async function MyAuditsSection() {
  const api = await getServerApi()
  const myAudits = await api.audits.listMine().catch(handleServerError)
  const myAuditsInProgress = myAudits.filter(
    (audit) => audit.status === "in_progress",
  )

  if (myAuditsInProgress.length === 0) return null

  return (
    <section className="space-y-4">
      <h2 className="font-heading text-lg font-semibold text-foreground">
        Mes audits en cours
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {myAuditsInProgress.map((audit) => (
          <AuditProgressCard key={audit.id} audit={audit} />
        ))}
      </div>
    </section>
  )
}
