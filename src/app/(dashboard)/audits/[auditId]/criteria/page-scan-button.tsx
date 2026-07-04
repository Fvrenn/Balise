"use client"

import { ScanSearch } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

import { useScan } from "../scan-context"

// Lance le scan automatique restreint à la page d'échantillon affichée dans la
// grille. Partage l'état du ScanProvider avec le bouton du header : un seul scan
// à la fois, même modale de confirmation, même toast de fin.

export function PageScanButton({ pageId }: { pageId: string }) {
  const { progress, scanTarget, isStarting, startScan } = useScan()
  const isScanningThisPage = progress !== null && scanTarget === pageId
  const isAnotherScanRunning = progress !== null && !isScanningThisPage

  if (isScanningThisPage) {
    return (
      <span
        role="status"
        className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-primary/25 bg-primary/5 px-3 text-sm font-medium text-primary"
      >
        <Spinner className="size-4" />
        Scan de cette page…
      </span>
    )
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isStarting || isAnotherScanRunning}
      onClick={() => startScan(pageId)}
    >
      <ScanSearch />
      Scanner cette page
    </Button>
  )
}
