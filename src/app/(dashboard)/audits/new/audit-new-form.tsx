"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, CircleAlert, Loader2, Plus, X } from "lucide-react"
import { toast } from "sonner"

import { trpc } from "@/trpc/react"
import { cn } from "@/lib/utils"
import {
  missingRequiredLabels,
  toCandidates,
} from "@/lib/sample-detection"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { AssigneeMultiSelect } from "./assignee-multi-select"

const STEPS = ["Informations", "Pages de l'échantillon"] as const

const PAGE_TYPE_OPTIONS = [
  { value: "mandatory", label: "Obligatoire" },
  { value: "template", label: "Gabarit" },
  { value: "additional", label: "Complémentaire" },
] as const

type SamplePageType = (typeof PAGE_TYPE_OPTIONS)[number]["value"]

interface SamplePageRow {
  id: string
  label: string
  url: string
  type: SamplePageType
}

function createEmptyPage(): SamplePageRow {
  return { id: crypto.randomUUID(), label: "", url: "", type: "mandatory" }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function RequiredMark() {
  return <span className="text-destructive">*</span>
}

export function AuditNewForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const utils = trpc.useUtils()

  const clientsQuery = trpc.clients.list.useQuery()
  const membersQuery = trpc.audits.listMembers.useQuery()
  const currentUserId = trpc.member.current.useQuery().data?.id

  const [step, setStep] = useState(1)
  const [clientId, setClientId] = useState(
    () => searchParams.get("clientId") ?? "",
  )
  const [name, setName] = useState("")
  const [siteUrl, setSiteUrl] = useState("")
  const [assigneeIds, setAssigneeIds] = useState<string[]>([])
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [pages, setPages] = useState<SamplePageRow[]>(() => [createEmptyPage()])
  const [missingPages, setMissingPages] = useState<string[]>([])

  // Par défaut, l'audit est assigné à l'utilisateur connecté dès que son id est
  // connu, tant qu'aucun auditeur n'a encore été sélectionné.
  useEffect(() => {
    if (currentUserId) {
      setAssigneeIds((current) =>
        current.length === 0 ? [currentUserId] : current,
      )
    }
  }, [currentUserId])

  // Détection de l'échantillon (spec 4.6, étape 2) : la proposition remplace la
  // ligne vide initiale, l'auditrice l'ajuste ensuite comme une saisie manuelle.
  const detectSample = trpc.audits.detectSample.useMutation({
    onSuccess: (detection) => {
      const candidates = toCandidates(detection)
      setMissingPages(missingRequiredLabels(detection))
      if (candidates.length === 0) return
      setPages(
        candidates.map((candidate) => ({
          id: crypto.randomUUID(),
          label: candidate.label,
          url: candidate.url,
          type: candidate.type,
        })),
      )
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const createAudit = trpc.audits.create.useMutation({
    onSuccess: (audit) => {
      // Le nouvel audit (statut « in_progress ») doit apparaître immédiatement
      // dans la sidebar (« En cours »), la liste des audits et les stats du
      // dashboard, sans rechargement manuel de la page.
      utils.audits.listMine.invalidate()
      utils.audits.list.invalidate()
      utils.audits.stats.invalidate()
      toast.success("Audit créé.")
      router.push(`/audits/${audit.id}`)
    },
    onError: (error) => {
      toast.error(error.message || "La création de l'audit a échoué.")
    },
  })

  const isSubmitting = createAudit.isPending
  const clientOptions = (clientsQuery.data ?? []).map((client) => ({
    value: client.id,
    label: client.name,
  }))

  const contactEmailInvalid =
    contactEmail.trim() !== "" && !isValidEmail(contactEmail.trim())
  const step1Valid =
    clientId !== "" &&
    name.trim() !== "" &&
    siteUrl.trim() !== "" &&
    assigneeIds.length > 0 &&
    !contactEmailInvalid
  const pagesValid =
    pages.length > 0 &&
    pages.every(
      (page) => page.label.trim() !== "" && page.url.trim() !== "",
    )

  function updatePage(id: string, patch: Partial<Omit<SamplePageRow, "id">>) {
    setPages((current) =>
      current.map((page) => (page.id === id ? { ...page, ...patch } : page)),
    )
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (step === 1) {
      if (!step1Valid) return
      setStep(2)
      detectSample.mutate({ siteUrl: siteUrl.trim() })
      return
    }
    if (!pagesValid || isSubmitting) return
    createAudit.mutate({
      clientId,
      name: name.trim(),
      siteUrl: siteUrl.trim(),
      assigneeIds,
      contactName: contactName.trim() || undefined,
      contactEmail: contactEmail.trim() || undefined,
      pages: pages.map((page) => ({
        label: page.label.trim(),
        url: page.url.trim(),
        type: page.type,
      })),
    })
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-8">
      <Stepper currentStep={step} />

      {step === 1 ? (
        <div className="space-y-6 rounded-xl border border-border bg-surface p-6 shadow-sm">
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="block h-5 w-[3px] shrink-0 rounded-sm bg-primary" />
              <h2 className="font-heading text-base font-semibold text-foreground">
                Site à auditer
              </h2>
            </div>

            <Field>
              <FieldLabel htmlFor="audit-client">
                Client <RequiredMark />
              </FieldLabel>
              <Select
                items={clientOptions}
                value={clientId || null}
                onValueChange={(value) => setClientId(value ?? "")}
                disabled={isSubmitting || clientsQuery.isLoading}
              >
                <SelectTrigger id="audit-client">
                  <SelectValue
                    placeholder={
                      clientsQuery.isLoading
                        ? "Chargement…"
                        : "Sélectionnez un client"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {clientOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="audit-name">
                Nom de l&apos;audit <RequiredMark />
              </FieldLabel>
              <Input
                id="audit-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="ex. Audit RGAA — Site institutionnel"
                disabled={isSubmitting}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="audit-site-url">
                URL du site à auditer <RequiredMark />
              </FieldLabel>
              <Input
                id="audit-site-url"
                value={siteUrl}
                onChange={(event) => setSiteUrl(event.target.value)}
                placeholder="exemple.fr"
                disabled={isSubmitting}
              />
              <FieldDescription>
                Domaine ou URL complète du site (ex. exemple.fr).
              </FieldDescription>
            </Field>
          </section>

          <Separator />

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="block h-5 w-[3px] shrink-0 rounded-sm bg-primary" />
              <h2 className="font-heading text-base font-semibold text-foreground">
                Équipe &amp; référent
              </h2>
            </div>

            <Field>
              <FieldLabel htmlFor="audit-assigned">
                Assigné à <RequiredMark />
              </FieldLabel>
              <AssigneeMultiSelect
                id="audit-assigned"
                members={membersQuery.data ?? []}
                selectedIds={assigneeIds}
                onChange={setAssigneeIds}
                currentUserId={currentUserId}
                disabled={isSubmitting}
                isLoading={membersQuery.isLoading}
              />
              <FieldDescription>
                Au moins un auditeur ; vous êtes assigné par défaut.
              </FieldDescription>
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="audit-contact-name">
                  Nom du référent
                </FieldLabel>
                <Input
                  id="audit-contact-name"
                  value={contactName}
                  onChange={(event) => setContactName(event.target.value)}
                  placeholder="ex. Marie Dupont"
                  disabled={isSubmitting}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="audit-contact-email">
                  Email du référent
                </FieldLabel>
                <Input
                  id="audit-contact-email"
                  type="email"
                  value={contactEmail}
                  onChange={(event) => setContactEmail(event.target.value)}
                  placeholder="marie.dupont@exemple.fr"
                  disabled={isSubmitting}
                  aria-invalid={contactEmailInvalid}
                />
                {contactEmailInvalid ? (
                  <p className="text-sm font-medium text-destructive">
                    Email du référent invalide.
                  </p>
                ) : null}
              </Field>
            </div>
          </section>
        </div>
      ) : (
        <div className="space-y-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="block h-5 w-[3px] shrink-0 rounded-sm bg-primary" />
              <h2 className="font-heading text-base font-semibold text-foreground">
                Pages de l&apos;échantillon
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Les pages qui composent l&apos;échantillon de l&apos;audit (au
              moins une).
            </p>
          </div>

          {detectSample.isPending && (
            <p className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Analyse du site en cours…
            </p>
          )}

          {missingPages.length > 0 && (
            <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground">
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
              <p>
                Page{missingPages.length > 1 ? "s" : ""} attendue
                {missingPages.length > 1 ? "s" : ""} par le RGAA et non trouvée
                {missingPages.length > 1 ? "s" : ""} :{" "}
                <span className="text-foreground">
                  {missingPages.join(", ")}
                </span>
                . Ajoutez-les si elles existent — sinon vous pouvez lancer
                l&apos;audit sans.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {pages.map((page) => (
              <div
                key={page.id}
                className="flex flex-col gap-2 sm:flex-row sm:items-center"
              >
                <Input
                  className="sm:flex-1"
                  value={page.label}
                  onChange={(event) =>
                    updatePage(page.id, { label: event.target.value })
                  }
                  placeholder="Libellé (ex. Accueil)"
                  disabled={isSubmitting}
                  aria-label="Libellé de la page"
                />
                <Input
                  className="sm:flex-1"
                  value={page.url}
                  onChange={(event) =>
                    updatePage(page.id, { url: event.target.value })
                  }
                  placeholder="exemple.fr/accueil"
                  disabled={isSubmitting}
                  aria-label="URL de la page"
                />
                <Select
                  items={PAGE_TYPE_OPTIONS}
                  value={page.type}
                  onValueChange={(value) => {
                    if (value) updatePage(page.id, { type: value })
                  }}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    className="sm:w-44"
                    aria-label="Type de page"
                  >
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
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() =>
                    setPages((current) =>
                      current.filter((row) => row.id !== page.id),
                    )
                  }
                  disabled={isSubmitting || pages.length === 1}
                  aria-label="Supprimer la page"
                >
                  <X />
                </Button>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setPages((current) => [...current, createEmptyPage()])
            }
            disabled={isSubmitting}
          >
            <Plus />
            Ajouter une page
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        {step === 2 ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(1)}
            disabled={isSubmitting}
          >
            Retour
          </Button>
        ) : (
          <span />
        )}

        {step === 1 ? (
          <Button type="submit" disabled={!step1Valid}>
            Continuer
          </Button>
        ) : (
          <Button type="submit" disabled={!pagesValid || isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : null}
            Créer l&apos;audit
          </Button>
        )}
      </div>
    </form>
  )
}

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <ol className="flex items-center gap-3">
      {STEPS.map((label, index) => {
        const stepNumber = index + 1
        const isActive = currentStep === stepNumber
        const isDone = currentStep > stepNumber
        return (
          <li key={label} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border text-xs font-semibold tabular-nums transition-colors",
                  isActive && "border-primary bg-primary text-primary-foreground",
                  isDone && "border-primary bg-primary/10 text-primary",
                  !isActive &&
                  !isDone &&
                  "border-border text-muted-foreground",
                )}
              >
                {isDone ? <Check className="size-4" /> : stepNumber}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  isActive || isDone
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </div>
            {stepNumber < STEPS.length ? (
              <div className="h-px w-8 bg-border" />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
