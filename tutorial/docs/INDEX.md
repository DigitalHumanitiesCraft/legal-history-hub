# Promptotyping Documents – Tutorial Website

## Purpose

Structured LLM context for building and maintaining the Legal History Hub tutorial website. Separate from the Hub's own docs (`docs/`). Follow selective loading to avoid Context Rot.

## What Is the Tutorial Website?

A Docsify-based static site in `tutorial/` serving three functions:

1. **Nachschlagewerk** – Kerstin/Polina look up concepts (API, HTML, Git...)
2. **Selbstlernpfad** – linear learning path from basics to independent work
3. **Prozessdokumentation** – what was done when and why (Promptotyping journal)

Target audience: Kerstin Willburth and Polina (MPIeR Abt. II) – no technical background.

## Documents

| Document | Purpose | Load when... |
|----------|---------|-------------|
| [RESEARCH.md](RESEARCH.md) | Role models, framework comparison, UX patterns | Onboarding, design decisions |
| [REQUIREMENTS.md](REQUIREMENTS.md) | User stories, content plan, success criteria | Adding features, planning lessons |
| [DESIGN.md](DESIGN.md) | Docsify config, layout, navigation, callouts, lesson template | Building UI, styling, writing lessons |
| [TESTING.md](TESTING.md) | Test-Matrix: was prüft welcher Test, wann, mit welchen Deps | Vor Deploy, nach Test-Refactor, beim Onboarding |
| [JOURNAL.md](JOURNAL.md) | Chronological decisions and milestones | Progress review |

## Selective Context Loading

| Task | Load | Skip |
|------|------|------|
| Writing a new lesson | DESIGN.md (lesson template + callouts) | RESEARCH, JOURNAL |
| Docsify config/styling | DESIGN.md + RESEARCH.md (role models) | REQUIREMENTS, JOURNAL |
| Planning lesson content | REQUIREMENTS.md | DESIGN, JOURNAL |
| Progress review | JOURNAL.md | everything else |
| New session / onboarding | This INDEX.md + JOURNAL.md | load others as needed |

## Relationship to Hub Docs

The Hub's Promptotyping docs live in `docs/`. This folder (`tutorial/docs/`) is for the tutorial *website* as an artifact. The tutorial *content* (lessons, glossary) lives directly in `tutorial/`.
