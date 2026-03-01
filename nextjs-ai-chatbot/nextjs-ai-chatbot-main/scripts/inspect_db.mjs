import postgres from 'postgres';

const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
if (!url) {
  console.error('POSTGRES_URL / DATABASE_URL not set in environment.');
  process.exit(2);
}

const sql = postgres(url, { ssl: 'require' });

try {
  console.log('Listing tables in schemas public and drizzle...');

  const tables = await sql`
    SELECT schemaname, tablename
    FROM pg_catalog.pg_tables
    WHERE schemaname IN ('public','drizzle')
    ORDER BY schemaname, tablename;
  `;

  console.log('\nTABLES:');
  console.table(tables);

  // Try to fetch column types for User and Chat if they exist
  const existing = tables.map((r) => r.tablename);

  if (existing.includes('User') || existing.includes('Chat')) {
    const cols = await sql`
      SELECT table_schema, table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_name IN ('User','Chat')
      ORDER BY table_name, column_name;
    `;
    console.log('\nCOLUMNS:');
    console.table(cols);
  } else {
    console.log('\nNo tables named "User" or "Chat" found in public/drizzle schemas.');
  }

  // Row counts (only for tables that exist)
  const counts = [];
  if (existing.includes('User')) {
    const r = await sql`SELECT COUNT(*)::text AS count FROM "User";`;
    counts.push({ table_name: 'User', count: r[0].count });
  }
  if (existing.includes('Chat')) {
    const r = await sql`SELECT COUNT(*)::text AS count FROM "Chat";`;
    counts.push({ table_name: 'Chat', count: r[0].count });
  }
  if (counts.length) {
    console.log('\nROW COUNTS:');
    console.table(counts);
  }

  const fks = await sql`
    SELECT conname, conrelid::regclass AS table_from, pg_get_constraintdef(oid) AS definition
    FROM pg_constraint
    WHERE contype = 'f'
      AND (conrelid::regclass::text ILIKE '%User%' OR conrelid::regclass::text ILIKE '%Chat%' OR confrelid::regclass::text ILIKE '%User%' OR confrelid::regclass::text ILIKE '%Chat%');
  `;
  console.log('\nFOREIGN KEYS:');
  console.table(fks);

  await sql.end({ timeout: 5 });
} catch (err) {
  console.error('Inspect error:');
  console.error(err);
  try { await sql.end(); } catch (e) {}
  process.exit(1);
}
