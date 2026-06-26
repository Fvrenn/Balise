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
  client: {
    id: string
    name: string
    contactName?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    website?: string | null
    address?: string | null
    siret?: string | null
    note?: string | null
  }
}

export function ClientEditDialog({ client }: ClientEditDialogProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: client.name,
    contactName: client.contactName ?? "",
    contactEmail: client.contactEmail ?? "",
    contactPhone: client.contactPhone ?? "",
    website: client.website ?? "",
    address: client.address ?? "",
    siret: client.siret ?? "",
    note: client.note ?? "",
  })

  const router = useRouter()
  const utils = trpc.useUtils()
  const updateClient = trpc.clients.update.useMutation({
    onSuccess: async () => {
      await utils.clients.list.invalidate()
      toast.success("Fiche client mise à jour.")
      setOpen(false)
      router.refresh()
    },
    onError: (error) => {
      toast.error(error.message || "La mise à jour a échoué.")
    },
  })

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (nextOpen) {
      setForm({
        name: client.name,
        contactName: client.contactName ?? "",
        contactEmail: client.contactEmail ?? "",
        contactPhone: client.contactPhone ?? "",
        website: client.website ?? "",
        address: client.address ?? "",
        siret: client.siret ?? "",
        note: client.note ?? "",
      })
    }
  }

  function set(field: keyof typeof form) {
    return (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    updateClient.mutate({
      id: client.id,
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
            disabled={isSubmitting || form.name.trim().length === 0}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : null}
            Enregistrer
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="edit-name">
            Raison sociale <span className="text-destructive">*</span>
          </Label>
          <Input
            id="edit-name"
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
            <Label htmlFor="edit-contact-name">
              Nom du contact{" "}
              <span className="text-xs font-normal text-muted-foreground">(optionnel)</span>
            </Label>
            <Input
              id="edit-contact-name"
              value={form.contactName}
              onChange={set("contactName")}
              placeholder="Jean Dupont"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-siret">
              SIRET{" "}
              <span className="text-xs font-normal text-muted-foreground">(optionnel)</span>
            </Label>
            <Input
              id="edit-siret"
              value={form.siret}
              onChange={set("siret")}
              placeholder="123 456 789 00012"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-email">
              Email{" "}
              <span className="text-xs font-normal text-muted-foreground">(optionnel)</span>
            </Label>
            <Input
              id="edit-email"
              type="email"
              value={form.contactEmail}
              onChange={set("contactEmail")}
              placeholder="contact@exemple.fr"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-phone">
              Téléphone{" "}
              <span className="text-xs font-normal text-muted-foreground">(optionnel)</span>
            </Label>
            <Input
              id="edit-phone"
              type="tel"
              value={form.contactPhone}
              onChange={set("contactPhone")}
              placeholder="01 23 45 67 89"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-website">
            Site web{" "}
            <span className="text-xs font-normal text-muted-foreground">(optionnel)</span>
          </Label>
          <Input
            id="edit-website"
            value={form.website}
            onChange={set("website")}
            placeholder="exemple.fr"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-address">
            Adresse{" "}
            <span className="text-xs font-normal text-muted-foreground">(optionnel)</span>
          </Label>
          <Input
            id="edit-address"
            value={form.address}
            onChange={set("address")}
            placeholder="12 rue de la Paix, 75001 Paris"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-note">
            Note interne{" "}
            <span className="text-xs font-normal text-muted-foreground">(optionnel)</span>
          </Label>
          <Input
            id="edit-note"
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
