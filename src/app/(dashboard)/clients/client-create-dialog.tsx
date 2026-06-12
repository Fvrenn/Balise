"use client"

import { useState } from "react"
import { Building2, Loader2, Plus } from "lucide-react"
import { toast } from "sonner"

import { trpc } from "@/trpc/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ClientCreateDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [note, setNote] = useState("")

  const currentMember = trpc.member.current.useQuery()
  const organizationName = currentMember.data?.organizationName

  const utils = trpc.useUtils()
  const createClient = trpc.clients.create.useMutation({
    onSuccess: async () => {
      await utils.clients.list.invalidate()
      toast.success("Client créé.")
      setOpen(false)
    },
    onError: (error) => {
      toast.error(error.message || "La création du client a échoué.")
    },
  })

  function resetForm() {
    setName("")
    setNote("")
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) resetForm()
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    createClient.mutate({
      name: name.trim(),
      note: note.trim() || undefined,
    })
  }

  const isSubmitting = createClient.isPending

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>
        <Plus />
        Nouveau client
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
        {/* En-tête style image */}
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-sidebar">
              <Building2 className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="font-heading text-base font-semibold text-foreground">
                Nouveau client
              </h2>
              {organizationName && (
                <p className="text-sm text-muted-foreground">{organizationName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Corps du formulaire */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            {/* Raison sociale */}
            <div className="space-y-2">
              <Label htmlFor="client-name">
                Raison sociale <span className="text-destructive">*</span>
              </Label>
              <Input
                id="client-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="ex. Mairie de Strasbourg"
                required
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            {/* Note interne (optionnelle) */}
            <div className="space-y-2">
              <Label htmlFor="client-note">
                Note interne{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (optionnel)
                </span>
              </Label>
              <Input
                id="client-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Groupe bancaire, plusieurs filiales…"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter className="border-t border-border px-6 py-4">
            <DialogClose
              render={
                <Button type="button" variant="outline" disabled={isSubmitting} />
              }
            >
              Annuler
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting || name.trim().length === 0}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Plus />
              )}
              Créer le client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
