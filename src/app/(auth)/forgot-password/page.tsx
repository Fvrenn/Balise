"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, MailCheck } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    // redirectTo cible la page publique de définition ; Better Auth y redirige
    // avec le token validé en query (?token=…). On ignore volontairement le
    // résultat : qu'un compte existe ou non, on affiche le même message neutre
    // pour ne pas révéler quels emails sont enregistrés.
    await authClient.requestPasswordReset({
      email: email.trim(),
      redirectTo: "/reset-password",
    })

    setIsLoading(false)
    setIsSent(true)
  }

  if (isSent) {
    return (
      <div className="space-y-8">
        <div className="space-y-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MailCheck className="size-5" />
          </span>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Vérifiez votre boîte mail
          </h1>
          <p className="text-sm text-muted-foreground">
            Si un compte existe avec cet email, vous recevrez un lien de
            réinitialisation dans quelques minutes.
          </p>
        </div>

        <Link
          href="/login"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Retour à la connexion
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Mot de passe oublié
        </h1>
        <p className="text-sm text-muted-foreground">
          Entrez votre adresse e-mail : nous vous enverrons un lien pour
          réinitialiser votre mot de passe.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Adresse e-mail</Label>
          <Input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="vous@cabinet.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="animate-spin" />}
          Envoyer le lien de réinitialisation
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Retour à la connexion
        </Link>
      </p>
    </div>
  )
}
