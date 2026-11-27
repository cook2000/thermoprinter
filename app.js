/* Druckfrisch – App-Logik */
const APP_VERSION = '1.2.0';
{
const $ = id => document.getElementById(id);
const $$ = s => document.querySelectorAll(s);

/* ---------- Einstellungen ---------- */
// Neue Schlüssel ab 1.0.1 (width, heatFast, heatHD, quality); alte Werte aus 1.0.0 (widthMode, heatRoll …) werden ignoriert.
const DEFAULTS = { appName: 'Druckfrisch', accent: 'pink', heatFast: 70, heatHD: 100, quality: 'hd', sizes: [30, 50, 80], width: 'auto', customWidth: 576, pin: '', lastMode: 'sticker' };
const ACCENTS = { pink: ['#ff2d87', '#ffeaf4'], tuerkis: ['#19d3c5', '#e3faf8'], lila: ['#7a5af8', '#f0ebff'], blau: ['#2f5bff', '#e8eeff'] };
const ACCENT_NAMES = { pink: 'Pink', tuerkis: 'Türkis', lila: 'Lila', blau: 'Blau' };
let S = { ...DEFAULTS };
try { S = { ...DEFAULTS, ...JSON.parse(localStorage.getItem('df_settings') || '{}') }; } catch {}
const saveS = patch => { Object.assign(S, patch); try { localStorage.setItem('df_settings', JSON.stringify(S)); } catch {} };
const printW = () => S.width === 'custom' ? Math.max(128, Math.round((+S.customWidth || 576) / 8) * 8) : S.width === 'auto' ? (Printer.model === 'mxw' ? 384 : 576) : +S.width;
const dpiOf = w => w === 576 ? 300 : w === 384 ? 203 : Math.round(w * 25.4 / 48);
// „Schön“ (4 Bit, 16 Graustufen) gibt es nur beim MXW01
const canHD = () => Printer.model === 'mxw';
const hdOn = () => canHD() && S.quality === 'hd';
const hdFloor = () => Printer.settings().hdFloor ?? 6;
const hdGamma = () => Printer.settings().hdGamma ?? 0.6;
const view = (img, canvas) => Render.toCanvas(Render.forPrint(img, hdOn(), hdFloor(), hdGamma()), canvas);

function applyLook() {
  const [a, t] = ACCENTS[S.accent] || ACCENTS.pink;
  document.documentElement.style.setProperty('--acc', a);
  document.documentElement.style.setProperty('--acc-tint', t);
  $$('.app-name').forEach(e => e.textContent = S.appName || 'Druckfrisch');
  document.title = S.appName || 'Druckfrisch';
}

/* ---------- Kleinkram ---------- */
let toastT;
function toast(msg, ms = 3500) { const t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, ms); }
const nextFrame = () => new Promise(r => requestAnimationFrame(() => r()));

/* ---------- Navigation ---------- */
const stack = ['s-start'];
function show(id, replace) {
  const cur = stack[stack.length - 1];
  if (cur === id) return;
  leave(cur);
  if (replace) stack[stack.length - 1] = id; else stack.push(id);
  $$('.screen').forEach(s => s.hidden = s.id !== id);
  window.scrollTo(0, 0);
  enter(id);
}
function back() {
  if (stack.length < 2) return;
  const cur = stack.pop(); leave(cur);
  const id = stack[stack.length - 1];
  $$('.screen').forEach(s => s.hidden = s.id !== id);
  enter(id);
}
function enter(id) {
  if (id === 's-camera') startCam();
  if (id === 's-start') renderRecent();
  if (id === 's-history') renderHistory();
  if (id === 's-parents') fillParents();
}
function leave(id) { if (id === 's-camera') stopCam(); }
// Direkt zurück zur Startseite, alle Schritte dazwischen fallen weg
function home() {
  const cur = stack[stack.length - 1];
  if (cur === 's-start') return;
  leave(cur); stack.length = 1;
  $$('.screen').forEach(s => s.hidden = s.id !== 's-start');
  window.scrollTo(0, 0);
  enter('s-start');
}
$$('[data-back]').forEach(b => b.addEventListener('click', back));
window.addEventListener('popstate', () => {});

/* ---------- Druckerstatus ---------- */
const PROBLEM = {
  paper: 'Das Papier ist alle. Bitte neue Rolle einlegen.',
  hot: 'Der Drucker ist zu warm. Kurz Pause machen, dann nochmal.',
  battery: 'Der Drucker braucht Strom. Bitte aufladen.',
  other: 'Der Drucker meldet ein Problem. Ist die Klappe zu?',
  abort: 'Das hat nicht ganz geklappt. Bitte nochmal drucken.',
};
const PROBLEM_SHORT = { paper: 'Papier leer', hot: 'Drucker zu warm', battery: 'Akku leer', other: 'Drucker prüfen' };
function paintStatus(st) {
  const inf = Printer.info, bat = inf.battery != null ? ` · Akku ${inf.battery} %` : '';
  const txt = st === 'ready' ? (inf.err ? PROBLEM_SHORT[inf.err] : 'Drucker bereit' + bat) : st === 'connecting' ? 'Verbinde …' : Printer.configured ? 'Drucker aus' : 'Kein Drucker';
  $$('[data-status]').forEach(el => { el.dataset.state = st; el.querySelector('.txt').textContent = txt; });
  const d = $('p-dot'); if (d) d.className = 'dot ' + st;
}
Printer.on(paintStatus);
paintStatus('off');
$$('.pill[data-status]').forEach(p => p.addEventListener('click', async () => {
  if (!Printer.supported()) return toast('Dieser Browser kann kein Bluetooth. Bitte Chrome nehmen.');
  if (!Printer.configured) return toast('Ein Erwachsener muss den Drucker einmal im Eltern-Bereich einrichten.');
  if (Printer.state === 'ready') return toast('Der Drucker ist verbunden.');
  try { await Printer.ensure(); } catch (e) { if (e.name !== 'NotFoundError') toast('Drucker nicht gefunden. Ist er eingeschaltet?'); }
}));

/* ---------- Bilder laden ---------- */
async function loadFile(file) {
  if (!file || !file.type.startsWith('image/')) return;
  let src;
  try { src = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
  catch { src = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); }); }
  openEditor(shrink(src, src.width, src.height));
}
function shrink(src, w, h, max = 1600) {
  const k = Math.min(1, max / Math.max(w, h)), c = document.createElement('canvas');
  c.width = Math.round(w * k); c.height = Math.round(h * k);
  c.getContext('2d').drawImage(src, 0, 0, c.width, c.height);
  return c;
}
$('t-foto').addEventListener('click', () => $('file').click());
$('cam-gallery').addEventListener('click', () => $('file').click());
$('file').addEventListener('change', e => { loadFile(e.target.files[0]); e.target.value = ''; });
$('t-kamera').addEventListener('click', () => show('s-camera'));

/* ---------- Kamera ---------- */
let stream = null, facing = 'environment', camView = 'print', camTimer = null;
async function startCam() {
  const v = $('video'), msg = $('camMsg'); msg.hidden = true;
  if (!navigator.mediaDevices?.getUserMedia) { msg.textContent = 'Die Kamera geht hier nicht. Nimm „Foto“ aus der Galerie.'; msg.hidden = false; return; }
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1440 } }, audio: false });
    v.srcObject = stream; await v.play().catch(() => {});
    camLoop();
  } catch (e) {
    msg.textContent = e.name === 'NotAllowedError' ? 'Die Kamera ist nicht erlaubt. Eltern: in Chrome für diese Seite die Kamera erlauben.' : 'Die Kamera lässt sich gerade nicht öffnen.';
    msg.hidden = false;
  }
}
function stopCam() { clearTimeout(camTimer); if (stream) stream.getTracks().forEach(t => t.stop()); stream = null; $('video').srcObject = null; }
function camLoop() {
  clearTimeout(camTimer);
  const v = $('video'), pc = $('camPreview');
  pc.hidden = camView !== 'print';
  if (stream && camView === 'print' && v.videoWidth) {
    const w = 240, h = Math.round(v.videoHeight * w / v.videoWidth), c = document.createElement('canvas');
    c.width = w; c.height = h; c.getContext('2d').drawImage(v, 0, 0, w, h);
    // Kamera-Vorschau immer in „Schön“ (weiche Grautöne), unabhängig von der Druckwahl
    Render.toCanvas(Render.forPrint(Render.compose({ img: c, width: w, frameId: 'none', look: 'foto', bright: 0 }), true, hdFloor(), hdGamma()), pc);
  }
  if (stream) camTimer = setTimeout(camLoop, 120);
}
$$('[data-cam-view]').forEach(b => b.addEventListener('click', () => {
  camView = b.dataset.camView;
  $$('[data-cam-view]').forEach(x => x.setAttribute('aria-pressed', x === b));
  camLoop();
}));
$('cam-switch').addEventListener('click', () => { facing = facing === 'environment' ? 'user' : 'environment'; stopCam(); startCam(); });
$('shutter').addEventListener('click', () => {
  const v = $('video');
  if (!stream || !v.videoWidth) return toast('Die Kamera ist noch nicht bereit.');
  const shot = shrink(v, v.videoWidth, v.videoHeight);
  openEditor(shot);
});

/* ---------- Gestalten ---------- */
// items: Sticker (später auch Text) auf dem Bild, logische Koordinaten (Breite 384): {kind, id, x, y, s, r}
// textMode: über die Start-Kachel „Text“ geöffnet (leeres Blatt); banner: Text quer über einen langen Streifen
const ed = { img: null, frameId: 'none', caption: '', look: 'foto', bright: 0, items: [], sel: -1, textMode: false, banner: false };
const undoStack = [];
const snap = () => ({ frameId: ed.frameId, caption: ed.caption, look: ed.look, bright: ed.bright, banner: ed.banner, items: ed.items.map(it => ({ ...it })) });
function pushUndo() { undoStack.push(snap()); if (undoStack.length > 40) undoStack.shift(); $('undo').disabled = false; }
$('undo').addEventListener('click', () => {
  const s = undoStack.pop(); if (!s) return;
  Object.assign(ed, s); ed.sel = -1; $('undo').disabled = !undoStack.length; syncEditorUI(); syncTextUI(); renderEdit();
});

function openEditor(img, opts = {}) {
  Object.assign(ed, { img, frameId: 'none', caption: '', look: 'foto', bright: 0, items: [], sel: -1, textMode: !!opts.text, banner: false });
  undoStack.length = 0; $('undo').disabled = true;
  $('text-format').hidden = !ed.textMode;
  syncEditorUI(); syncTextUI(); selectTab(ed.textMode ? 'text' : 'frame'); renderLookThumbs();
  show('s-editor', stack[stack.length - 1] === 's-camera');
  renderEdit();
  if (ed.textMode) setTimeout(() => $('text-in').focus(), 300);
}
// Start-Kachel „Text“: leeres weißes Blatt
$('t-text').addEventListener('click', () => {
  const c = document.createElement('canvas'); c.width = 800; c.height = 500;
  const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
  openEditor(c, { text: true });
});
// Elemente für Render.compose: Sticker-Bild dazuholen (lädt es bei Bedarf und zeichnet dann neu)
const itemsFor = list => list.map(it => it.kind === 'sticker' ? { ...it, img: Stickers.image(it.id, renderEdit) } : it);
const comp = w => ed.banner ? bannerComp(w) : Render.compose({ img: ed.img, width: w, frameId: ed.frameId, caption: ed.caption, look: ed.look, bright: ed.bright, items: itemsFor(ed.items) });
// Banner aus allen Texten (Schrift und Effekt vom ersten Text)
function bannerComp(w) {
  const texts = ed.items.filter(i => i.kind === 'text'), f = texts[0] || txt;
  return Render.banner({ text: texts.map(t => t.text).join('   ') || 'Dein Text', font: f.font, fx: f.fx, width: w });
}
// Neu zeichnen höchstens einmal pro Bildschirmbild – beim Ziehen bleibt es flüssig
let renderQueued = false;
function renderEdit() {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => { renderQueued = false; if (ed.img) { view(comp(printW()), $('editPreview')); placeSel(); } });
}

/* ---------- Sticker setzen, auswählen, ziehen, drehen ---------- */
let stickerCat = Stickers.CATS[0].id;
function buildStickers() {
  const cats = $('sticker-cats'); cats.innerHTML = '';
  for (const c of Stickers.CATS) {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = c.name; b.setAttribute('aria-pressed', c.id === stickerCat);
    b.addEventListener('click', () => { stickerCat = c.id; buildStickers(); });
    cats.append(b);
  }
  const grid = $('sticker-grid'); grid.innerHTML = '';
  for (const [id] of Stickers.CATS.find(c => c.id === stickerCat).items) {
    const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Sticker ' + id);
    const im = document.createElement('img'); im.src = Stickers.url(id); im.alt = ''; b.append(im);
    b.addEventListener('click', () => addSticker(id));
    grid.append(b);
  }
}
const logicalH = () => { const c = $('editPreview'); return c.width ? c.height * 384 / c.width : 384; };
function addSticker(id) {
  pushUndo();
  const n = ed.items.length, off = (n % 4) * 14; // nicht genau übereinander
  ed.items.push({ kind: 'sticker', id, x: 192 + off, y: logicalH() / 2 + off, s: 120, r: 0 });
  ed.sel = ed.items.length - 1;
  $('edit-hint').hidden = false;
  renderEdit();
}
// Auswahlrahmen über der Vorschau (gehört nicht zum Druck)
function placeSel() {
  const box = $('sel'), it = ed.items[ed.sel], c = $('editPreview');
  if (!it || !c.width || ed.banner) { box.hidden = true; return; }
  const k = c.clientWidth / 384, d = Render.itemSize(it), w = d.w * k + 12, h = d.h * k + 12;
  box.hidden = false;
  box.style.width = w + 'px'; box.style.height = h + 'px';
  box.style.transform = `translate(${c.offsetLeft + it.x * k - w / 2}px, ${c.offsetTop + it.y * k - h / 2}px) rotate(${it.r}rad)`;
}
$('sel-del').addEventListener('click', e => {
  e.stopPropagation();
  if (ed.sel < 0) return;
  pushUndo(); ed.items.splice(ed.sel, 1); ed.sel = -1; syncTextUI(); renderEdit();
});

/* ---------- Text ---------- */
// Vorgaben für den nächsten Text; ein ausgewählter Text übernimmt Änderungen sofort
const txt = { font: 'Bangers', fx: 'normal', s: 56 };
// Im Banner gilt immer der erste Text
const selText = () => { if (ed.banner) return ed.items.find(i => i.kind === 'text') || null; const it = ed.items[ed.sel]; return it && it.kind === 'text' ? it : null; };
function buildText() {
  const box = $('fonts'); box.innerHTML = '';
  for (const f of Render.FONTS) {
    const b = document.createElement('button'); b.type = 'button'; b.dataset.font = f.id;
    b.innerHTML = `<b style="font-family:'${f.id}',system-ui;font-size:${Math.round(26 * (f.k || 1))}px">Abc</b><small>${f.name}</small>`;
    b.addEventListener('click', () => setTextStyle({ font: f.id }));
    box.append(b);
  }
}
function syncTextUI() {
  const t = selText();
  if (t) Object.assign(txt, { font: t.font, fx: t.fx, s: t.s });
  if (document.activeElement !== $('text-in')) $('text-in').value = t ? t.text : '';
  $$('#fonts button').forEach(b => b.setAttribute('aria-pressed', b.dataset.font === txt.font));
  $$('#effects button').forEach(b => b.setAttribute('aria-pressed', b.dataset.fx === txt.fx));
  $('text-size').value = Math.max(16, Math.min(160, Math.round(txt.s)));
  $$('[data-format]').forEach(b => b.setAttribute('aria-pressed', (b.dataset.format === 'banner') === ed.banner));
  $('banner-hint').hidden = !ed.banner; $('text-size-row').hidden = ed.banner; $('text-new').hidden = ed.banner;
  $('edit-hint').hidden = ed.banner || !ed.items.length;
}
$$('[data-format]').forEach(b => b.addEventListener('click', () => {
  const on = b.dataset.format === 'banner'; if (on === ed.banner) return;
  pushUndo(); ed.banner = on; ed.sel = -1; syncTextUI(); renderEdit();
}));
function setTextStyle(patch) {
  const t = selText();
  if (t) { pushUndo(); Object.assign(t, patch); fitText(t); renderEdit(); }
  Object.assign(txt, patch); syncTextUI();
}
// Zu breiter Text wird kleiner, damit er aufs Papier passt (nur verkleinern)
function fitText(it) { const d = Render.itemSize(it); if (d.w > 368) it.s = Math.max(12, it.s * 368 / d.w); }
function addText(text) {
  pushUndo();
  const n = ed.items.filter(i => i.kind === 'text').length, H = logicalH();
  const y = Math.min(H - 30, Math.max(30, H / 2 + ((n % 3) - (n % 3 === 2 ? 3 : 0)) * txt.s * 1.3));
  const it = { kind: 'text', text, font: txt.font, fx: txt.fx, x: 192, y, s: txt.s, r: 0 };
  fitText(it); ed.items.push(it);
  ed.sel = ed.items.length - 1;
  $('edit-hint').hidden = false;
  document.fonts?.load(`40px "${txt.font}"`).then(renderEdit).catch(() => {});
  renderEdit();
}
let textBase = null;
$('text-in').addEventListener('focus', () => { textBase = selText() ? snap() : null; });
$('text-in').addEventListener('input', e => {
  const v = e.target.value, t = selText();
  if (t) {
    if (!v.trim()) { ed.items.splice(ed.items.indexOf(t), 1); ed.sel = -1; } else { t.text = v; if (!ed.banner) fitText(t); }
    renderEdit();
  } else if (v.trim()) { addText(v); textBase = null; }
});
$('text-in').addEventListener('change', () => {
  if (textBase && JSON.stringify(textBase.items) !== JSON.stringify(ed.items)) { undoStack.push(textBase); $('undo').disabled = false; }
  textBase = selText() ? snap() : null;
});
$('text-in').addEventListener('keydown', e => { if (e.key === 'Enter') e.target.blur(); });
$('text-new').addEventListener('click', () => { ed.sel = -1; placeSel(); $('text-in').value = ''; $('text-in').focus(); });
$$('#effects button').forEach(b => b.addEventListener('click', () => setTextStyle({ fx: b.dataset.fx })));
let sizeBase = null;
$('text-size').addEventListener('pointerdown', () => sizeBase = snap());
$('text-size').addEventListener('input', e => { const t = selText(), v = +e.target.value; txt.s = v; if (t) { t.s = v; renderEdit(); } });
$('text-size').addEventListener('change', () => { if (sizeBase && selText()) { undoStack.push(sizeBase); $('undo').disabled = false; } sizeBase = null; });
// Zeiger (Finger oder Maus) in logische Koordinaten umrechnen
function toLogical(e) {
  const c = $('editPreview'), r = c.getBoundingClientRect();
  return { x: (e.clientX - r.left) / r.width * 384, y: (e.clientY - r.top) / r.height * logicalH() };
}
function hit(p) {
  for (let i = ed.items.length - 1; i >= 0; i--) {
    const it = ed.items[i], dx = p.x - it.x, dy = p.y - it.y, c = Math.cos(-it.r), s = Math.sin(-it.r);
    const lx = dx * c - dy * s, ly = dx * s + dy * c, d = Render.itemSize(it);
    if (Math.abs(lx) <= d.w / 2 + 12 && Math.abs(ly) <= d.h / 2 + 12) return i;
  }
  return -1;
}
const pointers = new Map();
let gesture = null; // {start: {x,y,s,r}, p0, two: {d, a, mid}}, moved
function startGesture() {
  const it = ed.items[ed.sel]; if (!it) { gesture = null; return; }
  const pts = [...pointers.values()];
  gesture = { start: { x: it.x, y: it.y, s: it.s, r: it.r }, p0: pts[0], moved: gesture ? gesture.moved : false };
  if (pts.length >= 2) {
    const [a, b] = pts;
    gesture.two = { d: Math.hypot(b.x - a.x, b.y - a.y) || 1, a: Math.atan2(b.y - a.y, b.x - a.x), mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } };
  }
}
const pv = $('editPreview');
pv.addEventListener('pointerdown', e => {
  if (ed.banner) return; // im Banner gibt es nichts zu verschieben
  const p = toLogical(e);
  if (!pointers.size) {
    const i = hit(p);
    if (i < 0) { ed.sel = -1; placeSel(); syncTextUI(); return; }
    // ausgewähltes Element nach vorne holen
    if (i !== ed.items.length - 1) { ed.items.push(ed.items.splice(i, 1)[0]); }
    ed.sel = ed.items.length - 1; gesture = null; syncTextUI();
  } else if (ed.sel < 0) return;
  pv.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId, p);
  startGesture(); renderEdit();
});
pv.addEventListener('pointermove', e => {
  if (!pointers.has(e.pointerId) || !gesture) return;
  pointers.set(e.pointerId, toLogical(e));
  const it = ed.items[ed.sel]; if (!it) return;
  const pts = [...pointers.values()], g = gesture;
  if (!g.moved) { undoStack.push({ ...snap(), items: snap().items.map((x, i) => i === ed.sel ? { ...x, ...g.start } : x) }); $('undo').disabled = false; g.moved = true; }
  if (g.two && pts.length >= 2) {
    const [a, b] = pts, d = Math.hypot(b.x - a.x, b.y - a.y), ang = Math.atan2(b.y - a.y, b.x - a.x), mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    it.s = Math.max(it.kind === 'text' ? 12 : 30, Math.min(600, g.start.s * d / g.two.d));
    it.r = g.start.r + ang - g.two.a;
    it.x = g.start.x + mid.x - g.two.mid.x; it.y = g.start.y + mid.y - g.two.mid.y;
  } else {
    it.x = g.start.x + pts[0].x - g.p0.x; it.y = g.start.y + pts[0].y - g.p0.y;
  }
  renderEdit();
});
const endPointer = e => {
  if (!pointers.delete(e.pointerId)) return;
  if (pointers.size) startGesture(); else gesture = null;
};
pv.addEventListener('pointerup', endPointer);
pv.addEventListener('pointercancel', endPointer);
// Am Computer: Mausrad = Größe, mit Umschalttaste = Drehen
pv.addEventListener('wheel', e => {
  const it = ed.items[ed.sel]; if (!it) return;
  e.preventDefault();
  if (e.shiftKey) it.r += e.deltaY > 0 ? 0.08 : -0.08;
  else it.s = Math.max(it.kind === 'text' ? 12 : 30, Math.min(600, it.s * (e.deltaY > 0 ? 0.92 : 1.08)));
  renderEdit();
}, { passive: false });
window.addEventListener('resize', placeSel);
function syncEditorUI() {
  $$('#frames button').forEach(b => b.setAttribute('aria-pressed', b.dataset.frame === ed.frameId));
  $$('#looks button').forEach(b => b.setAttribute('aria-pressed', b.dataset.look === ed.look));
  $('caption').value = ed.caption; $('bright').value = ed.bright;
}
function buildFrames() {
  const box = $('frames'); box.innerHTML = '';
  for (const F of Render.FRAMES) {
    const b = document.createElement('button'); b.type = 'button'; b.dataset.frame = F.id;
    b.append(Render.frameThumb(F), F.name);
    b.addEventListener('click', () => { if (ed.frameId === F.id) return; pushUndo(); ed.frameId = F.id; syncEditorUI(); renderEdit(); });
    box.append(b);
  }
}
function renderLookThumbs() {
  if (!ed.img) return;
  const t = document.createElement('canvas'); t.width = 120; t.height = 90;
  const x = t.getContext('2d'), iw = ed.img.width, ih = ed.img.height, k = Math.max(120 / iw, 90 / ih);
  x.fillStyle = '#fff'; x.fillRect(0, 0, 120, 90);
  x.drawImage(ed.img, (120 - iw * k) / 2, (90 - ih * k) / 2, iw * k, ih * k);
  $$('#looks button').forEach(b => view(Render.compose({ img: t, width: 120, frameId: 'none', look: b.dataset.look, bright: 0 }), b.querySelector('canvas')));
}
function selectTab(name) {
  $$('.tabs [data-tab]').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === name));
  $$('[data-pane]').forEach(p => p.hidden = p.dataset.pane !== name);
}
$$('.tabs [data-tab]').forEach(b => b.addEventListener('click', () => selectTab(b.dataset.tab)));
$$('#looks button').forEach(b => b.addEventListener('click', () => { if (ed.look === b.dataset.look) return; pushUndo(); ed.look = b.dataset.look; syncEditorUI(); renderEdit(); }));
let captionBase = null;
$('caption').addEventListener('focus', () => captionBase = snap());
$('caption').addEventListener('input', e => { ed.caption = e.target.value; renderEdit(); });
$('caption').addEventListener('change', () => { if (captionBase && captionBase.caption !== ed.caption) { undoStack.push(captionBase); $('undo').disabled = false; } captionBase = null; });
let brightBase = null;
$('bright').addEventListener('pointerdown', () => brightBase = snap());
$('bright').addEventListener('input', e => { ed.bright = +e.target.value; renderEdit(); });
$('bright').addEventListener('change', () => { if (brightBase && brightBase.bright !== ed.bright) { undoStack.push(brightBase); $('undo').disabled = false; } brightBase = null; });
$('reset-look').addEventListener('click', () => { pushUndo(); ed.look = 'foto'; ed.bright = 0; syncEditorUI(); renderEdit(); });
$('to-print').addEventListener('click', () => { ed.sel = -1; placeSel(); openPrint(comp, { banner: ed.banner }); });

/* ---------- Drucken ---------- */
const pr = { comp: null, mode: S.lastMode, size: 1, count: 1 };
// Banner geht nur auf der Rolle (als Sticker würde er winzig)
function openPrint(compFn, opts = {}) { pr.comp = compFn; pr.count = 1; pr.banner = !!opts.banner; if (pr.banner) pr.mode = 'roll'; renderPrintUI(); show('s-print'); }
function renderPrintUI() {
  $$('.choice').forEach(b => { b.setAttribute('aria-pressed', b.dataset.mode === pr.mode); b.disabled = pr.banner && b.dataset.mode === 'sticker'; });
  $('quality-group').hidden = !canHD();
  $$('[data-quality]').forEach(b => b.setAttribute('aria-pressed', b.dataset.quality === S.quality));
  const sizes = $('sizes'); sizes.innerHTML = '';
  ['Klein', 'Mittel', 'Groß'].forEach((n, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-pressed', i === pr.size);
    b.innerHTML = `${n} <span>${(S.sizes[i] / 10).toLocaleString('de-DE')} cm</span>`;
    b.addEventListener('click', () => { pr.size = i; renderPrintUI(); });
    sizes.append(b);
  });
  $('size-group').hidden = pr.mode !== 'sticker';
  $('cutHint').textContent = pr.mode === 'sticker' ? 'Entlang der gestrichelten Linie schneiden' : 'So kommt es aus dem Drucker';
  $('count').textContent = pr.count;
  $('print-label').textContent = pr.mode === 'sticker' ? `${pr.count} Sticker drucken` : pr.count > 1 ? `${pr.count}× drucken` : 'Drucken';
  const W = printW();
  requestAnimationFrame(() => view(Render.layout(pr.comp, { mode: pr.mode, W, dpi: dpiOf(W), stickerMm: S.sizes[pr.size], count: Math.min(pr.count, 2) }), $('printPreview')));
}
$$('.choice').forEach(b => b.addEventListener('click', () => { pr.mode = b.dataset.mode; saveS({ lastMode: pr.mode }); renderPrintUI(); }));
$$('[data-quality]').forEach(b => b.addEventListener('click', () => { saveS({ quality: b.dataset.quality }); renderPrintUI(); }));
$('minus').addEventListener('click', () => { pr.count = Math.max(1, pr.count - 1); renderPrintUI(); });
$('plus').addEventListener('click', () => { pr.count = Math.min(9, pr.count + 1); renderPrintUI(); });

async function connectForPrint() {
  if (!Printer.supported()) { toast('Dieser Browser kann kein Bluetooth. Bitte Chrome nehmen.'); return false; }
  if (!Printer.configured) { toast('Ein Erwachsener muss den Drucker einmal im Eltern-Bereich einrichten.'); return false; }
  try { await Printer.ensure(); return true; }
  catch (e) { if (e.name !== 'NotFoundError') toast('Drucker nicht gefunden. Ist er eingeschaltet?'); return false; }
}
// img: Ergebnis von Render.forPrint; done: true = Fertig-Fenster mit „Zum Start“ zeigen
async function runPrint(img, heat, label, done = true) {
  const ov = $('printing'), prog = $('ov-prog');
  $('ov-text').textContent = label || 'Druckt …'; $('ov-done').hidden = true; prog.hidden = false; prog.value = 0; ov.hidden = false;
  await nextFrame();
  try {
    // Vorschub zum Abreißen: Schön 1 cm (spart Zeit), Schnell 1,5 cm. Der Balken zählt nur die Bildzeilen.
    const feed = Math.round(dpiOf(img.w) * (img.lv ? 0.4 : 0.6));
    await Printer.print(img, { heat, feed, onProgress: p => { prog.value = p; if (p >= 1) $('ov-text').textContent = 'Gleich fertig …'; } });
    if (!done) { ov.hidden = true; return true; }
    $('ov-text').textContent = 'Fertig! Abreißen und los geht’s.';
    prog.hidden = true; $('ov-done').hidden = false; $('ov-home').focus();
    return true;
  } catch (e) {
    ov.hidden = true;
    toast(e.code ? PROBLEM[e.code] : e.message === 'nicht verbunden' ? 'Die Verbindung ist abgebrochen. Bitte nochmal tippen.' : 'Das hat nicht geklappt: ' + e.message, 5000);
    return false;
  }
}
$('ov-home').addEventListener('click', () => { $('printing').hidden = true; home(); });
$('ov-again').addEventListener('click', () => { $('printing').hidden = true; });
$('do-print').addEventListener('click', async () => {
  if (!(await connectForPrint())) return;
  const W = printW(), hd = hdOn();
  const img = Render.forPrint(Render.layout(pr.comp, { mode: pr.mode, W, dpi: dpiOf(W), stickerMm: S.sizes[pr.size], count: pr.count }), hd, hdFloor(), hdGamma());
  const ok = await runPrint(img, hd ? S.heatHD : S.heatFast, hd ? 'Druckt in Schön … das dauert etwas.' : 'Druckt …');
  if (ok) saveHistory(pr.comp(W), pr.mode).catch(() => {});
});

/* ---------- Meine Drucke (IndexedDB, nur auf diesem Gerät) ---------- */
const DB = (() => {
  let p;
  const open = () => p || (p = new Promise((res, rej) => { const r = indexedDB.open('druckfrisch', 1); r.onupgradeneeded = () => r.result.createObjectStore('prints', { keyPath: 'id' }); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }));
  const tx = async (mode, fn) => { const db = await open(); return new Promise((res, rej) => { const t = db.transaction('prints', mode), st = t.objectStore('prints'); const out = fn(st); t.oncomplete = () => res(out && out.result); t.onerror = () => rej(t.error); }); };
  return { put: v => tx('readwrite', s => s.put(v)), all: () => tx('readonly', s => s.getAll()), del: id => tx('readwrite', s => s.delete(id)) };
})();
async function saveHistory(img, mode) {
  const c = Render.toCanvas(img, document.createElement('canvas'), [0, 0, 0]);
  const blob = await new Promise(r => c.toBlob(r, 'image/png'));
  await DB.put({ id: Date.now(), mode, blob });
  const all = (await DB.all()).sort((a, b) => b.id - a.id);
  for (const old of all.slice(40)) await DB.del(old.id);
}
// Gespeichert wird das Bild in Graustufen; alte Einträge aus 1.0.0 sind reines Schwarz-Weiß und gehen genauso
async function loadImg(blob) { const bm = await createImageBitmap(blob), c = document.createElement('canvas'); c.width = bm.width; c.height = bm.height; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(bm, 0, 0); return Render.fromCanvas(c); }
async function historyItems() { try { return (await DB.all()).sort((a, b) => b.id - a.id); } catch { return []; } }
function when(ts) {
  const d = new Date(ts), today = new Date(); const days = Math.round((new Date(today.toDateString()) - new Date(d.toDateString())) / 864e5);
  return days === 0 ? 'Heute' : days === 1 ? 'Gestern' : d.toLocaleDateString('de-DE', { weekday: 'long' });
}
async function reprint(item) { const img = await loadImg(item.blob); pr.mode = item.mode || pr.mode; openPrint(w => Render.scale(img, w)); }
async function renderRecent() {
  const box = $('recent'), items = (await historyItems()).slice(0, 3);
  box.innerHTML = '';
  for (const it of items) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'thumb'; b.setAttribute('aria-label', 'Nochmal drucken vom ' + when(it.id));
    const c = document.createElement('canvas'); b.append(c); box.append(b);
    loadImg(it.blob).then(img => Render.toCanvas(img, c));
    b.addEventListener('click', () => reprint(it));
  }
  const e = document.createElement('div'); e.className = 'thumb empty'; e.textContent = items.length ? 'Dein nächster Druck' : 'Hier landen deine Drucke'; box.append(e);
}
async function renderHistory() {
  const box = $('history'), items = await historyItems();
  box.innerHTML = ''; $('history-empty').hidden = items.length > 0;
  for (const it of items) {
    const card = document.createElement('div'); card.className = 'h-card';
    const pic = document.createElement('div'); pic.className = 'pic'; const c = document.createElement('canvas'); pic.append(c);
    const row = document.createElement('div'); row.className = 'row';
    const s = document.createElement('span'); s.textContent = `${when(it.id)} · ${it.mode === 'sticker' ? 'Sticker' : 'Rolle'}`;
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'chip'; btn.textContent = 'Nochmal';
    btn.addEventListener('click', () => reprint(it));
    row.append(s, btn); card.append(pic, row); box.append(card);
    loadImg(it.blob).then(img => Render.toCanvas(img, c));
  }
}
$('to-history').addEventListener('click', () => show('s-history'));

/* ---------- Eltern-Sperre ---------- */
const gear = $('gear'); let holdT = null;
const cancelHold = () => { clearTimeout(holdT); gear.classList.remove('holding'); };
gear.addEventListener('pointerdown', () => { gear.classList.add('holding'); holdT = setTimeout(() => { cancelHold(); openGate('open'); }, 2000); });
['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => gear.addEventListener(ev, cancelHold));
gear.addEventListener('click', () => { if (!$('gate').hidden) return; toast('Für Eltern: Zahnrad 2 Sekunden gedrückt halten.'); });
gear.addEventListener('contextmenu', e => e.preventDefault());
let gateMode = 'open', gateAnswer = '';
function openGate(mode) {
  gateMode = mode; const q = $('gate-q'), a = $('gate-a'); a.value = '';
  if (mode === 'setpin') { q.textContent = 'Neue PIN (leer lassen = Rechenaufgabe)'; a.type = 'password'; }
  else if (S.pin) { q.textContent = 'PIN eingeben'; a.type = 'password'; gateAnswer = S.pin; }
  else { const x = 6 + Math.floor(Math.random() * 4), y = 6 + Math.floor(Math.random() * 4); q.textContent = `Was ist ${x} × ${y}?`; a.type = 'text'; gateAnswer = String(x * y); }
  $('gate').hidden = false; setTimeout(() => a.focus(), 50);
}
$('gate-cancel').addEventListener('click', () => $('gate').hidden = true);
$('gate-form').addEventListener('submit', e => {
  e.preventDefault(); const v = $('gate-a').value.trim();
  if (gateMode === 'setpin') { saveS({ pin: v }); $('gate').hidden = true; fillParents(); toast(v ? 'PIN gespeichert.' : 'Zugang wieder mit Rechenaufgabe.'); return; }
  if (v === gateAnswer) { $('gate').hidden = true; show('s-parents'); } else { $('gate-a').value = ''; toast('Leider falsch.'); }
});

/* ---------- Eltern-Bereich ---------- */
function fillParents() {
  const P = Printer.settings();
  $('p-name').textContent = P.name || 'Kein Drucker eingerichtet';
  const inf = Printer.info, extra = inf.battery != null ? ` · Akku ${inf.battery} %` + (inf.temp != null ? ` · ${inf.temp} °C` : '') : '';
  $('p-info').textContent = P.name ? `${Printer.state === 'ready' ? 'verbunden' : 'nicht verbunden'} · ${printW()} px · ${dpiOf(printW())} dpi${extra}` : 'Drucker einschalten, dann „Einrichten“ tippen';
  $('p-setup').textContent = P.name ? 'Neu einrichten' : 'Einrichten';
  $('p-auto').checked = P.auto !== false;
  $('p-auto-hint').textContent = Printer.canAutoConnect() ? 'Kind sieht keine Geräteliste' : 'Beim Drucken erscheint nur dieser eine Drucker zur Auswahl';
  $('p-width').value = S.width; $('p-custom').value = S.customWidth; $('p-custom-row').hidden = S.width !== 'custom';
  for (const [k, id] of HEATS) { $('p-' + id).value = S[k]; $('o-' + id).textContent = S[k]; }
  $('p-heat-hd-row').hidden = !canHD();
  S.sizes.forEach((v, i) => $('p-s' + (i + 1)).value = v);
  $('p-appname').value = S.appName;
  const sw = $('p-swatches'); sw.innerHTML = '';
  for (const [k, [c]] of Object.entries(ACCENTS)) { const b = document.createElement('button'); b.type = 'button'; b.style.background = c; b.setAttribute('aria-label', ACCENT_NAMES[k]); b.setAttribute('aria-pressed', S.accent === k); b.addEventListener('click', () => { saveS({ accent: k }); applyLook(); fillParents(); }); sw.append(b); }
  $('p-version').textContent = APP_VERSION;
  $('p-pin').textContent = S.pin ? 'PIN ändern' : 'PIN festlegen';
  $('p-pin-hint').textContent = 'Zahnrad 2 Sekunden drücken, dann ' + (S.pin ? 'PIN' : 'Rechenaufgabe');
  const tf = Printer.transfer(false), th = Printer.transfer(true);
  $('p-proto').value = P.proto || 'auto'; $('p-flip').checked = !!P.flip;
  $('p-pk-fast').value = tf.size; $('p-dl-fast').value = tf.dly; $('p-pk-hd').value = th.size; $('p-dl-hd').value = th.dly; $('p-hdfloor').value = P.hdFloor ?? 6; $('p-hdgamma').value = P.hdGamma ?? 0.6;
  $('p-log').textContent = Printer.log() || 'Noch keine Meldungen.';
}
$('p-setup').addEventListener('click', async () => {
  if (!Printer.supported()) return toast('Dieser Browser kann kein Bluetooth. Bitte Chrome nehmen.');
  try { const n = await Printer.setup(); toast(`„${n}“ ist eingerichtet.`); } catch (e) { if (e.name !== 'NotFoundError') toast('Einrichten hat nicht geklappt: ' + e.message, 5000); }
  fillParents();
});
$('p-auto').addEventListener('change', e => Printer.saveSettings({ auto: e.target.checked }));
$('p-width').addEventListener('change', e => { saveS({ width: e.target.value }); fillParents(); });
$('p-custom').addEventListener('change', e => { saveS({ customWidth: +e.target.value }); fillParents(); });
// Testdruck einmal pro Modus, jeweils mit der eingestellten Hitze
$('p-test').addEventListener('click', async () => {
  if (!(await connectForPrint())) return;
  const W = printW(), dpi = dpiOf(W);
  const ok = await runPrint(Render.forPrint(Render.testPattern(W, dpi, `Schnell · Hitze ${S.heatFast} · ${W} px`), false), S.heatFast, 'Testdruck Schnell …', !canHD());
  if (ok && canHD()) await runPrint(Render.forPrint(Render.testPattern(W, dpi, `Schön · Hitze ${S.heatHD} · ${W} px`), true, hdFloor(), hdGamma()), S.heatHD, 'Testdruck Schön …');
  fillParents();
});
const HEATS = [['heatFast', 'heat-fast'], ['heatHD', 'heat-hd']];
for (const [k, id] of HEATS) $('p-' + id).addEventListener('input', e => { const v = +e.target.value; $('o-' + id).textContent = v; saveS({ [k]: v }); });
[1, 2, 3].forEach(i => $('p-s' + i).addEventListener('change', () => saveS({ sizes: [1, 2, 3].map(j => Math.max(15, Math.min(150, +$('p-s' + j).value || DEFAULTS.sizes[j - 1]))) })));
$('p-appname').addEventListener('input', e => { saveS({ appName: e.target.value.trim() || 'Druckfrisch' }); applyLook(); });
$('p-pin').addEventListener('click', () => openGate('setpin'));
$('p-proto').addEventListener('change', e => Printer.saveSettings({ proto: e.target.value }));
const num = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.round(+v || 0)));
$('p-pk-fast').addEventListener('change', e => Printer.saveSettings({ pkFast: num(e.target.value, 20, 512) }));
$('p-dl-fast').addEventListener('change', e => Printer.saveSettings({ dlFast: num(e.target.value, 0, 100) }));
$('p-pk-hd').addEventListener('change', e => Printer.saveSettings({ pkHd: num(e.target.value, 20, 512) }));
$('p-dl-hd').addEventListener('change', e => Printer.saveSettings({ dlHd: num(e.target.value, 0, 100) }));
$('p-hdfloor').addEventListener('change', e => Printer.saveSettings({ hdFloor: num(e.target.value, 1, 14) }));
$('p-hdgamma').addEventListener('change', e => {
  const v = parseFloat(String(e.target.value).replace(',', '.'));
  Printer.saveSettings({ hdGamma: Math.max(0.3, Math.min(1.5, Math.round((v || 0.6) * 100) / 100)) });
});
$('p-flip').addEventListener('change', e => Printer.saveSettings({ flip: e.target.checked }));
$('p-forget').addEventListener('click', () => { Printer.forget(); fillParents(); toast('Drucker vergessen. Zum Neu-Einrichten „Einrichten“ tippen.'); });
$('p-update').addEventListener('click', async () => {
  toast('Hole die neueste Version …');
  try {
    if ('caches' in window) for (const k of await caches.keys()) await caches.delete(k);
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) await reg.unregister();
  } catch {}
  location.reload();
});

/* ---------- Start ---------- */
applyLook();
buildFrames();
buildStickers();
buildText();
// Text-Schriften einmal laden, damit sie (über den Service Worker) auch offline da sind
if (document.fonts) for (const f of Render.FONTS) document.fonts.load(`40px "${f.id}"`, 'Abc ÄÖÜß!?').catch(() => {});
renderRecent();
if (document.fonts) document.fonts.load('800 30px Lexend').catch(() => {});
if (Printer.supported()) Printer.autoConnect();
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').then(reg => reg.update()).catch(() => {});
}
}
