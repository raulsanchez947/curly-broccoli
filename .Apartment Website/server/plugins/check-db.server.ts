// Ensure DATABASE_URL is present in production to avoid trying to open a local SQLite file
if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
  // Log a clear message and throw so the runtime fails with a helpful message
  console.error('Missing DATABASE_URL in production. Set the DATABASE_URL environment variable to your Postgres/Neon connection string.');
  throw new Error('Missing DATABASE_URL in production');
}

export {};
