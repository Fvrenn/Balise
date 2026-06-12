"use client"

import { useState } from "react"
import { Loader2, Plus } from "lucide-react"
import { toast } from "sonner"

import { trpc } from "@/trpc/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ClientCreateDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [website, setWebsite] = useState("")
  const [contact, setContact] = useState("")

  const utils = trpc.useUtils()
  const createClient = trpc.clients.create.useMutation({
    onSuccess: async () => {
      await utils.clients.list.invalidate()
      toast.success("Client créé.")
      setOpen(false)
    },
    onError: (error) => {
      toast.error(error.message || "La création du client a échoué.")
    },
  })

  function resetForm() {
    setName("")
    setWebsite("")
    setContact("")
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) resetForm()
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    createClient.mutate({
      name: name.trim(),
      website: website.trim() || undefined,
      contact: contact.trim() || undefined,
    })
  }

  const isSubmitting = createClient.isPending

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>
        <Plus />
        Nouveau client
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau client</DialogTitle>
          <DialogDescription>
            Ajoutez une entreprise à auditer pour votre cabinet.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client-name">Nom</Label>
            <Input
              id="client-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nom de l'entreprise"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-website">Site web</Label>
            <Input
              id="client-website"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              placeholder="exemple.fr"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-contact">Contact</Label>
            <Input
              id="client-contact"
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder="Nom ou e-mail du contact (usage interne)"
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline" disabled={isSubmitting} />
              }
            >
              Annuler
            </DialogClose>
            <Button type="submit" disabled={isSubmitting || name.trim().length === 0}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              Créer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
