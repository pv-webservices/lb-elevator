from PIL import Image, ImageOps
from pathlib import Path
p=Path('public/images')
g=Path(r'C:\Users\hp\.codex\generated_images\01a16edd-c2d6-7c30-96ef-76cf952a7162')
assets={
'passenger':'exec-23f6a615-6a73-4b21-8ec5-67af09cd2596.png',
'goods':'exec-ecf6e75d-d7d9-48bd-9c22-4b93cfb3049b.png',
'home':'exec-81235c05-baf3-4ef5-b286-9141ab70f1b3.png',
'hospital':'exec-1bf5c831-3ddc-45bd-aca8-c71624569e79.png',
'panoramic':'exec-22256551-05f2-429b-bf2a-91efe24d102d.png',
}
for name,source in assets.items():
 original=p/(name+'.webp')
 brochure=p/(name+'-brochure.webp')
 if not brochure.exists(): original.rename(brochure)
 im=Image.open(g/source)
 im=ImageOps.fit(im,(960,1200))
 im.save(original,quality=85)
 im=im.resize((420,525))
 im.save(p/(name+'-small.webp'),quality=82)
print('Integrated five optimized generated category images; original brochure crops retained.')
