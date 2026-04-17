# Data Model: Legal History Hub

## Approach: Hybrid Wide + Long

The Hub data lives in **one Google Sheet with 9 tabs**. The model combines two formats deliberately:

- **Wide** for singleton fields (one value per project): title, status, year range, URL, license. One row per project.
- **Long** for many-to-many relations (multiple values per project): people, institutions, subjects, regions, keywords. One row per relation.
- Separate **vocabulary**, **authority**, and **_helpers** tabs handle controlled values, persistent identifiers, and derived dropdown sources.

Rationale: Google Sheets is a human editor, not a database. A fully normalized relational model forces editors to chase foreign keys between tabs. A fully flat model hides multi-value fields in separator strings and breaks Sheets' filter, sort, and count operations. The hybrid keeps the core project record readable in one row (wide) and makes relations first-class rows that Sheets can actually work with (long). Enrichment with persistent identifiers (ORCID, GND, ROR, Wikidata) happens at build time via `authority` lookups, so editors never type an ID twice.

For the didactic long-form explanation targeted at editors, see [`tutorial/03-datenmodell-hybrid.md`](../tutorial/03-datenmodell-hybrid.md).

## Tab Overview

| Tab | Mode | Purpose | Keyed by |
|-----|------|---------|----------|
| `core` | wide | One row per project, all singleton fields | `project_id` |
| `people` | long | Project ↔ person relations with role | `project_id` + `person` |
| `institutions` | long | Project ↔ institution relations with relation type | `project_id` + `institution` |
| `subjects` | long | Project ↔ subject (thematic) | `project_id` + `subject` |
| `regions` | long | Project ↔ geographic region | `project_id` + `region` |
| `keywords` | long | Project ↔ free keyword | `project_id` + `keyword` |
| `vocabulary` | enum | Closed value lists for roles, relations, statuses | column-per-enum |
| `authority` | normdatei | All entities (persons, institutions, subjects, regions, keywords) with PIDs | `label` + `type` |
| `_helpers` | derived | Filtered views on `authority` per type, for dropdown binding | `FILTER` formulas |

The five long tabs share the same first column `project_id` (foreign key to `core.project_id`) and carry a `title_de` lookup column as a reading aid (value comes from `core` via `XLOOKUP`, not manually edited).

---

## 1. `core` (wide)

One row per project. All fields that have exactly one value.

### Identifiers

| Column | Required | Type | Description | Example |
|--------|----------|------|-------------|---------|
| `project_id` | Yes | string | Unique identifier, stable | `proj-001` |
| `slug` | Yes | string | URL-friendly name, lowercase, hyphens only | `karl-froelich-sammlung` |

### Titles (multilingual singletons)

| Column | Required | Type | Description |
|--------|----------|------|-------------|
| `title_de` | Yes | string | German title |
| `title_en` | Yes | string | English title |
| `title_es` | No | string | Spanish title |

### Descriptions (multilingual singletons)

| Column | Required | Type | Max | Description |
|--------|----------|------|-----|-------------|
| `description_de` | Yes | text | 500 chars | German description |
| `description_en` | Yes | text | 500 chars | English description |
| `description_es` | No | text | 500 chars | Spanish description |

### Classification (singleton)

| Column | Required | Type | Values |
|--------|----------|------|--------|
| `type` | Yes | enum | `database`, `edition`, `publication`, `tool`, `collection`, `portal` |
| `status` | Yes | enum | `active`, `completed`, `archived`, `planned` |

### Temporal Coverage (singleton)

| Column | Required | Type | Description | Example |
|--------|----------|------|-------------|---------|
| `year_start` | No | integer | Start year | `1500` |
| `year_end` | No | integer | End year | `1800` |
| `period_de` | No | string | Human-readable period (DE) | `Frühe Neuzeit` |
| `period_en` | No | string | Human-readable period (EN) | `Early Modern Period` |
| `period_es` | No | string | Human-readable period (ES) | `Edad Moderna` |

`year_start` and `year_end` drive the period filter on the frontend; the `period_*` fields are display labels on cards.

### Links, Metadata, Media (singleton)

| Column | Required | Type | Description |
|--------|----------|------|-------------|
| `url` | Yes | URL | Primary project URL (https) |
| `license` | No | string | Content license (e.g. `CC-BY`) |
| `date_added` | Yes | date | ISO `YYYY-MM-DD` |
| `media_types` | Yes | string | Semicolon-separated: `text`, `database`, `images`, `maps`, `audio`, `video` |
| `content_languages` | Yes | string | Semicolon-separated ISO 639-1: `de;la;en` |
| `funding` | No | string | Funding body or bodies |
| `related_projects` | No | string | Semicolon-separated `project_id`s: `proj-002;proj-005` |
| `verified` | No | enum | `v` (verified) / `n` (needs review); drives conditional formatting |

`media_types` and `content_languages` stay as semicolon strings in `core` because they are small, bounded, and always filled. They are cheap enough to keep wide. `related_projects` is similar: a bounded list of IDs, not an entity set needing enrichment.

---

## 2. `people` (long)

One row per project-person-role relation. A project with five people has five rows.

| Column | Required | Type | Description |
|--------|----------|------|-------------|
| `project_id` | Yes | FK | References `core.project_id` |
| `title_de` | formula | string | `=XLOOKUP([@project_id], core[project_id], core[title_de], "")` reading aid |
| `person` | Yes | string | Label, bound to `_helpers[person_labels]` via dropdown |
| `role` | Yes | enum | Bound to `vocabulary[person_roles]` |

**Roles** (from `vocabulary.person_roles`): `PI`, `researcher`, `project-coordinator`, `student-assistant`. Hard enum, input rejected if not in list.

Persons themselves live in `authority` (type = `person`) with ORCID. The `people` tab only names them; the ORCID joins in at build time.

---

## 3. `institutions` (long)

One row per project-institution relation.

| Column | Required | Type | Description |
|--------|----------|------|-------------|
| `project_id` | Yes | FK | References `core.project_id` |
| `title_de` | formula | string | Lookup from `core` |
| `institution` | Yes | string | Bound to `_helpers[institution_labels]` |
| `relation` | Yes | enum | Bound to `vocabulary[institution_relations]` |

**Relations** (from `vocabulary.institution_relations`): `host`, `funder`, `partner`, `publisher`. Institutions live in `authority` with GND and ROR IDs.

---

## 4. `subjects` (long)

One row per project-subject relation. Subjects are the thematic categories of the project (formerly `categories` in the flat model).

| Column | Required | Type | Description |
|--------|----------|------|-------------|
| `project_id` | Yes | FK | References `core.project_id` |
| `title_de` | formula | string | Lookup from `core` |
| `subject` | Yes | string | Bound to `_helpers[subject_labels]` |

Subjects live in `authority` with GND and Wikidata IDs where available. The label is a machine-readable slug (e.g. `canon-law`, `legal-iconography`); German, English, Spanish display labels come from `authority`.

---

## 5. `regions` (long)

One row per project-region relation.

| Column | Required | Type | Description |
|--------|----------|------|-------------|
| `project_id` | Yes | FK | References `core.project_id` |
| `title_de` | formula | string | Lookup from `core` |
| `region` | Yes | string | Bound to `_helpers[region_labels]` |

Regions live in `authority` with GND and Wikidata IDs. See the region list further down.

---

## 6. `keywords` (long)

One row per project-keyword relation. Free-text keywords that do not fit the closed subject list but are still useful for search.

| Column | Required | Type | Description |
|--------|----------|------|-------------|
| `project_id` | Yes | FK | References `core.project_id` |
| `title_de` | formula | string | Lookup from `core` |
| `keyword` | Yes | string | Bound to `_helpers[keyword_labels]` |

Keywords live in `authority` with optional GND / Wikidata. Free growth: new keywords get added to `authority` when they first appear in a project.

---

## 7. `vocabulary` (closed enums)

One column per enum. Each column is a finite list of allowed values. Dropdowns on the long tabs and on `core.status` bind to these columns with *Reject input* mode.

| Column | Values |
|--------|--------|
| `person_roles` | `PI`, `researcher`, `project-coordinator`, `student-assistant` |
| `institution_relations` | `host`, `funder`, `partner`, `publisher` |
| `status_values` | `active`, `completed`, `archived`, `planned` |
| `type_values` | `database`, `edition`, `publication`, `tool`, `collection`, `portal` |

**Only closed enums live here.** Subjects, regions, and keywords used to be in `vocabulary` in the flat model; they migrated to `authority` so they can carry PIDs and grow freely.

---

## 8. `authority` (normdatei with PIDs)

Single tab for all entities that appear in the long tabs: persons, institutions, subjects, regions, keywords. The `type` column distinguishes them.

| Column | Required | Type | Notes |
|--------|----------|------|-------|
| `label` | Yes | string | Canonical label used in the long tabs |
| `type` | Yes | enum | `person`, `institution`, `subject`, `region`, `keyword` |
| `label_de` | No | string | German display label (for subjects, regions, keywords) |
| `label_en` | No | string | English display label |
| `label_es` | No | string | Spanish display label |
| `orcid` | No | string | Persons only, e.g. `0000-0002-1658-4173` |
| `gnd` | No | string | Persons, institutions, subjects |
| `ror` | No | string | Institutions only |
| `wikidata` | No | string | Subjects, regions, keywords |
| `notes` | No | text | Free editor notes |

**Authority is the single source of truth for entity metadata.** Labels in the long tabs are text only; everything about who or what that label refers to (identifiers, translations, notes) lives here. The build step joins the long tabs to `authority` on `label` + `type` and emits enriched JSON.

### What lives in `authority`

- **Persons**: PIs, researchers, project coordinators, student assistants. ORCID where available.
- **Institutions**: hosts, funders, partners, publishers. GND and ROR where available.
- **Subjects**: the thematic categories listed below. GND and Wikidata.
- **Regions**: geographic regions listed below. GND and Wikidata.
- **Keywords**: free keywords, optionally enriched.

### FAIR contribution

Persistent Identifiers make the Hub data **Findable** (catalog integration via ORCID/GND/ROR) and **Interoperable** (linked to external knowledge graphs via Wikidata). Editors maintain identifiers once per entity in `authority`, not per project.

---

## 9. `_helpers` (derived views)

Filtered projections of `authority`, one column per entity type. Dropdowns in the long tabs bind to these columns, not directly to `authority`.

| Column | Formula |
|--------|---------|
| `person_labels` | `=FILTER(authority[label]; authority[type]="person")` |
| `institution_labels` | `=FILTER(authority[label]; authority[type]="institution")` |
| `subject_labels` | `=FILTER(authority[label]; authority[type]="subject")` |
| `region_labels` | `=FILTER(authority[label]; authority[type]="region")` |
| `keyword_labels` | `=FILTER(authority[label]; authority[type]="keyword")` |

Google Sheets dropdowns cannot filter by a predicate. Without `_helpers`, a dropdown on `people.person` bound directly to `authority[label]` would mix persons, institutions, subjects, regions, and keywords into one list. `_helpers` pre-filters and produces spill-range arrays that dropdowns can bind to cleanly.

The leading underscore (`_helpers`) is a naming convention borrowed from programming: "internal, derived, do not edit directly". Changes must happen in `authority`; `_helpers` recalculates automatically.

**Dropdown modes:**

| Binding | Mode | Rationale |
|---------|------|-----------|
| `vocabulary[...]` | Reject input | Closed enums, no exceptions |
| `core[project_id]` (foreign key in long tabs) | Show warning | Dropdown becomes unhandy at scale; typo warnings suffice |
| `_helpers[...]` (authority lookup) | Show warning | New names allowed; editors top up `authority` after |

---

## Controlled Vocabularies

### Types (`core.type` → `vocabulary.type_values`)

| Value | DE | EN |
|-------|----|----|
| `database` | Datenbank | Database |
| `edition` | Edition | Edition |
| `publication` | Publikation | Publication |
| `tool` | Werkzeug | Tool |
| `collection` | Sammlung | Collection |
| `portal` | Portal | Portal |

### Statuses (`core.status` → `vocabulary.status_values`)

| Value | DE | EN | Description |
|-------|----|----|-------------|
| `active` | Aktiv | Active | Ongoing project, regularly updated |
| `completed` | Abgeschlossen | Completed | Finished but maintained |
| `archived` | Archiviert | Archived | No longer maintained |
| `planned` | Geplant | Planned | Not yet launched |

### Subjects (authority type = `subject`)

Based on actual institute projects. Referenced by slug in `subjects.subject`; display labels in `authority.label_de/en/es`.

- `canon-law` / Kirchenrecht / Canon Law
- `church-history` / Kirchengeschichte / Church History
- `civil-law` / Zivilrecht / Civil Law
- `colonial-law` / Kolonialrecht / Colonial Law
- `constitutional-law` / Verfassungsrecht / Constitutional Law
- `criminal-law` / Strafrecht / Criminal Law
- `judiciary` / Gerichtswesen / Judiciary
- `legal-history` / Rechtsgeschichte / Legal History
- `legal-iconography` / Rechtsikonographie / Legal Iconography
- `legal-practice` / Rechtspraxis / Legal Practice
- `legal-theory` / Rechtstheorie / Legal Theory
- `legislation` / Gesetzgebung / Legislation
- `roman-law` / Römisches Recht / Roman Law
- `theology` / Theologie / Theology

New subjects are added by appending a row to `authority` with `type = subject`.

### Regions (authority type = `region`)

European focus with global reach. Referenced by slug in `regions.region`.

**European countries:** `germany`, `austria`, `switzerland`, `italy`, `france`, `spain`, `netherlands`, `poland`, `scandinavia`, `british-isles`, `vatican`

**Macro-regions:** `central-europe`, `western-europe`, `eastern-europe`, `iberian-peninsula`

**Global reach:** `latin-america`, `philippines`, `global`

### Person Roles (vocabulary.person_roles)

`PI`, `researcher`, `project-coordinator`, `student-assistant`

### Institution Relations (vocabulary.institution_relations)

`host`, `funder`, `partner`, `publisher`

---

## Validation Rules

1. `project_id` must be unique across `core`.
2. `slug` must be unique, lowercase, hyphens only.
3. `url` must start with `https://`.
4. `year_start` ≤ `year_end` when both are present.
5. `related_projects` must reference existing `project_id` values.
6. `date_added` must be valid ISO date.
7. `title_de` AND `title_en` must be filled in `core`.
8. `description_de` AND `description_en` must be filled in `core`.
9. Every `project_id` in a long tab must exist in `core` (referential integrity).
10. Every `person` / `institution` / `subject` / `region` / `keyword` in a long tab should exist in `authority` with the matching `type`. Missing entries are allowed (warning), not rejected, so editors can add them afterwards in `authority`.
11. Every `role` in `people` must exist in `vocabulary.person_roles` (hard enum).
12. Every `relation` in `institutions` must exist in `vocabulary.institution_relations` (hard enum).

Referential integrity (rules 9-12) is not enforced by Sheets alone. The build step runs these checks on the exported CSVs and fails loudly if they fail.

---

## Google Sheets Setup

### Tables (Format → Convert to table)

Each of the 9 tabs should be converted to a Google Sheets **Table** (feature shipped May 2024). Tables give us:

- Column-type enforcement (text, number, date, dropdown)
- Auto-expansion: new rows inherit formulas, validation, formatting
- Named scope for structured references: `core[project_id]`, `vocabulary[person_roles]`
- Integrated filter/sort header
- Compatible with `FILTER` spill ranges in `_helpers`

**Structured references** replace fragile range references. Instead of `=VLOOKUP(A2, core!A:B, 2, FALSE)` we write `=XLOOKUP(A2, core[project_id], core[title_de], "")`. This survives column inserts and reads like a sentence.

**Caveat:** Tables are a live Sheets object. CSV export preserves only plain cell values; table names, column types, and structured references vanish. That is fine for the build contract (column order + headers are stable), and fine for Git (CSVs diff cleanly).

### Filter Views and Grouped View

- **Filter Views** let editors focus on one project's rows in a long tab (`proj-001 people`, `proj-001 keywords`, ...). Per-user, non-destructive.
- **Grouped View** (Tables feature, shipped 2025) renders a long tab project-centric without changing the model: project rows fold into aggregated blocks with counts per group. Gives editors the "wide feel" without abandoning long format.

### Conditional Formatting

- `core.verified = "v"` → row green
- `core.verified = "n"` → row yellow
- `core.status = "completed"` → row grey
- Empty required cell in `core.title_de` → red

---

## Standards Mapping

Schema maps Hub columns (after build-time enrichment) to established metadata standards. The `authority` join lets us emit PID-qualified values for creators, subjects, and regions.

### Dublin Core

| DC Element | Hub source |
|------------|------------|
| `dc:title` | `core.title_de / _en / _es` |
| `dc:description` | `core.description_de / _en / _es` |
| `dc:creator` | `people[person]` joined with `authority.orcid` |
| `dc:contributor` | `institutions[institution]` where `relation = host` |
| `dc:date` | `core.year_start`, `core.year_end` |
| `dc:type` | `core.type` |
| `dc:language` | `core.content_languages` |
| `dc:subject` | `subjects[subject]` joined with `authority.gnd / wikidata` |
| `dc:coverage` | `regions[region]`, `core.period_*` |
| `dc:relation` | `core.related_projects` |
| `dc:rights` | `core.license` |
| `dc:identifier` | `core.project_id`, `core.url` |

Reference: https://www.dublincore.org/specifications/dublin-core/dcmi-terms/

### DataCite

| DataCite property | Hub source |
|-------------------|------------|
| `resourceTypeGeneral` | `core.type` |
| `publicationYear` | `core.year_start` |
| `creators` | `people[person]` with `nameIdentifier` = ORCID |
| `contributors` | `institutions` with `nameIdentifier` = ROR |
| `subjects` | `subjects[subject]` with `subjectScheme` + `valueURI` from `authority` |
| `fundingReferences` | `institutions` where `relation = funder` |
| `geoLocations` | `regions[region]` |

Reference: https://schema.datacite.org/

### Schema.org / JSON-LD

Primary type: `schema:ResearchProject`. Emitted via `<script type="application/ld+json">` on each project detail view.

```json
{
  "@context": "https://schema.org",
  "@type": "ResearchProject",
  "@id": "{{url}}",
  "name": "{{title_en}}",
  "description": "{{description_en}}",
  "url": "{{url}}",
  "inLanguage": ["{{content_languages}}"],
  "funder": {
    "@type": "Organization",
    "name": "{{funder.name}}",
    "identifier": "{{funder.ror}}"
  },
  "sourceOrganization": {
    "@type": "Organization",
    "name": "{{host.name}}",
    "identifier": "{{host.ror}}"
  },
  "contributor": [
    { "@type": "Person", "name": "{{person.label}}", "identifier": "{{person.orcid}}" }
  ],
  "about": [
    { "@type": "Thing", "name": "{{subject.label_en}}", "sameAs": "{{subject.wikidata}}" }
  ]
}
```

---

## Build-Time Enrichment

```
Google Sheet (9 tabs)
    ↓ File → Download → CSV per tab (or xlsx, or Sheets API)
data/*.csv (core, people, institutions, subjects, regions, keywords, vocabulary, authority)
    ↓ Python: scripts/build-hub-data.py (invoked by Claude Code via Bash)
data/projects.json (nested, enriched)
```

The build step:

1. Reads all CSVs.
2. Validates referential integrity (rules 9-12 above). Fails loudly on error.
3. Joins each long tab to `core` on `project_id` and to `authority` on `label` + `type`.
4. For each project, builds a nested object:
   ```
   {
     "project_id": "proj-001",
     "title_de": "...", "title_en": "...", ...
     "status": "active",
     "people": [
       { "label": "Duve, Thomas", "role": "PI", "orcid": "0000-..." }
     ],
     "institutions": [
       { "label": "MPIeR", "relation": "host", "gnd": "...", "ror": "..." }
     ],
     "subjects": [
       { "slug": "legal-iconography", "label_de": "...", "label_en": "...", "wikidata": "..." }
     ],
     "regions": [...],
     "keywords": [...]
   }
   ```
5. Writes `data/projects.json` as one flat array of enriched project objects.
6. Frontend reads this JSON at runtime with a single `fetch()`; all filtering, sorting, and search happen client-side over the enriched fields.

The frontend stays schema-stable: it never queries `authority` or `vocabulary` directly. The build is the one place that knows about the nine-tab shape; everything downstream sees a clean nested array.

---

## Migration from Flat Model (Legacy v1)

Legacy `data/projects.csv` held one flat sheet with semicolon-separated `categories`, `keywords_*`, and `regions`. The hybrid replaces that sheet. Migration happens in WS3: Claude Code reads the legacy CSV, splits the multi-value fields into long-tab rows, and writes the 9 new CSVs. Existing `project_id`, `slug`, `title_*`, `description_*`, `type`, `status`, `year_*`, `period_*`, `url`, `institution`, `funding`, `media_types`, `content_languages`, `license`, `date_added` fields transfer 1:1 into `core`. The old `institution` column becomes one row in `institutions` with `relation = host`; `funding` becomes rows with `relation = funder` when populated.
