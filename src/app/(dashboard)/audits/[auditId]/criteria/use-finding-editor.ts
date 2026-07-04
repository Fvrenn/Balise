"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

import { trpc } from "@/trpc/react"

import type { FindingState } from "./criterion-row"

const SAVE_DEBOUNCE_MS = 800

// Machine d'état optimiste de la grille de critères : chaque interaction met à
// jour l'état local immédiatement, la sauvegarde réseau suit en arrière-plan
// (débounce par finding). Le hook porte toute la logique d'édition — état,
// timers, mutations, propagation — le composant ne fait que composer l'UI.
export function useFindingEditor(auditId: string) {
  const utils = trpc.useUtils()
  const findingsQuery = trpc.audits.getFindings.useQuery({ auditId })

  const findings = useMemo(
    () => findingsQuery.data ?? [],
    [findingsQuery.data],
  )

  // Clé = id de finding, donc une entrée par (critère, page).
  const [stateById, setStateById] = useState<Map<string, FindingState>>(
    () => new Map(),
  )

  // Miroir du state pour lire la dernière valeur dans les timers de sauvegarde.
  const stateRef = useRef(stateById)
  stateRef.current = stateById
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  // Index (critère → page → id de finding) pour retrouver les findings cibles d'une
  // propagation, et accès direct par id pour la page/critère source.
  const findingById = useMemo(
    () => new Map(findings.map((finding) => [finding.id, finding])),
    [findings],
  )
  const findingIdByCriterionPage = useMemo(() => {
    const byCriterion = new Map<string, Map<string, string>>()
    for (const finding of findings) {
      let byPage = byCriterion.get(finding.criterionId)
      if (!byPage) {
        byPage = new Map()
        byCriterion.set(finding.criterionId, byPage)
      }
      byPage.set(finding.pageId, finding.id)
    }
    return byCriterion
  }, [findings])

  // Synchronise l'état local avec les findings serveur : au premier chargement et
  // à chaque refetch (fin de scan automatique, refocus). Les findings dont une
  // sauvegarde est encore en attente (timer de débounce actif) conservent leur
  // valeur locale — on n'écrase jamais une édition en cours.
  useEffect(() => {
    const data = findingsQuery.data
    if (!data) return
    setStateById((previous) => {
      const next = new Map<string, FindingState>()
      for (const finding of data) {
        const local = previous.get(finding.id)
        if (local && timersRef.current.has(finding.id)) {
          next.set(finding.id, local)
        } else {
          next.set(finding.id, {
            status: finding.status,
            comment: finding.comment ?? "",
            copiedFromPageId: finding.copiedFromPageId ?? null,
            source: finding.source,
          })
        }
      }
      return next
    })
  }, [findingsQuery.data])

  const saveFinding = trpc.audits.updateFinding.useMutation({
    onSuccess: () => utils.audits.getById.invalidate({ id: auditId }),
    onError: () => toast.error("La sauvegarde a échoué."),
  })
  const markThemeNA = trpc.audits.markThemeNA.useMutation({
    onSuccess: () => utils.audits.getById.invalidate({ id: auditId }),
    onError: () => toast.error("L'action a échoué."),
  })
  const copyFindingToPages = trpc.audits.copyFindingToPages.useMutation({
    onSuccess: () => utils.audits.getById.invalidate({ id: auditId }),
    onError: () => toast.error("La copie a échoué."),
  })

  const scheduleSave = useCallback(
    (findingId: string) => {
      const timers = timersRef.current
      const existing = timers.get(findingId)
      if (existing) clearTimeout(existing)
      const timer = setTimeout(() => {
        timers.delete(findingId)
        const state = stateRef.current.get(findingId)
        if (!state) return
        saveFinding.mutate({
          findingId,
          status: state.status,
          comment: state.comment || null,
        })
      }, SAVE_DEBOUNCE_MS)
      timers.set(findingId, timer)
    },
    [saveFinding],
  )

  // Vide les timers en attente au démontage.
  useEffect(() => {
    const timers = timersRef.current
    return () => timers.forEach((timer) => clearTimeout(timer))
  }, [])

  // Édition manuelle : on met à jour l'état optimiste, on efface l'indicateur de
  // propagation (le finding n'est plus une copie) et on reprend la main sur un
  // éventuel résultat de scan (source manual). La sauvegarde serveur fait de même.
  const patchFinding = useCallback(
    (findingId: string, patch: Partial<FindingState>) => {
      setStateById((prev) => {
        const current = prev.get(findingId)
        if (!current) return prev
        const next = new Map(prev)
        next.set(findingId, {
          ...current,
          ...patch,
          copiedFromPageId: null,
          source: "manual",
        })
        return next
      })
      scheduleSave(findingId)
    },
    [scheduleSave],
  )

  // Propagation : copie le statut + commentaire du finding source vers les findings
  // des mêmes critères sur d'autres pages, en marquant copiedFromPageId. Met à jour
  // l'état optimiste de toutes les pages cibles (sans déclencher la sauvegarde par
  // page : la mutation copyFindingToPages persiste l'ensemble).
  const copyToPages = useCallback(
    (sourceFindingId: string, targetPageIds: string[]) => {
      const source = findingById.get(sourceFindingId)
      const sourceState = stateRef.current.get(sourceFindingId)
      if (!source || !sourceState) return
      const byPage = findingIdByCriterionPage.get(source.criterionId)
      if (!byPage) return

      setStateById((prev) => {
        const next = new Map(prev)
        for (const pageId of targetPageIds) {
          if (pageId === source.pageId) continue
          const targetId = byPage.get(pageId)
          if (!targetId || !next.has(targetId)) continue
          next.set(targetId, {
            status: sourceState.status,
            comment: sourceState.comment,
            copiedFromPageId: source.pageId,
            source: "manual",
          })
        }
        return next
      })

      copyFindingToPages.mutate({ findingId: sourceFindingId, targetPageIds })
    },
    [copyFindingToPages, findingById, findingIdByCriterionPage],
  )

  // Passe tous les critères d'une thématique en N/A sur les pages choisies :
  // état optimiste puis une seule mutation serveur (pas de sauvegarde par finding).
  const markThemeNAForPages = useCallback(
    (themeId: number, pageIds: string[]) => {
      if (pageIds.length === 0) return
      const pageSet = new Set(pageIds)
      setStateById((prev) => {
        const next = new Map(prev)
        for (const finding of findings) {
          if (finding.themeId !== themeId) continue
          if (!pageSet.has(finding.pageId)) continue
          const current = next.get(finding.id)
          if (current) {
            next.set(finding.id, {
              ...current,
              status: "non_applicable",
              copiedFromPageId: null,
              source: "manual",
            })
          }
        }
        return next
      })
      markThemeNA.mutate({ auditId, themeId, pageIds })
    },
    [auditId, findings, markThemeNA],
  )

  return {
    findings,
    isLoading: findingsQuery.isLoading,
    stateById,
    stateRef,
    findingIdByCriterionPage,
    patchFinding,
    copyToPages,
    markThemeNAForPages,
  }
}
