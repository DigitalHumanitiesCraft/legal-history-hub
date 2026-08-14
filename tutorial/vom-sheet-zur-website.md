# Vom Sheet zur Website

> Was mit den Daten passiert, wenn sie das Google Sheet verlassen. **Stand: August 2026.**

**Schwierigkeit:** Grundlagen
**Dauer:** ca. 15 Minuten
**Voraussetzungen:** [Lektion 3](03-datenmodell-hybrid.md) hilft, ist aber keine Bedingung

## Warum es diese Seite gibt

In Workshop 3 (April 2026) haben wir den Weg vom Sheet zur Website so beschrieben: ein Python-Script liest die Tabs, verbindet sie und schreibt eine Datei `projects.json`, die die Website dann im Browser lädt.

So wurde der Hub nicht gebaut. Das **Prinzip** ist geblieben: Sheet als Redaktionsoberfläche, ein deterministischer Bauschritt dazwischen, eine statische Website am Ende. Die Werkzeuge und ein paar wichtige Details sind andere. Diese Seite beschreibt den Stand, der heute wirklich läuft. Die Workshop-Folien bleiben als Mitschrift stehen, sie werden nicht rückwirkend umgeschrieben.

## Die Kurzfassung

```
Google Sheet (9 Tabs)
   ↓  holen        über die Google-Sheets-API
9 CSV-Dateien
   ↓  prüfen       Validierung: Fehler stoppen den Bau, Warnungen nicht
geprüfte Daten
   ↓  bauen        fertige HTML-Seiten, eine pro Projekt und Sprache
dist/
   ↓  veröffentlichen  nur auf Zuruf, nur freigegebene Projekte
Website
```

Kein Server, keine Datenbank, keine Datei, die die Website im Browser nachlädt. Was die Besucherin sieht, steht schon fertig in der Seite.

## Die neun Tabs

Das Sheet hat heute **neun Tabs**, die gebaut werden. Lektion 3 erklärt acht davon. Der neunte ist dazugekommen und ist der wichtigste Zuwachs seit dem Workshop:

| Tab | Was drinsteht |
|---|---|
| `core` | ein Projekt pro Zeile, alle Einzelwerte (Titel, Beschreibungen, Zeitraum, Status, Links) |
| **`outputs`** | **die Ergebnisse der Projekte, eine Zeile pro Publikation, Edition, Datensatz, Blogpost** |
| `people` | wer arbeitet in welcher Rolle an welchem Projekt |
| `institutions` | welche Einrichtung steht in welcher Beziehung zum Projekt |
| `subjects`, `regions`, `keywords` | Themen, Regionen, Schlagwörter pro Projekt |
| `authority` | das Nachschlagewerk: alle Entitäten mit ihren IDs (ORCID, GND, ROR, Wikidata) |
| `vocabulary` | die geschlossenen Listen (Rollen, Status, Beziehungsarten, Sprachen, Ergebnistypen) |

`_helpers` und `_readme` bleiben im Sheet und sind für die Redaktion da; der Bau liest sie nicht.

## Zwei Ebenen: Projekte und Outputs

Das ist die inhaltlich größte Änderung gegenüber dem Workshop-Stand.

Eine Kachel auf der Website ist **ein Projekt**. Die Ergebnisse eines Projekts sind **eigenständige Datensätze** im `outputs`-Tab, nicht ein Textfeld im Projekt. Jeder Output hat eine eigene ID, einen Typ (`resource_type`, zum Beispiel `digital edition`, `journal article`, `dataset`), eine Lizenz, Links und seine eigenen Beschreibungen in bis zu drei Sprachen.

Das hat zwei sichtbare Folgen:

1. Auf der Projektseite stehen die Ergebnisse gruppiert nach Typ, jedes mit eigenem Anker, damit man einzelne Ergebnisse verlinken und zitieren kann.
2. Der Typ-Filter auf der Übersichtsseite ist **abgeleitet**: er zeigt die Projekte, die mindestens ein Ergebnis des gewählten Typs haben. Es gibt keine Typ-Spalte am Projekt selbst.

Drei redaktionelle Regeln dazu, im Team entschieden:

- Die Liste ist eine **Auswahl**, keine Vollständigkeitsliste. Die Überschrift sagt das auch so.
- **Keine Paywall-Links.** Wenn ein Projekt auf Open Access setzt, ist eine Bezahlschranke ein Ausschlusskriterium, auch wenn eine Bibliothekslizenz sie im Haus faktisch aufhebt.
- **Print-Publikationen** kommen über die Spalte `citation` herein: dort steht das volle bibliografische Zitat. Eine gefüllte `citation` ist das Kennzeichen für Print, es gibt keinen zusätzlichen Haken. Der Zitierstil ist der der Zeitschrift `Rg`.

## Der Weg in fünf Schritten

### 1. Holen

Die Daten kommen **live aus dem Sheet** über die Google-Sheets-API, nicht aus einer heruntergeladenen Datei. Das ist der Unterschied, der am häufigsten für Verwirrung sorgt: eine `.xlsx`, die vor zwei Wochen exportiert wurde, sieht aus wie die Wahrheit, ist es aber nicht.

**Das Sheet ist die Quelle.** Die CSV-Dateien im Repository sind nur das Protokoll dessen, was zuletzt veröffentlicht wurde. Wer eine CSV lokal repariert, hat den Fehler beim nächsten Holen wieder da. Korrekturen gehören ins Sheet.

### 2. Prüfen

Vor dem Bau läuft eine Validierung über alle Tabs. Sie kennt zwei Härtegrade:

- **Fehler stoppen den Bau.** Eine Rolle, die nicht in `vocabulary` steht; eine `project_id` in `people`, die es in `core` nicht gibt; ein doppelter Slug; ein fehlender `title_original` (der Originaltitel ist der Anker, an dem die Übersetzungen hängen); eine fehlende Pflichtspalte.
- **Warnungen stoppen nichts.** Eine fehlende Lizenz an einem Output, ein Projekt ohne Ergebnisse, mehr als sechs `featured`-Projekte, eine sehr lange Beschreibung.

Zur Länge gibt es seit August eine Zahl: eine Beschreibung soll **200 Wörter** nicht überschreiten, eine einzelne Sprachfassung 250. Gemessen wird die kürzeste gefüllte Fassung, weil Übersetzungen fast immer länger werden als das Original. Beides sind Warnungen, keine Fehler: Länge ist eine redaktionelle Frage und darf keine Veröffentlichung blockieren.

Der häufigste harte Fehler in der Praxis ist banal: **eine umbenannte Spaltenüberschrift im Sheet.** Genau dafür prüft die Validierung die Pflichtspalten namentlich, statt später stumm mit leeren Feldern weiterzurechnen.

### 3. Bauen

Der Bauschritt erzeugt **fertige HTML-Seiten**: Startseite, Übersicht und pro Projekt eine Seite je Sprache, unter eigenen Adressen:

```
/de/projekte/<slug>
/en/projects/<slug>
/es/proyectos/<slug>
```

Warum nicht eine Seite mit Sprachumschalter im Browser? Weil jede Sprachfassung eine eigene, zitierbare Adresse braucht und Suchmaschinen nur so verstehen, dass es dieselbe Seite in drei Sprachen ist. Aus demselben Grund entstehen beim Bauen auch `sitemap.xml`, `robots.txt` und strukturierte Metadaten für Suchmaschinen und Literaturverwaltungen.

Filtern, Suchen, Sortieren und die Detailvorschau laufen danach im Browser, aber auf Daten, die schon in der Seite stehen. Deshalb funktioniert die Seite auch, wenn das Sheet gerade nicht erreichbar ist.

Eine Ausnahme gibt es: die **Kartenansicht** holt sich Kartenmaterial und teilweise Koordinaten von fremden Diensten, während man sie ansieht. Sie ist deshalb der einzige Teil der Seite, der beim Betrachten nach außen telefoniert, und die Frage, wie das datenschutzrechtlich gelöst wird, ist noch offen.

Nebenbei entsteht eine Datei `records.json`: der Datenbestand in maschinenlesbarer Form, unter **CC0 1.0** (die Metadaten sind gemeinfrei gestellt). Das betrifft nur die Metadaten, nicht die Bildrechte an den Vorschaubildern.

### 4. Veröffentlichen

Der Deploy läuft **nur auf Zuruf**, nicht nach Zeitplan und nicht automatisch bei jedem Push. In GitHub: Actions → *Deploy (on demand)* → Run workflow. Der nächtliche Lauf, den es zwischenzeitlich gab, ist abgeschaltet.

Der Grund für die Reihenfolge: holen, prüfen, bauen, veröffentlichen, und **erst danach** die geholten Daten ins Repository zurückschreiben. So trägt jede veröffentlichte Fassung genau die Daten, aus denen sie gebaut wurde, und eine umbenannte Spalte bricht den Lauf ab, bevor irgendetwas online geht.

### 5. Die Freigabe entscheidet, was überhaupt erscheint

In `core` gibt es die Spalte **`verified`**. Ein produktiver Bau nimmt **ausschließlich** Projekte mit `verified = TRUE` mit. Alles andere existiert auf der veröffentlichten Seite nicht: keine Seite, kein Eintrag in der Sitemap, kein Datensatz in `records.json`, nicht einmal das Vorschaubild.

Drei Sicherungen hängen daran, weil ein Deploy nicht zurückgenommen werden kann:

- Ist **kein** Projekt freigegeben, bricht der Bau ab, statt eine leere Website zu veröffentlichen.
- **Verschwindet** ein zuvor veröffentlichtes Projekt aus der Freigabe, bricht der Bau ebenfalls ab. Das soll eine versehentlich entfernte Freigabe sichtbar machen.
- Die maschinenlesbare Ausgabe verweigert die Arbeit, wenn sie ungefilterte Daten bekommt.

`verified` wird **einmal** gesetzt, und zwar erst, wenn Autor:in **und** Lektorat durch sind. Es ist ein Haken pro Projekt, nicht pro Feld und nicht pro Sprache.

## Wie die Freigabe praktisch abläuft

Die Autor:innen arbeiten **nicht** im Sheet. Sie bekommen ihr Projekt so zu sehen, wie es später aussieht, und melden Korrekturen zurück; die Redaktion pflegt sie ins Sheet ein. Das Lektorat läuft denselben Weg, zeitlich danach.

Dafür gibt es die **Staging-Vorschau**: ein Bau der Website, der bewusst **alle** Projekte zeigt, auch die noch nicht freigegebenen. Sie trägt für Suchmaschinen ein Sperrsignal (`noindex`, `Disallow: /`, keine Sitemap) und wird über GitHub angestoßen: Actions → *Staging (Surge, on demand)* → Run workflow.

Zwei Dinge dazu sind wichtig:

- Die Vorschau ist **kein Passwortschutz**. Wer die Adresse hat, sieht alles. Deshalb wird der Link nur intern weitergegeben, nie in einem öffentlichen Text, Blog oder Social-Media-Post.
- Die Vorschau zeigt nicht alles, was freigegeben werden muss. Sprachangaben an Ergebnissen etwa stehen in keiner Seite. Wer `verified` setzt, bestätigt damit die sichtbaren Texte in **einer** Oberflächensprache, nicht automatisch jedes Feld des Datensatzes.

## Wenn etwas nicht funktioniert

| Symptom | Wahrscheinliche Ursache |
|---|---|
| Der Lauf bricht ab und nennt eine fehlende Spalte | Im Sheet wurde eine Überschrift umbenannt oder verschoben. Überschrift zurücksetzen, nicht den Bau umbauen. |
| Ein Projekt fehlt auf der veröffentlichten Seite | `verified` steht nicht auf TRUE. |
| Eine Korrektur ist nach dem nächsten Lauf wieder weg | Sie wurde in einer CSV gemacht, nicht im Sheet. |
| Auf der Startseite fehlt ein hervorgehobenes Projekt | Es sind mehr als sechs Projekte `featured`; die Startseite zeigt höchstens sechs. |
| Ein Vorschaubild erscheint nicht | Datei fehlt oder heißt anders als in `thumbnail_path`; die Seite zeigt dann ein Kategorie-Feld statt des Bildes. |

Der Lauf in GitHub Actions druckt bei einem Abbruch die Fehlerzeilen der Validierung mit. Die erste rote Zeile ist fast immer die Antwort.

## Was hier bewusst nicht steht

Der Programmcode des Hubs liegt nicht in diesem Repository, sondern in dem des Instituts. Diese Seite erklärt, **was** passiert und **warum**, damit man die Meldungen versteht und weiß, an welcher Stelle man eingreift. Für die technischen Details ist die Dokumentation im Code-Repository die verbindliche Quelle.

## Siehe auch

- [Lektion 3: Das Datenmodell verstehen](03-datenmodell-hybrid.md) für die Struktur des Sheets
- [WS3 Cheat Sheet](ws3-cheatsheet.md) für die Arbeit im Sheet selbst
- [Lektion 7: Git und GitHub Basics](07-git-und-github-basics.md) für Branch, Commit und Pull Request
- [Glossar](glossar.md) für die Fachbegriffe
