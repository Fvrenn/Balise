import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/login")
  }

  const { user, session: currentSession } = session

  return (
    <main>
      <h1>Informations de connexion</h1>
      <p>Nom : {user.name}</p>
      <p>E-mail : {user.email}</p>
      <p>E-mail vérifié : {user.emailVerified ? "oui" : "non"}</p>
      <p>Identifiant utilisateur : {user.id}</p>
      <p>Membre depuis : {user.createdAt.toLocaleString("fr-FR")}</p>
      <p>Organisation active : {currentSession.activeOrganizationId ?? "aucune"}</p>
      <p>Identifiant de session : {currentSession.id}</p>
      <p>Session expire le : {currentSession.expiresAt.toLocaleString("fr-FR")}</p>
    </main>
  )
}
