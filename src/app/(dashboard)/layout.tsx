import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
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
