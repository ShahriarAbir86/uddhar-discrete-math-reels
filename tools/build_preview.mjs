// Builds preview/data.json and preview/index.html from preview/episodes.json, series/RUN_LOG.csv, each episode's qa/ files.
// Run from the repo root: node tools/build_preview.mjs
// index.html embeds the data so the same page works as a published Artifact (remote) and inside the desktop app.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const R = (...p) => path.join(root, ...p);
const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8").replace(/^﻿/, "") : "");
const cfg = JSON.parse(read(R("preview/config.json")) || "{}");
const eps = JSON.parse(read(R("preview/episodes.json")));

// CSV (no quoted commas in our log)
const rows = read(R("series/RUN_LOG.csv")).split(/\r?\n/).filter(Boolean).map((l) => l.split(","));
const head = rows.shift() || [];
const log = {};
for (const r of rows) { const o = Object.fromEntries(head.map((h, i) => [h, r[i]])); log[o.episode] = o; }
const toSec = (s) => { let t = 0; for (const m of String(s || "").matchAll(/(\d+(?:\.\d+)?)\s*([hms])/g)) t += +m[1] * ({ h: 3600, m: 60, s: 1 }[m[2]]); return t; };

function metricsFor(e) {
  const L = log[e.folder] || {};
  const qa = (f) => read(R("episodes", e.folder, "qa", f));
  const rt = qa("render_final.time").match(/real\s+([\dhms.]+)/);
  const sum = qa("run_summary.md");
  const row = sum.match(/\|\s*claude-[^|]+\|\s*(\d+)\s*\|\s*([\d,]+)\s*\|\s*([\d,]+)\s*\|\s*([\d,]+)\s*\|\s*([\d,]+)\s*\|\s*([\d,]+)\s*\|/);
  const num = (x) => (x ? +String(x).replace(/,/g, "") : null);
  const finals = [R("episodes", e.folder, "renders", "final.mp4")];
  const del = path.join(path.dirname(root), "Deliverables", e.deliverables || e.folder);
  if (fs.existsSync(del)) for (const f of fs.readdirSync(del)) if (/final\.mp4$/i.test(f)) finals.push(path.join(del, f));
  const fin = finals.find((p) => fs.existsSync(p));
  return {
    durationS: num(L.video_duration_s), resolution: L.resolution_fps || "", model: (L.models || "").replace("claude-", ""),
    activeSec: toSec(L.active_time), wallSec: toSec(L.wall_clock), calls: num(L.calls),
    outTok: num(L.output_tokens), inTok: num(L.input_tokens), cacheW: num(L.cache_write), cacheR: num(L.cache_read),
    thinkTok: row ? num(row[4]) : null, renderSec: rt ? toSec(rt[1]) : null,
    sizeMB: fin ? +(fs.statSync(fin).size / 1048576).toFixed(1) : null,
  };
}
const episodes = eps.filter((e) => fs.existsSync(R("preview/media", e.id + ".mp4"))).map((e) => ({ ...e, metrics: metricsFor(e) }));
const data = { drive: cfg.driveUrl, repo: cfg.repoUrl, built: new Date().toISOString(), episodes };
fs.writeFileSync(R("preview/data.json"), JSON.stringify(data, null, 1));
fs.writeFileSync(R("preview/index.html"), read(R("preview/template.html")).replace("/*DATA*/null", JSON.stringify(data)), "utf8");
console.log("preview built:", episodes.map((e) => e.code).join(", "));
