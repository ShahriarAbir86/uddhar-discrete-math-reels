# WHITEBOARD STYLE — Uddhar Visual System

## Style definition
A premium, minimal, hand-drawn whiteboard explainer. The viewer watches one mathematical idea being constructed, tested and understood. It must not look like a slide deck, template animation, generic motion-graphics package or AI stock explainer.

## Canvas
- Aspect ratio: 9:16 portrait.
- Master resolution: 1080×1920.
- Safe area: keep critical labels and logo away from top/bottom UI overlays; use a consistent 6–8% edge margin.
- Background: pure white `#FFFFFF` or warm near-white. Use a barely visible paper/board texture only if it does not reduce contrast.
- Use a fixed virtual coordinate system larger than the camera viewport when useful; camera movement reveals different parts of one composition.

## Colour roles
- Deep Navy `#101B49`: primary drawing ink, text, outlines, arrows, structure.
- Primary Orange `#F2530F`: active step, selected node, key transition, important result.
- White `#FFFFFF`: background / negative space.
- Light Neutral `#F6F6F7`: subtle backing surfaces or separators.
- Do not add extra accent colours unless the mathematical meaning requires a distinct category; if added, document why.

## Typography
- Bengali: Hind Siliguri.
- English / numerals: Plus Jakarta Sans.
- Use readable, medium-to-semibold weights. Avoid fake handwritten fonts for explanatory text.
- Marker lettering may be used sparingly for a small label, never for dense formulas.
- Maintain clear hierarchy: key concept > formula > supporting label.
- Ensure Bengali conjuncts, কার/ফলা and mathematical symbols render correctly in the selected font/runtime. If a font is unavailable, bundle or load a legitimate font source; never silently substitute a decorative typeface.

## Marker drawing language
- Lines have consistent marker-like width and rounded caps/joins.
- Draw objects with SVG stroke-dashoffset or equivalent deterministic reveal.
- Use slight hand-drawn character sparingly; avoid jitter/noisy paths.
- Arrows should be drawn from tail to head, with arrowhead appearing at the correct moment.
- Circles, boxes, dominoes, graph nodes, trees and equations must have stable geometry.
- Highlight by drawing an orange underline, ring, connector or fill accent—not by glowing.
- Erasing should look like a purposeful board wipe only when the story requires it; never use random wipe transitions.

## Composition rule: one continuous diagram
- Plan the entire episode in a single spatial map before animation.
- Define fixed coordinates for all important objects.
- Each camera shot is a viewport into the same map.
- Use pan/zoom to travel between connected areas.
- Do not rebuild or reshuffle the same objects between scenes.
- If a new visual metaphor is essential, connect it to the previous one using a drawn bridge, arrow, transformation or camera travel.
- Keep continuity of scale and direction.

## Camera
- Use slow, deliberate pan and zoom with easing.
- Camera movement should reveal meaning, not add spectacle.
- No abrupt zooms, random shake, spinning, parallax clutter or constant movement.
- Keep formulas readable at the final zoom level.
- Hold key equations long enough for a student to parse them.

## Motion hierarchy
One meaningful action at a time:
1. Marker draws the object.
2. The object settles.
3. A label appears beside it.
4. A related arrow/flow activates.
5. Orange highlight identifies the current reasoning step.
6. Camera moves only after the viewer has understood the current beat.

Avoid simultaneous unrelated motion. Motion should follow narration and logical causality.

## Scene grammar
Each scene should define:
- Narration interval.
- Visual objective.
- Fixed diagram coordinates.
- Drawing/reveal sequence.
- Active object / orange highlight.
- Camera viewport and movement.
- On-screen labels.
- Subtitle interval.
- Exit/hold condition.

## Examples of suitable visual metaphors
Use only when they are mathematically faithful:
- Induction: domino chain, then base case + inductive step proof.
- Logic: switches / decision paths / truth table.
- Sets: overlapping circles and membership.
- Relations: connected points / directed arrows.
- Graphs: nodes, edges, paths and weights.
- Trees: root, branches, levels and traversal.
- Counting: objects being selected or arranged.
- Modular arithmetic: clock / circular number line.
- Recurrence: recursive call tree or repeated subproblem structure.

## Forbidden visual shortcuts
- Stock icon packs or random emoji.
- Generic AI gradients, neon glow, lens flare, 3D extrusion.
- Crossfades between unrelated full-screen slides.
- Floating labels detached from their objects.
- Decorative motion that does not explain the concept.
- Text walls, tiny formulas, overfilled screens.
- Fake equations or visually plausible but incorrect diagrams.

## Logo
Use official logo asset only. Prefer a small unobtrusive end-card or stable corner placement. Do not animate, morph, redraw or distort the logo. Respect clear space.
