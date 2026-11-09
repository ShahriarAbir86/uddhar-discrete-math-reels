# Skills Registry

Third-party skills copied into `.claude/skills/` (full local dump of the source repos: `C:\Educational\Phitron\Uddhar\skills-library\`, not in Git).

| Skills | Source | Commit | License |
|---|---|---|---|
| hyperframes, hyperframes-cli, hyperframes-registry, media-use, style-sampling | https://github.com/heygen-com/hyperframes | a73572c | Apache-2.0 |
| motion-doctrine, seam-craft, cut-the-curve, captions-overlay | same repo (`.claude/skills`) | a73572c | Apache-2.0 |
| gsap-core, gsap-timeline, gsap-plugins, gsap-utils, gsap-performance, gsap-scrolltrigger, gsap-react, gsap-frameworks | https://github.com/greensock/gsap-skills | aed9cfd | MIT |
| video-storytelling | https://github.com/nateherkai/herk-edit-kit | 10511e5 | MIT |
| whiteboard-style | Uddhar (own) | — | — |

Licenses: `docs/third-party-licenses/`.
Not copied (kept in the local dump for reference): awesome-claude-video-skills (index of 180 repos), hyperframes-motion-reel-skill, anything2explainer, remotion-to-hyperframes, the rest of herk-edit-kit.
CLI: npm package `hyperframes`, pinned to 0.9.26 in `package.json` (Apache-2.0). Chrome Headless Shell installed via `npx hyperframes browser ensure`. Tested 2026-11-09: scaffold, lint and a 10 s draft render completed in 15 s (h264).
Always run it through `tools/hf.sh`, which turns telemetry and update checks off (`HYPERFRAMES_NO_TELEMETRY`, `DO_NOT_TRACK`, `HYPERFRAMES_NO_UPDATE_CHECK`).
Not installed (optional): whisper-cpp (transcription; `doctor` lists the build steps), Docker (cloud/containers), Kokoro TTS and MusicGen (not used: voiceover is supplied, no music).
