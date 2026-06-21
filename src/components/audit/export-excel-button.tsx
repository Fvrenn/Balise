"use client"

import { Download, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { trpc } from "@/trpc/react"
import { Button } from "@/components/ui/button"

const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

// Reconstruit le fichier Excel à partir du base64 renvoyé par le serveur et
// déclenche son téléchargement via un lien temporaire.
function downloadBase64(base64: string, filename: string) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  const url = URL.createObjectURL(new Blob([bytes], { type: XLSX_MIME }))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

interface ExportExcelButtonProps {
  auditId: string
  variant?: React.ComponentProps<typeof Button>["variant"]
  size?: React.ComponentProps<typeof Button>["size"]
  className?: string
  children?: React.ReactNode
}

// Bouton réutilisé dans le header, la vue d'ensemble et les livrables : génère puis
// télécharge la grille d'audit RGAA au format Excel.
export function ExportExcelButton({
  auditId,
  variant = "outline",
  size,
  className,
  children,
}: ExportExcelButtonProps) {
  const exportExcel = trpc.audits.exportExcel.useMutation({
    onSuccess: ({ base64, filename }) => {
      downloadBase64(base64, filename)
    },
    onError: (error) => {
      toast.error(error.message || "L'export Excel a échoué.")
    },
  })

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      disabled={exportExcel.isPending}
      onClick={() => exportExcel.mutate({ auditId })}
    >
      {exportExcel.isPending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Download />
      )}
      {children ?? "Exporter"}
    </Button>
  )
}
