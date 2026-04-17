# GSHEET: Google Sheets access for the Hub

Operational handbook for getting data out of the LHH workbook and into the build pipeline. Companion to `docs/DATA-MODEL.md` (schema) and `docs/ARCHITECTURE.md` (pipeline overview).

## The workbook

- **Link:** [LHH](https://docs.google.com/spreadsheets/d/1nr28Oxq1zJLvPqaPFv3JxD8h8bhwzLVcdfloih4614A/)
- **Spreadsheet ID:** `1nr28Oxq1zJLvPqaPFv3JxD8h8bhwzLVcdfloih4614A`
- **Tabs:** `core`, `people`, `institutions`, `subjects`, `regions`, `keywords`, `vocabulary`, `authority`, `_helpers`, `_readme`
- **Schema:** see `docs/DATA-MODEL.md`
- **Offline snapshot:** `lhh-simplified-model-ws3.xlsx` in the repo root, regenerated via `data/polina-experiment-simple/_build_xlsx.py`

The `_helpers` tab is derived via `FILTER` formulas and is not part of the build input. The `_readme` tab is an orientation note for editors inside the sheet and is also skipped by the build.

## Two access routes

Two practical ways to move data from the sheet into `data/sheets/*.csv`:

| Route | When | Setup | Output |
|-------|------|-------|--------|
| **A. Manual CSV export** | WS3 flow, workshops, zero infrastructure | None | Editor clicks 8 times |
| **B. Sheets API read** | WS4 flow, automation, repeatable builds | API key or service account | One `batchGet` call |

Both routes produce the same 8 CSVs. Everything downstream (the `scripts/build-hub-data.py` step, the frontend) is blind to which route was used. You can mix them: pull the api key once to bootstrap the CSVs, then commit and keep working offline until the next edit.

---

## Route A: manual CSV export

Use this in WS3 and whenever the API is not reachable (no key, sheet private, offline). For each data tab:

1. Open the workbook, click the tab.
2. Menu: **Datei → Herunterladen → CSV (.csv)** (File → Download → Comma-separated values).
3. Rename the downloaded file to `<tab>.csv` (e.g. `core.csv`).
4. Move it to `data/sheets/<tab>.csv`.
5. Repeat for: `core`, `people`, `institutions`, `subjects`, `regions`, `keywords`, `vocabulary`, `authority`. (Skip `_helpers` and `_readme`.)

Eight downloads. Tedious but survives every permission setup. On Windows, Google Sheets exports UTF-8 CSVs with Unix line endings; both are fine for the build.

**Shortcut:** `Datei → Herunterladen → Microsoft Excel (.xlsx)` gives one file with all tabs. Claude Code can split it into per-tab CSVs via prompt: *"Nimm `lhh-simplified-model-ws3.xlsx`, exportiere jeden Datentab als UTF-8 CSV in `data/sheets/` mit Dateinamen `<tabname>.csv`."* Faster when many tabs changed at once.

---

## Route B: Google Sheets API

### Auth options

| Option | Suitable for | Setup | Read | Write |
|--------|--------------|-------|------|-------|
| **API Key** | Public sheet (shared "Anyone with link can view") | Google Cloud project → APIs and Services → Credentials → Create API Key → restrict to Sheets API | Yes | No |
| **Service Account** | Private sheet, automated access | Google Cloud project → IAM → Service account → download JSON → share the sheet with the service account email | Yes | Yes |
| **OAuth 2.0** | Per-user interactive access | Client ID + browser login flow | Yes | Yes |

**Recommendation for the Hub:** start with API Key + public sheet during workshops (simplest story for Kerstin and Polina: one env var, one share setting). Move to Service Account when the sheet becomes private or when write-back is needed. Skip OAuth entirely: it requires an interactive browser flow that does not fit Claude Code automation.

### Endpoint

Base URL:

```
https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}
```

Read one range:

```
GET /values/{range}?key={API_KEY}
```

Read all data tabs in one request (preferred for the build):

```
GET /values:batchGet
    ?ranges=core!A:Z
    &ranges=people!A:Z
    &ranges=institutions!A:Z
    &ranges=subjects!A:Z
    &ranges=regions!A:Z
    &ranges=keywords!A:Z
    &ranges=vocabulary!A:Z
    &ranges=authority!A:Z
    &key={API_KEY}
```

Response (trimmed):

```json
{
  "spreadsheetId": "1nr28Oxq1zJLvPqaPFv3JxD8h8bhwzLVcdfloih4614A",
  "valueRanges": [
    {
      "range": "core!A1:Z51",
      "majorDimension": "ROWS",
      "values": [
        ["project_id", "title_de", "title_en", "title_es", "slug", "..."],
        ["proj-001", "Die Schule von Salamanca ...", "The School of Salamanca ...", "La Escuela ...", "salamanca-school", "..."],
        ["proj-002", "...", "...", "..."]
      ]
    },
    { "range": "people!A1:D...", "values": [["project_id", "title_de", "person", "role"], ["proj-001", "Die Schule von Salamanca ...", "Duve, Thomas", "PI"]] }
  ]
}
```

Row 1 of each tab holds headers; data starts at row 2.

**Note on `title_de` in long tabs:** the `title_de` column in `people`, `institutions`, `subjects`, `regions`, and `keywords` is a formula column (structured reference to `core[title_de]`, resolved via `project_id`). It exists for editor convenience (see which project a row belongs to without memorising IDs). On CSV export, Google Sheets resolves formulas to values, so the build sees plain text. The build should treat `title_de` in long tabs as informational; the canonical title lives in `core.title_de`.

### Range syntax

- Whole data range of a tab: `core!A:Z` (letters, not row numbers; the API returns only rows that exist)
- Header row only: `core!A1:Z1`
- Specific rectangle: `core!A2:M50`
- Named tables (the `core`, `people`, ... names from `Format → In Tabelle konvertieren`) work **in sheet formulas** but **not in the API**. Use A1 notation for API calls.
- Tab names with underscores (`_helpers`, `_readme`) are valid but skipped by the build.

### What `scripts/build-hub-data.py` does

Pseudo-steps for the build script that will be written for WS3. It is a deterministic Python script, not a Claude Code Skill: same CSVs must produce the same JSON. Claude Code writes, maintains and invokes it; editors trigger it through natural-language prompts.

```
1. Read LHH_GSHEET_API_KEY from env (or GOOGLE_SERVICE_ACCOUNT_JSON path)
2. Call batchGet for the 8 data tabs
3. For each valueRange:
     - pad short rows to header width
     - write UTF-8 CSV to data/sheets/<tab>.csv
4. Run validation:
     - referential integrity (every project_id in long tabs exists in core)
     - enum conformance (people.role against vocabulary.person_roles, institutions.relation against vocabulary.institution_relations, core.status against vocabulary.status_values)
     - required fields (core.project_id, core.title_de, core.title_en, core.status, core.url1)
     - warn (do not fail) on long-tab labels missing from authority
5. Join:
     - long tabs → core on project_id
     - long tabs → authority on (label, type) for ORCID/GND/ROR/Wikidata enrichment
6. Emit data/projects.json as a flat array of nested project objects
7. Report: "N projects, M people (K with ORCID), J institutions (L with ROR), ..."
```

The env var name is a convention, not a framework requirement. Suggested: `LHH_GSHEET_API_KEY` for API-key auth, `GOOGLE_SERVICE_ACCOUNT_JSON` pointing to the downloaded JSON for service-account auth.

### Rate limits

| Scope | Limit |
|-------|-------|
| Read requests per minute per user | 60 |
| Read requests per minute per project | 300 |
| Write requests per minute per user | 60 |

One build equals one `batchGet` equals one read. Nowhere near the limits. If a build fails with HTTP 429, wait 60 seconds and retry once.

### Common errors

| HTTP | Cause | Fix |
|------|-------|-----|
| 400 | Bad range syntax (typo in tab name, wrong casing, missing `!`) | Check tab name casing; `_helpers` has a leading underscore but is skipped anyway |
| 401 | API key missing or malformed | Set the env var before running the build |
| 403 | Sheet not public and request uses API key | Switch sharing to "Anyone with link can view", or move to service account auth |
| 404 | Spreadsheet ID wrong | Compare against the link at the top of this file |
| 429 | Rate limit | Wait 60s; avoid parallel builds |
| 500 | Google-side transient error | Retry once |

## CSV contract

Regardless of which route produced them, the build reads exactly these files:

```
data/sheets/core.csv
data/sheets/people.csv
data/sheets/institutions.csv
data/sheets/subjects.csv
data/sheets/regions.csv
data/sheets/keywords.csv
data/sheets/vocabulary.csv
data/sheets/authority.csv
```

Column order, header names, and the meaning of each column are defined in `docs/DATA-MODEL.md`. The build fails loudly if headers shift unexpectedly: this is intentional, because a silent drift in column meaning is far more dangerous than a loud build error.

## Sharing mode cheat sheet

| Current share setting | What works |
|-----------------------|-----------|
| "Restricted" (only named users) | Route A only. Or move to service account, share the sheet with that account email. |
| "Anyone with the link: Viewer" | Route A and Route B (API key) both work. |
| "Anyone with the link: Editor" | Same as above, but editors can also write. Not needed for the Hub build. |

Starting point for workshops: "Anyone with the link: Viewer". Move to restricted + service account once the workshop phase ends.

## See also

- `docs/DATA-MODEL.md`: full schema (9 tabs)
- `docs/ARCHITECTURE.md`: the build pipeline end-to-end
- `tutorial/03-datenmodell-hybrid.md`: didactic explanation of the hybrid model
- `WS3-Planung.md`: workshop agenda for the hands-on session
