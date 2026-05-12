# FirmaCheck

Webová aplikace pro rychlé ověření základních údajů o české firmě podle IČO.
Načte data z **ARES**, zobrazí sídlo na mapě **Mapy.com**, uloží odpovědi do
**SQLite cache** v prohlížeči a umožní firmy hromadně exportovat do CSV/JSON.

> **Živé demo:** _doplnit po nasazení na Vercel_

---

## Funkce

- Validace IČO (formát + kontrolní součet mod-11)
- Načtení údajů z ARES (název, právní forma, datum vzniku, stav, adresa, DIČ)
- Volitelné porovnání zadaného názvu s názvem z ARES (přesná / částečná / žádná shoda)
- Geocoding adresy přes Mapy.com a zobrazení sídla na interaktivní mapě
- Tlačítko **Otevřít na Mapy.com** pro přechod na externí mapu
- Viditelné rozlišení zdroje dat: **API** vs. **SQLite cache** (pro ARES i geocoding zvlášť)
- Uložení firmy do seznamu, který přežije refresh stránky
- Export uložených firem do **CSV** a **JSON**, kopírování JSON do schránky
- Responzivní UI (Tailwind v4), AI hero ilustrace

---

## Tech stack

| Část                 | Technologie                                                  |
| -------------------- | ------------------------------------------------------------ |
| Framework            | Next.js 16 (App Router, Turbopack) · React 19.2 · TypeScript |
| Styling              | Tailwind CSS v4                                              |
| Mapa                 | Leaflet 1.9 + Mapy.com tile API                              |
| Geocoding            | Mapy.com REST API                                            |
| Lokální úložiště     | **sql.js** (SQLite ve WASM) + **IndexedDB** (idb)            |
| ARES proxy           | Next.js Route Handler (`/api/ares`)                          |
| Hosting              | Vercel (doporučeno)                                          |

---

## Použité externí API

- **ARES** — `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/{ICO}` (veřejné, bez klíče)
- **Mapy.com** — geocoding `https://api.mapy.com/v1/geocode` + tile `https://api.mapy.com/v1/maptiles/basic/256/{z}/{x}/{y}` (vyžaduje API klíč z https://developer.mapy.com/)

---

## Spuštění lokálně

```bash
git clone https://github.com/<uzivatel>/firmacheck.git
cd firmacheck
npm install
cp .env.example .env.local
# do .env.local doplnit NEXT_PUBLIC_MAPY_API_KEY
npm run dev
```

Aplikace běží na <http://localhost:3000>.

---

## Nasazení na Vercel

1. Pushni repozitář na GitHub.
2. Na [vercel.com](https://vercel.com) → **New Project** → import GitHub repo.
3. Framework preset se autodetekuje jako **Next.js**, nic není potřeba měnit.
4. V **Environment Variables** přidej `NEXT_PUBLIC_MAPY_API_KEY` s tvým klíčem.
5. **Deploy**.

Build trvá ~1 minutu. Vercel nasazuje na unikátní `*.vercel.app` URL.

---

## SQLite cache — jak funguje

Aplikace cachuje:

- **Odpovědi z ARES** — klíč je IČO. Pokud je v cache, druhý dotaz na stejné
  IČO se vyhne síťovému volání.
- **Geocoding výsledky** — klíč je textová adresa. Pokud je v cache, geocoding
  proběhne lokálně.

Při zobrazení firmy aplikace ukáže pro každý zdroj odděleně, odkud data jsou:

> ARES data: **API** &nbsp;·&nbsp; Geocoding: **SQLite cache**

### Proč browser-side SQLite (sql.js + IndexedDB)?

Aplikace je nasazená na **Vercel**, který běží **serverless** — function
runtime nemá perzistentní filesystem mezi requesty, takže klasická server-side
`better-sqlite3` by mezi voláními ztratila stav. Místo toho používáme **sql.js**
(SQLite zkompilované do WASM) v prohlížeči a celou databázi serializujeme do
**IndexedDB** po každém zápisu.

**Důsledky tohoto rozhodnutí:**

- Cache i uložené firmy jsou **per-user** — každý uživatel má vlastní DB.
  Pro use case „ověřuji si firmy" je to v pořádku, navíc to chrání soukromí
  (kdo se na koho ptal nikam neodchází).
- Žádné externí závislosti (na rozdíl od Turso / libSQL), bez nutnosti
  spravovat tokeny.
- Architektura **zůstává jednotná**: stejná SQLite databáze obsahuje
  `ares_cache`, `geocoding_cache` i `saved_companies`.

Schéma DB:

```sql
CREATE TABLE ares_cache (
  ico TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  fetched_at INTEGER NOT NULL
);
CREATE TABLE geocoding_cache (
  address TEXT PRIMARY KEY,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  fetched_at INTEGER NOT NULL
);
CREATE TABLE saved_companies (
  ico TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  legal_form TEXT NOT NULL,
  legal_form_code TEXT,
  established_date TEXT,
  dissolved_date TEXT,
  status TEXT NOT NULL,
  address TEXT NOT NULL,
  dic TEXT,
  lat REAL,
  lng REAL,
  last_verified_at INTEGER NOT NULL,
  last_source TEXT NOT NULL
);
```

WASM soubor je servírovaný z `/public/sql-wasm/sql-wasm.wasm` (viz
`src/lib/db.ts`, parametr `locateFile`).

---

## Uložení firem

Tlačítko **+ Uložit firmu** v detailu firmy ji vloží do tabulky `saved_companies`
v lokální SQLite. Sekce **Uložené firmy** vypisuje obsah tabulky setříděný od
nejnověji ověřených. Každý záznam má **Detail** (otevře tu samou firmu znovu,
včetně mapy z cache) a **Smazat** (`DELETE` ze SQL tabulky).

Architektonicky to využívá stejný storage mechanismus jako cache —
„uložené firmy" jsou jen jiná tabulka v té samé SQLite DB. Jednotně.

---

## Export CSV / JSON

V sekci **Uložené firmy** jsou tři tlačítka:

- **Export CSV** — stáhne `firmacheck-YYYY-MM-DD.csv` s BOM (Excel-friendly UTF-8).
- **Export JSON** — stáhne `firmacheck-YYYY-MM-DD.json` (pretty-printed).
- **Kopírovat JSON** — Clipboard API, vhodné pro rychlé vložení např. do issue.

CSV obsahuje sloupce: IČO, Obchodní název, Právní forma, Stav subjektu,
Adresa sídla, Datum vzniku, Datum posledního ověření, Zdroj posledního
načtení, Zeměpisná šířka, Zeměpisná délka.

Pokud je seznam prázdný, tlačítka jsou disabled.

Export exportuje **skutečně uložené firmy** — žádná ukázková data.

---

## Použité AI nástroje

- **Claude** (Anthropic, claude-opus-4-7) — návrh architektury (volba
  sql.js+IndexedDB nad Turso), generování boilerplate komponent, validace IČO
  podle oficiálního checksum algoritmu, ladění edge case'ů.
- **Midjourney / DALL·E 3 / Imagen 3** (doporučení) — generování hero
  ilustrace. V repu je SVG placeholder; prompty viz [AI_PROMPTS.md](./AI_PROMPTS.md).

**Aplikace samotná nevolá žádné runtime LLM API** — všechna logika běží přes
ARES, Mapy.com a SQLite v prohlížeči.

### Ukázky promptů použitých během vývoje

**Prompt 1 — Validace IČO**

> Napiš TypeScript validátor IČO podle oficiálního českého algoritmu:
> 8 číslic, kde poslední je kontrolní součet mod 11 z prvních 7 vážených
> 8,7,6,5,4,3,2. Funkce má vracet `{ ok: true, ico } | { ok: false, error }`.

**Prompt 2 — Volba storage architektury**

> Mám Next.js aplikaci na Vercelu, která potřebuje SQLite cache pro ARES
> odpovědi a seznam uložených firem. Vercel je serverless, takže
> `better-sqlite3` nepřežije mezi requesty. Porovnej: (a) sql.js + IndexedDB
> v prohlížeči, (b) Turso / libSQL, (c) vlastní backend. Které řeší
> jednotnou architekturu pro cache i uložené firmy?

**Prompt 3 — Hero ilustrace**

> A clean, modern, flat-style vector illustration of a small Czech city scene
> with two stylized office buildings, a friendly green checkmark badge floating
> above the buildings to suggest "verified", and a red location pin in the
> foreground. Pastel sky-blue background with soft gradients.
> Style: flat illustration, soft shadows, rounded edges, vector look.

Více v [AI_PROMPTS.md](./AI_PROMPTS.md).

---

## Iterace během vývoje

**Iterace 1 — Storage architektura.**
Původně jsem zvažoval server-side `better-sqlite3` v Next.js API routes,
ale Vercel ho mezi invokacemi neudrží (ephemeral filesystem). Druhá varianta
byla Turso — funkční, ale přidává externí závislost a sdílenou DB (privacy
issue, kdokoli vidí cizí cache). Finálně padlo rozhodnutí pro **sql.js +
IndexedDB**: jedna technologie pro cache i uložené firmy, per-user privacy,
nulová serverová závislost.

**Iterace 2 — Geocoding vs. tile loading.**
Mapy.com API klíč musí být v tile URL pro Leaflet, takže by se stejně dostal
na klienta. Původně jsem chtěl mít dva klíče (server-side pro geocoding,
public pro tiles), ale to přidávalo komplexitu bez bezpečnostního přínosu.
Rozhodl jsem se mít jeden `NEXT_PUBLIC_MAPY_API_KEY` použitý jak pro tiles,
tak pro geocoding (volané z klienta). Bezpečnost se řeší **HTTP referrer
restrikcí** v Mapy.com dashboardu, ne tajností klíče.

**Iterace 3 (bonus) — Cache busting strategy.**
Cache aktuálně nemá TTL — to je vědomé rozhodnutí pro tenhle MVP, protože
ARES data se mění zřídka. Pokud by uživatel chtěl fresh data, stačí smazat
IndexedDB v DevTools. V dalších iteracích by se hodilo přidat TTL na
`fetched_at` (např. 24h pro ARES, 30 dní pro geocoding) + tlačítko
„Znovu načíst z API" v detailu.

---

## Co bych vylepšil s více časem

- **TTL na cache** + tlačítko force refresh.
- **Detail offline z cache** — pokud uživatel klikne na uloženou firmu bez
  internetu, aktuálně to selže na re-verify; mohlo by to fungovat plně
  offline z lokální SQLite.
- **Vyhledávání podle názvu** v ARES (`/ekonomicke-subjekty?obchodniJmeno=...`),
  ne jen podle IČO.
- **Validace názvu firmy** s nuancí — teď je porovnání jednoduché (normalizace
  diakritiky + strip právní formy); rozšířit o Levenshtein distance.
- **Statistika cache** — kolik dotazů ušetřil cache vs. API.
- **Tmavý režim** — aktuálně jen světlé téma.
- **Unit testy** pro `validateIco`, `compareNames`, `parseAresResponse`.
- **E2E test** s Playwrightem pro happy-path flow.
- **A11y audit** — focus rings, ARIA labels, keyboard nav v mapě.
- **PWA manifest** + service worker pro plně offline použití.
- **AI ilustrace skutečně vygenerovaná** — SVG placeholder vyměnit za
  Midjourney/Imagen output (viz `AI_PROMPTS.md`).

---

## Struktura projektu

```
firmacheck/
├── public/
│   ├── hero-illustration.svg     # AI placeholder vizuál (viz AI_PROMPTS.md)
│   └── sql-wasm/sql-wasm.wasm    # SQLite WASM binary
├── src/
│   ├── app/
│   │   ├── api/ares/route.ts     # ARES proxy (server)
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Hlavní stránka (client component)
│   │   └── globals.css
│   ├── components/
│   │   ├── CompanyForm.tsx       # Vstupní formulář IČO + název
│   │   ├── CompanyDetail.tsx     # Detail firmy
│   │   ├── CompanyMap.tsx        # Leaflet + Mapy.com (dynamic import, ssr:false)
│   │   ├── SavedCompanies.tsx    # Seznam uložených firem + export
│   │   ├── HeroIllustration.tsx  # AI vizuál wrapper
│   │   └── StatusBadge.tsx       # SourceBadge / VerificationBadge
│   ├── lib/
│   │   ├── ico.ts                # Validace IČO + checksum
│   │   ├── ares.ts               # ARES parser, legal form mapping
│   │   ├── compare.ts            # Porovnání názvu firmy
│   │   ├── db.ts                 # sql.js + IndexedDB
│   │   ├── geocoding.ts          # Mapy.com geocoding klient
│   │   └── export.ts             # CSV / JSON / clipboard
│   └── types.ts
├── AI_PROMPTS.md
├── README.md
└── .env.example
```

---

## Licence

MIT.
