import { Suspense } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { AuditNewForm } from "./audit-new-form"

export default function NewAuditPage() {
  return (
    <div className="mx-12 max-w-3xl space-y-8 px-6 py-10">
      <Link
        href="/audits"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Audits
      </Link>

      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Nouvel audit
        </h1>
        <p className="text-sm text-muted-foreground">
          Renseignez le site à auditer et les pages de l&apos;échantillon.
        </p>
      </div>

      {/* useSearchParams (pré-sélection du client via ?clientId) impose une frontière
          Suspense pour ne pas désactiver le rendu statique au build. */}
      <Suspense fallback={null}>
        <AuditNewForm />
      </Suspense>
    </div>
  )
}
