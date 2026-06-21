"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const MIN_PASSWORD_LENGTH = 8

type SessionState = "none" | "match" | "mismatch"

export function AcceptInvitationForm({
  invitationId,
  email,
  organizationName,
  sessionState,
  hasAccount,
  currentEmail,
}: {
  invitationId: string
  email: string
  organizationName: string
  sessionState: SessionState
  hasAccount: boolean
  currentEmail: string | null
}) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function goToDashboard() {
    router.replace("/dashboard")
    router.refresh()
  }

  // Accepte l'invitation pour la session courante (le destinataire doit être
  // connecté avec l'email invité). Renvoie false en cas d'échec.
  async function acceptInvitation(): Promise<boolean> {
    const { error: acceptError } =
      await authClient.organization.acceptInvitation({ invitationId })
    if (acceptError) {
      setError(
        "Impossible de rejoindre le cabinet. L'invitation a peut-être expiré.",
      )
      return false
    }
    return true
  }

  // Cas « mauvais compte » : un autre utilisateur est connecté. On le déconnecte,
  // puis le rechargement réévalue l'état (la page repassera en connexion/création).
  async function handleSignOut() {
    setIsLoading(true)
    await authClient.signOut()
    router.refresh()
    setIsLoading(false)
  }

  async function handleJoin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsLoading(true)
    const accepted = await acceptInvitation()
    if (accepted) {
      goToDashboard()
      return
    }
    setIsLoading(false)
  }

  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
    })
    if (signInError) {
      setError("Mot de passe incorrect. Veuillez réessayer.")
      setIsLoading(false)
      return
    }

    const accepted = await acceptInvitation()
    if (accepted) {
      goToDashboard()
      return
    }
    setIsLoading(false)
  }

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(
        `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`,
      )
      return
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.")
      return
    }

    setIsLoading(true)
    const { error: signUpError } = await authClient.signUp.email({
      email,
      password,
      name: name.trim(),
    })
    if (signUpError) {
      setError(signUpError.message ?? "La création du compte a échoué.")
      setIsLoading(false)
      return
    }

    const accepted = await acceptInvitation()
    if (accepted) {
      goToDashboard()
      return
    }
    setIsLoading(false)
  }

  function ErrorBanner() {
    if (!error) return null
    return (
      <p
        role="alert"
        className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
      >
        {error}
      </p>
    )
  }

  // L'utilisateur est connecté avec un autre compte que le destinataire.
  if (sessionState === "mismatch") {
    return (
      <div className="space-y-5">
        <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          Vous êtes connecté·e en tant que <strong>{currentEmail}</strong>, mais
          cette invitation est destinée à <strong>{email}</strong>. Déconnectez-vous
          pour l&apos;accepter.
        </p>
        <Button
          type="button"
          size="lg"
          className="w-full"
          onClick={handleSignOut}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : null}
          Se déconnecter
        </Button>
      </div>
    )
  }

  // Le bon destinataire est déjà connecté : un simple clic suffit.
  if (sessionState === "match") {
    return (
      <form onSubmit={handleJoin} className="space-y-5">
        <ErrorBanner />
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : null}
          Rejoindre {organizationName}
        </Button>
      </form>
    )
  }

  // Pas de session, mais un compte existe déjà pour cet email : connexion.
  if (hasAccount) {
    return (
      <form onSubmit={handleSignIn} className="space-y-5" noValidate>
        <Field>
          <FieldLabel htmlFor="invite-email">Adresse e-mail</FieldLabel>
          <Input id="invite-email" type="email" value={email} disabled />
        </Field>
        <Field>
          <FieldLabel htmlFor="invite-password">Mot de passe</FieldLabel>
          <Input
            id="invite-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            disabled={isLoading}
          />
        </Field>
        <ErrorBanner />
        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : null}
          Se connecter et rejoindre
        </Button>
      </form>
    )
  }

  // Aucun compte : finalisation du compte de l'auditeur invité.
  return (
    <form onSubmit={handleSignUp} className="space-y-5" noValidate>
      <Field>
        <FieldLabel htmlFor="invite-email">Adresse e-mail</FieldLabel>
        <Input id="invite-email" type="email" value={email} disabled />
      </Field>
      <Field>
        <FieldLabel htmlFor="invite-name">
          Nom complet <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="invite-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          required
          maxLength={200}
          disabled={isLoading}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="invite-new-password">
          Mot de passe <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="invite-new-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
          disabled={isLoading}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="invite-confirm-password">
          Confirmer le mot de passe <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="invite-confirm-password"
          type="password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          autoComplete="new-password"
          required
          aria-invalid={confirm.length > 0 && password !== confirm}
          disabled={isLoading}
        />
      </Field>
      <ErrorBanner />
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isLoading || name.trim().length === 0}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : null}
        Créer mon compte et rejoindre
      </Button>
    </form>
  )
}
