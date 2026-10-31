# build_final_sprites.py
from PIL import Image, ImageOps
import numpy as np
import os

assets_dir = 'D:/Desktop/Juegos/villa-aburra-game/assets'
os.makedirs(assets_dir, exist_ok=True)

def extract_alpha(img_crop, bg_color=[241, 235, 213], tol=36, trim=True):
    rgba = img_crop.convert('RGBA')
    arr = np.array(rgba)
    diff = np.linalg.norm(arr[:, :, :3].astype(float) - np.array(bg_color), axis=2)
    alpha = np.where(diff > tol, 255, 0).astype(np.uint8)
    arr[:, :, 3] = alpha
    
    if trim:
        non_y, non_x = np.where(alpha > 0)
        if len(non_y) == 0:
            return Image.fromarray(arr, 'RGBA')
        ymin, ymax = non_y.min(), non_y.max() + 1
        xmin, xmax = non_x.min(), non_x.max() + 1
        arr = arr[ymin:ymax, xmin:xmax]
        
    return Image.fromarray(arr, 'RGBA')

def scale_h(img, h):
    w, cur_h = img.size
    new_w = max(1, int(w * (h / cur_h)))
    return img.resize((new_w, h), Image.Resampling.NEAREST)

im_p = Image.open('D:/Desktop/Juegos/REF/Cloud_4358f10e.jpg')
im_g = Image.open('D:/Desktop/Juegos/REF/Cloud_d1c5a103.jpg')
im_r = Image.open('D:/Desktop/Juegos/REF/Cloud_62322cba.jpg')
im_bg = Image.open('D:/Desktop/Juegos/REF/Cloud_6f850eb1.jpg')

# 1. PLAYER (Rail-Walker) - Target height: 120px
print("Generating Rail-Walker sprites...")
p_idle_raw = extract_alpha(im_p.crop((320, 660, 450, 990)))
p_idle = ImageOps.mirror(scale_h(p_idle_raw, 120))
p_idle.save(os.path.join(assets_dir, 'player_idle.png'))

# Walk frames
p_w1_raw = extract_alpha(im_p.crop((38, 1030, 165, 1165)))
p_w1 = scale_h(p_w1_raw, 120)
p_w1.save(os.path.join(assets_dir, 'player_walk1.png'))

p_w2_raw = extract_alpha(im_p.crop((185, 985, 315, 1165)))
p_w2 = scale_h(p_w2_raw, 120)
p_w2.save(os.path.join(assets_dir, 'player_walk2.png'))

p_w3_raw = extract_alpha(im_p.crop((330, 995, 460, 1165)))
p_w3 = scale_h(p_w3_raw, 120)
p_w3.save(os.path.join(assets_dir, 'player_walk3.png'))

# Rail pose
p_rail_raw = extract_alpha(im_p.crop((270, 190, 480, 640)))
p_rail = ImageOps.mirror(scale_h(p_rail_raw, 120))
p_rail.save(os.path.join(assets_dir, 'player_rail.png'))

# Jump pose
p_jump = p_w2.copy()
p_jump.save(os.path.join(assets_dir, 'player_jump.png'))

# Enhanced Punch pose
def make_punch(base):
    w, h = base.size
    canvas = Image.new('RGBA', (w + 24, h), (0, 0, 0, 0))
    canvas.paste(base, (0, 0))
    arr = np.array(canvas)
    
    # Arm height Y: ~44 to 56
    arr[44:54, w-5:w+12] = [235, 105, 30, 255] # orange puffer
    arr[46:52, w-3:w+10] = [255, 130, 50, 255] # highlight
    arr[45:53, w+11:w+18] = [215, 155, 115, 255] # skin fist
    # Outlines
    arr[43, w-5:w+19] = [35, 25, 20, 255]
    arr[54, w-5:w+19] = [35, 25, 20, 255]
    arr[43:55, w+18] = [35, 25, 20, 255]
    # Impact lines
    arr[40:58, w+19:w+23] = [255, 255, 255, 220]
    return Image.fromarray(arr, 'RGBA')

make_punch(p_idle).save(os.path.join(assets_dir, 'player_punch.png'))

# Enhanced Kick pose
def make_kick(base):
    w, h = base.size
    canvas = Image.new('RGBA', (w + 26, h), (0, 0, 0, 0))
    canvas.paste(base, (0, 0))
    arr = np.array(canvas)
    # Leg height Y: ~72 to 84
    arr[72:82, w-6:w+14] = [45, 80, 135, 255] # blue jean
    arr[70:84, w+12:w+20] = [210, 215, 220, 255] # grey sneaker
    arr[69, w-6:w+21] = [30, 30, 45, 255]
    arr[84, w-6:w+21] = [30, 30, 45, 255]
    arr[69:85, w+20] = [30, 30, 45, 255]
    # Arc
    arr[66:88, w+21:w+25] = [250, 250, 255, 200]
    return Image.fromarray(arr, 'RGBA')

make_kick(p_idle).save(os.path.join(assets_dir, 'player_kick.png'))

p_hurt = p_idle.rotate(14, expand=True, resample=Image.Resampling.NEAREST)
p_hurt.save(os.path.join(assets_dir, 'player_hurt.png'))

# 2. ENEMY 1: Gamín de Medellín - Target height: 112px
print("Generating Gamín de Medellín sprites...")
g_walk1_raw = extract_alpha(im_g.crop((260, 190, 480, 650)))
g_walk1 = ImageOps.mirror(scale_h(g_walk1_raw, 112))
g_walk1.save(os.path.join(assets_dir, 'gamin_walk1.png'))

g_walk2_raw = extract_alpha(im_g.crop((35, 1020, 175, 1165)))
g_walk2 = ImageOps.mirror(scale_h(g_walk2_raw, 112))
g_walk2.save(os.path.join(assets_dir, 'gamin_walk2.png'))

g_sniff_raw = extract_alpha(im_g.crop((320, 1015, 465, 1165)))
g_sniff = ImageOps.mirror(scale_h(g_sniff_raw, 96))
g_sniff.save(os.path.join(assets_dir, 'gamin_sniff.png'))

g_crouch_raw = extract_alpha(im_g.crop((180, 1020, 315, 1165)))
g_crouch = ImageOps.mirror(scale_h(g_crouch_raw, 96))
g_crouch.save(os.path.join(assets_dir, 'gamin_crouch.png'))
g_crouch.save(os.path.join(assets_dir, 'gamin_hurt.png'))

# Knife slash lunge
def make_gamin_slash(base):
    w, h = base.size
    canvas = Image.new('RGBA', (w + 24, h), (0, 0, 0, 0))
    canvas.paste(base, (0, 0))
    arr = np.array(canvas)
    arr[54:58, w-5:w+18] = [230, 235, 240, 255] # blade
    arr[55:57, w+4:w+20] = [255, 255, 255, 255] # shine
    arr[53, w-5:w+20] = [35, 35, 40, 255]
    arr[58, w-5:w+20] = [35, 35, 40, 255]
    arr[53:59, w+19] = [35, 35, 40, 255]
    arr[50:62, w+20:w+23] = [255, 255, 255, 190]
    return Image.fromarray(arr, 'RGBA')

make_gamin_slash(g_walk1).save(os.path.join(assets_dir, 'gamin_slash.png'))

g_ko = g_walk1.rotate(-90, expand=True, resample=Image.Resampling.NEAREST)
g_ko.save(os.path.join(assets_dir, 'gamin_ko.png'))

# 3. ENEMY 2: Rappi-Gamín Medellín - Target height: 120px
print("Generating Rappi-Gamín sprites...")
r_walk1_raw = extract_alpha(im_r.crop((260, 190, 480, 650)))
r_walk1 = ImageOps.mirror(scale_h(r_walk1_raw, 120))
r_walk1.save(os.path.join(assets_dir, 'rappi_walk1.png'))

r_crouch_raw = extract_alpha(im_r.crop((30, 660, 260, 990)))
r_crouch = ImageOps.mirror(scale_h(r_crouch_raw, 102))
r_crouch.save(os.path.join(assets_dir, 'rappi_crouch.png'))

r_eat_raw = extract_alpha(im_r.crop((320, 1015, 465, 1165)))
r_eat = ImageOps.mirror(scale_h(r_eat_raw, 100))
r_eat.save(os.path.join(assets_dir, 'rappi_eat.png'))

# Extract high-res Rappi bag for charge attack and icon
rappi_bag_raw = extract_alpha(im_r.crop((600, 420, 725, 570)))
rappi_bag = scale_h(rappi_bag_raw, 48)
rappi_bag.save(os.path.join(assets_dir, 'rappi_bag_icon.png'))

# Rappi charge: swinging the bag forward
def make_rappi_charge(base, bag):
    w, h = base.size
    bw, bh = bag.size
    canvas = Image.new('RGBA', (w + bw - 10, h), (0, 0, 0, 0))
    canvas.paste(base, (0, 0))
    # Paste bag in front at chest height
    canvas.paste(bag, (w - 15, 42), bag)
    return canvas

make_rappi_charge(r_walk1, rappi_bag).save(os.path.join(assets_dir, 'rappi_charge.png'))

r_hurt = r_crouch.copy()
r_hurt.save(os.path.join(assets_dir, 'rappi_hurt.png'))

r_ko = r_walk1.rotate(-90, expand=True, resample=Image.Resampling.NEAREST)
r_ko.save(os.path.join(assets_dir, 'rappi_ko.png'))

# Rappi delivery motorcycle
r_moto_raw = extract_alpha(im_r.crop((640, 1220, 755, 1345)))
r_moto = ImageOps.mirror(scale_h(r_moto_raw, 70))
r_moto.save(os.path.join(assets_dir, 'rappi_moto.png'))

# Cracked delivery phone icon
phone_raw = extract_alpha(im_r.crop((600, 680, 760, 840)))
scale_h(phone_raw, 32).save(os.path.join(assets_dir, 'phone_icon.png'))

# 4. ENVIRONMENT & URBAN FAUNA
print("Generating Environment sprites...")
# Tileable rail track
rail_crop = im_p.crop((30, 1170, 450, 1208))
rail_crop.resize((420, 40), Image.Resampling.NEAREST).save(os.path.join(assets_dir, 'rail_track.png'))

# Metrocable cabin
mc_cabin = im_bg.crop((1080, 175, 1145, 225)).resize((44, 34), Image.Resampling.NEAREST)
mc_cabin.save(os.path.join(assets_dir, 'metrocable.png'))

# Delivery takeout projectile
takeout = Image.new('RGBA', (22, 18), (0, 0, 0, 0))
t_arr = np.array(takeout)
t_arr[2:16, 2:18] = [245, 95, 45, 255] # orange
t_arr[7:10, 6:14] = [255, 255, 255, 255] # mustache
t_arr[1:17, 1] = [40, 20, 20, 255]
t_arr[1:17, 18] = [40, 20, 20, 255]
t_arr[1, 1:19] = [40, 20, 20, 255]
t_arr[16, 1:19] = [40, 20, 20, 255]
Image.fromarray(t_arr, 'RGBA').save(os.path.join(assets_dir, 'delivery_box.png'))

print("All final sprites compiled and saved with pristine pixel quality!")
