import postgres from 'postgres';

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!url) {
  console.error('DATABASE_URL / POSTGRES_URL not set');
  process.exit(2);
}

const sql = postgres(url, { ssl: 'require' });

async function run() {
  try {
    console.log('Connected to DB (raw-smoke-test)');

    const email = 'smoke@test.local';
    // detect whether `name` column exists on User
    const colInfo = await sql`
      SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='User' AND column_name='name' LIMIT 1
    `;
    const hasName = colInfo.length > 0;

    let row = (await sql`SELECT id FROM "User" WHERE email = ${email} LIMIT 1`)[0];
    let userId = row?.id;
    if (!userId) {
      // Check if User.id has a default (e.g., gen_random_uuid())
      const idCol = await sql`
        SELECT column_default FROM information_schema.columns
        WHERE table_schema='public' AND table_name='User' AND column_name='id' LIMIT 1
      `;
      const idHasDefault = idCol.length && idCol[0].column_default != null;
      if (idHasDefault) {
        const r = hasName
          ? await sql`INSERT INTO "User"(email,name) VALUES (${email}, 'Smoke Tester') RETURNING id`
          : await sql`INSERT INTO "User"(email) VALUES (${email}) RETURNING id`;
        userId = r[0].id;
      } else {
        const idExpr = sql`gen_random_uuid()`;
        const r = hasName
          ? await sql`INSERT INTO "User"("id", email,name) VALUES (${idExpr}, ${email}, 'Smoke Tester') RETURNING id`
          : await sql`INSERT INTO "User"("id", email) VALUES (${idExpr}, ${email}) RETURNING id`;
        userId = r[0].id;
      }
      console.log('Created test user', userId);
    } else {
      console.log('Found test user', userId);
    }

    // Determine id column type for Message and Post
    const msgIdCol = await sql`
      SELECT data_type FROM information_schema.columns WHERE table_schema='public' AND table_name='Message' AND column_name='id' LIMIT 1
    `;
    const postIdCol = await sql`
      SELECT data_type FROM information_schema.columns WHERE table_schema='public' AND table_name='Post' AND column_name='id' LIMIT 1
    `;
    const msgIdIsText = msgIdCol.length && msgIdCol[0].data_type === 'text';
    const postIdIsText = postIdCol.length && postIdCol[0].data_type === 'text';

    // Find author column for Message and Post
    const msgCols = await sql`SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='Message'`;
    const postCols = await sql`SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='Post'`;
    const msgColNames = msgCols.map(r => r.column_name);
    const postColNames = postCols.map(r => r.column_name);

    const candidateAuthor = (names) => {
      const prefer = ['authorId','author','userId','user_id','createdBy'];
      for (const p of prefer) if (names.includes(p)) return p;
      const fuzzy = names.find(n => /author|user/i.test(n));
      return fuzzy || null;
    };

    const msgAuthorCol = candidateAuthor(msgColNames);
    const postAuthorCol = candidateAuthor(postColNames);

    if (msgAuthorCol) {
      const idExpr = msgIdIsText ? sql`gen_random_uuid()::text` : sql`gen_random_uuid()`;
      const q = await sql`INSERT INTO "Message" ("id", "content", ${sql.unsafe('"' + msgAuthorCol + '"')}) VALUES (${idExpr}, 'Smoke test message', ${userId}) RETURNING id`;
      console.log('Created message', q[0].id);
    } else {
      console.log('No author-like column on Message; skipping message creation');
    }

    if (postAuthorCol) {
      const idExpr2 = postIdIsText ? sql`gen_random_uuid()::text` : sql`gen_random_uuid()`;
      const q2 = await sql`INSERT INTO "Post" ("id", "title", "content", ${sql.unsafe('"' + postAuthorCol + '"')}) VALUES (${idExpr2}, 'Smoke test post', 'Created during smoke test', ${userId}) RETURNING id`;
      console.log('Created post', q2[0].id);
    } else {
      console.log('No author-like column on Post; skipping post creation');
    }

    const msgTableExists = (await sql`SELECT to_regclass('Message') IS NOT NULL AS exists`)[0];
    if (msgTableExists && msgTableExists.exists) {
      if (msgAuthorCol) {
        const q = await sql.unsafe(`SELECT m.id, m."content", u.email AS authorEmail FROM "Message" m LEFT JOIN "User" u ON m."${msgAuthorCol}" = u.id ORDER BY m."createdAt" ASC LIMIT 5`);
        console.log('Messages sample:', q);
      } else {
        const q = await sql.unsafe(`SELECT id, "content" FROM "Message" ORDER BY "createdAt" ASC LIMIT 5`);
        console.log('Messages sample (no author):', q);
      }
    } else {
      console.log('Message table missing, skipping message sample');
    }

    const postTableExists = (await sql`SELECT to_regclass('Post') IS NOT NULL AS exists`)[0];
    if (postTableExists && postTableExists.exists) {
      const q2 = await sql.unsafe(`SELECT id, "title" FROM "Post" ORDER BY "createdAt" DESC LIMIT 5`);
      console.log('Recent posts count:', q2.length);
    } else {
      console.log('Post table missing, skipping posts sample');
    }

    console.log('Raw smoke tests completed successfully');
  } catch (err) {
    console.error('Raw smoke test error', err);
    process.exitCode = 1;
  } finally {
    await sql.end();
  }
}

run();
