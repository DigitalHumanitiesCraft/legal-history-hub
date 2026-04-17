# Legal History Hub

Metadaten-Portal für die Forschungsprojekte der Abteilung II des [Max-Planck-Instituts für Rechtsgeschichte und Rechtstheorie](https://www.lhlt.mpg.de/).

## Status

Projekt läuft (Angebot 27/25, 12 Monate). v1-Prototyp mit Flat-Model existiert; Rebuild auf Hybrid-Datenmodell (9-Tab Google Sheet) ist für die Folge-Workshops vorbereitet. Workshop-Reihe 1–3 durchgeführt bzw. vorbereitet, Lektionen 1–3 im Tutorial verfügbar.

## Komponenten

| Komponente | Beschreibung | Pfad |
|---|---|---|
| **Hub** | Discovery-Layer für Projektmetadaten | [`/`](index.html) |
| **Tutorial** | Lernressource, Workshop-Materialien, Glossar | [`/tutorial/`](tutorial/) |
| **Docs** | Promptotyping-Dokumente (LLM-Kontext) | [`/docs/`](docs/) |

## Tech Stack

- **CMS:** Google Sheets mit Tables-Feature (9-Tab-Hybrid-Modell) + Sheets API
- **Build:** Python-Script (`scripts/build-hub-data.py`), aufgerufen via Claude Code
- **Runtime-Daten:** statisches `data/projects.json` (generiert)
- **Frontend:** Vanilla JavaScript, Bootstrap 5
- **Tutorial:** Docsify (Markdown im Browser, kein Build-Schritt)
- **Hosting:** GitHub Pages

## Projekt

Ein Projekt von [Digital Humanities Craft](https://dhcraft.org) für das Max-Planck-Institut für Rechtsgeschichte und Rechtstheorie. Entwicklung: Christopher Pollin und Christian Steiner. Ansprechpartnerin am MPIeR: Kerstin Willburth (Abt. II).
