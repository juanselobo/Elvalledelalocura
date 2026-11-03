# -*- coding: utf-8 -*-
import time
import re

ts = int(time.time())
path = r"D:\Desktop\Juegos\villa-aburra-game\index.html"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

text = re.sub(r'(\.js)\?v=\d+', rf'\1?v={ts}', text)

with open(path, "w", encoding="utf-8") as f:
    f.write(text)

print(f"Updated cache bust in index.html to v={ts}")
