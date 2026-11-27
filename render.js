/* Druckfrisch – Bildaufbereitung, Rahmen und Drucklayout */
const Render = (() => {
/* ---------- Rahmen ---------- */
const rnd = s => () => (s = (s * 16807) % 2147483647) / 2147483647;
function star(c, x, y, r, fill = true, rot = 0) {
  c.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + rot + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
  c.closePath(); fill ? c.fill() : c.stroke();
}
function heart(c, x, y, s, fill = true) {
  c.beginPath(); y -= s * 0.1;
  c.moveTo(x, y + s * 0.8);
  c.bezierCurveTo(x - s * 1.3, y, x - s * 0.7, y - s * 1.0, x, y - s * 0.35);
  c.bezierCurveTo(x + s * 0.7, y - s * 1.0, x + s * 1.3, y, x, y + s * 0.8);
  fill ? c.fill() : c.stroke();
}
function flower(c, x, y, r, k) {
  c.save(); c.translate(x, y); c.rotate(k * 0.7); c.lineWidth = 2.5;
  for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5; c.beginPath(); c.ellipse(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55, r * 0.45, r * 0.32, a, 0, 7); c.fillStyle = '#fff'; c.fill(); c.stroke(); }
  c.fillStyle = '#000'; c.beginPath(); c.arc(0, 0, r * 0.28, 0, 7); c.fill(); c.restore();
}
function paw(c, x, y, s, rot) {
  c.save(); c.translate(x, y); c.rotate(rot);
  c.beginPath(); c.ellipse(0, s * 0.3, s * 0.5, s * 0.4, 0, 0, 7); c.fill();
  for (const [dx, dy] of [[-0.58, -0.25], [-0.2, -0.62], [0.2, -0.62], [0.58, -0.25]]) { c.beginPath(); c.arc(dx * s, dy * s, s * 0.21, 0, 7); c.fill(); }
  c.restore();
}
function sparkle(c, x, y, r) {
  c.beginPath(); c.moveTo(x, y - r); c.quadraticCurveTo(x, y, x + r, y); c.quadraticCurveTo(x, y, x, y + r); c.quadraticCurveTo(x, y, x - r, y); c.quadraticCurveTo(x, y, x, y - r); c.fill();
}
function ring(g, sp, fn) {
  let i = 0; const x0 = g.l / 2, x1 = g.W - g.r / 2, y0 = g.t / 2, y1 = g.H - g.b / 2;
  const nx = Math.max(1, Math.round((x1 - x0) / sp)), ny = Math.max(1, Math.round((y1 - y0) / sp));
  for (let k = 0; k <= nx; k++) { const x = x0 + (x1 - x0) * k / nx; fn(x, y0, i++); fn(x, y1, i++); }
  for (let k = 1; k < ny; k++) { const y = y0 + (y1 - y0) * k / ny; fn(x0, y, i++); fn(x1, y, i++); }
}
function box(c, g, lw, pad, r, dash) {
  c.save(); c.lineWidth = lw; if (dash) c.setLineDash(dash);
  c.beginPath(); c.roundRect(g.l - pad, g.t - pad, g.W - g.l - g.r + 2 * pad, g.ih + 2 * pad, r); c.stroke(); c.restore();
}
function scatter(c, g, n, seed, fn, avoid = () => false) {
  const R = rnd(seed); let k = 0, tries = 0;
  while (k < n && tries++ < n * 30) {
    const x = R() * g.W, y = R() * g.H;
    if (x > g.l - 12 && x < g.W - g.r + 12 && y > g.t - 12 && y < g.t + g.ih + 12) continue;
    if (avoid(x, y)) continue;
    fn(x, y, R, k++);
  }
}
const FRAMES = [
  { id: 'none', name: 'Ohne' },
  { id: 'stars', name: 'Sterne', m: 36, draw: (c, g) => { box(c, g, 3, 6, 10); ring(g, 40, (x, y, i) => star(c, x, y, i % 3 ? 10 : 14, i % 4 !== 1, i * 0.3)); } },
  { id: 'hearts', name: 'Herzen', m: 36, draw: (c, g) => { box(c, g, 2, 6, 16); c.lineWidth = 2.5; ring(g, 38, (x, y, i) => heart(c, x, y, i % 2 ? 9 : 12, i % 2 === 0)); } },
  { id: 'flowers', name: 'Blumen', m: 40, draw: (c, g) => { box(c, g, 2, 6, 14); ring(g, 44, (x, y, i) => flower(c, x, y, 17, i)); } },
  { id: 'paws', name: 'Tatzen', m: 36, draw: (c, g) => { box(c, g, 3, 6, 18); ring(g, 40, (x, y, i) => paw(c, x, y, 12, i % 2 ? 0.45 : -0.45)); } },
  { id: 'party', name: 'Party', m: 30, t: 70, draw: (c, g) => {
      box(c, g, 3, 6, 10);
      c.lineWidth = 2; c.beginPath(); c.moveTo(0, 6); c.quadraticCurveTo(g.W / 2, 40, g.W, 6); c.stroke();
      const n = 11;
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n, x = g.W * t, y = 6 + 2 * t * (1 - t) * 34;
        c.beginPath(); c.moveTo(x - 14, y); c.lineTo(x + 14, y); c.lineTo(x, y + 26); c.closePath();
        if (i % 2) c.fill(); else { c.fillStyle = '#fff'; c.fill(); c.stroke(); c.fillStyle = '#000'; c.beginPath(); c.arc(x, y + 9, 3, 0, 7); c.fill(); }
      }
      scatter(c, g, 40, 7, (x, y, R, k) => { if (k % 3 === 0) star(c, x, y, 6, true, R() * 3); else { c.beginPath(); c.arc(x, y, 2 + R() * 3, 0, 7); c.fill(); } }, (x, y) => y < 56);
    } },
  { id: 'cat', name: 'Katze', m: 22, t: 64, b: 56, draw: (c, g) => {
      const top = g.t - 8, bot = g.t + g.ih + 8;
      for (const s of [-1, 1]) {
        const x = g.W / 2 + s * g.W * 0.3;
        c.beginPath(); c.moveTo(x - 40 * s, top + 4); c.lineTo(x - 22 * s, top - 54); c.lineTo(x + 34 * s, top + 4); c.closePath(); c.fill();
        c.fillStyle = '#fff'; c.beginPath(); c.moveTo(x - 28 * s, top); c.lineTo(x - 20 * s, top - 36); c.lineTo(x + 14 * s, top); c.closePath(); c.fill(); c.fillStyle = '#000';
      }
      box(c, g, 7, 8, 30);
      const cx = g.W / 2, ny = bot + 14;
      c.beginPath(); c.moveTo(cx - 9, ny); c.lineTo(cx + 9, ny); c.lineTo(cx, ny + 9); c.closePath(); c.fill();
      c.lineWidth = 3; c.beginPath(); c.arc(cx - 8, ny + 10, 8, 0, Math.PI); c.stroke(); c.beginPath(); c.arc(cx + 8, ny + 10, 8, 0, Math.PI); c.stroke();
      c.lineWidth = 2.5;
      for (const s of [-1, 1]) for (const d of [-8, 0, 8]) { const x0 = cx + s * 40; c.beginPath(); c.moveTo(x0, ny + 6); c.lineTo(x0 + s * 60, ny + 6 + d * 1.4); c.stroke(); }
    } },
  { id: 'space', name: 'Weltraum', m: 36, t: 70, draw: (c, g) => {
      box(c, g, 2, 6, 6);
      c.beginPath(); c.arc(42, 34, 24, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(54, 26, 21, 0, 7); c.fill(); c.fillStyle = '#000';
      const px = g.W - 48; c.lineWidth = 2.5; c.beginPath(); c.arc(px, 34, 15, 0, 7); c.stroke();
      c.beginPath(); c.ellipse(px, 34, 32, 8, -0.35, 0, 7); c.stroke();
      c.fillStyle = '#fff'; c.beginPath(); c.arc(px, 34, 13.5, 0, 7); c.fill(); c.fillStyle = '#000';
      c.beginPath(); c.arc(px - 4, 30, 3, 0, 7); c.fill(); c.beginPath(); c.arc(px + 5, 38, 2, 0, 7); c.fill();
      scatter(c, g, 55, 3, (x, y, R, k) => k % 4 === 0 ? sparkle(c, x, y, 7) : (c.beginPath(), c.arc(x, y, 1 + R() * 2, 0, 7), c.fill()), (x, y) => (x < 80 || x > g.W - 90) && y < 66);
    } },
  { id: 'film', name: 'Filmstreifen', m: 32, t: 16, b: 16, draw: (c, g) => {
      c.fillRect(0, 0, 28, g.H); c.fillRect(g.W - 28, 0, 28, g.H); c.fillRect(0, 0, g.W, 10); c.fillRect(0, g.H - 10, g.W, 10);
      c.fillStyle = '#fff';
      for (let y = 16; y < g.H - 24; y += 26) { c.beginPath(); c.roundRect(8, y, 12, 14, 3); c.roundRect(g.W - 20, y, 12, 14, 3); c.fill(); }
      c.fillStyle = '#000';
    } },
  { id: 'zigzag', name: 'Zickzack', m: 30, draw: (c, g) => {
      box(c, g, 2, 6, 4); c.lineWidth = 3; c.lineJoin = 'round';
      const pts = [[8, 8], [g.W - 8, 8], [g.W - 8, g.H - 8], [8, g.H - 8], [8, 8]];
      c.beginPath();
      for (let s = 0; s < 4; s++) {
        const [ax, ay] = pts[s], [bx, by] = pts[s + 1], len = Math.hypot(bx - ax, by - ay), n = Math.round(len / 14);
        for (let i = 0; i <= n; i++) { const t = i / n, o = i % 2 ? 7 : 0, nx = (by - ay) / len, ny = -(bx - ax) / len; c.lineTo(ax + (bx - ax) * t - nx * o, ay + (by - ay) * t - ny * o); }
      }
      c.stroke();
    } },
  { id: 'confetti', name: 'Konfetti', m: 34, draw: (c, g) => {
      box(c, g, 2, 6, 10, [8, 6]);
      scatter(c, g, 90, 11, (x, y, R, k) => {
        const t = k % 4; c.save(); c.translate(x, y); c.rotate(R() * 6);
        if (t === 0) { c.beginPath(); c.arc(0, 0, 3 + R() * 2, 0, 7); c.fill(); }
        else if (t === 1) c.fillRect(-5, -2, 10, 4);
        else if (t === 2) { c.beginPath(); c.moveTo(0, -5); c.lineTo(5, 4); c.lineTo(-5, 4); c.closePath(); c.fill(); }
        else { c.lineWidth = 2; c.beginPath(); c.moveTo(-6, 0); c.quadraticCurveTo(-3, -5, 0, 0); c.quadraticCurveTo(3, 5, 6, 0); c.stroke(); }
        c.restore();
      });
    } },
];

/* ---------- Komposition ---------- */
const BASE = 384; // Rahmen sind für 384 logische Pixel gezeichnet und werden skaliert

function geo(F, ih) {
  if (!F || !F.draw) return { l: 0, r: 0, t: 0, b: 0, W: BASE, ih, H: ih };
  const g = { l: F.m, r: F.m, t: F.t ?? F.m, b: F.b ?? F.m, W: BASE, ih };
  g.H = g.t + g.ih + g.b; return g;
}

function toGray(data, n) {
  const g = new Float32Array(n);
  for (let i = 0; i < n; i++) g[i] = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
  return g;
}

// Automatik: Tonwerte strecken (1 % / 99 %)
function autoLevels(g) {
  const hist = new Uint32Array(256);
  for (const v of g) hist[Math.max(0, Math.min(255, v | 0))]++;
  const n = g.length; let acc = 0, lo = 0, hi = 255;
  for (let i = 0; i < 256; i++) { acc += hist[i]; if (acc > n * 0.01) { lo = i; break; } }
  acc = 0;
  for (let i = 255; i >= 0; i--) { acc += hist[i]; if (acc > n * 0.01) { hi = i; break; } }
  if (hi - lo < 30) return;
  const k = 255 / (hi - lo);
  for (let i = 0; i < n; i++) g[i] = (g[i] - lo) * k;
}

function contrast(g, amount) {
  const f = (259 * (amount + 255)) / (255 * (259 - amount));
  for (let i = 0; i < g.length; i++) g[i] = f * (g[i] - 128) + 128;
}

function errorDiffuse(g, w, h, atkinson) {
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x, o = g[i], nv = o < 128 ? 0 : 255; out[i] = nv ? 0 : 1;
    const e = o - nv;
    const add = (dx, dy, k) => { const xx = x + dx, yy = y + dy; if (xx >= 0 && xx < w && yy < h) g[yy * w + xx] += e * k; };
    if (atkinson) { const k = 1 / 8; add(1, 0, k); add(2, 0, k); add(-1, 1, k); add(0, 1, k); add(1, 1, k); add(0, 2, k); }
    else { add(1, 0, 7 / 16); add(-1, 1, 3 / 16); add(0, 1, 5 / 16); add(1, 1, 1 / 16); }
  }
  return out;
}

function outline(g, w, h, bright) {
  const b = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    let s = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) s += g[(y + dy) * w + x + dx];
    b[y * w + x] = s / 9;
  }
  const out = new Uint8Array(w * h), t = Math.max(20, 70 + bright * 0.8);
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = y * w + x;
    const gx = -b[i - w - 1] - 2 * b[i - 1] - b[i + w - 1] + b[i - w + 1] + 2 * b[i + 1] + b[i + w + 1];
    const gy = -b[i - w - 1] - 2 * b[i - w] - b[i - w + 1] + b[i + w - 1] + 2 * b[i + w] + b[i + w + 1];
    if (Math.hypot(gx, gy) > t) out[i] = 1;
  }
  return out;
}

/* Bilder sind „Tinte“: Uint8Array 0 (weiß) … 255 (schwarz), {ink,w,h}.
   Erst beim Drucken wird daraus 1 Bit (Schnell) oder 16 Stufen (Schön), siehe forPrint. */
const bin = b => { const o = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) o[i] = b[i] ? 255 : 0; return o; };

// look: 'foto' | 'comic' | 'umriss', bright: -50..50
function process(data, w, h, look, bright) {
  const g = toGray(data, w * h);
  autoLevels(g);
  if (look === 'umriss') return bin(outline(g, w, h, bright));
  const add = bright * 1.6;
  for (let i = 0; i < g.length; i++) g[i] += add;
  if (look === 'comic') { contrast(g, 70); return bin(errorDiffuse(g, w, h, true)); }
  const ink = new Uint8Array(w * h);
  for (let i = 0; i < g.length; i++) ink[i] = Math.max(0, Math.min(255, Math.round(255 - g[i])));
  return ink;
}

// Floyd–Steinberg auf `levels` Stufen; Ergebnis 0 … levels-1 (levels-1 = schwarz)
function quantize(ink, w, h, levels) {
  const f = Float32Array.from(ink), out = new Uint8Array(w * h), step = 255 / (levels - 1);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x, o = f[i], q = Math.max(0, Math.min(levels - 1, Math.round(o / step)));
    out[i] = q; const e = o - q * step;
    if (!e) continue;
    if (x + 1 < w) f[i + 1] += e * 7 / 16;
    if (y + 1 < h) { if (x > 0) f[i + w - 1] += e * 3 / 16; f[i + w] += e * 5 / 16; if (x + 1 < w) f[i + w + 1] += e / 16; }
  }
  return out;
}
// Schön (4 Bit): Der MXW01 druckt Stufe 1 … floor-1 kaum sichtbar. Nutzbar sind also nur 0 (weiß) und floor … 15.
// Diese Stufen bekommen eine gleichmäßige Helligkeit; hellere Töne werden zwischen Weiß und floor gerastert
// (sanfter Übergang statt Sprung auf Grau). Fast-Weiß (Tinte < 16) bleibt papierweiß.
// gamma: Die Stufen werden schneller dunkel als linear (Tablet-Druck 27.11.: Mitteltöne zu dunkel).
// Angenommene Dunkelheit einer Stufe = t^gamma; kleiner = Mitteltöne heller. Standard 0,6.
const darkOf = (L, floor, gamma = 1) => L ? Math.pow((L - floor + 1) / (16 - floor), gamma) : 0;
function quantizeHD(ink, w, h, floor, gamma) {
  const f = new Float32Array(w * h), out = new Uint8Array(w * h), n = 16 - floor, first = darkOf(floor, floor, gamma);
  for (let i = 0; i < f.length; i++) f[i] = ink[i] / 255;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x;
    if (ink[i] < 16) continue; // bleibt weiß, Fehler wird verworfen
    const v = f[i];
    let L = 0;
    if (v > first / 2) {
      // nächstgelegene Stufe nach angenommener Dunkelheit
      const g = Math.max(floor, Math.min(15, Math.round(Math.pow(Math.max(0, v), 1 / gamma) * n) + floor - 1));
      L = g;
      for (const c of [g - 1, g + 1]) if (c >= floor && c <= 15 && Math.abs(v - darkOf(c, floor, gamma)) < Math.abs(v - darkOf(L, floor, gamma))) L = c;
    }
    out[i] = L; const e = v - darkOf(L, floor, gamma);
    if (!e) continue;
    if (x + 1 < w) f[i + 1] += e * 7 / 16;
    if (y + 1 < h) { if (x > 0) f[i + w - 1] += e * 3 / 16; f[i + w] += e * 5 / 16; if (x + 1 < w) f[i + w + 1] += e / 16; }
  }
  return out;
}
// Fürs Drucken und für die Vorschau: hd → {lv: Druckerstufen 0, floor…15}, sonst {bits: 0/1}
function forPrint(img, hd, floor = 6, gamma = 0.6) {
  if (!hd) return { bits: quantize(img.ink, img.w, img.h, 2), w: img.w, h: img.h };
  floor = Math.max(1, Math.min(14, floor)); gamma = Math.max(0.3, Math.min(1.5, gamma));
  return { lv: quantizeHD(img.ink, img.w, img.h, floor, gamma), floor, gamma, w: img.w, h: img.h };
}

// Aufbereitetes Foto merken: beim Ziehen von Stickern ändert sich nur die Ebene darüber
let contentCache = null;
function photoContent(img, cw, ch, look, bright) {
  const c = contentCache;
  if (c && c.img === img && c.cw === cw && c.ch === ch && c.look === look && c.bright === bright) return c.ink;
  const cc = document.createElement('canvas'); cc.width = cw; cc.height = ch;
  const cx = cc.getContext('2d', { willReadFrequently: true });
  cx.fillStyle = '#fff'; cx.fillRect(0, 0, cw, ch); cx.drawImage(img, 0, 0, cw, ch);
  const ink = process(cx.getImageData(0, 0, cw, ch).data, cw, ch, look, bright);
  contentCache = { img, cw, ch, look, bright, ink };
  return ink;
}

/* ---------- Elemente auf dem Bild (Sticker, später Text) ----------
   Koordinaten logisch (Breite 384): x, y = Mitte, s = Größe, r = Drehung (Bogenmaß).
   Sticker: {kind:'sticker', img} – schwarz-weiße Zeichnung, wird immer voll schwarz/weiß gedruckt. */
function drawItem(c, it) {
  c.save(); c.translate(it.x, it.y); c.rotate(it.r || 0);
  if (it.kind === 'sticker' && it.img && it.img.complete && it.img.naturalWidth) c.drawImage(it.img, -it.s / 2, -it.s / 2, it.s, it.s);
  c.restore();
}
function overlayItems(ink, width, H, s, items) {
  if (!items || !items.length) return;
  const oc = document.createElement('canvas'); oc.width = width; oc.height = H;
  const ox = oc.getContext('2d', { willReadFrequently: true });
  ox.scale(s, s);
  for (const it of items) drawItem(ox, it);
  const d = ox.getImageData(0, 0, width, H).data;
  for (let i = 0; i < width * H; i++) if (d[i * 4 + 3] > 128) ink[i] = d[i * 4] < 128 ? 255 : 0;
}

// Bild + Rahmen + Beschriftung + Elemente in Druckbreite `width` (Pixel) zusammensetzen
function compose({ img, width, frameId, caption, look, bright, items }) {
  const F = FRAMES.find(f => f.id === frameId) || FRAMES[0];
  const s = width / BASE;
  const cap = (caption || '').trim(), capH = cap ? 46 : 0;
  const g0 = geo(F, 0);
  const cw = Math.max(8, Math.round(width - (g0.l + g0.r) * s));
  const ch = Math.max(1, Math.round(img.height * cw / img.width));
  const content = photoContent(img, cw, ch, look, bright);

  const g = geo(F, ch / s + capH);
  const H = Math.round(g.H * s);
  const fc = document.createElement('canvas'); fc.width = width; fc.height = H;
  const fx = fc.getContext('2d', { willReadFrequently: true });
  fx.fillStyle = '#fff'; fx.fillRect(0, 0, width, H);
  fx.save(); fx.scale(s, s);
  if (F.draw) { fx.fillStyle = '#000'; fx.strokeStyle = '#000'; fx.lineCap = 'round'; F.draw(fx, g); }
  if (cap) {
    const cwl = BASE - g.l - g.r, y0 = g.t + ch / s;
    fx.fillStyle = '#fff'; fx.fillRect(g.l, y0, cwl, capH);
    let fs = 30; fx.fillStyle = '#000'; fx.textAlign = 'center'; fx.textBaseline = 'middle';
    do { fx.font = `800 ${fs}px Lexend, system-ui, sans-serif`; } while (fx.measureText(cap).width > cwl - 12 && --fs > 12);
    fx.fillText(cap, g.l + cwl / 2, y0 + capH / 2 + 2);
  }
  fx.restore();
  // Rahmen und Schrift immer voll schwarz, Foto mit Graustufen
  const fd = fx.getImageData(0, 0, width, H).data, ink = new Uint8Array(width * H);
  for (let i = 0; i < width * H; i++) ink[i] = fd[i * 4] < 128 ? 255 : 0;
  const ox = Math.round(g.l * s), oy = Math.round(g.t * s), cwi = Math.min(cw, width - ox);
  for (let y = 0; y < ch && y + oy < H; y++) ink.set(content.subarray(y * cw, y * cw + cwi), (y + oy) * width + ox);
  overlayItems(ink, width, H, s, items);
  return { ink, w: width, h: H };
}

// Bild auf andere Breite skalieren (nächster Nachbar) – für „Nochmal drucken“
function scale(src, width) {
  if (src.w === width) return src;
  const k = src.w / width, h = Math.max(1, Math.round(src.h / k)), ink = new Uint8Array(width * h);
  for (let y = 0; y < h; y++) { const sy = Math.min(src.h - 1, (y * k) | 0); for (let x = 0; x < width; x++) ink[y * width + x] = src.ink[sy * src.w + Math.min(src.w - 1, (x * k) | 0)]; }
  return { ink, w: width, h };
}

// Drucklayout: Rolle oder Sticker, mehrfach, mit Schneidelinien
// comp(width) liefert {ink,w,h}; opts: {mode, W, dpi, stickerMm, count}
function layout(comp, { mode, W, dpi, stickerMm, count }) {
  const parts = [];
  const blank = n => ({ ink: new Uint8Array(W * n), w: W, h: n });
  const cut = () => { const n = Math.max(2, Math.round(dpi / 100)), b = new Uint8Array(W * n), seg = Math.round(dpi / 12); for (let y = 0; y < n; y++) for (let x = 0; x < W; x++) if ((x % (seg * 2)) < seg) b[y * W + x] = 255; return { ink: b, w: W, h: n }; };
  const pad = (img, w) => { if (img.w === w) return img; const out = new Uint8Array(w * img.h), ox = (w - img.w) >> 1; for (let y = 0; y < img.h; y++) out.set(img.ink.subarray(y * img.w, (y + 1) * img.w), y * w + ox); return { ink: out, w, h: img.h }; };
  if (mode === 'sticker') {
    const L = Math.round(stickerMm / 25.4 * dpi), m = Math.round(2 / 25.4 * dpi), avail = L - 2 * m;
    let img = comp(W);
    if (img.h > avail) { const w2 = Math.max(64, Math.floor(W * avail / img.h / 8) * 8); img = comp(w2); }
    img = pad(img, W);
    const top = Math.max(0, Math.floor((L - img.h) / 2)), bottom = Math.max(0, L - img.h - top);
    parts.push(cut());
    for (let i = 0; i < count; i++) { parts.push(blank(top), img, blank(bottom), cut()); }
  } else {
    const img = comp(W), gap = Math.round(dpi / 8);
    for (let i = 0; i < count; i++) { if (i) parts.push(blank(gap), cut(), blank(gap)); parts.push(img); }
  }
  const H = parts.reduce((a, p) => a + p.h, 0), ink = new Uint8Array(W * H);
  let o = 0; for (const p of parts) { ink.set(p.ink, o * W); o += p.h; }
  return { ink, w: W, h: H };
}

// Anzeigen: {ink} (0…255), {lv} (0…15) oder {bits} (0/1)
function toCanvas(img, canvas, ink = [29, 27, 24]) {
  const { w, h } = img; canvas.width = w; canvas.height = h;
  const c = canvas.getContext('2d'), im = c.createImageData(w, h);
  const t = img.bits ? i => img.bits[i] : img.lv ? (img.floor ? i => darkOf(img.lv[i], img.floor, img.gamma) : i => img.lv[i] / 15) : i => img.ink[i] / 255;
  for (let i = 0; i < w * h; i++) { const k = t(i); for (let j = 0; j < 3; j++) im.data[i * 4 + j] = Math.round(255 - k * (255 - ink[j])); im.data[i * 4 + 3] = 255; }
  c.putImageData(im, 0, 0); return canvas;
}
function fromCanvas(canvas) {
  const { width: w, height: h } = canvas, d = canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, w, h).data, ink = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) ink[i] = 255 - d[i * 4];
  return { ink, w, h };
}

function frameThumb(F, size = 120) {
  const c = document.createElement('canvas'); c.width = BASE; c.height = 300;
  const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, BASE, 300);
  const g = geo(F, 0); g.ih = 300 - g.t - g.b; g.H = 300;
  x.fillStyle = '#e4dfd4'; x.fillRect(g.l, g.t, BASE - g.l - g.r, g.ih);
  if (F.draw) { x.fillStyle = '#000'; x.strokeStyle = '#000'; x.lineCap = 'round'; F.draw(x, g); }
  return c;
}

// Testdruck: Überschrift, Lineal, 16 Graustufen – zum Prüfen von Breite und Hitze
function testPattern(W, dpi, title) {
  const H = Math.round(dpi * 0.8), c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); x.fillStyle = '#000';
  x.font = '800 20px sans-serif'; x.fillText(title || `Breite ${W} px · ${dpi} dpi`, 6, 22);
  for (let px = 0; px < W; px += 8) { const big = px % 64 === 0; x.fillRect(px, 30, 2, big ? 22 : 10); if (big) { x.font = '700 12px sans-serif'; x.fillText(String(px), px + 3, 66); } }
  x.fillRect(W - 2, 30, 2, 30);
  const sw = W / 16;
  for (let i = 0; i < 16; i++) { const v = Math.round(255 - i * 17); x.fillStyle = `rgb(${v},${v},${v})`; x.fillRect(Math.round(i * sw), 76, Math.ceil(sw), 50); }
  x.fillStyle = '#000'; x.font = '700 12px sans-serif';
  for (let i = 0; i < 16; i += 3) x.fillText(String(i), i * sw + sw / 2 - 4, 142);
  return fromCanvas(c);
}

return { FRAMES, compose, scale, layout, forPrint, toCanvas, fromCanvas, frameThumb, testPattern };
})();
