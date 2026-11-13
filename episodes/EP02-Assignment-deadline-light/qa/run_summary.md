# Run Summary — EP02-Assignment-deadline-light

Generated: 2026-11-13 13:41 UTC

## Time
- Started: 2026-11-13 13:30 UTC
- Wall-clock (start to finish): 11m 06s
- Active working time (gaps over 10 min excluded): 10m 51s

## Tokens (measured from Claude Code session logs)
| Model | API calls | Input | Output | of which thinking | Cache write | Cache read |
|---|---|---|---|---|---|---|
| claude-sonnet-5-5 | 12 | 30 | 7,830 | 2,450 | 17,088 | 4,506,167 |
| **Total** | 12 | 30 | 7,830 | 2,450 | 17,088 | 4,506,167 |

Input is uncached input only; cached context is shown separately. Sessions run in this window are all counted, including unrelated chat.

## Output
- Final MP4: 97.90s | 106.8 MB | 1080x1920 @ 60fps h264 yuv420p | audio aac 48000Hz 2ch
- Voiceover: n/a
- Subtitles: n/a
- Keyframes exported: 0

## How it was made
- Style: Animation Story · Light mode (brand cream #FEEEE7, navy ink, white cards)
- Skills used: animation-story-style (Light/Dark modes added), hyperframes, hyperframes-cli
- Plugins / libraries: hyperframes 0.9.26, GSAP 3.15.0, Pillow/numpy (make_paper.py light)
- Tools: ffmpeg/ffprobe, tools/hf.sh render --gpu, MODE=light build.mjs, Windows per-app GPU preference set to high performance during this session
- Commands run (counts): hyperframes x3, gh x2, ffprobe x2, git x1, playwright x1, ffmpeg x1
- Claude tool calls: Bash x9, Read x1

## References
- styles/animation-story/STYLE_GUIDE.md §3
- styles/animation-story/palette.mjs
- brand guideline Light #FEEEE7

## Inspiration images
- none

## Notes
Second version of EP02 (same voiceover, storyboard and animation as the first build). Differences: cream page, white cards, navy subtitle bar, scene 1 is a cream scene instead of a night scene. Render ran at 9m42s because the machine was busy; the GPU preference for the capture browser was set only after this render started.
