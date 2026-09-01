"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

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

import { PAGE_TYPE_OPTIONS, type SamplePageType } from "./page-types"

// Modale unique pour l'ajout et l'édition d'une page de l'échantillon : les
// deux formulaires portent exactement les mêmes champs, seul le libellé change.

const FORM_ID = "sample-page-form"

export interface SamplePageDraft {
  label: string
  url: string
  type: SamplePageType
}

const EMPTY_DRAFT: SamplePageDraft = { label: "", url: "", type: "mandatory" }

export function PageFormDialog({
  open,
  mode,
  initialValue,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  mode: "create" | "edit"
  initialValue?: SamplePageDraft
  isSubmitting: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (draft: SamplePageDraft) => void
}) {
  const [draft, setDraft] = useState<SamplePageDraft>(EMPTY_DRAFT)

  // À chaque ouverture, on repart de la page visée (ou d'un formulaire vide) :
  // la saisie précédente ne doit pas fuiter d'une page à l'autre.
  useEffect(() => {
    if (open) setDraft(initialValue ?? EMPTY_DRAFT)
  }, [open, initialValue])

  const isValid = draft.label.trim() !== "" && draft.url.trim() !== ""

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isValid) return
    onSubmit({
      label: draft.label.trim(),
      url: draft.url.trim(),
      type: draft.type,
    })
  }

  return (
    <FormDialog
      title={mode === "create" ? "Ajouter une page" : "Modifier la page"}
      description={
        mode === "create"
          ? "La page rejoint l'échantillon avec les 106 critères à renseigner."
          : "Le travail déjà saisi sur cette page est conservé."
      }
      open={open}
      onOpenChange={onOpenChange}
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
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            {mode === "create" ? "Ajouter la page" : "Enregistrer"}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="sample-page-label">
            Libellé <span className="text-destructive">*</span>
          </Label>
          <Input
            id="sample-page-label"
            value={draft.label}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, label: event.target.value }))
            }
            placeholder="ex. Accueil"
            required
            disabled={isSubmitting}
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sample-page-url">
            URL <span className="text-destructive">*</span>
          </Label>
          <Input
            id="sample-page-url"
            value={draft.url}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, url: event.target.value }))
            }
            placeholder="exemple.fr/accueil"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sample-page-type">Type de page</Label>
          <Select
            items={PAGE_TYPE_OPTIONS}
            value={draft.type}
            onValueChange={(value) => {
              if (value) setDraft((prev) => ({ ...prev, type: value }))
            }}
            disabled={isSubmitting}
          >
            <SelectTrigger id="sample-page-type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_TYPE_OPTIONS.map((option) => (
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
