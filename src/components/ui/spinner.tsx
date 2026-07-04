import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

// Indicateur circulaire standard pour tous les états « Chargement… » de l'app.
// Sans "use client" : utilisable aussi dans les loading.tsx (Server Components).

function Spinner({ className }: { className?: string }) {
  return (
    <Loader2 aria-hidden className={cn("size-4 animate-spin", className)} />
  )
}

// Bloc de chargement pleine zone : spinner + message, centré. À utiliser pour
// les fallbacks de page/section plutôt qu'un texte nu.
function LoadingMessage({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="status"
      className="flex items-center justify-center gap-2 px-6 py-10 text-sm text-muted-foreground"
    >
      <Spinner />
      {children}
    </p>
  )
}

export { LoadingMessage, Spinner }
