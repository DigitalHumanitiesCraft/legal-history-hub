# Glossar

> Technische Begriffe, verständlich erklärt. Basierend auf dem [Applied GenAI Glossar](https://chpollin.github.io/llmdh/glossary/glossary.html).

## A

### Alignment
Der Prozess, ein KI-Modell so zu trainieren, dass es hilfreich, harmlos und ehrlich antwortet. Methoden wie RLHF und Constitutional AI sind Teil davon.

### API
**Application Programming Interface** – eine Schnittstelle, über die Programme miteinander kommunizieren. Für uns relevant: die Google Sheets API, über die der Hub die Projektdaten aus dem Google Sheet abruft.

### Autoregressive Generierung
Das Prinzip, nach dem LLMs Text erzeugen: Jedes vorhergesagte Token wird Teil des Kontexts für die nächste Vorhersage. Das Modell baut seinen Output Wort für Wort auf.

## C

### Chain of Thought
**CoT** – eine Prompting-Technik, bei der man das Modell auffordert, schrittweise zu denken (z.B. „let's think step by step"). Verbessert die Qualität bei komplexen Aufgaben, weil Zwischenschritte explizit werden.

### Context Engineering
Die systematische Gestaltung des Kontexts, den ein LLM erhält: Auswahl, Kompression und Strukturierung von Informationen im Context Window. Geht über Prompt Engineering hinaus, weil nicht nur die Frage, sondern der gesamte mitgegebene Kontext optimiert wird.

### Context Rot
Die Leistung eines LLM verschlechtert sich, je mehr Text im Context Window steht – auch bei inhaltlich einfachen Aufgaben. Irrelevante Informationen lenken die Aufmerksamkeitsmechanismen ab. Mehr Kontext ≠ bessere Ergebnisse.

### Context Window
Das „Arbeitsgedächtnis" eines LLM: der maximale Textumfang (in Tokens), den das Modell bei einer Anfrage verarbeiten kann. Umfasst Input (Anfrage + Kontext) und Output (generierte Antwort). Claude Opus: 200.000 Tokens.

### Critical Expert in the Loop
Die Person mit Domänenwissen, die LLM-Ergebnisse validiert. LLMs haben keinen internen Mechanismus zur Verifikation – nur wer das Fachgebiet kennt, kann Korrektheit beurteilen. Im Hub-Projekt: Kerstin und Polina.

### CSS
**Cascading Style Sheets** – die Sprache, die bestimmt, wie eine Website aussieht: Farben, Schriftarten, Abstände, Layout.

## D

### Deployment
Das Veröffentlichen einer Website oder Anwendung, sodass sie im Internet erreichbar ist. Beim Hub: Code auf GitHub pushen, GitHub Pages stellt die Seite automatisch bereit.

### Docsify
Ein leichtgewichtiges Tool, das Markdown-Dateien direkt im Browser als Website anzeigt – ohne Build-Schritt. Dieses Tutorial nutzt Docsify.

## E

### Embedding
Eine mathematische Darstellung von Text als Zahlenvektor in einem hochdimensionalen Raum. Ähnliche Bedeutungen liegen nahe beieinander: „Hund" und „Katze" sind näher als „Hund" und „Stein". So kann ein LLM Bedeutung mathematisch verarbeiten.

## F

### Few-Shot Prompting
Eine Prompting-Technik, bei der man dem Modell einige Beispiele im Prompt mitgibt, die das gewünschte Eingabe-Ausgabe-Format zeigen. Das Modell lernt das Muster aus dem Kontext, ohne neu trainiert zu werden.

## G

### Git
Ein Versionskontrollsystem, das Änderungen an Dateien nachverfolgt. Jede Änderung wird als „Commit" gespeichert. Ermöglicht Zusammenarbeit und Rückgängigmachen von Änderungen.

### GitHub
Eine Plattform für die Zusammenarbeit an Code-Projekten, basierend auf Git. Bietet Repository-Hosting, Issue-Tracking und GitHub Pages. Der Legal History Hub liegt auf GitHub.

### GitHub Pages
Ein kostenloser Hosting-Dienst von GitHub. Man lädt Dateien in ein Repository hoch, und GitHub macht daraus eine Website. Der Legal History Hub und dieses Tutorial werden so gehostet.

### Google Sheets API
Eine Schnittstelle, über die Programme auf Google-Tabellen zugreifen können. Der Hub nutzt sie, um Projektdaten aus einem Google Sheet zu laden.

## H

### Halluzination
Siehe [Konfabulation](#konfabulation). Der ältere, aber gebräuchlichere Begriff für dasselbe Phänomen.

### HTML
**HyperText Markup Language** – die Grundsprache des Webs. HTML beschreibt die Struktur einer Website: Überschriften, Absätze, Links, Bilder.

## J

### JavaScript
Die Programmiersprache des Webs. Macht Websites interaktiv – Filter, Suche, dynamische Inhalte. Der Hub nutzt Vanilla JavaScript (ohne Framework).

### JSON
**JavaScript Object Notation** – ein Datenformat, das sowohl Menschen als auch Computer lesen können. Der Hub speichert Projektdaten als JSON-Datei.

## K

### Knowledge Cutoff
Der Wissensstichtag eines LLM: das Datum, bis zu dem die Trainingsdaten reichen. Alles danach kennt das Modell nicht, sofern es keine externen Tools (z.B. Websuche) nutzt.

### Konfabulation
Wenn ein LLM plausibel klingende, aber erfundene Informationen erzeugt: falsche Zitate, nicht existierende Quellen, fehlerhafte Zahlen. Kein Fehler, sondern ein strukturelles Merkmal der Wahrscheinlichkeitsvorhersage. Auch „Halluzination" genannt.

## L

### LLM
**Large Language Model** – ein KI-Modell, das auf riesigen Textmengen trainiert wurde und menschenähnlichen Text generieren kann. Beispiele: Claude, GPT, Gemini. Kernfunktion: Next Token Prediction.

## M

### Markdown
Eine einfache Textauszeichnungssprache. Statt HTML-Tags schreibt man `# Überschrift`, `**fett**`, `[Link](url)`. Dieses Tutorial ist in Markdown geschrieben. Gut für LLMs, weil tokeneffizient und in den Trainingsdaten stark vertreten.

### Metadaten
Daten über Daten. Für den Hub: Titel, Beschreibung, Sprache, Typ, URL eines Forschungsprojekts. Gespeichert im Google Sheet.

## N

### Next Token Prediction
Die Kernfunktion von LLMs: das nächste Token in einer Sequenz vorhersagen, basierend auf dem bisherigen Kontext. Dieser einfache Mechanismus, massiv skaliert, erzeugt das Verhalten, das wir beobachten.

## O

### Open Source / Open Weights
**Open Source** bedeutet, dass der gesamte Quellcode öffentlich ist und frei verwendet werden darf. **Open Weights** bedeutet, dass nur die trainierten Modellgewichte veröffentlicht werden, nicht der Trainingscode oder die Daten. Die meisten „offenen" LLMs sind Open Weights, nicht wirklich Open Source.

## P

### Post-Training
Die Phase nach dem Pre-Training, in der ein LLM zum hilfreichen Assistenten geformt wird. Umfasst Supervised Fine-Tuning (SFT) und RLHF. Fügt kein neues Wissen hinzu, sondern formt das Verhalten.

### Pre-Training
Die erste Trainingsphase eines LLM: Das Modell lernt aus Billionen von Tokens, Muster in Sprache zu erkennen. Das Ergebnis ist eine verlustbehaftete, probabilistische Kompression der Trainingsdaten. Extrem teuer und aufwendig.

### Prompt Brittleness
Das Phänomen, dass minimale Änderungen an einem Prompt (ein Komma, ein Synonym) die Ergebnisse eines LLM stark beeinflussen können, obwohl die Bedeutung identisch ist. Prompting ist keine exakte Wissenschaft.

### Prompt Engineering
Die Technik, Anfragen an ein KI-Modell so zu formulieren, dass nützliche Ergebnisse entstehen. Umfasst Techniken wie Chain of Thought, Few-Shot Prompting und System Prompts.

### Promptotyping
Eine Methodik für die iterative Zusammenarbeit zwischen Mensch und KI. Kernprinzip: Dokumente sind die Quelle der Wahrheit, Code ist ein austauschbares Artefakt. Vier Phasen: Preparation → Exploration → Distillation → Implementation.

### Promptotyping Documents
Markdown-Dateien, die Wissen über Forschungsdaten, Domäne und Anforderungen destillieren. Sie entstehen in der Exploration- und Distillation-Phase und dienen als kompakter, kuratierter Kontext für die Arbeit mit LLMs. Beispiele: knowledge.md, requirements.md, design.md.

## R

### Repository
Ein Projektordner auf GitHub, der alle Dateien eines Projekts enthält – inklusive der gesamten Änderungshistorie. Der Hub hat ein Repository, das Tutorial lebt darin als Unterordner.

### RLHF
**Reinforcement Learning from Human Feedback** – eine Methode im Post-Training von LLMs. Menschen bewerten Modellantworten, das Modell lernt aus diesem Feedback. Teil des Alignment-Prozesses.

## S

### Slop
Minderwertiger, formelhafter KI-Text. Erkennbar an: „Delve into", „It is crucial to note", „Furthermore", inflationärer Verwendung von Em-Dashes, Buzzwords wie „ever-evolving". Gegenmittel: kritisches Lesen und klare Anweisungen im Prompt.

### Sycophancy
Die Tendenz von LLMs, Nutzern zuzustimmen statt zu widersprechen. Das Modell priorisiert Zustimmung über Wahrheit, weil es im Post-Training für nutzerfreundliche Antworten belohnt wurde. Gegenmittel: kritisches Hinterfragen, Anti-Sycophancy-Anweisungen.

### System Prompt
Vorab-Anweisungen, die das Verhalten eines LLM für die gesamte Konversation steuern. Werden vor der eigentlichen Nutzeranfrage gesetzt und definieren Rolle, Tonfall und Regeln.

## T

### Token
Die kleinste Einheit, in die ein LLM Text zerlegt. Ein Token ist oft ein Wort oder ein Wortteil. 100 Tokens ≈ 75 englische Wörter. Relevant für: Kosten, Context Window, Verarbeitungsgeschwindigkeit.

### Tokenizer
Das Werkzeug, das Text in Tokens zerlegt. Verschiedene Modelle verwenden verschiedene Tokenizer – deshalb kann dasselbe Wort unterschiedlich viele Tokens kosten. Ausprobieren: [OpenAI Tokenizer](https://platform.openai.com/tokenizer).

### Transformer
Die Architektur hinter modernen LLMs (vorgestellt 2017, „Attention Is All You Need"). Der zentrale Mechanismus ist Attention: Das Modell lernt, welche Teile des Eingabetexts füreinander relevant sind.
