"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export function AdminSignOut() {
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleSignOut}>
      <LogOut />
      Se déconnecter
    </Button>
  )
}
