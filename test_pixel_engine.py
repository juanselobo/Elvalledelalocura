# test_pixel_engine.py
from PIL import Image
import numpy as np

def create_sprite(width, height):
    return Image.new('RGBA', (width, height), (0, 0, 0, 0))

def rect(arr, x, y, w, h, color):
    arr[y:y+h, x:x+w] = color

def outline_rect(arr, x, y, w, h, fill, border):
    arr[y:y+h, x:x+w] = border
    arr[y+1:y+h-1, x+1:x+w-1] = fill

print("Engine test initialized")
