import { getServerApi } from "@/trpc/server"
import { handleServerError } from "@/lib/server-utils"

// Sous-titre personnalisé : streamé à part pour que le titre et le bouton de la
// page s'affichent sans attendre la résolution du membre courant.
export async function DashboardGreeting() {
  const api = await getServerApi()
  const member = await api.member.current().catch(handleServerError)
  const firstName = member.name.trim().split(/\s+/)[0]

  return <p className="text-sm text-muted-foreground">Bienvenue, {firstName}</p>
}
