import { router } from '@/server/trpc'
import { auditsRouter } from '@/server/routers/audits'
import { clientsRouter } from '@/server/routers/clients'
import { memberRouter } from '@/server/routers/member'

export const appRouter = router({
    audits: auditsRouter,
    clients: clientsRouter,
    member: memberRouter,
})

// Type consommé par le client tRPC pour le typage de bout en bout.
export type AppRouter = typeof appRouter
