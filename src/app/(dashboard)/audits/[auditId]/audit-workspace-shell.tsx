"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Check, Download, Loader2, RotateCcw } from "lucide-react"

import { trpc } from "@/trpc/react"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { badgeVariants } from "@/components/ui/badge"
import { SegmentedBar } from "@/components/audit/segmented-bar"
import {
  STATUS_COUNT_KEY,
  STATUS_META,
  STATUS_ORDER,
  progressionPercent,
} from "@/components/audit/rgaa"
import { useExcelExport } from "@/components/audit/use-excel-export"
import type { AuditDetail } from "@/components/audit/types"

import { AuditWorkspaceContext, type SaveState } from "./audit-workspace-context"

interface AuditWorkspaceShellProps {
  audit: AuditDetail
  children: React.ReactNode
}

export function AuditWorkspaceShell({
  audit: initialAudit,
  children,
}: AuditWorkspaceShellProps) {
  const [saveState, setSaveState] = useState<SaveState>("saved")

  // Données serveur initiales + rafraîchissement après chaque sauvegarde (le grille
  // invalide cette query pour mettre à jour la barre de progression).
  const { data: audit } = trpc.audits.getById.useQuery(
    { id: initialAudit.id },
    { initialData: initialAudit },
  )

  const contextValue = useMemo(
    () => ({
      auditId: initialAudit.id,
      pages: initialAudit.pages,
      setSaveState,
    }),
    [initialAudit.id, initialAudit.pages],
  )

  return (
    <AuditWorkspaceContext.Provider value={contextValue}>
      <div className="flex min-h-full flex-col">
        <AuditHeader audit={audit} saveState={saveState} />
        <div className="px-6 py-6">{children}</div>
      </div>
    </AuditWorkspaceContext.Provider>
  )
}

function AuditHeader({
  audit,
  saveState,
}: {
  audit: AuditDetail
  saveState: SaveState
}) {
  const pathname = usePathname()
  const utils = trpc.useUtils()
  const organizationName = trpc.member.current.useQuery().data?.organizationName
  const { exportExcel, isExporting } = useExcelExport(audit.id)

  const updateStatus = trpc.audits.updateAuditStatus.useMutation({
    onSuccess: () => utils.audits.getById.invalidate({ id: audit.id }),
  })

  const base = `/audits/${audit.id}`
  const tabs = [
    { href: `${base}/criteria`, label: "Grille des critères" },
    { href: `${base}/overview`, label: "Vue d'ensemble" },
    { href: `${base}/reports`, label: "Livrables" },
  ]
  const isCompleted = audit.status === "completed"

  return (
    <header className="sticky top-0 z-20 bg-surface px-6 pt-3">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {organizationName ? (
          <>
            <span className="truncate">{organizationName}</span>
            <span aria-hidden>/</span>
          </>
        ) : null}
        <Link href="/audits" className="transition-colors hover:text-foreground">
          Audits
        </Link>
        <span aria-hidden>/</span>
        <span className="truncate font-medium text-foreground">{audit.name}</span>
      </nav>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-xl font-bold text-foreground">
            {audit.name}
          </h1>
          <a
            href={audit.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              badgeVariants({ variant: "secondary" }),
              "max-w-xs truncate font-mono hover:bg-secondary/70",
            )}
          >
            {audit.siteUrl}
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SaveIndicator state={saveState} />
          <Button
            variant="outline"
            size="sm"
            onClick={exportExcel}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Download />
            )}
            Exporter
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateStatus.mutate({
                auditId: audit.id,
                status: isCompleted ? "in_progress" : "completed",
              })
            }
            disabled={updateStatus.isPending}
          >
            {isCompleted ? <RotateCcw /> : <Check />}
            {isCompleted ? "Réouvrir" : "Marquer comme terminé"}
          </Button>
          <Link
            href={`${base}/reports`}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Générer les livrables
          </Link>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="text-sm font-medium text-foreground">
          Progression {progressionPercent(audit.summary)}%
        </span>
        <SegmentedBar
          counts={audit.summary}
          className="w-full max-w-md flex-1"
        />
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {STATUS_ORDER.map((status) => (
            <span key={status} className="tabular-nums">
              {audit.summary[STATUS_COUNT_KEY[status]]} {STATUS_META[status].shortLabel}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-1 border-b border-border">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>
    </header>
  )
}

function SaveIndicator({ state }: { state: SaveState }) {
  const meta =
    state === "saving"
      ? { dot: "bg-primary animate-pulse", label: "Enregistrement…" }
      : state === "error"
        ? { dot: "bg-destructive", label: "Échec de l'enregistrement" }
        : { dot: "bg-success", label: "Enregistré" }
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={cn("size-2 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  )
}
