# Promptotyping Documents – Legal History Hub

## Purpose

These documents are the structured context for LLM sessions and the human-readable project documentation for the Hub. They follow the Promptotyping methodology: documents are the source of truth, code is disposable.

Separate promptotyping docs for the tutorial website live in `tutorial/docs/`. That folder describes the tutorial *as its own artifact*, not the hub.

## Documents

| Document | Purpose | Load when... |
|----------|---------|--------------|
| [RESEARCH.md](RESEARCH.md) | Institution, audience, domain context, success criteria | Starting a new session, onboarding |
| [DATA-MODEL.md](DATA-MODEL.md) | Nine-tab hybrid sheet structure, columns, vocabularies, validation, standards mapping | Working on data, the sheet, filters, build, API |
| [DESIGN.md](DESIGN.md) | UI decisions, role models, layout, typography, filter design | Building UI components, styling |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Tech stack, data flow (sheet → CSVs → build → JSON → frontend), file structure, key decisions | Technical decisions, debugging, build pipeline |
| [JOURNAL.md](JOURNAL.md) | Chronological decisions, dead ends, milestones | Progress review, onboarding |

## Selective Context Loading

Don't load every doc into every prompt. Pick by task:

| Task | Load | Skip |
|------|------|------|
| UI component | DESIGN.md + relevant DATA-MODEL.md section | JOURNAL, RESEARCH |
| Data / filter logic | DATA-MODEL.md + ARCHITECTURE.md | DESIGN, JOURNAL |
| New feature | DESIGN.md + DATA-MODEL.md + ARCHITECTURE.md | JOURNAL |
| Build pipeline / sheet-to-JSON | DATA-MODEL.md + ARCHITECTURE.md | DESIGN, RESEARCH |
| Debugging | ARCHITECTURE.md + relevant section | DESIGN, RESEARCH |
| Progress review | JOURNAL.md | everything else |

## Tutorial

The `tutorial/` folder is a separate artifact: a Docsify tutorial website for the MPIeR team (Kerstin, Polina). Its own promptotyping docs live in `tutorial/docs/`. Lesson 3 ("Das Datenmodell verstehen") is the didactic companion to this folder's `DATA-MODEL.md` and is the right reading for understanding *why* the hybrid model looks the way it does.
