import { notFound } from "next/navigation"
import { TRPCError } from "@trpc/server"

import { getServerApi } from "@/trpc/server"
import { handleServerError } from "@/lib/server-utils"
import { AuditHeader } from "./audit-header"

export default async function AuditLayout({
  params,
  children,
}: {
  params: Promise<{ auditId: string }>
  children: React.ReactNode
}) {
  const { auditId } = await params

  const api = await getServerApi()
  const [audit, currentMember] = await Promise.all([
    api.audits.getById({ id: auditId }).catch((error: unknown) => {
      if (error instanceof TRPCError && error.code === "NOT_FOUND") notFound()
      return handleServerError(error)
    }),
    api.member.current(),
  ])

  return (
    <div className="flex min-h-full flex-col">
      <AuditHeader
        auditId={auditId}
        organizationName={currentMember.organizationName}
        initialAudit={audit}
      />
      <div className="flex-1">{children}</div>
    </div>
  )
}
