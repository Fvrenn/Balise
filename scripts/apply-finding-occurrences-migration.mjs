import { config } from 'dotenv'
config({ path: '.env.local' })
import pg from 'pg'

// Crée la table finding_occurrences (éléments précis à l'origine d'une
// non-conformité posée par le scanner). Migration purement additive : aucune
// donnée existante n'est touchée, les occurrences se peuplent au prochain scan.
// On n'applique QUE cette opération : le reste du diff drizzle est déjà en base
// (projet géré au db:push, snapshot en retard).

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const client = await pool.connect()

try {
  await client.query('BEGIN')

  await client.query(`
    CREATE TABLE IF NOT EXISTS "finding_occurrences" (
      "id" text PRIMARY KEY NOT NULL,
      "finding_id" text NOT NULL,
      "selector" text NOT NULL,
      "html" text NOT NULL,
      "text" text,
      "landmark" text,
      "details" json,
      "sort_order" integer DEFAULT 0 NOT NULL
    )
  `)
  await client.query(`
    ALTER TABLE "finding_occurrences"
    DROP CONSTRAINT IF EXISTS "finding_occurrences_finding_id_audit_findings_id_fk"
  `)
  await client.query(`
    ALTER TABLE "finding_occurrences"
    ADD CONSTRAINT "finding_occurrences_finding_id_audit_findings_id_fk"
    FOREIGN KEY ("finding_id") REFERENCES "public"."audit_findings"("id") ON DELETE cascade ON UPDATE no action
  `)
  // Rattrapage si la table a été créée avant le passage de jsonb à json.
  await client.query(`
    ALTER TABLE "finding_occurrences"
    ALTER COLUMN "details" TYPE json USING "details"::json
  `)
  await client.query(`
    CREATE INDEX IF NOT EXISTS "finding_occurrences_finding_idx"
    ON "finding_occurrences" USING btree ("finding_id")
  `)

  await client.query('COMMIT')
  console.log('✅ Table finding_occurrences créée. Migration appliquée.')
} catch (error) {
  await client.query('ROLLBACK')
  console.error('❌ Migration annulée (rollback) :', error.message)
  process.exitCode = 1
} finally {
  client.release()
  await pool.end()
}
