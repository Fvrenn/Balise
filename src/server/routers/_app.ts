import { router } from '@/server/trpc'
import { clientsRouter } from '@/server/routers/clients'
import { memberRouter } from '@/server/routers/member'

export const appRouter = router({
    clients: clientsRouter,
    member: memberRouter,
})

// Type consommé par le client tRPC pour le typage de bout en bout.
export type AppRouter = typeof appRouter
