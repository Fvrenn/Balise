import { config } from 'dotenv'
config({ path: '.env.local' })
import pg from 'pg'

// Applique à la base live le passage assignedToId → table audit_assignees, en
// préservant les assignations existantes. On n'applique QUE les opérations liées à
// ce changement : le reste du diff drizzle (colonnes invitation/user) est déjà en
// base (projet géré au db:push, snapshot en retard).

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const client = await pool.connect()

try {
  await client.query('BEGIN')

  await client.query(`
    CREATE TABLE "audit_assignees" (
      "id" text PRIMARY KEY NOT NULL,
      "audit_id" text NOT NULL,
      "user_id" text NOT NULL,
      "assigned_at" timestamp DEFAULT now() NOT NULL
    )
  `)
  await client.query(`
    ALTER TABLE "audit_assignees"
    ADD CONSTRAINT "audit_assignees_audit_id_audits_id_fk"
    FOREIGN KEY ("audit_id") REFERENCES "public"."audits"("id") ON DELETE cascade ON UPDATE no action
  `)
  await client.query(`
    ALTER TABLE "audit_assignees"
    ADD CONSTRAINT "audit_assignees_user_id_user_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action
  `)
  await client.query(`
    CREATE UNIQUE INDEX "audit_assignees_audit_user_uidx"
    ON "audit_assignees" USING btree ("audit_id","user_id")
  `)
  await client.query(`
    CREATE INDEX "audit_assignees_user_idx"
    ON "audit_assignees" USING btree ("user_id")
  `)

  const migrated = await client.query(`
    INSERT INTO "audit_assignees" ("id", "audit_id", "user_id")
    SELECT gen_random_uuid(), "id", "assigned_to_id"
    FROM "audits"
    WHERE "assigned_to_id" IS NOT NULL
  `)
  console.log(
    `✅ ${migrated.rowCount} assignation(s) existante(s) migrée(s) vers audit_assignees.`,
  )

  await client.query(`ALTER TABLE "audits" DROP COLUMN "assigned_to_id"`)

  await client.query('COMMIT')
  console.log('✅ Colonne audits.assigned_to_id supprimée. Migration appliquée.')
} catch (error) {
  await client.query('ROLLBACK')
  console.error('❌ Migration annulée (rollback) :', error.message)
  process.exitCode = 1
} finally {
  client.release()
  await pool.end()
}
