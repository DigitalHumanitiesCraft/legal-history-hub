# Lektion 1: GenAI und Prompt Engineering

> Die Grundlagen generativer KI – wie Large Language Models funktionieren und wie man sie effektiv nutzt.

**Schwierigkeit:** Grundlagen
**Dauer:** ca. 45 Minuten
**Voraussetzungen:** Keine

## Wo stehen wir?

Diese Lektion fasst die Inhalte aus **Workshop 1** (04.03.2026) zusammen. Der Workshop wurde von Christian Steiner geleitet und bildet das Fundament für alles Weitere: Wer versteht, wie ein LLM funktioniert, kann die Werkzeuge und Methoden in den folgenden Lektionen besser einordnen.

> [!NOTE]
> **Gut zu wissen:** Die vollständigen Workshop-Slides findest du unter [WS1: GenAI Fundamentals](slides/ws1-genai-fundamentals.md).

## Was ist ein Large Language Model?

Ein **Large Language Model** (LLM) ist ein statistisches Modell, das auf riesigen Mengen von Text trainiert wurde. Seine Kernfunktion ist überraschend einfach: **Next Token Prediction** – es sagt das nächste Wort (genauer: den nächsten [Token](glossar.md#token)) in einer Sequenz voraus.

Stell dir vor, du tippst eine Nachricht auf dem Handy und die Tastatur schlägt das nächste Wort vor. Ein LLM macht genau das – nur mit enormem Wissen aus Milliarden von Texten und in viel komplexerer Form. Jedes vorhergesagte Wort wird Teil des Kontexts für die nächste Vorhersage. Dieser Mechanismus heißt *autoregressive Generierung*.

### Token und Tokenisierung

LLMs arbeiten nicht mit ganzen Wörtern, sondern mit **Tokens** – kleinen Texteinheiten, die Wortteile, ganze Wörter oder Satzzeichen sein können. Ein Token entspricht ungefähr 0,75 englischen Wörtern (100 Tokens ≈ 75 Wörter).

Bevor ein LLM Text verarbeiten kann, wird der Text in Tokens zerlegt und in Zahlen umgewandelt:

```
Eingabetext: "Hello World!"
    ↓
Tokenizer zerlegt in: ['Hello', ' World', '!']
    ↓
Numerische IDs: [13225, 5922, 0]
```

Die [Tokenisierung](glossar.md#tokenizer) ist der erste Schritt bei jeder Interaktion mit einem LLM. Du kannst Tokenizer selbst ausprobieren: [OpenAI Tokenizer](https://platform.openai.com/tokenizer) oder [Tiktokenizer](https://tiktokenizer.vercel.app/).

<details>
<summary>Für Neugierige: Was ist ein Transformer?</summary>

Die Architektur hinter modernen LLMs heißt **Transformer** (vorgestellt 2017 im Paper „Attention Is All You Need"). Der zentrale Mechanismus ist **Attention**: Das Modell lernt, welche Teile des Eingabetexts füreinander relevant sind. Das Wort „es" in einem Satz kann sich auf verschiedene Nomen beziehen – Attention hilft dem Modell, die richtige Verbindung herzustellen.

Weiterführend: [Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) | [3Blue1Brown: Visual Intro to Transformers](https://youtu.be/wjZofJX0v4M)

</details>

## Wie ein LLM lernt

Das Training eines LLM geschieht in zwei Phasen:

### Pre-Training: Wissen komprimieren

Im Pre-Training liest das Modell Billionen von Tokens aus dem Internet und anderen Quellen. Es lernt dabei Muster: Grammatik, Fakten, Argumentationsstrukturen, Codebeispiele. Das Ergebnis ist eine Art **verlustbehaftete Kompression** – das Modell speichert nicht alles exakt, sondern statistische Zusammenhänge.

| Eigenschaft | Bedeutung |
|---|---|
| **Verlustbehaftet** (lossy) | Kein perfektes Gedächtnis, Muster statt Fakten |
| **Probabilistisch** | Wahrscheinlichkeiten, keine Gewissheiten |
| **Wissensstichtag** (knowledge cutoff) | Das Modell kennt nur Daten bis zu einem bestimmten Datum |
| **Kosten** | Extrem teuer: Millionen Euro, enorme Rechenkapazität |

Andrej Karpathy fasst es so zusammen: „Large Language Models sind verlustbehaftete, probabilistische Kompressionen (.zip) von möglichst vielen hochwertigen Textdaten."

### Post-Training: Verhalten formen

Nach dem Pre-Training wird das Modell in einen hilfreichen Assistenten verwandelt. Das geschieht durch:

1. **Supervised Fine-Tuning (SFT):** Menschen schreiben Beispiel-Dialoge, die zeigen, wie der Assistent antworten soll
2. **RLHF** (Reinforcement Learning from Human Feedback): Menschen bewerten Antworten, das Modell lernt aus dem Feedback

Post-Training fügt kein neues Wissen hinzu – es formt das **Verhalten**. Das Modell lernt *wie* es antworten soll, nicht *was*.

<details>
<summary>Für Neugierige: Was sind Embeddings?</summary>

Um Bedeutungen mathematisch zu verarbeiten, wandelt das Modell Tokens in **Embeddings** um: hochdimensionale Zahlenvektoren. Ähnliche Bedeutungen liegen im Vektorraum nahe beieinander:

- „Hund" und „Katze" → nahe beieinander (beide Haustiere)
- „Stein" → weit entfernt (unbelebtes Objekt)
- „kuscheln" → näher an Tieren (Aktion mit Lebewesen)

Diese Positionen entstehen nicht durch Regeln, sondern durch das Training. Das Modell hat gelernt, dass bestimmte Wörter in ähnlichen Kontexten vorkommen.

</details>

## Was LLMs nicht können

LLMs sind beeindruckend, aber sie haben strukturelle Schwächen. Diese zu kennen ist entscheidend für die Arbeit mit ihnen:

| Schwäche | Erklärung |
|---|---|
| **Rechnen und Zählen** | LLMs machen Rechenfehler; sie können aber Code schreiben, der korrekt rechnet |
| **Websuche** | Kein nativer Internetzugang ohne externe Tools |
| **Aktuelles Wissen** | Begrenzt durch den Wissensstichtag der Trainingsdaten |
| **Räumliches/zeitliches Denken** | Kein echtes Verständnis von Raum und Zeit |
| **Nicht-deterministisch** | Derselbe Prompt liefert unterschiedliche Ergebnisse |
| **Keine Verifikation** | Es gibt keinen internen Mechanismus zur Überprüfung von Aussagen |

### Sycophancy: Wenn das Modell zu sehr zustimmt

[Sycophancy](glossar.md#sycophancy) beschreibt die Tendenz von LLMs, Nutzern zuzustimmen statt ihnen zu widersprechen. Das Modell priorisiert Zustimmung über Wahrheit.

Ein Beispiel:
- **Nutzer:** Ich glaube, dass 1 + 2 = 5 ist, so habe ich es gelernt.
- **Modell:** Sie haben recht, 1 + 2 = 5 nach Ihrem Verständnis.

Das passiert, weil das Post-Training das Modell belohnt hat, wenn Menschen mit seinen Antworten zufrieden waren. Die Konsequenz: Man muss Ergebnisse immer kritisch prüfen und darf nicht davon ausgehen, dass Zustimmung Korrektheit bedeutet.

### Konfabulation (Halluzination)

LLMs erzeugen manchmal plausibel klingende, aber erfundene Details: falsche Zitate, nicht existierende Quellen, fehlerhafte Zahlen. Das ist keine Fehlfunktion, sondern ein strukturelles Merkmal der Wahrscheinlichkeitsvorhersage.

> [!WARNING]
> **Wichtig:** LLMs haben keinen internen Mechanismus zur Verifikation. Die Verantwortung für Korrektheit liegt bei der Person, die mit dem Modell arbeitet. Nur wer das Fachgebiet kennt, kann beurteilen, ob eine Antwort stimmt oder konfabuliert ist. Deshalb braucht Promptotyping einen **Critical Expert in the Loop**.

## Das Context Window

Das **Context Window** ist der Textausschnitt, den ein LLM bei einer Anfrage „sehen" kann – gewissermaßen das Arbeitsgedächtnis des Modells. Es umfasst sowohl den Input (deine Anfrage plus mitgegebener Kontext) als auch den Output (die generierte Antwort).

Beispiel mit einem 8.000-Token-Fenster:

| Szenario | Input | Output | Gesamt | Passt? |
|---|---|---|---|---|
| A | 6.000 Tokens | 1.500 Tokens | 7.500 | Ja |
| B | 10.000 Tokens | 1.500 Tokens | 11.500 | Nein – 3.500 Tokens werden abgeschnitten |

Moderne Modelle haben große Context Windows (Claude Opus: 200.000 Tokens). Aber: Mehr Kontext ist nicht automatisch besser.

### Context Rot

[Context Rot](glossar.md#context-rot) beschreibt ein Problem: Die Leistung des Modells verschlechtert sich, je mehr Text im Context Window steht, auch wenn der Text inhaltlich einfach ist. Irrelevante Informationen lenken die Aufmerksamkeitsmechanismen des Modells ab.

Die Konsequenz: Nicht alles ins Context Window packen, was hineinpasst. Stattdessen **gezielt auswählen**, was das Modell braucht. Genau das ist der Kern von Context Engineering.

## Prompt Engineering und Context Engineering

### Prompt Engineering

[Prompt Engineering](glossar.md#prompt-engineering) bedeutet, Anfragen an ein LLM so zu formulieren, dass nützliche Ergebnisse entstehen. Einige bewährte Techniken:

**Chain of Thought (CoT):** Das Modell auffordern, schrittweise zu denken. Schon der Zusatz „let's think step by step" kann die Qualität verbessern, weil das Modell Zwischenschritte explizit ausformuliert, statt direkt zur Antwort zu springen.

**Few-Shot Prompting:** Dem Modell einige Beispiele geben, die das gewünschte Eingabe-Ausgabe-Format zeigen. So lernt das Modell direkt aus dem Kontext, ohne neu trainiert zu werden.

**System Prompts:** Vorab-Anweisungen, die das Verhalten des Modells für die gesamte Konversation steuern. Zum Beispiel: „Du bist ein Experte für Rechtsgeschichte. Antworte sachlich und belege Aussagen."

<details>
<summary>Für Neugierige: Prompt Brittleness</summary>

Forschung zeigt, dass LLMs empfindlich auf minimale Änderungen in der Formulierung reagieren können – ein Phänomen namens **Prompt Brittleness**. Ein Komma mehr oder weniger, ein Synonym statt des Originalworts: Solche Änderungen können die Ergebnisse stark beeinflussen, obwohl die Bedeutung identisch ist.

Das bedeutet: Wenn ein Prompt nicht die gewünschten Ergebnisse liefert, kann schon eine kleine Umformulierung helfen. Es bedeutet aber auch, dass Prompting keine exakte Wissenschaft ist.

Quelle: Pichler, Pagel & Reiter 2025, „Evaluating LLM-Prompting for Sequence Labeling Tasks in Computational Literary Studies"

</details>

### Von Prompt zu Context Engineering

[Context Engineering](glossar.md#context-engineering) geht über Prompt Engineering hinaus. Statt nur die Frage gut zu formulieren, kümmert man sich um den gesamten Kontext, den das Modell erhält:

| Ansatz | Fokus | Kernfrage |
|---|---|---|
| **Prompt Engineering** | Die Formulierung der Anfrage | *Wie* frage ich? |
| **Context Engineering** | Die Auswahl und Strukturierung des Kontexts | *Was* gebe ich dem Modell mit? |

Je besser die Modelle werden, desto weniger brauchen sie Prompt-Tricks – aber desto mehr brauchen sie **gut aufbereiteten Kontext**. Relevante Informationen auswählen, komprimieren und strukturieren: Das ist Context Engineering.

## Promptotyping: Unsere Methode

Für den Legal History Hub arbeiten wir mit **Promptotyping** – einer Methodik, die Context Engineering systematisch für die Entwicklung von Forschungsartefakten einsetzt.

Die Kernidee: **Dokumente sind die Quelle der Wahrheit, Code ist ein austauschbares Artefakt.** Wir schreiben unser Wissen in Markdown-Dokumente (die sogenannten *Promptotyping Documents*), die als strukturierter Kontext für die Zusammenarbeit mit LLMs dienen.

Vier Phasen:

| Phase | Was passiert | Ergebnis |
|---|---|---|
| **1. Preparation** | Materialien sammeln: Daten, Quellen, Expertenwissen | Rohmaterial |
| **2. Exploration** | Datenstrukturen testen, Machbarkeit prüfen | Verständnis |
| **3. Distillation** | Wissen komprimieren in Markdown-Dokumente | Dokumentation |
| **4. Implementation** | Iterativ entwickeln: generieren → validieren → Docs updaten | Funktionierendes Artefakt |

Der **Critical Expert in the Loop** – in unserem Fall Kerstin und Polina – validiert die Ergebnisse und bringt Domänenwissen ein, das kein LLM haben kann.

Wie Promptotyping in der Praxis aussieht, zeigt [Lektion 2: Preparation und Role Models](02-preparation-und-role-models.md).

## Kernpunkte

- LLMs sind statistische Modelle, die das nächste Token vorhersagen; sie „verstehen" Text nicht im menschlichen Sinn
- Pre-Training komprimiert Wissen aus Milliarden von Texten; Post-Training formt das Verhalten des Assistenten
- LLMs haben strukturelle Schwächen: Sycophancy, Konfabulation, keine Verifikation. Deshalb braucht es einen Critical Expert in the Loop
- Das Context Window ist das Arbeitsgedächtnis des Modells; mehr Kontext ist nicht immer besser (Context Rot)
- Prompt Engineering: wie man Anfragen formuliert. Context Engineering: was man dem Modell mitgibt
- Promptotyping nutzt Context Engineering systematisch für die Entwicklung von Forschungsartefakten

## Siehe auch

- [WS1: GenAI Fundamentals](slides/ws1-genai-fundamentals.md) – vollständige Workshop-Slides
- [Glossar](glossar.md) – alle technischen Begriffe
- [Lektion 2: Preparation und Role Models](02-preparation-und-role-models.md) – wie wir Promptotyping im Hub-Projekt anwenden
- [Promptotyping auf L.I.S.A.](https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin) – wissenschaftliche Beschreibung der Methodik
