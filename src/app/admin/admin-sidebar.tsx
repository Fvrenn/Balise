"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Building2,
  ChevronsUpDown,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
        <Logo iconOnly={isMobile || state === "collapsed"} />
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
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                  />
                }
              >
                <Avatar className="size-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-sidebar-primary/15 text-sidebar-primary">
                    {getInitials(adminName)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{adminName}</span>
                  <span className="truncate text-xs text-sidebar-foreground/70">
                    {adminEmail}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 text-sidebar-foreground/70" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="end"
                sideOffset={8}
                className="min-w-56"
              >
                <div className="px-1.5 py-1.5">
                  <p className="truncate text-sm font-medium text-foreground">
                    {adminName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {adminEmail}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/dashboard" />}>
                  <LayoutDashboard />
                  Retour à l&apos;app
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
                  <LogOut />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
