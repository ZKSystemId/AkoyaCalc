// Local CORS proxy — robust version
// Survives client disconnect, large payloads, slow upstreams
const http = require('http');
const https = require('https');
const url = require('url');

process.on('uncaughtException', (e) => console.error('[uncaught]', e.message));
process.on('unhandledRejection', (e) => console.error('[unhandled]', e));

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const target = parsed.query.url;

  // CORS headers always
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  if (!target) { res.writeHead(400); res.end('Missing ?url= parameter'); return; }

  const proto = target.startsWith('https') ? https : http;
  const upstreamReq = proto.get(target, {
    timeout: 30000,
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AkoyaCalc-proxy)' }
  }, (upstream) => {
    res.writeHead(upstream.statusCode || 502, {
      'Content-Type': upstream.headers['content-type'] || 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    upstream.pipe(res);
    upstream.on('error', (e) => { console.error('[upstream]', e.message); try { res.end(); } catch {} });
  });

  upstreamReq.on('error', (e) => {
    console.error('[req-err]', target, e.message);
    if (!res.headersSent) res.writeHead(502);
    try { res.end('Proxy error: ' + e.message); } catch {}
  });
  upstreamReq.on('timeout', () => {
    upstreamReq.destroy();
    console.error('[timeout]', target);
    if (!res.headersSent) res.writeHead(504);
    try { res.end('Timeout'); } catch {}
  });

  // If client aborts, abort upstream too
  req.on('close', () => { try { upstreamReq.destroy(); } catch {} });
  req.on('error', () => { try { upstreamReq.destroy(); } catch {} });
});

server.on('clientError', (err, socket) => {
  try { socket.end('HTTP/1.1 400 Bad Request\r\n\r\n'); } catch {}
});

server.listen(8766, '127.0.0.1', () => console.log('CORS proxy on http://127.0.0.1:8766'));
