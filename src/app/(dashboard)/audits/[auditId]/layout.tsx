import { Suspense } from "react"

import { AuditHeaderSkeleton } from "@/components/ui/skeletons"

import { AuditHeaderSection } from "./audit-header-section"
import { AuditLayoutClient } from "./audit-layout-client"

export default async function AuditLayout({
  params,
  children,
}: {
  params: Promise<{ auditId: string }>
  children: React.ReactNode
}) {
  const { auditId } = await params

  return (
    <AuditLayoutClient>
      <div className="flex min-h-full flex-col">
        <Suspense fallback={<AuditHeaderSkeleton />}>
          <AuditHeaderSection auditId={auditId} />
        </Suspense>
        <div className="flex-1">{children}</div>
      </div>
    </AuditLayoutClient>
  )
}
