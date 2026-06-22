import { config } from 'dotenv'
config({ path: '.env.local' })
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
try {
  const cols = await pool.query(`
    select column_name from information_schema.columns
    where table_name = 'audits' and column_name = 'assigned_to_id'
  `)
  console.log('assigned_to_id still present?', cols.rowCount > 0)

  const assignees = await pool.query(`
    select aa.audit_id, aa.user_id, u.name, aa.assigned_at
    from audit_assignees aa join "user" u on u.id = aa.user_id
    order by aa.assigned_at
  `)
  console.log('audit_assignees rows:', assignees.rowCount)
  for (const r of assignees.rows) console.log('  ', r.audit_id, '->', r.name)
} catch (e) {
  console.log('ERROR', e.message)
} finally {
  await pool.end()
}
