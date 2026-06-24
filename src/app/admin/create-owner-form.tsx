"use client"

import { useState } from "react"
import { Loader2, MailCheck } from "lucide-react"
import { toast } from "sonner"

import { trpc } from "@/trpc/react"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function CreateOwnerForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  // Email de la dernière invitation envoyée : affiche la confirmation jusqu'à la
  // prochaine soumission.
  const [invitedEmail, setInvitedEmail] = useState<string | null>(null)

  const createOwner = trpc.admin.createOwner.useMutation({
    onSuccess: (result) => {
      setInvitedEmail(result.email)
      setName("")
      setEmail("")
      toast.success("Invitation envoyée.")
    },
    onError: (error) =>
      toast.error(error.message || "La création du compte a échoué."),
  })

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (name.trim().length === 0 || email.trim().length === 0) return
    setInvitedEmail(null)
    createOwner.mutate({ name: name.trim(), email: email.trim() })
  }

  const isSubmitting = createOwner.isPending
  const canSubmit =
    !isSubmitting && name.trim().length > 0 && email.trim().length > 0

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field>
          <FieldLabel htmlFor="owner-name">
            Nom complet <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="owner-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Sophie Bernard"
            required
            maxLength={200}
            disabled={isSubmitting}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="owner-email">
            Adresse e-mail <span className="text-destructive">*</span>
          </FieldLabel>
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
          <FieldDescription>
            L&apos;Owner recevra un email pour définir son mot de passe, puis créera
            son cabinet via /onboarding/cabinet à sa première connexion.
          </FieldDescription>
        </Field>

        <Button type="submit" disabled={!canSubmit}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : null}
          Créer et envoyer l&apos;invitation
        </Button>
      </form>

      {invitedEmail ? (
        <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
          <MailCheck className="mt-0.5 size-5 shrink-0 text-primary" />
          <p className="text-sm text-foreground">
            Un email a été envoyé à <strong>{invitedEmail}</strong> pour qu&apos;il
            définisse son mot de passe.
          </p>
        </div>
      ) : null}
    </div>
  )
}
