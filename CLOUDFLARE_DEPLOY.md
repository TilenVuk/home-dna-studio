# Home DNA Studio: Cloudflare Workers + neposredni Gemini API

Ta različica ne uporablja `LOVABLE_API_KEY`. Poročilo ustvari server funkcija na Cloudflare Workerju z neposrednim klicem Gemini API-ja, PDF pa se še naprej izdela lokalno v brskalniku z `jsPDF`.

Pred Gemini se pošljejo samo odgovori o prostorih, načinu življenja, slogu, investiciji in izvedbi. Ime, e-pošta, telefon, soglasje, Turnstile žeton in povezava do navdiha niso del AI-zahteve. Kontaktni podatki se še vedno uporabijo ločeno za izdelavo PDF-ja v brskalniku in pošiljanje poročila.

## 1. Namestitev

Potrebujete Node.js 24 in pnpm.

```bash
pnpm install --frozen-lockfile
```

## 2. Supabase migracija

V Supabase SQL Editorju zaženite celotno datoteko:

```text
supabase/migrations/20260806101500_home_dna_report_protection.sql
```

Migracija ustvari tabelo in atomsko funkcijo za omejitev ustvarjanja AI-poročil. Shrani samo enosmerni SHA-256 povzetek IP-naslova, ne izvornega IP-ja. Privzeta omejitev je 5 poročil na IP v eni uri.

## 3. Cloudflare Turnstile

V Cloudflare nadzorni plošči ustvarite Turnstile widget za produkcijsko domeno. Nato nastavite:

- javni `VITE_TURNSTILE_SITE_KEY` pred gradnjo aplikacije;
- skrivni `TURNSTILE_SECRET_KEY` kot Worker secret;
- `TURNSTILE_EXPECTED_HOSTNAME` na produkcijsko gostiteljsko ime brez `https://`, na primer `www.nuvelistudio.com`.

Za lokalni razvoj lahko uporabite Cloudflare testna ključa:

```text
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

## 4. Lokalne javne spremenljivke

Kopirajte `.env.example` v `.env.local` in dopolnite javne vrednosti. Skrivnih ključev ne vpisujte v datoteke z oznako `VITE_`, ker so vidni v brskalniku.

```dotenv
VITE_SUPABASE_URL=https://VAŠ-PROJEKT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_PROJECT_ID=...
VITE_TURNSTILE_SITE_KEY=...
```

Za lokalni Worker kopirajte `.dev.vars.example` v `.dev.vars` in dopolnite skrivnosti. `.dev.vars` in `.env.local` sta že izključena iz Gita.

## 5. Gemini

V Google AI Studio ustvarite svoj API-ključ. Workerju ga dodajte kot skrivnost `GEMINI_API_KEY`. Privzeti model je `gemini-3.6-flash`; po potrebi ga spremenite z `GEMINI_MODEL`.

Če Gemini ne odgovori, vrne napako, preseže časovno omejitev ali vrne neveljaven JSON, aplikacija samodejno uporabi obstoječe lokalno rezervno besedilo in nadaljuje z izdelavo PDF-ja.

## 6. Prva gradnja

```bash
pnpm build
```

Gradnja ustvari Cloudflare konfiguracijo v `.output/server/wrangler.json`.

## 7. Worker skrivnosti

Po prvi gradnji nastavite naslednje skrivnosti. Vsak ukaz vas varno vpraša za vrednost:

```bash
pnpm exec wrangler secret put GEMINI_API_KEY --config .output/server/wrangler.json
pnpm exec wrangler secret put GEMINI_MODEL --config .output/server/wrangler.json
pnpm exec wrangler secret put TURNSTILE_SECRET_KEY --config .output/server/wrangler.json
pnpm exec wrangler secret put TURNSTILE_EXPECTED_HOSTNAME --config .output/server/wrangler.json
pnpm exec wrangler secret put SUPABASE_URL --config .output/server/wrangler.json
pnpm exec wrangler secret put SUPABASE_PUBLISHABLE_KEY --config .output/server/wrangler.json
pnpm exec wrangler secret put SUPABASE_SERVICE_ROLE_KEY --config .output/server/wrangler.json
pnpm exec wrangler secret put RESEND_API_KEY --config .output/server/wrangler.json
pnpm exec wrangler secret put HOME_DNA_RATE_LIMIT_SALT --config .output/server/wrangler.json
pnpm exec wrangler secret put HOME_DNA_REPORT_RATE_LIMIT_PER_HOUR --config .output/server/wrangler.json
```

Za `HOME_DNA_RATE_LIMIT_SALT` uporabite naključen niz z vsaj 32 znaki. `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, `RESEND_API_KEY` in `TURNSTILE_SECRET_KEY` ne smejo imeti predpone `VITE_`.

## 8. Preverjanje in objava

Najprej naredite suhi preizkus:

```bash
pnpm deploy:cloudflare:dry-run
```

Nato objavite:

```bash
pnpm deploy:cloudflare
```

Po objavi v Cloudflare povežite lastno domeno in preverite, da se ujema z `TURNSTILE_EXPECTED_HOSTNAME` ter domeno v nastavitvah Turnstile.

## Zaščita pred zlorabo

Ustvarjanje poročila ima dve neodvisni zaščiti pred Gemini klicem:

1. Cloudflare Turnstile preveri, da zahteve ne ustvarja preprost avtomatiziran odjemalec. Žeton se preveri izključno na strežniku, skupaj z akcijo in pričakovanim gostiteljem.
2. Supabase atomsko dovoli največ nastavljeno število poročil na zgoščen IP v eni uri. Privzeto je 5, dovoljen konfiguracijski razpon pa 1–20.

Poleg tega server funkcija sprejme samo pričakovana polja, omeji dolžino vseh podatkov in zavrne zahteve z drugega izvora.

## Ročni prenos v Lovable

Če datoteke kopirate ročno, zamenjajte vse datoteke iz arhiva sprememb, dodajte nove in izbrišite datoteke iz `CLOUDFLARE_DELETED_FILES.txt`. Nato obvezno uporabite priložena `package.json`, `pnpm-lock.yaml` in `bun.lock`; zaklepni datoteki sta posodobljeni zaradi odstranitve Lovable AI SDK-ja in dodatka Wranglerja.
