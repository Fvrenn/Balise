import "server-only"

import { cache } from "react"
import { headers } from "next/headers"

import { appRouter } from "@/server/routers/_app"
import { createCallerFactory } from "@/server/trpc"
import { createTRPCContext } from "@/server/context"

// Caller tRPC côté serveur : les Server Components appellent les procédures en
// process (sans aller-retour HTTP), avec le contexte d'auth de la requête courante.
// `cache` mémorise le caller le temps d'un rendu pour ne résoudre la session qu'une
// fois par requête.
const createCaller = createCallerFactory(appRouter)

export const getServerApi = cache(async () => {
  const context = await createTRPCContext({
    headers: new Headers(await headers()),
  })
  return createCaller(context)
})
