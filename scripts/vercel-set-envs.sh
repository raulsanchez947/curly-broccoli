#!/usr/bin/env bash
# Helper: commands to set recommended env vars in Vercel using the Vercel CLI.
# Run these interactively; replace values or omit to be prompted.

echo "Run the following commands to add environment variables to your Vercel project."
echo "Replace <value> with the real secret."

cat <<'EOF'
vercel env add DATABASE_URL production
vercel env add SENDGRID_API_KEY production
vercel env add SENDGRID_FROM production
vercel env add CONTACT_TO production
vercel env add SMTP_HOST production
vercel env add SMTP_PORT production
vercel env add SMTP_USER production
vercel env add SMTP_PASS production
vercel env add EMAIL_DOMAIN production
vercel env add GOOGLE_ID production
vercel env add GOOGLE_SECRET production
EOF

echo "If you prefer to set secrets via the Vercel web UI, open your project -> Settings -> Environment Variables."
