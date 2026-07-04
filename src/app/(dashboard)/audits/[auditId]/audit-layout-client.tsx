"use client"

import { HeaderCollapseProvider } from "./header-collapse-context"
import { ScanProvider } from "./scan-context"

export function AuditLayoutClient({
  auditId,
  children,
}: {
  auditId: string
  children: React.ReactNode
}) {
  return (
    <HeaderCollapseProvider>
      <ScanProvider auditId={auditId}>{children}</ScanProvider>
    </HeaderCollapseProvider>
  )
}
