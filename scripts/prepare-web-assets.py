"""Build web-sized responsive images, favicon family and sharing card from local artwork."""
from pathlib import Path
from PIL import Image
import json, base64, io

root = Path('public')
manifest = {}
for path in sorted((root / 'images').rglob('*.webp')):
    if '-responsive-' in path.stem:
        continue
    master = Path('source-files/web-masters') / path.relative_to(root / 'images')
    image = Image.open(master if master.exists() else path)
    image.thumbnail((1536, 1536), Image.Resampling.LANCZOS)
    brand = 'brand' in path.parts
    image.save(path, quality=75 if brand else 80, method=6)
    w, h = image.size
    variants = []
    if not brand or path.stem in ['logo-color', 'logo-light']:
        for width in ([220, 336] if brand else [320, 640, 960]):
            if width >= w:
                continue
            dest = path.with_stem(path.stem + f'-responsive-{width}')
            image.resize((width, round(h * width / w)), Image.Resampling.LANCZOS).save(dest, quality=78, method=6)
            variants.append(f'/{dest.relative_to(root).as_posix()} {width}w')
    variants.append(f'/{path.relative_to(root).as_posix()} {w}w')
    manifest['/' + path.relative_to(root).as_posix()] = {'width': w, 'height': h, 'srcset': ', '.join(variants)}
Path('src/data/image-sizes.json').write_text(json.dumps(manifest, indent=2) + '\n')

mark = Image.open(root / 'images/brand/logo-mark.webp').convert('RGBA')
def icon(size):
    canvas = Image.new('RGB', (size, size), '#ffffff')
    scaled = mark.resize((round(size * .9), round(size * .9)), Image.Resampling.LANCZOS)
    canvas.paste(scaled, ((size-scaled.width)//2, (size-scaled.height)//2), scaled)
    return canvas
for size in [48, 96, 192, 512]:
    icon(size).save(root / f'favicon-{size}x{size}.png')
icon(180).save(root / 'apple-touch-icon.png')
icon(48).save(root / 'favicon.ico', sizes=[(48, 48)])
buf = io.BytesIO()
icon(96).save(buf, format='PNG')
data = base64.b64encode(buf.getvalue()).decode()
(root / 'favicon.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" fill="white"/><image width="96" height="96" href="data:image/png;base64,{data}"/></svg>')
(root / 'site.webmanifest').write_text(json.dumps({'name':'LB Elevators', 'short_name':'LB Elevators', 'icons':[{'src':f'/favicon-{s}x{s}.png','sizes':f'{s}x{s}','type':'image/png'} for s in [192,512]], 'theme_color':'#041634','background_color':'#ffffff','display':'browser'}, indent=2))
card = Image.new('RGB', (1200,630), '#041634')
logo = Image.open('source-files/web-masters/brand/logo-light.webp').convert('RGBA')
logo = logo.resize((880, round(logo.height * 880 / logo.width)), Image.Resampling.LANCZOS)
card.paste(logo, ((1200-logo.width)//2, (630-logo.height)//2), logo)
card.save(root / 'images/brand/og-image.png', optimize=True)
print(f'Prepared {len(manifest)} image entries, icons and 1200x630 sharing card.')
