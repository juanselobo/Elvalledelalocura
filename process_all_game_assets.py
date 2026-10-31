# process_all_game_assets.py
from PIL import Image, ImageOps, ImageDraw
import numpy as np
import os

assets_dir = 'D:/Desktop/Juegos/villa-aburra-game/assets'
os.makedirs(assets_dir, exist_ok=True)

def clean_alpha_and_trim(img, bg_color=[241, 235, 213], tol=38):
    rgba = img.convert('RGBA')
    arr = np.array(rgba)
    
    # Distance to cream background
    diff = np.linalg.norm(arr[:, :, :3].astype(float) - np.array(bg_color), axis=2)
    alpha = np.where(diff > tol, 255, 0).astype(np.uint8)
    arr[:, :, 3] = alpha
    
    non_y, non_x = np.where(alpha > 0)
    if len(non_y) == 0:
        return Image.fromarray(arr, 'RGBA')
    ymin, ymax = non_y.min(), non_y.max() + 1
    xmin, xmax = non_x.min(), non_x.max() + 1
    
    return Image.fromarray(arr[ymin:ymax, xmin:xmax], 'RGBA')

def scale_to_height(img, target_h):
    w, h = img.size
    target_w = max(1, int(w * (target_h / h)))
    return img.resize((target_w, target_h), Image.Resampling.NEAREST)

im_p = Image.open('D:/Desktop/Juegos/REF/Cloud_4358f10e.jpg')
im_g = Image.open('D:/Desktop/Juegos/REF/Cloud_d1c5a103.jpg')
im_r = Image.open('D:/Desktop/Juegos/REF/Cloud_62322cba.jpg')
im_bg = Image.open('D:/Desktop/Juegos/REF/Cloud_6f850eb1.jpg')

# -------------------------------------------------------------
# 1. PLAYER (Rail-Walker) - Standard height: 115px, facing RIGHT
# -------------------------------------------------------------
print("Processing Player...")
# Base Idle: side view, mirrored so it faces RIGHT
p_idle_raw = clean_alpha_and_trim(im_p.crop((320, 660, 450, 990)))
p_idle = ImageOps.mirror(scale_to_height(p_idle_raw, 115))
p_idle.save(os.path.join(assets_dir, 'player_idle.png'))

# Walk frames from bottom strip
# Frame 1: crop from im_p avoiding box border
p_w1_crop = im_p.crop((38, 1030, 165, 1165))
p_w1 = scale_to_height(clean_alpha_and_trim(p_w1_crop), 115)
p_w1.save(os.path.join(assets_dir, 'player_walk1.png'))

# Frame 2:
p_w2_crop = im_p.crop((185, 985, 315, 1165))
p_w2 = scale_to_height(clean_alpha_and_trim(p_w2_crop), 115)
p_w2.save(os.path.join(assets_dir, 'player_walk2.png'))

# Frame 3:
p_w3_crop = im_p.crop((330, 995, 460, 1165))
p_w3 = scale_to_height(clean_alpha_and_trim(p_w3_crop), 115)
p_w3.save(os.path.join(assets_dir, 'player_walk3.png'))

# Jump pose (airborne walk stride)
p_jump = p_w2.copy()
p_jump.save(os.path.join(assets_dir, 'player_jump.png'))

# Rail balance pose
p_rail_raw = clean_alpha_and_trim(im_p.crop((270, 190, 480, 640)))
p_rail = ImageOps.mirror(scale_to_height(p_rail_raw, 115))
p_rail.save(os.path.join(assets_dir, 'player_rail.png'))

# Create Punch: extend right arm forward in orange puffer jacket
def build_punch(base_sprite):
    w, h = base_sprite.size
    canvas = Image.new('RGBA', (w + 22, h), (0, 0, 0, 0))
    canvas.paste(base_sprite, (0, 0))
    arr = np.array(canvas)
    
    # Orange puffer jacket sleeve: [235, 105, 30]
    sleeve = [235, 105, 30, 255]
    sleeve_dark = [190, 75, 20, 255]
    fist = [215, 155, 115, 255]
    outline = [35, 25, 25, 255]
    swoosh = [255, 255, 255, 200]
    
    # Arm height Y: ~40 to 58 in 115px sprite
    arr[43:55, w-4:w+14] = sleeve
    arr[45:53, w-4:w+12] = sleeve_dark
    arr[44:54, w+12:w+18] = fist
    # Outlines
    arr[42, w-4:w+19] = outline
    arr[55, w-4:w+19] = outline
    arr[42:56, w+18] = outline
    # Impact flash
    arr[40:58, w+19:w+22] = swoosh
    return Image.fromarray(arr, 'RGBA')

p_punch = build_punch(p_idle)
p_punch.save(os.path.join(assets_dir, 'player_punch.png'))

# Create Kick: extend right leg forward with blue jeans and grey sneaker
def build_kick(base_sprite):
    w, h = base_sprite.size
    canvas = Image.new('RGBA', (w + 24, h), (0, 0, 0, 0))
    canvas.paste(base_sprite, (0, 0))
    arr = np.array(canvas)
    
    jean = [45, 80, 135, 255]
    shoe = [210, 215, 220, 255]
    outline = [30, 30, 45, 255]
    swoosh = [245, 245, 250, 180]
    
    # Kicking leg at Y: ~68 to 82
    arr[70:80, w-6:w+14] = jean
    arr[68:82, w+12:w+20] = shoe
    arr[67, w-6:w+21] = outline
    arr[82, w-6:w+21] = outline
    arr[67:83, w+20] = outline
    arr[65:85, w+21:w+24] = swoosh
    return Image.fromarray(arr, 'RGBA')

p_kick = build_kick(p_idle)
p_kick.save(os.path.join(assets_dir, 'player_kick.png'))

# Hurt pose
p_hurt = p_idle.rotate(12, expand=True, resample=Image.Resampling.NEAREST)
p_hurt.save(os.path.join(assets_dir, 'player_hurt.png'))

# -------------------------------------------------------------
# 2. ENEMY 1 (Gamín de Medellín - Pan en la Cabeza + Éxito)
# Standard height: 110px, facing RIGHT
# -------------------------------------------------------------
print("Processing Gamín de Medellín...")
# Main walk with knife (from top center, avoiding title at y < 190)
g_walk1_raw = clean_alpha_and_trim(im_g.crop((260, 190, 480, 650)))
g_walk1 = ImageOps.mirror(scale_to_height(g_walk1_raw, 110))
g_walk1.save(os.path.join(assets_dir, 'gamin_walk1.png'))

# Second walk pose from bottom strip
g_walk2_raw = clean_alpha_and_trim(im_g.crop((35, 1020, 175, 1165)))
g_walk2 = ImageOps.mirror(scale_to_height(g_walk2_raw, 110))
g_walk2.save(os.path.join(assets_dir, 'gamin_walk2.png'))

# Sniffing sacol bottle
g_sniff_raw = clean_alpha_and_trim(im_g.crop((320, 1015, 465, 1165)))
g_sniff = ImageOps.mirror(scale_to_height(g_sniff_raw, 95)) # crouching/sitting height
g_sniff.save(os.path.join(assets_dir, 'gamin_sniff.png'))

# Crouch / hurt
g_crouch_raw = clean_alpha_and_trim(im_g.crop((180, 1020, 315, 1165)))
g_crouch = ImageOps.mirror(scale_to_height(g_crouch_raw, 95))
g_crouch.save(os.path.join(assets_dir, 'gamin_crouch.png'))
g_crouch.save(os.path.join(assets_dir, 'gamin_hurt.png'))

# Knife slash: thrust knife forward
def build_gamin_slash(base_sprite):
    w, h = base_sprite.size
    canvas = Image.new('RGBA', (w + 22, h), (0, 0, 0, 0))
    canvas.paste(base_sprite, (0, 0))
    arr = np.array(canvas)
    blade = [230, 235, 240, 255]
    shine = [255, 255, 255, 255]
    outline = [35, 35, 40, 255]
    
    # Knife thrust Y: ~50 to 58
    arr[52:56, w-6:w+18] = blade
    arr[53:55, w+4:w+20] = shine
    arr[51, w-6:w+20] = outline
    arr[56, w-6:w+20] = outline
    arr[51:57, w+19] = outline
    return Image.fromarray(arr, 'RGBA')

g_slash = build_gamin_slash(g_walk1)
g_slash.save(os.path.join(assets_dir, 'gamin_slash.png'))

# Knockout (on back)
g_ko = g_walk1.rotate(-90, expand=True, resample=Image.Resampling.NEAREST)
g_ko.save(os.path.join(assets_dir, 'gamin_ko.png'))

# -------------------------------------------------------------
# 3. ENEMY 2 (Rappi-Gamín Medellín - Casco + Maleta Rappi)
# Standard height: 118px (with helmet), facing RIGHT
# -------------------------------------------------------------
print("Processing Rappi-Gamín...")
# Main walk with phone (avoid title y < 190)
r_walk1_raw = clean_alpha_and_trim(im_r.crop((260, 190, 480, 650)))
r_walk1 = ImageOps.mirror(scale_to_height(r_walk1_raw, 118))
r_walk1.save(os.path.join(assets_dir, 'rappi_walk1.png'))

# Crouching with phone
r_crouch_raw = clean_alpha_and_trim(im_r.crop((30, 660, 260, 990)))
r_crouch = ImageOps.mirror(scale_to_height(r_crouch_raw, 100))
r_crouch.save(os.path.join(assets_dir, 'rappi_crouch.png'))

# Eating delivery box
r_eat_raw = clean_alpha_and_trim(im_r.crop((320, 1015, 465, 1165)))
r_eat = ImageOps.mirror(scale_to_height(r_eat_raw, 98))
r_eat.save(os.path.join(assets_dir, 'rappi_eat.png'))

# Rappi charge / backpack swing
def build_rappi_charge(base_sprite):
    w, h = base_sprite.size
    canvas = Image.new('RGBA', (w + 28, h), (0, 0, 0, 0))
    canvas.paste(base_sprite, (0, 0))
    arr = np.array(canvas)
    
    rappi_orange = [245, 95, 45, 255]
    mustache = [255, 255, 255, 255]
    outline = [45, 25, 20, 255]
    
    # Swinging big square Rappi delivery bag forward
    arr[40:78, w-8:w+22] = rappi_orange
    arr[54:60, w+2:w+14] = mustache # white mustache logo
    arr[39, w-8:w+23] = outline
    arr[78, w-8:w+23] = outline
    arr[39:79, w+22] = outline
    return Image.fromarray(arr, 'RGBA')

r_charge = build_rappi_charge(r_walk1)
r_charge.save(os.path.join(assets_dir, 'rappi_charge.png'))

r_hurt = r_crouch.copy()
r_hurt.save(os.path.join(assets_dir, 'rappi_hurt.png'))

r_ko = r_walk1.rotate(-90, expand=True, resample=Image.Resampling.NEAREST)
r_ko.save(os.path.join(assets_dir, 'rappi_ko.png'))

# Delivery motorcycle
r_moto_raw = clean_alpha_and_trim(im_r.crop((640, 1220, 765, 1345)))
r_moto = ImageOps.mirror(scale_to_height(r_moto_raw, 65))
r_moto.save(os.path.join(assets_dir, 'rappi_moto.png'))

# -------------------------------------------------------------
# 4. ENVIRONMENT & URBAN LIFE
# -------------------------------------------------------------
print("Processing Environment...")
# Rail track ground (tileable)
rail_crop = im_p.crop((30, 1170, 450, 1208))
rail_track = rail_crop.resize((420, 36), Image.Resampling.NEAREST)
rail_track.save(os.path.join(assets_dir, 'rail_track.png'))

# Metrocable cabin
mc_cabin = im_bg.crop((1080, 175, 1145, 225)).resize((48, 36), Image.Resampling.NEAREST)
mc_cabin.save(os.path.join(assets_dir, 'metrocable.png'))

# Urban pigeons (palomas)
def draw_pigeon():
    p = Image.new('RGBA', (18, 14), (0, 0, 0, 0))
    arr = np.array(p)
    grey = [150, 155, 165, 255]
    neck = [80, 160, 130, 255] # iridescent green neck
    beak = [220, 180, 100, 255]
    arr[4:10, 4:14] = grey
    arr[2:6, 11:15] = neck
    arr[4:6, 15:18] = beak
    arr[9:13, 7:10] = [210, 90, 80, 255] # pink legs
    return Image.fromarray(arr, 'RGBA')

draw_pigeon().save(os.path.join(assets_dir, 'pigeon.png'))

# Flying delivery box projectile
def draw_delivery_box():
    b = Image.new('RGBA', (20, 18), (0, 0, 0, 0))
    arr = np.array(b)
    arr[2:16, 2:18] = [245, 95, 45, 255] # Rappi orange
    arr[7:10, 6:14] = [255, 255, 255, 255] # mustache
    arr[1:17, 1] = [40, 20, 20, 255]
    arr[1:17, 18] = [40, 20, 20, 255]
    arr[1, 1:19] = [40, 20, 20, 255]
    arr[16, 1:19] = [40, 20, 20, 255]
    return Image.fromarray(arr, 'RGBA')

draw_delivery_box().save(os.path.join(assets_dir, 'delivery_box.png'))

print("All game assets successfully processed, scaled, and saved!")
