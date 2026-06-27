"use client"

import { useMemo, useState, type ComponentProps } from "react"
import { Check, Loader2, Search, Trash2, X } from "lucide-react"
import { toast } from "sonner"

import { SERVER_DATA_STALE_TIME, trpc } from "@/trpc/react"
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
import { DataTable } from "@/components/ui/data-table"
import { createRelativeDate } from "@/components/ui/data-table-cells"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { FacetedFilterButton } from "@/components/ui/data-table-faceted-filter"
import { Input } from "@/components/ui/input"

import type { ColumnDef } from "@tanstack/react-table"
import type { RouterOutputs } from "@/trpc/types"

type AdminUser = RouterOutputs["admin"]["listUsers"][number]
type DerivedRole = "admin" | "owner" | "auditor"
type BadgeVariant = ComponentProps<typeof Badge>["variant"]

const ROLE_OPTIONS = [
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

function derivedRole(user: AdminUser): DerivedRole | null {
  if (user.isAdmin) return "admin"
  if (user.role === "owner" || user.role === "auditor") return user.role
  return null
}

interface UsersTableToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  roleFilter: DerivedRole[]
  onRoleFilterChange: (value: DerivedRole[]) => void
}

function UsersTableToolbar({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
}: UsersTableToolbarProps) {
  const hasActiveFilters = search.length > 0 || roleFilter.length > 0

  function clearFilters() {
    onSearchChange("")
    onRoleFilterChange([])
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-48 flex-1 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher par nom ou email…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 bg-white pl-9"
        />
      </div>

      <FacetedFilterButton
        title="Rôle"
        options={ROLE_OPTIONS}
        value={roleFilter}
        onChange={(next) => onRoleFilterChange(next as DerivedRole[])}
      />

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-2 text-muted-foreground"
          onClick={clearFilters}
        >
          Réinitialiser
          <X className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

export function UsersView({
  initialUsers,
  currentUserId,
}: {
  initialUsers: AdminUser[]
  currentUserId: string
}) {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<DerivedRole[]>([])

  const usersQuery = trpc.admin.listUsers.useQuery(undefined, {
    initialData: initialUsers,
    staleTime: SERVER_DATA_STALE_TIME,
  })

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase()
    return usersQuery.data.filter((user) => {
      if (
        term &&
        !user.name.toLowerCase().includes(term) &&
        !user.email.toLowerCase().includes(term)
      ) {
        return false
      }
      if (roleFilter.length > 0) {
        const role = derivedRole(user)
        if (!role || !roleFilter.includes(role)) return false
      }
      return true
    })
  }, [usersQuery.data, search, roleFilter])

  const columns = useMemo<ColumnDef<AdminUser>[]>(
    () => [
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
    ],
    [currentUserId],
  )

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Utilisateurs
        </h1>
        <p className="text-sm text-muted-foreground">
          Tous les comptes de la plateforme, cabinets et administrateurs
          confondus.
        </p>
      </div>

      <div className="space-y-4">
        <UsersTableToolbar
          search={search}
          onSearchChange={setSearch}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
        />
        <DataTable
          columns={columns}
          data={filteredUsers}
          isLoading={usersQuery.isLoading}
          emptyState={
            <span className="text-sm text-muted-foreground">
              Aucun utilisateur trouvé
            </span>
          }
        />
      </div>
    </div>
  )
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
