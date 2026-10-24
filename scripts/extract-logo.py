from PIL import Image
from pathlib import Path
b=Image.open('public/image-2.jpeg')
logo=Image.new('RGB',(656,210),'white')
logo.paste(b.crop((205,45,427,255)),(0,0))
logo.paste(b.crop((466,85,860,200)),(260,40))
logo.save('public/images/logo.webp',quality=95)
