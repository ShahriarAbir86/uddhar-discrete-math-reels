# EP01 Intake

- Voiceover: DM Mathematical Induction.mp3 — mp3, mono, 44.1 kHz, 102.844 s (ffprobe). Peak -0.9 dB, mean -13.4 dB (ffmpeg volumedetect).
- Script: 8 scenes, 30 sentences, 44 phrases.
- **Transcription attempt:** faster-whisper "turbo" (language=bn) was run on the real file. The Bengali transcript was unreliable (phonetic misspellings, whole passages missing, timestamps out of order), so it was NOT used for timing and was NOT used to judge script/audio mismatches.
- **Timing method used instead:** silence detection on the real audio (ffmpeg silencedetect, -33 dB, ≥0.12 s → 63 pauses), then script sentences snapped to those pauses by dynamic programming (speaking-rate consistency + long pauses at sentence/scene ends), commas split proportionally and snapped to inner pauses. Output: qa/phrase_times.json. This is accurate at pause boundaries; inside a phrase, timing is proportional to text length.
- **Not done:** a word-by-word comparison of the spoken words against the script. A human listen-through is needed to confirm there is no script/audio mismatch.
