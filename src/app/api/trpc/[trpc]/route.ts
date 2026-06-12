import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { createTRPCContext } from '@/server/context'
import { appRouter } from '@/server/routers/_app'

function handler(req: Request) {
    return fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: appRouter,
        createContext: () => createTRPCContext({ headers: req.headers }),
    })
}

export { handler as GET, handler as POST }
