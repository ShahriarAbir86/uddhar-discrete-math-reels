#!/usr/bin/env python3
"""Per-reel production summary: tokens, time, output specs, tools/skills/styles/references.

Usage (from the repo root):
  python tools/run_summary.py start  EP01-mathematical-induction
  python tools/run_summary.py mark   EP01-mathematical-induction "storyboard approved"
  python tools/run_summary.py finish EP01-mathematical-induction

start/mark record timestamps in episodes/<EP>/qa/run_state.json.
finish reads Claude Code session transcripts (~/.claude/projects/**.jsonl) for the
start..now window, sums token usage per model, probes the final MP4/audio with ffprobe,
merges qa/run_meta.json (styles, references, plugins... written by Claude at the end),
then writes episodes/<EP>/qa/run_summary.md and appends a row to series/RUN_LOG.csv.
Only facts that were measured are printed; missing data is shown as "n/a".
"""
import csv, glob, json, os, re, shutil, subprocess, sys
from collections import Counter, defaultdict
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IDLE_GAP_S = 600  # gaps longer than this are not counted as active working time


def now():
    return datetime.now(timezone.utc)


def parse_ts(s):
    return datetime.fromisoformat(s.replace("Z", "+00:00"))


def ep_dir(ep):
    d = os.path.join(ROOT, "episodes", ep)
    if not os.path.isdir(d):
        sys.exit(f"Episode folder not found: {d}")
    os.makedirs(os.path.join(d, "qa"), exist_ok=True)
    return d


def load_json(p, default):
    try:
        with open(p, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return default


def save_json(p, obj):
    with open(p, "w", encoding="utf-8", newline="\n") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)
        f.write("\n")


def fmt_dur(sec):
    sec = int(round(sec))
    h, r = divmod(sec, 3600)
    m, s = divmod(r, 60)
    return f"{h}h {m:02d}m {s:02d}s" if h else f"{m}m {s:02d}s"


def fmt_n(n):
    return f"{n:,}"


def transcripts():
    base = os.path.join(os.path.expanduser("~"), ".claude", "projects")
    return glob.glob(os.path.join(base, "*", "*.jsonl"))


def collect(start, end):
    """Token usage + tool usage from transcripts inside [start, end]."""
    msgs = {}  # message id -> (ts, model, usage); streaming repeats the same id, keep last
    stamps, tools, skills, webs = [], Counter(), Counter(), 0
    cmds = Counter()
    for path in transcripts():
        try:
            fh = open(path, encoding="utf-8")
        except OSError:
            continue
        with fh:
            for line in fh:
                try:
                    o = json.loads(line)
                except ValueError:
                    continue
                ts = o.get("timestamp")
                if not ts:
                    continue
                try:
                    t = parse_ts(ts)
                except ValueError:
                    continue
                if t < start or t > end:
                    continue
                stamps.append(t)
                if o.get("type") != "assistant":
                    continue
                m = o.get("message") or {}
                if not isinstance(m, dict):
                    continue
                u = m.get("usage")
                if u and m.get("model") and m.get("model") != "<synthetic>":
                    msgs[m.get("id") or o.get("requestId") or ts] = (t, m["model"], u)
                for c in m.get("content") or []:
                    if not isinstance(c, dict) or c.get("type") != "tool_use":
                        continue
                    name, inp = c.get("name", "?"), c.get("input") or {}
                    tools[name] += 1
                    if name == "Skill" and inp.get("skill"):
                        skills[inp["skill"]] += 1
                    if name == "WebSearch":
                        webs += 1
                    if name in ("Bash", "PowerShell"):
                        cmd = inp.get("command", "")
                        for k in ("hyperframes", "ffmpeg", "ffprobe", "playwright", "gh ", "git "):
                            if k in cmd:
                                cmds[k.strip()] += 1
                    if name == "Read":
                        p = (inp.get("file_path") or "").replace("\\", "/")
                        mm = re.search(r"/skills/([^/]+)/", p)
                        if mm:
                            skills["(read) " + mm.group(1)] += 1
    per_model = defaultdict(lambda: Counter())
    for _, model, u in msgs.values():
        pm = per_model[model]
        pm["calls"] += 1
        pm["input"] += u.get("input_tokens", 0) or 0
        pm["output"] += u.get("output_tokens", 0) or 0
        pm["cache_write"] += u.get("cache_creation_input_tokens", 0) or 0
        pm["cache_read"] += u.get("cache_read_input_tokens", 0) or 0
        pm["thinking"] += (u.get("output_tokens_details") or {}).get("thinking_tokens", 0) or 0
    stamps.sort()
    active = sum((b - a).total_seconds() for a, b in zip(stamps, stamps[1:]) if (b - a).total_seconds() <= IDLE_GAP_S)
    return per_model, tools, skills, cmds, webs, active, len(stamps)


def probe(path):
    ff = shutil.which("ffprobe")
    if not ff or not os.path.isfile(path):
        return None
    try:
        out = subprocess.run(
            [ff, "-v", "error", "-show_entries",
             "format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate,pix_fmt,sample_rate,channels",
             "-of", "json", path], capture_output=True, text=True, timeout=60).stdout
        return json.loads(out)
    except Exception:
        return None


def media_lines(label, path):
    p = probe(path)
    if not p:
        return [f"- {label}: n/a (file missing or ffprobe unavailable)"]
    f = p.get("format", {})
    v = next((s for s in p["streams"] if s.get("codec_type") == "video"), None)
    a = next((s for s in p["streams"] if s.get("codec_type") == "audio"), None)
    size = int(f.get('size', 0))
    parts = [f"{float(f.get('duration', 0)):.2f}s", f"{size / 1e6:.1f} MB" if size >= 1e6 else f"{size / 1e3:.0f} KB"]
    if v:
        num, _, den = v.get("r_frame_rate", "0/1").partition("/")
        fps = float(num) / float(den or 1) if float(den or 1) else 0
        parts.append(f"{v['width']}x{v['height']} @ {fps:g}fps {v['codec_name']} {v.get('pix_fmt', '')}".strip())
    if a:
        parts.append(f"audio {a['codec_name']} {a.get('sample_rate', '?')}Hz {a.get('channels', '?')}ch")
    return [f"- {label}: " + " | ".join(parts)]


def find_one(d, patterns):
    for pat in patterns:
        hits = sorted(glob.glob(os.path.join(d, pat), recursive=True))
        if hits:
            return hits[0]
    return ""


def cmd_start(ep):
    d = ep_dir(ep)
    p = os.path.join(d, "qa", "run_state.json")
    st = load_json(p, {})
    st["start"] = now().isoformat()
    st["marks"] = [{"t": st["start"], "label": "start"}]
    save_json(p, st)
    meta = os.path.join(d, "qa", "run_meta.json")
    if not os.path.exists(meta):
        save_json(meta, {"style": [], "skills": [], "plugins": [], "tools": [], "references": [],
                         "inspiration": [], "notes": ""})
    print(f"Run started for {ep} at {st['start']}")


def cmd_mark(ep, label):
    d = ep_dir(ep)
    p = os.path.join(d, "qa", "run_state.json")
    st = load_json(p, None)
    if not st:
        sys.exit("Run not started. Use: start <episode>")
    st["marks"].append({"t": now().isoformat(), "label": label})
    save_json(p, st)
    print(f"Marked: {label}")


def cmd_finish(ep):
    d = ep_dir(ep)
    st = load_json(os.path.join(d, "qa", "run_state.json"), None)
    if not st:
        sys.exit("Run not started. Use: start <episode>")
    start, end = parse_ts(st["start"]), now()
    per_model, tools, skills, cmds, webs, active, n_events = collect(start, end)
    meta = load_json(os.path.join(d, "qa", "run_meta.json"), {})

    final = find_one(d, ["renders/final.mp4", "renders/*final*.mp4"])
    prev = find_one(d, ["renders/preview.mp4", "renders/*preview*.mp4"])
    audio = find_one(d, ["inputs/voiceover.*", "*.mp3", "*.wav", "*.m4a"])
    srt = find_one(d, ["subtitles.srt", "**/*.srt"])

    tot = Counter()
    for c in per_model.values():
        tot.update(c)
    wall = (end - start).total_seconds()

    L = [f"# Run Summary — {ep}", "",
         f"Generated: {end.strftime('%Y-%m-%d %H:%M UTC')}", "",
         "## Time",
         f"- Started: {start.strftime('%Y-%m-%d %H:%M UTC')}",
         f"- Wall-clock (start to finish): {fmt_dur(wall)}",
         f"- Active working time (gaps over {IDLE_GAP_S // 60} min excluded): {fmt_dur(active)}",
         ""]
    marks = st.get("marks", [])
    if len(marks) > 1:
        L += ["| Stage | Elapsed since start |", "|---|---|"]
        for m in marks:
            L.append(f"| {m['label']} | {fmt_dur((parse_ts(m['t']) - start).total_seconds())} |")
        L.append("")

    L += ["## Tokens (measured from Claude Code session logs)"]
    if per_model:
        L += ["| Model | API calls | Input | Output | of which thinking | Cache write | Cache read |",
              "|---|---|---|---|---|---|---|"]
        for model, c in sorted(per_model.items()):
            L.append(f"| {model} | {fmt_n(c['calls'])} | {fmt_n(c['input'])} | {fmt_n(c['output'])} | "
                     f"{fmt_n(c['thinking'])} | {fmt_n(c['cache_write'])} | {fmt_n(c['cache_read'])} |")
        L.append(f"| **Total** | {fmt_n(tot['calls'])} | {fmt_n(tot['input'])} | {fmt_n(tot['output'])} | "
                 f"{fmt_n(tot['thinking'])} | {fmt_n(tot['cache_write'])} | {fmt_n(tot['cache_read'])} |")
        L += ["", "Input is uncached input only; cached context is shown separately. "
                  "Sessions run in this window are all counted, including unrelated chat."]
    else:
        L.append("- n/a (no session logs found for this window)")
    L.append("")

    L += ["## Output"]
    L += media_lines("Final MP4", final) if final else ["- Final MP4: n/a (not rendered)"]
    if prev:
        L += media_lines("Preview MP4", prev)
    L += media_lines("Voiceover", audio) if audio else ["- Voiceover: n/a"]
    L.append(f"- Subtitles: {os.path.relpath(srt, d) if srt else 'n/a'}")
    kf = glob.glob(os.path.join(d, "renders", "keyframes", "*"))
    L.append(f"- Keyframes exported: {len(kf)}")
    if final and audio:
        try:
            vd = float(probe(final)["format"]["duration"]); ad = float(probe(audio)["format"]["duration"])
            L.append(f"- Video minus voiceover duration: {vd - ad:+.2f}s")
        except Exception:
            pass
    L.append("")

    all_skills = sorted(set(meta.get("skills", [])) | {s for s in skills if not s.startswith("(read)")}
                        | {s[7:] for s in skills if s.startswith("(read)")})
    L += ["## How it was made",
          f"- Style: {', '.join(meta.get('style', [])) or 'n/a'}",
          f"- Skills used: {', '.join(all_skills) or 'n/a'}",
          f"- Plugins / libraries: {', '.join(meta.get('plugins', [])) or 'n/a'}",
          f"- Tools: {', '.join(meta.get('tools', [])) or 'n/a'}"]
    if cmds:
        L.append("- Commands run (counts): " + ", ".join(f"{k} x{v}" for k, v in cmds.most_common()))
    if tools:
        L.append("- Claude tool calls: " + ", ".join(f"{k} x{v}" for k, v in tools.most_common(8))
                 + (f"; web searches x{webs}" if webs else ""))
    L += ["", "## References"]
    refs = meta.get("references", [])
    L += [f"- {r}" for r in refs] or ["- n/a"]
    insp = meta.get("inspiration", [])
    L += ["", "## Inspiration images"] + ([f"- {r}" for r in insp] or ["- none"])
    if meta.get("notes"):
        L += ["", "## Notes", meta["notes"]]
    L.append("")

    out = os.path.join(d, "qa", "run_summary.md")
    with open(out, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(L))

    log = os.path.join(ROOT, "series", "RUN_LOG.csv")
    new = not os.path.exists(log)
    with open(log, "a", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        if new:
            w.writerow(["episode", "finished_utc", "wall_clock", "active_time", "calls", "input_tokens",
                        "output_tokens", "cache_write", "cache_read", "models", "video_duration_s", "resolution_fps"])
        p = probe(final) if final else None
        vs = next((s for s in (p or {}).get("streams", []) if s.get("codec_type") == "video"), {})
        w.writerow([ep, end.strftime("%Y-%m-%dT%H:%MZ"), fmt_dur(wall), fmt_dur(active), tot["calls"], tot["input"],
                    tot["output"], tot["cache_write"], tot["cache_read"], "|".join(sorted(per_model)),
                    f"{float(p['format']['duration']):.2f}" if p else "",
                    f"{vs.get('width', '')}x{vs.get('height', '')}@{vs.get('r_frame_rate', '')}" if vs else ""])
    print(f"Wrote {os.path.relpath(out, ROOT)} and appended series/RUN_LOG.csv ({n_events} log events scanned)")


if __name__ == "__main__":
    a = sys.argv[1:]
    if len(a) >= 2 and a[0] == "start":
        cmd_start(a[1])
    elif len(a) >= 3 and a[0] == "mark":
        cmd_mark(a[1], " ".join(a[2:]))
    elif len(a) >= 2 and a[0] == "finish":
        cmd_finish(a[1])
    else:
        print(__doc__)
        sys.exit(1)
