// EP01 — Mathematical Induction. Generates index.html (one continuous whiteboard world + camera).
// Run: node build.mjs   (from this folder)  ->  writes index.html
// Timing comes from ../qa/phrase_times.json (measured pauses of the real voiceover).
// Everything is a pure function of timeline time: GSAP timeline is paused and seeked by HyperFrames.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const PH = JSON.parse(fs.readFileSync(path.join(here, "../qa/phrase_times.json"), "utf8"));
const FW = JSON.parse(fs.readFileSync(path.join(here, "../qa/font_widths.json"), "utf8"));
const S = (i) => PH[i].start;
const E = (i) => PH[i].end;
const AUDIO = 102.844063;
const DUR = 105.0;

const NAVY = "#101B49", ORANGE = "#F2530F", OLIGHT = "#FEEEE7", WHITE = "#FFFFFF";
const f = (n) => +Number(n).toFixed(3);

// ---------- text width from real font metrics ----------
function tw(str, size, face = "pjs600") {
  let w = 0;
  for (const ch of str) {
    if (/[ঀ-৿।]/.test(ch)) w += FW.hind600[ch] ?? 0.5;
    else w += FW[face][ch] ?? 0.6;
  }
  return w * size;
}

// ---------- seeded hand-drawn jitter ----------
let seed = 7;
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const wob = (a) => (rnd() - 0.5) * 2 * a;

// ---------- builders ----------
const W = []; // world markup
const DEFS = [];
const L = []; // timeline code
let uid = 0;
const nid = (p) => `${p}${++uid}`;

function draw(d, { c = NAVY, w = 6, t, dur = 0.5, ease = "power1.inOut", fill = "none", id = null, into = W, op = 1 } = {}) {
  id = id || nid("p");
  into.push(`<path id="${id}" d="${d}" pathLength="1" fill="${fill}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 1.2" stroke-dashoffset="1.1" opacity="0"/>`);
  L.push(`tl.set("#${id}",{opacity:${op}},${f(t)});tl.fromTo("#${id}",{strokeDashoffset:1.1},{strokeDashoffset:0,duration:${f(dur)},ease:"${ease}"},${f(t)});`);
  return id;
}
function fadeIn(id, t, dur = 0.3) { L.push(`tl.fromTo("#${id}",{opacity:0},{opacity:1,duration:${f(dur)},ease:"power1.out"},${f(t)});`); }
function fadeOut(id, t, dur = 0.3) { L.push(`tl.to("#${id}",{opacity:0,duration:${f(dur)},ease:"power1.in"},${f(t)});`); }

function write(str, x, y, { size = 56, c = NAVY, wt = 600, face = "pjs600", anchor = "start", t, dur, into = W, id = null } = {}) {
  const w = tw(str, size, face);
  const x0 = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  id = id || nid("t");
  DEFS.push(`<clipPath id="cp${id}"><rect id="cr${id}" x="${f(x0 - 8)}" y="${f(y - size * 1.1)}" width="0" height="${f(size * 1.6)}"/></clipPath>`);
  into.push(`<text id="${id}" x="${f(x0)}" y="${f(y)}" font-size="${size}" font-weight="${wt}" fill="${c}" clip-path="url(#cp${id})">${str.replace(/&/g, "&amp;")}</text>`);
  L.push(`tl.fromTo("#cr${id}",{attr:{width:0}},{attr:{width:${f(w + 20)}},duration:${f(dur)},ease:"none"},${f(t)});`);
  return { id, w, x0, x1: x0 + w };
}
function line(x1, y1, x2, y2) {
  return `M${f(x1 + wob(0.8))} ${f(y1 + wob(0.8))} Q${f((x1 + x2) / 2 + wob(1.6))} ${f((y1 + y2) / 2 + wob(1.6))} ${f(x2 + wob(0.8))} ${f(y2 + wob(0.8))}`;
}
function check(x, y, s) { return `M${f(x)} ${f(y)} L${f(x + s * 0.32)} ${f(y + s * 0.4)} L${f(x + s * 1.0)} ${f(y - s * 0.55)}`; }
function ring(cx, cy, rx, ry) {
  return `M${f(cx - rx * 0.7)} ${f(cy - ry * 0.75)} C${f(cx - rx * 0.2)} ${f(cy - ry * 1.25)} ${f(cx + rx * 1.1)} ${f(cy - ry * 1.0)} ${f(cx + rx)} ${f(cy + ry * 0.1)} C${f(cx + rx * 0.9)} ${f(cy + ry * 1.2)} ${f(cx - rx * 0.9)} ${f(cy + ry * 1.3)} ${f(cx - rx * 1.05)} ${f(cy + ry * 0.1)} C${f(cx - rx * 1.1)} ${f(cy - ry * 0.6)} ${f(cx - rx * 0.6)} ${f(cy - ry * 1.0)} ${f(cx - rx * 0.2)} ${f(cy - ry * 1.05)}`;
}
function rect(x, y, w, h, r = 12) {
  const j = () => wob(1.5);
  return `M${f(x + r)} ${f(y + j())} L${f(x + w - r)} ${f(y + j())} Q${f(x + w + j())} ${f(y)} ${f(x + w + j())} ${f(y + r)} L${f(x + w + j())} ${f(y + h - r)} Q${f(x + w)} ${f(y + h + j())} ${f(x + w - r)} ${f(y + h + j())} L${f(x + r)} ${f(y + h + j())} Q${f(x + j())} ${f(y + h)} ${f(x + j())} ${f(y + h - r)} L${f(x + j())} ${f(y + r)} Q${f(x)} ${f(y + j())} ${f(x + r + 14)} ${f(y + j())}`;
}
function arrowHead(x, y, ang, s = 22) { // ang in degrees: direction the arrow points
  const a = (ang * Math.PI) / 180, b1 = a + Math.PI * 0.82, b2 = a - Math.PI * 0.82;
  return `M${f(x + s * Math.cos(b1))} ${f(y + s * Math.sin(b1))} L${f(x)} ${f(y)} L${f(x + s * Math.cos(b2))} ${f(y + s * Math.sin(b2))}`;
}
function infinity(cx, cy, w, h) {
  return `M${cx} ${cy} C${f(cx + w * 0.25)} ${f(cy - h)} ${f(cx + w * 0.5)} ${f(cy - h)} ${f(cx + w * 0.5)} ${cy} C${f(cx + w * 0.5)} ${f(cy + h)} ${f(cx + w * 0.25)} ${f(cy + h)} ${cx} ${cy} C${f(cx - w * 0.25)} ${f(cy - h)} ${f(cx - w * 0.5)} ${f(cy - h)} ${f(cx - w * 0.5)} ${cy} C${f(cx - w * 0.5)} ${f(cy + h)} ${f(cx - w * 0.25)} ${f(cy + h)} ${cx} ${cy}`;
}
// stacked fraction: numerator over bar over denominator, centred at cx; baseline y is the "=" line
function frac(num, den, cx, y, { size = 56, c = NAVY, t, tn, td, dur = 0.8 } = {}) {
  const w = Math.max(tw(num, size), tw(den, size)) + 24;
  const out = { w };
  write(num, cx, y - 14, { size, c, anchor: "middle", t, dur: tn ?? dur });
  draw(line(cx - w / 2, y + 6, cx + w / 2, y + 6), { c, w: 4.5, t: t + (tn ?? dur) * 0.9, dur: 0.25 });
  write(den, cx, y + size * 0.95, { size, c, anchor: "middle", t: td ?? t + (tn ?? dur), dur: Math.min(dur, 0.5) });
  return out;
}

// ---------- camera: screen focus point (540,700); world group transform interpolates as attribute ----------
const camXY = (cx, cy, s) => ({ x: 540 - cx * s, y: 700 - cy * s, s });
let cur = camXY(750, 560, 0.68);
const tf = (c) => `translate(${f(c.x)} ${f(c.y)}) scale(${f(c.s)})`;
function leg(t, dur, cx, cy, s, ease = "power2.inOut") {
  const n = camXY(cx, cy, s);
  L.push(`tl.fromTo("#world",{attr:{transform:"${tf(cur)}"}},{attr:{transform:"${tf(n)}"},duration:${f(dur)},ease:"${ease}",immediateRender:false},${f(t)});`);
  cur = n;
}
const startCam = tf(cur);

// =====================================================================================
// WORLD LAYOUT (1500 x 3800)   A: dominoes y 400-760 | B: proof y 1280-3050 | C: recursion y 3150-3650
// =====================================================================================
// ---- Zone A: domino chain ----
const BASE = 620, DX = 165, X0 = 110, DW = 56, DH = 190, N = 8;
const dcx = (i) => X0 + DW / 2 + DX * i; // domino centre x
draw(line(60, BASE + 4, 1340, BASE + 4), { c: NAVY, w: 5, t: 0.1, dur: 0.9 });
for (let i = 0; i < N; i++) {
  const px = X0 + DW + DX * i, t0 = 0.25 + i * 0.2;
  const inner = [];
  draw(rect(-DW, -DH, DW, DH, 10), { into: inner, id: `db${i}`, c: NAVY, w: 6, t: t0, dur: 0.45, fill: WHITE });
  draw(line(-DW + 4, -DH / 2, -4, -DH / 2), { into: inner, id: `dl${i}`, c: NAVY, w: 4, t: t0 + 0.3, dur: 0.15 });
  W.push(`<g transform="translate(${px} ${BASE})"><g id="dr${i}" transform="rotate(0)">${inner.join("")}</g></g>`);
}
// falls (voice: "একটা ডমিনো পড়ে গেলে কী হয়?" ... "পুরো সারি")
const fallAt = [2.55, 3.52, 5.18, 6.85, 7.55, 8.25, 8.95, 9.55];
fallAt.forEach((t, i) => L.push(`tl.fromTo("#dr${i}",{attr:{transform:"rotate(0)"}},{attr:{transform:"rotate(66)"},duration:0.62,ease:"power2.in"},${t});`));

// question mark + "proof technique" label (voice 4, 5)
write("?", 750, 380, { size: 190, c: ORANGE, wt: 700, anchor: "middle", t: S(4) + 0.05, dur: 0.5 });
const qId = "t" + uid;
fadeOut(qId, S(5) + 1.6, 0.35);
const lab = write("powerful proof technique", 750, 400, { size: 66, anchor: "middle", t: S(5) + 2.1, dur: 2.2 });
const labU = draw(line(750 - lab.w / 2, 425, 750 + lab.w / 2, 425), { c: ORANGE, w: 6, t: S(5) + 4.2, dur: 0.5 });
fadeOut(lab.id, S(6) - 0.2, 0.4); fadeOut(labU, S(6) - 0.2, 0.4);
// title (voice 6)
const title = write("Mathematical Induction", 750, 122, { size: 100, wt: 700, anchor: "middle", t: S(6) + 0.1, dur: 1.9 });
const titleU = draw(line(750 - title.w * 0.2, 148, 750 + title.w / 2, 148), { c: ORANGE, w: 8, t: S(6) + 1.9, dur: 0.45 });
// the title belongs to the opening; hide it while the camera works elsewhere, bring it back for the overview
fadeOut(title.id, S(7) - 0.3, 0.4); fadeOut(titleU, S(7) - 0.3, 0.4);
L.push(`tl.fromTo("#${title.id}",{opacity:0},{opacity:1,duration:0.8,ease:"power1.out"},${f(S(43) + 1.2)});tl.fromTo("#${titleU}",{opacity:0},{opacity:1,duration:0.8,ease:"power1.out"},${f(S(43) + 1.2)});`);

// P(n) labels under the dominoes (voice 8)
const plab = ["P(1)", "P(2)", "P(3)", "P(k)", "P(k+1)"];
plab.forEach((s, i) => write(s, dcx(i), 712, { size: 44, anchor: "middle", t: S(8) + 1.9 + i * 0.55, dur: 0.5, id: `pl${i}` }));
// base case: ring + tick on P(1) + label (voice 10, 11)
draw(ring(dcx(0), 698, 62, 34), { c: ORANGE, w: 6, t: S(10) + 0.1, dur: 0.7 });
draw(check(dcx(0) - 20, 778, 38), { c: ORANGE, w: 8, t: S(10) + 1.2, dur: 0.4 });
const bc = write("Base Case", 100, 462, { size: 62, c: ORANGE, wt: 700, t: S(11) + 0.15, dur: 1.0 });
draw(line(100, 482, 100 + bc.w, 482), { c: ORANGE, w: 5, t: S(11) + 1.2, dur: 0.4 });
// inductive step: ring on P(k), arc k -> k+1, implication, label (voice 14, 15)
draw(ring(dcx(3), 698, 52, 34), { c: ORANGE, w: 6, t: S(14) + 0.1, dur: 0.6 });
const ax = dcx(3), bx = dcx(4);
draw(`M${ax} 400 Q${(ax + bx) / 2} 300 ${bx} 400`, { c: ORANGE, w: 7, t: S(14) + 0.9, dur: 0.9 });
draw(arrowHead(bx, 400, 70), { c: ORANGE, w: 7, t: S(14) + 1.75, dur: 0.2 });
const impW = tw("P(k)", 54) + 100 + tw("P(k+1)", 54), impX = (ax + bx) / 2 - impW / 2;
write("P(k)", impX, 330, { size: 54, c: ORANGE, t: S(14) + 2.1, dur: 0.5 });
draw(line(impX + tw("P(k)", 54) + 14, 314, impX + tw("P(k)", 54) + 86, 314), { c: ORANGE, w: 6, t: S(14) + 2.55, dur: 0.3 });
draw(arrowHead(impX + tw("P(k)", 54) + 86, 314, 0), { c: ORANGE, w: 6, t: S(14) + 2.8, dur: 0.15 });
write("P(k+1)", impX + tw("P(k)", 54) + 100, 330, { size: 54, c: ORANGE, t: S(14) + 2.8, dur: 0.6 });
const ist = write("Inductive Step", (ax + bx) / 2, 236, { size: 62, wt: 700, anchor: "middle", c: ORANGE, t: S(15) + 0.15, dur: 1.1 });
draw(line((ax + bx) / 2 - ist.w / 2, 256, (ax + bx) / 2 + ist.w / 2, 256), { c: ORANGE, w: 5, t: S(15) + 1.3, dur: 0.4 });

// ---- Zone B: summation proof ----
const bStart = W.length;
const BX = 100;
const ex = write("Example", BX, 1330, { size: 46, wt: 500, t: S(16) + 2.0, dur: 0.7 });
const sumW = tw("1 + 2 + … + n =", 62);
write("1 + 2 + … + n =", BX, 1470, { size: 62, t: S(18) + 0.2, dur: 2.7 });
frac("n(n+1)", "2", BX + sumW + 16 + (Math.max(tw("n(n+1)", 62), tw("2", 62)) + 24) / 2, 1470, { size: 62, t: S(18) + 3.0, tn: 1.2, td: S(19) + 0.05 });
// base case block
const b1 = write("Base Case", BX, 1660, { size: 58, wt: 700, c: ORANGE, t: S(20) + 0.05, dur: 0.9 });
write("n = 1", BX, 1760, { size: 56, t: S(21) + 0.05, dur: 0.8 });
write("বামপাশ = 1", BX, 1860, { size: 52, t: S(22) + 0.05, dur: 0.8 });
const rhsL = write("ডানপাশ = ", BX, 1990, { size: 52, t: S(23) + 0.0, dur: 0.5 });
const fx = rhsL.x1 + (Math.max(tw("1·(1+1)", 52), tw("2", 52)) + 24) / 2;
frac("1·(1+1)", "2", fx, 1990, { size: 52, t: S(23) + 0.45, tn: 0.4 });
write("= 1", fx + (Math.max(tw("1·(1+1)", 52), tw("2", 52)) + 24) / 2 + 10, 1990, { size: 52, t: S(23) + 0.9, dur: 0.35 });
draw(check(BX + b1.w + 28, 1650, 44), { c: ORANGE, w: 9, t: S(24) + 0.1, dur: 0.45 });
draw(rect(BX - 20, 1700, 880, 385, 22), { c: ORANGE, w: 4, t: S(24) + 0.4, dur: 0.9 });
// inductive step block
const i1 = write("Inductive Step", BX, 2200, { size: 58, wt: 700, c: ORANGE, t: S(25) + 0.05, dur: 1.0 });
write("ধরি P(k) সত্য:", BX, 2290, { size: 48, wt: 500, t: S(26) + 0.0, dur: 0.4 });
const hypL = write("1 + 2 + … + k =", BX, 2400, { size: 56, t: S(27) + 0.0, dur: 1.6 });
const hw = Math.max(tw("k(k+1)", 56), tw("2", 56)) + 24;
frac("k(k+1)", "2", hypL.x1 + 16 + hw / 2, 2400, { size: 56, t: S(27) + 1.8, tn: 1.0, td: S(28) + 0.05 });
write("দুই পাশে (k+1) যোগ করি:", BX, 2520, { size: 44, wt: 500, t: S(29) + 0.0, dur: 1.3 });
const l1 = write("1 + 2 + … + k +", BX, 2630, { size: 56, t: S(29) + 0.9, dur: 0.9 });
write("(k+1)", l1.x1 + 14, 2630, { size: 56, c: ORANGE, t: S(29) + 1.5, dur: 0.6 });
const l2 = write("=", BX, 2780, { size: 56, t: S(29) + 1.5, dur: 0.2 });
const hw2 = Math.max(tw("k(k+1)", 56), tw("2", 56)) + 24;
frac("k(k+1)", "2", l2.x1 + 20 + hw2 / 2, 2780, { size: 56, t: S(29) + 1.7, tn: 0.4 });
const plus = write("+", l2.x1 + 20 + hw2 + 14, 2780, { size: 56, t: S(29) + 1.7, dur: 0.2 });
write("(k+1)", plus.x1 + 14, 2780, { size: 56, c: ORANGE, t: S(29) + 1.8, dur: 0.5 });
// simplify arrow + result
draw(line(150, 2830, 150, 2900), { c: NAVY, w: 5, t: S(30) + 0.1, dur: 0.4 });
draw(arrowHead(150, 2902, 90), { c: NAVY, w: 5, t: S(30) + 0.45, dur: 0.15 });
write("Simplify", 190, 2885, { size: 40, wt: 500, t: S(30) + 0.3, dur: 0.6 });
const eq3 = write("=", BX, 3030, { size: 60, c: ORANGE, t: S(31) + 0.0, dur: 0.2 });
const hw3 = Math.max(tw("(k+1)(k+2)", 60), tw("2", 60)) + 24;
frac("(k+1)(k+2)", "2", eq3.x1 + 24 + hw3 / 2, 3030, { size: 60, c: ORANGE, t: S(31) + 0.1, tn: 1.5, td: S(32) + 0.05 });
draw(rect(BX - 20, 2930, 640, 190, 20), { c: ORANGE, w: 5, t: E(32) - 0.2, dur: 0.7 });
const pk = write("P(k+1) সত্য", 790, 3040, { size: 46, c: ORANGE, wt: 700, t: S(34) + 0.0, dur: 0.9 });
draw(check(790 + pk.w + 16, 3030, 40), { c: ORANGE, w: 9, t: S(34) + 0.75, dur: 0.4 });

W.splice(bStart, W.length - bStart, `<g id="zoneB">${W.slice(bStart).join("")}</g>`);
// ---- Zone C: recursion & tree ----
const cStart = W.length;
const CX = 130, bw = 360, bh = 84;
write("recursive algorithm", CX, 3190, { size: 40, wt: 500, t: S(35) + 0.9, dur: 1.2 });
const boxes = [["sum(n)", 3230], ["sum(n-1)", 3370], ["sum(1)", 3600]];
boxes.forEach(([label, y], k) => {
  const t0 = S(35) + 0.3 + k * 0.55;
  draw(rect(CX, y, bw, bh, 16), { c: NAVY, w: 5, t: t0, dur: 0.5, id: `cb${k}` });
  write(label, CX + bw / 2, y + 58, { size: 44, anchor: "middle", t: t0 + 0.25, dur: 0.4 });
});
draw(line(CX + bw / 2, 3316, CX + bw / 2, 3366), { c: NAVY, w: 5, t: S(35) + 0.9, dur: 0.25 });
draw(arrowHead(CX + bw / 2, 3368, 90, 18), { c: NAVY, w: 5, t: S(35) + 1.1, dur: 0.1 });
write("· · ·", CX + bw / 2, 3520, { size: 44, anchor: "middle", t: S(35) + 1.5, dur: 0.4 });
draw(line(CX + bw / 2, 3456, CX + bw / 2, 3496), { c: NAVY, w: 5, t: S(35) + 1.4, dur: 0.2 });
draw(line(CX + bw / 2, 3540, CX + bw / 2, 3596), { c: NAVY, w: 5, t: S(35) + 1.7, dur: 0.2 });
draw(arrowHead(CX + bw / 2, 3598, 90, 18), { c: NAVY, w: 5, t: S(35) + 1.85, dur: 0.1 });
write("base case", CX + bw + 24, 3655, { size: 40, wt: 500, c: ORANGE, t: S(35) + 2.2, dur: 0.6 });
// tree
write("data structure", 1100, 3190, { size: 40, wt: 500, anchor: "middle", t: S(35) + 3.2, dur: 1.2 });
const nodes = { r: [1100, 3270], a: [980, 3400], b: [1220, 3400], c: [920, 3530], d: [1040, 3530], e: [1160, 3530], g: [1280, 3530] };
const edges = [["r", "a"], ["r", "b"], ["a", "c"], ["a", "d"], ["b", "e"], ["b", "g"]];
edges.forEach(([p, q], k) => draw(line(nodes[p][0], nodes[p][1] + 28, nodes[q][0], nodes[q][1] - 28), { c: NAVY, w: 5, t: S(35) + 3.7 + k * 0.3, dur: 0.3 }));
Object.entries(nodes).forEach(([k, [x, y]], i) => draw(ring(x, y, 30, 30), { c: NAVY, w: 5, t: S(35) + 3.5 + i * 0.28, dur: 0.35, fill: WHITE }));

// result vs valid steps (voices 36-38): orange sweep down the call chain
draw(line(CX + bw + 14, 3272, CX + bw + 56, 3272), { c: NAVY, w: 5, t: S(36) + 0.1, dur: 0.25 });
draw(arrowHead(CX + bw + 56, 3272, 0, 16), { c: NAVY, w: 5, t: S(36) + 0.3, dur: 0.1 });
write("result", CX + bw + 70, 3286, { size: 44, wt: 500, t: S(36) + 0.35, dur: 0.6 });
[0, 1, 2].forEach((k, i) => {
  const y = boxes[k][1];
  draw(rect(CX - 8, y - 8, bw + 16, bh + 16, 18), { c: ORANGE, w: 7, t: S(37) + 0.3 + i * 0.75, dur: 0.6 });
});
draw(check(CX + bw + 24 + tw("base case", 40) + 24, 3652, 38), { c: ORANGE, w: 9, t: S(38) + 0.3, dur: 0.4 });
W.splice(cStart, W.length - cStart, `<g id="zoneC" transform="translate(0 130)">${W.slice(cStart).join("")}</g>`); // breathing room below the proof

// ---- Final: close-up on the chain (voices 41-43) ----
const hops = [];
for (let i = 0; i < N - 1; i++) {
  const a = dcx(i), b = dcx(i + 1), t0 = S(42) + 0.1 + i * 0.36;
  draw(`M${a} 752 Q${(a + b) / 2} 826 ${b} 752`, { c: ORANGE, w: 6, t: t0, dur: 0.3 });
  draw(arrowHead(b, 752, -62, 18), { c: ORANGE, w: 6, t: t0 + 0.22, dur: 0.1 });
}
draw(`M1330 470 L1395 470`, { c: ORANGE, w: 6, t: S(43) + 0.2, dur: 0.3 });
draw(arrowHead(1395, 470, 0, 20), { c: ORANGE, w: 6, t: S(43) + 0.45, dur: 0.1 });
draw(infinity(1445, 470, 90, 34), { c: ORANGE, w: 7, t: S(43) + 0.5, dur: 1.2 });

// spotlight on the chain for the last two conditions, then the whole connected proof again
L.push(`tl.fromTo("#zoneB,#zoneC",{opacity:1},{opacity:0.1,duration:0.7,ease:"power1.inOut",immediateRender:false},${f(S(41) - 0.6)});`);
L.push(`tl.fromTo("#zoneB,#zoneC",{opacity:0.1},{opacity:0.4,duration:1.4,ease:"power1.inOut",immediateRender:false},${f(S(43) + 0.3)});`);
// =====================================================================================
// CAMERA SCRIPT
// =====================================================================================
leg(1.7, 1.2, 330, 545, 1.25);          // push in on the first domino
leg(3.3, 1.6, 480, 545, 1.2);           // follow the fall
leg(5.0, 1.6, 640, 545, 1.2);
leg(6.7, 3.1, 750, 560, 0.68);          // pull back for the whole row
leg(15.8, 1.4, 750, 330, 0.66);         // reveal the title
leg(S(7) - 0.1, 1.5, 480, 560, 0.95);   // settle on P(n) labels
leg(S(9), 1.4, 260, 560, 1.35);         // first domino: base case
leg(S(12), 1.8, 650, 560, 1.0);         // along the chain
leg(S(13) + 0.1, 1.6, 700, 480, 1.3);   // P(k) -> P(k+1)
leg(S(16), 2.9, 500, 1480, 1.05, "power3.inOut"); // travel down to the proof
leg(S(20) - 0.4, 1.3, 520, 1700, 1.1);  // base case
leg(S(23) - 0.2, 1.3, 520, 1800, 1.1);
leg(S(25) - 0.4, 1.7, 520, 2230, 1.1);  // inductive step
leg(S(27) - 0.4, 1.6, 520, 2390, 1.1);
leg(S(29) - 0.3, 1.6, 520, 2600, 1.0);
leg(S(31) - 0.3, 1.5, 520, 2820, 1.0);
leg(S(34) - 0.6, 1.2, 520, 2960, 1.0);
leg(S(35) - 0.5, 2.4, 730, 3540, 0.85, "power3.inOut"); // zone C
leg(S(39) - 0.1, 3.4, 750, 976, 0.41, "power2.inOut");  // zoom out: the whole connected proof
leg(S(41) - 0.3, 1.4, 330, 560, 1.2);
leg(S(42) + 0.1, 2.8, 1000, 520, 1.0, "power1.inOut");
leg(S(43), 2.6, 750, 976, 0.41, "power2.inOut");

// =====================================================================================
// SUBTITLES (phrase level, from the script text; timing from measured pauses)
// =====================================================================================
const subs = [];
function wrapLines(text, max = 34) {
  const words = text.split(/\s+/), lines = []; let cl = "";
  for (const w of words) { if ((cl + " " + w).trim().length > max && cl) { lines.push(cl); cl = w; } else cl = (cl + " " + w).trim(); }
  if (cl) lines.push(cl); return lines;
}
PH.forEach((p) => {
  const words = p.text.split(/\s+/);
  const groups = []; let g = [];
  for (const w of words) { if ((g.join(" ") + " " + w).length > 64 && g.length) { groups.push(g); g = [w]; } else g.push(w); }
  if (g.length) groups.push(g);
  const total = groups.reduce((a, b) => a + b.join(" ").length, 0);
  let t = p.start;
  groups.forEach((gr) => {
    const share = (gr.join(" ").length / total) * (p.end - p.start);
    subs.push({ start: t, end: t + share, text: gr.join(" ") }); t += share;
  });
});
const SUBY = 1572;
const subSvg = subs.map((s, i) => {
  const lines = wrapLines(s.text);
  const y0 = SUBY - (lines.length - 1) * 31;
  return `<text id="sub${i}" font-size="44" font-weight="600" fill="${NAVY}" stroke="#FFFFFF" stroke-width="12" paint-order="stroke" stroke-linejoin="round" text-anchor="middle" opacity="0">${lines.map((ln, k) => `<tspan x="540" y="${y0 + k * 62}">${ln.replace(/&/g, "&amp;")}</tspan>`).join("")}</text>`;
}).join("\n");
subs.forEach((s, i) => L.push(`tl.set("#sub${i}",{opacity:1},${f(s.start)});tl.set("#sub${i}",{opacity:0},${f(s.end)});`));
// logo end card (official asset, not altered)
L.push(`tl.fromTo("#logo",{opacity:0},{opacity:1,duration:0.9,ease:"power1.out"},${f(S(43) + 2.3)});`);

// ---- SRT ----
const ts = (x) => { const h = Math.floor(x / 3600), m = Math.floor((x % 3600) / 60), s = Math.floor(x % 60), ms = Math.round((x % 1) * 1000); return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`; };
fs.writeFileSync(path.join(here, "../subtitles.srt"), subs.map((s, i) => `${i + 1}\n${ts(s.start)} --> ${ts(Math.max(s.end - 0.02, s.start + 0.2))}\n${wrapLines(s.text).join("\n")}\n`).join("\n"), "utf8");

// =====================================================================================
const html = `<!doctype html>
<html lang="bn">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=1080, height=1920"/>
<title>EP01 — Mathematical Induction</title>
<script src="assets/vendor/gsap.min.js"></script>
<style>
@font-face{font-family:"Plus Jakarta Sans";font-weight:500;src:url("assets/fonts/plus-jakarta-sans-latin-500-normal.woff2") format("woff2")}
@font-face{font-family:"Plus Jakarta Sans";font-weight:600;src:url("assets/fonts/plus-jakarta-sans-latin-600-normal.woff2") format("woff2")}
@font-face{font-family:"Plus Jakarta Sans";font-weight:700;src:url("assets/fonts/plus-jakarta-sans-latin-700-normal.woff2") format("woff2")}
@font-face{font-family:"Hind Siliguri";font-weight:500;src:url("assets/fonts/hind-siliguri-bengali-500-normal.woff2") format("woff2")}
@font-face{font-family:"Hind Siliguri";font-weight:600;src:url("assets/fonts/hind-siliguri-bengali-600-normal.woff2") format("woff2")}
@font-face{font-family:"Hind Siliguri";font-weight:700;src:url("assets/fonts/hind-siliguri-bengali-600-normal.woff2") format("woff2")}
:root{--navy:${NAVY};--orange:${ORANGE};--white:${WHITE};--neutral:#F6F6F7}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:var(--white)}
#root{position:relative;width:1080px;height:1920px;background:var(--white);font-family:"Plus Jakarta Sans","Hind Siliguri",sans-serif}
#stage{position:absolute;left:0;top:0;width:1080px;height:1920px}
svg text{font-family:"Plus Jakarta Sans","Hind Siliguri",sans-serif}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="1080" data-height="1920">
  <div id="stage" class="clip" data-start="0" data-duration="${DUR}" data-track-index="0" data-layout-ignore>
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg" data-layout-ignore>
      <defs>${DEFS.join("")}</defs>
      <rect width="1080" height="1920" fill="${WHITE}"/>
      <g id="world" transform="${startCam}">
${W.join("\n")}
      </g>
${subSvg}
      <image id="logo" href="assets/Uddhar_logo.svg" x="390" y="118" width="300" height="142" opacity="0"/>
    </svg>
  </div>
  <audio id="vo" src="assets/voiceover.mp3" data-start="0" data-volume="1"></audio>
</div>
<script>
const tl = gsap.timeline({ paused: true });
${L.join("\n")}
window.__timelines["main"] = tl;
tl.seek(0);
</script>
</body>
</html>
`;
const vo = path.join(here, "assets/voiceover.mp3");
if (!fs.existsSync(vo)) fs.copyFileSync(path.join(here, "../DM Mathematical Induction.mp3"), vo); // keep one copy of the source audio in Git
fs.writeFileSync(path.join(here, "index.html"), html, "utf8");
console.log("index.html written:", (html.length / 1024).toFixed(0), "KB;", subs.length, "subtitle chunks;", uid, "elements");
