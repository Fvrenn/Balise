"use client"

import { useState } from "react"
import { Loader2, Send, UserPlus } from "lucide-react"
import { toast } from "sonner"

import { trpc } from "@/trpc/react"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { FormDialog } from "@/components/ui/form-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const FORM_ID = "admin-create-owner-form"

// Crée le compte d'un Owner (sans cabinet) et déclenche l'email de définition du
// mot de passe — l'Owner créera son cabinet à sa première connexion. Voir
// admin.createOwner et CLAUDE.md « Modèle d'accès ».
export function CreateOwnerDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const createOwner = trpc.admin.createOwner.useMutation({
    onSuccess: (result) => {
      toast.success(`Invitation envoyée à ${result.email}`)
      resetForm()
      setOpen(false)
    },
    onError: (error) =>
      toast.error(error.message || "La création du compte a échoué."),
  })

  function resetForm() {
    setName("")
    setEmail("")
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) resetForm()
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    createOwner.mutate({ name: name.trim(), email: email.trim() })
  }

  const isSubmitting = createOwner.isPending
  const canSubmit =
    !isSubmitting && name.trim().length > 0 && email.trim().length > 0

  return (
    <FormDialog
      trigger={
        <Button>
          <UserPlus />
          Créer un Owner
        </Button>
      }
      title="Créer un Owner"
      description="Le compte est créé sans cabinet. À sa première connexion, l'Owner sera invité à créer le sien."
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
          <Button type="submit" form={FORM_ID} disabled={!canSubmit}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
            Créer et envoyer l&apos;invitation
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="owner-name">
            Nom complet <span className="text-destructive">*</span>
          </Label>
          <Input
            id="owner-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Sophie Bernard"
            required
            maxLength={200}
            disabled={isSubmitting}
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="owner-email">
            Adresse e-mail <span className="text-destructive">*</span>
          </Label>
          <Input
            id="owner-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="sophie@cabinet.fr"
            required
            maxLength={200}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </FormDialog>
  )
}
