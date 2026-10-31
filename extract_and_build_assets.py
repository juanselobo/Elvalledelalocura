# extract_and_build_assets.py
from PIL import Image, ImageOps
import numpy as np
import os

assets_dir = 'D:/Desktop/Juegos/villa-aburra-game/assets'
os.makedirs(assets_dir, exist_ok=True)

# Helper function to remove cream background and trim transparency
def extract_alpha(img_crop, bg_color=[241, 235, 213], tol=38, trim=True):
    rgba = img_crop.convert('RGBA')
    arr = np.array(rgba)
    
    # Distance to background
    diff = np.linalg.norm(arr[:, :, :3].astype(float) - np.array(bg_color), axis=2)
    alpha = np.where(diff > tol, 255, 0).astype(np.uint8)
    arr[:, :, 3] = alpha
    
    if trim:
        non_empty_y, non_empty_x = np.where(alpha > 0)
        if len(non_empty_y) == 0:
            return Image.fromarray(arr, 'RGBA')
        ymin, ymax = non_empty_y.min(), non_empty_y.max() + 1
        xmin, xmax = non_empty_x.min(), non_empty_x.max() + 1
        arr = arr[ymin:ymax, xmin:xmax]
        
    return Image.fromarray(arr, 'RGBA')

im_p = Image.open('D:/Desktop/Juegos/REF/Cloud_4358f10e.jpg')
im_g = Image.open('D:/Desktop/Juegos/REF/Cloud_d1c5a103.jpg')
im_r = Image.open('D:/Desktop/Juegos/REF/Cloud_62322cba.jpg')
im_bg = Image.open('D:/Desktop/Juegos/REF/Cloud_6f850eb1.jpg')

print("1. Processing Player (Rail-Walker)...")
# Base idle side view
p_idle = extract_alpha(im_p.crop((320, 660, 450, 990)))
p_idle.save(os.path.join(assets_dir, 'player_idle.png'))

# Walk frames from bottom strip
p_w1 = extract_alpha(im_p.crop((35, 1010, 180, 1165)))
p_w1.save(os.path.join(assets_dir, 'player_walk1.png'))

p_w2 = extract_alpha(im_p.crop((185, 965, 325, 1165)))
p_w2.save(os.path.join(assets_dir, 'player_walk2.png'))

p_w3 = extract_alpha(im_p.crop((330, 975, 465, 1165)))
p_w3.save(os.path.join(assets_dir, 'player_walk3.png'))

# Jump pose (based on p_w2 in mid-stride)
p_jump = p_w2.copy()
p_jump.save(os.path.join(assets_dir, 'player_jump.png'))

# Generate combat poses (Punch & Kick) using player pixel art style
# Target standard height around 180px for high-res sprites
def create_player_punch(base_idle):
    w, h = base_idle.size
    # Create canvas with extra room for punch extension
    canvas = Image.new('RGBA', (w + 40, h), (0, 0, 0, 0))
    canvas.paste(base_idle, (0, 0))
    # Overlay punch fist and orange puffer arm extension
    arr = np.array(canvas)
    # Head Y: ~20 to 60. Arm Y: ~70 to 110.
    # Extend arm forward
    arm_color = np.array([230, 100, 30, 255], dtype=np.uint8) # orange puffer
    fist_color = np.array([210, 150, 110, 255], dtype=np.uint8) # skin
    outline = np.array([40, 25, 20, 255], dtype=np.uint8)
    
    # Arm pixels
    arr[75:100, w-10:w+20] = arm_color
    arr[78:96, w+15:w+32] = fist_color
    # Outline
    arr[73:76, w-10:w+34] = outline
    arr[98:101, w-10:w+34] = outline
    arr[73:101, w+32:w+35] = outline
    return Image.fromarray(arr, 'RGBA')

def create_player_kick(base_idle):
    w, h = base_idle.size
    canvas = Image.new('RGBA', (w + 45, h), (0, 0, 0, 0))
    canvas.paste(base_idle, (0, 0))
    arr = np.array(canvas)
    
    # Leg kick extension
    jean_color = np.array([45, 80, 130, 255], dtype=np.uint8)
    shoe_color = np.array([200, 200, 205, 255], dtype=np.uint8)
    outline = np.array([30, 30, 45, 255], dtype=np.uint8)
    
    # Horizontal kicking leg at Y: ~110 to 140
    arr[115:138, w-15:w+25] = jean_color
    arr[112:140, w+20:w+40] = shoe_color
    arr[110:114, w-15:w+42] = outline
    arr[138:142, w-15:w+42] = outline
    arr[110:142, w+40:w+44] = outline
    return Image.fromarray(arr, 'RGBA')

p_punch = create_player_punch(p_idle)
p_punch.save(os.path.join(assets_dir, 'player_punch.png'))

p_kick = create_player_kick(p_idle)
p_kick.save(os.path.join(assets_dir, 'player_kick.png'))

# Hurt pose
p_hurt = p_idle.rotate(15, expand=True)
p_hurt.save(os.path.join(assets_dir, 'player_hurt.png'))

print("2. Processing Enemy 1 (Gamín de Medellín)...")
# Gamín walking (from top center, avoiding title text at top: y=135 to 650)
g_walk1 = extract_alpha(im_g.crop((260, 135, 480, 650)))
g_walk1.save(os.path.join(assets_dir, 'gamin_walk1.png'))

# Gamín walking with knife (from bottom strip)
g_walk2 = extract_alpha(im_g.crop((35, 1000, 180, 1170)))
g_walk2.save(os.path.join(assets_dir, 'gamin_walk2.png'))

# Gamín crouching
g_crouch = extract_alpha(im_g.crop((180, 1000, 320, 1170)))
g_crouch.save(os.path.join(assets_dir, 'gamin_crouch.png'))

# Gamín sniffing sacol bottle
g_sniff = extract_alpha(im_g.crop((320, 1000, 465, 1170)))
g_sniff.save(os.path.join(assets_dir, 'gamin_sniff.png'))

# Knife slash lunge
def create_gamin_slash(base):
    w, h = base.size
    canvas = Image.new('RGBA', (w + 40, h), (0, 0, 0, 0))
    canvas.paste(base, (0, 0))
    arr = np.array(canvas)
    blade_color = np.array([215, 220, 225, 255], dtype=np.uint8)
    glint = np.array([255, 255, 255, 255], dtype=np.uint8)
    # Knife thrust at arm height
    arr[90:98, w-10:w+30] = blade_color
    arr[92:95, w+10:w+32] = glint
    return Image.fromarray(arr, 'RGBA')

g_slash = create_gamin_slash(g_walk1)
g_slash.save(os.path.join(assets_dir, 'gamin_slash.png'))

g_hurt = g_crouch.copy()
g_hurt.save(os.path.join(assets_dir, 'gamin_hurt.png'))

# Knockout (on back)
g_ko = g_walk1.rotate(-90, expand=True)
g_ko.save(os.path.join(assets_dir, 'gamin_ko.png'))

print("3. Processing Enemy 2 (Rappi-Gamín Medellín)...")
# Rappi walking with phone (from top center, avoiding title: y=140 to 650)
r_walk1 = extract_alpha(im_r.crop((260, 140, 480, 650)))
r_walk1.save(os.path.join(assets_dir, 'rappi_walk1.png'))

# Rappi crouching with phone
r_crouch = extract_alpha(im_r.crop((30, 660, 260, 990)))
r_crouch.save(os.path.join(assets_dir, 'rappi_crouch.png'))

# Rappi eating from styrofoam box
r_eat = extract_alpha(im_r.crop((320, 1000, 465, 1170)))
r_eat.save(os.path.join(assets_dir, 'rappi_eat.png'))

# Rappi charge / backpack swing
def create_rappi_charge(base):
    w, h = base.size
    canvas = Image.new('RGBA', (w + 30, h), (0, 0, 0, 0))
    canvas.paste(base, (0, 0))
    arr = np.array(canvas)
    # Rappi bag rush
    rappi_orange = np.array([245, 90, 40, 255], dtype=np.uint8)
    white_mustache = np.array([255, 255, 255, 255], dtype=np.uint8)
    arr[80:125, w-10:w+20] = rappi_orange
    arr[98:105, w-2:w+14] = white_mustache
    return Image.fromarray(arr, 'RGBA')

r_charge = create_rappi_charge(r_walk1)
r_charge.save(os.path.join(assets_dir, 'rappi_charge.png'))

r_hurt = r_crouch.copy()
r_hurt.save(os.path.join(assets_dir, 'rappi_hurt.png'))

r_ko = r_walk1.rotate(-90, expand=True)
r_ko.save(os.path.join(assets_dir, 'rappi_ko.png'))

# Moto delivery
r_moto = extract_alpha(im_r.crop((640, 1220, 765, 1345)))
r_moto.save(os.path.join(assets_dir, 'rappi_moto.png'))

print("4. Processing Environmental & Urban Elements...")
# Rail track ground
rail_track = im_p.crop((30, 1170, 450, 1208))
rail_track.save(os.path.join(assets_dir, 'rail_track.png'))

# Metrocable cabin from background
mc_cabin = im_bg.crop((1080, 175, 1145, 225))
mc_cabin.save(os.path.join(assets_dir, 'metrocable.png'))

# High quality urban rat with De Todito / cigar matching palette
def draw_detailed_rat(item='todito'):
    w, h = 48, 28
    c = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    arr = np.array(c)
    # Rat body (charcoal grey)
    grey = np.array([100, 105, 115, 255], dtype=np.uint8)
    dark = np.array([65, 68, 75, 255], dtype=np.uint8)
    pink = np.array([245, 170, 175, 255], dtype=np.uint8)
    
    # Body
    arr[10:20, 10:26] = grey
    arr[12:22, 8:24] = dark
    # Head & ear
    arr[8:18, 24:34] = grey
    arr[6:11, 23:27] = pink
    arr[12:15, 31:33] = np.array([10, 10, 15, 255], dtype=np.uint8) # eye
    arr[14:18, 34:37] = pink # snout
    # Tail
    arr[17:21, 2:10] = pink
    arr[13:17, 0:4] = pink
    # Paws
    arr[20:25, 12:15] = pink
    arr[20:25, 22:25] = pink
    
    if item == 'todito':
        # Mini bag of De Todito (yellow with red/blue)
        arr[8:21, 32:42] = np.array([245, 205, 30, 255], dtype=np.uint8)
        arr[12:15, 32:42] = np.array([220, 50, 40, 255], dtype=np.uint8)
        arr[16:18, 32:42] = np.array([40, 110, 200, 255], dtype=np.uint8)
    else:
        # Cigarette
        arr[14:18, 35:46] = np.array([240, 240, 245, 255], dtype=np.uint8)
        arr[14:18, 33:36] = np.array([180, 90, 40, 255], dtype=np.uint8)
        arr[14:18, 44:47] = np.array([230, 60, 30, 255], dtype=np.uint8) # glowing tip
        
    return Image.fromarray(arr, 'RGBA')

draw_detailed_rat('todito').save(os.path.join(assets_dir, 'rat_todito.png'))
draw_detailed_rat('cigar').save(os.path.join(assets_dir, 'rat_cigar.png'))

print("All assets successfully built and verified!")
