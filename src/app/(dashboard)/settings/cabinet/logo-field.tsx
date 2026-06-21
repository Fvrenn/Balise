"use client"

import { useRef, useState } from "react"
import { ImageIcon, Loader2, Upload } from "lucide-react"
import { toast } from "sonner"

import { trpc } from "@/trpc/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "image/webp",
] as const
type LogoContentType = (typeof ACCEPTED_TYPES)[number]

const MAX_LOGO_BYTES = 2 * 1024 * 1024

function isAcceptedType(type: string): type is LogoContentType {
  return (ACCEPTED_TYPES as readonly string[]).includes(type)
}

// Lit un fichier et renvoie sa charge utile base64 (sans le préfixe data:).
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Lecture du fichier impossible."))
        return
      }
      resolve(reader.result.split(",")[1] ?? "")
    }
    reader.onerror = () =>
      reject(reader.error ?? new Error("Lecture du fichier impossible."))
    reader.readAsDataURL(file)
  })
}

export function LogoField({ logo }: { logo: string | null }) {
  const utils = trpc.useUtils()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const uploadLogo = trpc.cabinet.uploadLogo.useMutation({
    onSuccess: async () => {
      await utils.cabinet.get.invalidate()
      toast.success("Logo mis à jour.")
      setPreview(null)
    },
    onError: (error) => {
      toast.error(error.message || "Le téléversement du logo a échoué.")
      setPreview(null)
    },
  })

  async function handleFile(file: File) {
    // Validation client pour un retour immédiat ; le serveur revérifie le contenu
    // réel (magic bytes) et reste l'autorité.
    if (!isAcceptedType(file.type)) {
      toast.error("Format non supporté. Utilisez PNG, JPG, SVG ou WEBP.")
      return
    }
    if (file.size > MAX_LOGO_BYTES) {
      toast.error("Le logo dépasse la taille maximale de 2 Mo.")
      return
    }
    setPreview(URL.createObjectURL(file))
    const dataBase64 = await fileToBase64(file)
    uploadLogo.mutate({ dataBase64 })
  }

  const currentLogo = preview ?? logo
  const isUploading = uploadLogo.isPending

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-foreground">
        Logo du cabinet
      </span>
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          const file = event.dataTransfer.files?.[0]
          if (file) handleFile(file)
        }}
        className={cn(
          "flex items-center gap-4 rounded-lg border border-dashed border-border bg-background p-4 transition-colors",
          isDragging && "border-primary bg-muted",
        )}
      >
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface">
          {currentLogo ? (
            // eslint-disable-next-line @next/next/no-img-element -- aperçu blob: ou logo servi par /api/uploads, hors pipeline next/image
            <img
              src={currentLogo}
              alt="Logo du cabinet"
              className="size-full object-contain"
            />
          ) : (
            <ImageIcon className="size-6 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 space-y-0.5">
          <p className="text-sm font-medium text-foreground">
            {isUploading
              ? "Téléversement…"
              : "Déposez un logo ou parcourez vos fichiers"}
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, SVG ou WEBP · 2 Mo max
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-auto shrink-0"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? <Loader2 className="animate-spin" /> : <Upload />}
          {logo ? "Changer le logo" : "Choisir un logo"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) handleFile(file)
            // Réinitialise pour permettre de re-sélectionner le même fichier.
            event.target.value = ""
          }}
        />
      </div>
    </div>
  )
}
