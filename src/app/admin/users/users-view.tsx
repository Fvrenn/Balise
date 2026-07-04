"use client"

import { useMemo, useState } from "react"
import { Search, X } from "lucide-react"

import { SERVER_DATA_STALE_TIME, trpc } from "@/trpc/react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { FacetedFilterButton } from "@/components/ui/data-table-faceted-filter"
import { Input } from "@/components/ui/input"

import {
  createUsersColumns,
  derivedRole,
  ROLE_OPTIONS,
  type AdminUser,
  type DerivedRole,
} from "./users-columns"

// Vue admin des utilisateurs : recherche, filtre par rôle et tableau. Les
// colonnes et l'action de suppression vivent dans users-columns.tsx.

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

  const columns = useMemo(
    () => createUsersColumns(currentUserId),
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
