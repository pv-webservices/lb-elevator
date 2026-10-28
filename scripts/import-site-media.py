"""Prepare supplied photographs and videos for the website.

Usage: python scripts/import-site-media.py "<folder with image-N.jpeg / video-N.mp4>"

Reads src/data/photos.json, writes WebP photos to public/images/photos/
(<id>.webp up to 1200px tall, <id>-sm.webp 480px wide), and web MP4 clips
plus WebP posters to public/videos/ via ffmpeg. Width/height of every photo
are written back to the manifest. Originals are never modified.
"""
import json
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageOps

MANIFEST = Path('src/data/photos.json')
PHOTO_OUT = Path('public/images/photos')
VIDEO_OUT = Path('public/videos')
LARGE_MAX_HEIGHT = 1200
SMALL_WIDTH = 480
VIDEO_MAX_HEIGHT = 960
BLACK_THRESHOLD = 24


def trim_black(im):
    mask = im.convert('L').point(lambda v: 255 if v > BLACK_THRESHOLD else 0)
    box = mask.getbbox()
    return im.crop(box) if box else im


def prepare_photo(src, photo):
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    crop = photo.get('crop')
    if crop == 'trim':
        im = trim_black(im)
    elif crop:
        im = im.crop(tuple(crop))
    if im.height > LARGE_MAX_HEIGHT:
        im = im.resize((round(im.width * LARGE_MAX_HEIGHT / im.height), LARGE_MAX_HEIGHT), Image.LANCZOS)
    im.save(PHOTO_OUT / f"{photo['id']}.webp", quality=82, method=6)
    small = im.resize((SMALL_WIDTH, round(im.height * SMALL_WIDTH / im.width)), Image.LANCZOS)
    small.save(PHOTO_OUT / f"{photo['id']}-sm.webp", quality=78, method=6)
    return im.width, im.height


def prepare_video(src, video):
    out = VIDEO_OUT / f"{video['id']}.mp4"
    poster = VIDEO_OUT / f"{video['id']}.webp"
    scale = f"scale=-2:'min({VIDEO_MAX_HEIGHT},ih)'"
    subprocess.run([
        'ffmpeg', '-v', 'error', '-y', '-ss', str(video['start']), '-i', str(src),
        '-t', str(video['duration']), '-an', '-vf', f'{scale},fps=30',
        '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
        '-crf', '28', '-preset', 'slow', '-movflags', '+faststart', str(out),
    ], check=True)
    subprocess.run([
        'ffmpeg', '-v', 'error', '-y', '-i', str(out), '-frames:v', '1',
        '-quality', '80', str(poster),
    ], check=True)
    probe = subprocess.run([
        'ffprobe', '-v', 'error', '-select_streams', 'v:0',
        '-show_entries', 'stream=width,height', '-of', 'csv=p=0', str(out),
    ], check=True, capture_output=True, text=True)
    width, height = (int(v) for v in probe.stdout.strip().split(','))
    return width, height


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    source_dir = Path(sys.argv[1])
    manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))
    PHOTO_OUT.mkdir(parents=True, exist_ok=True)
    VIDEO_OUT.mkdir(parents=True, exist_ok=True)
    for photo in manifest['photos']:
        photo['w'], photo['h'] = prepare_photo(source_dir / photo['source'], photo)
    for video in manifest['videos']:
        video['w'], video['h'] = prepare_video(source_dir / video['source'], video)
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f"Prepared {len(manifest['photos'])} photos and {len(manifest['videos'])} videos.")


if __name__ == '__main__':
    main()
