import { eq } from 'drizzle-orm'

import { auth } from '@/lib/auth'
import { db } from '@/db'
import { member } from '@/db/schema'

// Contexte partagé par toutes les procédures tRPC. Résout la session Better Auth
// et l'organisation active (le cabinet) du membre connecté. L'organizationId est
// le pivot de l'isolation multi-tenant : les procédures protégées filtrent dessus.
export async function createTRPCContext(opts: { headers: Headers }) {
    const sessionData = await auth.api.getSession({ headers: opts.headers })

    const user = sessionData?.user ?? null
    const session = sessionData?.session ?? null

    // L'organisation active est portée par la session (plugin organization).
    // Fallback : si elle n'est pas encore fixée, on prend la première
    // appartenance du membre — un utilisateur Balise appartient à un cabinet.
    let organizationId = session?.activeOrganizationId ?? null
    if (user && !organizationId) {
        const membership = await db.query.member.findFirst({
            where: eq(member.userId, user.id),
            columns: { organizationId: true },
        })
        organizationId = membership?.organizationId ?? null
    }

    return { db, user, session, organizationId }
}
