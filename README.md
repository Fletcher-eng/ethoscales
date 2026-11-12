# EthosScales

A 13 axis political values test that runs entirely in your browser. Answer up to 130 statements, get your coordinates in thirteen dimensional ideology space, and see which of 242 ideologies you sit closest to. Every ideology is defined from its own founding text, not from how the word gets used online.

No accounts and no tracking. Nothing about you is saved unless you choose to share it at the end.

**Live site:** https://ethoscales.github.io/ethoscales/

## Features

* **13 independent axes** instead of a single left/right line
* **130 statements**, ten led by each axis, where most answers move several axes at once
* **Three lengths**: Quick (26 statements, two per axis), Full (65) and Deep (130, ten per axis)
* **242 ideologies** in 15 families, each with a named source text and the thinker behind it
* **Meme ideologies too**, such as Neo Libertarian Falangism and Monarcho Brezhnevism, clearly labelled as jokes
* **Third Position split into its real movements**: Italian Fascism, Falangism, Peronism, Strasserism, National Bolshevism, Eurasianism and Ba'athism
* **An emblem for every ideology**, drawn in the site's own style and shown large and faint behind your result
* **3D chart** where you choose which three axes to view
* **Your Dodecahedron**: a twelve faced map with one end of an axis on each face and every ideology as a dot inside, pulled toward the faces it scores high on. Filter by family, tap a dot to pin its name, add a friend's dot, save it as an image, or share a link that opens straight on it by adding `#dodecahedron`
* **Seven 2D compasses** that between them show every axis
* **A classic compass** with the familiar four coloured quadrants, worked out from your scores
* **Closest parties**: 45 current and historical parties, each placed from a named manifesto or programme
* **Read and watch**: the founding text of your match, an overview, videos, and the texts of your nearest and furthest ideologies
* **A short optional survey** before the result. Five belief questions nudge your scores slightly, and the page tells you whether the label you give yourself fits how you answered
* **A catalogue of all 242 ideologies** on the start page, grouped by family, each with its definition and source
* **You vs a friend**: paste a friend's result link to see where you agree and clash
* **Challenge a friend**: send a link and they are compared with you as soon as they finish, with no pasting. Or dare them to answer as another ideology and see who lands closest
* **Share links**: your whole result lives in the URL
* **Result card**: a 1080x1350 PNG with the thinker's portrait and a QR code that opens your result
* **Keyboard controls**: `1` to `5` to answer, left arrow to go back, `Enter` to start

## The thirteen axes

Every axis is scored from 0 to 100.

| Axis | 0 means | 100 means |
| --- | --- | --- |
| Economy (`econ`) | Market | Planned |
| Ownership (`own`) | Private | Collective |
| Rights (`rights`) | Liberty | Security |
| Government (`rule`) | Democracy | Autocracy |
| Structure (`struct`) | Decentralised | Centralised |
| Nation (`nation`) | Internationalist | Nationalist |
| Immigration (`ident`) | Multiculturalist | Assimilationist |
| Values (`cult`) | Progressive | Traditional |
| Technology (`tech`) | Accelerationist | Precautionary |
| Environment (`eco`) | Industrialist | Environmentalist |
| Religion (`relig`) | Secular | Religious |
| Military (`force`) | Pacifist | Militarist |
| Trade (`trade`) | Free Trade | Protectionist |

## Where the definitions come from

Each ideology in `ideologies.js` has a `source` field naming the text it is defined from, such as *The Doctrine of Fascism* (1932) for Italian Fascism or *The Conquest of Bread* (1892) for Anarcho Communism. The description paraphrases that text and the results page shows the source, so anyone can check it.

The exceptions are the two pure meme entries, which have no founding text and say so.

The coordinates are a different matter. Placing a body of thought at a number between 0 and 100 on thirteen scales is a judgement call. They are editorial estimates, and corrections are welcome.

The Trade axis was added last. About half of the ideologies have a Trade score set by hand from what their texts say about tariffs and self sufficiency. The rest start from an estimate based on their Economy, Nation and Environment scores, and are the first place to look for corrections.

## Project structure

```
ethoscales/
├── index.html        Page layout and styles
├── questions.js      The 130 statements and their scoring vectors
├── ideologies.js     The 13 axis definitions and 242 ideologies
├── extras.js         The survey questions and the party list
├── dodecahedron.js   The twelve faced map
├── app.js            The engine: quiz flow, math, charts, sharing, card export
├── legal.html        Terms, privacy and cookies
├── og.png            The preview image shown when the link is pasted into a chat
├── figures/          Portraits, plus credits.json and CREDITS.md
└── tools/
    ├── fetch_figures.py   Downloads freely licensed portraits from Wikimedia Commons
    └── collector.gs       Google Apps Script that saves shared survey rows to a sheet
```

## How the math works

**1. Add up raw scores.** Each answer has a weight: Strongly Agree is `+1.0`, Agree is `+0.5`, Neutral is `0`, Disagree is `-0.5`, Strongly Disagree is `-1.0`. Each statement has an effect on one or more axes. For every statement, the app adds `weight x effect` to each axis it touches.

**2. Normalize to a percentage.** For each axis the app works out the highest and lowest raw score possible with the statements you were shown, then converts your score:

```
percentage = (score - min) / (max - min) * 100
```

Because the bounds come from the active statement set, the Quick and Full tests both produce a clean 0 to 100 range.

**3. Find the closest ideology.** Your thirteen percentages form a point in 13D space. The app measures the straight line (Euclidean) distance from you to each ideology:

```
D = sqrt( (you.econ - a.econ)^2 + (you.own - a.own)^2 + ... )
```

The smallest distance wins. The match score is `max(0, 100 - D / (2 * sqrt(axes / 6)))`. The square root term keeps the score on the same scale no matter how many axes there are.

## The survey and the statistics

After the last statement the site asks a few optional questions: five about belief, plus country, age group, gender and religion.

The belief answers each add a few points to a few axes. The size of every nudge is listed in `SURVEY_BELIEFS` in `extras.js`. The other four questions never change a result.

Sharing is off by default. While `collectUrl` in `app.js` is empty, nothing is ever sent anywhere. To switch it on, follow the steps at the top of `tools/collector.gs` and paste the web app address into `collectUrl`. From then on, a person who presses **Share and see my result** adds one anonymous row to your Google Sheet: the thirteen scores from their statements, their closest ideology, and whatever survey answers they gave. No name, email or IP address is stored.

To keep bots and junk out of the numbers, a row is only sent from the Share button, only for a test that was fully answered in that browser, only once per result, never for someone who says they are under 13, and never when a hidden field that only bots fill in has a value. The collector script repeats those checks and limits how many rows it accepts per minute.

If you switch sharing on you are collecting political and religious views, which the law treats as sensitive. Keep `legal.html` accurate, keep the sheet private, and only publish totals.

## Parties

`PARTIES` in `extras.js` lists each party with the document it was placed from, such as a manifesto or founding programme. The thirteen numbers are editorial estimates of what that document says, not of how the party governed. Party logos are trademarks, so the site shows a coloured square with the party's initials instead.

## How the dodecahedron works

A dodecahedron has twelve faces, which come in six opposite pairs. Each pair is given two axes that move together across the ideologies, such as Economy with Ownership, and the pairing is worked out from the data when the page loads. One face shows the high end of the first axis and the opposite face shows the low end of the second, so a high score on both pulls a dot the same way.

It is still twelve numbers shown in three dimensions, so two different ideologies can land close together. Distance from the centre is evened out so the crowded middle stays readable: a dot keeps its direction and its rank, not its exact distance. Trade is left off because the shape has twelve faces.

## Portraits

Most ideologies have a portrait of the thinker behind them. The rest show a name plate with the thinker's initials. That happens when no freely licensed image exists, for the two meme entries that have no founder, and for the entries marked `restricted` in `ideologies.js`. Those are hateful or violent extremist ideologies, which get no portrait and no emblem.

To download missing portraits, run this from the repo root:

```bash
python3 tools/fetch_figures.py
```

The script looks everyone up in a few batched requests and pauses between downloads, because Wikimedia limits how fast files can be requested.

## Licences

**Code.** The site's code, questions and ideology data are released under the [MIT License](LICENSE). You can use, change and share them, including in your own quiz, as long as you keep the copyright notice.

**Portraits.** The images in `figures/` are not covered by the MIT License. Each one comes from Wikimedia Commons and is either public domain or under a Creative Commons BY, BY-SA or CC0 licence. Authors, licences and the changes made are listed in [`figures/CREDITS.md`](figures/CREDITS.md), the credit is shown under every portrait on the site, and it is printed on every result card.

**Libraries and fonts**, loaded from public CDNs and not copied into this repo: Plotly.js (MIT), qrcode-generator (MIT), and the Anton and Archivo typefaces (SIL Open Font License).

## Run it locally

There is nothing to install or build. Start a local server from the repo root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Deploy it

The site is hosted on GitHub Pages from the `main` branch. Every merge into `main` rebuilds it automatically within a minute or two.

## Share link format

A result link carries one value per axis:

```
https://ethoscales.github.io/ethoscales/?e=49.3&o=50&r=61.5&d=58.6&s=48.5&n=44.3&i=37&c=47.1&t=43&ec=62.5&rl=39.6&f=45.5&tr=55
```

| Param | Axis | Param | Axis |
| --- | --- | --- | --- |
| `e` | Economy | `i` | Immigration |
| `o` | Ownership | `c` | Values |
| `r` | Rights | `t` | Technology |
| `d` | Government | `ec` | Environment |
| `s` | Structure | `rl` | Religion |
| `n` | Nation | `f` | Military |
| `tr` | Trade | | |

Two other kinds of link start a challenge. `?vs=` followed by thirteen scores separated by commas asks the visitor to take the test and then compares them with those scores. `?target=` followed by an ideology id, with an optional `&best=` score to beat, dares the visitor to answer in character. A dare skips the survey and never adds to the statistics.

If they are all present and valid, the app skips the test and shows the results straight away. Links made before the Trade axis was added have no `tr` value. They still open, with Trade set to 50.

## Customizing

* **Change or add statements:** edit `QUESTION_BANK` in `questions.js`. Keep five per axis, with the lead axis listed first in `effects`. The scoring bounds recalculate on their own.
* **Change or add ideologies:** edit `ideologies.js`. Give each one a name, thirteen coordinates, a source text, a thinker, a tagline and a description.
* **Change the survey or the parties:** edit `extras.js`.
* **Change the address printed on the card:** edit `brandUrl` at the top of `app.js`.

## Disclaimer

This is a model, and every model is a simplification. The ideology coordinates and statement weights are editorial estimates meant to start conversations, not a scientific instrument. Showing an ideology or its theorist here describes it. It does not endorse it.
