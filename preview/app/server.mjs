// Uddhar Reel Preview — local desktop app server (no dependencies, Node 18+).
// Serves preview/ on 127.0.0.1 only, streams videos with Range support, downloads, opens folders, updates from GitHub.
// Started by preview/app/launch.cmd (desktop shortcut). `node preview/app/server.mjs --open` also opens an app window.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const R = (...p) => path.join(root, ...p);
const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8").replace(/^﻿/, "") : "");
const cfg = { ...JSON.parse(read(R("preview/config.json")) || "{}"), ...JSON.parse(read(R("preview/config.local.json")) || "{}") };
const PORT = cfg.port || 4173;
const URL_ = `http://127.0.0.1:${PORT}/`;
const deliverables = cfg.deliverablesDir || path.join(path.dirname(root), "Deliverables");
const MIME = { ".html": "text/html; charset=utf-8", ".json": "application/json", ".mp4": "video/mp4", ".jpg": "image/jpeg", ".png": "image/png", ".ico": "image/x-icon", ".css": "text/css", ".js": "text/javascript" };
const data = () => JSON.parse(read(R("preview/data.json")) || '{"episodes":[]}');
const episode = (id) => data().episodes.find((e) => e.id === id);

function rebuild() { return spawnSync(process.execPath, [R("tools/build_preview.mjs")], { cwd: root, encoding: "utf8" }); }
function finalFile(e, kind) {
  if (kind === "preview") return R("preview/media", e.id + ".mp4");
  const dir = path.join(deliverables, e.deliverables || e.folder);
  const cand = [];
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir)) if (/final\.mp4$/i.test(f)) cand.push(path.join(dir, f));
  cand.push(R("episodes", e.folder, "renders", "final.mp4"));
  return cand.find((p) => fs.existsSync(p));
}
function openPath(p) { spawn("explorer.exe", [p], { detached: true, stdio: "ignore" }).unref(); }
function openUrl(u) { spawn("cmd", ["/c", "start", "", u], { detached: true, stdio: "ignore" }).unref(); }
function openWindow() {
  const args = [`--app=${URL_}`, "--window-size=1180,940"];
  for (const exe of ["msedge", "chrome"]) {
    const r = spawnSync("cmd", ["/c", "start", "", exe, ...args], { stdio: "ignore" });
    if (r.status === 0) return;
  }
  openUrl(URL_);
}
const send = (res, code, obj) => { res.writeHead(code, { "content-type": "application/json" }); res.end(JSON.stringify(obj)); };
function serveFile(req, res, file, extra = {}) {
  const st = fs.statSync(file), type = MIME[path.extname(file).toLowerCase()] || "application/octet-stream";
  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range || "");
  if (range) {
    const a = range[1] ? +range[1] : 0, b = range[2] ? +range[2] : st.size - 1;
    res.writeHead(206, { "content-type": type, "content-range": `bytes ${a}-${b}/${st.size}`, "accept-ranges": "bytes", "content-length": b - a + 1, ...extra });
    fs.createReadStream(file, { start: a, end: b }).pipe(res);
  } else {
    res.writeHead(200, { "content-type": type, "content-length": st.size, "accept-ranges": "bytes", ...extra });
    fs.createReadStream(file).pipe(res);
  }
}

const server = http.createServer((req, res) => {
  const u = new URL(req.url, URL_);
  try {
    if (u.pathname === "/api/ping") return send(res, 200, { app: true, root });
    if (u.pathname === "/api/update" && req.method === "POST") {
      const before = spawnSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).stdout;
      const pull = spawnSync("git", ["pull", "--ff-only"], { cwd: root, encoding: "utf8" });
      const b = rebuild();
      const after = spawnSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).stdout;
      const msg = pull.status === 0 ? (before === after ? "Already up to date. Data rebuilt." : "Updated from GitHub. Data rebuilt.") : "Could not pull from GitHub (" + (pull.stderr || "").trim().split("\n")[0] + "). Data rebuilt from local files.";
      return send(res, 200, { message: msg, changed: before !== after || b.status === 0 });
    }
    if (u.pathname === "/api/open" && req.method === "POST") {
      let body = ""; req.on("data", (c) => (body += c)); req.on("end", () => {
        const { target, id } = JSON.parse(body || "{}"); const e = episode(id);
        if (target === "episode" && e) { const p = path.join(deliverables, e.deliverables || e.folder); const q = fs.existsSync(p) ? p : R("episodes", e.folder); openPath(q); return send(res, 200, { message: "Opened " + q }); }
        if (target === "deliverables") { fs.mkdirSync(deliverables, { recursive: true }); openPath(deliverables); return send(res, 200, { message: "Opened " + deliverables }); }
        if (target === "drivelocal") { const p = cfg.driveLocalDir; if (p && fs.existsSync(p)) { openPath(p); return send(res, 200, { message: "Opened " + p }); } openUrl(cfg.driveUrl); return send(res, 200, { message: "Drive for desktop folder not set on this PC, opened Drive in the browser." }); }
        return send(res, 400, { message: "Unknown target" });
      });
      return;
    }
    if (u.pathname.startsWith("/download/")) {
      const e = episode(u.pathname.split("/")[2]); const kind = u.searchParams.get("kind") || "final";
      const f = e && finalFile(e, kind);
      if (!f) { res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }); return res.end("File not found on this PC. Use the Drive folder button."); }
      return serveFile(req, res, f, { "content-disposition": `attachment; filename="${path.basename(f)}"` });
    }
    let rel = decodeURIComponent(u.pathname === "/" ? "/index.html" : u.pathname);
    const file = path.normalize(path.join(R("preview"), rel));
    if (!file.startsWith(R("preview")) || file.includes(path.join("preview", "app")) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end("Not found"); }
    return serveFile(req, res, file);
  } catch (err) { send(res, 500, { message: String(err) }); }
});
server.on("error", (err) => { if (err.code === "EADDRINUSE") { if (process.argv.includes("--open")) openWindow(); process.exit(0); } else throw err; });
rebuild();
server.listen(PORT, "127.0.0.1", () => { console.log("Uddhar Reel Preview at " + URL_); if (process.argv.includes("--open")) openWindow(); });
