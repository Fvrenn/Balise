import type { ReactNode } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { db } from "@/db"
import { user } from "@/db/schema"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

import { AdminSidebar } from "./admin-sidebar"

// Espace réservé à l'Admin plateforme Balise (user.isAdmin). Volontairement hors
// des groupes (dashboard) et (auth) : il n'hérite d'aucune vérification
// d'organisation, car l'Admin n'appartient à aucun cabinet. Seul isAdmin — lu en
// base, la session Better Auth ne le portant pas — ouvre l'accès. Un non-admin
// connecté repart vers son dashboard. Voir CLAUDE.md « Modèle d'accès ».
export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    redirect("/login")
  }

  const account = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
    columns: { isAdmin: true },
  })
  if (!account?.isAdmin) {
    redirect("/dashboard")
  }

  return (
    <TooltipProvider delay={0}>
      <SidebarProvider>
        <AdminSidebar
          adminName={session.user.name}
          adminEmail={session.user.email}
        />
        <SidebarInset className="h-svh overflow-hidden">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-surface px-4">
            <SidebarTrigger />
            <span className="text-sm font-medium text-muted-foreground">
              Administration
            </span>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
