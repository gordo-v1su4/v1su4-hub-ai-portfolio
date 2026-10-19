"""Export the selected real UI captures into the portfolio's 16:10 frame."""
import json
from pathlib import Path

from PIL import Image, ImageOps

HERE = Path(__file__).resolve().parent
OUTPUT = HERE.parents[2] / "public/images/captures/2026-10-18"
NAMES = [
    "perform-video", "perform-graphics", "clip-bank", "rack-detail",
    "timing", "arrangement", "help",
]
SIZE = (3840, 2400)
OUTPUT.mkdir(parents=True, exist_ok=True)
entries = []
for name in NAMES:
    filename = f"beatsmaxxer-{name}"
    with Image.open(HERE / "originals" / f"{filename}.png") as source:
        source_size = source.size
        fitted = ImageOps.contain(source.convert("RGB"), SIZE, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", SIZE, "#090b0d")
    offset = ((SIZE[0] - fitted.width) // 2, (SIZE[1] - fitted.height) // 2)
    canvas.paste(fitted, offset)
    target = OUTPUT / f"{filename}.webp"
    canvas.save(target, "WEBP", lossless=True, method=6)
    entries.append({
        "name": filename,
        "sourcePixels": list(source_size),
        "pixels": list(SIZE),
        "contentPixels": list(fitted.size),
        "offset": list(offset),
        "asset": f"/images/captures/2026-10-18/{target.name}",
        "bytes": target.stat().st_size,
    })
(HERE / "manifest.json").write_text(json.dumps({
    "date": "2026-10-18", "aspect": "16:10", "entries": entries,
}, indent=2) + "\n", encoding="utf-8")
print(f"Exported {len(entries)} lossless 3840 x 2400 WebP assets.")
