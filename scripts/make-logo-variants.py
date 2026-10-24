# Builds transparent logo variants from the original extracted logo pixels.
# logo-color.webp: original colours on transparency (light backgrounds)
# logo-light.webp: mark on a white disc + white wordmark (dark backgrounds)
# logo-mark.webp:  mark only on a white disc (loader, favicon-scale uses)
import numpy as np
from PIL import Image, ImageDraw
src = Image.open('public/images/logo.webp').convert('RGB')
a = np.asarray(src).astype(np.float32)
alpha = np.clip((255 - a.min(axis=2)) / 255 * 1.15, 0, 1)
safe = np.maximum(alpha, 1e-3)[..., None]
rgb = np.clip((a - 255 * (1 - safe)) / safe, 0, 255)
rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)
color = Image.fromarray(rgba, 'RGBA')
mask = alpha > 0.15
cols = np.where(mask[:, :240].any(axis=0))[0]; rows = np.where(mask[:, :240].any(axis=1))[0]
x0, x1, y0, y1 = cols.min(), cols.max(), rows.min(), rows.max()
print('mark bbox', x0, x1, y0, y1)
color.save('public/images/logo-color.webp', quality=90, method=6)
light = rgba.copy()
lum = rgb.mean(axis=2)
word = np.zeros_like(mask); word[:, 245:] = True
band = np.zeros_like(mask); band[136:160, :] = True
text = word & ~band & (lum < 150)
light[text, 0:3] = 255
light_img = Image.fromarray(light, 'RGBA')
disc = Image.new('RGBA', light_img.size, (0, 0, 0, 0))
cx, cy, r = (x0 + x1) / 2, (y0 + y1) / 2, max(x1 - x0, y1 - y0) / 2 + 2
ImageDraw.Draw(disc).ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 255, 255, 255))
light_img = Image.alpha_composite(disc, light_img)
light_img.save('public/images/logo-light.webp', quality=90, method=6)
mark = light_img.crop((int(cx - r - 1), int(cy - r - 1), int(cx + r + 2), int(cy + r + 2)))
mark.save('public/images/logo-mark.webp', quality=90, method=6)
print('saved', light_img.size, mark.size)
# Web sizes: 440px wide for header/footer (2x display size), 160px mark.
for n in ['logo-color', 'logo-light']:
    im = Image.open(f'public/images/{n}.webp')
    im.resize((440, round(im.height * 440 / im.width)), Image.LANCZOS).save(f'public/images/{n}.webp', quality=90, method=6)
Image.open('public/images/logo-mark.webp').resize((160, 160), Image.LANCZOS).save('public/images/logo-mark.webp', quality=90, method=6)
