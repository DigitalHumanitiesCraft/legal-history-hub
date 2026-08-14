# Legal History Hub

Metadaten-Portal für die Forschungsprojekte der Abteilung II des [Max-Planck-Instituts für Rechtsgeschichte und Rechtstheorie](https://www.lhlt.mpg.de/).

## Status

Projekt läuft (Angebot 27/25, 12 Monate). **Dieses Repository trägt nur noch die Empowerment-Schiene**: Tutorial, Workshop-Materialien und die zugehörigen Promptotyping-Dokumente. Die Hub-Anwendung selbst wird seit Juni 2026 im Repository des Instituts entwickelt.

Workshops 1 bis 5 durchgeführt, Lektionen 1 bis 3 und 7 im Tutorial verfügbar.

## Komponenten

| Komponente | Beschreibung | Pfad |
|---|---|---|
| **Tutorial** | Lernressource, Workshop-Materialien, Glossar | [`/tutorial/`](tutorial/) |
| **Docs** | Promptotyping-Dokumente aus der Modellierungsphase (LLM-Kontext) | [`/docs/`](docs/) |

Der Prototyp mit Flat-Model, der bis August 2026 im Root lag (`index.html`, `css/`, `js/`, `data/`), war ein Lernartefakt aus der Workshop-Phase und ist entfernt. Er bleibt über die Git-Historie erreichbar (letzter Stand: `53aa600`).

## Tech Stack

- **Tutorial:** Docsify (Markdown im Browser, kein Build-Schritt)
- **Tests:** `tutorial/tests/` (statischer Link-Check, Playwright-Crawler)
- **Hosting:** GitHub Pages

## Projekt

Ein Projekt von [Digital Humanities Craft](https://dhcraft.org) für das Max-Planck-Institut für Rechtsgeschichte und Rechtstheorie. Entwicklung: Christopher Pollin und Christian Steiner. Ansprechpartnerin am MPIeR: Kerstin Willburth (Abt. II).
