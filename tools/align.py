#!/usr/bin/env python3
"""Transcribe a voiceover with word timestamps (faster-whisper) -> JSON.
Run via uv (isolated env):
  uv run --python 3.12 --with faster-whisper python tools/align.py <audio> <out.json> [model] [lang]
"""
import json, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel
audio, out = sys.argv[1], sys.argv[2]
model = sys.argv[3] if len(sys.argv) > 3 else "turbo"
lang = sys.argv[4] if len(sys.argv) > 4 else "bn"
# Decode with ffmpeg ourselves (the bundled PyAV can mismatch faster-whisper's expectations)
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", audio, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"],
                     capture_output=True, check=True).stdout
audio = np.frombuffer(raw, dtype=np.float32)
m = WhisperModel(model, device="cpu", compute_type="int8")
segs, info = m.transcribe(audio, language=lang, word_timestamps=True, vad_filter=False, beam_size=5)
res = {"model": model, "language": lang, "duration": info.duration, "segments": []}
for s in segs:
    res["segments"].append({"start": round(s.start, 3), "end": round(s.end, 3), "text": s.text.strip(),
        "words": [{"w": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3), "p": round(w.probability, 2)} for w in (s.words or [])]})
json.dump(res, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("segments:", len(res["segments"]), "duration:", info.duration)
