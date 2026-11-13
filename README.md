# Uddhar — Discrete Mathematics Reels

Production repository for Uddhar's short-form Discrete Mathematics whiteboard explainer series (9:16, 1080×1920, 60fps, Bangla narration).

## Start here
1. Read `CLAUDE.md` — production rules and priority order.
2. Follow `series/WHITEBOARD_STYLE.md` and the other `series/` reference documents.
3. Brand: `brand/BRAND_GUIDELINE.md` (video rules) and `docs/Uddhar_Brand_Guideline_Design_v2.1.md` (full visual identity). Official logos are in `brand/assets/`.
4. Claude Code skill: `.claude/skills/whiteboard-style/SKILL.md` — invoke with `/whiteboard-style`.

## One-time setup (Windows)
Required: Node.js LTS, Python 3, Git, FFmpeg.

```bash
npm install          # installs HyperFrames (pinned)
npm run setup        # downloads Chrome Headless Shell for HyperFrames
pip install -r tools/requirements.txt
npm run check        # verifies node, python, ffmpeg, ffprobe, HyperFrames
```

## Episode workflow
Each episode lives in `episodes/EPXX-topic/` (see `series/EPISODE_TEMPLATE.md`):
`script.md`, `brief.md`, `references.md`, voiceover, `storyboard/`, `src/`, `qa/`, `renders/`.

To produce an episode in Claude Code:
```
/whiteboard-style Create EPXX. Use the approved script and exact voiceover. Complete the full pipeline and deliver final MP4, source, subtitles and QA report.
```

## Deliverables
Rendered files (`renders/`, `*.mp4`) are **not** committed to Git. Final deliverables go to the Google Drive delivery folder:

https://drive.google.com/drive/folders/1Mmm98hYrI8cpXG-LNCQqsnltz3N1HcAq

Per episode, upload into a subfolder named after the episode (e.g. `EP01-mathematical-induction/`):
`final.mp4`, `subtitles.srt`, `keyframes_contact_sheet.png`, `storyboard.md`, `qa_report.md`.

## Security
This repository contains unpublished scripts, voice recordings and brand assets. Keep it private.
Never commit API keys, access tokens, `.env` files, credentials, student personal data or other secrets.

## Per-reel tracking
Every reel gets `episodes/EPXX/qa/run_summary.md` (tokens, time, output specs, tools/skills/styles/references used) and a row in `series/RUN_LOG.csv`. See `series/PRODUCTION_PIPELINE.md`.

## Remote preview page
`bash tools/make_preview.sh EPxx-folder epxx` makes a small 540x960 preview in `preview/media/`; add the episode to `preview/episodes.json`, run `node tools/build_preview.mjs`, then publish `preview/index.html` + `preview/media/*` with the Artifact tool (Claude does this). The page is private, plays on any device, and has a Copy timestamp button for feedback.
