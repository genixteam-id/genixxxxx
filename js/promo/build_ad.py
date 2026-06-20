"""بناء فيديو إعلاني Genix ID من الأصول المحلية."""
import subprocess
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont, ImageFilter
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow", "-q"])
    from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
PROMO = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"
OUT = PROMO / "genix-id-ad.mp4"
TMP = PROMO / "_tmp"
FFMPEG = r"C:\Users\hp\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffmpeg.exe"

W, H = 1920, 1080
FPS = 30

FONTS = [
    Path(r"C:\Windows\Fonts\arial.ttf"),
    Path(r"C:\Windows\Fonts\tahoma.ttf"),
    Path(r"C:\Windows\Fonts\segoeui.ttf"),
]


def font(size: int, bold: bool = False):
    for p in FONTS:
        if p.exists():
            try:
                return ImageFont.truetype(str(p), size)
            except OSError:
                pass
    return ImageFont.load_default()


def run(cmd: list[str]) -> None:
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-2000:] if r.stderr else r.stdout)
        raise RuntimeError("ffmpeg failed")


def make_slide(name: str, lines: list[tuple[str, int, str]], duration: float, logo: bool = True) -> Path:
    """lines: (text, size, color_hex)"""
    img = Image.new("RGB", (W, H), "#03030a")
    draw = ImageDraw.Draw(img)

    # تدرج خلفية
    for y in range(H):
        t = y / H
        r = int(3 + t * 8)
        g = int(3 + t * 5)
        b = int(10 + t * 25)
        draw.line([(0, y), (W, y)], fill=(r, g, b))

    # دوائر نيون
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((W // 2 - 400, H // 2 - 400, W // 2 + 400, H // 2 + 400), fill=(0, 240, 255, 25))
    gd.ellipse((W // 2 - 300, H // 2 - 200, W // 2 + 500, H // 2 + 500), fill=(255, 0, 204, 18))
    img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
    draw = ImageDraw.Draw(img)

    y = H // 2 - 120
    if logo:
        logo_path = ASSETS / "brand" / "logo.jpg"
        if logo_path.exists():
            lg = Image.open(logo_path).convert("RGBA")
            lg = lg.resize((280, 280), Image.Resampling.LANCZOS)
            mask = Image.new("L", (280, 280), 0)
            ImageDraw.Draw(mask).ellipse((0, 0, 280, 280), fill=255)
            lg.putalpha(mask)
            img.paste(lg, ((W - 280) // 2, y - 200), lg)
            y = H // 2 + 100

    for text, size, color in lines:
        f = font(size, bold=True)
        bbox = draw.textbbox((0, 0), text, font=f)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        x = (W - tw) // 2
        # توهج
        for dx, dy in [(-2, 0), (2, 0), (0, -2), (0, 2)]:
            draw.text((x + dx, y + dy), text, font=f, fill="#001a22")
        draw.text((x, y), text, font=f, fill=color)
        y += th + 28

    out_png = TMP / f"{name}.png"
    img.save(out_png, quality=95)
    out_mp4 = TMP / f"{name}.mp4"
    run([
        FFMPEG, "-y", "-loop", "1", "-i", str(out_png),
        "-c:v", "libx264", "-t", str(duration), "-pix_fmt", "yuv420p",
        "-vf", f"scale={W}:{H},fps={FPS}", str(out_mp4)
    ])
    return out_mp4


def prep_clip(src: Path, dest: Path, duration: float = 4.0) -> Path:
    run([
        FFMPEG, "-y", "-i", str(src),
        "-t", str(duration), "-an",
        "-vf", f"scale={W}:{H}:force_original_aspect_ratio=decrease,pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:color=0x03030a,fps={FPS}",
        "-c:v", "libx264", "-pix_fmt", "yuv420p", str(dest)
    ])
    return dest


def main():
    TMP.mkdir(parents=True, exist_ok=True)

    clips_src = [
        ASSETS / "videos" / "showreel-1.mp4",
        ASSETS / "videos" / "showreel-4.mp4",
        ASSETS / "videos" / "showreel-2.mp4",
    ]
    genix = Path(r"C:\Users\hp\Desktop\genix id")
    extra = list(genix.glob("grok-video-*.mp4"))
    extra.sort(key=lambda p: p.stat().st_size)
    if extra:
        clips_src.append(extra[len(extra) // 2])

    segments: list[Path] = []

    segments.append(make_slide("intro", [
        ("GENIX ID", 96, "#00f0ff"),
        ("تقنيات المستقبل نلهم بها الواقع", 52, "#ffffff"),
        ("ذكاء اصطناعي · ويب · هوية · فيديو", 36, "#ff00cc"),
    ], 4.5, logo=True))

    services = [
        ("حلول الذكاء الاصطناعي", "#00f0ff"),
        ("تطوير المنصات والمواقع", "#ffffff"),
        ("الهوية البصرية والإنتاج المرئي", "#ff00cc"),
    ]

    for i, (src, (svc, col)) in enumerate(zip(clips_src, services)):
        if not src.exists():
            continue
        clip = TMP / f"clip_{i}.mp4"
        prep_clip(src, clip, 3.8 if i < 2 else 4.2)
        segments.append(clip)
        segments.append(make_slide(f"svc_{i}", [(svc, 58, col), ("genix-id.com", 40, "#94a3b8")], 2.2, logo=False))

    segments.append(make_slide("outro", [
        ("هل أنت مستعد للبدء؟", 64, "#ffffff"),
        ("تواصل معنا على واتساب", 44, "#00f0ff"),
        ("905527223847", 48, "#ff00cc"),
    ], 4.5, logo=True))

    list_file = TMP / "concat.txt"
    list_file.write_text("\n".join(f"file '{s.resolve().as_posix()}'" for s in segments), encoding="utf-8")

    run([
        FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", str(list_file),
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
        "-crf", "20", str(OUT)
    ])

    print(f"OK: {OUT}")
    print(f"Size: {OUT.stat().st_size / 1024 / 1024:.1f} MB")


if __name__ == "__main__":
    main()