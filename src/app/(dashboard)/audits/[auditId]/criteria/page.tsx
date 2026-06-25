import { Suspense } from "react"

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
      fallback={
        <p className="px-6 py-10 text-sm text-muted-foreground">
          Chargement de la grille…
        </p>
      }
    >
      <CriteriaWorkspace auditId={auditId} />
    </Suspense>
  )
}
