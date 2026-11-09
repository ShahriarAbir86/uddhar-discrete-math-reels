# Production Pipeline (efficient, skill-driven)

Goal: produce an episode with the fewest tokens, retries and re-renders. Use the installed skills instead of re-deriving animation know-how.

## Model policy
- **Sonnet 5.5**: intake, audio alignment, planning, storyboard, references, QA reading, packaging, Drive delivery. Anything light.
- **Heavier model (Opus)**: only for the single complex build step (continuous-diagram composition) if Sonnet's result fails `check`. Switch with `/model`.

## Tooling = HyperFrames + GSAP (replaces the hand-rolled Playwright capture)
HyperFrames renders HTML/SVG/GSAP deterministically (seekable timeline → MP4), which is exactly the `seek(t)` rule in `ANIMATION_AND_RENDER_PIPELINE.md`. Use its CLI (`lint`, `check`, `snapshot`, `preview`, `render`) rather than writing capture scripts. The brand and style rules in this repo still win.

Skills to load, in order (installed in `.claude/skills/`):
1. `whiteboard-style` — Uddhar look, colours, fonts, text density.
2. `motion-doctrine` — one continuous camera move; seams/camera between zones.
3. `hyperframes` + `hyperframes-cli` — composition rules, commands, the check loop.
4. `gsap-core`, `gsap-timeline`, (`gsap-plugins` for DrawSVG-style marker reveals).
5. `hyperframes-registry` — reuse existing blocks before hand-building.
6. `video-storytelling` — one persistent world the camera moves through.
7. `captions-overlay` — subtitles are an overlay, never a reserved band.
Skip launch-video-only techniques (`oversized-cursor`, product mock-UI). Do not use the registry's glassy/3D/glow blocks: they violate WHITEBOARD_STYLE.

## Inputs (user supplies; nothing else is invented)
Per episode, in `episodes/EPxx-topic/inputs/`:
- `script.md` — approved Bangla script (from ElevenLabs workflow).
- `voiceover.mp3` — exact ElevenLabs audio. No TTS, no music, no SFX by default.
- `inspiration/` — storyboard reference images the user generates with Claude/ChatGPT. Claude reads them for composition ideas only; they are not copied into the video.
(EP01 predates this layout: its script and MP3 sit in the episode root.)

## Stages and gates
| # | Stage | Output | Gate |
|---|-------|--------|------|
| 1 | Intake: probe audio (ffprobe), transcribe (local `transcribe`), diff vs script | `qa/intake.md` | Mismatch → stop and report |
| 2 | Accuracy: verify math/CS claims | `references.md` | Error in script → stop, propose fix |
| 3 | Storyboard: one world map + scene table with real timings | `storyboard/storyboard.md` + `storyboard/storyboard.html` | **User approves** |
| 4 | Build in HyperFrames (`src/`) | composition | `lint` + `check --json` clean |
| 5 | Keyframes: `snapshot` per scene + contact sheet | `renders/keyframes/` | Visual review, fix |
| 6 | Draft render (`--quality draft`) | `renders/preview.mp4` | Motion + sync review |
| 7 | Final render (`--quality delivery`, 1080×1920, 60fps) | `renders/final.mp4` | ffprobe checks |
| 8 | Package + deliver to Drive | `qa/qa_report.md`, SRT, contact sheet | Report only what was actually run |
| 9 | Run summary (always) | `qa/run_summary.md` + row in `series/RUN_LOG.csv` | See below |

No production (stage 4+) before the user approves stage 3.

## Run summary (every reel)
Track each reel from first step to delivery:
- Stage 1: `python tools/run_summary.py start EPxx` (creates `qa/run_state.json` and an empty `qa/run_meta.json`).
- At each gate: `python tools/run_summary.py mark EPxx "storyboard approved"` (also: build done, draft render, final render).
- During the work, keep `qa/run_meta.json` current: `style`, `skills`, `plugins`, `tools`, `references` (URLs actually used), `inspiration` (image files used), `notes`.
- Last step: `python tools/run_summary.py finish EPxx`.
The summary is measured, not estimated: tokens per model (input, output, thinking, cache) from the Claude Code session logs, wall-clock and active time, final MP4/voiceover specs from ffprobe, keyframe count, plus the skills, tools, styles and references used. `series/RUN_LOG.csv` keeps one row per reel so reels can be compared. Token counts cover every Claude session in the time window, so avoid unrelated chat while a reel is running.

## Where to see the storyboard
`episodes/EPxx-topic/storyboard/storyboard.html` — open in a browser (double-click, or `npx hyperframes preview` once built). It shows the single world map, a per-scene card (time range from the real audio, camera viewport, what is drawn, orange highlight, ≤7-word labels, subtitle lines) and the waveform with scene boundaries. `storyboard.md` is the same content as text.

## Efficiency rules
- Timings come from the transcript timestamps once; store them in `qa/alignment.json` and reuse.
- Fix defects in `src/` and re-snapshot only the affected scenes; draft-render before delivery.
- Reuse the episode-independent assets (logo, fonts, marker-stroke helpers) from `series/assets/` once the first episode establishes them.
- Do not load every skill every time: load the list above once per session.

## Telemetry note
Some HyperFrames skills tell the agent to run `npx hyperframes events` (a usage beacon). Do not run it. Prefer the CLI at a pinned version (see `series/SKILLS_REGISTRY.md`).
