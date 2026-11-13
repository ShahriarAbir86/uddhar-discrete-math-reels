# Installs the "Uddhar Reel Preview" desktop app shortcut. Run via Install-Preview-App.cmd (double-click).
$ErrorActionPreference = "Stop"
$app = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = (Resolve-Path (Join-Path $app "..\..")).Path
foreach ($t in @("node", "git")) { if (-not (Get-Command $t -ErrorAction SilentlyContinue)) { Write-Host "Missing '$t'. Install it first (winget install OpenJS.NodeJS.LTS / Git.Git), then run this again." -ForegroundColor Yellow; exit 1 } }
$cfgLocal = Join-Path $repo "preview\config.local.json"
if (-not (Test-Path $cfgLocal)) {
  $del = Join-Path (Split-Path -Parent $repo) "Deliverables"
  $obj = [ordered]@{ deliverablesDir = $del }
  $drive = Get-ChildItem "G:\.shortcut-targets-by-id" -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -eq "1Mmm98hYrI8cpXG-LNCQqsnltz3N1HcAq" } | Select-Object -First 1
  if ($drive) { $sub = Get-ChildItem $drive.FullName -Directory -ErrorAction SilentlyContinue | Select-Object -First 1; $obj["driveLocalDir"] = if ($sub) { $sub.FullName } else { $drive.FullName } }
  ($obj | ConvertTo-Json) | Set-Content -Path $cfgLocal -Encoding UTF8
}
$desktop = [Environment]::GetFolderPath("Desktop")
$lnk = Join-Path $desktop "Uddhar Reel Preview.lnk"
$ws = New-Object -ComObject WScript.Shell
$s = $ws.CreateShortcut($lnk)
$s.TargetPath = "wscript.exe"
$s.Arguments = '"' + (Join-Path $app "launch.vbs") + '"'
$s.WorkingDirectory = $repo
$s.IconLocation = (Join-Path $app "icon.ico")
$s.Description = "Uddhar Reel Preview: updates itself and opens the reel review desk"
$s.Save()
Write-Host "Done. Desktop shortcut created: $lnk" -ForegroundColor Green
Write-Host "Double-click 'Uddhar Reel Preview' on the desktop. It pulls the latest from GitHub every time it starts."
