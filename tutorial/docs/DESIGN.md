# Design: Tutorial Website

## Framework

**Docsify** – zero build step, Markdown rendered in browser. See RESEARCH.md for comparison.

## File Structure

```
tutorial/
├── index.html          # Docsify loader (~30 lines, CDN)
├── .nojekyll           # GitHub Pages: skip Jekyll
├── README.md           # Landing page
├── _sidebar.md         # Lesson navigation
├── _navbar.md          # Language switcher (future)
├── glossar.md          # Term definitions (native Docsify Markdown, based on chpollin/llmdh glossary)
├── 01-genai-und-prompt-engineering.md   # Based on WS1 slides (04.03.2026)
├── 02-preparation-und-role-models.md    # Phase 1 retrospective
├── 03-datenmodell-hybrid.md             # Preread for WS3, hybrid wide + long explained
├── 04-google-sheets-cms.md              # Written after WS3 (hands-on)
├── ...
├── slides/             # Workshop landing pages + PDFs
│   ├── ws1-genai-fundamentals.md
│   ├── ws2-web-promptotyping-claude-code.md
│   └── ...
└── docs/               # Promptotyping docs (THIS folder, not rendered by Docsify)
```

## Docsify Configuration

```javascript
window.$docsify = {
  name: 'Legal History Hub – Tutorial',
  repo: '',
  basePath: '/legal-history-hub/tutorial/',
  loadSidebar: true,
  loadNavbar: true,
  subMaxLevel: 2,        // Auto-generate TOC from H2 headings
  auto2top: true,        // Scroll to top on page change
  search: {
    placeholder: 'Suche...',
    noData: 'Keine Ergebnisse.',
    depth: 3
  }
}
```

Plugins to include (via CDN script tags):
- `docsify-search` – full-text search
- `docsify-copy-code` – copy button on code blocks
- `docsify-pagination` – Vor/Zurück buttons at page bottom

## Sidebar Structure (`_sidebar.md`)

```markdown
* **Lernpfad**
  * [Lektion 1: GenAI und Prompt Engineering](01-genai-und-prompt-engineering.md)
  * [Lektion 2: Preparation und Role Models](02-preparation-und-role-models.md)
  * [Lektion 3: Das Datenmodell verstehen](03-datenmodell-hybrid.md)
  * [Lektion 4: Google Sheets als CMS](04-google-sheets-cms.md)
  * ...

* **Workshops**
  * [WS1: GenAI Fundamentals](slides/ws1-genai-fundamentals.md)
  * [WS2: Web-Grundlagen und Claude Code](slides/ws2-web-promptotyping-claude-code.md)
  * ...

* **Nachschlagen**
  * [Glossar](glossar.md)
```

Workshop entries link to landing pages (`.md`), not directly to PDFs. Each landing page has: date, topic, summary, PDF download link, related lessons.

## Lesson Template

Every lesson follows this structure:

```markdown
# Lektion N: Titel

> Kurzbeschreibung in einem Satz.

**Schwierigkeit:** Grundlagen | Aufbau | Fortgeschritten
**Dauer:** ca. X Minuten
**Voraussetzungen:** [Lektion N-1](link) (oder: Keine)

## Wo stehen wir?

2-3 Sätze: aktuelle Promptotyping-Phase, was seit letzter Lektion passiert ist.

## [Hauptinhalt – 3-5 H2 Abschnitte]

Inhalt mit kurzen Absätzen, Callouts, Code-Beispielen, Screenshots.

## Kernpunkte

- Punkt 1
- Punkt 2
- Punkt 3

## Siehe auch

- [Verwandte Lektion](link)
- [Glossar: Begriff](glossar.md#begriff)
```

Vor/Zurück-Navigation wird automatisch von `docsify-pagination` generiert.

## Callouts

Docsify unterstützt Callouts via Blockquote-Syntax:

```markdown
> [!NOTE]
> **Gut zu wissen:** Hintergrundinfo hier.

> [!TIP]
> **Tipp:** Praktischer Shortcut hier.

> [!WARNING]
> **Wichtig:** Das darf nicht übersehen werden.

> [!ATTENTION]
> **Vorsicht:** Kann Datenverlust verursachen.
```

Rules:
- Max 2-3 callouts per lesson
- Never put essential procedural steps inside callouts
- Callouts are supplementary, not primary content

## Deep Dives (Progressive Disclosure)

For optional technical detail:

```markdown
<details>
<summary>Für Neugierige: Was passiert technisch im Hintergrund?</summary>

Technische Erklärung hier...

</details>
```

## Code Examples

Rules for non-technical audience:
1. Explanation before code block (what it does, in plain German)
2. Comments inside code (in German)
3. Code block with language tag (syntax highlighting)
4. Explanation after code block (expected result)
5. Highlight changeable parts: `'DEINE_SPREADSHEET_ID'`

Example:
```markdown
Diese Zeile sagt dem Browser, welche Schriftart er verwenden soll:

\`\`\`css
/* Schriftart für die gesamte Seite */
body {
  font-family: 'Source Sans Pro', sans-serif;
}
\`\`\`

Wenn du die Seite jetzt neu lädst, siehst du die neue Schrift.
```

## Glossary

### Existing Asset: chpollin/llmdh Glossary

Christopher's GenAI glossary (https://github.com/chpollin/llmdh/tree/main/glossary) is a ready-made component:
- 71+ entries, bilingual (DE/EN), with difficulty levels and category tags
- Standalone HTML/JS/CSS with search, alphabet nav, category filter, language toggle
- Markdown as data source (`glossar_de.md`, `glossary_en.md`), parsed at runtime by `glossary.js`
- Design: Georgia serif, blue accent (#2c5aa0), expandable cards

### Integration Options

| Option | Approach | Pros | Cons |
|--------|----------|------|------|
| **A) Embed as-is** | Copy glossary HTML/JS/CSS into tutorial, link from sidebar | Full feature set, no rework | Separate from Docsify rendering, different look |
| **B) Docsify page + JS widget** | glossar.md as Docsify page, embed glossary.js via Docsify plugin | Integrated in sidebar nav, search works | Needs adapter for Docsify context |
| **C) Static Docsify Markdown** | Convert subset of terms to plain glossar.md with anchor IDs | Pure Docsify, simplest, Kerstin can edit | Loses search/filter features |

**Entschieden: Option C (natives Docsify Markdown)** – Glossary lebt als glossar.md. Docsify generiert IDs automatisch aus Heading-Text (z.B. `### Context Rot` → `id="context-rot"`). Docsify-Search indiziert automatisch, Lektionen verlinken direkt auf Einträge (`glossar.md#context-rot`). Kein Custom-JS nötig. Upgrade auf Option B möglich, falls native Features nicht ausreichen.

### Inline Usage in Lessons

Link to glossary terms: `[API](glossar.md#api)` or parenthetical: "über die Google Sheets API (eine Schnittstelle für den Datenabruf)"

## Visual Design

### Typography
- Body: system sans-serif or Source Sans Pro (clean, readable)
- Code: system monospace
- Headings: same as body, bolder weight

### Color
- Minimal palette, follows Hub design if possible
- Callout colors via Docsify defaults or docsify-themeable overrides
- Light background, dark text, one accent color

### Layout
- Content area: max 800px width for readability
- Sidebar: 250-300px
- Responsive: sidebar collapses to hamburger on mobile (Docsify default)

## i18n (Future)

When multilingual is needed:
```
tutorial/
├── de/
│   ├── README.md
│   ├── 01-preparation.md
│   └── ...
├── en/
│   ├── README.md
│   ├── 01-preparation.md
│   └── ...
└── _navbar.md  # Language switcher
```

Start with German only. Add English when content stabilizes.
