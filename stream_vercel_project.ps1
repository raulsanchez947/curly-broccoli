# Poll the project for new deployments and print events when a new deployment appears
$token = 'zbv5XSpOtPqcKAtYHNLodzhj'
$projectId = 'prj_mT5dToAV5fAhiPt0yxcWzA7mYR4F'
$headers = @{ Authorization = "Bearer $token" }
$last = $null
Write-Host "Starting project poller for project $projectId..." -ForegroundColor Cyan
while ($true) {
    try {
        $d = Invoke-RestMethod -Headers $headers -Uri "https://api.vercel.com/v6/deployments?projectId=$projectId&limit=1"
        if ($d.deployments -and $d.deployments.Count -gt 0) {
            $uid = $d.deployments[0].uid
            if ($uid -ne $last) {
                Write-Host "New deployment detected: $uid - $($d.deployments[0].url)" -ForegroundColor Green
                $last = $uid
                $events = Invoke-RestMethod -Headers $headers -Uri "https://api.vercel.com/v2/now/deployments/$uid/events?limit=200"
                if ($events.events) {
                    foreach ($e in $events.events) {
                        $text = $null
                        if ($e.payload -and $e.payload.text) { $text = $e.payload.text }
                        elseif ($e.output) { $text = $e.output }
                        $created = if ($e.created) { [DateTimeOffset]::FromUnixTimeMilliseconds([int64]$e.created).ToString('u') } else { (Get-Date).ToString('u') }
                        $type = $e.type
                        if (-not $type -and $e.payload -and $e.payload.info -and $e.payload.info.type) { $type = $e.payload.info.type }
                        if ($text) {
                            $lines = $text -split "\r?\n"
                            foreach ($line in $lines) { if ($line -ne '') { Write-Host ("[{0}] {1}: {2}" -f $created, $type, $line) } }
                        } else {
                            Write-Host ("[{0}] {1} (no text)" -f $created, $type) -ForegroundColor Yellow
                        }
                    }
                } else { Write-Host "No events for deployment $uid" }
            }
        }
    } catch {
        Write-Host "Error polling project: $_" -ForegroundColor Red
    }
    Start-Sleep -Seconds 10
}
