import { CriteriaWorkspace } from "./criteria-workspace"

export default async function CriteriaPage({
  params,
}: {
  params: Promise<{ auditId: string }>
}) {
  const { auditId } = await params
  return <CriteriaWorkspace auditId={auditId} />
}
