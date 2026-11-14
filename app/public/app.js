// Claude Video Maker v1 — front end (vanilla JS, no build step)
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const api = async (path, method = "GET", body) => {
  const r = await fetch(path, { method, headers: body ? { "content-type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j.message || r.statusText), { data: j });
  return j;
};
const ic = (n) => ({
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  lib: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h4v16H4zM10 4h4v16h-4zM16.5 5l3.7-1 3 15.3-3.7 1z"/></svg>',
  desk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M10 9l5 2.5-5 2.5z"/></svg>',
  cog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
  brush: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 14.5L19 5a2.1 2.1 0 0 1 3 3l-9.5 9.5"/><path d="M9.5 14.5c-2.5 0-4 1.5-4 4 0 1.4-1 2.5-2.5 2.5 4 1 9 .5 9-3 0-1.3-.8-2.5-2.5-3.5z"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
  badge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.5 5 5.5.8-4 3.9 1 5.6-5-2.7-5 2.7 1-5.6-4-3.9 5.5-.8z"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.6L19.5 10l-4.6 3.4L16.6 19 12 15.7 7.4 19l1.7-5.6L4.5 10l5.6-1.4z"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
  out: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>',
  chip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></svg>',
  note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v12H8l-4 4z"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
  dl: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 11l5 5 5-5M4 20h16"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>',
}[n] || "");

let S = { settings: {}, library: { styles: [], brandKits: [], references: [], assets: [] }, projects: [], env: {}, running: [] };
let P = null;        // current project
let route = { name: "home" };
let sec = "content"; // composer section
let tab = "preview"; // result tab
let sel = null;      // selected version number
let cmp = [null, null];
let poll = null, logSince = 0, runInfo = null;
let filter = { q: "", style: "", status: "", sort: "new" };
let libTab = "styles";

const SECTIONS = [
  ["content", "Content", "file"], ["style", "Style", "brush"], ["references", "References", "link"], ["brand", "Brand Kit", "badge"],
  ["assets", "Special Assets", "star"], ["audio", "Audio", "mic"], ["output", "Output", "out"], ["engine", "Engine & Render", "chip"], ["extra", "Extra Instructions", "note"],
];

// ---------- helpers ----------
const getp = (o, p) => p.split(".").reduce((a, k) => (a == null ? a : a[k]), o);
const setp = (o, p, v) => { const ks = p.split("."); const l = ks.pop(); const t = ks.reduce((a, k) => (a[k] ??= {}), o); t[l] = v; };
const kindOf = (f) => { const e = (f.split(".").pop() || "").toLowerCase(); return ["mp4", "mov", "mkv", "webm", "avi"].includes(e) ? "video" : ["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(e) ? "image" : ["mp3", "wav", "m4a", "ogg", "aac"].includes(e) ? "audio" : ["md", "txt", "docx", "pdf", "srt"].includes(e) ? "doc" : "file"; };
const base = (p) => String(p || "").split(/[\\/]/).pop();
const ago = (iso) => { if (!iso) return ""; const d = new Date(iso); return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }); };
const dur = (ms) => { if (!ms && ms !== 0) return "—"; const s = Math.round(ms / 1000); return s >= 3600 ? `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m` : s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`; };
const num = (n) => (n == null ? "—" : n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n));
const styleOf = (id) => S.library.styles.find((s) => s.id === id);
function toast(msg, bad) { const t = document.createElement("div"); t.className = "toast glass"; t.style.borderColor = bad ? "var(--bad)" : "rgba(110,231,168,.5)"; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 4200); }
let saveT = null, saving = false;
function dirty() { clearTimeout(saveT); saveT = setTimeout(saveNow, 600); }
async function saveNow() { if (!P || saving) { if (P) dirty(); return; } saving = true; try { const { _fb, ...clean } = P; await api("/api/project/" + P.id, "PUT", clean); } catch (e) { toast(e.message, true); } finally { saving = false; } }
let setT = null;
const saveSettings = () => { clearTimeout(setT); setT = setTimeout(async () => { try { const r = await api("/api/settings", "PUT", S.settings); S.settings = r.settings; if (r.restart) toast("Data folder changed: restart the app to use it."); } catch (e) { toast(e.message, true); } }, 500); };
async function refresh() { const st = await api("/api/state"); S = st; }
async function loadProject(id) { const r = await api("/api/project/" + id); P = r.project; return r; }

// ---------- shell ----------
function renderRail() {
  const e = S.env || {}; const running = (S.running || []).length;
  const items = [["home", "Projects", "home"], ["library", "Library", "lib"], ["desk", "Review Desk", "desk"], ["guide", "Guide", "note"], ["settings", "Settings", "cog"]];
  $("#rail").innerHTML = `
    <div class="brand"><img src="logo.svg" alt="Uddhar"><div><b>Claude Video Maker</b><span>Version 1 · Uddhar</span></div></div>
    ${items.map(([k, l, i]) => `<button class="nav ${route.name === k || (k === "home" && ["composer", "result"].includes(route.name)) ? "on" : ""}" data-act="go" data-to="${k === "home" ? "" : k}">${ic(i)}<span>${l}</span></button>`).join("")}
    <div class="foot">
      <div style="margin-bottom:8px;color:var(--cream);font-weight:600">Developed by Kajama Shahr</div>
      <div><i class="dot ${running ? "run" : e.claude ? "ok" : "bad"}"></i>${running ? "Generating…" : e.claude ? "Claude ready" : "Claude CLI missing"}</div>
      <div><i class="dot ${S.settings.gpu === "cpu" ? "" : e.nvidia ? "ok" : "bad"}"></i>GPU: ${esc(S.settings.gpu)}${e.nvidia ? " · RTX" : ""}</div>
      <div><i class="dot ${e.engineReady ? "ok" : "bad"}"></i>Engine ${e.engineReady ? "ready" : "not installed"}</div>
    </div>`;
}
function go(to) { location.hash = "#/" + to; }
function parseRoute() {
  const h = location.hash.replace(/^#\/?/, ""); const p = h.split("/");
  if (!h) route = { name: "home" };
  else if (p[0] === "p") route = { name: p[2] === "result" ? "result" : "composer", id: p[1] };
  else route = { name: p[0] };
}
async function render() {
  parseRoute(); clearInterval(poll); poll = null; $("#view").style.padding = "";
  try { await refresh(); } catch (e) { $("#view").innerHTML = `<div class="glass pane"><h2>App server not reachable</h2><p class="muted">${esc(e.message)}</p></div>`; return; }
  if (route.id) { try { const r = await loadProject(route.id); runInfo = r.run; } catch { P = null; return go(""); } } else P = null;
  renderRail();
  const v = { home: viewHome, composer: viewComposer, result: viewResult, library: viewLibrary, desk: viewDesk, guide: viewGuide, settings: viewSettings }[route.name] || viewHome;
  v(); bindAll();
}
window.addEventListener("hashchange", render);

// ---------- dashboard ----------
function viewHome() {
  $("#top").innerHTML = `<div class="grow"><h1>Projects</h1><div class="muted sm">Every reel is a project. All inputs live in its project.json.</div></div><button class="btn pri" data-act="newProject">${ic("plus")} New Project</button>`;
  let list = S.projects.filter((p) => (!filter.q || p.name.toLowerCase().includes(filter.q.toLowerCase())) && (!filter.style || p.style === filter.style) && (!filter.status || p.status === filter.status));
  list = list.sort((a, b) => (filter.sort === "name" ? a.name.localeCompare(b.name) : filter.sort === "old" ? a.updatedAt.localeCompare(b.updatedAt) : b.updatedAt.localeCompare(a.updatedAt)));
  const card = (p) => `<div class="card glass" data-act="open" data-id="${p.id}">
    <div class="thumb">${p.poster ? `<img src="${p.poster}" alt="">` : ic("play")}<span class="badge chip ${p.status}">${p.status === "generating" ? "● " : ""}${p.status}</span></div>
    <div class="x"><button class="btn sm" data-act="dupProject" data-id="${p.id}" title="Duplicate">${ic("copy")}</button><button class="btn sm danger" data-act="delProject" data-id="${p.id}" title="Delete">${ic("trash")}</button></div>
    <div class="t">${p.locked ? ic("lock").replace("<svg", '<svg width="13" height="13" style="vertical-align:-2px"') + " " : ""}${esc(p.name)}</div>
    <div class="meta muted sm"><span>${esc(styleOf(p.style)?.name || "No style")}${p.mode ? " · " + p.mode : ""}</span><span>${p.versions} ver · ${ago(p.updatedAt)}</span></div></div>`;
  $("#view").innerHTML = `
    <div class="toolbar">
      <input type="search" placeholder="Search projects" value="${esc(filter.q)}" data-filter="q">
      <select data-filter="style"><option value="">All styles</option>${S.library.styles.map((s) => `<option value="${s.id}" ${filter.style === s.id ? "selected" : ""}>${esc(s.name)}</option>`).join("")}</select>
      <select data-filter="status"><option value="">All status</option>${["draft", "generating", "generated", "exported"].map((s) => `<option ${filter.status === s ? "selected" : ""}>${s}</option>`).join("")}</select>
      <select data-filter="sort"><option value="new" ${filter.sort === "new" ? "selected" : ""}>Newest first</option><option value="old" ${filter.sort === "old" ? "selected" : ""}>Oldest first</option><option value="name" ${filter.sort === "name" ? "selected" : ""}>Name</option></select>
      <span class="grow"></span>${S.projects.length ? "" : `<button class="btn" data-act="importEps">${ic("dl")} Import EP01/EP02 from earlier work</button>`}
    </div>
    <div class="grid"><div class="card glass new" data-act="newProject"><div class="plus">+</div><b>New Project</b><span class="sm">Start blank or duplicate an earlier one</span></div>${list.map(card).join("")}</div>
    ${S.projects.length && !list.length ? '<p class="muted">No project matches the filter.</p>' : ""}`;
}

// ---------- composer ----------
function secState(k) {
  const p = P, st = styleOf(p.style.id);
  if (k === "content") return p.content.script.trim() || p.content.storyline.trim() || p.content.files.length ? "ok" : "warn";
  if (k === "style") return st && (!st.needsMode || p.style.mode) ? "ok" : "warn";
  if (k === "references") return p.references.length ? "ok" : "";
  if (k === "brand") return p.brandKit.id ? "ok" : "";
  if (k === "assets") return p.assets.length ? "ok" : "";
  if (k === "audio") return p.audio.voiceover ? "ok" : "warn";
  if (k === "output" || k === "engine") return "ok";
  return p.extra.trim() ? "ok" : "";
}
function composerTop() {
  const hasV = P.versions.length;
  $("#top").innerHTML = `<button class="btn sm ghost" data-act="go" data-to="">← Projects</button>
    <div class="grow"><input type="text" data-bind="name" value="${esc(P.name)}" style="font-size:20px;font-weight:700;background:transparent;box-shadow:none;padding:6px 4px"></div>
    <span class="chip ${P.status}">${P.status}</span>
    <button class="btn sm" data-act="toggleLock" title="Lock to protect an approved project">${ic("lock")} ${P.locked ? "Locked" : "Lock"}</button>
    <button class="btn sm" data-act="showBrief">${ic("file")} Brief</button>
    ${hasV ? `<button class="btn" data-act="go" data-to="p/${P.id}/result">${ic("play")} Results</button>` : ""}
    <button class="btn pri" data-act="review" ${P.locked ? "disabled" : ""}>${ic("bolt")} Review &amp; Generate</button>`;
}
function viewComposer() {
  composerTop();
  $("#view").innerHTML = `<div class="composer">
    <nav class="sections glass">${SECTIONS.map(([k, l, i]) => `<button class="sec ${sec === k ? "on" : ""}" data-act="sec" data-k="${k}">${ic(i)}<span>${l}</span><i class="st ${secState(k)}"></i></button>`).join("")}</nav>
    <div class="pane glass" id="pane"></div></div>`;
  renderPane();
}
function renderPane() {
  const f = { content: paneContent, style: paneStyle, references: paneRefs, brand: paneBrand, assets: paneAssets, audio: paneAudio, output: paneOutput, engine: paneEngine, extra: paneExtra }[sec];
  $("#pane").innerHTML = f(); bindAll();
  document.querySelectorAll(".sec").forEach((b) => b.classList.toggle("on", b.dataset.k === sec));
  document.querySelectorAll(".sec .st").forEach((s, i) => (s.className = "st " + secState(SECTIONS[i][0])));
}
const dropZone = (list, label) => `<div class="drop" data-drop="${list}">${label || "Drag files here or"} <button class="btn sm" data-act="browse" data-list="${list}">Browse…</button></div>`;
function fileItem(f, list, i, noteLabel = "Note") {
  const miss = f._missing;
  return `<div class="item glass"><div class="ic">${ic(f.kind === "folder" ? "folder" : "file")}</div><div class="grow"><div class="nm ${miss ? "miss" : ""}">${esc(base(f.path))}</div><div class="muted xs" style="text-transform:none;letter-spacing:0;word-break:break-all">${esc(f.path)}</div><input type="text" placeholder="${noteLabel}" value="${esc(f.note || f.use || "")}" data-bind="${list}.${i}.${list === "assets" ? "use" : "note"}"></div><div class="row gap-s"><button class="btn sm ghost" data-act="reveal" data-path="${esc(f.path)}">${ic("folder")}</button><button class="btn sm ghost danger" data-act="rm" data-list="${list}" data-i="${i}">${ic("x")}</button></div></div>`;
}
function paneContent() {
  const c = P.content;
  return `<h2>Content</h2><p class="lead">The script and storyline Claude must follow. Add any number of files or whole folders from anywhere on this PC.</p>
  <div class="col"><div class="field"><label>Script</label><textarea data-bind="content.script" rows="9" placeholder="Paste the narration script here. It is used as given, never rewritten silently.">${esc(c.script)}</textarea></div>
  <div class="field"><label>Storyline / scene direction</label><textarea data-bind="content.storyline" rows="6" placeholder="Scene-by-scene animation direction, mood, notes.">${esc(c.storyline)}</textarea></div>
  <div class="field"><label>Visual files or folders</label><div class="list" id="lst-files">${c.files.map((f, i) => fileItem(f, "content.files", i)).join("")}</div>${dropZone("content.files", "Drag files here, or")} <div><button class="btn sm" data-act="browseFolder" data-list="content.files">${ic("folder")} Add a folder…</button></div></div></div>`;
}
function paneStyle() {
  const st = styleOf(P.style.id);
  return `<h2>Style</h2><p class="lead">Pick from your style library. A style carries its own rules; new ones come from Library → Styles or "Save as Style" on a finished video.</p>
  <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(190px,1fr))">${S.library.styles.map((s) => {
    const th = (s.thumbs && s.thumbs[P.style.mode]) || s.thumb;
    return `<div class="stylecard glass ${P.style.id === s.id ? "on" : ""}" data-act="pickStyle" data-id="${s.id}"><div class="thumb">${th ? `<img src="${th}" alt="">` : ic("brush")}</div><b>${esc(s.name)}</b><span class="muted sm">${esc(s.desc || s.rules || "").slice(0, 110)}</span></div>`;
  }).join("")}</div>
  ${st?.needsMode ? `<div class="col" style="margin-top:20px"><div class="lbl">Mode — required for every Animation Story reel</div>
    <div class="modes"><div class="mode light ${P.style.mode === "light" ? "on" : ""}" data-act="pickMode" data-m="light"><i></i><div><b>Light</b><div class="muted sm">Brand cream #FEEEE7 page, navy ink, white cards</div></div></div>
    <div class="mode dark ${P.style.mode === "dark" ? "on" : ""}" data-act="pickMode" data-m="dark"><i></i><div><b>Dark</b><div class="muted sm">Brand navy #101B49 page, cream cards and text</div></div></div></div></div>` : ""}
  ${st ? `<div class="hint" style="margin-top:18px"><b>${esc(st.name)}</b> · ${esc(st.rules || "")}${st.spec ? `<br><span class="muted">Spec: ${esc(st.spec)}${st.skill ? " · skill " + esc(st.skill) : ""}</span>` : ""}</div>` : ""}
  <div class="field" style="margin-top:16px"><label>Project style notes (optional)</label><textarea data-bind="style.notes" rows="3" placeholder="e.g. keep the hero calmer, no screen shake">${esc(P.style.notes)}</textarea></div>`;
}
function paneRefs() {
  return `<h2>References</h2><p class="lead">Videos, images or links. The note is the real value: say exactly what to take, e.g. "only the transition at 0:12".</p>
  <div class="list">${P.references.map((r, i) => `<div class="item glass"><div class="ic">${ic(r.url ? "link" : "play")}</div><div class="grow"><div class="nm">${esc(r.url || base(r.path))}</div>${r.path ? `<div class="muted xs" style="text-transform:none;letter-spacing:0;word-break:break-all">${esc(r.path)}</div>` : ""}<textarea data-bind="references.${i}.note" placeholder="What should Claude take from this?">${esc(r.note || "")}</textarea></div><button class="btn sm ghost danger" data-act="rm" data-list="references" data-i="${i}">${ic("x")}</button></div>`).join("")}</div>
  <div class="row wrap" style="margin-top:14px"><div class="grow">${dropZone("references", "Drop reference videos or images, or")}</div></div>
  <div class="row wrap" style="margin-top:12px"><input type="url" class="grow" id="refUrl" placeholder="https://… paste a link"><button class="btn" data-act="addRefUrl">${ic("plus")} Add link</button>
  ${S.library.references.length ? `<select id="refLib" style="width:auto"><option value="">Add from library…</option>${S.library.references.map((r, i) => `<option value="${i}">${esc(r.name || r.url || base(r.path))}</option>`).join("")}</select>` : ""}</div>`;
}
function paneBrand() {
  const b = S.library.brandKits.find((k) => k.id === P.brandKit.id) || {}; const bk = P.brandKit;
  return `<h2>Brand Kit</h2><p class="lead">Saved once in the Library, reused in every project.</p>
  <div class="col"><div class="field"><label>Kit</label><select data-bind="brandKit.id">${S.library.brandKits.map((k) => `<option value="${k.id}" ${k.id === bk.id ? "selected" : ""}>${esc(k.name)}</option>`).join("")}</select></div>
  ${b.colors ? `<div class="two"><div class="field"><label>Colours</label><div class="palette">${b.colors.map((c, i) => `<i style="background:${c}" title="${esc((b.colorNames || [])[i] || "")} ${c}"></i>`).join("")}</div></div><div class="field"><label>Fonts</label><div class="sm">${esc((b.fonts || []).join(" · "))}</div></div></div>` : ""}
  <div class="two"><div class="field"><label>Logo position</label><select data-bind="brandKit.logoPosition">${["top-left", "top-right", "bottom-left", "bottom-right", "center"].map((v) => `<option ${v === bk.logoPosition ? "selected" : ""}>${v}</option>`).join("")}</select></div>
  <div class="field"><label>Logo size (px): <span id="lsz">${bk.logoSize}</span></label><input type="range" min="60" max="260" step="4" data-bind="brandKit.logoSize" value="${bk.logoSize}" oninput="document.getElementById('lsz').textContent=this.value"></div></div>
  <div class="two">${[["watermark", "Watermark on every frame"], ["intro", "Intro"], ["outro", "Outro / end card"]].map(([k, l]) => `<label class="row sp neu-in" style="padding:12px 14px;cursor:pointer"><span>${l}</span><span class="sw"><input type="checkbox" data-bind="brandKit.${k}" ${bk[k] ? "checked" : ""}><span></span></span></label>`).join("")}</div></div>`;
}
function paneAssets() {
  return `<h2>Special Assets</h2><p class="lead">Stickers, B-roll and sound effects. Write where each one should be used.</p>
  <div class="list">${P.assets.map((a, i) => `<div class="item glass"><div class="ic">${ic("star")}</div><div class="grow"><div class="nm">${esc(base(a.path))}</div><div class="muted xs" style="text-transform:none;letter-spacing:0;word-break:break-all">${esc(a.path)}</div><div class="row" style="margin-top:8px"><select data-bind="assets.${i}.kind" style="width:130px">${["sticker", "broll", "sfx", "image", "other"].map((k) => `<option ${a.kind === k ? "selected" : ""}>${k}</option>`).join("")}</select><input type="text" class="grow" placeholder="Where to use it (e.g. scene 3, when the hero jumps)" value="${esc(a.use || "")}" data-bind="assets.${i}.use" style="margin:0"></div></div><button class="btn sm ghost danger" data-act="rm" data-list="assets" data-i="${i}">${ic("x")}</button></div>`).join("")}</div>
  <div style="margin-top:14px">${dropZone("assets", "Drag stickers / B-roll / SFX here, or")}</div>
  ${S.library.assets.length ? `<div class="row" style="margin-top:12px"><select id="assetLib"><option value="">Add from library…</option>${S.library.assets.map((a, i) => `<option value="${i}">${esc(base(a.path))} (${a.kind})</option>`).join("")}</select></div>` : ""}`;
}
function paneAudio() {
  const a = P.audio;
  const one = (k, label, filter) => `<div class="field"><label>${label}</label><div class="row"><input type="text" class="grow" readonly placeholder="No file" value="${esc(a[k])}"><button class="btn" data-act="pickAudio" data-k="${k}" data-filter="${filter}">Browse…</button>${a[k] ? `<button class="btn ghost sm danger" data-act="clearAudio" data-k="${k}">${ic("x")}</button>` : ""}</div>${a[k] ? `<div class="drop" style="padding:8px"></div>` : ""}</div>`;
  return `<h2>Audio</h2><p class="lead">The voiceover is the timing source of truth. Music is optional.</p>
  <div class="col">${one("voiceover", "Voiceover file", "Audio|*.mp3;*.wav;*.m4a;*.aac|All files|*.*").replace('<div class="drop" style="padding:8px"></div>', "")}
  ${one("music", "Background music", "Audio|*.mp3;*.wav;*.m4a;*.aac|All files|*.*").replace('<div class="drop" style="padding:8px"></div>', "")}
  <div class="field"><label>Music volume: <span id="mv">${Math.round(a.musicVolume * 100)}%</span></label><input type="range" min="0" max="1" step="0.01" data-bind="audio.musicVolume" value="${a.musicVolume}" oninput="document.getElementById('mv').textContent=Math.round(this.value*100)+'%'"></div>
  <label class="row sp neu-in" style="padding:12px 14px;cursor:pointer"><span>Duck music under the voice</span><span class="sw"><input type="checkbox" data-bind="audio.ducking" ${a.ducking ? "checked" : ""}><span></span></span></label></div>`;
}
function paneOutput() {
  const o = P.output;
  const presets = { reels: [1080, 1920, "9:16", 60], shorts: [1080, 1920, "9:16", 60], tiktok: [1080, 1920, "9:16", 60], youtube: [1920, 1080, "16:9", 30], square: [1080, 1080, "1:1", 30] };
  return `<h2>Output Settings</h2><p class="lead">Platform preset, length, resolution and captions.</p><div class="col">
  <div class="field"><label>Platform preset</label><div class="seg">${Object.keys(presets).map((k) => `<button class="${o.platform === k ? "on" : ""}" data-act="preset" data-k="${k}">${k[0].toUpperCase() + k.slice(1)}</button>`).join("")}</div></div>
  <div class="three"><div class="field"><label>Width</label><input type="number" data-bind="output.width" value="${o.width}"></div><div class="field"><label>Height</label><input type="number" data-bind="output.height" value="${o.height}"></div>
  <div class="field"><label>FPS</label><select data-bind="output.fps">${[24, 30, 60].map((v) => `<option ${+o.fps === v ? "selected" : ""}>${v}</option>`).join("")}</select></div></div>
  <div class="two"><div class="field"><label>Target length (optional)</label><input type="text" data-bind="output.duration" value="${esc(o.duration)}" placeholder="e.g. 90 s, or follows the voiceover"></div>
  <div class="field"><label>Caption style</label><select data-bind="output.captionStyle">${["bar", "karaoke", "minimal", "boxed"].map((v) => `<option ${o.captionStyle === v ? "selected" : ""}>${v}</option>`).join("")}</select></div></div>
  <label class="row sp neu-in" style="padding:12px 14px;cursor:pointer"><span>Captions (burned-in subtitles + .srt)</span><span class="sw"><input type="checkbox" data-bind="output.captions" ${o.captions ? "checked" : ""}><span></span></span></label></div>`;
}
function paneEngine() {
  const e = P.engine, g = S.settings; const e1 = S.env;
  const row = (k, label, opts, def) => `<div class="field"><label>${label}</label><select data-bind="engine.${k}">${opts.map(([v, l]) => `<option value="${v}" ${e[k] === v ? "selected" : ""}>${l}</option>`).join("")}</select></div>`;
  return `<h2>Engine &amp; Render</h2><p class="lead">Per-project overrides. "Use app default" follows Settings. ${e1.nvidia ? `Detected: <b>${esc(e1.nvidia.split(",")[0])}</b>.` : "No NVIDIA GPU detected."}</p><div class="col">
  <div class="two">${row("gpu", `GPU (default: ${g.gpu})`, [["", "Use app default"], ["nvidia", "NVIDIA RTX only"], ["auto", "Let Windows decide"], ["cpu", "CPU only (no GPU)"]])}
  ${row("quality", `Render quality (default: ${g.quality})`, [["", "Use app default"], ["draft", "Draft (fast check)"], ["standard", "Standard"], ["high", "High (slowest)"]])}</div>
  <div class="two">${row("model", `Claude model (default: ${g.model || "Claude Code default"})`, [["", "Use app default"], ["sonnet", "Sonnet"], ["opus", "Opus"], ["haiku", "Haiku (cheap, drafts)"]])}
  ${row("effort", `Thinking effort (default: ${g.effort || "default"})`, [["", "Use app default"], ["low", "Low"], ["medium", "Medium"], ["high", "High"], ["xhigh", "Extra high"]])}</div>
  <div class="field"><label>Storyboard approval gate (default: ${g.gate ? "on" : "off"})</label><select data-bind="engine.gate" data-type="tri"><option value="" ${e.gate == null ? "selected" : ""}>Use app default</option><option value="true" ${e.gate === true ? "selected" : ""}>On: stop at the storyboard and wait for my approval</option><option value="false" ${e.gate === false ? "selected" : ""}>Off: build straight to the final video</option></select></div>
  <div class="hint">One generation runs at a time so the GPU is not shared. While it runs the project is locked with a lock file, so it cannot be edited or started twice.</div></div>`;
}
function paneExtra() {
  return `<h2>Extra Instructions</h2><p class="lead">Anything else, in your own words (Bangla or English).</p><div class="field"><textarea data-bind="extra" rows="14" placeholder="যা খুশি বলুন…">${esc(P.extra)}</textarea></div>`;
}

// ---------- brief review ----------
async function review() {
  await saveNow();
  let ck; try { ck = await api(`/api/project/${P.id}/check`); } catch (e) { return toast(e.message, true); }
  const ef = { gate: P.engine.gate == null ? S.settings.gate : P.engine.gate };
  const groups = {}; ck.items.forEach((i) => (groups[i.group] ||= []).push(i));
  const hasSB = P.versions.some((v) => v.status === "storyboard-ready");
  $("#overlay").innerHTML = `<div class="modal" data-act="closeModal"><div class="box glass" data-stop><h2>Brief Review</h2><p class="muted sm">Check everything Claude will use before it starts.</p>
    ${ck.errors.map((e) => `<div class="warnbox e">✖ ${esc(e)}</div>`).join("")}${ck.warns.map((e) => `<div class="warnbox w">⚠ ${esc(e)}</div>`).join("")}
    <div style="margin:14px 0">${Object.entries(groups).map(([g, its]) => its.map((i, n) => `<div class="chk"><span class="${i.ok ? "ok-i" : "bad-i"}">${i.ok ? "✔" : "✖"}</span><span class="muted">${n === 0 ? g : ""}</span><span style="word-break:break-all">${esc(i.label)}</span></div>`).join("")).join("")}</div>
    <div class="row sp"><button class="btn ghost" data-act="closeModal">Back to editing</button><div class="row">${ef.gate && !hasSB ? '<span class="muted sm">Step 1 of 2: storyboard first</span>' : ""}<button class="btn pri" data-act="generate" data-kind="${ef.gate ? "storyboard" : "build"}" ${ck.ok ? "" : "disabled"}>${ic("bolt")} ${ef.gate ? "Generate storyboard" : "Generate reel"}</button></div></div></div></div>`;
}
async function startGenerate(kind, extra = {}) {
  try { const r = await api(`/api/project/${P.id}/generate`, "POST", { kind, ...extra }); $("#overlay").innerHTML = ""; sel = r.n; tab = kind === "revise" ? "log" : "preview"; go(`p/${P.id}/result`); }
  catch (e) { toast(e.message, true); }
}

// ---------- result ----------
function vSel() { return P.versions.find((v) => v.n === sel) || P.versions.filter((v) => v.file).slice(-1)[0] || P.versions.slice(-1)[0]; }
function viewResult() {
  const v = vSel(); sel = v?.n;
  const running = runInfo && runInfo.status === "running";
  $("#top").innerHTML = `<button class="btn sm ghost" data-act="go" data-to="p/${P.id}">← Composer</button><div class="grow"><h1>${esc(P.name)}</h1><div class="muted sm">${esc(styleOf(P.style.id)?.name || "")}${P.style.mode ? " · " + P.style.mode : ""} · ${P.versions.length} version${P.versions.length === 1 ? "" : "s"}</div></div>${running ? `<button class="btn danger" data-act="stop">Stop</button>` : ""}<span class="chip ${P.status}">${P.status}</span>`;
  const tabs = [["preview", "Preview"], ["log", "Log"], ["versions", "Versions"], ["revise", "Revise"], ["export", "Export"]];
  const sbReady = v && v.status === "storyboard-ready";
  $("#view").innerHTML = `<div class="result"><div class="player glass">${playerHTML(v, running)}</div><div class="glass pane" style="min-width:0"><div class="tabs seg" style="display:flex;width:max-content">${tabs.map(([k, l]) => `<button class="${tab === k ? "on o" : ""}" data-act="tab" data-k="${k}">${l}</button>`).join("")}</div><div id="tabbody"></div></div></div>`;
  tabBody(); bindAll();
  if (running) startPoll();
  void sbReady;
}
function playerHTML(v, running) {
  if (running) return `<div class="thumb" style="aspect-ratio:9/14"><div class="col" style="align-items:center;padding:22px;text-align:center"><div class="prog" style="width:80%"><i></i></div><b>Claude is working…</b><span class="muted sm" id="elapsed"></span></div></div>`;
  if (v?.file) return `<video id="vid" src="/media/p/${P.id}/${v.file}" controls playsinline preload="metadata" poster="${v.poster ? `/media/p/${P.id}/${v.poster}` : ""}"></video><div class="row sp"><span class="sm muted">v${v.n}</span><div class="row gap-s"><button class="btn sm" data-act="speed">1×</button><button class="btn sm" data-act="copyTime">Copy time</button></div></div>`;
  return `<div class="thumb" style="aspect-ratio:9/14">${v?.status === "storyboard-ready" ? "Storyboard ready" : v?.status === "failed" ? "Failed, see Log" : "No video yet"}</div>`;
}
async function tabBody() {
  const el = $("#tabbody"); const v = vSel();
  if (tab === "preview") {
    if (v?.status === "storyboard-ready") {
      el.innerHTML = `<h2>Storyboard ready</h2><p class="lead">Read it, then approve to build the video, or revise first by editing the brief and generating again.</p><pre class="neu-in" id="sbtext" style="white-space:pre-wrap;padding:16px;max-height:46vh;overflow:auto;font:13px/1.55 var(--font)">Loading…</pre>
      <div class="field" style="margin-top:12px"><label>Approval notes (optional)</label><textarea id="apprNote" rows="2" placeholder="e.g. make scene 4 shorter"></textarea></div><div class="row" style="margin-top:12px"><button class="btn pri" data-act="approve">${ic("bolt")} Approve &amp; build video</button><button class="btn ghost" data-act="go" data-to="p/${P.id}">Edit brief</button></div>`;
      api(`/api/project/${P.id}/storyboard`).then((r) => { const t = $("#sbtext"); if (t) t.textContent = r.text || "(storyboard file not found)"; });
      return;
    }
    if (!v) { el.innerHTML = '<p class="muted">Nothing generated yet.</p>'; return; }
    const t = v.tokens || {};
    el.innerHTML = `<h2>Version ${v.n} · ${esc(v.status)}</h2>
    <div class="kv" style="margin:14px 0"><div><span class="xs muted">Active time</span><b>${dur(v.activeMs)}</b></div><div><span class="xs muted">Output tokens</span><b>${num(t.output)}</b></div><div><span class="xs muted">Input / cache</span><b>${num(t.input)} / ${num((t.cacheRead || 0) + (t.cacheWrite || 0))}</b></div><div><span class="xs muted">Claude turns</span><b>${v.turns ?? "—"}</b></div><div><span class="xs muted">Cost (API est.)</span><b>${v.cost != null ? "$" + (+v.cost).toFixed(2) : "—"}</b></div><div><span class="xs muted">GPU · quality</span><b style="font-size:15px">${esc(v.gpu || "—")} · ${esc(v.quality || "—")}</b></div></div>
    ${v.notes ? `<div class="hint">${esc(v.notes)}</div>` : ""}
    <div class="row wrap" style="margin-top:16px">${v.file ? `<a class="btn" href="/media/p/${P.id}/${v.file}" download="${esc(P.name)}-v${v.n}.mp4">${ic("dl")} Download MP4</a><button class="btn" data-act="saveStyle">${ic("brush")} Save as Style…</button><button class="btn" data-act="reveal" data-path="${esc((S.settings.dataDir + "/projects/" + P.id + "/" + v.file).replace(/\//g, "\\"))}">${ic("folder")} Show file</button>` : ""}</div>`;
  } else if (tab === "log") {
    el.innerHTML = `<h2>Log</h2><p class="lead">What Claude did: tools it used, decisions it narrated, and any errors.</p><div class="log" id="logbox"></div>`;
    logSince = 0; await pullLog(true);
  } else if (tab === "versions") {
    const vs = P.versions;
    el.innerHTML = `<h2>Versions</h2><table class="t"><tr><th>v</th><th>Kind</th><th>Status</th><th>Time</th><th>Tokens out</th><th>Compare</th><th></th></tr>${vs.map((x) => `<tr><td><b>v${x.n}</b></td><td>${esc(x.kind)}</td><td>${esc(x.status)}</td><td>${dur(x.activeMs)}</td><td>${num(x.tokens?.output)}</td><td>${x.file ? `<label><input type="checkbox" data-cmp="${x.n}" ${cmp.includes(x.n) ? "checked" : ""}> pick</label>` : ""}</td><td><button class="btn sm ghost" data-act="selVer" data-n="${x.n}">Open</button> <button class="btn sm ghost danger" data-act="delVer" data-n="${x.n}">${ic("trash")}</button></td></tr>`).join("")}</table>
    <div id="cmpbox" style="margin-top:16px"></div>`;
    drawCmp();
  } else if (tab === "revise") {
    el.innerHTML = `<h2>Revise</h2><p class="lead">Targeted feedback only. Claude changes just what you list and keeps the rest, producing a new version.</p>
    <div class="list" id="fb">${(P._fb ||= [{ scene: "", time: "", text: "" }]).map((f, i) => `<div class="item glass" style="grid-template-columns:90px 110px 1fr auto"><input type="text" placeholder="Scene #" data-fb="${i}.scene" value="${esc(f.scene)}" style="margin:0"><div class="row gap-s"><input type="text" placeholder="0:00" data-fb="${i}.time" value="${esc(f.time)}" style="margin:0"><button class="btn sm ghost" data-act="stamp" data-i="${i}" title="Use current video time">⏱</button></div><input type="text" placeholder="What should change?" data-fb="${i}.text" value="${esc(f.text)}" style="margin:0"><button class="btn sm ghost danger" data-act="fbRm" data-i="${i}">${ic("x")}</button></div>`).join("")}</div>
    <div class="row" style="margin-top:12px"><button class="btn" data-act="fbAdd">${ic("plus")} Add feedback</button><button class="btn pri" data-act="revise" ${v?.file ? "" : "disabled"}>${ic("bolt")} Revise → new version</button></div>`;
  } else if (tab === "export") {
    el.innerHTML = `<h2>Export</h2><p class="lead">Copies the final MP4 with storyboard, brief and run summary into the export folder${S.settings.driveDir ? " and the Drive folder" : ""}.</p>
    <div class="kv"><div><span class="xs muted">Export folder</span><div class="sm" style="word-break:break-all;margin-top:4px">${esc(S.settings.exportDir)}</div></div><div><span class="xs muted">Drive folder</span><div class="sm" style="word-break:break-all;margin-top:4px">${esc(S.settings.driveDir || "not set (Settings)")}</div></div></div>
    <div class="row wrap" style="margin-top:16px"><button class="btn pri" data-act="export" ${v?.file ? "" : "disabled"}>${ic("dl")} Export v${v?.n ?? ""}</button><button class="btn" data-act="reveal" data-path="${esc(S.settings.exportDir)}">${ic("folder")} Open export folder</button>${v?.exported ? `<span class="muted sm">Last exported ${ago(v.exported.at)}</span>` : ""}</div>`;
  }
  bindAll();
}
function drawCmp() {
  const b = $("#cmpbox"); if (!b) return; const [a, c] = cmp;
  const va = P.versions.find((v) => v.n === a), vc = P.versions.find((v) => v.n === c);
  if (!va || !vc) { b.innerHTML = '<p class="muted sm">Pick two finished versions to play them side by side.</p>'; return; }
  b.innerHTML = `<div class="vs"><div><div class="lbl">v${va.n}</div><video id="va" src="/media/p/${P.id}/${va.file}" controls playsinline></video></div><div><div class="lbl">v${vc.n}</div><video id="vb" src="/media/p/${P.id}/${vc.file}" controls playsinline></video></div></div><div class="row" style="margin-top:10px"><button class="btn" data-act="playBoth">${ic("play")} Play both</button><button class="btn ghost" data-act="pauseBoth">Pause</button></div>`;
}
async function pullLog(reset) {
  try {
    const r = await api(`/api/project/${P.id}/run?since=${logSince}`); const box = $("#logbox");
    if (r.status === "idle" && reset && box) { box.innerHTML = '<div class="l raw"><span></span><span>No live run in this session. Older runs are stored as log-*.jsonl in the project folder.</span></div>'; }
    if (box) { for (const l of r.lines) { const d = document.createElement("div"); d.className = "l " + l.type; d.innerHTML = `<span class="muted">${new Date(l.t).toLocaleTimeString([], { hour12: false })}</span><span>${esc(l.text)}</span>`; box.appendChild(d); } box.scrollTop = box.scrollHeight; }
    logSince = r.total; const el = $("#elapsed"); if (el) el.textContent = dur(r.elapsed);
    return r;
  } catch { return null; }
}
function startPoll() {
  clearInterval(poll);
  poll = setInterval(async () => {
    const r = await pullLog(false); if (!r) return;
    if (r.status !== "running") { clearInterval(poll); poll = null; await loadProject(P.id); runInfo = { status: r.status }; renderRail(); viewResult(); toast(r.status === "finished" ? "Generation finished" : "Generation " + r.status, r.status === "failed"); }
  }, 1200);
}

// ---------- library ----------
function viewLibrary() {
  $("#top").innerHTML = `<div class="grow"><h1>Library</h1><div class="muted sm">Styles, brand kits, references and assets, shared by every project.</div></div>`;
  const tabs = [["styles", "Styles"], ["brandKits", "Brand Kits"], ["references", "References"], ["assets", "Assets"]];
  $("#view").innerHTML = `<div class="tabs seg" style="display:flex;width:max-content;margin-bottom:16px">${tabs.map(([k, l]) => `<button class="${libTab === k ? "on o" : ""}" data-act="libTab" data-k="${k}">${l}</button>`).join("")}</div><div id="libbody"></div>`;
  libBody();
}
function libBody() {
  const el = $("#libbody"); const L = S.library;
  if (libTab === "styles") {
    el.innerHTML = `<div class="toolbar"><button class="btn pri" data-act="editStyle" data-id="">${ic("plus")} New style from reference</button></div><div class="grid">${L.styles.map((s) => `<div class="card glass" data-act="editStyle" data-id="${s.id}"><div class="thumb">${s.thumb ? `<img src="${s.thumb}" alt="">` : ic("brush")}<span class="badge chip">${s.builtin ? "built-in" : "mine"}${s.mode ? " · " + s.mode : ""}</span></div><div class="t">${esc(s.name)}</div><div class="muted sm">${esc((s.desc || s.rules || "").slice(0, 120))}</div></div>`).join("")}</div>`;
  } else if (libTab === "brandKits") {
    el.innerHTML = `<div class="toolbar"><button class="btn pri" data-act="editKit" data-id="">${ic("plus")} New brand kit</button></div><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))">${L.brandKits.map((k) => `<div class="card glass" data-act="editKit" data-id="${k.id}"><div class="row"><b class="t grow">${esc(k.name)}</b><span class="chip">${k.builtin ? "built-in" : "mine"}</span></div><div class="palette">${(k.colors || []).map((c) => `<i style="background:${c}"></i>`).join("")}</div><div class="muted sm">${esc((k.fonts || []).join(" · "))}<br>Logo ${esc(k.logoPosition || "top-left")}, ${k.logoSize || 120}px</div></div>`).join("")}</div>`;
  } else {
    const k = libTab; const items = L[k];
    el.innerHTML = `<div class="toolbar"><button class="btn pri" data-act="libAdd" data-k="${k}">${ic("plus")} Add ${k === "references" ? "reference" : "asset"}…</button>${k === "references" ? `<input type="url" id="libUrl" placeholder="or paste a link" style="max-width:300px"><button class="btn" data-act="libAddUrl">Add link</button>` : ""}</div>
    <div class="list">${items.length ? items.map((r, i) => `<div class="item glass"><div class="ic">${ic(k === "references" ? "link" : "star")}</div><div class="grow"><div class="nm">${esc(r.name || r.url || base(r.path))}</div><div class="muted xs" style="text-transform:none;letter-spacing:0;word-break:break-all">${esc(r.url || r.path)}</div><input type="text" placeholder="${k === "references" ? "Note: what to take from it" : "Where to use it"}" value="${esc(r.note || r.use || "")}" data-libnote="${k}.${i}"></div><button class="btn sm ghost danger" data-act="libRm" data-k="${k}" data-i="${i}">${ic("x")}</button></div>`).join("") : '<p class="muted">Empty. Items you add here can be dropped into any project in one click.</p>'}</div>`;
  }
  bindAll();
}
const saveLib = async () => { S.library = await api("/api/library", "PUT", S.library); };
function modal(html) { $("#overlay").innerHTML = `<div class="modal" data-act="closeModal"><div class="box glass" data-stop>${html}</div></div>`; bindAll(); }
function editStyle(id) {
  const s = id ? { ...styleOf(id) } : { id: "", name: "", rules: "", refs: [], builtin: false };
  window._es = s;
  modal(`<h2>${id ? "Edit" : "New"} style</h2><p class="muted sm">${s.builtin ? "Built-in styles can be copied, not changed. Saving makes your own copy." : "A style is a name, a rule sheet and optional references."}</p>
  <div class="col" style="margin-top:12px"><div class="field"><label>Name</label><input type="text" id="esName" value="${esc(s.builtin ? s.name + " (mine)" : s.name)}"></div>
  <div class="field"><label>Rules / prompt</label><textarea id="esRules" rows="8" placeholder="Palette, type, motion, layout, do and don't…">${esc(s.rules || "")}</textarea></div>
  <div class="field"><label>Reference files (videos / images)</label><div id="esRefs" class="muted sm">${(s.refs || []).map((r) => esc(r.path || r.url)).join("<br>") || "none yet"}</div><div class="row"><button class="btn sm" data-act="esAddRef">Add reference…</button><button class="btn sm" data-act="esAnalyze">${ic("star")} Analyze with Claude</button></div><div class="muted xs" id="esAn" style="text-transform:none;letter-spacing:0"></div></div>
  <div class="row sp" style="margin-top:8px"><div>${!s.builtin && id ? `<button class="btn danger" data-act="esDelete">Delete</button>` : ""}</div><div class="row"><button class="btn ghost" data-act="closeModal">Cancel</button><button class="btn pri" data-act="esSave">Save style</button></div></div></div>`);
}
function editKit(id) {
  const k = id ? { ...S.library.brandKits.find((x) => x.id === id) } : { id: "", name: "", colors: [], fonts: [], logoPosition: "top-left", logoSize: 120, builtin: false };
  window._ek = k;
  modal(`<h2>${id ? "Edit" : "New"} brand kit</h2><div class="col" style="margin-top:12px">
  <div class="field"><label>Name</label><input type="text" id="ekName" value="${esc(k.builtin ? k.name + " (mine)" : k.name)}"></div>
  <div class="field"><label>Logo file</label><div class="row"><input type="text" id="ekLogo" class="grow" value="${esc(k.logo || "")}"><button class="btn" data-act="ekBrowse">Browse…</button></div></div>
  <div class="field"><label>Colours (comma separated hex)</label><input type="text" id="ekColors" value="${esc((k.colors || []).join(", "))}"></div>
  <div class="field"><label>Fonts (comma separated)</label><input type="text" id="ekFonts" value="${esc((k.fonts || []).join(", "))}"></div>
  <div class="two"><div class="field"><label>Logo position</label><select id="ekPos">${["top-left", "top-right", "bottom-left", "bottom-right", "center"].map((v) => `<option ${k.logoPosition === v ? "selected" : ""}>${v}</option>`).join("")}</select></div><div class="field"><label>Logo size px</label><input type="number" id="ekSize" value="${k.logoSize || 120}"></div></div>
  <div class="field"><label>Intro / outro description</label><input type="text" id="ekOutro" value="${esc(k.outro || "")}"></div>
  <div class="row sp"><div>${!k.builtin && id ? `<button class="btn danger" data-act="ekDelete">Delete</button>` : ""}</div><div class="row"><button class="btn ghost" data-act="closeModal">Cancel</button><button class="btn pri" data-act="ekSave">Save kit</button></div></div></div>`);
}

// ---------- settings + desk ----------
function viewDesk() { $("#top").innerHTML = `<div class="grow"><h1>Review Desk</h1><div class="muted sm">The earlier preview app: all episodes, run summary, style comparison.</div></div>`; $("#view").style.padding = "0"; $("#view").innerHTML = `<iframe class="desk" src="/preview/"></iframe>`; }
function viewGuide() { $("#top").innerHTML = `<div class="grow"><h1>Guide</h1><div class="muted sm">Install, features, how-to recipes and troubleshooting.</div></div><a class="btn" href="/download/installer">${ic("dl")} Download installer</a>`; $("#view").style.padding = "0"; $("#view").innerHTML = `<iframe class="desk" src="/guide.html"></iframe>`; }
function viewSettings() {
  $("#view").style.padding = ""; const g = S.settings, e = S.env;
  $("#top").innerHTML = `<div class="grow"><h1>Settings</h1><div class="muted sm">Defaults for every project. A project can override engine options in its Composer.</div></div>`;
  const sw = (k, l, d) => `<label class="row sp neu-in" style="padding:12px 14px;cursor:pointer"><span>${l}${d ? `<div class="muted sm">${d}</div>` : ""}</span><span class="sw"><input type="checkbox" data-root="s" data-bind="${k}" ${g[k] ? "checked" : ""}><span></span></span></label>`;
  const fld = (k, l, ph) => `<div class="field"><label>${l}</label><div class="row"><input type="text" class="grow" data-root="s" data-bind="${k}" value="${esc(g[k] || "")}" placeholder="${ph || ""}"><button class="btn" data-act="pickFolder" data-k="${k}">Browse…</button></div></div>`;
  $("#view").innerHTML = `<div class="two" style="align-items:start"><div class="glass pane col"><h2>Engine defaults</h2>
    <div class="field"><label>GPU</label><div class="seg" id="gpuSeg">${[["nvidia", "NVIDIA RTX"], ["auto", "Auto"], ["cpu", "CPU only"]].map(([v, l]) => `<button class="${g.gpu === v ? "on o" : ""}" data-act="setS" data-k="gpu" data-v="${v}">${l}</button>`).join("")}</div><div class="muted sm">${e.nvidia ? "Detected: " + esc(e.nvidia.split(",")[0]) : "No NVIDIA GPU detected on this PC."} NVIDIA = capture browser forced onto the RTX GPU + NVENC encoding.</div></div>
    <div class="two"><div class="field"><label>Render quality</label><select data-root="s" data-bind="quality">${["draft", "standard", "high"].map((v) => `<option ${g.quality === v ? "selected" : ""}>${v}</option>`).join("")}</select></div>
    <div class="field"><label>Claude model</label><select data-root="s" data-bind="model">${[["", "Claude Code default"], ["sonnet", "Sonnet"], ["opus", "Opus"], ["haiku", "Haiku"]].map(([v, l]) => `<option value="${v}" ${g.model === v ? "selected" : ""}>${l}</option>`).join("")}</select></div></div>
    <div class="two"><div class="field"><label>Thinking effort</label><select data-root="s" data-bind="effort">${[["", "Default"], ["low", "Low"], ["medium", "Medium"], ["high", "High"], ["xhigh", "Extra high"]].map(([v, l]) => `<option value="${v}" ${g.effort === v ? "selected" : ""}>${l}</option>`).join("")}</select></div>
    <div class="field"><label>Permission mode</label><select data-root="s" data-bind="permission"><option value="acceptEdits" ${g.permission === "acceptEdits" ? "selected" : ""}>Accept edits (safer)</option><option value="bypassPermissions" ${g.permission === "bypassPermissions" ? "selected" : ""}>Bypass all prompts (fully automatic)</option></select></div></div>
    <div class="field"><label>Max run time (minutes)</label><input type="number" data-root="s" data-bind="maxMinutes" value="${g.maxMinutes}"></div>
    ${sw("gate", "Storyboard approval gate", "Stop at the storyboard and wait for your approval before building.")}${sw("keepLogs", "Keep run logs", "Saved in each version folder.")}${sw("autoExport", "Export automatically when a video finishes")}</div>
  <div class="col"><div class="glass pane col"><h2>Folders</h2>${fld("dataDir", "Data folder (projects, library, settings)")}${fld("exportDir", "Export folder")}${fld("driveDir", "Google Drive folder (optional)", "e.g. G:\\My Drive\\Uddhar")}${fld("claudePath", "Claude Code CLI path (optional)", "auto-detected")}<button class="btn" data-act="reveal" data-path="${esc(g.dataDir)}">${ic("folder")} Open data folder</button></div>
  <div class="glass pane col"><h2>This PC</h2><div class="kv"><div><span class="xs muted">Claude Code</span><b style="font-size:14px">${esc(e.claudeVersion || (e.claude ? "found" : "missing"))}</b></div><div><span class="xs muted">Node</span><b style="font-size:14px">${esc(e.node)}</b></div><div><span class="xs muted">FFmpeg</span><b style="font-size:14px">${e.ffmpeg ? "found" : "missing"}</b></div><div><span class="xs muted">Git Bash</span><b style="font-size:14px">${e.bash ? "found" : "missing"}</b></div><div><span class="xs muted">Engine</span><b style="font-size:14px">${e.engineReady ? "ready" : "run npm install"}</b></div><div><span class="xs muted">App</span><b style="font-size:14px">v${esc(e.version)} · by Kajama Shahr</b></div></div>
  <div class="row wrap"><button class="btn" data-act="update">Check for updates</button><button class="btn danger" data-act="quit">Quit app</button></div><div class="muted sm" style="word-break:break-all">Engine folder: ${esc(e.engine)}</div></div></div></div>`;
}

// ---------- events ----------
function bindAll() {
  document.querySelectorAll("[data-bind]").forEach((el) => {
    if (el._b) return; el._b = 1;
    const h = () => {
      const root = el.dataset.root === "s" ? S.settings : P; if (!root) return;
      let v = el.type === "checkbox" ? el.checked : el.type === "number" || el.type === "range" ? +el.value : el.value;
      if (el.dataset.type === "tri") v = el.value === "" ? null : el.value === "true";
      setp(root, el.dataset.bind, v);
      if (root === S.settings) saveSettings(); else { dirty(); if (el.dataset.bind === "brandKit.id") { /* repaint */ renderPane(); } }
    };
    el.addEventListener("input", h); el.addEventListener("change", h);
  });
  document.querySelectorAll("[data-filter]").forEach((el) => { if (el._f) return; el._f = 1; el.addEventListener("input", () => { filter[el.dataset.filter] = el.value; const p = el.selectionStart; viewHome(); bindAll(); const n = document.querySelector('[data-filter="q"]'); if (el.dataset.filter === "q") { n.focus(); n.setSelectionRange(p, p); } }); });
  document.querySelectorAll("[data-drop]").forEach((z) => {
    if (z._d) return; z._d = 1;
    ["dragenter", "dragover"].forEach((ev) => z.addEventListener(ev, (e) => { e.preventDefault(); z.classList.add("over"); }));
    ["dragleave", "drop"].forEach((ev) => z.addEventListener(ev, (e) => { e.preventDefault(); z.classList.remove("over"); }));
    z.addEventListener("drop", async (e) => { const files = [...e.dataTransfer.files]; const paths = []; for (const f of files) { toast("Copying " + f.name + "…"); const r = await fetch(`/api/upload?project=${P.id}&name=${encodeURIComponent(f.name)}`, { method: "PUT", body: f }); const j = await r.json(); if (j.path) paths.push(j.path); } addPaths(z.dataset.drop, paths); });
  });
  document.querySelectorAll("[data-fb]").forEach((el) => { if (el._g) return; el._g = 1; el.addEventListener("input", () => { const [i, k] = el.dataset.fb.split("."); P._fb[+i][k] = el.value; }); });
  document.querySelectorAll("[data-cmp]").forEach((el) => { if (el._c) return; el._c = 1; el.addEventListener("change", () => { const n = +el.dataset.cmp; cmp = cmp.filter((x) => x !== n && x != null); if (el.checked) cmp.push(n); cmp = cmp.slice(-2); while (cmp.length < 2) cmp.push(null); tabBody(); }); });
  document.querySelectorAll("[data-libnote]").forEach((el) => { if (el._n) return; el._n = 1; el.addEventListener("change", async () => { const [k, i] = el.dataset.libnote.split("."); S.library[k][+i][k === "references" ? "note" : "use"] = el.value; await saveLib(); }); });
  const rl = $("#refLib"); if (rl && !rl._r) { rl._r = 1; rl.addEventListener("change", () => { if (rl.value === "") return; const r = S.library.references[+rl.value]; P.references.push({ ...r, id: Date.now() }); dirty(); renderPane(); }); }
  const al = $("#assetLib"); if (al && !al._r) { al._r = 1; al.addEventListener("change", () => { if (al.value === "") return; P.assets.push({ ...S.library.assets[+al.value] }); dirty(); renderPane(); }); }
}
function addPaths(list, paths, kind) {
  if (!paths.length) return;
  if (list === "content.files") P.content.files.push(...paths.map((p) => ({ path: p, kind: kind || kindOf(p), note: "" })));
  else if (list === "references") P.references.push(...paths.map((p) => ({ id: Date.now() + Math.random(), type: kindOf(p), path: p, note: "" })));
  else if (list === "assets") P.assets.push(...paths.map((p) => ({ path: p, kind: kindOf(p) === "audio" ? "sfx" : kindOf(p) === "video" ? "broll" : "sticker", use: "" })));
  dirty(); renderPane();
}
const act = {
  go: (t) => go(t.dataset.to),
  open: (t) => go("p/" + t.dataset.id),
  sec: (t) => { sec = t.dataset.k; renderPane(); },
  tab: (t) => { tab = t.dataset.k; document.querySelectorAll("[data-act=tab]").forEach((b) => b.classList.toggle("on", b.dataset.k === tab)); document.querySelectorAll("[data-act=tab]").forEach((b) => b.classList.toggle("o", b.dataset.k === tab)); tabBody(); if (tab === "log" && runInfo?.status === "running") startPoll(); },
  closeModal: () => { $("#overlay").innerHTML = ""; },
  newProject: () => modal(`<h2>New project</h2><div class="col" style="margin-top:12px"><div class="field"><label>Name</label><input type="text" id="npName" placeholder="e.g. EP03 Pigeonhole Principle" autofocus></div><div class="field"><label>Start from</label><select id="npFrom"><option value="">Blank project</option>${S.projects.map((p) => `<option value="${p.id}">Duplicate: ${esc(p.name)}</option>`).join("")}</select></div><div class="row sp"><button class="btn ghost" data-act="closeModal">Cancel</button><button class="btn pri" data-act="createProject">Create</button></div></div>`),
  createProject: async () => { const name = $("#npName").value.trim() || "Untitled reel"; const p = await api("/api/projects", "POST", { name, from: $("#npFrom").value || undefined }); $("#overlay").innerHTML = ""; sec = "content"; go("p/" + p.id); },
  dupProject: async (t, e) => { e.stopPropagation(); const src = S.projects.find((p) => p.id === t.dataset.id); const p = await api("/api/projects", "POST", { name: src.name + " (copy)", from: src.id }); toast("Duplicated"); go("p/" + p.id); },
  delProject: (t, e) => { e.stopPropagation(); const p = S.projects.find((x) => x.id === t.dataset.id); modal(`<h2>Delete “${esc(p.name)}”?</h2><p class="muted">It moves to a hidden trash folder inside the projects folder; nothing else is touched.</p><div class="row sp"><button class="btn ghost" data-act="closeModal">Cancel</button><button class="btn pri" data-act="confirmDel" data-id="${p.id}">Delete project</button></div>`); },
  confirmDel: async (t) => { await api("/api/project/" + t.dataset.id, "DELETE"); $("#overlay").innerHTML = ""; render(); },
  importEps: async () => { const r = await api("/api/importepisodes", "POST", {}); toast(`Imported ${r.imported} episodes`); render(); },
  toggleLock: async () => { P.locked = !P.locked; const { _fb, ...clean } = P; await api("/api/project/" + P.id, "PUT", clean); composerTop(); bindAll(); toast(P.locked ? "Project locked" : "Project unlocked"); },
  showBrief: async () => { const r = await api(`/api/project/${P.id}/brief`); modal(`<h2>Brief sent to Claude</h2><pre class="neu-in" style="white-space:pre-wrap;padding:14px;max-height:60vh;overflow:auto;font:12.5px/1.5 Consolas,monospace">${esc(r.text)}</pre><div class="row sp" style="margin-top:12px"><button class="btn" data-act="copyBrief">${ic("copy")} Copy</button><button class="btn ghost" data-act="closeModal">Close</button></div>`); window._brief = r.text; },
  copyBrief: () => navigator.clipboard.writeText(window._brief || "").then(() => toast("Copied")),
  review, generate: (t) => startGenerate(t.dataset.kind),
  approve: () => startGenerate("build", { approvalNote: ($("#apprNote")?.value || "").trim() }),
  stop: async () => { await api(`/api/project/${P.id}/stop`, "POST", {}); toast("Stopping…"); },
  pickStyle: (t) => { P.style.id = t.dataset.id; const s = styleOf(t.dataset.id); if (!s?.needsMode) P.style.mode = ""; else if (s.mode) P.style.mode = s.mode; dirty(); renderPane(); },
  pickMode: (t) => { P.style.mode = t.dataset.m; dirty(); renderPane(); },
  preset: (t) => { const m = { reels: [1080, 1920, "9:16", 60], shorts: [1080, 1920, "9:16", 60], tiktok: [1080, 1920, "9:16", 60], youtube: [1920, 1080, "16:9", 30], square: [1080, 1080, "1:1", 30] }[t.dataset.k]; Object.assign(P.output, { platform: t.dataset.k, width: m[0], height: m[1], aspect: m[2], fps: m[3] }); dirty(); renderPane(); },
  rm: (t) => { const l = t.dataset.list, i = +t.dataset.i; (getp(P, l)).splice(i, 1); dirty(); renderPane(); },
  reveal: (t) => api("/api/openpath", "POST", { path: t.dataset.path }).catch((e) => toast(e.message, true)),
  browse: async (t) => { const l = t.dataset.list; const f = l === "references" ? "Media|*.mp4;*.mov;*.mkv;*.webm;*.png;*.jpg;*.jpeg;*.gif|All files|*.*" : l === "assets" ? "Assets|*.png;*.jpg;*.svg;*.gif;*.mp4;*.mov;*.mp3;*.wav|All files|*.*" : "All files|*.*"; const r = await api("/api/browse", "POST", { kind: "file", multi: true, filter: f }); addPaths(l, r.paths); },
  browseFolder: async (t) => { const r = await api("/api/browse", "POST", { kind: "folder" }); addPaths(t.dataset.list, r.paths, "folder"); },
  addRefUrl: () => { const u = $("#refUrl").value.trim(); if (!/^https?:\/\//.test(u)) return toast("Enter a full link starting with https://", true); P.references.push({ id: Date.now(), type: "link", url: u, note: "" }); dirty(); renderPane(); },
  pickAudio: async (t) => { const r = await api("/api/browse", "POST", { kind: "file", multi: false, filter: t.dataset.filter }); if (r.paths[0]) { P.audio[t.dataset.k] = r.paths[0]; dirty(); renderPane(); } },
  clearAudio: (t) => { P.audio[t.dataset.k] = ""; dirty(); renderPane(); },
  speed: (t) => { const v = $("#vid"); const s = [1, 1.25, 1.5, 0.75]; const n = s[(s.indexOf(v.playbackRate) + 1) % s.length]; v.playbackRate = n; t.textContent = n + "×"; },
  copyTime: () => { const v = $("#vid"); const s = Math.floor(v.currentTime); const t = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; navigator.clipboard.writeText(t); toast("Copied " + t); },
  stamp: (t) => { const v = $("#vid"); if (!v) return toast("Select a finished version first", true); const s = Math.floor(v.currentTime); P._fb[+t.dataset.i].time = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; tabBody(); },
  fbAdd: () => { P._fb.push({ scene: "", time: "", text: "" }); tabBody(); },
  fbRm: (t) => { P._fb.splice(+t.dataset.i, 1); if (!P._fb.length) P._fb.push({ scene: "", time: "", text: "" }); tabBody(); },
  revise: () => { const fb = (P._fb || []).filter((f) => f.text.trim()); if (!fb.length) return toast("Write at least one change", true); startGenerate("revise", { feedback: fb }); },
  selVer: (t) => { sel = +t.dataset.n; tab = "preview"; viewResult(); },
  delVer: async (t) => { await api(`/api/project/${P.id}/versiondel`, "POST", { n: +t.dataset.n }); await loadProject(P.id); viewResult(); },
  playBoth: () => { const a = $("#va"), b = $("#vb"); a.currentTime = 0; b.currentTime = 0; a.play(); b.play(); },
  pauseBoth: () => { $("#va").pause(); $("#vb").pause(); },
  export: async () => { try { const r = await api(`/api/project/${P.id}/export`, "POST", { n: vSel().n }); toast("Exported to " + r.targets.join(" and ")); await loadProject(P.id); tabBody(); } catch (e) { toast(e.message, true); } },
  saveStyle: () => modal(`<h2>Save as Style</h2><p class="muted sm">Turns this finished video's look into a reusable style in your library.</p><div class="col" style="margin-top:12px"><div class="field"><label>Style name</label><input type="text" id="ssName" value="${esc(P.name)} look"></div><div class="field"><label>What defines this look? (rules)</label><textarea id="ssNotes" rows="5" placeholder="e.g. calm hero, cream cards, slow camera"></textarea></div><div class="row sp"><button class="btn ghost" data-act="closeModal">Cancel</button><button class="btn pri" data-act="doSaveStyle">Save style</button></div></div>`),
  doSaveStyle: async () => { await api(`/api/project/${P.id}/savestyle`, "POST", { n: sel, name: $("#ssName").value.trim() || "My style", notes: $("#ssNotes").value.trim() }); $("#overlay").innerHTML = ""; await refresh(); toast("Saved to Library → Styles"); },
  libTab: (t) => { libTab = t.dataset.k; viewLibrary(); bindAll(); },
  editStyle: (t) => editStyle(t.dataset.id),
  esAddRef: async () => { const r = await api("/api/browse", "POST", { kind: "file", multi: true, filter: "Media|*.mp4;*.mov;*.mkv;*.webm;*.png;*.jpg;*.jpeg|All files|*.*" }); window._es.refs = [...(window._es.refs || []), ...r.paths.map((p) => ({ type: kindOf(p), path: p, note: "" }))]; $("#esRefs").innerHTML = window._es.refs.map((r) => esc(r.path || r.url)).join("<br>"); },
  esAnalyze: async () => { const s = window._es; if (!(s.refs || []).length) return toast("Add a reference first", true); $("#esAn").textContent = "Claude is studying the reference… this can take a few minutes."; try { const r = await api("/api/analyzestyle", "POST", { refs: s.refs }); $("#esRules").value = r.text; $("#esAn").textContent = "Done. Review and edit the rules."; } catch (e) { $("#esAn").textContent = "Failed: " + e.message; } },
  esSave: async () => { const s = window._es; const name = $("#esName").value.trim(); if (!name) return toast("Name needed", true); const rules = $("#esRules").value; const lib = S.library.styles; if (s.builtin || !s.id) lib.push({ ...(s.builtin ? { ...s, builtin: false, thumbs: undefined } : {}), id: "my-" + Date.now().toString(36), name, rules, refs: s.refs || [], builtin: false }); else Object.assign(lib.find((x) => x.id === s.id), { name, rules, refs: s.refs || [] }); await saveLib(); $("#overlay").innerHTML = ""; libBody(); },
  esDelete: async () => { S.library.styles = S.library.styles.filter((x) => x.id !== window._es.id); await saveLib(); $("#overlay").innerHTML = ""; libBody(); },
  editKit: (t) => editKit(t.dataset.id),
  ekBrowse: async () => { const r = await api("/api/browse", "POST", { kind: "file", multi: false, filter: "Logo|*.svg;*.png|All files|*.*" }); if (r.paths[0]) $("#ekLogo").value = r.paths[0]; },
  ekSave: async () => { const k = window._ek; const name = $("#ekName").value.trim(); if (!name) return toast("Name needed", true); const nk = { id: k.builtin || !k.id ? "kit-" + Date.now().toString(36) : k.id, name, logo: $("#ekLogo").value, colors: $("#ekColors").value.split(",").map((s) => s.trim()).filter(Boolean), fonts: $("#ekFonts").value.split(",").map((s) => s.trim()).filter(Boolean), logoPosition: $("#ekPos").value, logoSize: +$("#ekSize").value || 120, outro: $("#ekOutro").value, builtin: false }; const i = S.library.brandKits.findIndex((x) => x.id === nk.id); if (i >= 0) S.library.brandKits[i] = nk; else S.library.brandKits.push(nk); await saveLib(); $("#overlay").innerHTML = ""; libBody(); },
  ekDelete: async () => { S.library.brandKits = S.library.brandKits.filter((x) => x.id !== window._ek.id); await saveLib(); $("#overlay").innerHTML = ""; libBody(); },
  libAdd: async (t) => { const k = t.dataset.k; const r = await api("/api/browse", "POST", { kind: "file", multi: true, filter: "All files|*.*" }); for (const p of r.paths) S.library[k].push(k === "references" ? { type: kindOf(p), path: p, note: "", name: base(p) } : { kind: kindOf(p) === "audio" ? "sfx" : "sticker", path: p, use: "" }); await saveLib(); libBody(); },
  libAddUrl: async () => { const u = $("#libUrl").value.trim(); if (!/^https?:\/\//.test(u)) return toast("Enter a full link", true); S.library.references.push({ type: "link", url: u, note: "", name: u }); await saveLib(); libBody(); },
  libRm: async (t) => { S.library[t.dataset.k].splice(+t.dataset.i, 1); await saveLib(); libBody(); },
  setS: (t) => { S.settings[t.dataset.k] = t.dataset.v; saveSettings(); viewSettings(); bindAll(); renderRail(); },
  pickFolder: async (t) => { const k = t.dataset.k; const r = await api("/api/browse", "POST", k === "claudePath" ? { kind: "file", filter: "Claude|claude.exe;claude.cmd|All files|*.*" } : { kind: "folder" }); if (r.paths[0]) { S.settings[k] = r.paths[0]; saveSettings(); viewSettings(); bindAll(); } },
  update: async () => { const r = await api("/api/update", "POST", {}); toast(r.message); },
  quit: async () => { await api("/api/quit", "POST", {}).catch(() => {}); document.body.innerHTML = '<div style="padding:40px;color:#FEEEE7;font:16px sans-serif">Claude Video Maker has stopped. You can close this window.</div>'; },
};
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-act]"); if (!t) return;
  if (t.classList.contains("modal") && e.target.closest("[data-stop]")) return; // click inside the dialog, not on the backdrop
  const f = act[t.dataset.act]; if (f) { Promise.resolve(f(t, e)).catch((er) => toast(er.message, true)); }
});
render();
