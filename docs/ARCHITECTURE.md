# Architecture: Legal History Hub

## System Overview

```
Google Sheets (Metadata CMS)
    ↓ Sheets API / manual CSV export
Static JSON (data/projects.json)
    ↓
Frontend (HTML/CSS/JavaScript)
    ↓
GitHub Pages (Hosting)
```

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| CMS | Google Sheets + Sheets API | Familiar to researchers, free, collaborative, versioned |
| Data | Static JSON in repo | No backend needed, fast, cacheable |
| Frontend | Vanilla JavaScript | No build step, teachable, maintainable by non-devs |
| Styling | Bootstrap 5 | Responsive grid, accessible components, well-documented |
| Icons | Bootstrap Icons | Consistent with Bootstrap |
| Hosting | GitHub Pages | Free, git-integrated, HTTPS |
| Editor | VS Code + Claude Code Extension | AI-assisted development workflow |

## Data Flow

1. Researchers edit project metadata in Google Sheets
2. Export: Sheets API call or manual CSV download
3. CSV → JSON transformation (script or manual)
4. `data/projects.json` committed to repo
5. Frontend loads JSON at runtime via `fetch()`
6. Client-side filtering, search, sorting
7. GitHub Pages serves static files

## File Structure

```
legal-history-hub/
├── index.html              # Main page
├── css/
│   └── style.css           # Custom styles (extends Bootstrap)
├── js/
│   ├── app.js              # Core application logic
│   └── i18n.js             # Internationalization
├── data/
│   ├── projects.csv        # Source data (editable)
│   └── projects.json       # Runtime data (generated from CSV)
├── docs/                   # Promptotyping Documents
│   ├── INDEX.md
│   ├── RESEARCH.md
│   ├── DATA-MODEL.md
│   ├── DESIGN.md
│   ├── ARCHITECTURE.md
│   └── JOURNAL.md
├── tutorial/               # Promptotyping lessons for MPIeR team
└── CLAUDE.md               # Project instructions for Claude Code
```

## Key Decisions

| Decision | Choice | Alternatives Considered | Rationale |
|----------|--------|------------------------|-----------|
| No framework | Vanilla JS | React, Vue, Svelte | Teachability > DX; no build step; Kerstin/Polina maintain it |
| Client-side filtering | JS filter/search | Server-side, Algolia | Static hosting constraint; dataset small enough (<100 projects) |
| Bootstrap 5 | Yes | Tailwind, custom CSS | Documentation quality; familiar to beginners; accessible defaults |
| Single JSON file | Yes | Multiple files, API | Simplicity; one fetch; dataset small |
| Modal for details | Current impl. | Dedicated pages | Fewer files; faster; revisit if SEO requires individual URLs |

## Constraints

- No server-side code (GitHub Pages = static only)
- No build tools required (Kerstin/Polina must be able to edit and deploy)
- Dataset fits in memory (<100 projects, ~50KB JSON)
- Must work offline after initial load (PWA optional)

## SEO Strategy

- JSON-LD structured data per project (see DATA-MODEL.md → Standards Mapping)
- `<meta>` tags for title/description per language
- Semantic HTML (`<article>`, `<nav>`, `<main>`)
- If modal → no individual project URLs → SEO trade-off (acceptable for discovery layer)
