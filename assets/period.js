/**
 * period.js — Shared period-aware bucket skeleton for all dashboards.
 *
 * Periods:
 *   1d  → 24 hourly buckets in WIB (current hour at the right)
 *   7d  → 7 daily buckets in WIB (today at the right)
 *   30d → 30 daily buckets in WIB
 *   all → monthly buckets from `since` (or 90d ago fallback) to now in WIB
 *
 * Each bucket: { start (utc-sec), end, label, granularity }
 *
 * Usage:
 *   const sk = Period.buildSkeleton("7d", minerCreatedAt);
 *   const idx = Period.findIdx(sk.buckets, ts);  // -1 if outside range
 *   sk.buckets[idx].my_data += 1;
 */
(function (global) {
  "use strict";

  const WIB_OFFSET = 7 * 3600;
  const PERIODS = ["1d", "7d", "30d", "all"];

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function wibDayStart(ts) {
    return Math.floor((ts + WIB_OFFSET) / 86400) * 86400 - WIB_OFFSET;
  }
  function wibMonthStart(ts) {
    const d = new Date((ts + WIB_OFFSET) * 1000);
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth();
    return Date.UTC(y, m, 1, 0, 0, 0) / 1000 - WIB_OFFSET;
  }
  function wibMonthEnd(ts) {
    const d = new Date((ts + WIB_OFFSET) * 1000);
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth();
    return Date.UTC(y, m + 1, 1, 0, 0, 0) / 1000 - WIB_OFFSET;
  }

  function fmtHour(ts) {
    const d = new Date(ts * 1000);
    return String((d.getUTCHours() + 7) % 24).padStart(2, "0") + ":00";
  }
  function fmtDay(ts) {
    const d = new Date((ts + WIB_OFFSET) * 1000);
    return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
  }
  function fmtMonth(ts) {
    const d = new Date((ts + WIB_OFFSET) * 1000);
    return `${MONTHS[d.getUTCMonth()]} ${String(d.getUTCFullYear()).slice(-2)}`;
  }

  // Build skeleton — array oldest→newest.
  function buildSkeleton(period, since) {
    const now = Math.floor(Date.now() / 1000);
    const buckets = [];

    if (period === "1d") {
      const cur = Math.floor(now / 3600) * 3600;
      for (let i = 23; i >= 0; i--) {
        const start = cur - (i * 3600);
        buckets.push({ start, end: start + 3600, label: fmtHour(start) });
      }
      return { buckets, periodStart: buckets[0].start, granularity: "hour" };
    }

    if (period === "7d" || period === "30d") {
      const days = period === "7d" ? 7 : 30;
      const today = wibDayStart(now);
      for (let i = days - 1; i >= 0; i--) {
        const start = today - (i * 86400);
        buckets.push({ start, end: start + 86400, label: fmtDay(start) });
      }
      return { buckets, periodStart: buckets[0].start, granularity: "day" };
    }

    // all-time
    const startTs = since || (now - 86400 * 90);
    let cursor = wibMonthStart(startTs);
    const endMonth = wibMonthStart(now);
    while (cursor <= endMonth) {
      const next = wibMonthEnd(cursor);
      buckets.push({ start: cursor, end: next, label: fmtMonth(cursor) });
      cursor = next;
    }
    return { buckets, periodStart: buckets[0].start, granularity: "month" };
  }

  // Binary search bucket index for a UTC timestamp.
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

  // ---------- pagination ----------
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
    PERIODS, WIB_OFFSET,
    buildSkeleton, findIdx,
    fmtHour, fmtDay, fmtMonth,
    wibDayStart, wibMonthStart, wibMonthEnd,
    paginate, renderPagination,
  };
})(typeof window !== "undefined" ? window : this);
