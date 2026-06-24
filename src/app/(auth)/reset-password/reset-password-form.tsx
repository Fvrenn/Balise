"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const MIN_PASSWORD_LENGTH = 8

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  // Un token invalide/expiré n'est récupérable qu'en redemandant un email : on
  // affiche alors un lien vers /forgot-password en plus du message.
  const [isTokenError, setIsTokenError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsTokenError(false)

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
    const { error: resetError } = await authClient.resetPassword({
      newPassword: password,
      token,
    })

    if (resetError) {
      // La validation (longueur, correspondance) est déjà faite : un échec serveur
      // vient du token, qui a expiré ou été déjà utilisé.
      setError("Ce lien de réinitialisation est invalide ou a expiré.")
      setIsTokenError(true)
      setIsLoading(false)
      return
    }

    toast.success("Mot de passe mis à jour, vous pouvez vous connecter.")
    router.push("/login")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="new-password">Nouveau mot de passe</Label>
        <Input
          id="new-password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={MIN_PASSWORD_LENGTH}
          required
          disabled={isLoading}
          aria-invalid={error ? true : undefined}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
        <Input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          disabled={isLoading}
          aria-invalid={
            confirm.length > 0 && password !== confirm ? true : undefined
          }
        />
      </div>

      {error && (
        <div
          role="alert"
          className="space-y-1 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          <p>{error}</p>
          {isTokenError && (
            <Link
              href="/forgot-password"
              className="font-medium underline underline-offset-4"
            >
              Demander un nouveau lien
            </Link>
          )}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="animate-spin" />}
        Définir mon mot de passe
      </Button>
    </form>
  )
}
