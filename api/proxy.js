export default async function handler(req, res) {
  const target = req.query.url;
  if (!target) {
    res.status(400).json({ error: 'Missing ?url= parameter' });
    return;
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  try {
    const r = await fetch(target, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(15000),
    });
    const contentType = r.headers.get('content-type') || 'application/json';
    res.setHeader('Content-Type', contentType);
    res.status(r.status);
    const body = await r.text();
    res.send(body);
  } catch (e) {
    res.status(502).json({ error: 'Proxy error: ' + e.message });
  }
}
