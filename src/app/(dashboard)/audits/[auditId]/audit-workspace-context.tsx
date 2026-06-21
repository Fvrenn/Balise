"use client"

import { createContext, useContext } from "react"

import type { AuditPageRow } from "@/components/audit/types"

export type SaveState = "saved" | "saving" | "error"

export interface AuditWorkspaceContextValue {
  auditId: string
  pages: AuditPageRow[]
  setSaveState: (state: SaveState) => void
}

const AuditWorkspaceContext = createContext<AuditWorkspaceContextValue | null>(
  null,
)

export { AuditWorkspaceContext }

export function useAuditWorkspace() {
  const context = useContext(AuditWorkspaceContext)
  if (!context) {
    throw new Error(
      "useAuditWorkspace doit être utilisé dans AuditWorkspaceShell.",
    )
  }
  return context
}
