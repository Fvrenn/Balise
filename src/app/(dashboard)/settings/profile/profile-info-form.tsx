"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { trpc } from "@/trpc/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function ProfileInfoForm({
  initialName,
  email,
}: {
  initialName: string
  email: string
}) {
  const utils = trpc.useUtils()

  const [name, setName] = useState(initialName)
  // Référence du nom enregistré : « Enregistrer » ne s'active qu'en cas de
  // changement réel.
  const [savedName, setSavedName] = useState(initialName)

  const update = trpc.user.updateProfile.useMutation({
    onSuccess: async (data) => {
      setSavedName(data.name)
      // Le nom est affiché ailleurs (sidebar, fil d'Ariane) via member.current :
      // on rafraîchit ces lectures pour qu'elles reflètent le nouveau nom.
      await Promise.all([
        utils.user.getProfile.invalidate(),
        utils.member.current.invalidate(),
      ])
      toast.success("Profil mis à jour.")
    },
    onError: (error) =>
      toast.error(error.message || "L'enregistrement a échoué."),
  })

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    update.mutate({ name: name.trim() })
  }

  const isSubmitting = update.isPending
  const isDirty = name.trim() !== savedName

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="block h-5 w-[3px] shrink-0 rounded-sm bg-primary" />
            <h2 className="font-heading text-base font-semibold text-foreground">
              Informations personnelles
            </h2>
          </div>

          <Field>
            <FieldLabel htmlFor="profile-name">
              Nom complet <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="profile-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              maxLength={200}
              autoComplete="name"
              disabled={isSubmitting}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="profile-email">Email</FieldLabel>
            <Input id="profile-email" type="email" value={email} disabled />
            <FieldDescription>
              Contactez votre administrateur pour changer d&apos;email.
            </FieldDescription>
          </Field>
        </CardContent>

        <CardFooter className="justify-end border-t border-border">
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty || name.trim().length === 0}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : null}
            Enregistrer
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
