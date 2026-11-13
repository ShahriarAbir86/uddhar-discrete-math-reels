#!/usr/bin/env bash
# Run the pinned HyperFrames CLI with telemetry and update checks off.
# Usage: bash tools/hf.sh lint | check --json | snapshot | preview | render --quality draft -o out.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
export HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1 HYPERFRAMES_NO_UPDATE_CHECK=1
# Policy: renders always use the GPU (NVIDIA RTX 3050 NVENC + high-performance GPU for the capture browser).
args=("$@")
if [ "${1:-}" = "render" ] && [[ " $* " != *" --gpu "* ]]; then args+=(--gpu); fi
exec node_modules/.bin/hyperframes "${args[@]}"
