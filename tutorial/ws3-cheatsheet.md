# WS3 Cheat Sheet: Datenmodell & Sheets

> Schnellreferenz zum Workshop 3 (Datenmodell und Validierung in Google Sheets). Zum Ausdrucken, an den Zweit-Monitor pinnen, neben das Sheet legen.

**Voraussetzungen:** WS1 (GenAI), WS2 (Web, Claude Code)
**Vertiefung:** [Lektion 3: Das Datenmodell verstehen](03-datenmodell-hybrid.md)
**Slides:** <a href="slides/Workshop%203%20-%20Legal%20History%20Hub%20-%20mpilhlt%20-%20Datenmodell%20und%20Validierung%20in%20Google%20Sheets.pdf" target="_blank" rel="noopener">Workshop 3 – Slides (PDF)</a>

## Wide oder Long? Die Faustregel

| Wenn ein Feld ... | Dann ... | Beispiel |
|---|---|---|
| genau **einen** Wert pro Projekt hat | **Wide** im `core`-Tab | Titel, Status, Startjahr |
| 1 bis N Werte, **N klein und fix** | **Wide** mit `url1`, `url2`, `url3` | Maximal 3 URLs |
| **unbegrenzt viele** Werte haben kann | **Long** in eigenem Tab (Junction Table) | Personen, Keywords, Regionen |

Faustregel in einem Satz: *Kann ein Projekt mehrere davon haben? Dann long.*

## Die Drei-Stufen-Dropdown-Strategie

> *vocabulary ist Vorschrift, authority ist Nachschlagewerk, _helpers ist die Brille.*

| Stufe | Tab | Was drin steht | Dropdown-Modus |
|---|---|---|---|
| **vocabulary** | `vocabulary` | Geschlossene Enums: `person_roles`, `institution_relations`, `status_values` | Eingabe **ablehnen** |
| **authority** | `authority` | Normdatei mit PIDs (ORCID, GND, ROR, Wikidata) – **nie direkt** an Dropdowns gebunden | – |
| **_helpers** | `_helpers` | Gefilterte Sichten per `FILTER`-Formel, eine Spalte pro Typ | Warnung anzeigen |

Authority wird nie direkt gebunden, weil ein Dropdown sonst Personen, Institutionen, Keywords und Regionen vermischen würde. `_helpers` filtert: `=FILTER(authority[label]; authority[type]="person")`.

## Wenn etwas fehlt: wohin pflegen?

| Neue Sache | Wohin eintragen | Effekt |
|---|---|---|
| **Neue Person** | `authority`: neue Zeile, `type=person`, Name, ORCID (falls bekannt) | erscheint automatisch in `_helpers[person_labels]` und im `people`-Dropdown |
| **Neue Institution** | `authority`: neue Zeile, `type=institution`, Name, GND/ROR | automatisch im `institutions`-Dropdown |
| **Neues Keyword / Subject / Region** | `authority`: `type=keyword` / `subject` / `region`, Übersetzungen, GND/Wikidata (typ-spezifische Zusatzspalten siehe `authority`-Header im Sheet) | automatisch im passenden Dropdown |
| **Neue Rolle** (z.B. `postdoc`) | `vocabulary`: Spalte `person_roles`, unten anhängen | sofort im `people.role`-Dropdown |
| **Neuer Status** (z.B. `on-hold`) | `vocabulary`: Spalte `status_values` | sofort im `core.status`-Dropdown |
| **Neue Beziehungsart** (z.B. `funder`) | `vocabulary`: Spalte `institution_relations` | sofort im `institutions.relation`-Dropdown |

**Zwei Regeln:**
- **Neue Werte mit PID** (Personen, Institutionen, Keywords): immer in `authority`.
- **Neue Werte aus geschlossener Liste** (Rollen, Status): immer in `vocabulary`.

## Wenn sich etwas ändert (Edit-Workflow)

| Situation | Vorgehen |
|---|---|
| **Tippfehler in einem Namen** | In `authority` korrigieren. `_helpers` zieht sofort nach. Bestehende Zeilen mit dem alten Wert werden als Warnung markiert (weil nicht mehr in helpers). |
| **Bulk-Korrektur** in Long-Tabs nach Authority-Fix | Claude Code: *„Ersetze in `people.person` alle Vorkommen von 'Alt, Name' durch 'Neu, Name'."* |
| **Projekt-Titel ändern** | Nur in `core.title_de` / `_en` / `_es`. Die `title_de`-Formeln in den Long-Tabs aktualisieren sich automatisch. |
| **Rolle umbenennen** (z.B. `project-coordinator` → `coordinator`) | Erst in `vocabulary.person_roles` umbenennen, dann alle `people.role`-Einträge per Find-Replace (`Ctrl+H`) nachziehen. Ohne zweiten Schritt bleiben alte Werte als Warnung stehen. |

## Rezepte für Google Sheets

### Tab zu einer Table konvertieren
1. In den Tab klicken, irgendeine Zelle auswählen
2. `Format → In Tabelle konvertieren`
3. Bereich bestätigen, Tabellennamen setzen (z.B. `core`)

**Effekt:** Spalten-Typen, Auto-Expansion, benannte Referenzen (`core[project_id]`).

### `title_de`-Lesehilfe in Long-Tabs
In Spalte `B` nach `project_id`:
```
=XLOOKUP(A2; core[project_id]; core[title_de]; "")
```

Falls Auto-Expansion nicht greift: `B2:Bn` markieren, `Ctrl+D` drücken.

### Dropdown aus Bereich einrichten
1. Ziel-Zelle anklicken, `Daten → Datenvalidierung`
2. **Kriterien:** *„Drop-down (aus einem Bereich)"*
3. Bereich: strukturierte Referenz, z.B. `vocabulary[person_roles]`
4. Bei **Ungültige Daten:** *„Eingabe ablehnen"* bei Bindung an `vocabulary`. *„Warnung anzeigen"* bei Bindung an `_helpers` oder an `core[project_id]` (Foreign Key).
5. Farb-Chips pro Wert zuweisen: im selben Panel neben jedem Wert auf die Farb-Kugel klicken und Farbe wählen.

### Datenansicht pro Projekt (Filter View)
1. `Daten → Datenansichten → Neue Datenansicht erstellen`
2. Filter auf `project_id = "proj-001"`
3. Speichern als *„proj-001 people"*

Jede Person kann eigene Ansichten haben, gleichzeitig, ohne Störung.

### Ansicht „Gruppieren nach"
Im Table-Header auf den Pfeil neben dem Tabellennamen → *„Ansicht 'Gruppieren nach' erstellen"* → `project_id` wählen.

Ergebnis: aufklappbare Blöcke mit Anzahl pro Projekt. Long-Tab liest sich projekt-zentriert.

### Bedingte Formatierung einrichten
1. Zeilenbereich markieren (z.B. `A2:L50`)
2. `Format → Bedingte Formatierung`
3. **Benutzerdefinierte Formel ist:** z.B. `=$K2="v"`
4. Hintergrundfarbe wählen (grün), speichern

**Die Dollar-Zeichen:**
- `$K` = immer Spalte K prüfen, egal in welcher Spalte die aktuelle Zelle liegt
- `2` ohne `$` = Zeile wird relativ angepasst

Regel-Beispiele im `core`-Tab: `verified="v"` → grün, `status="completed"` → grau.

## Tastenkürzel und Checks

| Kürzel / Aktion | Wirkung | Wann nutzen |
|---|---|---|
| `Ctrl+D` | Fill Down: kopiert Formel nach unten | Wenn Table-Auto-Expansion nicht greift |
| `Ctrl+End` | springt zur letzten genutzten Zelle | Nach KI-Edit prüfen: „Ist der Used-Range wirklich dort, wo er sein soll?" |
| `Ctrl+Z` | rückgängig | Nach misslungenem KI-Edit (notfalls 20x) |
| `Ctrl+K` | Link einfügen | Für URLs in `core` |
| **10-Sek-Dropdown-Check** | Zelle anklicken, `Daten → Datenvalidierung`. Kriterien: *„Drop-down"* = **hartkodiert, umbauen**. *„Drop-down (aus einem Bereich)"* = **richtig**. | Immer, wenn jemand ein neues Dropdown einrichtet |

## Die Semikolon-Falle

Deutsches Sheets verwendet **Semikolon** als Argument-Trenner, weil Komma das Dezimaltrennzeichen ist.

| Falsch (englisch) | Richtig (deutsch) |
|---|---|
| `=XLOOKUP(A2, core[project_id], core[title_de], "")` | `=XLOOKUP(A2; core[project_id]; core[title_de]; "")` |

**Bei `#ERROR!` zuerst:** Kommas durch Semikolons ersetzen.

Gebietsschema prüfen: `Datei → Einstellungen → Gebietsschema` (Deutschland/Österreich/Schweiz).

## Skill oder Script?

Nicht jedes wiederkehrende Problem ist ein Skill-Problem.

| | **Python-Script** | **Skill** (`.md`-Prompt) |
|---|---|---|
| Input → Output | deterministisch | variabel, kontextabhängig |
| Fehlermodus | Exception | Halluzination möglich |
| In CI ausführbar | ja | nein |
| Hub-Beispiel | `scripts/build-hub-data.py` | `/explain-model`, `/enrich-authority` |

**Regel:** Gleicher Input → gleicher Output = **Script**. Claudes Urteil ist Teil des Werts = **Skill**.

## Top-Prompts für Claude Code

### Modell verstehen
```
Öffne unser Google Sheet im Chrome und erkläre das Hybrid-Modell
in eigenen Worten.
```
```
Was ist der Unterschied zwischen dem core-Tab (wide) und dem
people-Tab (long)? Nimm proj-001 als Beispiel.
```

### Modell erweitern
```
Ich möchte ein Feld "[Feldname]" pro Projekt speichern.
Stell mir die Fragen, die du brauchst, um zu entscheiden,
ob das wide (core) oder long (eigener Tab) werden soll.
```

### Validieren
```
Prüfe die Tabs gegen sich selbst. Finde Inkonsistenzen.
```
```
Zeig mir jede Zeile im people-Tab, deren role nicht in
vocabulary[person_roles] vorkommt.
```
```
Gibt es project_ids in den Long-Tabs, die im core nicht existieren?
```
```
Welche Personen stehen in people, fehlen aber in authority?
```

### Build (Python-Script, **kein** Skill)
```
Baue projects.json neu via scripts/build-hub-data.py.
Zeig mir die Ausgabe und etwaige Validierungs-Warnungen.
```

Das Build-Skript ist ein deterministisches Python-Script. Claude Code hat es geschrieben und führt es über Bash aus. Es ist bewusst **kein** Skill: gleicher Input soll zu gleichem Output führen.

### Validieren mit Skill
```
/validate-data
```

Der Skill liest das Sheet, erklärt Findings in Worten, priorisiert, schlägt Fixes vor. Ein reiner Checker ohne Erklärung wäre besser ein Script.

### Anreichern
```
Öffne das Sheet über /chrome und lies den authority-Tab.
Welche Personen haben keine ORCID? Schlag für jede eine plausible
ORCID via Web-Suche vor, ich bestätige einzeln.
```

> **Chrome aktivieren:** Im Terminal mit `/chrome`. In der VS-Code-Extension gibt es `/chrome` **nicht** – stattdessen `@browser` im Prompt-Feld schreiben (offizielle Variante, [Docs](https://code.claude.com/docs/en/vs-code#automate-browser-tasks-with-chrome)). Die Chrome-Extension muss in beiden Fällen installiert und Chrome offen sein.

## Drei Merksätze für den Umgang mit KI

| Regel | Heißt konkret |
|---|---|
| **Verifiziere immer.** | Nie einem KI-Bericht glauben ohne das Artefakt selbst zu prüfen. Sheet: `Ctrl+End`, Filter auf Verdachts-Werte. Code: `git diff`, Tests. |
| **Klein statt komplex.** | Lieber 5 atomare Aufträge als einen großen. Jeder Schritt ist dann einzeln prüfbar. |
| **Ein Bericht ist kein Beweis.** | *„Ich habe X erledigt"* ist eine Behauptung. Der Beweis liegt im Artefakt. |

Herkunft: Gemini-in-Sheets hat in der WS3-Vorbereitung einen Auftrag in fünf Tabs halluziniert und trotzdem „erfolgreich" gemeldet. Daraus die Lehre. Die drei Regeln gelten für **jede** KI, auch für Claude Code.

## Terminologie auf einen Blick

| Begriff | Kurzdefinition |
|---|---|
| **Wide** | Eine Zeile pro Entität, viele Spalten. Gut für Singletons. |
| **Long (Tidy)** | Eine Zeile pro Fakt/Beziehung. Gut für Many-to-Many. |
| **Hybrid** | Unser Ansatz: wide für Singletons, long für Beziehungen. |
| **Singleton** | Feld mit genau einem Wert pro Entität (Titel, Status). |
| **Junction Table** | Tabelle, die Many-to-Many auflöst. Bei uns: people, institutions, subjects, regions, keywords. |
| **Foreign Key** | Verweis in andere Tabelle, z.B. `project_id`. |
| **1NF** | Codd 1970: in jeder Zelle genau ein Wert, keine Listen. |
| **Normdatei / Authority** | Referenzliste mit eindeutigen Schlüsseln. Unser `authority`-Tab. |
| **PID** | Persistent Identifier. ORCID (Personen), GND (Bibliotheks-Normdaten), ROR (Organisationen), Wikidata (Begriffe). |
| **FAIR** | Findable, Accessible, Interoperable, Reusable. PIDs machen Daten FAIR-konform. |
| **Source of Truth** | Die eine Stelle, an der der richtige Wert steht. Bei uns: `core.title_de`. |
| **Derived View / _helpers** | Abgeleitete Sicht, per `FILTER` aus einer Quelle berechnet. |
| **Spill-Range** | Formel, die automatisch mehrere Zeilen befüllt. |
| **Structured Reference** | Tabellen-basierte Formel-Syntax: `core[project_id]`. |

Ausführlichere Definitionen: [Glossar](glossar.md).

## Siehe auch

- [Lektion 3: Das Datenmodell verstehen](03-datenmodell-hybrid.md) – ausführliche Erklärung
- <a href="slides/Workshop%203%20-%20Legal%20History%20Hub%20-%20mpilhlt%20-%20Datenmodell%20und%20Validierung%20in%20Google%20Sheets.pdf" target="_blank" rel="noopener">Workshop 3 – Slides (PDF)</a> – die Folien zum Workshop
- [Glossar](glossar.md) – alle Fachbegriffe
- Der `_readme`-Tab im Sheet selbst als kompakte Notiz für Bearbeiter
