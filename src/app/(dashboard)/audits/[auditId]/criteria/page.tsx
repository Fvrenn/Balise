import { Suspense } from "react"

import { LoadingMessage } from "@/components/ui/spinner"

import { CriteriaWorkspace } from "./criteria-workspace"

export default async function CriteriaPage({
  params,
}: {
  params: Promise<{ auditId: string }>
}) {
  const { auditId } = await params
  // CriteriaWorkspace lit l'onglet de page actif via useSearchParams : Next impose
  // alors une frontière Suspense au-dessus.
  return (
    <Suspense
      fallback={<LoadingMessage>Chargement de la grille…</LoadingMessage>}
    >
      <CriteriaWorkspace auditId={auditId} />
    </Suspense>
  )
}
