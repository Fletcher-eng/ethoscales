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
    fadeMs: 180,
    card: { width: 1080, height: 1350 }
  };

  const AXIS_KEYS = AXES.map((a) => a.key);
  const AXIS_BY_KEY = Object.fromEntries(AXES.map((a) => [a.key, a]));

  // Poster palette, shared by the 3D chart and the result card.
  const THEME = { paper: '#EEE6D3', paper2: '#F7F1E1', ink: '#111111', red: '#D42A1C' };

  // Size of the marker on each answer button: big at the strong ends, small in the middle.
  const ANSWER_MARK_SIZES = [22, 16, 10, 16, 22];

  // The three issue specific 2D compasses.
  const COMPASSES = [
    { id: 'classic', title: 'Classic compass', x: 'econ', y: 'gov' },
    { id: 'culture', title: 'Culture and tech', x: 'tech', y: 'cult' },
    { id: 'system', title: 'System and ecology', x: 'struct', y: 'eco' }
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
    el.progress.classList.toggle('is-off', name !== 'quiz');
    window.scrollTo(0, 0);
  }

  /** The axis a question moves the most. It sets that question's color and shape. */
  function leadAxis(question) {
    const [key] = Object.entries(question.effects)
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0];
    return AXIS_BY_KEY[key];
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
        <p>${a.low.short} vs ${a.high.short}</p>
      </div>`).join('');
    setMode(state.mode);
  }

  function setMode(mode) {
    state.mode = mode;
    document.querySelectorAll('.mode-btn').forEach((btn) => {
      const active = btn.dataset.mode === mode;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-checked', String(active));
    });
    el.duration.textContent = mode === 'quick' ? 'About 2 minutes' : 'About 3 minutes';
  }

  /* ------------------------------------------------------------------ */
  /* 5. QUIZ                                                             */
  /* ------------------------------------------------------------------ */

  function startQuiz() {
    state.questions = state.mode === 'quick' ? QUESTIONS.filter((q) => q.quick) : QUESTIONS.slice();
    state.answers = new Array(state.questions.length).fill(null);
    state.index = 0;
    state.busy = false;
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
    el.matchDistance.textContent = 'Distance ' + top.distance.toFixed(2);
    el.matchTagline.textContent = top.ideology.tagline;
    el.matchDesc.textContent = top.ideology.desc;

    el.matchList.innerHTML = state.matches.slice(0, 5).map((m, i) => `
      <li>
        <span class="rk">${i + 1}</span>
        <span class="nm">${m.ideology.name}</span>
        <span class="pc num">${fmt(m.compatibility)}%</span>
      </li>`).join('');

    const far = state.matches[state.matches.length - 1];
    el.matchOpposite.innerHTML = `${far.ideology.name}<small>${fmt(far.compatibility)}% match / distance ${far.distance.toFixed(2)}</small>`;
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
              <span class="user-dot" title="You" style="left:${ux}%;top:${100 - uy}%"></span>
            </div>
            <div class="edge v">${ax.high.short}</div>
          </div>
          <div class="edge">&darr; ${ay.low.short}</div>
          <div class="legend">
            <span><i style="width:14px;height:14px;border-radius:50%;background:${ax.color};border:3px solid #111"></i>You</span>
            <span><i style="width:12px;height:12px;border:3px solid #111"></i>Match</span>
            <span><i style="width:8px;height:8px;background:#111;opacity:.4"></i>Others</span>
          </div>
        </div>`;
    }).join('');
  }

  /* ------------------------------- 3D plot ------------------------------- */

  function renderPlot3D(scores) {
    const [kx, ky, kz] = mostPolarizedAxes(scores, 3);
    const names = [kx, ky, kz].map((k) => AXIS_BY_KEY[k].name);
    el.plotCaption.textContent = `Your 3 strongest axes: ${names.join(', ')}`;

    if (typeof window.Plotly === 'undefined') {
      // Plotly loads with "defer", so on a share link it may still be downloading.
      if (document.readyState !== 'complete') {
        el.plot.innerHTML = '<div class="plot-msg">Loading 3D chart...</div>';
        window.addEventListener('load', () => {
          if (state.view === 'results' && state.scores) {
            el.plot.innerHTML = '';
            renderPlot3D(state.scores);
          }
        }, { once: true });
        return;
      }
      el.plot.innerHTML = '<div class="plot-msg">The 3D chart could not load. Check your connection and refresh.</div>';
      return;
    }

    const top = state.matches[0].ideology;
    const others = IDEOLOGIES.filter((i) => i.id !== top.id);
    const hoverTpl = `<b>%{text}</b><br>${AXIS_BY_KEY[kx].name}: %{x:.1f}<br>${AXIS_BY_KEY[ky].name}: %{y:.1f}<br>${AXIS_BY_KEY[kz].name}: %{z:.1f}<extra></extra>`;

    const traces = [
      {
        type: 'scatter3d', mode: 'markers', name: 'Others',
        x: others.map((i) => i.coords[kx]),
        y: others.map((i) => i.coords[ky]),
        z: others.map((i) => i.coords[kz]),
        text: others.map((i) => i.name),
        hovertemplate: hoverTpl,
        marker: { size: 5, color: THEME.ink, opacity: 0.45, symbol: 'square', line: { width: 0 } }
      },
      {
        type: 'scatter3d', mode: 'markers', name: 'Match',
        x: [top.coords[kx]], y: [top.coords[ky]], z: [top.coords[kz]],
        text: [top.name],
        hovertemplate: hoverTpl,
        marker: { size: 8, color: THEME.paper, opacity: 1, symbol: 'square', line: { color: THEME.ink, width: 4 } }
      },
      {
        // Tether between you and your closest archetype.
        type: 'scatter3d', mode: 'lines', hoverinfo: 'skip', showlegend: false,
        x: [scores[kx], top.coords[kx]], y: [scores[ky], top.coords[ky]], z: [scores[kz], top.coords[kz]],
        line: { color: THEME.ink, width: 5, dash: 'dash' }
      },
      {
        type: 'scatter3d', mode: 'markers', name: 'You',
        x: [scores[kx]], y: [scores[ky]], z: [scores[kz]],
        text: ['You'],
        hovertemplate: hoverTpl,
        marker: { size: 12, color: THEME.red, opacity: 1, line: { color: THEME.ink, width: 4 } }
      }
    ];

    const narrow = el.plot.clientWidth < 640;
    const axisLayout = (key) => {
      const a = AXIS_BY_KEY[key];
      return {
        // Phones only have room for the axis name.
        title: { text: narrow ? a.name.toUpperCase() : `${a.name.toUpperCase()} (${a.low.short} to ${a.high.short})`, font: { size: 11, color: THEME.ink } },
        range: [0, 100],
        dtick: 25,
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
      showlegend: true,
      legend: { x: 0.01, y: 0.99, bgcolor: THEME.paper, bordercolor: THEME.ink, borderwidth: 3, font: { size: 11, color: THEME.ink } },
      hoverlabel: { bgcolor: THEME.ink, bordercolor: THEME.ink, font: { family: 'Archivo, Arial, sans-serif', size: 12, color: THEME.paper } },
      scene: {
        xaxis: axisLayout(kx),
        yaxis: axisLayout(ky),
        zaxis: axisLayout(kz),
        aspectmode: 'cube',
        camera: { eye: narrow ? { x: 2.25, y: 2.25, z: 1.2 } : { x: 1.5, y: 1.5, z: 0.85 }, center: { x: 0, y: 0, z: -0.12 } },
        bgcolor: THEME.paper2
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

  /** Pick the largest font size that lets the title fit in at most two lines. */
  function fitTitle(ctx, text, maxWidth) {
    const words = text.split(/\s+/);
    for (let size = 190; size >= 70; size -= 6) {
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
      // Keep the whole title block short enough to leave room for the bars.
      const fitsHeight = lines.length * size * 0.98 <= 300;
      if (lines.length <= 2 && widest <= maxWidth && fitsHeight) return { size, lines };
    }
    ctx.font = `70px ${FONT_DISPLAY}`;
    return { size: 70, lines: [text] };
  }

  async function buildResultCard() {
    await ensureFonts();

    const W = CONFIG.card.width;
    const H = CONFIG.card.height;
    const PAD = 60;
    const scores = state.scores;
    const top = state.matches[0];
    const T = THEME;

    const canvas = document.createElement('canvas'); // off screen, never attached
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'alphabetic';

    /* Paper */
    ctx.fillStyle = T.paper;
    ctx.fillRect(0, 0, W, H);

    /* Red header block with the match name */
    const title = fitTitle(ctx, top.ideology.name.toUpperCase(), W - PAD * 2);
    const titleTop = 196;
    const titleH = title.lines.length * title.size * 0.98;
    const headH = Math.round(titleTop + titleH + 118);

    ctx.fillStyle = T.red;
    ctx.fillRect(0, 0, W, headH);

    // Black corner wedge and a yellow disc, clipped to the header.
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, W, headH); ctx.clip();
    ctx.fillStyle = T.ink;
    ctx.beginPath(); ctx.moveTo(W, headH - 250); ctx.lineTo(W, headH); ctx.lineTo(W - 250, headH); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#F5B700';
    ctx.beginPath(); ctx.arc(W - 150, 20, 120, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 8; ctx.strokeStyle = T.ink; ctx.stroke();
    ctx.restore();

    ctx.fillStyle = T.paper;
    ctx.textAlign = 'left';
    ctx.font = `60px ${FONT_DISPLAY}`;
    ctx.fillText(CONFIG.brand, PAD, 104);
    ctx.font = `900 24px ${FONT_BODY}`;
    ctx.fillText(spaced('MY CLOSEST MATCH'), PAD, 162);

    ctx.font = `${title.size}px ${FONT_DISPLAY}`;
    let ty = titleTop + title.size * 0.86;
    title.lines.forEach((line) => {
      ctx.fillText(line, PAD, ty);
      ty += title.size * 0.98;
    });

    // Score plate
    const scoreText = fmt(top.compatibility) + '%';
    ctx.font = `76px ${FONT_DISPLAY}`;
    const sw = ctx.measureText(scoreText).width;
    const sy = headH - 104;
    ctx.fillStyle = T.ink;
    ctx.fillRect(PAD, sy, sw + 44, 82);
    ctx.fillStyle = T.paper;
    ctx.fillText(scoreText, PAD + 22, sy + 68);
    ctx.fillStyle = T.paper;
    ctx.font = `900 24px ${FONT_BODY}`;
    ctx.fillText(spaced('MATCH'), PAD + sw + 66, sy + 52);

    ctx.fillStyle = T.ink;
    ctx.fillRect(0, headH, W, 8);

    /* Six axis bars */
    const footH = 276;
    const barsTop = headH + 34;
    const barsBottom = H - footH - 14;
    const rowH = (barsBottom - barsTop) / AXES.length;
    const barW = W - PAD * 2;
    const barH = Math.max(18, Math.min(30, rowH - 46));

    AXES.forEach((a, i) => {
      const y = barsTop + i * rowH;
      const high = scores[a.key];
      const low = round1(100 - high);

      ctx.font = `900 21px ${FONT_BODY}`;
      ctx.fillStyle = T.ink;
      ctx.textAlign = 'left';
      ctx.fillText(`${fmt(low)}%  ${a.low.short.toUpperCase()}`, PAD, y + 24);
      ctx.textAlign = 'right';
      ctx.fillText(`${a.high.short.toUpperCase()}  ${fmt(high)}%`, W - PAD, y + 24);

      const by = y + 36;
      const split = (barW * low) / 100;
      ctx.fillStyle = T.ink;
      ctx.fillRect(PAD, by, barW, barH);
      ctx.fillStyle = a.color;
      ctx.fillRect(PAD + 5, by + 5, Math.max(0, split - 5), barH - 10);
      // Midpoint notch
      ctx.fillStyle = T.paper;
      ctx.fillRect(W / 2 - 2, by - 6, 4, 6);
      ctx.fillRect(W / 2 - 2, by + barH, 4, 6);
    });

    /* Black footer: compass, call to action, QR */
    const fy = H - footH;
    ctx.fillStyle = T.ink;
    ctx.fillRect(0, fy, W, footH);

    const cs = 196;
    const cx = PAD;
    const cy = fy + 40;
    const econ = AXIS_BY_KEY.econ;
    const gov = AXIS_BY_KEY.gov;

    ctx.fillStyle = T.paper;
    ctx.fillRect(cx, cy, cs, cs);
    // Tint the quadrant the user sits in.
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = T.red;
    ctx.fillRect(scores.econ >= 50 ? cx + cs / 2 : cx, scores.gov >= 50 ? cy : cy + cs / 2, cs / 2, cs / 2);
    ctx.globalAlpha = 1;
    ctx.fillStyle = T.ink;
    ctx.fillRect(cx + cs / 2 - 3, cy, 6, cs);
    ctx.fillRect(cx, cy + cs / 2 - 3, cs, 6);

    // Match marker (hollow square) and user marker (red disc)
    const mx = cx + (top.ideology.coords.econ / 100) * cs;
    const my = cy + (1 - top.ideology.coords.gov / 100) * cs;
    ctx.fillStyle = T.paper;
    ctx.fillRect(mx - 9, my - 9, 18, 18);
    ctx.lineWidth = 5; ctx.strokeStyle = T.ink;
    ctx.strokeRect(mx - 9, my - 9, 18, 18);

    const ux = clamp(cx + (scores.econ / 100) * cs, cx + 14, cx + cs - 14);
    const uy = clamp(cy + (1 - scores.gov / 100) * cs, cy + 14, cy + cs - 14);
    ctx.fillStyle = T.red;
    ctx.beginPath(); ctx.arc(ux, uy, 14, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = T.ink; ctx.stroke();

    const tx = cx + cs + 34;
    ctx.textAlign = 'left';
    ctx.fillStyle = T.paper;
    ctx.font = `900 18px ${FONT_BODY}`;
    ctx.fillText(spaced(`${econ.low.short} / ${econ.high.short}`.toUpperCase()) + '   ' + spaced('LEFT TO RIGHT'), tx, cy + 18);
    ctx.fillText(spaced(`${gov.low.short} / ${gov.high.short}`.toUpperCase()) + '   ' + spaced('BOTTOM TO TOP'), tx, cy + 46);
    ctx.font = `64px ${FONT_DISPLAY}`;
    ctx.fillStyle = T.red;
    ctx.fillText('WHERE DO YOU STAND?', tx, cy + 124);
    ctx.fillStyle = T.paper;
    ctx.font = `900 22px ${FONT_BODY}`;
    ctx.fillText(CONFIG.brandUrl, tx, cy + 162);
    ctx.font = `700 17px ${FONT_BODY}`;
    ctx.fillStyle = '#a69f8f';
    ctx.fillText(timestamp(), tx, cy + 190);

    /* QR code that points at the live share link */
    const qrSize = 150;
    const qx = W - PAD - qrSize;
    const qy = cy + 46;
    // Only draw the QR if the text column leaves room for it.
    ctx.font = `64px ${FONT_DISPLAY}`;
    const ctaRight = tx + ctx.measureText('WHERE DO YOU STAND?').width;
    if (ctaRight < qx - 20) drawQr(ctx, window.location.href, qx, qy, qrSize);

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
    el.progress = $('#progress-track');
    el.axisChips = $('#axis-chips');
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
