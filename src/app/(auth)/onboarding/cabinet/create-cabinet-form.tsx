"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ImageIcon, Loader2, Upload } from "lucide-react"
import { toast } from "sonner"

import { trpc } from "@/trpc/react"
import { fileToBase64 } from "@/lib/file"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const ACCEPTED_LOGO_TYPES = [
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "image/webp",
] as const

const MAX_LOGO_BYTES = 2 * 1024 * 1024

function isAcceptedLogoType(type: string): boolean {
  return (ACCEPTED_LOGO_TYPES as readonly string[]).includes(type)
}

export function CreateCabinetForm() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState("")
  const [website, setWebsite] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  // Le logo est conservé localement et n'est téléversé qu'à la création du cabinet
  // (sa clé de stockage dépend de l'id du cabinet, qui n'existe pas encore).
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const createCabinet = trpc.onboarding.createCabinet.useMutation({
    onSuccess: () => {
      toast.success("Cabinet créé.")
      // refresh() pour que le layout du dashboard revoie la nouvelle appartenance
      // et ne renvoie pas vers l'onboarding.
      router.replace("/dashboard")
      router.refresh()
    },
    onError: (error) =>
      toast.error(error.message || "La création du cabinet a échoué."),
  })

  function selectLogo(file: File) {
    if (!isAcceptedLogoType(file.type)) {
      toast.error("Format non supporté. Utilisez PNG, JPG, SVG ou WEBP.")
      return
    }
    if (file.size > MAX_LOGO_BYTES) {
      toast.error("Le logo dépasse la taille maximale de 2 Mo.")
      return
    }
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (name.trim().length === 0) return

    const logoBase64 = logoFile ? await fileToBase64(logoFile) : undefined
    createCabinet.mutate({
      name: name.trim(),
      website: website.trim(),
      contactEmail: contactEmail.trim(),
      logoBase64,
    })
  }

  const isSubmitting = createCabinet.isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field>
        <FieldLabel htmlFor="cabinet-name">
          Nom du cabinet <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="cabinet-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Mon cabinet"
          required
          maxLength={200}
          autoFocus
          disabled={isSubmitting}
        />
      </Field>

      <Field>
        <FieldLabel>Logo du cabinet</FieldLabel>
        <div className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-background p-3">
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface">
            {logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element -- aperçu blob: local, hors pipeline next/image
              <img
                src={logoPreview}
                alt="Aperçu du logo"
                className="size-full object-contain"
              />
            ) : (
              <ImageIcon className="size-5 text-muted-foreground" />
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="ml-auto shrink-0"
            disabled={isSubmitting}
            onClick={() => inputRef.current?.click()}
          >
            <Upload />
            {logoFile ? "Changer" : "Ajouter un logo"}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_LOGO_TYPES.join(",")}
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) selectLogo(file)
              event.target.value = ""
            }}
          />
        </div>
        <FieldDescription>
          Optionnel · PNG, JPG, SVG ou WEBP · 2 Mo max
        </FieldDescription>
      </Field>

      <Field>
        <FieldLabel htmlFor="cabinet-website">Site web du cabinet</FieldLabel>
        <Input
          id="cabinet-website"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          placeholder="cabinet.fr"
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
      </Field>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting || name.trim().length === 0}
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : null}
        Créer mon cabinet
      </Button>
    </form>
  )
}
