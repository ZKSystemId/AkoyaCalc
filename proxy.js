const http = require('http');
const https = require('https');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const target = parsed.query.url;
  
  if (!target) {
    res.writeHead(400, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
    res.end('Missing ?url= parameter');
    return;
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const proto = target.startsWith('https') ? https : http;
  proto.get(target, { timeout: 15000 }, (r) => {
    res.writeHead(r.statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    r.pipe(res);
  }).on('error', (e) => {
    res.writeHead(502, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
    res.end('Proxy error: ' + e.message);
  }).on('timeout', () => {
    res.writeHead(504, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
    res.end('Timeout');
  });
});

server.listen(8766, () => console.log('CORS proxy on http://localhost:8766'));
