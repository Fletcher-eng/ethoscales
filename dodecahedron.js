/* ------------------------------------------------------------------ */
/* EthosScales: The Dodecahedron                                       */
/*                                                                     */
/* A twelve faced map. Each face is one end of an axis and every       */
/* ideology is a dot inside the shape, pulled toward the faces it      */
/* scores high on. Trade is left off: the shape has twelve faces.      */
/* ------------------------------------------------------------------ */

const DODECA = (function () {
  'use strict';

  const USED = AXES.filter((a) => a.key !== 'trade');
  const KEYS = USED.map((a) => a.key);
  const PHI = (1 + Math.sqrt(5)) / 2;
  const INK = '#111111';
  const MUTE = '#5B564C';
  const RED = '#C42318';
  const FRIEND = '#F5B700';

  const norm = (v) => { const l = Math.hypot(v[0], v[1], v[2]); return v.map((x) => x / l); };
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

  /* ---- Which axes share a line through the centre ----
     Opposite faces work as a team, so the two axes on one line should move
     together across the ideologies. Otherwise they would cancel each other
     out. This tries every way of splitting twelve axes into six pairs and
     keeps the split whose pairs are most strongly linked. */
  function correlation(a, b) {
    const xs = IDEOLOGIES.map((i) => i.coords[a]);
    const ys = IDEOLOGIES.map((i) => i.coords[b]);
    const mean = (arr) => arr.reduce((s, v) => s + v, 0) / arr.length;
    const mx = mean(xs), my = mean(ys);
    let top = 0, sx = 0, sy = 0;
    for (let i = 0; i < xs.length; i++) { top += (xs[i] - mx) * (ys[i] - my); sx += (xs[i] - mx) ** 2; sy += (ys[i] - my) ** 2; }
    return top / Math.sqrt(sx * sy);
  }
  const LINK = KEYS.map((a) => KEYS.map((b) => correlation(a, b)));
  let bestSplit = null;
  (function search(left, pairs, score) {
    if (!left.length) { if (!bestSplit || score > bestSplit.score) bestSplit = { score, pairs: pairs.slice() }; return; }
    for (let j = 1; j < left.length; j++) {
      search(left.filter((_, i) => i !== 0 && i !== j), pairs.concat([[left[0], left[j]]]), score + Math.abs(LINK[left[0]][left[j]]));
    }
  })(KEYS.map((_, i) => i), [], 0);
  // sign is +1 when the two axes rise together, so the second one shows its low end on the far face.
  const PAIRS = bestSplit.pairs.map(([a, b]) => ({ a, b, sign: LINK[a][b] >= 0 ? 1 : -1 }));

  /* ---- The shape ---- */
  const LINES = [[0, PHI, 1], [0, PHI, -1], [1, 0, PHI], [-1, 0, PHI], [PHI, 1, 0], [PHI, -1, 0]].map(norm);
  const CORNERS = [];
  [-1, 1].forEach((x) => [-1, 1].forEach((y) => [-1, 1].forEach((z) => CORNERS.push([x, y, z]))));
  [-1, 1].forEach((a) => [-1, 1].forEach((b) => {
    CORNERS.push([0, a / PHI, b * PHI]); CORNERS.push([a / PHI, b * PHI, 0]); CORNERS.push([a * PHI, 0, b / PHI]);
  }));
  const FACES = [];
  PAIRS.forEach((p, i) => {
    const a = USED[p.a], b = USED[p.b];
    FACES.push({ n: LINES[i], axis: a, high: true, label: a.high.label });
    FACES.push({ n: LINES[i].map((x) => -x), axis: b, high: p.sign < 0, label: p.sign > 0 ? b.low.label : b.high.label });
  });
  FACES.forEach((f) => {
    const five = CORNERS.map((v, i) => [dot(v, f.n), i]).sort((x, y) => y[0] - x[0]).slice(0, 5).map((x) => x[1]);
    f.centre = [0, 1, 2].map((k) => five.reduce((s, i) => s + CORNERS[i][k], 0) / 5);
    const u = norm(CORNERS[five[0]].map((x, k) => x - f.centre[k]));
    const w = cross(f.n, u);
    f.ring = five.map((i) => { const r = CORNERS[i].map((x, k) => x - f.centre[k]); return [Math.atan2(dot(r, w), dot(r, u)), i]; })
      .sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  });
  const INRADIUS = Math.hypot(FACES[0].centre[0], FACES[0].centre[1], FACES[0].centre[2]);

  /* ---- Where a set of scores sits ---- */
  function rawPoint(coords) {
    const p = [0, 0, 0];
    PAIRS.forEach((pair, i) => {
      const t = ((coords[KEYS[pair.a]] - 50) + pair.sign * (coords[KEYS[pair.b]] - 50)) / 100;
      for (let k = 0; k < 3; k++) p[k] += LINES[i][k] * t;
    });
    return p;
  }
  // The middle is crowded, so distance from the centre is evened out: a dot keeps its
  // direction and its rank among the ideologies, and the shape is filled more evenly.
  const RAW = IDEOLOGIES.map((i) => rawPoint(i.coords));
  const NORMS = RAW.map((p) => Math.hypot(p[0], p[1], p[2])).sort((a, b) => a - b);
  function rankOf(r) {
    let lo = 0, hi = NORMS.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (NORMS[m] < r) lo = m + 1; else hi = m; }
    const a = NORMS[Math.max(0, lo - 1)], b = NORMS[Math.min(NORMS.length - 1, lo)];
    const t = b > a ? (r - a) / (b - a) : 0;
    return Math.min(1, (Math.max(0, lo - 1) + t) / (NORMS.length - 1));
  }
  function place(coords) {
    const p = rawPoint(coords);
    const r = Math.hypot(p[0], p[1], p[2]);
    if (r < 1e-9) return [0, 0, 0];
    const k = 0.9 * INRADIUS * Math.pow(rankOf(r), 0.55) / r;
    return p.map((x) => x * k);
  }
  const POINTS = RAW.map((_, i) => place(IDEOLOGIES[i].coords));

  /* ---- State and elements ---- */
  const view = { plot: null, top: null, bottom: null, tip: null, colors: {}, you: null, friend: null, family: null, found: null, eye: null, mounted: false, active: false };
  const zoom = () => (window.innerWidth < 700 ? 1.3 : 1);

  function traces() {
    const big = window.innerWidth >= 700;
    const mx = [], my = [], mz = [], ti = [], tj = [], tk = [], fc = [];
    FACES.forEach((f) => {
      const base = mx.length;
      mx.push(f.centre[0]); my.push(f.centre[1]); mz.push(f.centre[2]);
      f.ring.forEach((i) => { mx.push(CORNERS[i][0]); my.push(CORNERS[i][1]); mz.push(CORNERS[i][2]); });
      for (let k = 0; k < 5; k++) { ti.push(base); tj.push(base + 1 + k); tk.push(base + 1 + (k + 1) % 5); fc.push(f.axis.color); }
    });
    const mesh = { type: 'mesh3d', x: mx, y: my, z: mz, i: ti, j: tj, k: tk, facecolor: fc, opacity: 0.07, hoverinfo: 'skip', flatshading: true, lighting: { ambient: 1, diffuse: 0, specular: 0 } };
    const ex = [], ey = [], ez = [];
    FACES.forEach((f) => {
      for (let k = 0; k <= 5; k++) { const v = CORNERS[f.ring[k % 5]]; ex.push(v[0]); ey.push(v[1]); ez.push(v[2]); }
      ex.push(null); ey.push(null); ez.push(null);
    });
    const edges = { type: 'scatter3d', mode: 'lines', x: ex, y: ey, z: ez, line: { color: INK, width: 3 }, opacity: 0.55, hoverinfo: 'skip' };
    const faceNames = { type: 'scatter3d', mode: 'text', hoverinfo: 'skip',
      x: FACES.map((f) => f.centre[0] * 1.13), y: FACES.map((f) => f.centre[1] * 1.13), z: FACES.map((f) => f.centre[2] * 1.13),
      text: FACES.map((f) => '<b>' + f.label.toUpperCase() + '</b>'), textfont: { family: 'Archivo, Arial, sans-serif', size: big ? 13 : 10, color: MUTE } };

    const all = IDEOLOGIES.map((_, i) => i);
    const lit = all.filter((i) => !view.family || IDEOLOGIES[i].family === view.family);
    const dim = all.filter((i) => view.family && IDEOLOGIES[i].family !== view.family);
    const dots = (ids, size, opacity) => ({ type: 'scatter3d', mode: 'markers', hoverinfo: 'skip',
      x: ids.map((i) => POINTS[i][0]), y: ids.map((i) => POINTS[i][1]), z: ids.map((i) => POINTS[i][2]),
      marker: { size, color: ids.map((i) => view.colors[IDEOLOGIES[i].family] || '#888888'), line: { color: INK, width: 1.5 }, opacity } });

    // Names are written beside the dots that matter: a pinned one, or the few nearest you.
    let named = [];
    if (!view.family && view.found === null && view.you) named = nearestTo(view.you.p, 4);
    if (view.found !== null) named.push(view.found);
    const names = { type: 'scatter3d', mode: 'text', hoverinfo: 'skip', textposition: 'top center',
      x: named.map((i) => POINTS[i][0]), y: named.map((i) => POINTS[i][1]), z: named.map((i) => POINTS[i][2]),
      text: named.map((i) => IDEOLOGIES[i].name), textfont: { family: 'Archivo, Arial, sans-serif', size: big ? 13 : 11, color: INK } };

    const out = [mesh, edges, faceNames, dots(dim, big ? 3.5 : 3, 0.18), dots(lit, view.family ? (big ? 9 : 7) : (big ? 6.5 : 5), 1), names];
    if (view.found !== null) {
      const p = POINTS[view.found];
      out.push({ type: 'scatter3d', mode: 'markers', hoverinfo: 'skip', x: [p[0]], y: [p[1]], z: [p[2]], marker: { size: 16, color: 'rgba(0,0,0,0)', symbol: 'circle-open', line: { color: RED, width: 4 } } });
    }
    const line = (a, b, color) => ({ type: 'scatter3d', mode: 'lines', hoverinfo: 'skip', x: [a[0], b[0]], y: [a[1], b[1]], z: [a[2], b[2]], line: { color, width: 6 } });
    const person = (p, color, symbol) => ({ type: 'scatter3d', mode: 'markers', hoverinfo: 'skip', x: [p[0]], y: [p[1]], z: [p[2]], marker: { size: 11, color, symbol, line: { color: INK, width: 3 } } });
    if (view.you) {
      out.push(line([0, 0, 0], view.you.p, RED));
      if (view.friend) { out.push(line(view.you.p, view.friend.p, INK)); out.push(person(view.friend.p, FRIEND, 'diamond')); }
      out.push(person(view.you.p, RED, 'circle'));
    }
    return out;
  }

  function nearestTo(p, count) {
    return IDEOLOGIES.map((_, i) => ({ i, d: Math.hypot(POINTS[i][0] - p[0], POINTS[i][1] - p[1], POINTS[i][2] - p[2]) }))
      .sort((a, b) => a.d - b.d).slice(0, count).map((x) => x.i);
  }

  function draw() {
    const hidden = { visible: false, showbackground: false, showgrid: false, zeroline: false, showticklabels: false, title: '' };
    if (!view.eye) view.eye = { x: 1.02 * zoom(), y: 1.02 * zoom(), z: 0.6 * zoom() };
    window.Plotly.react(view.plot, traces(), {
      paper_bgcolor: 'rgba(0,0,0,0)', margin: { l: 0, r: 0, t: 0, b: 0 }, showlegend: false,
      // uirevision keeps the angle the person turned it to when the dots are redrawn.
      uirevision: 'dodeca',
      scene: { xaxis: hidden, yaxis: hidden, zaxis: hidden, aspectmode: 'data', camera: { eye: view.eye }, dragmode: 'orbit', uirevision: 'dodeca' }
    }, { responsive: true, displaylogo: false, displayModeBar: false });
  }

  /* ---- Controls around the chart ---- */
  function drawControls() {
    const counts = {};
    IDEOLOGIES.forEach((i) => { counts[i.family] = (counts[i.family] || 0) + 1; });
    view.top.innerHTML =
      `<div class="dd-fams" role="group" aria-label="Show one family">
        <button type="button" data-fam="" aria-pressed="${view.family === null}">All ${IDEOLOGIES.length}</button>
        ${Object.keys(counts).map((f) => `<button type="button" data-fam="${f}" aria-pressed="${view.family === f}"><i style="background:${view.colors[f] || '#888'}"></i>${f} ${counts[f]}</button>`).join('')}
      </div>`;

    // Read from the real scores, not from where the dot landed, so the sentence is always true.
    const pulls = view.you ? FACES.map((f) => ({ f, d: f.high ? view.you.scores[f.axis.key] : 100 - view.you.scores[f.axis.key] })).sort((a, b) => b.d - a.d) : [];
    const near = view.you ? nearestTo(view.you.p, 3).map((i) => IDEOLOGIES[i].name).join(', ') : '';
    const members = view.family
      ? `<div class="dd-members">${IDEOLOGIES.map((o, i) => [o, i]).filter((x) => x[0].family === view.family)
        .sort((a, b) => a[0].name.localeCompare(b[0].name))
        .map((x) => `<button type="button" data-i="${x[1]}" aria-pressed="${view.found === x[1]}">${x[0].name}</button>`).join('')}</div>`
      : '';
    view.bottom.innerHTML =
      (pulls.length ? `<p class="dd-near">Your strongest faces are <b>${pulls[0].f.label}</b>, <b>${pulls[1].f.label}</b> and <b>${pulls[2].f.label}</b>. Nearest dots: ${near}.</p>` : '') +
      members +
      `<div class="dd-faces" role="group" aria-label="Turn a face toward you">${FACES.map((f, i) => `<button type="button" data-face="${i}" style="background:${f.axis.color};color:${f.axis.ink}">${f.label}</button>`).join('')}</div>` +
      `<div class="dd-actions">
        <button type="button" class="btn is-paper" data-act="link">Copy link to this view</button>
        <button type="button" class="btn is-paper" data-act="image">Save as image</button>
      </div>`;
  }

  /* ---- Hover: the nearest dot on screen, so the pointer only has to be close ---- */
  function mul(m, v) { return [0, 1, 2, 3].map((r) => m[r] * v[0] + m[4 + r] * v[1] + m[8 + r] * v[2] + m[12 + r] * v[3]); }
  function nearestOnScreen(cx, cy) {
    const scene = view.plot._fullLayout && view.plot._fullLayout.scene && view.plot._fullLayout.scene._scene;
    if (!scene || !scene.glplot) return null;
    const cam = scene.glplot.cameraParams, scale = scene.dataScale, box = scene.container.getBoundingClientRect();
    let best = null;
    const test = (p, id) => {
      let v = mul(cam.projection, mul(cam.view, mul(cam.model, [p[0] * scale[0], p[1] * scale[1], p[2] * scale[2], 1])));
      if (v[3] <= 0) return;
      const x = box.left + (v[0] / v[3] * 0.5 + 0.5) * box.width;
      const y = box.top + (1 - (v[1] / v[3] * 0.5 + 0.5)) * box.height;
      const d = Math.hypot(x - cx, y - cy), depth = v[2] / v[3];
      // Close calls go to whichever dot is in front.
      if (d < 28 && (!best || d < best.d - 4 || (Math.abs(d - best.d) <= 4 && depth < best.depth))) best = { id, d, x, y, depth };
    };
    IDEOLOGIES.forEach((o, i) => { if (!view.family || o.family === view.family) test(POINTS[i], i); });
    if (view.you) test(view.you.p, -1);
    if (view.friend) test(view.friend.p, -2);
    return best;
  }
  function showTip(point) {
    const hit = view.active ? nearestOnScreen(point.clientX, point.clientY) : null;
    if (!hit) { view.tip.hidden = true; return null; }
    const host = view.tip.parentNode.getBoundingClientRect();
    if (hit.id === -1) view.tip.innerHTML = '<b>You</b>';
    else if (hit.id === -2) view.tip.innerHTML = '<b>Your friend</b>';
    else view.tip.innerHTML = `<b>${IDEOLOGIES[hit.id].name}</b><i style="background:${view.colors[IDEOLOGIES[hit.id].family] || '#888'}"></i>${IDEOLOGIES[hit.id].family}`;
    view.tip.style.left = Math.min(host.width - 115, Math.max(115, hit.x - host.left)) + 'px';
    view.tip.style.top = Math.max(60, hit.y - host.top) + 'px';
    view.tip.hidden = false;
    return hit;
  }

  function mount() {
    if (view.mounted) return;
    view.mounted = true;
    let downAt = null;
    const pointOf = (e) => { const t = e.changedTouches ? e.changedTouches[0] : e; return { clientX: t.clientX, clientY: t.clientY }; };
    view.plot.addEventListener('pointermove', (e) => { if (e.buttons) view.tip.hidden = true; else showTip(e); });
    view.plot.addEventListener('pointerleave', () => { view.tip.hidden = true; });
    // A press that does not move is a tap on a dot. A press that moves is a spin and is left alone.
    const down = (e) => { if (view.active) { const q = pointOf(e); downAt = [q.clientX, q.clientY]; } };
    const up = (e) => {
      if (!downAt || !view.active) return;
      const q = pointOf(e);
      const moved = Math.hypot(q.clientX - downAt[0], q.clientY - downAt[1]);
      downAt = null;
      if (moved > 6) return;
      const hit = showTip(q);
      if (hit && hit.id >= 0) { view.found = view.found === hit.id ? null : hit.id; drawControls(); draw(); }
    };
    view.plot.addEventListener('mousedown', down, true);
    view.plot.addEventListener('touchstart', down, { capture: true, passive: true });
    window.addEventListener('mouseup', up, true);
    window.addEventListener('touchend', up, { capture: true, passive: true });

    view.top.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-fam]');
      if (!btn) return;
      view.family = btn.dataset.fam || null;
      view.found = null;
      drawControls(); draw();
    });
    view.bottom.addEventListener('click', (e) => {
      const member = e.target.closest('button[data-i]');
      const face = e.target.closest('button[data-face]');
      const act = e.target.closest('button[data-act]');
      if (member) {
        const i = Number(member.dataset.i);
        view.found = view.found === i ? null : i;
        drawControls(); draw();
      } else if (face) {
        const n = FACES[Number(face.dataset.face)].n;
        view.eye = { x: n[0] * 1.45 * zoom(), y: n[1] * 1.45 * zoom(), z: n[2] * 1.45 * zoom() };
        if (view.onTurn) view.onTurn();
        window.Plotly.relayout(view.plot, { 'scene.camera.eye': view.eye });
        view.plot.scrollIntoView({ block: 'center', behavior: 'smooth' });
      } else if (act && view.onAction) {
        view.onAction(act.dataset.act);
      }
    });
  }

  return {
    /** Draw the shape. `you` and `friend` are score objects; `friend` may be null. */
    render(options) {
      Object.assign(view, { plot: options.plot, top: options.top, bottom: options.bottom, tip: options.tip, colors: options.colors, onAction: options.onAction, onTurn: options.onTurn });
      view.you = { p: place(options.you), scores: options.you };
      view.friend = options.friend ? { p: place(options.friend) } : null;
      view.active = true;
      mount();
      drawControls();
      draw();
      return view.eye;
    },
    /** Called when another view takes over the chart. */
    leave() { view.active = false; if (view.tip) view.tip.hidden = true; },
    faces: FACES.map((f) => f.label),
    pairs: PAIRS.map((p, i) => [FACES[2 * i].label, FACES[2 * i + 1].label])
  };
})();
