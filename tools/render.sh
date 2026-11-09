#!/usr/bin/env bash
set -euo pipefail
# Environment check + placeholder launcher. Claude adapts the render step per episode.
# Required tools: node, python (3.x), ffmpeg, ffprobe, Playwright Chromium.

# On Windows, `python3` is often a Microsoft Store stub; prefer a real interpreter.
PY=""
for c in python3 python py; do
  if command -v "$c" >/dev/null 2>&1 && "$c" -c "import sys; sys.exit(0 if sys.version_info[0]==3 else 1)" >/dev/null 2>&1; then PY="$c"; break; fi
done

command -v node    >/dev/null || { echo "Node.js missing"; exit 1; }
[ -n "$PY" ]                  || { echo "Python 3 missing"; exit 1; }
command -v ffmpeg  >/dev/null || { echo "FFmpeg missing"; exit 1; }
command -v ffprobe >/dev/null || { echo "ffprobe missing"; exit 1; }
[ -d node_modules/playwright ] || { echo "Playwright missing — run: npm install && npm run setup"; exit 1; }

echo "node    $(node --version)"
echo "python  $($PY --version 2>&1)  ($PY)"
echo "ffmpeg  $(ffmpeg -version | head -1)"
echo "Environment checks passed. Implement episode-specific render command next."
