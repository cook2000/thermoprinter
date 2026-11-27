# Druckfrisch – Projektkontext für Claude Code

Übergabe aus einem Claude-Chat vom 25.–27.11.2026. Diese Datei enthält alles, was man zum Weiterarbeiten braucht: Ziel, Entscheidungen, Hardware-Befunde, Stand des Codes und die nächsten Schritte.

## Arbeitsweise (wichtig)

- **Immer zuerst einen Plan vorlegen und erst umsetzen, wenn Holger ihn freigibt.**
- Sprache: Deutsch. UI-Texte für ein 8-jähriges Kind: einfach, freundlich, **nicht zu kindlich**.
- Nach jeder Änderung `APP_VERSION` in `app.js` **und** `VERSION` in `sw.js` gemeinsam hochzählen, sonst kommt das Update nicht aufs Tablet.
- Committen erst nach Freigabe.

## Ziel

Eigene Web-App (PWA) für einen Bluetooth-Mini-Thermodrucker als Ersatz für die Hersteller-App „Fun Print“, die schlecht übersetzt und voller Werbung ist. Die App ist ein Geburtstagsgeschenk für Holgers 8-jährige Tochter (Geburtstag Anfang Dezember 2026).

- **Gerät:** Android-Tablet mit Chrome und Web Bluetooth.
- **Hosting:** GitHub Pages (HTTPS), installiert über „App installieren“.
- **Datenschutz:** kein Konto, kein Tracking, alles bleibt auf dem Gerät.
- **Name:** „Druckfrisch“ ist ein Arbeitstitel. Die Tochter kann den App-Namen im Eltern-Bereich ändern.

## Hardware: AgoDeo Mini (BLE-Name `MXW01`)

Befunde aus Testdrucken am 27.11.2026:

| Thema | Ergebnis |
| --- | --- |
| BLE-Name | `MXW01`, Service `0xAE30`, Charakteristiken `AE01` (Befehle), `AE02` (Notify), `AE03` (Bilddaten) |
| Druckbreite | **384 Punkte** (48 Byte/Zeile im 1-Bit-Modus). Testdruck mit 384 px füllt genau die Breite. Mit 576 px bricht jede Zeile um, das Bild erscheint doppelt und schräg. |
| „300 dpi“ laut Hersteller | Horizontal falsch: 384 Punkte auf ca. 48 mm = 203 dpi. Laut Beschreibung „200 dpi = Highspeed, 300 dpi = HD“. Ob HD vertikal feinere Zeilen druckt, ist **offen** (Messung mit dem Labor steht aus). Hinweis aus einem Foto: Der HD-Druck aus Fun Print wirkte flacher als der Schnell-Druck. |
| HD-Modus | Fun Print „HD“ = 4 Bit pro Punkt, 16 Graustufen, 192 Byte/Zeile. Sieht bei Fotos deutlich besser aus und druckt langsamer. |
| Graustufen im 1-Bit-Modus | Im Testdruck liefen die 3 dunkelsten Stufen zu Schwarz zusammen, weil die Hitze zu hoch war (siehe Bug unten). |
| Fun-Print-Kamera | Verzerrt die Vorschau und schneidet auf 1:1 zu. Unsere App druckt das Originalformat. |

### MXW01-Protokoll (aus Community-Projekten, u. a. matheisenheim/agodeo-web-printer, ramos-adrian/catprinter, veli-ozturk/mxw01-sticker-printer)

- **Rahmen:** `22 21 <cmd> 00 <len lo> <len hi> <data…> <crc8(data)> FF`, CRC-8 mit Polynom 0x07.
- **Ablauf:** `A2` Intensität → `A1` Status → `A9` Druckauftrag → Bilddaten auf `AE03` → `AD` Daten fertig → auf `AA` (Druck fertig) warten.
- **A2 Intensität:** Wertebereich **0–100** (0x00–0x64), empfohlen **93** (0x5D).
- **A9 Druckauftrag:** `[Zeilen lo, Zeilen hi, Bytes pro Zeile, Modus]`. Bytes pro Zeile: `0x30` = 48 (1 Bit) bzw. `0xC0` = 192 (4 Bit). Modus: `0x00` = 1 Bit, `0x02` = 4 Bit. Die Antwort `A9` mit `data[0] == 0` heißt OK.
- **1 Bit:** LSB zuerst, Bit 0 ist das linke Pixel, 1 = schwarz.
- **4 Bit:** zwei Pixel pro Byte, **linkes Pixel im oberen Halbbyte**, 15 = schwarz, 0 = weiß.
- **Minimum:** 90 Zeilen pro Auftrag, kürzere Aufträge mit weißen Zeilen auffüllen.
- **Senden:** zeilenweise (48 bzw. 192 Byte pro Write) mit ca. 12 ms Pause.
- **A1 Status (Nutzdaten ab Byte 6):** `[0]` Zustand (0 bereit, 1 druckt, 2 Vorschub, 3 Auswurf), `[3]` Akku %, `[4]` Kopf-Temperatur °C, `[6]` 0 = OK, `[7]` Fehler (0x01/0x09 kein Papier, 0x04 überhitzt, 0x08 Akku schwach).

## Repository-Inhalt

| Datei | Inhalt |
| --- | --- |
| `index.html` | Alle Bildschirme: Start, Kamera, Gestalten, Drucken, Meine Drucke, Eltern-Bereich |
| `app.css` | Gestaltung nach dem Screendesign |
| `app.js` | App-Logik, Navigation, Einstellungen (`localStorage df_settings`), Verlauf (IndexedDB `druckfrisch`), Eltern-Sperre, Updates. `APP_VERSION = '1.0.0'` |
| `render.js` | Bildaufbereitung: Auto-Tonwerte, Looks (Foto, Comic, Umriss), Rasterung, 11 Rahmen (für 384 logische px gezeichnet, skaliert), Beschriftung, Sticker-/Rollenlayout mit Schneidelinie, Testdruck |
| `printer.js` | BLE: Einrichten, gefilterte Auswahl, `getDevices`-Autoconnect, Wiederverbinden. Protokolle klassisch (`51 78`) und MXW01 (`22 21`). Einstellungen in `localStorage df_printer` |
| `sw.js` | Service Worker, Network-first für eigene Dateien, Schriften im Cache. `VERSION = 'df-1.0.0'` |
| `manifest.json`, `icon-192.png`, `icon-512.png` | PWA-Installation |
| `README.md` | Nutzer- und Betriebsanleitung (Einrichtung, Updates, Fehlersuche) |
| `labor/index.html` | **Drucker-Labor**, eigenständige Testseite nur für MXW01 (siehe unten) |

Ältere Prototyp-Dateien („Katzendrucker“, eine einzelne `index.html` mit 384-px-Druck) sind überholt und können weg, falls sie noch im Repo liegen.

## Stand

### Version 1.0.0 (Etappe 1) – gebaut, am Gerät teilweise getestet

- **Start:** Kacheln Foto, Kamera und Text (Text als „bald“ gesperrt), Druckerstatus, letzte Drucke.
- **Kamera:** getUserMedia, Umschalter „Wie gedruckt“, Kamerawechsel, Galerie.
- **Gestalten:** Reiter Rahmen (11 Rahmen + Beschriftung) und Look (Foto, Comic, Umriss + Helligkeit + Zurücksetzen). Reiter Smileys und Text sind als „bald“ gesperrt. Rückgängig.
- **Drucken:** Rolle oder Sticker, Größen Klein/Mittel/Groß (Standard 30/50/80 mm), Anzahl 1–9, Vorschau, Fertig-Overlay.
- **Meine Drucke:** IndexedDB, max. 40 Einträge, „Nochmal“.
- **Eltern-Bereich:** Zahnrad 2 s halten, dann Rechenaufgabe oder PIN. Enthält Drucker einrichten, Autoconnect, Druckbreite, Testdruck, Hitze je Papier und Obergrenze, Sticker-Größen, App-Name, Akzentfarbe, Version und „Jetzt aktualisieren“, PIN, Erweitert (Protokoll, Paketgröße, Pause, Bitreihenfolge, Vergessen, Log).

### Bekannte Fehler in 1.0.0 (werden mit 1.1 behoben)

1. **Druckbreite:** Standard ist 576 px. Für MXW01 muss es 384 sein.
2. **Hitze beim MXW01:** `printer.js` schickt bei `A2` den Wert `heat/100*255`. Erlaubt sind 0–100, deshalb druckt alles zu dunkel.
3. **A9 beim MXW01:** Bytes pro Zeile sind fest `0x30`, Modus fest `0x00`. Es gibt keinen 4-Bit-Modus.
4. **Übertragung:** Daten gehen in 128-Byte-Stücken statt zeilenweise.
5. **Status:** A1-Status (Akku, Fehler) wird nicht ausgewertet.

### Drucker-Labor (`labor/index.html`) – gebaut, am Gerät noch ungetestet

Mit simuliertem Drucker geprüft. Funktionen:
- Verbinden (Filter `namePrefix: 'MXW'`) mit Status-Anzeige
- Kalibrier-Streifen in Schnell und HD: Lineal, 16 Graustufen, senkrechter Balken von 240 Zeilen (= 30 mm bei 203 lpi). Ein Eingabefeld rechnet aus der gemessenen Länge die Zeilen pro Zoll aus.
- Hitze-Reihe
- Testfoto in beiden Modi mit Helligkeit, Gamma und Rasterwahl
- Einstellungen: Hitze, HD-lpi, Halbbytes tauschen, Bitreihenfolge, Paketgröße, Pause
- Log mit Kopieren-Knopf

**Ausstehende Rückmeldung von Holger:**
- gemessene Balkenlänge in Schnell und in HD
- beste Hitze
- ob „Halbbytes tauschen“ nötig war
- Fotos der Drucke

## Nächste Schritte

### Druckfrisch 1.1 (Plan mit Holger abgestimmt, Umsetzung nach den Labor-Ergebnissen)

1. **Schalter „Schön“ / „Schnell“ auf dem Drucken-Bildschirm** (nicht im Eltern-Bereich), neben Rolle/Sticker. „Schön“ = HD mit 4 Bit und 16 Graustufen, „Schnell“ = 1 Bit gerastert. Die Vorschau zeigt den jeweiligen Modus. Nur sichtbar, wenn der Drucker HD kann (MXW01). Beide Modi haben laut Holger ihre Berechtigung.
2. **Druckbreite:** bei MXW01 automatisch 384 px. Die Auswahl wandert nach „Erweitert“.
3. **Hitze:** Bereich 0–100, Startwert 93 oder der Wert aus dem Labor. Die Obergrenze entfällt. Der Testdruck bekommt 16 Graustufen. Holger kann die Hitze selbst nicht einschätzen, deshalb hilft der Testdruck mit einer Erklärung im Eltern-Bereich.
4. **HD-Zeilenabstand:** Einstellung unter „Erweitert“ (203 oder 300 Zeilen pro Zoll), festgelegt nach der Messung im Labor. Sie wirkt auf Seitenverhältnis und Sticker-Längen im HD-Modus.
5. **Schnell-Modus heller:** Fotos vor dem Rastern aufhellen bzw. Gamma anpassen, gegen Punktzuwachs auf Thermopapier.
6. **Übertragung:** zeilenweise mit ca. 12 ms Pause, mindestens 90 Zeilen.
7. **Status:** Akku neben „Drucker bereit“ anzeigen, kindgerechte Meldungen bei leerem Papier, Überhitzung oder schwachem Akku.
8. **Pipeline:** `render.js` soll neben 1-Bit-Daten auch Graustufen (0–15) liefern. Rahmen und Schrift immer 15 (schwarz), Foto-Inhalt im HD-Modus ungerastert.
9. **Version** auf 1.1.0 setzen.

### Etappe 2 (bis zum Geburtstag gewünscht)

- **Smileys und Sticker aufs Bild:** antippen, ziehen, mit zwei Fingern drehen und vergrößern, Kategorien Gesichter, Sprechblasen, Tiere, Deko. Eigene Schwarz-Weiß-Linien-SVGs, z. B. auf Basis von OpenMoji-Outlines (CC BY-SA). Rückgängig.
- **Text in witzigen Schriften:** Bangers, Permanent Marker, Press Start 2P, Pacifico, Rubik Mono One, Gochi Hand (offline cachen). Effekte Normal, Umriss, Negativ und Banner (quer über einen langen Streifen). Größenregler. Start-Kachel „Text“ freischalten.
- Kontrast-Regler: bewusst **weggelassen**. Es gibt Look-Voreinstellungen plus Helligkeit.

### Etappe 3 (Experiment, später)

KI-Bilder im Comic- oder Strichmännchen-Stil, nur mit Freigabe durch die Eltern, mit Tageslimit und Kinderschutzfilter. Der Prototyp nutzte Pollinations. Anonym gab es 403-Fehler, deshalb einen eigenen Schlüssel von enter.pollinations.ai einplanen (Parameter `key`, Endpunkt `gen.pollinations.ai/image/…`).

## Design

- **Screendesign** (9 Tablet-Bildschirme 800 × 1280): https://claude.ai/artifact/7VHedJgwB5TQXQ478xXyC7
- **Konzept-Dokument** (Funktionsumfang, Skribbles, Technik, Fahrplan): https://claude.ai/artifact/2a98QukVqRXEG3b2rhZ7kN
- **Farben:** Hintergrund `#f6f3ec`, Text `#1d1b18`, Akzent Pink `#ff2d87` (Aktion, Auswahl, Drucken-Knopf, Schneidelinie), Blau `#2f5bff` (Navigation, aktive Reiter, Weiter), Türkis `#19d3c5` (Kamera-Kachel, Nebenakzente). Die Akzentfarbe ist im Eltern-Bereich wählbar (Pink, Türkis, Lila `#7a5af8`, Blau).
- **Schrift:** Lexend (gut lesbar für Leseanfänger).
- **Prinzipien:** ein Schritt pro Bildschirm, Symbol plus Wort, Tippflächen mindestens 56 px, Vorschau = Druck, nichts kann kaputtgehen (Rückgängig, keine Löschfragen), Erwachsenenkram hinter der Eltern-Sperre.
- **Bluetooth ohne Geräteliste für das Kind:** Eltern richten einmal ein. Danach gefilterte Auswahl mit genau einem Gerät, automatisches Wiederverbinden, `getDevices()` beim Start (ggf. Chrome-Flags `enable-web-bluetooth-new-permissions-backend` und `enable-experimental-web-platform-features`) und Verbinden beim Tippen auf „Drucken“.

## Testen

- Lokal: `python3 -m http.server 8000`, dann `http://localhost:8000` bzw. `/labor/`.
- Headless-Tests mit Playwright gehen, wenn man `navigator.bluetooth` und das `Printer`-Objekt mockt. Beim Labor reicht ein Mock-Gerät, das auf `A1`, `A9` und `AD` mit Notifications antwortet.
