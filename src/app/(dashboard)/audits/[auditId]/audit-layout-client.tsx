"use client"

import { HeaderCollapseProvider } from "./header-collapse-context"

export function AuditLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return <HeaderCollapseProvider>{children}</HeaderCollapseProvider>
}
