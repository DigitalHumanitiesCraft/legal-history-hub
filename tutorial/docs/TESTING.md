# Tutorial Testing

Zwei Tests in `tutorial/tests/`. Statische Link-Validierung im Code-Review-Loop, Live-Smoke gegen die deployte Seite vor Workshops.

Der Marp-Folien-Overflow-Check lebt nicht hier, sondern im Skill `/marp-slides`.

## Test-Matrix

| Test | Was | Wann | Deps | Laufzeit |
|------|-----|------|------|----------|
| `check-links.js` | Statische Link-Validierung: file existence, Anchor-Slugs, `../`-Falle (Docsify-Hash-Router), Markdown-Asset-Falle (`[x](file.pdf)`), Bilder, HTML `<a>` | bei jedem Edit, vor jedem Commit | nur Node | <1 s |
| `check-live-links.mjs` | Live-Smoke-Test der deployten Seite: Playwright crawlt jede Hash-Route, sammelt 404er auf .md/Asset-Fetches, prüft Docsify-NotFound-Markup | nach Deploy, vor Workshops | Playwright (global) | 10–30 s |

## Aufruf

```bash
# Statisch (immer)
node tutorial/tests/check-links.js

# Live gegen GH Pages (Default-URL ist hardcoded; Override per Argument)
node tutorial/tests/check-live-links.mjs
node tutorial/tests/check-live-links.mjs https://example.org/legal-history-hub/tutorial/
```

## Was wo geprüft wird (Aufgaben-Trennung)

- `check-links.js` ist die **erste Verteidigungslinie**. Schnell, deterministisch, ohne Netz. Catcht 90 % der Fehler beim Schreiben.
- `check-live-links.mjs` ist die **einzige Schicht, die Docsify-Router-Quirks und GitHub-Pages-Realität sieht** (Custom Domain, Case-Sensitivität, Hash-Routing). Statisch nicht reproduzierbar.
- Folien-Overflow ist Teil des Skills `/marp-slides`, weil er ohnehin nur beim Bauen eines Decks ausgelöst wird und dort den Workflow integriert.

## Warum nicht alles in einem File

`check-links.js` ist statisch und schnell. Das ist der USP. Alles in eines zu mergen würde den schnellen Test in den langsamen Playwright-Test reinziehen. Statisch und Live sind unterschiedliche Schichten.

Frühere Datei `check-assets-http.js` (lokaler HTTP-Server für HEAD-Checks) wurde entfernt: ihre Markdown-Asset-Falle ist als reine Regex in `check-links.js` migriert, der HEAD-Check selbst doppelte nur die `fs.existsSync`-Logik bzw. wird vom Live-Test echter abgedeckt.

Frühere Datei `check-slide-overflow.mjs` (Marp-Folien-Overflow per Playwright) wurde in den Skill `/marp-slides` integriert.
