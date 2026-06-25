"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Building2,
  LayoutDashboard,
  LogOut,
  Users,
  type LucideIcon,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { getInitials } from "@/lib/utils"
import { Logo } from "@/components/logo"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"

type NavItem = {
  title: string
  href: string
  icon: LucideIcon
}

const adminNav: NavItem[] = [
  { title: "Cabinets", href: "/admin", icon: Building2 },
  { title: "Utilisateurs", href: "/admin/users", icon: Users },
]

// Reprend le style de l'item actif de la sidebar cabinet : fond bleuté, icône amber.
const activeItemClasses =
  "[&_svg]:size-5 data-active:bg-sidebar-accent data-active:text-sidebar-foreground data-active:[&_svg]:text-sidebar-primary data-active:hover:bg-sidebar-accent data-active:hover:text-sidebar-foreground"

export function AdminSidebar({
  adminName,
  adminEmail,
}: {
  adminName: string
  adminEmail: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { isMobile, state } = useSidebar()
  const isCollapsed = isMobile || state === "collapsed"

  // « Cabinets » (/admin) est la racine de l'espace : actif uniquement en
  // correspondance exacte, sinon il s'allumerait aussi sous /admin/users.
  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="justify-center px-3">
        <Logo iconOnly={isCollapsed} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Plateforme</SidebarGroupLabel>
          <SidebarMenu>
            {adminNav.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={isActive(item.href)}
                  tooltip={item.title}
                  className={activeItemClasses}
                  render={<Link href={item.href} />}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2.5 px-2 py-1.5 group-data-[collapsible=icon]:hidden">
          <Avatar className="size-8 rounded-lg">
            <AvatarFallback className="rounded-lg bg-sidebar-primary/15 text-sidebar-primary">
              {getInitials(adminName)}
            </AvatarFallback>
          </Avatar>
          <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{adminName}</span>
            <span className="truncate text-xs text-sidebar-foreground/70">
              {adminEmail}
            </span>
          </div>
        </div>

        <SidebarSeparator className="group-data-[collapsible=icon]:hidden" />

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Retour à l'app"
              render={<Link href="/dashboard" />}
            >
              <LayoutDashboard />
              <span>Retour à l&apos;app</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Se déconnecter" onClick={handleSignOut}>
              <LogOut />
              <span>Se déconnecter</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
