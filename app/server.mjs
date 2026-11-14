// Claude Video Maker v1 — local app server (zero dependencies, Node 18+).
// Binds to 127.0.0.1 only. Projects, library and settings live in a user data folder (default: Documents\Claude Video Maker).
// Generation = the Claude Code CLI (`claude -p`) running inside this repo (the "engine"), using the repo's styles, skills and HyperFrames pipeline.
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ENGINE = path.resolve(here, "..");
const E = (...p) => path.join(ENGINE, ...p);
const VERSION = "1.0.0";
const rd = (p, d = "") => { try { return fs.readFileSync(p, "utf8").replace(/^﻿/, ""); } catch { return d; } };
const rj = (p, d) => { try { return JSON.parse(rd(p)); } catch { return d; } };
const wj = (p, o) => { fs.mkdirSync(path.dirname(p), { recursive: true }); const t = p + ".tmp"; fs.writeFileSync(t, JSON.stringify(o, null, 2)); fs.renameSync(t, p); };
const uid = (n = 6) => crypto.randomBytes(n).toString("hex");
const slug = (s) => String(s || "reel").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 36) || "reel";

// ---------- settings + data dir ----------
const BOOT = path.join(process.env.APPDATA || os.homedir(), "ClaudeVideoMaker", "boot.json"); // only remembers dataDir
const DEFAULT_SETTINGS = {
  port: 4180, dataDir: "", exportDir: "", driveDir: "",
  gpu: "nvidia",            // nvidia | auto | cpu   (nvidia = force NVIDIA RTX for capture browser + NVENC)
  quality: "standard",      // draft | standard | high
  model: "", effort: "",    // empty = Claude Code defaults
  permission: "acceptEdits", // acceptEdits | bypassPermissions
  gate: true,               // stop at storyboard and wait for approval (repo rule)
  askMode: true,            // Animation Story: Light/Dark must be chosen per project
  claudePath: "", maxMinutes: 60, keepLogs: true, autoExport: false, language: "bn",
};
const bootCfg = rj(BOOT, {});
const defaultData = path.join(os.homedir(), "Documents", "Claude Video Maker");
let DATA = bootCfg.dataDir || process.env.CVM_DATA || defaultData;
const D = (...p) => path.join(DATA, ...p);
fs.mkdirSync(D("projects"), { recursive: true }); fs.mkdirSync(D("locks"), { recursive: true }); fs.mkdirSync(D("library", "thumbs"), { recursive: true });
let settings = { ...DEFAULT_SETTINGS, ...rj(D("settings.json"), {}) };
settings.dataDir = DATA;
if (!settings.exportDir) settings.exportDir = D("Exports");
const saveSettings = () => wj(D("settings.json"), settings);
saveSettings();
const PORT = +process.env.CVM_PORT || settings.port || 4180;
const ORIGIN = `http://127.0.0.1:${PORT}`;

// ---------- library ----------
const seed = rj(path.join(here, "seed", "library.json"), { styles: [], brandKits: [] });
function loadLibrary() {
  const lib = rj(D("library", "library.json"), { styles: [], brandKits: [], references: [], assets: [] });
  for (const k of ["styles", "brandKits", "references", "assets"]) lib[k] = lib[k] || [];
  for (const k of ["styles", "brandKits"]) for (const s of seed[k] || []) if (!lib[k].some((x) => x.id === s.id)) lib[k].unshift({ ...s, builtin: true });
  return lib;
}
const saveLibrary = (lib) => wj(D("library", "library.json"), lib);

// ---------- environment ----------
function which(cmd) { const r = spawnSync("where.exe", [cmd], { encoding: "utf8" }); return r.status === 0 ? r.stdout.split(/\r?\n/).filter(Boolean) : []; }
function envInfo() {
  const claudeList = settings.claudePath ? [settings.claudePath] : which("claude");
  const claude = claudeList.find((p) => /\.exe$/i.test(p)) || claudeList[0] || "";
  const nv = spawnSync("nvidia-smi", ["--query-gpu=name,driver_version,memory.total", "--format=csv,noheader"], { encoding: "utf8" });
  const ff = which("ffmpeg")[0] || "";
  const bash = which("bash")[0] || "";
  const ver = claude ? spawnSync(claude, ["--version"], { encoding: "utf8", shell: /\.(cmd|bat)$/i.test(claude) }).stdout?.trim() : "";
  return {
    version: VERSION, node: process.version, claude, claudeVersion: ver, ffmpeg: ff, bash,
    nvidia: nv.status === 0 ? nv.stdout.trim().split(/\r?\n/)[0] : "", engine: ENGINE,
    engineReady: fs.existsSync(E("node_modules", ".bin", "hyperframes")) && fs.existsSync(E("CLAUDE.md")),
    dataDir: DATA, platform: process.platform,
  };
}

// ---------- projects ----------
const PD = (id) => D("projects", id);
const safeId = (id) => /^[a-z0-9-]{4,60}$/.test(id || "") && fs.existsSync(PD(id));
function blankProject(name) {
  const id = slug(name).slice(0, 20) + "-" + uid(3);
  const now = new Date().toISOString();
  return {
    schema: 1, id, name: name || "Untitled reel", slug: "CVM-" + slug(name), createdAt: now, updatedAt: now, status: "draft", locked: false, tags: [],
    content: { script: "", storyline: "", files: [] },
    style: { id: "", mode: "", notes: "" },
    references: [], brandKit: { id: "uddhar", logoPosition: "top-left", logoSize: 120, watermark: false, intro: false, outro: true, endCard: true },
    assets: [], audio: { voiceover: "", music: "", musicVolume: 0.12, ducking: true },
    output: { platform: "reels", aspect: "9:16", width: 1080, height: 1920, fps: 60, duration: "", captions: true, captionStyle: "bar" },
    extra: "", engine: { gpu: "", quality: "", model: "", effort: "", gate: null }, versions: [], storyboardApproved: false,
  };
}
const loadProject = (id) => (safeId(id) ? rj(path.join(PD(id), "project.json"), null) : null);
function saveProject(p) { p.updatedAt = new Date().toISOString(); wj(path.join(PD(p.id), "project.json"), p); }
function summary(p) {
  const last = p.versions[p.versions.length - 1];
  const poster = [...p.versions].reverse().find((v) => v.poster);
  return { id: p.id, name: p.name, status: p.status, style: p.style?.id, mode: p.style?.mode, platform: p.output?.platform, updatedAt: p.updatedAt, createdAt: p.createdAt, versions: p.versions.length, locked: p.locked, tags: p.tags || [], poster: poster ? `/media/p/${p.id}/${poster.poster}` : "", lastNote: last?.status || "" };
}
const listProjects = () => fs.readdirSync(D("projects"), { withFileTypes: true }).filter((d) => d.isDirectory() && !d.name.startsWith(".")).map((d) => loadProject(d.name)).filter(Boolean).map(summary).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

// ---------- brief + prompts ----------
function effective(p) {
  const e = p.engine || {};
  return {
    gpu: e.gpu || settings.gpu, quality: e.quality || settings.quality, model: e.model || settings.model, effort: e.effort || settings.effort,
    gate: e.gate === null || e.gate === undefined ? settings.gate : e.gate, permission: settings.permission,
  };
}
function buildBrief(p, lib) {
  const st = lib.styles.find((s) => s.id === p.style.id);
  const bk = lib.brandKits.find((b) => b.id === p.brandKit.id);
  const ef = effective(p);
  const L = [];
  L.push(`# Brief: ${p.name}`, "", `Project id: ${p.id}  ·  episode folder to create: \`episodes/${p.slug}/\``, "");
  L.push("## Content", "");
  if (p.content.script.trim()) L.push("### Script (use as given, never rewrite silently)", "", p.content.script.trim(), "");
  if (p.content.storyline.trim()) L.push("### Storyline / scene direction", "", p.content.storyline.trim(), "");
  if (p.content.files.length) { L.push("### Content files", ""); for (const f of p.content.files) L.push(`- \`${f.path}\`${f.note ? ` — ${f.note}` : ""}`); L.push(""); }
  L.push("## Style", "", `- Style: **${st ? st.name : "(none chosen)"}**${st?.skill ? `  → skill \`${st.skill}\`` : ""}${st?.spec ? `, spec \`${st.spec}\`` : ""}`);
  if (st?.needsMode) L.push(`- Mode: **${p.style.mode || "NOT CHOSEN"}** (the user already answered the Light/Dark question in the app, do not ask again)`);
  if (st?.rules) L.push(`- Style rules: ${st.rules}`);
  if (p.style.notes) L.push(`- Project style notes: ${p.style.notes}`);
  L.push("");
  if (p.references.length) {
    L.push("## References (each note says what to take from it)", "");
    for (const r of p.references) L.push(`- ${r.type}: ${r.path || r.url}${r.note ? ` — **take:** ${r.note}` : ""}`);
    L.push("");
  }
  L.push("## Brand kit", "", `- Kit: ${bk ? bk.name : p.brandKit.id}; logo: ${bk?.logo || "brand/assets (official only, never redraw)"}; position **${p.brandKit.logoPosition}**, size ~${p.brandKit.logoSize}px`);
  if (bk) L.push(`- Colours: ${(bk.colors || []).join(", ")}; fonts: ${(bk.fonts || []).join(", ")}`);
  L.push(`- Watermark: ${p.brandKit.watermark ? "yes" : "no"}; intro: ${p.brandKit.intro ? "yes" : "no"}; outro/end card: ${p.brandKit.outro ? "yes" : "no"}`, "");
  if (p.assets.length) { L.push("## Special assets", ""); for (const a of p.assets) L.push(`- ${a.kind}: \`${a.path}\`${a.use ? ` — use: ${a.use}` : ""}`); L.push(""); }
  L.push("## Audio", "", `- Voiceover: ${p.audio.voiceover ? "`" + p.audio.voiceover + "` (timing source of truth)" : "none supplied"}`, `- Music: ${p.audio.music ? "`" + p.audio.music + "`" : "none"}${p.audio.music ? `, volume ${p.audio.musicVolume}, ducking under voice: ${p.audio.ducking ? "yes" : "no"}` : ""}`, "");
  const o = p.output;
  L.push("## Output", "", `- Platform ${o.platform}, ${o.aspect}, ${o.width}x${o.height}, ${o.fps} fps${o.duration ? `, target length ${o.duration}` : ""}`, `- Captions: ${o.captions ? `on (${o.captionStyle})` : "off"}`, "");
  if (p.extra.trim()) L.push("## Extra instructions", "", p.extra.trim(), "");
  L.push("## Engine settings chosen in the app", "", `- GPU: ${ef.gpu} (UDDHAR_GPU env is set; always render through \`bash tools/hf.sh render\`)`, `- Render quality: ${ef.quality}`);
  return L.join("\n");
}
function prompts(p, kind, v, extra) {
  const dir = path.join(PD(p.id), "versions", "v" + v.n);
  const rel = (f) => path.join(dir, f).replace(/\\/g, "/");
  const common = [
    `You are running inside the Uddhar reels engine (cwd = repo root). Read CLAUDE.md first and follow it, the style skill named in the brief, and the pipeline in series/PRODUCTION_PIPELINE.md.`,
    `This run is driven by the Claude Video Maker app and is non-interactive: do not ask questions. Every choice the user made is in the brief. If something blocking is missing, write it to ${rel("DONE.json")} as {"status":"blocked","reason":"..."} and stop.`,
    `The full brief is at: ${path.join(PD(p.id), "brief.md").replace(/\\/g, "/")} (read it completely).`,
    `Render only with \`bash tools/hf.sh render\` (it applies the GPU choice from the UDDHAR_GPU environment variable). Track the run with tools/run_summary.py like any episode.`,
  ];
  if (kind === "storyboard") return [...common, `PHASE 1 of 2: produce ONLY the storyboard and the plan (scenes, timing from the voiceover, assets used, open questions) in episodes/${p.slug}/storyboard/storyboard.md and a copy at ${rel("storyboard.md")}. Do not build or render. When done write ${rel("DONE.json")} as {"status":"storyboard","file":"storyboard.md"}.`].join("\n\n");
  if (kind === "build") return [...common, p.gate ? `PHASE 2 of 2: the user APPROVED the storyboard${extra ? " with these notes: " + extra : ""}. Build and render the final reel now, run the QA checks from the pipeline, and deliver.` : `Produce the whole reel end to end (storyboard, build, render, QA).`, `Copy the final MP4 to ${rel("final.mp4")} and a 1080x1920 poster frame is optional (the app makes one). When done write ${rel("DONE.json")} as {"status":"done","file":"final.mp4","notes":"one-paragraph summary: spec, QA result, open issues"}.`].join("\n\n");
  const prev = p.versions.filter((x) => x.file).slice(-1)[0];
  return [...common, `REVISION of version v${prev ? prev.n : "?"} (episode folder episodes/${p.slug}/ already exists with the sources). Change ONLY what the feedback below asks for; keep everything else identical, then re-render.`, "Feedback:", ...extra.map((f, i) => `${i + 1}. ${f.scene ? `[scene ${f.scene}] ` : ""}${f.time ? `[at ${f.time}] ` : ""}${f.text}`), `Copy the new final MP4 to ${rel("final.mp4")}. Then write ${rel("DONE.json")} as {"status":"done","file":"final.mp4","notes":"what changed"}.`].join("\n\n");
}

// ---------- runs (Claude Code CLI) ----------
const runs = new Map(); // projectId -> run state
const lockFile = (id) => D("locks", id + ".lock");
const alive = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };
function lockState(id) {
  const l = rj(lockFile(id), null);
  if (!l) return null;
  if (!alive(l.pid) || (l.pid === process.pid && !runs.get(id)?.proc)) { try { fs.unlinkSync(lockFile(id)); } catch {} return null; }
  return l;
}
function toolLine(b) {
  const i = b.input || {};
  const s = i.command || i.file_path || i.pattern || i.path || i.description || "";
  return `${b.name}${s ? ": " + String(s).replace(/\s+/g, " ").slice(0, 160) : ""}`;
}
function startRun(p, kind, extra) {
  if (lockState(p.id)) throw new Error("This project is locked by a running generation.");
  if ([...runs.values()].some((r) => r.status === "running")) throw new Error("Another generation is running. One at a time (GPU).");
  const info = envInfo();
  if (!info.claude) throw new Error("Claude Code CLI not found. Install it, or set its path in Settings.");
  const lib = loadLibrary();
  const ef = effective(p);
  fs.writeFileSync(path.join(PD(p.id), "brief.md"), buildBrief(p, lib));
  const n = kind === "build" && p.versions.length && p.versions[p.versions.length - 1].kind === "storyboard" && p.versions[p.versions.length - 1].status === "storyboard-ready" ? p.versions[p.versions.length - 1].n : (p.versions.at(-1)?.n || 0) + 1;
  let v = p.versions.find((x) => x.n === n);
  if (!v) { v = { n, kind, startedAt: new Date().toISOString(), status: "running" }; p.versions.push(v); }
  Object.assign(v, { kind: kind === "build" && v.kind === "storyboard" ? "build" : kind, status: "running", startedAt: v.startedAt || new Date().toISOString(), runStart: new Date().toISOString(), feedback: kind === "revise" ? extra : v.feedback });
  const vdir = path.join(PD(p.id), "versions", "v" + n);
  fs.mkdirSync(vdir, { recursive: true });
  try { fs.unlinkSync(path.join(vdir, "DONE.json")); } catch {}
  p.status = "generating"; p.gateOn = ef.gate; saveProject(p);
  const prompt = prompts({ ...p, gate: ef.gate }, kind, v, extra);
  const args = ["-p", "--output-format", "stream-json", "--verbose", "--permission-mode", ef.permission, "--allowedTools", "Bash", "Edit", "Write", "Read", "Glob", "Grep", "--add-dir", PD(p.id)];
  if (ef.model) args.push("--model", ef.model);
  if (ef.effort) args.push("--effort", ef.effort);
  const env = { ...process.env, UDDHAR_GPU: ef.gpu, CVM_QUALITY: ef.quality, CVM_PROJECT: p.id, HYPERFRAMES_NO_TELEMETRY: "1" };
  const proc = spawn(info.claude, args, { cwd: ENGINE, env, shell: /\.(cmd|bat)$/i.test(info.claude), windowsHide: true });
  const run = { projectId: p.id, n, kind, status: "running", proc, lines: [], started: Date.now(), result: null, stderr: "" };
  runs.set(p.id, run);
  wj(lockFile(p.id), { pid: process.pid, child: proc.pid, started: new Date().toISOString(), version: n, kind });
  const logPath = path.join(vdir, `log-${kind}.jsonl`);
  const push = (type, text, extra2) => { const e = { t: Date.now(), type, text, ...extra2 }; run.lines.push(e); if (run.lines.length > 4000) run.lines.splice(0, 500); if (settings.keepLogs) fs.appendFile(logPath, JSON.stringify(e) + "\n", () => {}); };
  push("info", `Started ${kind} · v${n} · GPU ${ef.gpu} · quality ${ef.quality} · model ${ef.model || "default"}`);
  let buf = "";
  proc.stdout.on("data", (c) => {
    buf += c; let i;
    while ((i = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
      if (!line) continue;
      let m; try { m = JSON.parse(line); } catch { push("raw", line.slice(0, 400)); continue; }
      if (m.type === "assistant") for (const b of m.message?.content || []) { if (b.type === "text" && b.text.trim()) push("say", b.text.trim()); else if (b.type === "tool_use") push("tool", toolLine(b)); }
      else if (m.type === "user") for (const b of m.message?.content || []) { if (b.type === "tool_result" && b.is_error) push("error", String(typeof b.content === "string" ? b.content : JSON.stringify(b.content)).slice(0, 300)); }
      else if (m.type === "result") { run.result = m; push(m.is_error ? "error" : "info", `Result: ${m.subtype}${m.is_error ? " (error)" : ""}`); }
    }
  });
  proc.stderr.on("data", (c) => { run.stderr += c; push("error", String(c).trim().slice(0, 300)); });
  const timer = setTimeout(() => { push("error", "Time limit reached, stopping."); try { spawnSync("taskkill", ["/pid", String(proc.pid), "/T", "/F"]); } catch {} }, (settings.maxMinutes || 60) * 60000);
  proc.on("close", (code) => {
    clearTimeout(timer);
    const q = loadProject(p.id); if (!q) return;
    const vv = q.versions.find((x) => x.n === n);
    const done = rj(path.join(vdir, "DONE.json"), null);
    const r = run.result;
    const u = r?.usage || {};
    vv.tokens = { input: u.input_tokens || 0, output: u.output_tokens || 0, cacheRead: u.cache_read_input_tokens || 0, cacheWrite: u.cache_creation_input_tokens || 0 };
    vv.cost = r?.total_cost_usd ?? null; vv.apiMs = r?.duration_api_ms ?? null; vv.turns = r?.num_turns ?? null;
    vv.activeMs = (vv.activeMs || 0) + (Date.now() - run.started);
    vv.endedAt = new Date().toISOString();
    vv.gpu = ef.gpu; vv.quality = ef.quality; vv.model = ef.model || "default";
    if (run.status === "stopped") { vv.status = "stopped"; q.status = q.versions.some((x) => x.file) ? "generated" : "draft"; }
    else if (done?.status === "storyboard") { vv.status = "storyboard-ready"; q.status = "draft"; push("info", "Storyboard ready for approval."); }
    else if (done?.status === "done" && fs.existsSync(path.join(vdir, done.file || "final.mp4"))) {
      vv.status = "generated"; vv.file = `versions/v${n}/${done.file || "final.mp4"}`; vv.notes = done.notes || ""; q.status = "generated";
      const poster = path.join(vdir, "poster.jpg");
      if (info.ffmpeg) { spawnSync(info.ffmpeg, ["-y", "-ss", "2", "-i", path.join(vdir, done.file || "final.mp4"), "-frames:v", "1", "-vf", "scale=360:-2", "-q:v", "4", poster], { stdio: "ignore" }); if (fs.existsSync(poster)) vv.poster = `versions/v${n}/poster.jpg`; }
    } else { vv.status = "failed"; vv.notes = done?.reason || (code ? `exit ${code}` : "no DONE.json written"); q.status = q.versions.some((x) => x.file) ? "generated" : "draft"; }
    run.status = vv.status === "failed" ? "failed" : run.status === "stopped" ? "stopped" : "finished";
    run.proc = null;
    push(vv.status === "failed" ? "error" : "info", `Finished: ${vv.status}${vv.notes ? " · " + vv.notes.slice(0, 200) : ""}`);
    saveProject(q); try { fs.unlinkSync(lockFile(p.id)); } catch {}
    if (vv.status === "generated" && settings.autoExport) { try { doExport(q, n); } catch {} }
  });
  proc.on("error", (e) => { push("error", String(e)); });
  proc.stdin.end(prompt);
  return { n };
}
function stopRun(id) {
  const r = runs.get(id);
  if (!r?.proc) return false;
  r.status = "stopped"; spawnSync("taskkill", ["/pid", String(r.proc.pid), "/T", "/F"], { stdio: "ignore" });
  return true;
}
function doExport(p, n) {
  const v = p.versions.find((x) => x.n === n && x.file); if (!v) throw new Error("No finished file for that version.");
  const src = path.join(PD(p.id), v.file);
  const targets = [path.join(settings.exportDir, slug(p.name) + "-v" + n)];
  if (settings.driveDir && fs.existsSync(settings.driveDir)) targets.push(path.join(settings.driveDir, slug(p.name) + "-v" + n));
  for (const t of targets) {
    fs.mkdirSync(t, { recursive: true });
    fs.copyFileSync(src, path.join(t, slug(p.name) + "-v" + n + ".mp4"));
    for (const f of ["storyboard.md", "brief.md"]) { const s = f === "brief.md" ? path.join(PD(p.id), f) : path.join(PD(p.id), "versions", "v" + n, f); if (fs.existsSync(s)) fs.copyFileSync(s, path.join(t, f)); }
    const ep = E("episodes", p.slug);
    for (const f of ["qa/run_summary.md", "subtitles.srt"]) { const s = path.join(ep, f); if (fs.existsSync(s)) fs.copyFileSync(s, path.join(t, path.basename(f))); }
  }
  v.exported = { at: new Date().toISOString(), to: targets }; p.status = "exported"; saveProject(p);
  return targets;
}

// ---------- native dialogs / opening ----------
function browse(kind, multi, filter) {
  const ps = kind === "folder"
    ? `Add-Type -AssemblyName System.Windows.Forms; $d=New-Object System.Windows.Forms.FolderBrowserDialog; $f=New-Object System.Windows.Forms.Form; $f.TopMost=$true; if($d.ShowDialog($f) -eq 'OK'){ $d.SelectedPath }`
    : `Add-Type -AssemblyName System.Windows.Forms; $d=New-Object System.Windows.Forms.OpenFileDialog; $d.Multiselect=${multi ? "$true" : "$false"}; $d.Filter='${filter || "All files|*.*"}'; $f=New-Object System.Windows.Forms.Form; $f.TopMost=$true; if($d.ShowDialog($f) -eq 'OK'){ $d.FileNames }`;
  const r = spawnSync("powershell.exe", ["-NoProfile", "-STA", "-EncodedCommand", Buffer.from(ps, "utf16le").toString("base64")], { encoding: "utf8" });
  return (r.stdout || "").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
}
const openPath = (p) => spawn("explorer.exe", [p], { detached: true, stdio: "ignore" }).unref();
const openUrl = (u) => spawn("cmd", ["/c", "start", "", u], { detached: true, stdio: "ignore" }).unref();
function openWindow() {
  for (const exe of ["msedge", "chrome"]) { const r = spawnSync("cmd", ["/c", "start", "", exe, `--app=${ORIGIN}/`, "--window-size=1320,900", `--user-data-dir=${path.join(DATA, ".window")}`], { stdio: "ignore" }); if (r.status === 0) return; }
  openUrl(ORIGIN + "/");
}

// ---------- checks (Brief Review) ----------
function check(p) {
  const lib = loadLibrary(), info = envInfo(), ef = effective(p);
  const errors = [], warns = [], items = [];
  const st = lib.styles.find((s) => s.id === p.style.id);
  const ex = (f) => { try { return fs.existsSync(f); } catch { return false; } };
  const item = (group, label, ok, detail) => items.push({ group, label, ok, detail });
  if (!p.content.script.trim() && !p.content.storyline.trim() && !p.content.files.length) errors.push("Content is empty: add a script, a storyline or files.");
  if (!st) errors.push("No style chosen."); else if (st.needsMode && !p.style.mode) errors.push(`${st.name} needs a mode: choose Light or Dark.`);
  item("Style", st ? st.name + (p.style.mode ? ` · ${p.style.mode}` : "") : "—", !!st && (!st.needsMode || !!p.style.mode));
  for (const f of p.content.files) { const ok = ex(f.path); item("Content", f.path, ok); if (!ok) errors.push(`Content file missing or moved: ${f.path}`); }
  for (const r of p.references) { if (r.path) { const ok = ex(r.path); item("Reference", r.path + (r.note ? ` — ${r.note}` : ""), ok); if (!ok) warns.push(`Reference file missing: ${r.path}`); if (!r.note) warns.push(`Reference without a note: ${path.basename(r.path)} (the note tells Claude what to take)`); } else if (r.url) { item("Reference", r.url + (r.note ? ` — ${r.note}` : ""), true); if (!r.note) warns.push(`Reference without a note: ${r.url}`); } }
  for (const a of p.assets) { const ok = ex(a.path); item("Asset", `${a.kind}: ${a.path}`, ok); if (!ok) warns.push(`Asset missing: ${a.path}`); if (!a.use) warns.push(`Asset has no "where to use" note: ${path.basename(a.path)}`); }
  if (p.audio.voiceover) { const ok = ex(p.audio.voiceover); item("Audio", "Voiceover " + p.audio.voiceover, ok); if (!ok) errors.push("Voiceover file missing: " + p.audio.voiceover); } else warns.push("No voiceover: the reel will have no narration timing (captions only).");
  if (p.audio.music) { const ok = ex(p.audio.music); item("Audio", "Music " + p.audio.music, ok); if (!ok) warns.push("Music file missing: " + p.audio.music); }
  item("Output", `${p.output.platform} · ${p.output.width}x${p.output.height} · ${p.output.fps}fps · captions ${p.output.captions ? "on" : "off"}`, true);
  item("Engine", `GPU ${ef.gpu}${ef.gpu === "nvidia" ? (info.nvidia ? " · " + info.nvidia.split(",")[0] : " · NVIDIA NOT FOUND") : ""} · quality ${ef.quality} · model ${ef.model || "default"} · storyboard gate ${ef.gate ? "on" : "off"}`, ef.gpu !== "nvidia" || !!info.nvidia);
  if (ef.gpu === "nvidia" && !info.nvidia) warns.push("GPU is set to NVIDIA but nvidia-smi found no NVIDIA GPU. Rendering will fall back to what Windows picks.");
  if (!info.claude) errors.push("Claude Code CLI not found (Settings → Claude path).");
  if (!info.engineReady) errors.push("Engine not ready: run `npm install` in the engine folder (" + ENGINE + ").");
  if (!info.bash) warns.push("bash (Git for Windows) not found: the render script tools/hf.sh needs it.");
  if (lockState(p.id)) errors.push("This project is locked by a running generation.");
  if (p.locked) errors.push("Project is locked (unlock it on the dashboard or in the Composer header).");
  return { ok: !errors.length, errors, warns, items };
}

// ---------- http ----------
const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon", ".woff2": "font/woff2", ".mp4": "video/mp4", ".md": "text/plain; charset=utf-8" };
const TOKEN = uid(16);
const send = (res, code, obj) => { res.writeHead(code, { "content-type": "application/json" }); res.end(JSON.stringify(obj)); };
function body(req, limit = 4e6) { return new Promise((ok, no) => { let b = ""; req.on("data", (c) => { b += c; if (b.length > limit) { no(new Error("too big")); req.destroy(); } }); req.on("end", () => { try { ok(b ? JSON.parse(b) : {}); } catch (e) { no(e); } }); }); }
function serveFile(req, res, file, extra = {}) {
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end("Not found"); }
  const st = fs.statSync(file), type = MIME[path.extname(file).toLowerCase()] || "application/octet-stream";
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.range || "");
  if (m) { const a = m[1] ? +m[1] : 0, b = m[2] ? +m[2] : st.size - 1; res.writeHead(206, { "content-type": type, "content-range": `bytes ${a}-${b}/${st.size}`, "accept-ranges": "bytes", "content-length": b - a + 1, ...extra }); fs.createReadStream(file, { start: a, end: b }).pipe(res); }
  else { res.writeHead(200, { "content-type": type, "content-length": st.size, "accept-ranges": "bytes", "cache-control": "no-cache", ...extra }); fs.createReadStream(file).pipe(res); }
}
const inside = (base, f) => { const r = path.relative(base, f); return r && !r.startsWith("..") && !path.isAbsolute(r); };

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, ORIGIN);
  const host = req.headers.host || "";
  if (host !== `127.0.0.1:${PORT}` && host !== `localhost:${PORT}`) { res.writeHead(403); return res.end("Forbidden"); }
  const cookieOk = (req.headers.cookie || "").includes("cvm=" + TOKEN);
  const isApi = u.pathname.startsWith("/api/") || u.pathname.startsWith("/media/") || u.pathname.startsWith("/download/");
  if (isApi && !cookieOk) { res.writeHead(401); return res.end("Open the app from its desktop shortcut."); }
  if (req.method !== "GET" && req.headers.origin && req.headers.origin !== ORIGIN) { res.writeHead(403); return res.end("Bad origin"); }
  const P = u.pathname;
  try {
    // ---- static app ----
    if (!isApi) {
      if (P === "/preview" || P.startsWith("/preview/")) { // legacy Review Desk (the earlier preview app)
        const rel = decodeURIComponent(P === "/preview" || P === "/preview/" ? "/index.html" : P.slice(8));
        const f = path.normalize(path.join(E("preview"), rel));
        if (!inside(E("preview"), f) || f.includes(path.join("preview", "app"))) { res.writeHead(404); return res.end("Not found"); }
        return serveFile(req, res, f);
      }
      const rel = decodeURIComponent(P === "/" ? "/index.html" : P);
      const f = path.normalize(path.join(here, "public", rel));
      if (!inside(path.join(here, "public"), f)) { res.writeHead(404); return res.end("Not found"); }
      const hdr = P === "/" ? { "set-cookie": `cvm=${TOKEN}; HttpOnly; SameSite=Strict; Path=/` } : {};
      return serveFile(req, res, f, hdr);
    }
    // ---- media ----
    if (P.startsWith("/media/p/")) { const [, , , id, ...rest] = P.split("/"); if (!safeId(id)) { res.writeHead(404); return res.end(); } const f = path.normalize(path.join(PD(id), ...rest.map(decodeURIComponent))); if (!inside(PD(id), f)) { res.writeHead(404); return res.end(); } return serveFile(req, res, f); }
    if (P.startsWith("/media/lib/")) { const f = path.normalize(path.join(D("library", "thumbs"), decodeURIComponent(P.slice(11)))); if (!inside(D("library", "thumbs"), f)) { res.writeHead(404); return res.end(); } return serveFile(req, res, f); }
    // ---- legacy Review Desk endpoints ----
    if (P === "/api/ping") return send(res, 200, { app: true, root: ENGINE });
    if (P === "/api/update" && req.method === "POST") {
      const git = (...a) => spawnSync("git", a, { cwd: ENGINE, encoding: "utf8" });
      const before = git("rev-parse", "HEAD").stdout, pull = git("pull", "--ff-only"), after = git("rev-parse", "HEAD").stdout;
      spawnSync(process.execPath, [E("tools/build_preview.mjs")], { cwd: ENGINE });
      return send(res, 200, { message: pull.status === 0 ? (before === after ? "Already up to date." : "Updated from GitHub. Restart the app to load new code.") : "Could not pull: " + (pull.stderr || "").trim().split("\n")[0], changed: before !== after });
    }
    if (P === "/api/open" && req.method === "POST") { // legacy desk: open episode/deliverables folders
      const b = await body(req); const cfg = { ...rj(E("preview/config.json"), {}), ...rj(E("preview/config.local.json"), {}) };
      const del = cfg.deliverablesDir || path.join(path.dirname(ENGINE), "Deliverables");
      const data = rj(E("preview/data.json"), { episodes: [] }); const e = data.episodes.find((x) => x.id === b.id);
      if (b.target === "episode" && e) { const q = path.join(del, e.deliverables || e.folder); openPath(fs.existsSync(q) ? q : E("episodes", e.folder)); return send(res, 200, { message: "Opened " + q }); }
      if (b.target === "deliverables") { fs.mkdirSync(del, { recursive: true }); openPath(del); return send(res, 200, { message: "Opened " + del }); }
      if (b.target === "drivelocal") { if (cfg.driveLocalDir && fs.existsSync(cfg.driveLocalDir)) { openPath(cfg.driveLocalDir); return send(res, 200, { message: "Opened " + cfg.driveLocalDir }); } openUrl(cfg.driveUrl); return send(res, 200, { message: "Opened Drive in the browser." }); }
      return send(res, 400, { message: "Unknown target" });
    }
    if (P.startsWith("/download/")) {
      const cfg = { ...rj(E("preview/config.json"), {}), ...rj(E("preview/config.local.json"), {}) };
      const del = cfg.deliverablesDir || path.join(path.dirname(ENGINE), "Deliverables");
      const data = rj(E("preview/data.json"), { episodes: [] }); const e = data.episodes.find((x) => x.id === P.split("/")[2]); const kind = u.searchParams.get("kind") || "final";
      let f = ""; if (e) { if (kind === "preview") f = E("preview/media", e.id + ".mp4"); else { const dir = path.join(del, e.deliverables || e.folder); if (fs.existsSync(dir)) { const m = fs.readdirSync(dir).find((x) => /final\.mp4$/i.test(x)); if (m) f = path.join(dir, m); } if (!f) f = E("episodes", e.folder, "renders", "final.mp4"); } }
      if (!f || !fs.existsSync(f)) { res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }); return res.end("File not found on this PC."); }
      return serveFile(req, res, f, { "content-disposition": `attachment; filename="${path.basename(f)}"` });
    }
    // ---- app API ----
    if (P === "/api/state") return send(res, 200, { settings, library: loadLibrary(), projects: listProjects(), env: envInfo(), running: [...runs.values()].filter((r) => r.status === "running").map((r) => r.projectId) });
    if (P === "/api/settings" && req.method === "PUT") {
      const b = await body(req); const old = DATA;
      for (const k of Object.keys(DEFAULT_SETTINGS)) if (k in b && k !== "port") settings[k] = b[k];
      if (b.dataDir && b.dataDir !== old) { fs.mkdirSync(b.dataDir, { recursive: true }); wj(BOOT, { dataDir: b.dataDir }); settings.dataDir = old; }
      saveSettings(); return send(res, 200, { settings, restart: !!(b.dataDir && b.dataDir !== old) });
    }
    if (P === "/api/library" && req.method === "PUT") { const b = await body(req, 2e7); const lib = loadLibrary(); for (const k of ["styles", "brandKits", "references", "assets"]) if (Array.isArray(b[k])) lib[k] = b[k]; saveLibrary(lib); return send(res, 200, loadLibrary()); }
    if (P === "/api/projects" && req.method === "POST") {
      const b = await body(req); let p = blankProject(b.name);
      if (b.from) { const src = loadProject(b.from); if (src) { p = { ...JSON.parse(JSON.stringify(src)), id: p.id, name: (b.name || src.name + " (copy)"), slug: "CVM-" + slug(b.name || src.name + "-copy") + "-" + uid(2), createdAt: p.createdAt, updatedAt: p.createdAt, status: "draft", locked: false, versions: [], storyboardApproved: false }; } }
      fs.mkdirSync(PD(p.id), { recursive: true }); saveProject(p); return send(res, 200, p);
    }
    let m;
    if ((m = /^\/api\/project\/([a-z0-9-]+)(?:\/(\w+))?$/.exec(P))) {
      const id = m[1], act = m[2]; if (!safeId(id)) return send(res, 404, { message: "No such project" });
      let p = loadProject(id);
      if (!act && req.method === "GET") return send(res, 200, { project: p, lock: lockState(id), run: runs.get(id) ? { status: runs.get(id).status, n: runs.get(id).n, kind: runs.get(id).kind } : null });
      if (!act && req.method === "PUT") { const b = await body(req, 2e7); if (p.locked && !("locked" in b && !b.locked)) return send(res, 409, { message: "Project is locked." }); const keep = { id: p.id, createdAt: p.createdAt, versions: p.versions, status: p.status }; p = { ...b, ...keep }; saveProject(p); return send(res, 200, { ok: true, updatedAt: p.updatedAt }); }
      if (!act && req.method === "DELETE") { fs.renameSync(PD(id), D("projects", ".trash-" + id + "-" + Date.now())); return send(res, 200, { ok: true }); }
      if (act === "check") return send(res, 200, check(p));
      if (act === "brief") return send(res, 200, { text: buildBrief(p, loadLibrary()) });
      if (act === "generate" && req.method === "POST") {
        const b = await body(req); const ck = check(p); if (!ck.ok && b.kind !== "revise") return send(res, 400, { message: ck.errors[0], check: ck });
        if (b.kind === "build" && b.approvalNote !== undefined) { p.storyboardApproved = true; saveProject(p); }
        try { return send(res, 200, startRun(loadProject(id), b.kind, b.kind === "revise" ? b.feedback : b.approvalNote || "")); } catch (e) { return send(res, 409, { message: String(e.message || e) }); }
      }
      if (act === "stop") return send(res, 200, { stopped: stopRun(id) });
      if (act === "run") {
        const r = runs.get(id); const since = +u.searchParams.get("since") || 0; const disk = r ? null : null; void disk;
        if (!r) return send(res, 200, { status: "idle", lines: [], total: 0 });
        return send(res, 200, { status: r.status, kind: r.kind, n: r.n, total: r.lines.length, lines: r.lines.slice(since), elapsed: Date.now() - r.started });
      }
      if (act === "storyboard") { const v = [...p.versions].reverse().find((x) => x.kind === "storyboard" || x.status === "storyboard-ready" || x.kind === "build"); const f = v && path.join(PD(id), "versions", "v" + v.n, "storyboard.md"); const alt = E("episodes", p.slug, "storyboard", "storyboard.md"); return send(res, 200, { text: rd(f && fs.existsSync(f) ? f : alt) }); }
      if (act === "export") { const b = await body(req); try { const t = doExport(p, b.n); return send(res, 200, { targets: t }); } catch (e) { return send(res, 400, { message: String(e.message) }); } }
      if (act === "versiondel" && req.method === "POST") { const b = await body(req); p.versions = p.versions.filter((v) => v.n !== b.n); saveProject(p); return send(res, 200, { ok: true }); }
      if (act === "savestyle" && req.method === "POST") {
        const b = await body(req); const v = p.versions.find((x) => x.n === b.n); const lib = loadLibrary(); const st0 = lib.styles.find((s) => s.id === p.style.id);
        const sid = "my-" + slug(b.name) + "-" + uid(2); let thumb = "";
        if (v?.poster) { fs.copyFileSync(path.join(PD(id), v.poster), D("library", "thumbs", sid + ".jpg")); thumb = `/media/lib/${sid}.jpg`; }
        lib.styles.push({ id: sid, name: b.name, builtin: false, base: p.style.id, skill: st0?.skill || "", spec: st0?.spec || "", needsMode: !!st0?.needsMode, mode: p.style.mode, rules: [b.notes, st0?.rules, p.style.notes].filter(Boolean).join(" | "), refs: p.references.map((r) => ({ ...r })), thumb, from: { project: p.id, version: b.n }, createdAt: new Date().toISOString() });
        saveLibrary(lib); return send(res, 200, { id: sid });
      }
      return send(res, 404, { message: "Unknown action" });
    }
    if (P === "/api/browse" && req.method === "POST") { const b = await body(req); return send(res, 200, { paths: browse(b.kind, b.multi, b.filter) }); }
    if (P === "/api/upload" && req.method === "PUT") {
      const id = u.searchParams.get("project"), name = path.basename(u.searchParams.get("name") || "file"); if (!safeId(id)) return send(res, 404, { message: "No project" });
      const dir = path.join(PD(id), "uploads"); fs.mkdirSync(dir, { recursive: true }); const dest = path.join(dir, Date.now().toString(36) + "-" + name);
      const ws = fs.createWriteStream(dest); req.pipe(ws); ws.on("finish", () => send(res, 200, { path: dest })); return;
    }
    if (P === "/api/openpath" && req.method === "POST") { const b = await body(req); const t = b.path; if (!t || !fs.existsSync(t)) return send(res, 404, { message: "Path not found" }); const st = fs.statSync(t); if (st.isDirectory()) openPath(t); else spawn("explorer.exe", ["/select,", t], { detached: true, stdio: "ignore" }).unref(); return send(res, 200, { ok: true }); }
    if (P === "/api/openurl" && req.method === "POST") { const b = await body(req); if (/^https?:\/\//.test(b.url)) openUrl(b.url); return send(res, 200, { ok: true }); }
    if (P === "/api/importepisodes" && req.method === "POST") {
      const eps = rj(E("preview/episodes.json"), []); const cfg = { ...rj(E("preview/config.json"), {}) }; void cfg; let n = 0;
      for (const e of eps) {
        const has = listProjects().some((p) => p.name === e.title); if (has) continue;
        const p = blankProject(e.title); p.slug = e.folder; p.style.id = /whiteboard/i.test(e.style) ? "whiteboard" : "animation-story"; p.style.mode = /dark/i.test(e.style) ? "dark" : /light/i.test(e.style) ? "light" : "";
        p.status = "exported"; p.tags = [e.code]; p.extra = (e.notes || []).join("\n"); p.content.storyline = e.topic || "";
        fs.mkdirSync(path.join(PD(p.id), "versions", "v1"), { recursive: true });
        const mp4 = E("preview/media", e.id + ".mp4"), jpg = E("preview/media", e.id + ".jpg");
        if (fs.existsSync(mp4)) fs.copyFileSync(mp4, path.join(PD(p.id), "versions", "v1", "final.mp4"));
        if (fs.existsSync(jpg)) fs.copyFileSync(jpg, path.join(PD(p.id), "versions", "v1", "poster.jpg"));
        p.versions.push({ n: 1, kind: "build", status: "generated", file: "versions/v1/final.mp4", poster: "versions/v1/poster.jpg", startedAt: e.rendered, notes: "Imported preview copy (540x960). Full-quality master is in Deliverables.", imported: true });
        saveProject(p); n++;
      }
      return send(res, 200, { imported: n });
    }
    if (P === "/api/analyzestyle" && req.method === "POST") {
      const b = await body(req); const info = envInfo(); if (!info.claude) return send(res, 400, { message: "Claude Code CLI not found." });
      const files = (b.refs || []).map((r) => r.path || r.url).filter(Boolean);
      const prompt = `Use the style-sampling approach in .claude/skills/style-sampling to study these reference files (for videos extract frames with ffmpeg into a temp folder under ${os.tmpdir().split(path.sep).join("/")} and look at them):
${files.map((f) => "- " + f).join("\n")}

Then write a concise style rule sheet (max 250 words, plain text, no markdown headings) covering: palette, typography, layout, motion and transitions, characters/imagery, captions, and 5 do/don't rules. Output ONLY the rule sheet.`;
      const out = await new Promise((ok, no) => { const pr = spawn(info.claude, ["-p", "--output-format", "text", "--permission-mode", "acceptEdits", "--allowedTools", "Read", "Glob", "Bash", "--add-dir", ...files.filter((f) => path.isAbsolute(f)).map((f) => path.dirname(f))], { cwd: ENGINE, windowsHide: true, shell: /\.(cmd|bat)$/i.test(info.claude) }); let o = "", e = ""; pr.stdout.on("data", (c) => (o += c)); pr.stderr.on("data", (c) => (e += c)); pr.on("close", (c) => (c === 0 ? ok(o) : no(new Error(e.slice(0, 300) || "exit " + c)))); pr.on("error", no); pr.stdin.end(prompt); setTimeout(() => { try { pr.kill(); } catch {} no(new Error("Timed out")); }, 600000); });
      return send(res, 200, { text: out.trim() });
    }
    if (P === "/api/quit" && req.method === "POST") { send(res, 200, { ok: true }); setTimeout(() => process.exit(0), 200); return; }
    return send(res, 404, { message: "Unknown endpoint" });
  } catch (err) { send(res, 500, { message: String(err.message || err) }); }
});

server.on("error", (err) => { if (err.code === "EADDRINUSE") { if (process.argv.includes("--open")) openWindow(); process.exit(0); } else throw err; });
// stale locks from a crashed session
for (const f of fs.readdirSync(D("locks"))) { const l = rj(D("locks", f), null); if (!l || !alive(l.pid) || l.pid !== process.pid) { try { fs.unlinkSync(D("locks", f)); } catch {} } }
// runs that were "generating" when the app died
for (const s of listProjects()) if (s.status === "generating") { const p = loadProject(s.id); p.status = p.versions.some((v) => v.file) ? "generated" : "draft"; for (const v of p.versions) if (v.status === "running") v.status = "failed"; saveProject(p); }
fs.writeFileSync(D("locks", "app.lock"), JSON.stringify({ pid: process.pid, port: PORT, started: new Date().toISOString() }));
const bye = () => { for (const r of runs.values()) if (r.proc) spawnSync("taskkill", ["/pid", String(r.proc.pid), "/T", "/F"], { stdio: "ignore" }); try { fs.unlinkSync(D("locks", "app.lock")); } catch {} };
process.on("exit", bye); process.on("SIGINT", () => process.exit(0));
server.listen(PORT, "127.0.0.1", () => { console.log(`Claude Video Maker v${VERSION} at ${ORIGIN}/  (data: ${DATA})`); if (process.argv.includes("--open")) openWindow(); });
