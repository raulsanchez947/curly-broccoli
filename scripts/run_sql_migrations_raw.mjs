import fs from 'fs';
import path from 'path';
import postgres from 'postgres';

const MIG_DIR = path.join(process.cwd(), 'rauls-chatbot', 'lib', 'db', 'migrations');
const FALLBACK = 'postgresql://neondb_owner:npg_tysYv8Tw4OqZ@ep-little-moon-ah8vyaw7-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const url = process.env.POSTGRES_URL || process.env.DATABASE_URL || FALLBACK;

const sql = postgres(url, { ssl: 'require' });

async function run(){
  try{
    const files = fs.readdirSync(MIG_DIR).filter(f => f.endsWith('.sql')).sort();
    console.log('Found migration files:', files);
    for(const f of files){
      const p = path.join(MIG_DIR, f);
      console.log('\n=== Running', f, '===');
      const content = fs.readFileSync(p, 'utf8');
      const stmts = content.split('--> statement-breakpoint').map(s=>s.trim()).filter(Boolean);
      for(const s of stmts){
        try{
          console.log('Executing statement (truncated):', s.slice(0,120).replace(/\n/g,' '),'...');
          await sql.unsafe(s);
        }catch(err){
          console.error('Statement failed in file', f);
          console.error(err);
          throw err;
        }
      }
    }
    console.log('\nAll migrations executed');
  }catch(err){
    console.error('\nMigration run stopped with error');
    process.exitCode = 1;
  }finally{
    await sql.end();
  }
}

run();
