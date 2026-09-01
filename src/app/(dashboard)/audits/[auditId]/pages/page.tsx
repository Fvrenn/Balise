import { SamplePagesManager } from "./sample-pages-manager"

export default async function SamplePagesPage({
  params,
}: {
  params: Promise<{ auditId: string }>
}) {
  const { auditId } = await params
  return <SamplePagesManager auditId={auditId} />
}
