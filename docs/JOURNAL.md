# Journal: Legal History Hub

Chronological log of decisions, dead ends, and milestones. Companion to `tutorial/docs/JOURNAL.md`, which tracks the tutorial website as its own artifact.

---

## 2026-02 – Project Kickoff

- Contract signed with MPIeR Abt. II (Kerstin Willburth). Offer 27/25, 50.000 EUR, 12 months, DHCraft OG.
- Two components confirmed: Hub development + workshop-based empowerment (6 workshops).
- Methodology: Promptotyping (context engineering for LLM-assisted development, documents as source of truth).
- Target: Kerstin and Polina maintain the Hub independently after project end.

## 2026-02 – Role Model Analysis

Kerstin and Polina supplied reference websites. After filtering for relevance, five sites drove the design decisions:

- **HAB Projekte** → faceted filtering as core pattern (status, type, topic, epoch)
- **Hertziana Insights** → restrained academic aesthetic (one accent color, serif + sans-serif)
- **DDB Ausstellungen** → image-dominant tiles + faceted filters + sorting
- **Sound and Science** → progressive disclosure, scales to 2000+ entries
- **MPIWG Berlin** → anti-pattern (20+ filter dimensions, projects scattered across org units, no unified view)

Decision: max 4-5 filter dimensions, card-grid layout, progressive disclosure. See `DESIGN.md`.

## 2026-02 – Flat Data Model (v1)

First data model: single-sheet approach with `_de / _en / _es` suffixes and semicolon-separated `categories`, `keywords_*`, `regions`. 8 real MPIeR projects as test data in `data/projects.csv`. Controlled vocabularies for type, category, status, regions.

This worked as a learning artifact but had known limitations: multi-value fields as separator strings cannot be filtered, sorted, or counted by Sheets; typos stay invisible; no authority layer for persistent identifiers. Scheduled for replacement in WS3.

## 2026-02 – Initial Prototype

Working prototype: `index.html` + `app.js` + `i18n.js`. Card grid with sidebar filters (type, status, category), multilingual toggle (DE/EN/ES), detail modal with external link, Bootstrap 5 styling. Functional but explicitly treated as disposable learning artifact. Source of truth is in docs, not in this code.

## 2026-02 – Docs Restructure

Migrated from phase-prefixed naming (`01-domain-knowledge.md`) to purpose-based naming (`RESEARCH.md`, `DATA-MODEL.md`, `DESIGN.md`, `ARCHITECTURE.md`, `JOURNAL.md`). Merged standards reference into `DATA-MODEL.md`. Added `tutorial/` folder with its own `docs/` subtree for the tutorial website as a separate artifact. Both doc sets are promptotyping documents but serve different artifacts.

## 2026-03-04 – WS1: GenAI and Prompt Engineering

First workshop, 4 hours remote, Christian Steiner. 48 slides. Topics: next token prediction, tokenization, pre/post-training, embeddings, sycophancy, confabulation, context window, context rot, prompt engineering patterns, context engineering, promptotyping introduction. Kerstin and Polina as primary audience.

Outcome: shared vocabulary for the rest of the project. Tutorial lesson 1 (`tutorial/01-genai-und-prompt-engineering.md`) distilled from the slides for later self-study.

## 2026-03-13 – WS2: Web-Grundlagen and Claude Code

Second workshop, 4 hours remote, Christian Steiner. 43 slides. Topics: how the web works, HTML/CSS/JS basics, Git and GitHub, vibe vs. agentic coding, promptotyping deepened, Claude Code 101, hands-on with the MoMA dataset.

Outcome: Kerstin and Polina can operate Claude Code directly. From here on, all hub work happens in Claude Code rather than via copy-paste into a chat window. Tutorial lesson 2 + WS2 landing page published.

## 2026-03 – Polina's Relational Experiment

Between WS2 and WS3, Polina built a data model experiment on her own: 6 relational tables with proper foreign keys, a lookup vocabulary carrying GND / ORCID / ROR / Wikidata IDs, and a pipe-notation for person roles (`pers-003|PI`). Conceptually clean, 3NF, FAIR-conformant.

This experiment was not used as the final model, but it was the perfect anchor for WS3: it let us discuss three formats side by side (flat separator strings vs. fully relational vs. hybrid) and choose the hybrid on honest UX grounds rather than by default.

## 2026-04 – Hybrid Data Model Decision

The flat v1 model (separator strings in one wide sheet) and Polina's relational experiment bracket the design space. Decision: neither. The Hub adopts a **hybrid wide + long model**:

- Wide for singletons (`core` tab): one row per project, one value per column.
- Long for many-to-many relations (`people`, `institutions`, `subjects`, `regions`, `keywords`): one row per relation, foreign key `project_id`.
- Separate `vocabulary` (closed enums), `authority` (normdatei with PIDs: ORCID, GND, ROR, Wikidata), and `_helpers` (derived FILTER views for dropdown binding).

Rationale: Sheets is a human editor, not a database. Full normalization forces editors to chase IDs between tabs; full flatness hides multi-value fields in unfilterable strings. The hybrid keeps editing ergonomic and pushes all enrichment (PIDs, joins) to build time in Claude Code.

See `DATA-MODEL.md` for the full schema, `tutorial/03-datenmodell-hybrid.md` for the didactic explanation.

## 2026-04-15 – WS3 Preparation

Workshop 3 ("Data Wrangling mit Google Sheets + Claude Code") scheduled, planning document (`WS3-Planung.md`) written, `lhh-simplified-model-ws3.xlsx` produced as the reference 9-tab workbook with Polina's 5 projects in hybrid format. The xlsx was uploaded to Google Drive, converted to a native Google Sheet, and hardened:

- All 9 tabs converted to Google Sheets Tables (Format → Convert to table) for structured references and auto-expansion.
- Three-stage dropdown architecture wired: `vocabulary` (reject input), `authority` (never bound directly), `_helpers` (FILTER spill ranges, bound with warning mode).
- Subjects and regions migrated from `vocabulary` to `authority` so they can carry PIDs and grow freely. Only hard enums (`person_roles`, `institution_relations`, `status_values`, `type_values`) remain in `vocabulary`.
- `title_de` lookup column added to all five long tabs via `XLOOKUP(..., core[project_id], core[title_de], "")` as a reading aid; source of truth stays in `core`.
- `_readme` tab with short orientation note for editors.

Tutorial lesson 3 ("Das Datenmodell verstehen") written and committed for Kerstin and Polina to read before the workshop. Glossary terms (wide, long, tidy, 1NF, junction table, foreign key, singleton, enum, normdatei, PID, FAIR, derived view, spill range, pivot/melt) explained in plain German with etymology.

### Dead end surfaced during preparation: Gemini-in-Sheets hallucination

While preparing the Sheet, two AIs worked on it in parallel: Claude Code (via Chrome automation) and Gemini-in-Sheets (native sidebar). Gemini performs well on atomic menu operations (deleting empty ranges, setting hardcoded dropdowns with color chips) but hallucinates confidently on complex structural mutations combined with formula input. Concrete incident: Gemini was asked to add a `title_de` XLOOKUP column to five long tabs and reported success in detail. Reality: only one tab was touched, that tab got eight new columns instead of one, all showed `#ERROR!`, and the existing `role` column was pushed out of the viewport. Self-report was plausible, detailed, coherent, and entirely wrong.

Two structural Gemini limits were also confirmed: it cannot bind dropdowns to a range (only to hardcoded value lists), and it operates on a single table range at a time, so cross-sheet vocabulary binding is out of reach. These will become case studies in WS3 block 1 to teach verification discipline.

## 2026-04-15 – Hub Docs Overhauled for Hybrid Model

All six Hub promptotyping docs (`INDEX`, `RESEARCH`, `DATA-MODEL`, `DESIGN`, `ARCHITECTURE`, `JOURNAL`) updated to match the hybrid model. `DATA-MODEL.md` rewritten from scratch around the nine-tab structure. `ARCHITECTURE.md` updated to describe the new multi-CSV → build → enriched JSON pipeline. `DESIGN.md` finalized with the 5-role-model count and the hybrid-aware filter mapping. `RESEARCH.md` and `INDEX.md` updated for consistency. The flat-model docs are archived via git history; no separate legacy copy kept.
