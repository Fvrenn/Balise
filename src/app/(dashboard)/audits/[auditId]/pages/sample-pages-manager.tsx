"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  RadarIcon,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import type { SampleDetection } from "@/server/sample-detection"
import { trpc } from "@/trpc/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingMessage } from "@/components/ui/spinner"

import { DeletePageDialog } from "./delete-page-dialog"
import { DetectionDialog } from "./detection-dialog"
import { PageFormDialog, type SamplePageDraft } from "./page-form-dialog"
import { pageTypeLabel, type SamplePageType } from "./page-types"

// Écran de gestion de l'échantillon (spec 4.8) : ajouter, modifier, réordonner
// ou retirer une page après la création de l'audit. Chaque page porte sa propre
// grille de 106 critères, d'où la confirmation avant suppression.

interface SamplePageRow {
  id: string
  label: string
  url: string
  type: SamplePageType
  sortOrder: number
  filledCount: number
}

type DialogState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; page: SamplePageRow }

export function SamplePagesManager({ auditId }: { auditId: string }) {
  const [dialog, setDialog] = useState<DialogState>({ mode: "closed" })
  const [pageToDelete, setPageToDelete] = useState<SamplePageRow | null>(null)
  const [detection, setDetection] = useState<SampleDetection | null>(null)

  const utils = trpc.useUtils()
  const pagesQuery = trpc.audits.listPages.useQuery({ auditId })

  // Toute modification de l'échantillon change la grille (onglets de page) et le
  // taux de conformité affiché dans le header.
  async function refreshAudit() {
    await Promise.all([
      utils.audits.listPages.invalidate({ auditId }),
      utils.audits.getById.invalidate({ id: auditId }),
      utils.audits.getFindings.invalidate({ auditId }),
    ])
  }

  const addPages = trpc.audits.addPages.useMutation({
    onSuccess: async ({ addedCount }) => {
      await refreshAudit()
      toast.success(
        addedCount > 1
          ? `${addedCount} pages ajoutées à l'échantillon.`
          : "Page ajoutée à l'échantillon.",
      )
      setDialog({ mode: "closed" })
      setDetection(null)
    },
    onError: (error) => toast.error(error.message),
  })

  const detectPages = trpc.audits.detectMissingPages.useMutation({
    onSuccess: setDetection,
    onError: (error) => toast.error(error.message),
  })

  const updatePage = trpc.audits.updatePage.useMutation({
    onSuccess: async () => {
      await refreshAudit()
      toast.success("Page modifiée.")
      setDialog({ mode: "closed" })
    },
    onError: (error) => toast.error(error.message),
  })

  const deletePage = trpc.audits.deletePage.useMutation({
    onSuccess: async () => {
      await refreshAudit()
      toast.success("Page retirée de l'échantillon.")
      setPageToDelete(null)
    },
    onError: (error) => toast.error(error.message),
  })

  const reorderPages = trpc.audits.reorderPages.useMutation({
    onSuccess: refreshAudit,
    onError: (error) => toast.error(error.message),
  })

  const pages = pagesQuery.data ?? []
  const isBusy =
    addPages.isPending ||
    updatePage.isPending ||
    deletePage.isPending ||
    reorderPages.isPending ||
    detectPages.isPending

  function movePage(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= pages.length) return
    const reordered = [...pages]
    const [moved] = reordered.splice(index, 1)
    if (!moved) return
    reordered.splice(target, 0, moved)
    reorderPages.mutate({
      auditId,
      pageIds: reordered.map((page) => page.id),
    })
  }

  function handleSubmit(draft: SamplePageDraft) {
    if (dialog.mode === "create") {
      addPages.mutate({ auditId, pages: [draft] })
      return
    }
    if (dialog.mode === "edit") {
      updatePage.mutate({ pageId: dialog.page.id, ...draft })
    }
  }

  if (pagesQuery.isPending) {
    return <LoadingMessage>Chargement de l&apos;échantillon…</LoadingMessage>
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-heading text-lg font-semibold text-foreground">
            Échantillon de pages
          </h1>
          <p className="text-sm text-muted-foreground">
            {pages.length} page{pages.length > 1 ? "s" : ""} auditée
            {pages.length > 1 ? "s" : ""}. Chacune porte sa propre grille des 106
            critères.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => detectPages.mutate({ auditId })}
            disabled={isBusy}
          >
            {detectPages.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <RadarIcon />
            )}
            Relancer la détection
          </Button>
          <Button type="button" onClick={() => setDialog({ mode: "create" })}>
            <Plus />
            Ajouter une page
          </Button>
        </div>
      </div>

      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
        {pages.map((page, index) => (
          <li
            key={page.id}
            className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40"
          >
            <div className="flex flex-col">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => movePage(index, -1)}
                disabled={isBusy || index === 0}
                aria-label={`Remonter ${page.label}`}
              >
                <ChevronUp />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => movePage(index, 1)}
                disabled={isBusy || index === pages.length - 1}
                aria-label={`Descendre ${page.label}`}
              >
                <ChevronDown />
              </Button>
            </div>

            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-foreground">
                  {page.label}
                </p>
                <Badge variant="secondary">{pageTypeLabel(page.type)}</Badge>
              </div>
              <a
                href={page.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <span className="truncate">{page.url}</span>
                <ExternalLink className="size-3 shrink-0" />
              </a>
            </div>

            <p className="shrink-0 text-sm text-muted-foreground">
              {page.filledCount} critère{page.filledCount > 1 ? "s" : ""}{" "}
              renseigné{page.filledCount > 1 ? "s" : ""}
            </p>

            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setDialog({ mode: "edit", page })}
                disabled={isBusy}
                aria-label={`Modifier ${page.label}`}
              >
                <Pencil />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setPageToDelete(page)}
                disabled={isBusy || pages.length === 1}
                aria-label={`Supprimer ${page.label}`}
              >
                <Trash2 />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {reorderPages.isPending && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          Réordonnancement…
        </p>
      )}

      <PageFormDialog
        open={dialog.mode !== "closed"}
        mode={dialog.mode === "edit" ? "edit" : "create"}
        initialValue={
          dialog.mode === "edit"
            ? {
                label: dialog.page.label,
                url: dialog.page.url,
                type: dialog.page.type,
              }
            : undefined
        }
        isSubmitting={addPages.isPending || updatePage.isPending}
        onOpenChange={(open) => {
          if (!open) setDialog({ mode: "closed" })
        }}
        onSubmit={handleSubmit}
      />

      <DetectionDialog
        detection={detection}
        isSubmitting={addPages.isPending}
        onOpenChange={(open) => {
          if (!open) setDetection(null)
        }}
        onConfirm={(candidates) =>
          addPages.mutate({
            auditId,
            pages: candidates.map((candidate) => ({
              label: candidate.label,
              url: candidate.url,
              type: candidate.type,
            })),
          })
        }
      />

      <DeletePageDialog
        page={pageToDelete}
        isSubmitting={deletePage.isPending}
        onOpenChange={(open) => {
          if (!open) setPageToDelete(null)
        }}
        onConfirm={() => {
          if (pageToDelete) deletePage.mutate({ pageId: pageToDelete.id })
        }}
      />
    </div>
  )
}
