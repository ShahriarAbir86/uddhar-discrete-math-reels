"""Pre-render the paper layer (fibres, mottling, vignette, grain) for the Animation Story style. Run: python make_paper.py"""
import numpy as np, random
from PIL import Image, ImageDraw, ImageFilter
W,H=1080,1920; rng=np.random.default_rng(11); random.seed(11)
base=np.array([0xEE,0xE8,0xD8],float); edge=np.array([0xD9,0xD2,0xBE],float)
yy,xx=np.mgrid[0:H,0:W]; cx,cy=W/2,H/2
d=np.sqrt(((xx-cx)/(W*0.75))**2+((yy-cy)/(H*0.7))**2); d=np.clip(d,0,1)**2.2
img=base[None,None,:]*(1-d[...,None])+edge[None,None,:]*d[...,None]
# low-frequency mottling
m=Image.fromarray((rng.random((48,27))*255).astype(np.uint8)).resize((W,H),Image.BICUBIC).filter(ImageFilter.GaussianBlur(40))
m=(np.asarray(m,float)/255-0.5)*14
img+=m[...,None]
im=Image.fromarray(np.clip(img,0,255).astype(np.uint8)).convert("RGBA")
# fibres
fib=Image.new("RGBA",(W,H),(0,0,0,0)); dr=ImageDraw.Draw(fib)
for _ in range(1500):
    x=random.uniform(0,W); y=random.uniform(0,H); a=random.uniform(0,6.28); L=random.uniform(10,38); pts=[]
    for k in range(5):
        a+=random.uniform(-0.5,0.5); x+=np.cos(a)*L/5; y+=np.sin(a)*L/5; pts.append((x,y))
    dr.line(pts,fill=(150,138,112,random.randint(28,60)),width=1)
im=Image.alpha_composite(im,fib)
# grain
g=(rng.normal(0,3.2,(H,W))); arr=np.asarray(im.convert("RGB"),float)+g[...,None]
Image.fromarray(np.clip(arr,0,255).astype(np.uint8)).save("assets/paper.png",optimize=True)
print("paper.png ok")
