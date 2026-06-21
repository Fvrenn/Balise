"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

// Le RGPD côté Better Auth impose déjà une longueur minimale ; on l'aligne ici
// pour valider avant l'aller-retour réseau.
const MIN_PASSWORD_LENGTH = 8

const EMPTY_FIELDS = {
  current: "",
  next: "",
  confirm: "",
}

export function PasswordForm() {
  const [fields, setFields] = useState(EMPTY_FIELDS)
  const [confirmError, setConfirmError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function setField(key: keyof typeof EMPTY_FIELDS, value: string) {
    setFields((previous) => ({ ...previous, [key]: value }))
    if (key === "confirm" || key === "next") setConfirmError(null)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (fields.next.length < MIN_PASSWORD_LENGTH) {
      setConfirmError(
        `Le nouveau mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`,
      )
      return
    }
    if (fields.next !== fields.confirm) {
      setConfirmError("Les deux mots de passe ne correspondent pas.")
      return
    }

    setIsSubmitting(true)
    const { error } = await authClient.changePassword({
      currentPassword: fields.current,
      newPassword: fields.next,
    })
    setIsSubmitting(false)

    if (error) {
      // On ne relaie pas le détail technique : un mot de passe actuel erroné
      // renvoie typiquement 400/401, qu'on traduit en message clair.
      toast.error(
        "Le mot de passe actuel est incorrect ou la modification a échoué.",
      )
      return
    }

    setFields(EMPTY_FIELDS)
    toast.success("Mot de passe mis à jour.")
  }

  const canSubmit =
    fields.current.length > 0 &&
    fields.next.length > 0 &&
    fields.confirm.length > 0

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="block h-5 w-[3px] shrink-0 rounded-sm bg-primary" />
            <h2 className="font-heading text-base font-semibold text-foreground">
              Mot de passe
            </h2>
          </div>

          <Field>
            <FieldLabel htmlFor="current-password">
              Mot de passe actuel <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="current-password"
              type="password"
              value={fields.current}
              onChange={(event) => setField("current", event.target.value)}
              required
              autoComplete="current-password"
              disabled={isSubmitting}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="new-password">
              Nouveau mot de passe <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="new-password"
              type="password"
              value={fields.next}
              onChange={(event) => setField("next", event.target.value)}
              required
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete="new-password"
              disabled={isSubmitting}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="confirm-password">
              Confirmer le nouveau mot de passe{" "}
              <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="confirm-password"
              type="password"
              value={fields.confirm}
              onChange={(event) => setField("confirm", event.target.value)}
              required
              autoComplete="new-password"
              aria-invalid={confirmError !== null}
              disabled={isSubmitting}
            />
            {confirmError ? (
              <FieldError match>{confirmError}</FieldError>
            ) : null}
          </Field>
        </CardContent>

        <CardFooter className="justify-end border-t border-border">
          <Button type="submit" disabled={isSubmitting || !canSubmit}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : null}
            Changer le mot de passe
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
