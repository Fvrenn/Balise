import { config } from 'dotenv'
config({ path: '.env.local' })
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
try {
  const r = await pool.query(
    'select count(*)::int as audits, count(assigned_to_id)::int as assigned from audits',
  )
  console.log('DB OK', JSON.stringify(r.rows[0]))
} catch (e) {
  console.log('DB ERROR', e.message)
} finally {
  await pool.end()
}
