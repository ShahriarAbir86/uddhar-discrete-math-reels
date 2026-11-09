# Animation and Render Pipeline

## Preferred implementation
Use HTML + SVG + CSS + JavaScript for a deterministic 2D whiteboard animation, rendered with Playwright/Chromium and FFmpeg. Use another tool only if the runtime cannot support this stack and explain the trade-off.

## Architecture
- `index.html`: fixed 1080×1920 stage / responsive preview.
- SVG: primary diagram and marker paths.
- JavaScript: timeline and scene state.
- `timeline.js` or equivalent: pure deterministic render function.
- `assets/`: official logo, fonts if licensed, and any approved media.
- `render/`: keyframes, intermediate frames and final exports.

## Deterministic animation
Expose `window.seek(t)` or a documented equivalent that sets every visual property from absolute time `t` (seconds). Seeking to the same time must always produce the same frame.

Do not use:
- CSS keyframe animations as timeline source;
- setTimeout / setInterval;
- uncontrolled requestAnimationFrame state;
- random values without a fixed seed;
- scroll position or user interaction to determine frame content.

Use deterministic interpolation/easing functions. All elements must have explicit start/end times and stable geometry.

## Rendering
- Master: 1080×1920, 60fps.
- Render every frame from absolute time.
- Prefer a frame sequence or deterministic browser capture.
- Motion blur is optional; if used, test that text, thin strokes and Bengali glyphs do not ghost or smear.
- Do not make 3 subframes + temporal blend mandatory: it can cause ghosting and unnecessary render cost. Use only when a preview proves it improves motion.
- Mux the exact supplied voiceover.
- Burn subtitles or deliver a separate SRT according to user request.
- Encode H.264 MP4 with broadly compatible pixel format (`yuv420p`) and sensible bitrate/quality.
- Preserve a high-quality source render where storage permits.

## Suggested tools
- Node.js LTS
- Playwright + Chromium
- FFmpeg / ffprobe
- Python 3 for audio analysis, frame extraction and QA
- Optional: Whisper / forced aligner only if available and appropriate; disclose model/runtime limits.

## Render sequence
1. Build composition and timeline.
2. Export keyframes for every scene and inspect them.
3. Fix composition, text, logo and formula defects.
4. Render low-resolution / short preview.
5. Inspect motion and audio sync.
6. Render full 1080×1920 at 60fps.
7. Run ffprobe and extract sample frames.
8. Inspect start, scene boundaries, formula holds, ending and random samples.
9. Deliver final MP4 + source + SRT + QA report.

## Fallback
If browser automation or FFmpeg is unavailable, do not pretend to render. Deliver source project and exact setup/run instructions, then state which steps remain.
