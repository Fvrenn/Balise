import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { db } from "@/db"
import { member, user } from "@/db/schema"

import { CreateCabinetForm } from "./create-cabinet-form"

// Onboarding obligatoire d'un Owner sans cabinet. Accessible uniquement connecté ;
// l'Admin plateforme et les membres déjà rattachés n'y ont rien à faire et
// repartent vers le dashboard (évite aussi de créer un second cabinet par erreur).
export default async function OnboardingCabinetPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    redirect("/login")
  }

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

  if (account?.isAdmin || membership) {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Bienvenue sur Balise — Créez votre cabinet
        </h1>
        <p className="text-sm text-muted-foreground">
          Votre cabinet regroupe votre équipe, vos clients et vos audits. C&apos;est
          la dernière étape avant d&apos;accéder à votre espace.
        </p>
      </div>

      <CreateCabinetForm />
    </div>
  )
}
