# Lektion 3: Das Datenmodell verstehen

> Warum unser Google Sheet so aussieht, wie es aussieht. Und wie die Dropdowns funktionieren.

**Schwierigkeit:** Grundlagen
**Dauer:** ca. 25 Minuten
**Voraussetzungen:** keine, nur Neugier

## Worum geht es?

Der Legal History Hub hat ein **Datenmodell**, also eine Vorschrift, wie Projekt-Informationen in einer Tabelle stehen. Diese Vorschrift ist nicht beliebig: Sie ist so gewählt, dass

1. Menschen das Sheet gut lesen und pflegen können,
2. Google Sheets die Daten sinnvoll filtern und sortieren kann,
3. Claude Code daraus automatisch die Webseite bauen kann.

Alle drei Ziele gleichzeitig zu erfüllen, geht nicht mit dem simpelsten Modell. Deshalb gibt es unseren **Hybrid-Ansatz**. Diese Lektion erklärt, warum.

## Das Grundproblem: ein Projekt, viele Personen

Stellen wir uns vor, du willst für jedes Projekt die Personen speichern, die daran arbeiten. Klingt einfach. Aber es ist mehr als eine Person pro Projekt. Wie machen wir das?

### Versuch 1: Alles in eine Zelle

```
| project_id | personen                                           |
| proj-001   | Duve, Lutz-Bachmann, König, Birr, Rico Carmona... |
```

Eine Zeile pro Projekt, alle Namen hintereinander in einer Zelle.

**Klingt gut:** kompakt, eine Zeile genügt pro Projekt.

**Ist aber schlecht:** Google Sheets sieht in der Zelle nur **einen Text**. Es kann nicht einzelne Namen finden, nicht zählen *"wie viele Personen hat proj-001?"*, nicht filtern auf *"alle Projekte mit Duve"*. Tippfehler bleiben unsichtbar. Und wer entscheidet, ob Semikolon oder Komma das Trennzeichen ist?

In der Datenbankwelt hat dieses Problem einen Namen: es verletzt die **erste Normalform (1NF)**. Die 1NF ist eine Regel aus der relationalen Datenbanktheorie (formuliert von Edgar F. Codd 1970) und besagt: *"In einer Zelle steht genau ein atomarer Wert, keine Liste, kein Trennzeichen-Chaos."* Unsere Zelle oben enthält aber eine **Wiederholungsgruppe** (*"repeating group"*): mehrere Werte in einem Text. 1NF verletzt. Deshalb sperrt sich Sheets, damit zu arbeiten.

### Versuch 2: Viele Spalten

```
| project_id | person_1 | person_2 | person_3 | person_4 | ...
| proj-001   | Duve     | L-B      | König    | Birr     |
```

Eine Spalte pro Person. Endlich einzelne Zellen.

**Klingt gut:** Zellen statt Textsuppe.

**Ist aber schlecht:** Wie viele Spalten reichen? Wenn ein Projekt 20 Personen hat, brauchst du Spalten `person_1` bis `person_20`. Bei drei Personen sind siebzehn Zellen leer. Das Sheet wird ein endloses Rechteck mit löchriger Mitte. Und wenn jemand eine 21. Person braucht, musst du das Schema ändern.

### Versuch 3: Eigene Tabelle für Personen

```
| project_id | person              |
| proj-001   | Duve, Thomas        |
| proj-001   | Lutz-Bachmann, M.   |
| proj-001   | König, Florian      |
| proj-002   | Collin, Peter       |
```

Eine **eigene Tabelle** (einen eigenen Tab) für Personen. Jede Zeile ist eine Person in einem Projekt. Zehn Personen in proj-001? Zehn Zeilen. Eine Person in proj-002? Eine Zeile. Keine Obergrenze, keine leeren Spalten, keine Textsuppe.

**Das ist die Lösung.** In der Datenwelt heißt dieses Format **long** (auch: *stacked*, *tidy*), im Gegensatz zu **wide** (auch: *unstacked*, alles nebeneinander). Der Statistiker Hadley Wickham hat das Prinzip 2014 unter dem Namen **Tidy Data** populär gemacht: *"Jede Variable ist eine Spalte, jede Beobachtung eine Zeile, jede Entitätsart eine Tabelle."* Unser neuer Tab für Personen erfüllt genau diese Regeln.

In der Datenbanksprache nennt man so eine verbindende Tabelle **Junction Table** (auch: *Bridge Table*, *Linking Table*, Brückentabelle). Sie löst eine **Many-to-Many-Beziehung** (m:n) auf: viele Projekte haben viele Personen, viele Personen arbeiten an vielen Projekten. Die Junction Table ist der Ort, an dem solche Beziehungen wohnen. Unser `people`-Tab ist eine Junction Table zwischen Projekten und Personen.

Die `project_id` in jeder Zeile ist ein **Foreign Key** (Fremdschlüssel): ein Verweis, der sagt *"diese Zeile gehört zu genau dem Projekt mit dieser ID im core-Tab"*. Foreign Keys sind der Kitt zwischen Tabellen.

## Der Hybrid: wide, wenn es passt; long, wenn es sein muss

Jetzt kommt die Pointe. Nicht **alle** Felder brauchen das long-Format.

Einige Felder haben immer **genau einen Wert** pro Projekt:

- Ein Projekt hat **einen** Titel auf Deutsch.
- Ein Projekt hat **einen** Status (aktiv, abgeschlossen, geplant).
- Ein Projekt hat **ein** Startjahr.

Solche Felder nennt man **Singletons** (von englisch *single* = einzeln): Ein-Wert-Felder. Für Singletons wäre es übertrieben, einen eigenen Tab anzulegen. Die gehören flach in die Hauptzeile.

Andere Felder haben **viele Werte** (Many-to-Many-Beziehungen):

- Ein Projekt hat mehrere **Personen**.
- Ein Projekt hat mehrere **Institutionen**.
- Ein Projekt hat mehrere **Themen** (Subjects).
- Ein Projekt hat mehrere **Regionen**.
- Ein Projekt hat mehrere **Keywords**.

Für solche Felder brauchen wir eigene Tabs.

**Die Faustregel:**

| Wenn ein Feld ... | Dann ... |
|---|---|
| genau einen Wert hat | kommt es in den **core**-Tab (eine Zeile pro Projekt, viele Spalten) |
| mehrere Werte haben kann | bekommt es einen **eigenen Tab** (eine Zeile pro Beziehung) |

Das Ergebnis: unser Sheet hat **einen breiten Tab (core)** für die Einzelwerte und **fünf lange Tabs** (people, institutions, subjects, regions, keywords) für die Beziehungen.

Wide **und** long, nicht entweder-oder. Deshalb **Hybrid**.

## Ein Exkurs: Normalformen und warum wir nicht ganz relational werden

In der Datenbanktheorie gibt es neben der **1NF** (keine Wiederholungsgruppen) auch die **2NF** und **3NF** (weiter verfeinerte Regeln, wie man Redundanz aus Daten entfernt). Der Prozess heißt **Normalisierung**. Ein perfekt normalisiertes Modell hätte für jeden Entitätstyp eine eigene Tabelle (Projekte, Personen, Institutionen, Themen) und dazwischen Junction Tables mit Foreign Keys. Keine Wiederholungen, keine Redundanz.

Wir machen das **nicht ganz**. Unser `people`-Tab enthält neben `project_id`, `person` und `role` auch `title_de` (den deutschen Projekttitel). Das ist **redundant**, weil der Titel auch in `core.title_de` steht. Ein reines 3NF-Modell würde das verbieten.

Warum machen wir es trotzdem? Weil **Google Sheets keine Datenbank ist**. Wenn Kerstin im `people`-Tab arbeitet, will sie sehen, zu welchem Projekt eine Person gehört, ohne in einem anderen Tab nachzuschlagen. Die Redundanz ist für Menschen **eine Lesehilfe**, keine Datenspeicherung. Deshalb ist `title_de` im `people`-Tab eine **Formel**, die sich automatisch aus `core.title_de` holt (`XLOOKUP`). **Source of Truth** bleibt core.

Motto: *"Datenbank-Eleganz ist uns egal, Lesbarkeit für Menschen nicht."*

## Warum nicht alles in long?

Gute Frage. Man könnte theoretisch auch alles in long-Format gießen, so:

```
| project_id | feld       | wert                    |
| proj-001   | title_de   | Die Schule von Salamanca|
| proj-001   | status     | active                  |
| proj-001   | year_start | 2013                    |
| proj-001   | person     | Duve, Thomas            |
| proj-001   | person     | Lutz-Bachmann, M.       |
```

Technisch sauber. Aber für einen Menschen zum **Lesen und Editieren** unzumutbar. Du siehst nirgendwo das Projekt als Ganzes. Du müsstest für jede einfache Änderung die richtige Zeile suchen.

Menschen lesen wide gut, Maschinen lesen long gut. Der Hybrid bedient beide.

## Warum nicht alles in wide?

Auch das geht nicht, und zwar aus den Gründen aus Versuch 2 oben. Sobald es um Felder geht, die mehrere Werte haben, führt wide zu leeren Spalten oder starren Obergrenzen.

Der Hybrid ist also keine Kompromisslösung, sondern eine **Frage der passenden Form für den jeweiligen Feldtyp**. Jede Information bekommt die Form, die zu ihr passt.

## Die drei Stufen hinter den Dropdowns

Wenn du in einer Zelle klickst und einen kleinen Pfeil siehst, kommt eine Liste von Werten zur Auswahl. Das sind **Dropdowns**, und sie helfen dabei, dass du nicht aus Versehen Tippfehler machst oder erfundene Werte einträgst.

Hinter jedem Dropdown steht eine **Liste**, die von irgendwoher kommt. In unserem Sheet gibt es **drei verschiedene Quellen** für solche Listen, und es lohnt sich, die zu kennen, damit du weißt, wo du was pflegst.

### Stufe 1: `vocabulary` ist die Vorschrift

Manche Werte sind **fest gegeben**. Ein Projekt-Status ist entweder `active`, `completed` oder `planned`. Es gibt keine vierte Möglichkeit. Eine Person-Rolle ist `PI`, `researcher`, `project-coordinator` oder `student-assistant`. Mehr ist nicht vorgesehen.

In der Programmier- und Datenbanksprache nennt man so eine geschlossene Liste zulässiger Werte ein **Enum** (kurz für *enumeration*, Aufzählung). In den Digital Humanities spricht man auch von **kontrolliertem Vokabular**: eine bewusst kleine, verbindliche Wortliste, aus der man auswählt, statt frei zu formulieren.

Solche Enums wohnen im Tab **`vocabulary`**. Kurze Spalten, feste Werte, keine Zusatzinformationen. Wenn du in einem Dropdown einen Wert aus vocabulary auswählst, wird eine andere Eingabe **abgelehnt**. Die Liste ist geschlossen.

**Was in vocabulary lebt:**

- `person_roles` (Rollen in people)
- `institution_relations` (Beziehungsarten in institutions)
- `status_values` (Projekt-Status in core)

Merksatz: *vocabulary ist Vorschrift.* Was nicht drin ist, darf nicht eingetragen werden.

### Stufe 2: `authority` ist das Nachschlagewerk

Andere Werte sind keine geschlossene Liste. Personen zum Beispiel. Jeden Moment kann eine neue Person hinzukommen. Institutionen, Themen, Regionen, Keywords sind genauso.

Für diese Werte hat das Sheet einen eigenen Tab namens **`authority`**. Dort stehen alle Entitäten, die im Hub vorkommen: alle Personen, alle Institutionen, alle Themen, alle Regionen, alle Keywords.

Und: in authority stehen **Zusatzinformationen** dazu, die vocabulary nicht hat. Zu einer Person gehört ihre **ORCID** (Open Researcher and Contributor ID, eine weltweit eindeutige Forscher-Kennung). Zu einer Institution gehört ihre **ROR-ID** (Research Organization Registry) und ihre **GND-ID** (Gemeinsame Normdatei der Deutschen Nationalbibliothek). Zu einem Thema gehören die **GND-ID** und die **Wikidata-ID** (aus dem offenen Wissensgraph Wikidata).

Das sind alles **Persistent Identifiers** (PIDs): kurze Zeichenketten, die eine Person, Institution oder einen Begriff weltweit eindeutig ansprechbar machen, unabhängig von Tippvariationen. *"Duve, Thomas"* ist nur ein Text; seine ORCID `0000-0002-1658-4173` ist ein eindeutiger Schlüssel, den andere Systeme weltweit wiedererkennen.

Diese Persistent Identifiers sind zentral für die **FAIR-Prinzipien** der digitalen Forschungsdaten: **F**indable, **A**ccessible, **I**nteroperable, **R**eusable. PIDs machen Daten findable (auffindbar über Kataloge) und interoperable (verlinkbar mit anderen Datensätzen). Der Hub profitiert davon automatisch, ohne dass Kerstin PIDs pro Projekt eintippt: sie stehen einmal in authority, beim Build werden sie überall dort eingezogen, wo Personen oder Institutionen genannt werden.

**Technischer Begriff für authority:** *Normdatei*, *Gazetteer* (für geographische Entitäten), oder *Authority File* (in der bibliothekarischen Tradition). Es ist eine Referenzliste, die Namen mit eindeutigen Schlüsseln versieht.

**Was in authority lebt:**

- Personen (mit ORCID)
- Institutionen (mit GND, ROR)
- Themen, Regionen, Keywords (mit GND, Wikidata, wenn möglich)

Merksatz: *authority ist Nachschlagewerk.* Wer da drin steht, wird automatisch mit Zusatzinformationen angereichert.

**Ein wichtiger Unterschied zu vocabulary:** Wenn du in people eine Person einträgst, die noch **nicht** in authority steht, ist das **nicht verboten**. Die Zelle wird nur rot markiert, als Erinnerung: *"Diese Person kennen wir noch nicht. Wenn sie wichtig ist, trag sie in authority nach."* Du kannst aber trotzdem weiterarbeiten. Authority ist ein lebendiges Nachschlagewerk, das wachsen darf.

### Stufe 3: `_helpers` ist die Brille

Jetzt kommt der Trick. Authority enthält **alle** Entitäten durcheinander: Personen, Institutionen, Themen, Regionen, Keywords. Eine Spalte namens `type` unterscheidet sie.

Wenn du nun in `people.person` ein Dropdown haben willst, das nur **Personen** anzeigt, und nicht alle Institutionen und Themen zur Auswahl wirft, brauchst du eine **gefilterte Sicht** auf authority.

Genau das macht der Tab **`_helpers`**. Der Unterstrich am Anfang ist eine **Namenskonvention** (übernommen aus der Programmierung, wo Unterstriche oft *"intern, technisch, nicht direkt nutzen"* bedeuten). Der Tab enthält fünf Spalten:

- `keyword_labels` (nur Keywords aus authority)
- `person_labels` (nur Personen aus authority)
- `institution_labels` (nur Institutionen aus authority)
- `subject_labels` (nur Themen aus authority)
- `region_labels` (nur Regionen aus authority)

Jede Spalte ist eine **Formel** (konkret: `=FILTER(authority[label]; authority[type]="person")`), die aus authority genau die passenden Einträge herausfiltert. Die Formel ist ein **Spill-Range** (auf Deutsch: *dynamischer Array*): eine einzige Formel in Zeile 2 produziert automatisch so viele Ergebniszeilen, wie es passende Einträge gibt. Wächst authority, wächst der Filter mit.

Die Dropdowns in people, institutions, subjects, regions und keywords zeigen dann auf diese Helper-Spalten, nicht direkt auf authority.

Warum der Umweg? Weil Google Sheets **Dropdowns nicht direkt filtern kann**. Ein Dropdown kann an einen Bereich binden, aber nicht sagen *"zeig mir nur die Zeilen, wo type = person ist"*. Wir brauchen eine Zwischenebene, die die Filterung vorwegnimmt. Das ist _helpers.

In Software-Architektur-Sprache nennt man so eine Ebene einen **Derived View** oder eine **Projection**: abgeleitete Daten, die aus einer Quelle berechnet werden. Der Unterschied zu echten Daten: wenn du in _helpers eine Zelle änderst, ist der Effekt nicht von Dauer, weil die Formel die Zelle sofort wieder aus authority neu berechnet. **Schreiben immer in authority, lesen auch über _helpers**.

Der Clou: Wenn du in authority eine neue Person einträgst, taucht sie **automatisch** in `_helpers[person_labels]` auf, und damit **automatisch** im Dropdown von `people.person`. Nichts doppelt pflegen. Authority ist die Quelle, _helpers ist die Brille, Dropdowns sind das, was man durch die Brille sieht.

Merksatz: *_helpers ist Brille.* Sie zeigt eine gefilterte Ansicht von authority, damit Dropdowns sinnvoll bedienbar sind.

### Die drei Stufen auf einen Blick

| Stufe | Rolle | Was drin steht | Wie gebunden | Modus |
|---|---|---|---|---|
| **vocabulary** | Vorschrift | Rollen, Status, Relations | direkt: `vocabulary[person_roles]` | Eingabe ablehnen |
| **authority** | Nachschlagewerk | Entitäten mit IDs (ORCID, GND, ...) | nie direkt, nur über helpers | - |
| **_helpers** | Brille | Gefilterte Sichten pro Typ | `helpers[person_labels]` usw. | Warnung anzeigen |

## Wer pflegt was, wenn etwas fehlt?

Stell dir vor, ein neues Projekt kommt dazu. Du musst eine neue Person eintragen, die es im Sheet noch nicht gibt. Was machst du?

**Fall A: Neue Person.**
1. Trag die Person im `people`-Tab ein, in einer neuen Zeile. Die Zelle wird rot markiert (Person ist noch nicht in authority).
2. Wechsle zum `authority`-Tab. Hänge unten eine neue Zeile an: label = `Name, Vorname`, type = `person`, ORCID dazu (falls bekannt, sonst leer).
3. Zurück zu `people`. Die rote Markierung verschwindet, die Person ist jetzt im System.

**Fall B: Neue Rolle.**
Eine Rolle, die noch nicht in vocabulary steht. Zum Beispiel `postdoc`.

1. Wechsle zum `vocabulary`-Tab, Spalte `person_roles`. Hänge unten `postdoc` an.
2. Im `people`-Tab ist `postdoc` sofort im Dropdown verfügbar.

**Fall C: Neues Keyword.**
Ein Keyword, das noch nicht in authority steht.

1. Wechsle zum `authority`-Tab. Neue Zeile: label = `mein-neues-keyword`, type = `keyword`, Übersetzungen (optional), GND/Wikidata (optional).
2. Im `keywords`-Tab ist das Keyword sofort im Dropdown verfügbar.

**Fall D: Neues Thema oder neue Region.**
Gleiches Prinzip wie C, nur `type = subject` oder `type = region`.

**Fall E: Status, den es noch nicht gibt.**
Wahrscheinlich brauchst du das nicht, weil `active`/`completed`/`planned` die drei Standardfälle abdecken. Falls doch (z.B. `on-hold`), im `vocabulary`-Tab Spalte `status_values` ergänzen. Analog für institution_relations.

## Warum das ganze System sinnvoll ist

Für dich als Editor:

- **Neue Werte eintragen** geht an einer eindeutigen Stelle, nicht an fünf.
- **Tippfehler werden sofort rot markiert**, statt erst beim Build aufzufallen.
- **Zusatzinformationen** (ORCID, GND, Wikidata) leben an einem Ort, nicht verteilt pro Projekt.
- **Übersichten** (wie viele Projekte zu Keyword X?) sind mit einem Filter machbar.

Für den Hub:

- Claude Code liest alle Tabs, verbindet sie per `project_id`, reichert mit ORCID/GND/ROR an und baut die Webseite.
- Eine Änderung in `core.title_de` läuft automatisch durch den ganzen Hub, ohne dass jemand sie pro Projekt-Seite anpassen muss.
- Die Identifikatoren machen den Hub **FAIR-konform** (Findable, Accessible, Interoperable, Reusable) im Sinne der digitalen Forschungsdaten-Prinzipien.

## Zusammenfassung als Merksätze

Wenn du dir drei Sätze merkst, hast du das System verstanden:

1. **Wide für Singletons, long für Relationen.** Ein Wert pro Projekt → core. Mehrere Werte pro Projekt → eigener Tab (Junction Table mit Foreign Key auf `core.project_id`).
2. **Vocabulary ist Vorschrift, authority ist Nachschlagewerk.** Geschlossene Enums vs. offene Normdatei mit Persistent Identifiers (ORCID, GND, ROR, Wikidata).
3. **_helpers ist die Brille.** Derived Views per FILTER-Formel, damit Dropdowns sinnvoll bedienbar sind.

## Glossar der Fachbegriffe auf einen Blick

| Begriff | Bedeutung in unserem Modell |
|---|---|
| **Wide / Long (Tidy)** | Zwei Tabellenformate. Wide: eine Zeile pro Entität, viele Spalten. Long: eine Zeile pro Beobachtung/Fakt. Tidy-Data-Prinzip nach Hadley Wickham (2014). |
| **Hybrid** | Unser Ansatz: wide für Singletons, long für Many-to-Many. |
| **Singleton** | Feld mit genau einem Wert pro Entität (Titel, Status, Jahr). |
| **Many-to-Many (m:n)** | Beziehung mit vielen Werten auf beiden Seiten (viele Projekte, viele Personen). Braucht Junction Table. |
| **Junction Table** | Tabelle, die eine m:n-Beziehung auflöst. Bei uns: people, institutions, subjects, regions, keywords. |
| **Foreign Key** | Verweis auf eine andere Tabelle (z.B. `project_id` in people verweist auf `core.project_id`). |
| **1NF (erste Normalform)** | Regel aus der Datenbanktheorie (Codd 1970): eine Zelle enthält genau einen atomaren Wert, keine Listen, keine Wiederholungsgruppen. |
| **Repeating Group** | Wiederholte Gruppe (z.B. *"Name1; Name2; Name3"* in einer Zelle). 1NF-Verletzung. |
| **Normalisierung** | Prozess, ein Datenmodell Redundanz-frei zu machen (1NF → 2NF → 3NF). Wir machen es absichtlich nicht vollständig. |
| **Source of Truth** | Die eine Stelle, an der ein Wert verbindlich steht. Bei uns: `core.title_de`, nicht die Lesehilfen in den Long-Tabs. |
| **Enum** | Enumeration, geschlossene Liste zulässiger Werte. Wohnt in `vocabulary`. |
| **Kontrolliertes Vokabular** | DH-Begriff für Enum: bewusst kleine, verbindliche Wortliste. |
| **Normdatei / Authority File** | Referenzliste mit eindeutigen Schlüsseln für Entitäten. Bei uns: der `authority`-Tab. |
| **Persistent Identifier (PID)** | Weltweit eindeutige Kennung, z.B. ORCID für Personen, GND für Normdaten, ROR für Organisationen, Wikidata-IDs für Begriffe. |
| **FAIR-Prinzipien** | Findable, Accessible, Interoperable, Reusable. Forschungsdaten-Standards, zu denen PIDs beitragen. |
| **Derived View / Projection** | Abgeleitete Sicht auf eine Quelle (bei uns: _helpers filtert authority). |
| **Spill-Range / dynamischer Array** | Formel, die automatisch mehrere Zeilen befüllt. FILTER in _helpers. |
| **Pivot / Melt** | Operationen, um zwischen wide und long umzuschalten. Aus der pandas/R-Welt. |

Wenn du einen Begriff davon in einem anderen Kontext wiedersiehst (Fachliteratur, Konferenz, Stack Overflow), ist das kein Zufall. Das sind die Vokabeln, mit denen Datenleute weltweit über genau solche Fragen sprechen.

## Siehe auch

- Der `_readme`-Tab im Sheet selbst, als kompakte Notiz für Bearbeiter.
- Die Dokumentation in [docs/](../docs/) für technische Details zum Build-Prozess.
- [Lektion 1: GenAI und Prompt Engineering](01-genai-und-prompt-engineering.md) für den methodischen Rahmen.
- [Glossar](glossar.md) für Fachbegriffe auf einen Blick.
