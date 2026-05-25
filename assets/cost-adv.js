/**
 * cost-adv.js — Advanced cost range overrides
 *
 * Default behavior: flat hourly cost from the input field applies to all hours.
 * Advanced overrides: user can add ranges {start, end, cost} where the cost
 * differs from the default (e.g. extra GPU rented from 14:00–22:00).
 *
 * Hours not covered by any override fall back to the default cost.
 *
 * Storage key is per-pool so each pool tracks its own overrides.
 */
(function (global) {
  "use strict";

  function CostAdv(poolKey) {
    this.STORAGE = "costadv_" + poolKey;
  }

  // ============ DATA ============
  CostAdv.prototype.load = function () {
    try {
      const raw = localStorage.getItem(this.STORAGE);
      const arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr)) return [];
      return arr.filter(e =>
        typeof e.start === "number" &&
        typeof e.end === "number" &&
        typeof e.cost === "number" &&
        e.end > e.start
      ).sort((a, b) => a.start - b.start);
    } catch (e) { return []; }
  };

  CostAdv.prototype.save = function (ranges) {
    localStorage.setItem(this.STORAGE, JSON.stringify(ranges));
  };

  // Add a range. Returns null on success, error message on failure.
  CostAdv.prototype.addRange = function (start, end, cost) {
    if (end <= start) return "End must be after start";
    if (cost < 0 || isNaN(cost)) return "Invalid cost";
    const existing = this.load();
    // Reject overlap
    for (const r of existing) {
      if (start < r.end && end > r.start) {
        return "Overlaps existing range";
      }
    }
    existing.push({ start, end, cost: Math.round(cost * 100) / 100 });
    existing.sort((a, b) => a.start - b.start);
    this.save(existing);
    return null;
  };

  CostAdv.prototype.removeAt = function (idx) {
    const r = this.load();
    if (idx < 0 || idx >= r.length) return;
    r.splice(idx, 1);
    this.save(r);
  };

  CostAdv.prototype.clear = function () {
    localStorage.removeItem(this.STORAGE);
  };

  // ============ COMPUTE ============
  // Returns total cost ($) for [qStart, qEnd).
  // Each second is charged at override.cost if inside any override range,
  // else at defaultCost. Default cost is taken live from the caller.
  CostAdv.prototype.costInRange = function (qStart, qEnd, defaultCost) {
    if (qEnd <= qStart) return 0;
    const ranges = this.load(); // sorted by start
    let cursor = qStart;
    let total = 0;
    const dc = defaultCost || 0;

    for (const r of ranges) {
      if (r.end <= cursor) continue;          // already passed
      if (r.start >= qEnd) break;             // beyond query
      // Gap before this override: [cursor, r.start) at default
      if (r.start > cursor) {
        const gapEnd = Math.min(qEnd, r.start);
        total += dc * (gapEnd - cursor) / 3600;
        cursor = gapEnd;
        if (cursor >= qEnd) break;
      }
      // Override portion: [cursor, min(qEnd, r.end))
      const ovrEnd = Math.min(qEnd, r.end);
      if (ovrEnd > cursor) {
        total += r.cost * (ovrEnd - cursor) / 3600;
        cursor = ovrEnd;
      }
      if (cursor >= qEnd) break;
    }
    // Trailing default
    if (cursor < qEnd) {
      total += dc * (qEnd - cursor) / 3600;
    }
    return total;
  };

  // ============ UI HELPERS ============
  function fmtDateTime(ts) {
    const d = new Date(ts * 1000);
    const wibH = (d.getUTCHours() + 7) % 24;
    const wibM = d.getUTCMinutes();
    const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getUTCMonth()];
    return `${d.getUTCDate()} ${month} ${String(wibH).padStart(2,"0")}:${String(wibM).padStart(2,"0")}`;
  }

  function toDatetimeLocal(ts) {
    const d = new Date(ts * 1000);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function fromDatetimeLocal(s) {
    if (!s) return null;
    const d = new Date(s);
    if (isNaN(d.getTime())) return null;
    return Math.floor(d.getTime() / 1000);
  }

  CostAdv.prototype.renderPanel = function (listId, accentColor, onChange) {
    const c = document.getElementById(listId);
    if (!c) return;
    const ranges = [...this.load()].sort((a, b) => b.start - a.start); // newest first

    if (!ranges.length) {
      c.innerHTML = `<div class="text-[11px] text-slate-500 italic px-1 py-3 text-center">No advanced ranges. Default cost applies to all hours.</div>`;
      return;
    }

    const sortedAsc = [...ranges].sort((a, b) => a.start - b.start);

    c.innerHTML = ranges.map(r => {
      const realIdx = sortedAsc.findIndex(x => x.start === r.start && x.end === r.end);
      const dur = (r.end - r.start) / 3600;
      return `<div class="flex items-center gap-2 py-1.5 px-2 border-b border-[#1f2937] last:border-0 hover:bg-slate-900/30 text-[11px]">
        <span class="text-slate-500 font-mono-num" style="min-width:175px">${fmtDateTime(r.start)} → ${fmtDateTime(r.end)}</span>
        <span class="font-mono-num font-semibold" style="color:${accentColor}; min-width:60px">$${r.cost.toFixed(2)}/hr</span>
        <span class="text-slate-600 font-mono-num" style="min-width:42px">${dur.toFixed(1)}h</span>
        <span class="ml-auto">
          <button data-costadv-idx="${realIdx}" class="text-red-500 hover:text-red-300 px-1.5 py-0.5 rounded hover:bg-red-950/30 text-[12px]" title="Remove">✕</button>
        </span>
      </div>`;
    }).join("");

    c.querySelectorAll('[data-costadv-idx]').forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const idx = parseInt(btn.getAttribute("data-costadv-idx"));
        if (confirm("Remove this range?")) {
          this.removeAt(idx);
          this.renderPanel(listId, accentColor, onChange);
          if (onChange) onChange();
        }
      });
    });
  };

  CostAdv.parseAddForm = function (fromId, toId, costId) {
    const start = fromDatetimeLocal(document.getElementById(fromId).value);
    const end = fromDatetimeLocal(document.getElementById(toId).value);
    const cost = parseFloat(document.getElementById(costId).value);
    if (!start || !end || isNaN(cost)) return null;
    return { start, end, cost };
  };

  CostAdv.prefillForm = function (fromId, toId) {
    const now = Math.floor(Date.now() / 1000);
    const oneHourAgo = now - 3600;
    document.getElementById(fromId).value = toDatetimeLocal(oneHourAgo);
    document.getElementById(toId).value = toDatetimeLocal(now);
  };

  global.CostAdv = CostAdv;
})(typeof window !== "undefined" ? window : this);
