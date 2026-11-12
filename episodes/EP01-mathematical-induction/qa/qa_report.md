# EP01 QA Report — Mathematical Induction

Everything below was actually run; results are as printed by the tools.

## Final file: renders/final.mp4
| Check | Tool | Result |
|---|---|---|
| Resolution / aspect | ffprobe | 1080×1920 (9:16) |
| Frame rate / frames | ffprobe, -count_frames | 60/1 fps, 6300 frames (= 105.00 s) |
| Codec / pixel format | ffprobe | h264 Main, yuv420p |
| Audio | ffprobe | AAC LC, 48 kHz, stereo (source mp3: mono 44.1 kHz) |
| Duration | ffprobe | 105.000 s; voiceover 102.844 s + 2.16 s tail |
| Audio level | ffmpeg volumedetect/astats | mean -13.5 dB, peak -0.99 dB (source: -13.4 / -0.9) → no clipping, level preserved |
| Voice start / end in output | decoded audio | first sound 0.11 s, last sound 102.55 s |
| Black frames | ffmpeg blackdetect (≥0.2 s) | 0 found |
| File size / bitrate | ffprobe | 54.7 MB, 4.16 Mb/s |
| Render time | hyperframes render --quality delivery --fps 60 --gpu | 4 m 08 s (draft: 3 m 41 s) |

## Composition
- hyperframes lint: 0 errors, 2 warnings (file length; svg inside a timeline host). check --json: no errors; one "dead_stretch" warning (motion detector does not see attribute-driven SVG camera motion; frames confirm motion).
- Keyframes: 12 frames pulled from the final MP4 (qa/keyframes_contact_sheet.png) plus 30+ scene snapshots reviewed during build. Defects found and fixed: title overlapping the Inductive Step label, caption overlapping arcs, clipped tree, tick on text, stray dash, proof text colliding with subtitles in the finale (now dimmed), box border touching a denominator.
- Fonts: Hind Siliguri (Bengali) and Plus Jakarta Sans (Latin) bundled from OFL files; Bengali conjuncts rendered correctly in the subtitle and label frames viewed.
- Logo: official assets/Uddhar_logo.svg used unmodified, end card from ~101.2 s.
- Subtitles: subtitles.srt, 48 cues, in order, last cue ends 102.82 s; burned into the video in the lower safe area.

## Accuracy
- Algebra and formula verified by exact-fraction computation (see references.md).
- Visual claims: the call-chain/tree diagram asserts nothing beyond structure.

## Known limits / not checked
- **Script vs audio mismatch not checked word-by-word**: the Whisper Bengali transcript was unusable (see intake.md). A human listen-through is needed.
- Scene timing is exact at pause boundaries; inside a phrase it is proportional to text length, so an individual drawing may be a few tenths of a second off the exact word.
- Playback sync was not inspected on a real player; audio and video timestamps both come from one 105.000 s timeline.
- Script scene 7 (recursion/data-structure claim) has no opened source (references.md).
- Hand-drawn feel is modest: marker strokes with slight jitter and text written by wipe; text is typeset, not hand-lettered.
- Bottom subtitle overlaps the world during zoomed-out shots (halo keeps it legible).
- GPU: encode used the --gpu flag (NVENC); the capture browser reported the AMD integrated GPU, not the NVIDIA card.
