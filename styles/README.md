# Uddhar Styles Library

Always-follow folder for visual styles. Each style has a spec here and a matching Claude skill in `.claude/skills/`.

| Style | Spec | Skill | When |
|---|---|---|---|
| **Whiteboard** — navy marker on clean white board, one continuous diagram | `styles/whiteboard/WHITEBOARD_STYLE.md` (copy of `series/WHITEBOARD_STYLE.md`) + `brand/BRAND_GUIDELINE.md` | `whiteboard-style` | Discrete-Math concept explainers (EP01 is this style) |
| **Animation Story** — paper-cut documentary world, orange hero, halftone photos, stat scenes. **Two modes: Light (brand cream `#FEEEE7`) and Dark (brand navy `#101B49`); ask which, every reel** | `styles/animation-story/STYLE_GUIDE.md`, `tokens.json`, `palette.mjs`, `tools/make_paper.py`, `reference/` | `animation-story-style` | Story/narrative/career/context reels, anything with a character and real-world setting |

## Rules shared by all styles
- 9:16, 1080×1920, 60 fps; official Uddhar logo only (`brand/assets/`); user's ElevenLabs voiceover is the timeline; no TTS/music by default.
- Brand colours Deep Navy `#101B49` + Primary Orange `#F2530F`; Hind Siliguri + Plus Jakarta Sans.
- Pipeline: `series/PRODUCTION_PIPELINE.md` (HyperFrames + GSAP, `tools/hf.sh`, GPU render, per-reel run summary).
- Old Drive "Storyboard স্যাম্পলস" / "Big O" material is a previous style: never a reference.

## Keeping it in sync
`series/WHITEBOARD_STYLE.md` is the source of truth for whiteboard; if it changes, re-copy it into `styles/whiteboard/`.
The Animation Story reference video is not in Git (63 MB): `C:\Educational\Phitron\Uddhar\Video Styles references\AnimationStorystyle.mp4`.
