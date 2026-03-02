# Journal: Legal History Hub

Chronological log of decisions, dead ends, and milestones.

---

## 2025-02 — Project Kickoff

- Contract signed with MPIeR Abt. II (Kerstin Willburth)
- Two components: Hub development + Workshop-based empowerment
- Methodology: Promptotyping (context engineering for LLM-assisted development)

## 2025-02 — Role Model Analysis

Kerstin and Polina provided 8 reference websites. Key findings:

- **HAB Projekte** → faceted filtering as core pattern
- **Hertziana** → restrained academic aesthetic
- **DDB Ausstellungen** → image tiles + filters
- **MPIWG Berlin** → anti-pattern (too many dimensions, scattered navigation)

Decision: max 4–5 filter dimensions, card-grid layout, progressive disclosure. See DESIGN.md.

## 2025-02 — Data Model Draft

- Single-sheet approach with `_de`/`_en`/`_es` suffixes
- 8 real MPIeR projects as test data
- Controlled vocabularies for type, category, status, regions
- Standards mapping: Dublin Core, DataCite, Schema.org/JSON-LD

## 2025-02 — Initial Prototype

- Working prototype: index.html + app.js + i18n.js
- Card grid with sidebar filters (type, status, category)
- Multilingual toggle (DE/EN/ES)
- Detail modal with external link
- Bootstrap 5 styling

Status: functional but not reviewed by client yet. Treat as disposable learning artifact.

## 2025-02 — Docs Restructure

Migrated from phase-prefixed naming (`01-domain-knowledge.md`) to purpose-based naming (`RESEARCH.md`, `DATA-MODEL.md`, `DESIGN.md`, etc.). Merged standards reference into DATA-MODEL.md. Added tutorial/ folder for Promptotyping lessons.
