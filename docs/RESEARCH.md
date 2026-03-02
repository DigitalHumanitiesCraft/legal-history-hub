# Domain Knowledge: Legal History Hub

## Institution Context

**Client:** Max-Planck-Institut für Rechtsgeschichte und Rechtstheorie, Abteilung II
**Location:** Frankfurt am Main, Germany
**Developer:** Digital Humanities Craft OG (Christopher Pollin, Christian Steiner)

## Project Purpose

A **metadata-based portal** serving as the central entry point to distributed research projects of Abteilung II. The hub **links to** external projects rather than integrating their content — it is a discovery layer, not a repository.

## Core Requirements

### Functional
- Overview page with project cards
- Filtering by categories, languages, media types (any structured metadata field)
- Full-text search within metadata
- Detail pages per project
- Multilingual UI: German (DE), English (EN), Spanish (ES)
- Multilingual content derived from Sheet metadata
- Responsive/mobile-first design

### Non-Functional
- No backend server required (static hosting)
- Low maintenance burden for non-technical staff
- Accessible (WCAG 2.1)
- SEO-optimized with structured data

## Content Management

**Google Sheets as CMS:**
- Familiar interface for researchers
- Free Sheets API access
- Easy collaborative editing
- Version history built-in

**Data Flow:**
```
Researchers edit Google Sheets
    ↓
Sheets API (or manual export)
    ↓
Static JSON cache in repository
    ↓
Frontend reads JSON at runtime
    ↓
GitHub Pages serves static site
```

## Metadata Scope

Only **open source / publicly available data** will be managed. The hub contains:
- Project titles (multilingual)
- Descriptions (multilingual)
- Categories/tags
- Languages of project content
- Media types (text, database, images, etc.)
- Links to external project sites
- Dates (start, end, publication)
- Contributors/institutions
- Related projects

**NOT included:**
- Full project content
- Proprietary or restricted data
- Automatic translation of external project content

## Target Audience

- Researchers in legal history
- Students
- General public interested in legal history research
- Other Digital Humanities practitioners

## Languages

| Code | Language | Role |
|------|----------|------|
| DE | German | Primary interface, most content |
| EN | English | International access |
| ES | Spanish | Reflects research focus areas |

## Success Criteria

1. Researchers can add/update projects via Google Sheets without developer assistance
2. Users can discover relevant projects through filtering and search
3. Site loads fast on mobile devices
4. Metadata is machine-readable (Schema.org/JSON-LD)
5. Site is maintainable by staff after project completion
