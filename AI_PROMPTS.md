# AI prompty použité při vývoji FirmaCheck

Tento dokument shrnuje, jak byly AI nástroje použity při vývoji, a obsahuje
prompty pro vygenerování vizuálních prvků.

---

## 1. Hero ilustrace (vizuální prvek aplikace)

V repu je `public/hero-illustration.svg` jako **stylizovaný placeholder**.
Pro produkční verzi doporučujeme nahradit AI-generovanou ilustrací.

**Použitý nástroj (doporučení):** Midjourney v6 / DALL·E 3 / Imagen 3

**Prompt:**

```
A clean, modern, flat-style vector illustration of a small Czech city scene
with two stylized office buildings, a friendly green checkmark badge floating
above the buildings to suggest "verified", and a red location pin in the
foreground. Pastel sky-blue background with soft gradients. Subtle, business-
oriented mood. No text, no people. Light theme. 1:1 aspect ratio.
Style: flat illustration, soft shadows, rounded edges, vector look.
Colors: #0EA5E9 (sky blue), #10B981 (emerald), #EF4444 (red), #E0F2FE (light blue).
```

**Kam ho umístit:** Hero sekce na hlavní stránce (komponenta
`src/components/HeroIllustration.tsx`). Soubor uložit jako
`public/hero-illustration.png` (nebo .svg/.webp) a v komponentě upravit
`src` prop.

**Proč tento vizuál:** Aplikace ověřuje existenci firmy, takže ilustrace
spojuje motiv firmy (budovy) + ověření (zelený checkmark) + sídla na mapě
(red pin). Vizuálně signalizuje hlavní use-case na první pohled.

---

## 2. Prompt pro generování ikony / favicon (volitelné)

```
A minimal flat icon: a building silhouette with a small green checkmark
in the top-right corner. Sky-blue and emerald color palette. Rounded
square shape, 1024x1024, transparent background, vector look.
```

**Použití:** `src/app/icon.tsx` nebo `public/favicon.ico`.

---

## 3. Prompt pro prázdný stav (volitelné, pokud chcete vyměnit textový)

```
A small flat illustration: an empty folder with a magnifying glass next
to it. Pastel slate-gray and sky-blue palette. Friendly, minimalist
business style. No text. 400x400.
```

**Použití:** Sekce „Uložené firmy" — když je seznam prázdný, místo textu
zobrazit obrázek.

---

## Jak byly AI nástroje využity při vývoji

- **Claude (Anthropic):** návrh architektury (sql.js + IndexedDB vs.
  Turso), generování boilerplate komponent (Tailwind utility classy,
  Leaflet integrace), psaní validace IČO (checksum algoritmus),
  čeština v UI textech, ladění edge case'ů (CORS, ARES 404, prázdné stavy).
- **Midjourney / DALL·E (doporučení):** generování hero ilustrace (viz
  prompt výše). V repu je SVG placeholder.

Aplikace samotná **nevolá žádné runtime LLM API** — všechna logika běží
pomocí ARES API, Mapy.cz API a lokální SQLite.
