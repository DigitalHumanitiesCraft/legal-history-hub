# Design: Legal History Hub

## Design Principles

Derived from role model analysis (8 reference sites, Feb 2025).

1. **Faceted filters as core feature** — max. 4–5 dimensions
2. **Card-grid layout** — 3 col desktop, 2 tablet, 1 mobile
3. **Restrained academic aesthetic** — one accent color, whitespace, serif + sans-serif
4. **Prominent search + sort** — search bar top, sort by featured/newest/alphabetical
5. **Multilingual toggle** — DE/EN/ES in header
6. **Progressive disclosure** — card shows compact view, click opens full metadata
7. **Image strategy** — project thumbnails if available, colored category badges as fallback

## Role Models

### Positive References

| Site | Key Takeaway | URL |
|------|-------------|-----|
| HAB Projekte | Faceted filtering (status, type, topic, epoch) | https://www.hab.de/forschung/projekte/ |
| Hertziana Insights | Restrained aesthetic (one accent color, serif + sans-serif) | https://www.biblhertz.it/en/insights |
| DDB Ausstellungen | Image-dominant tiles + faceted filters + sorting | https://ausstellungen.deutsche-digitale-bibliothek.de/ |
| Sound & Science | Progressive disclosure, scales to 2050+ entries | https://acoustics.mpiwg-berlin.mpg.de/ |

### Negative Reference

| Site | Anti-Pattern | URL |
|------|-------------|-----|
| MPIWG Berlin | 20+ filter dimensions, projects scattered across org units, no unified view | https://www.mpiwg-berlin.mpg.de/ |

## Filter Dimensions

Mapped to DATA-MODEL.md columns:

| Filter | Column | UI Element |
|--------|--------|-----------|
| Type | `type` | Checkboxes (6 values) |
| Status | `status` | Checkboxes (4 values) |
| Category | `categories` | Checkboxes (14 values) — consider collapsible |
| Language | `content_languages` | Checkboxes |
| Period | `period_*` / `year_start`–`year_end` | Range slider or checkboxes |

Max 5 active filter groups. Region filter deferred — low priority until project count justifies it.

## Layout

### Homepage

```
┌─────────────────────────────────────────────┐
│  Navbar  [Logo] [Projekte] [Über]  [DE|EN|ES] │
├─────────────────────────────────────────────┤
│  Hero: Title + Subtitle                      │
├──────────┬──────────────────────────────────┤
│ Filters  │  [Search bar]          [Grid|List]│
│ ┌──────┐ │  ┌──────┐ ┌──────┐ ┌──────┐     │
│ │Type  │ │  │Card 1│ │Card 2│ │Card 3│     │
│ │Status│ │  └──────┘ └──────┘ └──────┘     │
│ │Categ.│ │  ┌──────┐ ┌──────┐ ┌──────┐     │
│ │Lang. │ │  │Card 4│ │Card 5│ │Card 6│     │
│ └──────┘ │  └──────┘ └──────┘ └──────┘     │
├──────────┴──────────────────────────────────┤
│  Footer                                      │
└─────────────────────────────────────────────┘
```

### Card Structure

```
┌─────────────────────┐
│  [Thumbnail/Badge]  │
│  Title              │
│  1–2 line desc.     │
│  [Type] [Status]    │
│  [Lang flags]       │
└─────────────────────┘
```

### Detail View

Modal or dedicated page with: full description, all metadata fields, external link, related projects.

## Typography

- Headings: serif (institutional feel)
- Body: sans-serif (readability)
- Accent color: TBD — MPIeR institutional color

## Open Questions

- [ ] MPIeR accent color / Hausfarbe?
- [ ] Project thumbnails available?
- [ ] Featured projects section on homepage?
- [ ] Detail view: modal vs. dedicated page?
