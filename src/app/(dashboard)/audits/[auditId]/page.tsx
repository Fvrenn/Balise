import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { TRPCError } from "@trpc/server"

import { getServerApi } from "@/trpc/server"

export default async function AuditDetailPage({
  params,
}: {
  params: Promise<{ auditId: string }>
}) {
  const { auditId } = await params

  const api = await getServerApi()
  const audit = await api.audits
    .getById({ id: auditId })
    .catch((error: unknown) => {
      if (error instanceof TRPCError) {
        if (error.code === "NOT_FOUND") notFound()
        if (error.code === "FORBIDDEN" || error.code === "UNAUTHORIZED") {
          redirect("/login")
        }
      }
      throw error
    })

  return (
    <div className="mx-12 space-y-8 px-6 py-10">
      <Link
        href="/audits"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Audits
      </Link>

      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          {audit.name}
        </h1>
        <p className="text-sm text-muted-foreground">{audit.siteUrl}</p>
      </div>

      <p className="text-sm text-muted-foreground">Vue d&apos;ensemble — à venir</p>
    </div>
  )
}
