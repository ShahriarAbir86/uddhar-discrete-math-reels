# Setup.exe payload: gets the engine from GitHub (public repo) into Documents\Claude Video Maker\engine, then runs the installer.
$ErrorActionPreference = "Stop"
$url = "https://github.com/ShahriarAbir86/uddhar-discrete-math-reels.git"
$dest = Join-Path ([Environment]::GetFolderPath("MyDocuments")) "Claude Video Maker\engine"
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { Write-Host "Git is required: winget install Git.Git, then run this setup again." -ForegroundColor Yellow; Read-Host "Press Enter to close"; exit 1 }
if (Test-Path (Join-Path $dest ".git")) { git -C $dest pull --ff-only } else { New-Item -ItemType Directory -Force (Split-Path $dest) | Out-Null; git clone $url $dest }
& powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $dest "app\install.ps1")
Read-Host "Press Enter to close"
