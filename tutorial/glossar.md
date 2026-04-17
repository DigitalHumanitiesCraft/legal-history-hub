# Glossar

> Technische Begriffe, verständlich erklärt. Basierend auf dem [Applied GenAI Glossar](https://chpollin.github.io/llmdh/glossary/glossary.html).

Die Einträge sind nach **Kontext** sortiert: *„Wann brauche ich diesen Begriff?"*. Für die schnelle Suche nach einem bekannten Begriff: `Strg+F` im Browser oder die Docsify-Suche oben.

**Kategorien:**

1. [Wie KI funktioniert](#wie-ki-funktioniert) – LLM-Grundlagen und Eigenheiten
2. [Mit KI arbeiten](#mit-ki-arbeiten) – Prompting, Kontext, Methodik
3. [Werkzeuge: Claude Code und Co.](#werkzeuge-claude-code-und-co) – Tools, Skills, Plugins
4. [Web-Grundlagen](#web-grundlagen) – HTML, CSS, APIs, Hosting
5. [Git und Versionierung](#git-und-versionierung) – Repos, Commits, Zusammenarbeit
6. [Datenmodell in Google Sheets](#datenmodell-in-google-sheets) – Wide, Long, Tables, Formeln
7. [Normdaten und PIDs](#normdaten-und-pids) – Authority, ORCID, FAIR

---

## Wie KI funktioniert

### Alignment
Der Prozess, ein KI-Modell so zu trainieren, dass es hilfreich, harmlos und ehrlich antwortet. Methoden wie RLHF und Constitutional AI sind Teil davon.

### Autoregressive Generierung
Das Prinzip, nach dem LLMs Text erzeugen: Jedes vorhergesagte Token wird Teil des Kontexts für die nächste Vorhersage. Das Modell baut seinen Output Wort für Wort auf.

### Context Rot
Die Leistung eines LLM verschlechtert sich, je mehr Text im [Context Window](#context-window) steht – auch bei inhaltlich einfachen Aufgaben. Irrelevante Informationen lenken die Aufmerksamkeitsmechanismen ab. Mehr Kontext ≠ bessere Ergebnisse.

### Context Window
Das „Arbeitsgedächtnis" eines LLM: der maximale Textumfang (in [Tokens](#token)), den das Modell bei einer Anfrage verarbeiten kann. Umfasst Input (Anfrage + Kontext) und Output (generierte Antwort). Claude Opus: 200.000 Tokens.

### Embedding
Eine mathematische Darstellung von Text als Zahlenvektor in einem hochdimensionalen Raum. Ähnliche Bedeutungen liegen nahe beieinander: „Hund" und „Katze" sind näher als „Hund" und „Stein". So kann ein LLM Bedeutung mathematisch verarbeiten.

### Halluzination
Siehe [Konfabulation](#konfabulation). Der ältere, aber gebräuchlichere Begriff für dasselbe Phänomen. Ein dokumentiertes Beispiel: Gemini-in-Sheets hat in der WS3-Vorbereitung gemeldet, 5 Tabs modifiziert zu haben, obwohl nur einer (fehlerhaft) angefasst wurde.

### Knowledge Cutoff
Der Wissensstichtag eines LLM: das Datum, bis zu dem die Trainingsdaten reichen. Alles danach kennt das Modell nicht, sofern es keine externen Tools (z.B. Websuche) nutzt.

### Konfabulation
Wenn ein LLM plausibel klingende, aber erfundene Informationen erzeugt: falsche Zitate, nicht existierende Quellen, fehlerhafte Zahlen. Kein Fehler, sondern ein strukturelles Merkmal der Wahrscheinlichkeitsvorhersage. Auch [Halluzination](#halluzination) genannt.

### LLM
**Large Language Model** – ein KI-Modell, das auf riesigen Textmengen trainiert wurde und menschenähnlichen Text generieren kann. Beispiele: Claude, GPT, Gemini. Kernfunktion: Next Token Prediction.

### Next Token Prediction
Die Kernfunktion von LLMs: das nächste Token in einer Sequenz vorhersagen, basierend auf dem bisherigen Kontext. Dieser einfache Mechanismus, massiv skaliert, erzeugt das Verhalten, das wir beobachten.

### Open Source / Open Weights
**Open Source** bedeutet, dass der gesamte Quellcode öffentlich ist und frei verwendet werden darf. **Open Weights** bedeutet, dass nur die trainierten Modellgewichte veröffentlicht werden, nicht der Trainingscode oder die Daten. Die meisten „offenen" LLMs sind Open Weights, nicht wirklich Open Source.

### Post-Training
Die Phase nach dem Pre-Training, in der ein LLM zum hilfreichen Assistenten geformt wird. Umfasst Supervised Fine-Tuning (SFT) und RLHF. Fügt kein neues Wissen hinzu, sondern formt das Verhalten.

### Pre-Training
Die erste Trainingsphase eines LLM: Das Modell lernt aus Billionen von Tokens, Muster in Sprache zu erkennen. Das Ergebnis ist eine verlustbehaftete, probabilistische Kompression der Trainingsdaten. Extrem teuer und aufwendig.

### Prompt Brittleness
Das Phänomen, dass minimale Änderungen an einem Prompt (ein Komma, ein Synonym) die Ergebnisse eines LLM stark beeinflussen können, obwohl die Bedeutung identisch ist. Prompting ist keine exakte Wissenschaft.

### RLHF
**Reinforcement Learning from Human Feedback** – eine Methode im Post-Training von LLMs. Menschen bewerten Modellantworten, das Modell lernt aus diesem Feedback. Teil des Alignment-Prozesses.

### Slop
Minderwertiger, formelhafter KI-Text. Erkennbar an: „Delve into", „It is crucial to note", „Furthermore", inflationärer Verwendung von Em-Dashes, Buzzwords wie „ever-evolving". Gegenmittel: kritisches Lesen und klare Anweisungen im Prompt.

### Sycophancy
Die Tendenz von LLMs, Nutzern zuzustimmen statt zu widersprechen. Das Modell priorisiert Zustimmung über Wahrheit, weil es im Post-Training für nutzerfreundliche Antworten belohnt wurde. Gegenmittel: kritisches Hinterfragen, Anti-Sycophancy-Anweisungen.

### Token
Die kleinste Einheit, in die ein LLM Text zerlegt. Ein Token ist oft ein Wort oder ein Wortteil. 100 Tokens ≈ 75 englische Wörter. Relevant für: Kosten, Context Window, Verarbeitungsgeschwindigkeit.

### Tokenizer
Das Werkzeug, das Text in Tokens zerlegt. Verschiedene Modelle verwenden verschiedene Tokenizer – deshalb kann dasselbe Wort unterschiedlich viele Tokens kosten. Ausprobieren: [OpenAI Tokenizer](https://platform.openai.com/tokenizer).

### Transformer
Die Architektur hinter modernen LLMs (vorgestellt 2017, „Attention Is All You Need"). Der zentrale Mechanismus ist Attention: Das Modell lernt, welche Teile des Eingabetexts füreinander relevant sind.

---

## Mit KI arbeiten

### Chain of Thought
**CoT** – eine Prompting-Technik, bei der man das Modell auffordert, schrittweise zu denken (z.B. „let's think step by step"). Verbessert die Qualität bei komplexen Aufgaben, weil Zwischenschritte explizit werden.

### CI (Continuous Integration)
Automatisierte Test- und Build-Läufe, die bei jedem `git push` ausgeführt werden. Auf GitHub über „GitHub Actions" konfiguriert. Im Hub-Kontext relevant für [Scripts](#script) (deterministisch, CI-tauglich), nicht für [Skills](#skill) (brauchen das LLM im Loop).

### Computational Thinking
Probleme so zerlegen, dass sie mit einem Computer gelöst werden können. Für die Arbeit mit LLMs bedeutet das: Aufgaben in kleine, klare Schritte aufteilen, statt „Bau mir eine Website" zu sagen. Angelehnt an Jeanette Wing (2006).

### Context Engineering
Die systematische Gestaltung des Kontexts, den ein LLM erhält: Auswahl, Kompression und Strukturierung von Informationen im [Context Window](#context-window). Geht über [Prompt Engineering](#prompt-engineering) hinaus, weil nicht nur die Frage, sondern der gesamte mitgegebene Kontext optimiert wird. Siehe auch [Distillation](#distillation).

### Critical Expert in the Loop
Die Person mit Domänenwissen, die LLM-Ergebnisse validiert. LLMs haben keinen internen Mechanismus zur Verifikation – nur wer das Fachgebiet kennt, kann Korrektheit beurteilen. Im Hub-Projekt: Kerstin und Polina. Gegenstück zu [Sycophancy](#sycophancy) und [Konfabulation](#konfabulation).

### Distillation
Die praktische Anwendung von [Context Engineering](#context-engineering): Wissen wird in kompakte Markdown-Dokumente verdichtet. Maximale Information bei minimalem [Token](#token)-Verbrauch. In [Promptotyping](#promptotyping) die dritte Phase, in der aus Exploration strukturierte [Promptotyping Documents](#promptotyping-documents) entstehen.

### Few-Shot Prompting
Eine Prompting-Technik, bei der man dem Modell einige Beispiele im Prompt mitgibt, die das gewünschte Eingabe-Ausgabe-Format zeigen. Das Modell lernt das Muster aus dem Kontext, ohne neu trainiert zu werden.

### Prompt Engineering
Die Technik, Anfragen an ein KI-Modell so zu formulieren, dass nützliche Ergebnisse entstehen. Umfasst Techniken wie Chain of Thought, Few-Shot Prompting und System Prompts.

### Promptotyping
Eine Methodik für die iterative Zusammenarbeit zwischen Mensch und KI. Kernprinzip: Dokumente sind die Quelle der Wahrheit, Code ist ein austauschbares Artefakt. Vier Phasen: Preparation → Exploration → Distillation → Implementation.

### Promptotyping Documents
Markdown-Dateien, die Wissen über Forschungsdaten, Domäne und Anforderungen destillieren. Sie entstehen in der Exploration- und Distillation-Phase und dienen als kompakter, kuratierter Kontext für die Arbeit mit LLMs. Beispiele: knowledge.md, requirements.md, design.md.

### System Prompt
Vorab-Anweisungen, die das Verhalten eines LLM für die gesamte Konversation steuern. Werden vor der eigentlichen Nutzeranfrage gesetzt und definieren Rolle, Tonfall und Regeln.

---

## Werkzeuge: Claude Code und Co.

### Agentic Coding
LLM-gestütztes Programmieren, bei dem ein KI-Agent autonom Dateien liest, Code schreibt, Tests ausführt und Fehler behebt. Der Mensch formuliert Anforderungen und bewertet Ergebnisse. Werkzeuge: Claude Code, GitHub Copilot, Codex. Siehe auch [Vibe Coding](#vibe-coding).

### Claude in Chrome
Nativ eingebaute Browser-Integration in Claude Code (nicht zu verwechseln mit [MCP](#mcp)). Besteht aus der offiziellen Chrome-Extension *„Claude in Chrome"* plus einem Native Messaging Host, den Claude Code beim ersten `/chrome`-Aufruf installiert. Aktivierung: `claude --chrome` beim Start oder `/chrome` in laufender Session. Funktioniert in CLI und VS-Code-Extension. Derzeit Beta, nur Google Chrome (kein Brave/Arc, kein WSL). Tools tauchen im `/mcp`-Menü unter `claude-in-chrome` auf, sind aber nicht über `.mcp.json` konfiguriert.

### CLAUDE.md
Konfigurationsdatei für Claude Code im Repository-Stammverzeichnis. Definiert Projektregeln, Code-Stil und Konventionen. Wird bei jedem Sessionstart automatisch gelesen. Das „Gedächtnis" des [Agentic Coding](#agentic-coding)-Agents für ein Projekt.

### Docsify
Ein leichtgewichtiges Tool, das Markdown-Dateien direkt im Browser als Website anzeigt – ohne Build-Schritt. Dieses Tutorial nutzt Docsify.

### Markdown
Eine einfache Textauszeichnungssprache. Statt HTML-Tags schreibt man `# Überschrift`, `**fett**`, `[Link](url)`. Dieses Tutorial ist in Markdown geschrieben. Gut für LLMs, weil tokeneffizient und in den Trainingsdaten stark vertreten.

### MCP
**Model Context Protocol** – ein offener Standard, über den externe Dienste einer KI neue Fähigkeiten anbieten (Dateizugriff, APIs, verschiedene Tools). MCP-Plugins sind separate Werkzeuge, nicht Teil des LLM, werden über eine `.mcp.json`-Datei konfiguriert. Beispiele: Google-Sheets-MCP, Filesystem-MCP, GitHub-MCP. (Die Chrome-Integration in Claude Code ist **kein** MCP-Plugin, sondern nativ eingebaut: siehe [Claude in Chrome](#claude-in-chrome).)

### Script
Deterministische Automatisierung in einer Programmiersprache (Python, Shell). Gleicher Input → gleicher Output. Im Hub-Kontext: `scripts/build-hub-data.py` baut `projects.json` aus den CSVs. Claude Code schreibt und pflegt Scripts, ruft sie über Bash auf. **Bewusst unterschieden von** [Skill](#skill): ein Script ist keine Skill, weil sein Wert nicht in Claudes Urteil liegt, sondern in der Reproduzierbarkeit.

### Skill
Wiederverwendbarer Prompt für Claude Code. Ein Skill lebt in einem **Ordner** mit einer `SKILL.md`-Datei darin (plus optional weitere Hilfsdateien). Aufruf über `/`-Befehl. Kein Makro, sondern ein Prompt-Wrapper: Claude lädt die Anweisungen und führt sie situativ aus, mit Urteil.

Zwei Orte: **projekt-lokal** in `.claude/skills/<name>/SKILL.md` (im Repo versioniert) oder **global** in `~/.claude/skills/<name>/SKILL.md` (projekt-übergreifend auf eurem Rechner). Claude Code erkennt neue Skills live, ohne Neustart.

Bewusst unterschieden von [Script](#script): ein Skill ist richtig, wenn Claudes Urteil Teil des Werts ist (`/explain-model`, `/enrich-authority`). Ein deterministischer Check gehört als Script.

### Vibe Coding
LLM-generierten Code ausprobieren, ohne ihn im Detail zu verstehen. Geprägt von Andrej Karpathy (2025). **Informed Vibe Coding** ergänzt die Fähigkeit, Ergebnisse zu bewerten, Fehler zu erkennen und gezielt nachzubessern. Promptotyping geht noch weiter: strukturierte Dokumente statt spontanes Prompting.

### VS Code
**Visual Studio Code** – ein kostenloser Code-Editor von Microsoft. Im Hub-Projekt das Hauptwerkzeug: Editor, Terminal und Claude Code laufen darin. Die Live Server Extension zeigt Änderungen sofort im Browser. Konfiguration über [CLAUDE.md](#claudemd) und Settings-Dateien.

---

## Web-Grundlagen

### API
**Application Programming Interface** – eine Schnittstelle, über die Programme miteinander kommunizieren. Für uns relevant: die Google Sheets API, über die der Hub die Projektdaten aus dem Google Sheet abruft.

### Client / Server
**Client:** Dein Browser. Er schickt Anfragen und zeigt die Ergebnisse an. **Server:** Ein Computer im Internet, der Dateien bereitstellt. Er wartet auf Anfragen und antwortet. Jeder Seitenaufruf im Web ist ein Client-Server-Austausch über [HTTP](#http-https).

### CSS
**Cascading Style Sheets** – die Sprache, die bestimmt, wie eine Website aussieht: Farben, Schriftarten, Abstände, Layout. Zusammen mit [HTML](#html) und [JavaScript](#javascript) eine der drei Sprachen des Webs.

### Deployment
Das Veröffentlichen einer Website oder Anwendung, sodass sie im Internet erreichbar ist. Beim Hub: Code auf GitHub pushen, GitHub Pages stellt die Seite automatisch bereit.

### Frontend / Backend
**Frontend:** Was im Browser passiert. [HTML](#html), [CSS](#css), [JavaScript](#javascript). Das sehen die Nutzer. **Backend:** Was auf dem Server passiert. Datenbanken, Logik, Authentifizierung. Unsichtbar für den Nutzer. Der Legal History Hub ist ein reines Frontend-Projekt.

### Google Sheets API
Eine Schnittstelle, über die Programme auf Google-Tabellen zugreifen können. Der Hub nutzt sie, um Projektdaten aus einem Google Sheet zu laden.

### HTML
**HyperText Markup Language** – die Grundsprache des Webs. HTML beschreibt die Struktur einer Website: Überschriften, Absätze, Links, Bilder. HTML ist keine Programmiersprache, sondern eine Auszeichnungssprache (wie Markdown oder XML).

### HTTP / HTTPS
**HyperText Transfer Protocol** – das Protokoll, über das Browser und Server kommunizieren. Ablauf: Anfrage (Request) → Antwort (Response). **HTTPS** (das „S" steht für „secure") verschlüsselt die Verbindung. Heute Standard.

### JavaScript
Die Programmiersprache des Webs. Macht Websites interaktiv – Filter, Suche, dynamische Inhalte. Der Hub nutzt Vanilla JavaScript (ohne Framework).

### JSON
**JavaScript Object Notation** – ein Datenformat, das sowohl Menschen als auch Computer lesen können. Der Hub speichert Projektdaten als JSON-Datei.

### URL
**Uniform Resource Locator** – die Adresse einer Ressource im Web. Aufbau: `https://example.com:443/pfad/seite.html?suche=cat#ergebnis`. Bestandteile: Protokoll (https), Domain (example.com), Port (:443), Pfad, Parameter (?...), Anker (#...).

---

## Git und Versionierung

### Branch
Eine parallele Arbeitslinie in [Git](#git). Man erstellt einen Branch, um an einem Feature zu arbeiten, ohne den Hauptcode (main) zu verändern. Wenn die Arbeit fertig ist, wird der Branch per Merge oder [Pull Request](#pull-request) zurückgeführt.

### Clone
Eine Kopie eines [Git](#git)-Repositorys von [GitHub](#github) auf den eigenen Computer herunterladen. Der Befehl `git clone` erstellt eine lokale Arbeitskopie mit der gesamten Änderungshistorie.

### Commit
Ein gespeicherter Schnappschuss in [Git](#git). Enthält eine kurze Beschreibung der Änderung. Commits bilden die Änderungshistorie eines Projekts. Jeder Commit hat eine eindeutige ID (Hash).

### Git
Ein Versionskontrollsystem, das Änderungen an Dateien nachverfolgt. Jede Änderung wird als „Commit" gespeichert. Ermöglicht Zusammenarbeit und Rückgängigmachen von Änderungen.

### GitHub
Eine Plattform für die Zusammenarbeit an Code-Projekten, basierend auf Git. Bietet Repository-Hosting, Issue-Tracking und GitHub Pages. Der Legal History Hub liegt auf GitHub.

### GitHub Pages
Ein kostenloser Hosting-Dienst von GitHub. Man lädt Dateien in ein Repository hoch, und GitHub macht daraus eine Website. Der Legal History Hub und dieses Tutorial werden so gehostet.

### Pull Request
**PR** – eine Anfrage auf [GitHub](#github), einen [Branch](#branch) in den Hauptbranch zu mergen. Andere können den Code vorher ansehen und kommentieren. Coding Agents wie Claude Code können Pull Requests automatisch erstellen. (Auf GitLab: „Merge Request".)

### Repository
Ein Projektordner auf GitHub, der alle Dateien eines Projekts enthält – inklusive der gesamten Änderungshistorie. Der Hub hat ein Repository, das Tutorial lebt darin als Unterordner.

---

## Datenmodell in Google Sheets

### Brückentabelle
Deutsche Bezeichnung für [Junction Table](#junction-table).

### Codd, Edgar F.
IBM-Forscher (1923 – 2003), der 1970 in *„A Relational Model of Data for Large Shared Data Banks"* die relationalen Datenbanken erfand. Von ihm stammen die [Normalformen](#normalform-1nf) und der Begriff [Repeating Group](#repeating-group).

### Derived View
**Abgeleitete Sicht** – Daten, die nicht selbst gespeichert, sondern aus einer Quelle mit Formeln berechnet werden. Im Hub-Sheet: der `_helpers`-Tab filtert mit `FILTER`-Formeln Personen, Keywords usw. aus dem [authority](#authority-file)-Tab heraus. Wenn sich authority ändert, aktualisiert sich die View automatisch.

### Filter View
**Datenansicht** – eine gespeicherte Filter-Konfiguration in Google Sheets, die nutzer-lokal ist. Mehrere Nutzer können gleichzeitig verschiedene Filter Views aktiv haben, ohne sich zu stören. Im Hub: pro Projekt eine Filter View für den `people`-Tab, um fokussiert zu editieren.

### Foreign Key
**Fremdschlüssel** – eine Spalte in Tabelle A, die auf einen Eintrag in Tabelle B verweist. Im Hub-Sheet: `project_id` in allen Long-Tabs verweist auf `core.project_id`. Der Kitt zwischen Tabellen.

### Google Sheets Tables
Ein Feature in Google Sheets (seit 2024), das einen Zellbereich zu einem **benannten Datenobjekt** macht: mit Spalten-Typen, Auto-Expansion neuer Zeilen, und [Structured References](#structured-references). `Format → In Tabelle konvertieren`. Nicht zu verwechseln mit Styling oder Filter-Ansichten. Die Namen (`core`, `people`, ...) werden in Formeln benutzt.

### Hybrid-Datenmodell
Das Datenmodell des Hub: [Wide](#wide-format) für Singleton-Felder (eine Zeile pro Projekt im `core`-Tab), [Long](#long-format) für Many-to-Many-Beziehungen (Personen, Keywords etc. in eigenen Tabs). Nicht „entweder-oder", sondern beides nebeneinander, abhängig von der Kardinalität des Feldes. Ausführlich in [Lektion 3](03-datenmodell-hybrid.md).

### Junction Table
**Brückentabelle**, auch *Bridge Table*, *Linking Table*. Eine Tabelle, die eine [Many-to-Many](#many-to-many)-Beziehung auflöst. Im Hub: `people`, `institutions`, `subjects`, `regions`, `keywords`. Jede Zeile ist ein Fakt (z.B. „Person X spielt Rolle Y in Projekt Z"). Klassisches Muster aus der relationalen DB-Theorie.

### Long Format
**Long**, auch *stacked*, *tidy*. Tabellenformat mit einer Zeile pro Fakt oder Beobachtung, wenigen Spalten, vielen Zeilen. Gut für [Many-to-Many](#many-to-many)-Beziehungen. Gegenstück: [Wide Format](#wide-format). Prinzip aus [Tidy Data](#tidy-data).

### Many-to-Many
**m:n** – Beziehungstyp, bei dem Entitäten auf beiden Seiten beliebig viele Gegenstücke haben. Ein Projekt hat viele Personen, eine Person arbeitet an vielen Projekten. In SQL aufgelöst durch eine [Junction Table](#junction-table). Im Hub: `people`, `institutions` etc.

### Metadaten
Daten über Daten. Für den Hub: Titel, Beschreibung, Sprache, Typ, URL eines Forschungsprojekts. Gespeichert im Google Sheet.

### Normalform (1NF)
Regel aus der relationalen Datenbanktheorie ([Codd](#codd-edgar-f) 1970): in jeder Zelle genau ein atomarer Wert, keine Listen, keine [Repeating Groups](#repeating-group). *„An entry in a table is not decomposable."* Die 2NF und 3NF sind weitere Regeln zur Redundanz-Reduzierung.

### Normalisierung
Der Prozess, ein Datenmodell schrittweise von Redundanzen zu befreien (1NF → 2NF → 3NF → BCNF). Ein voll normalisiertes Modell hätte für jeden Entitätstyp eine eigene Tabelle. Der Hub macht das **absichtlich nicht vollständig**, weil Sheets ein menschlicher Editor ist: Redundanz im `title_de` der Long-Tabs ist Lesehilfe, nicht Datenspeicher.

### Repeating Group
Wiederholte Gruppe von Werten in einer einzigen Zelle (Separator-Listen wie `"Name1; Name2; Name3"`) oder als Spalten-Pattern (`person1`, `person2`, ...). Verletzt die [1. Normalform](#normalform-1nf) ([Codd](#codd-edgar-f) 1970). Im Hub-Sheet bewusst vermieden: jede Beziehung ist eine Zeile in einem Long-Tab.

### Singleton
Feld mit genau **einem** Wert pro Entität. Im Hub-`core`-Tab: Titel, Status, Startjahr, URL. Gegenstück: Felder mit vielen Werten (Personen, Keywords), die in Long-Tabs leben. Die Faustregel „Singleton → wide, Many-to-Many → long" ist das Herz des [Hybrid-Modells](#hybrid-datenmodell).

### Source of Truth
Die eine physische Stelle, an der ein Wert verbindlich steht. Alle anderen Vorkommen sind nur Abbildungen davon. Im Hub: `core.title_de` ist Source of Truth für den deutschen Projekttitel. Die Long-Tabs zeigen den Titel per [XLOOKUP](#xlookup)-Formel als Lesehilfe, können ihn aber nicht ändern.

### Spill Range
**Dynamischer Array** – eine Formel, die automatisch mehrere Zeilen (oder Spalten) befüllt, ohne dass man die Formel nach unten ziehen muss. In Google Sheets: `FILTER(...)`, `UNIQUE(...)`, `SORT(...)`. Im Hub: der `_helpers`-Tab nutzt Spill Ranges, damit Dropdowns automatisch wachsen, wenn `authority` wächst.

### Structured References
Tabellen-basierte Formel-Syntax in Google Sheets: `core[project_id]` statt `core!A:A`. Lesbar wie ein Satz, überlebt Spalten-Einfügungen. Voraussetzung: der Tab ist eine [Google Sheets Table](#google-sheets-tables). Siehe auch [Lektion 3](03-datenmodell-hybrid.md).

### Tables (Google Sheets)
Siehe [Google Sheets Tables](#google-sheets-tables).

### Tidy Data
Prinzip für saubere Datenformate, formuliert von Hadley Wickham (Statistiker, Erfinder des R-Tidyverse) in *Tidy Data*, Journal of Statistical Software 2014: *„Jede Variable ist eine Spalte, jede Beobachtung eine Zeile, jede Entitätsart eine Tabelle."* Gleichbedeutend mit [Long Format](#long-format).

### Wide Format
**Wide**, auch *unstacked*. Tabellenformat mit einer Zeile pro Entität und vielen Spalten. Gut für [Singletons](#singleton). Gegenstück: [Long Format](#long-format). Im Hub: der `core`-Tab.

### XLOOKUP
Google-Sheets-Funktion, die einen Wert in einer Spalte sucht und aus einer anderen Spalte zurückgibt. Im Hub für die Source-of-Truth-Lesehilfe: `=XLOOKUP(A2; core[project_id]; core[title_de]; "")` zeigt in jedem Long-Tab den Projekttitel, automatisch aktualisiert. Moderner Nachfolger von `VLOOKUP` (flexibler, stabiler bei Spalten-Einfügungen).

---

## Normdaten und PIDs

### Authority File
Englischer Begriff für [Normdatei](#normdatei). Bibliothekarische Tradition. Im Hub-Sheet: der `authority`-Tab mit Personen, Institutionen, Themen, Regionen, Keywords und ihren [PIDs](#pid).

### Enum
**Enumeration** – eine geschlossene, endliche Liste zulässiger Werte. Im Hub-Sheet: `status_values`, `person_roles`, `institution_relations` im `vocabulary`-Tab. Deutsch: [Kontrolliertes Vokabular](#kontrolliertes-vokabular).

### FAIR-Prinzipien
**Findable, Accessible, Interoperable, Reusable** – Qualitätsstandard für digitale Forschungsdaten (Wilkinson et al. 2016). [PIDs](#pid) machen Daten FAIR-konform, weil sie sie findbar und verlinkbar machen. Der Hub ist durch ORCID/GND/ROR/Wikidata-Anreicherung im `authority`-Tab FAIR-kompatibel.

### GND
**Gemeinsame Normdatei** – die zentrale Normdatei der Deutschen Nationalbibliothek für Personen, Institutionen, Sachbegriffe und Werke. Ein [PID](#pid)-System. Im Hub: GND-IDs in `authority` für deutsche und internationale Entitäten.

### Kontrolliertes Vokabular
DH-Begriff für eine geschlossene, verbindliche Wortliste, aus der ausgewählt wird, statt frei formuliert. Im Hub: der `vocabulary`-Tab mit `person_roles`, `institution_relations`, `status_values`. Siehe auch [Enum](#enum).

### Normdatei
Referenzliste, die Namen mit eindeutigen Schlüsseln ([PIDs](#pid)) versieht. Englisch: [Authority File](#authority-file). Für geographische Entitäten auch *Gazetteer*. Im Hub: der `authority`-Tab mit ORCID, GND, ROR, Wikidata-Anreicherung.

### ORCID
**Open Researcher and Contributor ID** – ein [PID](#pid) für Forschende, weltweit eindeutig. Format: `0000-0002-1658-4173`. Im Hub: ORCID-IDs in `authority[orcid]` für alle Projektbeteiligten. Macht Personen maschinell verlinkbar mit ihren Publikationen, unabhängig von Namens-Tippvarianten.

### PID
**Persistent Identifier** – eine kurze Zeichenkette, die eine Entität weltweit eindeutig ansprechbar macht, unabhängig von Tippvarianten oder Umzügen. Beispiele: [ORCID](#orcid) (Personen), [GND](#gnd) (Bibliotheks-Normdaten), [ROR](#ror) (Organisationen), [Wikidata](#wikidata)-Q-Nummern (Begriffe). PIDs sind zentral für die [FAIR-Prinzipien](#fair-prinzipien).

### ROR
**Research Organization Registry** – ein [PID](#pid)-System für Forschungsorganisationen (Universitäten, Institute, Förderer). Format: `https://ror.org/03bnzyp40`. Im Hub: ROR-IDs in `authority[ror]` für Institutionen.

### Vocabulary
Im Hub-Kontext: der `vocabulary`-Tab mit geschlossenen [Enum](#enum)-Listen (`person_roles`, `institution_relations`, `status_values`). Eingabe in Dropdowns, die daran gebunden sind, wird abgelehnt. Siehe auch [Kontrolliertes Vokabular](#kontrolliertes-vokabular).

### Wikidata
Ein offener Wissensgraph, kollaborativ gepflegt, mit Q-Nummern als [PIDs](#pid) (z.B. `Q937` für Albert Einstein). Im Hub: Wikidata-IDs in `authority` für Themen, Regionen, Keywords. Macht Begriffe maschinell verlinkbar mit anderen Datensätzen.
