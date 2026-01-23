# Vercel Postgres vs Supabase — Quick guide

This short guide helps you choose and provision a Postgres database for your Vercel deployment.

Options
- Vercel Postgres: built-in, easy to connect via `DATABASE_URL`, scales with Vercel account tiers. Recommended for simplest integration.
- Supabase: full managed Postgres + auth + storage. Good if you want an admin UI and extras (Realtime, Edge functions).
- Neon/Render: alternatives offering serverless Postgres or managed Postgres.

Provisioning (Vercel Postgres)
1. In Vercel dashboard, open your project → Resources → Add Postgres.
2. Choose a plan (Hobby is fine for small sites). Create the database.
3. In the Vercel UI, copy the `DATABASE_URL` (connection string).
4. Add `DATABASE_URL` to Vercel Environment Variables (Production). Also add to GitHub secrets if you use the Actions workflow.

Provisioning (Supabase)
1. Create a Supabase project at https://app.supabase.com.
2. After project creation, go to Settings → Database → Connection Pooling to find the `Connection string`.
3. Copy it and set it as `DATABASE_URL` in Vercel Environment Variables and GitHub Secrets.

Prisma migrations
- You can run migrations manually from your machine (with `DATABASE_URL` set) or via the GitHub Actions workflow in `.github/workflows/prisma-migrate.yml`.

Local migration commands (example):
```bash
# Install dependencies
npm ci

# Create migration locally (if you change schema locally)
npx prisma migrate dev --name my-change --preview-feature

# Deploy migrations to production DB
DATABASE_URL="postgres://..." npx prisma migrate deploy
```

Notes
- Keep `DATABASE_URL` secret. Use Vercel Environment Variables for production.
- If you use Vercel Postgres, you can also create read replicas and backups from the Vercel UI.
