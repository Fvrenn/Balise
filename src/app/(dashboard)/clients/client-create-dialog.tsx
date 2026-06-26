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

const EMPTY_FORM = {
  name: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  website: "",
  address: "",
  siret: "",
  note: "",
}

export function ClientCreateDialog() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const utils = trpc.useUtils()
  const createClient = trpc.clients.create.useMutation({
    onSuccess: async () => {
      await utils.clients.list.invalidate()
      toast.success("Client créé.")
      setForm(EMPTY_FORM)
      setOpen(false)
    },
    onError: (error) => {
      toast.error(error.message || "La création du client a échoué.")
    },
  })

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) setForm(EMPTY_FORM)
  }

  function set(field: keyof typeof EMPTY_FORM) {
    return (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    createClient.mutate({
      name: form.name.trim(),
      contactName: form.contactName.trim() || undefined,
      contactEmail: form.contactEmail.trim() || undefined,
      contactPhone: form.contactPhone.trim() || undefined,
      website: form.website.trim() || undefined,
      address: form.address.trim() || undefined,
      siret: form.siret.trim() || undefined,
      note: form.note.trim() || undefined,
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
            disabled={isSubmitting || form.name.trim().length === 0}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus />}
            Créer le client
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="create-name">
            Raison sociale <span className="text-destructive">*</span>
          </Label>
          <Input
            id="create-name"
            value={form.name}
            onChange={set("name")}
            placeholder="ex. Mairie de Strasbourg"
            required
            disabled={isSubmitting}
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="create-contact-name">
              Nom du contact{" "}
              <span className="text-xs font-normal text-muted-foreground">(optionnel)</span>
            </Label>
            <Input
              id="create-contact-name"
              value={form.contactName}
              onChange={set("contactName")}
              placeholder="Jean Dupont"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-siret">
              SIRET{" "}
              <span className="text-xs font-normal text-muted-foreground">(optionnel)</span>
            </Label>
            <Input
              id="create-siret"
              value={form.siret}
              onChange={set("siret")}
              placeholder="123 456 789 00012"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="create-email">
              Email{" "}
              <span className="text-xs font-normal text-muted-foreground">(optionnel)</span>
            </Label>
            <Input
              id="create-email"
              type="email"
              value={form.contactEmail}
              onChange={set("contactEmail")}
              placeholder="contact@exemple.fr"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-phone">
              Téléphone{" "}
              <span className="text-xs font-normal text-muted-foreground">(optionnel)</span>
            </Label>
            <Input
              id="create-phone"
              type="tel"
              value={form.contactPhone}
              onChange={set("contactPhone")}
              placeholder="01 23 45 67 89"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="create-website">
            Site web{" "}
            <span className="text-xs font-normal text-muted-foreground">(optionnel)</span>
          </Label>
          <Input
            id="create-website"
            value={form.website}
            onChange={set("website")}
            placeholder="exemple.fr"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="create-address">
            Adresse{" "}
            <span className="text-xs font-normal text-muted-foreground">(optionnel)</span>
          </Label>
          <Input
            id="create-address"
            value={form.address}
            onChange={set("address")}
            placeholder="12 rue de la Paix, 75001 Paris"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="create-note">
            Note interne{" "}
            <span className="text-xs font-normal text-muted-foreground">(optionnel)</span>
          </Label>
          <Input
            id="create-note"
            value={form.note}
            onChange={set("note")}
            placeholder="Groupe bancaire, plusieurs filiales…"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </FormDialog>
  )
}
