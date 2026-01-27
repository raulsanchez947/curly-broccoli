import postgres from 'postgres';

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!url) {
  console.error('DATABASE_URL / POSTGRES_URL not set');
  process.exit(2);
}

const sql = postgres(url, { ssl: 'require' });

async function describe(table){
  const cols = await sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = ${table}
    ORDER BY ordinal_position
  `;
  console.log(`\nColumns for ${table}:`);
  console.table(cols);
}

async function run(){
  try{
    await describe('Message');
    await describe('Post');
  }catch(e){
    console.error(e);
  }finally{
    await sql.end();
  }
}

run();
