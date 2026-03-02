# CLAUDE.md — Legal History Hub

## What This Is

Metadata portal for research projects of Max-Planck-Institut für Rechtsgeschichte und Rechtstheorie (Abt. II). Discovery layer that **links to** external projects — no content integration.

**Client:** Kerstin Willburth (MPIeR Abt. II) | **Developer:** DHCraft OG (Christopher Pollin, Christian Steiner)

## Two Components

1. **Hub** — the portal itself (static site, GitHub Pages)
2. **Empowerment** — 6 workshops + tutorial website to enable Kerstin/Polina to maintain and extend the Hub independently using AI tools

The tutorial website lives in `tutorial/`. Workshop slides in `tutorial/slides/`.

## Methodology

This project uses **Promptotyping** (invoke with `/promptotyping`). Documents as source of truth, code as disposable artifact. Critical Expert in the Loop.

## Context Documents

Load selectively per task — don't load everything at once (Context Rot).

- **Hub docs:** see [docs/INDEX.md](docs/INDEX.md) for overview and selective loading guide
- **Tutorial docs:** see [tutorial/docs/INDEX.md](tutorial/docs/INDEX.md) for overview and selective loading guide
- **Contract/scope:** [27_25 - Legal History Hub.md](27_25%20-%20Legal%20History%20Hub.md)

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| CMS | Google Sheets + Sheets API | Familiar to researchers, free, collaborative |
| Data | Static JSON in repo (`data/projects.json`) | No backend, fast, cacheable |
| Frontend | Vanilla JavaScript | No build step, teachable, maintainable by non-devs |
| Styling | Bootstrap 5 | Responsive, accessible, well-documented |
| Hosting | GitHub Pages | Free, git-integrated, HTTPS |

## Languages

UI and content: DE, EN, ES. Multilingual fields use `_de`/`_en`/`_es` suffixes in Sheets/CSV.

## Project Status

| Phase | Content | Status |
|-------|---------|--------|
| 1 (Month 1-2) | Requirements, metadata model | Done |
| 2 (Month 2-4) | Grundlagen-Workshops 1-3 | WS1 done (04.03.2026) |
| 3 (Month 3-6) | Hub prototype | Prototype exists |
| 4-7 | Advanced workshops, polish, launch | Pending |

## File Structure

```
├── index.html, css/, js/, data/   # Hub prototype
├── docs/                          # Promptotyping Documents (LLM context)
│   └── INDEX.md                   # Start here for hub context
├── tutorial/                      # Tutorial website (Docsify)
│   ├── index.html                 # Docsify loader
│   ├── _sidebar.md                # Navigation
│   ├── 01-*.md                    # Lessons (numbered, Markdown)
│   ├── slides/                    # Workshop PDFs
│   └── docs/                      # Promptotyping Documents for tutorial
│       └── INDEX.md               # Start here for tutorial context
└── CLAUDE.md                      # This file
```

## Constraints

- No server-side code (GitHub Pages = static only)
- No build tools required (Kerstin/Polina must be able to edit and deploy)
- Dataset fits in memory (<100 projects)
- Kerstin and Polina have **no technical background** — all code, docs, and tutorials must be accessible to non-developers

## Development Commands

*To be added once build tooling is in place.*
