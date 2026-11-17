"""Build the cinematic plates used by the /scope, /sim and /slit redesign routes.

For each plate: a cropped 1920px WebP, a 360px thumbnail, and (with --depth) a
depth map from Depth Anything V2 Small, used for parallax and the point cloud.

    python3 scripts/build-redesign-plates.py            # plates + thumbs
    python3 scripts/build-redesign-plates.py --depth    # also depth maps (needs torch + transformers)

To swap a plate, change its source/crop below and re-run.
"""
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent / "public" / "images"
OUT = ROOT / "redesign"
C = "captures/"
# slug: (source, crop box as fractions x0,y0,x1,y1)
PLATES = {
    "title": ("cinema.jpg", (0, 0, 1, 1)),
    "video-haven": (C + "2026-10-19/video-haven-home-v2.webp", (0, 0.065, 1, 0.74)),
    "review-room": ("hero-eye.jpg", (0, 0.12, 1, 0.80)),
    "pindeck": (C + "2026-10-19/pindeck-gallery-detail.webp", (0.186, 0.085, 0.915, 0.94)),
    "beatsmaxxer-pro": ("beats.jpg", (0, 0, 1, 1)),
    "trailer-feed": (C + "2026-10-20/trailer-feed-home-photo-v2.png", (0, 0.075, 1, 0.725)),
    "project-stack-structure": ("api.jpg", (0, 0, 1, 1)),
    "gods-gatekeepers": ("gods-gatekeepers-hero.jpg", (0, 0, 1, 1)),
    "frame-lab": ("chroma.jpg", (0, 0, 1, 1)),
    "creative-studio-pro": ("comfy.jpg", (0, 0, 1, 1)),
    "music-video-agent": ("agents.jpg", (0, 0, 1, 1)),
    "about": ("about-profile-backdrop.png", (0, 0, 1, 1)),
}

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    want_depth = "--depth" in sys.argv
    pipe = None
    if want_depth:
        from transformers import pipeline
        pipe = pipeline("depth-estimation", model="depth-anything/Depth-Anything-V2-Small-hf")
    for slug, (src, (x0, y0, x1, y1)) in PLATES.items():
        im = Image.open(ROOT / src).convert("RGB")
        w, h = im.size
        im = im.crop((round(x0 * w), round(y0 * h), round(x1 * w), round(y1 * h)))
        if im.width != 1920:
            im = im.resize((1920, round(im.height * 1920 / im.width)), Image.LANCZOS)
        im.save(OUT / f"{slug}.webp", quality=84, method=6)
        th = im.resize((360, round(im.height * 360 / im.width)), Image.LANCZOS)
        th.save(OUT / f"{slug}-thumb.webp", quality=72, method=6)
        if pipe:
            d = pipe(im.resize((1036, round(im.height * 1036 / im.width))))["depth"].convert("L")
            d = d.resize((768, round(im.height * 768 / im.width)), Image.BICUBIC)
            d.save(OUT / f"{slug}-depth.jpg", quality=88)
        print(slug, im.size)

if __name__ == "__main__":
    main()
