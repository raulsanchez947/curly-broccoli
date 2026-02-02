const https = require('https');

const TOKEN = process.env.VERCEL_TOKEN;
const DEPLOYMENT = process.env.VERCEL_DEPLOYMENT;
if (!TOKEN || !DEPLOYMENT) {
  console.error('Usage: set VERCEL_TOKEN and VERCEL_DEPLOYMENT env vars');
  process.exit(2);
}

function getJson(path) {
  return new Promise((resolve, reject) => {
    const url = `https://api.vercel.com${path}`;
    https.get(url, { headers: { Authorization: `Bearer ${TOKEN}` } }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error(`JSON parse error for ${url}: ${err.message}`));
        }
      });
    }).on('error', reject);
  });
}

(async () => {
  console.log(`Streaming events for ${DEPLOYMENT} (poll every 3s). Ctrl-C to stop.`);
  const seen = new Set();
  while (true) {
    try {
      const events = await getJson(`/v2/now/deployments/${DEPLOYMENT}/events?limit=500`);
      const list = Array.isArray(events) ? events : (events.value || []);
      for (const e of list) {
        const id = e.id || (e.payload && e.payload.id) || JSON.stringify(e).slice(0,40);
        if (seen.has(id)) continue;
        seen.add(id);
        const ts = e.created ? new Date(Number(e.created)) : new Date();
        const t = e.type || (e.payload && e.payload.type) || 'event';
        const text = (e.payload && (e.payload.text || e.payload.message)) || e.message || '';
        console.log(`[${ts.toLocaleString()}] ${t}: ${text}`);
      }
    } catch (err) {
      console.error('Events fetch error:', err.message || err);
    }

    try {
      const status = await getJson(`/v6/deployments/${DEPLOYMENT}`);
      const state = status.state || status.readyState || 'unknown';
      if (state === 'READY' || state === 'ERROR' || state === 'CANCELED') {
        console.log(`Deployment finished with state: ${state}`);
        if (status.url) console.log(`URL: ${status.url}`);
        if (state === 'ERROR') console.error('Deployment error details saved to vercel_deployment_status.json');
        // Save final status & all events to files
        const fs = require('fs');
        fs.writeFileSync('vercel_deployment_status_final.json', JSON.stringify(status, null, 2));
        try {
          const eventsAll = await getJson(`/v2/now/deployments/${DEPLOYMENT}/events?limit=500`);
          fs.writeFileSync('vercel_deployment_events_final.json', JSON.stringify(eventsAll, null, 2));
        } catch (e) {
          console.error('Failed saving final events:', e.message || e);
        }
        break;
      } else {
        // still building
      }
    } catch (err) {
      console.error('Status fetch error:', err.message || err);
    }

    await new Promise((r) => setTimeout(r, 3000));
  }
})();
