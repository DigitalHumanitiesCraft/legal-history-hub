# CLAUDE.md — Legal History Hub

## What This Is

Metadata portal for research projects of Max-Planck-Institut für Rechtsgeschichte und Rechtstheorie (Abt. II). Discovery layer that **links to** external projects; no content integration.

**Client:** Kerstin Willburth (MPIeR Abt. II) | **Developer:** DHCraft OG (Christopher Pollin, Christian Steiner)

## What this repository holds

**Only the Empowerment component**: 6 workshops + tutorial website to enable Kerstin and Polina to maintain and extend the Hub independently using AI tools. The tutorial website lives in `tutorial/`, workshop slides and landing pages in `tutorial/slides/`.

**The Hub application is not here.** It is developed in the institute's own repository (Vanilla JS + Bootstrap 5, build pipeline against the live Google Sheet, GitHub Pages). The flat-model prototype that used to sit in this root (`index.html`, `css/`, `js/`, `data/`) was a workshop-phase learning artifact and was removed on 2026-08-14; it stays reachable through git history (last state `53aa600`). Do not rebuild it here: anything about the running Hub belongs in the institute repository.

## Methodology

This project uses **Promptotyping** (invoke with `/promptotyping`). Documents as source of truth, code as disposable artifact. Critical Expert in the Loop.

## Context Documents

Load selectively per task. Don't load everything at once (Context Rot).

- **Hub docs:** see [docs/INDEX.md](docs/INDEX.md) for overview and selective loading guide
- **Tutorial docs:** see [tutorial/docs/INDEX.md](tutorial/docs/INDEX.md) for overview and selective loading guide
- **Contract/scope:** [27_25 - Legal History Hub.md](27_25%20-%20Legal%20History%20Hub.md)

## Tech Stack (this repository)

| Layer | Choice | Why |
|-------|--------|-----|
| Tutorial | Docsify (Markdown rendered in the browser) | No build step, Kerstin and Polina edit Markdown and `git push` |
| Slides | Marp Markdown, exported to PDF and self-contained HTML | Same source for preview and handout |
| Tests | `tutorial/tests/` (static link check + Playwright crawler) | Broken links are the failure mode a Docsify site has |
| Hosting | GitHub Pages | Free, git-integrated, HTTPS |

The Hub's own stack (Google Sheets as CMS, the 9-tab hybrid model, the Node build pipeline) is documented in the institute repository. What survives here is the **modelling history**: `docs/` records how the hybrid model was chosen, and the tutorial teaches it.

## Data Model (summary)

Nine tabs in one Google Sheet: `core` (wide, one row per project) + five long junction tabs (`people`, `institutions`, `subjects`, `regions`, `keywords`) + `vocabulary` (closed enums) + `authority` (normdatei with ORCID/GND/ROR/Wikidata) + `_helpers` (derived FILTER views for dropdown binding). Full schema in [docs/DATA-MODEL.md](docs/DATA-MODEL.md); didactic explanation in [tutorial/03-datenmodell-hybrid.md](tutorial/03-datenmodell-hybrid.md).

## Languages

UI and content: DE, EN, ES. Singleton multilingual fields on `core` use `_de` / `_en` / `_es` suffixes. Entity display labels (subjects, regions, keywords) carry their translations in the `authority` tab.

## Project Status

| Phase | Content | Status |
|-------|---------|--------|
| 1 (Month 1-2) | Requirements, metadata model | Done (flat v1, then the hybrid model) |
| 2 (Month 2-4) | Grundlagen-Workshops 1-3 | WS1 (04.03.2026), WS2 (13.03.2026), WS3 (model prepared 15.04.2026) done |
| 3 (Month 3-6) | Hub prototype | Rebuilt in the institute repository; not tracked here |
| 4-7 | Advanced workshops, polish, launch | WS4 and WS5 published; **WS6 ("Eigene Projekte umsetzen") outstanding** |

Lessons 4 to 6 are still missing from the tutorial: the sidebar jumps from lesson 3 to lesson 7.

## Writing style

Keine Em-Dashes (—), keine Doppel-Bindestriche (--). Deutsche Gedankenstriche als En-Dash mit Leerzeichen (–) sind ok. Sonst Doppelpunkte, Semikolons, Punkte oder Satz umformulieren. Gilt für Lektionen, Journale, Commit-Messages und Code-Kommentare.

## File Structure

```
├── index.html                # Landing page: points at tutorial and workshops
├── docs/                     # Promptotyping Documents from the modelling phase (LLM context)
│   └── INDEX.md              # Start here for that history
├── tutorial/                 # Tutorial website (Docsify)
│   ├── index.html            # Docsify loader
│   ├── _sidebar.md           # Navigation
│   ├── 01-*.md, 02-*.md ...  # Lessons (numbered, Markdown)
│   ├── slides/               # Workshop landing pages + PDFs
│   └── docs/                 # Promptotyping Documents for the tutorial
│       └── INDEX.md          # Start here for tutorial context
└── CLAUDE.md                 # This file
```

## Constraints

- No server-side code (GitHub Pages = static only)
- No build step for the tutorial: Kerstin and Polina edit Markdown and deploy via `git push`
- Kerstin and Polina have **no technical background**: all docs, lessons and slides must be accessible to non-developers
- Whatever the lessons claim about the Hub must match the institute repository, not this one. Verify before writing, do not reconstruct from `docs/`, which is frozen at the modelling phase.

## Development Commands

Run from the repository root:

```bash
node tutorial/tests/check-links.js       # static: every Markdown/HTML link resolves, no network
node tutorial/tests/check-live-links.mjs # live crawl of the deployed site (Playwright, slow)
```
