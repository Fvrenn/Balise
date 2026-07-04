"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Confirmation « Tout marquer N/A » d'une thématique : l'auditrice choisit les
// pages concernées (toutes pré-cochées à l'ouverture) avant de valider.

interface ThemeNaDialogPage {
  id: string
  label: string
}

export function ThemeNaDialog({
  open,
  pages,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  pages: ThemeNaDialogPage[]
  onOpenChange: (open: boolean) => void
  onConfirm: (pageIds: string[]) => void
}) {
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>([])

  // À chaque ouverture, on repart de « toutes les pages » — le choix précédent
  // ne doit pas fuiter d'une thématique à l'autre.
  useEffect(() => {
    if (open) setSelectedPageIds(pages.map((page) => page.id))
  }, [open, pages])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Marquer toute la thématique en N/A ?</DialogTitle>
          <DialogDescription>
            Tous les critères de cette thématique passeront en « non
            applicable » sur les pages sélectionnées. Vous pourrez les
            modifier individuellement ensuite.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Pages concernées
          </p>
          <div className="max-h-56 space-y-0.5 overflow-y-auto">
            {pages.map((page) => (
              <label
                key={page.id}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-accent"
              >
                <Checkbox
                  checked={selectedPageIds.includes(page.id)}
                  onCheckedChange={(checked) =>
                    setSelectedPageIds((prev) =>
                      checked
                        ? [...prev, page.id]
                        : prev.filter((id) => id !== page.id),
                    )
                  }
                />
                <span className="text-sm text-foreground">{page.label}</span>
              </label>
            ))}
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Annuler
          </DialogClose>
          <Button
            type="button"
            disabled={selectedPageIds.length === 0}
            onClick={() => onConfirm(selectedPageIds)}
          >
            Marquer en N/A
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
