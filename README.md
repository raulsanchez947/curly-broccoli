# Apartment Advisor (scaffold)

Local development scaffold for an apartment advice site. Includes:

- Next.js + TypeScript
- Tailwind CSS
- Prisma (SQLite) schema for posts/users
- Simple community posting API
- Public user-to-user chat (messages stored in the database)

Quickstart

1. Copy `.env.example` to `.env.local`.
2. Install dependencies:

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Notes

- This is a starter scaffold. You should configure `next-auth` and provider credentials for authentication and set a secure `NEXTAUTH_SECRET`.
- The chat endpoint is a public, DB-backed message feed. Sign in to post messages.

NextAuth setup

- Install the NextAuth Prisma adapter (already added to `package.json`).
- Add provider credentials to `.env.local` (example):

```
GITHUB_ID=your_id
GITHUB_SECRET=your_secret
GOOGLE_ID=your_id
GOOGLE_SECRET=your_secret
NEXTAUTH_SECRET=some_long_secret
```

- After adding env values run:

```bash
npx prisma generate
npx prisma migrate dev --name add_auth
```

Quick local auth testing

- For fast local testing without creating OAuth apps, enable the dev credentials provider by copying `.env.example` to `.env.local` and setting:

```dotenv
DEV_AUTH=true
DEV_AUTH_EMAIL=dev@local
DEV_AUTH_PASSWORD=devpassword
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=some_long_secret
```

- Start your dev server: `npm run dev` and use the Sign in flow → choose "Development" and enter the email/password above.
- Optionally create the dev user record in the DB so the Prisma adapter has a user row (the provider will create one on first sign-in, but you can pre-create it):

```bash
npx prisma generate
node scripts/create-dev-user.mjs
```

- You can also run the automated API tests which create a session cookie and test protected endpoints:

```bash
node scripts/api-tests.mjs
```

Note: The previous real-time chat (Socket.IO) has been retired in this branch. The app now uses a contact form for messages and a landlord resources page. If you need realtime features restored, the server and client must be re-enabled and Socket.IO packages added.

Security note: the `DEV_AUTH` credentials provider is intended for local development only. Do not enable it in production or commit real credentials.

The API route for authentication is at `/api/auth/[...nextauth]` and uses the Prisma adapter.

Admin moderation

- To allow admin users to review reported posts, set `ADMIN_EMAILS` in `.env.local` to a comma-separated list of admin email addresses. Example:

```
ADMIN_EMAILS=admin@example.com,owner@example.com
```

- Visit `/admin` after signing in with an admin email to review reported posts, unreport them, or delete them.

Role-based admin

- The app now supports a role-based `isAdmin` flag on the `User` model. To mark a user as admin, update the user record in the database after migrating:

```bash
npx prisma migrate dev --name add_isAdmin

# then open a Node REPL or use a DB browser and set user.isAdmin = true for the desired user
```

Chat and moderation

- The chat endpoint is a simple public message feed backed by the database. For production you should add moderation, content filtering, and rate-limiting (for example a Redis-backed limiter).

Final notes

- After you change the Prisma schema, run `npx prisma generate` and `npx prisma migrate dev` to apply migrations and regenerate the client.

Chat migration notes

- The project uses a `Message` model to store public chat messages. After pulling changes run the migration commands above to add the table to your local DB.

GitHub OAuth setup

1. Go to GitHub Settings → Developer settings → OAuth Apps → New OAuth App.
2. Set "Application name" and "Homepage URL" (e.g. `http://localhost:3000`).
3. For "Authorization callback URL" set:

```
http://localhost:3000/api/auth/callback/github
```

4. After creating the app copy `Client ID` and `Client Secret` into your `.env.local` as `GITHUB_ID` and `GITHUB_SECRET`.
5. Restart the dev server. Sign in via the GitHub button (`Sign in`) which triggers NextAuth.

Notes:
- Ensure `NEXTAUTH_URL` is set to your app URL (e.g. `http://localhost:3000`) before creating the OAuth app.
- For a deployed site, use your production URL in both `NEXTAUTH_URL` and the GitHub app callback URL.

Make a user admin

- After creating a user via sign-in, mark them as admin with the helper script:

```bash
# ensure your `.env.local` is set and migrations have run
npm run make-admin you@example.com
```

This sets the `isAdmin` flag on the user record so they can access the `/admin` review UI.

Seeding sample content

- To populate the DB with example posts for development run:

```bash
npm run seed
```

- Sample guides and lease resources are included in `content/guides.md` and `resources/leases.md`.
