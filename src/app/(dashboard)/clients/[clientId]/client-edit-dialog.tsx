"use client"

import { useState } from "react"
import { Loader2, Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { trpc } from "@/trpc/react"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { FormDialog } from "@/components/ui/form-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const FORM_ID = "client-edit-form"

interface ClientEditDialogProps {
  client: { id: string; name: string; note: string | null }
}

export function ClientEditDialog({ client }: ClientEditDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(client.name)
  const [note, setNote] = useState(client.note ?? "")

  const router = useRouter()
  const utils = trpc.useUtils()
  const updateClient = trpc.clients.update.useMutation({
    onSuccess: async () => {
      await utils.clients.list.invalidate()
      toast.success("Fiche client mise à jour.")
      setOpen(false)
      // Rafraîchit le Server Component de la fiche pour refléter le nom/la note.
      router.refresh()
    },
    onError: (error) => {
      toast.error(error.message || "La mise à jour a échoué.")
    },
  })

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    // À l'ouverture, on resynchronise les champs sur les dernières données serveur.
    if (nextOpen) {
      setName(client.name)
      setNote(client.note ?? "")
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    updateClient.mutate({
      id: client.id,
      name: name.trim(),
      note: note.trim() || undefined,
    })
  }

  const isSubmitting = updateClient.isPending

  return (
    <FormDialog
      trigger={
        <Button variant="outline">
          <Pencil />
          Modifier la fiche
        </Button>
      }
      title="Modifier la fiche"
      description="Mettez à jour les informations de ce client."
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
            {isSubmitting ? <Loader2 className="animate-spin" /> : null}
            Enregistrer
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="edit-client-name">
            Raison sociale <span className="text-destructive">*</span>
          </Label>
          <Input
            id="edit-client-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="ex. Mairie de Strasbourg"
            required
            disabled={isSubmitting}
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-client-note">
            Note interne{" "}
            <span className="text-xs font-normal text-muted-foreground">
              (optionnel)
            </span>
          </Label>
          <Input
            id="edit-client-note"
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
