import { and, eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'

import type { Database } from '@/db'
import { auditFindings, audits } from '@/db/schema'

// Barrières multi-tenant des audits : chaque procédure qui reçoit un id d'audit
// ou de finding doit prouver qu'il appartient au cabinet courant avant d'agir.
// On répond NOT_FOUND (et pas FORBIDDEN) pour ne pas révéler l'existence d'une
// ressource d'un autre cabinet.

// Garantit qu'un audit appartient au cabinet courant, sinon NOT_FOUND.
export async function assertAuditInOrg(
    db: Database,
    auditId: string,
    organizationId: string,
): Promise<void> {
    const audit = await db.query.audits.findFirst({
        where: and(
            eq(audits.id, auditId),
            eq(audits.organizationId, organizationId),
        ),
        columns: { id: true },
    })
    if (!audit) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Audit introuvable.' })
    }
}

// Garantit qu'un finding appartient bien à un audit du cabinet courant. Retourne
// l'auditId associé, ou lève NOT_FOUND (pas de fuite inter-cabinets).
export async function assertFindingInOrg(
    db: Database,
    findingId: string,
    organizationId: string,
): Promise<string> {
    const [row] = await db
        .select({ auditId: auditFindings.auditId })
        .from(auditFindings)
        .innerJoin(audits, eq(auditFindings.auditId, audits.id))
        .where(
            and(
                eq(auditFindings.id, findingId),
                eq(audits.organizationId, organizationId),
            ),
        )
        .limit(1)
    if (!row) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Finding introuvable.' })
    }
    return row.auditId
}
