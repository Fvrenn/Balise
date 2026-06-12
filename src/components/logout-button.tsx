"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, LogOut } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

// Reprend tous les props du Button shadcn (variant, size, className…) pour
// pouvoir poser ce bouton avec n'importe quel style. onClick est retiré : la
// logique de déconnexion est gérée en interne et ne doit pas être surchargée.
type LogoutButtonProps = Omit<React.ComponentProps<typeof Button>, "onClick"> & {
  // Masquer l'icône pour un usage purement textuel (ex: variant "link").
  showIcon?: boolean
}

export function LogoutButton({
  children = "Se déconnecter",
  showIcon = true,
  disabled,
  ...props
}: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogout() {
    setIsLoading(true)

    const { error } = await authClient.signOut()

    if (error) {
      // Échec : on garde l'utilisateur sur place et on réactive le bouton pour
      // réessayer, plutôt que de le rediriger comme s'il était déconnecté.
      console.error("Échec de la déconnexion :", error.message)
      setIsLoading(false)
      return
    }

    router.push("/login")
    router.refresh()
  }

  return (
    <Button onClick={handleLogout} disabled={disabled || isLoading} {...props}>
      {isLoading ? <Loader2 className="animate-spin" /> : showIcon && <LogOut />}
      {children}
    </Button>
  )
}
