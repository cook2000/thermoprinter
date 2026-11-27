/* Druckfrisch – Bluetooth-Anbindung für Fun-Print-/Cat-Printer-Thermodrucker
   Protokolle: klassisch (0x51 0x78 …, GB/MX/Fun-Print-Familie) und MXW01 (0x22 0x21 …). */
const Printer = (() => {
  const SERVICES = [0xae30, 0xaf30, 0xae3a];
  const KEY = 'df_printer';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } };
  const save = o => { try { localStorage.setItem(KEY, JSON.stringify({ ...load(), ...o })); } catch {} };

  let dev = null, chW = null, chN = null, chD = null, proto = 'gb';
  let paused = false, waiters = [], wantConnected = false, retry = 0, retryTimer = null, connecting = null;
  const listeners = new Set();
  let state = 'off';
  const logLines = [];
  const log = m => { logLines.push(new Date().toLocaleTimeString() + ' ' + m); if (logLines.length > 200) logLines.shift(); };
  const emit = s => { state = s; listeners.forEach(f => f(s)); };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const timeout = (p, ms, msg) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(msg)), ms))]);

  /* ---------- Pakete ---------- */
  const CRC = new Uint8Array(256);
  for (let i = 0; i < 256; i++) { let c = i; for (let j = 0; j < 8; j++) c = c & 0x80 ? ((c << 1) ^ 0x07) & 0xff : (c << 1) & 0xff; CRC[i] = c; }
  const crc8 = d => { let c = 0; for (const b of d) c = CRC[(c ^ b) & 0xff]; return c; };
  const pkt = (head, cmd, data) => { data = Array.from(data); return [...head, cmd, 0x00, data.length & 0xff, (data.length >> 8) & 0xff, ...data, crc8(data), 0xff]; };
  const gb = (c, d) => pkt([0x51, 0x78], c, d);
  const mx = (c, d) => pkt([0x22, 0x21], c, d);

  /* ---------- Verbindung ---------- */
  function onNotify(e) {
    const v = new Uint8Array(e.target.value.buffer);
    log('← ' + Array.from(v, b => b.toString(16).padStart(2, '0')).join(' '));
    if (v[0] === 0x51 && v[1] === 0x78 && v[2] === 0xae) paused = v[6] === 0x10;
    if (v[0] === 0x22 && v[1] === 0x21) waiters = waiters.filter(w => (w.cmd === v[2] ? (w.res(v), false) : true));
  }
  function waitFor(cmd, ms = 8000) {
    return new Promise((res, rej) => { const w = { cmd, res }; waiters.push(w); setTimeout(() => { waiters = waiters.filter(x => x !== w); rej(new Error('Keine Antwort vom Drucker')); }, ms); });
  }
  function onDisconnect() {
    chW = null; log('getrennt'); emit('off');
    if (wantConnected && dev && retry < 6) { clearTimeout(retryTimer); retryTimer = setTimeout(() => { retry++; attach(dev).catch(err => log('Wiederverbinden: ' + err.message)); }, 1500 + retry * 1500); }
  }
  async function attach(d) {
    if (connecting) return connecting;
    connecting = (async () => {
      if (dev !== d) { if (dev) dev.removeEventListener('gattserverdisconnected', onDisconnect); dev = d; d.addEventListener('gattserverdisconnected', onDisconnect); }
      emit('connecting'); log('verbinde mit ' + (d.name || d.id));
      const srv = await timeout(d.gatt.connect(), 10000, 'Drucker antwortet nicht');
      let svc = null, base = 0xae;
      for (const [s, b] of [[0xae30, 0xae], [0xaf30, 0xaf]]) { try { svc = await srv.getPrimaryService(s); base = b; break; } catch {} }
      if (!svc) throw new Error('Druckerdienst nicht gefunden');
      const id = n => (base << 8) | n;
      chW = await svc.getCharacteristic(id(0x01));
      try { chN = await svc.getCharacteristic(id(0x02)); await chN.startNotifications(); chN.addEventListener('characteristicvaluechanged', onNotify); } catch (e) { log('kein Notify: ' + e.message); }
      const cfg = load(), name = (d.name || '').toUpperCase();
      proto = cfg.proto && cfg.proto !== 'auto' ? cfg.proto : (name.startsWith('MXW') ? 'mxw' : 'gb');
      chD = proto === 'mxw' ? await svc.getCharacteristic(id(0x03)) : null;
      save({ id: d.id, name: d.name || '' });
      retry = 0; wantConnected = true; log('bereit · Protokoll ' + proto); emit('ready');
    })();
    try { await connecting; } catch (e) { chW = null; emit('off'); throw e; } finally { connecting = null; }
  }

  // Eltern: Drucker einmal aus der vollen Liste wählen
  async function setup() {
    const d = await navigator.bluetooth.requestDevice({ acceptAllDevices: true, optionalServices: SERVICES });
    await attach(d);
    return d.name || 'Drucker';
  }

  // Beim App-Start still verbinden (nur wenn Chrome sich Geräte merkt)
  async function autoConnect() {
    const cfg = load();
    if (!navigator.bluetooth || !cfg.id || cfg.auto === false || !navigator.bluetooth.getDevices) return false;
    try {
      const d = (await navigator.bluetooth.getDevices()).find(x => x.id === cfg.id);
      if (!d) return false;
      wantConnected = true;
      try { await attach(d); return true; }
      catch {
        if (!d.watchAdvertisements) return false;
        const ctl = new AbortController();
        d.addEventListener('advertisementreceived', () => { ctl.abort(); attach(d).catch(() => {}); }, { once: true });
        await d.watchAdvertisements({ signal: ctl.signal });
        return true;
      }
    } catch (e) { log('Auto-Verbindung: ' + e.message); return false; }
  }

  // Vor dem Drucken: verbinden, ohne dass das Kind suchen muss. Muss aus einem Tipp heraus aufgerufen werden.
  async function ensure() {
    if (chW) return;
    const cfg = load();
    if (dev) { try { await attach(dev); return; } catch {} }
    if (!cfg.name) throw new Error('nicht eingerichtet');
    const d = await navigator.bluetooth.requestDevice({ filters: [{ name: cfg.name }], optionalServices: SERVICES });
    await attach(d);
  }

  /* ---------- Drucken ---------- */
  async function write(ch, bytes, onProgress) {
    const cfg = load(), size = cfg.chunk || 128, dly = cfg.delay ?? 12, arr = Uint8Array.from(bytes);
    for (let o = 0; o < arr.length; o += size) {
      let wait = 0; while (paused && wait++ < 500) await sleep(20);
      const part = arr.slice(o, o + size);
      if (ch.writeValueWithoutResponse) await ch.writeValueWithoutResponse(part); else await ch.writeValue(part);
      if (dly) await sleep(dly);
      onProgress && onProgress(Math.min(1, (o + size) / arr.length));
    }
  }
  const rowBytes = (img, y, flip) => {
    const n = img.w >> 3, b = new Uint8Array(n);
    for (let x = 0; x < img.w; x++) if (img.bits[y * img.w + x]) b[x >> 3] |= flip ? (0x80 >> (x & 7)) : (1 << (x & 7));
    return b;
  };

  // img: {bits,w,h}; heat: 0..100 %; feed: Zeilen Vorschub
  async function print(img, { heat = 50, feed = 100, onProgress } = {}) {
    if (!chW) throw new Error('nicht verbunden');
    const cfg = load(), flip = !!cfg.flip, n = img.w >> 3;
    if (proto === 'mxw') {
      const total = Math.max(90, img.h + feed), data = new Uint8Array(total * n);
      for (let y = 0; y < img.h; y++) data.set(rowBytes(img, y, flip), y * n);
      await chW.writeValueWithoutResponse(Uint8Array.from(mx(0xa2, [Math.round(heat / 100 * 255)])));
      await sleep(50);
      const ack = waitFor(0xa9);
      await chW.writeValueWithoutResponse(Uint8Array.from(mx(0xa9, [total & 0xff, total >> 8, 0x30, 0x00])));
      const r = await ack; if (r[6] !== 0) throw new Error('Drucker meldet ein Problem (Papier, Deckel oder Akku?)');
      await write(chD, data, onProgress);
      const done = waitFor(0xaa, 60000);
      await chW.writeValueWithoutResponse(Uint8Array.from(mx(0xad, [0x00])));
      await done.catch(e => log(e.message));
      return;
    }
    const e = Math.round(0x1000 + heat / 100 * 0xb000), buf = [];
    buf.push(...gb(0xa3, [0x00]), ...gb(0xa4, [0x32]), ...gb(0xaf, [e & 0xff, e >> 8]), ...gb(0xbe, [0x01]), ...gb(0xbd, [25]));
    buf.push(...gb(0xa6, [0xaa, 0x55, 0x17, 0x38, 0x44, 0x5f, 0x5f, 0x5f, 0x44, 0x38, 0x2c]));
    for (let y = 0; y < img.h; y++) buf.push(...gb(0xa2, rowBytes(img, y, flip)));
    const empty = new Uint8Array(n);
    for (let y = 0; y < feed; y++) buf.push(...gb(0xa2, empty));
    buf.push(...gb(0xa6, [0xaa, 0x55, 0x17, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x17]), ...gb(0xa3, [0x00]));
    await write(chW, buf, onProgress);
  }

  return {
    get state() { return state; },
    get name() { return load().name || ''; },
    get configured() { return !!load().name; },
    supported: () => !!navigator.bluetooth,
    canAutoConnect: () => !!(navigator.bluetooth && navigator.bluetooth.getDevices),
    on: f => { listeners.add(f); return () => listeners.delete(f); },
    setup, autoConnect, ensure, print,
    settings: load, saveSettings: save,
    forget: () => { try { localStorage.removeItem(KEY); } catch {} wantConnected = false; if (dev && dev.gatt.connected) dev.gatt.disconnect(); dev = null; chW = null; emit('off'); },
    log: () => logLines.join('\n'),
  };
})();
