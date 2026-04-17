# Requirements: Tutorial Website

## Users

| User | Role | Needs |
|------|------|-------|
| **Kerstin Willburth** | Primary learner, future Hub-Maintainerin | Learn web basics + AI tools, maintain Hub independently, look up concepts |
| **Polina** | Secondary learner | Same as Kerstin |
| **Christopher Pollin** | Tutorial author, developer | Write lessons in Markdown, configure Docsify, deploy |

## User Stories

### Epic 1: Self-Learning Path (Selbstlernpfad)

- **S1** As Kerstin, I want to follow a linear lesson sequence so that I learn web development step by step without getting lost.
- **S2** As Kerstin, I want each lesson to state prerequisites so that I know what I need to have read first.
- **S3** As Kerstin, I want Vor/Zurück navigation at the bottom of each lesson so that I can move through the learning path without going back to the sidebar.
- **S4** As Kerstin, I want to see progress ("Lektion 3 von 12") so that I know how far I've come.
- **S5** As Kerstin, I want difficulty levels and time estimates per lesson so that I can plan my learning sessions.

### Epic 2: Reference (Nachschlagewerk)

- **R1** As Kerstin, I want a glossary page so that I can look up technical terms I've forgotten.
- **R2** As Kerstin, I want full-text search across all lessons so that I can find specific topics quickly.
- **R3** As Kerstin, I want technical terms to be defined on first use in every lesson so that I don't have to read previous lessons to understand the current one.
- **R4** As Kerstin, I want a sidebar that shows all lessons so that I can jump to any topic directly.

### Epic 3: Process Documentation (Prozessdokumentation)

- **P1** As Kerstin, I want each lesson to start with "Wo stehen wir?" or an equivalent orientation section so that I understand the project context.
- **P2** As Kerstin, I want "Warum so?" callouts for design decisions so that I understand why things were done this way.
- **P3** As Kerstin, I want a chronological overview so that I can trace the project's development.

### Epic 4: Content Accessibility

- **A1** As Kerstin, I want code examples with explanations before AND after the code block so that I understand what the code does.
- **A2** As Kerstin, I want optional deep dives (collapsible) so that I'm not overwhelmed by technical detail.
- **A3** As Kerstin, I want analogies and German glosses for English terms so that abstract concepts become tangible.
- **A4** As Kerstin, I want screenshots with annotations for every UI step so that I can follow along visually.

### Epic 5: Maintenance (Christopher + future Kerstin)

- **M1** As Christopher, I want to add a lesson by creating a `.md` file and adding one line to `_sidebar.md` so that the workflow is fast.
- **M2** As Kerstin (future), I want to edit lessons via the GitHub web editor so that I don't need a local dev setup.
- **M3** As Christopher, I want Docsify to work without a build step so that deployment = push.

## Content Plan (Planned Lessons)

The plan mirrors project progress. Lessons are written after the corresponding workshop (or the decision it produced) so they can distill what actually happened, not what was imagined.

| # | Lesson | Hub Phase | Workshop | Status |
|---|--------|-----------|----------|--------|
| 01 | GenAI und Prompt Engineering | 2 | WS1 (04.03.2026) | Done |
| 02 | Preparation und Role Models | 1 | – | Done |
| 03 | Das Datenmodell verstehen (Hybrid wide + long) | 2 | WS3 preread | Done |
| 04 | Google Sheets als CMS einrichten (Tables, Dropdowns, Filter Views) | 2 | WS3 | Must |
| 05 | Von der Idee zum Code mit Claude Code | 3 | WS2 follow-up | Must |
| 06 | Den Hub verstehen: Wie der Code funktioniert | 3 | – | Must |
| 07 | Git und GitHub Basics | 4 | WS5 | Must |
| 08 | Deployment auf GitHub Pages | 4 | WS5 | Must |
| 09 | Eigene Änderungen am Hub | 4 | WS6 | Should |
| 10 | Troubleshooting und Debugging | 5 | WS6 | Should |
| 11 | SEO und Barrierefreiheit | 5 | – | Nice |
| 12 | Wartung und Weiterentwicklung | 6 | – | Nice |

**Order rationale:** Lektion 3 (Datenmodell) comes before Lektion 4 (Google Sheets als CMS) because the CMS lesson depends on the hybrid-model vocabulary (wide, long, junction table, vocabulary, authority, _helpers). Lektion 3 is conceptual and readable without Sheets open; Lektion 4 is hands-on and assumes Lektion 3 already happened. Lektionen 5-8 will be written around WS4 / WS5 once the workshops have produced their material.

**Lesson 01 details:** Based on WS1 slides (48 folien, [Google Slides](https://docs.google.com/presentation/d/1Jy3BvZ334gw_-B_5wEwoItzlZaQDsDtFfx0HCUOaWGE)). Topics: LLM functioning, tokenization, embeddings, pre/post-training, sycophancy, context windows, prompt engineering, context engineering, Promptotyping introduction.

**Lesson 03 details:** Written 2026-04-15 as preread for WS3. Explains wide vs. long, junction tables, 1NF, normalization, the three-stage dropdown architecture (vocabulary / authority / _helpers), FAIR principles, persistent identifiers (ORCID, GND, ROR, Wikidata). Carries a full glossary of the technical terms so editors can recognize them later.

## Existing Assets

### Glossar (from chpollin/llmdh)

Christopher's existing glossary at `https://github.com/chpollin/llmdh/tree/main/glossary`:

- **71+ entries** bilingual (DE + EN)
- **Difficulty levels:** basic, intermediate, advanced
- **Categories:** fundamentals, architecture, training, prompting, ai-engineering, agents, safety, evaluation, governance
- **Format:** Markdown as data source, parsed at runtime by JS
- **UI:** HTML/JS/CSS with search, alphabet nav, category filter, DE/EN toggle
- **Design:** Georgia serif headings, blue accent (#2c5aa0), clean expandable cards

Decision: integrated as native Docsify Markdown (`tutorial/glossar.md`) rather than as an embedded JS widget. Docsify generates anchor IDs automatically from headings (`### Context Rot` → `#context-rot`), and the built-in search indexes the glossary. Lessons link via `glossar.md#begriff`. Upgrade path to a JS widget remains open if native features turn out to be insufficient.

**Glossary growth log:** WS1 baseline from llmdh → +14 entries after WS2 (web basics, git, coding paradigms, Distillation) → more entries planned after WS3 (wide, long, tidy, 1NF, junction table, foreign key, singleton, enum, authority file, PID, FAIR, derived view, spill range, pivot/melt).

## Success Criteria

1. Kerstin can add a new project to the Hub end-to-end (edit Google Sheet → ask Claude Code to run `scripts/build-hub-data.py` → commit → verify it appears) without help.
2. Kerstin can fix a simple CSS issue using Claude Code.
3. Kerstin can deploy a change via GitHub.
4. Kerstin can add a new lesson to the tutorial website via the GitHub web editor.
5. Polina can follow the self-learning path and complete all Must lessons independently.
6. Kerstin can explain the hybrid data model (wide vs long, vocabulary vs authority vs _helpers) in her own words without looking at notes.
