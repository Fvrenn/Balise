"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Building2,
  ChevronsUpDown,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  Users,
  type LucideIcon,
} from "lucide-react"

import type { inferRouterOutputs } from "@trpc/server"
import { authClient } from "@/lib/auth-client"
import { getInitials } from "@/lib/utils"
import { SERVER_DATA_STALE_TIME, trpc } from "@/trpc/react"
import { Logo } from "@/components/logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

import type { AppRouter } from "@/server/routers/_app"

type CurrentMember = inferRouterOutputs<AppRouter>["member"]["current"]

type NavItem = {
  title: string
  href: string
  icon: LucideIcon
}

const mainNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
]

const workNav: NavItem[] = [
  { title: "Clients", href: "/clients", icon: Building2 },
  { title: "Tous les audits", href: "/audits", icon: ClipboardCheck },
]

// Réservé aux owners du cabinet.
const cabinetNav: NavItem[] = [
  { title: "Équipe", href: "/settings/team", icon: Users },
  { title: "Paramètres", href: "/settings/cabinet", icon: Settings },
]

// Nombre d'audits en cours affichés en raccourci sous « Audits ». Au-delà,
// l'auditeur passe par la page liste.
const MAX_SIDEBAR_AUDITS = 4

// L'item actif : fond bleuté sombre, texte blanc, icône amber.
const activeItemClasses =
  "[&_svg]:size-5 data-active:bg-sidebar-accent data-active:text-sidebar-foreground data-active:[&_svg]:text-sidebar-primary data-active:hover:bg-sidebar-accent data-active:hover:text-sidebar-foreground"

export function AppSidebar({
  initialMember,
}: {
  initialMember: CurrentMember
}) {
  const pathname = usePathname()
  const { isMobile, state } = useSidebar()
  // Semé par le layout serveur (plus de « Chargement… » au montage) ; la requête
  // est conservée pour que la mise à jour du profil (qui invalide member.current)
  // rafraîchisse le nom affiché ici.
  const currentMember = trpc.member.current.useQuery(undefined, {
    initialData: initialMember,
    staleTime: SERVER_DATA_STALE_TIME,
  })
  const isOwner = currentMember.data.role === "owner"

  const myAudits = trpc.audits.listMine.useQuery()
  const auditsInProgress = (myAudits.data ?? [])
    .filter((audit) => audit.status === "in_progress")
    .slice(0, MAX_SIDEBAR_AUDITS)

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  function renderNav(items: NavItem[]) {
    return items.map((item) => (
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
    ))
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="justify-center px-3">
        <Logo iconOnly={isMobile || state === "collapsed"} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>{renderNav(mainNav)}</SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Travail</SidebarGroupLabel>
          <SidebarMenu>{renderNav(workNav)}</SidebarMenu>
        </SidebarGroup>

        {auditsInProgress.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>En cours</SidebarGroupLabel>
            <SidebarMenu>
              {auditsInProgress.map((audit) => (
                <SidebarMenuItem key={audit.id}>
                  <SidebarMenuButton
                    isActive={isActive(`/audits/${audit.id}`)}
                    tooltip={audit.name}
                    className={activeItemClasses}
                    render={<Link href={`/audits/${audit.id}/criteria`} />}
                  >
                    <FileText />
                    <span className="truncate">{audit.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}

        {isOwner && (
          <SidebarGroup>
            <SidebarGroupLabel>Cabinet</SidebarGroupLabel>
            <SidebarMenu>{renderNav(cabinetNav)}</SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserMenu member={currentMember.data} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

function UserMenu({ member }: { member: CurrentMember }) {
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/login")
    router.refresh()
  }

  const displayName = member.name
  const email = member.email

  return (
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
          {member.image ? (
            <AvatarImage src={member.image} alt={displayName} />
          ) : null}
          <AvatarFallback className="rounded-lg bg-sidebar-primary/15 text-sidebar-primary">
            {getInitials(member.name)}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{displayName}</span>
          <span className="truncate text-xs text-sidebar-foreground/70">
            {email}
          </span>
        </div>
        <ChevronsUpDown className="ml-auto size-4 text-sidebar-foreground/70" />
      </DropdownMenuTrigger>

      <DropdownMenuContent side="top" align="end" sideOffset={8} className="min-w-56">
        <div className="px-1.5 py-1.5">
          <p className="truncate text-sm font-medium text-foreground">
            {displayName}
          </p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/settings/profile" />}>
          <User />
          Profil
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <LogOut />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
