import { and, count, desc, eq, inArray, ne } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { protectedProcedure, router } from '@/server/trpc'
import { auditFindings, auditPages, scanRuns } from '@/db/schema'
import { assertAuditInOrg } from '@/server/audit-guards'
import { addScanJob } from '@/worker/queue'

// Lancement et suivi du scanner automatique de critères. Le scan lui-même tourne
// dans le worker BullMQ (src/worker/) : ici on ne fait que créer le scan_run,
// pousser le job et exposer l'état courant.

export const scanRouter = router({
    // Démarre un scan pour un audit du cabinet. Si des findings ont déjà été
    // renseignés et que l'appelant n'a pas encore choisi quoi en faire
    // (overwriteExisting absent), on ne lance rien : on renvoie le détail pour que
    // le frontend affiche la modale de confirmation.
    start: protectedProcedure
        .input(
            z.object({
                auditId: z.string().min(1),
                // Restreint le scan à une page de l'échantillon ; absent = toutes.
                pageId: z.string().min(1).optional(),
                overwriteExisting: z.boolean().optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            await assertAuditInOrg(ctx.db, input.auditId, ctx.organizationId)

            const activeRun = await ctx.db.query.scanRuns.findFirst({
                where: and(
                    eq(scanRuns.auditId, input.auditId),
                    inArray(scanRuns.status, ['pending', 'running']),
                ),
                columns: { id: true },
            })
            if (activeRun) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: 'Un scan est déjà en cours pour cet audit.',
                })
            }

            // Le scan mono-page doit viser une page de CET audit (une page d'un
            // autre audit ne compterait zéro page qu'au moment du job : on refuse
            // dès maintenant).
            if (input.pageId) {
                const page = await ctx.db.query.auditPages.findFirst({
                    where: and(
                        eq(auditPages.id, input.pageId),
                        eq(auditPages.auditId, input.auditId),
                    ),
                    columns: { id: true },
                })
                if (!page) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Page d’échantillon introuvable.',
                    })
                }
            }

            // Findings déjà renseignés (tout sauf « pending ») sur le périmètre
            // scanné : ils seraient potentiellement écrasés, l'utilisateur tranche.
            if (input.overwriteExisting === undefined) {
                const findingConditions = [
                    eq(auditFindings.auditId, input.auditId),
                    ne(auditFindings.status, 'pending'),
                ]
                if (input.pageId) {
                    findingConditions.push(
                        eq(auditFindings.pageId, input.pageId),
                    )
                }
                const filledDetails = await ctx.db
                    .select({
                        criterionId: auditFindings.criterionId,
                        pageLabel: auditPages.label,
                        status: auditFindings.status,
                    })
                    .from(auditFindings)
                    .innerJoin(
                        auditPages,
                        eq(auditFindings.pageId, auditPages.id),
                    )
                    .where(and(...findingConditions))
                    .orderBy(auditPages.sortOrder, auditFindings.criterionId)
                if (filledDetails.length > 0) {
                    return {
                        requiresConfirmation: true as const,
                        filledCount: filledDetails.length,
                        filledDetails,
                    }
                }
            }

            const [{ pagesTotal }] = await ctx.db
                .select({ pagesTotal: count() })
                .from(auditPages)
                .where(
                    input.pageId
                        ? and(
                              eq(auditPages.auditId, input.auditId),
                              eq(auditPages.id, input.pageId),
                          )
                        : eq(auditPages.auditId, input.auditId),
                )
            if (!pagesTotal) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message:
                        'Cet audit n’a aucune page d’échantillon à scanner.',
                })
            }

            const [scanRun] = await ctx.db
                .insert(scanRuns)
                .values({
                    auditId: input.auditId,
                    pageId: input.pageId ?? null,
                    overwrite: input.overwriteExisting ?? false,
                    pagesTotal,
                })
                .returning({ id: scanRuns.id })
            if (!scanRun) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'La création du scan a échoué.',
                })
            }

            await addScanJob({
                auditId: input.auditId,
                scanRunId: scanRun.id,
                overwriteExisting: input.overwriteExisting ?? false,
                pageId: input.pageId,
            })

            return {
                requiresConfirmation: false as const,
                scanRunId: scanRun.id,
            }
        }),

    // Dernier scan_run de l'audit : permet à l'UI de retrouver un scan en cours
    // après un rechargement de page (et d'afficher son avancement).
    getStatus: protectedProcedure
        .input(z.object({ auditId: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
            await assertAuditInOrg(ctx.db, input.auditId, ctx.organizationId)

            const lastRun = await ctx.db.query.scanRuns.findFirst({
                where: eq(scanRuns.auditId, input.auditId),
                orderBy: desc(scanRuns.createdAt),
                columns: {
                    id: true,
                    status: true,
                    pageId: true,
                    pagesDone: true,
                    pagesTotal: true,
                    error: true,
                    startedAt: true,
                    finishedAt: true,
                },
            })
            return lastRun ?? null
        }),
})
