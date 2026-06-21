import { headers } from "next/headers"
import Link from "next/link"
import { eq, sql } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { db } from "@/db"
import { invitation, organization, user } from "@/db/schema"
import { Button } from "@/components/ui/button"
import { teamRoleLabel } from "@/app/(dashboard)/settings/team/roles"

import { AcceptInvitationForm } from "./accept-invitation-form"

// État de session de l'utilisateur courant vis-à-vis de l'invitation : pas de
// session, session du bon destinataire, ou session d'un autre compte.
type SessionState = "none" | "match" | "mismatch"

async function loadInvitation(invitationId: string) {
  const [row] = await db
    .select({
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      status: invitation.status,
      expiresAt: invitation.expiresAt,
      organizationName: organization.name,
      inviterName: user.name,
    })
    .from(invitation)
    .innerJoin(organization, eq(invitation.organizationId, organization.id))
    .leftJoin(user, eq(invitation.inviterId, user.id))
    .where(eq(invitation.id, invitationId))
    .limit(1)
  return row ?? null
}

function InvalidInvitation({ message }: { message: string }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Invitation indisponible
        </h1>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <Button
        variant="outline"
        className="w-full"
        render={<Link href="/login" />}
      >
        Retour à la connexion
      </Button>
    </div>
  )
}

export default async function AcceptInvitationPage({
  params,
}: {
  params: Promise<{ invitationId: string }>
}) {
  const { invitationId } = await params
  const invite = await loadInvitation(invitationId)

  if (!invite || invite.status !== "pending" || invite.expiresAt < new Date()) {
    return (
      <InvalidInvitation message="Cette invitation est introuvable, a déjà été utilisée ou a expiré. Demandez à l'administrateur du cabinet de vous en renvoyer une." />
    )
  }

  const invitedEmail = invite.email.toLowerCase()

  const [session, existingAccount] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    db.query.user.findFirst({
      where: sql`lower(${user.email}) = ${invitedEmail}`,
      columns: { id: true },
    }),
  ])

  const sessionEmail = session?.user.email.toLowerCase() ?? null
  const sessionState: SessionState = !sessionEmail
    ? "none"
    : sessionEmail === invitedEmail
      ? "match"
      : "mismatch"

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Rejoindre {invite.organizationName}
        </h1>
        <p className="text-sm text-muted-foreground">
          {invite.inviterName
            ? `${invite.inviterName} vous invite `
            : "Vous êtes invité·e "}
          à rejoindre <strong>{invite.organizationName}</strong> en tant que{" "}
          {teamRoleLabel(invite.role)}.
        </p>
      </div>

      <AcceptInvitationForm
        invitationId={invite.id}
        email={invite.email}
        organizationName={invite.organizationName}
        sessionState={sessionState}
        hasAccount={Boolean(existingAccount)}
        currentEmail={session?.user.email ?? null}
      />
    </div>
  )
}
