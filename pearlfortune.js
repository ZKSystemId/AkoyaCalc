// ============ POOL CONFIG ============
const POOLS = {
  akoya: { name: "Akoya", url: "akoya.html" },
  pearlhash: { name: "Pearlhash", url: "pearlhash.html" },
  alphapool: { name: "AlphaPool", url: "alphapool.html" },
  pearlfortune: { name: "Pearl Fortune", url: "pearlfortune.html" },
};
let currentPool = "pearlfortune";
const API = "https://pearlfortune.org/api/v1";
const corsProxy = (url) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(url)}`;
const corsProxyFallback = (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`;
const corsProxyFallback2 = (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
const STORAGE_KEY = "pearlfortune_hybrid_pl_settings";
const POOL_KEY = "pearlfortune";
const ATOMIC_UNITS = 1e8;

// ============ I18N ============
const I18N = {
  en: {
    app_title: "Calc Your Pool — Pearl Fortune",
    app_subtitle: "PPS · Per-Block · Hashrate-aware",
    hero_brand: "Pearl Fortune",
    hero_suffix: "Tracker",
    setup_kicker: "Welcome",
    setup_title: "Calc Your Pool",
    setup_subtitle: "Enter your mining setup to start tracking real-time profit/loss.",
    setup_save: "Save & Start Tracking",
    setup_footnote: "All settings stored locally in your browser. No account, no signup.",
    nav_dashboard: "Dashboard", nav_workers: "Workers", nav_rewards: "Rewards", nav_blocks: "Blocks", nav_settings: "Settings",
    wallet_address: "Wallet Address", cost_per_hr: "Cost $/hr", prl_price: "PRL Price $",
    refresh: "Refresh", status_ready: "Ready.",
    hashrate: "Hashrate", live: "live", pool_share: "Pool Share", of_pool: "of pool",
    workers: "Workers", online: "online", total_paid: "Total Paid", all_time: "all time",
    profit_loss: "📦 Profit / Loss", prl_minus_cost: "PRL paid − cost",
    total_pl_label: "Total Profit / Loss", revenue: "Revenue",
    period_1h: "over 1 hour", period_6h: "over 6 hours", period_12h: "over 12 hours", period_24h: "over 24 hours",
    insight: "📊 Insight", best_hour: "Best Hour", worst_hour: "Worst Hour", hours_payout: "Hours w/ Payout", total_prl_24h: "Total PRL", total_blocks_period: "Total Blocks",
    hourly_breakdown: "Hourly Breakdown",
    chart_label: "Visualization",
    profit: "Profit", loss: "Loss", future: "Future",
    ago_1h: "1h ago", ago_6h: "6h ago", ago_12h: "12h ago", ago_24h: "24h ago", now: "now",
    legend_title: "📖 Column Legend",
    legend_profit: "profit (revenue bigger than cost)",
    legend_loss: "loss (cost bigger than revenue)",
    th_hour: "Hour (WIB)", th_hr: "HR", th_prl_paid: "PRL", th_cost: "Cost", th_pl: "P/L", th_revenue: "Revenue", th_epoch: "Epoch", th_credit_prl: "Credit (PRL)",
    loading: "Loading...",
    workers_title: "Connected Workers", workers_sub: "Live status of your mining rigs",
    th_worker: "Worker", th_hashrate: "Hashrate", th_shares_1h: "Shares 1h", th_stale: "Stale %", th_last_seen: "Last Seen",
    no_workers: "No workers", active: "active",
    rewards_title: "Rewards", rewards_pending: "Pending", rewards_claimed: "Claimed",
    pending_balance: "Pending", maturing_blocks: "Matured", next_maturity: "Next Maturity", status_label: "Status",
    th_block_height: "Block", th_status: "Status", th_reward: "Reward (PRL)", th_eta: "ETA",
    th_when: "When", th_amount: "Amount (PRL)", th_fee: "Fee", th_tx: "Tx",
    no_pending: "No pending blocks", no_claimed: "No payouts yet",
    blocks_title: "Pool Blocks", blocks_sub: "Recent blocks found by the pool. ⭐ = found by you",
    th_finder: "Finder", th_blocks: "Blk", my_blocks: "Mine:", pool_blocks_label: "Pool:",
    settings_title: "Setup", settings_sub: "Edit wallet, cost, and PRL price.", settings_edit: "Edit Setup",
    pool_stats: "Pool Stats", pool_hashrate: "Pool hashrate", connected_miners: "Connected miners",
    blocks_24h_pool: "Blocks 24h (pool)", pool_luck_24h: "Pool luck 24h", avg_block_reward: "Avg block reward",
    wallet: "Wallet", shares_24h: "Shares 24h",
    cost_adv: "Cost adv", cost_adv_title: "⚙️ Cost Advanced", cost_adv_hint: "Override cost for specific time ranges",
    add_range: "+ Add range", from_label: "From", to_label: "To", cost_label: "$ /hr",
    online_status: "🟢 Online", offline_status: "🔴 Offline",
    error_prefix: "Error: ", fetching: "Fetching data...", updated: "Updated",
    auto_refresh_60s: "Auto-refresh in 60s",
    donate_title: "Support This Tool", donate_sub: "Donate PRL · Tip the dev", copy: "Copy", copied: "Copied!",
    pool_label: "Pool", invalid_wallet: "Wallet must start with 'prl1'",
    switching: "Switching to",
    footer_data: "Data: pearlfortune.org · Auto-refresh 60s · Timezone: WIB (UTC+7)",
    footer_explain: "Profit/Loss = PRL earned × $price − cost. Cost charged flat per hour while mining.",
    total_paid_label: "Total paid",
    last_epoch_label: "Last epoch",
    block_height_label: "Block height",
  },
  id: {
    app_title: "Hitung Pool Kamu — Pearl Fortune",
    app_subtitle: "PPS · Per-Block · Sadar Hashrate",
    hero_brand: "Pearl Fortune",
    hero_suffix: "Tracker",
    setup_kicker: "Selamat Datang",
    setup_title: "Hitung Pool Kamu",
    setup_subtitle: "Masukin setup mining buat mulai tracking profit/loss real-time.",
    setup_save: "Simpan & Mulai Tracking",
    setup_footnote: "Semua setting disimpan lokal di browser kamu. Ga perlu akun, ga perlu signup.",
    nav_dashboard: "Dashboard", nav_workers: "Workers", nav_rewards: "Rewards", nav_blocks: "Blocks", nav_settings: "Setting",
    wallet_address: "Alamat Wallet", cost_per_hr: "Cost $/jam", prl_price: "Harga PRL $",
    refresh: "Refresh", status_ready: "Siap.",
    hashrate: "Hashrate", live: "live", pool_share: "Bagian Pool", of_pool: "dari pool",
    workers: "Workers", online: "online", total_paid: "Total Dibayar", all_time: "all time",
    profit_loss: "📦 Profit / Loss", prl_minus_cost: "PRL dibayar − cost",
    total_pl_label: "Total Profit / Loss", revenue: "Revenue",
    period_1h: "selama 1 jam", period_6h: "selama 6 jam", period_12h: "selama 12 jam", period_24h: "selama 24 jam",
    insight: "📊 Insight", best_hour: "Jam Terbaik", worst_hour: "Jam Terburuk", hours_payout: "Jam ada Payout", total_prl_24h: "Total PRL",
    hourly_breakdown: "Breakdown Per Jam",
    chart_label: "Visualisasi",
    profit: "Profit", loss: "Loss", future: "Belum",
    ago_1h: "1j lalu", ago_6h: "6j lalu", ago_12h: "12j lalu", ago_24h: "24j lalu", now: "sekarang",
    legend_title: "📖 Penjelasan Kolom",
    legend_profit: "profit (revenue lebih besar dari cost)",
    legend_loss: "loss (cost lebih besar dari revenue)",
    th_hour: "Jam (WIB)", th_hr: "HR", th_prl_paid: "PRL", th_cost: "Cost", th_pl: "P/L", th_revenue: "Pendapatan", th_epoch: "Epoch", th_credit_prl: "Credit (PRL)",
    loading: "Loading...",
    workers_title: "Workers Tersambung", workers_sub: "Status real-time rig mining kamu",
    th_worker: "Worker", th_hashrate: "Hashrate", th_shares_1h: "Shares 1j", th_stale: "Stale %", th_last_seen: "Last Seen",
    no_workers: "Ga ada workers", active: "aktif",
    rewards_title: "Rewards", rewards_pending: "Pending", rewards_claimed: "Sudah Cair",
    pending_balance: "Saldo Pending", maturing_blocks: "Matang", next_maturity: "Maturity Berikutnya", status_label: "Status",
    th_block_height: "Block", th_status: "Status", th_reward: "Reward (PRL)", th_eta: "ETA",
    th_when: "Kapan", th_amount: "Jumlah (PRL)", th_fee: "Fee", th_tx: "Tx",
    no_pending: "Ga ada block pending", no_claimed: "Belum ada payout",
    blocks_title: "Block Pool", blocks_sub: "Block terbaru yang ditemukan pool. ⭐ = kamu yang nemu",
    th_finder: "Penemu", th_blocks: "Blok", my_blocks: "Punyaku:", pool_blocks_label: "Pool:",
    settings_title: "Setup", settings_sub: "Edit wallet, cost, dan harga PRL.", settings_edit: "Edit Setup",
    pool_stats: "Statistik Pool", pool_hashrate: "Hashrate pool", connected_miners: "Miner terkoneksi",
    blocks_24h_pool: "Block 24j (pool)", pool_luck_24h: "Luck pool 24j", avg_block_reward: "Reward block rata2",
    wallet: "Wallet", shares_24h: "Shares 24j",
    cost_adv: "Cost adv", cost_adv_title: "⚙️ Cost Advanced", cost_adv_hint: "Override biaya buat range jam tertentu",
    add_range: "+ Tambah range", from_label: "Dari", to_label: "Sampai", cost_label: "$ /jam",
    online_status: "🟢 Online", offline_status: "🔴 Offline",
    error_prefix: "Error: ", fetching: "Mengambil data...", updated: "Diupdate",
    auto_refresh_60s: "Auto-refresh dalam 60d",
    donate_title: "Dukung Tool Ini", donate_sub: "Donasi PRL · Tip developer", copy: "Salin", copied: "Tersalin!",
    pool_label: "Pool", invalid_wallet: "Wallet harus dimulai dengan 'prl1'",
    switching: "Pindah ke",
    footer_data: "Data: pearlfortune.org · Auto-refresh 60d · Zona: WIB (UTC+7)",
    footer_explain: "Profit/Loss = PRL earned × harga$ − cost. Rig OFF = ga ada cost.",
    total_paid_label: "Total dibayar",
    last_epoch_label: "Epoch terakhir",
    block_height_label: "Tinggi block",
  },
  zh: {
    app_title: "计算你的矿池 — Pearl Fortune",
    app_subtitle: "PPS · 每区块 · 算力感知",
    hero_brand: "Pearl Fortune",
    hero_suffix: "追踪器",
    setup_kicker: "欢迎",
    setup_title: "计算你的矿池",
    setup_subtitle: "输入您的挖矿设置以开始跟踪实时盈亏。",
    setup_save: "保存并开始跟踪",
    setup_footnote: "所有设置都存储在您的浏览器本地。无需账户,无需注册。",
    nav_dashboard: "仪表盘", nav_workers: "矿工", nav_rewards: "奖励", nav_blocks: "区块", nav_settings: "设置",
    wallet_address: "钱包地址", cost_per_hr: "成本 $/小时", prl_price: "PRL价格 $",
    refresh: "刷新", status_ready: "就绪。",
    hashrate: "算力", live: "实时", pool_share: "矿池占比", of_pool: "占矿池",
    workers: "矿工", online: "在线", total_paid: "已支付总额", all_time: "全部时间",
    profit_loss: "📦 盈亏", prl_minus_cost: "PRL支付 − 成本",
    total_pl_label: "总盈亏", revenue: "收入",
    period_1h: "过去1小时", period_6h: "过去6小时", period_12h: "过去12小时", period_24h: "过去24小时",
    insight: "📊 分析", best_hour: "最佳小时", worst_hour: "最差小时", hours_payout: "有支付的小时", total_prl_24h: "总PRL", total_blocks_period: "总区块",
    hourly_breakdown: "按小时分解",
    chart_label: "可视化",
    profit: "盈利", loss: "亏损", future: "未来",
    ago_1h: "1小时前", ago_6h: "6小时前", ago_12h: "12小时前", ago_24h: "24小时前", now: "现在",
    legend_title: "📖 列说明",
    legend_profit: "盈利 (收入大于成本)",
    legend_loss: "亏损 (成本大于收入)",
    th_hour: "小时 (WIB)", th_hr: "算力", th_prl_paid: "PRL", th_cost: "成本", th_pl: "盈亏", th_revenue: "收入", th_epoch: "周期", th_credit_prl: "积分 (PRL)",
    loading: "加载中...",
    workers_title: "已连接矿工", workers_sub: "您挖矿设备的实时状态",
    th_worker: "矿工", th_hashrate: "算力", th_shares_1h: "1小时份额", th_stale: "陈旧 %", th_last_seen: "上次见到",
    no_workers: "没有矿工", active: "活跃",
    rewards_title: "奖励", rewards_pending: "待处理", rewards_claimed: "已领取",
    pending_balance: "待处理余额", maturing_blocks: "成熟中", next_maturity: "下次成熟", status_label: "状态",
    th_block_height: "区块", th_status: "状态", th_reward: "奖励 (PRL)", th_eta: "ETA",
    th_when: "时间", th_amount: "金额 (PRL)", th_fee: "手续费", th_tx: "交易",
    no_pending: "没有待处理区块", no_claimed: "暂无支付",
    blocks_title: "矿池区块", blocks_sub: "矿池最近发现的区块。⭐ = 您发现的",
    th_finder: "发现者", th_blocks: "区块", my_blocks: "我的:", pool_blocks_label: "矿池:",
    settings_title: "设置", settings_sub: "编辑钱包、成本和PRL价格。", settings_edit: "编辑设置",
    pool_stats: "矿池统计", pool_hashrate: "矿池算力", connected_miners: "已连接矿工",
    blocks_24h_pool: "24小时区块 (池)", pool_luck_24h: "24小时池运气", avg_block_reward: "平均区块奖励",
    wallet: "钱包", shares_24h: "24小时份额",
    cost_adv: "高级成本", cost_adv_title: "⚙️ 高级成本", cost_adv_hint: "为特定时间段覆盖成本",
    add_range: "+ 添加范围", from_label: "从", to_label: "到", cost_label: "$ /小时",
    online_status: "🟢 在线", offline_status: "🔴 离线",
    error_prefix: "错误: ", fetching: "获取数据中...", updated: "已更新",
    auto_refresh_60s: "60秒后自动刷新",
    donate_title: "支持此工具", donate_sub: "捐赠 PRL · 给开发者打赏", copy: "复制", copied: "已复制!",
    pool_label: "矿池", invalid_wallet: "钱包必须以 'prl1' 开头",
    switching: "切换到",
    footer_data: "数据: pearlfortune.org · 自动刷新60秒 · 时区: WIB (UTC+7)",
    footer_explain: "盈亏 = PRL收入 × 价格$ − 成本。",
    total_paid_label: "总支付",
    last_epoch_label: "上次周期",
    block_height_label: "区块高度",
  },
};

let currentLang = localStorage.getItem("pearlfortune_lang") || "en";
function t(k) { return (I18N[currentLang] && I18N[currentLang][k]) || I18N.en[k] || k; }

function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const val = t(key);
    if (val) el.innerHTML = val;
  });
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === currentLang);
  });
  const labels = { en: "🇬🇧 EN", id: "🇮🇩 ID", zh: "🇨🇳 ZH" };
  const cur = document.getElementById("lang-current");
  if (cur) cur.textContent = labels[currentLang] || "🇬🇧 EN";
  document.documentElement.lang = currentLang;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("pearlfortune_lang", lang);
  applyI18n();
  closeLangMenu();
  if (window._lastWallet) refresh();
}
function toggleLangMenu() {
  const menu = document.getElementById("lang-menu");
  if (menu) menu.classList.toggle("hidden");
  const pmenu = document.getElementById("pool-menu");
  if (pmenu) pmenu.classList.add("hidden");
}
function closeLangMenu() {
  const menu = document.getElementById("lang-menu");
  if (menu) menu.classList.add("hidden");
}

function applyPool() {
  document.querySelectorAll(".pool-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-pool") === currentPool);
  });
}
function setPool(pool) {
  if (!POOLS[pool]) return;
  if (pool === currentPool) { closePoolMenu(); return; }
  localStorage.setItem("pearlfortune_pool", pool);
  closePoolMenu();
  const overlay = document.getElementById("switch-overlay");
  const target = document.getElementById("switch-target");
  if (target) target.textContent = POOLS[pool].name;
  if (overlay) overlay.classList.add("show");
  setTimeout(() => { location.href = POOLS[pool].url; }, 600);
}
function togglePoolMenu() {
  const menu = document.getElementById("pool-menu");
  if (menu) menu.classList.toggle("hidden");
  const lmenu = document.getElementById("lang-menu");
  if (lmenu) lmenu.classList.add("hidden");
}
function closePoolMenu() {
  const menu = document.getElementById("pool-menu");
  if (menu) menu.classList.add("hidden");
}

// ============ HELPERS ============
function fmtHash(h) {
  if (!h) return "—";
  if (h >= 1e18) return (h/1e18).toFixed(2) + " EH/s";
  if (h >= 1e15) return (h/1e15).toFixed(2) + " PH/s";
  if (h >= 1e12) return (h/1e12).toFixed(2) + " TH/s";
  if (h >= 1e9) return (h/1e9).toFixed(2) + " GH/s";
  return (h/1e6).toFixed(2) + " MH/s";
}
function fmtNum(n, dec=2) {
  if (n == null || isNaN(n)) return "—";
  return Number(n).toLocaleString("en-US", {minimumFractionDigits: dec, maximumFractionDigits: dec});
}
function fmtAge(ts) {
  if (!ts) return "—";
  const sec = Math.floor(Date.now()/1000 - ts);
  if (sec < 60) return sec + "s ago";
  if (sec < 3600) return Math.floor(sec/60) + "m ago";
  if (sec < 86400) return Math.floor(sec/3600) + "h ago";
  return Math.floor(sec/86400) + "d ago";
}
function fmtDuration(sec) {
  if (sec < 60) return sec + "s";
  if (sec < 3600) return Math.floor(sec/60) + "m";
  const h = Math.floor(sec/3600);
  const m = Math.floor((sec%3600)/60);
  return m > 0 ? h + "h " + m + "m" : h + "h";
}
function fmtPL(amount) {
  if (Math.abs(amount) < 0.01) return "$0.00";
  if (amount > 0) return "+$" + fmtNum(amount, 2);
  return "-$" + fmtNum(Math.abs(amount), 2);
}
function setText(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }

// ============ MODERN SVG CHART ============
function renderModernChart(buckets) {
  const svg = document.getElementById("hour-chart");
  const tip = document.getElementById("chart-tooltip");
  if (!svg || !buckets || !buckets.length) return;

  const W = 800, H = 220;
  const PAD_T = 22, PAD_B = 28, PAD_L = 42, PAD_R = 14;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

  const vals = buckets.map(b => b.actual_pl || 0);
  const maxAbs = Math.max(...vals.map(v => Math.abs(v)), 0.01);
  const niceMax = (() => {
    const exp = Math.pow(10, Math.floor(Math.log10(maxAbs)));
    const m = maxAbs / exp;
    if (m <= 1) return exp;
    if (m <= 2) return 2 * exp;
    if (m <= 5) return 5 * exp;
    return 10 * exp;
  })();
  const yMid = PAD_T + innerH / 2;
  const yScale = (innerH / 2) / niceMax;

  const n = buckets.length;
  const step = innerW / n;
  const xCenter = i => PAD_L + step * (i + 0.5);
  const yVal = v => yMid - v * yScale;

  const yTicks = [1, 0.5, 0, -0.5, -1].map(f => {
    const v = f * niceMax;
    const y = yMid - f * (innerH / 2);
    const decimals = niceMax >= 10 ? 0 : niceMax >= 1 ? 1 : 2;
    return `<text class="chart-axis-text" x="${PAD_L - 8}" y="${y + 3}" text-anchor="end">${v >= 0 ? "+" : ""}${v.toFixed(decimals)}</text>`;
  }).join("");

  const labelStep = Math.max(1, Math.ceil(n / 6));
  const xLabels = buckets.map((b, i) => {
    if (i % labelStep !== 0 && i !== n - 1) return "";
    const lbl = b.label_short || b.label || "";
    return `<text class="chart-axis-text" x="${xCenter(i)}" y="${H - 8}" text-anchor="middle">${lbl}</text>`;
  }).join("");

  const gridLines = [1, 0.5, 0, -0.5, -1].map(f => {
    const y = yMid - f * (innerH / 2);
    const cls = f === 0 ? "chart-zero-line" : "chart-grid-line";
    return `<line class="${cls}" x1="${PAD_L}" y1="${y}" x2="${W - PAD_R}" y2="${y}"/>`;
  }).join("");

  const points = buckets.map((b, i) => ({
    x: xCenter(i), y: yVal(b.actual_pl || 0),
    pl: b.actual_pl || 0, active: b.is_active, i
  }));
  const activePoints = points.filter(p => p.active);

  let linePath = "", areaPath = "";
  if (activePoints.length >= 2) {
    const pts = activePoints;
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(i + 2, pts.length - 1)];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    linePath = d;
    const first = pts[0], last = pts[pts.length - 1];
    areaPath = d + ` L ${last.x.toFixed(1)} ${yMid} L ${first.x.toFixed(1)} ${yMid} Z`;
  } else if (activePoints.length === 1) {
    const p = activePoints[0];
    linePath = `M ${(p.x - 8).toFixed(1)} ${p.y.toFixed(1)} L ${(p.x + 8).toFixed(1)} ${p.y.toFixed(1)}`;
  }

  const dots = buckets.map((b, i) => {
    if (!b.is_active) return "";
    const v = b.actual_pl || 0;
    const cx = xCenter(i);
    const cy = yVal(v);
    const cls = v > 0.001 ? "dot-profit" : v < -0.001 ? "dot-loss" : "dot-neutral";
    const delay = (0.5 + i / n * 0.4).toFixed(3);
    return `<circle class="chart-dot ${cls}" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="3.5" style="animation-delay:${delay}s; animation-fill-mode:forwards"></circle>`;
  }).join("");

  const hovers = buckets.map((b, i) => {
    const cx = xCenter(i);
    const x = cx - step / 2;
    return `<rect class="chart-hit" data-idx="${i}" x="${x.toFixed(1)}" y="${PAD_T}" width="${step.toFixed(1)}" height="${innerH}" fill="transparent"/>`;
  }).join("");

  svg.innerHTML = `
    <defs>
      <linearGradient id="line-gradient" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stop-color="#a78bfa"/>
        <stop offset="50%" stop-color="#34d399"/>
        <stop offset="100%" stop-color="#6ee7b7"/>
      </linearGradient>
      <linearGradient id="area-gradient" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#34d399" stop-opacity="0.32"/>
        <stop offset="60%" stop-color="#34d399" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#34d399" stop-opacity="0"/>
      </linearGradient>
    </defs>
    ${gridLines}
    ${yTicks}
    ${areaPath ? `<path class="chart-area" d="${areaPath}"/>` : ""}
    ${linePath ? `<path class="chart-line" d="${linePath}"/>` : ""}
    ${dots}
    ${xLabels}
    <line id="chart-cursor" class="chart-cursor" x1="0" y1="${PAD_T}" x2="0" y2="${PAD_T + innerH}" style="opacity:0"/>
    <circle id="chart-cursor-dot" class="chart-cursor-dot" r="5" cx="0" cy="0" style="opacity:0"/>
    ${hovers}
  `;

  const wrap = svg.parentElement;
  if (wrap.__tipBound) return;
  wrap.__tipBound = true;
  const cursor = svg.querySelector("#chart-cursor");
  const cursorDot = svg.querySelector("#chart-cursor-dot");
  wrap.addEventListener("mousemove", e => {
    const rect = wrap.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const vbX = (relX / rect.width) * W;
    if (vbX < PAD_L || vbX > W - PAD_R) {
      tip.classList.remove("visible");
      if (cursor) cursor.style.opacity = "0";
      if (cursorDot) cursorDot.style.opacity = "0";
      return;
    }
    const idx = Math.min(buckets.length - 1, Math.max(0, Math.floor((vbX - PAD_L) / step)));
    const b = buckets[idx];
    if (!b) { tip.classList.remove("visible"); return; }
    const pl = b.actual_pl || 0;
    const cls = !b.is_active ? "neutral" : pl > 0.001 ? "profit" : pl < -0.001 ? "loss" : "neutral";
    const blocksLine = (b.my_blocks || 0) > 0 ? `<div class="tt-row"><span class="tt-dot" style="background:#facc15"></span>${b.my_blocks} blk</div>` : "";
    const costLine = (b.cost || 0) > 0 ? `<div class="tt-row"><span class="tt-dot" style="background:#fb7185"></span>−$${fmtNum(b.cost, 3)} cost</div>` : "";
    const revLine = (b.actual_revenue || 0) > 0 ? `<div class="tt-row"><span class="tt-dot" style="background:#34d399"></span>+$${fmtNum(b.actual_revenue, 3)} rev</div>` : "";
    tip.innerHTML = `
      <div class="tt-time">${b.label}</div>
      <div class="tt-pl ${cls}">${fmtPL(pl)}</div>
      ${revLine}${costLine}${blocksLine}
    `;
    const cxScreen = ((PAD_L + step * (idx + 0.5)) / W) * rect.width;
    const tipW = 140;
    let leftPx = cxScreen - tipW / 2;
    if (leftPx < 4) leftPx = 4;
    if (leftPx + tipW > rect.width - 4) leftPx = rect.width - tipW - 4;
    tip.style.left = leftPx + "px";
    tip.style.top = "8px";
    tip.classList.add("visible");
    const cxVB = PAD_L + step * (idx + 0.5);
    const cyVB = yMid - pl * yScale;
    if (cursor) {
      cursor.setAttribute("x1", cxVB);
      cursor.setAttribute("x2", cxVB);
      cursor.style.opacity = "1";
    }
    if (cursorDot && b.is_active) {
      cursorDot.setAttribute("cx", cxVB);
      cursorDot.setAttribute("cy", cyVB);
      const dotColor = pl > 0.001 ? "#34d399" : pl < -0.001 ? "#f87171" : "#94a3b8";
      cursorDot.setAttribute("fill", dotColor);
      cursorDot.style.opacity = "1";
    } else if (cursorDot) {
      cursorDot.style.opacity = "0";
    }
  });
  wrap.addEventListener("mouseleave", () => {
    tip.classList.remove("visible");
    if (cursor) cursor.style.opacity = "0";
    if (cursorDot) cursorDot.style.opacity = "0";
  });
  wrap.addEventListener("touchstart", e => {
    if (!e.touches[0]) return;
    const t = e.touches[0];
    const rect = wrap.getBoundingClientRect();
    const relX = t.clientX - rect.left;
    const idx = Math.min(buckets.length - 1, Math.max(0, Math.floor(relX / (rect.width / buckets.length))));
    const b = buckets[idx];
    if (!b) return;
    const pl = b.actual_pl || 0;
    const cls = !b.is_active ? "neutral" : pl > 0.01 ? "profit" : pl < -0.01 ? "loss" : "neutral";
    tip.innerHTML = `
      <div class="tt-pl ${cls}">${fmtPL(pl)}</div>
      <div class="tt-meta">${b.label} · ${b.my_blocks || 0} blk</div>
    `;
    tip.style.left = relX + "px";
    tip.style.top = (t.clientY - rect.top - 8) + "px";
    tip.classList.add("visible");
    setTimeout(() => tip.classList.remove("visible"), 2500);
  }, { passive: true });
}

function setClass(id, cls) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = el.className.replace(/\b(profit|loss|neutral|expected)\b/g, "").trim();
  el.classList.add(cls);
}
function showError(msg) {
  const e = document.getElementById("error");
  e.textContent = msg;
  e.classList.remove("hidden");
}
function hideError() { document.getElementById("error").classList.add("hidden"); }
function setStatus(msg) { document.getElementById("status").textContent = msg; }
async function fetchJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error("HTTP " + r.status);
  return r.json();
}

// Robust fetch with proxy fallback chain
async function fetchWithProxyFallback(rawUrl, timeout = 10000) {
  const proxies = [corsProxy, corsProxyFallback, corsProxyFallback2];
  let lastErr;
  for (const p of proxies) {
    try {
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), timeout);
      const r = await fetch(p(rawUrl), { signal: ctl.signal });
      clearTimeout(timer);
      if (!r.ok) throw new Error("HTTP " + r.status);
      return await r.json();
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("All proxies failed");
}

// ============ STATE ============
let currentPeriod = localStorage.getItem("pearlfortune_period") || "24h";
if (!Period.PERIODS.includes(currentPeriod)) currentPeriod = "24h";

let walletCache = null;
let costCache = 11;
let priceCache = 0.4;
window._livePrice = 0;  // expose for spa.js commitSetup
const DEX_PAIR_URL = 'https://api.dexscreener.com/latest/dex/pairs/ethereum/0x89a67c6dee35db9815da2fb9191f0998a8b37c39';
async function fetchDexPrice() {
  try {
    const r = await fetch(DEX_PAIR_URL);
    const j = await r.json();
    const pair = (j.pairs || [])[0];
    if (pair && pair.priceUsd) {
      const p = parseFloat(pair.priceUsd);
      if (p > 0) return p;
    }
  } catch (e) { console.warn('DexScreener fetch failed:', e); }
  return null;
}
// Fetch live price immediately on page load
fetchDexPrice().then(p => {
  if (p) {
    priceCache = p;
    window._livePrice = p;
    setText('setup-price-live', '$' + fmtNum(p, 4));
    setText('live-price-value', '$' + fmtNum(p, 4));
  }
}).catch(() => {});
let rewardTab = "pending";
let claimedPage = 1;
let blocksPage = 1;
let _blocksAll = [];
let _apiNow = 0;

// Convert API created_at to UTC timestamp
function apiTimeToUTC(dateStr) {
  if (!dateStr) return 0;
  return Math.floor(new Date(dateStr.replace(" ","T") + "Z").getTime() / 1000) - 7 * 3600;
}
// Display age using API clock
function fmtAgeApi(apiTs) {
  if (!apiTs) return "—";
  const ref = Math.floor(Date.now() / 1000);
  const sec = Math.floor(ref - apiTs);
  if (sec < 0) return "just now";
  if (sec < 60) return sec + "s ago";
  if (sec < 3600) return Math.floor(sec/60) + "m ago";
  if (sec < 86400) return Math.floor(sec/3600) + "h ago";
  return Math.floor(sec/86400) + "d ago";
}

// ============ COST ADV ============
const costAdv = new CostAdv("pearlfortune");
function updateCostAdvPanel() {
  costAdv.renderPanel("cost-adv-list", "#34d399", () => {
    if (walletCache) refresh();
  });
}
function toggleCostAdv() {
  const panel = document.getElementById("cost-adv-panel");
  const opening = panel.classList.contains("hidden");
  panel.classList.toggle("hidden");
  if (opening) {
    updateCostAdvPanel();
    CostAdv.prefillForm("cost-adv-from", "cost-adv-to");
    document.getElementById("cost-adv-amount").value = "";
  }
}

// ============ FETCHERS ============
async function fetchPFSummary() { return fetchWithProxyFallback(`${API}/summary`, 6000); }
async function fetchPFMiner(wallet) { return fetchWithProxyFallback(`${API}/miners/${wallet}`, 10000); }
async function fetchPFConnections(wallet) { return fetchWithProxyFallback(`${API}/miners/${wallet}/connections`, 10000); }
async function fetchPFBlocks() { return fetchWithProxyFallback(`${API}/blocks?limit=500`, 12000); }
async function fetchPFCredits(wallet) { return fetchWithProxyFallback(`${API}/miners/${wallet}/credits?limit=200`, 10000).catch(() => ({credits:[]})); }
async function fetchPFShares(wallet) { return fetchWithProxyFallback(`${API}/miners/${wallet}/shares?limit=500`, 10000).catch(() => ({rows:[]})); }
async function fetchPFConfig() { return fetchWithProxyFallback(`${API}/config`, 6000).catch(() => ({})); }

function parseHashStr(s) {
  if (!s || typeof s !== "string") return 0;
  const m = s.match(/([\d.]+)\s*([EPTGMKk]?)H\/s/);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  const unit = m[2].toUpperCase();
  const mult = { "": 1, "K": 1e3, "M": 1e6, "G": 1e9, "T": 1e12, "P": 1e15, "E": 1e18 }[unit] || 1;
  return n * mult;
}

// ============ BUCKETING ============
function bucketBlocks(skeleton, blocks) {
  const out = skeleton.buckets.map(b => ({ ...b, my_blocks: 0, pool_blocks: 0 }));
  for (const b of blocks) {
    const idx = Period.findIdx(out, b.found_at);
    if (idx === -1) continue;
    out[idx].pool_blocks++;
  }
  return out;
}

// ============ MAIN REFRESH ============
async function refresh() {
  if (!walletCache) return;
  const wallet = walletCache;
  const cost = costCache;
  const prlPrice = priceCache;

  hideError();
  setStatus(t("fetching"));
  document.getElementById("period-loading").classList.remove("hidden");
  const refreshBtn = document.getElementById("refresh-btn");
  if (refreshBtn) refreshBtn.classList.add("spinning");
  window._lastWallet = wallet;

  try {
    const [summaryResp, minerResp, connectionsResp, blocksResp, configResp, creditsResp, sharesResp] = await Promise.all([
      fetchPFSummary(),
      fetchPFMiner(wallet),
      fetchPFConnections(wallet),
      fetchPFBlocks(),
      fetchPFConfig(),
      fetchPFCredits(wallet),
      fetchPFShares(wallet),
    ]);

    // Unwrap proxy wrapper
    const summary = (summaryResp && summaryResp.data) || summaryResp || {};
    const miner = (minerResp && minerResp.data) || minerResp || {};
    const connections = (connectionsResp && connectionsResp.data) || connectionsResp || {};
    const blocksData = (blocksResp && blocksResp.data) || blocksResp || {};
    const pfConfig = (configResp && configResp.data) || configResp || {};
    const creditsData = (creditsResp && creditsResp.data) || creditsResp || {};
    const creditsList = creditsData.credits || [];

    // API clock
    const apiNow = summary.generated_at || Math.floor(Date.now() / 1000);
    _apiNow = apiNow;

    // Pool stats
    const poolStats = (summary.pool_stats && summary.pool_stats.pools && summary.pool_stats.pools[0]) || {};
    const rollingStats = (summary.pool_stats && summary.pool_stats.rolling_stats) || [];
    const poolDetail = summary.pool_detail || {};
    const hourlyStats = (summary.pool_stats && summary.pool_stats.hourly_stats) || [];
    const lastHourly = hourlyStats.length > 0 ? hourlyStats[hourlyStats.length - 1] : {};
    const rolling1h = rollingStats.length > 1 ? rollingStats[1] : (rollingStats.length > 0 ? rollingStats[0] : {});
    const _poolHash = rolling1h.hashrate || lastHourly.pool_hashrate || 0;
    const _netHash = rolling1h.net_hashrate || lastHourly.network_hashrate || parseHashStr(summary.stats && summary.stats.network_hashrate) || 0;
    const poolBlockCount = poolStats.block_count || 0;
    const POOL_FEE = 0.05;
    const connectedMinersCount = (poolDetail.miners && poolDetail.miners.length) || 0;

    // Workers
    const connSummary = connections.summary || {};
    const myHash = connSummary.reported_hashrate || 0;
    const workersList = connections.workers || [];
    const workerCount = connSummary.worker_count || 0;

    // Pending shares
    const pendingRows = (miner.pending_shares && miner.pending_shares.rows) || [];
    const pendingEstimateAtomic = (miner.pending_shares && miner.pending_shares.pending_estimate_amount_atomic) || 0;
    // Shares: complete history of all blocks user participated in
    const sharesData = (sharesResp && sharesResp.data) || sharesResp || {};
    const sharesRows = sharesData.rows || [];
    const latestBlockReward = (summary.stats && summary.stats.latest_block_reward) || 0;
    const latestHeight = (summary.stats && summary.stats.latest_height) || 0;
    const maturityBlocks = pfConfig.maturity_blocks || 100;

    // Pool blocks
    const poolBlocks = blocksData.blocks || [];
    const allBlocks = poolBlocks.map(b => ({
      height: b.block_height || null,
      hash: b.block_hash || "",
      found_at: b.created_at ? apiTimeToUTC(b.created_at) : 0,
      found_by: b.miner_address || "",
      reward: b.block_reward || 0,
      status: "confirmed",
    })).filter(b => b.found_at > 0);
    _blocksAll = allBlocks.slice();

    // Online status
    const freshWorkerThreshold = 900;
    const hasFreshWorkers = workersList.some(w => {
      if (w.stale) return false;
      const ls = w.last_stats_at ? Math.floor(new Date(w.last_stats_at).getTime() / 1000) : 0;
      return ls > 0 && (apiNow - ls) < freshWorkerThreshold;
    });
    const isOnline = hasFreshWorkers || workerCount > 0;

    // ====================================================
    // EARNINGS — DIRECT FROM API, NO ESTIMATION
    // ====================================================
    const pendingGross = pendingEstimateAtomic > 0 ? pendingEstimateAtomic / ATOMIC_UNITS : 0;
    const pendingPrl = pendingGross * (1 - POOL_FEE);
    const maturedPrl = creditsList.reduce((s, cr) => s + (cr.amount_atomic || 0), 0) / ATOMIC_UNITS;
    const totalEarnedPrl = pendingPrl + maturedPrl;

    // ====================================================
    // MINING SINCE — oldest block we can find
    // ====================================================
    // Mining since — oldest share timestamp (not pool blocks which are limited to 20)
    const allShareTimestamps = [
      ...sharesRows.map(r => r.created_at ? apiTimeToUTC(r.created_at) : 0),
      ...pendingRows.map(r => r.created_at ? apiTimeToUTC(r.created_at) : 0),
    ].filter(ts => ts > 0).sort((a, b) => a - b);
    const miningSinceTs = allShareTimestamps.length > 0 ? allShareTimestamps[0] : null;
    const nowSec = Math.floor(Date.now() / 1000);
    const hoursActive = miningSinceTs ? Math.max(0.01, (nowSec - miningSinceTs) / 3600) : 0;

    // ====================================================
    // COST — total cost since mining started
    // ====================================================
    const totalCost = miningSinceTs ? costAdv.costInRange(miningSinceTs, nowSec, cost) : 0;

    // ====================================================
    // REVENUE & P/L
    // ====================================================
    const totalRevenue = totalEarnedPrl * prlPrice;
    const totalPL = totalRevenue - totalCost;

    // ====================================================
    // TOP STATS
    // ====================================================
    const poolHash = _poolHash;
    const myPctPool = poolHash > 0 ? (myHash / poolHash * 100) : 0;

    setText("stat-hashrate", fmtHash(myHash));
    setText("stat-share", myPctPool > 0 ? myPctPool.toFixed(2) + "%" : "—");
    setText("stat-workers", isOnline ? workerCount : 0);
    setText("stat-workers-sub", (isOnline ? workerCount : 0) + " " + t("online"));

    // Mining since
    if (miningSinceTs) {
      const miningSec = Math.floor(Date.now() / 1000) - miningSinceTs;
      setText("stat-mining-since", fmtDuration(miningSec));
      setText("stat-mining-since-sub", fmtAgeApi(miningSinceTs));
    } else {
      setText("stat-mining-since", "—");
      setText("stat-mining-since-sub", "no data");
    }

    // ====================================================
    // EARNINGS CARDS
    // ====================================================
    setText("earn-pending", fmtNum(pendingPrl, 4) + " PRL");
    setText("earn-pending-usd", "$" + fmtNum(pendingPrl * prlPrice, 2));
    setText("earn-matured", fmtNum(maturedPrl, 4) + " PRL");
    setText("earn-matured-usd", "$" + fmtNum(maturedPrl * prlPrice, 2));
    setText("earn-total", fmtNum(totalEarnedPrl, 4) + " PRL");
    setText("earn-total-usd", "$" + fmtNum(totalRevenue, 2));

    // ====================================================
    // P/L HERO
    // ====================================================
    setText("total-pl-big", fmtPL(totalPL));
    setClass("total-pl-big", totalPL > 0.01 ? "profit" : totalPL < -0.01 ? "loss" : "neutral");
    setText("total-pl-period", t("period_" + currentPeriod));
    setText("total-revenue", "$" + fmtNum(totalRevenue, 2));
    setText("total-cost", "$" + fmtNum(totalCost, 2));
    setText("total-prl", fmtNum(totalEarnedPrl, 2) + " PRL");
    setText("chart-axis-start", t("ago_" + currentPeriod));

    // ====================================================
    // POOL STATS (settings page)
    // ====================================================
    const recentRewards = allBlocks.slice(0, 20).map(b => b.reward || 0).filter(r => r > 0);
    const avgReward = recentRewards.length > 0 ? recentRewards.reduce((a,b) => a+b, 0) / recentRewards.length : 0;
    setText("pool-hash", fmtHash(poolHash));
    setText("pool-miners", connectedMinersCount || "—");
    setText("pool-blocks-stat", poolBlockCount);
    setText("pool-luck", _netHash > 0 ? (poolHash / _netHash * 100).toFixed(1) + "%" : "—");
    setText("avg-reward", avgReward > 0 ? fmtNum(avgReward, 2) + " PRL" : "—");

    // Wallet stats (settings page)
    setText("w-pending", fmtNum(pendingPrl, 4) + " PRL");
    setText("w-maturing", fmtNum(maturedPrl, 4) + " PRL");
    setText("w-total-earned", fmtNum(totalEarnedPrl, 4) + " PRL");
    setText("w-next-mature", connSummary.generated_at ? fmtAgeApi(apiTimeToUTC(connSummary.generated_at)) : "—");
    setText("w-status", isOnline ? t("online_status") : t("offline_status"));
    setText("w-shares", latestHeight ? "#" + latestHeight : "—");

    // ====================================================
    // HOURLY TABLE — count blocks by WIB hour directly
    // ====================================================
    const WIB_OFFSET = 7 * 3600;
    // Use latest block time as current hour (matches pearlfortune.org website)
    // API generated_at can be BEHIND latest block created_at
    const allTs = [...sharesRows, ...pendingRows].map(r => r.created_at ? apiTimeToUTC(r.created_at) : 0).filter(t => t > 0);
    const latestBlockTs = allTs.length > 0 ? Math.max(...allTs) : apiNow;
    const curRef = Math.max(apiNow, latestBlockTs); // pick whichever is more recent
    const curRefWIB = curRef + WIB_OFFSET;
    const curWIBHour = Math.floor(curRefWIB / 3600) * 3600;
    
    // Count blocks per WIB hour from created_at strings (already WIB)
    const hourBlockCounts = {};
    const hourTsMap = {};
    const allRows = [...sharesRows, ...pendingRows.filter(r => !sharesRows.some(s => s.block_height === r.block_height))];
    for (const r of allRows) {
      if (!r.created_at) continue;
      const parts = r.created_at.split(/[- :]/);
      if (parts.length < 6) continue;
      const h = ((parseInt(parts[3]) - 1) + 24) % 24;
      const key = String(h).padStart(2, "0") + ":00";
      hourBlockCounts[key] = (hourBlockCounts[key] || 0) + 1;
      // Timestamp for cost calc
      const ts = apiTimeToUTC(r.created_at);
      if (!hourTsMap[key] || ts < hourTsMap[key].min) hourTsMap[key] = { min: ts, max: ts };
      if (ts > hourTsMap[key].max) hourTsMap[key].max = ts;
    }
    
    // Build period hours (24h = last 24 hours in WIB)
    const periodHours = currentPeriod === "1h" ? 1 : currentPeriod === "6h" ? 6 : currentPeriod === "12h" ? 12 : 24;
    const buckets = [];
    for (let i = periodHours - 1; i >= 0; i--) {
      const start = curWIBHour - (i * 3600);
      const wibH = ((Math.floor(start / 3600) - 1) % 24 + 24) % 24;
      const label = String(wibH).padStart(2, "0") + ":00";
      const blkCount = hourBlockCounts[label] || 0;
      const isCurrent = (i === 0);
      const isActive = isCurrent ? hasFreshWorkers : (blkCount > 0);
      // Cost: full hourly cost if active
      const bucketCost = isActive ? cost : 0;
      buckets.push({ label, start: start - WIB_OFFSET, end: start + 3600 - WIB_OFFSET, my_blocks: blkCount, cost: bucketCost, is_active: isActive });
    }
    
    const totalPeriodBlocks = buckets.reduce((s, b) => s + b.my_blocks, 0);
    const prlPerBlock = totalPeriodBlocks > 0 ? totalEarnedPrl / totalPeriodBlocks : 0;
    const revenuePerBlock = totalPeriodBlocks > 0 ? totalRevenue / totalPeriodBlocks : 0;
    
    for (const b of buckets) {
      b.prl_amount = b.my_blocks * prlPerBlock;
      b.actual_revenue = b.my_blocks * revenuePerBlock;
      b.actual_pl = b.actual_revenue - b.cost;
    }

    // Hourly table (newest first)
    const hbody = document.getElementById("hourly-body");
    const rowsToShow = buckets.slice().reverse();
    hbody.innerHTML = rowsToShow.map(b => {
      const isCurrent = b === buckets[buckets.length - 1];
      const aCls = b.actual_pl > 0.01 ? "profit" : b.actual_pl < -0.01 ? "loss" : "neutral";
      const blkCount = b.my_blocks || 0;
      const blkLabel = blkCount > 0 ? String(blkCount) : "—";
      const offlineRowCls = !b.is_active ? "opacity-50" : "";
      const rev = b.actual_revenue || 0;
      const prlAmt = b.prl_amount || 0;
      return '<tr class="border-t border-slate-800/40 hover:bg-slate-900/30 ' + (isCurrent ? "bg-emerald-950/20" : "") + " " + offlineRowCls + '">' +
        '<td class="px-3 py-2 text-xs ' + (isCurrent ? "text-emerald-400" : "text-slate-300") + ' font-mono-num">' + b.label + (isCurrent ? " ◀" : "") + '</td>' +
        '<td class="px-3 py-2 text-xs ' + (blkCount > 0 ? "text-yellow-400" : "text-slate-700") + ' font-mono-num text-right">' + blkLabel + '</td>' +
        '<td class="px-3 py-2 text-xs ' + (prlAmt > 0.001 ? "text-emerald-400" : "text-slate-700") + ' font-mono-num text-right">' + (prlAmt > 0 ? fmtNum(prlAmt, 2) : "—") + '</td>' +
        '<td class="px-3 py-2 text-xs ' + (rev > 0.01 ? "text-emerald-400" : "text-slate-700") + ' font-mono-num text-right">' + (rev > 0 ? "$" + rev.toFixed(2) : "—") + '</td>' +
        '<td class="px-3 py-2 text-xs ' + (b.cost > 0.01 ? "text-red-400" : "text-slate-700") + ' font-mono-num text-right">' + (b.is_active ? "$" + b.cost.toFixed(2) : "—") + '</td>' +
        '<td class="px-3 py-2 text-xs ' + aCls + ' font-mono-num font-bold text-right">' + fmtPL(b.actual_pl) + '</td>' +
      '</tr>';
    }).join("");

    // Chart
    renderModernChart(buckets);

    // ====================================================
    // WORKERS
    // ====================================================
    const wbody = document.getElementById("workers-body");
    const instances = workersList.filter(w => {
      if (w.stale) return false;
      const ls = w.last_stats_at ? Math.floor(new Date(w.last_stats_at).getTime() / 1000) : 0;
      return ls > 0 && (apiNow - ls) < freshWorkerThreshold;
    });
    setText("workers-count-big", instances.length + " " + t("active"));
    if (instances.length === 0) {
      wbody.innerHTML = '<tr><td colspan="5" class="px-5 py-6 text-center text-xs text-slate-600">' + t("no_workers") + '</td></tr>';
    } else {
      wbody.innerHTML = instances.sort((a,b) => (b.reported_hashrate||0)-(a.reported_hashrate||0)).map(w => {
        const ls = w.last_stats_at ? Math.floor(new Date(w.last_stats_at).getTime() / 1000) : 0;
        const staleColor = "text-emerald-400";
        return '<tr class="border-t border-slate-800/40 hover:bg-slate-900/30">' +
          '<td class="px-5 py-2.5 text-xs text-slate-300 font-mono-num">' + (w.worker || "—") + '</td>' +
          '<td class="px-5 py-2.5 text-xs text-slate-200 font-mono-num text-right">' + fmtHash(w.reported_hashrate || 0) + '</td>' +
          '<td class="px-5 py-2.5 text-xs text-slate-400 font-mono-num text-right">' + (w.reported_gpus || 0) + ' GPU</td>' +
          '<td class="px-5 py-2.5 text-xs ' + staleColor + ' font-mono-num text-right">ok</td>' +
          '<td class="px-5 py-2.5 text-xs text-slate-500 font-mono-num text-right">' + (ls ? fmtAgeApi(ls) : "—") + '</td>' +
        '</tr>';
      }).join("");
    }

    // ====================================================
    // REWARDS
    // ====================================================
    setText("r-pending", fmtNum(pendingPrl, 4) + " PRL");
    setText("r-maturing", fmtNum(maturedPrl, 4) + " PRL");
    setText("r-total-earned", fmtNum(totalEarnedPrl, 4) + " PRL");

    // Next maturity
    let nextMaturityEta = "—";
    if (pendingRows.length > 0 && latestHeight > 0) {
      const oldestHeight = Math.min(...pendingRows.map(r => r.block_height || Infinity));
      if (oldestHeight < Infinity) {
        const maturesAt = oldestHeight + maturityBlocks;
        const blocksLeft = Math.max(0, maturesAt - latestHeight);
        const secondsLeft = blocksLeft * 60;
        nextMaturityEta = blocksLeft <= 0 ? "maturing now" : "~" + fmtDuration(secondsLeft) + " (" + blocksLeft + " blocks)";
      }
    }
    setText("r-next-mature", nextMaturityEta);
    setText("r-status", isOnline ? t("online_status") : t("offline_status"));

    // Pending table
    const pendingBody = document.getElementById("pending-blocks-body");
    setText("rewards-pending-count", pendingRows.length);
    if (pendingRows.length === 0) {
      pendingBody.innerHTML = '<tr><td colspan="4" class="px-5 py-6 text-center text-xs text-slate-600">' + t("no_pending") + '</td></tr>';
    } else {
      const sortedPending = pendingRows.slice().sort((a, b) => {
        // Sort by block height descending (highest = newest)
        return (b.block_height || 0) - (a.block_height || 0);
      });
      pendingBody.innerHTML = sortedPending.slice(0, 30).map(row => {
        const ts = row.created_at ? apiTimeToUTC(row.created_at) : 0;
        const ratio = row.ratio || 0;
        const myPrl = ratio * latestBlockReward * (1 - POOL_FEE);
        return '<tr class="border-t border-slate-800/40 hover:bg-slate-900/30">' +
          '<td class="px-3 py-2 text-xs text-purple-400 font-mono-num">#' + (row.block_height || "—") + '</td>' +
          '<td class="px-3 py-2 text-xs text-emerald-400 font-mono-num text-right">' + (myPrl > 0 ? fmtNum(myPrl, 4) : "—") + '</td>' +
          '<td class="px-3 py-2 text-xs text-yellow-400">' + (row.submit_status || "pending") + '</td>' +
        '</tr>';
      }).join("");
    }

    // Claimed table — use credits from ledger/shares
    const claimedEntries = creditsList.length > 0 ? creditsList : 
      sharesRows.filter(r => r.credit_amount > 0).map(r => ({
        created_at: r.credit_created || r.created_at,
        amount: (r.credit_amount || 0) / ATOMIC_UNITS,
      }));
    setText("rewards-claimed-count", claimedEntries.length);
    renderClaimedTable(claimedEntries);

    // ====================================================
    // BLOCKS
    // ====================================================
    setText("blocks-pool-count", allBlocks.length);
    setText("blocks-mine-count", allBlocks.filter(b => b.found_by === wallet).length);
    renderBlocksTable(allBlocks, wallet);

    // Done
    setStatus(t("updated") + " " + new Date().toLocaleTimeString() + " · " + t("auto_refresh_60s"));
    document.getElementById("period-loading").classList.add("hidden");
    if (refreshBtn) refreshBtn.classList.remove("spinning");

  } catch (e) {
    console.error("[refresh] ERROR:", e);
    showError(t("error_prefix") + e.message);
    setStatus(t("error_prefix") + e.message);
    document.getElementById("period-loading").classList.add("hidden");
    if (refreshBtn) refreshBtn.classList.remove("spinning");
  }
}

function renderClaimedTable(payouts) {
  const body = document.getElementById("claimed-body");
  const pagBox = document.getElementById("claimed-pagination");
  if (!body) return;
  if (!payouts.length) {
    body.innerHTML = '<tr><td colspan="4" class="px-5 py-6 text-center text-xs text-slate-600">' + t("no_claimed") + '</td></tr>';
    if (pagBox) pagBox.innerHTML = "";
    return;
  }
  const sorted = payouts.slice().sort((a, b) => {
    const ta = a.created_at ? apiTimeToUTC(a.created_at) : 0;
    const tb = b.created_at ? apiTimeToUTC(b.created_at) : 0;
    return tb - ta;
  });
  const pag = Period.paginate(sorted, claimedPage, 15);
  body.innerHTML = pag.items.map(p => {
    const amt = p.amount || (p.amount_atomic || 0) / ATOMIC_UNITS || 0;
    return '<tr class="border-t border-slate-800/40 hover:bg-slate-900/30">' +
      '<td class="px-3 py-2 text-xs text-emerald-400 font-mono-num font-semibold text-right">' + fmtNum(amt, 4) + ' PRL</td>' +
      '<td class="px-3 py-2 text-xs text-slate-500 font-mono-num text-right">' + fmtNum(p.fee_amount || 0, 4) + '</td>' +
      '<td class="px-3 py-2 text-xs text-slate-400 font-mono-num">' + (p.tx_id ? p.tx_id.slice(0, 8) + "…" + p.tx_id.slice(-6) : "credit") + '</td>' +
    '</tr>';
  }).join("");
  if (pagBox) pagBox.innerHTML = Period.renderPagination(pag.page, pag.totalPages);
  if (pagBox) pagBox.querySelectorAll(".page-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const p = parseInt(btn.getAttribute("data-page")) || 1;
      claimedPage = p;
      renderClaimedTable(payouts);
    });
  });
}

function renderBlocksTable(blocks, wallet) {
  const body = document.getElementById("blocks-body");
  const pagBox = document.getElementById("blocks-pagination");
  if (!body) return;
  if (!blocks.length) {
    body.innerHTML = '<tr><td colspan="5" class="px-5 py-6 text-center text-xs text-slate-600">' + t("no_pending") + '</td></tr>';
    if (pagBox) pagBox.innerHTML = "";
    return;
  }
  const pag = Period.paginate(blocks, blocksPage, 25);
  body.innerHTML = pag.items.map((b) => {
    const isMine = b.found_by === wallet;
    const star = isMine ? '<span class="text-yellow-400">⭐</span> ' : '';
    const rowBg = isMine ? "bg-yellow-950/5" : "";
    const stColor = b.status === "confirmed" ? "text-emerald-400"
                  : b.status === "orphan" ? "text-red-400"
                  : "text-yellow-400";
    const heightLabel = b.height ? "#" + b.height : (b.found_at ? new Date(b.found_at * 1000).toISOString().slice(11, 16) + " UTC" : "—");
    const finderShort = isMine
      ? '<span class="text-yellow-400">you</span>'
      : (b.found_by ? '<span class="text-slate-500 font-mono-num">' + b.found_by.slice(0, 8) + '…</span>' : '<span class="text-slate-600">pool</span>');
    return '<tr class="border-t border-slate-800/40 hover:bg-slate-900/30 ' + rowBg + '">' +
      '<td class="px-3 py-2 text-xs text-purple-300 font-mono-num">' + star + heightLabel + '</td>' +
      '<td class="px-3 py-2 text-xs text-emerald-400 font-mono-num text-right font-semibold">' + fmtNum(b.reward || 0, 4) + '</td>' +
      '<td class="px-3 py-2 text-xs">' + finderShort + '</td>' +
      '<td class="px-3 py-2 text-xs ' + stColor + '">' + (b.status || "—") + '</td>' +
    '</tr>';
  }).join("");
  if (pagBox) pagBox.innerHTML = Period.renderPagination(pag.page, pag.totalPages);
  if (pagBox) pagBox.querySelectorAll(".page-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const p = parseInt(btn.getAttribute("data-page")) || 1;
      blocksPage = p;
      renderBlocksTable(blocks, wallet);
    });
  });
}

// ============ AUTO REFRESH ============
let refreshTimer = null;
function startAutoRefresh() {
  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = setInterval(() => { if (walletCache) refresh(); }, 60000);
}

// ============ PERIOD SELECTOR ============
function applyPeriod() {
  document.querySelectorAll("#period-selector .period-btn").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-period") === currentPeriod);
  });
}

// ============ SETTINGS DISPLAY ============
function updateSettingsDisplay() {
  setText("settings-wallet-display", walletCache || "—");
  setText("settings-cost-display", "$" + fmtNum(costCache, 2) + " /hr");
  setText("settings-price-display", "$" + fmtNum(priceCache, 4));
}

// ============ INIT ============
document.addEventListener("DOMContentLoaded", () => {
  applyI18n();
  applyPool();
  applyPeriod();

  // Lang & pool menus
  document.getElementById("lang-toggle")?.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); toggleLangMenu(); });
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); setLang(btn.getAttribute("data-lang")); });
  });
  document.getElementById("pool-toggle")?.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); togglePoolMenu(); });
  document.querySelectorAll(".pool-btn").forEach(btn => {
    btn.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); setPool(btn.getAttribute("data-pool")); });
  });
  document.addEventListener("click", (e) => {
    const lmenu = document.getElementById("lang-menu");
    const ltoggle = document.getElementById("lang-toggle");
    if (lmenu && !lmenu.contains(e.target) && ltoggle && !ltoggle.contains(e.target)) closeLangMenu();
    const pmenu = document.getElementById("pool-menu");
    const ptog = document.getElementById("pool-toggle");
    if (pmenu && !pmenu.contains(e.target) && ptog && !ptog.contains(e.target)) closePoolMenu();
  });

  // Period selector
  document.querySelectorAll("#period-selector .period-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const p = btn.getAttribute("data-period");
      if (!Period.PERIODS.includes(p) || p === currentPeriod) return;
      currentPeriod = p;
      localStorage.setItem("pearlfortune_period", p);
      applyPeriod();
      if (walletCache) refresh();
    });
  });

  // Refresh button
  document.getElementById("refresh-btn")?.addEventListener("click", () => { if (walletCache) refresh(); });

  // Reward tab switch
  document.querySelectorAll(".reward-tab").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const tab = btn.getAttribute("data-reward-tab");
      rewardTab = tab;
      document.querySelectorAll(".reward-tab").forEach(b => {
        b.classList.toggle("active", b.getAttribute("data-reward-tab") === tab);
      });
      document.getElementById("rewards-pending-pane").classList.toggle("hidden", tab !== "pending");
      document.getElementById("rewards-claimed-pane").classList.toggle("hidden", tab !== "claimed");
    });
  });

  // Cost adv
  document.getElementById("cost-adv-btn")?.addEventListener("click", toggleCostAdv);
  document.getElementById("cost-adv-add-btn")?.addEventListener("click", () => {
    const data = CostAdv.parseAddForm("cost-adv-from", "cost-adv-to", "cost-adv-amount");
    if (!data) { alert("Please fill all fields"); return; }
    const err = costAdv.addRange(data.start, data.end, data.cost);
    if (err) { alert(err); return; }
    document.getElementById("cost-adv-amount").value = "";
    updateCostAdvPanel();
    if (walletCache) refresh();
  });

  // Donate copy
  const copyBtn = document.getElementById("donate-copy");
  if (copyBtn) {
    copyBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const addr = document.getElementById("donate-addr").textContent.trim();
      const label = document.getElementById("donate-copy-label");
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(addr);
        } else {
          const ta = document.createElement("textarea");
          ta.value = addr; ta.style.position = "fixed"; ta.style.left = "-9999px";
          document.body.appendChild(ta); ta.select();
          document.execCommand("copy"); document.body.removeChild(ta);
        }
        label.textContent = t("copied");
        copyBtn.classList.add("bg-green-600/30", "border-green-700/50", "text-green-300");
        copyBtn.classList.remove("bg-pink-600/20", "border-pink-700/40", "text-pink-300");
        setTimeout(() => {
          label.textContent = t("copy");
          copyBtn.classList.remove("bg-green-600/30", "border-green-700/50", "text-green-300");
          copyBtn.classList.add("bg-pink-600/20", "border-pink-700/40", "text-pink-300");
        }, 1500);
      } catch (err) {
        console.error("Copy failed:", err);
      }
    });
  }

  // SPA init
  SPA.init({
    storageKey: STORAGE_KEY,
    walletPrefix: "prl1",
    defaultCost: 11,
    defaultPrice: 0.40,
    onReady: ({ wallet, cost }) => {
      walletCache = wallet;
      costCache = cost;
      
      // Display + auto-refresh IMMEDIATELY
      updateSettingsDisplay();
      refresh();
      startAutoRefresh();
      
      // Fetch live price from DexScreener + auto-refresh every 60s
      function updateLivePrice(p) {
        if (p && p > 0) {
          priceCache = p;
          window._livePrice = p;
          setText('settings-price-display', '$' + fmtNum(p, 4));
          setText('setup-price-live', '$' + fmtNum(p, 4));
          setText('live-price-value', '$' + fmtNum(p, 4));
        }
      }
      fetchDexPrice().then(p => {
        updateLivePrice(p);
        updateSettingsDisplay();
        refresh();
      }).catch(() => {});
      setInterval(() => {
        fetchDexPrice().then(updateLivePrice).catch(() => {});
      }, 60000);
    },
    onPageChange: (page) => {},
  });
});