"use client"

import { useState } from "react"
import { Loader2, Plus } from "lucide-react"
import { toast } from "sonner"

import { trpc } from "@/trpc/react"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { FormDialog } from "@/components/ui/form-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const FORM_ID = "client-create-form"

export function ClientCreateDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [note, setNote] = useState("")

  const utils = trpc.useUtils()
  const createClient = trpc.clients.create.useMutation({
    onSuccess: async () => {
      await utils.clients.list.invalidate()
      toast.success("Client créé.")
      resetForm()
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
    <FormDialog
      trigger={
        <Button>
          <Plus />
          Nouveau client
        </Button>
      }
      title="Nouveau client"
      description="Ajoutez un client à votre cabinet."
      open={open}
      onOpenChange={handleOpenChange}
      isLoading={isSubmitting}
      footer={
        <>
          <DialogClose
            render={
              <Button type="button" variant="outline" disabled={isSubmitting} />
            }
          >
            Annuler
          </DialogClose>
          <Button
            type="submit"
            form={FORM_ID}
            disabled={isSubmitting || name.trim().length === 0}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus />}
            Créer le client
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-5">
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
      </form>
    </FormDialog>
  )
}
