"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { toast } from "sonner"

import { trpc } from "@/trpc/react"
import type { ScanProgressEvent } from "@/lib/scan-events"

import {
  ScanConfirmationDialog,
  type ScanConfirmation,
} from "./scan-confirmation-dialog"

// État partagé du scanner pour un audit : un seul flux SSE, une seule modale de
// confirmation et un seul toast de fin, quel que soit le bouton déclencheur
// (scan complet dans le header, scan d'une page dans la grille des critères).

export interface ScanProgressState {
  currentPage: number
  doneCount: number
  totalPages: number
  pageLabel: string
}

interface ScanContextValue {
  // null = aucun scan en cours.
  progress: ScanProgressState | null
  // pageId si le scan en cours est restreint à une page, null = audit complet.
  scanTarget: string | null
  isStarting: boolean
  startScan: (pageId?: string) => void
}

const ScanContext = createContext<ScanContextValue | null>(null)

export function useScan(): ScanContextValue {
  const value = useContext(ScanContext)
  if (!value) {
    throw new Error("useScan doit être utilisé sous <ScanProvider>.")
  }
  return value
}

export function ScanProvider({
  auditId,
  children,
}: {
  auditId: string
  children: React.ReactNode
}) {
  const utils = trpc.useUtils()
  const [confirmation, setConfirmation] = useState<ScanConfirmation | null>(
    null,
  )
  const [progress, setProgress] = useState<ScanProgressState | null>(null)
  const [scanTarget, setScanTarget] = useState<string | null>(null)
  // Périmètre demandé au dernier lancement : les boutons de la modale relancent
  // scan.start avec le même pageId.
  const requestedPageIdRef = useRef<string | undefined>(undefined)
  const eventSourceRef = useRef<EventSource | null>(null)
  // Id du run qu'on vient de clôturer côté client : juste après un scan_complete
  // SSE, le cache de getStatus contient encore ce run en « running » — sans ce
  // garde-fou, l'effet de reprise recréerait une progression figée.
  const finishedRunIdRef = useRef<string | null>(null)
  const lastRunIdRef = useRef<string | null>(null)

  const isScanning = progress !== null

  // Filet de sécurité pendant un scan : si le flux SSE lâche (worker redémarré,
  // réseau), l'état en base reste la source de vérité.
  const statusQuery = trpc.scan.getStatus.useQuery(
    { auditId },
    { refetchInterval: isScanning ? 5_000 : false },
  )

  const stopTracking = useCallback(() => {
    eventSourceRef.current?.close()
    eventSourceRef.current = null
    setProgress(null)
    setScanTarget(null)
  }, [])

  const finishScan = useCallback(
    (outcome: { success: boolean; message: string }) => {
      finishedRunIdRef.current = lastRunIdRef.current
      stopTracking()
      if (outcome.success) toast.success(outcome.message)
      else toast.error(outcome.message)
      // Reflète les findings posés par le scan dans la grille et le header.
      void utils.audits.getFindings.invalidate({ auditId })
      void utils.audits.getById.invalidate({ id: auditId })
      void utils.audits.list.invalidate()
      void utils.scan.getStatus.invalidate({ auditId })
    },
    [auditId, stopTracking, utils],
  )

  const trackScan = useCallback(() => {
    if (eventSourceRef.current) return
    setProgress(
      (previous) =>
        previous ?? {
          currentPage: 0,
          doneCount: 0,
          totalPages: 0,
          pageLabel: "",
        },
    )

    const source = new EventSource(`/api/scan-progress/${auditId}`)
    eventSourceRef.current = source
    source.onmessage = (message: MessageEvent<string>) => {
      let event: ScanProgressEvent
      try {
        event = JSON.parse(message.data) as ScanProgressEvent
      } catch {
        return
      }
      if (event.type === "page_start") {
        setProgress((previous) => ({
          currentPage: event.pageIndex + 1,
          doneCount: previous?.doneCount ?? event.pageIndex,
          totalPages: event.totalPages,
          pageLabel: event.pageLabel,
        }))
      } else if (event.type === "page_done") {
        setProgress((previous) =>
          previous
            ? { ...previous, doneCount: event.pageIndex + 1 }
            : previous,
        )
      } else if (event.type === "scan_complete") {
        finishScan({
          success: true,
          message: `Scan terminé — ${event.updatedCount ?? 0} critère(s) mis à jour`,
        })
      } else if (event.type === "scan_error") {
        finishScan({
          success: false,
          message: event.message ?? "Le scan a échoué.",
        })
      }
    }
    // Flux interrompu : on coupe et on laisse le polling de statut reprendre la
    // main (il relancera le suivi si le scan tourne toujours).
    source.onerror = () => {
      source.close()
      if (eventSourceRef.current === source) eventSourceRef.current = null
      void utils.scan.getStatus.invalidate({ auditId })
    }
  }, [auditId, finishScan, utils])

  const startMutation = trpc.scan.start.useMutation({
    onSuccess: (result) => {
      if (result.requiresConfirmation) {
        setConfirmation(result)
        return
      }
      setConfirmation(null)
      setScanTarget(requestedPageIdRef.current ?? null)
      trackScan()
    },
    onError: (error) => toast.error(error.message),
  })

  const startScan = useCallback(
    (pageId?: string) => {
      requestedPageIdRef.current = pageId
      startMutation.mutate({ auditId, pageId })
    },
    [auditId, startMutation],
  )

  // Reprise après rechargement de page : un scan encore actif en base réaffiche
  // la progression (et son périmètre) puis rouvre le flux SSE. Un scan terminé
  // pendant une coupure SSE est clôturé depuis le statut base.
  const lastRun = statusQuery.data
  useEffect(() => {
    lastRunIdRef.current = lastRun?.id ?? null
    if (!lastRun) return
    if (lastRun.status === "pending" || lastRun.status === "running") {
      // Run déjà clôturé côté client (toast affiché) : le statut « running »
      // vient du cache pas encore rafraîchi, on ne relance pas le suivi.
      if (lastRun.id === finishedRunIdRef.current) return
      setProgress((previous) =>
        previous ?? {
          currentPage: lastRun.pagesDone,
          doneCount: lastRun.pagesDone,
          totalPages: lastRun.pagesTotal,
          pageLabel: "",
        },
      )
      setScanTarget(lastRun.pageId)
      trackScan()
    } else if (isScanning && !eventSourceRef.current) {
      if (lastRun.status === "completed") {
        finishScan({ success: true, message: "Scan terminé" })
      } else {
        finishScan({
          success: false,
          message: lastRun.error ?? "Le scan a échoué.",
        })
      }
    }
  }, [lastRun, isScanning, trackScan, finishScan])

  // Ferme le flux SSE au démontage (navigation hors de l'audit).
  useEffect(() => {
    return () => {
      eventSourceRef.current?.close()
      eventSourceRef.current = null
    }
  }, [])

  return (
    <ScanContext.Provider
      value={{
        progress,
        scanTarget,
        isStarting: startMutation.isPending,
        startScan,
      }}
    >
      {children}

      <ScanConfirmationDialog
        confirmation={confirmation}
        isPageScope={requestedPageIdRef.current !== undefined}
        isLoading={startMutation.isPending}
        onOpenChange={(open) => {
          if (!open) setConfirmation(null)
        }}
        onChoose={(overwriteExisting) =>
          startMutation.mutate({
            auditId,
            pageId: requestedPageIdRef.current,
            overwriteExisting,
          })
        }
      />
    </ScanContext.Provider>
  )
}
