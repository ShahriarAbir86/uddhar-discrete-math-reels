# Run Summary — EP02-Assignment-deadline

Generated: 2026-11-13 13:10 UTC

## Time
- Started: 2026-11-13 12:49 UTC
- Wall-clock (start to finish): 21m 27s
- Active working time (gaps over 10 min excluded): 21m 27s

## Tokens (measured from Claude Code session logs)
| Model | API calls | Input | Output | of which thinking | Cache write | Cache read |
|---|---|---|---|---|---|---|
| claude-sonnet-5-5 | 39 | 86 | 106,194 | 48,058 | 159,266 | 8,849,276 |
| **Total** | 39 | 86 | 106,194 | 48,058 | 159,266 | 8,849,276 |

Input is uncached input only; cached context is shown separately. Sessions run in this window are all counted, including unrelated chat.

## Output
- Final MP4: 97.90s | 121.9 MB | 1080x1920 @ 60fps h264 yuv420p | audio aac 48000Hz 2ch
- Voiceover: 95.24s | 1.5 MB | audio mp3 44100Hz 1ch
- Subtitles: subtitles.srt
- Keyframes exported: 0
- Video minus voiceover duration: +2.66s

## How it was made
- Style: Uddhar Animation Story (paper-cut documentary: paper texture, orange hero, halftone sun/skyline, hard-offset cards, HUD, subtitle bar with orange tick) per styles/animation-story/STYLE_GUIDE.md; night variant on Deep Navy for scene 1
- Skills used: animation-story-style (project, created this session), artifact-design, artifact-design (preview page), gsap-core/timeline, hyperframes, hyperframes-cli
- Plugins / libraries: hyperframes 0.9.26 (render engine), GSAP 3.15.0 (timeline), Pillow/numpy (paper texture)
- Tools: ffmpeg/ffprobe (silencedetect, volumedetect, preview encode), tools/phrase_times.py (silence-aligned phrase timing), tools/make_preview.sh + tools/build_preview.mjs (remote preview page), NVENC via hyperframes --gpu (hardware gpu capture reported), node 24
- Commands run (counts): ffmpeg x6, ffprobe x2, hyperframes x1, gh x1
- Claude tool calls: Bash x27, Read x11, Write x4, Skill x1, Artifact x1

## References
- styles/animation-story/STYLE_GUIDE.md (from AnimationStorystyle.mp4)
- brand/BRAND_GUIDELINE.md
- brand/assets/Uddhar_logo_white.svg (logo supplied by user)
- user-supplied script, ElevenLabs phonetic script and Voiceover.mp3

## Inspiration images
- none

## Notes
Brief asked 1920x1080 / 30 fps / #F47B32 for a 9:16 reel; produced 1080x1920 / 60 fps with brand orange #F2530F per the newer brand + style instruction. Voice is 95.24 s (brief said 90). Timing from measured pauses, no word-level ASR check of the voiceover against the script. Logo top-left on every frame. Preview page published as a private Artifact.
