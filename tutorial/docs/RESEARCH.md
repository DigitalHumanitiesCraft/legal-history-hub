# Research: Tutorial Website

## Framework Decision: Docsify

**Chosen:** Docsify (https://docsify.js.org/)

### Why Docsify

| Criterion | Docsify | Alternatives |
|-----------|---------|-------------|
| Build step | **None** – .md rendered in browser at runtime | MkDocs: Python + pip. mdBook: Rust. Docusaurus: Node + npm |
| Adding content | Write `.md`, add 1 line to `_sidebar.md`, push | All others: edit config, rebuild |
| Can Kerstin do it? | **Yes** – via GitHub web editor | MkDocs/Docusaurus: No. mdBook: unlikely |
| GitHub Pages deploy | Just push (no CI needed) | All others: CI or local build required |
| Subfolder `/tutorial/` | `basePath` config | Most others: complex path config |
| Search | Built-in, client-side, full-text | MkDocs: built-in. Others: varies |
| i18n | Folder-based (`/de/`, `/en/`) | MkDocs: good. mdBook: weak. Docusaurus: excellent |
| Look and feel | Clean, customizable via CSS | MkDocs Material: best. Others: varies |

### Trade-off

SEO is weak (SPA, client-side rendering). Irrelevant – audience is Kerstin/Polina, not Google. If SEO becomes needed later: migrate to MkDocs (Markdown files transfer 1:1).

### Rejected Alternatives

| Option | Rejection Reason |
|--------|-----------------|
| Vanilla HTML/CSS/JS | Too much friction – every lesson = HTML file, manual nav |
| MkDocs + Material | Best output quality, but Python dependency blocks non-technical maintainers |
| mdBook | Rust toolchain, weak i18n |
| Docusaurus | React + Node.js, massively over-engineered |
| Pandoc | Conversion tool, not a framework – no nav, no search |
| Eleventy (11ty) | Flexible but too much assembly – no opinionated docs starter |

## Docsify Setup (Minimal)

```
tutorial/
├── index.html        # ~30 lines, loads Docsify from CDN
├── .nojekyll         # GitHub Pages: skip Jekyll processing
├── README.md         # Landing page (what Docsify renders at /)
├── _sidebar.md       # Lesson navigation
├── _navbar.md        # Language switcher (optional, future)
├── glossar.md        # Terminology for non-technical readers
├── 01-*.md           # Lessons (numbered, linear)
├── slides/           # Workshop PDFs
└── docs/             # These Promptotyping docs (LLM context, not rendered by Docsify)
```

Key config in `index.html`:
```javascript
window.$docsify = {
  name: 'Legal History Hub – Tutorial',
  basePath: '/legal-history-hub/tutorial/',
  loadSidebar: true,
  subMaxLevel: 2,
  search: 'auto'
}
```

## Role Models

### Detailed Analysis

| Site | Strength | Weakness | Key Takeaway |
|------|----------|----------|-------------|
| **Programming Historian** (programminghistorian.org) | Research-process taxonomy, difficulty levels (1-3), academic metadata (DOI), multilingual editions, Jekyll + GH Pages | No learning path – flat collection of 119 unconnected tutorials. Assumes users know what they need | Organize by *what researchers want to do*. Add difficulty levels + time estimates |
| **The Carpentries** (carpentries.org) | Episode structure with learning objectives + key points, separate Reference page per lesson, consistent template, workshop-first design (3-4h chunks) | Sparse design, weak cross-lesson navigation | Adopt episode template. Separate Reference page solves Nachschlagewerk |
| **Django Girls** (tutorial.djangogirls.org) | Gold standard tone for non-technical audience. Analogy-driven ("post office = internet"). Shows end result upfront. Progressive scaffolding | Only linear – no reference function, no difficulty indicators, no glossary | Write like this. Show results first. Use analogies before technical details |
| **MDN Learn** (developer.mozilla.org/en-US/docs/Learn) | Three-tier entry ("Never coded?" / "Essentials?" / "Beyond basics?"). Sidebar + linear path. Honest scope ("beginner to comfortable, not expert") | Too large (34-item modules), too code-centric, dry textbook tone | Adopt dual navigation (sidebar + sequential). Use tier-based entry |
| **DHRIFT** (dhrift.org) | "By humanists, for humanists." Markdown authoring, GH Pages hosting, progressive curriculum from absolute zero | Sparse design, browser-based code execution overkill for our scope | Position as humanities-native. Use Markdown for all content |
| **#dariahTeach** (teach.dariah.eu) | Multilingual content, tag-based cross-referencing, academic credibility signals | Moodle dependency (needs server), dated design, heavy LMS model | Show institutional affiliation (MPIeR + DHCraft) |
| **Docusaurus** (docusaurus.io) | Docs/blog/pages separation, sidebar auto-generated from numbered files | Requires Node.js build, generic tech aesthetic | Use content architecture as *pattern*, not the technology |

### Patterns to Adopt

1. **Navigation:** MDN/Carpentries hybrid – persistent sidebar + sequential Vor/Zurück (Django Girls)
2. **Tone:** Django Girls voice – direct, encouraging, analogy-first, "we" and "you"
3. **Lesson structure:** Carpentries episode template – objectives at top, key points at bottom
4. **Metadata per lesson:** Programming Historian – difficulty level, time estimate, prerequisites
5. **Reference separation:** Carpentries – standalone Reference/Glossar page alongside linear lessons
6. **Positioning:** DHRIFT – "by humanists, for humanists" framing

### Anti-Patterns to Avoid

1. Flat unconnected tutorials without learning path (Programming Historian)
2. Build step or Node.js requirement (Docusaurus)
3. LMS / course management overhead (dariahTeach/Moodle)
4. Assuming users know what they need to learn (Programming Historian)
5. Textbook tone (MDN)
6. Deep nesting > 2 levels (MDN)
7. Missing time estimates and difficulty levels
8. Forgetting Windows-specific instructions (Kerstin/Polina are on Windows)

## UX Patterns

### Navigation

- **Left sidebar** with two modes: Lernpfad (numbered, linear) + Nachschlagen (grouped by topic)
- Sidebar: sticky, collapsible on mobile, accordion groups, current page highlighted
- **Top nav:** max 4-5 items – Lernpfad, Workshops, Glossar, Über das Projekt
- **Breadcrumbs:** always – `Tutorial > Phase 1 > Lektion 2: Web-Grundlagen`
- **Progress indicator:** "Lektion 2 von 12" with visual bar
- **Vor/Zurück buttons** at bottom of every lesson, showing next/previous title

### Content Structure

- **800-1500 words per lesson** (~5-10 min reading). Max 2000. One concept per lesson.
- **Lesson template:** Voraussetzungen → Wo stehen wir? → Hauptinhalt (3-5 H2) → Kernpunkte → Siehe auch → Vor/Zurück
- **4 callout types**, no more:

| Type | Label | Use | Color |
|------|-------|-----|-------|
| Note | "Gut zu wissen" | Context, background | Blue |
| Tip | "Tipp" | Shortcuts, efficiency | Green |
| Important | "Wichtig" | Will cause confusion if missed | Yellow |
| Warning | "Vorsicht" | Could cause data loss or errors | Red |

- Max 2-3 callouts per lesson. Never put essential steps inside callouts.

### Code Examples for Non-Coders

1. Never show code without explanation before AND after the block
2. Annotate with comments inside code (travels with copy-paste)
3. Highlight parts the user must change: `spreadsheetId: 'YOUR_ID_HERE'`
4. Always provide copy button
5. Show expected result: "Wenn alles funktioniert hat, siehst du..."
6. Show minimum viable snippet, not entire files

### Accessibility for Non-Technical Users

- **Progressive disclosure:** `<details>/<summary>` for optional deep dives ("Für Neugierige: Was passiert technisch?")
- **Jargon rule:** Every technical term defined on first use, with German gloss: "Repository (Projektordner auf GitHub)"
- **Consistent vocabulary:** Same term for same concept across all lessons
- **3 heading levels max:** H1 (title), H2 (section), H3 (subsection)
- **Short paragraphs:** 2-4 sentences
- **Bold key terms** on first use only, sparingly

### Glossary

- Standalone `glossar.md` with anchor IDs (`#repository`, `#api`)
- Inline first-use definitions in lessons, linked to glossary
- Rule: If Kerstin wouldn't know the term, it goes in the glossary

### Process Documentation (Embedded)

- **"Wo stehen wir?"** section opens each lesson (project context, current phase)
- **"Warum so?"** callouts for design decisions in context
- **"Rückblick"** sections at lesson end (what worked, what was surprising)

## Diataxis Mapping

| Tutorial Function | Diataxis Type | Organization |
|-------------------|--------------|-------------|
| Selbstlernpfad | Tutorials | Chronological (Lektion 1, 2, 3...) |
| Nachschlagewerk | Reference / How-to | By topic (Google Sheets, HTML, GitHub) |
| Prozessdokumentation | Explanation | Embedded in lessons ("Wo stehen wir?", "Warum so?") |

## Sources

- Docsify: https://docsify.js.org/
- Docsify-Themeable: https://jhildenbiddle.github.io/docsify-themeable/
- Diataxis Framework: https://diataxis.fr/
- Programming Historian: https://programminghistorian.org/
- NN/g Progressive Disclosure: https://www.nngroup.com/articles/progressive-disclosure/
- Tom Johnson Navigation Principles: https://idratherbewriting.com/files/doc-navigation-wtd/design-principles-for-doc-navigation/
