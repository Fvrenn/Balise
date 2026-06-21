import { config } from 'dotenv'
config({ path: '.env.local' })

import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { user } from '@/db/schema'
import { auth } from '@/lib/auth'

/**
 * Création d'un compte Owner de cabinet.
 *
 *   pnpm create:owner <email> <mot-de-passe> <nom>
 *   pnpm create:owner sophie@cabinet.fr "MotDePasse123" "Sophie Bernard"
 *
 * Crée UNIQUEMENT le compte utilisateur (via Better Auth, qui hash le mot de
 * passe) — sans organization ni membership, contrairement au seed qui rattache
 * ses comptes à un cabinet. L'Owner n'appartient donc à aucun cabinet : à sa
 * première connexion, le layout du dashboard le redirige vers /onboarding/cabinet
 * où il crée le sien. Voir CLAUDE.md « Modèle d'accès ».
 */

// Better Auth impose un mot de passe d'au moins 8 caractères par défaut.
const MIN_PASSWORD_LENGTH = 8

async function createOwner() {
    const [email, password, name] = process.argv.slice(2)

    if (!email || !password || !name) {
        console.error(
            'Usage : pnpm create:owner <email> <mot-de-passe> <nom>\n' +
                'Exemple : pnpm create:owner sophie@cabinet.fr "MotDePasse123" "Sophie Bernard"',
        )
        process.exit(1)
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
        console.error(
            `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`,
        )
        process.exit(1)
    }

    const existing = await db.query.user.findFirst({
        where: eq(user.email, email),
        columns: { id: true },
    })
    if (existing) {
        console.error(`Un compte existe déjà pour ${email}.`)
        process.exit(1)
    }

    const { user: created } = await auth.api.signUpEmail({
        body: { email, password, name },
    })

    console.log(`✅ Owner créé : ${email} (id ${created.id})`)
    console.log('   Aucun cabinet rattaché — onboarding requis à la connexion.')
    console.log('   → première connexion : redirection vers /onboarding/cabinet')
}

createOwner()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Échec de la création du compte Owner :')
        console.error(error)
        process.exit(1)
    })
