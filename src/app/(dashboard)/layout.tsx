import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { db } from "@/db"
import { member, user } from "@/db/schema"
import { HeaderSlotProvider, HeaderSlotTarget } from "@/components/header-slot"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar } from "./app-sidebar"
import { Breadcrumbs } from "./breadcrumbs"

// Garde d'authentification de tout l'espace applicatif : la vraie protection se
// fait ici côté serveur (le middleware ne fait qu'une vérif optimiste du cookie).
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/login")
  }

  // Modèle d'accès Balise (cf. CLAUDE.md « Modèle d'accès ») : un Owner créé par
  // l'Admin n'a aucun cabinet tant qu'il n'a pas fait son onboarding. On le force
  // alors vers /onboarding/cabinet. L'Admin plateforme (isAdmin) n'a pas de
  // cabinet par nature et passe sans redirection. La page d'onboarding vit hors de
  // ce layout (route group (auth)), donc aucune boucle de redirection.
  const [account, membership] = await Promise.all([
    db.query.user.findFirst({
      where: eq(user.id, session.user.id),
      columns: { isAdmin: true },
    }),
    db.query.member.findFirst({
      where: eq(member.userId, session.user.id),
      columns: { id: true },
    }),
  ])

  if (!account?.isAdmin && !membership) {
    redirect("/onboarding/cabinet")
  }

  return (
    <TooltipProvider delay={0}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="h-svh overflow-hidden">
          <HeaderSlotProvider>
            <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-4">
              <div className="flex min-w-0 items-center gap-2">
                <SidebarTrigger />
                <Separator orientation="vertical" className="h-6" />
                <Breadcrumbs />
              </div>
              <HeaderSlotTarget className="flex shrink-0 items-center gap-2" />
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          </HeaderSlotProvider>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
