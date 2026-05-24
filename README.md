# Akoya Profit Calculator

Hourly P/L tracker for [Akoya Pool](https://akoyapool.com) (PRL mining).

🌐 **Live**: [TBD]

## Features

- 📊 **Hourly P/L** — Real PRL paid vs hashrate-aware cost
- ⏰ **WIB timezone** (UTC+7)
- 🌍 **Multi-language** — English / Indonesia / 中文
- 💸 **Live data** — Auto-refresh every 60s
- 📱 **Mobile-friendly** — Responsive dropdown, touch-optimized
- 🎯 **Smart cost** — Charged proportional to actual hashrate (rig OFF = no cost)
- 💾 **Persistent** — Wallet, cost, price, language saved to localStorage

## Data Sources

All from [akoyapool.com](https://akoyapool.com) public API:

- `/api/v1/miners/{wallet}` — miner stats
- `/api/v1/miners/{wallet}/payouts` — real PRL payouts
- `/api/v1/miners/{wallet}/hashrate_history` — hashrate per hour
- `/api/v1/pool/stats` — pool global stats
- `/api/v1/pool/luck` — luck ratio
- `/api/v1/pool/blocks` — block history

## How It Works

```
Profit/Loss per hour = (PRL paid that hour × $price) − (cost × hashrate_ratio)
```

- **Active hour** (HR ≥ 5% peak): cost charged proportional to hashrate
- **Idle hour** (HR < 5% peak): no cost charged
- **Total 24h**: sum of all hourly P/L

## Stack

- Pure HTML + Tailwind CDN + vanilla JS — no build step
- ~50KB single file
- CORS-direct fetch (no proxy needed)

## Local Dev

```bash
cd akoya-profit-dashboard
python3 -m http.server 8888
# open http://localhost:8888
```

## Donate

If this tool helped you, consider donating PRL to:
```
prl1pejnmtenn2r72skjhz8a266k58a003tlqxrmtdd7ljw6lcvm4643sz0z027
```

## License

MIT
