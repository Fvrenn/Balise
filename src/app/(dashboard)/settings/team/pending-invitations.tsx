"use client"

import { Clock, Loader2, Mail, X } from "lucide-react"
import { toast } from "sonner"

import { trpc } from "@/trpc/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createDateCell } from "@/components/ui/data-table-cells"

import type { RouterOutputs } from "@/trpc/types"
import { teamRoleLabel } from "./roles"

type PendingInvitation = RouterOutputs["team"]["listInvitations"][number]

export function PendingInvitations({
  invitations,
}: {
  invitations: PendingInvitation[]
}) {
  const utils = trpc.useUtils()
  const cancelInvitation = trpc.team.cancelInvitation.useMutation({
    onSuccess: async () => {
      await utils.team.listInvitations.invalidate()
      toast.success("Invitation annulée.")
    },
    onError: (error) =>
      toast.error(error.message || "L'annulation de l'invitation a échoué."),
  })

  // Section absente tant qu'aucune invitation n'est en attente.
  if (invitations.length === 0) return null

  return (
    <section className="space-y-3">
      <h2 className="font-heading text-lg font-semibold text-foreground">
        Invitations en attente
      </h2>
      <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
        {invitations.map((invitation) => {
          const isCanceling =
            cancelInvitation.isPending &&
            cancelInvitation.variables?.invitationId === invitation.id
          return (
            <li
              key={invitation.id}
              className="flex items-center gap-4 px-4 py-3"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Mail className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {invitation.email}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3 shrink-0" />
                  Expire le {createDateCell(invitation.expiresAt)}
                </p>
              </div>
              <Badge variant="secondary">
                {teamRoleLabel(invitation.role)}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                disabled={isCanceling}
                onClick={() =>
                  cancelInvitation.mutate({ invitationId: invitation.id })
                }
              >
                {isCanceling ? <Loader2 className="animate-spin" /> : <X />}
                Annuler
              </Button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
