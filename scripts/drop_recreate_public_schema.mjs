import postgres from 'postgres';
const FALLBACK = 'postgresql://neondb_owner:npg_tysYv8Tw4OqZ@ep-little-moon-ah8vyaw7-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const url = process.env.POSTGRES_URL || process.env.DATABASE_URL || FALLBACK;
const sql = postgres(url, { ssl: 'require' });

console.log('Dropping public schema CASCADE...');
await sql`DROP SCHEMA public CASCADE`;
console.log('Creating public schema...');
await sql`CREATE SCHEMA public`;
console.log('Done');
await sql.end();
