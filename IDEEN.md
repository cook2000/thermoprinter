# Druckfrisch – Ideen für spätere Ausbaustufen

Stand: 28.11.2026, passend zu Version 1.1.2 (Sticker und Text gebaut, 1.2.0 mit Start-Kachel „Text“ und Effekt „Banner“ geplant). Hier stehen Ideen für die Zeit **nach** Etappe 2, jede mit Ablauf, Design-Entwurf, UI-Texten und technischen Hinweisen. Nichts davon ist freigegeben. Wie immer gilt: erst Plan, dann Umsetzung.

## Übersicht

| Nr. | Idee | Nutzen fürs Kind | Aufwand | Empfehlung |
| --- | --- | --- | --- | --- |
| 1 | **Zuschnitt** (Original, Quadrat, Hochformat, Kreis, Herz) | Nur das Wichtige drauf, Sticker werden kleiner und runder | mittel | bald |
| 2 | **Sprechblase mit Freitext** | Freunde und Haustiere „reden“ lassen, sehr witzig | mittel | bald |
| 3 | Malen mit dem Finger | Eigene Kritzeleien auf Fotos oder leerem Blatt | mittel | bald |
| 4 | Ausmalbild | Drucken, dann mit Stiften ausmalen, beschäftigt lange | klein | bald |
| 5 | Fotostreifen wie im Fotoautomaten | 4 Grimassen hintereinander, perfekt für den langen Streifen | mittel | später |
| 6 | Mini-Comic mit 2–4 Feldern | Eigene Geschichten erzählen | groß | später |
| 7 | Rätsel: Labyrinth und Wörtersuche | Für Freunde und lange Autofahrten, immer neu | mittel | später |
| 8 | Zettel: Liste, Wunschliste, Stundenplan | Etwas „Echtes“ drucken, das man benutzt | mittel | später |
| 9 | Tagebuch-Zettel „Mein Tag“ | Jeden Tag ein Zettel, sammeln im Heft | klein | später |
| 10 | Geheimschrift (Spiegelschrift, Geheimcode) | Geheime Botschaften für die beste Freundin | klein | bald |
| 11 | Namensschilder und Etiketten | Hefte, Boxen, Zimmertür beschriften | klein | später |
| 12 | Karten zum Falten (Geburtstag, Danke, Einladung) | Selbst gemachte Karten verschenken | mittel | später |
| 13 | Meine Sticker (aus Zeichnung oder Foto) | Eigene Bilder als Sticker wiederverwenden | mittel | später |
| 14 | Geheimnachricht als QR-Code | Botschaft, die nur ein Handy lesen kann | mittel | vielleicht |

Was das Papier gut kann (gilt für alle Ideen): 384 Punkte = 48 mm Druckbreite auf 58-mm-Papier, beliebig lang. Klare schwarze Linien, große Flächen und dicke Schrift wirken am besten. Feine Graustufen nur im Modus „Schön“. Lange, schmale Formate (Streifen, Banner, Listen) sind eine Stärke, breite Tabellen eine Schwäche – die lieber quer drucken.

---

## 1. Zuschnitt (Wunsch von Holger)

**Was es ist:** Das Kind wählt eine Form für das Foto (Original, Quadrat 1:1, Hochformat 3:4, Kreis, Herz) und schiebt und zoomt das Foto mit den Fingern, bis das Wichtige drin ist. Kreis und Herz sind Masken: außen bleibt das Papier weiß, am Rand läuft eine schwarze Linie.

### Wo es im Ablauf sitzt

Empfehlung: **eigener Reiter „Zuschnitt“ als erster Reiter beim Gestalten**, Standard „Original“. Gründe:
- Kein zusätzlicher Pflichtschritt nach der Fotoauswahl. Wer nichts zuschneiden will, merkt nichts davon.
- Der Zuschnitt bleibt jederzeit änderbar und steckt im Rückgängig.
- Rahmen, Beschriftung, Sticker und Text sieht man beim Zuschneiden schon mit (Vorschau = Druck).

Alternative (nicht empfohlen): eigener Bildschirm direkt nach der Fotoauswahl. Passt zum Prinzip „ein Schritt pro Bildschirm“, kostet aber bei jedem Foto einen Tipper und lässt sich später schlechter ändern.

### Ablauf

1. Foto wählen oder knipsen → Gestalten öffnet sich, Reiter „Zuschnitt“ ist aktiv, Form „Original“.
2. Form antippen, z. B. „Quadrat“. Das Foto füllt die Form sofort mittig aus.
3. Mit einem Finger verschieben, mit zwei Fingern zoomen. Das Foto füllt die Form immer ganz aus, es entstehen keine weißen Ränder.
4. „Passt so“ ist nicht nötig: Wechsel auf einen anderen Reiter beendet den Zuschnitt. Ein Hinweis unter der Vorschau erklärt die Gesten.
5. Knopf „Zurück auf Mitte“ stellt Zoom und Ausschnitt zurück.

### Design-Entwurf

```
┌──────────────────────────────────────────┐
│ ‹ Zurück                    (↶) [Weiter] │
│                                          │
│        ┌────────────────────────┐        │
│        │                        │        │
│        │    ╭──────────────╮    │        │
│        │    │              │    │        │
│        │    │   (Gesicht)  │ ◄──┼── Foto │
│        │    │              │    │ ziehen │
│        │    ╰──────────────╯    │        │
│        │                        │        │
│        └────────────────────────┘        │
│   Ziehen zum Verschieben · zwei Finger   │
│   zum Zoomen                             │
│╭────────────────────────────────────────╮│
││ Zuschnitt  Rahmen  Smileys  Text  Look ││
││ ‾‾‾‾‾‾‾‾‾                              ││
││ ┌──────┐┌──────┐┌──────┐┌──────┐┌─────┐││
││ │ ▭    ││ □    ││ ▯    ││ ○    ││ ♥   │││
││ │Origi-││Qua-  ││Hoch- ││Kreis ││Herz │││
││ │nal   ││drat  ││format││      ││     │││
││ └──────┘└──────┘└──────┘└──────┘└─────┘││
││                                        ││
││ Zoom   −  ─────────●──────────  +      ││
││                                        ││
││ Zurück auf Mitte                       ││
│╰────────────────────────────────────────╯│
└──────────────────────────────────────────┘
```

### UI-Texte

| Stelle | Text |
| --- | --- |
| Reiter | Zuschnitt |
| Formen | Original · Quadrat · Hochformat · Kreis · Herz |
| Hinweis unter der Vorschau | Ziehen zum Verschieben · zwei Finger zum Zoomen |
| Regler | Zoom |
| Knopf | Zurück auf Mitte |

### Technik

- **Zustand:** `ed.crop = { shape: 'orig'|'square'|'portrait'|'circle'|'heart', z: 1, cx: 0.5, cy: 0.5 }` (Zoom ≥ 1, Mittelpunkt in Bildanteilen 0…1). Gehört in `snap()` und damit ins Rückgängig. Flach halten oder in `snap()` tief kopieren.
- **`render.js` / `compose`:** vor `photoContent` einen Quellausschnitt berechnen. Seitenverhältnis aus der Form (1, 3/4, Original), dann `ch = cw / aspect`. `photoContent` bekommt Quellrechteck und Form als zusätzliche Schlüssel für den Cache. `drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch)` statt ganzes Bild. Vorteil: `autoLevels` rechnet nur noch auf dem sichtbaren Ausschnitt, das Ergebnis wird besser.
- **Masken Kreis/Herz:** nach `process` alle Tinten-Pixel außerhalb der Maske auf 0 setzen und eine Randlinie (3 logische px) als festes Schwarz in die Rahmen-Ebene zeichnen. Herz-Pfad wie `heart()` in `render.js` wiederverwenden.
- **Rahmen:** `geo(F, ih)` arbeitet schon mit der Inhaltshöhe, Rahmen passen sich automatisch an.
- **Gesten in `app.js`:** die vorhandenen Pointer-Handler auf `editPreview` bekommen einen Modus. Ist der Reiter „Zuschnitt“ aktiv, bewegen Finger den Ausschnitt statt `ed.items`. Gleiche Mathematik wie bei Stickern (Abstand der Finger → Zoom, Mittelpunkt → Verschiebung). Ausschnitt so begrenzen, dass er nie aus dem Foto ragt (cover). Mausrad = Zoom am Computer.
- **Elemente:** Wenn die Höhe sich ändert, `ed.items` mit `y > logicalH()` in den sichtbaren Bereich holen.
- **Kamera:** Fotostreifen (Idee 5) und Comic (Idee 6) nutzen dieselbe Zuschnitt-Funktion.
- **Aufwand:** mittel (ca. 1–2 Abende).

---

## 2. Sprechblase mit Freitext (Wunsch von Holger)

**Was es ist:** Eine Sprech-, Gedanken- oder Rufblase, in die das Kind selbst schreibt. Die Blase wächst mit dem Text und bricht lange Sätze in Zeilen um. Der Schwanz der Blase hat einen eigenen Griff und lässt sich auf eine Person oder ein Tier ziehen.

### Ablauf

1. Reiter „Text“ öffnen (oder bei „Smileys“ → „Sprechblasen“ die erste Kachel „Selbst schreiben“ antippen, die direkt zum Text-Reiter springt).
2. Unter „Blase“ eine Form wählen: Ohne · Sprechen · Denken · Rufen.
3. Text tippen. Die Blase erscheint in der Bildmitte und wächst beim Tippen mit.
4. Blase ziehen zum Verschieben, zwei Finger = Text größer oder kleiner.
5. Den pinken Punkt an der Spitze auf die Person ziehen. Beim Verschieben der Blase bleibt die Spitze auf der Person stehen.

### Design-Entwurf

```
┌──────────────────────────────────────────┐
│ ‹ Zurück                    (↶) [Weiter] │
│                                          │
│        ┌────────────────────────┐        │
│        │  ╭──────────────────╮  │        │
│        │  │ Ich will auch    │  │        │
│        │  │ ein Eis!         │  │        │
│        │  ╰────╮  ╭──────────╯  │        │
│        │       │ ╱              │        │
│        │       ●  ◄── Spitze    │        │
│        │    (Hund)    ziehen    │        │
│        │                        │        │
│        └────────────────────────┘        │
│╭────────────────────────────────────────╮│
││ Zuschnitt  Rahmen  Smileys  Text  Look ││
││                            ‾‾‾‾        ││
││ Dein Text                              ││
││ ┌──────────────────────┐ ┌───────────┐ ││
││ │ Ich will auch ein Eis│ │+ Neuer    │ ││
││ └──────────────────────┘ │  Text     │ ││
││                          └───────────┘ ││
││ Blase                                  ││
││ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐││
││ │  Aa   │ │ ╭──╮  │ │ ◯ ∘   │ │ ✷     │││
││ │ Ohne  │ │Spre-  │ │Denken │ │ Rufen │││
││ │       │ │chen   │ │       │ │       │││
││ └───────┘ └───────┘ └───────┘ └───────┘││
││ Schrift  [Comic] [Filzstift] [Pixel] … ││
││ Größe    A ──────●─────────── A        ││
│╰────────────────────────────────────────╯│
└──────────────────────────────────────────┘
```

### UI-Texte

| Stelle | Text |
| --- | --- |
| Abschnitt | Blase |
| Formen | Ohne · Sprechen · Denken · Rufen |
| Kachel bei „Sprechblasen“ | Selbst schreiben |
| Platzhalter im Feld | z. B. Ich will auch ein Eis! |
| Hinweis bei Auswahl | Zieh den pinken Punkt auf die Person, die spricht |

### Technik

- **Datenmodell:** kein neues `kind`, sondern ein Text mit Zusatzfeldern: `{ kind: 'text', text, font, fx, x, y, s, r: 0, bubble: 'speech'|'thought'|'shout', tx, ty }`. `tx`, `ty` = Spitze in logischen Koordinaten, **absolut** (bleibt beim Verschieben auf der Person). Flache Felder, weil `snap()` die Elemente nur flach kopiert (`{ ...it }`).
- **Vorteil:** Eingabefeld, Schriften, `fitText`, Größenregler, Antippen und Rückgängig funktionieren sofort weiter. „Ohne“ entfernt `bubble`.
- **`render.js`:** `itemSize` rechnet bei `bubble` mit Zeilenumbruch (max. ca. 240 logische px Breite, max. 4 Zeilen) plus Innenabstand. `drawItem` zeichnet zuerst die Blase (weiß gefüllt, schwarze Linie 3–4 px), dann den Schwanz, dann die Zeilen. Sprechen: abgerundetes Rechteck oder Ellipse plus Dreieck zur Spitze. Denken: Wolke plus 3 kleiner werdende Kreise entlang der Linie. Rufen: Zackenform wie `spiky` aus `stickers.js`. Der Schwanz wird in Weltkoordinaten berechnet (Spitze minus Mitte), deshalb Blasen nicht drehen (`r` bleibt 0, zwei Finger ändern nur die Größe).
- **`app.js`:** `placeSel()` zeigt bei Blasen zusätzlich einen pinken Griff an `tx/ty` (wie der Papierkorb, nur Anzeige). `hit()` prüft zuerst den Griff (Radius ca. 28 logische px, damit 56 px Tippfläche erreicht werden). Ziehen am Griff ändert nur `tx/ty`. Beim Anlegen Spitze unterhalb der Blase setzen.
- **Eingabe:** `maxlength` für Blasen auf 80 erhöhen. Ein `<input>` reicht, der Umbruch passiert automatisch.
- **`index.html`:** Abschnitt „Blase“ im Text-Reiter, gleiches Kachel-Muster wie `#effects`. In `stickers.js` bleiben die fertigen Blasen („HALLO!“, „WOW!“) erhalten.
- **Aufwand:** mittel (ca. 1–2 Abende).

---

## Gemeinsamer Einstieg: Kachel „Basteln“

Viele der folgenden Ideen sind Vorlagen, die ein Bild erzeugen und dann im normalen Gestalten weiterlaufen. Damit der Start-Bildschirm nicht überläuft, bekommt er eine vierte Kachel „Basteln“ mit einer eigenen Auswahl. Das passt zur Start-Kachel „Text“ (leeres Blatt) aus 1.2.0, die als Grundlage dient.

```
┌──────────────────────────────────────────┐
│ ‹ Zurück                                 │
│                                          │
│  Was bastelst du?                        │
│                                          │
│  ┌──────────────────┐┌──────────────────┐│
│  │  ✎               ││  ▦               ││
│  │  Malen           ││  Ausmalbild      ││
│  │  mit dem Finger  ││  zum Ausmalen    ││
│  └──────────────────┘└──────────────────┘│
│  ┌──────────────────┐┌──────────────────┐│
│  │  ▤               ││  ▥               ││
│  │  Fotostreifen    ││  Comic           ││
│  │  4 Fotos am Stück││  2 bis 4 Bilder  ││
│  └──────────────────┘└──────────────────┘│
│  ┌──────────────────┐┌──────────────────┐│
│  │  ⌗               ││  ☰              ││
│  │  Rätsel          ││  Zettel          ││
│  │  Labyrinth & Co. ││  Listen und Pläne││
│  └──────────────────┘└──────────────────┘│
│  ┌──────────────────┐┌──────────────────┐│
│  │  ✉               ││  ◫               ││
│  │  Karte           ││  Etikett         ││
│  │  zum Falten      ││  für Heft & Box  ││
│  └──────────────────┘└──────────────────┘│
└──────────────────────────────────────────┘
```

Technik: neuer Bildschirm `s-make` in `index.html`, Navigation über `show()`. Grundbaustein für alle Vorlagen: eine Funktion, die ein fertiges Schwarz-Weiß-Canvas erzeugt und `openEditor(canvas)` aufruft. Damit diese Vorlagen nicht wie Fotos aufbereitet werden (`autoLevels`, Rasterung), braucht `compose` einen Look „Blatt“ (`look: 'plain'`), der nur hart auf Schwarz/Weiß schaltet. Den braucht 1.2.0 für das leere Blatt ohnehin.

---

## 3. Malen mit dem Finger

**Was es ist:** Mit dem Finger auf das Foto oder ein leeres Blatt malen. Stifte in drei Dicken, ein Radierer und ein Stempel-Pinsel, der Sterne oder Herzen streut. Nur Schwarz und Weiß, so wie es gedruckt wird.

### Ablauf

1. Beim Gestalten Reiter „Malen“ öffnen oder bei „Basteln“ → „Malen“ (leeres Blatt).
2. Stift wählen, malen. Solange „Malen“ aktiv ist, bewegt der Finger keine Sticker.
3. Rückgängig nimmt den letzten Strich zurück.
4. Weiter zum Drucken wie gewohnt.

### Design-Entwurf

```
┌──────────────────────────────────────────┐
│ ‹ Zurück                    (↶) [Weiter] │
│                                          │
│        ┌────────────────────────┐        │
│        │   ~~~~      ★  ★       │        │
│        │  (    )   ★            │        │
│        │   ~~~~        ~~~~~~~  │        │
│        │        ╲___╱           │        │
│        └────────────────────────┘        │
│╭────────────────────────────────────────╮│
││ Zuschnitt Rahmen Smileys Text Malen ...││
││                               ‾‾‾‾‾    ││
││ ┌──────┐┌──────┐┌──────┐┌──────┐┌─────┐││
││ │  ·   ││  •   ││  ●   ││  ⌫   ││ ★ ★ │││
││ │ Fein ││Mittel││ Dick ││Radie-││Stem-│││
││ │      ││      ││      ││rer   ││pel  │││
││ └──────┘└──────┘└──────┘└──────┘└─────┘││
││ Stempel  [★] [♥] [✿] [•] [Tatze]       ││
││                                        ││
││ Alles weiß machen                      ││
│╰────────────────────────────────────────╯│
└──────────────────────────────────────────┘
```

### UI-Texte

Reiter „Malen“ · Fein · Mittel · Dick · Radierer · Stempel · „Alles weiß machen“ (löscht alle Striche, mit Rückgängig, ohne Rückfrage) · Hinweis: „Mal mit dem Finger. Zum Verschieben von Stickern geh zurück auf Smileys oder Text.“

### Technik

- `ed.strokes = [{ w, erase, stamp, pts: [x, y, x, y, …] }]` in logischen Koordinaten, Teil von `snap()` (bei Undo pro Strich kopieren).
- `render.js`: Striche in `overlayItems` vor den Elementen zeichnen (Radierer = weißer Strich). Bei vielen Punkten Pfad mit `quadraticCurveTo` glätten.
- `app.js`: Pointer-Modus „malen“ auf `editPreview`, nur der erste Finger malt (Handballen ignorieren: zweiter Kontakt bricht ab). Neu zeichnen mit `requestAnimationFrame` wie bisher.
- Stempel: Symbole aus `render.js` (`star`, `heart`, `flower`, `paw`) im Abstand entlang der Fingerspur.
- Statt Emoji im Stempel-Knopf die vorhandenen Zeichenfunktionen als kleine Canvas-Vorschau zeigen.
- **Aufwand:** mittel.

---

## 4. Ausmalbild

**Was es ist:** Aus einem Foto oder einem Sticker wird ein Ausmalbild mit dicken, geschlossenen Linien und weißen Flächen. Gedruckt, dann mit Buntstiften ausgemalt. Thermopapier verträgt Buntstift und Filzstift gut, Wasserfarbe nicht.

### Ablauf

1. Foto wählen → Reiter „Look“ → „Ausmalbild“. Oder „Basteln“ → „Ausmalbild“ → ein Motiv aus den Stickern wählen, das dann die ganze Breite füllt.
2. Regler „Details“ (wenig … viel) und „Linien“ (dünn … dick).
3. Weiter, drucken. Tipp: „Schnell“ reicht hier, Linien sind reines Schwarz.

### Design-Entwurf

```
┌──────────────────────────────────────────┐
│ ‹ Zurück                    (↶) [Weiter] │
│                                          │
│        ┌────────────────────────┐        │
│        │     ╭───╮   ╭───╮      │        │
│        │    ╭┘   ╰───╯   └╮     │        │
│        │    │  ○       ○  │     │        │
│        │    │      ▽      │     │        │
│        │    ╰──╮ ╰───╯ ╭──╯     │        │
│        │       ╰───────╯        │        │
│        └────────────────────────┘        │
│╭────────────────────────────────────────╮│
││ Zuschnitt  Rahmen  Smileys  Text  Look ││
││                                  ‾‾‾‾  ││
││ ┌───────┐┌────────┐┌────────┐┌────────┐││
││ │[Bild] ││ [Bild] ││ [Bild] ││ [Bild] │││
││ │ Foto  ││ Comic  ││ Umriss ││Ausmal- │││
││ │       ││        ││        ││  bild  │││
││ └───────┘└────────┘└────────┘└────────┘││
││ Details  wenig ─────●───── viel        ││
││ Linien   dünn  ──────●──── dick        ││
│╰────────────────────────────────────────╯│
└──────────────────────────────────────────┘
```

### UI-Texte

Look „Ausmalbild“ · Regler „Details“ (wenig/viel) und „Linien“ (dünn/dick) · bei „Basteln“: „Such dir ein Motiv aus“ · Hinweis auf dem Drucken-Bildschirm: „Am besten mit Buntstiften ausmalen.“

### Technik

- `render.js` → `process()` um Look `'malen'` erweitern: stärker weichzeichnen als `outline()`, Kanten finden, Linien verdicken (Dilatation), kleine Inseln entfernen, Rest weiß. Ergebnis rein Schwarz/Weiß.
- Look-Vorschau in `renderLookThumbs()` kommt automatisch mit, wenn der Knopf in `#looks` ergänzt wird.
- Sticker als Vorlage: SVG aus `Stickers.image()` in voller Breite (384) auf ein Blatt zeichnen → `openEditor`. Die Sticker sind schon Strichzeichnungen mit weißer Füllung, also ideale Ausmalbilder. Linienstärke dabei erhöhen (SVG neu mit `stroke-width` 3 statt 5, weil hochskaliert).
- **Aufwand:** klein.

---

## 5. Fotostreifen wie im Fotoautomaten

**Was es ist:** Die Kamera macht nach einem Countdown vier Fotos hintereinander. Sie landen untereinander auf einem Streifen, unten Datum oder eigener Text. Der lange, schmale Thermostreifen ist dafür wie gemacht.

### Ablauf

1. „Basteln“ → „Fotostreifen“ (oder in der Kamera oben „Fotostreifen“ wählen).
2. Auslöser drücken → große Zahl 3 … 2 … 1 → Blitz-Effekt → Foto 1 von 4. Dann automatisch die nächsten.
3. Übersicht mit vier Bildern. Einzelnes Bild antippen = nochmal knipsen.
4. Weiter → Gestalten mit dem fertigen Streifen (Rahmen, Sticker, Text gehen wie immer).

### Design-Entwurf

```
┌──────────────────────────────────────────┐
│ ‹ Zurück      [ Einzelbild│Fotostreifen ]│
│ ┌──────────────────────────────────────┐ │
│ │                                      │ │
│ │                                      │ │
│ │                 3                    │ │
│ │                                      │ │
│ │          (Kamerabild, s/w)           │ │
│ │                                      │ │
│ └──────────────────────────────────────┘ │
│        Foto 2 von 4 · Mach eine Grimasse!│
│   ┌──┐ ┌──┐ ┌──┐ ┌──┐                    │
│   │✓ │ │● │ │  │ │  │                    │
│   └──┘ └──┘ └──┘ └──┘                    │
│                                          │
│      (▣)          ( ◉ )          (⟲)     │
└──────────────────────────────────────────┘

Übersicht danach:
┌──────────────────────────────────────────┐
│ ‹ Zurück                        [Weiter] │
│                                          │
│              ┌──────────┐                │
│              │ [Foto 1] │                │
│              ├──────────┤                │
│              │ [Foto 2] │  Antippen =    │
│              ├──────────┤  nochmal       │
│              │ [Foto 3] │  knipsen       │
│              ├──────────┤                │
│              │ [Foto 4] │                │
│              ├──────────┤                │
│              │ 28.11.26 │                │
│              └──────────┘                │
│                                          │
│   Unten drauf  [Datum] [Eigener Text]    │
└──────────────────────────────────────────┘
```

### UI-Texte

Umschalter „Einzelbild“ / „Fotostreifen“ · „Foto 2 von 4“ · wechselnde Ideen: „Mach eine Grimasse!“, „Jetzt ganz ernst!“, „Und jetzt lachen!“, „Überrascht!“ · Übersicht: „Antippen zum Nochmal-Knipsen“ · „Unten drauf: Datum / Eigener Text“.

### Technik

- Kamera-Bildschirm `s-camera`: neuer Wert im `.seg`-Umschalter. Countdown als großes Overlay über `.viewfinder`, 3 s pro Bild.
- Bilder je auf 4:3 zuschneiden (Funktion aus Idee 1), auf ein Canvas 384 × (4 × 288 + Abstände) zeichnen, Trennlinien schwarz → `openEditor(canvas)`. Datum als Beschriftung (`ed.caption`) vorbelegen.
- Kein neues Datenformat in „Meine Drucke“ nötig.
- **Aufwand:** mittel.

---

## 6. Mini-Comic mit 2–4 Feldern

**Was es ist:** Eine Bildergeschichte untereinander auf dem Streifen. Jedes Feld bekommt ein Foto (gern im Comic-Look), eine Sprechblase und optional einen Erzähltext („Am nächsten Morgen …“). Baut direkt auf Idee 1 und 2 auf.

### Ablauf

1. „Basteln“ → „Comic“ → Anzahl wählen: 2, 3 oder 4 Bilder.
2. Übersicht mit leeren Feldern. Feld antippen → Foto, Kamera oder leeres Feld zum Malen.
3. Pro Feld: zuschneiden, Sprechblase, Erzähltext oben im Feld.
4. Weiter → ganzer Comic als ein Druck. Look „Comic“ ist voreingestellt.

### Design-Entwurf

```
┌──────────────────────────────────────────┐
│ ‹ Zurück                    (↶) [Weiter] │
│                                          │
│  Wie viele Bilder?   [2]  [3]  (4)       │
│                                          │
│           ┌──────────────────┐           │
│           │ Eines Tages …    │           │
│           │ [Foto]  ╭─────╮  │           │
│           │         │Hi!  │  │           │
│           ├──────────────────┤           │
│           │ [Foto]           │           │
│           ├──────────────────┤           │
│           │      ┌ + ┐       │           │
│           │   Bild wählen    │           │
│           ├──────────────────┤           │
│           │      ┌ + ┐       │           │
│           │   Bild wählen    │           │
│           └──────────────────┘           │
│                                          │
│   Feld antippen zum Bearbeiten           │
└──────────────────────────────────────────┘
```

### UI-Texte

„Wie viele Bilder?“ · „Bild wählen“ · „Feld antippen zum Bearbeiten“ · Erzähltext-Feld: „Was passiert hier?“ mit Vorschlägen „Eines Tages …“, „Plötzlich …“, „Am Ende …“ · Knopf im Feld-Editor: „Fertig mit diesem Bild“.

### Technik

- Neuer Bildschirm `s-comic`. Zustand `comic = { n, panels: [{ img, crop, items }] }`.
- Einfachste Umsetzung: jedes Feld nutzt den vorhandenen Editor in einem „Feld-Modus“ (feste Höhe, kein Rahmen), danach setzt eine Funktion in `render.js` die Felder mit schwarzen Trennbalken zu einem Bild zusammen.
- Speichern einer Comic-Arbeit für später (IndexedDB) wäre schön, aber erst in einer zweiten Stufe.
- **Aufwand:** groß.

---

## 7. Rätsel: Labyrinth und Wörtersuche

**Was es ist:** Die App erzeugt jedes Mal ein neues Labyrinth oder ein Buchstabengitter mit versteckten Wörtern. Alles wird offline berechnet. Die Lösung kann man als zweiten Zettel drucken.

### Ablauf

1. „Basteln“ → „Rätsel“ → „Labyrinth“ oder „Wörtersuche“.
2. Labyrinth: Schwierigkeit wählen, Start- und Ziel-Figur aus den Stickern (z. B. Hase sucht Möhre … hier: Hund sucht Kuchen). „Neues Labyrinth“ würfelt neu.
3. Wörtersuche: bis zu 8 eigene Wörter eintippen (z. B. Namen der Freundinnen), Gitter entsteht.
4. Drucken. Danach Frage „Lösung auch drucken?“ als zweiter Knopf.

### Design-Entwurf

```
┌──────────────────────────────────────────┐
│ ‹ Zurück                        [Weiter] │
│                                          │
│  ┌───────────────┐┌───────────────┐      │
│  │  ⌗ Labyrinth  ││ ABC Wörtersuche│     │
│  └───────────────┘└───────────────┘      │
│                                          │
│        ┌────────────────────────┐        │
│        │ ▶ ┌──┐  ┌─────┐  ┌──┐  │        │
│        │ ──┘  │  │  ┌──┘  │  │  │        │
│        │ ┌──┐ └──┘  │  ┌──┘  │  │        │
│        │ │  └────┐  │  │  ┌──┘  │        │
│        │ └──┐  ┌─┘  └──┘  │  ★  │        │
│        └────────────────────────┘        │
│                                          │
│  Wie schwer?  [Leicht] (Mittel) [Schwer] │
│  Start  [Hund]        Ziel  [Kuchen]     │
│                                          │
│  [  ⟳ Neues Labyrinth  ]                 │
└──────────────────────────────────────────┘
```

(In der App stehen statt der Platzhalter-Zeichen die Sticker-Bilder.)

### UI-Texte

„Labyrinth“ · „Wörtersuche“ · „Wie schwer?“ Leicht/Mittel/Schwer · „Start“ · „Ziel“ · „Neues Labyrinth“ · Wörtersuche: „Welche Wörter sollen sich verstecken?“, „+ Wort“ · nach dem Druck: „Lösung auch drucken?“.

### Technik

- Neue Datei `puzzles.js` (in `sw.js` cachen): Labyrinth per zufälliger Tiefensuche auf einem Gitter, Breite fest 384 px, Zellen 24/32/48 px je nach Schwierigkeit, Länge 2–3 × Breite. Lösungsweg per Breitensuche, als gestrichelte Linie in einer zweiten Version.
- Wörtersuche: Gitter 10 × 14 in Lexend fett, Wörter waagerecht/senkrecht (bei „Leicht“ nur vorwärts), Rest zufällige Buchstaben ohne Umlaut-Probleme (Ä, Ö, Ü als eigene Buchstaben).
- Ausgabe als Canvas → `openEditor` (Look „Blatt“), damit Rahmen und Text gehen. Lösung: zweiter `runPrint`-Aufruf.
- Zufall mit Startwert, damit „Nochmal drucken“ aus „Meine Drucke“ dasselbe Rätsel liefert (das Bild wird dort ohnehin gespeichert).
- **Aufwand:** mittel.

---

## 8. Zettel: Liste, Wunschliste, Stundenplan

**Was es ist:** Vorlagen für Zettel, die man wirklich benutzt: Einkaufsliste mit Kästchen zum Abhaken, Wunschliste, To-do „Heute mach ich …“ und ein Stundenplan, der quer über einen langen Streifen gedruckt wird.

### Ablauf

1. „Basteln“ → „Zettel“ → Vorlage wählen.
2. Liste: Überschrift ist vorbelegt, Zeilen eintippen, „+ Zeile“. Kleine Bilder pro Zeile aus den Stickern möglich.
3. Stundenplan: Fächer pro Tag antippen (Liste der Fächer einmal anlegen). Wird gespeichert und kann jede Woche neu gedruckt werden.
4. Weiter → Gestalten → Drucken.

### Design-Entwurf

```
┌──────────────────────────────────────────┐
│ ‹ Zurück                        [Weiter] │
│                                          │
│  [Einkauf] (Wunschliste) [To-do] [Stunden│
│                                          │
│  Überschrift                             │
│  ┌──────────────────────────────────────┐│
│  │ Meine Wunschliste                    ││
│  └──────────────────────────────────────┘│
│  ┌──────────────────────────────────┐┌──┐│
│  │ ☐  Hamster                       ││ ×││
│  └──────────────────────────────────┘└──┘│
│  ┌──────────────────────────────────┐┌──┐│
│  │ ☐  Rollschuhe                    ││ ×││
│  └──────────────────────────────────┘└──┘│
│  ┌──────────────────────────────────┐┌──┐│
│  │ ☐  Tinte für den Drucker         ││ ×││
│  └──────────────────────────────────┘└──┘│
│  [ + Zeile ]                             │
│                                          │
│         ┌──────────────┐                 │
│         │ MEINE WUNSCH-│  Vorschau       │
│         │ LISTE        │                 │
│         │ ☐ Hamster    │                 │
│         │ ☐ Rollschuhe │                 │
│         └──────────────┘                 │
└──────────────────────────────────────────┘
```

### UI-Texte

Vorlagen „Einkauf“, „Wunschliste“, „To-do“, „Stundenplan“ · vorbelegte Überschriften „Einkaufen“, „Meine Wunschliste“, „Heute mach ich …“, „Mein Stundenplan“ · „+ Zeile“ · Stundenplan: „Welche Fächer hast du?“, „Montag“ … „Freitag“, „Jede Woche gleich? Dann einfach nochmal drucken.“

### Technik

- Neue Datei `templates.js`: zeichnet Zettel als Canvas in 384 px Breite (Lexend 800 für Überschriften, Kästchen 28 px).
- Stundenplan: 5 Spalten passen nicht lesbar auf 48 mm. Deshalb **quer drucken**: Plan auf ein Canvas mit z. B. 1100 × 384 zeichnen und um 90° gedreht ausgeben. Diese Dreh-Funktion teilt sich der Stundenplan mit dem Effekt „Banner“ aus 1.2.0 – dort einmal sauber als `Render.rotate(img)` bauen.
- Fächerliste und letzter Plan in `localStorage` (`df_templates`), bleibt auf dem Gerät.
- Zeilen löschen über × ohne Rückfrage, mit Rückgängig.
- **Aufwand:** mittel.

---

## 9. Tagebuch-Zettel „Mein Tag“

**Was es ist:** Ein kleiner Zettel pro Tag zum Antippen statt Schreiben: Datum (automatisch), Wetter, Stimmung, „Heute war super:“ und optional ein Foto. Die Zettel klebt man in ein Heft (mit Sticker-Papier direkt).

### Ablauf

1. „Basteln“ → „Zettel“ → „Mein Tag“ (oder eigene Kachel, wenn er oft benutzt wird).
2. Wetter antippen, Stimmung antippen, einen Satz tippen.
3. Optional „Foto dazu“.
4. Drucken, am besten als Sticker.

### Design-Entwurf

```
┌──────────────────────────────────────────┐
│ ‹ Zurück                        [Weiter] │
│                                          │
│  Samstag, 28. November                   │
│                                          │
│  Wie war das Wetter?                     │
│  ┌──────┐┌──────┐┌──────┐┌──────┐        │
│  │  ☼   ││  ☁   ││  ☂   ││  ❄   │        │
│  │Sonne ││Wolken││Regen ││Schnee│        │
│  └──────┘└──────┘└──────┘└──────┘        │
│                                          │
│  Wie geht es dir?                        │
│  ┌──────┐┌──────┐┌──────┐┌──────┐        │
│  │ (^‿^)││ (•‿•)││ (•_•)││ (;_;)│        │
│  │super ││ gut  ││ geht ││ doof │        │
│  └──────┘└──────┘└──────┘└──────┘        │
│                                          │
│  Das war heute super:                    │
│  ┌──────────────────────────────────────┐│
│  │ Schlittenfahren mit Papa             ││
│  └──────────────────────────────────────┘│
│  [ ▣ Foto dazu ]                         │
└──────────────────────────────────────────┘
```

### UI-Texte

„Wie war das Wetter?“ Sonne/Wolken/Regen/Schnee · „Wie geht es dir?“ super/gut/geht so/doof · „Das war heute super:“ · „Foto dazu“ · Datum automatisch auf Deutsch.

### Technik

- Vorlage in `templates.js` (Idee 8). Stimmungs-Gesichter aus `stickers.js` (Kategorie Gesichter), Wetter-Symbole als 4 neue Sticker.
- Datum mit `toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })`.
- Keine Speicherung der Einträge über „Meine Drucke“ hinaus. Ein Tagebuch ist privat, es bleibt beim Ausdruck.
- **Aufwand:** klein (wenn Idee 8 steht).

---

## 10. Geheimschrift: Spiegelschrift und Geheimcode

**Was es ist:** Zwei neue Text-Effekte. „Spiegel“ druckt den Text spiegelverkehrt, lesbar nur mit einem Spiegel. „Geheimcode“ ersetzt jeden Buchstaben durch ein Zeichen aus einem eigenen Symbol-Alphabet. Dazu kann man den „Schlüssel“ für die Freundin drucken.

### Ablauf

1. Reiter „Text“ → Effekt „Spiegel“ oder „Geheim“.
2. Text tippen, Vorschau zeigt die verschlüsselte Version.
3. Drucken. Bei „Geheim“: Knopf „Schlüssel drucken“ auf dem Drucken-Bildschirm.

### Design-Entwurf

```
┌──────────────────────────────────────────┐
│ ‹ Zurück                    (↶) [Weiter] │
│                                          │
│        ┌────────────────────────┐        │
│        │                        │        │
│        │   ◇△ ○▽ ⊓◁ ☆△          │        │
│        │   (= TREFFEN UM 3)     │        │
│        │                        │        │
│        └────────────────────────┘        │
│╭────────────────────────────────────────╮│
││ Zuschnitt  Rahmen  Smileys  Text  Look ││
││ Dein Text                              ││
││ ┌──────────────────────────────────┐   ││
││ │ Treffen um 3                     │   ││
││ └──────────────────────────────────┘   ││
││ Effekt                                 ││
││ ┌──────┐┌──────┐┌──────┐┌──────┐┌─────┐││
││ │  Aa  ││  Aa  ││ ▓Aa▓ ││  aA  ││ ◇△○ │││
││ │Normal││Umriss││Nega- ││Spie- ││Ge-  │││
││ │      ││      ││tiv   ││gel   ││heim │││
││ └──────┘└──────┘└──────┘└──────┘└─────┘││
│╰────────────────────────────────────────╯│
└──────────────────────────────────────────┘
```

### UI-Texte

Effekte „Spiegel“ und „Geheim“ · Hinweis bei Spiegel: „Halte den Zettel vor einen Spiegel!“ · Hinweis bei Geheim: „Nur wer den Schlüssel hat, kann es lesen.“ · Drucken-Bildschirm: „Schlüssel drucken“.

### Technik

- `render.js` → `drawItem`: `fx: 'spiegel'` = `c.scale(-1, 1)` vor `fillText`. `fx: 'geheim'` = Zeichen für Zeichen eigene Glyphen zeichnen (26 Buchstaben + Ä Ö Ü ß + Ziffern als kleine Canvas-Pfade, einmal in `render.js` definiert, gleiches Prinzip wie `star()`/`heart()`). `itemSize` muss die Glyphenbreite kennen.
- Schlüssel: Testmuster-ähnliche Tafel (Buchstabe → Zeichen), quer gedruckt mit `Render.rotate` aus Idee 8.
- Effekte in `#effects` ergänzen. Bei sechs Effekten (mit Banner) passt eine Zeile nicht mehr, deshalb zwei Zeilen oder waagerecht scrollen wie `.cats`.
- **Aufwand:** klein.

---

## 11. Namensschilder und Etiketten

**Was es ist:** Fertige Vorlagen für Heft-Etiketten, Box-Beschriftungen, Türschild („Bitte anklopfen!“) und Namensschilder für Geburtstagsgäste. Mit Sticker-Papier direkt zum Aufkleben. Gut für mehrere gleiche Drucke („Wie oft?“).

### Ablauf

1. „Basteln“ → „Etikett“ → Art wählen: Heft, Box, Tür, Name.
2. Text eintippen (beim Heft: Fach + Name), passendes Symbol ist vorgeschlagen, änderbar.
3. Weiter → Gestalten (Rahmen vorgewählt) → Drucken, Sticker ist vorgewählt.

### Design-Entwurf

```
┌──────────────────────────────────────────┐
│ ‹ Zurück                        [Weiter] │
│                                          │
│  Was beschriftest du?                    │
│  ┌──────┐┌──────┐┌──────┐┌──────┐        │
│  │  ▭   ││  ▣   ││  ⌂   ││  ☺   │        │
│  │ Heft ││ Box  ││ Tür  ││ Name │        │
│  └──────┘└──────┘└──────┘└──────┘        │
│                                          │
│  Fach                                    │
│  ┌──────────────────────────────────────┐│
│  │ Mathe                                ││
│  └──────────────────────────────────────┘│
│  Name                                    │
│  ┌──────────────────────────────────────┐│
│  │ Mia, Klasse 3b                       ││
│  └──────────────────────────────────────┘│
│                                          │
│         ┌────────────────────┐           │
│         │ ★  MATHE           │           │
│         │    Mia, Klasse 3b  │           │
│         └────────────────────┘           │
│  Symbol   [★] [♥] [✿] [anderes …]        │
└──────────────────────────────────────────┘
```

### UI-Texte

„Was beschriftest du?“ Heft/Box/Tür/Name · Felder „Fach“, „Name“, „Was ist drin?“ · Türschild-Vorschläge „Bitte anklopfen!“, „Betreten nur mit Keks“, „Zimmer von …“ · Namensschild: „Hallo, ich bin …“.

### Technik

- Vorlagen in `templates.js`, Ausgabe → `openEditor`, dann `pr.mode = 'sticker'` voreinstellen.
- Lange Etiketten (Türschild) quer drucken, Funktion aus 1.2.0 („Banner“) bzw. `Render.rotate`.
- Den Namen des Kindes nur auf dem Gerät merken (`localStorage`), Feld ist nicht Pflicht.
- **Aufwand:** klein.

---

## 12. Karten zum Falten

**Was es ist:** Glückwunsch-, Danke-, Gute-Besserung- und Einladungskarten als langer Streifen mit Vorderseite, Faltlinie und Innenseite. Einmal falten, fertig. Einladung mit Feldern „Wann“, „Wo“, „Was“.

### Ablauf

1. „Basteln“ → „Karte“ → Anlass wählen.
2. Vorderseite: Motiv (Sticker groß, Foto oder Schrift „Alles Gute!“).
3. Innenseite: Text, bei Einladung die Felder.
4. Weiter → Vorschau zeigt Vorder- und Innenseite mit gestrichelter Faltlinie → Drucken.

### Design-Entwurf

```
┌──────────────────────────────────────────┐
│ ‹ Zurück                        [Weiter] │
│                                          │
│  Wofür ist die Karte?                    │
│  ┌────────┐┌────────┐┌────────┐┌────────┐│
│  │  ♣     ││  ♥     ││  ✚     ││  ✉     ││
│  │Geburts-││ Danke  ││ Gute   ││Einla-  ││
│  │  tag   ││        ││Besse-  ││ dung   ││
│  │        ││        ││rung    ││        ││
│  └────────┘└────────┘└────────┘└────────┘│
│                                          │
│        ┌──────────────────┐              │
│        │  ALLES GUTE,     │  Vorderseite │
│        │     OMA!         │              │
│        │  [Kuchen groß]   │              │
│        ├ ─ ─ ─ ─ ─ ─ ─ ─ ─┤  hier falten │
│        │ Wann: Sa, 6.12.  │  Innenseite  │
│        │ Wo:   bei uns    │              │
│        │ Was:  Party!     │              │
│        └──────────────────┘              │
│                                          │
│  [ Vorderseite ]  ( Innenseite )         │
└──────────────────────────────────────────┘
```

(Platzhalter-Zeichen und [Hund], [Kuchen] stehen für Sticker-Bilder.)

### UI-Texte

„Wofür ist die Karte?“ Geburtstag/Danke/Gute Besserung/Einladung · Umschalter „Vorderseite“/„Innenseite“ · Faltlinie in der Vorschau: „hier falten“ · Einladung: „Wann?“, „Wo?“, „Was machen wir?“, „Sag Bescheid bis …“.

### Technik

- Karte = zwei Editor-Seiten. Einfache Variante: zwei getrennte `ed`-Zustände (`ed.front`, `ed.inside`), Umschalter tauscht sie im Editor. `layout()` in `render.js` bekommt einen Modus `'card'`: Vorderseite, Faltlinie (gestrichelt wie `cut()`, aber dünner), Innenseite.
- Damit die Karte nach dem Falten richtig herum liegt, die Vorderseite um 180° drehen (vom Streifenanfang aus gesehen). In der Vorschau trotzdem lesbar zeigen.
- **Aufwand:** mittel.

---

## 13. Meine Sticker (aus Zeichnung oder Foto)

**Was es ist:** Eine eigene Zeichnung (Idee 3), ein Foto im Look „Umriss“ oder ein mit der Kamera abfotografiertes Papierbild wird als eigener Sticker gespeichert. Er erscheint unter „Smileys“ in der Kategorie „Meine“ und lässt sich wie jeder andere Sticker aufs Bild setzen.

### Ablauf

1. Beim Gestalten auf dem Drucken-Bildschirm oder in „Meine Drucke“: Knopf „Als Sticker merken“.
2. Ausschnitt wählen (Zuschnitt aus Idee 1, Form Quadrat oder Kreis).
3. Sticker liegt in „Smileys“ → „Meine“. Langes Drücken auf den eigenen Sticker → „Wegräumen“ (kommt in einen Papierkorb, nichts geht sofort verloren).

### Design-Entwurf

```
┌──────────────────────────────────────────┐
│ ‹ Zurück                    (↶) [Weiter] │
│                                          │
│        ┌────────────────────────┐        │
│        │        [Foto]          │        │
│        └────────────────────────┘        │
│╭────────────────────────────────────────╮│
││ Zuschnitt  Rahmen  Smileys  Text  Look ││
││                    ‾‾‾‾‾‾‾             ││
││ (Meine) [Gesichter] [Blasen] [Tiere] … ││
││ ┌──────┐┌──────┐┌──────┐┌──────┐       ││
││ │[Bild]││[Bild]││[Bild]││  +    │      ││
││ │      ││      ││      ││Neuer  │      ││
││ │      ││      ││      ││Sticker│      ││
││ └──────┘└──────┘└──────┘└──────┘       ││
││                                        ││
││ Lange drücken zum Wegräumen            ││
│╰────────────────────────────────────────╯│
└──────────────────────────────────────────┘
```

### UI-Texte

Kategorie „Meine“ · „Als Sticker merken“ · Kachel „+ Neuer Sticker“ (Auswahl: „Zeichnen“, „Foto“, „Papierbild abfotografieren“) · „Lange drücken zum Wegräumen“ · leere Kategorie: „Hier landen deine eigenen Sticker.“

### Technik

- Speichern als kleines Schwarz-Weiß-PNG (z. B. 256 × 256, Weiß transparent) in IndexedDB `druckfrisch`, neuer Object Store `stickers` (Datenbank-Version hochzählen).
- `stickers.js` → `Stickers.image(id)` kennt dann auch IDs wie `my:17` und lädt aus der Datenbank. `ed.items` bleibt unverändert (`{ kind: 'sticker', id: 'my:17', … }`).
- Papierbild abfotografieren: Kamera, dann harter Schwellwert mit Weißabgleich (`autoLevels`, danach Schwarz/Weiß), so wird eine Buntstift-Zeichnung zur sauberen Linie.
- Höchstzahl (z. B. 60) im Eltern-Bereich, damit der Speicher nicht vollläuft.
- **Aufwand:** mittel.

---

## 14. Geheimnachricht als QR-Code

**Was es ist:** Das Kind tippt eine kurze Nachricht, die App macht daraus einen QR-Code. Lesen kann ihn nur jemand mit Handy-Kamera, z. B. Mama oder Papa. Nur Text, keine Links, damit nichts ins Netz führt.

### Ablauf

1. Reiter „Smileys“ → „Deko“ → „QR-Code“ oder „Basteln“ → „Geheimnachricht“.
2. Nachricht tippen (max. 60 Zeichen).
3. Der Code wird als Element aufs Bild gelegt, verschieben und vergrößern wie ein Sticker.

### Design-Entwurf

```
┌──────────────────────────────────────────┐
│ ‹ Zurück                        [Weiter] │
│                                          │
│  Deine Geheimnachricht                   │
│  ┌──────────────────────────────────────┐│
│  │ Ich hab dich lieb, Papa!             ││
│  └──────────────────────────────────────┘│
│                                          │
│             ┌──────────────┐             │
│             │ █▀▀█ ▄▀ █▀▀█ │             │
│             │ █▄▄█ ▀▄ █▄▄█ │             │
│             │ ▄ ▀▄█▀ ▄▀▄ ▀ │             │
│             │ █▀▀█ █▄▀ ▀█▄ │             │
│             │ █▄▄█ ▄▀█ ▄▀▄ │             │
│             └──────────────┘             │
│                                          │
│  Mit einer Handy-Kamera kann man         │
│  die Nachricht lesen.                    │
│                                          │
│  [        Aufs Bild legen        ]       │
└──────────────────────────────────────────┘
```

### UI-Texte

„Deine Geheimnachricht“ · „Mit einer Handy-Kamera kann man die Nachricht lesen.“ · „Aufs Bild legen“ · bei einem Link: „Links gehen hier nicht, nur Text.“

### Technik

- QR-Encoder lokal im Code (eigene kleine Umsetzung oder eine MIT-lizenzierte Bibliothek als Datei im Projekt, kein CDN, in `sw.js` cachen). Fehlerkorrektur Stufe M, Modulgröße mindestens 4 Druckpunkte (0,5 mm), sonst liest das Handy den Thermodruck schlecht.
- Neues `kind: 'qr'` mit `{ text, x, y, s, r }` in `ed.items`; `drawItem` zeichnet die Module. Drehen erlauben, aber Größe nach unten begrenzen.
- Text, der wie ein Link aussieht (`http`, `www`, `.de`), wird abgelehnt.
- **Aufwand:** mittel. Empfehlung „vielleicht“, weil der Nutzen ohne zweites Gerät klein ist.

---

## Was alle Ideen betrifft

- **Neue Dateien** (`puzzles.js`, `templates.js`, ggf. QR) in `index.html` einbinden und in die Dateiliste von `sw.js` aufnehmen.
- **Version:** nach jeder Änderung `APP_VERSION` in `app.js` und `VERSION` in `sw.js` gemeinsam hochzählen.
- **Datenschutz:** alles lokal. Neue Speicherorte nur `localStorage` und IndexedDB. Keine Schriften oder Bibliotheken neu aus dem Netz nachladen, außer über den bestehenden Font-Cache.
- **Rückgängig:** jeder neue Zustand (`crop`, `strokes`, Blasen-Spitze, Kartenseiten) muss in `snap()` landen.
- **Querdruck** (`Render.rotate`) aus dem Banner-Effekt in 1.2.0 einmal allgemein bauen. Stundenplan, Türschild, Code-Schlüssel und lange Etiketten nutzen ihn.
- **Look „Blatt“** (ohne Foto-Aufbereitung) aus der Text-Kachel in 1.2.0 ist die Grundlage für alle Vorlagen.

## Vorschlag zur Reihenfolge

| Zeitraum | Inhalt | Begründung |
| --- | --- | --- |
| **Bis zum Geburtstag** (Anfang Dezember) | Nur 1.2.0 wie geplant (Text-Kachel, Banner) und Tablet-Test | Wenige Tage, Stabilität geht vor |
| **Bis Weihnachten** (1.3.x) | 1 Zuschnitt · 2 Sprechblase · 4 Ausmalbild · 10 Geheimschrift · 3 Malen | Holgers Wünsche zuerst; 4 und 10 sind klein und machen viel Spaß; Malen ist ein schönes Weihnachts-Update |
| **Winter** (1.4.x) | Kachel „Basteln“ · 5 Fotostreifen · 8 Zettel (mit Querdruck) · 9 Mein Tag · 11 Etiketten | Gemeinsame Vorlagen-Basis einmal bauen, dann sind die Vorlagen günstig |
| **Später** (1.5+) | 7 Rätsel · 12 Karten · 13 Meine Sticker · 6 Mini-Comic | Größer, profitieren von Zuschnitt, Blasen und Vorlagen |
| **Vielleicht** | 14 QR-Code · Etappe 3 (KI-Bilder, siehe CLAUDE.md) | Nutzen unsicher bzw. braucht Netz und Eltern-Freigabe |
