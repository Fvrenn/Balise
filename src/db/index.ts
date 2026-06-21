import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// Singleton — évite d'épuiser le pool de connexions lors du hot-reload en dev.
const globalForDb = globalThis as unknown as { pool: Pool | undefined }

const pool =
    globalForDb.pool ?? new Pool({ connectionString: process.env.DATABASE_URL })

if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool

export const db = drizzle(pool, { schema })

export type Database = typeof db
