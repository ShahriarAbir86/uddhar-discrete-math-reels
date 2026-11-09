# Master Prompt — Produce a Uddhar Whiteboard Explainer Episode

Use the `/whiteboard-style` skill and follow all relevant project files.

You are responsible for completing the episode production, not merely describing how to do it.

## Inputs
I will provide:
1. An approved Bangla narration script.
2. The exact voiceover MP3/WAV.
3. Optional reference links, syllabus, official logo asset or visual references.

## Required workflow
### Phase 1 — Intake
- Inspect all provided files.
- Confirm exact audio duration, format, sample rate and channels.
- Transcribe the recording and compare it with the script.
- Report any mismatch, unclear word, missing line or pronunciation issue.
- If the official logo file is not available, use a documented placeholder and ask me to add the official asset. Do not recreate it.
- Do not ask questions for information already supplied.

### Phase 2 — Research and accuracy
- Verify every definition, equation, worked step and CS application.
- Use authoritative educational sources.
- Create `references.md` with exact source URLs and claim mapping.
- Do not invent statistics, quotes, examples presented as facts, or syllabus claims.
- If the script contains an error, stop and show the exact issue with a proposed correction; do not silently alter narration.

### Phase 3 — Visual planning
- Design one continuous diagram / spatial composition.
- Create a scene-by-scene storyboard using actual voiceover alignment.
- Specify camera viewport, object coordinates, marker drawing order, orange highlights, labels and subtitle intervals.
- Picture before words; keep explanatory text concise.
- The same objects must remain spatially consistent across camera moves.

### Phase 4 — Build
- Implement HTML/SVG/CSS/JS with a deterministic `seek(t)` timeline.
- No CSS animations, timers, uncontrolled animation loops or random state.
- Build at 1080×1920 portrait.
- Use Uddhar Whiteboard Style exactly.
- Use the supplied voiceover; do not generate replacement speech.
- Generate accurate SRT subtitles.

### Phase 5 — Review before render
- Export at least one keyframe per scene plus a contact sheet.
- Inspect every keyframe for readability, mathematical correctness, composition, logo and continuity.
- Fix defects before full render.
- Create a short preview and inspect it.

### Phase 6 — Final render and QA
- Render 60fps H.264 MP4, 1080×1920.
- Mux the exact voiceover.
- Check duration, fps, resolution, audio stream, clipping and subtitle sync using actual tools.
- Extract and inspect representative final frames.
- Never claim a check was passed unless the command ran and its output was inspected.

## Required outputs
Save inside `episodes/EPXX-topic/`:
- `script.md`
- `references.md`
- `storyboard.md`
- `diagram-map.md`
- `audio_alignment.json` (if tool supports it)
- `subtitles.srt`
- `src/` editable source
- `renders/keyframes/`
- `renders/preview.mp4`
- `renders/final.mp4`
- `qa/qa_report.md`
- `production_notes.md`

## Final response
Give me:
1. Final MP4 file.
2. Source project.
3. SRT.
4. Storyboard and references.
5. Keyframe contact sheet.
6. QA summary with actual render specs.
7. Any limitation or remaining manual action.

Start by inspecting the inputs and then continue through all phases. Do not stop at the plan unless a blocking input is genuinely missing.
