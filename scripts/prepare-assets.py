from PIL import Image
from pathlib import Path
p=Path('public/images'); p.mkdir(exist_ok=True)
a=Image.open('public/image-1.jpeg')
boxes={
'passenger':(802,563,931,687),'goods':(939,563,1065,687),'home':(1075,563,1201,687),'hospital':(1210,563,1337,687),'panoramic':(1346,563,1502,687),
'about':(782,292,1210,469),
'door-solid':(36,571,204,687),'door-auto':(219,571,388,687),'door-half':(402,571,570,687),'door-full':(584,571,751,687),
'door-telescopic':(36,798,204,910),'door-ifd':(219,798,388,910),'door-collapsible':(402,798,570,910),'door-swing':(584,798,751,910),
'residential':(802,784,892,850),'commercial':(901,784,993,850),'healthcare':(1001,784,1093,850),'hotel':(1100,784,1191,850),'education':(1199,784,1291,850),'industrial':(1299,784,1391,850),
}
for name,box in boxes.items():
 suffix='-brochure' if name in ['passenger','goods','home','hospital','panoramic','residential','commercial','healthcare','hotel','education','industrial'] else ''
 a.crop(box).save(p/(name+suffix+'.webp'),quality=92)
print('Extracted',len(boxes),'matching brochure panels; run extract-logo.py for original logo')
