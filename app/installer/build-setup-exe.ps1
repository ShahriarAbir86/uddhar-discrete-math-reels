# Builds dist\Claude-Video-Maker-Setup.exe with IExpress (built into Windows). Run from anywhere.
$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$out = Join-Path (Resolve-Path (Join-Path $here "..\..")).Path "dist"
New-Item -ItemType Directory -Force $out | Out-Null
$exe = Join-Path $out "Claude-Video-Maker-Setup.exe"
$sed = Join-Path $env:TEMP "cvm-setup.sed"
@"
[Version]
Class=IEXPRESS
SEDVersion=3
[Options]
PackagePurpose=InstallApp
ShowInstallProgramWindow=1
HideExtractAnimation=1
UseLongFileName=1
InsideCompressed=0
CAB_FixedSize=0
CAB_ResvCodeSigning=0
RebootMode=N
InstallPrompt=
DisplayLicense=
FinishMessage=
TargetName=$exe
FriendlyName=Claude Video Maker v1 Setup
AppLaunched=powershell.exe -NoProfile -ExecutionPolicy Bypass -File bootstrap.ps1
PostInstallCmd=<None>
AdminQuietInstCmd=
UserQuietInstCmd=
SourceFiles=SourceFiles
[Strings]
[SourceFiles]
SourceFiles0=$here
[SourceFiles0]
bootstrap.ps1=
"@ | Set-Content -Path $sed -Encoding ASCII
& iexpress.exe /N /Q $sed | Out-Null
Start-Sleep 3
if (Test-Path $exe) { Write-Host "Built $exe" -ForegroundColor Green } else { Write-Host "IExpress did not produce the exe" -ForegroundColor Red; exit 1 }
