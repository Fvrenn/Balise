import { config } from 'dotenv'
config({ path: '.env.local' })

import { and, eq } from 'drizzle-orm'

import { db } from '@/db'
import { rgaaCriteriaSeed } from '@/db/rgaa-criteria-data'
import { member, organization, rgaaCriteria, user } from '@/db/schema'
import { auth } from '@/lib/auth'

// ─── Comptes & cabinets ───────────────────────────────────────────────────────
// Idempotent : relançable sans planter même si une partie des données existe déjà
// (on vérifie l'existence avant chaque insert). Trialog héberge le compte admin ;
// les deux autres cabinets servent à tester l'isolation multi-tenant (chacun ne
// voit que ses propres données). Mots de passe de dev identiques — jamais en prod.

type SeedMember = {
    email: string
    password: string
    name: string
    role: 'owner' | 'auditor'
}

type SeedCabinet = {
    name: string
    slug: string
    members: SeedMember[]
}

const seedCabinets: SeedCabinet[] = [
    {
        name: 'Access42',
        slug: 'access42',
        members: [
            {
                email: 'owner@access42.fr',
                password: 'changeme123',
                name: 'Sophie Bernard',
                role: 'owner',
            },
            {
                email: 'auditeur@access42.fr',
                password: 'changeme123',
                name: 'Lucas Martin',
                role: 'auditor',
            },
        ],
    },
    {
        name: 'Ideance',
        slug: 'ideance',
        members: [
            {
                email: 'owner@ideance.fr',
                password: 'changeme123',
                name: 'Camille Durand',
                role: 'owner',
            },
            {
                email: 'auditeur@ideance.fr',
                password: 'changeme123',
                name: 'Hugo Lefebvre',
                role: 'auditor',
            },
        ],
    },
]

// Crée l'utilisateur via Better Auth (qui gère le hash du mot de passe) s'il
// n'existe pas, sinon réutilise l'existant. Retourne son id.
async function ensureUser(seedMember: SeedMember): Promise<string> {
    const existing = await db.query.user.findFirst({
        where: eq(user.email, seedMember.email),
        columns: { id: true },
    })
    if (existing) {
        console.log(`  ↺ Compte déjà présent : ${seedMember.email}`)
        return existing.id
    }

    const { user: created } = await auth.api.signUpEmail({
        body: {
            email: seedMember.email,
            password: seedMember.password,
            name: seedMember.name,
        },
    })
    console.log(`  ✅ Compte créé : ${seedMember.email}`)
    return created.id
}

// Cabinet identifié par son slug (unique) : réutilisé s'il existe, créé sinon.
async function ensureCabinet(seed: SeedCabinet): Promise<string> {
    const existing = await db.query.organization.findFirst({
        where: eq(organization.slug, seed.slug),
        columns: { id: true },
    })
    if (existing) {
        return existing.id
    }

    const [created] = await db
        .insert(organization)
        .values({
            id: crypto.randomUUID(),
            name: seed.name,
            slug: seed.slug,
            createdAt: new Date(),
        })
        .returning({ id: organization.id })
    if (!created) {
        throw new Error(`Création du cabinet ${seed.name} échouée.`)
    }
    return created.id
}

// Rattache l'utilisateur au cabinet s'il ne l'est pas déjà (pas de contrainte
// d'unicité sur (organization, user) en base, d'où la vérification explicite).
async function ensureMembership(input: {
    organizationId: string
    userId: string
    role: SeedMember['role']
}) {
    const existing = await db.query.member.findFirst({
        where: and(
            eq(member.organizationId, input.organizationId),
            eq(member.userId, input.userId),
        ),
        columns: { id: true },
    })
    if (existing) return

    await db.insert(member).values({
        id: crypto.randomUUID(),
        organizationId: input.organizationId,
        userId: input.userId,
        role: input.role,
        createdAt: new Date(),
    })
}

async function seedUsersAndCabinets() {
    for (const seed of seedCabinets) {
        const organizationId = await ensureCabinet(seed)
        for (const seedMember of seed.members) {
            const userId = await ensureUser(seedMember)
            await ensureMembership({ organizationId, userId, role: seedMember.role })
        }
        console.log(`✅ Cabinet ${seed.name} prêt (${seed.members.length} comptes)`)
    }
}

async function createPlatformAdmin() {
    const email = 'admin@balise.app'

    const existing = await db.query.user.findFirst({
        where: eq(user.email, email),
        columns: { id: true, isAdmin: true },
    })

    if (existing) {
        if (!existing.isAdmin) {
            await db.update(user).set({ isAdmin: true }).where(eq(user.id, existing.id))
        }
        console.log(`  ↺ Admin plateforme déjà présent : ${email}`)
        return
    }

    const { user: created } = await auth.api.signUpEmail({
        body: { email, password: 'changeme123', name: 'Admin Balise' },
    })  
    await db.update(user).set({ isAdmin: true }).where(eq(user.id, created.id))
    console.log(`✅ Admin plateforme créé (sans cabinet) : ${email}`)
}

async function createTestOwner() {
    const email = 'owner@trialog.test'

    const userId = await ensureUser({
        email,
        password: 'changeme123',
        name: 'Owner Trialog',
        role: 'owner',
    })

    const organizationId = await ensureCabinet({ name: 'Trialog', slug: 'trialog', members: [] })
    await ensureMembership({ organizationId, userId, role: 'owner' })

    console.log(`✅ Owner de test créé, cabinet Trialog : ${email}`)
}

export async function seedRgaaCriteria() {
    await db
        .insert(rgaaCriteria)
        .values(rgaaCriteriaSeed)
        .onConflictDoNothing({ target: rgaaCriteria.id })

    console.log(
        `✅ Seed RGAA 4.1.2 : ${rgaaCriteriaSeed.length} critères insérés`,
    )
}

// Permet de lancer directement : pnpm tsx src/db/seed.ts
if (require.main === module) {
    seedRgaaCriteria()
        .then(() => createPlatformAdmin())
        .then(() => createTestOwner())
        .then(() => seedUsersAndCabinets())
        .then(() => process.exit(0))
        .catch((err) => {
            console.error(err)
            process.exit(1)
        })
}
