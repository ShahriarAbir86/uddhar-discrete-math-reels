# Claude Video Maker v1

A desktop app for building Uddhar reels as **projects**. Glassmorphism + neumorphism UI in the Uddhar palette (Deep Navy `#101B49`, Orange `#F2530F`, Cream `#FEEEE7`).

Generation runs the **Claude Code CLI** inside this repo (the "engine"), so every project uses the same styles, skills, HyperFrames pipeline and GPU rules as the hand-made episodes.

## Install (any Windows PC)
1. Needs Node.js LTS, Git for Windows (gives `bash`), FFmpeg, and the Claude Code CLI signed in. The installer tells you what is missing.
2. Double-click `Install-Claude-Video-Maker.cmd` (inside a clone of this repo), or build the one-file setup with `app/installer/build-setup-exe.ps1` (writes `dist/Claude-Video-Maker-Setup.exe`, it clones the repo into `Documents\Claude Video Maker\engine` and runs the same installer). The exe is unsigned, so Windows SmartScreen may warn.
3. Open **Claude Video Maker** from the Desktop or Start Menu. Each launch pulls the latest version from GitHub, then opens the app window.

## Screens
- **Projects**: cards with thumbnail, date and status (Draft / Generating / Generated / Exported), search, style and status filters, New Project, Duplicate, Lock, Delete.
- **Composer** (per project): Content, Style (with Light/Dark mode for Animation Story, required), References (each with a "what to take" note), Brand Kit, Special Assets (with "where to use"), Audio, Output, Engine & Render, Extra Instructions. Everything is saved in `project.json`.
- **Brief Review**: before Generate, lists every file and choice, flags missing or moved files, missing notes, missing voiceover, GPU problems and a locked project.
- **Results**: player, Log (live tool/decision/error stream), Versions (side-by-side compare), Revise (scene or timestamp feedback, only that changes), Export (Deliverables + Drive), Save as Style.
- **Library**: Styles (built-in Whiteboard and Animation Story, your own, "New style from reference" with optional *Analyze with Claude*), Brand Kits, References, Assets.
- **Review Desk**: the earlier preview app (run summaries, style comparison) embedded.
- **Settings**: GPU (NVIDIA RTX / Auto / CPU only), render quality, Claude model, thinking effort, permission mode, max run time, storyboard approval gate, log keeping, auto-export, folders, environment check, update, quit.

## How a generation works
1. The app writes `brief.md` (from `project.json` + library) and starts `claude -p` in the repo with `UDDHAR_GPU` and the other settings in its environment. `tools/hf.sh` reads `UDDHAR_GPU` (default `nvidia`).
2. With the storyboard gate on (the repo rule), step 1 produces only the storyboard; you approve it in the app, then step 2 builds, renders and runs QA.
3. Claude writes `versions/vN/DONE.json` and `final.mp4`; the app records tokens, cost, time, GPU and quality for the version.
4. A **lock file** (`locks/<project>.lock`) exists while a run is active: the project cannot be edited or started twice and only one generation runs at a time. Locks left by a crash are cleared on the next start. `locks/app.lock` marks the running app.

## Data
Default `Documents\Claude Video Maker\`: `settings.json`, `library/library.json`, `projects/<id>/{project.json, brief.md, uploads/, versions/vN/}`. Deleting a project moves it to a hidden `.trash-*` folder.

## Safety
The server listens on 127.0.0.1 only, checks the Host header, and API calls need a session cookie that only the app page receives. "Bypass all prompts" permission mode is off by default.

## Run from source
`node app/server.mjs --open` (port 4180, `CVM_PORT` / `CVM_DATA` environment variables override port and data folder).
