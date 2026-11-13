@echo off
rem Uddhar Reel Preview launcher: pull latest from GitHub, rebuild data, start the local app window.
cd /d "%~dp0..\.."
git pull --ff-only >nul 2>&1
node tools\build_preview.mjs >nul 2>&1
node preview\app\server.mjs --open
