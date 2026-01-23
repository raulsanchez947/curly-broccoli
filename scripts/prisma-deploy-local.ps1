Param(
  [string]$DatabaseUrl
)

if (-not $DatabaseUrl) {
  Write-Host "Usage: .\prisma-deploy-local.ps1 -DatabaseUrl 'postgres://user:pass@host:5432/db'"
  exit 1
}

$env:DATABASE_URL = $DatabaseUrl
Write-Host "Running prisma migrate deploy against $env:DATABASE_URL"
npx prisma migrate deploy
