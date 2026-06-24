import Link from "next/link"
import { redirect } from "next/navigation"
import { TriangleAlert } from "lucide-react"

import { ResetPasswordForm } from "./reset-password-form"

// Better Auth aboutit ici de deux façons après le clic sur le lien email :
//   - lien valide  → /reset-password?token=…   (on affiche le formulaire)
//   - lien expiré  → /reset-password?error=…   (on affiche l'erreur)
// Sans aucun des deux, l'accès est direct/illégitime : retour à /forgot-password.
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[]; error?: string | string[] }>
}) {
  const params = await searchParams
  const token = typeof params.token === "string" ? params.token : undefined
  const hasError = params.error !== undefined

  if (!token) {
    if (!hasError) redirect("/forgot-password")

    return (
      <div className="space-y-8">
        <div className="space-y-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <TriangleAlert className="size-5" />
          </span>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Lien invalide ou expiré
          </h1>
          <p className="text-sm text-muted-foreground">
            Ce lien de réinitialisation n&apos;est plus valable. Demandez-en un
            nouveau pour définir votre mot de passe.
          </p>
        </div>

        <Link
          href="/forgot-password"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Demander un nouveau lien
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Nouveau mot de passe
        </h1>
        <p className="text-sm text-muted-foreground">
          Choisissez le mot de passe qui sécurisera votre accès à Balise.
        </p>
      </div>

      <ResetPasswordForm token={token} />
    </div>
  )
}
