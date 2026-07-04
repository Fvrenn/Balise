"use client"

import { useState, type ComponentProps } from "react"
import { Check, Loader2, Trash2, X } from "lucide-react"
import { toast } from "sonner"

import { trpc } from "@/trpc/react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createRelativeDate } from "@/components/ui/data-table-cells"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

import type { ColumnDef } from "@tanstack/react-table"
import type { RouterOutputs } from "@/trpc/types"

// Colonnes du tableau admin des utilisateurs : cellules (cabinet, rôle, email
// vérifié) et action de suppression avec sa confirmation. La vue (users-view)
// garde la recherche, les filtres et le rendu du tableau.

export type AdminUser = RouterOutputs["admin"]["listUsers"][number]
export type DerivedRole = "admin" | "owner" | "auditor"
type BadgeVariant = ComponentProps<typeof Badge>["variant"]

export const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "owner", label: "Owner" },
  { value: "auditor", label: "Auditeur" },
]

const ROLE_BADGES: Record<DerivedRole, { label: string; variant: BadgeVariant }> =
  {
    admin: { label: "Admin", variant: "default" },
    owner: { label: "Owner", variant: "secondary" },
    auditor: { label: "Auditeur", variant: "outline" },
  }

export function derivedRole(user: AdminUser): DerivedRole | null {
  if (user.isAdmin) return "admin"
  if (user.role === "owner" || user.role === "auditor") return user.role
  return null
}

function CabinetCell({ user }: { user: AdminUser }) {
  if (user.isAdmin) {
    return <Badge variant="default">Admin plateforme</Badge>
  }
  if (user.organizationName) {
    return <span className="text-foreground">{user.organizationName}</span>
  }
  return (
    <Badge variant="outline" className="text-muted-foreground">
      Sans cabinet
    </Badge>
  )
}

function RoleCell({ user }: { user: AdminUser }) {
  const role = derivedRole(user)
  if (!role) return <span className="text-muted-foreground">—</span>
  const badge = ROLE_BADGES[role]
  return <Badge variant={badge.variant}>{badge.label}</Badge>
}

function EmailVerifiedCell({ verified }: { verified: boolean }) {
  if (verified) {
    return (
      <span className="inline-flex items-center text-success">
        <Check className="size-4" />
        <span className="sr-only">Vérifié</span>
      </span>
    )
  }
  return (
    <span className="inline-flex items-center text-destructive">
      <X className="size-4" />
      <span className="sr-only">Non vérifié</span>
    </span>
  )
}

function UserRowActions({
  user,
  currentUserId,
}: {
  user: AdminUser
  currentUserId: string
}) {
  const [open, setOpen] = useState(false)
  const utils = trpc.useUtils()

  const deleteUser = trpc.admin.deleteUser.useMutation({
    onSuccess: async () => {
      await utils.admin.listUsers.invalidate()
      toast.success("Utilisateur supprimé.")
      setOpen(false)
    },
    onError: (error) =>
      toast.error(error.message || "La suppression a échoué."),
  })

  const isProtected = user.id === currentUserId || user.isAdmin
  if (isProtected) {
    return (
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" disabled>
          <Trash2 />
          Supprimer
        </Button>
      </div>
    )
  }

  return (
    <div className="flex justify-end">
      <AlertDialog
        open={open}
        onOpenChange={(next) => {
          if (!deleteUser.isPending) setOpen(next)
        }}
      >
        <AlertDialogTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            />
          }
        >
          <Trash2 />
          Supprimer
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet utilisateur ?</AlertDialogTitle>
            <AlertDialogDescription>
              {user.name} ({user.email}) sera définitivement supprimé, ainsi que
              ses sessions, son accès et ses assignations d&apos;audit. Cette
              action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteUser.isPending}>
              Annuler
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={deleteUser.isPending}
              onClick={() => deleteUser.mutate({ userId: user.id })}
            >
              {deleteUser.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Trash2 />
              )}
              Supprimer
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export function createUsersColumns(
  currentUserId: string,
): ColumnDef<AdminUser>[] {
  return [
    {
      id: "name",
      accessorKey: "name",
      enableSorting: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nom" />
      ),
      cell: ({ row }) => (
        <span className="font-medium text-foreground">
          {row.original.name}
          {row.original.id === currentUserId ? (
            <span className="ml-1.5 text-xs font-normal text-muted-foreground">
              (vous)
            </span>
          ) : null}
        </span>
      ),
    },
    {
      id: "email",
      accessorKey: "email",
      enableSorting: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.email}</span>
      ),
    },
    {
      id: "cabinet",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cabinet" />
      ),
      cell: ({ row }) => <CabinetCell user={row.original} />,
    },
    {
      id: "role",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rôle" />
      ),
      cell: ({ row }) => <RoleCell user={row.original} />,
    },
    {
      id: "emailVerified",
      accessorKey: "emailVerified",
      enableSorting: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email vérifié" />
      ),
      cell: ({ row }) => (
        <EmailVerifiedCell verified={row.original.emailVerified} />
      ),
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      enableSorting: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Membre depuis" />
      ),
      sortingFn: (rowA, rowB) =>
        rowA.original.createdAt.getTime() - rowB.original.createdAt.getTime(),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {createRelativeDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "actions",
      enableSorting: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <UserRowActions user={row.original} currentUserId={currentUserId} />
      ),
    },
  ]
}
