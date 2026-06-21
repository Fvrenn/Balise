"use client"

import { useState } from "react"
import { Loader2, Send, UserPlus } from "lucide-react"
import { toast } from "sonner"

import { trpc } from "@/trpc/react"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { FormDialog } from "@/components/ui/form-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { TEAM_ROLE_OPTIONS, type TeamRole } from "./roles"

const FORM_ID = "team-invite-form"

export function InviteMemberDialog() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<TeamRole>("auditor")

  const utils = trpc.useUtils()
  const invite = trpc.team.invite.useMutation({
    onSuccess: async (data) => {
      await Promise.all([
        utils.team.list.invalidate(),
        utils.team.listInvitations.invalidate(),
      ])
      toast.success(`Invitation envoyée à ${data.email}`)
      resetForm()
      setOpen(false)
    },
    onError: (error) => {
      toast.error(error.message || "L'envoi de l'invitation a échoué.")
    },
  })

  function resetForm() {
    setEmail("")
    setRole("auditor")
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) resetForm()
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    invite.mutate({ email: email.trim(), role })
  }

  const isSubmitting = invite.isPending

  return (
    <FormDialog
      trigger={
        <Button>
          <UserPlus />
          Inviter un membre
        </Button>
      }
      title="Inviter un membre"
      description="Envoyez une invitation par email à rejoindre votre cabinet."
      open={open}
      onOpenChange={handleOpenChange}
      isLoading={isSubmitting}
      footer={
        <>
          <DialogClose
            render={
              <Button type="button" variant="outline" disabled={isSubmitting} />
            }
          >
            Annuler
          </DialogClose>
          <Button
            type="submit"
            form={FORM_ID}
            disabled={isSubmitting || email.trim().length === 0}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
            Envoyer l&apos;invitation
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="invite-email">
            Adresse email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="invite-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="ex. auditeur@cabinet.fr"
            required
            disabled={isSubmitting}
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="invite-role">Rôle</Label>
          <Select
            items={TEAM_ROLE_OPTIONS}
            value={role}
            onValueChange={(value) => {
              if (value === "owner" || value === "auditor") setRole(value)
            }}
            disabled={isSubmitting}
          >
            <SelectTrigger id="invite-role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TEAM_ROLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </form>
    </FormDialog>
  )
}
