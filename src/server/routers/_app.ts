import { router } from '@/server/trpc'
import { adminRouter } from '@/server/routers/admin'
import { auditsRouter } from '@/server/routers/audits'
import { cabinetRouter } from '@/server/routers/cabinet'
import { clientsRouter } from '@/server/routers/clients'
import { memberRouter } from '@/server/routers/member'
import { onboardingRouter } from '@/server/routers/onboarding'
import { teamRouter } from '@/server/routers/team'
import { userRouter } from '@/server/routers/user'

export const appRouter = router({
    admin: adminRouter,
    audits: auditsRouter,
    cabinet: cabinetRouter,
    clients: clientsRouter,
    member: memberRouter,
    onboarding: onboardingRouter,
    team: teamRouter,
    user: userRouter,
})

// Type consommé par le client tRPC pour le typage de bout en bout.
export type AppRouter = typeof appRouter
