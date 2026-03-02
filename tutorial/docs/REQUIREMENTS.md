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

- **P1** As Kerstin, I want each lesson to start with "Wo stehen wir?" so that I understand the project context.
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

Mapped to Hub project phases and workshops:

| # | Lesson | Hub Phase | Workshop | Source | Priority |
|---|--------|-----------|----------|--------|----------|
| 01 | GenAI und Prompt Engineering | Phase 2 | WS1 | WS1 Slides (PDF) | Stub |
| 02 | Preparation und Role Models | Phase 1 | – | – | Done |
| 03 | Was ist das Web? HTML/CSS Grundlagen | Phase 2 | WS2 | – | Must |
| 04 | Google Sheets als CMS | Phase 2 | WS3 | – | Must |
| 05 | Von der Idee zum Code mit Claude | Phase 3 | WS2 | – | Must |
| 06 | Den Hub verstehen: Wie der Code funktioniert | Phase 3 | – | – | Must |
| 07 | Git und GitHub Basics | Phase 4 | WS5 | – | Must |
| 08 | Deployment auf GitHub Pages | Phase 4 | WS5 | – | Must |
| 09 | Eigene Änderungen am Hub | Phase 4 | WS6 | – | Should |
| 10 | Troubleshooting und Debugging | Phase 5 | WS6 | – | Should |
| 11 | SEO und Barrierefreiheit | Phase 5 | – | – | Nice |
| 12 | Wartung und Weiterentwicklung | Phase 6 | – | – | Nice |

**Lektion 01 Details:** Basiert auf WS1-Slides (48 Folien, [Google Slides](https://docs.google.com/presentation/d/1Jy3BvZ334gw_-B_5wEwoItzlZaQDsDtFfx0HCUOaWGE)). Inhalte: LLM-Funktionsweise, Tokenization, Embeddings, Pre/Post-Training, Sycophancy, Context Windows, Prompt Engineering, Context Engineering, Promptotyping-Einführung.

## Existing Assets

### Glossar (from chpollin/llmdh)

Christopher's existing glossary at `https://github.com/chpollin/llmdh/tree/main/glossary`:
- **71+ Einträge** bilingual (DE + EN)
- **Difficulty levels:** basic, intermediate, advanced
- **Categories:** fundamentals, architecture, training, prompting, ai-engineering, agents, safety, evaluation, governance
- **Format:** Markdown as data source, parsed at runtime by JS
- **UI:** HTML/JS/CSS with search, alphabet nav, category filter, DE/EN toggle
- **Design:** Georgia serif headings, blue accent (#2c5aa0), clean expandable cards
- **Integration approach:** Adapt for Docsify context – either embed as-is or convert to Docsify-compatible glossar.md with subset of terms relevant to the tutorial

## Success Criteria

1. Kerstin can add a new project to the Hub (edit Google Sheet + verify it appears) without help
2. Kerstin can fix a simple CSS issue using Claude Code
3. Kerstin can deploy a change via GitHub
4. Kerstin can add a new lesson to the tutorial website via GitHub web editor
5. Polina can follow the self-learning path and complete all Must-lessons independently
