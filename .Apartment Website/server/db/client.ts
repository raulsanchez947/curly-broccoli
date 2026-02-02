import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'

let _db: ReturnType<typeof drizzle> | null = null

function resolveUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRESQL_URL || ''
}

export function getDb() {
  if (!_db) {
    const url = resolveUrl()
    if (!url) {
      throw new Error('DATABASE_URL is not set. Set DATABASE_URL at runtime to create a DB client.')
    }
    _db = drizzle({ connection: { url }, schema })
  }
  return _db
}

// Export `schema` so callers can import `{ db, schema }` like the Hub client
export { schema }

// Provide a `db` proxy object that lazily resolves the real Drizzle instance
// and forwards property access (so existing `db.query.*` usage continues to work).
export const db: any = new Proxy({}, {
  get(_, prop: string) {
    const real = getDb()
    // @ts-ignore
    return (real as any)[prop]
  },
  apply(_, __, args: any[]) {
    const real = getDb()
    // @ts-ignore
    return (real as any).apply(null, args)
  }
})
