/* Druckfrisch – App-Logik */
const APP_VERSION = '1.0.4';
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
    view(Render.compose({ img: c, width: w, frameId: 'none', look: 'foto', bright: 0 }), pc);
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
const ed = { img: null, frameId: 'none', caption: '', look: 'foto', bright: 0 };
const undoStack = [];
const snap = () => ({ frameId: ed.frameId, caption: ed.caption, look: ed.look, bright: ed.bright });
function pushUndo() { undoStack.push(snap()); if (undoStack.length > 40) undoStack.shift(); $('undo').disabled = false; }
$('undo').addEventListener('click', () => {
  const s = undoStack.pop(); if (!s) return;
  Object.assign(ed, s); $('undo').disabled = !undoStack.length; syncEditorUI(); renderEdit();
});

function openEditor(img) {
  Object.assign(ed, { img, frameId: 'none', caption: '', look: 'foto', bright: 0 });
  undoStack.length = 0; $('undo').disabled = true;
  syncEditorUI(); selectTab('frame'); renderLookThumbs();
  show('s-editor', stack[stack.length - 1] === 's-camera');
  renderEdit();
}
const comp = w => Render.compose({ img: ed.img, width: w, frameId: ed.frameId, caption: ed.caption, look: ed.look, bright: ed.bright });
let renderT;
function renderEdit() {
  clearTimeout(renderT);
  renderT = setTimeout(() => { if (ed.img) view(comp(printW()), $('editPreview')); }, 40);
}
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
$('to-print').addEventListener('click', () => openPrint(comp));

/* ---------- Drucken ---------- */
const pr = { comp: null, mode: S.lastMode, size: 1, count: 1 };
function openPrint(compFn) { pr.comp = compFn; pr.count = 1; renderPrintUI(); show('s-print'); }
function renderPrintUI() {
  $$('.choice').forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === pr.mode));
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
renderRecent();
if (document.fonts) document.fonts.load('800 30px Lexend').catch(() => {});
if (Printer.supported()) Printer.autoConnect();
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').then(reg => reg.update()).catch(() => {});
}
}
