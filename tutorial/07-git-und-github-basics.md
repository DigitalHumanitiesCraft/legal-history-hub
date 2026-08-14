# Lektion 7: Git und GitHub Basics

> Warum bei der Arbeit am Hub nichts verloren geht. Und was Claude Code eigentlich tut, wenn es von Commits und Branches spricht.

**Schwierigkeit:** Grundlagen
**Dauer:** ca. 20 Minuten
**Voraussetzungen:** keine. Diese Lektion ist das Preread für Workshop 5.

## Wo stehen wir?

Der Hub-Prototyp existiert, das Datenmodell steht im Google Sheet, und der gesamte Code liegt in einem **Git-Repository** auf GitHub. Bisher haben Christopher und Christian dieses Repository verwaltet. Jetzt rückt es näher an euch heran: Wenn ihr mit Claude Code am Hub arbeitet, benutzt Claude im Hintergrund ständig Git. Damit ihr versteht, was dabei passiert (und warum dabei nichts kaputtgehen kann), klären wir vor Workshop 5 die Grundbegriffe.

## Das Problem, das Git löst

Du kennst das von Word-Dokumenten: `Hub_final.docx`, `Hub_final_v2.docx`, `Hub_final_v2_WIRKLICH.docx`. Nach drei Wochen weiß niemand mehr, welche Datei aktuell ist, was sich zwischen v1 und v2 geändert hat, und ob die Kollegin gerade an derselben Datei sitzt.

**Git** löst genau dieses Chaos, nur systematisch. Es ist ein **Versionskontrollsystem**: ein Programm, das jede Änderung an den Dateien eines Projekts aufzeichnet. Das bringt drei Dinge:

1. **Zeitreise.** Du kannst jederzeit zu einem früheren Stand zurück. Ein Experiment ging schief? Zurück zum letzten funktionierenden Zustand, mit einem Befehl.
2. **Nachvollziehbarkeit.** Du siehst, was sich wann geändert hat, und wer es geändert hat. Jede Änderung trägt eine kurze Beschreibung.
3. **Zusammenarbeit.** Mehrere Leute arbeiten am selben Projekt, ohne sich gegenseitig zu überschreiben.

Es gibt nur eine Datei pro Inhalt, keine Kopien mit Versionsnummern im Namen. Die Geschichte steckt unsichtbar im Repository.

## Git und GitHub sind nicht dasselbe

Die beiden Namen klingen ähnlich, meinen aber Verschiedenes:

- **Git** ist das Programm. Es läuft lokal auf deinem Rechner und verwaltet dort den Änderungsverlauf.
- **GitHub** ist eine Plattform im Internet, auf der dein Projekt online liegt („remote", wie man sagt). GitHub hostet das Repository, zeigt den Verlauf hübsch an, und bietet Extras wie Issues (Aufgabenlisten) und **GitHub Pages** (kostenloses Website-Hosting; so wird der Hub veröffentlicht).

Eine verbreitete Alternative zu GitHub heißt GitLab; das Prinzip ist dasselbe. Merksatz: Git arbeitet bei dir, GitHub wohnt im Netz.

## Der Grundzyklus: ändern, vormerken, speichern, hochladen

Die tägliche Arbeit mit Git folgt immer demselben Muster. Vier Stationen:

```
Deine Dateien   →   Staging      →   Lokaler Verlauf   →   GitHub (remote)
(Arbeitskopie)      (Warenkorb)      (Commits)             (online)
             vormerken         committen            pushen
```

Die Begriffe dazu, in der Reihenfolge, in der sie dir begegnen:

- **Repository (Repo):** dein Projektordner, von Git überwacht. Enthält nicht nur den aktuellen Stand, sondern den gesamten Verlauf.
- **Clone:** eine Kopie eines Repos von GitHub auf deinen Rechner holen. Machst du einmal am Anfang, danach arbeitest du lokal weiter.
- **Staging:** Änderungen vormerken, die in den nächsten Speicherpunkt sollen. Wie ein Warenkorb vor dem Bestellen: Du legst hinein, was zusammengehört, und lässt liegen, was noch nicht fertig ist.
- **Commit:** ein gespeicherter Zwischenstand. Jeder Commit bekommt eine kurze Beschreibung, was sich geändert hat („Tippfehler auf der Startseite korrigiert"). Die Kette aller Commits ist der Verlauf des Projekts.
- **Push:** deine Commits von deinem Rechner zu GitHub hochladen. Erst jetzt sehen andere deine Arbeit.
- **Pull:** die Gegenrichtung. Änderungen, die andere gepusht haben, von GitHub auf deinen Rechner holen.

> [!TIP]
> **Commit-Beschreibungen sind Notizen an dein zukünftiges Ich.** „Änderungen" sagt nichts; „Neues Projekt Glossae hinzugefügt" sagt alles. Wenn Claude Code für euch committet, schreibt es solche Beschreibungen automatisch. Lest sie trotzdem: Sie sind die Kurzfassung dessen, was Claude getan hat.

## Parallel arbeiten: Branch, Merge, Pull Request

Solange du allein und an einer Sache arbeitest, reicht der Grundzyklus. Für alles andere gibt es drei weitere Begriffe:

- **Branch:** ein paralleler Arbeitsstrang. Du arbeitest an einem neuen Feature (sagen wir: einer Kartenansicht für den Hub), ohne den Hauptstand zu stören. Der Hauptstrang heißt üblicherweise `main`.
- **Merge:** das Zusammenführen. Wenn das Feature fertig ist, fließt der Branch zurück in den Hauptstrang.
- **Pull Request (PR):** eine Anfrage auf GitHub, einen Branch zu mergen. Der Clou: Andere können die Änderungen vorher ansehen und kommentieren. Der PR ist der Ort, an dem Qualitätskontrolle stattfindet, bevor etwas im Hauptstand landet. (Auf GitLab heißt dasselbe „Merge Request".)

Für den Hub ist das keine Empfehlung, sondern die vereinbarte Arbeitsweise: **niemand committet direkt auf `main`.** Alle arbeiten auf einem eigenen Branch und führen ihn per Pull Request zurück, und **vor jedem Merge liest jemand anderes den Code**. Der Sinn ist nicht Formalismus, sondern dass ein Fehler auffällt, solange er noch billig zu beheben ist.

## Was hat das alles mit Claude Code zu tun?

Hier schließt sich der Kreis zu den früheren Lektionen. Coding Agents wie Claude Code arbeiten alle mit Git. Commits, Branches, Pull Requests: Das erledigt der Agent oft automatisch für euch. Ihr tippt also selten selbst `git commit` in ein Terminal. Aber ihr müsst verstehen, was dabei passiert, aus zwei Gründen:

1. **Kontrolle.** Wenn Claude sagt „Ich habe die Änderung committet und gepusht", solltet ihr wissen: Die Änderung ist jetzt gespeichert *und* online. Wenn Claude einen Branch vorschlägt, heißt das: Es will den Hauptstand schützen.
2. **Sicherheit.** Git ist euer Sicherheitsnetz beim Arbeiten mit KI. Jeder Commit ist ein Wiederherstellungspunkt. Genau deshalb empfiehlt die Promptotyping-Methode regelmäßige Commits als „Savepoints": Geht ein Experiment schief, rollt ihr zurück, statt zu reparieren.

Und das Deployment? Für diese Tutorial-Seite gilt: was nach `main` gepusht wird, veröffentlicht GitHub Pages automatisch. **Für den Hub gilt das bewusst nicht.** Dort ist Veröffentlichen ein eigener Schritt, den jemand von Hand anstößt, weil vorher die Daten aus dem Sheet geholt und geprüft werden müssen und weil nur freigegebene Projekte online gehen sollen. Ein Push macht also noch nichts live. Wie das genau läuft, steht in [Vom Sheet zur Website](/vom-sheet-zur-website.md); eine eigene Lektion zum Deployment folgt.

<details>
<summary>Für Neugierige: Was steckt technisch in einem Commit?</summary>

Ein Commit enthält drei Dinge: einen Schnappschuss aller Dateien (technisch: nur die Unterschiede zum Vorgänger, das sogenannte *Diff*), die Metadaten (wer, wann, Beschreibung) und eine eindeutige ID, den *Hash*. Ein Hash sieht so aus: `18868c8`. Mit dieser ID kannst du jeden Zustand des Projekts exakt ansprechen: „Zeig mir das Projekt, wie es bei Commit 18868c8 aussah." Genau das tut Claude Code, wenn es einen früheren Stand wiederherstellt.

</details>

## Kernpunkte

- Git ist Versionskontrolle: Jede Änderung wird gespeichert, nichts geht verloren, jeder frühere Stand ist erreichbar.
- Git läuft lokal auf deinem Rechner; GitHub ist die Plattform, auf der das Projekt online („remote") liegt.
- Der Grundzyklus: ändern → stagen (Warenkorb) → committen (Speicherpunkt mit Beschreibung) → pushen (hochladen).
- Branch, Merge und Pull Request ermöglichen paralleles Arbeiten, ohne den Hauptstand zu gefährden.
- Claude Code erledigt Git-Operationen oft automatisch. Ihr braucht die Begriffe trotzdem: Sie sind eure Kontrolle und euer Sicherheitsnetz.

## Siehe auch

- [WS5: Skills, MCP, Git und GitHub](/slides/ws5-skills-mcp-git-github.md) – der Workshop, den diese Lektion vorbereitet
- [Promptotyping mit Claude Code](/promptotyping-claude-code.md) – dort tauchen Commits als Savepoints auf
- [Glossar: Git](/glossar.md#git), [Commit](/glossar.md#commit), [Branch](/glossar.md#branch), [Pull Request](/glossar.md#pull-request), [GitHub Pages](/glossar.md#github-pages)
