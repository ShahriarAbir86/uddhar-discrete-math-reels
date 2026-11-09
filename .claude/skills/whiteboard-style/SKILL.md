---
name: whiteboard-style
description: Create Uddhar's continuous hand-drawn whiteboard explainer Reels. Use for Discrete Mathematics episodes, storyboards, voiceover-synced animation, HTML/SVG builds, subtitles, rendering and QA.
---

# Uddhar Whiteboard Style Skill

When the user invokes `/whiteboard-style`, asks for a whiteboard explainer, or provides a script and voiceover for a Uddhar episode, apply this skill.

## Mandatory references
Before production, read the project files when available:
- `brand/BRAND_GUIDELINE.md`
- `series/SERIES_BIBLE.md`
- `series/WHITEBOARD_STYLE.md`
- `series/AUDIO_AND_SUBTITLE_RULES.md`
- `series/ANIMATION_AND_RENDER_PIPELINE.md`
- `series/QUALITY_CHECKLIST.md`
- episode `script.md`, `brief.md`, `references.md`, and voiceover.

If these files are not available, follow the rules below and tell the user which reference files are missing.

## Core visual identity
- Minimal premium whiteboard explainer; white / warm-white background.
- Deep Navy `#101B49` for main ink, text, diagrams and arrows.
- Primary Orange `#F2530F` for active step, selected node and important result.
- White `#FFFFFF`, Light Neutral `#F6F6F7`.
- Bengali: Hind Siliguri. English: Plus Jakarta Sans.
- Latest official Uddhar logo asset only. Never redraw or approximate it. If missing, reserve a placeholder and request the asset before final branded export.
- Avoid old logo, old blue-yellow palette, purple-neon-lime, generic gradients, glow, stock icons, fake 3D and template transitions.

## Composition
- One continuous mathematical diagram / spatial world per episode.
- Plan the complete diagram before animation.
- Keep object coordinates stable; move camera through the diagram with pan/zoom.
- Never reshuffle or teleport objects between scenes.
- Picture before words. Labels should sit beside the object they describe.
- Target <=7 explanatory words visible at once, excluding formulas and subtitles.
- Keep equations large enough for a phone screen.

## Motion
- Hand-drawn marker reveal with consistent stroke weight and rounded caps.
- Arrows draw from tail to head.
- Orange highlight communicates the current reasoning step.
- One meaningful action at a time; let each action settle before the next.
- Slow, purposeful camera motion; no random movement, shake or gratuitous zoom.
- Avoid unrelated simultaneous animation.

## Storytelling
Adapt the following flow to the narration:
1. Hook / question.
2. Familiar visual metaphor.
3. Reveal and name the concept.
4. Explain the rule / definition.
5. Work through a concrete example.
6. Accurate Computer Science connection.
7. Final memory anchor.

Friendly, curious, clear Bangla with natural English technical terms. Never patronize students or guarantee grades/results.

## Audio is the timeline authority
- Use the exact user-provided voiceover. No TTS or replacement voice.
- Inspect duration, channels, sample rate, peaks and actual spoken content.
- Compare transcript to script; flag any mismatch.
- Derive scene and subtitle timing from the actual recording with alignment tools where available.
- Do not use estimated timings as final.
- Preserve natural pauses. Do not speed up narration to meet an arbitrary duration.
- Deliver accurate SRT subtitles with readable phrase-level segmentation.

## Academic accuracy
Verify every definition, formula, algebraic step, example assumption and CS application using reputable sources. Maintain a references file. Clearly distinguish metaphor from proof. Never silently rewrite narration to fix an error; report it and request approval.

## Technical implementation
Preferred stack: HTML + SVG + CSS + JavaScript, Playwright/Chromium, FFmpeg, Python utilities.
- Stage: 1080×1920, 9:16, 60fps.
- Expose deterministic `window.seek(t)` (or equivalent).
- Every property is derived from absolute time; same time always produces same frame.
- No CSS animations, timers, uncontrolled requestAnimationFrame state or unseeded randomness.
- Use stable fixed coordinates.
- Export keyframes per scene and review before full render.
- Motion blur is optional, not mandatory; protect text and thin strokes from ghosting.
- Mux exact supplied voiceover; do not invent background music. Music must be licensed/user-provided and quiet.

## Production sequence
1. Inspect inputs.
2. Analyze voiceover and align narration.
3. Verify content and references.
4. Create continuous diagram map.
5. Create voice-synced storyboard.
6. Implement deterministic animation.
7. Export keyframes and contact sheet.
8. Review and fix keyframes.
9. Render preview and inspect.
10. Render final MP4.
11. Run ffprobe and visual QA.
12. Deliver MP4, source, SRT, storyboard, references, keyframes and QA report.

## Quality gate
Do not claim completion unless actual outputs exist and were checked. If the environment cannot render, deliver complete editable source and exact run commands, then clearly state the remaining steps.

## Invocation
Recommended user command:
`/whiteboard-style Create EPXX. Use the attached approved script and exact voiceover. Complete the full pipeline and deliver final MP4, source, subtitles and QA report.`

If slash-style invocation is not surfaced in the Claude UI, the user can write:
`Use the whiteboard-style skill and follow the Uddhar Project Knowledge.`
