# Journal: Tutorial Website

Chronological log of decisions, milestones, and dead ends.

## 2026-03-02 – Phase 1: Preparation gestartet

**Kontext:** Tutorial-Website ist die zweite Komponente des LHB-Projekts (neben dem Hub). Drei Funktionen: Nachschlagewerk, Selbstlernpfad, Prozessdokumentation. Zielgruppe: Kerstin und Polina (keine technischen Vorkenntnisse).

**Recherche durchgeführt:**
- Framework-Vergleich: Docsify vs. MkDocs vs. mdBook vs. Docusaurus vs. Vanilla vs. Eleventy vs. Pandoc
- UX-Patterns für Tutorial-Websites (Navigation, Lesson-Struktur, Callouts, Code-Beispiele)
- Role Models: Programming Historian, Carpentries, Django Girls, MDN Learn, DHRIFT, dariahTeach, Docusaurus

**Entscheidung: Docsify**
- Zero Build Step – Kerstin kann Lektionen auf GitHub.com editieren
- Markdown-native, eingebaute Suche, Subfolder-Deployment
- Trade-off: schwache SEO (irrelevant für internes Tutorial)
- Fallback: Migration zu MkDocs bei Bedarf (Markdown-Files 1:1 übertragbar)

**Docs erstellt:** INDEX.md, RESEARCH.md, REQUIREMENTS.md, DESIGN.md, JOURNAL.md

**CLAUDE.md aktualisiert:** Verweis auf tutorial/docs/INDEX.md

## 2026-03-02 – Content-Mapping und Glossar-Asset

**Neue Inputs von Christopher:**
1. **Lektion 02 = WS1-Inhalte** – GenAI + Prompt/Context Engineering, basierend auf den 55 Workshop-Slides
2. **Glossar existiert bereits** – chpollin/llmdh (https://github.com/chpollin/llmdh/tree/main/glossary): 71+ Einträge, DE/EN, mit Difficulty Levels, Kategorien, Suche, eigenständiger HTML/JS/CSS-Oberfläche

**Entscheidung: Glossar-Integration → Option B**
- Docsify-Seite + JS-Widget aus llmdh (Suche, Filter, Difficulty Levels, DE/EN)
- Fallback: Option C (statisches Markdown) wenn Integration zu komplex

**Content Plan angepasst:** Lektion 02 jetzt GenAI (vorher Web-Grundlagen), weil WS1 bereits stattgefunden hat und das Material vorliegt.

**Nächste Schritte:**
- ~~Docsify Setup in `tutorial/` (index.html, _sidebar.md, .nojekyll)~~ Erledigt
- ~~Bestehende Lektion 01 integrieren~~ Erledigt
- ~~Glossar-Integration klären (Option A/B/C)~~ Option B entschieden
- ~~Lektion 01 schreiben (basierend auf WS1-Slides)~~ Erledigt

## 2026-03-02 – Docsify Setup und Debugging

**Docsify implementiert:** index.html, _sidebar.md, README.md, .nojekyll, _404.md, glossar.md (Platzhalter mit 20+ Begriffen).

**Debugging:** Drei Runden Console-Error-Fixing:
1. 404-Fehler für fehlende Dateien (Platzhalter erstellt, Alias für slides/_sidebar.md)
2. CORS-Fehler auf `readme.md/` – Ursache: Search-Plugin interpretierte README.md als URL-Schema. Fix: explizite `search.paths` statt Auto-Discovery
3. Favicon 404 – harmlos, nicht gefixt

**Plugins aktiv:** docsify-search, docsify-copy-code, docsify-pagination, docsify-themeable

## 2026-03-02 – Nummerierung getauscht und Lektion 1 geschrieben

**Nummerierung:** GenAI Basics ist jetzt Lektion 1, Preparation ist Lektion 2. Begründung: GenAI-Grundlagen sind Voraussetzung für alles Weitere; die Preparation-Lektion setzt dieses Verständnis voraus.

**Dateien umbenannt:**
- `01-genai-und-prompt-engineering.md` (vorher 02)
- `02-preparation-und-role-models.md` (vorher 01)
- Alle Querverweise aktualisiert: _sidebar.md, index.html, README.md, ws1-genai-fundamentals.md, REQUIREMENTS.md, DESIGN.md

**Lektion 1 vollständig geschrieben** auf Basis der WS1-Slides (48 Folien, [Google Slides](https://docs.google.com/presentation/d/1Jy3BvZ334gw_-B_5wEwoItzlZaQDsDtFfx0HCUOaWGE)). Destilliert für nicht-technisches Publikum. Themen: Next Token Prediction, Tokenisierung, Pre-/Post-Training, Embeddings (Deep Dive), Sycophancy, Konfabulation, Context Window, Context Rot, Prompt Engineering (CoT, Few-Shot, System Prompts), Context Engineering, Promptotyping-Einführung.

**Schreibstil-Regel:** Keine Em-Dashes (—) oder Doppel-Bindestriche (--). Gedankenstriche als En-Dash mit Leerzeichen (–) sind okay.
