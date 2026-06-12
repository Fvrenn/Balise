"use client"

import { createContext, useContext, useState } from "react"
import { createPortal } from "react-dom"

// Permet à chaque page d'injecter ses actions contextuelles dans la barre d'en-tête
// de l'application (champ de recherche, bouton « Nouveau… »…). On passe par un
// portail plutôt que de remonter l'état : les actions restent dans l'arbre React de
// la page, donc leur état (ex. le terme de recherche) reste colocalisé avec le
// contenu qu'elles pilotent (le tableau filtré).

type HeaderSlotContextValue = {
  target: HTMLElement | null
  setTarget: (node: HTMLElement | null) => void
}

const HeaderSlotContext = createContext<HeaderSlotContextValue | null>(null)

function useHeaderSlot() {
  const context = useContext(HeaderSlotContext)
  if (!context) {
    throw new Error(
      "HeaderActions et HeaderSlotTarget doivent être rendus dans un HeaderSlotProvider.",
    )
  }
  return context
}

export function HeaderSlotProvider({ children }: { children: React.ReactNode }) {
  const [target, setTarget] = useState<HTMLElement | null>(null)
  return (
    <HeaderSlotContext.Provider value={{ target, setTarget }}>
      {children}
    </HeaderSlotContext.Provider>
  )
}

// Cible rendue une seule fois par le layout, à l'emplacement voulu dans l'en-tête.
// Le ref de rappel enregistre (et nettoie) son nœud DOM pour les portails.
export function HeaderSlotTarget({ className }: { className?: string }) {
  const { setTarget } = useHeaderSlot()
  return <div ref={setTarget} className={className} />
}

// Rendu par une page : téléporte ses enfants dans la barre d'en-tête. Rien n'est
// affiché côté serveur (le portail attend que la cible soit montée).
export function HeaderActions({ children }: { children: React.ReactNode }) {
  const { target } = useHeaderSlot()
  if (!target) return null
  return createPortal(children, target)
}
