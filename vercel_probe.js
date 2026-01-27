(async () => {
  try {
    const urlBase = 'https://nextjs-ai-chatbot-main-dyhh9came-rauls-projects-76a8ba4b.vercel.app';
    const bypass = 'TZSr6WNsUGy2M0QMH1REntHklEYTTPaA';

    // 1) Try header-based bypass (some setups accept header and return jwt)
    console.log('Trying header-based bypass...');
    let res = await fetch(urlBase + '/', { headers: { 'x-vercel-protection-bypass': bypass }, redirect: 'manual' });
    console.log('Header probe status:', res.status);
    let setCookie = res.headers.get('set-cookie');
    console.log('Header probe set-cookie:', setCookie);

    if (!setCookie) {
      // Follow redirect (some setups respond with 307 then set cookie)
      console.log('Following redirect for header-based probe...');
      const res2 = await fetch(urlBase + '/', { headers: { 'x-vercel-protection-bypass': bypass }, redirect: 'follow' });
      console.log('Followed status:', res2.status);
      setCookie = res2.headers.get('set-cookie');
      console.log('After follow set-cookie:', setCookie);
    }

    if (!setCookie) {
      // 2) Try query-param bypass which sometimes sets cookie
      console.log('Trying query-param bypass...');
      const probeUrl = `${urlBase}/?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=${bypass}`;
      const res3 = await fetch(probeUrl, { redirect: 'manual' });
      console.log('Query probe status:', res3.status);
      setCookie = res3.headers.get('set-cookie');
      console.log('Query probe set-cookie:', setCookie);
    }

    if (!setCookie) {
      console.error('No set-cookie header received. Deployment still requires auth or token invalid.');
      process.exit(2);
    }

    console.log('\nPosting to /api/chat with cookie using full schema...');
    const { randomUUID } = require('crypto');
    const payload = {
      id: randomUUID(),
      message: {
        id: randomUUID(),
        role: 'user',
        parts: [
          { type: 'text', text: 'hello from probe' }
        ]
      },
      selectedChatModel: 'gpt-4o-mini',
      selectedVisibilityType: 'private'
    };

    const post = await fetch(`${urlBase}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': setCookie
      },
      body: JSON.stringify(payload)
    });
    console.log('POST status:', post.status);
    const txt = await post.text();
    console.log('POST body (truncated 2000 chars):', txt.slice(0, 2000));
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
