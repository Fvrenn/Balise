import { format } from "date-fns"
import { fr } from "date-fns/locale"

import { getServerApi } from "@/trpc/server"
import { handleServerError } from "@/lib/server-utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

import { teamRoleLabel } from "@/app/(dashboard)/settings/team/roles"
import { ProfileInfoForm } from "./profile-info-form"
import { PasswordForm } from "./password-form"

export default async function ProfilePage() {
  const api = await getServerApi()
  const profile = await api.user.getProfile().catch(handleServerError)

  return (
    <div className="mx-12 space-y-8 px-6 py-10">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Mon profil
        </h1>
        <p className="text-sm text-muted-foreground">
          Vos informations personnelles et votre mot de passe.
        </p>
      </div>

      {/* Les sections occupent toute la largeur côte à côte ; chacune grandit
          jusqu'à max-w-2xl puis le flux passe à la ligne. */}
      <div className="flex flex-wrap gap-8 [&>*]:max-w-2xl [&>*]:min-w-[22rem] [&>*]:flex-1">
        <ProfileInfoForm initialName={profile.name} email={profile.email} />

        <PasswordForm />

        <Card>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="block h-5 w-[3px] shrink-0 rounded-sm bg-primary" />
              <h2 className="font-heading text-base font-semibold text-foreground">
                Informations du compte
              </h2>
            </div>

            <dl className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <dt className="text-sm font-medium text-foreground">
                  Rôle dans le cabinet
                </dt>
                <dd>
                  <Badge
                    variant={profile.role === "owner" ? "default" : "secondary"}
                  >
                    {teamRoleLabel(profile.role)}
                  </Badge>
                </dd>
              </div>

              <div className="space-y-1.5">
                <dt className="text-sm font-medium text-foreground">
                  Membre depuis
                </dt>
                <dd className="text-sm text-muted-foreground">
                  {profile.memberSince
                    ? format(profile.memberSince, "d MMMM yyyy", { locale: fr })
                    : "—"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
