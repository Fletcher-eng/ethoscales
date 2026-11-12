/* ==========================================================================
   ETHOSSCALES
   symbols.js : one emblem per ideology, drawn as flat poster cut outs
   --------------------------------------------------------------------------
   Each emblem is built from simple shapes in a 100 x 100 box and stored as a
   list of SVG path strings. The same strings are used for inline SVG on the
   page and for Path2D on the result card canvas.

   These are simplified redrawings in the site's own style, not copies of any
   official artwork. An ideology mapped to null gets no emblem.
   ========================================================================== */

const SYMBOLS = (function () {
  const f = (n) => Math.round(n * 10) / 10;
  const rad = (deg) => (deg * Math.PI) / 180;
  const at = (cx, cy, r, deg) => [cx + r * Math.cos(rad(deg)), cy + r * Math.sin(rad(deg))];

  /* ---- shape builders, each returns an SVG path string ----
     Every solid piece is wound clockwise and every hole counter clockwise.
     That lets all the pieces of an emblem be joined into ONE path and filled
     with the nonzero rule, so overlapping pieces fuse into a single outline
     with no seams, while holes stay open. */
  const poly = (pts) => {
    let area = 0;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      area += a[0] * b[1] - b[0] * a[1];
    }
    const ordered = area < 0 ? pts.slice().reverse() : pts; // positive area is clockwise on screen
    return 'M' + ordered.map((p) => f(p[0]) + ' ' + f(p[1])).join('L') + 'Z';
  };
  const circle = (cx, cy, r) => `M${f(cx - r)} ${f(cy)}a${r} ${r} 0 1 1 ${2 * r} 0a${r} ${r} 0 1 1 ${-2 * r} 0Z`;
  const hole = (cx, cy, r) => `M${f(cx - r)} ${f(cy)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
  const ring = (cx, cy, R, r) => circle(cx, cy, R) + hole(cx, cy, r);
  const rect = (x, y, w, h) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
  const bar = (x1, y1, x2, y2, t) => {
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const nx = (-(y2 - y1) / len) * (t / 2);
    const ny = ((x2 - x1) / len) * (t / 2);
    return poly([[x1 + nx, y1 + ny], [x2 + nx, y2 + ny], [x2 - nx, y2 - ny], [x1 - nx, y1 - ny]]);
  };
  const star = (cx, cy, R, r, n, rot = -90) => {
    const pts = [];
    for (let i = 0; i < n * 2; i++) pts.push(at(cx, cy, i % 2 ? r : R, rot + (i * 180) / n));
    return poly(pts);
  };
  const arrow = (x1, y1, x2, y2, t, head) => {
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const ux = (x2 - x1) / len, uy = (y2 - y1) / len;
    const bx = x2 - ux * head, by = y2 - uy * head;
    return [bar(x1, y1, bx + ux * 3, by + uy * 3, t), poly([[x2, y2], [bx - uy * head * 0.6, by + ux * head * 0.6], [bx + uy * head * 0.6, by - ux * head * 0.6]])];
  };
  // A crescent: the long way round a circle between two angles, then back along a tighter arc.
  const crescent = (cx, cy, R, a1, a2, r) => {
    const p1 = at(cx, cy, R, a1), p2 = at(cx, cy, R, a2);
    return `M${f(p1[0])} ${f(p1[1])}A${R} ${R} 0 1 1 ${f(p2[0])} ${f(p2[1])}A${r} ${r} 0 1 0 ${f(p1[0])} ${f(p1[1])}Z`;
  };
  const spokes = (cx, cy, r, n, t) => Array.from({ length: n }, (_, i) => { const p = at(cx, cy, r, (i * 360) / n); return bar(cx, cy, p[0], p[1], t); });
  // A bundle of arrows tied in the middle: shafts fan out above the tie and below it.
  const fan = (n) => {
    const out = [rect(34, 60, 32, 9)]; // the tie
    for (let i = 0; i < n; i++) {
      const spread = n === 1 ? 0 : -1 + (2 * i) / (n - 1); // -1 .. 1
      const top = [50 + spread * 38, 8 + Math.abs(spread) * 12];
      const tail = [50 - spread * 20, 96];
      out.push(...arrow(tail[0], tail[1], top[0], top[1], 5.5, 15));
    }
    return out;
  };
  const gear = () => {
    const pts = [];
    const teeth = 10;
    for (let i = 0; i < teeth; i++) {
      const a = (i * 360) / teeth;
      pts.push(at(50, 50, 36, a - 11), at(50, 50, 47, a - 7), at(50, 50, 47, a + 7), at(50, 50, 36, a + 11));
    }
    return [poly(pts) + hole(50, 50, 15)];
  };

  /* ---- the emblem library ---- */
  const G = {
    star: [star(50, 53, 48, 19, 5)],
    hammerSickle: [
      crescent(54, 50, 34, -80, 150, 31), bar(26, 66, 13, 86, 10),
      bar(84, 90, 34, 30, 8), bar(22, 40, 46, 20, 16)
    ],
    circleA: [ring(50, 52, 44, 37), bar(50, 6, 24, 92, 8), bar(50, 6, 76, 92, 8), bar(10, 60, 90, 60, 8)],
    threeArrows: [...arrow(52, 8, 14, 62, 8, 18), ...arrow(72, 20, 34, 74, 8, 18), ...arrow(92, 32, 54, 86, 8, 18)],
    torch: [
      poly([[42, 54], [58, 54], [54, 96], [46, 96]]), rect(34, 46, 32, 9),
      poly([[50, 3], [63, 22], [67, 36], [60, 46], [40, 46], [33, 36], [38, 24], [46, 20]])
    ],
    crown: [poly([[12, 78], [7, 30], [30, 54], [50, 18], [70, 54], [93, 30], [88, 78]]), rect(12, 82, 76, 11), circle(7, 26, 6), circle(50, 13, 7), circle(93, 26, 6)],
    cross: [rect(43, 5, 14, 90), rect(20, 27, 60, 14)],
    crescentStar: [crescent(44, 50, 38, 45, -45, 31), star(72, 50, 14, 5.6, 5, -90)],
    wheel: [ring(50, 50, 46, 38), circle(50, 50, 8), ...spokes(50, 50, 40, 8, 4)],
    tree: [circle(50, 36, 30), circle(28, 50, 18), circle(72, 50, 18), poly([[44, 58], [56, 58], [62, 96], [38, 96]])],
    fasces: [
      rect(28, 12, 6, 84), rect(37, 12, 6, 84), rect(46, 12, 6, 84), rect(55, 12, 6, 84),
      rect(24, 30, 42, 6), rect(24, 54, 42, 6), rect(24, 78, 42, 6),
      poly([[61, 16], [84, 6], [92, 30], [86, 50], [61, 40]])
    ],
    fiveArrows: fan(5),
    sixArrows: fan(6),
    sun: [circle(50, 50, 21), ...Array.from({ length: 12 }, (_, i) => poly([at(50, 50, 27, i * 30 - 9), at(50, 50, 48, i * 30), at(50, 50, 27, i * 30 + 9)]))],
    gear: gear(),
    theta: [ring(50, 50, 46, 35), rect(8, 45, 84, 10)],
    bolt: [poly([[58, 2], [20, 56], [45, 56], [36, 98], [80, 40], [55, 40]])],
    nodes: [circle(50, 18, 14), circle(18, 78, 14), circle(82, 78, 14), bar(50, 18, 18, 78, 6), bar(50, 18, 82, 78, 6), bar(18, 78, 82, 78, 6)],
    key: [ring(28, 50, 24, 11), bar(50, 50, 96, 50, 10), rect(72, 54, 8, 17), rect(86, 54, 8, 12)],
    hexagram: [poly([[50, 3], [91, 73], [9, 73]]), poly([[50, 97], [9, 27], [91, 27]])],
    column: [rect(18, 6, 64, 10), rect(25, 16, 50, 6), rect(30, 24, 9, 56), rect(45.5, 24, 9, 56), rect(61, 24, 9, 56), rect(25, 82, 50, 6), rect(16, 88, 68, 8)],
    chaosStar: [circle(50, 50, 8), ...Array.from({ length: 8 }, (_, i) => { const p = at(50, 50, 48, i * 45); return arrow(50, 50, p[0], p[1], 5, 14); }).flat()],
    hammerSword: [
      bar(22, 92, 78, 8, 6), bar(24, 68, 44, 82, 6),
      bar(78, 92, 30, 28, 8), bar(16, 38, 40, 14, 16)
    ],
    ufo: [poly([[3, 56], [24, 43], [76, 43], [97, 56], [76, 67], [24, 67]]), circle(50, 38, 17), bar(34, 68, 22, 96, 5), bar(50, 68, 50, 96, 5), bar(66, 68, 78, 96, 5)],
    sigma: [poly([[18, 8], [82, 8], [82, 25], [47, 25], [65, 50], [47, 75], [82, 75], [82, 92], [18, 92], [18, 80], [42, 50], [18, 20]])],
    crutchCross: [rect(44, 8, 12, 84), rect(8, 44, 84, 12), rect(30, 8, 40, 11), rect(30, 81, 40, 11), rect(8, 30, 11, 40), rect(81, 30, 11, 40)],
    splitFlag: [poly([[8, 14], [92, 14], [8, 86]]), bar(8, 14, 92, 14, 5), bar(92, 14, 92, 86, 5), bar(92, 86, 8, 86, 5), bar(8, 86, 8, 14, 5)],
    flag: [rect(8, 22, 84, 56)],
    scales: [
      rect(47, 12, 6, 74), rect(30, 86, 40, 8), bar(12, 24, 88, 24, 6),
      bar(16, 24, 5, 58, 2.5), bar(16, 24, 27, 58, 2.5), bar(84, 24, 73, 58, 2.5), bar(84, 24, 95, 58, 2.5),
      poly([[1, 58], [31, 58], [24, 70], [8, 70]]), poly([[69, 58], [99, 58], [92, 70], [76, 70]])
    ],
    dollar: { text: '$' },
    hPlus: { text: 'H+' }
  };

  /* ---- which emblem each ideology uses ---- */
  const BY_ID = {
    'italian-fascism': 'fasces', 'falangism': 'fiveArrows', 'peronism': 'sun', 'strasserism': 'hammerSword',
    'national-bolshevism': 'hammerSickle', 'eurasianism': 'chaosStar', 'baathism': 'star',
    'national-socialism': null, // no emblem drawn for this one
    'national-syndicalism': 'gear', 'brazilian-integralism': 'sigma', 'austrofascism': 'crutchCross',
    'third-international-theory': 'flag', 'nasserism': 'star', 'futurism': 'bolt',
    'radical-traditionalism': 'crown', 'archeofuturism': 'bolt',
    'marxism-leninism': 'hammerSickle', 'maoism': 'star', 'juche': 'torch', 'council-communism': 'hammerSickle',
    'trotskyism': 'hammerSickle', 'stalinism': 'hammerSickle', 'luxemburgism': 'star', 'titoism': 'star',
    'dengism': 'star', 'guevarism': 'star',
    'anarcho-communism': 'circleA', 'anarcho-syndicalism': 'circleA', 'mutualism': 'splitFlag',
    'egoist-anarchism': 'splitFlag', 'tolstoyanism': 'cross', 'social-ecology': 'theta',
    'anarcho-primitivism': 'tree', 'agorism': 'splitFlag', 'crypto-anarchism': 'key',
    'democratic-confederalism': 'sun', 'zapatismo': 'star',
    'social-democracy': 'threeArrows', 'market-socialism': 'scales', 'georgism': 'tree',
    'left-accelerationism': 'bolt', 'democratic-transhumanism': 'hPlus', 'utopian-socialism': 'sun',
    'revolutionary-syndicalism': 'gear', 'ujamaa': 'tree', 'eco-socialism': 'theta',
    'classical-liberalism': 'torch', 'social-liberalism': 'scales', 'ordoliberalism': 'column',
    'minarchism': 'torch', 'anarcho-capitalism': 'splitFlag', 'keynesian-liberalism': 'scales',
    'neoliberalism': 'torch', 'third-way': 'scales', 'objectivism': 'dollar', 'hoppeanism': 'splitFlag',
    'burkean-conservatism': 'tree', 'reactionary-monarchism': 'crown', 'christian-democracy': 'cross',
    'distributism': 'cross', 'national-conservatism': 'tree', 'neoconservatism': 'column',
    'paleoconservatism': 'tree', 'communitarianism': 'nodes',
    'neo-cameralism': 'crown', 'right-accelerationism': 'bolt', 'network-state': 'nodes',
    'deep-ecology': 'theta', 'eco-authoritarianism': 'theta',
    'technocracy': 'gear', 'effective-accelerationism': 'bolt', 'bioconservatism': 'tree',
    'kemalism': 'sixArrows', 'bonapartism': 'crown', 'zionism': 'hexagram', 'hindutva': 'sun',
    'islamism': 'crescentStar', 'khomeinism': 'crescentStar', 'gandhism': 'wheel',
    'platonism': 'column', 'confucianism': 'tree',
    'neo-libertarian-falangism': 'fiveArrows', 'monarcho-brezhnevism': 'crown', 'anarcho-monarchism': 'crown',
    'posadism': 'ufo', 'luxury-space-communism': 'star'
  };

  /* Fallback for a newer entry that names no emblem of its own. */
  const BY_FAMILY = {
    'Radical Left': 'star', 'Left': 'threeArrows', 'Liberal': 'torch', 'Libertarian': 'splitFlag',
    'Anarchist': 'circleA', 'Autonomist': 'sun', 'Conservative': 'tree', 'Nationalist': 'flag',
    'Religious': 'wheel', 'Reactionary': 'crown', 'Third Position': 'gear', 'Green': 'theta',
    'Technological': 'nodes', 'Classical': 'column'
  };

  function glyphFor(ideology) {
    // Older entries are mapped by id above. Newer entries name their emblem in a `symbol` field.
    // A restricted entry (hateful or violent extremism) never gets one.
    if (ideology.restricted) return null;
    const key = ideology.id in BY_ID ? BY_ID[ideology.id] : (ideology.symbol || BY_FAMILY[ideology.family]);
    return key && G[key] ? G[key] : null;
  }

  /** Inline SVG markup for an ideology's emblem, or an empty string if it has none. */
  function svg(ideology, className) {
    const g = glyphFor(ideology);
    if (!g) return '';
    const cls = className ? ` class="${className}"` : '';
    const body = Array.isArray(g)
      ? `<path d="${g.join('')}" fill-rule="nonzero"/>`
      : `<text x="50" y="84" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="${g.text.length > 1 ? 78 : 104}">${g.text}</text>`;
    return `<svg${cls} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" focusable="false">${body}</svg>`;
  }

  /** Draw the emblem on a canvas with its top left at (x, y), flat and at one even opacity. */
  function draw(ctx, ideology, x, y, size, color, alpha, rotateDeg) {
    const g = glyphFor(ideology);
    if (!g) return;
    // Paint on a scratch canvas first so the faded emblem can be rotated and placed as one image.
    const scratch = document.createElement('canvas');
    scratch.width = scratch.height = Math.ceil(size);
    const s = scratch.getContext('2d');
    s.fillStyle = color;
    s.scale(size / 100, size / 100);
    if (Array.isArray(g)) {
      s.fill(new Path2D(g.join('')), 'nonzero');
    } else {
      s.font = `${g.text.length > 1 ? 78 : 104}px Anton, Impact, sans-serif`;
      s.textAlign = 'center';
      s.fillText(g.text, 50, 84);
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x + size / 2, y + size / 2);
    ctx.rotate(rad(rotateDeg || 0));
    ctx.drawImage(scratch, -size / 2, -size / 2);
    ctx.restore();
  }

  return { svg, draw, has: (ideology) => Boolean(glyphFor(ideology)), names: Object.keys(G), library: G };
})();
