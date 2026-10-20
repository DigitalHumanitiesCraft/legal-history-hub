# Betrieb: Fragen aus dem Team

> Kurze Antworten auf Fragen zu Sichtbarkeit, Vorschau, Domain und Google Sheets. **Stand: Oktober 2026**, abgeglichen mit dem Institutsrepo und der Absprache vom 20.10.2026.

## Sichtbarkeit und Suchmaschinen

**Was schon da ist:** `sitemap.xml`, `robots.txt`, Sprachverweise (`hreflang`), strukturierte Daten (Schema.org) auf jeder Inhaltsseite, Meta-Descriptions. Technisch ist der Hub für Suchmaschinen vorbereitet.

**Monitoren:** Google Search Console und Bing Webmaster Tools. Beide brauchen kein Skript auf der Website, also auch keinen Datenschutz-Aufwand. Bestätigt wird die Seite ohne IT: Google gibt eine kleine Prüfdatei aus, die kommt nach `public/` und geht mit dem nächsten Deploy online. Nur wer die ganze Domain auf einmal erfassen will, braucht einen Eintrag im DNS.

**Verbessern:** Am meisten bringen Links von außen, vor allem von der Institutsseite und von den Projektseiten zurück zum Hub. Danach gute Beschreibungen im Sheet: Suchmaschinen zeigen, was dort steht.

**Dokumentieren:** einmal im Monat die Zahlen aus der Search Console ins Journal.

## Tracker und Analyse (DSGVO)

**Geplant ist Matomo**, cookielos (Absprache vom 20.10.2026). Die Institutsseite nutzt schon das zentrale Matomo der MPG (`statistik.mpg.de`). Dort wird eine Website für den Hub angelegt, und es gibt ein kurzes Einbindungs-Skript, das in die Seite kommt. Wer das anlegt, klärt die IT des Instituts. Einen eigenen Server braucht der Hub dafür nicht.

Folgen: ein eigener Absatz in der Datenschutzerklärung, und falls das Matomo bei einem Dienstleister läuft, ein Auftragsverarbeitungsvertrag. Cookies setzt der Hub auch dann keine.

**Search Console und Matomo beantworten verschiedene Fragen:** die Search Console „werden wir gefunden?“, Matomo „was wird auf der Seite angesehen?“.

## Vorschau für die Freigabe

**Eine Vorschau ist nötig.** Wer als Autor:in oder Projektleitung Feedback gibt, muss den Eintrag so sehen, wie er live aussieht. Für das Sprachlektorat reicht dagegen ein PDF der Vorschauseite, dort geht es nur um den Text. Das ist eine Übergangslösung: Später sollen neue Projekte über den üblichen Redaktionsweg mit Word-Dateien kommen, bevor sie ins Sheet gehen.

Die Vorschau zeigt auch noch nicht freigegebene Projekte. Sie braucht deshalb einen Passwortschutz. Geplant ist ein **Server der Instituts-IT oder der GWDG**. Welche Form er hat, ist gleich (Webspace, virtuelle Maschine, Container). Er muss statische Dateien über HTTPS ausliefern, alle Pfade mit Passwort schützen und einen Upload per SSH-Schlüssel erlauben. Externe brauchen dann nur Link und Passwort, kein Konto.

Bis der Server steht, läuft die Vorschau wie bisher, ohne Passwort. Cloudflare kommt nicht in Frage, weil es nach den Vorgaben der MPG nicht offiziell genutzt werden kann.

**Die spätere Live-Seite betrifft das nicht.** Sie soll auf GitHub Pages laufen, unabhängig davon, wo die Vorschau liegt.

## GitHub Pages und eigene Domain

**GitHub Pages stellt für eine eigene Domain automatisch ein HTTPS-Zertifikat aus**, über Let's Encrypt. Wer was tut:
1. **Ein Owner der GitHub-Organisation** lässt die Domain in den Org-Einstellungen verifizieren. GitHub gibt dafür einen TXT-Eintrag aus.
2. **IT des Instituts:** setzt diesen TXT-Eintrag und lässt ihn dauerhaft stehen.
3. **IT des Instituts:** setzt erst danach den CNAME der Subdomain auf GitHub Pages. Andersherum könnte ein fremdes GitHub-Konto die Adresse für sich beanspruchen.
4. **ihr:** in den Repo-Einstellungen unter *Pages* die Domain eintragen und „Enforce HTTPS“ anhaken. Das Zertifikat holt GitHub dann selbst.

**CAA-Eintrag:** Ohne CAA-Eintrag darf jede Zertifizierungsstelle ausstellen, also auch Let's Encrypt. Legt die IT später einen an, muss er `letsencrypt.org` erlauben, sonst läuft das Zertifikat nicht mehr nach.

**Das Repo wird öffentlich.** Für ein privates Repo gibt es GitHub Pages im kostenlosen Tarif nicht. Das Institut hat am 09.07.2026 entschieden, dass Code und Daten öffentlich sein dürfen: Die Metadaten stehen unter CC0, und dass die Git-Geschichte alle früheren Datenstände zeigt, ist ausdrücklich akzeptiert. Vor dem Öffentlichschalten wird das Repo einmal durchgesehen, ob Dateien darin liegen, die in kein öffentliches Repo gehören.

Quelle: GitHub-Doku [Securing your GitHub Pages site with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https), [Verifying your custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages) und [Troubleshooting custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages) (CAA).

## Weg von Google Sheets?

**Erst fragen: Welches Problem soll der Wechsel lösen?**

**Google Sheets kann heute:** gleichzeitig bearbeiten, Versionsverlauf je Zelle, Dropdowns aus dem Tab `vocabulary`, eine einzige aktuelle Fassung, eine API für den Deploy, und Claude prüft direkt im Sheet.

**Typische Gründe, die keine sind:**
- **Zugänge liegen bei einer externen Firma:** Das löst eine Übergabe von Sheet und Google-Projekt ans Institut, ohne Wechsel.
- **Datenschutz:** Im Sheet stehen Forschungsmetadaten, die zur Veröffentlichung bestimmt sind, und das Sheet ist nicht öffentlich. Nach dem Go-live liegen die Daten ohnehin öffentlich bei GitHub, ebenfalls einem US-Anbieter: die freigegebenen Projekte auf GitHub Pages, der ganze Bestand im öffentlichen Repo. Wer Google Sheets wegen dieser Daten ablehnt, müsste auch GitHub ablehnen. Formal braucht es eine Freigabe für Google Sheets, die holt man ein.

**Die genannten Alternativen** (Stand Oktober 2026):
- **Framacalc geht nicht:** Wer die URL hat, kann bearbeiten, es gibt also keinen Schutz für noch nicht freigegebene Daten.
- **Baserow ist schlechter:** Hosting in Deutschland, das passt. Aber es ist eine Datenbank statt einer Tabelle, also Umgewöhnung für alle. Der Versionsverlauf reicht gratis 14 Tage. Im bezahlten Tarif (10 bis 12 $ pro Person und Monat) sind es 90 Tage. Und der Abruf über die Google-API müsste durch einen neuen über die Baserow-API ersetzt werden.

**Entschieden: Google Sheets bleibt** (Absprache vom 20.10.2026). Für die IT wird festgehalten, dass die Alternativen geprüft und verworfen wurden. Kommt doch einmal ein Wechsel, gilt die Liste im nächsten Abschnitt.

Quellen: [Baserow: Data residency](https://baserow.io/blog/baserow-data-residency), [Baserow: Pricing](https://baserow.io/pricing).

### Falls doch: was ein Ersatz können muss

- eine echte `.xlsx` mit den 9 Tabs und **gespeicherten Werten** speichern. Formeln allein kommen leer an, ohne Warnung.
- Arbeiten zu mehreren gleichzeitig, mit Versionsverlauf
- eine einzige aktuelle Fassung an einem Ort
- Hosting in der EU und eine eigene Sicherung

**MCP ist keine Bedingung.** Mit MCP liest Claude die Daten direkt, das ist bequem. Ohne MCP arbeitet Claude mit der exportierten Datei, und `npm run validate` prüft die daraus erzeugten CSVs genauso.

### Der Weg ohne API ist ein Notfallweg

Fest an Google hängt im Code nur ein Schritt: das Abholen der Daten (`build/fetch-sheet-cli.js`). Alles danach (Prüfen, Freigabe, Bauen) arbeitet mit 9 CSV-Dateien. Ohne API ginge es so:

1. `.xlsx` speichern
2. `python build/xlsx-to-csv.py master.xlsx public/data` macht daraus die CSVs
3. die CSVs per Pull Request ins Repo
4. der Deploy baut aus den CSVs im Repo (dafür müssten die Workflows umgestellt werden)

Im Alltag ist das nur Mehraufwand. Sinnvoll ist es, wenn der Zugriff auf die Google-API ausfällt: Dann lässt sich trotzdem veröffentlichen.

## Siehe auch

- [Vom Sheet zur Website](vom-sheet-zur-website.md): der ganze Weg der Daten
- [Glossar: GitHub Pages](glossar.md#github-pages)
