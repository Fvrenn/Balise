"use client"

import { useEffect, useState } from "react"
import { CircleAlert, Loader2, Plus } from "lucide-react"

import type { SampleDetection } from "@/server/sample-detection"
import {
  missingRequiredLabels,
  toCandidates,
  type DetectedCandidate,
} from "@/lib/sample-detection"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Résultat d'une relance de détection : l'auditrice choisit ce qu'elle retient.
// Rien n'est ajouté sans son accord — la détection propose, elle décide.

export function DetectionDialog({
  detection,
  isSubmitting,
  onOpenChange,
  onConfirm,
}: {
  detection: SampleDetection | null
  isSubmitting: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (candidates: DetectedCandidate[]) => void
}) {
  const candidates = detection ? toCandidates(detection) : []
  const missing = detection ? missingRequiredLabels(detection) : []
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  // À chaque nouvelle détection, tout est pré-coché : le cas courant est de
  // tout retenir, l'auditrice décoche les exceptions.
  useEffect(() => {
    if (detection) {
      setSelectedKeys(toCandidates(detection).map((candidate) => candidate.key))
    }
  }, [detection])

  function toggle(key: string) {
    setSelectedKeys((current) =>
      current.includes(key)
        ? current.filter((selected) => selected !== key)
        : [...current, key],
    )
  }

  return (
    <Dialog open={detection !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Pages détectées</DialogTitle>
          <DialogDescription>
            {candidates.length === 0
              ? "Aucune nouvelle page n'a été trouvée : l'échantillon couvre déjà ce que la détection sait repérer."
              : "Sélectionnez les pages à ajouter à l'échantillon."}
          </DialogDescription>
        </DialogHeader>

        {candidates.length > 0 && (
          <ul className="max-h-72 space-y-1 overflow-y-auto">
            {candidates.map((candidate) => (
              <li key={candidate.key}>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 hover:bg-muted/50">
                  <Checkbox
                    checked={selectedKeys.includes(candidate.key)}
                    onCheckedChange={() => toggle(candidate.key)}
                    disabled={isSubmitting}
                    className="mt-0.5"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground">
                      {candidate.label}
                    </span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {candidate.url}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}

        {missing.length > 0 && (
          <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground">
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            <p>
              Non trouvée{missing.length > 1 ? "s" : ""} sur le site :{" "}
              <span className="text-foreground">{missing.join(", ")}</span>. Si
              ces pages existent, ajoutez-les manuellement.
            </p>
          </div>
        )}

        <DialogFooter>
          <DialogClose
            render={
              <Button type="button" variant="outline" disabled={isSubmitting} />
            }
          >
            {candidates.length === 0 ? "Fermer" : "Annuler"}
          </DialogClose>
          {candidates.length > 0 && (
            <Button
              type="button"
              onClick={() =>
                onConfirm(
                  candidates.filter((candidate) =>
                    selectedKeys.includes(candidate.key),
                  ),
                )
              }
              disabled={isSubmitting || selectedKeys.length === 0}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus />}
              Ajouter {selectedKeys.length} page
              {selectedKeys.length > 1 ? "s" : ""}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
