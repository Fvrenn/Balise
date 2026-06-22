import { config } from 'dotenv'
config({ path: '.env.local' })
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
try {
  const tracking = await pool.query(`
    select exists (
      select 1 from information_schema.tables
      where table_schema = 'drizzle' and table_name = '__drizzle_migrations'
    ) as has_drizzle_schema,
    exists (
      select 1 from information_schema.tables
      where table_name = '__drizzle_migrations'
    ) as has_any_tracking
  `)
  console.log('tracking', JSON.stringify(tracking.rows[0]))

  const tables = await pool.query(`
    select table_name from information_schema.tables
    where table_schema = 'public' order by table_name
  `)
  console.log('tables', tables.rows.map((r) => r.table_name).join(', '))

  const hasUuid = await pool.query(`select gen_random_uuid() as id`)
  console.log('gen_random_uuid OK', hasUuid.rows[0].id)
} catch (e) {
  console.log('ERROR', e.message)
} finally {
  await pool.end()
}
