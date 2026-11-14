@echo off
rem Installs Claude Video Maker v1 (checks tools, installs engine packages, creates shortcuts).
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0app\install.ps1"
echo.
pause
