# Data Model: Legal History Hub

## Sheet Structure

**Single sheet approach** with language suffixes (`_de`, `_en`, `_es`) for multilingual fields.

**File:** `data/projects.csv` → Import to Google Sheets

## Column Reference

### Identifiers

| Column | Required | Type | Description | Example |
|--------|----------|------|-------------|---------|
| `id` | Yes | string | Unique identifier | `proj-001` |
| `slug` | Yes | string | URL-friendly name | `medieval-law-db` |

### Titles (multilingual)

| Column | Required | Type | Description |
|--------|----------|------|-------------|
| `title_de` | Yes | string | German title |
| `title_en` | Yes | string | English title |
| `title_es` | No | string | Spanish title |

### Descriptions (multilingual)

| Column | Required | Type | Max Length | Description |
|--------|----------|------|------------|-------------|
| `description_de` | Yes | text | 500 chars | German description |
| `description_en` | Yes | text | 500 chars | English description |
| `description_es` | No | text | 500 chars | Spanish description |

### Classification

| Column | Required | Type | Values/Format |
|--------|----------|------|---------------|
| `type` | Yes | enum | `database`, `edition`, `publication`, `tool`, `collection`, `portal` |
| `categories` | Yes | string | Semicolon-separated (see controlled vocabulary below) |
| `keywords_de` | No | string | Semicolon-separated German keywords |
| `keywords_en` | No | string | Semicolon-separated English keywords |

**Note:** Use semicolons (`;`) as separator within fields since commas are the CSV delimiter.

### Temporal Coverage

| Column | Required | Type | Description | Example |
|--------|----------|------|-------------|---------|
| `year_start` | No | integer | Start year | `1500` |
| `year_end` | No | integer | End year | `1800` |
| `period_de` | No | string | Human-readable period (DE) | `Frühe Neuzeit` |
| `period_en` | No | string | Human-readable period (EN) | `Early Modern Period` |
| `period_es` | No | string | Human-readable period (ES) | `Edad Moderna` |

### Geographic

| Column | Required | Type | Description |
|--------|----------|------|-------------|
| `regions` | No | string | Comma-separated regions (see vocabulary) |

### Links & Relations

| Column | Required | Type | Description |
|--------|----------|------|-------------|
| `url` | Yes | URL | Primary project URL |
| `related_projects` | No | string | Comma-separated IDs: `proj-002, proj-005` |

### Institutions

| Column | Required | Type | Description |
|--------|----------|------|-------------|
| `institution` | Yes | string | Hosting/responsible institution |
| `funding` | No | string | Funding body/bodies |

### Status & Media

| Column | Required | Type | Values |
|--------|----------|------|--------|
| `status` | Yes | enum | `active`, `completed`, `archived`, `planned` |
| `media_types` | Yes | string | Semicolon-separated: `text`, `database`, `images`, `maps`, `audio`, `video` |
| `content_languages` | Yes | string | Semicolon-separated ISO 639-1 codes: `de;la;en` |

### Metadata

| Column | Required | Type | Description |
|--------|----------|------|-------------|
| `date_added` | Yes | date | YYYY-MM-DD format |
| `license` | No | string | Content license (CC-BY, etc.) |

---

## Controlled Vocabularies

### Project Types (`type`)

| Value | DE | EN |
|-------|----|----|
| `database` | Datenbank | Database |
| `edition` | Edition | Edition |
| `publication` | Publikation | Publication |
| `tool` | Werkzeug | Tool |
| `collection` | Sammlung | Collection |
| `portal` | Portal | Portal |

### Categories (`categories`)

*Based on actual institute projects. Multiple categories per project allowed (semicolon-separated):*

- `canon-law` — Kirchenrecht / Canon Law
- `church-history` — Kirchengeschichte / Church History
- `civil-law` — Zivilrecht / Civil Law
- `colonial-law` — Kolonialrecht / Colonial Law
- `constitutional-law` — Verfassungsrecht / Constitutional Law
- `criminal-law` — Strafrecht / Criminal Law
- `judiciary` — Gerichtswesen / Judiciary
- `legal-history` — Rechtsgeschichte / Legal History
- `legal-iconography` — Rechtsikonographie / Legal Iconography
- `legal-practice` — Rechtspraxis / Legal Practice
- `legal-theory` — Rechtstheorie / Legal Theory
- `legislation` — Gesetzgebung / Legislation
- `roman-law` — Römisches Recht / Roman Law
- `theology` — Theologie / Theology

### Regions (`regions`)

*European focus with global reach. Comma-separated in field:*

**Europe:**
- `Germany`
- `Austria`
- `Switzerland`
- `Italy`
- `France`
- `Spain`
- `Netherlands`
- `Poland`
- `Scandinavia`
- `British Isles`
- `Vatican`

**Macro-regions:**
- `Central Europe`
- `Western Europe`
- `Eastern Europe`
- `Iberian Peninsula`

**Global:**
- `Latin America`
- `Philippines`
- `Global` (for projects with worldwide scope)

### Status (`status`)

| Value | DE | EN | Description |
|-------|----|----|-------------|
| `active` | Aktiv | Active | Ongoing project, regularly updated |
| `completed` | Abgeschlossen | Completed | Finished but maintained |
| `archived` | Archiviert | Archived | No longer maintained |
| `planned` | Geplant | Planned | Not yet launched |

---

## Validation Rules

1. `id` must be unique across all entries
2. `slug` must be unique, lowercase, hyphens only (no spaces/special chars)
3. `url` must be a valid URL starting with `https://`
4. `year_start` ≤ `year_end` when both are present
5. `related_projects` must reference existing `id` values
6. `date_added` must be valid ISO date (YYYY-MM-DD)
7. At least `title_de` AND `title_en` must be filled
8. At least `description_de` AND `description_en` must be filled

---

## Standards Mapping

Schema maps Hub columns to established metadata standards.

### Dublin Core

| DC Element | Hub Column(s) |
|------------|---------------|
| `dc:title` | `title_de`, `title_en`, `title_es` |
| `dc:description` | `description_de`, `description_en`, `description_es` |
| `dc:creator` | `institution` |
| `dc:date` | `year_start`, `year_end` |
| `dc:type` | `type` |
| `dc:language` | `content_languages` |
| `dc:subject` | `categories`, `keywords_*` |
| `dc:coverage` | `regions`, `period_*` |
| `dc:relation` | `related_projects` |
| `dc:rights` | `license` |
| `dc:identifier` | `id`, `url` |

Ref: https://www.dublincore.org/specifications/dublin-core/dcmi-terms/

### DataCite

| DataCite Property | Hub Column(s) |
|-------------------|---------------|
| `resourceTypeGeneral` | `type` |
| `publicationYear` | `year_start` |
| `fundingReferences` | `funding` |
| `geoLocations` | `regions` |

Ref: https://schema.datacite.org/

### Schema.org / JSON-LD

Primary type: `schema:ResearchProject`. Implementation via `<script type="application/ld+json">`.

```json
{
  "@context": "https://schema.org",
  "@type": "ResearchProject",
  "name": "{{title_en}}",
  "description": "{{description_en}}",
  "url": "{{url}}",
  "inLanguage": ["{{content_languages}}"],
  "funder": { "@type": "Organization", "name": "{{funding}}" },
  "sourceOrganization": { "@type": "Organization", "name": "{{institution}}" }
}
```

---

## Google Sheets Import

1. Open Google Sheets
2. File → Import → Upload `projects.csv`
3. Select "Replace spreadsheet" or "Insert new sheet"
4. Separator: Comma
5. Rename sheet to "Projects"

### Recommended Sheet Settings

- Freeze row 1 (headers)
- Enable data validation for `type` and `status` columns (dropdown)
- Add conditional formatting for empty required fields
- Protect header row from editing
