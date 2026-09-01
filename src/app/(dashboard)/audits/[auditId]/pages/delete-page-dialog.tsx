"use client"

import { Loader2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Retirer une page supprime aussi ses 106 findings : on annonce précisément ce
// qui est perdu plutôt qu'un « êtes-vous sûr ? » générique.

export function DeletePageDialog({
  page,
  isSubmitting,
  onOpenChange,
  onConfirm,
}: {
  page: { label: string; filledCount: number } | null
  isSubmitting: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) {
  return (
    <Dialog open={page !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Retirer « {page?.label} » de l&apos;échantillon ?</DialogTitle>
          <DialogDescription>
            {page && page.filledCount > 0
              ? `Les ${page.filledCount} critères déjà renseignés sur cette page seront définitivement perdus, ainsi que les résultats de scan associés.`
              : "La page et sa grille des 106 critères seront supprimées. Aucun critère n'y a encore été renseigné."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose
            render={
              <Button type="button" variant="outline" disabled={isSubmitting} />
            }
          >
            Annuler
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Trash2 />}
            Retirer la page
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
