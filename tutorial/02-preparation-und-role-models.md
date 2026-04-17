# Lektion 2: Preparation und Role Models

> Wie wir das Projekt vorbereiten, bevor eine einzige Zeile Code geschrieben wird.

**Schwierigkeit:** Grundlagen
**Dauer:** ca. 20 Minuten
**Voraussetzungen:** [Lektion 1: GenAI und Prompt Engineering](01-genai-und-prompt-engineering.md)

## Wo stehen wir?

Wir sind in **Phase 1 (Preparation)** des Promptotyping-Prozesses. Das bedeutet: Wir sammeln alles, was wir brauchen, bevor wir technische Entscheidungen treffen.

## Was ist Promptotyping?

Promptotyping ist eine Methodik für die iterative Zusammenarbeit zwischen Mensch und KI (Large Language Models). Die Grundidee: **Dokumente sind die Quelle der Wahrheit, Code ist ein austauschbares Artefakt.**

Vier Phasen:

| Phase | Was passiert | Ergebnis |
|-------|-------------|----------|
| **1. Preparation** | Materialien sammeln: Daten, Quellen, Expertenwissen | Rohmaterial |
| **2. Exploration** | Datenstrukturen testen, Machbarkeit prüfen | Verständnis |
| **3. Destillation** | Wissen komprimieren in Markdown-Dokumente | Dokumentation |
| **4. Implementation** | Iterativ entwickeln: generieren → validieren → Docs updaten | Funktionierendes Artefakt |

Die ausführliche wissenschaftliche Beschreibung findet sich hier: [Promptotyping auf L.I.S.A.](https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin)

## Was sammeln wir in Phase 1?

- Projektanforderungen (Angebot, Gespräche mit Kerstin)
- Metadaten-Standards (Dublin Core, DataCite, Schema.org)
- Referenzbeispiele (Role Models)
- Domänenwissen (Rechtsgeschichte, Abt. II-Projekte)

## Role Models: Was funktioniert, was nicht?

Kerstin und Polina haben Referenzseiten geschickt – Websites, die als Vorbild oder Gegenbeispiel für den Hub dienen. Das ist klassische Preparation: Bevor wir eine einzige Zeile Code schreiben, schauen wir uns an, was funktioniert und was nicht.

Die detaillierte Analyse findet sich in [docs/DESIGN.md](https://github.com/DigitalHumanitiesCraft/legal-history-hub/blob/main/docs/DESIGN.md) im Repo. Hier die wichtigsten Erkenntnisse:

### Was funktioniert gut

- **Facettierte Filter** ([HAB Projekte](https://www.hab.de/forschung/projekte/)): Nutzer:innen können nach mehreren Dimensionen gleichzeitig filtern – Status, Typ, Thema, Epoche. Das passt perfekt zu unseren Metadaten im Google-Sheets-CMS.
- **Zurückhaltende Ästhetik** ([Hertziana Insights](https://www.biblhertz.it/en/insights)): Eine Akzentfarbe, viel Weißraum, Serif + Sans-Serif. Akademisch und seriös, ohne überladen zu wirken.
- **Kacheln mit Bildern** ([DDB Ausstellungen](https://ausstellungen.deutsche-digitale-bibliothek.de/)): Visueller Einstieg über Projekt-Thumbnails, kombiniert mit Filtern und Sortierung.

### Was wir vermeiden

- **Überkomplexe Navigation** ([MPIWG Berlin](https://www.mpiwg-berlin.mpg.de/)): Zu viele Filterdimensionen, Projekte über Organisationseinheiten verstreut, kein einheitlicher Überblick. Genau das soll der Hub besser machen.

## Was ist der nächste Schritt?

Phase 1 ist noch nicht abgeschlossen. Es fehlt:

- Klärung offener Fragen (Bilder vorhanden? Hausfarbe? Featured-Projekte?)
- Erste Beispieldaten von realen Projekten der Abt. II
- Technische Exploration der Google Sheets API (Phase 2)

Sobald wir genug Material haben, gehen wir in **Phase 2 (Exploration)**: Dort testen wir, ob unsere Datenstrukturen zu den Anforderungen passen.

## Methodischer Hinweis

Warum starten wir mit Role Models und nicht mit Code? Weil Promptotyping **research-first** arbeitet. Die Domänenanforderungen treiben die technischen Entscheidungen, nicht umgekehrt. Ein:e kritische:r Expert:in (in diesem Fall Kerstin und Polina) validiert die Ergebnisse und identifiziert blinde Flecken.

## Kernpunkte

- Promptotyping arbeitet in vier Phasen: Preparation → Exploration → Distillation → Implementation
- In Phase 1 sammeln wir Material, bevor wir technische Entscheidungen treffen
- Role Models zeigen, was funktioniert (facettierte Filter, klare Ästhetik) und was nicht (überkomplexe Navigation)
- Dokumente sind die Quelle der Wahrheit, Code ist austauschbar
