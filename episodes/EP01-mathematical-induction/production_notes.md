# EP01 Production Notes
- Source of truth: src/build.mjs generates src/index.html. Edit build.mjs and run `node build.mjs`; do not hand-edit index.html.
- Timing: qa/phrase_times.json (from tools/phrase_times.py + qa/pauses.json). Regenerate if the voiceover changes.
- Render: `bash tools/hf.sh render --quality delivery --fps 60 --gpu -o episodes/EP01-mathematical-induction/renders/final.mp4` (run inside src/).
- World: 1500×3800 units, zones A (dominoes), B (proof), C (recursion); camera = transform of one group.
- Tracking: qa/run_summary.md and series/RUN_LOG.csv.
