import { redirect } from "next/navigation"
import { TRPCError } from "@trpc/server"

// Traduit les erreurs d'API serveur récurrentes en redirection cohérente : une
// session absente (UNAUTHORIZED) ou un accès hors cabinet (FORBIDDEN) renvoient au
// login plutôt que de laisser le rendu serveur planter. Toute autre erreur remonte.
// À brancher tel quel : `await api.x().catch(handleServerError)`.
export function handleServerError(error: unknown): never {
  if (
    error instanceof TRPCError &&
    (error.code === "FORBIDDEN" || error.code === "UNAUTHORIZED")
  ) {
    redirect("/login")
  }
  throw error
}

// Sections réservées aux owners (équipe, paramètres du cabinet) : un auditeur est
// renvoyé au tableau de bord. À appeler après avoir résolu le membre courant.
export function assertOwner(member: { role: string }): void {
  if (member.role !== "owner") {
    redirect("/dashboard")
  }
}
