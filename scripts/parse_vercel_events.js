const fs = require('fs');
const path = 'vercel_events_now.json';
if (!fs.existsSync(path)) {
  console.error('vercel_events_now.json not found');
  process.exit(2);
}
const raw = fs.readFileSync(path,'utf8');
let events;
try {
  events = JSON.parse(raw);
} catch (e) {
  const first = raw.indexOf('[');
  const last = raw.lastIndexOf(']');
  if (first === -1 || last === -1 || last <= first) {
    console.error('JSON parse error', e.message);
    process.exit(2);
  }
  const slice = raw.slice(first, last + 1);
  try { events = JSON.parse(slice); } catch (e2) { console.error('Fallback JSON parse failed', e2.message); process.exit(2); }
}
const stderr = events.filter(e => e.type === 'stderr' || (e.payload && e.payload && e.payload.text && String(e.payload.text).toLowerCase().includes('error')));
if (!stderr.length) { console.log('No stderr entries found'); process.exit(0); }
const uniq = new Map();
stderr.forEach(e => {
  const text = e.payload && e.payload.text ? (Array.isArray(e.payload.text) ? e.payload.text.join('\n') : String(e.payload.text)) : (e.message || '');
  const key = text.trim().slice(0,400);
  if (!uniq.has(key)) uniq.set(key, []);
  uniq.get(key).push({ time: e.created, text });
});
console.log('Found', stderr.length, 'stderr entries,', uniq.size, 'unique messages');
console.log('\n--- Unique messages (short) ---');
let i=0;
for (const [k,v] of uniq.entries()){
  i++;
  console.log(`\n[${i}] SAMPLE: ${k.split('\n')[0].slice(0,200)}`);
}
console.log('\n--- Last 40 stderr entries ---');
stderr.slice(-40).forEach(e=>{
  const t = e.created ? new Date(Number(e.created)).toLocaleString() : 'unknown';
  const text = e.payload && e.payload.text ? (Array.isArray(e.payload.text)? e.payload.text.join('\n') : String(e.payload.text)) : (e.message||'');
  console.log(`\n[${t}] ${text}`);
});
fs.writeFileSync('vercel_stderr_summary.json', JSON.stringify({ total: stderr.length, unique: uniq.size, entries: stderr.slice(-200) }, null, 2));
console.log('\nWrote vercel_stderr_summary.json');
