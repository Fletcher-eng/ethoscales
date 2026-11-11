# EthosScales

A 12 axis political values test that runs entirely in your browser. Answer 60 statements, get your coordinates in twelve dimensional ideology space, and see which of 41 ideologies you sit closest to. Every ideology is defined from its own founding text, not from how the word gets used online.

No backend. No accounts. No tracking.

**Live site:** https://fletcher-eng.github.io/ethoscales/

## Features

* **12 independent axes** instead of a single left/right line
* **60 statements**, five led by each axis, where most answers move several axes at once
* **Quick test** (25 statements) and **Full test** (60 statements)
* **41 ideologies**, each with a named source text and the thinker behind it
* **Third Position split into its real movements**: Italian Fascism, Falangism, Peronism, Strasserism, National Bolshevism, Eurasianism and Ba'athism
* **3D chart** where you choose which three axes to view
* **Six 2D compasses** that between them show all twelve axes
* **Share links**: your whole result lives in the URL
* **Result card**: a 1080x1350 PNG with the thinker's portrait and a QR code that opens your result
* **Keyboard controls**: `1` to `5` to answer, left arrow to go back, `Enter` to start

## The twelve axes

Every axis is scored from 0 to 100.

| Axis | 0 means | 100 means |
| --- | --- | --- |
| Economy (`econ`) | Market | Planned |
| Ownership (`own`) | Private | Collective |
| Rights (`rights`) | Liberty | Security |
| Rule (`rule`) | Democracy | Autocracy |
| Structure (`struct`) | Decentralised | Centralised |
| Nation (`nation`) | Internationalist | Nationalist |
| Identity (`ident`) | Multiculturalism | Assimilation |
| Culture (`cult`) | Progressive | Traditional |
| Technology (`tech`) | Accelerationist | Precautionary |
| Ecology (`eco`) | Industrial | Deep Ecology |
| Religion (`relig`) | Secular | Religious |
| Force (`force`) | Pacifist | Militarist |

## Where the definitions come from

Each ideology in `ideologies.js` has a `source` field naming the text it is defined from, such as *The Doctrine of Fascism* (1932) for Italian Fascism or *The Conquest of Bread* (1892) for Anarcho Communism. The description paraphrases that text and the results page shows the source, so anyone can check it.

The coordinates are a different matter. Placing a body of thought at a number between 0 and 100 on twelve scales is a judgement call. They are editorial estimates, and corrections are welcome.

## Project structure

```
ethoscales/
├── index.html        Page layout and styles
├── questions.js      The 60 statements and their scoring vectors
├── ideologies.js     The 12 axis definitions and 41 ideologies
├── app.js            The engine: quiz flow, math, charts, sharing, card export
├── figures/          Portraits, plus credits.json and CREDITS.md
└── tools/
    └── fetch_figures.py   Downloads freely licensed portraits from Wikimedia Commons
```

## How the math works

**1. Add up raw scores.** Each answer has a weight: Strongly Agree is `+1.0`, Agree is `+0.5`, Neutral is `0`, Disagree is `-0.5`, Strongly Disagree is `-1.0`. Each statement has an effect on one or more axes. For every statement, the app adds `weight x effect` to each axis it touches.

**2. Normalize to a percentage.** For each axis the app works out the highest and lowest raw score possible with the statements you were shown, then converts your score:

```
percentage = (score - min) / (max - min) * 100
```

Because the bounds come from the active statement set, the Quick and Full tests both produce a clean 0 to 100 range.

**3. Find the closest ideology.** Your twelve percentages form a point in 12D space. The app measures the straight line (Euclidean) distance from you to each ideology:

```
D = sqrt( (you.econ - a.econ)^2 + (you.own - a.own)^2 + ... )
```

The smallest distance wins. The match score is `max(0, 100 - D / (2 * sqrt(axes / 6)))`. The square root term keeps the score on the same scale no matter how many axes there are.

## Portraits

Portraits come from Wikimedia Commons and are only used if they are public domain or under a Creative Commons BY, BY-SA or CC0 licence. Credits are in [`figures/CREDITS.md`](figures/CREDITS.md), and the credit is printed on every result card.

An ideology with no portrait file shows a name plate with the thinker's initials instead. To download missing portraits, run this from the repo root:

```bash
python3 tools/fetch_figures.py
```

The script is slow on purpose, because Wikimedia limits how fast files can be requested.

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
https://fletcher-eng.github.io/ethoscales/?e=49.3&o=50&r=61.5&d=58.6&s=48.5&n=44.3&i=37&c=47.1&t=43&ec=62.5&rl=39.6&f=45.5
```

| Param | Axis | Param | Axis |
| --- | --- | --- | --- |
| `e` | Economy | `i` | Identity |
| `o` | Ownership | `c` | Culture |
| `r` | Rights | `t` | Technology |
| `d` | Rule | `ec` | Ecology |
| `s` | Structure | `rl` | Religion |
| `n` | Nation | `f` | Force |

If all twelve are present and valid, the app skips the test and shows the results straight away.

## Customizing

* **Change or add statements:** edit `QUESTION_BANK` in `questions.js`. Keep five per axis, with the lead axis listed first in `effects`. The scoring bounds recalculate on their own.
* **Change or add ideologies:** edit `ideologies.js`. Give each one a name, twelve coordinates, a source text, a thinker, a tagline and a description.
* **Change the address printed on the card:** edit `brandUrl` at the top of `app.js`.

## Disclaimer

This is a model, and every model is a simplification. The ideology coordinates and statement weights are editorial estimates meant to start conversations, not a scientific instrument. Showing an ideology or its theorist here describes it. It does not endorse it.
