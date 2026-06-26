import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { getServerApi } from "@/trpc/server"

import { UsersView } from "./users-view"

// Le layout admin garantit déjà une session Admin : la page peut interroger
// admin.listUsers sans risque de FORBIDDEN. On résout la session ici uniquement
// pour connaître l'utilisateur courant (suppression de soi-même interdite).
export default async function AdminUsersPage() {
  const api = await getServerApi()
  const headersList = await headers()
  const [session, users] = await Promise.all([
    auth.api.getSession({ headers: headersList }),
    api.admin.listUsers(),
  ])

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="mx-12 px-6 py-10">
      <UsersView initialUsers={users} currentUserId={session.user.id} />
    </div>
  )
}
