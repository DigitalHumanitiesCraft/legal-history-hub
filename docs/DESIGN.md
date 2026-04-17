# Design: Legal History Hub

## Design Principles

Derived from role model analysis (5 reference sites, Feb 2026).

1. **Faceted filters as core feature** – max. 4-5 dimensions
2. **Card-grid layout** – 3 col desktop, 2 tablet, 1 mobile
3. **Restrained academic aesthetic** – one accent color, whitespace, serif + sans-serif
4. **Prominent search + sort** – search bar top, sort by featured/newest/alphabetical
5. **Multilingual toggle** – DE/EN/ES in header
6. **Progressive disclosure** – card shows compact view, click opens full metadata
7. **Image strategy** – project thumbnails if available, colored category badges as fallback

## Role Models

### Positive References

| Site | Key Takeaway | URL |
|------|-------------|-----|
| HAB Projekte | Faceted filtering (status, type, topic, epoch) | https://www.hab.de/forschung/projekte/ |
| Hertziana Insights | Restrained aesthetic (one accent color, serif + sans-serif) | https://www.biblhertz.it/en/insights |
| DDB Ausstellungen | Image-dominant tiles + faceted filters + sorting | https://ausstellungen.deutsche-digitale-bibliothek.de/ |
| Sound and Science | Progressive disclosure, scales to 2000+ entries | https://acoustics.mpiwg-berlin.mpg.de/ |

### Negative Reference

| Site | Anti-Pattern | URL |
|------|-------------|-----|
| MPIWG Berlin | 20+ filter dimensions, projects scattered across org units, no unified view | https://www.mpiwg-berlin.mpg.de/ |

## Filter Dimensions

The frontend reads a single enriched `projects.json` produced by the build step from the nine-tab Google Sheet (see `DATA-MODEL.md` and `ARCHITECTURE.md`). Filters map to fields on that enriched representation, not to raw sheet tabs.

| Filter | Source in `projects.json` | UI element |
|--------|---------------------------|------------|
| Type | `core.type` | Checkboxes (6 values) |
| Status | `core.status` | Checkboxes (4 values) |
| Subject | `subjects[].slug` (joined from `authority` via build) | Checkboxes (14 values, consider collapsible) |
| Language | `core.content_languages` (semicolon-split at build) | Checkboxes |
| Period | `core.year_start / year_end` (primary); `core.period_*` as display label on cards | Range slider |

Max 5 active filter groups. Region filter deferred – low priority until project count justifies it.

Because `subjects` is a long-tab relation in the source model but the frontend sees a flat array per project, the build step is responsible for joining `subjects.subject` rows to `authority` and emitting the list (with slugs and localized labels) on each project. The frontend treats subject filtering as a simple "array includes" check, unaware of the underlying normalization.

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
│ │Subj. │ │  ┌──────┐ ┌──────┐ ┌──────┐     │
│ │Lang. │ │  │Card 4│ │Card 5│ │Card 6│     │
│ │Period│ │  └──────┘ └──────┘ └──────┘     │
│ └──────┘ │                                  │
├──────────┴──────────────────────────────────┤
│  Footer                                      │
└─────────────────────────────────────────────┘
```

### Card Structure

```
┌─────────────────────┐
│  [Thumbnail/Badge]  │
│  Title              │
│  1-2 line desc.     │
│  [Type] [Status]    │
│  [Lang flags]       │
└─────────────────────┘
```

Cards show compact view. Subject/region/keyword badges are not on the card (too many per project) but appear in the detail view.

### Detail View

Modal or dedicated page with: full description, all metadata fields from `core`, full lists of people (with ORCID links), institutions (with ROR links), subjects, regions, keywords (with Wikidata/GND links where present), external project URL, related projects.

Every linked entity becomes an outbound link to its authority record: ORCID for persons, ROR for institutions, Wikidata/GND for subjects and regions. This is the main user-facing payoff of the `authority` tab.

## Typography

- Headings: serif (institutional feel)
- Body: sans-serif (readability)
- Accent color: TBD – MPIeR institutional color

## Open Questions

- [ ] MPIeR accent color / Hausfarbe?
- [ ] Project thumbnails available?
- [ ] Featured projects section on homepage?
- [ ] Detail view: modal vs. dedicated page? (Modal works for discovery but blocks individual URLs → SEO trade-off)
- [ ] Render outbound authority links as icons (ORCID logo, Wikidata logo) or as text?
