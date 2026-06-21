"use client"

import { toast } from "sonner"

import { trpc } from "@/trpc/react"

const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

function base64ToBlob(base64: string, type: string) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return new Blob([bytes], { type })
}

// Récupère la grille Excel (base64) et déclenche le téléchargement via un lien
// temporaire (URL.createObjectURL).
export function useExcelExport(auditId: string) {
  const exportMutation = trpc.audits.exportExcel.useMutation({
    onSuccess: ({ filename, base64 }) => {
      const url = URL.createObjectURL(base64ToBlob(base64, XLSX_MIME))
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    },
    onError: () => toast.error("L'export Excel a échoué."),
  })

  return {
    exportExcel: () => exportMutation.mutate({ auditId }),
    isExporting: exportMutation.isPending,
  }
}
