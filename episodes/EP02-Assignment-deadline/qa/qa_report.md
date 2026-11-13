# EP02 QA report — The Assignment Deadline Trap
Date: 2026-11-13 · Style: Animation Story · Renderer: HyperFrames 0.9.26, `--quality delivery --fps 60 --gpu` (6 min 20 s render)

## Technical (verified with ffprobe/ffmpeg)
- renders/final.mp4: H.264 1080×1920, 60 fps, 5874 frames, 97.900 s, AAC audio; mean volume −13.6 dB, peak −1.0 dB. No black frames (blackdetect).
- Audio = user's Voiceover.mp3 unchanged (95.24 s) + 2.66 s logo tail. No TTS, music or SFX.
- Subtitles: 45 chunks, `subtitles.srt` exported; bar centred at y≈1440 (inside safe zone), ≤2 lines.
- Logo: official icon (brand/assets/Uddhar_logo_white.svg) top-left x44 y48 120 px on every frame; large on the end card.
- Lint: 0 errors; 2 warnings (composition size, nested SVG in timeline element) same as EP01.

## Mathematics
P = check deadline, Q = assume still time. Original ¬P→Q; Converse Q→¬P; Contrapositive ¬Q→P; Original ≡ Contrapositive; Converse not guaranteed; Challenge answer P→¬Q. All shown and spoken consistently. Contrapositive animation strikes the ¬ on P (¬¬P=P), adds ¬ to Q, then swaps. Deadline example flagged as hypothetical on the end card.

## Style fidelity (vs. styles/animation-story/STYLE_GUIDE.md)
Present: paper texture + vignette + grain, faceless orange hero with cap, halftone sun and skyline, ground line + dashed horizon, hard-offset cards, comment-style statement card, HUD (registration marks, progress line, chapter tag, episode counter), subtitle bar with orange tick, Navy end card.
Deviations / decisions: electric blue and green not used (brand); scene 1 is a Deep Navy night scene as the brief asks for a dark desk; chapter tag sits right of the logo because the logo occupies the top-left corner (user request).

## Open items for review
1. No word-level check that the audio says exactly the spoken script (phonetic spellings: "পি", "কিউ", "নট পি…"). Timing relies on pauses; a listen-through is advised.
2. Subtitle spelling uses English words (deadline, check) while the voice uses Bangla phonetics. This follows the first script.
3. The hero is a simple flat character, less detailed than the reference; no walk cycle was built. Scene 2 uses a standing pose only.
4. "NOT P arrow Q" subtitle spells the arrow because the font has no → glyph.
5. Bottom ~380 px stays mostly empty by design (platform UI zone).
