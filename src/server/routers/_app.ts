import { router } from '@/server/trpc'
import { auditsRouter } from '@/server/routers/audits'
import { cabinetRouter } from '@/server/routers/cabinet'
import { clientsRouter } from '@/server/routers/clients'
import { memberRouter } from '@/server/routers/member'
import { teamRouter } from '@/server/routers/team'

export const appRouter = router({
    audits: auditsRouter,
    cabinet: cabinetRouter,
    clients: clientsRouter,
    member: memberRouter,
    team: teamRouter,
})

// Type consommé par le client tRPC pour le typage de bout en bout.
export type AppRouter = typeof appRouter
