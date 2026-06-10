import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { organization } from 'better-auth/plugins'
import { nextCookies } from 'better-auth/next-js'
import { db } from '@/db'
import {
    user,
    session,
    account,
    verification,
    organization as organizationTable,
    member,
    invitation,
} from '@/db/schema'

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        // Mapping explicite modèle Better Auth → table Drizzle.
        schema: {
            user,
            session,
            account,
            verification,
            organization: organizationTable,
            member,
            invitation,
        },
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        // Un cabinet = une organization.
        organization(),
        // nextCookies doit rester le dernier plugin de la liste.
        nextCookies(),
    ],
})
