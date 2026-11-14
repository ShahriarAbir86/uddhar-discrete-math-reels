@echo off
rem Claude Video Maker launcher: update from GitHub (if this is a git checkout), then start the local app window.
cd /d "%~dp0.."
if exist ".git" git pull --ff-only >nul 2>&1
node app\server.mjs --open
