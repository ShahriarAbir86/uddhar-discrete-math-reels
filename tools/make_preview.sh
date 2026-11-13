#!/usr/bin/env bash
# Make a small web preview (540x960, 30 fps, ~5-8 MB) of an episode's final render for the remote Preview page.
# Usage: bash tools/make_preview.sh EP01-mathematical-induction ep01
set -euo pipefail
cd "$(dirname "$0")/.."
EP="$1"; ID="$2"
SRC="episodes/$EP/renders/final.mp4"
[ -f "$SRC" ] || { echo "missing $SRC"; exit 1; }
ffmpeg -v error -y -i "$SRC" -vf "scale=540:960:flags=lanczos,fps=30" -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 64k "preview/media/$ID.mp4"
ffmpeg -v error -y -ss 3 -i "$SRC" -frames:v 1 -vf "scale=360:640" -q:v 4 "preview/media/$ID.jpg"
ls -la "preview/media/$ID.mp4"
