"use client"

import { useMemo, useState, type ComponentProps } from "react"
import { Check, Loader2, Search, Trash2, X } from "lucide-react"
import { toast } from "sonner"

import { SERVER_DATA_STALE_TIME, trpc } from "@/trpc/react"
import { HeaderActions } from "@/components/header-slot"
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
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "@/components/ui/data-table"
import { createRelativeDate } from "@/components/ui/data-table-cells"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { ColumnDef } from "@tanstack/react-table"
import type { RouterOutputs } from "@/trpc/types"

type AdminUser = RouterOutputs["admin"]["listUsers"][number]
type DerivedRole = "admin" | "owner" | "auditor"
type RoleFilter = "all" | DerivedRole
type BadgeVariant = ComponentProps<typeof Badge>["variant"]

const ROLE_FILTER_OPTIONS: { value: RoleFilter; label: string }[] = [
  { value: "all", label: "Tous les rôles" },
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

// Rôle effectif d'un utilisateur sur la plateforme. L'Admin Balise prime sur toute
// appartenance ; sinon on lit le rôle de cabinet ; null pour un compte sans
// rattachement (Owner en attente d'onboarding).
function derivedRole(user: AdminUser): DerivedRole | null {
  if (user.isAdmin) return "admin"
  if (user.role === "owner" || user.role === "auditor") return user.role
  return null
}

export function UsersView({
  initialUsers,
  currentUserId,
}: {
  initialUsers: AdminUser[]
  currentUserId: string
}) {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all")
  const [withoutCabinetOnly, setWithoutCabinetOnly] = useState(false)

  // Semé côté serveur (aucun skeleton au montage) mais conservé en requête : la
  // suppression invalide la liste et la vue se rafraîchit seule.
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
      if (roleFilter !== "all" && derivedRole(user) !== roleFilter) return false
      if (withoutCabinetOnly && user.organizationName !== null) return false
      return true
    })
  }, [usersQuery.data, search, roleFilter, withoutCabinetOnly])

  const columns = useMemo<ColumnDef<AdminUser>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nom",
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
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.email}</span>
        ),
      },
      {
        id: "cabinet",
        header: "Cabinet",
        cell: ({ row }) => <CabinetCell user={row.original} />,
      },
      {
        id: "role",
        header: "Rôle",
        cell: ({ row }) => <RoleCell user={row.original} />,
      },
      {
        accessorKey: "emailVerified",
        header: "Email vérifié",
        cell: ({ row }) => (
          <EmailVerifiedCell verified={row.original.emailVerified} />
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Membre depuis",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {createRelativeDate(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: "actions",
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
      <HeaderActions>
        <div className="relative w-64">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher par nom ou email…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="bg-surface pl-8"
          />
        </div>

        <Select
          items={ROLE_FILTER_OPTIONS}
          value={roleFilter}
          onValueChange={(value) => setRoleFilter(value as RoleFilter)}
        >
          <SelectTrigger className="w-44 bg-surface">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLE_FILTER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Label className="flex cursor-pointer items-center gap-2 font-normal text-muted-foreground">
          <Checkbox
            checked={withoutCabinetOnly}
            onCheckedChange={(checked) =>
              setWithoutCabinetOnly(checked === true)
            }
          />
          Sans cabinet
        </Label>
      </HeaderActions>

      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Utilisateurs
        </h1>
        <p className="text-sm text-muted-foreground">
          Tous les comptes de la plateforme, cabinets et administrateurs
          confondus.
        </p>
      </div>

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

// Suppression réservée aux comptes non protégés : ni soi-même, ni un autre Admin
// Balise (mêmes garde-fous côté serveur dans admin.deleteUser).
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
