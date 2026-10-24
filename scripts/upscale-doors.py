# Door illustrations are small brochure crops (~168px). Produce 2x versions
# with Lanczos resampling and a light unsharp mask for crisper display.
from PIL import Image, ImageFilter
for n in ['solid', 'auto', 'half', 'full', 'telescopic', 'ifd', 'collapsible', 'swing']:
    im = Image.open(f'public/images/door-{n}.webp').convert('RGB')
    big = im.resize((im.width * 2, im.height * 2), Image.LANCZOS)
    big = big.filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
    big.save(f'public/images/door-{n}-2x.webp', quality=88, method=6)
print('done')
