/* Druckfrisch – Sticker: eigene Schwarz-Weiß-Strichzeichnungen (viewBox 100 × 100, weiße Füllung, schwarze Linien).
   Keine fremden Grafiken, keine Lizenzpflichten, funktioniert offline. */
const Stickers = (() => {
  const B = (inner, sw = 5) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="#fff" stroke="#000" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  const dot = (x, y, r = 5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#000" stroke="none"/>`;
  const face = '<circle cx="50" cy="50" r="44"/>';
  const smile = '<path d="M30 60q20 20 40 0" fill="none"/>';
  const txt = (t, y = 50, fs = 20) => `<text x="50" y="${y}" font-family="Arial Black,Arial,Helvetica,sans-serif" font-weight="900" font-size="${fs}" text-anchor="middle" dominant-baseline="middle" fill="#000" stroke="none">${t}</text>`;
  const bubble = '<path d="M50 10c24 0 42 13 42 31s-18 31-42 31c-5 0-10-1-14-2L16 86l6-18C12 62 8 52 8 41 8 23 26 10 50 10z"/>';
  const thought = '<ellipse cx="52" cy="38" rx="40" ry="28"/><circle cx="22" cy="76" r="7"/><circle cx="11" cy="90" r="4"/>';
  const spiky = '<path d="M50 6l9 15 17-8-2 18 19 4-14 13 14 13-19 4 2 18-17-8-9 15-9-15-17 8 2-18-19-4 14-13L4 39l19-4-2-18 17 8z"/>';
  const heartPath = (x, y, k) => `<path d="M${x} ${y + 8 * k}l${-9 * k} ${-9 * k}a${5.5 * k} ${5.5 * k} 0 0 1 ${9 * k} ${-6 * k} ${5.5 * k} ${5.5 * k} 0 0 1 ${9 * k} ${6 * k}z" fill="#000" stroke-width="2"/>`;

  const CATS = [
    { id: 'faces', name: 'Gesichter', items: [
      ['lacht', B(face + '<path d="M28 40q7-8 14 0M58 40q7-8 14 0" fill="none"/><path d="M27 56h46q-3 28-23 28q-20 0-23-28z" fill="#000"/>')],
      ['laechelt', B(face + dot(36, 40) + dot(64, 40) + smile)],
      ['zwinkert', B(face + dot(36, 40) + '<path d="M57 41h15" fill="none"/>' + smile)],
      ['verliebt', B(face + heartPath(36, 38, 1.1) + heartPath(64, 38, 1.1) + smile)],
      ['cool', B(face + '<path d="M16 38h68" fill="none"/><path d="M21 38h24v5q0 11-12 11t-12-11zM55 38h24v5q0 11-12 11t-12-11z" fill="#000"/><path d="M38 68q12 8 25-3" fill="none"/>')],
      ['staunt', B(face + dot(36, 42, 6) + dot(64, 42, 6) + '<path d="M27 28q9-7 18 0M55 28q9-7 18 0" fill="none"/><ellipse cx="50" cy="69" rx="8" ry="11" fill="#000"/>')],
      ['frech', B(face + dot(36, 40) + dot(64, 40) + '<path d="M44 64v9q6 11 12 0v-9" /><path d="M30 60q20 14 40 0" fill="none"/>')],
      ['kuss', B(face + '<path d="M28 40q7 6 14 0M58 40q7 6 14 0" fill="none"/><path d="M47 57q9 4 0 8q9 4 0 8" fill="none"/>' + heartPath(72, 60, 0.9))],
      ['kackhaufen', B('<path d="M12 86q-6-15 11-19h54q17 4 11 19z"/><path d="M22 67q-5-15 12-18h32q17 3 12 18z"/><path d="M33 49q-3-15 15-27q3 9 11 11q13 4 8 16z"/><circle cx="40" cy="58" r="6"/><circle cx="60" cy="58" r="6"/>' + dot(41, 59, 3) + dot(61, 59, 3) + '<path d="M38 75q12 9 24 0" fill="none"/>')],
    ] },
    { id: 'bubbles', name: 'Sprechblasen', items: [
      ['blase', B(bubble)],
      ['gedanke', B(thought)],
      ['zacken', B(spiky)],
      ['hallo', B(bubble + txt('HALLO!', 42, 17))],
      ['wow', B(spiky + txt('WOW!', 51, 15))],
      ['juhu', B(bubble + txt('JUHU!', 42, 19))],
      ['hmm', B(thought + txt('HMM…', 39, 18))],
      ['herzblase', B(bubble + heartPath(50, 32, 2))],
    ] },
    { id: 'animals', name: 'Tiere', items: [
      ['katze', B('<path d="M20 38L17 9l23 15q10-3 20 0L83 9l-3 29q8 9 8 21c0 20-17 33-38 33S12 79 12 59q0-12 8-21z"/>' + dot(37, 53) + dot(63, 53) + '<path d="M45 62h10l-5 6z" fill="#000" stroke-width="2"/><path d="M50 68q-6 7-12 3M50 68q6 7 12 3M6 60l20 2M6 71l20-3M94 60l-20 2M94 71l-20-3" fill="none" stroke-width="3"/>')],
      ['hund', B('<ellipse cx="50" cy="54" rx="31" ry="33"/><path d="M25 26Q6 30 8 64q2 9 13 4zM75 26q19 4 17 38-2 9-13 4z" fill="#000"/>' + dot(39, 47) + dot(61, 47) + '<ellipse cx="50" cy="69" rx="15" ry="11"/><ellipse cx="50" cy="63" rx="7" ry="4.5" fill="#000"/><path d="M50 67v7" fill="none"/>')],
      ['hase', B('<path d="M37 44q-13-34 0-38q12 4 10 38zM63 44q13-34 0-38q-12 4-10 38z"/><circle cx="50" cy="64" r="29"/>' + dot(39, 60) + dot(61, 60) + '<path d="M46 70h8l-4 5z" fill="#000" stroke-width="2"/><path d="M50 75q-5 6-10 2M50 75q5 6 10 2" fill="none" stroke-width="3"/>')],
      ['baer', B('<circle cx="22" cy="24" r="13"/><circle cx="78" cy="24" r="13"/><circle cx="50" cy="56" r="37"/>' + dot(36, 48) + dot(64, 48) + '<ellipse cx="50" cy="69" rx="15" ry="12"/><ellipse cx="50" cy="63" rx="7" ry="4.5" fill="#000"/><path d="M50 67v6" fill="none"/>')],
      ['pinguin', B('<ellipse cx="50" cy="54" rx="33" ry="42" fill="#000"/><ellipse cx="50" cy="62" rx="21" ry="30"/><circle cx="40" cy="34" r="7"/><circle cx="60" cy="34" r="7"/>' + dot(41, 35, 3) + dot(59, 35, 3) + '<path d="M43 45h14l-7 8z" stroke-width="3"/>')],
      ['fisch', B('<path d="M12 50q22-30 56-10l22-14v48l-22-14q-34 20-56-10z"/>' + dot(30, 46) + '<path d="M44 33q8-11 16-2M47 47q5 6 0 12M58 45q5 7 0 14" fill="none" stroke-width="4"/><circle cx="12" cy="22" r="4" stroke-width="3"/><circle cx="20" cy="11" r="3" stroke-width="3"/>')],
      ['schmetterling', B('<path d="M50 48C30 12 4 18 10 44c4 14 25 12 40 4zM50 48c20-36 46-30 40-4-4 14-25 12-40 4zM50 54c-18 4-35 14-29 30 6 11 23 3 29-26zM50 54c18 4 35 14 29 30-6 11-23 3-29-26z"/>' + dot(28, 36, 6) + dot(72, 36, 6) + '<path d="M50 30v50" stroke-width="8"/><path d="M50 30q-6-14-15-17M50 30q6-14 15-17" fill="none"/>')],
      ['einhorn', B('<path d="M28 40l-4-20 15 10zM72 40l4-20-15 10z"/><path d="M29 38q21-14 42 0l6 42q-27 18-54 0z"/><path d="M43 32l7-30 7 30z"/><path d="M45 23l10-4M44 29l12-4" fill="none" stroke-width="3"/><path d="M29 40q-12 8-6 20q-9 9-1 21M71 40q8 6 4 14" fill="none"/>' + '<path d="M35 52q6-5 12 0M53 52q6-5 12 0" fill="none" stroke-width="4"/><path d="M37 55l-4 4M63 55l4 4" fill="none" stroke-width="3"/>' + dot(44, 74, 2.5) + dot(56, 74, 2.5) + '<path d="M44 82q6 4 12 0" fill="none" stroke-width="3"/>')],
    ] },
    { id: 'deko', name: 'Deko', items: [
      ['herz', B('<path d="M50 88L15 53a20 20 0 0 1 35-27 20 20 0 0 1 35 27z"/>')],
      ['stern', B('<path d="M50 7l12 27 29 3-22 19 7 29-26-15-26 15 7-29-22-19 29-3z"/>')],
      ['krone', B('<path d="M14 74l-4-46 22 20 18-32 18 32 22-20-4 46z"/><path d="M14 74h72v12H14z"/>' + dot(30, 62, 4) + dot(50, 59, 4) + dot(70, 62, 4))],
      ['blume', B('<circle cx="73" cy="50" r="15"/><circle cx="61" cy="70" r="15"/><circle cx="39" cy="70" r="15"/><circle cx="27" cy="50" r="15"/><circle cx="39" cy="30" r="15"/><circle cx="61" cy="30" r="15"/><circle cx="50" cy="50" r="13"/>' + dot(50, 50, 5))],
      ['glitzer', B('<path d="M46 8q4 38 40 42q-36 4-40 42q-4-38-40-42q36-4 40-42z"/><path d="M84 8q2 11 11 13q-9 2-11 12q-2-10-11-12q9-2 11-13z" fill="#000" stroke-width="2"/>')],
      ['regenbogen', B('<path d="M6 76a44 44 0 0 1 88 0M19 76a31 31 0 0 1 62 0M32 76a18 18 0 0 1 36 0" fill="none"/><path d="M4 86a8 8 0 0 1 6-12 9 9 0 0 1 16 2 7 7 0 0 1 2 10zM96 86a8 8 0 0 0-6-12 9 9 0 0 0-16 2 7 7 0 0 0-2 10z"/>')],
      ['kuchen', B('<path d="M10 88h80"/><path d="M18 52h64v34H18z"/><path d="M18 62q8 8 16 0q8 8 16 0q8 8 16 0q8 8 16 0" fill="none"/><path d="M34 52V34M50 52V30M66 52V34" fill="none"/><path d="M34 26q-5-6 0-12q5 6 0 12zM50 22q-5-6 0-12q5 6 0 12zM66 26q-5-6 0-12q5 6 0 12z" fill="#000" stroke-width="2"/>')],
      ['sonnenbrille', B('<path d="M4 38h92" fill="none"/><path d="M10 38h34v8q0 17-17 17t-17-17zM56 38h34v8q0 17-17 17t-17-17z" fill="#000"/><path d="M44 42q6-5 12 0" fill="none"/><path d="M17 45l7-5M63 45l7-5" stroke="#fff" stroke-width="3" fill="none"/>')],
      ['daumen', B('<path d="M12 46h18v42H12z"/><path d="M30 48l15-28q4-10 12-7 7 4 3 16l-4 12h24q11 0 10 10l-5 28q-2 9-11 9H30z"/><path d="M58 53h22M57 65h23M56 77h21" fill="none" stroke-width="4"/>')],
      ['ballon', B('<path d="M50 6c19 0 31 15 31 33 0 22-18 38-31 40-13-2-31-18-31-40 0-18 12-33 31-33z"/><path d="M46 80l4 6 4-6z" stroke-width="3"/><path d="M50 86q-9 6 0 13" fill="none" stroke-width="3"/><path d="M36 24q-6 8-4 18" fill="none" stroke-width="4"/>')],
    ] },
  ];

  const url = svg => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  const cache = new Map();
  const all = new Map(CATS.flatMap(c => c.items.map(([id, svg]) => [id, svg])));
  // Bild für die Komposition; onload wird einmal aufgerufen, sobald es fertig geladen ist
  function image(id, onload) {
    let im = cache.get(id);
    if (!im) { im = new Image(); im.decoding = 'sync'; im.src = url(all.get(id) || ''); cache.set(id, im); }
    if (!im.complete && onload) im.addEventListener('load', onload, { once: true });
    return im;
  }
  return { CATS, image, url: id => url(all.get(id) || '') };
})();
