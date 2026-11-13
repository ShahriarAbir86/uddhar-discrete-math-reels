# Animation Story Style — Uddhar 9:16 Reel Style Guide

Derived from the user-supplied reference `C:\Educational\Phitron\Uddhar\Video Styles references\AnimationStorystyle.mp4`
(1920×1080, 30 fps, 7 min 55 s, Bangla narration, burned-in subtitles; ~63 MB, **not** stored in Git).
Analysed 2026-11-13 by sampling a frame every 6 s (79 frames), three full-resolution frames, a 4 fps motion strip and scene-cut detection.
Key frames and contact sheets are in `reference/` (same folder). Look at them before building.

This guide translates a 16:9 documentary-explainer into a **1080×1920 (9:16) Reel**, in Uddhar brand colours, with the official Uddhar logo.
Where the reference and Uddhar brand disagree, **brand wins** (see §3). The user's newest instruction always wins over this file.

## 1. What the style is (one paragraph)
A flat-vector "paper-cut documentary" explainer. Everything sits on a warm, fibrous paper sheet. A small faceless character (orange shirt, graduation cap) lives in **one continuous side-scrolling world** — ground line, dashed horizon, props appear beside them. Photos are rendered as coarse **halftone / engraved-print** grey cut-outs with torn edges. Colour is rationed: paper, ink-navy, greys, **one hot orange** for what matters, and (in the reference) a small electric blue for the "AI / other force" element. Big numbers and short bold Bangla headlines carry the data. Every scene is built from the same few parts, so it feels like one designed system, not a slideshow.

## 2. Canvas, grid and safe zones (9:16)
- Master: **1080×1920, 60 fps** (reference is 30 fps; we keep 60 for the GPU/HyperFrames pipeline). Square pixels, sRGB.
- Margins: 64 px left/right, 96 px top. **Bottom 380 px is platform-UI territory** (captions, buttons): nothing essential below y = 1540.
- **Subtitle band**: centred, baseline zone y ≈ 1380–1500 (see §7). Never overlaps a key label or the logo.
- **Stage** (where the story happens): y 160 → 1340 (≈1180 px tall). Ground line at y ≈ 1130; dashed horizon about 70 px below it.
- Landscape compositions from the reference become **vertical stacks**: what was "left | right" becomes "top / bottom". Split-screen comparisons (reference 2:00–2:12) = top half vs bottom half with a dashed horizontal divider.
- Wide scenes (city skyline, queue of 10 people, world map) are built on a **world wider than the screen (e.g. 3000–4000 px)** and the camera pans across it. Don't shrink wide scenes to fit.

## 3. Colour
Reference values were sampled from frames; the Uddhar mapping is what we actually use.

| Role | Reference (sampled) | **Use in Uddhar reels** |
|---|---|---|
| Paper (page) | `#E5DECC` centre → `#CBC3AD` edges, with darker fibre flecks | **Paper `#EEE8D8`**, vignette to `#D9D2BE`; fibres at ~6 % opacity. *Extension of the brand's "warm white"* |
| Ink / characters / outlines | `#262A39`, `#10131C` | **Deep Navy `#101B49`** (secondary figures `#262A39`-like = navy at 85 %) |
| Hero accent | `#FF3D16` – `#F83A16` | **Primary Orange `#F2530F`** — sun disc, hero shirt, key numbers, ✓ marks, active bar, progress line, stamps |
| Second force ("AI", other side, "before") | electric blue `#2A36FE`, lilac `#8D94FF` | **Navy tint `#6C74A6` / lilac `#B9BEE0`** for ghost figures and secondary objects. *Electric blue is NOT used: brand forbids the old blue palette.* Chapter cards use **Deep Navy** instead of the reference's electric-blue background |
| Photo greys | `#6A645F`… halftone on paper | Neutral greys `#6A645F`, `#9A948C`, `#C9C2B6` (halftone only) |
| Subtitle band | `#151218` with orange left tick `#FE3B19` | Navy-black `#0B1235`, orange tick `#F2530F`, text white |
| Light panels | `#F6F6F7`-ish cards | Cards `#F6F3E8` / Light Neutral `#F6F6F7` with navy border |
| Reference's green signposts/laptop UI | `#1F6B4A` | **Not used** (extra colour). Use navy or orange |

Rule: on any frame, at most **paper + navy + greys + orange**, plus tints of navy. Orange covers ≤ ~12 % of the frame and always marks "the thing to look at". Decisions flagged for the user to override: paper tone, navy-tint replacement for blue.

## 4. Typography
- **Bangla headlines / labels:** Hind Siliguri 600–700 (brand font). The reference uses a heavy condensed Bangla display face for big phrases ("কোন কাজ টিকবে?") — approximate with Hind Siliguri 700, tight tracking (−1 %), and large size; do **not** substitute a decorative font.
- **Latin / numerals / micro-labels:** Plus Jakarta Sans. The reference's tiny monospace uppercase tags ("COMMENT", "FY2025-26 · % OF GDP", "EP.01 · 07") become **Plus Jakarta Sans 600, 18–20 px, ALL CAPS, letter-spacing 0.14 em, navy at 55 %**.
- **Big numbers / stats:** 150–260 px, Hind Siliguri 700 (Bangla digits when narration is Bangla) in **orange**; a 20–24 px unit/qualifier in navy beside or below; a micro-label above.
- Sizes on a phone: headline ≥ 84 px, body label ≥ 44 px, micro-label ≥ 18 px (decorative only — never carry meaning).
- Highlight inside text: one word in orange or a serif italic swap (reference: "**AI** তো সবই করে ফেলতেছে" with AI in orange serif).
- Text density: ≤ 7 explanatory words on screen at once (excluding formulas and subtitles).

## 5. The visual building blocks (use only these)
1. **Paper background**: flat paper tone + fibre texture + soft vignette + faint film grain (≤ 3 %). Optional **dotted halftone floor band** under the ground line (reference "gap" areas) for depth.
2. **Ground line + dashed horizon**: 4–5 px navy-grey (`#555473`) solid ground line, a dashed line 60–70 px under it. Every figure stands on the ground line with a tiny soft contact shadow.
3. **Hero character**: flat vector, ~460 px tall in vertical, **no facial features** (grey face), orange shirt, navy trousers, graduation cap (student) — for Uddhar, the learner. Side-profile walk cycle (4–6 poses) and a few poses (stand, point, hold phone, sit at desk). Secondary people: navy/grey, no orange. "Ghost" figures (tinted) = AI / automated / absent.
4. **Sun disc**: large orange circle half-covered by halftone dots — the recurring motif behind opening and closing scenes. Can drift/rise slowly.
5. **Halftone photo cut-outs**: black-white photo → coarse halftone/engraved print, ink-grey, **torn paper edge** (jagged, 8–14 px). Used for city, trees, crowds. Fog = halftone dot gradient fade to paper.
6. **Cards / tags**: cream card with **thick navy border and hard offset shadow** (6–10 px, no blur), slightly rotated (−2…+3°). Hold a short label or a question. Torn-paper strips for orange "stamp" words (rotated, double border).
7. **Callout line**: dashed orange line from card to the thing it talks about (tail → head, drawn).
8. **Checklists / forms**: boxed list with numbered orange discs, grey bars, orange ✓ that draws itself. Used for steps and for summaries.
9. **Stat scenes**: giant orange number + micro-label + one illustration (queue of figures, stack of papers, bar chart). Before/after bars: **hatched/grey bar = before, solid orange = after**, tiny figures standing on the bar tops.
10. **Pictogram grids**: 5×N small figure icons; the highlighted subset in orange (or navy tint) to show a proportion.
11. **Props on the stage**: monitor/laptop, desk+chair, whiteboard on legs, signpost (arrows), hourglass, stopwatch, bookshelf, podium steps, see-saw, stamp (rotated "দায়"/"AUTO"-type). Simple geometric vectors, 3–4 px navy stroke or flat fills.
12. **HUD chrome (always on)**:
    - **registration marks** (circle + crosshair, ~28 px) in the four corners at 46 px inset — in 9:16 keep top two and bottom two;
    - **chapter tag** top-left: black chip with chapter number + title ("০২ আসল অবস্থা");
    - **progress line**: 4 px orange line along the very top, grows left→right across the whole reel;
    - **episode counter** bottom-right micro-label "EP.01 · 07" (episode · scene number);
    - bottom-left: reference shows four colour chips; **replace with the official Uddhar logo** (see §9).
13. **Chapter cards** (use sparingly): full-bleed Deep Navy, giant paper-coloured numeral on an orange disc with diagonal black-and-paper stripes in its lower half, chapter name stacked left in white with a black highlight bar, thin dashed horizontal line through the centre.
14. **End card**: Deep Navy, large white title with the key word orange and a dashed orange underline, small credits line, **official logo**.

## 6. Motion language (what moves and how)
Measured from the reference: only **15 hard cuts in 7 min 55 s** (≈ one per 31 s) — almost everything is *continuous*. Reproduce that: **animate the same world, don't cut.**
- **World scroll**: the stage slides sideways (in vertical reels: sideways **or** vertical) while the hero walks in place or stays near screen centre; new props arrive from the edge and are anchored in the world (stable coordinates).
- **Props/figures enter by**: slide-in from the side + fade (0.35–0.5 s, ease-out), scale-pop from 0.9 → 1 for cards (0.3 s, slight overshoot ≤ 4 %), draw-on (stroke dash) for checks, lines, arrows, dashed callouts.
- **Numbers count up/scramble** briefly before resolving (reference 1:00 shows a glitchy digit roll) — max 0.6 s, then hold.
- **Bars grow** from the baseline (0.6–0.9 s ease-in-out), tiny figures then step onto them.
- **Cross-fade between states of the same stage** (e.g. a table empties and refills) rather than cutting.
- **Paper-strip wipe** for chapter changes: a narrow vertical paper-coloured strip slides across and reveals the next card (≈ 0.4 s). Otherwise **hard cut only on a chapter card or a topic shift**.
- **Camera**: slow pans/zooms between zones; never shake; a scene settles ≥ 1 s before the next action. Rhythm of new information: roughly **one new visual idea every 3–5 s** at reel pace (reference averages one every ~6 s at documentary pace).
- **Parallax**: background halftone city moves slower than ground/props (≈ 0.6×).
- **Idle life**: birds on wires, sun slowly rising, hourglass sand, clock hand — tiny loops so a held scene is never frozen.
- **Easing**: `power2.out` entrances, `power2.inOut` moves, `back.out(1.2)` for cards/stamps. No bounce > 5 %.
- Audio is the timeline authority (see `series/AUDIO_AND_SUBTITLE_RULES.md`): picture changes land on the narration phrase they illustrate.

## 7. Subtitles
Reference: single-line bar, near the bottom, dark band with a **thick orange left tick**, white bold Bangla, ~34 px on 1080p, quote marks used for spoken quotes.
For 9:16: bar width hugs the text (max 920 px), padding 20×14, up to **2 lines**, ~44 px Hind Siliguri 600, band `#0B1235` at 94 %, 8 px orange left tick, centred at **y ≈ 1440**. Chunk by phrase (≤ 7 words); each chunk fades in/out in 0.12 s. No other decoration. Also export `.srt`.

## 8. Story and layout pattern per beat
1. **Hook** (0–3 s): hero in the world + a *question card* or comment bubble; sun disc behind. Orange appears immediately.
2. **Context**: pan across the world; halftone photo / props set the place.
3. **Claim → proof**: one stat scene per claim (big number, micro-label, one illustration).
4. **Contrast**: top/bottom split (before/after, human/AI, junior/senior).
5. **Method / steps**: checklist panel built item by item; the current item is orange, finished items get ✓ and fade to grey.
6. **Close**: hero looks ahead; sun, 1-line takeaway card; end card with logo.
Chapters: for a 60–120 s reel, 0–1 chapter cards (opening); for long-form (>3 min) use a card per chapter like the reference (5–6 chapters in 8 min).

## 9. Uddhar logo and brand elements
- Use only `brand/assets/Uddhar_logo.svg` (primary), `Uddhar_logo_white.svg` (on Navy/end card), `Uddhar_logo_orange.svg` (when orange logo needed on paper). Never redraw, recolour, shadow or outline.
- Placement: **top-right, inside safe margin (x 880–1016, y 96–150), ~96–130 px wide**, on a clean paper area; in the opening 2 s and the end card **large** (≈ 360 px wide, centred on Navy, white logo). Do not place on halftone/photo areas.
- The reference's four-colour chip bottom-left is replaced by a **small paper-coloured ‹uddhar› mark** only if the logo asset has an icon-only version; otherwise leave that corner for the episode counter and rely on the top-right logo.
- Series identity: "EP.xx · scene" counter replaces the reference's "EP.01 · 07"; chapter tag text in Bangla.

## 10. Do / Don't
**Do**: one continuous world; a hero in orange; one orange idea per scene; thick consistent outlines (3–4 px); hard offset shadows; torn edges; halftone depth; micro-labels; stable object coordinates; subtitles with orange tick; official logo only.
**Don't**: gradients (except halftone/fog), glow, blur shadows, 3D, stock icons/clip-art, emoji, photoreal photos (always halftone), template transitions, more than one hero, extra accent colours (electric blue, green), cluttered frames (>7 words), text on halftone, tiny text below the safe zone.

## 11. Build notes (HyperFrames + GSAP)
- Compose as **SVG/HTML with GSAP timeline**, `window.__timelines["main"]`, seekable; same rules as `series/PRODUCTION_PIPELINE.md`.
- Halftone: render photo → halftone in Python/Pillow (or an SVG pattern with a mask) ahead of time and ship as PNG with transparent paper; don't compute per frame.
- Paper texture + vignette = one pre-rendered PNG layer; grain = a small tiled PNG with slow `x/y` jitter at 12 fps.
- Characters: build as grouped SVG parts (head, torso, arms, legs) so poses/walk cycles are `rotate`/`translate` tweens.
- Check loop: `tools/hf.sh lint` → `check` → `snapshot` at each beat → draft render → delivery render `--fps 60 --gpu`.
- Contact sheet QA: compare against `reference/contact_sheet_*.jpg` for density and colour rationing.

## 12. Secondary reference (not the primary style)
`video.12e81ac7.mp4` (15 s, 1080p/60 fps) — a **product promo** with a teal ball character, handwritten-script annotations, dark and light scenes, 3D-ish extruded headline. Different aesthetic from the story style. Useful only for: **bouncing-ball mascot motion** (arc trail with ghost frames), **hand-drawn annotation + arrow** callouts, **graph with a curve that grows**, **kinetic word-by-word title build**. Do not copy its colours (teal) or 3D text. Contact sheet: `reference/secondary_ref_product_promo_sheet.jpg`.
