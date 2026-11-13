---
name: animation-story-style
description: Produce Uddhar 9:16 Reels in the "Animation Story" paper-cut documentary style (continuous flat-vector world, orange hero, halftone photos, stat scenes, checklist panels, burned-in subtitles) with the official Uddhar logo, in a LIGHT (brand cream) or DARK (brand navy) mode that the user picks every time. Use when the user says /animation-story-style, "animation story style", or gives a script and asks for a story-style reel.
---

# Animation Story Style (Uddhar 9:16)

Always follow this skill when the user asks for the Animation Story style. The Whiteboard style is a separate skill (`whiteboard-style`); never mix the two in one reel unless asked.

## 0. Ask for the mode first (mandatory, every reel)
Before any planning or building, ask the user **Light or Dark?** with AskUserQuestion (two options, no default, no recommendation):
- **Light**: brand cream page `#FEEEE7`, navy ink and text, white cards with navy borders.
- **Dark**: brand Deep Navy page `#101B49`, cream `#FEEEE7` cards and text.
Rules:
- Ask for **each new reel**, even if the previous reel used a mode. Never reuse an earlier answer silently and never pick for the user.
- Skip the question only when the user's current request already says "light" or "dark" for this reel (then confirm it in one line).
- One mode per reel; do not mix modes (chapter/end cards are navy in both by design).
- Record the choice in `qa/intake.md` and `qa/run_meta.json` (`"style": ["Animation Story · Light"]`).
- Build with `styles/animation-story/palette.mjs` (`PALETTES.light` / `PALETTES.dark`) and the matching page texture: `python styles/animation-story/tools/make_paper.py light|dark src/assets/paper.png`. Do not hard-code colours in the episode build script.
Palette sheet: `styles/animation-story/reference/mode_light_dark.png`. Full table: STYLE_GUIDE §3.

## 1. Load first (in order)
1. `styles/animation-story/STYLE_GUIDE.md` — the full spec (read it, don't paraphrase from memory).
2. `styles/animation-story/tokens.json` + `palette.mjs` — exact colours (both modes), sizes, positions.
3. `styles/animation-story/reference/` — look at `frame_hero_scene.jpg`, `frame_split_screen_props.jpg`, `frame_halftone_fog_checklist.jpg`, `frame_chapter_card.jpg` and the contact sheets before designing.
4. `brand/BRAND_GUIDELINE.md`, `series/AUDIO_AND_SUBTITLE_RULES.md`, `series/QUALITY_CHECKLIST.md`, `series/PRODUCTION_PIPELINE.md`.
5. Episode inputs: `script.md`, `voiceover.mp3` (ElevenLabs, exact), `inspiration/` images, `brief.md`.
The original video lives outside Git at `C:\Educational\Phitron\Uddhar\Video Styles references\AnimationStorystyle.mp4` — re-open it (ffmpeg frame grabs) if a detail is unclear.

## 2. Non-negotiables
- **1080×1920, 60 fps, 9:16.** Bottom 380 px is UI-reserved; subtitles at y ≈ 1440; margins 64 px.
- **Official logo only**: `brand/assets/Uddhar_logo_white.svg` icon, **top-left corner** (x 44, y 48, 120 px) on every frame, large on the end card. Chapter tag sits right of it. Never redraw. Not on halftone/photo areas.
- **Colours**: the chosen mode's palette only (Light: cream `#FEEEE7` page + navy; Dark: navy `#101B49` page + cream), greys/navy tints, and Primary Orange `#F2530F` as the single accent. No electric blue, green, teal, gradients, glow, blur shadows, 3D, stock icons, emoji.
- **Fonts**: Hind Siliguri (Bangla), Plus Jakarta Sans (Latin/micro-labels). Bundle as woff2.
- **One continuous world**, camera/world moves, objects keep stable coordinates; hard cuts only for chapter/topic shifts.
- **Audio is the timeline**: user's voiceover only; no TTS, no music, no SFX unless asked. Picture lands on the phrase it illustrates. Subtitles from the script, chunked ≤ 7 words, `.srt` exported.
- **Orange = the thing to look at**, ≤ ~12 % of the frame. ≤ 7 explanatory words on screen.
- **Accuracy**: educational claims must be correct; unsourced claims are flagged in the QA report, never invented.
- **GPU**: render with `--gpu` (NVIDIA RTX 3050 NVENC) via `tools/hf.sh`.

## 3. Workflow
1. **Intake** — read script/voiceover/inspiration; list conflicts with the style; `python tools/run_summary.py start EPxx`.
2. **Beat sheet** — split narration into beats (3–5 s each at reel pace). For each beat choose ONE building block from STYLE_GUIDE §5 (hero scene, stat scene, split, checklist, card, bar chart, pictogram grid, map, end card) and its motion from §6. Write `storyboard/storyboard.md` (and `storyboard.html` if requested): timecode · narration · block · orange element · camera move.
3. **Timing** — use `tools/phrase_times.py` (silencedetect-based) for phrase times; Whisper is unreliable for Bangla.
4. **Build** — generate `src/index.html` from a build script (HyperFrames + GSAP, seekable timeline). Pre-render paper/vignette/grain, halftone photos, torn-edge masks as PNG assets. Characters as grouped SVG parts.
5. **Check loop** — `tools/hf.sh lint` → `check --json` → `snapshot` at every beat → fix overlaps/safe-zone issues → draft render → verify against reference contact sheets → delivery render (`--quality delivery --fps 60 --gpu`).
6. **QA** — verify: 1080×1920/60 fps/duration = audio; no black frames; subtitles inside safe zone; logo clean; colour rationing; text sizes; claims sources. Write `qa/qa_report.md`.
7. **Deliver** — MP4 + SRT + storyboard + QA + run summary to `C:\Educational\Phitron\Uddhar\Deliverables\EPxx-…\` and the Drive folder subfolder; commit source (not the MP4/voiceover) to Git. `python tools/run_summary.py finish EPxx`.

## 4. Fidelity checklist (before delivery)
- [ ] Paper texture + vignette + subtle grain present; no flat white background.
- [ ] Ground line + dashed horizon; hero stands on it; faceless flat hero in orange.
- [ ] At least one halftone element (sun disc, photo, fog) in opening and closing.
- [ ] HUD: registration marks, progress line, chapter tag/episode counter.
- [ ] Cards with thick border + hard offset shadow, slight rotation.
- [ ] Stats: big orange number + micro-label + one illustration.
- [ ] Subtitle bar with orange left tick, in safe zone.
- [ ] Official logo top-left on every frame + end card.
- [ ] Continuous motion; no unmotivated cuts; no frozen holds > 1.5 s without idle motion.

## 5. If something is missing
Missing logo/fonts/voiceover/script → say which, reserve a documented placeholder, don't fake. If style and brand conflict, follow `styles/animation-story/STYLE_GUIDE.md` §3 and mention the decision in the QA report.
