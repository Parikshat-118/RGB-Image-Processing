#image size can be vary by depending on its size and it shape will vary
# but on the oter side in each pixel there is range only from 0 to 255

#image = [height,widht, channel] channel means rgb
#pixel = [red,green,blue]height
#first we will generate random rgb image and will print its basic stats and that random generated image

import numpy as np
from PIL import Image
#image=np.random.'randint(0,255,(200,200,3),dtype=np.uint8) # we can use this also but i will upload my own photo from files
image=Image.open("photo.jpeg")
image=image.convert("RGB")
image=np.array(image)
print("shape=",np.shape(image)) #we can use np.shape(image)(its a function call) but image.shape (is a attribute direct call
print("datatype=",image.dtype) # here np.dtype(image) throws error beacuse it is used to create a datatype (thats why we use image.dtype)
print("max value=",image.max()) # we use np. mathematical type operation and use image. for normal attribute callings
print("min=",image.min())
print("overall mean=",np.mean(image)) # we used np. as mean is maths operation
# lets print the image first using matplotlib library
import matplotlib.pyplot as plt
plt.imshow(image) #for photo preview
plt.title("original RGB image")
plt.axis("off")
plt.show()

#lets perform first operation (increasing brightness of the image)
# to increase the brightness we will increase each pixel by a particular value

def adj_brt(img,value):
    temp=img.astype(np.int16)
    temp=temp+value
    temp=np.clip(temp,0,255)
    return temp.astype(np.uint8)

bri_img=adj_brt(image,70)

le_img=adj_brt(image,-70)

plt.figure(figsize=(10,4))

plt.subplot(1,2,1)
plt.imshow(image)
plt.title("original")
plt.axis("off")

plt.subplot(1,2,2)
plt.imshow(bri_img)
plt.title("brightness +70")
plt.axis("off")
plt.show()
print()
plt.imshow(le_img)
plt.title("brightness -70")
plt.axis("off")
plt.show()

# lets perform our second operation contrast
# in contrast we multiply each pixel value by alpha
# alpha means how much times to increase intensity
#alpha → contrast control

#beta → brightness shift

#old_pixel → original value (0–255)

#| Parameter | Meaning            |
#| --------- | ------------------ |
#| alpha > 1 | Increase contrast  |
#| alpha < 1 | Decrease contrast  |
#| alpha = 1 | No contrast change |
#| beta      | Brightness shift   |


def adj_cont(img,alpha,beta=0):
    temp=img.astype(np.float32)
    temp=alpha*(temp-128)+beta+128
    temp=np.clip(temp,0,255)
    return temp.astype(np.uint8)
    
inc_con=adj_cont(image,1.5,0)
dec_con=adj_cont(image,0.5,0)

plt.figure(figsize=(15,4))

plt.subplot(1,3,1)
plt.imshow(image)
plt.title("original image")
plt.axis("off")

plt.subplot(1,3,2)
plt.imshow(inc_con)
plt.title("increases contrast by 1.5 and beta=0")
plt.axis("off")

plt.subplot(1,3,3)
plt.imshow(dec_con)
plt.title("decrease contrast by 0.5 and beta=0")
plt.axis("off")

plt.show()


# now color manipualtion

# first removing the full red channel only

no_red=image.copy()
no_red[:,:,0]=0 #all the rows and coloumns red channel has value 0

plt.imshow(no_red)
plt.title("removing red channel")
plt.axis("off")
plt.show()

# boosting blue channel

def blue_ch(image,value):
    temp=image.copy()
    blue=temp[:,:,2].astype(np.int16)
    blue=blue+value
    blue=np.clip(blue,0,255)
    temp[:,:,2]=blue.astype(np.uint8)
    return temp

inc_blue=blue_ch(image,50)
dec_blue=blue_ch(image,-50)

plt.figure(figsize=(15,4))

plt.subplot(1,3,1)
plt.imshow(image)
plt.title("original")
plt.axis("off")

plt.subplot(1,3,2)
plt.imshow(inc_blue)
plt.title("blue channel +50")
plt.axis("off")

plt.subplot(1,3,3)
plt.imshow(dec_blue)
plt.title("blue channel -50")
plt.axis("off")
plt.show()

# swap rb channels
swap=image.copy()
swap[:,:,0],swap[:,:,2]=swap[:,:,2],swap[:,:,0]
plt.figure(figsize=(10,4))
plt.subplot(1,2,1)
plt.imshow(image)
plt.title("original")
plt.axis("off")

plt.subplot(1,2,2)
plt.imshow(swap)
plt.title("blue and red swapped")
plt.axis("off")
plt.show()

#now last function (inverted function)

def inv_img(img):
    return 255-img

img=inv_img(image)

plt.figure(figsize=(10,4))
plt.subplot(1,2,1)
plt.imshow(image)
plt.title("original")
plt.axis("off")

plt.subplot(1,2,2)
plt.imshow(img)
plt.title("inverted image")
plt.axis("off")
plt.show()