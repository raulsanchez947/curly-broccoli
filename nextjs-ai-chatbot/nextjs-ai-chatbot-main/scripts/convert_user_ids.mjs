import postgres from 'postgres';

const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
if (!url) {
  console.error('POSTGRES_URL / DATABASE_URL not set in environment.');
  process.exit(2);
}

const sql = postgres(url, { ssl: 'require' });

console.log('Starting non-destructive conversion of text User.id -> uuid');

try {
  await sql.begin(async (tx) => {
    console.log('Enabling pgcrypto extension (if available)...');
    await tx`CREATE EXTENSION IF NOT EXISTS pgcrypto`;

    console.log('Adding id_uuid to "User"...');
    await tx`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS id_uuid uuid DEFAULT gen_random_uuid()`;

    console.log('Populating id_uuid for existing users...');
    await tx`UPDATE "User" SET id_uuid = coalesce(id_uuid, gen_random_uuid())`;

    const mappings = [
    { table: 'Account', col: 'userId' },
    { table: 'Session', col: 'userId' },
    { table: 'Post', col: 'authorId' },
    { table: 'Message', col: 'authorId' },
    { table: 'ConversationParticipant', col: 'userId' },
    { table: 'MessageRead', col: 'userId' },
    { table: 'MessageReaction', col: 'userId' },
    { table: 'Contact', col: 'ownerId' },
    { table: 'Contact', col: 'contactId' }
  ];

    for (const m of mappings) {
      console.log(`Adding ${m.col}_uuid to ${m.table}...`);
      await tx.unsafe(`ALTER TABLE "${m.table}" ADD COLUMN IF NOT EXISTS "${m.col}_uuid" uuid`);
      console.log(`Populating ${m.col}_uuid from mapping join...`);
      await tx.unsafe(`UPDATE "${m.table}" t SET "${m.col}_uuid" = u.id_uuid FROM "User" u WHERE t."${m.col}" = u.id`);
    }

    console.log('Dropping foreign key constraints referencing old User.id...');
    const dropCommands = [
    `ALTER TABLE "Account" DROP CONSTRAINT IF EXISTS "Account_userId_fkey"`,
    `ALTER TABLE "Session" DROP CONSTRAINT IF EXISTS "Session_userId_fkey"`,
    `ALTER TABLE "Post" DROP CONSTRAINT IF EXISTS "Post_authorId_fkey"`,
    `ALTER TABLE "Message" DROP CONSTRAINT IF EXISTS "Message_authorId_fkey"`,
    `ALTER TABLE "ConversationParticipant" DROP CONSTRAINT IF EXISTS "ConversationParticipant_userId_fkey"`,
    `ALTER TABLE "MessageRead" DROP CONSTRAINT IF EXISTS "MessageRead_userId_fkey"`,
    `ALTER TABLE "MessageReaction" DROP CONSTRAINT IF EXISTS "MessageReaction_userId_fkey"`,
    `ALTER TABLE "Contact" DROP CONSTRAINT IF EXISTS "Contact_ownerId_fkey"`,
    `ALTER TABLE "Contact" DROP CONSTRAINT IF EXISTS "Contact_contactId_fkey"`
  ];
    for (const cmd of dropCommands) {
      console.log(cmd);
      await tx.unsafe(cmd);
    }

    console.log('Swapping columns: dropping old cols and renaming new uuid cols...');
    for (const m of mappings) {
      const table = m.table;
      const col = m.col;
      console.log(`Altering ${table}: drop ${col}, rename ${col}_uuid -> ${col}`);
      await tx.unsafe(`ALTER TABLE "${table}" DROP COLUMN IF EXISTS "${col}"`);
      await tx.unsafe(`ALTER TABLE "${table}" RENAME COLUMN "${col}_uuid" TO "${col}"`);
    }

    console.log('Swapping User id column...');
    await tx.unsafe(`ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_pkey"`);
    await tx.unsafe(`ALTER TABLE "User" DROP COLUMN IF EXISTS "id"`);
    await tx.unsafe(`ALTER TABLE "User" RENAME COLUMN "id_uuid" TO "id"`);
    await tx.unsafe(`ALTER TABLE "User" ADD PRIMARY KEY (id)`);
    await tx.unsafe(`ALTER TABLE "User" ALTER COLUMN id SET DEFAULT gen_random_uuid()`);

    console.log('Re-creating foreign key constraints to new uuid User.id...');
    const addFk = [
    `ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE CASCADE`,
    `ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE CASCADE`,
    `ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE CASCADE`,
    `ALTER TABLE "Message" ADD CONSTRAINT "Message_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE CASCADE`,
    `ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE CASCADE`,
    `ALTER TABLE "MessageRead" ADD CONSTRAINT "MessageRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE CASCADE`,
    `ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE CASCADE`,
    `ALTER TABLE "Contact" ADD CONSTRAINT "Contact_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE CASCADE`,
    `ALTER TABLE "Contact" ADD CONSTRAINT "Contact_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE CASCADE`
  ];
    for (const cmd of addFk) {
      console.log(cmd);
      await tx.unsafe(cmd);
    }
  });

  console.log('Conversion completed successfully.');
  await sql.end();
} catch (err) {
  console.error('Conversion failed.');
  console.error(err);
  try { await sql.end(); } catch (e) {}
  process.exit(1);
}
