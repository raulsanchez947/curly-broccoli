Steps to switch this project to Neon (Postgres) for production

1) Create a Neon (or other Postgres) database
   - Neon: https://neon.tech/ — create a project and a branch, get the connection string.

2) Set environment variables in Vercel (Project Settings → Environment Variables)
   - `DATABASE_URL` = the Neon connection string (format: `postgresql://...`)
   - `NEXTAUTH_SECRET` = a secure random string
   - (optional) `GOOGLE_ID`, `GOOGLE_SECRET`, `GITHUB_ID`, `GITHUB_SECRET` if using OAuth
   - If using migrations in CI, set `SHADOW_DATABASE_URL` to a separate database or Neon branch for Prisma migrations.

3) Update local `.env` for development (DO NOT COMMIT `.env`)
   - DATABASE_URL="postgresql://..."
   - NEXTAUTH_SECRET=your_dev_secret

4) Apply Prisma migrations
   - Locally (after setting `DATABASE_URL`):
     ```bash
     npx prisma migrate dev --name init
     npx prisma generate
     ```
   - In CI / production (Vercel) run during build:
     ```bash
     npx prisma migrate deploy
     npx prisma generate
     ```
   - Note: `prisma generate` is already run in your `postinstall` and `vercel-build` scripts.

5) Seed data (optional)
   - If you have `scripts/seed.js`, run `node scripts/seed.js` locally or as a post-deploy step.

6) Redeploy on Vercel
   - After adding `DATABASE_URL` + `NEXTAUTH_SECRET`, push to `vercel` branch or redeploy the project.

Notes and troubleshooting
- Do not use SQLite on Vercel serverless (ephemeral file storage). Use Neon/Supabase/PlanetScale.
- If Prisma migration tries to use a shadow DB, provide `SHADOW_DATABASE_URL` to avoid errors.
- If you prefer I can create migration files locally and push them, but I need a temporary DB/connection to run `prisma migrate dev` successfully.

If you'd like, I can:
- Help create a free Neon project and guide you through adding its `DATABASE_URL` to Vercel.
- Run the local migration and push migration files if you provide a temporary DB connection string.
