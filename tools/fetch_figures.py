#!/usr/bin/env python3
"""Download one freely licensed portrait per theorist from Wikimedia Commons.

Run from the repo root:  python3 tools/fetch_figures.py
Writes figures/<id>.jpg, figures/credits.json and figures/CREDITS.md.
Only public domain and Creative Commons BY / BY-SA / CC0 files are accepted.
A theorist with no acceptable file is skipped, and the site shows a name plate.
"""
import io, json, os, sys, time, urllib.error, urllib.parse, urllib.request, re, html
from PIL import Image, ImageOps

UA = "figure-fetch/1.0 (static site build script)"
OUT = "figures"
# id -> English Wikipedia article title (the article's lead image is used),
# or "File:..." to name a Commons file directly.
FIGURES = {
    "italian-fascism": "Giovanni Gentile",
    "falangism": "José Antonio Primo de Rivera",
    "peronism": "Juan Perón",
    "strasserism": "Otto Strasser",
    "national-bolshevism": "Ernst Niekisch",
    "eurasianism": "Aleksandr Dugin",
    "baathism": "Michel Aflaq",
    "juche": "Kim Il Sung",
    "maoism": "Mao Zedong",
    "marxism-leninism": "Vladimir Lenin",
    "council-communism": "Antonie Pannekoek",
    "anarcho-communism": "Peter Kropotkin",
    "anarcho-syndicalism": "Rudolf Rocker",
    "market-socialism": "Oskar R. Lange",
    "mutualism": "Pierre-Joseph Proudhon",
    "georgism": "Henry George",
    "social-democracy": "Eduard Bernstein",
    "left-accelerationism": "Nick Srnicek",
    "classical-liberalism": "John Stuart Mill",
    "social-liberalism": "John Rawls",
    "minarchism": "Robert Nozick",
    "anarcho-capitalism": "Murray Rothbard",
    "agorism": "Samuel Edward Konkin III",
    "crypto-anarchism": "Timothy C. May",
    "ordoliberalism": "Walter Eucken",
    "christian-democracy": "Jacques Maritain",
    "burkean-conservatism": "Edmund Burke",
    "reactionary-monarchism": "Joseph de Maistre",
    "national-conservatism": "Yoram Hazony",
    "neo-cameralism": "Curtis Yarvin",
    "right-accelerationism": "Nick Land",
    "network-state": "Balaji Srinivasan",
    "distributism": "G. K. Chesterton",
    "deep-ecology": "Arne Næss",
    "anarcho-primitivism": "John Zerzan",
    "eco-authoritarianism": "Pentti Linkola",
    "social-ecology": "Murray Bookchin",
    "technocracy": "Howard Scott",
    "democratic-transhumanism": "James Hughes (sociologist)",
    "egoist-anarchism": "Max Stirner",
    "tolstoyanism": "Leo Tolstoy",
    # national-socialism is left out on purpose: it shows a name plate, not a portrait.
    "national-syndicalism": "Ramiro Ledesma Ramos",
    "brazilian-integralism": "Plínio Salgado",
    "austrofascism": "Engelbert Dollfuss",
    "third-international-theory": "Muammar Gaddafi",
    "nasserism": "Gamal Abdel Nasser",
    "futurism": "Filippo Tommaso Marinetti",
    "radical-traditionalism": "Julius Evola",
    "archeofuturism": "Guillaume Faye",
    "trotskyism": "Leon Trotsky",
    "stalinism": "Joseph Stalin",
    "luxemburgism": "Rosa Luxemburg",
    "titoism": "Edvard Kardelj",
    "dengism": "Deng Xiaoping",
    "guevarism": "Che Guevara",
    "utopian-socialism": "Robert Owen",
    "revolutionary-syndicalism": "Georges Sorel",
    "ujamaa": "Julius Nyerere",
    "eco-socialism": "Michael Löwy",
    "democratic-confederalism": "Abdullah Öcalan",
    "zapatismo": "Subcomandante Marcos",
    "keynesian-liberalism": "John Maynard Keynes",
    "neoliberalism": "Milton Friedman",
    "third-way": "Anthony Giddens",
    "objectivism": "Ayn Rand",
    "hoppeanism": "Hans-Hermann Hoppe",
    "effective-accelerationism": "Guillaume Verdon",
    "bioconservatism": "Leon Kass",
    "neoconservatism": "Irving Kristol",
    "paleoconservatism": "Pat Buchanan",
    "communitarianism": "Amitai Etzioni",
    "kemalism": "Mustafa Kemal Atatürk",
    "bonapartism": "Napoleon III",
    "zionism": "Theodor Herzl",
    "hindutva": "Vinayak Damodar Savarkar",
    "islamism": "Sayyid Qutb",
    "khomeinism": "Ruhollah Khomeini",
    "gandhism": "Mahatma Gandhi",
    "platonism": "Plato",
    "confucianism": "Confucius",
    "anarcho-monarchism": "J. R. R. Tolkien",
    "posadism": "J. Posadas",
    "luxury-space-communism": "Aaron Bastani",
}

def get(url, timeout=60):
    """GET with patient retries, since Wikimedia rate limits bursts."""
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code != 429 or attempt == 4:
                raise
            time.sleep(20 * (attempt + 1))

def api(host, **params):
    params["format"] = "json"
    return json.loads(get(f"https://{host}/w/api.php?" + urllib.parse.urlencode(params)))

def strip(text):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", text or ""))).strip()

def clean_author(text):
    """Commons sometimes repeats the author text twice in a row. Keep one copy."""
    text = (text or "").strip()
    half = len(text) // 2
    if text and len(text) % 2 == 0 and text[:half] == text[half:]:
        text = text[:half]
    return text[:120] or "Unknown"


def ok_license(name):
    n = (name or "").lower()
    if "nc" in n.split("-") or "nd" in n.split("-") or " nc" in n or " nd" in n:
        return False
    return n.startswith(("public domain", "pd", "cc0", "cc by", "cc-by", "no restrictions"))

def batched(items, size=40):
    for i in range(0, len(items), size):
        yield items[i:i + size]


def lead_files(titles):
    """Article title -> lead image file, asking for many articles per request."""
    out = {}
    for chunk in batched(titles):
        d = api("en.wikipedia.org", action="query", titles="|".join(chunk), prop="pageimages",
                piprop="name", redirects=1, pilimit="max")
        q = d.get("query", {})
        back = {}  # follow normalisation and redirects back to the title we asked for
        for step in q.get("normalized", []) + q.get("redirects", []):
            back[step["to"]] = back.get(step["from"], step["from"])
        for p in q.get("pages", {}).values():
            if "pageimage" in p:
                out[back.get(p["title"], p["title"])] = "File:" + p["pageimage"]
        time.sleep(2)
    return out


def file_info(files):
    """Commons file -> thumbnail URL and licence details, many files per request."""
    out = {}
    for chunk in batched(files):
        d = api("commons.wikimedia.org", action="query", titles="|".join(chunk), prop="imageinfo",
                iiprop="url|extmetadata", iiurlwidth=500)  # 500 is a standard thumbnail size
        q = d.get("query", {})
        back = {n["to"]: n["from"] for n in q.get("normalized", [])}
        for p in q.get("pages", {}).values():
            if "imageinfo" in p:
                out[back.get(p["title"], p["title"])] = p["imageinfo"][0]
        time.sleep(2)
    return out


CREDITS_HEADER = """# Portrait credits

All portraits come from Wikimedia Commons. Follow the file link in each row for the original image and its full licence terms.

## Changes made

Every image was cropped to a 4:5 portrait and resized to 400 by 500 pixels. The site displays them in greyscale with raised contrast. No other changes were made.

## Licence of these files

The files in this folder are separate works from the site's code and are not covered by its MIT License.

- **Public domain and CC0** images carry no conditions.
- **CC BY** images may be reused if the author is credited as shown below.
- **CC BY-SA** images may be reused if the author is credited, and any adapted version must be shared under the same licence. The cropped versions in this folder are adaptations, so each one is offered under the same CC BY-SA licence as its original.

Licence texts: [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), [CC BY-SA 1.0](https://creativecommons.org/licenses/by-sa/1.0/), [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/), [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), [CC BY-SA 3.0 NL](https://creativecommons.org/licenses/by-sa/3.0/nl/), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), [CC0](https://creativecommons.org/publicdomain/zero/1.0/).

Inclusion of a person here does not imply that they endorse this site.

## Credits

| Figure | File | Author | Licence |
| --- | --- | --- | --- |
"""


def save(credits):
    """Write credits.json and CREDITS.md. Called after every portrait."""
    json.dump(credits, open(f"{OUT}/credits.json", "w"), indent=1, ensure_ascii=False, sort_keys=True)
    with open(f"{OUT}/CREDITS.md", "w") as md:
        md.write(CREDITS_HEADER)
        for fid in sorted(credits):
            c = credits[fid]
            md.write(f"| {FIGURES.get(fid, fid)} | [{c['file'][5:]}]({c['source']}) | {c['author']} | {c['license']} |\n")


def main():
    only = set(sys.argv[1:])
    try:
        credits = json.load(open(f"{OUT}/credits.json"))
    except FileNotFoundError:
        credits = {}
    todo = {fid: t for fid, t in FIGURES.items()
            if (not only or fid in only) and (only or fid not in credits or not os.path.exists(f"{OUT}/{fid}.jpg"))}
    if not todo:
        print("Nothing to do"); return

    # Two batched lookups cover everyone, which keeps well inside Wikimedia's rate limit.
    leads = lead_files([t for t in todo.values() if not t.startswith("File:")])
    files = {fid: (t if t.startswith("File:") else leads.get(t)) for fid, t in todo.items()}
    info = file_info(sorted({f for f in files.values() if f}))

    for fid, f in files.items():
        path = f"{OUT}/{fid}.jpg"
        reason = None
        if not f:
            reason = "no lead image"
        elif f not in info:
            reason = f"{f} is not on Commons (likely non free)"
        else:
            meta = info[f].get("extmetadata", {})
            lic = strip(meta.get("LicenseShortName", {}).get("value"))
            if not ok_license(lic):
                reason = f"licence '{lic}' not accepted"
        if reason:
            print(f"SKIP {fid}: {reason}", flush=True)
            credits.pop(fid, None)
            if os.path.exists(path):
                os.remove(path)  # never keep an image we cannot credit
            save(credits)
            continue
        try:
            if not os.path.exists(path):  # an earlier run may have saved the image already
                img = Image.open(io.BytesIO(get(info[f]["thumburl"]))).convert("RGB")
                # Portrait crop 4:5, biased toward the top where the face is.
                img = ImageOps.fit(img, (400, 500), Image.LANCZOS, centering=(0.5, 0.25))
                img.save(path, "JPEG", quality=82, optimize=True)
                time.sleep(3.0)
            credits[fid] = {
                "file": f, "license": lic,
                "author": clean_author(strip(meta.get("Artist", {}).get("value"))),
                "source": info[f].get("descriptionurl", ""),
            }
            save(credits)
            print(f"OK   {fid}: {f} [{lic}]", flush=True)
        except Exception as e:  # keep going, report at the end
            print(f"FAIL {fid}: {e}", flush=True)


if __name__ == "__main__":
    main()
