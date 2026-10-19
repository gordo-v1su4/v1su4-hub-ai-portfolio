"""Export the selected real UI captures into the portfolio's 16:10 frame."""
import json
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
OUTPUT = HERE.parents[2] / "public/images/captures/2026-10-18"
NAMES = [
    "perform-graphics", "perform-video", "clip-bank", "rack-detail",
    "timing", "arrangement", "help",
]
SIZE = (3840, 2400)
OUTPUT.mkdir(parents=True, exist_ok=True)
entries = []
for name in NAMES:
    filename = f"beatsmaxxer-{name}"
    with Image.open(HERE / "originals" / f"{filename}.png") as source:
        source_size = source.size
        if source_size != SIZE:
            raise ValueError(f"Recapture {filename}: expected {SIZE}, got {source_size}; padding and resizing are forbidden.")
        canvas = source.convert("RGB")
    target = OUTPUT / f"{filename}-v2.webp"
    canvas.save(target, "WEBP", lossless=True, method=4)
    entries.append({
        "name": filename,
        "sourcePixels": list(source_size),
        "pixels": list(SIZE),
        "contentPixels": list(SIZE),
        "offset": [0, 0],
        "asset": f"/images/captures/2026-10-18/{target.name}",
        "bytes": target.stat().st_size,
    })
(HERE / "manifest.json").write_text(json.dumps({
    "date": "2026-10-18", "aspect": "16:10", "entries": entries,
}, indent=2) + "\n", encoding="utf-8")
print(f"Exported {len(entries)} lossless 3840 x 2400 WebP assets.")
