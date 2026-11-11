/* ==========================================================================
   AXIOMVALUES // ETHOSSCALES
   app.js : state machine, scoring engine, visualizations, share + export
   --------------------------------------------------------------------------
   Depends on globals from questions.js (QUESTIONS, RESPONSES) and
   ideologies.js (AXES, IDEOLOGIES). No build step, no backend.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* 0. CONFIG + STATE                                                   */
  /* ------------------------------------------------------------------ */

  const CONFIG = {
    brand: 'ETHOSSCALES',
    brandUrl: 'fletcher-eng.github.io/ethoscales',
    plotlyUrl: 'https://cdn.plot.ly/plotly-2.35.2.min.js',
    fadeMs: 180,
    card: { width: 1080, height: 1350 }
  };

  const AXIS_KEYS = AXES.map((a) => a.key);
  const AXIS_BY_KEY = Object.fromEntries(AXES.map((a) => [a.key, a]));

  // Poster palette, shared by the 3D chart and the result card.
  const THEME = { paper: '#EEE6D3', paper2: '#F7F1E1', ink: '#111111', red: '#C42318' };

  // One color per ideology family, used to tell clusters apart on the 3D chart.
  const FAMILY_COLORS = {
    'Third Position': '#6B3A1E', 'Communist': '#C42318', 'Anarchist': '#111111', 'Autonomist': '#B0307A',
    'Socialist': '#E5457D', 'Liberal': '#F5B700', 'Conservative': '#1D3FBB', 'Nationalist': '#EE6C1B',
    'Religious': '#6FB7E8', 'Neoreactionary': '#6F45D0', 'Green': '#10743F', 'Technological': '#0B6C75',
    'Classical': '#9A9A8E', 'Meme': '#C2A46B'
  };

  // Size of the marker on each answer button: big at the strong ends, small in the middle.
  const ANSWER_MARK_SIZES = [22, 16, 10, 16, 22];

  // Six 2D compasses. Between them they show all twelve axes once.
  const COMPASSES = [
    { id: 'classic', title: 'Classic compass', x: 'econ', y: 'rule' },
    { id: 'property', title: 'Property and rights', x: 'own', y: 'rights' },
    { id: 'state', title: 'State and nation', x: 'struct', y: 'nation' },
    { id: 'culture', title: 'Identity and culture', x: 'ident', y: 'cult' },
    { id: 'future', title: 'Tech and ecology', x: 'tech', y: 'eco' },
    { id: 'spirit', title: 'Faith and force', x: 'relig', y: 'force' }
  ];

  // Portrait credits, loaded from figures/credits.json. An ideology whose id
  // is missing here has no portrait yet and gets a name plate instead.
  let FIGURE_CREDITS = {};

  const state = {
    view: 'landing',     // 'landing' | 'quiz' | 'results'
    mode: 'full',        // 'full' (60) | 'quick' (24)
    questions: [],       // active question bank for this run
    index: 0,            // current question index
    answers: [],         // response weight per question (null = unanswered)
    scores: null,        // one value per axis key, each 0..100
    matches: [],         // ideologies sorted by distance, ascending
    plotAxes: null,      // the 3 axis keys shown in the 3D chart (null = auto)
    // 'map' = all axes squeezed into 3D, 'flat' = the same in 2D, 'axes' = pick 3 raw axes.
    // Small screens open on the flat map, which is much easier to read at that size.
    plotMode: window.innerWidth < 700 ? 'flat' : 'map',
    friend: null,        // { scores, matches } for a pasted friend link
    storyFile: null,     // the story sized share image, built ahead of the tap
    busy: false          // true while a question transition is animating
  };

  const $ = (sel) => document.querySelector(sel);
  const el = {};

  /* ------------------------------------------------------------------ */
  /* 1. MATH ENGINE                                                      */
  /* ------------------------------------------------------------------ */

  /**
   * Maximum and minimum raw score each axis can reach for a question bank.
   * A question with effect E can contribute anywhere in [-|E|, +|E|], so
   * Max = sum of |E| and Min = -Max.
   */
  function computeBounds(questions) {
    const bounds = {};
    AXIS_KEYS.forEach((k) => { bounds[k] = { min: 0, max: 0 }; });
    questions.forEach((q) => {
      Object.entries(q.effects).forEach(([axis, effect]) => {
        if (!bounds[axis]) return;
        bounds[axis].max += Math.abs(effect);
        bounds[axis].min -= Math.abs(effect);
      });
    });
    return bounds;
  }

  /** Step 1: raw accumulation. S_a += m * effect_a for every answered question. */
  function computeRawScores(questions, answers) {
    const raw = {};
    AXIS_KEYS.forEach((k) => { raw[k] = 0; });
    questions.forEach((q, i) => {
      const m = answers[i];
      if (m === null || m === undefined) return;
      Object.entries(q.effects).forEach(([axis, effect]) => {
        if (axis in raw) raw[axis] += m * effect;
      });
    });
    return raw;
  }

  /** Step 2: normalization. Percentage_a = (S_a - Min_a) / (Max_a - Min_a) * 100 */
  function normalizeScores(raw, bounds) {
    const pct = {};
    AXIS_KEYS.forEach((k) => {
      const span = bounds[k].max - bounds[k].min;
      pct[k] = span === 0 ? 50 : ((raw[k] - bounds[k].min) / span) * 100;
      pct[k] = round1(clamp(pct[k], 0, 100));
    });
    return pct;
  }

  /**
   * Step 3: Euclidean distance across every axis, sorted ascending.
   * The match score is 100 - D/2 for six axes. With more axes the largest
   * possible distance grows by sqrt(axes / 6), so the divisor grows with it
   * and the score keeps the same meaning.
   */
  function matchIdeologies(scores) {
    return IDEOLOGIES.map((ideo) => {
      const sumSq = AXIS_KEYS.reduce((acc, k) => acc + Math.pow(scores[k] - ideo.coords[k], 2), 0);
      const distance = Math.sqrt(sumSq);
      return {
        ideology: ideo,
        distance: distance,
        compatibility: Math.max(0, 100 - distance / (2 * Math.sqrt(AXIS_KEYS.length / 6)))
      };
    }).sort((a, b) => a.distance - b.distance);
  }

  /** The three axes furthest from the 50% midpoint, most polarized first. */
  function mostPolarizedAxes(scores, count) {
    return AXIS_KEYS
      .map((k, order) => ({ key: k, order: order, spread: Math.abs(scores[k] - 50) }))
      .sort((a, b) => (b.spread - a.spread) || (a.order - b.order))
      .slice(0, count)
      .map((item) => item.key);
  }

  /**
   * A best fit map of all the axes in 3 dimensions (principal component analysis).
   * It finds the 3 directions along which the ideologies differ the most, so dots
   * that are close on the map are close across every axis, as far as 3D allows.
   */
  const MAP = (function buildMap() {
    const n = AXIS_KEYS.length;
    const rows = IDEOLOGIES.map((i) => AXIS_KEYS.map((k) => i.coords[k]));
    const mean = AXIS_KEYS.map((_, j) => rows.reduce((s, r) => s + r[j], 0) / rows.length);
    const cov = Array.from({ length: n }, () => new Array(n).fill(0));
    rows.forEach((r) => {
      for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) cov[a][b] += ((r[a] - mean[a]) * (r[b] - mean[b])) / rows.length;
    });
    const total = cov.reduce((s, r, a) => s + r[a], 0);
    const dims = [];
    const work = cov.map((r) => r.slice());
    for (let d = 0; d < 3; d++) {
      // Power iteration finds the strongest remaining direction.
      let v = new Array(n).fill(0).map((_, j) => 1 / (j + 1 + d));
      let value = 0;
      for (let it = 0; it < 300; it++) {
        const w = work.map((r) => r.reduce((s, x, j) => s + x * v[j], 0));
        value = Math.hypot(...w) || 1;
        v = w.map((x) => x / value);
      }
      // Fix the sign so the map never flips between page loads.
      const biggest = v.reduce((best, x, j) => (Math.abs(x) > Math.abs(v[best]) ? j : best), 0);
      if (v[biggest] < 0) v = v.map((x) => -x);
      dims.push({ vector: v, share: value / total });
      for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) work[a][b] -= value * v[a] * v[b];
    }
    const project = (coords) => dims.map((dim) => AXIS_KEYS.reduce((s, k, j) => s + (coords[k] - mean[j]) * dim.vector[j], 0));
    // Describe each dimension by the two axes that drive it most, and say which
    // pole of each lies at the low end and which at the high end.
    const ends = dims.map((dim) => {
      const top = dim.vector.map((x, j) => ({ j, x })).sort((p, q) => Math.abs(q.x) - Math.abs(p.x)).slice(0, 2);
      return {
        low: top.map((p) => (p.x > 0 ? AXES[p.j].low.short : AXES[p.j].high.short)).join(', '),
        high: top.map((p) => (p.x > 0 ? AXES[p.j].high.short : AXES[p.j].low.short)).join(', ')
      };
    });
    const centre = {};
    AXIS_KEYS.forEach((k) => { centre[k] = 50; });
    return {
      project, ends, centre: project(centre),
      captured: Math.round(dims.reduce((s, d) => s + d.share, 0) * 100),
      capturedFlat: Math.round((dims[0].share + dims[1].share) * 100)
    };
  })();

  function clamp(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); }
  function round1(n) { return Math.round(n * 10) / 10; }
  function fmt(n) { return (Math.round(n * 10) / 10).toFixed(1); }

  /* ------------------------------------------------------------------ */
  /* 2. URL STATE (share links)                                          */
  /* ------------------------------------------------------------------ */

  function writeScoresToUrl(scores) {
    const params = new URLSearchParams();
    AXES.forEach((a) => params.set(a.param, scores[a.key]));
    try {
      window.history.pushState({}, '', '?' + params.toString());
    } catch (err) {
      // Some browsers block pushState on file:// pages. The app still works.
      console.warn('Could not update URL:', err);
    }
  }

  /** Returns a scores object if every axis param is present and numeric, else null. */
  function readScoresFromUrl(search) {
    const params = new URLSearchParams(search === undefined ? window.location.search : search);
    const scores = {};
    for (const axis of AXES) {
      const rawValue = params.get(axis.param);
      if (rawValue === null || rawValue.trim() === '') return null;
      const n = Number(rawValue);
      if (!Number.isFinite(n)) return null;
      scores[axis.key] = round1(clamp(n, 0, 100));
    }
    return scores;
  }

  function clearUrl() {
    try {
      window.history.pushState({}, '', window.location.pathname);
    } catch (err) { /* ignore */ }
  }

  /* ------------------------------------------------------------------ */
  /* 3. VIEW ROUTER                                                      */
  /* ------------------------------------------------------------------ */

  function showView(name) {
    state.view = name;
    ['landing', 'quiz', 'results'].forEach((v) => {
      const node = el.views[v];
      if (v === name) {
        node.classList.remove('is-hidden');
        node.classList.add('is-fading');
        // Two frames so the browser registers the starting opacity.
        requestAnimationFrame(() => requestAnimationFrame(() => node.classList.remove('is-fading')));
      } else {
        node.classList.add('is-hidden');
      }
    });
    // Drop focus from a button in the view that just closed, so Enter works on the next one.
    if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
    el.progress.classList.toggle('is-off', name !== 'quiz');
    window.scrollTo(0, 0);
  }

  /** A question's lead axis is the first one listed in its effects. It sets the color and shape. */
  function leadAxis(question) {
    return AXIS_BY_KEY[Object.keys(question.effects)[0]];
  }

  /** Segmented progress: one block per question, filled in that question's color. */
  function renderProgress(doneCount) {
    const total = state.questions.length;
    el.progress.innerHTML = state.questions.map((q, i) => {
      if (i < doneCount) return `<span style="background:${leadAxis(q).color}"></span>`;
      if (i === doneCount) return '<span class="is-now"></span>';
      return '<span></span>';
    }).join('');
    el.progress.setAttribute('aria-valuenow', String(Math.round((doneCount / total) * 100)));
  }

  /** Decide what to show based on the URL. Runs on load and on back/forward. */
  function route() {
    const shared = readScoresFromUrl();
    if (shared) {
      state.scores = shared;
      state.matches = matchIdeologies(shared);
      showView('results');
      renderResults(state.answers.length ? 'From your answers' : 'Loaded from a share link');
    } else {
      showView('landing');
    }
  }

  /* ------------------------------------------------------------------ */
  /* 4. LANDING                                                          */
  /* ------------------------------------------------------------------ */

  function renderLanding() {
    el.axisChips.innerHTML = AXES.map((a) => `
      <div class="axis-tile" style="--c:${a.color};--k:${a.ink}">
        <div class="shape shape-${a.shape}"></div>
        <h3>${a.name}</h3>
        <p>${a.low.label} vs ${a.high.label}</p>
        <p class="about">${a.about}</p>
      </div>`).join('');
    renderCatalog();
    setMode(state.mode);
  }

  /** Every ideology, grouped by family, each folding open to its definition and source. */
  function renderCatalog() {
    const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    el.catalogCount.textContent = IDEOLOGIES.length;
    el.catalog.innerHTML = Object.keys(FAMILY_COLORS).map((family) => {
      const members = IDEOLOGIES.filter((i) => i.family === family);
      if (!members.length) return '';
      return `
        <section class="family" style="--fc:${FAMILY_COLORS[family]}">
          <h3><i></i>${family}<small>${members.length}</small></h3>
          <div class="family-grid">
            ${members.map((i) => `
              <details class="ideo">
                <summary><span class="sym">${SYMBOLS.svg(i)}</span><b>${esc(i.name)}<small>${esc(i.figure.name)}</small></b></summary>
                <div class="body">
                  <div class="tag">${esc(i.tagline)}</div>
                  <p>${esc(i.desc)}</p>
                  <p class="src">${esc(i.source.note || `Defined from: ${i.source.author}, ${i.source.work} (${i.source.year})`)}</p>
                </div>
              </details>`).join('')}
          </div>
        </section>`;
    }).join('');
  }

  function setMode(mode) {
    state.mode = mode;
    document.querySelectorAll('.mode-btn').forEach((btn) => {
      const active = btn.dataset.mode === mode;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-checked', String(active));
    });
    el.duration.textContent = mode === 'quick' ? 'About 4 minutes' : 'About 9 minutes';
  }

  /* ------------------------------------------------------------------ */
  /* 5. QUIZ                                                             */
  /* ------------------------------------------------------------------ */

  /* Progress is kept in this browser only, so closing the tab does not lose your answers. */
  const PROGRESS_KEY = 'ethoscales.progress.v1';
  function saveProgress() {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify({ mode: state.mode, answers: state.answers, index: state.index })); } catch (err) { /* storage unavailable */ }
  }
  function loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) || 'null');
      const total = (saved && saved.mode === 'quick' ? QUESTIONS.filter((q) => q.quick) : QUESTIONS).length;
      const ok = saved && (saved.mode === 'quick' || saved.mode === 'full') && Array.isArray(saved.answers) &&
        saved.answers.length === total && Number.isInteger(saved.index) && saved.index > 0 && saved.index < total &&
        saved.answers.every((a) => a === null || RESPONSES.some((r) => r.weight === a));
      return ok ? saved : null;
    } catch (err) { return null; }
  }
  function clearProgress() {
    try { localStorage.removeItem(PROGRESS_KEY); } catch (err) { /* storage unavailable */ }
  }

  function startQuiz() {
    state.questions = state.mode === 'quick' ? QUESTIONS.filter((q) => q.quick) : QUESTIONS.slice();
    state.answers = new Array(state.questions.length).fill(null);
    state.index = 0;
    state.friend = null;
    const saved = loadProgress();
    if (saved && saved.mode === state.mode) {
      state.answers = saved.answers;
      state.index = saved.index;
      toast('Picked up where you left off');
    }
    state.busy = false;
    state.plotAxes = null;
    el.quizModeLabel.textContent = state.mode === 'quick' ? 'Quick test' : 'Full test';
    showView('quiz');
    renderQuestion();
  }

  function renderQuestion() {
    const total = state.questions.length;
    const q = state.questions[state.index];
    const axis = leadAxis(q);
    const pad = (n) => String(n).padStart(2, '0');

    // Each question wears the color and shape of the axis it moves most.
    el.questionCard.style.setProperty('--qbg', axis.color);
    el.questionCard.style.setProperty('--qink', axis.ink);
    el.qShapes.forEach((node, i) => { node.className = `s${i + 1} shape-${axis.shape}`; });

    el.counter.textContent = `${pad(state.index + 1)} / ${pad(total)}`;
    el.questionAxis.textContent = axis.name;
    el.questionText.textContent = q.text;
    el.btnBack.disabled = state.index === 0;
    renderProgress(state.index);
    if (state.index >= total - 6) preloadPlotly();

    const previous = state.answers[state.index];
    el.answerList.innerHTML = '';
    RESPONSES.forEach((r, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const side = r.weight > 0 ? ' agree' : r.weight < 0 ? ' disagree' : '';
      btn.className = 'answer-btn' + side + (previous === r.weight ? ' is-selected' : '');
      btn.style.setProperty('--sz', ANSWER_MARK_SIZES[i] + 'px');
      btn.innerHTML = `<span class="mark">${r.label}</span><kbd>${r.key}</kbd>`;
      btn.addEventListener('click', () => answer(r.weight, btn));
      el.answerList.appendChild(btn);
    });
  }

  /** Slide the card out, run the change, slide it back in. */
  function transitionQuestion(change) {
    state.busy = true;
    el.questionCard.classList.add('is-fading');
    setTimeout(() => {
      change();
      el.questionCard.classList.remove('is-fading');
      state.busy = false;
    }, CONFIG.fadeMs);
  }

  function answer(weight, btn) {
    if (state.busy || state.view !== 'quiz') return;
    state.answers[state.index] = weight;

    if (btn) {
      el.answerList.querySelectorAll('.answer-btn').forEach((b) => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
    }

    const isLast = state.index === state.questions.length - 1;
    if (isLast) {
      state.busy = true;
      renderProgress(state.questions.length);
      setTimeout(finishQuiz, 320);
    } else {
      transitionQuestion(() => {
        state.index += 1;
        saveProgress();
        renderQuestion();
      });
    }
  }

  function goBack() {
    if (state.busy || state.view !== 'quiz' || state.index === 0) return;
    transitionQuestion(() => {
      state.index -= 1;
      renderQuestion();
    });
  }

  function finishQuiz() {
    const bounds = computeBounds(state.questions);
    const raw = computeRawScores(state.questions, state.answers);
    state.scores = normalizeScores(raw, bounds);
    state.matches = matchIdeologies(state.scores);
    state.busy = false;
    clearProgress();

    writeScoresToUrl(state.scores);
    showView('results');
    renderResults('From your answers');
  }

  /* ------------------------------------------------------------------ */
  /* 6. RESULTS                                                          */
  /* ------------------------------------------------------------------ */

  function renderResults(sourceLabel) {
    const scores = state.scores;
    const top = state.matches[0];

    el.resultVector.textContent = AXES.map((a) => `${a.key} ${fmt(scores[a.key])}`).join(' / ');
    el.resultSource.textContent = sourceLabel || '';
    el.shareUrl.value = window.location.href;

    renderMatchCard(top);
    renderHighlights(scores);
    revealVerdict();
    renderFullRanking();
    renderCompare();
    renderFigure(top.ideology);
    renderAxisBars(scores);
    renderPlotPickers(scores);
    renderCompasses(scores, top.ideology);

    // Plotly needs a visible container with a real width, so wait a frame.
    requestAnimationFrame(() => renderPlot3D(scores));

    // The card preview draws after web fonts are ready so text measures right.
    buildResultCard().then((canvas) => {
      el.cardPreview.src = canvas.toDataURL('image/png');
    }).catch((err) => console.warn('Card preview failed:', err));
    if (navigator.share) prepareStoryFile();
  }

  const REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Count a percentage up from zero. Skipped for people who ask for less motion. */
  function countUp(node, value) {
    const final = fmt(value) + '%';
    if (REDUCED_MOTION || !window.requestAnimationFrame) { node.textContent = final; return; }
    const start = performance.now();
    const duration = 700;
    const token = (node.dataset.count = String(start)); // a newer count cancels an older one
    function frame(now) {
      if (node.dataset.count !== token) return;
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      node.textContent = t < 1 ? fmt(value * eased) + '%' : final;
      if (t < 1) requestAnimationFrame(frame);
    }
    node.textContent = '0.0%';
    requestAnimationFrame(frame);
  }

  /** Replay the verdict's entrance: each line rises in a beat after the one above. */
  function revealVerdict() {
    const verdict = el.matchName.closest('.verdict');
    Array.from(el.matchName.parentElement.children).forEach((child, i) => child.style.setProperty('--i', i));
    verdict.classList.remove('is-revealing');
    void verdict.offsetWidth; // restart the animation
    verdict.classList.add('is-revealing');
  }

  /** Shrink the big match name until its longest word fits the column. */
  function fitMatchName() {
    const node = el.matchName;
    node.style.fontSize = '';
    let size = parseFloat(getComputedStyle(node).fontSize);
    while (node.scrollWidth > node.clientWidth + 1 && size > 30) {
      size -= 4;
      node.style.fontSize = size + 'px';
    }
  }

  function renderMatchCard(top) {
    el.matchName.textContent = top.ideology.name;
    fitMatchName();
    el.matchSymbol.innerHTML = SYMBOLS.svg(top.ideology);
    el.matchFamily.textContent = top.ideology.family ? top.ideology.family + ' family' : '';
    const src = top.ideology.source;
    // Meme ideologies have no founding text, so they carry a note instead.
    el.matchSource.textContent = src.note || `Defined from: ${src.author}, ${src.work} (${src.year})`;
    countUp(el.matchScore, top.compatibility);
    el.matchDistance.textContent = 'Distance ' + top.distance.toFixed(2);
    el.matchTagline.textContent = top.ideology.tagline;
    el.matchDesc.textContent = top.ideology.desc;

    el.matchList.innerHTML = state.matches.slice(0, 5).map((m, i) => `
      <li>
        <span class="rk">${i + 1}</span>
        <span class="sym">${SYMBOLS.svg(m.ideology)}</span>
        <span class="nm">${m.ideology.name}<small>${m.ideology.figure.name}</small></span>
        <span class="pc num">${fmt(m.compatibility)}%</span>
      </li>`).join('');

    const far = state.matches[state.matches.length - 1];
    el.matchOpposite.innerHTML = `${far.ideology.name}<small>${fmt(far.compatibility)}% match / distance ${far.distance.toFixed(2)}</small>`;
  }

  /** The three axes where this person sits furthest from the middle. */
  function renderHighlights(scores) {
    const ranked = AXES.map((a) => ({ a, v: scores[a.key], spread: Math.abs(scores[a.key] - 50) })).sort((p, q) => q.spread - p.spread);
    if (ranked[0].spread < 8) {
      el.highlights.innerHTML = '<div class="hl-flat"><b>Dead centre</b><span>You sit close to the middle on all twelve axes. No strong positions to report.</span></div>';
      return;
    }
    el.highlights.innerHTML = ranked.slice(0, 3).map(({ a, v }) => {
      const high = v >= 50;
      const pole = high ? a.high : a.low;
      return `
        <div class="hl" style="--c:${a.color};--k:${a.ink}">
          <div class="shape shape-${a.shape}" aria-hidden="true"></div>
          <span class="label">${a.name}</span>
          <b class="num">${Math.round(high ? v : 100 - v)}%</b>
          <strong>${pole.label}</strong>
        </div>`;
    }).join('');
  }

  /** Every ideology in order of closeness, tucked inside a fold out. */
  function renderFullRanking() {
    el.rankSummary.textContent = `See all ${state.matches.length} ranked`;
    el.rankAll.innerHTML = state.matches.map((m, i) => `
      <li>
        <span class="rk num">${i + 1}</span>
        <span class="sym">${SYMBOLS.svg(m.ideology)}</span>
        <span class="nm">${m.ideology.name}<small>${m.ideology.family}</small></span>
        <span class="pc num">${fmt(m.compatibility)}%</span>
      </li>`).join('');
  }

  /* ------------------------------- compare -------------------------------- */

  /** How alike two people are, on the same scale as the ideology match score. */
  function similarity(a, b) {
    const d = Math.sqrt(AXIS_KEYS.reduce((s, k) => s + Math.pow(a[k] - b[k], 2), 0));
    return Math.max(0, 100 - d / (2 * Math.sqrt(AXIS_KEYS.length / 6)));
  }

  function compareWithLink(text) {
    let search = '';
    try { search = new URL(text.trim()).search; } catch (err) { search = text.trim().replace(/^[^?]*\?/, '?'); }
    const scores = readScoresFromUrl(search);
    if (!scores) {
      toast('That does not look like a result link');
      return;
    }
    state.friend = { scores, matches: matchIdeologies(scores) };
    renderCompare();
    renderCompasses(state.scores, state.matches[0].ideology);
    toast('Friend added to your compasses');
  }

  function renderCompare() {
    const friend = state.friend;
    if (!friend) { el.compareOut.innerHTML = ''; return; }
    const diffs = AXES.map((a) => ({ a, you: state.scores[a.key], them: friend.scores[a.key], gap: Math.abs(state.scores[a.key] - friend.scores[a.key]) }))
      .sort((p, q) => q.gap - p.gap);
    const side = (a, v) => (v >= 50 ? a.high.short : a.low.short);
    const row = (d) => `<li><b>${d.a.name}</b><span>You: ${side(d.a, d.you)} ${Math.round(Math.max(d.you, 100 - d.you))}%</span><span>Them: ${side(d.a, d.them)} ${Math.round(Math.max(d.them, 100 - d.them))}%</span></li>`;
    el.compareOut.innerHTML = `
      <div class="cmp-head">
        <span class="cmp-score num">${fmt(similarity(state.scores, friend.scores))}%</span>
        <span class="label">alike<br />Their closest match: ${friend.matches[0].ideology.name}</span>
      </div>
      <div class="cmp-cols">
        <div><div class="label">Where you clash most</div><ul>${diffs.slice(0, 3).map(row).join('')}</ul></div>
        <div><div class="label">Where you agree most</div><ul>${diffs.slice(-3).reverse().map(row).join('')}</ul></div>
      </div>`;
  }

  /* ------------------------------ portraits ------------------------------ */

  function figureSrc(ideology) {
    return FIGURE_CREDITS[ideology.id] ? `figures/${ideology.id}.jpg` : null;
  }

  /** First and last initial only, so long names never spell an unintended word. */
  function initials(name) {
    const words = name.split(/\s+/).filter((w) => /^[A-Za-zÀ-ÿ]/.test(w));
    if (!words.length) return '?';
    const first = words[0][0];
    const last = words.length > 1 ? words[words.length - 1][0] : '';
    return (first + last).toUpperCase();
  }

  function figureCreditLine(ideology) {
    const c = FIGURE_CREDITS[ideology.id];
    return c ? `Portrait: ${c.author}, ${c.license}, via Wikimedia Commons` : '';
  }

  /** The thinker behind the closest ideology: a portrait, or a name plate if there is none. */
  function renderFigure(ideology) {
    const src = figureSrc(ideology);
    const fig = ideology.figure;
    el.figure.innerHTML = `
      ${src
        ? `<img src="${src}" alt="Portrait of ${fig.name}" />`
        : `<div class="plate" aria-hidden="true">${initials(fig.name)}</div>`}
      <div class="cap">
        <div class="label">The thinker behind it</div>
        <b>${fig.name}</b>
        <span>${fig.years}</span>
      </div>`;
    el.figureCredit.textContent = figureCreditLine(ideology);
  }

  async function loadFigureCredits() {
    try {
      const res = await fetch('figures/credits.json', { cache: 'no-cache' });
      if (res.ok) FIGURE_CREDITS = await res.json();
    } catch (err) { /* no portraits available, name plates are used */ }
  }

  function loadImage(src) {
    return new Promise((resolve) => {
      if (!src) { resolve(null); return; }
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  function renderAxisBars(scores) {
    el.axisBars.innerHTML = AXES.map((a) => {
      const high = scores[a.key];
      const low = round1(100 - high);
      const lowWins = low >= high;
      return `
        <div class="axis-row">
          <div class="label">${a.name}</div>
          <div class="poles">
            <div class="pole${lowWins ? ' is-win' : ''}"><b class="num">${fmt(low)}%</b><span>${a.low.label}</span></div>
            <div class="pole${lowWins ? '' : ' is-win'}"><b class="num">${fmt(high)}%</b><span>${a.high.label}</span></div>
          </div>
          <div class="dual-bar" role="img" aria-label="${a.name}: ${fmt(low)}% ${a.low.label}, ${fmt(high)}% ${a.high.label}">
            <span data-w="${low}" style="width:50%;background:${a.color}"></span>
          </div>
        </div>`;
    }).join('');

    // Animate from the 50/50 midpoint to the real split.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.axisBars.querySelectorAll('.dual-bar > span').forEach((span) => {
        span.style.width = span.dataset.w + '%';
      });
    }));
  }

  /* ----------------------------- 2D compasses ----------------------------- */

  function renderCompasses(scores, matchIdeology) {
    el.compassGrid.innerHTML = COMPASSES.map((c) => {
      const ax = AXIS_BY_KEY[c.x];
      const ay = AXIS_BY_KEY[c.y];
      const ux = scores[c.x];
      const uy = scores[c.y];

      // Tint the quadrant the user sits in.
      const tintStyle = `${ux >= 50 ? 'right:0' : 'left:0'};${uy >= 50 ? 'top:0' : 'bottom:0'}`;

      const ghosts = IDEOLOGIES.map((ideo) => {
        const isMatch = ideo.id === matchIdeology.id;
        return `<span class="ghost${isMatch ? ' is-match' : ''}" title="${ideo.name}" style="left:${ideo.coords[c.x]}%;top:${100 - ideo.coords[c.y]}%"></span>`;
      }).join('');

      return `
        <div class="panel compass-card" style="--dot:${ax.color}">
          <h3>${c.title}</h3>
          <div class="xy num">${ax.name} ${fmt(ux)} / ${ay.name} ${fmt(uy)}</div>
          <div class="edge">&uarr; ${ay.high.short}</div>
          <div class="compass-mid">
            <div class="edge v l">${ax.low.short}</div>
            <div class="compass">
              <span class="tint" style="${tintStyle}"></span>
              ${ghosts}
              ${state.friend ? `<span class="friend-dot" title="Your friend" style="left:${state.friend.scores[c.x]}%;top:${100 - state.friend.scores[c.y]}%"></span>` : ''}
              <span class="user-dot" title="You" style="left:${ux}%;top:${100 - uy}%"></span>
            </div>
            <div class="edge v">${ax.high.short}</div>
          </div>
          <div class="edge">&darr; ${ay.low.short}</div>
          <div class="legend">
            <span><i style="width:14px;height:14px;border-radius:50%;background:${ax.color};border:3px solid #111"></i>You</span>
            ${state.friend ? '<span><i style="width:13px;height:13px;background:#F5B700;border:3px solid #111;transform:rotate(45deg)"></i>Friend</span>' : ''}
            <span><i style="width:12px;height:12px;border:3px solid #111"></i>Match</span>
            <span><i style="width:8px;height:8px;background:#111;opacity:.4"></i>Others</span>
          </div>
        </div>`;
    }).join('');
  }

  /* ------------------------------- 3D plot ------------------------------- */

  /** Controls for the 3D chart: the all axes map, or any three axes you pick. */
  function renderPlotPickers(scores) {
    const chosen = state.plotAxes || mostPolarizedAxes(scores, 3);
    const mode = `
      <label>View
        <select id="plot-mode" aria-label="3D chart view">
          <option value="map"${state.plotMode === 'map' ? ' selected' : ''}>3D map of all ${AXES.length} axes</option>
          <option value="flat"${state.plotMode === 'flat' ? ' selected' : ''}>Flat map of all ${AXES.length} axes</option>
          <option value="axes"${state.plotMode === 'axes' ? ' selected' : ''}>Pick 3 axes</option>
        </select>
      </label>`;
    const axes = state.plotMode !== 'axes' ? '' : ['X', 'Y', 'Z'].map((letter, i) => `
      <label>${letter}
        <select data-slot="${i}" aria-label="${letter} axis">
          ${AXES.map((a) => `<option value="${a.key}"${a.key === chosen[i] ? ' selected' : ''}>${a.name}</option>`).join('')}
        </select>
      </label>`).join('');
    el.plotPickers.innerHTML = mode + axes;

    el.plotPickers.querySelector('#plot-mode').addEventListener('change', (e) => {
      state.plotMode = e.target.value;
      renderPlotPickers(state.scores);
      renderPlot3D(state.scores);
    });
    el.plotPickers.querySelectorAll('select[data-slot]').forEach((sel) => {
      sel.addEventListener('change', () => {
        const next = (state.plotAxes || mostPolarizedAxes(state.scores, 3)).slice();
        const slot = Number(sel.dataset.slot);
        // Picking an axis that another slot already shows swaps the two.
        const clash = next.indexOf(sel.value);
        if (clash !== -1 && clash !== slot) next[clash] = next[slot];
        next[slot] = sel.value;
        state.plotAxes = next;
        renderPlotPickers(state.scores);
        renderPlot3D(state.scores);
      });
    });
  }

  /**
   * Download the chart library ahead of time WITHOUT running it. Running a file that
   * size freezes the page for a moment, which during the test could swallow a key press.
   * So the last few statements only warm the cache, and it runs once results are showing.
   */
  let plotlyPreloaded = false;
  function preloadPlotly() {
    if (plotlyPreloaded || window.Plotly) return;
    plotlyPreloaded = true;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = CONFIG.plotlyUrl;
    document.head.appendChild(link);
  }

  /** Fetch the chart library once, on demand. Returns the same promise to every caller. */
  let plotlyPromise = null;
  function loadPlotly() {
    if (window.Plotly) return Promise.resolve();
    if (!plotlyPromise) {
      plotlyPromise = new Promise((resolve, reject) => {
        const tag = document.createElement('script');
        tag.src = CONFIG.plotlyUrl;
        tag.async = true;
        tag.onload = resolve;
        tag.onerror = () => { plotlyPromise = null; reject(new Error('chart library failed to load')); };
        document.head.appendChild(tag);
      });
    }
    return plotlyPromise;
  }

  /* The 3D chart turns slowly until you touch it. Movement is what lets the eye read depth. */
  const spin = { on: false, timer: null, angle: 0, stopped: false };
  function stopSpin(forGood) {
    spin.on = false;
    if (forGood) spin.stopped = true;
    if (spin.timer) { clearInterval(spin.timer); spin.timer = null; }
  }
  function startSpin(eye) {
    stopSpin(false);
    if (REDUCED_MOTION || spin.stopped) return;
    const radius = Math.hypot(eye.x, eye.y);
    spin.angle = Math.atan2(eye.y, eye.x);
    spin.on = true;
    spin.timer = setInterval(() => {
      // Only turn while the chart is on screen and the page is in front.
      const box = el.plot.getBoundingClientRect();
      if (document.hidden || box.bottom < 0 || box.top > window.innerHeight || state.view !== 'results') return;
      spin.angle += 0.006; // one full turn takes about a minute
      window.Plotly.relayout(el.plot, { 'scene.camera.eye': { x: radius * Math.cos(spin.angle), y: radius * Math.sin(spin.angle), z: eye.z } });
    }, 60);
  }

  /** Says in words what each direction of the map means. Shown under the chart. */
  function renderDimensionGuide(count) {
    el.plotDims.hidden = count === 0;
    el.plotDims.innerHTML = MAP.ends.slice(0, count).map((e, i) =>
      `<li><b>${count === 2 ? (i === 0 ? 'Left to right' : 'Bottom to top') : 'Dimension ' + (i + 1)}</b><span>${e.low}</span><i aria-hidden="true">to</i><span>${e.high}</span></li>`).join('');
  }

  /** The same map with the third dimension dropped: nothing to rotate, nothing hidden behind. */
  function renderFlatMap(scores) {
    stopSpin(false);
    el.plotCaption.textContent = `All ${AXES.length} axes, flattened`;
    el.plotNote.textContent = `Every square is an ideology, colored by family. The red dot is you. This flat map keeps ${MAP.capturedFlat}% of the differences between ideologies, a little less than the 3D one, but nothing is hidden behind anything else. The lines cross at the exact centre.`;
    renderDimensionGuide(2);

    const near = state.matches.slice(0, 5).map((m) => m.ideology);
    const nearIds = new Set(near.map((i) => i.id));
    const narrow = el.plot.clientWidth < 640;
    const pts = IDEOLOGIES.map((i) => MAP.project(i.coords));
    const you = MAP.project(scores);
    const traces = [];
    Object.keys(FAMILY_COLORS).forEach((family) => {
      const members = IDEOLOGIES.map((ideo, n) => ({ ideo, p: pts[n] })).filter((m) => m.ideo.family === family);
      if (!members.length) return;
      traces.push({
        type: 'scatter', mode: 'markers', name: family,
        x: members.map((m) => m.p[0]), y: members.map((m) => m.p[1]),
        text: members.map((m) => m.ideo.name), customdata: members.map((m) => m.ideo.family),
        hovertemplate: '<b>%{text}</b><br>%{customdata}<extra></extra>',
        marker: { size: members.map((m) => (nearIds.has(m.ideo.id) ? 17 : 11)), color: FAMILY_COLORS[family], opacity: 1, symbol: 'square', line: { color: THEME.ink, width: 2 } }
      });
    });
    const named = near.slice(0, 3);
    traces.push({
      type: 'scatter', mode: 'text', hoverinfo: 'skip', showlegend: false,
      x: named.map((i) => MAP.project(i.coords)[0]), y: named.map((i) => MAP.project(i.coords)[1]),
      text: named.map((i, n) => `${n + 1}. ${i.name.replace(/\s*\(.*\)/, '')}`),
      textposition: ['top right', 'bottom left', 'top left'],
      textfont: { family: 'Archivo, Arial, sans-serif', size: 13, color: THEME.ink }
    });
    traces.push({
      type: 'scatter', mode: 'markers', name: 'You', x: [you[0]], y: [you[1]], text: ['You'], customdata: ['This is where you sit'],
      hovertemplate: '<b>%{text}</b><br>%{customdata}<extra></extra>',
      marker: { size: 24, color: THEME.red, opacity: 1, symbol: 'circle', line: { color: THEME.ink, width: 4 } }
    });
    if (state.friend) {
      const f = MAP.project(state.friend.scores);
      traces.push({
        type: 'scatter', mode: 'markers', name: 'Friend', x: [f[0]], y: [f[1]], text: ['Your friend'], customdata: [''],
        hovertemplate: '<b>%{text}</b><extra></extra>',
        marker: { size: 18, color: '#F5B700', symbol: 'diamond', line: { color: THEME.ink, width: 3 } }
      });
    }
    const axis = (i) => ({
      title: { text: narrow ? '' : `${MAP.ends[i].low.toUpperCase()}  <  >  ${MAP.ends[i].high.toUpperCase()}`, font: { size: 11, color: THEME.ink } },
      showticklabels: false, zeroline: false, gridcolor: 'rgba(17,17,17,0.14)', linecolor: THEME.ink, linewidth: 3, mirror: true
    });
    const centreLine = { type: 'line', line: { color: 'rgba(17,17,17,0.45)', width: 2 }, layer: 'below' };
    const layout = {
      paper_bgcolor: THEME.paper2, plot_bgcolor: THEME.paper,
      font: { family: 'Archivo, Helvetica Neue, Arial, sans-serif', color: THEME.ink, size: 12 },
      margin: narrow ? { l: 12, r: 12, t: 12, b: 12 } : { l: 56, r: 24, t: 20, b: 56 },
      showlegend: !narrow,
      legend: { bgcolor: THEME.paper, bordercolor: THEME.ink, borderwidth: 3, font: { size: 11, color: THEME.ink }, itemsizing: 'constant' },
      hoverlabel: { bgcolor: THEME.ink, bordercolor: THEME.ink, font: { family: 'Archivo, Arial, sans-serif', size: 12, color: THEME.paper } },
      xaxis: axis(0), yaxis: axis(1),
      shapes: [
        { ...centreLine, xref: 'x', yref: 'paper', x0: MAP.centre[0], x1: MAP.centre[0], y0: 0, y1: 1 },
        { ...centreLine, xref: 'paper', yref: 'y', x0: 0, x1: 1, y0: MAP.centre[1], y1: MAP.centre[1] }
      ]
    };
    renderPlotKey(narrow);
    if (el.plot.dataset.kind !== 'flat') window.Plotly.purge(el.plot);
    el.plot.dataset.kind = 'flat';
    window.Plotly.react(el.plot, traces, layout, { responsive: true, displaylogo: false, displayModeBar: false });
  }

  /** Phones have no room for a key inside the chart, so it is drawn underneath instead. */
  function renderPlotKey(narrow) {
    el.plotKey.hidden = !narrow;
    if (!narrow) return;
    const used = Object.keys(FAMILY_COLORS).filter((f) => IDEOLOGIES.some((i) => i.family === f));
    el.plotKey.innerHTML = `<span><i style="background:${THEME.red};border-radius:50%"></i>You</span>` +
      used.map((f) => `<span><i style="background:${FAMILY_COLORS[f]}"></i>${f}</span>`).join('');
  }

  function renderPlot3D(scores) {
    const mapMode = state.plotMode === 'map';
    const picked = state.plotAxes || mostPolarizedAxes(scores, 3);

    el.plotCaption.textContent = mapMode
      ? `All ${AXES.length} axes in one map`
      : `Showing 3 of ${AXES.length} axes`;
    el.plotNote.textContent = mapMode
      ? `Every square is an ideology, colored by family. The red dot is you. This map squeezes all ${AXES.length} axes into 3 dimensions, keeping ${MAP.captured}% of the differences, so squares that sit close together really are close overall. The faint lines cross at the exact centre. It turns slowly so you can read the depth. Touch it to take over, then drag to spin and scroll to zoom.`
      : 'Every square is an ideology, colored by family. The red dot is you. This view shows 3 axes at a time, so two squares that look close here can be far apart on the others. The faint lines cross at 50 on each axis. Drag to spin, scroll to zoom.';

    if (typeof window.Plotly === 'undefined') {
      // The chart library is large, so it is only fetched once someone is near their results.
      el.plot.innerHTML = '<div class="plot-msg">Loading chart...</div>';
      loadPlotly().then(() => {
        if (state.view === 'results' && state.scores) {
          el.plot.innerHTML = '';
          renderPlot3D(state.scores);
        }
      }).catch(() => {
        el.plot.innerHTML = '<div class="plot-msg">The chart could not load. Check your connection and refresh.</div>';
      });
      return;
    }

    if (state.plotMode === 'flat') { renderFlatMap(scores); return; }
    renderDimensionGuide(mapMode ? 3 : 0);

    // One function turns any set of 12 scores into the 3 numbers this view plots.
    const point = mapMode ? (c) => MAP.project(c) : (c) => picked.map((k) => c[k]);
    const axisNames = mapMode ? ['Dimension 1', 'Dimension 2', 'Dimension 3'] : picked.map((k) => AXIS_BY_KEY[k].name);
    const narrow = el.plot.clientWidth < 640;

    const near = state.matches.slice(0, 5).map((m) => m.ideology);
    const nearIds = new Set(near.map((i) => i.id));
    const pAll = IDEOLOGIES.map((i) => point(i.coords));
    const [ux, uy, uz] = point(scores);
    const everything = [...pAll, [ux, uy, uz]];
    const lo = [0, 1, 2].map((d) => (mapMode ? Math.min(...everything.map((p) => p[d])) - 8 : 0));
    const hi = [0, 1, 2].map((d) => (mapMode ? Math.max(...everything.map((p) => p[d])) + 8 : 100));
    const mid = mapMode ? MAP.centre : [50, 50, 50];
    const floor = lo[2];
    const hoverTpl = mapMode
      ? '<b>%{text}</b><br>%{customdata}<extra></extra>'
      : `<b>%{text}</b><br>%{customdata}<br>${axisNames[0]}: %{x:.1f}<br>${axisNames[1]}: %{y:.1f}<br>${axisNames[2]}: %{z:.1f}<extra></extra>`;

    const traces = [];

    // Three faint lines through the middle of the space, so it is clear where the centre is.
    [0, 1, 2].forEach((d) => {
      const from = mid.slice(), to = mid.slice();
      from[d] = lo[d]; to[d] = hi[d];
      traces.push({
        type: 'scatter3d', mode: 'lines', hoverinfo: 'skip', showlegend: d === 0, name: 'Centre lines',
        legendgroup: 'centre',
        x: [from[0], to[0]], y: [from[1], to[1]], z: [from[2], to[2]],
        line: { color: 'rgba(17,17,17,0.38)', width: 3 }
      });
    });

    // One trace per family, so each family gets its own color and legend entry.
    Object.keys(FAMILY_COLORS).forEach((family) => {
      const members = IDEOLOGIES.map((ideo, n) => ({ ideo, p: pAll[n] })).filter((m) => m.ideo.family === family);
      if (!members.length) return;
      traces.push({
        type: 'scatter3d', mode: 'markers', name: family,
        x: members.map((m) => m.p[0]), y: members.map((m) => m.p[1]), z: members.map((m) => m.p[2]),
        text: members.map((m) => m.ideo.name),
        customdata: members.map((m) => m.ideo.family),
        hovertemplate: hoverTpl,
        marker: {
          // Your five closest are drawn larger with a heavy outline.
          size: members.map((m) => (nearIds.has(m.ideo.id) ? 11 : 6)),
          color: FAMILY_COLORS[family], opacity: 0.95, symbol: 'square',
          line: { color: THEME.ink, width: 1 }
        }
      });
    });

    // Name only the three closest, so the labels do not pile up.
    const named = near.slice(0, 3);
    const pNamed = named.map((i) => point(i.coords));
    traces.push({
      type: 'scatter3d', mode: 'text', hoverinfo: 'skip', showlegend: false,
      x: pNamed.map((p) => p[0]), y: pNamed.map((p) => p[1]), z: pNamed.map((p) => p[2]),
      text: named.map((i, n) => `${n + 1}. ${i.name.replace(/\s*\(.*\)/, '')}`),
      textposition: ['top right', 'bottom left', 'top left'],
      textfont: { family: 'Archivo, Arial, sans-serif', size: 12, color: THEME.ink }
    });

    traces.push(
      {
        // Drop line and floor shadow, so the height of your point is readable.
        type: 'scatter3d', mode: 'lines+markers', hoverinfo: 'skip', showlegend: false,
        x: [ux, ux], y: [uy, uy], z: [uz, floor],
        line: { color: THEME.red, width: 5 },
        marker: { size: [0, 6], color: THEME.red, opacity: 0.55, symbol: 'circle' }
      },
      {
        // Tether between you and your closest match.
        type: 'scatter3d', mode: 'lines', hoverinfo: 'skip', showlegend: false,
        x: [ux, pNamed[0][0]], y: [uy, pNamed[0][1]], z: [uz, pNamed[0][2]],
        line: { color: THEME.ink, width: 5, dash: 'dash' }
      },
      {
        type: 'scatter3d', mode: 'markers', name: 'You',
        x: [ux], y: [uy], z: [uz],
        text: ['You'], customdata: ['This is where you sit'],
        hovertemplate: hoverTpl,
        marker: { size: 15, color: THEME.red, opacity: 1, symbol: 'circle', line: { color: THEME.ink, width: 5 } }
      }
    );

    if (state.friend) {
      const [fx, fy, fz] = point(state.friend.scores);
      traces.push({
        type: 'scatter3d', mode: 'markers', name: 'Friend',
        x: [fx], y: [fy], z: [fz], text: ['Your friend'], customdata: [''], hovertemplate: hoverTpl,
        marker: { size: 10, color: '#F5B700', opacity: 1, symbol: 'diamond', line: { color: THEME.ink, width: 4 } }
      });
    }

    const axisLayout = (i) => {
      const a = mapMode ? null : AXIS_BY_KEY[picked[i]];
      const title = mapMode
        ? (narrow ? `DIMENSION ${i + 1}` : `${MAP.ends[i].low.toUpperCase()}  <  >  ${MAP.ends[i].high.toUpperCase()}`)
        : (narrow ? a.name.toUpperCase() : `${a.name.toUpperCase()} (${a.low.short} to ${a.high.short})`);
      return {
        title: { text: title, font: { size: 11, color: THEME.ink } },
        range: [lo[i], hi[i]],
        dtick: mapMode ? undefined : 25,
        showticklabels: !mapMode,
        gridcolor: 'rgba(17,17,17,0.28)',
        zerolinecolor: THEME.ink,
        linecolor: THEME.ink,
        linewidth: 3,
        showbackground: true,
        backgroundcolor: THEME.paper,
        tickfont: { size: 10, color: THEME.ink },
        showspikes: false
      };
    };

    const layout = {
      paper_bgcolor: THEME.paper2,
      plot_bgcolor: THEME.paper2,
      font: { family: 'Archivo, Helvetica Neue, Arial, sans-serif', color: THEME.ink, size: 12 },
      margin: { l: 0, r: 0, t: 0, b: 0 },
      // Phones have no room for a key inside the chart, so it is drawn underneath instead.
      showlegend: !narrow,
      legend: { x: 0.01, y: 0.99, bgcolor: THEME.paper, bordercolor: THEME.ink, borderwidth: 3, font: { size: 11, color: THEME.ink }, itemsizing: 'constant' },
      hoverlabel: { bgcolor: THEME.ink, bordercolor: THEME.ink, font: { family: 'Archivo, Arial, sans-serif', size: 12, color: THEME.paper } },
      scene: {
        xaxis: axisLayout(0),
        yaxis: axisLayout(1),
        zaxis: axisLayout(2),
        aspectmode: 'cube',
        camera: { eye: narrow ? { x: 2.25, y: 2.25, z: 1.2 } : (mapMode ? { x: 1.3, y: 1.3, z: 0.75 } : { x: 1.5, y: 1.5, z: 0.85 }), center: { x: 0, y: 0, z: -0.12 } },
        bgcolor: THEME.paper2
      }
    };

    renderPlotKey(narrow);
    if (el.plot.dataset.kind !== '3d') window.Plotly.purge(el.plot);
    el.plot.dataset.kind = '3d';
    window.Plotly.react(el.plot, traces, layout, { responsive: true, displaylogo: false, displayModeBar: false });
    startSpin(layout.scene.camera.eye);
  }

  /* ------------------------------------------------------------------ */
  /* 7. SHARE LINK                                                       */
  /* ------------------------------------------------------------------ */

  async function copyShareLink() {
    const url = window.location.href;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        legacyCopy(url);
      }
      toast('Share link copied');
    } catch (err) {
      try {
        legacyCopy(url);
        toast('Share link copied');
      } catch (err2) {
        toast('Copy failed. Select the link and copy it by hand.');
      }
    }
  }

  /** A 1080 x 1920 story image: the result card framed by a headline above and the address below. */
  async function buildStoryCard() {
    const card = await buildResultCard();
    const W = 1080, H = 1920, T = THEME;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = T.ink;
    ctx.fillRect(0, 0, W, H);

    const top = Math.round((H - card.height) / 2); // 285
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = T.paper;
    ctx.font = `900 30px ${FONT_BODY}`;
    ctx.fillText(spaced('I TOOK THE 12 AXIS POLITICS TEST'), W / 2, 112);
    ctx.fillStyle = T.red;
    ctx.font = `120px ${FONT_DISPLAY}`;
    ctx.fillText('AND I GOT', W / 2, 232);

    ctx.drawImage(card, 0, top);

    ctx.fillStyle = '#F5B700';
    ctx.font = `104px ${FONT_DISPLAY}`;
    ctx.fillText('YOUR TURN', W / 2, top + card.height + 132);
    ctx.fillStyle = T.paper;
    ctx.font = `900 34px ${FONT_BODY}`;
    ctx.fillText(CONFIG.brandUrl, W / 2, top + card.height + 196);
    return canvas;
  }

  /** Build the story image as soon as results show, so sharing needs no wait after the tap. */
  function prepareStoryFile() {
    state.storyFile = null;
    const id = state.matches[0].ideology.id;
    buildStoryCard()
      .then((canvas) => new Promise((resolve) => canvas.toBlob(resolve, 'image/png')))
      .then((blob) => {
        if (blob && state.matches.length && state.matches[0].ideology.id === id) {
          state.storyFile = new File([blob], `ethoscales-${id}-story.png`, { type: 'image/png' });
        }
      })
      .catch(() => {});
  }

  /** Phones: open the system share sheet with the story image attached. */
  async function shareResult() {
    const url = window.location.href;
    const name = state.matches[0].ideology.name;
    const text = `I got ${name} on EthosScales. Where do you stand?`;
    try {
      const file = state.storyFile;
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'EthosScales', text: text + ' ' + url });
      } else {
        await navigator.share({ title: 'EthosScales', text, url });
      }
    } catch (err) {
      if (err && err.name === 'AbortError') return; // the person closed the share sheet
      copyShareLink();
    }
  }

  function legacyCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    if (!ok) throw new Error('execCommand copy failed');
  }

  let toastTimer = null;
  function toast(message) {
    el.toast.textContent = message;
    el.toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove('is-visible'), 2200);
  }

  /* ------------------------------------------------------------------ */
  /* 8. RESULT CARD EXPORT (1080 x 1350 PNG poster)                      */
  /* ------------------------------------------------------------------ */

  const FONT_DISPLAY = 'Anton, Impact, "Arial Narrow Bold", sans-serif';
  const FONT_BODY = 'Archivo, "Helvetica Neue", Arial, sans-serif';

  async function ensureFonts() {
    if (!document.fonts || !document.fonts.load) return;
    try {
      await Promise.all([
        document.fonts.load('120px Anton'),
        document.fonts.load('900 24px Archivo'),
        document.fonts.load('700 24px Archivo')
      ]);
    } catch (err) { /* fall back to system fonts */ }
  }

  /** Pick the largest font size that lets the title fit the given box in at most three lines. */
  function fitTitle(ctx, text, maxWidth, maxHeight) {
    const words = text.split(/\s+/);
    for (let size = 150; size >= 44; size -= 4) {
      ctx.font = `${size}px ${FONT_DISPLAY}`;
      const lines = [];
      let line = '';
      for (const word of words) {
        const attempt = line ? line + ' ' + word : word;
        if (ctx.measureText(attempt).width <= maxWidth || !line) {
          line = attempt;
        } else {
          lines.push(line);
          line = word;
        }
      }
      if (line) lines.push(line);
      const widest = Math.max(...lines.map((l) => ctx.measureText(l).width));
      if (lines.length <= 3 && widest <= maxWidth && lines.length * size * 0.98 <= maxHeight) return { size, lines };
    }
    ctx.font = `44px ${FONT_DISPLAY}`;
    return { size: 44, lines: [text] };
  }

  async function buildResultCard() {
    const top = state.matches[0];
    const ideology = top.ideology;
    const [, portrait] = await Promise.all([ensureFonts(), loadImage(figureSrc(ideology))]);

    const W = CONFIG.card.width;
    const H = CONFIG.card.height;
    const PAD = 56;
    const scores = state.scores;
    const T = THEME;

    const canvas = document.createElement('canvas'); // off screen, never attached
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'alphabetic';

    /* Paper */
    ctx.fillStyle = T.paper;
    ctx.fillRect(0, 0, W, H);

    /* Red header block: brand, match name, score, and the thinker's portrait */
    const headH = 556;
    ctx.fillStyle = T.red;
    ctx.fillRect(0, 0, W, headH);
    ctx.fillStyle = T.ink;
    ctx.beginPath(); ctx.moveTo(W, headH - 190); ctx.lineTo(W, headH); ctx.lineTo(W - 190, headH); ctx.closePath(); ctx.fill();

    // The ideology's emblem, huge and faint, bleeding off the left edge of the header.
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, W, headH); ctx.clip();
    SYMBOLS.draw(ctx, ideology, -150, 90, 620, T.ink, 0.13, -10);
    ctx.restore();

    ctx.fillStyle = T.paper;
    ctx.textAlign = 'left';
    ctx.font = `56px ${FONT_DISPLAY}`;
    ctx.fillText(CONFIG.brand, PAD, 98);
    ctx.font = `900 22px ${FONT_BODY}`;
    ctx.fillText(spaced('MY CLOSEST MATCH'), PAD, 150);

    // Portrait frame on the right
    const pw = 250, ph = 312;
    const px = W - PAD - pw, py = 62;
    ctx.fillStyle = T.ink;
    ctx.fillRect(px + 12, py + 12, pw, ph);          // hard shadow
    ctx.fillRect(px - 6, py - 6, pw + 12, ph + 12);  // border
    if (portrait) {
      ctx.save();
      if ('filter' in ctx) ctx.filter = 'grayscale(1) contrast(1.15)';
      ctx.drawImage(portrait, px, py, pw, ph);
      ctx.restore();
    } else {
      ctx.fillStyle = '#F5B700';
      ctx.fillRect(px, py, pw, ph);
      ctx.fillStyle = T.ink;
      ctx.textAlign = 'center';
      ctx.font = `120px ${FONT_DISPLAY}`;
      ctx.fillText(initials(ideology.figure.name), px + pw / 2, py + ph / 2 + 44);
    }
    ctx.textAlign = 'right';
    ctx.fillStyle = T.paper;
    ctx.font = `900 16px ${FONT_BODY}`;
    ctx.fillText(spaced('THE THINKER BEHIND IT'), px + pw + 6, py + ph + 50);
    ctx.font = `900 24px ${FONT_BODY}`;
    let figName = ideology.figure.name;
    while (ctx.measureText(figName).width > 560 && figName.includes(' ')) figName = figName.split(' ').slice(1).join(' ');
    ctx.fillText(figName, px + pw + 6, py + ph + 82);

    // Match name, without any bracketed alias, to the left of the portrait
    ctx.textAlign = 'left';
    const cardName = ideology.name.replace(/\s*\(.*\)/, '').toUpperCase();
    const title = fitTitle(ctx, cardName, px - PAD - 34, 250);
    ctx.fillStyle = T.paper;
    ctx.font = `${title.size}px ${FONT_DISPLAY}`;
    let ty = 172 + title.size * 0.86;
    title.lines.forEach((line) => {
      ctx.fillText(line, PAD, ty);
      ty += title.size * 0.98;
    });

    // Score plate
    const scoreText = fmt(top.compatibility) + '%';
    ctx.font = `70px ${FONT_DISPLAY}`;
    const sw = ctx.measureText(scoreText).width;
    const sy = headH - 100;
    ctx.fillStyle = T.ink;
    ctx.fillRect(PAD, sy, sw + 40, 76);
    ctx.fillStyle = T.paper;
    ctx.fillText(scoreText, PAD + 20, sy + 63);
    ctx.font = `900 22px ${FONT_BODY}`;
    ctx.fillText(spaced('MATCH'), PAD + sw + 60, sy + 48);

    ctx.fillStyle = T.ink;
    ctx.fillRect(0, headH, W, 8);

    /* Axis bars in two columns */
    const footH = 250;
    const barsTop = headH + 30;
    const barsBottom = H - footH - 8;
    const cols = 2;
    const rows = Math.ceil(AXES.length / cols);
    const gutter = 44;
    const colW = (W - PAD * 2 - gutter * (cols - 1)) / cols;
    const rowH = (barsBottom - barsTop) / rows;
    const barH = 22;

    AXES.forEach((a, i) => {
      const col = Math.floor(i / rows);
      const x = PAD + col * (colW + gutter);
      const y = barsTop + (i % rows) * rowH;
      const high = scores[a.key];
      const low = round1(100 - high);

      ctx.font = `900 16px ${FONT_BODY}`;
      ctx.fillStyle = T.ink;
      ctx.textAlign = 'left';
      ctx.fillText(`${Math.round(low)}% ${a.low.short.toUpperCase()}`, x, y + 20);
      ctx.textAlign = 'right';
      ctx.fillText(`${a.high.short.toUpperCase()} ${Math.round(high)}%`, x + colW, y + 20);

      const by = y + 30;
      const split = (colW * low) / 100;
      ctx.fillStyle = T.ink;
      ctx.fillRect(x, by, colW, barH);
      ctx.fillStyle = a.color;
      ctx.fillRect(x + 4, by + 4, Math.max(0, split - 4), barH - 8);
    });

    /* Black footer: compass, call to action, QR */
    const fy = H - footH;
    ctx.fillStyle = T.ink;
    ctx.fillRect(0, fy, W, footH);

    const cs = 168;
    const cx = PAD;
    const cy = fy + 34;
    const xAxis = AXIS_BY_KEY[COMPASSES[0].x];
    const yAxis = AXIS_BY_KEY[COMPASSES[0].y];
    const sx = scores[xAxis.key];
    const syv = scores[yAxis.key];

    ctx.fillStyle = T.paper;
    ctx.fillRect(cx, cy, cs, cs);
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = T.red;
    ctx.fillRect(sx >= 50 ? cx + cs / 2 : cx, syv >= 50 ? cy : cy + cs / 2, cs / 2, cs / 2);
    ctx.globalAlpha = 1;
    ctx.fillStyle = T.ink;
    ctx.fillRect(cx + cs / 2 - 3, cy, 6, cs);
    ctx.fillRect(cx, cy + cs / 2 - 3, cs, 6);

    // Match marker (hollow square) and user marker (red disc)
    const mx = clamp(cx + (ideology.coords[xAxis.key] / 100) * cs, cx + 9, cx + cs - 9);
    const my = clamp(cy + (1 - ideology.coords[yAxis.key] / 100) * cs, cy + 9, cy + cs - 9);
    ctx.fillStyle = T.paper;
    ctx.fillRect(mx - 9, my - 9, 18, 18);
    ctx.lineWidth = 5; ctx.strokeStyle = T.ink;
    ctx.strokeRect(mx - 9, my - 9, 18, 18);

    const ux = clamp(cx + (sx / 100) * cs, cx + 14, cx + cs - 14);
    const uy = clamp(cy + (1 - syv / 100) * cs, cy + 14, cy + cs - 14);
    ctx.fillStyle = T.red;
    ctx.beginPath(); ctx.arc(ux, uy, 13, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = T.ink; ctx.stroke();

    const tx = cx + cs + 30;
    ctx.textAlign = 'left';
    ctx.fillStyle = T.paper;
    ctx.font = `900 16px ${FONT_BODY}`;
    ctx.fillText(spaced(`${xAxis.low.short} to ${xAxis.high.short}, left to right`.toUpperCase()), tx, cy + 16);
    ctx.fillText(spaced(`${yAxis.low.short} to ${yAxis.high.short}, bottom to top`.toUpperCase()), tx, cy + 42);
    ctx.font = `60px ${FONT_DISPLAY}`;
    ctx.fillStyle = T.red;
    ctx.fillText('WHERE DO YOU STAND?', tx, cy + 112);
    ctx.fillStyle = T.paper;
    ctx.font = `900 21px ${FONT_BODY}`;
    ctx.fillText(CONFIG.brandUrl, tx, cy + 146);
    ctx.font = `700 14px ${FONT_BODY}`;
    ctx.fillStyle = '#a69f8f';
    ctx.fillText(timestamp(), tx, cy + 170);

    /* QR code that points at the live share link */
    const qrSize = 150;
    const qx = W - PAD - qrSize;
    const qy = cy + 10;
    ctx.font = `60px ${FONT_DISPLAY}`;
    const ctaRight = tx + ctx.measureText('WHERE DO YOU STAND?').width;
    if (ctaRight < qx - 16) drawQr(ctx, window.location.href, qx, qy, qrSize);

    /* Portrait credit, required by the image licences */
    const credit = figureCreditLine(ideology);
    if (credit) {
      ctx.font = `500 12px ${FONT_BODY}`;
      ctx.fillStyle = '#8f897b';
      ctx.textAlign = 'left';
      let line = credit;
      while (ctx.measureText(line).width > W - PAD * 2 && line.length > 20) line = line.slice(0, -2);
      ctx.fillText(line === credit ? line : line + '...', PAD, H - 16);
    }

    return canvas;
  }

  /** Letter spaces a short uppercase label, since canvas has no tracking control everywhere. */
  function spaced(text) {
    return text.split('').join(' ');
  }

  /** Draws a QR code using the qrcode-generator library. Returns false if unavailable. */
  function drawQr(ctx, text, x, y, size) {
    if (typeof window.qrcode !== 'function') return false;
    try {
      const qr = window.qrcode(0, 'M');
      qr.addData(text);
      qr.make();
      const count = qr.getModuleCount();
      const quiet = 8;
      const cell = (size - quiet * 2) / count;

      ctx.fillStyle = THEME.paper;
      ctx.fillRect(x, y, size, size);
      ctx.fillStyle = THEME.ink;
      for (let r = 0; r < count; r++) {
        for (let c = 0; c < count; c++) {
          if (qr.isDark(r, c)) {
            ctx.fillRect(x + quiet + c * cell, y + quiet + r * cell, Math.ceil(cell), Math.ceil(cell));
          }
        }
      }
      return true;
    } catch (err) {
      console.warn('QR render failed:', err);
      return false;
    }
  }

  function timestamp() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getUTCFullYear()}.${p(d.getUTCMonth() + 1)}.${p(d.getUTCDate())}`;
  }

  async function downloadResultCard() {
    try {
      const canvas = await buildResultCard();
      const dataUrl = canvas.toDataURL('image/png');
      const slug = state.matches[0].ideology.id;
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `ethoscales-${slug}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast('Result card downloaded');
    } catch (err) {
      console.error(err);
      toast('Could not make the card. Try again.');
    }
  }

  /* ------------------------------------------------------------------ */
  /* 9. EVENTS + BOOT                                                    */
  /* ------------------------------------------------------------------ */

  function retake() {
    state.answers = [];
    state.scores = null;
    state.matches = [];
    state.plotAxes = null;
    state.friend = null;
    stopSpin(false);
    spin.stopped = false;
    clearProgress();
    clearUrl();
    showView('landing');
  }

  function onKeyDown(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (state.view === 'landing') {
      // Enter on a button, link or fold out should do that thing, not start the test.
      if (e.key === 'Enter' && tag !== 'BUTTON' && tag !== 'A' && tag !== 'SUMMARY') {
        e.preventDefault();
        startQuiz();
      }
      return;
    }

    if (state.view === 'quiz') {
      const i = RESPONSES.findIndex((r) => r.key === e.key);
      if (i !== -1) {
        e.preventDefault();
        const btn = el.answerList.querySelectorAll('.answer-btn')[i];
        answer(RESPONSES[i].weight, btn);
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault();
        goBack();
      }
    }
  }

  function cacheElements() {
    el.views = {
      landing: $('#view-landing'),
      quiz: $('#view-quiz'),
      results: $('#view-results')
    };
    el.progress = $('#progress-track');
    el.axisChips = $('#axis-chips');
    el.catalog = $('#catalog');
    el.catalogCount = $('#catalog-count');
    el.duration = $('#duration-estimate');
    el.counter = $('#question-counter');
    el.quizModeLabel = $('#quiz-mode-label');
    el.questionCard = $('#question-card');
    el.questionAxis = $('#question-axis');
    el.qShapes = [$('#q-shape-1'), $('#q-shape-2'), $('#q-shape-3')];
    el.questionText = $('#question-text');
    el.answerList = $('#answer-list');
    el.btnBack = $('#btn-back');
    el.resultVector = $('#result-vector');
    el.resultSource = $('#result-source');
    el.matchName = $('#match-name');
    el.matchFamily = $('#match-family');
    el.highlights = $('#highlights');
    el.matchSymbol = $('#match-symbol');
    el.matchSource = $('#match-source');
    el.figure = $('#figure');
    el.figureCredit = $('#figure-credit');
    el.plotPickers = $('#plot-pickers');
    el.plotNote = $('#plot-note');
    el.plotKey = $('#plot-key');
    el.plotDims = $('#plot-dims');
    el.rankAll = $('#rank-all');
    el.rankSummary = $('#rank-summary');
    el.compareOut = $('#compare-out');
    el.compareInput = $('#compare-input');
    el.matchScore = $('#match-score');
    el.matchDistance = $('#match-distance');
    el.matchTagline = $('#match-tagline');
    el.matchDesc = $('#match-desc');
    el.matchList = $('#match-list');
    el.matchOpposite = $('#match-opposite');
    el.axisBars = $('#axis-bars');
    el.plot = $('#plotly-3d');
    el.plotCaption = $('#plot-caption');
    el.compassGrid = $('#compass-grid');
    el.shareUrl = $('#share-url');
    el.cardPreview = $('#card-preview');
    el.toast = $('#toast');
  }

  function bindEvents() {
    document.querySelectorAll('.mode-btn').forEach((btn) => {
      btn.addEventListener('click', () => setMode(btn.dataset.mode));
    });
    $('#btn-start').addEventListener('click', startQuiz);
    $('#btn-back').addEventListener('click', goBack);
    $('#btn-quit').addEventListener('click', retake);
    $('#btn-copy').addEventListener('click', copyShareLink);
    const shareBtn = $('#btn-share');
    if (navigator.share) { shareBtn.hidden = false; shareBtn.addEventListener('click', shareResult); }
    $('#compare-form').addEventListener('submit', (e) => {
      e.preventDefault();
      compareWithLink(el.compareInput.value);
      renderPlot3D(state.scores);
    });
    $('#btn-download').addEventListener('click', downloadResultCard);
    $('#btn-retake').addEventListener('click', retake);
    $('#brand-link').addEventListener('click', (e) => { e.preventDefault(); retake(); });
    el.shareUrl.addEventListener('focus', () => el.shareUrl.select());
    document.addEventListener('keydown', onKeyDown);
    // The first touch hands control of the 3D chart to the person and stops the slow turn for good.
    ['pointerdown', 'wheel', 'touchstart'].forEach((type) => el.plot.addEventListener(type, () => stopSpin(true), { passive: true }));
    window.addEventListener('popstate', route);
    window.addEventListener('resize', () => { if (state.view === 'results') fitMatchName(); });
  }

  function boot() {
    cacheElements();
    bindEvents();
    renderLanding();
    route();
    // The portrait list loads in the background. Nothing waits on it, so a fast
    // key press can never be undone by it. Results just redraw once it arrives.
    loadFigureCredits().then(() => {
      if (state.view !== 'results' || !state.matches.length) return;
      renderFigure(state.matches[0].ideology);
      buildResultCard().then((canvas) => { el.cardPreview.src = canvas.toDataURL('image/png'); }).catch(() => {});
      if (navigator.share) prepareStoryFile();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Small debug surface so you can poke at the engine from the browser console.
  window.AxiomValues = {
    state,
    computeBounds,
    computeRawScores,
    normalizeScores,
    matchIdeologies,
    mostPolarizedAxes,
    buildStoryCard
  };
})();
