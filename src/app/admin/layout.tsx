import type { ReactNode } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { db } from "@/db"
import { user } from "@/db/schema"
import { Logo } from "@/components/logo"

import { AdminSignOut } from "./admin-sign-out"

// Espace réservé à l'Admin plateforme Balise (user.isAdmin). Volontairement hors
// des groupes (dashboard) et (auth) : il n'hérite d'aucune vérification
// d'organisation, car l'Admin n'appartient à aucun cabinet. Seul isAdmin — lu en
// base, la session Better Auth ne le portant pas — ouvre l'accès. Voir CLAUDE.md
// « Modèle d'accès ».
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
    redirect("/login")
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-6">
        <div className="flex items-center gap-2.5">
          <Logo iconOnly />
          <span className="text-sm font-medium text-muted-foreground">
            Administration
          </span>
        </div>
        <AdminSignOut />
      </header>
      <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
