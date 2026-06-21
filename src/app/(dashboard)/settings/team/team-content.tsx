"use client"

import { trpc } from "@/trpc/react"

import { MembersTable } from "./members-table"
import { PendingInvitations } from "./pending-invitations"

// Charge membres et invitations côté client : les mutations (invitation, rôle,
// retrait, annulation) invalident ces requêtes et la vue se rafraîchit seule.
export function TeamContent({ currentUserId }: { currentUserId: string }) {
  const membersQuery = trpc.team.list.useQuery()
  const invitationsQuery = trpc.team.listInvitations.useQuery()

  return (
    <div className="space-y-8">
      <MembersTable
        members={membersQuery.data ?? []}
        currentUserId={currentUserId}
        isLoading={membersQuery.isLoading}
      />
      <PendingInvitations invitations={invitationsQuery.data ?? []} />
    </div>
  )
}
