// EP01 Mathematical Induction, rebuilt in the "Animation Story" style, DARK mode (brand Deep Navy page, cream cards).
// Run: node build.mjs -> index.html + ../subtitles.srt. Timing: ../qa/phrase_times.json (measured pauses of the real voiceover).
// Palette = styles/animation-story/palette.mjs "dark". Every visual is a pure function of timeline time.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const PH = JSON.parse(fs.readFileSync(path.join(here, "../qa/phrase_times.json"), "utf8"));
const FW = JSON.parse(fs.readFileSync(path.join(here, "../qa/font_widths.json"), "utf8"));
if (PH.length !== 44) throw new Error("expected 44 phrase entries, got " + PH.length);
const S = (i) => PH[i].start, E = (i) => PH[i].end;
const AUDIO = 102.84, DUR = 105.4;

// ---- dark palette ----
const BG = "#101B49", CREAM = "#FEEEE7", ORANGE = "#F2530F", ORANGE_D = "#C23F0A", INK = "#101B49", BORDER = "#0A1033", SHADOW = "#050A24";
const CARD = CREAM, TX = CREAM, MUTED = "#9AA1C8", HALF = "#3A4686", SKYF = "#1B2766", PANTS = "#3A4686", SUBBG = "#050A24", HUD = "#7F84A3", SKIN = "#8A8EA3", LINE = "#D9C9BE", TINT = "#6C74A6";
const f = (n) => +Number(n).toFixed(2);

function tw(str, size, face = "pjs600") {
  let w = 0;
  for (const ch of str) w += /[ঀ-৿।]/.test(ch) ? (FW.hind600[ch] ?? 0.5) : (FW[face][ch] ?? 0.6);
  return w * size;
}

// ---------- builders ----------
const L = [], DEFS = [];
let uid = 0;
const nid = (p) => `${p}${++uid}`;
const TR = {};
const tf = (o) => `translate(${f(o.x)} ${f(o.y)}) rotate(${f(o.r)}) scale(${f(o.s)})`;
function G(id, inner, x = 0, y = 0, { r = 0, s = 1, op = 0 } = {}) { TR[id] = { x, y, r, s }; return `<g id="${id}" transform="${tf(TR[id])}" opacity="${op}">${inner}</g>`; }
function pop(id, t, { dx = 0, dy = 0, r0, s0 = 0.9, dur = 0.4, ease = "back.out(1.2)" } = {}) {
  const o = TR[id];
  L.push(`tl.fromTo("#${id}",{attr:{transform:"${tf({ x: o.x + dx, y: o.y + dy, r: r0 ?? o.r, s: s0 })}"},opacity:0},{attr:{transform:"${tf(o)}"},opacity:1,duration:${f(dur)},ease:"${ease}",immediateRender:false},${f(t)});`);
}
function mv(id, t, { x, y, r, s, dur = 0.6, ease = "power2.inOut" } = {}) {
  const a = { ...TR[id] }, b = { x: x ?? a.x, y: y ?? a.y, r: r ?? a.r, s: s ?? a.s };
  L.push(`tl.fromTo("#${id}",{attr:{transform:"${tf(a)}"}},{attr:{transform:"${tf(b)}"},duration:${f(dur)},ease:"${ease}",immediateRender:false},${f(t)});`);
  TR[id] = b;
}
function fadeTo(id, t, from, to, dur = 0.3) { L.push(`tl.fromTo("#${id}",{opacity:${from}},{opacity:${to},duration:${f(dur)},ease:"power1.inOut",immediateRender:false},${f(t)});`); }
const show = (id, t, dur = 0.3) => fadeTo(id, t, 0, 1, dur);
const hide = (id, t, dur = 0.3) => fadeTo(id, t, 1, 0, dur);
function recolor(id, t, prop, from, to, dur = 0.3) { L.push(`tl.fromTo("#${id}",{${prop}:"${from}"},{${prop}:"${to}",duration:${f(dur)},ease:"power1.inOut",immediateRender:false},${f(t)});`); }
function dpath(d, { c = ORANGE, w = 6, t, dur = 0.5, ease = "power1.inOut", fill = "none", id = null, op = 1 } = {}) {
  id = id || nid("d");
  L.push(`tl.set("#${id}",{opacity:${op}},${f(t)});tl.fromTo("#${id}",{strokeDashoffset:1.1},{strokeDashoffset:0,duration:${f(dur)},ease:"${ease}",immediateRender:false},${f(t)});`);
  return `<path id="${id}" d="${d}" pathLength="1" fill="${fill}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 1.2" stroke-dashoffset="1.1" opacity="0"/>`;
}
const esc = (s) => s.replace(/&/g, "&amp;");
function T(str, x, y, { size = 44, c = INK, wt = 600, anchor = "middle", ls = 0, op = 1, id = "" } = {}) {
  return `<text ${id ? `id="${id}"` : ""} x="${f(x)}" y="${f(y)}" font-size="${size}" font-weight="${wt}" fill="${c}" text-anchor="${anchor}"${ls ? ` letter-spacing="${ls}"` : ""}${op !== 1 ? ` fill-opacity="${op}"` : ""}>${esc(str)}</text>`;
}
const micro = (str, x, y, o = {}) => T(str.toUpperCase(), x, y, { size: 20, wt: 600, ls: 3.2, c: INK, op: 0.6, anchor: "start", ...o });
function writeOn(str, x, y, size, t, dur, { c = INK, wt = 600, anchor = "start", hi = null } = {}) {
  const w = tw(str, size), x0 = anchor === "middle" ? x - w / 2 : x, id = nid("w");
  DEFS.push(`<clipPath id="cp${id}"><rect id="cr${id}" x="${f(x0 - 6)}" y="${f(y - size * 1.1)}" width="0" height="${f(size * 1.6)}"/></clipPath>`);
  L.push(`tl.fromTo("#cr${id}",{attr:{width:0}},{attr:{width:${f(w + 16)}},duration:${f(dur)},ease:"none",immediateRender:false},${f(t)});`);
  let inner = esc(str);
  if (hi && str.includes(hi)) inner = esc(str).replace(esc(hi), `<tspan fill="${ORANGE}">${esc(hi)}</tspan>`);
  return `<text x="${f(x0)}" y="${f(y)}" font-size="${size}" font-weight="${wt}" fill="${c}" clip-path="url(#cp${id})">${inner}</text>`;
}
function card(w, h, { fill = CARD, stroke = BORDER, sw = 6, off = 9, dash = null, sh = SHADOW, id = "" } = {}) {
  return `<rect x="${-w / 2 + off}" y="${-h / 2 + off}" width="${w}" height="${h}" rx="8" fill="${sh}"/><rect ${id ? `id="${id}"` : ""} x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
}
function tab(label, x, y, { fill = ORANGE, c = "#FFFFFF" } = {}) {
  const w = tw(label.toUpperCase(), 24, "pjs700") + 44 + label.length * 3.6;
  return `<rect x="${f(x - w / 2)}" y="${y - 24}" width="${f(w)}" height="48" rx="6" fill="${fill}"/>` + T(label.toUpperCase(), x + 1.8, y + 8, { size: 24, wt: 700, c, ls: 3.6 });
}
function arrow(x1, y1, x2, y2, t, { c = ORANGE, w = 10, dur = 0.5, id = null, hs = 26 } = {}) {
  const a = Math.atan2(y2 - y1, x2 - x1), b1 = a + Math.PI * 0.84, b2 = a - Math.PI * 0.84;
  const hd = `M${f(x2 + hs * Math.cos(b1))} ${f(y2 + hs * Math.sin(b1))} L${f(x2)} ${f(y2)} L${f(x2 + hs * Math.cos(b2))} ${f(y2 + hs * Math.sin(b2))}`;
  id = id || nid("ar");
  return dpath(`M${x1} ${y1} L${x2} ${y2}`, { c, w, t, dur, id: id + "l" }) + dpath(hd, { c, w, t: t + dur * 0.8, dur: 0.2, id: id + "h" });
}
const checkPath = (x, y, s) => `M${x} ${y} L${f(x + s * 0.36)} ${f(y + s * 0.42)} L${f(x + s)} ${f(y - s * 0.62)}`;
const infinity = (cx, cy, w, h) => `M${cx} ${cy} C${f(cx + w * 0.25)} ${f(cy - h)} ${f(cx + w * 0.5)} ${f(cy - h)} ${f(cx + w * 0.5)} ${cy} C${f(cx + w * 0.5)} ${f(cy + h)} ${f(cx + w * 0.25)} ${f(cy + h)} ${cx} ${cy} C${f(cx - w * 0.25)} ${f(cy - h)} ${f(cx - w * 0.5)} ${f(cy - h)} ${f(cx - w * 0.5)} ${cy} C${f(cx - w * 0.5)} ${f(cy + h)} ${f(cx - w * 0.25)} ${f(cy + h)} ${cx} ${cy}`;
function frac(num, den, cx, y, { size = 60, c = INK, t, dur = 0.8, anchor = "middle" } = {}) {
  const w = Math.max(tw(num, size), tw(den, size)) + 24;
  return writeOn(num, cx, y - 12, size, t, dur * 0.7, { c, anchor: "middle" }) + dpath(`M${f(cx - w / 2)} ${y + 8} H${f(cx + w / 2)}`, { c, w: 5, t: t + dur * 0.6, dur: 0.25 }) + writeOn(den, cx, y + size * 0.95, size, t + dur * 0.8, 0.35, { c, anchor: "middle" });
}

// ---------- patterns ----------
DEFS.push(
  `<pattern id="dotsG" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="5" cy="5" r="2.7" fill="${HALF}"/></pattern>`,
  `<pattern id="dotsO" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="6" cy="6" r="3.6" fill="${ORANGE}"/></pattern>`,
  `<pattern id="dotsOD" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="3.5" cy="3.5" r="1.7" fill="#B53A08"/></pattern>`,
  `<pattern id="dotsE" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="4.5" cy="4.5" r="1.6" fill="#1B2766"/></pattern>`,
  `<linearGradient id="gSun" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="0.48" stop-color="#fff"/><stop offset="0.62" stop-color="#000"/></linearGradient>`,
  `<linearGradient id="gSunI" x1="0" y1="0" x2="1" y2="1"><stop offset="0.3" stop-color="#000"/><stop offset="0.55" stop-color="#fff"/><stop offset="0.95" stop-color="#fff"/></linearGradient>`,
  `<mask id="mSun" maskUnits="userSpaceOnUse" x="-300" y="-300" width="600" height="600"><rect x="-300" y="-300" width="600" height="600" fill="url(#gSun)"/></mask>`,
  `<mask id="mSunI" maskUnits="userSpaceOnUse" x="-300" y="-300" width="600" height="600"><rect x="-300" y="-300" width="600" height="600" fill="url(#gSunI)"/></mask>`,
  `<linearGradient id="gFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>`,
  `<mask id="mFloor"><rect x="0" y="1480" width="1080" height="440" fill="url(#gFloor)"/></mask>`
);
const sun = (r = 190) => `<circle r="${r}" fill="${ORANGE}" mask="url(#mSun)"/><circle r="${r}" fill="url(#dotsO)" mask="url(#mSunI)"/>`;
function skyline() {
  let s = 91; const rnd = () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  let x = -20, out = "";
  while (x < 1100) {
    const w = 74 + Math.floor(rnd() * 70), h = 170 + Math.floor(rnd() * 260), y = 1128 - h;
    out += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${SKYF}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#dotsG)" opacity="0.75"/>`;
    for (let wy = y + 22; wy < 1100; wy += 34) for (let wx = x + 14; wx < x + w - 16; wx += 26) if (rnd() > 0.25) out += `<rect x="${wx}" y="${wy}" width="12" height="18" fill="${BG}" opacity="0.85"/>`;
    x += w + 6 + Math.floor(rnd() * 12);
  }
  return out;
}
function hero(p, { armL = 8, armR = -8 } = {}) {
  const torso = "M-60 -400 Q-60 -440 -24 -440 L24 -440 Q60 -440 60 -400 L60 -206 Q60 -196 50 -196 L-50 -196 Q-60 -196 -60 -206Z";
  DEFS.push(`<clipPath id="ct${p}"><path d="${torso}"/></clipPath>`);
  return `<ellipse cx="0" cy="3" rx="84" ry="11" fill="#000" opacity=".3"/>
<rect x="-37" y="-214" width="31" height="204" rx="12" fill="${PANTS}"/><rect x="6" y="-214" width="31" height="204" rx="12" fill="${PANTS}"/>
<rect x="-52" y="-20" width="50" height="20" rx="10" fill="${BORDER}"/><rect x="2" y="-20" width="50" height="20" rx="10" fill="${BORDER}"/>
<path d="${torso}" fill="${ORANGE}"/><rect x="6" y="-440" width="56" height="246" fill="url(#dotsOD)" clip-path="url(#ct${p})"/>
${G(p + "aL", `<rect x="-14" y="-6" width="28" height="172" rx="14" fill="${ORANGE}"/><circle cx="0" cy="170" r="15" fill="${SKIN}"/>`, -60, -410, { r: armL, op: 1 })}
${G(p + "aR", `<rect x="-14" y="-6" width="28" height="172" rx="14" fill="${ORANGE}"/><circle cx="0" cy="170" r="15" fill="${SKIN}"/>`, 60, -410, { r: armR, op: 1 })}
<rect x="-14" y="-462" width="28" height="28" fill="#767A90"/><circle cx="0" cy="-492" r="42" fill="${SKIN}"/>
<path d="M-74 -538 L0 -566 L74 -538 L0 -512Z" fill="${PANTS}"/><path d="M-40 -534 L-40 -516 Q0 -500 40 -516 L40 -534Z" fill="${PANTS}"/>
<path d="M64 -541 L67 -498" stroke="${ORANGE}" stroke-width="5" stroke-linecap="round"/><circle cx="67" cy="-494" r="7" fill="${ORANGE}"/>`;
}

// ---------- HUD ----------
const B = [0, 18.99, 31.18, 41.6, 52.08, 59.26, 76.45, 90.11];
const TAGS = ["০১ প্রশ্ন", "০২ প্রথম ধাপ", "০৩ চেইন রিয়্যাকশন", "০৪ উদাহরণ", "০৫ Base Case", "০৬ Inductive Step", "০৭ Computer Science", "০৮ মনে রেখো"];
const regMark = (x, y) => `<g stroke="${HUD}" stroke-width="2.5" fill="none" opacity=".85"><circle cx="${x}" cy="${y}" r="13"/><path d="M${x - 24} ${y} H${x + 24} M${x} ${y - 24} V${y + 24}"/></g>`;
let hud = `<rect id="prog" x="0" y="0" width="0" height="6" fill="${ORANGE}"/>` + regMark(1034, 46) + regMark(46, 1874) + regMark(1034, 1874);
L.push(`tl.fromTo("#prog",{attr:{width:0}},{attr:{width:1080},duration:${AUDIO},ease:"none",immediateRender:false},0);`);
hud += T("UDDHAR · DISCRETE MATH", 86, 1880, { size: 18, wt: 600, ls: 3, c: HUD, anchor: "start" });
TAGS.forEach((label, i) => {
  const t0 = B[i], t1 = i + 1 < B.length ? B[i + 1] : AUDIO + 0.2, w = tw(label, 30) + 40;
  hud += `<g id="tag${i}" opacity="0"><rect x="196" y="92" width="${f(w)}" height="56" rx="6" fill="${SUBBG}" stroke="${CREAM}" stroke-width="2"/>${T(label, 196 + w / 2, 130, { size: 30, c: "#FFFFFF" })}</g>`;
  hud += `<text id="ep${i}" x="990" y="1882" font-size="18" font-weight="600" letter-spacing="3" fill="${HUD}" text-anchor="end" opacity="0">EP.01 · 0${i + 1}</text>`;
  L.push(`tl.set("#tag${i}",{opacity:1},${f(t0 + 0.05)});tl.set("#tag${i}",{opacity:0},${f(t1)});tl.set("#ep${i}",{opacity:0.85},${f(t0 + 0.05)});tl.set("#ep${i}",{opacity:0},${f(t1)});`);
});

// =====================================================================================
// WORLD (0 -> 41.6): ground, dominoes, hero. S1 question + falling row, S2 base case, S3 inductive step
// =====================================================================================
const GY = 1130, DW = 56, DH = 290, DX = 95, PX0 = 340;
const pivot = (i) => PX0 + DX * i;
const wd = [];
wd.push(G("sunW", sun(190), 830, 520, { op: 0 })); pop("sunW", 0.1, { dy: 50, s0: 1, dur: 1.2, ease: "power2.out" });
wd.push(G("skyW", skyline(), 0, 0, { op: 0 })); pop("skyW", 0.15, { dy: 40, s0: 1, dur: 0.8, ease: "power2.out" });
fadeTo("skyW", S(4), 1, 0.12, 2.5);
wd.push(`<g id="gndW" opacity="0"><path d="M0 ${GY} H1080" stroke="${HALF}" stroke-width="5"/><path d="M0 ${GY + 66} H1080" stroke="${HALF}" stroke-width="3" stroke-dasharray="26 18" opacity=".6"/></g>`); show("gndW", 0.1);
function domino(i, fill = CARD, numC = INK) {
  return `<rect id="DR${i}_@" x="${-DW}" y="${-DH}" width="${DW}" height="${DH}" rx="7" fill="${fill}" stroke="${BORDER}" stroke-width="4"/><path d="M${-DW} ${-DH / 2} H0" stroke="${BORDER}" stroke-width="3"/>` +
    `<text id="DN${i}_@" x="${-DW / 2}" y="${-DH * 0.72}" font-size="34" font-weight="700" fill="${numC}" text-anchor="middle">${i + 1}</text><circle cx="${-DW / 2}" cy="${-DH * 0.25}" r="7" fill="${ORANGE}"/>`;
}
// set A: falling row (S1)
const fallT = [2.35, 3.75, 5.2, 6.9, 7.5, 8.1, 8.7, 9.3];
for (let i = 0; i < 8; i++) wd.push(G(`dA${i}`, domino(i).replaceAll("_@", "_A"), pivot(i), GY, { op: 1 }));
for (let i = 0; i < 8; i++) mv(`dA${i}`, fallT[i], { r: 68, dur: 0.6, ease: "power2.in" });
// set B: standing row (S2, S3)
for (let i = 0; i < 8; i++) wd.push(G(`dB${i}`, domino(i).replaceAll("_@", "_B") + T(`P(${i + 1})`, -DW / 2, -DH - 14, { size: 26, wt: 700, c: TX }), pivot(i), GY, { op: 0 }));
for (let i = 0; i < 8; i++) { show(`dB${i}`, B[1] + 0.05 + i * 0.04, 0.3); hide(`dA${i}`, B[1] - 0.1, 0.3); }
wd.push(G("dots", T(". . .", 0, 0, { size: 44, wt: 700, c: TX }), 1048, GY - 60, { op: 0 })); show("dots", B[1] + 0.4);
// hero (stays through the world)
wd.push(G("heroW", hero("hw", { armR: -6 }), 110, GY, { s: 0.8, op: 0 })); pop("heroW", 0.15, { dx: -120, s0: 0.8, dur: 0.7, ease: "power2.out" });
L.push(`tl.fromTo("#hwaR",{attr:{transform:"${tf({ x: 60, y: -410, r: -6, s: 1 })}"}},{attr:{transform:"${tf({ x: 60, y: -410, r: -76, s: 1 })}"},duration:0.6,ease:"power2.inOut",immediateRender:false},1.7);`);
L.push(`tl.fromTo("#hwaR",{attr:{transform:"${tf({ x: 60, y: -410, r: -76, s: 1 })}"}},{attr:{transform:"${tf({ x: 60, y: -410, r: -6, s: 1 })}"},duration:0.8,ease:"power2.inOut",immediateRender:false},3.3);`);

// ---- S1 captions (0 - 18.99)
wd.push(G("q1", card(900, 220) + T("একটা ডমিনো পড়লে কী হয়?", 0, 22, { size: 64, wt: 700 }), 540, 400, { r: -1, op: 0 })); pop("q1", 0.2, { dy: -50, s0: 0.92, dur: 0.5 });
hide("q1", S(1) - 0.1, 0.35);
wd.push(G("chain", tab("Chain reaction", 0, 0), 640, 690, { r: -3, op: 0 })); pop("chain", S(3) - 0.1, { dx: 30, s0: 0.95, dur: 0.4 }); hide("chain", S(4) - 0.1, 0.3);
wd.push(G("qdisc", `<circle r="120" fill="${CARD}" stroke="${BORDER}" stroke-width="7"/>` + T("?", 0, 62, { size: 190, wt: 700, c: ORANGE }), 800, 440, { op: 0 })); pop("qdisc", S(4), { s0: 0.4, dur: 0.5 });
wd.push(G("pw", card(560, 250) + micro("Mathematics-এর একটা", -250, -62) + T("Powerful", -250, 14, { size: 66, wt: 700, anchor: "start" }) + T("proof technique", -250, 90, { size: 66, wt: 700, anchor: "start", c: ORANGE }), 330, 420, { r: -1, op: 0 })); pop("pw", S(5) + 0.4, { dx: -80, s0: 1, dur: 0.6, ease: "power2.out" });
mv("qdisc", S(5) + 0.2, { x: 880, y: 470, s: 0.8, dur: 0.8 });
hide("pw", S(6) - 0.15, 0.35); hide("qdisc", S(6) - 0.15, 0.35); fadeTo("sunW", S(6) - 0.2, 1, 0.22, 0.6);
const ttl = T("Mathematical", 0, -10, { size: 108, wt: 800, c: TX }) + T("Induction", 0, 110, { size: 108, wt: 800, c: TX }) + dpath("M-300 150 Q0 168 300 150", { c: ORANGE, w: 9, t: S(6) + 0.8, dur: 0.6, id: "ulI" });
wd.push(G("ttl", ttl, 540, 410, { op: 0 })); pop("ttl", S(6) + 0.1, { dy: 30, s0: 0.9, dur: 0.6, ease: "power2.out" }); hide("ttl", B[1] - 0.1, 0.35);

// ---- S2 base case (18.99 - 31.18)
const stmt = card(920, 300) + micro("Statement", -430, -100) + T("P(n)", -380, 28, { size: 120, wt: 800, c: ORANGE, anchor: "start" }) +
  writeOn("সব positive integer n-এর", -120, -10, 46, S(8), 2.4) + writeOn("জন্য সত্য", -120, 60, 46, S(8) + 2.4, 1.2);
wd.push(G("stm", stmt, 540, 400, { r: -1, op: 0 })); pop("stm", S(7), { dy: -50, s0: 0.93, dur: 0.5 }); hide("stm", B[2] - 0.1, 0.35);
// first domino turns orange + ring + check
recolor("DRB0_B".replace("DRB0_B", "DR0_B"), S(10) - 0.4, "fill", CREAM, ORANGE, 0.4); recolor("DN0_B", S(10) - 0.4, "fill", INK, "#FFFFFF", 0.4);
wd.push(G("ring1", dpath(`M${pivot(0) - DW - 14} ${GY - DH - 18} H${pivot(0) + 14} V${GY + 6} H${pivot(0) - DW - 14}Z`, { c: ORANGE, w: 7, t: S(10) - 0.3, dur: 0.6, id: "ringP1" }), 0, 0, { op: 1 }));
wd.push(G("p1chk", `<circle r="46" fill="${CARD}" stroke="${BORDER}" stroke-width="5"/>` + dpath(checkPath(-22, 2, 44), { c: ORANGE, w: 10, t: S(10) + 0.5, dur: 0.4, id: "p1c" }), pivot(0) - DW / 2, 690, { op: 0 })); pop("p1chk", S(10) + 0.3, { dy: 20, s0: 0.5, dur: 0.4 });
wd.push(G("tBase", tab("Base case", 0, 0), 520, GY + 120, { op: 0 })); pop("tBase", S(11) - 0.05, { dy: 20, s0: 1, dur: 0.4, ease: "power2.out" });
wd.push(`<g id="baseArr" opacity="1">${arrow(430, GY + 100, pivot(0) - DW / 2 + 6, GY + 24, S(11) + 0.1, { c: ORANGE, w: 8, dur: 0.4, id: "ba" })}</g>`);
hide("tBase", B[2] - 0.1, 0.3); hide("baseArr", B[2] - 0.1, 0.3); hide("p1chk", B[2] - 0.1, 0.3); hide("ring1", B[2] - 0.1, 0.3);

// ---- S3 inductive step (31.18 - 41.6)
const rule = card(920, 300, { stroke: ORANGE }) + micro("Any step k", -430, -100, { c: ORANGE, op: 1 }) +
  T("P(k)", -300, 40, { size: 112, wt: 800 }) + T("P(k+1)", 270, 40, { size: 112, wt: 800 }) +
  dpath("M-170 20 H40", { c: ORANGE, w: 14, t: S(13) + 0.6, dur: 0.4, id: "rl" }) + dpath("M0 -22 L42 20 L0 62", { c: ORANGE, w: 14, t: S(13) + 0.95, dur: 0.2, id: "rh" });
wd.push(G("rule", rule, 540, 400, { r: 1, op: 0 })); pop("rule", S(12) + 0.6, { dy: -50, s0: 0.93, dur: 0.5 });
const hopT = [S(14) - 0.1, S(14) + 0.7, S(14) + 1.5, S(14) + 2.3];
for (let i = 0; i < 4; i++) {
  const x1 = pivot(i) - DW / 2, x2 = pivot(i + 1) - DW / 2, y0 = GY - DH - 50;
  wd.push(`<g>${dpath(`M${x1} ${y0} Q${(x1 + x2) / 2} ${y0 - 80} ${x2 - 6} ${y0 - 2}`, { c: ORANGE, w: 7, t: hopT[i], dur: 0.45, id: `hop${i}` })}${dpath(`M${x2 - 26} ${y0 - 30} L${x2 - 4} ${y0 + 4} L${x2 + 4} ${y0 - 28}`, { c: ORANGE, w: 7, t: hopT[i] + 0.35, dur: 0.15, id: `hoph${i}` })}</g>`);
  recolor(`DR${i + 1}_B`, hopT[i] + 0.4, "fill", CREAM, ORANGE, 0.3); recolor(`DN${i + 1}_B`, hopT[i] + 0.4, "fill", INK, "#FFFFFF", 0.3);
}
wd.push(G("tStep", tab("Inductive step", 0, 0), 720, GY + 120, { op: 0 })); pop("tStep", S(15) - 0.05, { dy: 20, s0: 1, dur: 0.4, ease: "power2.out" });
const world = `<g id="world" opacity="1">${wd.join("\n")}</g>`;
fadeTo("world", B[3] - 0.35, 1, 0, 0.4);

// =====================================================================================
// S4 example (41.6 - 52.08): the claim
// =====================================================================================
const s4 = [];
const claim = card(960, 640) + micro("The claim · P(n)", -440, -270) +
  writeOn("1 + 2 + 3 + ... + n", 0, -50, 92, S(18), 3.6, { anchor: "middle" }) +
  T("=", -330, 150, { size: 110, wt: 700, c: ORANGE }) +
  frac("n(n + 1)", "2", 100, 150, { size: 92, t: S(18) + 3.9, dur: 0.9 });
s4.push(G("claim", claim, 540, 700, { r: -0.6, op: 0 })); pop("claim", S(16) + 0.2, { dy: 60, s0: 0.93, dur: 0.6 });
s4.push(G("forall", tab("for every positive integer n", 0, 0, { fill: BORDER }), 540, 1090, { op: 0 })); pop("forall", S(19) + 0.2, { dy: 16, s0: 1, dur: 0.4, ease: "power2.out" });
const sc4 = `<g id="sc4" opacity="0">${s4.join("\n")}</g>`;

// =====================================================================================
// S5 base case (52.08 - 59.26)
// =====================================================================================
const s5 = [];
const bc = card(940, 700) + micro("Test n = 1", -440, -300) +
  writeOn("n = 1", 0, -170, 110, S(21) - 0.1, 0.9, { c: ORANGE, anchor: "middle", wt: 800 }) +
  `<rect x="-440" y="-90" width="400" height="330" rx="8" fill="none" stroke="${BORDER}" stroke-width="4"/><rect x="40" y="-90" width="400" height="330" rx="8" fill="none" stroke="${BORDER}" stroke-width="4"/>` +
  micro("Left side", -420, -52) + micro("Right side", 60, -52);
s5.push(G("bcCard", bc, 540, 640, { r: 0.6, op: 0 })); pop("bcCard", S(20), { dy: 60, s0: 0.93, dur: 0.55 });
s5.push(G("bcL", T("1", -240, 126, { size: 170, wt: 800 }), 540, 640, { op: 0 })); pop("bcL", S(22), { dy: 20, s0: 0.5, dur: 0.4 });
s5.push(G("bcR", T("1(1 + 1)", 240, 30, { size: 56, wt: 700 }) + `<path d="M130 56 H350" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` + T("2", 240, 112, { size: 56, wt: 700 }) + T("= 1", 240, 196, { size: 80, wt: 800, c: ORANGE }), 540, 640, { op: 0 })); pop("bcR", S(23), { dy: 20, s0: 0.6, dur: 0.4 });
s5.push(G("bcEq", dpath("M-26 -22 H26", { c: ORANGE, w: 12, t: S(23) + 0.6, dur: 0.25, id: "eqa" }) + dpath("M-26 22 H26", { c: ORANGE, w: 12, t: S(23) + 0.75, dur: 0.25, id: "eqb" }), 540, 710, { op: 1 }));
s5.push(G("bcOk", `<circle r="64" fill="${ORANGE}"/>` + dpath(checkPath(-30, 4, 60), { c: "#FFFFFF", w: 13, t: S(24) + 0.2, dur: 0.45, id: "bcOkc" }), 540, 1100, { op: 0 })); pop("bcOk", S(24), { s0: 0.4, dur: 0.45 });
s5.push(G("bcTab", tab("Base case true", 0, 0), 540, 1210, { op: 0 })); pop("bcTab", S(24) + 0.3, { dy: 16, s0: 1, dur: 0.4, ease: "power2.out" });
const sc5 = `<g id="sc5" opacity="0">${s5.join("\n")}</g>`;

// =====================================================================================
// S6 inductive step (59.26 - 76.45)
// =====================================================================================
const s6 = [];
const ca = card(940, 260) + micro("Assume P(k) is true", -430, -92) +
  writeOn("1 + 2 + ... + k", -420, -10, 62, S(27), 2.2) + writeOn("= k(k + 1) / 2", -420, 74, 62, S(27) + 2.2, 1.5);
s6.push(G("cA", ca, 540, 400, { r: -0.5, op: 0 })); pop("cA", S(25) + 0.1, { dy: -40, s0: 0.93, dur: 0.5 });
const cb = card(940, 300, { stroke: ORANGE }) + micro("Add (k + 1) to both sides", -430, -112, { c: ORANGE, op: 1 }) +
  writeOn("1 + ... + k + (k + 1)", -420, -22, 54, S(29), 1.4, { hi: "(k + 1)" }) + writeOn("= k(k + 1) / 2 + (k + 1)", -420, 70, 54, S(29) + 1.0, 1.3, { hi: "(k + 1)" });
s6.push(G("cB", cb, 540, 730, { r: 0.5, op: 0 })); pop("cB", S(29) - 0.15, { dy: 50, s0: 0.93, dur: 0.5 });
s6.push(`<g>${arrow(540, 540, 540, 576, S(29) - 0.3, { c: ORANGE, w: 9, dur: 0.3, id: "a6a", hs: 20 })}</g>`);
const cc = card(940, 330, { stroke: ORANGE, sh: ORANGE_D }) + micro("Simplify", -430, -122, { c: ORANGE, op: 1 }) +
  T("=", -380, 40, { size: 100, wt: 700, c: ORANGE }) + frac("(k + 1)(k + 2)", "2", 70, 50, { size: 76, c: ORANGE, t: S(31), dur: 1.6 });
s6.push(G("cC", cc, 540, 1085, { r: -0.4, op: 0 })); pop("cC", S(30) + 0.1, { dy: 50, s0: 0.93, dur: 0.5 });
s6.push(`<g>${arrow(540, 888, 540, 920, S(30), { c: ORANGE, w: 9, dur: 0.3, id: "a6b", hs: 20 })}</g>`);
s6.push(G("cOk", `<circle r="58" fill="${ORANGE}"/>` + dpath(checkPath(-27, 4, 54), { c: "#FFFFFF", w: 12, t: S(34) + 0.2, dur: 0.4, id: "cOkc" }), 900, 1010, { op: 0 })); pop("cOk", S(33) + 0.2, { s0: 0.4, dur: 0.4 });
s6.push(G("cTab", tab("P(k+1) is true", 0, 0), 540, 1290, { op: 0 })); pop("cTab", S(34), { dy: 16, s0: 1, dur: 0.4, ease: "power2.out" });
const sc6 = `<g id="sc6" opacity="0">${s6.join("\n")}</g>`;

// =====================================================================================
// S7 computer science (76.45 - 90.11): recursion + data structure
// =====================================================================================
const s7 = [];
const codeRows = [["def total(n):", INK, false], ["    if n == 1: return 1", INK, true], ["    return n + total(n - 1)", INK, true]];
const code = card(940, 340) + micro("Recursive algorithm", -430, -130) +
  `<rect id="rowBase" x="-440" y="-8" width="880" height="72" rx="6" fill="${ORANGE}" opacity="0"/><rect id="rowStep" x="-440" y="76" width="880" height="72" rx="6" fill="${ORANGE}" opacity="0"/>` +
  T("def total(n):", -410, -34, { size: 46, anchor: "start", c: INK }) + T("if n == 1: return 1", -380, 44, { size: 46, anchor: "start", c: INK, id: "tBaseRow" }) + T("return n + total(n - 1)", -380, 122, { size: 46, anchor: "start", c: INK, id: "tStepRow" });
s7.push(G("code", code, 540, 440, { r: -0.5, op: 0 })); pop("code", S(35) - 0.1, { dy: -40, s0: 0.93, dur: 0.5 });
L.push(`tl.fromTo("#rowBase",{opacity:0},{opacity:1,duration:0.3,immediateRender:false},${f(S(35) + 1.2)});tl.fromTo("#tBaseRow",{fill:"${INK}"},{fill:"#FFFFFF",duration:0.3,immediateRender:false},${f(S(35) + 1.2)});`);
L.push(`tl.fromTo("#rowStep",{opacity:0},{opacity:1,duration:0.3,immediateRender:false},${f(S(35) + 2.6)});tl.fromTo("#tStepRow",{fill:"${INK}"},{fill:"#FFFFFF",duration:0.3,immediateRender:false},${f(S(35) + 2.6)});`);
s7.push(G("tBaseTag", tab("Base case", 0, 0, { fill: BORDER }), 880, 470, { op: 0 })); // small markers at right of rows
s7.push(G("tStepTag", tab("Step", 0, 0, { fill: BORDER }), 920, 554, { op: 0 }));
pop("tBaseTag", S(35) + 1.3, { dx: 20, s0: 1, dur: 0.3 }); pop("tStepTag", S(35) + 2.7, { dx: 20, s0: 1, dur: 0.3 });
const names = ["total(4)", "total(3)", "total(2)", "total(1) = 1"];
const bx = 300;
names.forEach((nm, i) => {
  const y = 780 + i * 135;
  s7.push(G(`cl${i}`, card(400, 96, { off: 6, sw: 5 }) + T(nm, 0, 17, { size: 42, wt: 700 }), bx, y, { op: 0 })); pop(`cl${i}`, S(35) + 2.2 + i * 0.7, { dx: -40, s0: 1, dur: 0.4, ease: "power2.out" });
  if (i < 3) s7.push(arrow(bx, y + 52, bx, y + 86, S(35) + 2.6 + i * 0.7, { c: TINT, w: 7, dur: 0.25, id: `cla${i}`, hs: 16 }));
});
// binary tree = data structure
const nodes = [[830, 790], [710, 920], [950, 920], [650, 1050], [770, 1050], [890, 1050], [1010, 1050]];
const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]];
edges.forEach(([a, b], k) => s7.push(dpath(`M${nodes[a][0]} ${nodes[a][1]} L${nodes[b][0]} ${nodes[b][1]}`, { c: TINT, w: 5, t: S(35) + 3.2 + k * 0.15, dur: 0.3, id: `te${k}` })));
nodes.forEach(([x, y], k) => { s7.push(G(`tn${k}`, `<circle r="30" fill="${CARD}" stroke="${BORDER}" stroke-width="5" id="tnc${k}"/>`, x, y, { op: 0 })); pop(`tn${k}`, S(35) + 3.0 + k * 0.15, { s0: 0.5, dur: 0.3 }); });
s7.push(G("dsLab", micro("Data structure", 0, 0, { c: TX, op: 0.8, anchor: "middle" }), 830, 730, { op: 0 })); pop("dsLab", S(35) + 3.0, { dy: 10, s0: 1, dur: 0.3 });
// 83.31: result is not enough
s7.push(G("res", `<rect x="-130" y="-52" width="260" height="104" rx="8" fill="${BORDER}" stroke="${CREAM}" stroke-width="4"/>` + T("= 10", 0, 28, { size: 64, wt: 800, c: TX }), 800, 1200, { op: 0 })); pop("res", S(36), { dy: 20, s0: 0.5, dur: 0.4 });
s7.push(G("whyQ", `<circle r="40" fill="${ORANGE}"/>` + T("?", 0, 24, { size: 64, wt: 800, c: "#FFFFFF" }), 940, 1200, { op: 0 })); pop("whyQ", S(36) + 0.8, { s0: 0.4, dur: 0.4 }); hide("whyQ", S(37) + 0.2, 0.3);
// 86.14: every step is valid
names.forEach((nm, i) => {
  const y = 780 + i * 135, t = S(37) + 0.1 + i * 0.45;
  s7.push(G(`ck${i}`, `<circle r="30" fill="${ORANGE}"/>` + dpath(checkPath(-14, 2, 28), { c: "#FFFFFF", w: 7, t: t + 0.15, dur: 0.25, id: `ckp${i}` }), bx + 250, y, { op: 0 })); pop(`ck${i}`, t, { s0: 0.4, dur: 0.3 });
});
nodes.forEach((_, k) => recolor(`tnc${k}`, S(37) + 0.3 + k * 0.28, "fill", CREAM, ORANGE, 0.3));
const sc7 = `<g id="sc7" opacity="0">${s7.join("\n")}</g>`;

// =====================================================================================
// S8 final payoff (90.11 - 102.84)
// =====================================================================================
const s8 = [];
function condCard(id, num, title, sub, y) {
  return G(id, card(940, 250) + `<circle cx="-370" cy="0" r="62" fill="${ORANGE}"/>` + T(num, -370, 38, { size: 100, wt: 800, c: "#FFFFFF" }) + T(title, -280, -18, { size: 64, wt: 800, anchor: "start" }) + T(sub, -280, 62, { size: 54, wt: 600, anchor: "start", c: ORANGE }), 540, y, { op: 0 });
}
s8.push(condCard("k1", "1", "Base case", "P(1) is true", 360)); pop("k1", S(41) - 0.3, { dy: 50, s0: 0.93, dur: 0.5 });
s8.push(condCard("k2", "2", "Inductive step", "", 650)); pop("k2", S(42) - 0.3, { dy: 50, s0: 0.93, dur: 0.5 });
s8.push(G("k2t", T("P(k)", -280, 62, { size: 54, wt: 600, anchor: "start", c: ORANGE }) + `<path d="M-130 46 H-40" stroke="${ORANGE}" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M-62 26 L-36 46 L-62 66" stroke="${ORANGE}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` + T("P(k+1)", -10, 62, { size: 54, wt: 600, anchor: "start", c: ORANGE }), 540, 650, { op: 0 })); pop("k2t", S(42) - 0.3, { dy: 50, s0: 0.93, dur: 0.5 });
// arrow glyph in card 2 is text; replace by drawn arrow for font safety
// final domino row (small) + infinity
const dw = 40, dh = 210, ddx = 70, px0 = 170;
for (let i = 0; i < 11; i++) {
  s8.push(G(`dC${i}`, `<rect x="${-dw}" y="${-dh}" width="${dw}" height="${dh}" rx="6" fill="${i === 0 ? ORANGE : CARD}" stroke="${BORDER}" stroke-width="4"/><path d="M${-dw} ${-dh / 2} H0" stroke="${BORDER}" stroke-width="3"/><circle cx="${-dw / 2}" cy="${-dh * 0.25}" r="6" fill="${ORANGE}"/>`, px0 + ddx * i, GY, { op: 0 }));
  pop(`dC${i}`, S(42) + 0.6 + i * 0.05, { dy: 20, s0: 1, dur: 0.3, ease: "power2.out" });
  mv(`dC${i}`, S(43) + 0.1 + i * 0.32, { r: 68, dur: 0.5, ease: "power2.in" });
}
s8.push(`<g id="gnd8" opacity="0"><path d="M0 ${GY} H1080" stroke="${HALF}" stroke-width="5"/></g>`); show("gnd8", S(42));
s8.push(G("inf", dpath(infinity(0, 0, 150, 62), { c: ORANGE, w: 14, t: S(43) + 2.2, dur: 1.2, id: "infp" }), 900, 840, { op: 1 }));
s8.push(G("chainLab", micro("chain of infinity", 0, 0, { c: TX, op: 0.85, anchor: "middle" }), 900, 905, { op: 0 })); pop("chainLab", S(43) + 2.6, { dy: 10, s0: 1, dur: 0.4 });
const sc8 = `<g id="sc8" opacity="0">${s8.join("\n")}</g>`;

const endCard = `<g id="endc" opacity="0"><rect width="1080" height="1920" fill="${BORDER}"/><rect width="1080" height="1920" fill="url(#dotsE)" opacity=".6"/>
  <image href="assets/Uddhar_icon.svg" x="340" y="640" width="400" height="400"/>
  ${T("UDDHAR · DISCRETE MATH", 540, 1130, { size: 30, wt: 700, c: "#FFFFFF", ls: 8, op: 0.9 })}
</g>`;
L.push(`tl.fromTo("#endc",{opacity:0},{opacity:1,duration:0.6,ease:"power1.inOut",immediateRender:false},${f(AUDIO + 0.35)});`);

// ---------- scene visibility ----------
[["sc4", B[3], B[4]], ["sc5", B[4], B[5]], ["sc6", B[5], B[6]], ["sc7", B[6], B[7]], ["sc8", B[7], AUDIO + 0.35]].forEach(([id, a, b], i) => {
  L.push(`tl.fromTo("#${id}",{opacity:0},{opacity:1,duration:0.35,ease:"power1.out",immediateRender:false},${f(a)});`);
  if (id !== "sc8") L.push(`tl.fromTo("#${id}",{opacity:1},{opacity:0,duration:0.3,ease:"power1.in",immediateRender:false},${f(b - 0.3)});`);
});

// ---------- subtitles (script text as written) ----------
const SUBS = PH.map((p) => p.text.replace(/[,،]$/, ",").trim());
const MAXW = 860;
function wrapLines(text) {
  const words = text.split(" "), lines = []; let cur = "";
  for (const w of words) { const tryS = cur ? cur + " " + w : w; if (tw(tryS, 44) > MAXW && cur) { lines.push(cur); cur = w; } else cur = tryS; }
  if (cur) lines.push(cur);
  if (lines.length === 2) { let best = lines, bw = Math.max(tw(lines[0], 44), tw(lines[1], 44)); for (let k = 1; k < words.length; k++) { const a = words.slice(0, k).join(" "), b = words.slice(k).join(" "), m = Math.max(tw(a, 44), tw(b, 44)); if (m < bw && m <= MAXW) { bw = m; best = [a, b]; } } return best; }
  return lines;
}
const subs = [];
SUBS.forEach((text, i) => {
  const a = S(i), b = E(i);
  if (wrapLines(text).length > 2) {
    const words = text.split(" "); let best = 1, bd = 1e9; for (let k = 1; k < words.length; k++) { const d = Math.abs(words.slice(0, k).join(" ").length - text.length / 2); if (d < bd) { bd = d; best = k; } }
    const t1 = words.slice(0, best).join(" "), t2 = words.slice(best).join(" "), m = a + (b - a) * (t1.length / text.length);
    subs.push({ text: t1, start: a, end: m }, { text: t2, start: m, end: b });
  } else subs.push({ text, start: a, end: b });
});
const SUBY = 1440;
const subSvg = subs.map((s, i) => {
  const lines = wrapLines(s.text), lw = Math.max(...lines.map((l) => tw(l, 44))), w = Math.min(lw + 64, 960), h = lines.length * 60 + 30;
  return `<g id="sub${i}" opacity="0"><rect x="${f(540 - w / 2)}" y="${f(SUBY - h / 2)}" width="${f(w)}" height="${h}" fill="${SUBBG}" fill-opacity=".95"/><rect x="${f(540 - w / 2)}" y="${f(SUBY - h / 2)}" width="8" height="${h}" fill="${ORANGE}"/>` +
    lines.map((ln, k) => `<text x="${f(544)}" y="${f(SUBY - h / 2 + 22 + 44 * 0.8 + k * 60)}" font-size="44" font-weight="600" fill="${CREAM}" text-anchor="middle">${esc(ln)}</text>`).join("") + `</g>`;
}).join("\n");
subs.forEach((s, i) => L.push(`tl.set("#sub${i}",{opacity:1},${f(s.start)});tl.set("#sub${i}",{opacity:0},${f(Math.max(s.end - 0.04, s.start + 0.2))});`));
const ts = (x) => { const h = Math.floor(x / 3600), m = Math.floor((x % 3600) / 60), s = Math.floor(x % 60), ms = Math.round((x % 1) * 1000); return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`; };
fs.writeFileSync(path.join(here, "../subtitles.srt"), subs.map((s, i) => `${i + 1}\n${ts(s.start)} --> ${ts(Math.max(s.end - 0.04, s.start + 0.2))}\n${wrapLines(s.text).join("\n")}\n`).join("\n"), "utf8");

const logo = `<image id="logo" href="assets/Uddhar_icon.svg" x="44" y="48" width="120" height="120"/>`;
L.push(`tl.fromTo("#logo",{opacity:0},{opacity:1,duration:0.5,immediateRender:false},0.1);`);

const html = `<!doctype html>
<html lang="bn">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=1080, height=1920"/>
<title>EP01 — Mathematical Induction (Animation Story, Dark)</title>
<script src="assets/vendor/gsap.min.js"></script>
<style>
@font-face{font-family:"Plus Jakarta Sans";font-weight:500;src:url("assets/fonts/plus-jakarta-sans-latin-500-normal.woff2") format("woff2")}
@font-face{font-family:"Plus Jakarta Sans";font-weight:600;src:url("assets/fonts/plus-jakarta-sans-latin-600-normal.woff2") format("woff2")}
@font-face{font-family:"Plus Jakarta Sans";font-weight:700;src:url("assets/fonts/plus-jakarta-sans-latin-700-normal.woff2") format("woff2")}
@font-face{font-family:"Plus Jakarta Sans";font-weight:800;src:url("assets/fonts/plus-jakarta-sans-latin-700-normal.woff2") format("woff2")}
@font-face{font-family:"Hind Siliguri";font-weight:500;src:url("assets/fonts/hind-siliguri-bengali-500-normal.woff2") format("woff2")}
@font-face{font-family:"Hind Siliguri";font-weight:600;src:url("assets/fonts/hind-siliguri-bengali-600-normal.woff2") format("woff2")}
@font-face{font-family:"Hind Siliguri";font-weight:700;src:url("assets/fonts/hind-siliguri-bengali-600-normal.woff2") format("woff2")}
@font-face{font-family:"Hind Siliguri";font-weight:800;src:url("assets/fonts/hind-siliguri-bengali-600-normal.woff2") format("woff2")}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:${BG}}
#root{position:relative;width:1080px;height:1920px;background:${BG};font-family:"Plus Jakarta Sans","Hind Siliguri",sans-serif}
#stage{position:absolute;left:0;top:0;width:1080px;height:1920px}
svg text{font-family:"Plus Jakarta Sans","Hind Siliguri",sans-serif}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="1080" data-height="1920">
  <div id="stage" class="clip" data-start="0" data-duration="${DUR}" data-track-index="0" data-layout-ignore>
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg" data-layout-ignore>
      <defs>${DEFS.join("")}</defs>
      <image href="assets/paper.png" x="0" y="0" width="1080" height="1920"/>
      <rect x="0" y="1480" width="1080" height="440" fill="url(#dotsG)" mask="url(#mFloor)" opacity=".5"/>
      ${world}
      ${sc4}
      ${sc5}
      ${sc6}
      ${sc7}
      ${sc8}
      ${endCard}
      ${hud}
      ${logo}
${subSvg}
    </svg>
  </div>
  <audio id="vo" src="assets/voiceover.mp3" data-start="0" data-volume="1"></audio>
</div>
<script>
const tl = gsap.timeline({ paused: true });
${L.join("\n")}
window.__timelines = window.__timelines || {};
window.__timelines["main"] = tl;
tl.seek(0);
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(here, "index.html"), html, "utf8");
console.log("index.html written:", (html.length / 1024).toFixed(0), "KB;", subs.length, "subtitle chunks;", uid, "ids");
