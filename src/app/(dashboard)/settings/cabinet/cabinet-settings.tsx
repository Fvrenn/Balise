"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { trpc } from "@/trpc/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import type { RouterOutputs } from "@/trpc/types"
import { LogoField } from "./logo-field"

type Cabinet = RouterOutputs["cabinet"]["get"]

export function CabinetSettings({
  initialCabinet,
}: {
  initialCabinet: Cabinet
}) {
  const utils = trpc.useUtils()
  // initialData = snapshot rendu côté serveur ; le logo se rafraîchit ensuite via
  // l'invalidation déclenchée par LogoField après un upload.
  const { data: cabinet } = trpc.cabinet.get.useQuery(undefined, {
    initialData: initialCabinet,
  })

  const [name, setName] = useState(initialCabinet.name)
  const [website, setWebsite] = useState(initialCabinet.website ?? "")
  const [contactEmail, setContactEmail] = useState(
    initialCabinet.contactEmail ?? "",
  )
  // Référence des valeurs enregistrées : sert à n'activer « Enregistrer » que
  // lorsqu'un champ texte a réellement changé.
  const [saved, setSaved] = useState({
    name: initialCabinet.name,
    website: initialCabinet.website ?? "",
    contactEmail: initialCabinet.contactEmail ?? "",
  })

  const update = trpc.cabinet.update.useMutation({
    onSuccess: async (data) => {
      await utils.cabinet.get.invalidate()
      setSaved({
        name: data.name,
        website: data.website ?? "",
        contactEmail: data.contactEmail ?? "",
      })
      toast.success("Modifications enregistrées.")
    },
    onError: (error) =>
      toast.error(error.message || "L'enregistrement a échoué."),
  })

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    update.mutate({
      name: name.trim(),
      website: website.trim(),
      contactEmail: contactEmail.trim(),
    })
  }

  const isSubmitting = update.isPending
  const isDirty =
    name.trim() !== saved.name ||
    website.trim() !== saved.website ||
    contactEmail.trim() !== saved.contactEmail

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="block h-5 w-[3px] shrink-0 rounded-sm bg-primary" />
            <h2 className="font-heading text-base font-semibold text-foreground">
              Identité du cabinet
            </h2>
          </div>

          <LogoField logo={cabinet.logo} />

          <Field>
            <FieldLabel htmlFor="cabinet-name">
              Nom du cabinet <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="cabinet-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              maxLength={200}
              disabled={isSubmitting}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="cabinet-website">
              Site web du cabinet
            </FieldLabel>
            <Input
              id="cabinet-website"
              type="url"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              placeholder="https://www.cabinet.fr"
              disabled={isSubmitting}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="cabinet-email">Email de contact</FieldLabel>
            <Input
              id="cabinet-email"
              type="email"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
              placeholder="contact@cabinet.fr"
              disabled={isSubmitting}
            />
            <FieldDescription>
              Utilisé plus tard dans les déclarations d&apos;accessibilité.
            </FieldDescription>
          </Field>
        </CardContent>

        <CardFooter className="flex-wrap justify-between gap-4 border-t border-border">
          <p className="max-w-sm text-xs text-muted-foreground">
            Le logo et le nom du cabinet apparaîtront sur vos rapports
            d&apos;audit et documents générés.
          </p>
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty || name.trim().length === 0}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : null}
            Enregistrer les modifications
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
