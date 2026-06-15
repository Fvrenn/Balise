"use client"

import Link from "next/link"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { HeaderActions } from "@/components/header-slot"

interface ClientHeaderActionsProps {
  client: { id: string }
}

export function ClientHeaderActions({ client }: ClientHeaderActionsProps) {
  return (
    <HeaderActions>
      <Link
        href={`/audits/new?clientId=${client.id}`}
        className={cn(buttonVariants())}
      >
        <Plus />
        Nouvel audit
      </Link>
    </HeaderActions>
  )
}
