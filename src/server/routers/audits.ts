import { and, asc, desc, eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { protectedProcedure, router } from '@/server/trpc'
import {
    auditFindings,
    auditPages,
    audits,
    clients,
    member,
    pageType,
    rgaaCriteria,
    user,
} from '@/db/schema'

const samplePageInput = z.object({
    label: z.string().trim().min(1, 'Le libellé est obligatoire.').max(200),
    url: z.string().trim().min(1, "L'URL de la page est obligatoire.").max(2000),
    type: z.enum(pageType.enumValues),
})

const createAuditInput = z.object({
    clientId: z.string().min(1),
    name: z.string().trim().min(1, "Le nom de l'audit est obligatoire.").max(200),
    siteUrl: z.string().trim().min(1, "L'URL du site est obligatoire.").max(2000),
    // Optionnel : par défaut l'audit revient à l'auteur (voir create).
    assignedToId: z.string().min(1).optional(),
    contactName: z.string().trim().max(200).optional(),
    contactEmail: z.string().trim().email('Email du référent invalide.').optional(),
    pages: z.array(samplePageInput).min(1, 'Ajoutez au moins une page à auditer.'),
})

export const auditsRouter = router({
    // Tous les audits du cabinet, du plus récemment modifié au plus ancien, avec le
    // nom du client (toujours présent) et celui de l'auditeur assigné (facultatif).
    list: protectedProcedure.query(({ ctx }) => {
        return ctx.db
            .select({
                id: audits.id,
                name: audits.name,
                siteUrl: audits.siteUrl,
                status: audits.status,
                complianceRate: audits.complianceRate,
                createdAt: audits.createdAt,
                updatedAt: audits.updatedAt,
                clientName: clients.name,
                assignedToName: user.name,
            })
            .from(audits)
            .innerJoin(clients, eq(audits.clientId, clients.id))
            .leftJoin(user, eq(audits.assignedToId, user.id))
            .where(eq(audits.organizationId, ctx.organizationId))
            .orderBy(desc(audits.updatedAt))
    }),

    // Audit complet du cabinet courant avec ses pages d'échantillon (ordonnées). Le
    // filtre sur organizationId garantit qu'aucun audit d'un autre cabinet ne fuite
    // (sinon NOT_FOUND).
    getById: protectedProcedure
        .input(z.object({ id: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
            const audit = await ctx.db.query.audits.findFirst({
                where: and(
                    eq(audits.id, input.id),
                    eq(audits.organizationId, ctx.organizationId),
                ),
                with: {
                    pages: {
                        orderBy: (fields, operators) => [
                            operators.asc(fields.sortOrder),
                        ],
                    },
                },
            })
            if (!audit) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Audit introuvable.',
                })
            }
            return audit
        }),

    // Membres du cabinet courant pour alimenter le sélecteur « Assigné à ».
    listMembers: protectedProcedure.query(({ ctx }) => {
        return ctx.db
            .select({
                userId: member.userId,
                name: user.name,
                email: user.email,
                role: member.role,
            })
            .from(member)
            .innerJoin(user, eq(member.userId, user.id))
            .where(eq(member.organizationId, ctx.organizationId))
            .orderBy(asc(user.name))
    }),

    create: protectedProcedure
        .input(createAuditInput)
        .mutation(async ({ ctx, input }) => {
            // Le client doit appartenir au cabinet courant.
            const client = await ctx.db.query.clients.findFirst({
                where: and(
                    eq(clients.id, input.clientId),
                    eq(clients.organizationId, ctx.organizationId),
                ),
                columns: { id: true },
            })
            if (!client) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Client introuvable.',
                })
            }

            // À défaut, l'audit revient à l'auteur. Un auditeur explicite doit être
            // membre du cabinet — pas d'assignation hors cabinet.
            const assignedToId = input.assignedToId ?? ctx.user.id
            if (input.assignedToId && input.assignedToId !== ctx.user.id) {
                const assignee = await ctx.db.query.member.findFirst({
                    where: and(
                        eq(member.userId, input.assignedToId),
                        eq(member.organizationId, ctx.organizationId),
                    ),
                    columns: { id: true },
                })
                if (!assignee) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: "L'auditeur assigné n'appartient pas au cabinet.",
                    })
                }
            }

            // Tout ou rien : l'audit, ses pages d'échantillon et un finding « pending »
            // par critère RGAA sont créés dans une seule transaction. Si une étape
            // échoue — notamment un référentiel RGAA non initialisé — rien n'est
            // persisté (rollback complet).
            return ctx.db.transaction(async (tx) => {
                const [audit] = await tx
                    .insert(audits)
                    .values({
                        organizationId: ctx.organizationId,
                        clientId: input.clientId,
                        assignedToId,
                        name: input.name,
                        siteUrl: input.siteUrl,
                        contactName: input.contactName || null,
                        contactEmail: input.contactEmail || null,
                    })
                    .returning()
                if (!audit) {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: "La création de l'audit a échoué.",
                    })
                }

                await tx.insert(auditPages).values(
                    input.pages.map((page, index) => ({
                        auditId: audit.id,
                        label: page.label,
                        url: page.url,
                        type: page.type,
                        sortOrder: index,
                    })),
                )

                const criteria = await tx
                    .select({ id: rgaaCriteria.id })
                    .from(rgaaCriteria)
                if (criteria.length === 0) {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message:
                            "Référentiel RGAA non initialisé : impossible de créer l'audit.",
                    })
                }

                await tx.insert(auditFindings).values(
                    criteria.map((criterion) => ({
                        auditId: audit.id,
                        criterionId: criterion.id,
                    })),
                )

                return audit
            })
        }),
})
