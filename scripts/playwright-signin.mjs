import { chromium } from 'playwright';

(async ()=>{
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  try{
    console.log('Navigating to sign-in page...');
    await page.goto('http://localhost:3000/auth/signin', { waitUntil: 'networkidle' });

    // fill fields (ids added earlier)
    await page.fill('#identifier', 'raulsanchez947@gmail.com');
    await page.fill('#password', 'devpassword');

    // submit the form - click the submit button
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 8000 }).catch(()=>null),
      page.click('button[type=submit]')
    ]);

    // check session via API
    const session = await page.evaluate(async ()=>{
      const r = await fetch('/api/auth/session', { credentials: 'same-origin' });
      try{ return await r.json(); }catch(e){ return { status: r.status, ok: r.ok } }
    });

    console.log('Session:', JSON.stringify(session, null, 2));

    // test protected API /api/contacts
    const contacts = await page.evaluate(async ()=>{
      const r = await fetch('/api/contacts', { credentials: 'same-origin' });
      return { status: r.status, ok: r.ok, body: await (r.ok ? r.json() : Promise.resolve(null)) }
    });

    console.log('Contacts:', JSON.stringify(contacts, null, 2));
  }catch(err){
    console.error('Test error:', err);
  }finally{
    await browser.close();
  }
})();
