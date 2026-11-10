# AxiomValues // EthosScales

A 6 axis political values test that runs entirely in your browser. Answer 18 dilemmas, get your coordinates in six dimensional ideology space, see which of 15 archetypes you sit closest to, and share the result as a link or a downloadable card.

No backend. No accounts. No tracking. Just four files.

## Features

* **6 independent axes** instead of a single left/right line
* **18 dilemmas** where every answer moves several axes at once
* **Quick mode** (12 questions) and **Full mode** (18 questions)
* **15 archetypes**, from Classical Social Democrat to Network State Localist
* **3D interactive chart** (Plotly) built from your 3 most polarized axes
* **Three 2D compasses**: classic, culture and tech, systemic and ecological
* **Share links**: your whole result lives in the URL
* **Result card**: a 1080x1350 PNG with a QR code that opens your result
* **Keyboard controls**: `1` to `5` to answer, left arrow to go back, `Enter` to start

## The six axes

Every axis is scored from 0 to 100.

| Axis | 0 means | 100 means |
| --- | --- | --- |
| Economic (`econ`) | Decentralized / Market | Centralized / Planned |
| Governance (`gov`) | Autonomy / Anarchic | Authority / State |
| Technological (`tech`) | Accelerationist / Transhuman | Precautionary / Bioconservative |
| Cultural (`cult`) | Cosmopolitan / Progressive | Localist / Traditional |
| Structural (`struct`) | Fluid / Network State | Rigid / Nation State |
| Ecological (`eco`) | Anthropocentric / Industrial | Deep Ecology / Green |

## Project structure

```
ethoscales/
├── index.html      Page layout, styles, Tailwind + Plotly from CDN
├── questions.js    The 18 questions and their scoring vectors
├── ideologies.js   The 6 axis definitions and 15 archetype coordinates
├── app.js          The engine: quiz flow, math, charts, sharing, card export
└── README.md       You are here
```

## How the math works

**1. Add up raw scores.** Each answer has a weight: Strongly Agree is `+1.0`, Agree is `+0.5`, Neutral is `0`, Disagree is `-0.5`, Strongly Disagree is `-1.0`. Each question has an effect on one or more axes. For every question, the app adds `weight x effect` to each axis it touches.

**2. Normalize to a percentage.** For each axis the app works out the highest and lowest raw score possible with the questions you were asked, then converts your score:

```
percentage = (score - min) / (max - min) * 100
```

Because the bounds come from the active question set, Quick mode and Full mode both produce a clean 0 to 100 range.

**3. Find the closest archetype.** Your six percentages form a point in 6D space. The app measures the straight line (Euclidean) distance from you to each archetype:

```
D = sqrt( (you.econ - a.econ)^2 + (you.gov - a.gov)^2 + ... )
```

The smallest distance wins. The compatibility score is `max(0, 100 - D / 2)`.

## Run it locally

There is nothing to install or build. You can double click `index.html`, but a local server behaves more like the real site:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Deploy it

### GitHub Pages

1. Push the code to GitHub.
2. In the repository, open **Settings**, then **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Pick the `main` branch and the `/ (root)` folder, then save.
5. After about a minute the site is live at `https://YOUR-USERNAME.github.io/ethoscales/`.

### Vercel

1. Go to vercel.com and choose **Add New Project**.
2. Import the GitHub repository.
3. Leave every setting at its default (there is no build step) and press **Deploy**.

## Share link format

A result link looks like this:

```
https://your-site.com/?e=12.9&g=19.7&t=12.5&c=12.5&s=22.1&ec=17.3
```

| Param | Axis |
| --- | --- |
| `e` | Economic |
| `g` | Governance |
| `t` | Technological |
| `c` | Cultural |
| `s` | Structural |
| `ec` | Ecological |

If all six are present and valid, the app skips the quiz and shows the results dashboard straight away.

## Customizing

* **Change or add questions:** edit `questions.js`. The scoring bounds recalculate on their own.
* **Change or add archetypes:** edit `ideologies.js`. Give each one a name, six coordinates, a tagline and a description.
* **Change the domain printed on the card:** edit `brandUrl` at the top of `app.js`.

## Git cheat sheet

Git is a save system for code. It remembers every version of your project, and GitHub is where a copy of that history lives online.

### The mental model

Think of three places your work can be:

1. **Working folder**: the files you are editing right now.
2. **Staging area**: the changes you have picked to go into the next save.
3. **History**: the permanent list of saves, called commits.

The everyday loop is always the same three steps: **add, commit, push**. Pick the changes, save them with a message, upload them.

### One time setup

Download a copy of the project to your computer:

```bash
git clone https://github.com/fletcher-eng/ethoscales.git
```

Move into the project folder:

```bash
cd ethoscales
```

### The daily loop

See what has changed since your last save. Run this constantly, it never breaks anything:

```bash
git status
```

Stage every changed file (the dot means "everything in this folder"):

```bash
git add .
```

Save the staged changes with a short message that says what you did:

```bash
git commit -m "feat: add new question about data privacy"
```

Upload your commits to GitHub:

```bash
git push origin main
```

In that last command, `origin` is the nickname for your GitHub copy and `main` is the name of the branch you are sending.

### Useful extras

Get the latest changes from GitHub (do this before you start working):

```bash
git pull origin main
```

See exactly which lines changed before you stage them:

```bash
git diff
```

See your history of commits, one per line:

```bash
git log --oneline
```

### Branches

A branch is a parallel copy of the project where you can experiment without touching `main`. When the experiment works, you merge it back.

Create a new branch and switch to it:

```bash
git switch -c my-new-feature
```

Push that branch to GitHub for the first time:

```bash
git push -u origin my-new-feature
```

Switch back to main:

```bash
git switch main
```

Merge your finished branch into main:

```bash
git merge my-new-feature
```

### Commit message style

The `feat:` at the start of a message is a convention called Conventional Commits. It is optional but it makes history easy to scan.

| Prefix | Use it when you |
| --- | --- |
| `feat:` | add something new |
| `fix:` | repair a bug |
| `docs:` | change the README or comments |
| `style:` | change looks only, no logic |
| `refactor:` | reorganize code without changing behavior |

### How to memorize it

Do not try to memorize it from a list. Type the loop by hand every single time you finish a small piece of work: `status`, `add`, `commit`, `push`. After about twenty rounds your fingers know it.

## Disclaimer

This is a model, and every model is a simplification. The archetype coordinates and question weights are editorial estimates meant to start conversations, not a scientific instrument.
