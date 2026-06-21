// Rôles du cabinet et leurs libellés affichés. Source unique pour le sélecteur
// d'invitation, le badge de rôle et la liste des invitations.

export type TeamRole = "owner" | "auditor"

export const TEAM_ROLE_OPTIONS: { value: TeamRole; label: string }[] = [
  { value: "auditor", label: "Auditeur" },
  { value: "owner", label: "Owner" },
]

export function teamRoleLabel(role: string | null | undefined): string {
  if (role === "owner") return "Owner"
  if (role === "auditor") return "Auditeur"
  return role ?? "—"
}
