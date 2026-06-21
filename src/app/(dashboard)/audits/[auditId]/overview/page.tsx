import { getServerApi } from "@/trpc/server"
import { OverviewContent } from "./overview-content"

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ auditId: string }>
}) {
  const { auditId } = await params

  // L'accès et l'existence de l'audit sont déjà garantis par le layout.
  const api = await getServerApi()
  const audit = await api.audits.getById({ id: auditId })

  return <OverviewContent auditId={auditId} initialAudit={audit} />
}
