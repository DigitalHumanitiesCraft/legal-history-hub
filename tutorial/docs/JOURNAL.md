# Journal: Tutorial Website

Chronological log of decisions, milestones, and dead ends. Companion to `docs/JOURNAL.md` (which tracks the Hub itself).

## 2026-03-02 – Phase 1: Preparation gestartet

**Kontext:** Tutorial-Website ist die zweite Komponente des LHB-Projekts (neben dem Hub). Drei Funktionen: Nachschlagewerk, Selbstlernpfad, Prozessdokumentation. Zielgruppe: Kerstin und Polina (keine technischen Vorkenntnisse).

**Recherche durchgeführt:**
- Framework-Vergleich: Docsify vs. MkDocs vs. mdBook vs. Docusaurus vs. Vanilla vs. Eleventy vs. Pandoc
- UX-Patterns für Tutorial-Websites (Navigation, Lesson-Struktur, Callouts, Code-Beispiele)
- Role Models: Programming Historian, Carpentries, Django Girls, MDN Learn, DHRIFT, dariahTeach, Docusaurus

**Entscheidung: Docsify**
- Zero Build Step: Kerstin kann Lektionen auf GitHub.com editieren
- Markdown-native, eingebaute Suche, Subfolder-Deployment
- Trade-off: schwache SEO (irrelevant für internes Tutorial)
- Fallback: Migration zu MkDocs bei Bedarf (Markdown-Files 1:1 übertragbar)

**Docs erstellt:** INDEX.md, RESEARCH.md, REQUIREMENTS.md, DESIGN.md, JOURNAL.md

**CLAUDE.md aktualisiert:** Verweis auf tutorial/docs/INDEX.md

## 2026-03-02 – Content-Mapping und Glossar-Asset

**Neue Inputs von Christopher:**
1. **Lektion 02 = WS1-Inhalte**: GenAI + Prompt/Context Engineering, basierend auf den 55 Workshop-Slides
2. **Glossar existiert bereits**: chpollin/llmdh (https://github.com/chpollin/llmdh/tree/main/glossary) mit 71+ Einträgen, DE/EN, Difficulty Levels, Kategorien, Suche, eigenständiger HTML/JS/CSS-Oberfläche

**Entscheidung zur Glossar-Integration: später Option C (native Docsify Markdown)**
Zunächst war Option B (Docsify-Seite + JS-Widget) geplant, umgesetzt wurde am Ende Option C. Docsify generiert Heading-IDs automatisch, die eingebaute Suche indiziert die Glossar-Einträge, und Kerstin kann den Glossar direkt im GitHub-Editor erweitern. Upgrade auf Option B bleibt möglich.

**Content Plan angepasst:** Lektion 02 jetzt GenAI (vorher Web-Grundlagen), weil WS1 bereits stattgefunden hatte und das Material vorlag.

## 2026-03-02 – Docsify Setup und Debugging

**Docsify implementiert:** index.html, _sidebar.md, README.md, .nojekyll, _404.md, glossar.md (Platzhalter mit 20+ Begriffen).

**Debugging:** Drei Runden Console-Error-Fixing:
1. 404-Fehler für fehlende Dateien (Platzhalter erstellt, Alias für slides/_sidebar.md)
2. CORS-Fehler auf `readme.md/`: Ursache war das Search-Plugin, das README.md als URL-Schema interpretierte. Fix: explizite `search.paths` statt Auto-Discovery
3. Favicon 404: harmlos, nicht gefixt

**Plugins aktiv:** docsify-search, docsify-copy-code, docsify-pagination, docsify-themeable

## 2026-03-02 – Nummerierung getauscht und Lektion 1 geschrieben

**Nummerierung:** GenAI Basics ist jetzt Lektion 1, Preparation ist Lektion 2. Begründung: GenAI-Grundlagen sind Voraussetzung für alles Weitere; die Preparation-Lektion setzt dieses Verständnis voraus.

**Dateien umbenannt:**
- `01-genai-und-prompt-engineering.md` (vorher 02)
- `02-preparation-und-role-models.md` (vorher 01)
- Alle Querverweise aktualisiert: _sidebar.md, index.html, README.md, ws1-genai-fundamentals.md, REQUIREMENTS.md, DESIGN.md

**Lektion 1 vollständig geschrieben** auf Basis der WS1-Slides (48 Folien, [Google Slides](https://docs.google.com/presentation/d/1Jy3BvZ334gw_-B_5wEwoItzlZaQDsDtFfx0HCUOaWGE)). Destilliert für nicht-technisches Publikum. Themen: Next Token Prediction, Tokenisierung, Pre-/Post-Training, Embeddings (Deep Dive), Sycophancy, Konfabulation, Context Window, Context Rot, Prompt Engineering (CoT, Few-Shot, System Prompts), Context Engineering, Promptotyping-Einführung.

**Schreibstil-Regel:** Keine Em-Dashes (—) oder Doppel-Bindestriche (--). Gedankenstriche als En-Dash mit Leerzeichen (–) sind ok.

## 2026-03-12 – WS2 Landing Page und Glossar-Erweiterung

**WS2 stattgefunden:** 13.03.2026, Christian Steiner, 4 Stunden Remote. Themen: Web-Grundlagen, Git, Vibe/Agentic Coding, Promptotyping-Methodik vertieft, Claude Code 101, Hands-On mit MoMA-Dataset.

**Landing Page erstellt:** `tutorial/slides/ws2-web-promptotyping-claude-code.md` analog zu WS1. 14 Themen extrahiert aus 43 Slides, PDF-Link, Verwandte-Lektionen-Verweise. In Sidebar und Docsify-Suchindex integriert.

**Glossar erweitert:** 14 neue Einträge aus WS2-Material:
- Web-Grundlagen: Client/Server, Frontend/Backend, HTTP/HTTPS, URL
- Git-Konzepte: Branch, Clone, Commit, Pull Request
- Coding-Paradigmen: Agentic Coding, Vibe Coding, Computational Thinking
- Tooling: CLAUDE.md, VS Code
- Promptotyping: Distillation

**Querverweise ergänzt:** Neue und bestehende Einträge untereinander verlinkt (z.B. Branch → Git, Pull Request; Frontend/Backend → HTML, CSS, JavaScript; Context Engineering → Distillation).

**Alphabetische Sortierung korrigiert:** C-Einträge waren falsch sortiert (Client/Server stand nach Critical Expert statt davor).

**Glossar-Stand:** ~49 Begriffe (A-V), deckt WS1 + WS2 vollständig ab.

## 2026-04-15 – Lektion 3 und WS3-Vorbereitung

**Kontext:** Zwischen WS2 und WS3 hat Polina ein eigenes Datenmodell-Experiment gebaut: 6 relationale Tabellen, Foreign Keys, Lookup-Vokabulare mit GND/ORCID/ROR/Wikidata, Pipe-Notation für Personenrollen. Sauber 3NF, FAIR-konform. Polinas Experiment wurde nicht als finales Modell übernommen, war aber der Anlass, drei Formate (flat, fully relational, hybrid) nebeneinander zu diskutieren.

**Entscheidung: Hybrid-Datenmodell für den Hub.** Wide für Singletons (`core`), long für Many-to-Many-Relationen (`people`, `institutions`, `subjects`, `regions`, `keywords`), plus `vocabulary` / `authority` / `_helpers`. Rationale und volle Schema-Beschreibung in `docs/DATA-MODEL.md`.

**Lektion 3 geschrieben:** `tutorial/03-datenmodell-hybrid.md`, ~25 min Lesedauer. Erklärt in plain German: warum wide und long nebeneinander, 1NF und Normalisierung (ohne Dogma), junction tables, foreign keys, singletons, many-to-many, die drei Dropdown-Stufen (`vocabulary` = Vorschrift, `authority` = Nachschlagewerk, `_helpers` = Brille), FAIR-Prinzipien, persistente Identifikatoren (ORCID, GND, ROR, Wikidata), derived views mit FILTER-Spill-Ranges. Am Ende: Wer pflegt was, wenn etwas fehlt (Fallunterscheidungen für neue Person / Rolle / Keyword / Thema / Region / Status). Abschließendes Glossar aller Fachbegriffe auf einen Blick.

**Lektion 3 in Sidebar eingehängt**, vor "Workshops". Committet als 4ae04c1.

**Nummerierung korrigiert (Content-Plan):** Lektion 3 ist jetzt "Das Datenmodell verstehen", Lektion 4 wird "Google Sheets als CMS" (WS3-Hands-On). Reihenfolge rational: Lektion 3 ist konzeptuell und ohne geöffnetes Sheet lesbar, Lektion 4 ist hands-on und setzt Lektion 3 voraus. REQUIREMENTS.md entsprechend aktualisiert.

**WS3-Planung im Repo-Root:** `WS3-Planung.md` entworfen: 3 Stunden Remote, Christian Steiner, Blöcke Wide/Long-Theorie → Claude-Code-Integration → Google Sheets als CMS einrichten → Skills/Plugins → Zusammenfassung. Zentrale didaktische Kniffe: Polinas Experiment als Ausgangspunkt zeigen, Gemini-Halluzination (XLOOKUP in 5 Tabs, Self-Report vs. Realität) als Lehrstück für Verifikation, bewusste Trennung zwischen atomaren Gemini-Operationen (funktionieren) und komplexen Mehrschritt-Mutationen (halluzinieren).

**Gemini-vs-Claude-Experiment dokumentiert:** In der Vorbereitung haben beide KIs parallel am Sheet gearbeitet. Gemini-in-Sheets ist stark bei atomaren Menü-Operationen (leere Zeilen löschen, Einzelwerte-Dropdowns mit Farb-Chips) und schwach bei komplexen strukturellen Mutationen mit Formel-Eingabe. Gemini kann darüber hinaus **keine Dropdowns aus Bereich** bauen (strukturelles Limit, von Google dokumentiert) und operiert nur auf einer Tabelle auf einmal. Das war der Grund, die vocabulary-/authority-gebundenen Dropdowns manuell via `_helpers`-Spill-Ranges zu bauen. Claude Code übernahm die Reparaturen per Chrome-Automation.

**Aufräumarbeit im Hub-Doc-Set:** Die Hub-Docs (`docs/DATA-MODEL.md`, `docs/JOURNAL.md`, `docs/DESIGN.md`, `docs/ARCHITECTURE.md`, `docs/RESEARCH.md`, `docs/INDEX.md`) wurden gleichzeitig auf das Hybrid-Modell aktualisiert. Bis heute trugen sie noch das flache v1-Schema. Ohne den Umbau wäre jede Claude-Code-Session, die diese Docs als Kontext lädt, am realen Modell vorbeigebaut. Diese Tutorial-Docs haben ebenfalls einen Pass bekommen: REQUIREMENTS.md (Content-Plan aktualisiert), DESIGN.md (Sidebar-Beispiel aktualisiert), und dieses Journal.

**Schreibstil-Regel (Wiederholung):** Keine Em-Dashes (—), keine Doppel-Bindestriche (--). En-Dashes mit Leerzeichen (–) sind ok, sonst Doppelpunkte oder Semikolons. Gilt auch für die promptotyping docs, nicht nur für die Lektionen.

## 2026-04-25 – Tutorial-Tests konsolidiert, vier Live-404er gefixt

**Summary:** Christian meldete weiterhin broken Links auf der Live-Seite, obwohl die lokalen Tests grün waren. Diagnose ergab eine echte Lücke: `check-links.js` und `check-assets-http.js` deckten Docsifys Hash-Router-Verhalten auf GitHub Pages nicht ab. Ergebnis: Test-Set auf zwei Files reduziert (statisch + live), vier `../`-Links in den Slide-Decks repariert, Live-Crawler bestätigt grün.

**Decisions:**
- **Zwei Test-Files statt drei.** `check-links.js` (statisch, <1s, zero deps) bleibt als erste Verteidigungslinie; neuer `check-live-links.mjs` (Playwright, 10–30s) als Smoke-Test gegen die deployte Seite. `check-assets-http.js` gelöscht – seine Markdown-Asset-Falle wandert als reine Regex in `check-links.js`, der HTTP-HEAD doppelte nur `fs.existsSync`. `check-slide-overflow.mjs` parallel im selben Schritt entfernt, weil im Skill `/marp-slides` jetzt integriert.
- **`../`-Warning auf ERROR upgraden** statt nur warnen. Live-Verifikation hat bestätigt: aus `slides/ws*-…md` bricht der Hash `#/../X.md` aus `tutorial/` raus, browser-resolvter Fetch landet eine Ebene zu hoch und 404t. Statisch nicht reproduzierbar (Filesystem collapst `..` korrekt), darum war es vorher nur Warning.
- **Bild-Referenzen in den Static-Check aufgenommen** (vorher explizit ausgeschlossen via Lookbehind). 170 statt 161 Links geprüft.
- **`tutorial/docs/TESTING.md` als kanonische Stelle** für "welcher Test wann" – inkl. Begründung, warum nicht alles in einem File.

**Dead ends:** Keine. Der Live-Crawler war beim ersten Lauf schon belastbar; Custom-Domain-Resolving (`dhcraft.org/legal-history-hub/tutorial/`) statt der erwarteten `*.github.io`-URL kam unerwartet, hat das Diagnoseergebnis aber nicht geändert.

**Phase:** 4 (Implementation). Alle Tutorial-Promptotyping-Docs aktuell. Neuer Eintrag in `INDEX.md` für TESTING.md.

**Open issues:**
- Externe HTTP-URLs (Wikipedia, GitHub-Issues, Google-Slides-Links) werden weder statisch noch live geprüft. Wenn so eine URL rotted, merkt das niemand bis Kerstin oder Polina drauf klickt. Lo-fi-Fix wäre ein periodischer External-Link-Scan; bisher kein konkreter Schmerzpunkt.
- Case-Sensitivität (Win-FS ↔ Linux GH-Pages) wird vom Static-Check toleriert, vom Live-Crawler aber implizit gefangen. Sollte in der Praxis reichen.
- `_navbar.md` existiert noch nicht; sobald sie kommt, muss sie ebenfalls in den Static-Walk fallen (tut sie automatisch, nur Mahnzettel).

**Next steps:**
1. WS3-Durchführungstermin mit Kerstin und Polina fixieren (Material liegt seit 15.04. fertig).
2. WS4-Inhalte aus `tutorial/slides/ws4-claude-infrastruktur.md` zu Slides + Lektion 4 ausarbeiten.
3. Hybrid-Frontend-Rebuild für den Hub (separater Track, nicht Tutorial): aktueller `index.html`/`js/app.js`-Prototyp basiert auf Flat-Model, Hybrid-JSON-Konsumierung steht aus.
4. Hinweis: bei nächstem Push den Live-Crawler routinemässig laufen lassen – der GH-Pages-Deploy dauert ~30s, der Test ~15s, also ein 1-Minuten-Sanity-Check.

**Commits dieser Session:**
- `7aad775` Consolidate tutorial tests: static check-links + live Playwright crawler
- `768040f` Fix four broken slide-to-lesson links (../path -> /path)
