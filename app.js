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
    brand: 'AXIOMVALUES // ETHOSSCALES',
    brandUrl: 'axiomvalues.io',
    fadeMs: 180,
    card: { width: 1080, height: 1350 }
  };

  const AXIS_KEYS = AXES.map((a) => a.key);
  const AXIS_BY_KEY = Object.fromEntries(AXES.map((a) => [a.key, a]));

  // Accent color per response button, top (agree) to bottom (disagree).
  const RESPONSE_COLORS = ['#00E5FF', '#1DE9B6', '#A3A3A3', '#FFC400', '#FF1744'];

  // The three issue specific 2D compasses.
  const COMPASSES = [
    { id: 'classic', title: 'Classic Political Compass', x: 'econ', y: 'gov', dot: '#00E5FF' },
    { id: 'culture', title: 'Modern Culture & Tech Compass', x: 'tech', y: 'cult', dot: '#F50057' },
    { id: 'system', title: 'Systemic & Ecological Compass', x: 'struct', y: 'eco', dot: '#00C853' }
  ];

  const state = {
    view: 'landing',     // 'landing' | 'quiz' | 'results'
    mode: 'full',        // 'full' (18) | 'quick' (12)
    questions: [],       // active question bank for this run
    index: 0,            // current question index
    answers: [],         // response weight per question (null = unanswered)
    scores: null,        // { econ, gov, tech, cult, struct, eco } in 0..100
    matches: [],         // ideologies sorted by distance, ascending
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

  /** Step 3: Euclidean distance in 6D, sorted ascending. */
  function matchIdeologies(scores) {
    return IDEOLOGIES.map((ideo) => {
      const sumSq = AXIS_KEYS.reduce((acc, k) => acc + Math.pow(scores[k] - ideo.coords[k], 2), 0);
      const distance = Math.sqrt(sumSq);
      return {
        ideology: ideo,
        distance: distance,
        compatibility: Math.max(0, 100 - distance / 2)
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

  function clamp(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); }
  function round1(n) { return Math.round(n * 10) / 10; }
  function fmt(n) { return (Math.round(n * 10) / 10).toFixed(1); }

  /* ------------------------------------------------------------------ */
  /* 2. URL STATE (share links)                                          */
  /* ------------------------------------------------------------------ */

  function writeScoresToUrl(scores) {
    const params = new URLSearchParams({
      e: scores.econ,
      g: scores.gov,
      t: scores.tech,
      c: scores.cult,
      s: scores.struct,
      ec: scores.eco
    });
    try {
      window.history.pushState({}, '', '?' + params.toString());
    } catch (err) {
      // Some browsers block pushState on file:// pages. The app still works.
      console.warn('Could not update URL:', err);
    }
  }

  /** Returns a scores object if all six params are present and numeric, else null. */
  function readScoresFromUrl() {
    const params = new URLSearchParams(window.location.search);
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
    if (name === 'landing') setProgress(0);
    if (name === 'results') setProgress(100);
    window.scrollTo(0, 0);
  }

  function setProgress(pct) {
    el.progressBar.style.width = clamp(pct, 0, 100) + '%';
  }

  /** Decide what to show based on the URL. Runs on load and on back/forward. */
  function route() {
    const shared = readScoresFromUrl();
    if (shared) {
      state.scores = shared;
      state.matches = matchIdeologies(shared);
      showView('results');
      renderResults(state.answers.length ? 'COMPUTED FROM YOUR ANSWERS' : 'LOADED FROM SHARE LINK');
    } else {
      showView('landing');
    }
  }

  /* ------------------------------------------------------------------ */
  /* 4. LANDING                                                          */
  /* ------------------------------------------------------------------ */

  function renderLanding() {
    el.axisChips.innerHTML = AXES.map((a) => `
      <span class="mono inline-flex items-center gap-2 rounded-md border border-line bg-surface px-2.5 py-1.5 text-[11px] text-mute">
        <span class="h-2 w-2 rounded-full" style="background:${a.low.color};box-shadow:0 0 8px ${a.low.color}"></span>
        <span class="text-ink">${a.name.toUpperCase()}</span>
        <span class="h-2 w-2 rounded-full" style="background:${a.high.color};box-shadow:0 0 8px ${a.high.color}"></span>
      </span>`).join('');
    setMode(state.mode);
  }

  function setMode(mode) {
    state.mode = mode;
    document.querySelectorAll('.mode-btn').forEach((btn) => {
      const active = btn.dataset.mode === mode;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-checked', String(active));
    });
    el.duration.textContent = mode === 'quick' ? '~2 minutes' : '~3 minutes';
  }

  /* ------------------------------------------------------------------ */
  /* 5. QUIZ                                                             */
  /* ------------------------------------------------------------------ */

  function startQuiz() {
    state.questions = state.mode === 'quick' ? QUESTIONS.filter((q) => q.quick) : QUESTIONS.slice();
    state.answers = new Array(state.questions.length).fill(null);
    state.index = 0;
    state.busy = false;
    el.quizModeLabel.textContent = state.mode === 'quick' ? 'QUICK SNAPSHOT' : 'FULL MATRIX';
    showView('quiz');
    renderQuestion();
  }

  function renderQuestion() {
    const total = state.questions.length;
    const q = state.questions[state.index];
    const pad = (n) => String(n).padStart(2, '0');

    el.counter.textContent = `[${pad(state.index + 1)}/${pad(total)}]`;
    el.questionText.textContent = q.text;
    el.btnBack.disabled = state.index === 0;
    setProgress((state.index / total) * 100);

    const previous = state.answers[state.index];
    el.answerList.innerHTML = '';
    RESPONSES.forEach((r, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'answer-btn' + (previous === r.weight ? ' is-selected' : '');
      btn.style.setProperty('--accent', RESPONSE_COLORS[i]);
      btn.innerHTML = `
        <span class="flex items-center gap-3"><span class="dot"></span><span>${r.label}</span></span>
        <kbd>${r.key}</kbd>`;
      btn.addEventListener('click', () => answer(r.weight, btn));
      el.answerList.appendChild(btn);
    });
  }

  /** Fade the card out, run the change, fade it back in. */
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
      setProgress(100);
      setTimeout(finishQuiz, 320);
    } else {
      transitionQuestion(() => {
        state.index += 1;
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

    writeScoresToUrl(state.scores);
    showView('results');
    renderResults('COMPUTED FROM YOUR ANSWERS');
  }

  /* ------------------------------------------------------------------ */
  /* 6. RESULTS DASHBOARD                                                */
  /* ------------------------------------------------------------------ */

  function renderResults(sourceLabel) {
    const scores = state.scores;
    const top = state.matches[0];

    el.resultVector.textContent = '[' + AXIS_KEYS.map((k) => fmt(scores[k])).join(', ') + ']';
    el.resultSource.textContent = sourceLabel || '';
    el.shareUrl.value = window.location.href;

    renderMatchCard(top);
    renderAxisBars(scores);
    renderCompasses(scores, top.ideology);

    // Plotly needs a visible container with a real width, so wait a frame.
    requestAnimationFrame(() => renderPlot3D(scores));

    // The card preview draws after web fonts are ready so text measures right.
    buildResultCard().then((canvas) => {
      el.cardPreview.src = canvas.toDataURL('image/png');
    }).catch((err) => console.warn('Card preview failed:', err));
  }

  function renderMatchCard(top) {
    el.matchName.textContent = top.ideology.name;
    el.matchScore.textContent = fmt(top.compatibility) + '%';
    el.matchDistance.textContent = 'D = ' + top.distance.toFixed(2);
    el.matchTagline.textContent = top.ideology.tagline;
    el.matchDesc.textContent = top.ideology.desc;

    el.matchList.innerHTML = state.matches.slice(0, 5).map((m, i) => `
      <li class="flex items-center gap-3">
        <span class="mono w-5 text-xs text-mute">${String(i + 1).padStart(2, '0')}</span>
        <span class="flex-1 truncate text-sm ${i === 0 ? 'font-semibold text-ink' : 'text-[#D4D4D4]'}">${m.ideology.name}</span>
        <span class="hidden h-1 w-20 overflow-hidden rounded-full bg-[#1A1A1A] sm:block">
          <span class="block h-full rounded-full" style="width:${m.compatibility.toFixed(1)}%;background:${i === 0 ? '#00E5FF' : '#525252'}"></span>
        </span>
        <span class="mono w-14 text-right text-xs ${i === 0 ? 'text-neon' : 'text-mute'}">${fmt(m.compatibility)}%</span>
      </li>`).join('');

    const far = state.matches[state.matches.length - 1];
    el.matchOpposite.innerHTML = `
      <span class="text-[#D4D4D4]">${far.ideology.name}</span>
      <span class="text-mute"> / ${fmt(far.compatibility)}% / D = ${far.distance.toFixed(2)}</span>`;
  }

  function renderAxisBars(scores) {
    el.axisBars.innerHTML = AXES.map((a) => {
      const high = scores[a.key];
      const low = round1(100 - high);
      const lowWins = low >= high;
      return `
        <div>
          <div class="mono mb-2 flex items-center justify-between text-[11px] uppercase tracking-widest text-mute">
            <span>${a.name}</span>
            <span class="text-ink">${fmt(high)}</span>
          </div>
          <div class="mb-2 flex items-end justify-between gap-3">
            <div class="min-w-0">
              <div class="mono text-lg font-bold leading-none" style="color:${a.low.color};opacity:${lowWins ? 1 : 0.55}">${fmt(low)}%</div>
              <div class="mt-1 truncate text-xs ${lowWins ? 'text-ink' : 'text-mute'}">${a.low.label}</div>
            </div>
            <div class="min-w-0 text-right">
              <div class="mono text-lg font-bold leading-none" style="color:${a.high.color};opacity:${lowWins ? 0.55 : 1}">${fmt(high)}%</div>
              <div class="mt-1 truncate text-xs ${lowWins ? 'text-mute' : 'text-ink'}">${a.high.label}</div>
            </div>
          </div>
          <div class="dual-wrap">
            <div class="dual-bar" role="img" aria-label="${a.name}: ${fmt(low)}% ${a.low.label}, ${fmt(high)}% ${a.high.label}">
              <span data-w="${low}" style="width:50%;background:${a.low.color};box-shadow:0 0 12px ${a.low.color}"></span>
              <span data-w="${high}" style="width:50%;background:${a.high.color}"></span>
            </div>
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

      const ghosts = IDEOLOGIES.map((ideo) => {
        const isMatch = ideo.id === matchIdeology.id;
        return `<span class="ghost${isMatch ? ' is-match' : ''}" title="${ideo.name}" style="left:${ideo.coords[c.x]}%;top:${100 - ideo.coords[c.y]}%"></span>`;
      }).join('');

      return `
        <div class="card p-5">
          <div class="mono text-xs uppercase tracking-widest text-mute">${c.title}</div>
          <div class="mono mt-1 text-xs text-ink">x: ${fmt(ux)} <span class="text-mute">/</span> y: ${fmt(uy)}</div>

          <div class="compass-edge mt-4 text-center" style="color:${ay.high.color}">&uarr; ${ay.high.short}</div>
          <div class="mt-1 flex items-center gap-2">
            <div class="compass-edge" style="color:${ax.low.color};writing-mode:vertical-rl;transform:rotate(180deg)">${ax.low.short}</div>
            <div class="compass" style="--dot:${c.dot}">
              ${ghosts}
              <span class="user-dot" title="You" style="left:${ux}%;top:${100 - uy}%"></span>
            </div>
            <div class="compass-edge" style="color:${ax.high.color};writing-mode:vertical-rl">${ax.high.short}</div>
          </div>
          <div class="compass-edge mt-1 text-center" style="color:${ay.low.color}">&darr; ${ay.low.short}</div>

          <div class="mono mt-3 flex items-center justify-center gap-4 text-[10px] text-mute">
            <span class="inline-flex items-center gap-1.5"><span class="h-2 w-2 rounded-full" style="background:${c.dot};box-shadow:0 0 8px ${c.dot}"></span>YOU</span>
            <span class="inline-flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-ink"></span>MATCH</span>
            <span class="inline-flex items-center gap-1.5"><span class="h-1.5 w-1.5 rounded-full bg-[#6B6B6B]"></span>OTHERS</span>
          </div>
        </div>`;
    }).join('');
  }

  /* ------------------------------- 3D plot ------------------------------- */

  function renderPlot3D(scores) {
    const [kx, ky, kz] = mostPolarizedAxes(scores, 3);
    const names = [kx, ky, kz].map((k) => AXIS_BY_KEY[k].name.toUpperCase());
    el.plotCaption.textContent = `Your 3 most polarized axes: X = ${names[0]}, Y = ${names[1]}, Z = ${names[2]}`;

    if (typeof window.Plotly === 'undefined') {
      // Plotly loads with "defer", so on a share link it may still be downloading.
      if (document.readyState !== 'complete') {
        el.plot.innerHTML = '<div class="mono flex h-full items-center justify-center p-8 text-xs text-mute">Loading 3D engine...</div>';
        window.addEventListener('load', () => {
          if (state.view === 'results' && state.scores) {
            el.plot.innerHTML = '';
            renderPlot3D(state.scores);
          }
        }, { once: true });
        return;
      }
      el.plot.innerHTML = '<div class="mono flex h-full items-center justify-center p-8 text-center text-xs text-mute">3D chart library could not load. Check your connection and refresh.</div>';
      return;
    }

    const top = state.matches[0].ideology;
    const others = IDEOLOGIES.filter((i) => i.id !== top.id);
    const hover = (kxLabel, kyLabel, kzLabel) =>
      `<b>%{text}</b><br>${kxLabel}: %{x:.1f}<br>${kyLabel}: %{y:.1f}<br>${kzLabel}: %{z:.1f}<extra></extra>`;
    const hoverTpl = hover(AXIS_BY_KEY[kx].name, AXIS_BY_KEY[ky].name, AXIS_BY_KEY[kz].name);

    const traces = [
      {
        type: 'scatter3d', mode: 'markers', name: 'Archetypes',
        x: others.map((i) => i.coords[kx]),
        y: others.map((i) => i.coords[ky]),
        z: others.map((i) => i.coords[kz]),
        text: others.map((i) => i.name),
        hovertemplate: hoverTpl,
        marker: { size: 5, color: '#A3A3A3', opacity: 0.55, line: { width: 0 } }
      },
      {
        type: 'scatter3d', mode: 'markers', name: 'Match: ' + top.name,
        x: [top.coords[kx]], y: [top.coords[ky]], z: [top.coords[kz]],
        text: [top.name],
        hovertemplate: hoverTpl,
        marker: { size: 7, color: '#FAFAFA', opacity: 0.95, line: { width: 0 } }
      },
      {
        // Dashed tether between you and your closest archetype.
        type: 'scatter3d', mode: 'lines', hoverinfo: 'skip', showlegend: false,
        x: [scores[kx], top.coords[kx]], y: [scores[ky], top.coords[ky]], z: [scores[kz], top.coords[kz]],
        line: { color: 'rgba(0,229,255,0.55)', width: 3, dash: 'dash' }
      },
      {
        // Soft halo behind the user marker for the neon glow effect.
        type: 'scatter3d', mode: 'markers', hoverinfo: 'skip', showlegend: false,
        x: [scores[kx]], y: [scores[ky]], z: [scores[kz]],
        marker: { size: 26, color: '#00E5FF', opacity: 0.16, line: { width: 0 } }
      },
      {
        type: 'scatter3d', mode: 'markers', name: 'You',
        x: [scores[kx]], y: [scores[ky]], z: [scores[kz]],
        text: ['YOU'],
        hovertemplate: hoverTpl,
        marker: { size: 12, color: '#00E5FF', opacity: 1, line: { color: '#E0FCFF', width: 2 } }
      }
    ];

    const axisLayout = (key) => {
      const a = AXIS_BY_KEY[key];
      return {
        title: { text: `${a.name.toUpperCase()} (${a.low.short} to ${a.high.short})`, font: { size: 10, color: '#A3A3A3' } },
        range: [0, 100],
        dtick: 25,
        gridcolor: '#262626',
        zerolinecolor: '#262626',
        linecolor: '#262626',
        showbackground: true,
        backgroundcolor: '#0A0A0A',
        tickfont: { size: 9, color: '#737373' },
        showspikes: false
      };
    };

    const layout = {
      paper_bgcolor: '#0A0A0A',
      plot_bgcolor: '#0A0A0A',
      font: { family: 'JetBrains Mono, Fira Code, monospace', color: '#A3A3A3', size: 11 },
      margin: { l: 0, r: 0, t: 0, b: 0 },
      showlegend: true,
      legend: { x: 0.01, y: 0.99, bgcolor: 'rgba(18,18,18,0.85)', bordercolor: '#262626', borderwidth: 1, font: { size: 10, color: '#A3A3A3' } },
      hoverlabel: { bgcolor: '#121212', bordercolor: '#262626', font: { family: 'JetBrains Mono, monospace', size: 11, color: '#FAFAFA' } },
      scene: {
        xaxis: axisLayout(kx),
        yaxis: axisLayout(ky),
        zaxis: axisLayout(kz),
        aspectmode: 'cube',
        camera: { eye: { x: 1.9, y: 1.9, z: 1.05 }, center: { x: 0, y: 0, z: -0.12 } },
        bgcolor: '#0A0A0A'
      }
    };

    window.Plotly.react(el.plot, traces, layout, { responsive: true, displaylogo: false, displayModeBar: false });
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
      toast('Share link copied to clipboard');
    } catch (err) {
      try {
        legacyCopy(url);
        toast('Share link copied to clipboard');
      } catch (err2) {
        toast('Copy failed. Select the URL and copy it manually.');
      }
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
  /* 8. TRADING CARD EXPORT (1080 x 1350 PNG)                            */
  /* ------------------------------------------------------------------ */

  const FONT_SANS = 'Inter, Geist, -apple-system, "Segoe UI", sans-serif';
  const FONT_MONO = '"JetBrains Mono", "Fira Code", ui-monospace, Menlo, monospace';

  async function ensureFonts() {
    if (!document.fonts || !document.fonts.load) return;
    try {
      await Promise.all([
        document.fonts.load('800 80px Inter'),
        document.fonts.load('500 24px "JetBrains Mono"'),
        document.fonts.load('700 24px "JetBrains Mono"')
      ]);
    } catch (err) { /* fall back to system fonts */ }
  }

  function roundRectPath(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  /** Pick the largest font size that lets the title fit in at most two lines. */
  function fitTitle(ctx, text, maxWidth) {
    const words = text.split(/\s+/);
    for (let size = 96; size >= 44; size -= 4) {
      ctx.font = `800 ${size}px ${FONT_SANS}`;
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
      if (lines.length <= 2 && widest <= maxWidth) return { size, lines };
    }
    ctx.font = `800 44px ${FONT_SANS}`;
    return { size: 44, lines: [text] };
  }

  async function buildResultCard() {
    await ensureFonts();

    const W = CONFIG.card.width;
    const H = CONFIG.card.height;
    const PAD = 64;
    const scores = state.scores;
    const top = state.matches[0];

    const canvas = document.createElement('canvas'); // off screen, never attached
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    /* Background + subtle grid */
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 54) {
      ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += 54) {
      ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); ctx.stroke();
    }

    // Soft neon wash in the top corner.
    const glow = ctx.createRadialGradient(W * 0.85, 0, 0, W * 0.85, 0, 760);
    glow.addColorStop(0, 'rgba(0,229,255,0.16)');
    glow.addColorStop(0.5, 'rgba(213,0,249,0.05)');
    glow.addColorStop(1, 'rgba(10,10,10,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Frame
    ctx.strokeStyle = '#262626';
    ctx.lineWidth = 2;
    roundRectPath(ctx, 24, 24, W - 48, H - 48, 28);
    ctx.stroke();

    /* Header */
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#A3A3A3';
    ctx.font = `500 24px ${FONT_MONO}`;
    ctx.fillText(CONFIG.brand, PAD, 104);
    ctx.textAlign = 'right';
    ctx.fillText('6 AXIS MATRIX', W - PAD, 104);

    ctx.strokeStyle = '#262626';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PAD, 132); ctx.lineTo(W - PAD, 132); ctx.stroke();

    /* Primary match */
    ctx.textAlign = 'left';
    ctx.fillStyle = '#00E5FF';
    ctx.font = `500 22px ${FONT_MONO}`;
    ctx.fillText('PRIMARY MATCH', PAD, 196);

    const title = fitTitle(ctx, top.ideology.name.toUpperCase(), W - PAD * 2);
    ctx.fillStyle = '#FAFAFA';
    ctx.font = `800 ${title.size}px ${FONT_SANS}`;
    let ty = 196 + 28 + title.size * 0.86;
    title.lines.forEach((line) => {
      ctx.fillText(line, PAD, ty);
      ty += title.size * 1.04;
    });

    const metaY = Math.max(ty - title.size * 1.04 + 62, 388);
    ctx.font = `700 34px ${FONT_MONO}`;
    ctx.fillStyle = '#00E5FF';
    const compatText = fmt(top.compatibility) + '%';
    ctx.fillText(compatText, PAD, metaY);
    const compatWidth = ctx.measureText(compatText).width;
    ctx.font = `500 22px ${FONT_MONO}`;
    ctx.fillStyle = '#A3A3A3';
    ctx.fillText('COMPATIBILITY  /  D = ' + top.distance.toFixed(2), PAD + compatWidth + 20, metaY - 3);

    /* Six axis bars */
    const barsTop = Math.max(metaY + 62, 470);
    const barsBottom = 1010;
    const rowH = (barsBottom - barsTop) / AXES.length;
    const barW = W - PAD * 2;
    const barH = 16;

    AXES.forEach((a, i) => {
      const y = barsTop + i * rowH;
      const high = scores[a.key];
      const low = round1(100 - high);

      // Pole labels with their percentages on one line
      ctx.font = `700 21px ${FONT_MONO}`;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#FAFAFA';
      const lowPct = fmt(low) + '%';
      ctx.fillText(lowPct, PAD, y + 22);
      const lowPctW = ctx.measureText(lowPct).width;
      ctx.textAlign = 'right';
      const highPct = fmt(high) + '%';
      ctx.fillText(highPct, W - PAD, y + 22);
      const highPctW = ctx.measureText(highPct).width;

      ctx.font = `500 18px ${FONT_MONO}`;
      ctx.textAlign = 'left';
      ctx.fillStyle = a.low.color;
      ctx.fillText(a.low.label.toUpperCase(), PAD + lowPctW + 14, y + 21);
      ctx.textAlign = 'right';
      ctx.fillStyle = a.high.color;
      ctx.fillText(a.high.label.toUpperCase(), W - PAD - highPctW - 14, y + 21);

      // Bar
      const by = y + 36;
      const split = PAD + (barW * low) / 100;
      ctx.save();
      roundRectPath(ctx, PAD, by, barW, barH, barH / 2);
      ctx.clip();
      ctx.fillStyle = '#1A1A1A';
      ctx.fillRect(PAD, by, barW, barH);
      ctx.fillStyle = a.low.color;
      ctx.fillRect(PAD, by, split - PAD, barH);
      ctx.fillStyle = a.high.color;
      ctx.fillRect(split, by, PAD + barW - split, barH);
      ctx.restore();

      // Midpoint tick
      ctx.fillStyle = 'rgba(250,250,250,0.7)';
      ctx.fillRect(W / 2 - 1, by - 4, 2, barH + 8);
    });

    /* Footer divider */
    ctx.strokeStyle = '#262626';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PAD, 1040); ctx.lineTo(W - PAD, 1040); ctx.stroke();

    /* Compact Econ vs Gov compass */
    const cs = 216;
    const cx = PAD;
    const cy = 1072;
    const econ = AXIS_BY_KEY.econ;
    const gov = AXIS_BY_KEY.gov;

    ctx.fillStyle = '#0E0E0E';
    ctx.fillRect(cx, cy, cs, cs);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    for (let i = 1; i < 10; i++) {
      const o = (cs / 10) * i;
      ctx.beginPath(); ctx.moveTo(cx + o, cy); ctx.lineTo(cx + o, cy + cs); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy + o); ctx.lineTo(cx + cs, cy + o); ctx.stroke();
    }
    ctx.strokeStyle = '#4A4A4A';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx + cs / 2, cy); ctx.lineTo(cx + cs / 2, cy + cs); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy + cs / 2); ctx.lineTo(cx + cs, cy + cs / 2); ctx.stroke();
    ctx.strokeStyle = '#333333';
    ctx.strokeRect(cx, cy, cs, cs);

    // Match marker (white) and user marker (neon)
    const mx = cx + (top.ideology.coords.econ / 100) * cs;
    const my = cy + (1 - top.ideology.coords.gov / 100) * cs;
    ctx.fillStyle = 'rgba(250,250,250,0.85)';
    ctx.beginPath(); ctx.arc(mx, my, 6, 0, Math.PI * 2); ctx.fill();

    const ux = cx + (scores.econ / 100) * cs;
    const uy = cy + (1 - scores.gov / 100) * cs;
    ctx.save();
    ctx.shadowColor = '#00E5FF';
    ctx.shadowBlur = 28;
    ctx.fillStyle = '#00E5FF';
    ctx.beginPath(); ctx.arc(ux, uy, 11, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = '#0A0A0A';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(ux, uy, 11, 0, Math.PI * 2); ctx.stroke();

    /* Compass legend + footer text */
    const tx = cx + cs + 36;
    ctx.textAlign = 'left';
    ctx.font = `500 20px ${FONT_MONO}`;
    ctx.fillStyle = '#A3A3A3';
    ctx.fillText('ECON x GOV COMPASS', tx, cy + 22);

    ctx.font = `500 19px ${FONT_MONO}`;
    ctx.fillStyle = gov.high.color;
    ctx.fillText('UP    ' + gov.high.short.toUpperCase(), tx, cy + 60);
    ctx.fillStyle = gov.low.color;
    ctx.fillText('DOWN  ' + gov.low.short.toUpperCase(), tx, cy + 88);
    ctx.fillStyle = econ.low.color;
    ctx.fillText('LEFT  ' + econ.low.short.toUpperCase(), tx, cy + 116);
    ctx.fillStyle = econ.high.color;
    ctx.fillText('RIGHT ' + econ.high.short.toUpperCase(), tx, cy + 144);

    ctx.font = `700 26px ${FONT_MONO}`;
    ctx.fillStyle = '#FAFAFA';
    ctx.fillText(CONFIG.brandUrl, tx, cy + 190);
    ctx.font = `500 17px ${FONT_MONO}`;
    ctx.fillStyle = '#737373';
    ctx.fillText(timestamp(), tx, cy + 216);

    /* QR code that points at the live share link */
    const qrSize = 190;
    const qx = W - PAD - qrSize;
    const qy = cy + 13;
    const drewQr = drawQr(ctx, window.location.href, qx, qy, qrSize);
    if (!drewQr) {
      // Fallback if the QR library is unavailable: a framed URL badge.
      ctx.strokeStyle = '#262626';
      ctx.lineWidth = 2;
      roundRectPath(ctx, qx, qy, qrSize, qrSize, 12);
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.font = `700 20px ${FONT_MONO}`;
      ctx.fillStyle = '#00E5FF';
      ctx.fillText('TAKE THE', qx + qrSize / 2, qy + 80);
      ctx.fillText('TEST AT', qx + qrSize / 2, qy + 108);
      ctx.font = `500 16px ${FONT_MONO}`;
      ctx.fillStyle = '#A3A3A3';
      ctx.fillText(CONFIG.brandUrl, qx + qrSize / 2, qy + 140);
    }

    return canvas;
  }

  /** Draws a QR code using the qrcode-generator library. Returns false if unavailable. */
  function drawQr(ctx, text, x, y, size) {
    if (typeof window.qrcode !== 'function') return false;
    try {
      const qr = window.qrcode(0, 'M');
      qr.addData(text);
      qr.make();
      const count = qr.getModuleCount();
      const quiet = 10;
      const cell = (size - quiet * 2) / count;

      ctx.fillStyle = '#FAFAFA';
      roundRectPath(ctx, x, y, size, size, 10);
      ctx.fill();
      ctx.fillStyle = '#0A0A0A';
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
    return `${d.getUTCFullYear()}.${p(d.getUTCMonth() + 1)}.${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())} UTC`;
  }

  async function downloadResultCard() {
    try {
      const canvas = await buildResultCard();
      const dataUrl = canvas.toDataURL('image/png');
      const slug = state.matches[0].ideology.id;
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `axiomvalues-${slug}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast('Result card downloaded');
    } catch (err) {
      console.error(err);
      toast('Could not generate the card. Try again.');
    }
  }

  /* ------------------------------------------------------------------ */
  /* 9. EVENTS + BOOT                                                    */
  /* ------------------------------------------------------------------ */

  function retake() {
    state.answers = [];
    state.scores = null;
    state.matches = [];
    clearUrl();
    showView('landing');
  }

  function onKeyDown(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (state.view === 'landing') {
      if (e.key === 'Enter' && tag !== 'BUTTON' && tag !== 'A') {
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
    el.progressBar = $('#progress-bar');
    el.axisChips = $('#axis-chips');
    el.duration = $('#duration-estimate');
    el.counter = $('#question-counter');
    el.quizModeLabel = $('#quiz-mode-label');
    el.questionCard = $('#question-card');
    el.questionText = $('#question-text');
    el.answerList = $('#answer-list');
    el.btnBack = $('#btn-back');
    el.resultVector = $('#result-vector');
    el.resultSource = $('#result-source');
    el.matchName = $('#match-name');
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
    $('#btn-download').addEventListener('click', downloadResultCard);
    $('#btn-retake').addEventListener('click', retake);
    $('#brand-link').addEventListener('click', (e) => { e.preventDefault(); retake(); });
    el.shareUrl.addEventListener('focus', () => el.shareUrl.select());
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('popstate', route);
  }

  function boot() {
    cacheElements();
    bindEvents();
    renderLanding();
    route();
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
    mostPolarizedAxes
  };
})();
