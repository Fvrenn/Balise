// Types de page de l'échantillon, tels que définis par le RGAA : les pages
// obligatoires (accueil, contact, mentions légales…), les gabarits représentatifs
// et les pages ajoutées à l'appréciation de l'auditrice.

export const PAGE_TYPE_OPTIONS = [
  { value: "mandatory", label: "Obligatoire" },
  { value: "template", label: "Gabarit" },
  { value: "additional", label: "Complémentaire" },
] as const

export type SamplePageType = (typeof PAGE_TYPE_OPTIONS)[number]["value"]

export function pageTypeLabel(type: SamplePageType): string {
  return (
    PAGE_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type
  )
}
