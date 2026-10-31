# build_final_game_assets.py
"""
Master Studio Asset Pipeline for "Aventura en Medellín: Villa del Aburrá"
Extracts and builds all game assets directly from the official reference images
(Cloud_6f850eb1.jpg, Cloud_4358f10e.jpg, Cloud_d1c5a103.jpg, Cloud_62322cba.jpg)
with zero white halos, studio-grade defringing, seamless 3-layer parallax, and unified scaling.
"""
from PIL import Image, ImageOps, ImageFilter
import numpy as np
import os
from collections import deque

out_dir = 'd:/Desktop/Juegos/villa-aburra-game/assets'
os.makedirs(out_dir, exist_ok=True)

im_bg = Image.open('d:/Desktop/Juegos/REF/Cloud_6f850eb1.jpg')
im_p = Image.open('d:/Desktop/Juegos/REF/Cloud_4358f10e.jpg')
im_g = Image.open('d:/Desktop/Juegos/REF/Cloud_d1c5a103.jpg')
im_r = Image.open('d:/Desktop/Juegos/REF/Cloud_62322cba.jpg')

GW, GH = 640, 360

# ==============================================================================
# 1. PARALLAX LAYERS (Directly from Masterpiece Cloud_6f850eb1.jpg)
# ==============================================================================
print("1. Generating 3-Layer Parallax Backgrounds & Ground Platform...")
W_bg, H_bg = im_bg.size

# LAYER 0: LEJANÍSIMA (Sunset sky, glowing clouds, setting sun, Coltejer tower, Metrocable)
sky_crop = im_bg.crop((0, 0, W_bg, 440)).resize((GW, GH), Image.Resampling.LANCZOS)
arr_sky = np.array(sky_crop)
wrap_w = 40
for x in range(wrap_w):
    alpha = x / wrap_w
    arr_sky[:, x] = (arr_sky[:, x] * alpha + arr_sky[:, GW - wrap_w + x] * (1 - alpha)).astype(np.uint8)
    arr_sky[:, GW - wrap_w + x] = arr_sky[:, x]

bg_far = Image.fromarray(arr_sky, 'RGB').convert('RGBA')
bg_far.save(os.path.join(out_dir, 'bg_far.png'))

# LAYER 1: MÁS LEJANA (Mid skyline, hillside comunas, valley floor)
mid_crop = im_bg.crop((0, 160, W_bg, 520)).resize((GW, int(GH * 0.7)), Image.Resampling.LANCZOS)
arr_mid = np.array(mid_crop.convert('RGBA'))
h_mid, w_mid = arr_mid.shape[:2]
for y in range(h_mid):
    fade = min(1.0, y / 35.0)
    arr_mid[y, :, 3] = int(255 * fade)

for x in range(wrap_w):
    alpha = x / wrap_w
    arr_mid[:, x] = (arr_mid[:, x] * alpha + arr_mid[:, w_mid - wrap_w + x] * (1 - alpha)).astype(np.uint8)
    arr_mid[:, w_mid - wrap_w + x] = arr_mid[:, x]

bg_mid = Image.new('RGBA', (GW, GH), (0, 0, 0, 0))
bg_mid.paste(Image.fromarray(arr_mid, 'RGBA'), (0, 95))
bg_mid.save(os.path.join(out_dir, 'bg_mid.png'))

# LAYER 2: MÁS CERCANA (La Villa del Aburrá: Red-brick stepped buildings, balconies, clotheslines)
near_crop = im_bg.crop((0, 260, W_bg, 768))
near_h = 240
near_resized = near_crop.resize((GW, near_h), Image.Resampling.LANCZOS)
arr_near = np.array(near_resized.convert('RGBA'))

for y in range(35):
    fade = min(1.0, y / 35.0)
    arr_near[y, :, 3] = int(255 * fade)

for x in range(wrap_w):
    alpha = x / wrap_w
    arr_near[:, x] = (arr_near[:, x] * alpha + arr_near[:, GW - wrap_w + x] * (1 - alpha)).astype(np.uint8)
    arr_near[:, GW - wrap_w + x] = arr_near[:, x]

bg_near = Image.new('RGBA', (GW, GH), (0, 0, 0, 0))
bg_near.paste(Image.fromarray(arr_near, 'RGBA'), (0, 295 - near_h))
bg_near.save(os.path.join(out_dir, 'bg_near.png'))

# LAYER 3: GROUND PLATFORM (Rooftop Viaduct matching clay tiles & brick masonry)
ground_w = 640
ground_h = 65
tile_patch = im_bg.crop((950, 700, 1350, 760)).resize((ground_w, 24), Image.Resampling.LANCZOS)

ground = Image.new('RGBA', (ground_w, ground_h), (0, 0, 0, 0))
ground.paste(tile_patch.convert('RGBA'), (0, 0))
arr_g = np.array(ground)

# Concrete curb
arr_g[22:25, :] = [140, 145, 155, 255]
arr_g[25:27, :] = [50, 55, 65, 255]

# Ballast gravel
arr_g[27:ground_h, :] = [48, 42, 52, 255]
np.random.seed(42)
for _ in range(350):
    gx = np.random.randint(0, ground_w)
    gy = np.random.randint(28, ground_h)
    arr_g[gy:gy+2, gx:gx+2] = [68, 62, 74, 255] if np.random.rand() > 0.5 else [30, 26, 34, 255]

# Wooden ties
for rx in range(0, ground_w, 28):
    arr_g[30:58, rx:rx+14] = [75, 48, 36, 255]
    arr_g[32:56, rx+2:rx+12] = [95, 62, 48, 255]

# Polished steel rails catching sunset reflections
arr_g[34:38, :] = [165, 185, 205, 255]
arr_g[35:36, :] = [255, 248, 230, 255]
arr_g[38:40, :] = [45, 52, 65, 255]

arr_g[50:54, :] = [165, 185, 205, 255]
arr_g[51:52, :] = [255, 248, 230, 255]
arr_g[54:56, :] = [45, 52, 65, 255]

ground_res = Image.fromarray(arr_g, 'RGBA')
ground_res.save(os.path.join(out_dir, 'ground_platform.png'))
print("Parallax backgrounds & ground platform complete!")

# ==============================================================================
# 2. STUDIO DEFRINGER FUNCTION
# ==============================================================================
def studio_defringe(crop_img, bg_ref=[242, 234, 208], dist_thresh=52, kill_bright_thresh=188, extra_bottom_cut=0):
    arr = np.array(crop_img.convert('RGBA'))
    if extra_bottom_cut > 0:
        arr[-extra_bottom_cut:, :] = [bg_ref[0], bg_ref[1], bg_ref[2], 255]
    dist = np.linalg.norm(arr[:, :, :3].astype(float) - np.array(bg_ref), axis=2)
    is_bg = (dist < dist_thresh) & (np.mean(arr[:, :, :3], axis=2) > 165)
    
    h, w = is_bg.shape
    visited = np.zeros((h, w), dtype=bool)
    q = deque()
    
    for x in range(w):
        if is_bg[0, x]: q.append((0, x)); visited[0, x] = True
        if is_bg[h-1, x]: q.append((h-1, x)); visited[h-1, x] = True
    for y in range(h):
        if is_bg[y, 0]: q.append((y, 0)); visited[y, 0] = True
        if is_bg[y, w-1]: q.append((y, w-1)); visited[y, w-1] = True
        
    while q:
        cy, cx = q.popleft()
        for dy, dx in [(-1,0), (1,0), (0,-1), (0,1)]:
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and is_bg[ny, nx]:
                visited[ny, nx] = True
                q.append((ny, nx))
                
    arr[visited, 3] = 0
    mask_img = Image.fromarray((visited * 255).astype(np.uint8))
    dilated = np.array(mask_img.filter(ImageFilter.MaxFilter(5))) > 0
    boundary = dilated & (~visited)
    
    for y, x in zip(*np.where(boundary)):
        lum = np.mean(arr[y, x, :3])
        if lum > kill_bright_thresh:
            arr[y, x, 3] = 0
        elif lum > 130:
            arr[y, x, :3] = (arr[y, x, :3] * 0.40).astype(np.uint8)
            
    res = Image.fromarray(arr, 'RGBA')
    bbox = res.getbbox()
    return res.crop(bbox) if bbox else res

def scale_h(img, h):
    w, cur_h = img.size
    return img.resize((max(1, int(w * (h / cur_h))), h), Image.Resampling.LANCZOS)

# ==============================================================================
# 3. RAIL-WALKER (Protagonist) - Standard Height: 112px
# ==============================================================================
print("2. Extracting Rail-Walker Master Sprites...")
P_H = 112

# Side profile idle (mirrored to face right)
p_idle_raw = studio_defringe(im_p.crop((330, 680, 440, 985)))
player_idle = ImageOps.mirror(scale_h(p_idle_raw, P_H))
player_idle.save(os.path.join(out_dir, 'player_idle.png'))

# Dynamic Rail balance pose (cut above rail at Y = 595)
p_rail_raw = studio_defringe(im_p.crop((280, 185, 480, 595)))
player_rail = ImageOps.mirror(scale_h(p_rail_raw, P_H))
player_rail.save(os.path.join(out_dir, 'player_rail.png'))

# Walk Cycle from bottom strip (cutting at sole line Y = 1159!)
f1_raw = studio_defringe(im_p.crop((30, 1025, 160, 1159)))
f2_raw = studio_defringe(im_p.crop((180, 995, 305, 1159)))
f3_raw = studio_defringe(im_p.crop((295, 1005, 455, 1159)))

player_walk1 = scale_h(f1_raw, int(P_H * 0.92))
player_walk2 = scale_h(f2_raw, P_H)
player_walk3 = scale_h(f3_raw, int(P_H * 0.95))

player_walk1.save(os.path.join(out_dir, 'player_walk1.png'))
player_walk2.save(os.path.join(out_dir, 'player_walk2.png'))
player_walk3.save(os.path.join(out_dir, 'player_walk3.png'))

# Jump pose (airborne stride)
player_jump = player_walk2.copy()
player_jump.save(os.path.join(out_dir, 'player_jump.png'))

# Punch: using forward stride (f3) with forward jab and impact spark!
# In f3, Rail-Walker is already leaning forward into the attack!
p_f3_arr = np.array(player_walk3)
f3_w, f3_h = player_walk3.size
punch_w = f3_w + 18
punch_canv = Image.new('RGBA', (punch_w, f3_h), (0, 0, 0, 0))
punch_canv.paste(player_walk3, (0, 0))
arr_punch = np.array(punch_canv)

# Extend right fist forward at Y: 38 to 48, X: f3_w - 4 to f3_w + 14
OUTLINE = [34, 28, 30, 255]
ORANGE_LGT = [248, 142, 48, 255]
ORANGE_MID = [224, 94, 22, 255]
SKIN_LGT = [238, 186, 152, 255]
SKIN_MID = [212, 148, 112, 255]

# Sleeve & Fist
for y in range(38, 48):
    for x in range(f3_w - 6, f3_w + 12):
        if y in [38, 47] or x == f3_w + 11:
            arr_punch[y, x] = OUTLINE
        elif x < f3_w + 4:
            arr_punch[y, x] = ORANGE_LGT if y in [39, 40] else ORANGE_MID
        else:
            arr_punch[y, x] = SKIN_LGT if y in [39, 40] else SKIN_MID

# Impact Spark
arr_punch[35:38, f3_w + 12:f3_w + 15] = [255, 220, 80, 255]
arr_punch[42:44, f3_w + 13:f3_w + 17] = [255, 255, 255, 255]
arr_punch[48:51, f3_w + 12:f3_w + 15] = [255, 220, 80, 255]

player_punch = Image.fromarray(arr_punch, 'RGBA')
player_punch = scale_h(player_punch, P_H)
player_punch.save(os.path.join(out_dir, 'player_punch.png'))

# Kick: using f2 (raised knee) with denim leg snapping forward!
f2_w, f2_h = player_walk2.size
kick_w = f2_w + 22
kick_canv = Image.new('RGBA', (kick_w, f2_h), (0, 0, 0, 0))
kick_canv.paste(player_walk2, (0, 0))
arr_kick = np.array(kick_canv)

jean_lgt = [70, 110, 168, 255]
jean_mid = [45, 75, 125, 255]
shoe_wht = [235, 238, 245, 255]
shoe_sole = [50, 54, 62, 255]

for y in range(58, 68):
    for x in range(f2_w - 12, f2_w + 10):
        if y in [58, 67]:
            arr_kick[y, x] = OUTLINE
        elif y in [59, 60]:
            arr_kick[y, x] = jean_lgt
        else:
            arr_kick[y, x] = jean_mid

# Sneaker
for y in range(56, 70):
    for x in range(f2_w + 10, f2_w + 19):
        if y in [56, 69] or x == f2_w + 18:
            arr_kick[y, x] = OUTLINE
        elif y in [67, 68]:
            arr_kick[y, x] = shoe_sole
        else:
            arr_kick[y, x] = shoe_wht

# Speed swoosh
arr_kick[50:76, f2_w + 19:f2_w + 22] = [255, 255, 255, 210]

player_kick = Image.fromarray(arr_kick, 'RGBA')
player_kick = scale_h(player_kick, P_H)
player_kick.save(os.path.join(out_dir, 'player_kick.png'))

# Hurt
player_hurt = player_idle.rotate(8, expand=True, resample=Image.Resampling.BICUBIC)
player_hurt.save(os.path.join(out_dir, 'player_hurt.png'))
print("Rail-Walker complete!")

# ==============================================================================
# 4. GAMÍN DE MEDELLÍN (Enemy 1) - Standard Height: 106px
# ==============================================================================
print("3. Extracting Gamín de Medellín Master Sprites...")
G_H = 106

g_walk_raw = studio_defringe(im_g.crop((260, 190, 485, 645)))
gamin_walk1 = scale_h(g_walk_raw, G_H)
gamin_walk1.save(os.path.join(out_dir, 'gamin_walk1.png'))
gamin_walk2 = gamin_walk1.copy()
gamin_walk2.save(os.path.join(out_dir, 'gamin_walk2.png'))

# Sniffing Sacol pose (bottom right pose)
g_sniff_raw = studio_defringe(im_g.crop((415, 740, 555, 870)), extra_bottom_cut=8)
gamin_sniff = scale_h(g_sniff_raw, int(G_H * 0.72))
gamin_sniff.save(os.path.join(out_dir, 'gamin_sniff.png'))

# Crouch pose
g_crouch_raw = studio_defringe(im_g.crop((230, 750, 360, 870)), extra_bottom_cut=8)
gamin_crouch = scale_h(g_crouch_raw, int(G_H * 0.72))
gamin_crouch.save(os.path.join(out_dir, 'gamin_crouch.png'))

# Knife Slash Attack
gw, gh = gamin_walk1.size
slash_canv = Image.new('RGBA', (gw + 26, gh), (0, 0, 0, 0))
slash_canv.paste(gamin_walk1, (0, 0))
arr_slash = np.array(slash_canv)
# Steel blade extension & curved slash arc
arr_slash[46:56, gw-4:gw+14] = [230, 235, 245, 255]
arr_slash[48:52, gw-2:gw+12] = [255, 255, 255, 255]
arr_slash[45, gw-4:gw+15] = OUTLINE
arr_slash[56, gw-4:gw+15] = OUTLINE
arr_slash[45:57, gw+14] = OUTLINE
# Arc
arr_slash[36:66, gw+16:gw+20] = [255, 255, 255, 220]
arr_slash[40:62, gw+20:gw+23] = [200, 225, 255, 180]

gamin_slash = Image.fromarray(arr_slash, 'RGBA')
gamin_slash.save(os.path.join(out_dir, 'gamin_slash.png'))

# Hurt & KO
gamin_hurt = gamin_walk1.rotate(-8, expand=True, resample=Image.Resampling.BICUBIC)
gamin_hurt.save(os.path.join(out_dir, 'gamin_hurt.png'))

gamin_ko = gamin_walk1.rotate(90, expand=True, resample=Image.Resampling.BICUBIC)
gamin_ko.save(os.path.join(out_dir, 'gamin_ko.png'))
print("Gamín de Medellín complete!")

# ==============================================================================
# 5. RAPPI-GAMÍN MEDELLÍN (Enemy 2) - Standard Height: 114px
# ==============================================================================
print("4. Extracting Rappi-Gamín Master Sprites...")
R_H = 114

r_walk_raw = studio_defringe(im_r.crop((265, 190, 490, 645)))
rappi_walk1 = scale_h(r_walk_raw, R_H)
rappi_walk1.save(os.path.join(out_dir, 'rappi_walk1.png'))
rappi_walk2 = rappi_walk1.copy()
rappi_walk2.save(os.path.join(out_dir, 'rappi_walk2.png'))

# Eating pose
r_eat_raw = studio_defringe(im_r.crop((380, 750, 555, 870)), extra_bottom_cut=8)
rappi_eat = scale_h(r_eat_raw, int(R_H * 0.72))
rappi_eat.save(os.path.join(out_dir, 'rappi_eat.png'))

# Charge (Maletazo)
rw, rh = rappi_walk1.size
charge_canv = Image.new('RGBA', (rw + 20, rh), (0, 0, 0, 0))
charge_canv.paste(rappi_walk1, (0, 0))
arr_charge = np.array(charge_canv)
arr_charge[30:33, rw:rw+16] = [255, 255, 255, 200]
arr_charge[50:53, rw+2:rw+18] = [255, 120, 40, 200]
arr_charge[70:73, rw:rw+16] = [255, 255, 255, 200]
rappi_charge = Image.fromarray(arr_charge, 'RGBA')
rappi_charge.save(os.path.join(out_dir, 'rappi_charge.png'))

rappi_throw = rappi_walk1.copy()
rappi_throw.save(os.path.join(out_dir, 'rappi_throw.png'))

rappi_hurt = rappi_walk1.rotate(-8, expand=True, resample=Image.Resampling.BICUBIC)
rappi_hurt.save(os.path.join(out_dir, 'rappi_hurt.png'))

rappi_ko = rappi_walk1.rotate(90, expand=True, resample=Image.Resampling.BICUBIC)
rappi_ko.save(os.path.join(out_dir, 'rappi_ko.png'))

# Delivery Moto
moto_raw = studio_defringe(im_r.crop((630, 1240, 765, 1370)), dist_thresh=60)
rappi_moto = scale_h(moto_raw, 68)
rappi_moto.save(os.path.join(out_dir, 'rappi_moto.png'))
print("Rappi-Gamín complete!")

# ==============================================================================
# 6. PROPS & CRITTERS
# ==============================================================================
print("5. Generating Props & Fauna...")
# Takeout box
tbox = Image.new('RGBA', (24, 24), (0, 0, 0, 0))
t_arr = np.array(tbox)
t_arr[4:20, 3:21] = [230, 200, 150, 255]
t_arr[8:16, 5:19] = [235, 80, 20, 255]
t_arr[10:13, 8:16] = [255, 255, 255, 255] # mustache
t_arr[3, 3:21] = OUTLINE
t_arr[20, 3:21] = OUTLINE
t_arr[3:21, 2] = OUTLINE
t_arr[3:21, 21] = OUTLINE
Image.fromarray(t_arr, 'RGBA').save(os.path.join(out_dir, 'delivery_box.png'))

# Rat De Todito
r_tod = Image.new('RGBA', (36, 22), (0, 0, 0, 0))
rt_arr = np.array(r_tod)
rt_arr[8:18, 4:22] = [110, 105, 115, 255]
rt_arr[10:18, 2:7] = [130, 125, 135, 255]
rt_arr[12:14, 1:3] = [240, 150, 160, 255]
rt_arr[9:11, 4:6] = [30, 30, 30, 255]
rt_arr[11:13, 22:32] = [220, 160, 170, 255]
rt_arr[18:21, 6:10] = [220, 160, 170, 255]
rt_arr[18:21, 16:20] = [220, 160, 170, 255]
# De Todito yellow bag
rt_arr[4:18, 18:32] = [248, 205, 20, 255]
rt_arr[6:10, 20:30] = [225, 35, 30, 255]
rt_arr[11:16, 20:30] = [30, 80, 180, 255]
rt_arr[3:19, 17] = OUTLINE
rt_arr[3:19, 32] = OUTLINE
rt_arr[3, 17:33] = OUTLINE
rt_arr[18, 17:33] = OUTLINE
Image.fromarray(rt_arr, 'RGBA').save(os.path.join(out_dir, 'rat_todito.png'))

# Rat Cigar
r_cig = Image.new('RGBA', (36, 22), (0, 0, 0, 0))
rc_arr = np.array(r_cig)
rc_arr[8:18, 4:22] = [110, 105, 115, 255]
rc_arr[10:18, 2:7] = [130, 125, 135, 255]
rc_arr[12:14, 1:3] = [240, 150, 160, 255]
rc_arr[9:11, 4:6] = [30, 30, 30, 255]
rc_arr[11:13, 22:32] = [220, 160, 170, 255]
rc_arr[18:21, 6:10] = [220, 160, 170, 255]
rc_arr[18:21, 16:20] = [220, 160, 170, 255]
# Lit cigarette
rc_arr[10:13, 0:4] = [245, 85, 25, 255] # glowing ember
rc_arr[11:13, 4:12] = [245, 245, 245, 255]
rc_arr[11:13, 12:16] = [210, 150, 80, 255]
rc_arr[7:9, 0:2] = [200, 200, 215, 180] # smoke
Image.fromarray(rc_arr, 'RGBA').save(os.path.join(out_dir, 'rat_cigar.png'))

# Pigeon
pig = Image.new('RGBA', (26, 24), (0, 0, 0, 0))
p_arr = np.array(pig)
p_arr[8:18, 6:20] = [130, 135, 145, 255]
p_arr[10:17, 10:20] = [95, 100, 110, 255]
p_arr[4:11, 4:11] = [75, 140, 115, 255]
p_arr[2:8, 3:9] = [145, 85, 160, 255]
p_arr[4:6, 1:4] = [240, 180, 60, 255]
p_arr[3:5, 4:6] = [225, 85, 30, 255]
p_arr[18:23, 8:11] = [225, 95, 110, 255]
p_arr[18:23, 14:17] = [225, 95, 110, 255]
Image.fromarray(p_arr, 'RGBA').save(os.path.join(out_dir, 'pigeon.png'))

print("\nALL STUDIO MASTER ASSETS GENERATED SUCCESSFULLY!")
