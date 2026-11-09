# Audio, Voiceover and Subtitle Rules

## Source of truth
The user-supplied voiceover file is the master narration. Do not replace it with TTS, regenerate it, rewrite it, time-stretch it, denoise it aggressively or cut meaningful pauses without explicit approval.

## Audio inspection
At the beginning of each episode:
1. Identify file format, duration, sample rate, channel count and peak level.
2. Listen to / inspect the entire recording if audio playback/transcription tools are available.
3. Transcribe the actual spoken words; compare with supplied script.
4. Flag omissions, pronunciation ambiguities, repeated words or script/audio mismatch.
5. Derive word/phrase/line timestamps from the actual waveform and forced alignment or speech recognition timestamps.
6. Do not rely on manually estimated scene timings as final subtitle timing.

## Timing
- Audio duration determines total video duration.
- Preserve natural pauses and breathing.
- Scene boundaries should follow sentence meaning, not arbitrary equal durations.
- If voiceover duration differs from planned duration, adapt animation; never accelerate narration just to match a plan.
- Include a small audio tail after the final spoken word where appropriate.

## Subtitles
- Produce SRT and, if useful, ASS for precise styling.
- Use accurate Bangla Unicode text, preserve natural English technical terms.
- Line-synced, phrase-level subtitles; do not display an entire paragraph at once.
- Usually one or two lines, readable on a phone.
- Keep subtitles in a consistent lower safe area, with sufficient contrast.
- Do not overlap critical diagram labels or cover the key mathematical object.
- Use a subtle solid/semi-opaque backing only if required for contrast; no heavy subtitle box.
- Validate subtitle timing against actual voiceover.
- Check Bengali shaping, punctuation, English terms and formula reading.

## Mixing
- Preserve original voice quality and dynamics.
- If background music is used, it must be licensed/royalty-free or user-provided, very quiet, and never compete with speech.
- No music is acceptable and often preferable.
- Prevent clipping; inspect final muxed audio.
- Keep source voiceover untouched in the episode input folder.
