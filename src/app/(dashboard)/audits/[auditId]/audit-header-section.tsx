import { notFound } from "next/navigation"
import { TRPCError } from "@trpc/server"

import { getServerApi } from "@/trpc/server"
import { getAuditById } from "@/lib/audit-cache"
import { handleServerError } from "@/lib/server-utils"

import { AuditHeader } from "./audit-header"

// Header de l'audit streamé : fetche l'audit (mémoïsé, partagé avec la page) et le
// membre courant, puis rend AuditHeader. La structure du layout (et les onglets de
// contenu) s'affiche sans attendre ces données.
export async function AuditHeaderSection({ auditId }: { auditId: string }) {
  const api = await getServerApi()
  const [audit, currentMember] = await Promise.all([
    getAuditById(auditId).catch((error: unknown) => {
      if (error instanceof TRPCError && error.code === "NOT_FOUND") notFound()
      return handleServerError(error)
    }),
    api.member.current(),
  ])

  return (
    <AuditHeader
      auditId={auditId}
      organizationName={currentMember.organizationName}
      initialAudit={audit}
    />
  )
}
