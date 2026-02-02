$env:NODE_OPTIONS='--max-old-space-size=4096 --no-deprecation'
$env:VITE_WORKER_THREADS='0'
cd "$PSScriptRoot\.."
npm run build
