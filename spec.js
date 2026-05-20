/* ============================================================
   Spec page — instantiate every example widget.
   ============================================================ */

(function () {
  'use strict';
  const SB = window.SummaryBreakdown;

  /* ----- data fixtures ----- */
  const HEADER = 'ВБС по сделке на 25.02.2026, млн. руб.';
  const HEADER_SHORT = 'ВБС по сделке';

  const ITEMS_5 = [
    { id: 'kr', label: 'Кредит',        value: 511.60, percent: 35 },
    { id: 'ak', label: 'Акции',         value: 511.60, percent: 35 },
    { id: 'rp', label: 'РЕПО',          value: 511.60, percent: 10 },
    { id: 'kk', label: 'Корп. контроль', value: 511.60, percent: 10 },
    { id: 'km', label: 'Комиссия',      value: 511.60, percent: 10 }
  ];
  const ITEMS_4 = ITEMS_5.slice(0, 4).map(i => Object.assign({}, i, { percent: i.id === 'kr' || i.id === 'ak' ? 35 : 15 }));
  const ITEMS_3 = [
    { id: 'kr', label: 'Кредит', value: 511.60, percent: 35 },
    { id: 'ak', label: 'Акции',  value: 511.60, percent: 35 },
    { id: 'rp', label: 'РЕПО',   value: 511.60, percent: 30 }
  ];
  const ITEMS_2 = [
    { id: 'kr', label: 'Кредит', value: 511.60, percent: 60 },
    { id: 'ak', label: 'Акции',  value: 511.60, percent: 40 }
  ];
  const ITEMS_1 = [{ id: 'kr', label: 'Кредит', value: 1279.00, percent: 100 }];

  const ITEMS_8 = [
    { id: 'kr',  label: 'Кредит',                 value: 320.00, percent: 25 },
    { id: 'ak',  label: 'Акции',                  value: 256.00, percent: 20 },
    { id: 'rp',  label: 'РЕПО',                   value: 192.00, percent: 15 },
    { id: 'kk',  label: 'Корп. контроль',         value: 153.60, percent: 12 },
    { id: 'km',  label: 'Комиссия',               value: 128.00, percent: 10 },
    { id: 'pr',  label: 'Производные',            value: 102.40, percent:  8 },
    { id: 'fk',  label: 'Факторинг',              value:  76.80, percent:  6 },
    { id: 'pr2', label: 'Прочее',                 value:  50.20, percent:  4 }
  ];

  const ITEMS_LONG = [
    { id: 'a', label: 'А', value: 100, percent: 10 },
    { id: 'b', label: 'Долгосрочный кредитный мезонин транш 3 серии 2024-Б', value: 200, percent: 20 },
    { id: 'c', label: 'Акции', value: 300, percent: 30 },
    { id: 'd', label: 'Корп. контроль', value: 400, percent: 40 }
  ];

  const ITEMS_PARTIAL = ITEMS_3.map((i, idx) => Object.assign({}, i, { percent: [25, 25, 25][idx] }));
  const ITEMS_OVERFLOW = ITEMS_3.map((i, idx) => Object.assign({}, i, { percent: [50, 40, 25][idx] }));
  const ITEMS_WITH_ZERO = [
    { id: 'kr', label: 'Кредит', value: 700, percent: 70 },
    { id: 'ak', label: 'Акции',  value: 300, percent: 30 },
    { id: 'rp', label: 'РЕПО',   value:   0, percent:  0 }
  ];

  function mount(selector, cfg) {
    const host = document.querySelector(selector);
    if (host) SB.render(host, cfg);
  }
  function mountAll(selector, cfg) {
    document.querySelectorAll(selector).forEach(host => SB.render(host, cfg));
  }

  /* ----- modes (section 2) ----- */
  mount('#ex-mode-full',     { label: HEADER, total: 1279, items: ITEMS_2, showPercent: true,  showProgressBar: true,  status: 'loaded' });
  mount('#ex-mode-no-pct',   { label: HEADER, total: 1279, items: ITEMS_2, showPercent: false, showProgressBar: true,  status: 'loaded' });
  mount('#ex-mode-no-bar',   { label: HEADER, total: 1279, items: ITEMS_2, showPercent: true,  showProgressBar: false, status: 'loaded' });
  mount('#ex-mode-min',      { label: HEADER, total: 1279, items: ITEMS_2, showPercent: false, showProgressBar: false, status: 'loaded' });

  /* ----- counts (section 3) ----- */
  mount('#ex-count-1', { label: HEADER, total: 1279, items: ITEMS_1, status: 'loaded' });
  mount('#ex-count-2', { label: HEADER, total: 1279, items: ITEMS_2, status: 'loaded' });
  mount('#ex-count-3', { label: HEADER, total: 1279, items: ITEMS_3, status: 'loaded' });
  mount('#ex-count-5', { label: HEADER, total: 1279, items: ITEMS_5, status: 'loaded' });
  mount('#ex-count-many', { label: HEADER, total: 1279, items: ITEMS_8, status: 'loaded', maxVisibleItems: 5 });
  mount('#ex-count-scroll', { label: HEADER, total: 1279, items: ITEMS_8, status: 'loaded', maxVisibleItems: 99, expanded: true });
  // wrap header+bar into one sticky block for this demo (covers gap with solid bg)
  (function () {
    const host = document.getElementById('ex-count-scroll');
    if (!host) return;
    const sbw = host.querySelector('.sbw');
    const header = sbw && sbw.querySelector('.sbw-header');
    const bar = sbw && sbw.querySelector('.sbw-bar');
    if (!header || !bar) return;
    const wrap = document.createElement('div');
    wrap.className = 'sbw-stuck';
    sbw.insertBefore(wrap, header);
    wrap.appendChild(header);
    wrap.appendChild(bar);
  })();

  /* ----- states (section 4) ----- */
  mount('#ex-state-loaded',  { label: HEADER, total: 1279, items: ITEMS_3, status: 'loaded' });
  mount('#ex-state-loading', { label: HEADER, total: 1279, status: 'loading' });
  mount('#ex-state-loading-slow', { label: HEADER, total: 1279, status: 'loading', loadingVariant: 'slow' });
  mount('#ex-state-error',   { label: HEADER, total: 1279, status: 'error' });
  mount('#ex-state-empty',   { label: HEADER, total: 0,    status: 'empty' });
  mount('#ex-state-empty-2', { label: HEADER, total: 0,    status: 'empty' });
  mount('#ex-state-partial', { label: HEADER, total: 1279, items: ITEMS_PARTIAL, status: 'loaded' });
  mount('#ex-state-overflow',{ label: HEADER, total: 1279, items: ITEMS_OVERFLOW, status: 'loaded' });
  mount('#ex-state-zero',    { label: HEADER, total: 1000, items: ITEMS_WITH_ZERO, status: 'loaded' });

  /* ----- colors (section 5) ----- */
  mount('#ex-palette-full', { label: HEADER, total: 1279, items: ITEMS_8, status: 'loaded', maxVisibleItems: 99 });
  mount('#ex-palette-dark', { label: HEADER, total: 1279, items: ITEMS_5, status: 'loaded' });

  /* ----- progress bar (section 6) ----- */
  mount('#ex-bar-tiny',    { label: HEADER, total: 10000, items: [
    { id: 'a', label: 'Доминирующая позиция', value: 9970, percent: 99.7 },
    { id: 'b', label: 'Малая доля',           value:   30, percent:  0.3 }
  ], status: 'loaded' });
  mount('#ex-bar-three',   { label: HEADER, total: 1279, items: ITEMS_3, status: 'loaded' });

  /* ----- section 7: width breakpoints ----- */
  mount('#ex-w-wide',    { label: HEADER, total: 1279, items: ITEMS_3, status: 'loaded' });
  mount('#ex-w-mid',     { label: HEADER, total: 1279, items: ITEMS_3, status: 'loaded' });
  mount('#ex-w-narrow',  { label: HEADER_SHORT, total: 1279, items: ITEMS_3, status: 'loaded' });
  mount('#ex-w-tiny',    { label: HEADER_SHORT, total: 1279, items: ITEMS_3, status: 'loaded' });

  /* ----- section 7.2: height scenarios ----- */
  mount('#ex-h-a', { label: HEADER, total: 1279, items: ITEMS_8, status: 'loaded', maxVisibleItems: 99 });
  mount('#ex-h-b', { label: HEADER, total: 1279, items: ITEMS_5, status: 'loaded' });
  mount('#ex-h-c', { label: HEADER, total: 1279, items: ITEMS_5, status: 'loaded' });

  /* ----- section 7.3: stretch ----- */
  mount('#ex-stretch-good', { label: HEADER, total: 1279, items: ITEMS_3, status: 'loaded' });
  mount('#ex-stretch-bad',  { label: HEADER, total: 1279, items: ITEMS_3, status: 'loaded' });

  /* ----- section 7.4: layouts ----- */
  mount('#ex-sidebar',    { label: HEADER_SHORT, sublabel: '25.02.2026', total: 1279, items: ITEMS_5, status: 'loaded', maxVisibleItems: 3 });
  mount('#ex-modal-360',  { label: HEADER, total: 1279, items: ITEMS_3, status: 'loaded' });
  mount('#ex-modal-640',  { label: HEADER, total: 1279, items: ITEMS_3, status: 'loaded' });
  mount('#ex-accordion',  { label: HEADER, total: 1279, items: ITEMS_3, status: 'loaded' });

  /* ----- section 7.6: content ----- */
  mount('#ex-content-long-sub',   { label: 'Сводный показатель портфеля', sublabel: 'Расчёт по консолидированной отчётности группы за период с 01.01.2026 по 25.02.2026, в миллионах рублей', total: 1279, items: ITEMS_3, status: 'loaded' });
  mount('#ex-content-big-num',    { label: HEADER, total: 1500000000, items: [
    { id: 'kr', label: 'Кредит', value: 525000000, percent: 35 },
    { id: 'ak', label: 'Акции',  value: 525000000, percent: 35 },
    { id: 'rp', label: 'РЕПО',   value: 450000000, percent: 30 }
  ], status: 'loaded', format: 'compact' });
  mount('#ex-content-mixed-len',  { label: HEADER, total: 1000, items: ITEMS_LONG, status: 'loaded' });

  /* ----- section 9: corner cases ----- */
  // 0px container — rendered then nudged
  (function () {
    const host = document.getElementById('ex-corner-zero');
    if (!host) return;
    SB.render(host, { label: HEADER, total: 1279, status: 'loading' });
  })();
  // total = 0, items имеют ненулевые значения (overflow-сценарий)
  mount('#ex-corner-zero-total', { label: HEADER, total: 0, items: [
    { id: 'kr', label: 'Кредит', value: 100, percent: 50 },
    { id: 'ak', label: 'Акции',  value: 100, percent: 50 }
  ], status: 'loaded' });
  // negative total
  (function () {
    const host = document.getElementById('ex-corner-negative');
    if (!host) return;
    SB.render(host, { label: 'Финансовый результат', sublabel: 'Q1 2026', total: -500, items: [
      { id: 'kr', label: 'Списания',    value: 300, percent: 60 },
      { id: 'ak', label: 'Резервы',     value: 200, percent: 40 }
    ], status: 'loaded', showProgressBar: false });
  })();
  mount('#ex-corner-bad-data', { label: HEADER, total: 1279, status: 'error', errorMessage: 'item.value не передан для позиции «Кредит»' });
  // duplicate ids — render anyway; passing dups intentionally
  mount('#ex-corner-dupes', { label: HEADER, total: 1279, items: [
    { id: 'x', label: 'Кредит', value: 511.60, percent: 35 },
    { id: 'x', label: 'Акции',  value: 511.60, percent: 35 },
    { id: 'y', label: 'РЕПО',   value: 511.60, percent: 30 }
  ], status: 'loaded' });
  // many items
  (function () {
    const many = [];
    const labels = ['Кредит','Акции','РЕПО','Корп. контроль','Комиссия','Производные','Факторинг','Лизинг','Гарантии','Аккредитивы','Векселя','Облигации','Депозиты','Инкассо','Брокеридж','Налоги','Страхование','Аренда','Логистика','Консалтинг'];
    for (let i = 0; i < 20; i++) {
      many.push({ id: 'm' + i, label: labels[i % labels.length] + ' ' + (i+1), value: 100 - i * 3, percent: 5 });
    }
    mount('#ex-corner-many', { label: HEADER, total: 1279, items: many, status: 'loaded', maxVisibleItems: 5 });
  })();
  const demoFrame = document.getElementById('demo-frame');
  const demoRange = document.getElementById('demo-range');
  const demoNum   = document.getElementById('demo-num');
  const demoCount = document.getElementById('demo-count');
  const demoPartial = document.getElementById('demo-partial');
  const demoHeightOn = document.getElementById('demo-height-on');
  const demoHeightRange = document.getElementById('demo-height-range');
  const demoHeightNum = document.getElementById('demo-height-num');
  const demoOverflowMode = document.getElementById('demo-overflow-mode');
  let demoExpanded = false;
  function renderDemo() {
    const n = parseInt(demoCount.value, 10);
    const partial = demoPartial && demoPartial.checked;
    const slice = ITEMS_8.slice(0, n);
    // rescale so percents always sum to 100 — unless «partial» toggle is on
    const target = partial ? 70 : 100;
    const sum = slice.reduce((a, b) => a + b.percent, 0) || 1;
    const items = slice.map(it => Object.assign({}, it, { percent: it.percent * target / sum }));
    SB.render(demoFrame, { label: HEADER, sublabel: '25.02.2026', unit: '', total: 1279, items: items, status: 'loaded', maxVisibleItems: 99 });
    // wrap header+bar so they can be sticky on scroll
    const sbw = demoFrame.querySelector('.sbw');
    const header = sbw && sbw.querySelector('.sbw-header');
    const bar = sbw && sbw.querySelector('.sbw-bar');
    if (sbw && header && bar) {
      const wrap = document.createElement('div');
      wrap.className = 'sbw-stuck';
      sbw.insertBefore(wrap, header);
      wrap.appendChild(header);
      wrap.appendChild(bar);
    }
    applyHeight(); // re-apply height/mode after re-render
  }
  function applyHeight() {
    const on = demoHeightOn && demoHeightOn.checked;
    [demoHeightRange, demoHeightNum, demoOverflowMode].forEach(el => { if (el) el.disabled = !on; });
    demoFrame.classList.remove('demo-frame-height', 'demo-frame-fade', 'demo-frame-scroll', 'demo-frame-expand');
    // remove any existing inline controls
    const oldBtn = demoFrame.querySelector('.demo-expand-btn');
    if (oldBtn) oldBtn.remove();
    const oldLink = demoFrame.querySelector('.demo-overflow-link');
    if (oldLink) oldLink.remove();
    if (!on) {
      demoFrame.style.height = '';
      demoExpanded = false;
      return;
    }
    const mode = (demoOverflowMode && demoOverflowMode.value) || 'fade';
    const expandedNow = (mode === 'expand' && demoExpanded);
    if (expandedNow) {
      // expanded — drop the height limit, show "Свернуть" button at the bottom
      demoFrame.style.height = '';
      demoFrame.classList.add('demo-frame-expand');
      const btn = document.createElement('button');
      btn.className = 'demo-expand-btn';
      btn.textContent = 'Свернуть';
      btn.addEventListener('click', () => { demoExpanded = false; applyHeight(); });
      demoFrame.appendChild(btn);
      return;
    }
    const h = parseInt(demoHeightRange.value, 10) || 200;
    demoFrame.style.height = h + 'px';
    demoFrame.classList.add('demo-frame-height');
    if (mode === 'fade') {
      demoFrame.classList.add('demo-frame-fade');
      addOverflowLink(false);
    }
    if (mode === 'scroll') demoFrame.classList.add('demo-frame-scroll');
    if (mode === 'expand') {
      demoFrame.classList.add('demo-frame-fade', 'demo-frame-expand');
      const btn = document.createElement('button');
      btn.className = 'demo-expand-btn';
      btn.textContent = 'Развернуть';
      btn.addEventListener('click', () => { demoExpanded = true; applyHeight(); });
      demoFrame.appendChild(btn);
    }
  }
  // count rows whose top is past the visible bottom of the frame
  function addOverflowLink(clickable) {
    requestAnimationFrame(() => {
      const rows = demoFrame.querySelectorAll('.sbw-row');
      if (!rows.length) return;
      const frameRect = demoFrame.getBoundingClientRect();
      const cutoff = frameRect.bottom - 36; // leave room for the link itself
      let hidden = 0;
      rows.forEach(r => {
        const rect = r.getBoundingClientRect();
        if (rect.top >= cutoff) hidden++;
      });
      if (hidden <= 0) return;
      const link = document.createElement('a');
      link.className = 'demo-overflow-link';
      link.href = '#';
      link.textContent = 'Ещё ' + hidden + ' ' + plural(hidden, ['позиция', 'позиции', 'позиций']) + ' →';
      if (!clickable) link.addEventListener('click', e => e.preventDefault());
      demoFrame.appendChild(link);
    });
  }
  function plural(n, forms) {
    const mod10 = n % 10, mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return forms[0];
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
    return forms[2];
  }
  function setWidth(w) {
    w = Math.max(120, Math.min(880, w));
    demoFrame.style.width = w + 'px';
    demoFrame.dataset.width = w;
    demoRange.value = w;
    demoNum.value = w;
  }
  function setHeight(h) {
    h = Math.max(48, Math.min(500, h));
    demoHeightRange.value = h;
    demoHeightNum.value = h;
    applyHeight();
  }
  if (demoRange) {
    demoRange.addEventListener('input', e => setWidth(parseInt(e.target.value, 10)));
    demoNum.addEventListener('input', e => setWidth(parseInt(e.target.value, 10) || 120));
    demoCount.addEventListener('change', renderDemo);
    if (demoPartial) demoPartial.addEventListener('change', renderDemo);
    if (demoHeightOn) demoHeightOn.addEventListener('change', applyHeight);
    if (demoHeightRange) demoHeightRange.addEventListener('input', e => setHeight(parseInt(e.target.value, 10)));
    if (demoHeightNum)   demoHeightNum.addEventListener('input', e => setHeight(parseInt(e.target.value, 10) || 48));
    if (demoOverflowMode) demoOverflowMode.addEventListener('change', () => { demoExpanded = false; applyHeight(); });
    new ResizeObserver(entries => {
      for (const en of entries) {
        const w = Math.round(en.contentRect.width);
        demoFrame.dataset.width = w;
        demoRange.value = w;
        demoNum.value = w;
      }
    }).observe(demoFrame);
    setWidth(560);
    renderDemo();
  }

  /* ----- sticky nav active state ----- */
  const links = Array.from(document.querySelectorAll('.doc-nav a[href^="#"]'));
  const targets = links.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const id = en.target.id;
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      }
    });
  }, { rootMargin: '-30% 0px -65% 0px' });
  targets.forEach(t => io.observe(t));

})();
