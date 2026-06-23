"use client"

import { ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { AssigneeSelect } from "@/components/ui/assignee-select"

interface MemberOption {
  userId: string
  name: string
  email: string
}

interface AssigneeMultiSelectProps {
  id?: string
  members: MemberOption[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  currentUserId?: string
  disabled?: boolean
  isLoading?: boolean
}

// Sélecteur multiple d'auditeurs : un popover de cases à cocher. Au moins un auditeur
// doit rester coché — on bloque la dernière décoche avec un message. Le libellé du
// bouton résume la sélection (noms, ou nombre au-delà de deux).
export function AssigneeMultiSelect({
  id,
  members,
  selectedIds,
  onChange,
  currentUserId,
  disabled,
  isLoading,
}: AssigneeMultiSelectProps) {
  const selectedCount = selectedIds.length

  function labelFor(member: MemberOption) {
    return member.userId === currentUserId ? `${member.name} (moi)` : member.name
  }

  function summary() {
    if (isLoading) return "Chargement…"
    if (selectedCount === 0) return "Sélectionnez un auditeur"
    const selected = members.filter((member) =>
      selectedIds.includes(member.userId),
    )
    if (selected.length <= 2) {
      return selected.map(labelFor).join(", ")
    }
    return `${selected.length} auditeurs sélectionnés`
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            id={id}
            disabled={disabled}
            className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span
              className={cn(
                "truncate",
                selectedCount === 0 && "text-muted-foreground",
              )}
            >
              {summary()}
            </span>
            <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
          </button>
        }
      />
      <PopoverContent align="start" className="w-(--anchor-width) min-w-72 p-1">
        {members.length === 0 ? (
          <p className="px-2 py-1.5 text-sm text-muted-foreground">
            Aucun membre disponible.
          </p>
        ) : (
          <AssigneeSelect
            members={members}
            value={selectedIds}
            onChange={onChange}
            currentUserId={currentUserId}
            disabled={disabled}
          />
        )}
      </PopoverContent>
    </Popover>
  )
}
