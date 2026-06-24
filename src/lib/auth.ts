import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { organization } from 'better-auth/plugins'
import { createAccessControl } from 'better-auth/plugins/access'
import { defaultStatements } from 'better-auth/plugins/organization/access'
import { nextCookies } from 'better-auth/next-js'
import { db } from '@/db'
import {
    user,
    session,
    account,
    verification,
    organization as organizationTable,
    member,
    invitation,
} from '@/db/schema'

// Contrôle d'accès du cabinet. Balise n'utilise que deux rôles — `owner` et
// `auditor` — là où Better Auth propose par défaut owner/admin/member. On déclare
// donc nos propres rôles, sinon l'API (createInvitation, updateMemberRole…)
// refuserait `auditor` comme rôle inconnu.
const accessControl = createAccessControl(defaultStatements)

// L'owner administre le cabinet : invitations, gestion des membres, paramètres.
const ownerRole = accessControl.newRole({
    organization: ['update', 'delete'],
    member: ['create', 'update', 'delete'],
    invitation: ['create', 'cancel'],
    team: ['create', 'update', 'delete'],
    ac: ['create', 'read', 'update', 'delete'],
})

// L'auditeur travaille mais n'administre pas : aucun droit de gestion.
const auditorRole = accessControl.newRole({
    organization: [],
    member: [],
    invitation: [],
    team: [],
    ac: ['read'],
})

// Envoi de l'email d'invitation via Resend. Dégrade proprement si la clé n'est
// pas configurée (dev) : l'invitation est tout de même créée en base, seul
// l'email est sauté. N'échoue jamais — un envoi raté ne doit pas annuler
// l'invitation déjà persistée.
async function sendInvitationEmail(data: {
    id: string
    email: string
    role: string
    organization: { name: string }
    inviter: { user: { name: string } }
}) {
    const apiKey = process.env.RESEND_API_KEY
    const inviteUrl = `${process.env.BETTER_AUTH_URL ?? ''}/accept-invitation/${data.id}`

    if (!apiKey) {
        console.warn(
            `[team] RESEND_API_KEY absente — invitation de ${data.email} créée sans email. Lien d'acceptation : ${inviteUrl}`,
        )
        return
    }

    try {
        const { Resend } = await import('resend')
        const resend = new Resend(apiKey)
        await resend.emails.send({
            from: process.env.EMAIL_FROM ?? 'Balise <onboarding@resend.dev>',
            to: data.email,
            subject: `Invitation à rejoindre ${data.organization.name} sur Balise`,
            html: `
                <p>Bonjour,</p>
                <p>${data.inviter.user.name} vous invite à rejoindre le cabinet
                <strong>${data.organization.name}</strong> sur Balise.</p>
                <p><a href="${inviteUrl}">Accepter l'invitation</a></p>
            `,
        })
    } catch (error) {
        // On log mais on n'interrompt pas : l'invitation reste valide en base.
        console.error(
            `[team] Échec de l'envoi de l'email d'invitation à ${data.email}.`,
            error,
        )
    }
}

// Envoi de l'email de définition / réinitialisation du mot de passe via Resend.
// Sert deux flux : la création d'un Owner par l'Admin (admin.createOwner) et la
// page « mot de passe oublié ». Better Auth appelle ce callback depuis
// requestPasswordReset avec un lien déjà prêt (`url`) qui, une fois suivi, redirige
// vers /reset-password?token=… Même contrat que sendInvitationEmail : dégrade
// proprement sans clé API (le lien est loggé en dev) et n'échoue jamais — le token
// est déjà persisté, un email raté ne doit pas faire échouer la demande.
async function sendResetPassword(data: {
    user: { email: string; name?: string | null }
    url: string
}) {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
        console.warn(
            `[auth] RESEND_API_KEY absente — email de mot de passe pour ${data.user.email} non envoyé. Lien : ${data.url}`,
        )
        return
    }

    try {
        const { Resend } = await import('resend')
        const resend = new Resend(apiKey)
        await resend.emails.send({
            from: process.env.EMAIL_FROM ?? 'Balise <onboarding@resend.dev>',
            to: data.user.email,
            subject: 'Définissez votre mot de passe Balise',
            html: `
                <p>Bonjour,</p>
                <p>Pour définir ou réinitialiser votre mot de passe Balise,
                cliquez sur le lien ci-dessous. Ce lien est valable une heure.</p>
                <p><a href="${data.url}">Définir mon mot de passe</a></p>
                <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez
                ignorer cet email.</p>
            `,
        })
    } catch (error) {
        // On log mais on n'interrompt pas : le token de réinitialisation reste valide.
        console.error(
            `[auth] Échec de l'envoi de l'email de mot de passe à ${data.user.email}.`,
            error,
        )
    }
}

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        // Mapping explicite modèle Better Auth → table Drizzle.
        schema: {
            user,
            session,
            account,
            verification,
            organization: organizationTable,
            member,
            invitation,
        },
    }),
    emailAndPassword: {
        enabled: true,
        // Active /request-password-reset : sans ce callback, Better Auth refuse la
        // demande (RESET_PASSWORD_DISABLED). Sert /forgot-password et la création
        // d'Owner par l'Admin.
        sendResetPassword,
    },
    plugins: [
        // Un cabinet = une organization.
        organization({
            ac: accessControl,
            roles: { owner: ownerRole, auditor: auditorRole },
            sendInvitationEmail,
        }),
        // nextCookies doit rester le dernier plugin de la liste.
        nextCookies(),
    ],
})
