import { notFound } from "next/navigation"
import { TRPCError } from "@trpc/server"

import { getAuditById } from "@/lib/audit-cache"
import { handleServerError } from "@/lib/server-utils"
import { OverviewContent } from "./overview-content"

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ auditId: string }>
}) {
  const { auditId } = await params

  // Le layout streame désormais le header en parallèle : la page gère elle-même
  // l'audit introuvable. getAuditById est mémoïsé (cache()), donc l'appel reste
  // partagé avec celui du header, sans requête supplémentaire.
  const audit = await getAuditById(auditId).catch((error: unknown) => {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") notFound()
    return handleServerError(error)
  })

  return <OverviewContent auditId={auditId} audit={audit} />
}
