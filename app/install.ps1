# Claude Video Maker v1 installer. Run via Install-Claude-Video-Maker.cmd (double-click).
# Checks the tools, installs the render engine's packages, and creates Desktop + Start Menu shortcuts.
param([switch]$NoShortcut)
$ErrorActionPreference = "Stop"
$app = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = (Resolve-Path (Join-Path $app "..")).Path
function Have($c) { [bool](Get-Command $c -ErrorAction SilentlyContinue) }
Write-Host "`nClaude Video Maker v1: setup" -ForegroundColor Cyan
Write-Host "Engine folder: $repo`n"
$missing = @()
if (-not (Have "node")) { $missing += "Node.js LTS    -> winget install OpenJS.NodeJS.LTS" }
if (-not (Have "git"))  { $missing += "Git for Windows (includes bash, needed by the render script) -> winget install Git.Git" }
if ($missing.Count) { Write-Host "Required tools are missing:" -ForegroundColor Yellow; $missing | ForEach-Object { Write-Host "  $_" }; Write-Host "`nInstall them, close this window and run the installer again."; exit 1 }
$warn = @()
if (-not (Have "claude")) { $warn += "Claude Code CLI not found. Install it from https://claude.com/claude-code and sign in (run 'claude' once). The app needs it to generate videos." }
if (-not (Have "ffmpeg")) { $warn += "FFmpeg not found (needed for posters and rendering) -> winget install Gyan.FFmpeg" }
if (-not (Have "nvidia-smi")) { $warn += "No NVIDIA driver detected. The app will still work; set GPU to 'Auto' or 'CPU only' in Settings." }
if (-not (Test-Path (Join-Path $repo "node_modules\.bin\hyperframes"))) {
  Write-Host "Installing render engine packages (one time, a few minutes)..." -ForegroundColor Cyan
  Push-Location $repo; try { npm install --no-audit --no-fund; npm run setup } finally { Pop-Location }
}
if (-not $NoShortcut) {
  $ws = New-Object -ComObject WScript.Shell
  foreach ($dir in @([Environment]::GetFolderPath("Desktop"), (Join-Path ([Environment]::GetFolderPath("Programs")) ""))) {
    $lnk = Join-Path $dir "Claude Video Maker.lnk"
    $s = $ws.CreateShortcut($lnk)
    $s.TargetPath = "wscript.exe"; $s.Arguments = '"' + (Join-Path $app "launch.vbs") + '"'
    $s.WorkingDirectory = $repo; $s.IconLocation = (Join-Path $app "icon.ico")
    $s.Description = "Claude Video Maker v1: build Uddhar reels from projects"; $s.Save()
    Write-Host "Shortcut: $lnk" -ForegroundColor Green
  }
}
if ($warn.Count) { Write-Host "`nHeads-up:" -ForegroundColor Yellow; $warn | ForEach-Object { Write-Host "  - $_" } }
Write-Host "`nDone. Open 'Claude Video Maker' from the Desktop or Start Menu." -ForegroundColor Green
