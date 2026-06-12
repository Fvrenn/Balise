import { and, asc, eq } from 'drizzle-orm'

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

    const activeOrganizationId = session?.activeOrganizationId ?? null
    const organizationId = user
        ? await resolveOrganizationId(user.id, activeOrganizationId)
        : null

    return { db, user, session, organizationId }
}

// Résout le cabinet courant en garantissant l'appartenance à l'instant T.
// L'organisation active portée par la session n'est retenue que si le membership
// existe toujours (il a pu être révoqué depuis l'ouverture de session) ; sinon on
// bascule sur la plus ancienne appartenance. Retourne null si l'utilisateur
// n'appartient à aucun cabinet — enforceOrgMembership lèvera alors FORBIDDEN.
async function resolveOrganizationId(
    userId: string,
    activeOrganizationId: string | null,
) {
    if (activeOrganizationId) {
        const activeMembership = await db.query.member.findFirst({
            where: and(
                eq(member.userId, userId),
                eq(member.organizationId, activeOrganizationId),
            ),
            columns: { organizationId: true },
        })
        if (activeMembership) {
            return activeMembership.organizationId
        }
    }

    // Plus ancienne appartenance d'abord : résultat déterministe quand le membre
    // appartient à plusieurs cabinets.
    const oldestMembership = await db.query.member.findFirst({
        where: eq(member.userId, userId),
        orderBy: asc(member.createdAt),
        columns: { organizationId: true },
    })
    return oldestMembership?.organizationId ?? null
}
