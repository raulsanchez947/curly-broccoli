Deployment and local-build instructions

Local quick build (no DB migrations):

1. In PowerShell:

   $env:NODE_OPTIONS="--max-old-space-size=4096"
   npx pnpm@latest install
   # build script skips migrations when POSTGRES_URL/DATABASE_URL is unset
   npx pnpm@latest build

Build with Neon migrations (production/CI):

1. Set your Neon URL (example):

   $env:POSTGRES_URL = "postgresql://neondb_owner:YOUR_PASSWORD@ep-...-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

2. Run:

   npx pnpm@latest build

Deploy on Vercel (recommended as separate project):

1. Create a new Vercel project and point it at this folder (`nextjs-ai-chatbot/nextjs-ai-chatbot-main`).
2. In Vercel Project Settings > Environment Variables, add:
   - `POSTGRES_URL` (or `DATABASE_URL`) = your Neon connection string
   - `AI_GATEWAY_API_KEY` and `BLOB_READ_WRITE_TOKEN` if required
3. Set the Build Command to `pnpm build` and Output Directory to `.next` (default for Next.js).
4. Deploy. After deploy, set `NEXT_PUBLIC_CHATBOT_URL` in your main site to the deployed URL.

Notes:
- Running migrations during deploy requires a valid `POSTGRES_URL` and reachable DB.
- For local dev builds that only need the frontend, leave `POSTGRES_URL` unset so migrations are skipped.
- If you hit memory errors during build, increase `NODE_OPTIONS` heap size further.
