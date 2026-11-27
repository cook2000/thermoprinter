# Druckfrisch

Eine kindgerechte Web-App für Bluetooth-Mini-Thermodrucker, also die Geräte, die sonst mit der App „Fun Print“ laufen (getestet wird mit dem AgoDeo Mini, 300 dpi). Ein Kind macht ein Foto oder wählt eines aus, setzt einen Rahmen darum und druckt es als Sticker oder auf die Rolle. Die App hat keine Werbung, braucht kein Konto, und alles bleibt auf dem Gerät.

Druckfrisch ist eine installierbare Web-App (PWA). Sie läuft im Browser, lässt sich wie eine normale App auf den Startbildschirm legen und funktioniert danach auch offline.

## Funktionen (Version 1.0, Etappe 1)

- **Foto oder Kamera:** Bild aus der Galerie oder direkt in der App fotografieren, mit Schwarz-Weiß-Vorschau „Wie gedruckt“.
- **Rahmen:** 11 Rahmen (Sterne, Herzen, Blumen, Tatzen, Party, Katze, Weltraum, Filmstreifen, Zickzack, Konfetti) und eine Beschriftung im Rahmen.
- **Look:** Foto, Comic oder Umriss, dazu ein Helligkeitsregler. Die Tonwerte gleicht die App automatisch aus.
- **Drucken:** Rolle oder Sticker. Sticker gibt es in drei Größen mit gestrichelter Schneidelinie, ein- bis neunmal hintereinander.
- **Meine Drucke:** Die letzten 40 Drucke liegen auf dem Gerät und lassen sich mit einem Tipp nochmal drucken.
- **Eltern-Bereich:** Hier richtet man den Drucker ein, stellt Druckbreite, Hitze, Sticker-Größen, App-Name, Akzentfarbe und PIN ein und stößt Updates an.

## Voraussetzungen

- **Browser:** Chrome oder Edge mit Web Bluetooth, also Android, Windows, macOS oder ChromeOS. Safari auf iPhone und iPad kann kein Bluetooth im Browser, dort geht es nur über die App „Bluefy“.
- **HTTPS:** Die App muss über HTTPS ausgeliefert werden, z. B. über GitHub Pages. Für Tests am Rechner geht auch `http://localhost`.
- **Drucker:** Ein Thermodrucker aus der Fun-Print-/Cat-Printer-Familie mit Bluetooth LE.

## Installation mit GitHub Pages

1. Ein öffentliches Repository anlegen, z. B. `druckfrisch`.
2. Alle Dateien hochladen: `index.html`, `app.css`, `app.js`, `render.js`, `printer.js`, `sw.js`, `manifest.json`, `icon-192.png`, `icon-512.png`, `README.md`.
3. Unter **Settings → Pages** die Option **Deploy from a branch** wählen, Branch `main`, Ordner `/ (root)`.
4. Nach etwa einer Minute ist die App unter `https://<name>.github.io/druckfrisch/` erreichbar.
5. Die Adresse auf dem Tablet in Chrome öffnen und im Menü **App installieren** tippen.

Lokal testen am Rechner:

```
python3 -m http.server 8000
```

Danach im Browser `http://localhost:8000` öffnen.

## Erste Einrichtung

1. Den Drucker einschalten.
2. In der App das **Zahnrad 2 Sekunden gedrückt halten** und die Rechenaufgabe lösen.
3. Unter **Drucker → Einrichten** den Drucker aus der Liste wählen. Das ist nur einmal nötig.
4. Den **Testdruck** machen und am Lineal die Druckbreite prüfen:
   - Füllt das Lineal das Papier genau aus, passt die Breite. Bei 300 dpi sind das meist 576 Pixel.
   - Füllt es nur etwa zwei Drittel, auf **384 px · 203 dpi** stellen.
   - Ist es abgeschnitten, unter **Druckbreite → eigene** den Wert eintragen, an dem der Druck am Lineal endet.
5. Die **Hitze** einstellen: Mit 50 % anfangen und nur so weit erhöhen, bis Fotos satt schwarz sind. Schmiert der Druck oder wird der Drucker spürbar warm, wieder runterdrehen. Die **Obergrenze** (Standard 80 %) schützt den Druckkopf, weil manche Modelle die Wärmesteuerung der App überlassen.
6. Die **Sticker-Größen** in mm an das eigene Stickerpapier anpassen (Standard 30, 50 und 80 mm).
7. Optional eine **PIN** festlegen. Ohne PIN fragt die Sperre eine Rechenaufgabe ab.

## Verbindung zum Drucker

Das Kind soll den Drucker nie aus einer Geräteliste suchen müssen. Die App verbindet sich deshalb in Stufen:

1. **Einrichten:** Ein Erwachsener wählt den Drucker einmal im Eltern-Bereich aus. Die App merkt sich Name und Kennung.
2. **Beim Drucken:** Ist der Drucker nicht verbunden, verbindet die App beim Tippen auf „Drucken“ selbst. Muss Chrome trotzdem fragen, erscheint nur noch dieser eine Drucker zur Auswahl.
3. **Abbruch:** Reißt die Verbindung ab, z. B. weil der Drucker kurz aus war, verbindet die App automatisch neu.
4. **App-Start:** Unterstützt Chrome gemerkte Geräte (`navigator.bluetooth.getDevices()`), verbindet die App beim Start ganz ohne Auswahl. Fehlt die Funktion, können Eltern sie einmalig in Chrome einschalten:
   - `chrome://flags/#enable-web-bluetooth-new-permissions-backend`
   - `chrome://flags/#enable-experimental-web-platform-features`

## Updates

Die App holt sich neue Versionen selbst. Bei jedem Start fragt sie beim Server nach, lädt neue Dateien im Hintergrund und verwendet sie beim nächsten Öffnen. Mitten im Gestalten wechselt die Version nie.

Im Eltern-Bereich holt **Jetzt aktualisieren** die neueste Version sofort, leert den Zwischenspeicher und lädt neu.

**Neue Version veröffentlichen:**

1. In `app.js` die Konstante `APP_VERSION` hochzählen, z. B. `'1.0.1'`.
2. In `sw.js` die Konstante `VERSION` auf denselben Stand setzen, z. B. `'df-1.0.1'`.
3. Die geänderten Dateien ins Repository hochladen.

Ohne Änderung an `sw.js` erkennt der Browser kein Update zuverlässig.

## Aufbau

| Datei | Inhalt |
| --- | --- |
| `index.html` | Alle Bildschirme: Start, Kamera, Gestalten, Drucken, Meine Drucke, Eltern-Bereich |
| `app.css` | Gestaltung: Lexend, Papierweiß, Pink, Blau und Türkis, große Tippflächen |
| `app.js` | App-Logik, Navigation, Einstellungen, Verlauf (IndexedDB), Eltern-Sperre, Updates |
| `render.js` | Bildaufbereitung: Tonwerte, Rasterung, Looks, Rahmen, Beschriftung, Sticker-/Rollenlayout, Testdruck |
| `printer.js` | Bluetooth-Anbindung: Einrichten, Auto-Verbindung, Druckprotokolle |
| `sw.js` | Service Worker für Offline-Betrieb und Updates |
| `manifest.json` | App-Name, Icons und Farben für die Installation |

Die Rahmen sind für 384 logische Pixel gezeichnet und werden auf die eingestellte Druckbreite skaliert. Fotos werden in voller Druckbreite gerastert, Rahmen und Schrift bleiben scharfe Linien.

## Druckprotokoll

Unterstützt werden zwei Protokolle der Drucker, die sonst „Fun Print“, „iPrint“ oder „iBleem“ nutzen:

- **Klassisch:** Befehle `0x51 0x78 …` über den BLE-Dienst `0xAE30` bzw. `0xAF30`, Zeichenkanal `…01`, Rückmeldungen über `…02`. Das ist die Standardeinstellung.
- **MXW01:** Befehle `0x22 0x21 …` mit eigenem Datenkanal `…03`.

Unter **Eltern-Bereich → Erweitert** lassen sich Protokoll, Paketgröße und Pause zwischen Paketen ändern und die Bitreihenfolge umkehren, falls der Druck gespiegelt ist. Dort steht auch ein Protokoll-Log mit den Rückmeldungen des Druckers.

## Fehlersuche

| Problem | Lösung |
| --- | --- |
| „Kein Drucker“ auf dem Startbildschirm | Im Eltern-Bereich **Einrichten** tippen. |
| Drucker wird nicht gefunden | Drucker einschalten und nicht mit der Fun-Print-App verbunden lassen. Bluetooth und Standort am Tablet einschalten. |
| Druck nur auf einem Teil der Breite oder verzerrt | Druckbreite per Testdruck korrigieren. |
| Druck gespiegelt | **Erweitert → Bitreihenfolge umkehren**. |
| Streifen, Lücken oder Abbrüche | **Erweitert:** Paketgröße verkleinern (z. B. 64), Pause erhöhen (z. B. 20 ms). |
| Druck zu blass oder zu dunkel | Hitze je Papierart anpassen, im Editor unter **Look** die Helligkeit ändern. |
| Kamera geht nicht | In Chrome für die Seite die Kamera erlauben. Ersatzweise **Foto** aus der Galerie nehmen. |
| Neue Version kommt nicht an | Im Eltern-Bereich **Jetzt aktualisieren** tippen. |

## Datenschutz

- Kein Konto, keine Werbung, kein Tracking.
- Fotos und Drucke bleiben auf dem Gerät (IndexedDB). Gespeichert werden nur die fertigen Schwarz-Weiß-Drucke, nicht die Originalfotos.
- Aus dem Netz lädt die App nur ihre eigenen Dateien und die Schrift Lexend von Google Fonts. Beides wird danach offline zwischengespeichert.

## Fahrplan

- **Etappe 1 (fertig):** Foto, Kamera, Rahmen, Look, Rolle und Sticker, Meine Drucke, Eltern-Bereich.
- **Etappe 2:** Smileys und Sticker aufs Bild ziehen, drehen und vergrößern. Text in witzigen Schriften mit Umriss-, Negativ- und Banner-Effekt.
- **Etappe 3 (Experiment):** KI-Bilder im Comic- oder Strichmännchen-Stil, nur mit Freigabe durch die Eltern und mit Tageslimit.

## Danksagung und Lizenzen

- Schrift: [Lexend](https://fonts.google.com/specimen/Lexend), SIL Open Font License.
- Die Protokoll-Kenntnisse stammen aus Community-Projekten, die die Cat-Printer- und Fun-Print-Familie offengelegt haben, unter anderem [NaitLee/Cat-Printer](https://github.com/NaitLee/Cat-Printer) und [joepie91/cat-printer-protocol](https://codeberg.org/joepie91/cat-printer-protocol).
- Druckfrisch ist ein privates Projekt und steht in keiner Verbindung zu den Herstellern der Drucker oder der App „Fun Print“.
