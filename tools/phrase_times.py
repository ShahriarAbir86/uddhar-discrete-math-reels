#!/usr/bin/env python3
"""Align script text to real pauses measured in the voiceover (no ASR needed).
Input : <ep>/script.md (scenes; sentences end with । or ?; phrases also split at commas)
        <ep>/qa/pauses.json (ffmpeg silencedetect output, see run notes)
Output: <ep>/qa/phrase_times.json  [{scene, sentence, text, start, end}]
Method: 1) sentence ends are snapped (monotonic DP) to measured pauses, expected position from
           speech-time proportional to text length, strong preference for long pauses / scene ends;
        2) commas inside a sentence split its time proportionally, snapped to an inner pause if close.
"""
import json, re, sys
ep = sys.argv[1]
script = open(f"{ep}/script.md", encoding="utf-8").read().split("## Mathematical reference")[0]
P = json.load(open(f"{ep}/qa/pauses.json")); dur = P["duration"]
pauses = [tuple(p) for p in P["pauses"]]
parts = re.split(r"### Scene (\d+) — (.+)\n", script)[1:]
sents = []
for i in range(0, len(parts), 3):
    sc, txt = int(parts[i]), parts[i + 2].strip()
    ss = [s.strip() for s in re.split(r"(?<=[।?])\s*", txt) if s.strip()]
    for k, s in enumerate(ss): sents.append({"scene": sc, "text": s, "last": k == len(ss) - 1})
clean = lambda t: len(re.sub(r"[\s।?,\-]", "", t))
w = [clean(s["text"]) for s in sents]; W = sum(w)
import math
inner = [p for p in pauses if p[0] > 0.2 and p[1] < dur - 0.2]
S = []; acc = 0.0; prev = 0.0
for a, b in inner: acc += a - prev; S.append(acc); prev = b
Ts = acc + (dur - prev); M = len(sents); N = len(inner)
rate = W / Ts                                   # characters per second of actual speech
def seg(i, k):                                  # speech seconds between boundary i (or start) and boundary k (or end)
    lo = 0.0 if i is None else S[i]
    hi = Ts if k is None else S[k]
    return max(hi - lo, 0.05)
def sc(j, i, k):                                # cost of sentence j spanning boundaries i..k
    r = w[j] / seg(i, k)
    return (math.log(r / rate)) ** 2 * 40.0
def bonus(j, i):                                # reward for ending a sentence on a long pause
    d = inner[i][1] - inner[i][0]
    return (3.0 if sents[j]["last"] else 1.5) * d * 10
INF = 1e18
cost = [[INF] * N for _ in range(M - 1)]; back = [[-1] * N for _ in range(M - 1)]
for j in range(M - 1):
    for i in range(N):
        if j == 0: cost[0][i] = sc(0, None, i) - bonus(0, i)
        else:
            best, bi = INF, -1
            for k in range(i):
                if cost[j - 1][k] < INF:
                    c = cost[j - 1][k] + sc(j, k, i)
                    if c < best: best, bi = c, k
            if bi >= 0: cost[j][i] = best - bonus(j, i); back[j][i] = bi
tot = [cost[M - 2][i] + sc(M - 1, i, None) if cost[M - 2][i] < INF else INF for i in range(N)]
i = min(range(N), key=lambda x: tot[x]); idx = [i]
for j in range(M - 2, 0, -1): i = back[j][i]; idx.append(i)
idx.reverse()
starts = [0.0] + [inner[i][1] for i in idx]; ends = [inner[i][0] for i in idx] + [dur]
out = []
for j, s in enumerate(sents):
    a, b = starts[j], ends[j]
    chunks = [c.strip() for c in re.split(r"(?<=,)\s*", s["text"]) if c.strip()]
    if len(chunks) == 1: out.append({"scene": s["scene"], "sentence": j, "text": s["text"], "start": round(a, 2), "end": round(b, 2)}); continue
    lens = [clean(c) for c in chunks]; tot = sum(lens); t = a; cum = 0
    inside = [p for p in pauses if a + 0.15 < p[0] and p[1] < b - 0.15]
    for k, ch in enumerate(chunks):
        cum += lens[k]
        if k == len(chunks) - 1: e = b; ns = b
        else:
            target = a + (b - a) * cum / tot
            near = min(inside, key=lambda p: abs((p[0] + p[1]) / 2 - target), default=None)
            if near and abs((near[0] + near[1]) / 2 - target) < 0.9: e, ns = near[0], near[1]
            else: e = ns = target
        out.append({"scene": s["scene"], "sentence": j, "text": ch, "start": round(t, 2), "end": round(e, 2)}); t = ns
json.dump(out, open(f"{ep}/qa/phrase_times.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for o in out: print(f"S{o['scene']} {o['start']:6.2f}-{o['end']:6.2f} ({o['end']-o['start']:4.1f}s) {o['text']}")
