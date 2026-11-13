#!/usr/bin/env python3
"""Pre-render the page texture (mottling, fibres, vignette, grain) for the Animation Story style.
Usage: python make_paper.py light|dark <out.png>     (palette values must match palette.mjs)"""
import sys, numpy as np, random
from PIL import Image, ImageDraw, ImageFilter
mode, out = sys.argv[1], sys.argv[2]
P = {"light": dict(base=(0xFE, 0xEE, 0xE7), edge=(0xFD, 0xE5, 0xDB), fibre=(190, 150, 130), fa=(22, 48), mott=7, grain=2.6),
     "dark": dict(base=(0x10, 0x1B, 0x49), edge=(0x0A, 0x10, 0x33), fibre=(60, 80, 150), fa=(14, 34), mott=8, grain=2.4)}[mode]
W, H = 1080, 1920; rng = np.random.default_rng(11); random.seed(11)
base = np.array(P["base"], float); edge = np.array(P["edge"], float)
yy, xx = np.mgrid[0:H, 0:W]
d = np.clip(np.sqrt(((xx - W / 2) / (W * 0.75)) ** 2 + ((yy - H / 2) / (H * 0.7)) ** 2), 0, 1) ** 2.2
img = base[None, None, :] * (1 - d[..., None]) + edge[None, None, :] * d[..., None]
m = Image.fromarray((rng.random((48, 27)) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(40))
img += ((np.asarray(m, float) / 255 - 0.5) * P["mott"])[..., None]
im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert("RGBA")
fib = Image.new("RGBA", (W, H), (0, 0, 0, 0)); dr = ImageDraw.Draw(fib)
for _ in range(1500):
    x = random.uniform(0, W); y = random.uniform(0, H); a = random.uniform(0, 6.28); L = random.uniform(10, 38); pts = []
    for k in range(5):
        a += random.uniform(-0.5, 0.5); x += np.cos(a) * L / 5; y += np.sin(a) * L / 5; pts.append((x, y))
    dr.line(pts, fill=(*P["fibre"], random.randint(*P["fa"])), width=1)
im = Image.alpha_composite(im, fib)
arr = np.asarray(im.convert("RGB"), float) + rng.normal(0, P["grain"], (H, W))[..., None]
Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save(out, optimize=True)
print("wrote", out)
