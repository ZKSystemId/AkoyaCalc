// Cloudflare Worker: CORS proxy for pearlhash.xyz (and friends)
// Deploy: wrangler deploy
// Usage: GET https://akoyacalc-cors.<account>.workers.dev/?url=https://pearlhash.xyz/api/stats
//
// Free tier: 100k req/day, ~10ms latency, immune to CF bot challenges (CF→CF allowed)

const ALLOWED_HOSTS = [
  'pearlhash.xyz',
  'akoyapool.com',
  'pool-v2.akoyapool.com',
  'pearl.alphapool.tech',
  'alphapool.tech',
  'pearlfortune.com',
  'api.dexscreener.com',
];

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '*';

    // CORS headers
    const cors = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    const target = url.searchParams.get('url');
    if (!target) {
      return new Response(JSON.stringify({ error: 'Missing ?url= parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    let targetUrl;
    try {
      targetUrl = new URL(target);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid URL' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    // Whitelist enforcement
    if (!ALLOWED_HOSTS.includes(targetUrl.hostname)) {
      return new Response(JSON.stringify({ error: `Host not whitelisted: ${targetUrl.hostname}` }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    // Forward request
    try {
      const upstream = await fetch(target, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AkoyaCalc-Proxy/1.0)',
          'Accept': 'application/json',
        },
        cf: {
          cacheTtl: 30,
          cacheEverything: true,
        },
      });

      const body = await upstream.text();
      const headers = new Headers(cors);
      headers.set('Content-Type', upstream.headers.get('Content-Type') || 'application/json');
      headers.set('Cache-Control', 'public, max-age=30, s-maxage=30');
      return new Response(body, { status: upstream.status, headers });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Upstream error: ' + e.message }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }
  },
};
