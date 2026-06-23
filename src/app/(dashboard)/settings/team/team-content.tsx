"use client"

import { SERVER_DATA_STALE_TIME, trpc } from "@/trpc/react"

import type { RouterOutputs } from "@/trpc/types"
import { MembersTable } from "./members-table"
import { PendingInvitations } from "./pending-invitations"

interface TeamContentProps {
  currentUserId: string
  initialMembers: RouterOutputs["team"]["list"]
  initialInvitations: RouterOutputs["team"]["listInvitations"]
}

// Membres et invitations sont semés côté serveur (aucun skeleton au montage) mais
// restent des requêtes : les mutations (invitation, rôle, retrait, annulation) les
// invalident et la vue se rafraîchit seule.
export function TeamContent({
  currentUserId,
  initialMembers,
  initialInvitations,
}: TeamContentProps) {
  const membersQuery = trpc.team.list.useQuery(undefined, {
    initialData: initialMembers,
    staleTime: SERVER_DATA_STALE_TIME,
  })
  const invitationsQuery = trpc.team.listInvitations.useQuery(undefined, {
    initialData: initialInvitations,
    staleTime: SERVER_DATA_STALE_TIME,
  })

  return (
    <div className="space-y-8">
      <MembersTable members={membersQuery.data} currentUserId={currentUserId} />
      <PendingInvitations invitations={invitationsQuery.data} />
    </div>
  )
}
