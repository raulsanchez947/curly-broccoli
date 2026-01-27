import postgres from 'postgres';

const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
if (!url) {
  console.error('POSTGRES_URL / DATABASE_URL not set in environment.');
  process.exit(2);
}

const sql = postgres(url, { ssl: 'require' });

try {
  const rows = await sql`SELECT id, id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' AS is_uuid FROM "User";`;
  console.log('User IDs:');
  console.table(rows);
  await sql.end();
} catch (err) {
  console.error(err);
  try { await sql.end(); } catch (e) {}
  process.exit(1);
}
