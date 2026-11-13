# Uddhar Reel Preview: install on any Windows PC

**What you get:** a desktop app (shortcut on the Desktop) that opens the reel review desk in its own window, updates itself from GitHub every time you open it, plays every episode, shows tokens / work time / render time per episode and a style comparison, downloads the final MP4 in one click, and opens the episode folder, the Deliverables folder or the Drive folder.

## Install (about 2 minutes)
1. Install Node.js LTS and Git if you do not have them: `winget install OpenJS.NodeJS.LTS` and `winget install Git.Git`.
2. Get the project (you need access to the GitHub repo): `git clone https://github.com/ShahriarAbir86/uddhar-discrete-math-reels` into any folder.
3. Double-click **Install-Preview-App.cmd** in the project folder.
4. Open **Uddhar Reel Preview** from the Desktop.

## Daily use
Double-click the shortcut. It runs `git pull`, rebuilds the data and opens the window. The **Update now** button does the same while the app is open.

## Download buttons
- *Download final MP4* works when the final file is on this PC (`..\Deliverables\EPxx...` next to the project folder, or `episodes\EPxx...\renders\final.mp4`). On other PCs use **Open Drive in browser** and download from Drive.
- *Download preview* always works (small 540x960 copy kept in the repo).

## Settings (optional)
`preview/config.local.json` (created by the installer, not committed): `deliverablesDir` and `driveLocalDir` (the Drive for desktop folder on this PC). `preview/config.json` holds the shared Drive and GitHub links and the port.

## Without installing
Ask for the private preview link (a Claude artifact page). It plays on any device but has no folder or download buttons.

## Add a new episode to the page
1. `bash tools/make_preview.sh EPxx-folder epxx`
2. Add an entry to `preview/episodes.json`
3. `node tools/build_preview.mjs` (the app does this on start), then commit and push.
