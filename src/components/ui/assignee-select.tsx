"use client"

import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

export interface AssigneeOption {
  userId: string
  name: string
  email: string
}

interface AssigneeSelectProps {
  members: AssigneeOption[]
  value: string[]
  onChange: (userIds: string[]) => void
  disabled?: boolean
  // Marque l'utilisateur courant d'un « (moi) » — préserve l'affichage du formulaire
  // de création d'audit. Sans valeur, aucun membre n'est marqué.
  currentUserId?: string
  // Classes du conteneur, selon l'enveloppe de l'appelant (padding du popover…).
  className?: string
}

// Règle métier : un audit reste toujours assigné à au moins une personne. La
// dernière décoche est bloquée avec un message unique, partagé par tous les
// appelants (cellule du tableau, formulaire de création).
const MIN_ASSIGNEES_MESSAGE = "Au moins un auditeur doit rester assigné."

// Liste contrôlée des membres du cabinet, une case par personne. Ne gère ni le
// Popover ni la mutation tRPC : l'appelant l'enveloppe selon son contexte et réagit
// à onChange. Garantit la règle « au moins un assigné ».
export function AssigneeSelect({
  members,
  value,
  onChange,
  disabled,
  currentUserId,
  className,
}: AssigneeSelectProps) {
  function toggle(userId: string, checked: boolean) {
    if (!checked) {
      if (value.length <= 1) {
        toast.error(MIN_ASSIGNEES_MESSAGE)
        return
      }
      onChange(value.filter((id) => id !== userId))
      return
    }
    onChange(value.includes(userId) ? value : [...value, userId])
  }

  return (
    <div className={cn("max-h-64 overflow-y-auto", className)}>
      {members.map((person) => (
        <label
          key={person.userId}
          className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-accent"
        >
          <Checkbox
            checked={value.includes(person.userId)}
            onCheckedChange={(checked) => toggle(person.userId, checked)}
            disabled={disabled}
          />
          <span className="flex flex-col leading-tight">
            <span className="text-sm text-foreground">
              {person.name}
              {person.userId === currentUserId ? " (moi)" : null}
            </span>
            <span className="text-xs text-muted-foreground">{person.email}</span>
          </span>
        </label>
      ))}
    </div>
  )
}
