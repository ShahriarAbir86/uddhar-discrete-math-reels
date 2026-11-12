# Run Summary — EP01-mathematical-induction

Generated: 2026-11-12 12:45 UTC

## Time
- Started: 2026-11-12 12:17 UTC
- Wall-clock (start to finish): 28m 19s
- Active working time (gaps over 10 min excluded): 28m 17s

| Stage | Elapsed since start |
|---|---|
| start (production request received) | 0m 00s |
| intake done: audio aligned to pauses | 7m 58s |
| build done: composition passes lint/check, keyframes reviewed | 18m 28s |
| draft render done (3m41s), checked | 22m 46s |

## Tokens (measured from Claude Code session logs)
| Model | API calls | Input | Output | of which thinking | Cache write | Cache read |
|---|---|---|---|---|---|---|
| claude-sonnet-5-5 | 58 | 130 | 117,094 | 68,516 | 179,001 | 17,494,326 |
| **Total** | 58 | 130 | 117,094 | 68,516 | 179,001 | 17,494,326 |

Input is uncached input only; cached context is shown separately. Sessions run in this window are all counted, including unrelated chat.

## Output
- Final MP4: 105.00s | 54.7 MB | 1080x1920 @ 60fps h264 yuv420p | audio aac 48000Hz 2ch
- Preview MP4: 105.00s | 24.3 MB | 1080x1920 @ 60fps h264 yuv420p | audio aac 48000Hz 2ch
- Voiceover: 102.84s | 1.7 MB | audio mp3 44100Hz 1ch
- Subtitles: subtitles.srt
- Keyframes exported: 13
- Video minus voiceover duration: +2.16s

## How it was made
- Style: Uddhar Whiteboard (Deep Navy ink, Primary Orange highlights, marker-stroke reveals, one continuous world with a moving camera)
- Skills used: hyperframes (SKILL.md + references/format.md read), hyperframes-cli, motion-doctrine (one continuous camera move principle), whiteboard-style (project)
- Plugins / libraries: hyperframes 0.9.26 (render engine), GSAP 3.15.0 (timeline), faster-whisper turbo (tried; transcript unusable for Bengali, not used for timing), fontTools (font metrics)
- Tools: ffmpeg/ffprobe 9.0.2 (silencedetect, volumedetect, probe, contact sheet), Chrome Headless Shell 152 (capture), NVENC via hyperframes --gpu, node 24, python 3.14 / uv + python 3.12
- Commands run (counts): ffmpeg x25, hyperframes x18, ffprobe x4, gh x2
- Claude tool calls: Bash x50, Read x7, Write x1, WebSearch x1; web searches x1

## References
- https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/
- https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/
- series/WHITEBOARD_STYLE.md
- brand/BRAND_GUIDELINE.md
- docs/Uddhar_Brand_Guideline_Design_v2.1.md
- https://agentskillshub.top/best/claude-video-skills/ (index of video skills, downloaded relevant subset for reference only)

## Inspiration images
- none

## Notes
First full episode of the series; treated as a test of the pipeline. Subtitle/scene timing comes from measured pauses, not word-level ASR (Whisper turbo gave an unusable Bengali transcript). Script scene 7 claim about recursive algorithms/data structures has no source opened. Capture browser reported the AMD integrated GPU as WebGL renderer; the NVIDIA RTX 3050 was used only if NVENC encoding engaged (encode step was 0.2 s).
