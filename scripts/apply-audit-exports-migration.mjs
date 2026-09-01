import { config } from 'dotenv'
config({ path: '.env.local' })
import pg from 'pg'

// Crée la table audit_exports (archive des livrables générés : un fichier par
// export, retrouvable en re-téléchargement). Migration purement additive :
// aucune donnée existante n'est touchée. On n'applique QUE cette opération, le
// reste du diff drizzle étant déjà en base (projet géré au db:push, snapshot en
// retard).

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const client = await pool.connect()

try {
  await client.query('BEGIN')

  await client.query(`
    CREATE TABLE IF NOT EXISTS "audit_exports" (
      "id" text PRIMARY KEY NOT NULL,
      "audit_id" text NOT NULL,
      "filename" text NOT NULL,
      "storage_key" text NOT NULL,
      "file_size" integer NOT NULL,
      "generated_by" text,
      "generated_at" timestamp DEFAULT now() NOT NULL
    )
  `)
  await client.query(`
    ALTER TABLE "audit_exports"
    DROP CONSTRAINT IF EXISTS "audit_exports_audit_id_audits_id_fk"
  `)
  await client.query(`
    ALTER TABLE "audit_exports"
    ADD CONSTRAINT "audit_exports_audit_id_audits_id_fk"
    FOREIGN KEY ("audit_id") REFERENCES "public"."audits"("id") ON DELETE cascade ON UPDATE no action
  `)
  await client.query(`
    ALTER TABLE "audit_exports"
    DROP CONSTRAINT IF EXISTS "audit_exports_generated_by_user_id_fk"
  `)
  await client.query(`
    ALTER TABLE "audit_exports"
    ADD CONSTRAINT "audit_exports_generated_by_user_id_fk"
    FOREIGN KEY ("generated_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action
  `)
  await client.query(`
    CREATE INDEX IF NOT EXISTS "audit_exports_audit_idx"
    ON "audit_exports" USING btree ("audit_id")
  `)

  await client.query('COMMIT')
  console.log('✅ Table audit_exports créée. Migration appliquée.')
} catch (error) {
  await client.query('ROLLBACK')
  console.error('❌ Migration annulée (rollback) :', error.message)
  process.exitCode = 1
} finally {
  client.release()
  await pool.end()
}
