# Cloudflare Workers

## cors-proxy.js

Free-tier CORS proxy that bypasses pearlhash.xyz's Cloudflare bot challenge
(which blocks Vercel datacenter IPs but allows CF-to-CF requests).

Deployed at: `https://akoyacalc-cors.skillmd.workers.dev`

### Deploy
```bash
# Via Cloudflare dashboard: paste cors-proxy.js into a new Worker
# Or via wrangler:
wrangler deploy workers/cors-proxy.js --name akoyacalc-cors
```

### Whitelisted hosts
- pearlhash.xyz, akoyapool.com, pearl.alphapool.tech
- pearlfortune.com, api.dexscreener.com

### Limits
- Free tier: 100k requests/day
- Cache: 30s edge-cache via cf.cacheTtl
