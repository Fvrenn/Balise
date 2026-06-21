"use client"

import { useState } from "react"
import { Check, Copy, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { trpc } from "@/trpc/react"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type CreatedOwner = {
  email: string
  temporaryPassword: string
}

export function CreateOwnerForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  // Mot de passe temporaire affiché une seule fois après création : conservé en
  // local jusqu'à la prochaine création, jamais renvoyé par le serveur ensuite.
  const [createdOwner, setCreatedOwner] = useState<CreatedOwner | null>(null)
  const [hasCopied, setHasCopied] = useState(false)

  const createOwner = trpc.admin.createOwner.useMutation({
    onSuccess: (result) => {
      setCreatedOwner(result)
      setName("")
      setEmail("")
      toast.success("Compte Owner créé.")
    },
    onError: (error) =>
      toast.error(error.message || "La création du compte a échoué."),
  })

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (name.trim().length === 0 || email.trim().length === 0) return
    setCreatedOwner(null)
    createOwner.mutate({ name: name.trim(), email: email.trim() })
  }

  async function copyPassword() {
    if (!createdOwner) return
    await navigator.clipboard.writeText(createdOwner.temporaryPassword)
    setHasCopied(true)
    toast.success("Mot de passe copié.")
    setTimeout(() => setHasCopied(false), 2000)
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
            L&apos;Owner créera son cabinet via /onboarding/cabinet à sa première
            connexion.
          </FieldDescription>
        </Field>

        <Button type="submit" disabled={!canSubmit}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : null}
          Créer le compte Owner
        </Button>
      </form>

      {createdOwner ? (
        <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Compte créé pour {createdOwner.email}
            </p>
            <p className="text-sm text-muted-foreground">
              Transmettez ce mot de passe temporaire de façon sécurisée — il ne
              sera plus affiché.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground">
              {createdOwner.temporaryPassword}
            </code>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={copyPassword}
              aria-label="Copier le mot de passe"
            >
              {hasCopied ? <Check /> : <Copy />}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
