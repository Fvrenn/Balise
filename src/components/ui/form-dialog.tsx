"use client"

import * as React from "react"
import { XIcon } from "lucide-react"

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

interface FormDialogProps {
  trigger: React.ReactElement
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  isLoading?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function FormDialog({
  trigger,
  title,
  description,
  children,
  footer,
  isLoading = false,
  open,
  defaultOpen,
  onOpenChange,
}: FormDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen

  function handleOpenChange(nextOpen: boolean) {
    // Pendant la soumission, on verrouille la fermeture (overlay, Échap, croix)
    // pour ne pas perdre la saisie en cours.
    if (isLoading && !nextOpen) return
    if (!isControlled) setInternalOpen(nextOpen)
    onOpenChange?.(nextOpen)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleOpenChange}
      disablePointerDismissal={isLoading}
    >
      <DialogTrigger render={trigger} />

      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden p-0 sm:max-w-md"
      >
        <DialogHeader className="border-b border-border px-6 py-5">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <DialogClose
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={isLoading}
              className="absolute top-3 right-3"
            />
          }
        >
          <XIcon />
          <span className="sr-only">Fermer</span>
        </DialogClose>

        <div className="px-6 py-5">{children}</div>

        {footer && <DialogFooter className="px-6 py-4">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}
