import fs from 'fs/promises';
import path from 'path';
import postgres from 'postgres';

const FALLBACK = 'postgresql://neondb_owner:npg_tysYv8Tw4OqZ@ep-little-moon-ah8vyaw7-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const url = process.env.POSTGRES_URL || process.env.DATABASE_URL || FALLBACK;

const outDir = path.resolve('./backups', 'pg-backup-' + Date.now());
await fs.mkdir(outDir, { recursive: true });
const sql = postgres(url, { ssl: 'require' });

console.log('Listing public schema tables...');
const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY table_name`;
const tblNames = tables.map(r => r.table_name);
console.log('Found tables:', tblNames.join(', '));

for (const t of tblNames) {
  console.log('Dumping table', t);
  const rows = await sql.unsafe(`SELECT * FROM "${t}"`);
  await fs.writeFile(path.join(outDir, `${t}.json`), JSON.stringify(rows, null, 2));
}

// Also dump a simple schema snapshot (column definitions)
console.log('Dumping schema snapshot...');
const cols = await sql`SELECT table_name, column_name, data_type, is_nullable, column_default
  FROM information_schema.columns WHERE table_schema='public' ORDER BY table_name, ordinal_position`;
await fs.writeFile(path.join(outDir, 'columns.json'), JSON.stringify(cols, null, 2));

console.log('Backup complete in', outDir);
await sql.end();
