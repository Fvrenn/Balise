import { redirect } from "next/navigation"

// L'onglet « Grille des critères » est l'écran de travail par défaut.
export default async function AuditIndexPage({
  params,
}: {
  params: Promise<{ auditId: string }>
}) {
  const { auditId } = await params
  redirect(`/audits/${auditId}/criteria`)
}
