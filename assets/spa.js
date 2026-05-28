/**
 * spa.js — Shared SPA shell: tab navigation, first-time setup gate, common header logic.
 *
 * Pages: dashboard / workers / rewards / blocks / settings
 *
 * Setup gate: if localStorage[`${storageKey}`] has no .wallet, show #setup-screen and hide #app-shell.
 *   Save button validates wallet, persists, then routes to dashboard.
 *
 * Tab nav: any [data-tab] click switches active page (.spa-page / .nav-btn).
 *
 * Pool button & lang button menus: shared toggle/close behavior.
 *
 * Public API (window.SPA):
 *   init({ storageKey, walletPrefix, defaultCost, defaultPrice, onReady })
 *     storageKey      — localStorage key with { wallet, cost, prl_price/prlPrice }
 *     walletPrefix    — required prefix for wallet validation (e.g. "prl1")
 *     defaultCost     — number, prefilled in setup form
 *     defaultPrice    — number, prefilled in setup form
 *     onReady(s)      — called once setup is satisfied; s = { wallet, cost, prl_price }
 *   navigate(page)    — programmatic tab switch
 *   getActivePage()
 *   reopenSetup()     — force show setup screen (used by Settings → "Reset wallet")
 */
(function (global) {
  "use strict";

  const PAGES = ["dashboard", "workers", "rewards", "blocks", "settings"];
  let cfg = null;
  let activePage = "dashboard";

  function $(id) { return document.getElementById(id); }
  function show(el) { if (el) el.classList.remove("hidden"); }
  function hide(el) { if (el) el.classList.add("hidden"); }

  function loadStored() {
    try {
      const raw = localStorage.getItem(cfg.storageKey);
      const s = JSON.parse(raw || "{}");
      // Normalize keys: support both prl_price and prlPrice for back-compat.
      if (s.prlPrice && !s.prl_price) s.prl_price = s.prlPrice;
      return s || {};
    } catch (e) { return {}; }
  }
  function persist(data) {
    localStorage.setItem(cfg.storageKey, JSON.stringify({
      wallet: data.wallet,
      cost: data.cost,
      prl_price: data.prl_price,
      prlPrice: data.prl_price, // dual-write for legacy keys
    }));
  }

  function isValidWallet(w) {
    if (!w) return false;
    if (!cfg.walletPrefix) return true;
    return w.startsWith(cfg.walletPrefix);
  }

  function showSetup() {
    hide($("app-shell"));
    show($("setup-screen"));
    const stored = loadStored();
    if ($("setup-wallet")) $("setup-wallet").value = stored.wallet || "";
    if ($("setup-cost")) $("setup-cost").value = stored.cost || cfg.defaultCost || 11;
    if ($("setup-price")) $("setup-price").value = stored.prl_price || cfg.defaultPrice || 0.40;
    if ($("setup-error")) $("setup-error").classList.add("hidden");
  }
  function hideSetup() {
    hide($("setup-screen"));
    show($("app-shell"));
  }

  function navigate(page) {
    if (!PAGES.includes(page)) page = "dashboard";
    activePage = page;
    document.querySelectorAll(".spa-page").forEach(el => {
      el.classList.toggle("hidden", el.getAttribute("data-page") !== page);
    });
    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === page);
    });
    // Allow page-specific render hook
    if (typeof cfg.onPageChange === "function") cfg.onPageChange(page);
  }

  function commitSetup() {
    const w = $("setup-wallet").value.trim();
    const c = parseFloat($("setup-cost").value) || 0;
    const p = parseFloat($("setup-price").value) || 0;
    const err = $("setup-error");
    if (!isValidWallet(w)) {
      if (err) {
        err.textContent = `Wallet must start with '${cfg.walletPrefix}'`;
        err.classList.remove("hidden");
      }
      return;
    }
    if (c <= 0) {
      if (err) {
        err.textContent = "Cost $/hr must be greater than 0";
        err.classList.remove("hidden");
      }
      return;
    }
    if (p <= 0) {
      if (err) {
        err.textContent = "PRL price must be greater than 0";
        err.classList.remove("hidden");
      }
      return;
    }
    persist({ wallet: w, cost: c, prl_price: p });
    hideSetup();
    navigate("dashboard");
    if (typeof cfg.onReady === "function") {
      cfg.onReady({ wallet: w, cost: c, prl_price: p });
    }
  }

  function reopenSetup() {
    showSetup();
  }

  function init(config) {
    cfg = Object.assign({
      storageKey: "akoya_hybrid_pl_settings",
      walletPrefix: "prl1",
      defaultCost: 11,
      defaultPrice: 0.40,
      onReady: null,
      onPageChange: null,
    }, config || {});

    // Tab navigation
    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const page = btn.getAttribute("data-tab");
        navigate(page);
      });
    });

    // Setup save button
    const saveBtn = $("setup-save");
    if (saveBtn) saveBtn.addEventListener("click", (e) => { e.preventDefault(); commitSetup(); });
    const setupForm = $("setup-form");
    if (setupForm) setupForm.addEventListener("submit", (e) => { e.preventDefault(); commitSetup(); });

    // Settings page "edit" / "reset"
    const editBtn = $("settings-edit-btn");
    if (editBtn) editBtn.addEventListener("click", (e) => { e.preventDefault(); reopenSetup(); });

    // Initial routing
    const stored = loadStored();
    if (!stored.wallet || !isValidWallet(stored.wallet)) {
      showSetup();
    } else {
      hideSetup();
      navigate("dashboard");
      if (typeof cfg.onReady === "function") {
        cfg.onReady({
          wallet: stored.wallet,
          cost: parseFloat(stored.cost) || cfg.defaultCost,
          prl_price: parseFloat(stored.prl_price) || cfg.defaultPrice,
        });
      }
    }
  }

  global.SPA = {
    init, navigate, reopenSetup,
    getActivePage: () => activePage,
    PAGES,
  };
})(typeof window !== "undefined" ? window : this);
