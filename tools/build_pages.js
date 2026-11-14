/* ------------------------------------------------------------------ */
/* Builds the plain HTML pages that search engines and answer engines   */
/* read: one page per ideology, an index of them, a page of parties,    */
/* llms.txt and the sitemap.                                            */
/*                                                                      */
/* Run from the repo root after changing ideologies.js or extras.js:    */
/*     node tools/build_pages.js                                        */
/* ------------------------------------------------------------------ */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://ethoscales.github.io/ethoscales/';
const TODAY = new Date().toISOString().slice(0, 10);

const data = (0, eval)(
  fs.readFileSync(path.join(ROOT, 'ideologies.js'), 'utf8') +
  fs.readFileSync(path.join(ROOT, 'extras.js'), 'utf8') +
  ';({ AXES, IDEOLOGIES, PARTIES })'
);
const { AXES, IDEOLOGIES, PARTIES } = data;
const KEYS = AXES.map((a) => a.key);
let credits = {};
try { credits = JSON.parse(fs.readFileSync(path.join(ROOT, 'figures', 'credits.json'), 'utf8')); } catch (err) { /* no portraits yet */ }

// Hateful and violent extremist ideologies are described in the test itself but get no page of their own.
const hasPage = (i) => !i.restricted && i.id !== 'national-socialism';
const PAGES = IDEOLOGIES.filter(hasPage);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const distance = (a, b) => Math.sqrt(KEYS.reduce((s, k) => s + (a[k] - b[k]) ** 2, 0));
const match = (a, b) => Math.max(0, 100 - distance(a, b) / (2 * Math.sqrt(KEYS.length / 6)));
const sentence = (s) => (/[.!?]$/.test(s) ? s : s + '.');
// Many descriptions open with a bare verb ("Argues that..."). After an opening sentence that reads oddly, so give it a subject.
const VERBS = /^(Argues|Holds|Treats|Calls|Rejects|Sees|Takes|Asks|Reads|Defines|Claims|Adapts|Distinguishes|Locates|Predicts|Starts|Builds|Distrusts|Grounds|Differs|Presents|Teaches) /;
const flow = (s) => sentence(VERBS.test(s) ? 'It ' + s[0].toLowerCase() + s.slice(1) : s);

function lean(axis, score) {
  const gap = Math.abs(score - 50);
  const pole = score >= 50 ? axis.high.label : axis.low.label;
  if (gap < 8) return 'Balanced';
  if (gap < 20) return 'Leans ' + pole;
  if (gap < 35) return 'Strongly ' + pole;
  return 'Very strongly ' + pole;
}

/** The familiar four quadrant reading, worked out the same way as on the results page. */
function quadrant(c) {
  const x = 100 - (c.econ * 0.6 + c.own * 0.4);
  const y = c.rule * 0.45 + c.rights * 0.35 + c.struct * 0.2;
  const side = Math.abs(x - 50) < 8 ? 'the economic centre' : x < 50 ? 'the economic left' : 'the economic right';
  const height = Math.abs(y - 50) < 8 ? 'the middle between libertarian and authoritarian' : y < 50 ? 'the libertarian side' : 'the authoritarian side';
  const name = (y >= 50 ? 'Authoritarian ' : 'Libertarian ') + (x < 50 ? 'Left' : 'Right');
  return { name, text: `${side} and ${height}` };
}

function sourceLine(i) {
  const s = i.source;
  if (s.note) return s.note;
  return `${s.author}, ${s.work} (${s.year})`;
}

function head({ title, description, url, extra = '', depth = 0 }) {
  const up = '../'.repeat(depth);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="EthosScales" />
  <meta property="og:image" content="${SITE}og.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="theme-color" content="#C42318" />
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23C42318'/%3E%3Cpath d='M32 10v22H10z' fill='%23111'/%3E%3C/svg%3E" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@500;700;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${up}pages.css" />
${extra}</head>
<body>
  <header class="top">
    <a class="brand" href="${up}./">EthosScales</a>
    <nav aria-label="Site">
      <a href="${up}ideologies.html">Ideologies</a>
      <a href="${up}parties.html">Parties</a>
      <a class="go" href="${up}./">Take the test</a>
    </nav>
  </header>
`;
}

function foot(depth = 0) {
  const up = '../'.repeat(depth);
  return `  <footer class="bottom">
    <p><a href="${up}./">Take the test</a> <a href="${up}ideologies.html">All ideologies</a> <a href="${up}parties.html">All parties</a> <a href="${up}legal.html">Terms, privacy and cookies</a></p>
    <p>Positions are editorial estimates, not science. Describing an ideology does not endorse it.</p>
  </footer>
</body>
</html>
`;
}

const ld = (obj) => `  <script type="application/ld+json">${JSON.stringify(obj)}</script>\n`;

/* --------------------------- One page per ideology --------------------------- */

function ideologyPage(i) {
  const url = `${SITE}ideology/${i.id}.html`;
  const others = IDEOLOGIES.filter((o) => o.id !== i.id).map((o) => ({ o, m: match(i.coords, o.coords) })).sort((a, b) => b.m - a.m);
  const near = others.filter((x) => hasPage(x.o)).slice(0, 5);
  const far = others.filter((x) => hasPage(x.o)).slice(-1)[0];
  const parties = PARTIES.filter((p) => !p.restricted).map((p) => ({ p, m: match(i.coords, p.coords) })).sort((a, b) => b.m - a.m).slice(0, 4);
  const pioneer = PARTIES.find((p) => p.pioneer === i.id);
  const quad = quadrant(i.coords);
  const strongest = AXES.map((a) => ({ a, gap: Math.abs(i.coords[a.key] - 50) })).sort((x, y) => y.gap - x.gap).slice(0, 3)
    .map((x) => (i.coords[x.a.key] >= 50 ? x.a.high.label : x.a.low.label));
  const twin = near[0].o;
  const splits = AXES.map((a) => ({ a, gap: i.coords[a.key] - twin.coords[a.key] })).sort((x, y) => Math.abs(y.gap) - Math.abs(x.gap)).slice(0, 2);
  const differs = splits.map((s) => `${s.a.name}, where ${i.name} scores ${i.coords[s.a.key]} and ${twin.name} scores ${twin.coords[s.a.key]}`).join(', and ');
  const who = i.source.note
    ? `${i.name} has no single founder. ${sentence(i.source.note)}`
    : `${i.name} is defined here from ${i.source.work} (${i.source.year}) by ${i.source.author}. The thinker most tied to it is ${i.figure.name} (${i.figure.years}).`;

  const faq = [
    [`What is ${i.name}?`, `${i.name} is a political ideology in the ${i.family} family. ${flow(i.desc)}`],
    [`What does ${i.name} believe?`, `In one line: ${sentence(i.tagline)} Its strongest positions are ${strongest.join(', ')}. ${flow(i.desc)}`],
    [`Who founded ${i.name}?`, who],
    [`Is ${i.name} left wing or right wing?`, `On a classic two axis compass ${i.name} falls in the ${quad.name} quadrant, which means ${quad.text}. Left and right hide a lot, though, which is why EthosScales scores it on thirteen separate axes.`],
    [`How is ${i.name} different from ${twin.name}?`, `They are close: ${match(i.coords, twin.coords).toFixed(0)}% alike. The biggest gaps are on ${differs}. On each axis, 0 is one end and 100 is the other.`]
  ];

  const portrait = credits[i.id]
    ? `<figure class="portrait"><img src="../figures/${i.id}.jpg" alt="Portrait of ${esc(i.figure.name)}" width="220" height="275" loading="lazy" /><figcaption><b>${esc(i.figure.name)}</b>${esc(i.figure.years)}<small>Portrait: ${esc(credits[i.id].author)}, ${esc(credits[i.id].license)}, via <a href="${esc(credits[i.id].source)}" rel="noopener">Wikimedia Commons</a></small></figcaption></figure>`
    : '';

  const rows = AXES.map((a) => {
    const v = i.coords[a.key];
    return `<tr><th scope="row">${esc(a.name)}<small>${esc(a.low.label)} to ${esc(a.high.label)}</small></th><td class="bar"><span style="width:${v}%;background:${a.color}"></span></td><td class="n">${v}</td><td>${esc(lean(a, v))}</td></tr>`;
  }).join('\n          ');

  const description = `${i.name} explained in plain words: what it believes, who founded it, the text it comes from, and where it stands on 13 political axes.`;
  const extra =
    ld({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }) +
    ld({ '@context': 'https://schema.org', '@type': 'DefinedTerm', name: i.name, description: i.desc, url, inDefinedTermSet: { '@type': 'DefinedTermSet', name: 'EthosScales political ideologies', url: SITE + 'ideologies.html' } }) +
    ld({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'EthosScales', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Ideologies', item: SITE + 'ideologies.html' },
      { '@type': 'ListItem', position: 3, name: i.name, item: url }] });

  return head({ title: `What is ${i.name}? Beliefs, founder and founding text | EthosScales`, description, url, extra, depth: 1 }) + `  <main>
    <p class="crumb"><a href="../ideologies.html">Ideologies</a> / ${esc(i.family)}</p>
    <h1>What is ${esc(i.name)}?</h1>
    <div class="lead">
      <div>
        <p class="answer"><b>${esc(i.name)}</b> is a political ideology in the ${esc(i.family)} family. ${esc(flow(i.desc))}</p>
        <p class="tagline">${esc(i.tagline)}</p>
        <p class="src"><b>Defined from:</b> ${esc(sourceLine(i))}</p>
        ${i.listen ? `<p class="src"><b>Listen:</b> <a href="${esc(i.listen.url)}" rel="noopener">${esc(i.listen.title)}</a> by ${esc(i.listen.by)}. ${esc(i.listen.note)}</p>` : ''}
        <p class="cta"><a class="btn" href="../">See how close you are to ${esc(i.name)}</a> <a class="btn alt" href="../?target=${i.id}">Dare a friend to answer as one</a></p>
      </div>
      ${portrait}
    </div>

    <h2>Where ${esc(i.name)} stands on 13 axes</h2>
    <p>Each axis runs from 0 to 100. A score of 50 is the middle. On a classic compass it sits in the <b>${quad.name}</b> quadrant.</p>
    <div class="scroll">
      <table>
        <thead><tr><th scope="col">Axis</th><th scope="col">Position</th><th scope="col">Score</th><th scope="col">In words</th></tr></thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>

    <h2>Ideologies closest to ${esc(i.name)}</h2>
    <ul class="links">
      ${near.map((x) => `<li><a href="${x.o.id}.html">${esc(x.o.name)}</a><span>${x.m.toFixed(0)}% alike</span></li>`).join('\n      ')}
    </ul>
    <p>Its opposite on this map is <a href="${far.o.id}.html">${esc(far.o.name)}</a>, at ${far.m.toFixed(0)}%.</p>

    <h2>Parties near ${esc(i.name)}</h2>
    ${pioneer ? `<p><b>${esc(pioneer.name)}</b> (${esc(pioneer.where)}) was the first party or movement to carry it, placed here from ${esc(pioneer.doc)}${pioneer.year ? ` (${pioneer.year})` : ''}.</p>` : ''}
    <ul class="links">
      ${parties.map((x) => `<li><span class="t">${esc(x.p.name)}<small>${esc(x.p.where)}. ${esc(x.p.doc)}${x.p.year ? ` (${x.p.year})` : ''}</small></span><span>${x.m.toFixed(0)}% alike</span></li>`).join('\n      ')}
    </ul>
    <p><a href="../parties.html">See all ${PARTIES.length} parties</a></p>

    <h2>Common questions</h2>
    ${faq.map(([q, a]) => `<h3>${esc(q)}</h3>\n    <p>${esc(a)}</p>`).join('\n    ')}

    <p class="note">Think this is wrong? <a href="https://github.com/ethoscales/ethoscales/issues/new" rel="noopener">Suggest a correction</a>. The scores are editorial estimates.</p>
  </main>
` + foot(1);
}

/* ------------------------------- Index pages ------------------------------- */

function ideologiesIndex() {
  const url = SITE + 'ideologies.html';
  const families = [];
  PAGES.forEach((i) => { if (!families.includes(i.family)) families.push(i.family); });
  const extra = ld({ '@context': 'https://schema.org', '@type': 'DefinedTermSet', name: 'EthosScales political ideologies', url, hasDefinedTerm: PAGES.map((i) => ({ '@type': 'DefinedTerm', name: i.name, url: `${SITE}ideology/${i.id}.html` })) });
  return head({ title: `List of ${PAGES.length} political ideologies, each explained | EthosScales`, description: `A list of ${PAGES.length} political ideologies in ${families.length} families, from anarchism to monarchism. Each has a plain definition, its founder and the text it comes from.`, url, extra }) + `  <main>
    <h1>${PAGES.length} political ideologies, explained</h1>
    <p class="answer">Every ideology here is defined from its own founding text, not from how the word gets thrown around online. Pick one to see what it believes, who started it and where it stands on 13 axes. Or <a href="./">take the test</a> to find out which one you are closest to.</p>
    ${families.map((f) => `<h2 id="${f.toLowerCase().replace(/[^a-z]+/g, '-')}">${esc(f)}</h2>
    <ul class="links wide">
      ${PAGES.filter((i) => i.family === f).map((i) => `<li><span class="t"><a href="ideology/${i.id}.html">${esc(i.name)}</a><small>${esc(i.tagline)}</small></span></li>`).join('\n      ')}
    </ul>`).join('\n    ')}
  </main>
` + foot(0);
}

function partiesPage() {
  const url = SITE + 'parties.html';
  const countries = Array.from(new Set(PARTIES.map((p) => p.where))).sort((a, b) => a.localeCompare(b));
  const name = (id) => (IDEOLOGIES.find((i) => i.id === id) || {}).name;
  return head({ title: `${PARTIES.length} political parties placed on 13 axes, by country | EthosScales`, description: `${PARTIES.length} current and historical political parties from ${countries.length} countries, each placed on 13 axes from its own manifesto or programme.`, url }) + `  <main>
    <h1>${PARTIES.length} political parties, by country</h1>
    <p class="answer">Each party is placed from one named document, such as a manifesto or founding programme, and not from how it governed. <a href="./">Take the test</a> to see which ones you are closest to. The placements are editorial estimates.</p>
    ${countries.map((c) => `<h2>${esc(c)}</h2>
    <ul class="links wide">
      ${PARTIES.filter((p) => p.where === c).sort((a, b) => (a.year || 0) - (b.year || 0)).map((p) => `<li><span class="t">${esc(p.name)}<small>Placed from ${esc(p.doc)}${p.year ? ` (${p.year})` : ''}${p.pioneer && name(p.pioneer) && hasPage(IDEOLOGIES.find((i) => i.id === p.pioneer)) ? `. Pioneered <a href="ideology/${p.pioneer}.html">${esc(name(p.pioneer))}</a>` : ''}</small></span></li>`).join('\n      ')}
    </ul>`).join('\n    ')}
  </main>
` + foot(0);
}

/* ------------------------------ llms.txt, sitemap ------------------------------ */

function llmsTxt() {
  return `# EthosScales

> A free political values test. People answer up to 130 statements and are placed on 13 axes, then matched to the closest of ${IDEOLOGIES.length} ideologies and ${PARTIES.length} parties. Every ideology is defined from its own founding text. No account is needed.

## Key facts

- Address: ${SITE}
- Cost: free, with no sign up
- Lengths: Quick (26 statements), Full (65), Deep (130)
- The 13 axes: ${AXES.map((a) => `${a.name} (${a.low.label} to ${a.high.label})`).join('; ')}
- Results show the closest ideology, a classic four quadrant compass, a twelve faced 3D map called the dodecahedron, the closest parties, and reading suggestions
- People can compare results with a friend or dare a friend to answer as another ideology
- Answers are scored in the browser. Nothing is saved unless the person chooses to share it
- Positions of ideologies and parties are editorial estimates, and corrections are welcome
- Code licence: MIT

## Pages

- [Take the test](${SITE})
- [All ideologies](${SITE}ideologies.html): ${PAGES.length} pages, one per ideology, each with a definition, founder, founding text and 13 scores
- [All parties](${SITE}parties.html): ${PARTIES.length} parties by country with the document each is placed from
- [Terms, privacy and cookies](${SITE}legal.html)

## Ideologies

${PAGES.map((i) => `- [${i.name}](${SITE}ideology/${i.id}.html): ${i.tagline}`).join('\n')}
`;
}

function sitemap() {
  const urls = [
    [SITE, '1.0'], [SITE + 'ideologies.html', '0.9'], [SITE + 'parties.html', '0.8'],
    ...PAGES.map((i) => [`${SITE}ideology/${i.id}.html`, '0.7']),
    [SITE + 'legal.html', '0.2']
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, p]) => `  <url><loc>${u}</loc><lastmod>${TODAY}</lastmod><priority>${p}</priority></url>`).join('\n')}
</urlset>
`;
}

/* ---------------------------------- Write ---------------------------------- */

const dir = path.join(ROOT, 'ideology');
fs.rmSync(dir, { recursive: true, force: true });
fs.mkdirSync(dir);
PAGES.forEach((i) => fs.writeFileSync(path.join(dir, i.id + '.html'), ideologyPage(i)));
fs.writeFileSync(path.join(ROOT, 'ideologies.html'), ideologiesIndex());
fs.writeFileSync(path.join(ROOT, 'parties.html'), partiesPage());
fs.writeFileSync(path.join(ROOT, 'llms.txt'), llmsTxt());
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap());
console.log(`Built ${PAGES.length} ideology pages, ideologies.html, parties.html, llms.txt and sitemap.xml`);
