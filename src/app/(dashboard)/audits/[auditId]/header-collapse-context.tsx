"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

const STORAGE_KEY = "balise:header-collapsed"

interface HeaderCollapseContextValue {
  collapsed: boolean
  toggle: () => void
  collapseOnce: () => void
}

const HeaderCollapseContext = createContext<HeaderCollapseContextValue>({
  collapsed: false,
  toggle: () => {},
  collapseOnce: () => {},
})

export function HeaderCollapseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "true") setCollapsed(true)
    } catch {}
  }, [])

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_KEY, String(next))
      } catch {}
      return next
    })
  }, [])

  // Ne collapse que si pas déjà collapsed (appelé une seule fois par la grille)
  const collapseOnce = useCallback(() => {
    setCollapsed((prev) => {
      if (prev) return prev
      try {
        localStorage.setItem(STORAGE_KEY, "true")
      } catch {}
      return true
    })
  }, [])

  return (
    <HeaderCollapseContext.Provider value={{ collapsed, toggle, collapseOnce }}>
      {children}
    </HeaderCollapseContext.Provider>
  )
}

export function useHeaderCollapse() {
  return useContext(HeaderCollapseContext)
}
