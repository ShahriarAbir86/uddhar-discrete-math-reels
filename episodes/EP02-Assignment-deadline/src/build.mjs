// EP02 — The Assignment Deadline Trap. "Animation Story" style (styles/animation-story/STYLE_GUIDE.md), 1080x1920.
// Run: node build.mjs  -> writes index.html + ../subtitles.srt. Timing from ../qa/phrase_times.json (measured pauses of the real voiceover).
// Every visual is a pure function of timeline time (paused GSAP timeline, seeked by HyperFrames).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const PH = JSON.parse(fs.readFileSync(path.join(here, "../qa/phrase_times.json"), "utf8"));
const FW = JSON.parse(fs.readFileSync(path.join(here, "../qa/font_widths.json"), "utf8"));
if (PH.length !== 42) throw new Error("expected 42 phrase entries, got " + PH.length);
const S = (i) => PH[i].start;
const E = (i) => PH[i].end;
const AUDIO = 95.24, DUR = 97.9;

// ---- tokens (styles/animation-story/tokens.json) ----
const NAVY = "#101B49", ORANGE = "#F2530F", PAPER = "#EEE8D8", CARD = "#F6F3E8", GREY = "#6A645F", MID = "#9A948C", LIGHT = "#C9C2B6";
const TINT = "#6C74A6", LILAC = "#B9BEE0", SUBBG = "#0B1235", HUD = "#7F84A3", SKIN = "#8A8EA3", NIGHT = "#0C1440", NIGHT2 = "#1B2766", NIGHT3 = "#3A4686";
const f = (n) => +Number(n).toFixed(2);

function tw(str, size, face = "pjs600") {
  let w = 0;
  for (const ch of str) w += /[ঀ-৿।]/.test(ch) ? (FW.hind600[ch] ?? 0.5) : (FW[face][ch] ?? 0.6);
  return w * size;
}

// ---------- builders ----------
const L = [];       // timeline code
const DEFS = [];
let uid = 0;
const nid = (p) => `${p}${++uid}`;
const TR = {};      // id -> current transform state
const tf = (o) => `translate(${f(o.x)} ${f(o.y)}) rotate(${f(o.r)}) scale(${f(o.s)})`;
function G(id, inner, x = 0, y = 0, { r = 0, s = 1, op = 0 } = {}) {
  TR[id] = { x, y, r, s };
  return `<g id="${id}" transform="${tf(TR[id])}" opacity="${op}">${inner}</g>`;
}
// pop in: opacity 0->1, slides/scales from offset
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
function show(id, t, dur = 0.3) { fadeTo(id, t, 0, 1, dur); }
function hide(id, t, dur = 0.3) { fadeTo(id, t, 1, 0, dur); }
function recolor(id, t, prop, from, to, dur = 0.3) { L.push(`tl.fromTo("#${id}",{${prop}:"${from}"},{${prop}:"${to}",duration:${f(dur)},ease:"power1.inOut",immediateRender:false},${f(t)});`); }
function dpath(d, { c = NAVY, w = 6, t, dur = 0.5, ease = "power1.inOut", fill = "none", id = null, op = 1 } = {}) {
  id = id || nid("d");
  L.push(`tl.set("#${id}",{opacity:${op}},${f(t)});tl.fromTo("#${id}",{strokeDashoffset:1.1},{strokeDashoffset:0,duration:${f(dur)},ease:"${ease}",immediateRender:false},${f(t)});`);
  return `<path id="${id}" d="${d}" pathLength="1" fill="${fill}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 1.2" stroke-dashoffset="1.1" opacity="0"/>`;
}
const esc = (s) => s.replace(/&/g, "&amp;");
function T(str, x, y, { size = 44, c = NAVY, wt = 600, anchor = "middle", ls = 0, op = 1, id = "" } = {}) {
  return `<text ${id ? `id="${id}"` : ""} x="${f(x)}" y="${f(y)}" font-size="${size}" font-weight="${wt}" fill="${c}" text-anchor="${anchor}"${ls ? ` letter-spacing="${ls}"` : ""}${op !== 1 ? ` fill-opacity="${op}"` : ""}>${esc(str)}</text>`;
}
const micro = (str, x, y, o = {}) => T(str.toUpperCase(), x, y, { size: 20, wt: 600, ls: 3.2, c: NAVY, op: 0.55, anchor: "start", ...o });
// write-on text (left->right reveal) used for statements
function writeOn(str, x, y, size, t, dur, { c = NAVY, wt = 600, anchor = "start", hi = null } = {}) {
  const w = tw(str, size), x0 = anchor === "middle" ? x - w / 2 : x;
  const id = nid("w");
  DEFS.push(`<clipPath id="cp${id}"><rect id="cr${id}" x="${f(x0 - 6)}" y="${f(y - size * 1.1)}" width="0" height="${f(size * 1.6)}"/></clipPath>`);
  L.push(`tl.fromTo("#cr${id}",{attr:{width:0}},{attr:{width:${f(w + 16)}},duration:${f(dur)},ease:"none",immediateRender:false},${f(t)});`);
  let inner = esc(str);
  if (hi && str.includes(hi)) inner = esc(str).replace(esc(hi), `<tspan fill="${ORANGE}">${esc(hi)}</tspan>`);
  return `<text x="${f(x0)}" y="${f(y)}" font-size="${size}" font-weight="${wt}" fill="${c}" clip-path="url(#cp${id})">${inner}</text>`;
}
function card(w, h, { fill = CARD, stroke = NAVY, sw = 6, off = 9, dash = null, sh = null, id = "" } = {}) {
  return `<rect x="${-w / 2 + off}" y="${-h / 2 + off}" width="${w}" height="${h}" rx="8" fill="${sh || stroke}"/><rect ${id ? `id="${id}"` : ""} x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
}
function tab(label, x, y, { fill = NAVY, c = "#FFFFFF" } = {}) {
  const w = tw(label.toUpperCase(), 22, "pjs700") + 40 + label.length * 3.4;
  return `<rect x="${f(x - w / 2)}" y="${y - 22}" width="${f(w)}" height="44" rx="6" fill="${fill}"/>` + T(label.toUpperCase(), x + 1.7, y + 8, { size: 22, wt: 700, c, ls: 3.4 });
}
function tick(x, y, s, c = ORANGE, w = 8) { return `M${x} ${y} L${x + s * 0.38} ${y + s * 0.42} L${x + s} ${y - s * 0.6}`; }
function arrow(x1, y1, x2, y2, t, { c = NAVY, w = 12, dur = 0.5, id = null, hs = 34, rev = false } = {}) {
  const a = Math.atan2(y2 - y1, x2 - x1), b1 = a + Math.PI * 0.84, b2 = a - Math.PI * 0.84;
  const hd = `M${f(x2 + hs * Math.cos(b1))} ${f(y2 + hs * Math.sin(b1))} L${f(x2)} ${f(y2)} L${f(x2 + hs * Math.cos(b2))} ${f(y2 + hs * Math.sin(b2))}`;
  id = id || nid("ar");
  return dpath(`M${x1} ${y1} L${x2} ${y2}`, { c, w, t, dur, id: id + "l" }) + dpath(hd, { c, w, t: t + dur * 0.8, dur: 0.2, id: id + "h" });
}

const notPath = (c = "currentColor", k = 1) => `<path d="M-38 -26 H38 V30" transform="scale(${k})" stroke="${c}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
// ---------- patterns ----------
DEFS.push(
  `<pattern id="dotsG" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="5" cy="5" r="2.7" fill="${GREY}"/></pattern>`,
  `<pattern id="dotsO" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="6" cy="6" r="3.6" fill="${ORANGE}"/></pattern>`,
  `<pattern id="dotsOD" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="3.5" cy="3.5" r="1.7" fill="#B53A08"/></pattern>`,
  `<pattern id="dotsN" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="4.5" cy="4.5" r="1.6" fill="${NIGHT3}"/></pattern>`,
  `<linearGradient id="gSun" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="0.48" stop-color="#fff"/><stop offset="0.62" stop-color="#000"/></linearGradient>`,
  `<linearGradient id="gSunI" x1="0" y1="0" x2="1" y2="1"><stop offset="0.3" stop-color="#000"/><stop offset="0.55" stop-color="#fff"/><stop offset="0.95" stop-color="#fff"/></linearGradient>`,
  `<mask id="mSun" maskUnits="userSpaceOnUse" x="-300" y="-300" width="600" height="600"><rect x="-300" y="-300" width="600" height="600" fill="url(#gSun)"/></mask>`,
  `<mask id="mSunI" maskUnits="userSpaceOnUse" x="-300" y="-300" width="600" height="600"><rect x="-300" y="-300" width="600" height="600" fill="url(#gSunI)"/></mask>`,
  `<linearGradient id="gFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>`,
  `<mask id="mFloor"><rect x="0" y="1480" width="1080" height="440" fill="url(#gFloor)"/></mask>`,
  `<linearGradient id="gFog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="0.6" stop-color="#fff"/></linearGradient>`,
  `<mask id="mFog" maskUnits="userSpaceOnUse" x="0" y="880" width="1080" height="260"><rect x="0" y="880" width="1080" height="260" fill="url(#gFog)"/></mask>`
);

// ---------- shared pieces ----------
function sun(r = 190) {
  return `<circle r="${r}" fill="${ORANGE}" mask="url(#mSun)"/><circle r="${r}" fill="url(#dotsO)" mask="url(#mSunI)"/>`;
}
function skyline() {
  let s = 91, rnd = () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  let x = -20, out = "";
  while (x < 1100) {
    const w = 74 + Math.floor(rnd() * 70), h = 170 + Math.floor(rnd() * 260), y = 1128 - h;
    out += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#BDB7AB"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#dotsG)" opacity="0.75"/>`;
    for (let wy = y + 22; wy < 1100; wy += 34) for (let wx = x + 14; wx < x + w - 16; wx += 26) if (rnd() > 0.25) out += `<rect x="${wx}" y="${wy}" width="12" height="18" fill="${PAPER}" opacity="0.8"/>`;
    out += `<path d="M${x} ${y} l${w * 0.2} -10 l${w * 0.25} 8 l${w * 0.3} -9 l${w * 0.25} 11 Z" fill="#BDB7AB"/>`;
    x += w + 6 + Math.floor(rnd() * 12);
  }
  return out;
}
function hero(p, { pants = NAVY, cap = NAVY, armL = 8, armR = -8 } = {}) {
  const torso = "M-60 -400 Q-60 -440 -24 -440 L24 -440 Q60 -440 60 -400 L60 -206 Q60 -196 50 -196 L-50 -196 Q-60 -196 -60 -206Z";
  DEFS.push(`<clipPath id="ct${p}"><path d="${torso}"/></clipPath>`);
  return `<ellipse cx="0" cy="3" rx="84" ry="11" fill="${NAVY}" opacity=".16"/>
<rect x="-37" y="-214" width="31" height="204" rx="12" fill="${pants}"/><rect x="6" y="-214" width="31" height="204" rx="12" fill="${pants}"/>
<rect x="-52" y="-20" width="50" height="20" rx="10" fill="#0A1030"/><rect x="2" y="-20" width="50" height="20" rx="10" fill="#0A1030"/>
<path d="${torso}" fill="${ORANGE}"/><rect x="6" y="-440" width="56" height="246" fill="url(#dotsOD)" clip-path="url(#ct${p})"/>
${G(p + "aL", `<rect x="-14" y="-6" width="28" height="172" rx="14" fill="${ORANGE}"/><circle cx="0" cy="170" r="15" fill="${SKIN}"/>`, -60, -410, { r: armL, op: 1 })}
${G(p + "aR", `<rect x="-14" y="-6" width="28" height="172" rx="14" fill="${ORANGE}"/><circle cx="0" cy="170" r="15" fill="${SKIN}"/>`, 60, -410, { r: armR, op: 1 })}
<rect x="-14" y="-462" width="28" height="28" fill="#767A90"/><circle cx="0" cy="-492" r="42" fill="${SKIN}"/>
<path d="M-74 -538 L0 -566 L74 -538 L0 -512Z" fill="${cap}"/><path d="M-40 -534 L-40 -516 Q0 -500 40 -516 L40 -534Z" fill="${cap}"/>
<path d="M64 -541 L67 -498" stroke="${ORANGE}" stroke-width="5" stroke-linecap="round"/><circle cx="67" cy="-494" r="7" fill="${ORANGE}"/>`;
}
function bubble(w, h, tailPts) {
  return card(w, h, { off: 8 }).replace(/rx="8"/g, 'rx="34"') + tailPts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${CARD}" stroke="${NAVY}" stroke-width="5"/>`).join("");
}

// ---------- HUD (always on) ----------
const SC = [
  [0, "০১ ডেডলাইন ট্র্যাপ"], [11.75, "০২ পরিস্থিতি"], [21.5, "০৩ P আর Q"], [33.83, "০৪ মূল statement"],
  [46.64, "০৫ Converse ও Contrapositive"], [64.65, "০৬ আসল পার্থক্য"], [76.2, "০৭ Programming-এর সাথে যোগ"], [81.85, "০৮ তোমার challenge"],
];
const regMark = (x, y) => `<g stroke="${HUD}" stroke-width="2.5" fill="none" opacity=".85"><circle cx="${x}" cy="${y}" r="13"/><path d="M${x - 24} ${y} H${x + 24} M${x} ${y - 24} V${y + 24}"/></g>`;
let hud = `<rect id="prog" x="0" y="0" width="0" height="6" fill="${ORANGE}"/>` + regMark(1034, 46) + regMark(46, 1874) + regMark(1034, 1874);
L.push(`tl.fromTo("#prog",{attr:{width:0}},{attr:{width:1080},duration:${AUDIO},ease:"none",immediateRender:false},0);`);
hud += micro("Uddhar · Discrete Math", 86, 1880, { op: 0.8, c: HUD, size: 18 });
SC.forEach(([t0, label], i) => {
  const t1 = i + 1 < SC.length ? SC[i + 1][0] : AUDIO + 0.2;
  const w = tw(label, 30, "pjs600") + 40;
  hud += `<g id="tag${i}" opacity="0"><rect x="196" y="92" width="${f(w)}" height="56" rx="6" fill="${SUBBG}" stroke="${PAPER}" stroke-width="2"/>${T(label, 196 + w / 2, 130, { size: 30, c: "#FFFFFF", wt: 600 })}</g>`;
  hud += `<text id="ep${i}" x="990" y="1882" font-size="18" font-weight="600" letter-spacing="3" fill="${HUD}" text-anchor="end" opacity="0">EP.02 · 0${i + 1}</text>`;
  L.push(`tl.set("#tag${i}",{opacity:1},${f(t0 + 0.05)});tl.set("#tag${i}",{opacity:0},${f(t1)});tl.set("#ep${i}",{opacity:0.85},${f(t0 + 0.05)});tl.set("#ep${i}",{opacity:0},${f(t1)});`);
});

// =====================================================================================
// SCENE 1  (0 → 11.75)  night desk, deadline
// =====================================================================================
const s1 = [];
s1.push(`<rect width="1080" height="1920" fill="${NIGHT}"/><rect width="1080" height="1920" fill="url(#dotsN)" opacity=".55"/>`);
s1.push(`<rect x="0" y="1130" width="1080" height="790" fill="${NIGHT2}"/><rect x="0" y="1130" width="1080" height="790" fill="url(#dotsN)" opacity=".7"/><path d="M0 1130 H1080" stroke="${NIGHT3}" stroke-width="5"/>`);
// clock card
const clockInner = card(780, 290, { sh: "#050A24", off: 10 }) +
  micro("Tonight", -350, -102, { c: NAVY }) +
  T("11:45", -70, 48, { size: 150, wt: 700, c: NAVY }) +
  T("PM", 245, 48, { size: 64, wt: 700, c: ORANGE }) +
  `<rect x="-350" y="88" width="700" height="16" rx="8" fill="${LIGHT}"/><rect id="timebar" x="-350" y="88" width="700" height="16" rx="8" fill="${ORANGE}"/>` +
  micro("15 min left", 350, -102, { c: NAVY, anchor: "end" });
s1.push(G("clk", clockInner, 540, 345, { op: 0 }));
pop("clk", 0.15, { dy: -50, s0: 0.92, dur: 0.6 });
L.push(`tl.fromTo("#timebar",{attr:{width:700}},{attr:{width:610},duration:11,ease:"none",immediateRender:false},0.4);`);
// desk + laptop + hero (seated, side view)
const laptopDoc = `
<rect x="590" y="600" width="370" height="250" rx="10" fill="${NAVY}"/><rect x="604" y="614" width="342" height="222" rx="4" fill="${CARD}"/>`;
const deskInner = `
<rect x="400" y="880" width="640" height="26" rx="6" fill="${NIGHT3}"/><rect x="430" y="906" width="26" height="224" fill="${NIGHT3}"/><rect x="984" y="906" width="26" height="224" fill="${NIGHT3}"/>
<path d="M560 880 L990 880 L970 846 L580 846Z" fill="#2B3A7A" stroke="${NIGHT3}" stroke-width="3"/>
${laptopDoc}
<rect x="150" y="800" width="16" height="250" rx="8" fill="${NIGHT3}"/><rect x="150" y="1030" width="190" height="20" rx="10" fill="${NIGHT3}"/><rect x="240" y="1050" width="16" height="80" fill="${NIGHT3}"/><rect x="170" y="1126" width="150" height="8" rx="4" fill="${NIGHT3}"/>
<g><rect x="230" y="1012" width="250" height="40" rx="18" fill="#2B3A7A"/><rect x="448" y="1042" width="40" height="88" rx="14" fill="#2B3A7A"/><rect x="440" y="1110" width="84" height="20" rx="10" fill="#0A1030"/></g>`;
const sitHero = `<ellipse cx="320" cy="1132" rx="190" ry="10" fill="#000" opacity=".25"/>` +
  `<g transform="translate(255 1035) rotate(8)"><rect x="-50" y="-250" width="100" height="250" rx="34" fill="${ORANGE}"/><rect x="6" y="-246" width="44" height="244" rx="22" fill="url(#dotsOD)"/>
   <rect x="-14" y="-282" width="28" height="36" fill="#767A90"/><circle cx="0" cy="-322" r="44" fill="${SKIN}"/>
   <path d="M-76 -366 L0 -395 L76 -366 L0 -340Z" fill="${NIGHT3}"/><path d="M-40 -362 L-40 -344 Q0 -328 40 -344 L40 -362Z" fill="${NIGHT3}"/><path d="M66 -369 L69 -326" stroke="${ORANGE}" stroke-width="5" stroke-linecap="round"/><circle cx="69" cy="-322" r="7" fill="${ORANGE}"/>
   <g transform="translate(0 -214) rotate(-76)"><rect x="-14" y="-6" width="28" height="188" rx="14" fill="${ORANGE}"/><circle cx="0" cy="186" r="15" fill="${SKIN}"/></g></g>`;
s1.push(G("desk", deskInner + sitHero, 0, 0, { op: 0 }));
pop("desk", 0.7, { dy: 70, s0: 1, dur: 0.7, ease: "power2.out" });
// laptop screen content
const doc = `
${T("ASSIGNMENT 03", 620, 650, { size: 22, wt: 700, c: NAVY, anchor: "start", ls: 2 })}
<rect x="620" y="672" width="300" height="10" rx="5" fill="${LIGHT}"/><rect x="620" y="696" width="250" height="10" rx="5" fill="${LIGHT}"/><rect x="620" y="720" width="280" height="10" rx="5" fill="${LIGHT}"/>
<rect x="622" y="768" width="30" height="30" rx="5" fill="none" stroke="${NAVY}" stroke-width="5"/>${T("Check deadline", 668, 794, { size: 26, wt: 600, c: NAVY, anchor: "start" })}`;
s1.push(G("doc", doc, 0, 0, { op: 0 }));
pop("doc", S(1), { dy: 0, s0: 1, dur: 0.5, ease: "power1.out" });
s1.push(G("qmark", T("?", 0, 0, { size: 120, wt: 700, c: ORANGE }), 905, 770, { op: 0 }));
s1.push(G("ring", dpath("M622 762 Q620 810 640 806 L930 810 Q950 770 930 760 Q790 748 640 752 Q620 752 622 770", { c: ORANGE, w: 6, t: S(2) + 0.2, dur: 0.6, id: "ringp" }), 0, 0, { op: 1 }));
pop("qmark", S(2) + 0.7, { dy: 30, s0: 0.4, dur: 0.5 });
// deadline stamp
const stamp = `<rect x="-258" y="-48" width="516" height="96" rx="8" fill="${ORANGE}"/><rect x="-246" y="-37" width="492" height="74" rx="4" fill="none" stroke="#FFD9C8" stroke-width="3"/>` + T("DEADLINE: 12:00 AM", 0, 15, { size: 44, wt: 700, c: "#FFFFFF", ls: 1 });
s1.push(G("stamp", stamp, 770, 545, { r: -4, op: 0 }));
pop("stamp", S(1) + 1.1, { s0: 1.5, r0: -14, dur: 0.35, ease: "power3.out" });
// thought bubble
const bub1 = bubble(420, 190, [[-150, 125, 14], [-182, 160, 10], [-206, 190, 6]]) + T("STILL HAVE", 0, -6, { size: 54, wt: 700 });
s1.push(G("bub1", bub1, 300, 585, { op: 0 }));
// real bubble text (two lines, second orange) overlay for write-up at "Still have time"
s1.push(G("bub1t", T("TIME!", 0, 0, { size: 54, wt: 700, c: ORANGE }), 300, 646, { op: 0 }));
pop("bub1", S(3) + 0.1, { dy: 40, s0: 0.6, dur: 0.5 });
pop("bub1t", S(4) + 0.05, { dy: 12, s0: 0.8, dur: 0.35 });
// sc1 group
const sc1 = `<g id="sc1" opacity="1">${s1.join("\n")}</g>`;
// clipped wipe at B1
const B1 = 11.75;
DEFS.push(`<clipPath id="wipeClip"><rect id="wipeRect" x="0" y="0" width="1080" height="1920"/></clipPath>`);
L.push(`tl.fromTo("#wipeRect",{attr:{x:0,width:1080}},{attr:{x:1080,width:0},duration:0.7,ease:"power2.inOut",immediateRender:false},${f(B1 - 0.1)});`);

// =====================================================================================
// SCENE 2  (11.75 → 21.5)  situation
// =====================================================================================
const s2 = [];
s2.push(G("sun2", sun(190), 830, 560, { op: 0 }));
pop("sun2", B1 + 0.1, { dy: 60, s0: 1, dur: 1.2, ease: "power2.out" });
s2.push(G("sky2", skyline(), 0, 0, { op: 0 }));
pop("sky2", B1 + 0.2, { dy: 40, s0: 1, dur: 0.8, ease: "power2.out" });
s2.push(`<g id="ground2" opacity="0"><path d="M0 1130 H1080" stroke="#555473" stroke-width="5"/><path d="M0 1196 H1080" stroke="#555473" stroke-width="3" stroke-dasharray="26 18" opacity=".55"/></g>`);
show("ground2", B1 + 0.1);
s2.push(G("hero2", hero("h2", { armR: -6 }), 250, 1130, { s: 0.95, op: 0 }));
pop("hero2", B1 + 0.25, { dx: -140, s0: 0.95, dur: 0.8, ease: "power2.out" });
// thought bubble: STILL HAVE TIME?
const bub2 = bubble(520, 200, [[-290, 80, 14], [-338, 100, 9], [-370, 114, 5]]) + T("STILL HAVE", -60, -6, { size: 56, wt: 700 }) + T("TIME", -60, 56, { size: 56, wt: 700 });
s2.push(G("bub2", bub2, 660, 640, { op: 0 }));
s2.push(G("q2", T("?", 0, 0, { size: 150, wt: 700, c: ORANGE }), 880, 700, { op: 0 }));
pop("bub2", B1 + 0.9, { dy: 30, s0: 0.7, dur: 0.5 });
pop("q2", B1 + 1.3, { dy: 20, s0: 0.5, dur: 0.5 });
// statement card (13.97 - 18)
const stm = card(900, 250, { off: 9 }) + micro("Statement", -420, -82) +
  writeOn("তুমি যদি deadline check না করো,", -400, -10, 48, S(6) + 0.0, 1.5) +
  writeOn("তাহলে ধরে নাও এখনো সময় আছে।", -400, 62, 48, S(7) - 0.05, 1.7, { hi: "সময়" });
s2.push(G("stm2", stm, 540, 335, { r: -1, op: 0 }));
pop("stm2", S(6) - 0.3, { dy: -60, s0: 0.95, dur: 0.5 });
// fade skyline progressively, statement away at 18.43, zoom question
fadeTo("sky2", S(6), 1, 0.35, 3.5);
L.push(`tl.fromTo("#sky2",{opacity:0.35},{opacity:0.05,duration:2.5,ease:"none",immediateRender:false},${f(S(8))});`);
hide("stm2", S(8) - 0.1, 0.4);
mv("bub2", S(8) - 0.05, { x: 560, y: 560, s: 1.12, dur: 1.2, ease: "power2.inOut" });
mv("q2", S(8) - 0.05, { x: 800, y: 1000, s: 3.2, dur: 1.5, ease: "power2.inOut" });
L.push(`tl.to("#hero2",{opacity:0.9,duration:0.01},${f(S(8))});`);
const sc2 = `<g id="sc2" opacity="0">${s2.join("\n")}</g>`;

// =====================================================================================
// SCENE 3  (21.5 → 33.83)  meet P and Q
// =====================================================================================
const B2 = 21.5, B3 = 33.83;
const s3 = [];
function pq(letter, id, cy, blockFill, title, bn, micro1) {
  const inner = card(900, 300, { off: 9 }) +
    `<rect x="-420" y="-110" width="190" height="220" rx="6" fill="${blockFill}"/>` + T(letter, -325, 52, { size: 150, wt: 700, c: "#FFFFFF" }) +
    micro(micro1, -200, -78, {}) + T(title, -200, -10, { size: 50, wt: 700, anchor: "start" }) + T(bn, -200, 72, { size: 40, wt: 600, anchor: "start", c: NAVY, op: 0.85 });
  s3.push(G(id, inner, 540, cy, { op: 0 }));
}
pq("P", "cardP", 400, NAVY, "Check the Deadline", "তুমি deadline check করেছো", "Proposition 1");
pq("Q", "cardQ", 790, NAVY, "Assume There Is Still Time", "তুমি মনে করছো এখনো সময় আছে", "Proposition 2");
pop("cardP", S(9) + 0.2, { dx: -200, s0: 1, dur: 0.6, ease: "power2.out" });
pop("cardQ", S(12) - 0.1, { dx: 200, s0: 1, dur: 0.6, ease: "power2.out" });
// highlight the P / Q block orange when spoken
L.push(`tl.fromTo("#cardP",{opacity:1},{opacity:1,duration:0.01,immediateRender:false},${f(S(10))});`);
// NOT P result card
const notInner = card(900, 300, { stroke: ORANGE, off: 9, sh: "#C23F0A" }) +
  micro("Result", -420, -110, { c: ORANGE, op: 1 }) +
  `<g transform="translate(-318 -4)">${notPath(ORANGE)}</g>` + T("P", -190, 62, { size: 190, wt: 700, c: NAVY }) +
  T("NOT P", 10, -20, { size: 54, wt: 700, anchor: "start", c: ORANGE }) + T("ডেডলাইন check করোনি", 10, 60, { size: 36, wt: 600, anchor: "start" });
s3.push(G("cardNP", notInner, 540, 1180, { op: 0 }));
pop("cardNP", S(14) + 0.35, { dy: 60, s0: 0.9, dur: 0.5 });
fadeTo("cardP", S(14), 1, 0.5, 0.4); fadeTo("cardQ", S(14), 1, 0.5, 0.4);
// emphasis ring at "nat P"
s3.push(G("npRing", dpath("M-410 -140 L410 -140 L410 140 L-410 140Z", { c: ORANGE, w: 8, t: S(15), dur: 0.35, id: "npRingP" }), 540, 1180, { op: 1 }));
const sc3 = `<g id="sc3" opacity="0">${s3.join("\n")}</g>`;

// =====================================================================================
// SCENES 4-6  (33.83 → 76.2)  formula cards: original, converse, contrapositive, equivalence
// =====================================================================================
const FS = 190, gap = 6;
const wNot = 100, wP = tw("P", FS, "pjs700"), wQ = tw("Q", FS, "pjs700");
const wA = wNot + gap + wP;
function glyph(id, ch, x, c = NAVY, op = 1) { return G(id, ch === "¬" ? notPath() : T(ch, 0, 62, { size: FS, wt: 700, c: "currentColor" }), x, 0, { op }).replace("<g id=", `<g style="color:${c}" id=`); }
// build a formula card; visible=false -> inner elements animate individually; true -> all visible with the root
function arcs(p, t, tOut) {
  return `<g id="${p}arcs" opacity="1">${dpath("M-215 -108 Q0 -210 215 -108", { c: ORANGE, w: 7, t, dur: 0.5, id: p + "a1" })}${dpath("M180 -138 L218 -104 L170 -84", { c: ORANGE, w: 7, t: t + 0.4, dur: 0.15, id: p + "a1h" })}${dpath("M215 108 Q0 210 -215 108", { c: ORANGE, w: 7, t, dur: 0.5, id: p + "a2" })}${dpath("M-180 138 L-218 104 L-170 84", { c: ORANGE, w: 7, t: t + 0.4, dur: 0.15, id: p + "a2h" })}</g>` +
    (L.push(`tl.fromTo("#${p}arcs",{opacity:1},{opacity:0,duration:0.4,immediateRender:false},${f(tOut)});`), "");
}
function fcard(p, label, micro1, visible, stroke = NAVY, extra = "") {
  const op = visible ? 1 : 0;
  const A = G(p + "A", glyph(p + "An", "¬", -wA / 2 + wNot / 2, NAVY, op) + glyph(p + "Ap", "P", -wA / 2 + wNot + gap + wP / 2, NAVY, op), -250, 0, { op: 1 });
  const B = G(p + "B", glyph(p + "Bq", "Q", 0, NAVY, op) + glyph(p + "Bn", "¬", 0, ORANGE, 0), 250, 0, { op: 1 });
  const arr = `<g id="${p}arr" opacity="${op}"><path id="${p}arl" d="M-100 -4 L98 -4" pathLength="1" stroke="${NAVY}" stroke-width="14" stroke-linecap="round" fill="none"/><path id="${p}arh" d="M64 -40 L104 -4 L64 32" stroke="${NAVY}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`;
  const body = card(920, 320, { stroke, id: p + "bd", off: 9 }) + micro(micro1, -430, -122, { id: p + "mi" }) + A + arr + B +
    `<g>${tab(label, 0, 160)}</g>` + extra;
  return body;
}
const FX = 540;
// ORIGINAL
s3.length = 0;
const sF = [];
sF.push(G("orig", fcard("o", "Original statement", "P = check deadline · Q = still time", false), FX, 760, { op: 0 }));
// S4 statement card at top
const stm4 = card(900, 250, { off: 9 }) + micro("Our statement", -420, -82) +
  writeOn("ডেডলাইন check না করলে,", -400, -8, 54, S(16) + 0.1, 1.1) +
  writeOn("এখনো সময় আছে।", -400, 66, 54, S(18), 1.3, { hi: "সময়" });
sF.push(G("stm4", stm4, 540, 365, { r: 1, op: 0 }));
pop("stm4", S(16) - 0.15, { dy: -60, s0: 0.95, dur: 0.5 });
pop("orig", S(19) - 0.25, { dy: 80, s0: 0.94, dur: 0.55 });
hide("stm4", S(19) + 0.2, 0.4);
// reveal formula pieces
pop("oAn", S(20) + 0.02, { dy: -30, s0: 0.5, dur: 0.35 });
pop("oAp", S(20) + 0.12, { dy: -30, s0: 0.5, dur: 0.35 });
L.push(`tl.set("#oarr",{opacity:1},${f(S(20) + 0.45)});tl.fromTo("#oarl",{strokeDashoffset:1.1},{strokeDashoffset:0,duration:0.4,ease:"power1.inOut",immediateRender:false},${f(S(20) + 0.45)});tl.fromTo("#oarh",{opacity:0},{opacity:1,duration:0.1,immediateRender:false},${f(S(20) + 0.8)});`);
L.push(`tl.set("#oarl",{strokeDasharray:"1 1.2",strokeDashoffset:1.1},0);`);
pop("oBq", S(20) + 0.7, { dy: -30, s0: 0.5, dur: 0.35 });
// highlight arrow + formula orange at 44.88 ("¬P arrow Q")
recolor("oarl", S(22), "stroke", NAVY, ORANGE); recolor("oarh", S(22), "stroke", NAVY, ORANGE);
recolor("oAn", S(22) + 0.05, "color", NAVY, ORANGE); recolor("oAp", S(22) + 0.1, "color", NAVY, ORANGE); recolor("oBq", S(22) + 0.15, "color", NAVY, ORANGE);
recolor("obd", S(22), "stroke", NAVY, ORANGE, 0.4);
sF.push(G("implies", T("IMPLIES", 0, 0, { size: 24, wt: 700, c: ORANGE, ls: 5 }), 540, 700, { op: 0 }));
pop("implies", S(22) + 0.1, { dy: 10, s0: 0.9, dur: 0.3 });
// S5: original moves to top, converse + contrapositive cards copy from it
mv("orig", S(23) - 0.15, { y: 390, dur: 0.8, ease: "power2.inOut" });
hide("implies", S(23) - 0.2, 0.2);
recolor("obd", S(23), "stroke", ORANGE, NAVY, 0.5);
["oAn", "oAp", "oBq"].forEach((id) => recolor(id, S(23) + 0.1, "color", ORANGE, NAVY, 0.4));
recolor("oarl", S(23), "stroke", ORANGE, NAVY, 0.4); recolor("oarh", S(23), "stroke", ORANGE, NAVY, 0.4);
// CONVERSE card
const cvSwapT = S(24) + 1.7;
sF.push(G("cv", fcard("c", "Converse", "swap the two sides", true, NAVY, arcs("c", cvSwapT - 0.2, cvSwapT + 0.9)), FX, 770, { op: 0 }));
pop("cv", S(24) + 0.05, { dy: -380, s0: 0.97, dur: 0.8, ease: "power2.inOut" });
// the swap: A and B exchange places with arcs
function swap(p, t, dur = 1.1) {
  mv(p + "A", t, { x: 0, y: -80, dur: dur / 2, ease: "power1.in" }); mv(p + "A", t + dur / 2, { x: 250, y: 0, dur: dur / 2, ease: "power1.out" });
  mv(p + "B", t, { x: 0, y: 80, dur: dur / 2, ease: "power1.in" }); mv(p + "B", t + dur / 2, { x: -250, y: 0, dur: dur / 2, ease: "power1.out" });
}
// converse: swap at ~51
swap("c", cvSwapT);
recolor("cbd", cvSwapT + 1.2, "stroke", NAVY, ORANGE, 0.4);
["cAn", "cAp", "cBq"].forEach((id) => recolor(id, cvSwapT + 1.2, "color", NAVY, ORANGE, 0.4));
// CONTRAPOSITIVE card
sF.push(G("cp", fcard("p", "Contrapositive", "negate both sides + swap", true, NAVY, arcs("p", S(29) - 1.1, S(29) + 0.2)), FX, 1150, { op: 0 }));
pop("cp", S(27) + 0.05, { dy: -760, s0: 0.97, dur: 0.9, ease: "power2.inOut" });
const cpT = S(27) + 1.3;
// negate: strike the ¬ on P-side, add ¬ on Q-side
const strike = dpath("M-26 -50 L26 50", { c: ORANGE, w: 10, t: cpT, dur: 0.3, id: "cpStrike" });
sF.push(G("cpstrike", `<g transform="translate(${-250 - wA / 2 + wNot / 2} 0)">${strike}</g>`, 0, 0, {}));
L.push(`tl.set("#cpstrike",{opacity:1},0);`);
fadeTo("pAn", cpT + 0.4, 1, 0, 0.3); fadeTo("cpstrike", cpT + 0.4, 1, 0, 0.3);
mv("pAp", cpT + 0.45, { x: 0, dur: 0.5 });
const wB2 = wNot + gap + wQ;
mv("pBq", cpT + 0.5, { x: -wB2 / 2 + wNot + gap + wQ / 2, dur: 0.5 });
mv("pBn", cpT + 0.5, { x: -wB2 / 2 + wNot / 2, dur: 0.01 });
pop("pBn", cpT + 0.55, { dy: -30, s0: 0.5, dur: 0.35 });
// ensure Bn visible element opacity via pop (Bn initial opacity 0 in fcard)
swap("p", S(29) - 0.9);
recolor("pbd", S(29) + 0.4, "stroke", NAVY, ORANGE, 0.4);
["pAp", "pBq"].forEach((id) => recolor(id, S(29) + 0.4, "color", NAVY, ORANGE, 0.4));
recolor("pBn", S(29) + 0.4, "color", ORANGE, ORANGE, 0.01);
// emphasis dimming in S5
fadeTo("orig", S(24), 1, 0.55, 0.4);
fadeTo("cv", S(27), 1, 0.55, 0.4);
// arcs elements (placed inside each card root so they follow)
// (added to roots via string replace below)
// S6: equivalence
mv("cp", S(31) - 0.3, { y: 880, dur: 0.9, ease: "power2.inOut" });
mv("orig", S(31) - 0.3, { y: 380, dur: 0.9, ease: "power2.inOut" });
fadeTo("orig", S(31) - 0.3, 0.55, 1, 0.5); fadeTo("cp", S(31) - 0.3, 0.55, 1, 0.5);
mv("cv", S(31) - 0.3, { x: 540, y: 1175, s: 0.62, dur: 0.9, ease: "power2.inOut" });
fadeTo("cv", S(31) - 0.3, 0.55, 0.0, 0.5);
recolor("obd", S(31), "stroke", NAVY, ORANGE, 0.4); recolor("pbd", S(31), "stroke", ORANGE, ORANGE, 0.01);
// ≡ symbol (drawn)
sF.push(G("eq", `${dpath("M-70 -34 H70", { c: ORANGE, w: 16, t: S(31) + 0.5, dur: 0.35, id: "eq1" })}${dpath("M-70 0 H70", { c: ORANGE, w: 16, t: S(31) + 0.7, dur: 0.35, id: "eq2" })}${dpath("M-70 34 H70", { c: ORANGE, w: 16, t: S(31) + 0.9, dur: 0.35, id: "eq3" })}`, 250, 640, { op: 1 }));
sF.push(G("eqtxt", T("LOGICALLY", 0, -6, { size: 44, wt: 700, c: ORANGE, anchor: "start", ls: 2 }) + T("EQUIVALENT", 0, 40, { size: 44, wt: 700, c: ORANGE, anchor: "start", ls: 2 }), 400, 640, { op: 0 }));
pop("eqtxt", S(31) + 1.4, { dx: -30, s0: 1, dur: 0.5, ease: "power2.out" });
// converse returns with question
fadeTo("cv", S(32) - 0.1, 0.0, 0.9, 0.5);
mv("cv", S(32) - 0.1, { x: 540, y: 1175, s: 0.62, dur: 0.01 });
sF.push(G("cvq", `<circle r="40" fill="${NAVY}"/>${T("?", 0, 24, { size: 66, wt: 700, c: "#FFFFFF" })}`, 900, 1075, { op: 0 }));
pop("cvq", S(32) + 0.5, { dy: 20, s0: 0.4, dur: 0.45 });
sF.push(G("cvtxt", T("NOT GUARANTEED", 0, 0, { size: 34, wt: 700, c: NAVY, ls: 4 }), 540, 1318, { op: 0 }));
pop("cvtxt", S(32) + 1.1, { dy: 14, s0: 1, dur: 0.4, ease: "power2.out" });
// closing emphasis
recolor("cbd", S(32) + 0.1, "stroke", ORANGE, NAVY, 0.4);
["cAn", "cAp", "cBq"].forEach((id) => recolor(id, S(32) + 0.1, "color", ORANGE, NAVY, 0.3));
fadeTo("eqtxt", S(33), 1, 1, 0.01);
const scF = `<g id="scF" opacity="0">${sF.join("\n")}</g>`;

// =====================================================================================
// SCENE 7  (76.2 → 81.85)  programming: IF / ELSE
// =====================================================================================
const B4 = 76.2, B5 = 81.85;
const s7 = [];
const chip = card(360, 110, { off: 7 }) + `<g transform="translate(-134 2)" style="color:${NAVY}">${notPath("currentColor", 0.42)}</g>` + T("P", -82, 30, { size: 76, wt: 700 }) + dpath("M-14 -2 H40", { c: NAVY, w: 8, t: S(34) + 0.3, dur: 0.25, id: "cArr" }) + dpath("M22 -24 L46 -2 L22 20", { c: NAVY, w: 8, t: S(34) + 0.5, dur: 0.15, id: "cArrH" }) + T("Q", 100, 30, { size: 76, wt: 700 });
s7.push(G("chip7", chip, 540, 270, { op: 0 }));
pop("chip7", B4 + 0.1, { dy: -30, s0: 0.9, dur: 0.5 });
s7.push(arrow(540, 345, 540, 455, S(34) + 0.2, { c: ORANGE, w: 9, dur: 0.5, id: "a7", hs: 26 }));
// code editor
const code = `<rect x="-450" y="-170" width="900" height="340" rx="14" fill="${NAVY}"/><rect x="-450" y="-170" width="900" height="56" rx="14" fill="#1B2766"/><rect x="-450" y="-130" width="900" height="16" fill="#1B2766"/>
<circle cx="-410" cy="-142" r="9" fill="${ORANGE}"/><circle cx="-380" cy="-142" r="9" fill="#9A948C"/><circle cx="-350" cy="-142" r="9" fill="#9A948C"/>
<rect id="cLine" x="-420" y="-96" width="840" height="64" rx="8" fill="${ORANGE}" opacity="0"/>
${T("if (!checked) {", -390, -52, { size: 46, wt: 600, c: "#FFFFFF", anchor: "start", ls: 1 })}
${T("stillTime = true;", -350, 28, { size: 46, wt: 600, c: LILAC, anchor: "start", ls: 1 })}
${T("}", -390, 100, { size: 46, wt: 600, c: "#FFFFFF", anchor: "start" })}`;
s7.push(G("code", code, 540, 600, { op: 0 }));
pop("code", S(34) + 0.35, { dy: 40, s0: 0.96, dur: 0.5 });
L.push(`tl.fromTo("#cLine",{opacity:0},{opacity:1,duration:0.3,immediateRender:false},${f(S(34) + 1.2)});`);
// branching diagram
const dia = `<path d="M0 -80 L150 0 L0 80 L-150 0Z" fill="${CARD}" stroke="${NAVY}" stroke-width="6"/>` + `<g transform="translate(-62 2)">${notPath(NAVY, 0.42)}</g>` + T("P ?", 24, 22, { size: 62, wt: 700 });
s7.push(G("dia", dia, 540, 930, { op: 0 }));
pop("dia", S(34) + 1.6, { dy: 30, s0: 0.8, dur: 0.5 });
s7.push(dpath("M440 1010 C360 1090 330 1120 320 1180", { c: ORANGE, w: 9, t: S(34) + 2.4, dur: 0.7, id: "br1" }));
s7.push(dpath("M296 1148 L320 1190 L350 1146", { c: ORANGE, w: 9, t: S(34) + 3.05, dur: 0.2, id: "br1h" }));
s7.push(dpath("M640 1010 C720 1090 750 1120 760 1180", { c: NAVY, w: 9, t: S(34) + 3.0, dur: 0.7, id: "br2" }));
s7.push(dpath("M734 1148 L760 1190 L790 1146", { c: NAVY, w: 9, t: S(34) + 3.65, dur: 0.2, id: "br2h" }));
s7.push(G("ifl", T("IF", 0, 0, { size: 36, wt: 700, c: ORANGE, ls: 4 }), 262, 1085, { op: 0 }));
s7.push(G("elsel", T("ELSE", 0, 0, { size: 36, wt: 700, c: NAVY, ls: 4 }), 835, 1085, { op: 0 }));
pop("ifl", S(34) + 2.5, { dy: 10, s0: 1, dur: 0.3 }); pop("elsel", S(34) + 3.1, { dy: 10, s0: 1, dur: 0.3 });
s7.push(G("outT", card(300, 110, { stroke: ORANGE, sh: "#C23F0A", off: 7 }) + T("Q", 0, 26, { size: 76, wt: 700, c: ORANGE }), 320, 1250, { op: 0 }));
s7.push(G("outF", card(300, 110, { off: 7, dash: "14 10" }) + T("no claim", 0, 18, { size: 44, wt: 600, c: NAVY }), 760, 1250, { op: 0 }));
pop("outT", S(34) + 3.2, { dy: 20, s0: 0.85, dur: 0.4 }); pop("outF", S(34) + 3.8, { dy: 20, s0: 0.85, dur: 0.4 });
const sc7 = `<g id="sc7" opacity="0">${s7.join("\n")}</g>`;

// =====================================================================================
// SCENE 8  (81.85 → 95.3)  challenge + reveal
// =====================================================================================
const s8 = [];
s8.push(G("hdr", `<rect x="-330" y="-50" width="660" height="100" rx="8" fill="${NAVY}"/>` + T("YOUR CHALLENGE", 0, 24, { size: 58, wt: 700, c: "#FFFFFF", ls: 3 }) + `<rect x="-330" y="46" width="170" height="8" fill="${ORANGE}"/>`, 540, 290, { r: -1.5, op: 0 }));
pop("hdr", S(35) + 0.05, { dy: -40, s0: 0.9, dur: 0.5 });
const qc = card(900, 400, { off: 9 }) + micro("Question", -420, -150) +
  T("If you check the deadline,", 0, -52, { size: 52, wt: 700 }) + T("you won't assume", 0, 18, { size: 52, wt: 700 }) + T("there is still time.", 0, 88, { size: 52, wt: 700, c: ORANGE }) +
  `<rect x="-420" y="128" width="840" height="3" fill="${LIGHT}"/>` + T("Express using P and Q", 0, 172, { size: 36, wt: 600, c: NAVY, op: 0.8 });
s8.push(G("qc", qc, 540, 640, { r: 1, op: 0 }));
pop("qc", S(36) - 0.1, { dy: 50, s0: 0.95, dur: 0.55 });
// P / Q reminder chips
s8.push(G("pchip", `<rect x="-200" y="-34" width="400" height="68" rx="8" fill="${CARD}" stroke="${NAVY}" stroke-width="4"/>` + T("P = check deadline", 0, 14, { size: 34, wt: 600 }), 300, 960, { op: 0 }));
s8.push(G("qchip", `<rect x="-200" y="-34" width="400" height="68" rx="8" fill="${CARD}" stroke="${NAVY}" stroke-width="4"/>` + T("Q = still time", 0, 14, { size: 34, wt: 600 }), 780, 960, { op: 0 }));
pop("pchip", S(38), { dy: 20, s0: 1, dur: 0.4 }); pop("qchip", S(38) + 0.3, { dy: 20, s0: 1, dur: 0.4 });
// answer slot
s8.push(G("ans", `<rect x="-450" y="-140" width="900" height="280" rx="8" fill="none" stroke="${NAVY}" stroke-width="5" stroke-dasharray="18 12"/>`, 540, 1180, { op: 0 }));
pop("ans", S(38) + 0.8, { dy: 20, s0: 1, dur: 0.4 });
s8.push(G("ansq", T("?", 0, 84, { size: 220, wt: 700, c: ORANGE }), 540, 1180, { op: 0 }));
pop("ansq", S(39), { dy: 0, s0: 0.5, dur: 0.5 });
L.push(`tl.fromTo("#ansq",{opacity:1},{opacity:0,duration:0.2,immediateRender:false},${f(S(41) - 0.05)});`);
// reveal: P -> ¬Q
const wP2 = tw("P", FS, "pjs700"), wN2 = 100, wQ2 = tw("Q", FS, "pjs700"), wB3 = wN2 + gap + wQ2;
s8.push(G("rP", T("P", 0, 62, { size: FS, wt: 700, c: ORANGE }), 540 - 290, 1180, { op: 0 }));
s8.push(G("rA", `<path d="M-90 -4 L88 -4" stroke="${ORANGE}" stroke-width="14" stroke-linecap="round" fill="none"/><path d="M56 -40 L96 -4 L56 32" stroke="${ORANGE}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`, 540, 1180, { op: 0 }));
s8.push(G("rN", notPath(ORANGE), 540 + 285 - wB3 / 2 + wN2 / 2, 1180, { op: 0 }));
s8.push(G("rQ", T("Q", 0, 62, { size: FS, wt: 700, c: ORANGE }), 540 + 285 - wB3 / 2 + wN2 + gap + wQ2 / 2, 1180, { op: 0 }));
pop("rP", S(41) + 0.05, { dy: -30, s0: 0.5, dur: 0.4 }); pop("rA", S(41) + 0.4, { dx: -30, s0: 1, dur: 0.4, ease: "power2.out" });
pop("rN", S(41) + 0.8, { dy: -30, s0: 0.5, dur: 0.35 }); pop("rQ", S(41) + 0.9, { dy: -30, s0: 0.5, dur: 0.35 });
const sc8 = `<g id="sc8" opacity="0">${s8.join("\n")}</g>`;

// ---------- end card ----------
const endCard = `<g id="endc" opacity="0"><rect width="1080" height="1920" fill="${NAVY}"/><rect width="1080" height="1920" fill="url(#dotsN)" opacity=".5"/>
  <image href="assets/Uddhar_icon.svg" x="340" y="640" width="400" height="400"/>
  ${T("UDDHAR · DISCRETE MATH", 540, 1130, { size: 30, wt: 700, c: "#FFFFFF", ls: 8, op: 0.9 })}
  ${T("এই deadline উদাহরণটি hypothetical, বাস্তব কোনো নিয়ম নয়।", 540, 1250, { size: 30, wt: 500, c: LILAC })}
</g>`;
L.push(`tl.fromTo("#endc",{opacity:0},{opacity:1,duration:0.6,ease:"power1.inOut",immediateRender:false},${f(AUDIO + 0.35)});`);

// ---------- scene visibility (cross-fades) ----------
const sceneT = [["sc1", 0, B1 + 0.6], ["sc2", B1, B2 + 0.3], ["sc3", B2, B3 + 0.3], ["scF", B3, B4 + 0.3], ["sc7", B4, B5 + 0.3], ["sc8", B5, AUDIO + 0.35]];
sceneT.forEach(([id, a, b], i) => {
  if (i > 0) L.push(`tl.fromTo("#${id}",{opacity:0},{opacity:1,duration:0.35,ease:"power1.out",immediateRender:false},${f(a)});`);
  if (id !== "sc8") L.push(`tl.fromTo("#${id}",{opacity:1},{opacity:0,duration:0.3,ease:"power1.in",immediateRender:false},${f(b - 0.3)});`);
});

// ---------- subtitles ----------
const SUBS = [
  "রাত ১১টা ৪৫।", "Assignment submission-এর deadline রাত ১২টা।", "কিন্তু তুমি এখনো deadline check করোনি!", "তোমার মাথায় একটাই চিন্তা...", "Still have time!",
  "এবার একটা statement চিন্তা করো।", "তুমি যদি deadline check না করো,", "তাহলে ধরে নাও এখনো সময় আছে।", "এই কথাটাকে logic দিয়ে কীভাবে প্রকাশ করবে?",
  "প্রথমে দুইটা ছোট proposition define করি।", "P মানে,", "তুমি deadline check করেছো।", "আর Q মানে,", "তুমি মনে করছো এখনো সময় আছে।", "তাহলে deadline check করোনি মানে...", "NOT P!",
  "আমাদের statement ছিল,", "তুমি যদি deadline check না করো,", "তাহলে মনে করো এখনো সময় আছে।", "তাই এর logical expression হবে...", "NOT P implies Q।", "অর্থাৎ,", "NOT P arrow Q।",
  "এখন আসি দুইটা গুরুত্বপূর্ণ concept-এ।", "Original statement-এর converse করতে হলে দুই পাশের position বদলে দাও।", "তাহলে হবে...", "Q implies NOT P।",
  "আর contrapositive করতে হলে দুই পাশের proposition negate করে position বদলাতে হবে।", "তাহলে হবে...", "NOT Q implies P।",
  "মজার ব্যাপার হলো!", "Original statement আর তার contrapositive সবসময় logically equivalent।", "কিন্তু converse-এর ক্ষেত্রে এই equivalence নিশ্চিত নয়।", "এই পার্থক্যটাই মনে রাখতে হবে।",
  "Programming-এ IF condition বা decision-making বুঝতেও এই ধরনের logical reasoning কাজে লাগে।",
  "এবার তোমার challenge!", "তুমি যদি deadline check করো,", "তাহলে আর মনে করবে না যে এখনো সময় আছে।", "P আর Q দিয়ে statement-টা লেখো।", "Answer কী?", "সঠিক উত্তর...", "P implies NOT Q!",
];
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
  if (wrapLines(text).length > 2) { // split long phrase in two timed chunks at a word boundary near the middle
    const words = text.split(" "); let best = 1, bd = 1e9; for (let k = 1; k < words.length; k++) { const d = Math.abs(words.slice(0, k).join(" ").length - text.length / 2); if (d < bd) { bd = d; best = k; } }
    const t1 = words.slice(0, best).join(" "), t2 = words.slice(best).join(" "), m = a + (b - a) * (t1.length / text.length);
    subs.push({ text: t1, start: a, end: m }, { text: t2, start: m, end: b });
  } else subs.push({ text, start: a, end: b });
});
const SUBY = 1440;
const subSvg = subs.map((s, i) => {
  const lines = wrapLines(s.text), lw = Math.max(...lines.map((l) => tw(l, 44))), w = Math.min(lw + 64, 960), h = lines.length * 60 + 30;
  return `<g id="sub${i}" opacity="0"><rect x="${f(540 - w / 2)}" y="${f(SUBY - h / 2)}" width="${f(w)}" height="${h}" fill="${SUBBG}" fill-opacity=".95"/><rect x="${f(540 - w / 2)}" y="${f(SUBY - h / 2)}" width="8" height="${h}" fill="${ORANGE}"/>` +
    lines.map((ln, k) => `<text x="${f(540 + 4)}" y="${f(SUBY - h / 2 + 22 + 44 * 0.8 + k * 60)}" font-size="44" font-weight="600" fill="#FFFFFF" text-anchor="middle">${esc(ln)}</text>`).join("") + `</g>`;
}).join("\n");
subs.forEach((s, i) => L.push(`tl.set("#sub${i}",{opacity:1},${f(s.start)});tl.set("#sub${i}",{opacity:0},${f(Math.max(s.end - 0.04, s.start + 0.2))});`));
const ts = (x) => { const h = Math.floor(x / 3600), m = Math.floor((x % 3600) / 60), s = Math.floor(x % 60), ms = Math.round((x % 1) * 1000); return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`; };
fs.writeFileSync(path.join(here, "../subtitles.srt"), subs.map((s, i) => `${i + 1}\n${ts(s.start)} --> ${ts(Math.max(s.end - 0.04, s.start + 0.2))}\n${wrapLines(s.text).join("\n")}\n`).join("\n"), "utf8");

// ---------- logo (top-left, official icon asset) ----------
const logo = `<image id="logo" href="assets/Uddhar_icon.svg" x="44" y="48" width="120" height="120"/>`;
L.push(`tl.fromTo("#logo",{opacity:0},{opacity:1,duration:0.5,immediateRender:false},0.1);`);

// =====================================================================================
const html = `<!doctype html>
<html lang="bn">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=1080, height=1920"/>
<title>EP02 — The Assignment Deadline Trap</title>
<script src="assets/vendor/gsap.min.js"></script>
<style>
@font-face{font-family:"Plus Jakarta Sans";font-weight:500;src:url("assets/fonts/plus-jakarta-sans-latin-500-normal.woff2") format("woff2")}
@font-face{font-family:"Plus Jakarta Sans";font-weight:600;src:url("assets/fonts/plus-jakarta-sans-latin-600-normal.woff2") format("woff2")}
@font-face{font-family:"Plus Jakarta Sans";font-weight:700;src:url("assets/fonts/plus-jakarta-sans-latin-700-normal.woff2") format("woff2")}
@font-face{font-family:"Hind Siliguri";font-weight:500;src:url("assets/fonts/hind-siliguri-bengali-500-normal.woff2") format("woff2")}
@font-face{font-family:"Hind Siliguri";font-weight:600;src:url("assets/fonts/hind-siliguri-bengali-600-normal.woff2") format("woff2")}
@font-face{font-family:"Hind Siliguri";font-weight:700;src:url("assets/fonts/hind-siliguri-bengali-600-normal.woff2") format("woff2")}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:${PAPER}}
#root{position:relative;width:1080px;height:1920px;background:${PAPER};font-family:"Plus Jakarta Sans","Hind Siliguri",sans-serif}
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
      <rect x="0" y="1480" width="1080" height="440" fill="url(#dotsG)" mask="url(#mFloor)" opacity=".4"/>
      <g clip-path="url(#wipeClip)">${sc1}</g>
      ${sc2}
      ${sc3.replace('<g id="sc3" opacity="0">' + "", '<g id="sc3" opacity="0">')}
      ${scF}
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
