/**
 * period.js — Hourly period buckets.
 *
 * Periods: 1h / 6h / 12h / 24h — always hourly granularity, N buckets ending at current hour.
 *
 * Each bucket: { start (utc-sec), end, label }
 */
(function (global) {
  "use strict";

  const WIB_OFFSET = 7 * 3600;
  const PERIODS = ["1h", "6h", "12h", "24h"];
  const PERIOD_HOURS = { "1h": 1, "6h": 6, "12h": 12, "24h": 24 };

  function fmtHour(ts) {
    const d = new Date(ts * 1000);
    return String((d.getUTCHours() + 7) % 24).padStart(2, "0") + ":00";
  }

  // Build hourly skeleton — array oldest→newest, length = N hours.
  function buildSkeleton(period) {
    const n = PERIOD_HOURS[period] || 24;
    const now = Math.floor(Date.now() / 1000);
    const cur = Math.floor(now / 3600) * 3600;
    const buckets = [];
    for (let i = n - 1; i >= 0; i--) {
      const start = cur - (i * 3600);
      buckets.push({ start, end: start + 3600, label: fmtHour(start) });
    }
    return { buckets, periodStart: buckets[0].start, granularity: "hour", hours: n };
  }

  function findIdx(buckets, ts) {
    let lo = 0, hi = buckets.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const b = buckets[mid];
      if (ts < b.start) hi = mid - 1;
      else if (ts >= b.end) lo = mid + 1;
      else return mid;
    }
    return -1;
  }

  function paginate(items, page, pageSize) {
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safe = Math.max(1, Math.min(page || 1, totalPages));
    const start = (safe - 1) * pageSize;
    return { page: safe, totalPages, total, pageSize, items: items.slice(start, start + pageSize) };
  }

  function renderPagination(page, totalPages) {
    if (totalPages <= 1) return "";
    const prevDis = page <= 1, nextDis = page >= totalPages;
    return `
      <div class="flex items-center justify-center gap-2 px-5 py-3 border-t border-slate-800/40 text-xs">
        <button data-page="${page - 1}" ${prevDis ? "disabled" : ""} class="page-btn px-3 py-1 rounded font-mono-num ${prevDis ? "opacity-30 cursor-not-allowed" : "hover:bg-slate-800/40 cursor-pointer"}">← prev</button>
        <span class="text-slate-500 font-mono-num">page ${page} / ${totalPages}</span>
        <button data-page="${page + 1}" ${nextDis ? "disabled" : ""} class="page-btn px-3 py-1 rounded font-mono-num ${nextDis ? "opacity-30 cursor-not-allowed" : "hover:bg-slate-800/40 cursor-pointer"}">next →</button>
      </div>`;
  }

  global.Period = {
    PERIODS, PERIOD_HOURS, WIB_OFFSET,
    buildSkeleton, findIdx,
    fmtHour,
    paginate, renderPagination,
  };
})(typeof window !== "undefined" ? window : this);
