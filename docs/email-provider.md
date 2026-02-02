# Email provider configuration

This project supports sending contact-form notifications via SendGrid (preferred) and falls back to SMTP when SendGrid is not configured.

Environment variables (use in Vercel dashboard / CLI):

- `SENDGRID_API_KEY` — Your SendGrid API key. When present the site will prefer SendGrid.
- `SENDGRID_FROM` — Optional from address used with SendGrid (e.g. `no-reply@yourdomain.com`).
- `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` — SMTP fallback settings.
- `CONTACT_TO` — Destination email address to receive notifications.

Local testing

1. Copy `.env.example` to `.env.local` and fill the values.
2. Run the dev server:

```powershell
npm run dev
```

3. Send a test POST to the contact API:

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"me@example.com","message":"hello"}'
```

Vercel setup

- Open your Vercel project → Settings → Environment Variables and add the variables above for the `Production` environment.
- Alternatively use the Vercel CLI:

```bash
vercel env add SENDGRID_API_KEY production
vercel env add CONTACT_TO production
```

Notes

- If neither `SENDGRID_API_KEY` nor SMTP vars are present the contact API will respond OK locally when stored, but no email will be sent.
- Consider creating a dedicated sending domain (SPF/DKIM) and set `SENDGRID_FROM` to a verified address.
