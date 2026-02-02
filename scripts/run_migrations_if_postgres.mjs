#!/usr/bin/env node
import { execSync } from 'child_process';

const pgUrl = process.env.POSTGRES_URL || '';
const dbUrl = process.env.DATABASE_URL || '';

// Allow skipping migrations during build (useful for local builds where DB is unreachable)
if (process.env.SKIP_MIGRATIONS === '1' || process.env.SKIP_MIGRATIONS === 'true') {
  console.log('SKIP_MIGRATIONS is set — skipping Prisma migrations during build.');
  process.exit(0);
}

function looksLikePostgres(u) {
  return typeof u === 'string' && (u.startsWith('postgres://') || u.startsWith('postgresql://'));
}

const effectiveUrl = looksLikePostgres(pgUrl) ? pgUrl : (looksLikePostgres(dbUrl) ? dbUrl : '');

if (!effectiveUrl) {
  console.log('No Postgres database URL found in POSTGRES_URL or DATABASE_URL — skipping migrations.');
  process.exit(0);
}

// If POSTGRES_URL is provided but DATABASE_URL is not set to a Postgres URL,
// set DATABASE_URL to POSTGRES_URL so Prisma (which reads DATABASE_URL) will work.
if (looksLikePostgres(pgUrl) && !looksLikePostgres(dbUrl)) {
  console.log('Setting DATABASE_URL from POSTGRES_URL for Prisma during build.');
  process.env.DATABASE_URL = pgUrl;
}

console.log('Postgres URL detected; running `prisma migrate deploy`...');
try {
  execSync('npx prisma migrate deploy --schema prisma/schema.prisma', { stdio: 'inherit', env: process.env });
  console.log('Migrations applied successfully.');
} catch (err) {
  console.error('Prisma migrate deploy failed.');
  console.error(err && err.message ? err.message : err);
  process.exit(1);
}
