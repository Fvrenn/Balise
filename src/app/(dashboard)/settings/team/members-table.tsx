"use client"

import { useMemo, useState } from "react"
import { EllipsisVertical, Loader2, UserCog, UserMinus } from "lucide-react"
import { toast } from "sonner"

import { trpc } from "@/trpc/react"
import { getInitials } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { createRelativeDate } from "@/components/ui/data-table-cells"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { ColumnDef } from "@tanstack/react-table"
import type { RouterOutputs } from "@/trpc/types"
import { teamRoleLabel, type TeamRole } from "./roles"

type TeamMember = RouterOutputs["team"]["list"][number]

interface MembersTableProps {
  members: TeamMember[]
  currentUserId: string
  isLoading: boolean
}

export function MembersTable({
  members,
  currentUserId,
  isLoading,
}: MembersTableProps) {
  const columns = useMemo<ColumnDef<TeamMember>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Membre",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              {row.original.image ? (
                <AvatarImage src={row.original.image} alt={row.original.name} />
              ) : null}
              <AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground">
                {getInitials(row.original.name)}
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold text-foreground">
              {row.original.name}
              {row.original.userId === currentUserId ? (
                <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                  (vous)
                </span>
              ) : null}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.email}</span>
        ),
      },
      {
        accessorKey: "role",
        header: "Rôle",
        cell: ({ row }) => <RoleBadge role={row.original.role} />,
      },
      {
        accessorKey: "joinedAt",
        header: "Membre depuis",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {createRelativeDate(row.original.joinedAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <MemberRowActions
              member={row.original}
              isSelf={row.original.userId === currentUserId}
            />
          </div>
        ),
      },
    ],
    [currentUserId],
  )

  return <DataTable columns={columns} data={members} isLoading={isLoading} />
}

function RoleBadge({ role }: { role: string }) {
  return (
    <Badge variant={role === "owner" ? "default" : "secondary"}>
      {teamRoleLabel(role)}
    </Badge>
  )
}

function MemberRowActions({
  member,
  isSelf,
}: {
  member: TeamMember
  isSelf: boolean
}) {
  const [confirmRemove, setConfirmRemove] = useState(false)
  const utils = trpc.useUtils()

  const updateRole = trpc.team.updateRole.useMutation({
    onSuccess: async () => {
      await utils.team.list.invalidate()
      toast.success("Rôle mis à jour.")
    },
    onError: (error) =>
      toast.error(error.message || "La modification du rôle a échoué."),
  })

  const removeMember = trpc.team.removeMember.useMutation({
    onSuccess: async () => {
      await utils.team.list.invalidate()
      toast.success("Membre retiré du cabinet.")
      setConfirmRemove(false)
    },
    onError: (error) =>
      toast.error(error.message || "Le retrait du membre a échoué."),
  })

  // Un owner ne gère pas son propre accès depuis cette liste (garde aussi côté
  // serveur). On masque donc les actions sur sa propre ligne.
  if (isSelf) {
    return <span className="text-muted-foreground">—</span>
  }

  const nextRole: TeamRole = member.role === "owner" ? "auditor" : "owner"
  const isBusy = updateRole.isPending || removeMember.isPending

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-sm" disabled={isBusy} />}
        >
          <EllipsisVertical />
          <span className="sr-only">Actions sur {member.name}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() =>
              updateRole.mutate({ memberId: member.memberId, role: nextRole })
            }
          >
            <UserCog />
            Changer en {teamRoleLabel(nextRole)}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirmRemove(true)}
          >
            <UserMinus />
            Retirer du cabinet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={confirmRemove}
        onOpenChange={(nextOpen) => {
          if (!removeMember.isPending) setConfirmRemove(nextOpen)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Retirer ce membre ?</DialogTitle>
            <DialogDescription>
              {member.name} perdra l&apos;accès au cabinet. Ses audits déjà
              assignés restent intacts. Vous pourrez le réinviter plus tard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={
                <Button
                  variant="outline"
                  disabled={removeMember.isPending}
                />
              }
            >
              Annuler
            </DialogClose>
            <Button
              variant="destructive"
              disabled={removeMember.isPending}
              onClick={() =>
                removeMember.mutate({ memberId: member.memberId })
              }
            >
              {removeMember.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <UserMinus />
              )}
              Retirer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
