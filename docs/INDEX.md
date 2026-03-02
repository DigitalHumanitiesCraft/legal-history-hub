# Promptotyping Documents — Legal History Hub

## Purpose

These documents serve as structured context for LLM sessions and as human-readable project documentation. They follow the Promptotyping methodology: documents are the source of truth, code is disposable.

## Documents

| Document | Purpose | Load when... |
|----------|---------|-------------|
| [RESEARCH.md](RESEARCH.md) | Institution, audience, domain context, success criteria | Starting a new session, onboarding |
| [DATA-MODEL.md](DATA-MODEL.md) | Sheet structure, columns, vocabularies, standards mapping, validation | Working on data, filters, API |
| [DESIGN.md](DESIGN.md) | UI decisions, role models, layout, typography, filter design | Building UI components, styling |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Tech stack, data flow, file structure, key decisions | Technical decisions, debugging |
| [JOURNAL.md](JOURNAL.md) | Chronological decisions, dead ends, milestones | Progress review, onboarding |

## Selective Context Loading

Don't load all docs into every prompt. Pick by task:

| Task | Load | Skip |
|------|------|------|
| UI component | DESIGN.md + relevant DATA-MODEL.md section | JOURNAL, RESEARCH |
| Data/filter logic | DATA-MODEL.md + ARCHITECTURE.md | DESIGN, JOURNAL |
| New feature | DESIGN.md + DATA-MODEL.md + ARCHITECTURE.md | JOURNAL |
| Debugging | ARCHITECTURE.md + relevant section | DESIGN, RESEARCH |
| Progress review | JOURNAL.md | everything else |

## Tutorial

The `tutorial/` folder contains Promptotyping lessons that accompany the project from Phase 1 to launch. Target audience: MPIeR team (Kerstin, Polina). These are didactic documents, not LLM context.
