"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface MarkThemeNADialogProps {
  themeName: string
  onConfirm: () => void
}

export function MarkThemeNADialog({
  themeName,
  onConfirm,
}: MarkThemeNADialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="ghost" size="sm" className="text-xs" />}
      >
        Tout marquer N/A
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Marquer la thématique comme non applicable</DialogTitle>
          <DialogDescription>
            Tous les critères de « {themeName} » passeront en « non applicable ».
            Vous pourrez les modifier individuellement ensuite.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Annuler</DialogClose>
          <Button
            onClick={() => {
              onConfirm()
              setOpen(false)
            }}
          >
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
