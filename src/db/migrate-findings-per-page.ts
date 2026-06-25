import { config } from 'dotenv'
config({ path: '.env.local' })

import { sql } from 'drizzle-orm'

import { db } from '@/db'

/**
 * Migration des findings : 1 par (audit, critère) → 1 par (audit, critère, page).
 *
 *   pnpm migrate:findings-per-page   (puis pnpm db:push pour finaliser le schéma)
 *
 * Avant cette refonte, chaque audit portait 106 findings globaux. Désormais
 * l'auditrice travaille page par page : il faut un finding par critère ET par page.
 *
 * Ce script transforme les DONNÉES existantes (db:push ne sait pas exploser des
 * lignes). Il est idempotent — relançable sans effet de bord :
 *   1. ajoute les colonnes page_id / copied_from_page_id (nullable, temporaire) ;
 *   2. supprime l'ancien index unique (audit, critère), qui interdirait plusieurs
 *      findings du même critère ;
 *   3. duplique chaque finding global sur chacune des pages de son audit, en
 *      reprenant statut et commentaire ;
 *   4. supprime les findings globaux d'origine (uniquement pour les audits qui ont
 *      au moins une page — sinon on les laisse tels quels, cf. cas théorique).
 *
 * Le passage de page_id en NOT NULL, l'ajout de la clé étrangère, le nouvel index
 * unique (audit, critère, page) et la suppression de concerned_page_ids sont laissés
 * à `pnpm db:push`, qui réconcilie le schéma une fois les données prêtes.
 */
async function migrateFindingsPerPage() {
    await db.transaction(async (tx) => {
        await tx.execute(
            sql`ALTER TABLE audit_findings ADD COLUMN IF NOT EXISTS page_id text`,
        )
        await tx.execute(
            sql`ALTER TABLE audit_findings ADD COLUMN IF NOT EXISTS copied_from_page_id text`,
        )
        await tx.execute(
            sql`DROP INDEX IF EXISTS findings_audit_criterion_uidx`,
        )

        const inserted = await tx.execute(sql`
            INSERT INTO audit_findings
                (id, audit_id, criterion_id, page_id, status, comment, copied_from_page_id, updated_by, updated_at)
            SELECT
                gen_random_uuid(), f.audit_id, f.criterion_id, p.id, f.status, f.comment, NULL, f.updated_by, f.updated_at
            FROM audit_findings f
            JOIN audit_pages p ON p.audit_id = f.audit_id
            WHERE f.page_id IS NULL
        `)

        const deleted = await tx.execute(sql`
            DELETE FROM audit_findings AS f
            WHERE f.page_id IS NULL
              AND EXISTS (SELECT 1 FROM audit_pages p WHERE p.audit_id = f.audit_id)
        `)

        console.log(
            `✅ Findings éclatés par page : ${inserted.rowCount ?? 0} créés, ${deleted.rowCount ?? 0} globaux supprimés.`,
        )
    })

    // Les findings d'audits sans aucune page n'ont pas pu recevoir de page_id : ils
    // bloqueraient le passage en NOT NULL. En pratique tout audit a au moins une page
    // (contrainte de création), donc ce compteur doit valoir 0.
    const orphans = await db.execute(
        sql`SELECT count(*)::int AS count FROM audit_findings WHERE page_id IS NULL`,
    )
    const orphanCount = Number(
        (orphans.rows[0] as { count: number } | undefined)?.count ?? 0,
    )
    if (orphanCount > 0) {
        console.warn(
            `⚠️  ${orphanCount} finding(s) sans page_id (audits sans page). ` +
                'Ajoutez-leur une page ou supprimez-les avant `pnpm db:push` (NOT NULL).',
        )
    }

    console.log('→ Étape suivante : `pnpm db:push` pour finaliser le schéma.')
}

migrateFindingsPerPage()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Échec de la migration des findings par page :')
        console.error(error)
        process.exit(1)
    })
