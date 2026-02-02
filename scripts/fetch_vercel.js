const https = require('https');
const fs = require('fs');

const TOKEN = process.env.VERCEL_TOKEN || 'zbv5XSpOtPqcKAtYHNLodzhj';
const DEPLOYMENT = process.env.VERCEL_DEPLOYMENT || 'dpl_45iQ5hTL2noPXcEWAJ25q1Lay1NZ';

function getRaw(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { Authorization: `Bearer ${TOKEN}` } }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
  });
}

function parseSafe(raw) {
  try {
    return JSON.parse(raw);
  } catch (err) {
    return { __parseError: String(err), raw };
  }
}

(async () => {
  try {
    console.log('Fetching deployment status...');
    const sraw = await getRaw(`https://api.vercel.com/v6/deployments/${DEPLOYMENT}`);
    fs.writeFileSync('vercel_deployment_status_raw.json', JSON.stringify(sraw, null, 2));
    const status = parseSafe(sraw.body);
    fs.writeFileSync('vercel_deployment_status.json', JSON.stringify(status, null, 2));
    console.log('Saved vercel_deployment_status.json (and raw)');

    console.log('Fetching deployment events...');
    const eraw = await getRaw(`https://api.vercel.com/v2/now/deployments/${DEPLOYMENT}/events?limit=500`);
    fs.writeFileSync('vercel_deployment_events_raw.json', JSON.stringify(eraw, null, 2));
    const events = parseSafe(eraw.body);
    fs.writeFileSync('vercel_deployment_events.json', JSON.stringify(events, null, 2));
    console.log('Saved vercel_deployment_events.json (and raw)');

    console.log('\nSummary:');
    console.log(`- deployment id: ${status.uid || status.id || 'unknown'}`);
    console.log(`- state: ${status.state}`);
    if (status.url) console.log(`- url: ${status.url}`);
    if (status.error) console.log(`- error: ${JSON.stringify(status.error)}`);

    const ev = Array.isArray(events) ? events : (events.value || []);
    console.log(`- events fetched: ${ev.length}`);
    console.log('\nLast 10 events:');
    ev.slice(-10).forEach((e) => {
      const t = e.type || (e.payload && e.payload.type) || 'unknown';
      const txt = (e.payload && (e.payload.text || e.payload.message)) || e.message || '';
      console.log(`- ${t}: ${txt}`);
    });
  } catch (err) {
    console.error('Fetch error:', err && (err.stack || err));
    process.exit(2);
  }
})();
