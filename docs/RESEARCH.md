# Domain Knowledge: Legal History Hub

## Institution Context

**Client:** Max-Planck-Institut für Rechtsgeschichte und Rechtstheorie, Abteilung II
**Location:** Frankfurt am Main, Germany
**Developer:** Digital Humanities Craft OG (Christopher Pollin, Christian Steiner)
**Contract:** Offer 27/25, 50.000 EUR, 12 months

## Project Purpose

A **metadata-based portal** serving as the central entry point to distributed research projects of Abteilung II. The hub **links to** external projects rather than integrating their content. It is a discovery layer, not a repository.

The payoff for users is not the Hub's own pages but the outbound links: to the external project sites, and (via the `authority` layer) to ORCID profiles, ROR institution records, GND entries, and Wikidata concepts. Every person, institution, subject, and region on a project page can be a portal to the broader knowledge graph.

## Core Requirements

### Functional
- Overview page with project cards
- Filtering by type, status, subject, content language, period (max 5 dimensions)
- Full-text search within metadata
- Detail pages / modals per project with linked entities (ORCID, ROR, GND, Wikidata)
- Multilingual UI: German (DE), English (EN), Spanish (ES)
- Multilingual content derived from sheet metadata (title, description, period labels)
- Responsive / mobile-first design

### Non-Functional
- No backend server required (static hosting on GitHub Pages)
- Low maintenance burden for non-technical staff
- Accessible (WCAG 2.1)
- SEO-optimized with Schema.org / JSON-LD structured data including persistent identifiers

## Content Management

**Google Sheets as CMS, nine-tab hybrid model:**

- Familiar interface for researchers
- Free Sheets API access
- Collaborative editing with version history
- Tables feature (shipped May 2024) gives structured references, auto-expansion, filter views, grouped views
- Nine tabs: one `core` (wide), five long tabs (`people`, `institutions`, `subjects`, `regions`, `keywords`), plus `vocabulary` (closed enums), `authority` (normdatei with ORCID/GND/ROR/Wikidata), and `_helpers` (derived FILTER views for dropdown binding)

See `DATA-MODEL.md` for the full schema.

**Data Flow:**
```
Researchers edit Google Sheet (9 tabs)
    ↓
Sheets API (or manual CSV export per tab)
    ↓
data/sheets/*.csv (committed)
    ↓
Build step in Claude Code (join + enrich + validate)
    ↓
Static data/projects.json in repository
    ↓
Frontend reads JSON at runtime
    ↓
GitHub Pages serves static site
```

## Metadata Scope

Only **open-access / publicly available data** is managed in the Hub. The sheet contains:

- Project titles (multilingual)
- Descriptions (multilingual)
- Temporal coverage (year range + human-readable period labels)
- Project type, status, funding
- Content languages, media types
- Thematic subjects, geographic regions, free keywords
- People with roles (PI, researcher, coordinator, student assistant)
- Institutions with relations (host, funder, partner, publisher)
- Persistent identifiers in `authority`: ORCID (persons), GND (persons, institutions, subjects), ROR (institutions), Wikidata (subjects, regions, keywords)
- Links to external project sites
- Related projects

**NOT included:**
- Full project content (the Hub links, it does not ingest)
- Proprietary or restricted data
- Automatic translation of external project content

## Target Audience

- Researchers in legal history
- Students
- General public interested in legal history research
- Other Digital Humanities practitioners
- Librarians and data stewards (indirectly, via PIDs and Schema.org markup)

## Languages

| Code | Language | Role |
|------|----------|------|
| DE | German | Primary interface, most content |
| EN | English | International access |
| ES | Spanish | Reflects research focus areas (colonial law, Hispanoamerica, Iberian Peninsula) |

## Success Criteria

1. Researchers can add or update projects via the Google Sheet (including new persons, institutions, subjects in `authority`) without developer assistance.
2. Editors ask Claude Code to run the build (`scripts/build-hub-data.py`) and get a new enriched `projects.json` ready to commit.
3. Users can discover relevant projects through filtering and search.
4. Every linked person, institution, subject carries a PID on the detail view, making the Hub a navigable node in the scholarly knowledge graph.
5. Site loads fast on mobile devices.
6. Metadata is machine-readable via Schema.org / JSON-LD with PIDs inlined.
7. Site is maintainable by MPIeR staff (Kerstin, Polina) after project completion, end-to-end (sheet edit → build → commit → push → live).
