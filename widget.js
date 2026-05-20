/* ============================================================
   SummaryBreakdown widget
   ------------------------------------------------------------
   Universal component: a total value + a list of contributing
   items rendered as a stacked bar + table of rows.
   Adapts to container width via CSS container queries +
   ResizeObserver for the bar segment sizing.
   ============================================================ */

(function (global) {
  'use strict';

  /* 8-color palette (default). Order is the assignment order. */
  const DEFAULT_PALETTE = [
    '#7C7AED', // 1 indigo
    '#6CC36E', // 2 mint
    '#5FB8D6', // 3 sky
    '#E87B6F', // 4 coral
    '#E8B85F', // 5 amber
    '#DE7BAE', // 6 pink
    '#4FB8A8', // 7 teal
    '#8896A8'  // 8 slate
  ];

  /* ---------- number formatting (ru-RU) ---------- */
  function fmtNumber(n, opts) {
    opts = opts || {};
    const min = opts.minimumFractionDigits != null ? opts.minimumFractionDigits : 0;
    const max = opts.maximumFractionDigits != null ? opts.maximumFractionDigits : 2;
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: min,
      maximumFractionDigits: max
    }).format(n);
  }
  function fmtPercent(p) {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(p) + '%';
  }
  /* Compact form for tiny widths: 1 279 → 1,28K · 999999999 → 1,0 млрд */
  function fmtCompact(n) {
    const abs = Math.abs(n);
    if (abs >= 1e9) return (n / 1e9).toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + ' млрд';
    if (abs >= 1e6) return (n / 1e6).toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + ' млн';
    if (abs >= 1e4) return (n / 1e3).toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + 'K';
    return fmtNumber(n);
  }

  /* ---------- helpers ---------- */
  function el(tag, cls, txt) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  /* ---------- main render ---------- */
  function render(host, cfg) {
    host.classList.add('sbw-host');
    host.innerHTML = '';
    host.dataset.status = cfg.status || 'loaded';

    // common wrapper
    const root = el('div', 'sbw');
    host.appendChild(root);

    // ---- status branches that replace whole body ----
    if (cfg.status === 'loading') return renderLoading(root, cfg);
    if (cfg.status === 'error')   return renderError(root, cfg);
    if (cfg.status === 'empty')   return renderEmpty(root, cfg);

    // ---- header ----
    const header = el('div', 'sbw-header');
    const hLeft = el('div', 'sbw-header-left');
    hLeft.appendChild(el('div', 'sbw-label', cfg.label || ''));
    if (cfg.sublabel) hLeft.appendChild(el('div', 'sbw-sublabel', cfg.sublabel));
    header.appendChild(hLeft);

    // ---- auto-empty: items all zero ----
    const rawItems = cfg.items || [];
    if (rawItems.length > 0 && rawItems.every(it => !it.value)) {
      // render as empty state with the header preserved
      root.innerHTML = '';
      return renderEmpty(root, cfg);
    }

    const totalEl = el('div', 'sbw-total');
    totalEl.dataset.role = 'total';
    const totalText = cfg.format === 'compact'
      ? fmtCompact(cfg.total)
      : fmtNumber(cfg.total, { maximumFractionDigits: 0 });
    totalEl.textContent = totalText;
    if (cfg.unit) {
      const u = el('span', 'sbw-unit', ' ' + cfg.unit);
      totalEl.appendChild(u);
    }
    header.appendChild(totalEl);
    root.appendChild(header);

    // ---- progress bar ----
    const items = (cfg.items || []).map((it, i) => ({
      id: it.id,
      label: it.label,
      value: it.value,
      percent: it.percent != null ? it.percent : (cfg.total > 0 ? (it.value / cfg.total) * 100 : 0),
      color: it.color || DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]
    }));

    const sumPercent = items.reduce((a, b) => a + b.percent, 0);
    const partial = sumPercent < 99.5;
    const overflow = sumPercent > 100.5;

    if (cfg.showProgressBar !== false && items.length > 0) {
      const bar = el('div', 'sbw-bar');
      bar.setAttribute('role', 'img');
      bar.setAttribute('aria-label', 'Распределение: ' + items.map(i => i.label + ' ' + fmtPercent(i.percent)).join(', '));
      items.forEach(it => {
        const seg = el('div', 'sbw-seg');
        seg.style.background = it.color;
        seg.style.flexGrow = String(Math.max(it.percent, 0));
        seg.dataset.id = it.id;
        seg.title = it.label + ' · ' + fmtPercent(it.percent);
        bar.appendChild(seg);
      });
      if (partial) {
        const rest = el('div', 'sbw-seg sbw-seg-rest');
        rest.style.flexGrow = String(100 - sumPercent);
        bar.appendChild(rest);
      }
      root.appendChild(bar);
    }

    // ---- rows ----
    if (items.length > 0) {
      const list = el('div', 'sbw-list');
      const max = cfg.maxVisibleItems || 5;
      const collapsed = items.length > max && !cfg.expanded;
      const shown = collapsed ? items.slice(0, max) : items;
      shown.forEach(it => {
        const row = el('div', 'sbw-row');
        row.dataset.id = it.id;
        const dot = el('span', 'sbw-dot');
        dot.style.background = it.color;
        const lab = el('span', 'sbw-row-label', it.label);
        row.appendChild(dot);
        row.appendChild(lab);
        if (cfg.showPercent !== false) {
          const p = el('span', 'sbw-row-percent', fmtPercent(it.percent));
          row.appendChild(p);
        }
        const v = el('span', 'sbw-row-value', fmtNumber(it.value, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        row.appendChild(v);
        list.appendChild(row);
      });
      if (collapsed) {
        const more = el('button', 'sbw-more');
        more.type = 'button';
        more.textContent = 'Показать ещё ' + (items.length - max);
        more.addEventListener('click', () => render(host, Object.assign({}, cfg, { expanded: true })));
        list.appendChild(more);
      }
      root.appendChild(list);
    }

    // ---- footer flags ----
    if (overflow) {
      const f = el('div', 'sbw-foot sbw-foot-warn');
      f.innerHTML = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">' +
        '<path d="M8 1.5 L15 14 L1 14 Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>' +
        '<path d="M8 6.5 v3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' +
        '<circle cx="8" cy="12" r="0.8" fill="currentColor"/></svg>' +
        '<span><strong>Сумма позиций превышает итог</strong> на ' + fmtPercent(sumPercent - 100) + ' — проверьте данные</span>';
      root.appendChild(f);
    } else if (partial && items.length > 0) {
      const f = el('div', 'sbw-foot sbw-foot-muted');
      f.innerHTML = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">' +
        '<circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" stroke-width="1.4"/>' +
        '<path d="M8 4.5 v3.5 M8 11 v0.01" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>' +
        '<span>Учтено <strong>' + fmtPercent(sumPercent) + '</strong> от итога · остаток ' + fmtPercent(100 - sumPercent) + ' не распределён</span>';
      root.appendChild(f);
    }

    /* ---- ResizeObserver: sub-pixel bar guarantees ---- */
    if (cfg.showProgressBar !== false && items.length > 0 && 'ResizeObserver' in window) {
      const ro = new ResizeObserver(() => enforceMinSegments(root));
      ro.observe(root);
      // initial
      requestAnimationFrame(() => enforceMinSegments(root));
    }

    /* ---- bidirectional hover link: row ↔ segment ---- */
    bindHoverLink(root);
  }

  function bindHoverLink(root) {
    const bar = root.querySelector('.sbw-bar');
    if (!bar) return;
    const rows = root.querySelectorAll('.sbw-row');
    const segs = bar.querySelectorAll('.sbw-seg[data-id]');

    function setActive(id) {
      if (id) root.dataset.hoverId = id;
      else delete root.dataset.hoverId;
      rows.forEach(r => r.classList.toggle('sbw-hover-active', r.dataset.id === id));
      segs.forEach(s => s.classList.toggle('sbw-hover-active', s.dataset.id === id));
    }
    rows.forEach(r => {
      r.addEventListener('mouseenter', () => setActive(r.dataset.id));
      r.addEventListener('mouseleave', () => setActive(null));
    });
    segs.forEach(s => {
      s.addEventListener('mouseenter', () => setActive(s.dataset.id));
      s.addEventListener('mouseleave', () => setActive(null));
    });
  }

  /* segments smaller than 2px get bumped to 2px, rest is redistributed */
  function enforceMinSegments(root) {
    const bar = root.querySelector('.sbw-bar');
    if (!bar) return;
    const segs = Array.from(bar.children);
    const w = bar.clientWidth;
    if (!w) return;
    const MIN = 2;
    const total = segs.reduce((a, s) => a + parseFloat(s.style.flexGrow || '0'), 0);
    if (!total) return;
    let usedFor = 0;
    let usedShare = 0;
    segs.forEach(s => {
      const share = parseFloat(s.style.flexGrow || '0') / total;
      const px = share * w;
      if (px < MIN) { usedFor += MIN; usedShare += share; }
    });
    const remaining = Math.max(w - usedFor, 0);
    const remainingShare = 1 - usedShare;
    segs.forEach(s => {
      const share = parseFloat(s.style.flexGrow || '0') / total;
      const px = share * w;
      if (px < MIN) {
        s.style.flexBasis = MIN + 'px';
        s.style.flexGrow = '0';
      } else {
        s.style.flexBasis = '0';
        // restore growth proportional to its share of the remainder
        s.style.flexGrow = String((share / (remainingShare || 1)) * remaining);
      }
    });
  }

  /* ---------- status branches ---------- */
  function renderLoading(root, cfg) {
    const slow = cfg.loadingVariant === 'slow';
    const header = el('div', 'sbw-header');
    const hLeft = el('div', 'sbw-header-left');
    hLeft.appendChild(el('div', 'sbw-label', cfg.label || ''));
    if (cfg.sublabel) hLeft.appendChild(el('div', 'sbw-sublabel', cfg.sublabel));
    header.appendChild(hLeft);
    const totalSk = el('div', 'sbw-sk sbw-sk-total');
    header.appendChild(totalSk);
    root.appendChild(header);

    const sk = el('div', 'sbw-sk sbw-sk-bar');
    root.appendChild(sk);

    if (!slow) {
      // fast: full skeleton rows
      const list = el('div', 'sbw-list');
      for (let i = 0; i < 3; i++) {
        const row = el('div', 'sbw-row sbw-row-sk');
        row.appendChild(el('span', 'sbw-dot sbw-dot-sk'));
        row.appendChild(el('span', 'sbw-sk sbw-sk-text'));
        row.appendChild(el('span', 'sbw-sk sbw-sk-num'));
        list.appendChild(row);
      }
      root.appendChild(list);
    } else {
      // slow: explanatory plate instead of row skeletons
      const msg = el('div', 'sbw-loading-msg');
      const txt = el('div', 'sbw-loading-text');
      txt.appendChild(el('div', 'sbw-loading-title', 'Данные рассчитываются'));
      txt.appendChild(el('div', 'sbw-loading-sub', 'Это может занять несколько секунд'));
      msg.appendChild(txt);
      root.appendChild(msg);
    }
  }

  function renderError(root, cfg) {
    const header = el('div', 'sbw-header');
    const hLeft = el('div', 'sbw-header-left');
    hLeft.appendChild(el('div', 'sbw-label', cfg.label || ''));
    if (cfg.sublabel) hLeft.appendChild(el('div', 'sbw-sublabel', cfg.sublabel));
    header.appendChild(hLeft);
    root.appendChild(header);

    const box = el('div', 'sbw-error');
    const top = el('div', 'sbw-error-top');
    top.innerHTML = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">' +
      '<circle cx="8" cy="8" r="7" fill="currentColor"/>' +
      '<path d="M8 4.5 v4" stroke="white" stroke-width="1.6" stroke-linecap="round"/>' +
      '<circle cx="8" cy="11" r="0.9" fill="white"/></svg>';
    const txt = el('div', 'sbw-error-text');
    txt.appendChild(el('div', 'sbw-error-title', 'Не удалось загрузить данные'));
    txt.appendChild(el('div', 'sbw-error-sub', cfg.errorMessage || 'Проверьте подключение или попробуйте ещё раз'));
    top.appendChild(txt);
    box.appendChild(top);
    const btn = el('button', 'sbw-error-btn', 'Повторить');
    btn.type = 'button';
    box.appendChild(btn);
    root.appendChild(box);
  }

  function renderEmpty(root, cfg) {
    const header = el('div', 'sbw-header');
    const hLeft = el('div', 'sbw-header-left');
    hLeft.appendChild(el('div', 'sbw-label', cfg.label || ''));
    if (cfg.sublabel) hLeft.appendChild(el('div', 'sbw-sublabel', cfg.sublabel));
    header.appendChild(hLeft);
    const t = el('div', 'sbw-total sbw-total-empty', '—');
    header.appendChild(t);
    root.appendChild(header);

    const e = el('div', 'sbw-empty');
    e.appendChild(el('div', 'sbw-empty-icon', 'i'));
    e.appendChild(el('div', 'sbw-empty-text', cfg.emptyMessage || 'Нет данных для отображения'));
    root.appendChild(e);
  }

  /* ---------- public ---------- */
  global.SummaryBreakdown = {
    render: render,
    palette: DEFAULT_PALETTE,
    fmtNumber: fmtNumber,
    fmtPercent: fmtPercent,
    fmtCompact: fmtCompact
  };

})(window);
