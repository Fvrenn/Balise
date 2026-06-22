import { and, asc, eq, inArray } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'

import type { Database } from '@/db'
import {
    auditAssignees,
    member,
    user,
    type NewAuditAssignee,
} from '@/db/schema'

// Forme exposée d'un assigné : le strict nécessaire pour l'affichage (badge, liste
// au survol) et la pré-sélection des cases. Toujours trié par assignedAt croissant,
// donc le premier élément est le plus ancien assigné, de façon stable.
export type AssigneeSummary = { userId: string; name: string; email: string }

// Récupère les assignés de plusieurs audits en une requête, regroupés par audit et
// ordonnés du plus ancien au plus récent (assignedAt, puis id pour départager les
// ex æquo créés dans la même transaction). Évite un N+1 lorsqu'on liste les audits.
export async function getAssigneesByAudit(
    db: Database,
    auditIds: string[],
): Promise<Map<string, AssigneeSummary[]>> {
    const byAudit = new Map<string, AssigneeSummary[]>()
    if (auditIds.length === 0) return byAudit

    const rows = await db
        .select({
            auditId: auditAssignees.auditId,
            userId: auditAssignees.userId,
            name: user.name,
            email: user.email,
        })
        .from(auditAssignees)
        .innerJoin(user, eq(auditAssignees.userId, user.id))
        .where(inArray(auditAssignees.auditId, auditIds))
        .orderBy(asc(auditAssignees.assignedAt), asc(auditAssignees.id))

    for (const row of rows) {
        const list = byAudit.get(row.auditId) ?? []
        list.push({ userId: row.userId, name: row.name, email: row.email })
        byAudit.set(row.auditId, list)
    }
    return byAudit
}

// Garantit que chaque userId est bien membre du cabinet : pas d'assignation hors
// cabinet. Lève BAD_REQUEST si l'un d'eux n'en fait pas partie.
export async function assertMembersInOrg(
    db: Database,
    organizationId: string,
    userIds: string[],
): Promise<void> {
    const rows = await db
        .select({ userId: member.userId })
        .from(member)
        .where(
            and(
                eq(member.organizationId, organizationId),
                inArray(member.userId, userIds),
            ),
        )
    const found = new Set(rows.map((row) => row.userId))
    if (userIds.some((id) => !found.has(id))) {
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "Un auditeur assigné n'appartient pas au cabinet.",
        })
    }
}

// Construit les lignes d'assignation à insérer. assignedAt est décalé d'une
// milliseconde par position pour encoder l'ordre de sélection : le premier id de la
// liste reste « le premier » assigné une fois trié par assignedAt croissant.
export function buildAssigneeRows(
    auditId: string,
    userIds: string[],
): NewAuditAssignee[] {
    const baseTime = Date.now()
    return userIds.map((userId, index) => ({
        auditId,
        userId,
        assignedAt: new Date(baseTime + index),
    }))
}
