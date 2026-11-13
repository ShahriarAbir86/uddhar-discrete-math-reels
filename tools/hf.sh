#!/usr/bin/env bash
# Run the pinned HyperFrames CLI with telemetry and update checks off.
# Usage: bash tools/hf.sh lint | check --json | snapshot | preview | render --quality draft -o out.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
export HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1 HYPERFRAMES_NO_UPDATE_CHECK=1
# Policy: renders always use the NVIDIA RTX GPU (NVENC encode + high-performance GPU for the capture browser).
args=("$@")
if [ "${1:-}" = "render" ] && [[ " $* " != *" --gpu "* ]]; then args+=(--gpu); fi
if [ "${1:-}" = "render" ]; then
  # Force every chrome-headless-shell (capture browser) onto the NVIDIA GPU via the Windows per-app preference.
  powershell.exe -NoProfile -Command '
    $k="HKCU:\Software\Microsoft\DirectX\UserGpuPreferences"; if(-not(Test-Path $k)){New-Item $k -Force|Out-Null}
    foreach($r in @("$env:USERPROFILE\.cache\hyperframes","$env:LOCALAPPDATA\ms-playwright")){ if(Test-Path $r){ Get-ChildItem $r -Recurse -Filter chrome-headless-shell.exe -ErrorAction SilentlyContinue | ForEach-Object { Set-ItemProperty $k $_.FullName "GpuPreference=2;" } } }' || true
  nvidia-smi --query-gpu=name --format=csv,noheader 2>/dev/null | sed 's/^/[render] GPU: /' || true
fi
exec node_modules/.bin/hyperframes "${args[@]}"
