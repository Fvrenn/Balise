"use client"

import { Download, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useExcelExport } from "@/components/audit/use-excel-export"

export function ExcelDownloadButton({ auditId }: { auditId: string }) {
  const { exportExcel, isExporting } = useExcelExport(auditId)
  return (
    <Button onClick={exportExcel} disabled={isExporting}>
      {isExporting ? <Loader2 className="animate-spin" /> : <Download />}
      Télécharger
    </Button>
  )
}
