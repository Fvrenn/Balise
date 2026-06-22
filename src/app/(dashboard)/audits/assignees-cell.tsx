"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { trpc } from "@/trpc/react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  AssigneeBadgesInline,
  AssigneeHoverList,
  type AssigneeSummary,
} from "@/components/audit/assignee-badges"

interface AssigneesCellProps {
  auditId: string
  assignees: AssigneeSummary[]
}

const MIN_ASSIGNEES_MESSAGE = "Au moins une personne doit rester assignée."

// Cellule « Assigné à » du tableau des audits. Les badges déclenchent au survol une
// carte récapitulative (HoverCard) et, au clic, un popover d'édition où l'on coche
// les membres du cabinet. La réassignation est ouverte à tout membre du cabinet :
// les audits sont partagés au sein du cabinet (cf. routeur audits, updateAssignees).
export function AssigneesCell({ auditId, assignees }: AssigneesCellProps) {
  const router = useRouter()

  const [editorOpen, setEditorOpen] = useState(false)
  const [hoverOpen, setHoverOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Les membres ne sont chargés qu'à l'ouverture du popover (une seule requête
  // partagée entre les lignes grâce au cache react-query).
  const membersQuery = trpc.team.list.useQuery(undefined, {
    enabled: editorOpen,
  })
  const members = membersQuery.data ?? []

  const updateAssignees = trpc.audits.updateAssignees.useMutation({
    onSuccess: () => {
      toast.success("Assignation mise à jour.")
      setEditorOpen(false)
      // Le tableau est rendu à partir des données serveur : on les rafraîchit pour
      // refléter la nouvelle assignation.
      router.refresh()
    },
    onError: (error) => {
      toast.error(error.message || "La mise à jour de l'assignation a échoué.")
    },
  })

  const currentIds = assignees.map((assignee) => assignee.userId)
  const isDirty =
    selectedIds.length !== currentIds.length ||
    selectedIds.some((id) => !currentIds.includes(id))

  function handleEditorOpenChange(open: boolean) {
    setEditorOpen(open)
    if (open) {
      // Carte au survol et popover d'édition ne s'affichent jamais ensemble.
      setHoverOpen(false)
      // (Re)part de l'assignation courante à chaque ouverture.
      setSelectedIds(currentIds)
    }
  }

  function toggle(userId: string, checked: boolean) {
    if (!checked) {
      if (selectedIds.length <= 1) {
        toast.error(MIN_ASSIGNEES_MESSAGE)
        return
      }
      setSelectedIds((current) => current.filter((id) => id !== userId))
      return
    }
    setSelectedIds((current) =>
      current.includes(userId) ? current : [...current, userId],
    )
  }

  function save() {
    if (selectedIds.length === 0) {
      toast.error(MIN_ASSIGNEES_MESSAGE)
      return
    }
    updateAssignees.mutate({ auditId, assigneeIds: selectedIds })
  }

  return (
    <HoverCard
      open={hoverOpen}
      onOpenChange={(open) => setHoverOpen(open && !editorOpen)}
    >
      <Popover open={editorOpen} onOpenChange={handleEditorOpenChange}>
        <HoverCardTrigger
          render={
            <PopoverTrigger
              render={
                <button
                  type="button"
                  aria-label="Modifier les auditeurs assignés"
                  className="relative z-10 inline-flex w-fit cursor-pointer items-center rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              }
            />
          }
        >
          <AssigneeBadgesInline assignees={assignees} />
        </HoverCardTrigger>

        <HoverCardContent>
          <AssigneeHoverList assignees={assignees} />
        </HoverCardContent>

        <PopoverContent align="start" className="w-72 p-0">
          <p className="px-3 pt-2.5 pb-1.5 text-xs font-medium text-muted-foreground">
            Assigner à
          </p>
          <div className="max-h-64 overflow-y-auto p-1">
            {membersQuery.isLoading ? (
              <p className="px-2 py-1.5 text-sm text-muted-foreground">
                Chargement…
              </p>
            ) : (
              members.map((member) => {
                const checked = selectedIds.includes(member.userId)
                return (
                  <label
                    key={member.userId}
                    className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-accent"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(value) => toggle(member.userId, value)}
                      disabled={updateAssignees.isPending}
                    />
                    <span className="flex flex-col leading-tight">
                      <span className="text-sm text-foreground">
                        {member.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {member.email}
                      </span>
                    </span>
                  </label>
                )
              })
            )}
          </div>
          <div className="border-t border-border p-1.5">
            <Button
              size="sm"
              className="w-full"
              onClick={save}
              disabled={updateAssignees.isPending || !isDirty}
            >
              {updateAssignees.isPending ? (
                <Loader2 className="animate-spin" />
              ) : null}
              Enregistrer
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </HoverCard>
  )
}
