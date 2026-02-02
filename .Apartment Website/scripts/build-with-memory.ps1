# Build helper: increases Node heap to avoid OOM during Nuxt build on Windows
# Usage: run from `.\.Apartment Website` folder in PowerShell

# Increase Node heap to 4GB (adjust to 8192 for 8GB)
$env:NODE_OPTIONS = '--max-old-space-size=4096'

# Optional: enable Hub migrations during build (only if DB reachable)
# $env:HUB_APPLY_MIGRATIONS = '1'

# Optional: set DATABASE_URL for build-time embedding (redact when sharing logs)
# $env:DATABASE_URL = 'postgresql://neondb_owner:REDACTED@ep-solitary-.../neondb?sslmode=require&channel_binding=require'

Remove-Item -Recurse -Force .\.nuxt -ErrorAction SilentlyContinue
npx pnpm build 2>&1 | Tee-Object -FilePath nuxt-build.log

Write-Host "Build finished. Inspect nuxt-build.log for errors."
Write-Host "Tip: Search for '[build-time] DATABASE_URL present' to confirm env visibility."
