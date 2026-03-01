# Stream Vercel deployment events for a specific deployment
# Usage: edit $token/$deploymentId below if needed, then run: powershell -ExecutionPolicy Bypass -File .\stream_vercel.ps1

$token = 'zbv5XSpOtPqcKAtYHNLodzhj'
$deploymentId = 'dpl_9ZDcHoMV32RbxzSRcXAzNkawHN5k'

$headers = @{ Authorization = "Bearer $token" }
$seen = @{}

Write-Host "Starting Vercel event poller for deployment $deploymentId..." -ForegroundColor Cyan

while ($true) {
    try {
        $resp = Invoke-RestMethod -Headers $headers -Uri "https://api.vercel.com/v2/now/deployments/$deploymentId/events?limit=200"
        if ($null -eq $resp) { Start-Sleep -Seconds 3; continue }

        # Events may be in $resp.events or $resp (array)
        $events = $null
        if ($resp.PSObject.Properties.Name -contains 'events') { $events = $resp.events } else { $events = $resp }

        foreach ($e in $events) {
            $id = $e.id
            if (-not $id) { $id = ($e.payload.id -as [string]) }
            if ($null -eq $id) { continue }
            if ($seen.ContainsKey($id)) { continue }
            $seen[$id] = $true

            $created = $null
            if ($e.created) { $created = [DateTimeOffset]::FromUnixTimeMilliseconds([int64]$e.created).ToString('u') }
            elseif ($e.payload -and $e.payload.date) { $created = [DateTimeOffset]::FromUnixTimeMilliseconds([int64]$e.payload.date).ToString('u') }
            else { $created = (Get-Date).ToString('u') }

            $type = $e.type
            if (-not $type -and $e.payload -and $e.payload.info -and $e.payload.info.type) { $type = $e.payload.info.type }

            $text = $null
            if ($e.payload -and $e.payload.text) { $text = $e.payload.text }
            elseif ($e.output) { $text = $e.output }

            if ($text) {
                $lines = $text -split "\r?\n"
                foreach ($line in $lines) {
                    if ($line -ne '') { Write-Host ("[{0}] {1}: {2}" -f $created, $type, $line) }
                }
            } else {
                Write-Host ("[{0}] {1} (no text)" -f $created, $type) -ForegroundColor Yellow
            }
        }
    } catch {
        Write-Host "Error fetching events: $_" -ForegroundColor Red
    }
    Start-Sleep -Seconds 3
}
