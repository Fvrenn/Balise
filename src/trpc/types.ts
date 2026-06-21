import type { inferRouterOutputs } from "@trpc/server"

import type { AppRouter } from "@/server/routers/_app"

// Types de retour des procédures, inférés de bout en bout. Évite de redéclarer
// manuellement la forme des données côté composants.
export type RouterOutputs = inferRouterOutputs<AppRouter>

export type AuditDetail = RouterOutputs["audits"]["getById"]
export type AuditFindingRow = RouterOutputs["audits"]["getFindings"][number]
