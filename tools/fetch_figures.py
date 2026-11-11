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

def ok_license(name):
    n = (name or "").lower()
    if "nc" in n.split("-") or "nd" in n.split("-") or " nc" in n or " nd" in n:
        return False
    return n.startswith(("public domain", "pd", "cc0", "cc by", "cc-by", "no restrictions"))

def lead_file(title):
    d = api("en.wikipedia.org", action="query", titles=title, prop="pageimages", piprop="name", redirects=1)
    for p in d["query"]["pages"].values():
        if "pageimage" in p:
            return "File:" + p["pageimage"]
    return None

def main():
    only = set(sys.argv[1:])
    try:
        credits = json.load(open(f"{OUT}/credits.json"))
    except FileNotFoundError:
        credits = {}
    for fid, title in FIGURES.items():
        if only and fid not in only:
            continue
        if not only and fid in credits and os.path.exists(f"{OUT}/{fid}.jpg"):
            continue  # already downloaded
        try:
            f = title if title.startswith("File:") else lead_file(title)
            if not f:
                print(f"SKIP {fid}: no lead image"); credits.pop(fid, None); continue
            d = api("commons.wikimedia.org", action="query", titles=f, prop="imageinfo",
                    iiprop="url|extmetadata", iiurlwidth=500)  # 500 is a standard thumbnail size
            page = next(iter(d["query"]["pages"].values()))
            if "imageinfo" not in page:
                print(f"SKIP {fid}: {f} is not on Commons (likely non free)"); credits.pop(fid, None); continue
            ii = page["imageinfo"][0]
            meta = ii.get("extmetadata", {})
            lic = strip(meta.get("LicenseShortName", {}).get("value"))
            if not ok_license(lic):
                print(f"SKIP {fid}: licence '{lic}' not accepted"); credits.pop(fid, None); continue
            raw = get(ii["thumburl"])
            img = Image.open(io.BytesIO(raw)).convert("RGB")
            # Portrait crop 4:5, biased toward the top where the face is.
            img = ImageOps.fit(img, (400, 500), Image.LANCZOS, centering=(0.5, 0.25))
            img.save(f"{OUT}/{fid}.jpg", "JPEG", quality=82, optimize=True)
            credits[fid] = {
                "file": f, "license": lic,
                "author": strip(meta.get("Artist", {}).get("value"))[:120] or "Unknown",
                "source": ii.get("descriptionurl", ""),
            }
            print(f"OK   {fid}: {f} [{lic}]")
        except Exception as e:  # keep going, report at the end
            print(f"FAIL {fid}: {e}")
        time.sleep(4.0)
    json.dump(credits, open(f"{OUT}/credits.json", "w"), indent=1, ensure_ascii=False, sort_keys=True)
    with open(f"{OUT}/CREDITS.md", "w") as md:
        md.write("# Portrait credits\n\nAll portraits come from Wikimedia Commons. Each was cropped to 4:5 and resized.\n\n| Figure | File | Author | Licence |\n| --- | --- | --- | --- |\n")
        for fid in sorted(credits):
            c = credits[fid]
            md.write(f"| {FIGURES.get(fid, fid)} | [{c['file'][5:]}]({c['source']}) | {c['author']} | {c['license']} |\n")

if __name__ == "__main__":
    main()
