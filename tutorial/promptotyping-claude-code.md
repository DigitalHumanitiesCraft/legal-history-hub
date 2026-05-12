# Promptotyping mit Claude Code – Kurzanleitung

> Wie ihr den Promptotyping-Skill manuell in Claude Code einrichtet und damit am Projekt arbeitet.

**Schwierigkeit:** Grundlagen
**Dauer:** ca. 10 Minuten (Setup) + laufende Projektarbeit
**Voraussetzungen:** [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installiert, Git-Repo lokal vorhanden

## Worum geht es?

Promptotyping ist die Methodik, mit der wir am Legal History Hub arbeiten – siehe [Lektion 2: Preparation und Role Models](02-preparation-und-role-models.md). Damit Claude Code diese Methodik kennt, müsst ihr ihm den **Promptotyping-Skill** beibringen. Der Skill ist ein kleiner Ordner mit Anweisungen, den ihr einmal in Claude Codes Konfigurationsverzeichnis kopiert. Danach versteht Claude Befehle wie `/promptotyping orient` oder `/promptotyping handoff`.

---

## Projektsetup

### 1. Skill herunterladen

Der Skill liegt auf GitHub: <https://github.com/DigitalHumanitiesCraft/promptotyping-skill>

Zwei Wege:

- **Mit Git** (empfohlen, wenn ihr Git nutzt):
  ```powershell
  git clone https://github.com/DigitalHumanitiesCraft/promptotyping-skill.git
  ```
- **Ohne Git:** Auf GitHub auf den grünen Button **Code → Download ZIP** klicken und die ZIP-Datei entpacken.

Ihr habt jetzt einen Ordner `promptotyping-skill` mit einem Unterordner `promptotyping`. **Genau dieser Unterordner** ist der Skill.

### 2. Zielordner anlegen

Öffnet den Explorer und gebt in die Adresszeile ein:

```
%USERPROFILE%\.claude\skills
```

- Existiert der Ordner `skills` schon → fertig.
- Existiert er nicht → erstellt ihn manuell (Rechtsklick → *Neu → Ordner*). Falls auch `.claude` fehlt, legt das auch an.

> **Hinweis:** Der Punkt vor `.claude` muss bleiben. Windows erlaubt das, auch wenn der Explorer normalerweise keinen Punkt am Anfang akzeptiert – über die Adresszeile funktioniert es.

### 3. Skill kopieren

Kopiert den Ordner `promptotyping` (den Unterordner aus Schritt 1, **nicht** den äußeren `promptotyping-skill`-Ordner) nach:

```
%USERPROFILE%\.claude\skills\promptotyping
```

Das Ergebnis sollte so aussehen:

```
%USERPROFILE%\.claude\skills\promptotyping\
├── SKILL.md
└── references\
    ├── check.md
    ├── distill.md
    ├── handoff.md
    ├── orient.md
    └── verify.md
```

### 4. Installation prüfen

1. Öffnet Claude Code in eurem Projektordner (z. B. `legal-history-hub`).
2. Tippt `/` – in der Vorschlagsliste sollte `promptotyping` auftauchen.
3. Wenn nicht: Claude Code einmal neu starten und die Ordnerstruktur aus Schritt 3 prüfen.

Fertig. Das Setup macht ihr **einmal pro Rechner** – der Skill ist danach für alle eure Projekte verfügbar.

---

## Projektarbeit

Eine Session läuft immer nach demselben Muster: **orient → arbeiten → handoff**. Dazwischen gelegentlich `check`. **Einmalig** beim Aufsetzen eines komplett neuen Projekts kommt `distill` davor.

### Nur beim allerersten Mal in einem neuen Projekt – `/promptotyping distill`

Wenn ihr in ein bestehendes Projekt einsteigt, in dem es schon einen `docs/`-Ordner mit Promptotyping-Dokumenten gibt (z. B. beim Legal History Hub), könnt ihr diesen Schritt überspringen – die Doku existiert ja schon. Relevant ist `distill` immer dann, wenn ihr ein **neues** Projekt von Grund auf aufsetzt:

1. In Phase 1 (Preparation) Material sammeln: Daten, Standards, Angebot, Gesprächsnotizen.
2. In Phase 2 (Exploration) zusammen mit Claude die Daten erkunden – *"Was steckt in diesen Sheets? Welche Felder gibt es? Wo sind Lücken?"*
3. Wenn ihr genug verstanden habt, kommt `distill`:

   ```
   /promptotyping distill
   ```

   Claude schlägt dann eine Doku-Struktur vor und schreibt die ersten Versionen von:

   - `knowledge.md` – Domänenwissen, Datenstrukturen, Standards
   - `requirements.md` – User Stories, Prioritäten, Erfolgskriterien
   - `design.md` – Visualisierungs- und Interaktionsentscheidungen
   - `implementation.md` – Architektur, Abhängigkeiten

   Welche dieser Dokumente entstehen, hängt vom Projekt ab. Claude fragt nach und schlägt vor – ihr validiert.

4. Ab jetzt ist das Projekt im Distillation-/Implementation-Zustand. Der normale Loop unten greift.

> Auch in laufenden Projekten ist `distill` nützlich: wenn ihr in einer langen Session viel besprochen habt und das Wissen jetzt in ein Dokument gegossen werden soll, sagt einfach *"Destilliere das in knowledge.md"* – oder ruft `/promptotyping distill` mit einem Hinweis auf, was destilliert werden soll.

### Session starten – `/promptotyping orient`

Als allerersten Befehl in jeder Session:

```
/promptotyping orient
```

Claude scannt das Projekt, liest den letzten Journaleintrag (`docs/journal.md`) und meldet:

- In welcher Phase wir sind (Preparation, Exploration, Distillation, Implementation)
- Was es bisher gibt (Dokumente, Daten, Code)
- Was als nächstes ansteht

**Wartet die Antwort ab, bevor ihr Aufgaben gebt.** Orient stellt sicher, dass Claude den Stand kennt – sonst rät er.

### Arbeiten

Jetzt formuliert ihr eure Aufgabe in normaler Sprache:

- *"Lass uns das Datenmodell für die Projekt-Detailseiten besprechen."*
- *"Ergänze die Sheets-Spalten in docs/REQUIREMENTS.md."*
- *"Baue einen ersten Prototyp der Filterleiste."*

Claude arbeitet im Promptotyping-Modus: Er stellt Optionen vor, fragt bei Unklarheiten nach, aktualisiert Dokumente parallel zum Code. Korrigiert ihn, wenn er falsch abbiegt – das ist Teil der Methodik (*Critical Expert in the Loop*).

### Zwischendurch prüfen – `/promptotyping check`

Wenn ihr unsicher seid, ob Doku und Code noch zusammenpassen:

```
/promptotyping check
```

Claude macht einen Gap-Analysis-Durchlauf: Welche Doku ist veraltet? Wo widerspricht der Code der Doku? Was fehlt? Nutzt das vor allem nach längeren Code-Änderungen.

### Externe Fakten prüfen – `/promptotyping verify`

Selten gebraucht, aber wichtig vor Übergaben oder Veröffentlichungen. Wenn ihr in der Doku z. B. Links, Literaturangaben, Projektnamen, Standards oder Datumsangaben stehen habt, die in den letzten Wochen oder Monaten reingewachsen sind:

```
/promptotyping verify
```

Claude prüft per Websuche:

- Funktionieren die Links noch?
- Stimmen Autoren, Titel, Jahre, DOIs in den Quellenangaben?
- Sind Institutionen, Projektnamen und Rollen korrekt geschrieben?
- Sind Standards und API-Versionen aktuell?

Ihr bekommt eine Liste: was geprüft und korrekt, was nicht auffindbar, was falsch (inklusive Korrekturvorschlag zum direkten Einfügen). Optional könnt ihr den Befehl auf eine bestimmte Datei eingrenzen: `/promptotyping verify knowledge.md`.

### Session beenden – `/promptotyping handoff`

Bevor ihr Claude Code schließt:

```
/promptotyping handoff
```

Claude erstellt einen Git-Commit der offenen Änderungen und schreibt einen Journaleintrag mit:

- Was in dieser Session passiert ist
- Welche Entscheidungen getroffen wurden
- Was als nächstes dran ist

Beim nächsten Start liest `orient` genau diesen Eintrag – so übergebt ihr euch selbst (oder jemand anderem) den Stand sauber.

> **Wichtig:** `handoff` pusht nicht zu GitHub. Das macht ihr selbst, wenn ihr bereit seid (`git push`).

---

## Cheatsheet

| Befehl | Wann |
|--------|------|
| `/promptotyping orient` | Session-Start, immer als Erstes |
| `/promptotyping check` | Zwischendurch, bei Unsicherheit über Doku-Stand |
| `/promptotyping handoff` | Session-Ende, vor dem Schließen |
| `/promptotyping distill` | Einmalig beim Aufsetzen eines neuen Projekts (oder um Besprochenes in ein Doku-File zu gießen) |
| `/promptotyping verify` | Wenn externe Fakten (Standards, Links) geprüft werden sollen |

**Faustregel für den Alltag:** orient → arbeiten → handoff. Den Rest braucht ihr selten.

---

## Wenn etwas nicht klappt

- **`/promptotyping` taucht nicht in der Vorschlagsliste auf:** Pfad prüfen (`%USERPROFILE%\.claude\skills\promptotyping\SKILL.md` muss existieren), Claude Code neu starten.
- **Claude ignoriert die Methodik trotz Skill:** Explizit ansagen – *"Nutze Promptotyping für dieses Projekt."*
- **Journal wird nicht aktualisiert:** Prüfen, ob `docs/`, `knowledge/` oder `promptotyping-docs/` im Projekt existiert. Falls nicht, legt Claude beim ersten `handoff` `docs/journal.md` an.

---

*Mehr zur Methodik: [Lektion 2: Preparation und Role Models](02-preparation-und-role-models.md) · [Promptotyping auf L.I.S.A.](https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin)*
