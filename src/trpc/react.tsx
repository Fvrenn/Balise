"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"
import superjson from "superjson"

import type { AppRouter } from "@/server/routers/_app"

// Hooks tRPC typés (trpc.clients.list.useQuery, etc.) à utiliser dans les
// composants client.
export const trpc = createTRPCReact<AppRouter>()

// Durée pendant laquelle une donnée semée côté serveur via `initialData` reste
// considérée fraîche. Sans ce staleTime, le défaut de TanStack Query (0) refetch
// au montage et fait réapparaître dans Network l'appel qu'on vient justement de
// remonter côté serveur. Les mutations qui appellent `invalidate()` refetchent
// malgré ce délai : la réactivité aux changements est préservée.
export const SERVER_DATA_STALE_TIME = 60_000

function getBaseUrl() {
  if (typeof window !== "undefined") return ""
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  // useState garde une seule instance par montage du provider (évite de
  // recréer client et cache à chaque rendu).
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
        }),
      ],
    }),
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
