from PIL import Image, ImageOps
from pathlib import Path
p=Path('public/images')
g=Path(r'C:\Users\hp\.codex\generated_images\01a16edd-c2d6-7c30-96ef-76cf952a7162')
assets={
'residential':'exec-4588281e-3ee8-4e4e-941e-76da134f170e.png',
'commercial':'exec-76f0eb04-c305-4ce7-afb3-8d41d5687b31.png',
'healthcare':'exec-0f1a4e20-35dc-4378-95b7-113a4d34a952.png',
'hotel':'exec-c7eccd04-1c1b-433b-8476-125cd8af4abe.png',
'education':'exec-d442de70-3958-4676-8292-b1f09a73ecc6.png',
'industrial':'exec-f7ef65cb-5462-4206-9163-5eef2cbdd30f.png',
}
for name,source in assets.items():
 original=p/(name+'.webp'); brochure=p/(name+'-brochure.webp')
 if not brochure.exists(): original.rename(brochure)
 im=ImageOps.fit(Image.open(g/source),(1200,800))
 im.save(original,quality=84)
 im.resize((420,280)).save(p/(name+'-small.webp'),quality=82)
print('Integrated six representative building visuals with responsive versions.')
