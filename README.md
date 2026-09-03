# Sindikat Roleplay — Next.js rebuild

Potpun port javnog sajta i admin panela sa Astro-a na **Next.js App Router + React + TypeScript**.

## Stack

- Next.js 16 / React 19 / TypeScript
- App Router i React Server Components
- `better-sqlite3` za postojeći katalog paketa, korisnike, sesije i audit log
- `sharp` za admin upload i generisanje AVIF/WebP/JPG derivata
- Vanilla CSS design system bez Tailwind zavisnosti

## Pokretanje

```powershell
npm install
npm run dev
```

Otvori `http://localhost:3000`.

> **Windows napomena:** projekat ima `.npmrc` sa `ignore-scripts=true`, pa običan `npm install` radi bez Visual Studio-a — `better-sqlite3` isporučuje gotov `prebuilds/win32-x64.node` binarnik koji se koristi u runtime-u, a nijedan paket u projektu ne zahteva install skripte. Ako `.npmrc` ikad obrišeš, ekvivalent je `npm install --ignore-scripts`. Potreban je Node 22+. Ako pre ovoga postoji polomljen `node_modules` od pokušaja sa node-gyp greškom, prvo ga obriši.

Produkcija:

```powershell
npm run build
npm run start
```

## Admin

Admin je na `/admin`.

Migrirani `data/sindikat.db` zadržava postojeći admin nalog i pakete, ali su stare web sesije namerno uklonjene. `data/secret.key` se generiše ponovo na prvom pokretanju i ne treba ga commitovati.

Kreiranje ili reset admin naloga:

```powershell
npm run admin:user -- admin
```

Za ručni unos lozinke:

```powershell
npm run admin:user -- admin --lozinka
```

Lista naloga:

```powershell
npm run admin:user -- --lista
```

## Podaci

Podrazumevana lokacija je `./data`:

- `data/sindikat.db` — SQLite baza
- `data/secret.key` — lokalni session/CSRF ključ, generiše se automatski
- `data/uploads/` — uploadovane slike paketa

Za produkciju možeš postaviti `SINDIKAT_DATA_DIR` na trajni direktorijum van projekta (vidi `.env.example`).

> **Bezbednosna napomena:** `data/sindikat.db` je ranije bio commitovan u javni GitHub repo, zajedno sa hash-om admin lozinke. `.gitignore` sada isključuje bazu, ključ i upload fajlove iz repo-a — ali stari hash treba tretirati kao kompromitovan: promeni admin lozinku (`npm run admin:user -- admin`) i ukloni bazu iz git istorije ako repo ostaje javan.

## Arhitektura

```text
app/
  (site)/                 javne stranice
  admin/                  admin panel + server actions
  api/status/             FiveM live status
  api/paketi/             javni JSON kataloga
  uploads/[filename]/     bezbedno serviranje generisanih upload fajlova
components/               React UI komponente
lib/
  data/                    statički sadržaj i konfiguracija
  auth.ts                  session + CSRF + login throttle
  db.ts                    SQLite handle + audit
  packages.ts              package repository
  images.ts                upload/resize/re-encode
  status.ts                Cfx/FiveM status
public/images/             originalni SindikatRP asseti
data/                      persistent runtime data
ops/admin-user.mjs         CLI za admin naloge
```

## Šta je promenjeno u dizajnu

- city fotografija je centralni vizuelni identitet umesto HUD/scanline efekata
- veliki, čist hero sa jasnim CTA-ovima i live server karticom
- Apple-like spacing, blur/surface hijerarhija i sistemska tipografija
- frakcije su vizuelne editorial kartice, ne horizontalni gimmick rail
- grad je jednostavan interaktivni showcase sa četiri distrikta
- arhiva i paketi su modularne grid komponente
- mobile navigacija i sve sekcije su full responsive
- admin je potpuno odvojen vizuelni sistem, namenjen brzom radu a ne cosplay-u terminala

## Napomena za deploy

Aplikacija koristi lokalni SQLite i lokalne upload fajlove, pa je namenjena Node serveru/VPS-u sa persistentnim diskom. Za serverless deploy bez persistentnog filesystem-a baza i upload storage treba da se prebace na spoljne servise.
