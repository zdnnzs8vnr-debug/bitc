# GUSTAVOEURO — Portale Dark-Web / Hacker

Sito **single-page** per il business GUSTAVOEURO: banconote Euro Grade AAA+
e trasferimenti PayPal P2P anonimi. Estetica dark-web/hacker, nessun build step:
apri `index.html` e funziona.

**Tagline:** DAL DARK WEB AL TUO PORTAFOGLIO · EST. 2022

---

## Listino (dentro `index.html`, blocco `PRODUCTS`)

| Taglio | Pezzi | €/pezzo | Totale |
|---|---|---|---|
| 20 EUR | 30 | 8 | 240 |
| 20 EUR | 50 | 7,5 | 375 |
| 20 EUR | 75 | 7 | 525 |
| 20 EUR | 100 | 6,5 | 650 |
| 20 EUR | 150 | 5,8 | 870 |
| 20 EUR | 200 | 5 | 1000 |
| 50 EUR | 30 | 12 | 360 |
| 50 EUR | 50 | 11 | 550 |
| 50 EUR | 75 | 9,5 | 712,50 |
| 50 EUR | 100 | 8,5 | 850 |
| 50 EUR | 150 | 7,8 | 1170 |
| 50 EUR | 200 | 7 | 1400 |

Taglio 10 EUR: su richiesta (foto `note10.png`).

## Transfer PayPal (blocco `PAYPAL`)

120→360 · 150→680 · 180→930 · 220→1570 · 280→2140 · 320→3400 · 380→4800 · 470→5800

## Bonifico istantaneo

IBAN `IT62A0366901600560522253386` — intestatario `GIUSEPPE DI VICO` (+10% gestione).

## Feedback

Chi vuole leggere i feedback va sul canale: https://t.me/+gBf54xWnFapjMmRh

---

## Stack

React 18 + ReactDOM 18 (CDN unpkg, fallback jsdelivr) · Babel standalone ·
Tailwind CDN · hash router scritto a mano · Space Grotesk + JetBrains Mono ·
nessun build step.

## File

**Principali:** `index.html`, `_headers`, `.htaccess`, `404.html`, `.nojekyll`, `robots.txt`
**Protezione:** `_redirects`, `nginx.conf`, `netlify.toml`, `vercel.json`, `Caddyfile`,
`firewall.conf`, `ipset-block.sh`, `sitemap.xml`, `.well-known/security.txt`,
`humans.txt`, `manifest.webmanifest`, `sw.js`, `README.md`

## File da aggiungere (accanto a `index.html`)

`note10.png` (foto 10 EUR) · `qr-sol.png` · `qr-btc.png` · `qr-ltc.png` ·
opzionali `icon-192.png`, `icon-512.png`.
Tutti con fallback automatico: se mancano, il sito non si rompe.

## Personalizzare le foto (10 secondi)

Blocco `const PHOTO = {...}` in cima allo script: `main` = foto unica per taglio,
`gallery` = media mostrati solo in Verifica Qualità. Indirizzi crypto in `COINS`,
contatti in `IDENT`.

## Deploy

- **GitHub Pages:** carica tutto in root → Settings → Pages.
  ⚠️ `_headers`, `_redirects`, `.htaccess` vengono **ignorati**: per header e
  protezione IP metti **Cloudflare in proxy** davanti al dominio.
- **Netlify / Cloudflare Pages / Vercel:** `netlify.toml`, `_headers`, `_redirects`,
  `vercel.json` applicati automaticamente.
- **VPS:** `nginx.conf` + `firewall.conf`, oppure `Caddyfile` (TLS automatico).
  Firewall: `sudo ./ipset-block.sh install && sudo ./ipset-block.sh watch`

© GUSTAVOEURO · dal 2022
