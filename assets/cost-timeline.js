/**
 * cost-timeline.js — Per-pool cost segment manager
 *
 * Each event = { ts: unix_seconds, cost: usd_per_hour }
 * Cost rate is "from this ts forward". Last event = current rate.
 *
 * costInRange(start, end) returns total $ for that period using
 * piecewise-constant rates between events.
 *
 * Storage key is per-pool so each pool tracks its own GPU rental
 * timeline independently.
 */
(function (global) {
  "use strict";

  function CostTimeline(poolKey, defaultCost) {
    this.STORAGE = "costtl_" + poolKey;
    this.defaultCost = defaultCost;
  }

  // ============ DATA ============
  CostTimeline.prototype.load = function () {
    try {
      const raw = localStorage.getItem(this.STORAGE);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr.filter(e => typeof e.ts === "number" && typeof e.cost === "number") : [];
    } catch (e) { return []; }
  };

  CostTimeline.prototype.save = function (events) {
    localStorage.setItem(this.STORAGE, JSON.stringify(events));
  };

  // Current cost = last event's cost, or defaultCost if no events
  CostTimeline.prototype.current = function () {
    const evs = this.load();
    if (!evs.length) return this.defaultCost;
    const sorted = [...evs].sort((a, b) => a.ts - b.ts);
    return sorted[sorted.length - 1].cost;
  };

  // Push new cost change at given ts (default: now). Skips if same as last.
  CostTimeline.prototype.push = function (cost, ts) {
    const evs = this.load();
    ts = ts || Math.floor(Date.now() / 1000);
    cost = Math.round(cost * 100) / 100; // round to 2 decimals
    // Avoid duplicate consecutive same-cost
    const sorted = [...evs].sort((a, b) => a.ts - b.ts);
    if (sorted.length && sorted[sorted.length - 1].cost === cost) return;
    evs.push({ ts, cost });
    evs.sort((a, b) => a.ts - b.ts);
    this.save(evs);
  };

  CostTimeline.prototype.removeAt = function (idx) {
    const evs = this.load();
    if (idx < 0 || idx >= evs.length) return;
    evs.splice(idx, 1);
    this.save(evs);
  };

  CostTimeline.prototype.clear = function () {
    localStorage.removeItem(this.STORAGE);
  };

  // ============ COMPUTE ============
  // Returns total cost ($) charged between [start, end) in unix seconds.
  // If no events: returns 0 (mining not started yet).
  // If range starts before first event: only counts from first event onwards.
  CostTimeline.prototype.costInRange = function (start, end) {
    if (end <= start) return 0;
    const events = [...this.load()].sort((a, b) => a.ts - b.ts);
    if (!events.length) return 0;

    // Range entirely before first event
    const firstTs = events[0].ts;
    if (end <= firstTs) return 0;

    let cursor = Math.max(start, firstTs);
    let totalCost = 0;

    // Find current segment index
    let i = 0;
    while (i < events.length - 1 && events[i + 1].ts <= cursor) i++;

    while (cursor < end && i < events.length) {
      const currRate = events[i].cost;
      const nextChange = (i + 1 < events.length) ? events[i + 1].ts : end;
      const segEnd = Math.min(end, nextChange);
      const dur = (segEnd - cursor) / 3600;
      totalCost += currRate * dur;
      cursor = segEnd;
      i++;
    }
    return totalCost;
  };

  // Was mining active during [start, end)?
  // Only "active" if range overlaps any segment after the first event.
  CostTimeline.prototype.isActiveInRange = function (start, end) {
    const events = this.load();
    if (!events.length) return false;
    const firstTs = events.sort((a, b) => a.ts - b.ts)[0].ts;
    return end > firstTs;
  };

  // ============ UI ============
  function fmtDateTime(ts) {
    const d = new Date(ts * 1000);
    const wibH = (d.getUTCHours() + 7) % 24;
    const wibM = d.getUTCMinutes();
    const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getUTCMonth()];
    return `${d.getUTCDate()} ${month} ${String(wibH).padStart(2,"0")}:${String(wibM).padStart(2,"0")}`;
  }

  // Format datetime-local input value (browser-local time)
  function toDatetimeLocal(ts) {
    const d = new Date(ts * 1000);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function fromDatetimeLocal(s) {
    if (!s) return null;
    const d = new Date(s); // browser-local interpretation
    if (isNaN(d.getTime())) return null;
    return Math.floor(d.getTime() / 1000);
  }

  /**
   * Render the timeline panel inside `containerId`.
   * `accentColor` should be a hex color matching pool theme.
   * `onChange` callback called after any mutation (so refresh() runs).
   */
  CostTimeline.prototype.renderPanel = function (containerId, accentColor, onChange) {
    const c = document.getElementById(containerId);
    if (!c) return;
    const events = [...this.load()].sort((a, b) => b.ts - a.ts); // newest first
    const now = Math.floor(Date.now() / 1000);

    if (!events.length) {
      c.innerHTML = `<div class="text-[11px] text-slate-500 italic px-1 py-2">No cost history yet — change the cost field above to record the first segment.</div>`;
      return;
    }

    const rows = events.map((e, sortIdx) => {
      const sortedAsc = [...events].sort((a, b) => a.ts - b.ts);
      const realIdx = sortedAsc.findIndex(x => x.ts === e.ts);
      const nextEvent = sortIdx > 0 ? events[sortIdx - 1] : null;
      const endTs = nextEvent ? nextEvent.ts : null;
      const endLabel = endTs ? fmtDateTime(endTs) : `<span style="color:${accentColor}">now</span>`;
      const dur = ((endTs || now) - e.ts) / 3600;
      return `<div class="flex items-center gap-2 py-1.5 px-2 border-b border-[#1f2937] last:border-0 hover:bg-slate-900/30 text-[11px]">
        <span class="text-slate-500 font-mono-num" style="min-width:165px">${fmtDateTime(e.ts)} → ${endLabel}</span>
        <span class="font-mono-num font-semibold" style="color:${accentColor}; min-width:62px">$${e.cost.toFixed(2)}/hr</span>
        <span class="text-slate-600 font-mono-num" style="min-width:42px">${dur.toFixed(1)}h</span>
        <span class="ml-auto">
          <button data-costtl-action="remove" data-costtl-idx="${realIdx}" class="text-red-500 hover:text-red-300 px-1.5 py-0.5 rounded hover:bg-red-950/30 text-[12px]" title="Remove">✕</button>
        </span>
      </div>`;
    }).join("");

    c.innerHTML = rows;

    // Attach handlers
    c.querySelectorAll('[data-costtl-action="remove"]').forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const idx = parseInt(btn.getAttribute("data-costtl-idx"));
        if (confirm("Remove this cost segment?")) {
          this.removeAt(idx);
          this.renderPanel(containerId, accentColor, onChange);
          if (onChange) onChange();
        }
      });
    });
  };

  // Helper for "+ Add" form: returns { ts, cost } or null
  CostTimeline.parseAddForm = function (timeInputId, costInputId) {
    const tsRaw = document.getElementById(timeInputId).value;
    const costRaw = document.getElementById(costInputId).value;
    const ts = fromDatetimeLocal(tsRaw);
    const cost = parseFloat(costRaw);
    if (!ts || isNaN(cost) || cost < 0) return null;
    return { ts, cost };
  };

  CostTimeline.prefillAddTime = function (timeInputId) {
    document.getElementById(timeInputId).value = toDatetimeLocal(Math.floor(Date.now() / 1000));
  };

  global.CostTimeline = CostTimeline;
})(typeof window !== "undefined" ? window : this);
