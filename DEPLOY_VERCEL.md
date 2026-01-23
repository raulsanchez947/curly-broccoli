# Deploying to Vercel (quick guide)

This repository is prepared for Vercel serverless deployment. The project previously included a custom `server.js`; that file has been moved to `server.js.bak` so Next.js runs serverless API routes on Vercel.

Required steps (high level):

1. Provision a production Postgres DB (Vercel Postgres, Supabase, Neon, etc.) and copy its `DATABASE_URL`.
2. In your Vercel project settings → Environment Variables, set these variables for `Production`:
   - `DATABASE_URL` (your Postgres connection string)
   - `NEXTAUTH_URL` (e.g. `https://your-domain.com`)
   - `NEXTAUTH_SECRET` (generate with `openssl rand -hex 32` or similar)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (optional, for contact emails)
   - `ADMIN_EMAILS` (comma-separated admin emails for admin UI)

3. Push this repo to GitHub and connect the GitHub repo to Vercel (Import Project).

4. Migrations:
   - This repo contains a GitHub Actions workflow `.github/workflows/prisma-migrate.yml` that will run `npx prisma migrate deploy` on pushes to `main` using `secrets.DATABASE_URL`.
   - Add `DATABASE_URL` as a GitHub secret if you want migrations run via Actions. Alternatively, run `npx prisma migrate deploy` manually from a machine with `DATABASE_URL` set after provisioning DB.

   5. Recommended local prep (before pushing):

   - Create a branch for deploy prep and commit changes:
   ```bash
   git checkout -b vercel-ready
   git add .
   git commit -m "chore: vercel deploy prep"
   ```

   - Use the included PowerShell helper to run migrations locally after provisioning DB (or run `npx prisma migrate deploy` directly):
   ```powershell
   ./scripts/prisma-deploy-local.ps1 -DatabaseUrl "postgres://..."
   ```

5. Build & deploy:
   - Vercel will run `npm run build` by default (Next.js build). After the build completes the site will be live on your Vercel URL.

6. Smoke test:
   - Sign in (OAuth/provider or credentials), open `/contact`, submit a contact, and verify `/admin/contacts` for saved requests.

Notes:
- If you prefer a Node custom server (Express + Socket.IO) instead of serverless Next API routes, deploy to Render/Fly/Heroku and keep `server.js` (or restore `server.js.bak`).
- Make sure `NEXTAUTH_SECRET` is set to a long random value in production.
