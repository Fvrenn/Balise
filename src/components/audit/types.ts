import type { inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "@/server/routers/_app"

type RouterOutputs = inferRouterOutputs<AppRouter>

export type AuditDetail = RouterOutputs["audits"]["getById"]
export type AuditPageRow = AuditDetail["pages"][number]
export type AuditFindingRow = RouterOutputs["audits"]["getFindings"][number]
