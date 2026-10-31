# generate_all_native_art.py
from PIL import Image, ImageDraw
import numpy as np
import os

out_dir = 'D:/Desktop/Juegos/villa-aburra-game/assets'
os.makedirs(out_dir, exist_ok=True)

# ==============================================================================
# COLOR PALETTES
# ==============================================================================
# Rail-Walker (Player)
P_OUTLINE = [32, 24, 28, 255]
P_SKIN = [240, 180, 140, 255]
P_SKIN_SHADOW = [205, 138, 95, 255]
P_BEARD = [50, 32, 28, 255]
P_CAP_WHITE = [245, 246, 250, 255]
P_CAP_GREY = [190, 195, 205, 255]
P_CAP_VISOR = [70, 75, 85, 255]
P_SHADES = [20, 18, 26, 255]
P_SHADES_GLINT = [160, 190, 220, 255]
P_ORANGE_LGT = [255, 130, 40, 255]
P_ORANGE_MID = [235, 90, 20, 255]
P_ORANGE_DRK = [180, 55, 10, 255]
P_ORANGE_SEAM = [120, 30, 5, 255]
P_ZIPPER = [215, 220, 230, 255]
P_BAG_GREY = [85, 90, 102, 255]
P_BAG_DRK = [52, 55, 64, 255]
P_JEAN_LGT = [65, 100, 155, 255]
P_JEAN_MID = [42, 68, 112, 255]
P_JEAN_DRK = [25, 40, 72, 255]
P_SHOE_WHITE = [238, 240, 245, 255]
P_SHOE_GREY = [155, 162, 175, 255]
P_SHOE_SOLE = [55, 60, 70, 255]

# Gamín de Medellín (Enemy 1)
G_OUTLINE = [34, 26, 24, 255]
G_SKIN = [198, 138, 94, 255]
G_SKIN_DRK = [150, 94, 56, 255]
G_HAIR = [58, 38, 28, 255]
G_BREAD_CRUST = [210, 135, 55, 255]
G_BREAD_CRUMB = [245, 225, 185, 255]
G_BREAD_DARK = [140, 80, 25, 255]
G_SHIRT = [238, 232, 222, 255]
G_SHIRT_DRK = [195, 188, 178, 255]
G_EXITO_YELLOW = [245, 200, 20, 255]
G_EXITO_RED = [225, 45, 35, 255]
G_JEAN = [52, 82, 125, 255]
G_JEAN_DRK = [32, 52, 85, 255]
G_KNIFE_STEEL = [220, 225, 235, 255]
G_KNIFE_HANDLE = [95, 55, 35, 255]
G_BOTTLE_GLASS = [140, 160, 180, 220]
G_SACOL_GLUE = [230, 155, 25, 255]

# Rappi-Gamín Medellín (Enemy 2)
R_OUTLINE = [35, 25, 25, 255]
R_SKIN = [190, 132, 90, 255]
R_HELMET_LGT = [255, 120, 45, 255]
R_HELMET_MID = [235, 85, 25, 255]
R_HELMET_DRK = [170, 50, 15, 255]
R_VISOR = [210, 225, 240, 200]
R_VISOR_FRAME = [60, 60, 70, 255]
R_UNDER_GREY = [165, 170, 180, 255]
R_BAG_LGT = [255, 115, 40, 255]
R_BAG_MID = [230, 80, 20, 255]
R_BAG_DRK = [160, 45, 10, 255]
R_MUSTACHE = [255, 255, 255, 255]
R_JEAN = [45, 75, 120, 255]
R_JEAN_DRK = [28, 48, 80, 255]
R_SANDAL = [80, 50, 35, 255]
R_PHONE_CASE = [30, 32, 38, 255]
R_PHONE_RED = [225, 45, 40, 255]
R_PHONE_CRACK = [220, 230, 245, 255]

# ==============================================================================
# SPRITE BUILDERS (Pure RGBA, Zero Background Fringe, Standard Ground Baseline)
# ==============================================================================
def empty_canvas(w=64, h=84):
    return np.zeros((h, w, 4), dtype=np.uint8)

def pbox(arr, x, y, w, h, col):
    arr[y:y+h, x:x+w] = col

def poutline(arr, x, y, w, h, col):
    arr[y, x:x+w] = col
    arr[y+h-1, x:x+w] = col
    arr[y:y+h, x] = col
    arr[y:y+h, x+w-1] = col

# ------------------------------------------------------------------------------
# 1. RAIL-WALKER SPRITES (Player) - Feet at Y = 80
# ------------------------------------------------------------------------------
def draw_rail_walker_body(arr, ox, oy, arm_pose='idle', leg_pose='idle', body_tilt=0):
    # Head & Cap (Facing RIGHT)
    hx = ox + 18 + body_tilt
    hy = oy + 6
    
    # Visor sticking out backward (to the left)
    pbox(arr, hx - 5, hy + 2, 6, 3, P_CAP_VISOR)
    pbox(arr, hx - 6, hy + 3, 2, 2, P_OUTLINE)
    
    # Cap crown
    pbox(arr, hx, hy, 12, 7, P_CAP_WHITE)
    pbox(arr, hx + 1, hy + 5, 10, 2, P_CAP_GREY)
    poutline(arr, hx - 1, hy - 1, 14, 9, P_OUTLINE)
    
    # Face & Sunglasses
    pbox(arr, hx + 4, hy + 7, 9, 8, P_SKIN)
    pbox(arr, hx + 7, hy + 7, 6, 4, P_SHADES)
    pbox(arr, hx + 8, hy + 8, 2, 1, P_SHADES_GLINT) # Glint
    pbox(arr, hx + 3, hy + 8, 4, 2, P_OUTLINE) # Temple
    
    # Nose & Beard
    pbox(arr, hx + 12, hy + 10, 2, 2, P_SKIN_SHADOW)
    pbox(arr, hx + 8, hy + 12, 4, 3, P_BEARD)
    pbox(arr, hx + 10, hy + 13, 2, 2, P_OUTLINE)
    
    # Puffer Jacket & Grey Backpack
    bx = ox + 10 + body_tilt
    by = oy + 21
    
    # Backpack on his back (left side)
    pbox(arr, bx - 5, by + 3, 6, 18, P_BAG_GREY)
    pbox(arr, bx - 6, by + 6, 2, 12, P_BAG_DRK)
    poutline(arr, bx - 6, by + 2, 8, 20, P_OUTLINE)
    
    # Torso (Puffer Jacket with quilted puffs)
    # Puff 1 (Upper chest)
    pbox(arr, bx, by, 16, 8, P_ORANGE_MID)
    pbox(arr, bx + 2, by + 1, 12, 3, P_ORANGE_LGT)
    pbox(arr, bx, by + 7, 16, 1, P_ORANGE_SEAM)
    
    # Puff 2 (Mid chest)
    pbox(arr, bx, by + 8, 16, 8, P_ORANGE_MID)
    pbox(arr, bx + 2, by + 9, 12, 3, P_ORANGE_LGT)
    pbox(arr, bx, by + 15, 16, 1, P_ORANGE_SEAM)
    
    # Puff 3 (Lower waist)
    pbox(arr, bx + 1, by + 16, 15, 7, P_ORANGE_MID)
    pbox(arr, bx + 2, by + 17, 12, 2, P_ORANGE_LGT)
    pbox(arr, bx + 1, by + 22, 15, 1, P_ORANGE_DRK)
    
    # Zipper line
    pbox(arr, bx + 12, by + 1, 2, 21, P_ZIPPER)
    poutline(arr, bx - 1, by - 1, 18, 25, P_OUTLINE)
    
    # ARMS
    if arm_pose == 'punch':
        # Windup body, arm completely punches forward!
        pbox(arr, bx + 12, by + 4, 20, 9, P_ORANGE_MID)
        pbox(arr, bx + 14, by + 5, 16, 3, P_ORANGE_LGT)
        pbox(arr, bx + 28, by + 4, 8, 9, P_SKIN) # Fist
        pbox(arr, bx + 30, by + 6, 4, 3, P_SKIN_SHADOW)
        poutline(arr, bx + 11, by + 3, 26, 11, P_OUTLINE)
        # Impact sparks
        pbox(arr, bx + 38, by + 1, 3, 3, [255, 235, 120, 255])
        pbox(arr, bx + 40, by + 6, 4, 2, [255, 255, 255, 255])
        pbox(arr, bx + 38, by + 11, 3, 3, [255, 235, 120, 255])
    elif arm_pose == 'rail':
        # Balancing arms out
        pbox(arr, bx + 14, by + 5, 12, 6, P_ORANGE_MID)
        pbox(arr, bx + 24, by + 7, 5, 5, P_SKIN)
        pbox(arr, bx - 8, by + 8, 6, 6, P_ORANGE_MID)
        poutline(arr, bx + 13, by + 4, 17, 8, P_OUTLINE)
    elif arm_pose == 'walk1':
        pbox(arr, bx + 10, by + 6, 8, 14, P_ORANGE_MID)
        pbox(arr, bx + 12, by + 18, 5, 5, P_SKIN)
    elif arm_pose == 'walk2':
        pbox(arr, bx + 6, by + 6, 7, 15, P_ORANGE_MID)
        pbox(arr, bx + 7, by + 19, 5, 5, P_SKIN)
    else: # idle
        pbox(arr, bx + 8, by + 6, 7, 16, P_ORANGE_MID)
        pbox(arr, bx + 9, by + 7, 4, 4, P_ORANGE_LGT)
        pbox(arr, bx + 8, by + 20, 6, 5, P_SKIN)
        poutline(arr, bx + 7, by + 5, 9, 21, P_OUTLINE)

    # LEGS (Jeans) & SNEAKERS
    jx = bx + 2
    jy = by + 23
    
    if leg_pose == 'kick':
        # Standing leg
        pbox(arr, jx, jy, 6, 26, P_JEAN_MID)
        pbox(arr, jx - 1, jy + 26, 8, 6, P_SHOE_WHITE)
        pbox(arr, jx - 1, jy + 31, 8, 2, P_SHOE_SOLE)
        poutline(arr, jx - 1, jy - 1, 8, 28, P_OUTLINE)
        
        # Kicking leg extended forward horizontally!
        pbox(arr, jx + 6, jy - 2, 22, 8, P_JEAN_MID)
        pbox(arr, jx + 8, jy - 1, 18, 3, P_JEAN_LGT)
        pbox(arr, jx + 26, jy - 4, 10, 11, P_SHOE_WHITE)
        pbox(arr, jx + 34, jy - 4, 2, 11, P_SHOE_SOLE)
        poutline(arr, jx + 5, jy - 4, 32, 13, P_OUTLINE)
        # Kick wind arc
        pbox(arr, jx + 38, jy - 8, 3, 19, [255, 255, 255, 220])
        pbox(arr, jx + 40, jy - 4, 2, 11, [235, 90, 20, 200])
        
    elif leg_pose == 'jump':
        # Knees tucked up
        pbox(arr, jx, jy, 7, 16, P_JEAN_MID)
        pbox(arr, jx + 6, jy + 2, 7, 15, P_JEAN_LGT)
        pbox(arr, jx - 1, jy + 16, 7, 6, P_SHOE_WHITE)
        pbox(arr, jx + 7, jy + 17, 7, 6, P_SHOE_WHITE)
        
    elif leg_pose == 'walk1': # Stride open
        pbox(arr, jx - 4, jy, 6, 26, P_JEAN_MID)
        pbox(arr, jx - 6, jy + 26, 9, 6, P_SHOE_WHITE)
        pbox(arr, jx - 6, jy + 31, 9, 2, P_SHOE_SOLE)
        
        pbox(arr, jx + 5, jy, 6, 26, P_JEAN_LGT)
        pbox(arr, jx + 6, jy + 26, 9, 6, P_SHOE_WHITE)
        pbox(arr, jx + 6, jy + 31, 9, 2, P_SHOE_SOLE)
        
    elif leg_pose == 'walk2': # Crossing
        pbox(arr, jx + 1, jy, 7, 26, P_JEAN_MID)
        pbox(arr, jx, jy + 26, 9, 6, P_SHOE_WHITE)
        pbox(arr, jx, jy + 31, 9, 2, P_SHOE_SOLE)
        
    elif leg_pose == 'rail': # Careful balance step on single rail
        pbox(arr, jx + 1, jy, 6, 26, P_JEAN_MID)
        pbox(arr, jx + 5, jy + 2, 6, 24, P_JEAN_LGT)
        pbox(arr, jx, jy + 26, 8, 6, P_SHOE_WHITE)
        pbox(arr, jx + 5, jy + 26, 8, 6, P_SHOE_WHITE)
        
    else: # idle
        pbox(arr, jx, jy, 6, 26, P_JEAN_MID)
        pbox(arr, jx + 5, jy, 6, 26, P_JEAN_LGT)
        pbox(arr, jx - 1, jy + 26, 8, 6, P_SHOE_WHITE)
        pbox(arr, jx - 1, jy + 31, 8, 2, P_SHOE_SOLE)
        pbox(arr, jx + 5, jy + 26, 8, 6, P_SHOE_WHITE)
        pbox(arr, jx + 5, jy + 31, 8, 2, P_SHOE_SOLE)
        poutline(arr, jx - 2, jy - 1, 16, 28, P_OUTLINE)

# Build Player Sprites
def make_player_sprites():
    sprites = {}
    
    # Idle
    c = empty_canvas(64, 84)
    draw_rail_walker_body(c, 10, 0, 'idle', 'idle')
    sprites['player_idle_0'] = Image.fromarray(c, 'RGBA')
    
    c = empty_canvas(64, 84)
    draw_rail_walker_body(c, 10, 1, 'idle', 'idle') # breath
    sprites['player_idle_1'] = Image.fromarray(c, 'RGBA')
    
    # Walk Cycle
    c = empty_canvas(64, 84)
    draw_rail_walker_body(c, 10, 0, 'walk1', 'walk1')
    sprites['player_walk_0'] = Image.fromarray(c, 'RGBA')
    
    c = empty_canvas(64, 84)
    draw_rail_walker_body(c, 10, -1, 'walk2', 'walk2')
    sprites['player_walk_1'] = Image.fromarray(c, 'RGBA')
    
    c = empty_canvas(64, 84)
    draw_rail_walker_body(c, 10, 0, 'walk1', 'walk1', body_tilt=1)
    sprites['player_walk_2'] = Image.fromarray(c, 'RGBA')
    
    # Rail Balance Pose
    c = empty_canvas(64, 84)
    draw_rail_walker_body(c, 8, 0, 'rail', 'rail', body_tilt=2)
    sprites['player_rail'] = Image.fromarray(c, 'RGBA')
    
    # Jump
    c = empty_canvas(64, 84)
    draw_rail_walker_body(c, 10, -6, 'rail', 'jump')
    sprites['player_jump'] = Image.fromarray(c, 'RGBA')
    
    # Punch
    c = empty_canvas(64, 84)
    draw_rail_walker_body(c, 4, 0, 'punch', 'idle', body_tilt=2)
    sprites['player_punch'] = Image.fromarray(c, 'RGBA')
    
    # Kick
    c = empty_canvas(64, 84)
    draw_rail_walker_body(c, 4, 0, 'idle', 'kick', body_tilt=-1)
    sprites['player_kick'] = Image.fromarray(c, 'RGBA')
    
    # Hurt
    c = empty_canvas(64, 84)
    draw_rail_walker_body(c, 6, 2, 'rail', 'idle', body_tilt=-3)
    sprites['player_hurt'] = Image.fromarray(c, 'RGBA')
    
    return sprites

# ------------------------------------------------------------------------------
# 2. GAMÍN DE MEDELLÍN (Enemy 1 - Pan en la cabeza + Almacén Éxito + Cuchillo)
# Feet at Y = 80
# ------------------------------------------------------------------------------
def draw_gamin_body(arr, ox, oy, pose='walk1', action='none'):
    bx = ox + 14
    by = oy + 6
    
    # 1. BREAD ON HEAD (Half loaf of golden bread with bite marks)
    pbox(arr, bx + 1, by, 16, 8, G_BREAD_CRUST)
    pbox(arr, bx + 3, by + 2, 12, 4, G_BREAD_CRUMB)
    pbox(arr, bx + 14, by + 1, 3, 3, [0, 0, 0, 0]) # bite mark missing chunk
    pbox(arr, bx + 12, by + 4, 3, 2, [0, 0, 0, 0])
    poutline(arr, bx, by - 1, 18, 10, G_OUTLINE)
    
    # 2. Face & Wild Curly Hair/Beard
    pbox(arr, bx + 2, by + 7, 14, 10, G_HAIR) # wild curls
    pbox(arr, bx + 5, by + 8, 9, 7, G_SKIN)
    # Eyes
    if action == 'sniff':
        # Crazy spiral / rolled-back eyes
        pbox(arr, bx + 8, by + 9, 3, 3, [255, 255, 255, 255])
        pbox(arr, bx + 9, by + 9, 1, 1, [225, 45, 35, 255])
    else:
        pbox(arr, bx + 8, by + 9, 2, 2, [0, 0, 0, 255])
    
    pbox(arr, bx + 11, by + 11, 2, 2, G_SKIN_DRK) # nose
    pbox(arr, bx + 5, by + 13, 11, 5, G_HAIR) # full beard
    
    # 3. Tattered Sleeveless Shirt (ALMACÉN ÉXITO)
    tx = bx + 2
    ty = by + 17
    pbox(arr, tx, ty, 14, 20, G_SHIRT)
    pbox(arr, tx + 1, ty + 1, 12, 18, G_SHIRT_DRK)
    # Ragged torn bottom hem
    pbox(arr, tx + 2, ty + 18, 2, 3, [0, 0, 0, 0])
    pbox(arr, tx + 7, ty + 17, 3, 4, [0, 0, 0, 0])
    
    # Yellow circular Almacén Éxito logo on chest
    pbox(arr, tx + 4, ty + 4, 8, 8, G_EXITO_YELLOW)
    pbox(arr, tx + 6, ty + 6, 4, 3, G_EXITO_RED) # "éxito" red lettering
    poutline(arr, tx - 1, ty - 1, 16, 22, G_OUTLINE)
    
    # 4. Hands & Items: Knife & Sacol Bottle
    if action == 'slash':
        # Arm thrusts forward with knife!
        pbox(arr, tx + 12, ty + 4, 10, 5, G_SKIN)
        pbox(arr, tx + 20, ty + 3, 4, 4, G_KNIFE_HANDLE)
        pbox(arr, tx + 24, ty + 3, 12, 4, G_KNIFE_STEEL) # Gleaming blade
        pbox(arr, tx + 34, ty + 4, 2, 2, [255, 255, 255, 255]) # tip
        poutline(arr, tx + 19, ty + 2, 18, 7, G_OUTLINE)
        # Silver slash swoosh
        pbox(arr, tx + 37, ty - 2, 2, 14, [255, 255, 255, 200])
        # Bottle held in back hand
        pbox(arr, tx - 5, ty + 8, 4, 7, G_BOTTLE_GLASS)
    elif action == 'sniff':
        # Crouching, lifting bottle to mouth/nose
        pbox(arr, tx + 8, ty - 2, 5, 8, G_BOTTLE_GLASS)
        pbox(arr, tx + 9, ty - 1, 3, 6, G_SACOL_GLUE) # amber glue
        pbox(arr, tx + 10, ty + 6, 2, 2, G_SKIN) # hand
        # Sniff vapors
        pbox(arr, tx + 10, ty - 5, 2, 2, [245, 200, 20, 200])
        pbox(arr, tx + 12, ty - 8, 2, 2, [245, 200, 20, 150])
    else:
        # Normal holding knife in front, bottle in back
        pbox(arr, tx + 10, ty + 6, 5, 10, G_SKIN)
        pbox(arr, tx + 13, ty + 14, 3, 3, G_KNIFE_HANDLE)
        pbox(arr, tx + 14, ty + 17, 3, 8, G_KNIFE_STEEL)
        
        pbox(arr, tx - 4, ty + 8, 4, 8, G_BOTTLE_GLASS)
        pbox(arr, tx - 4, ty + 10, 3, 5, G_SACOL_GLUE)
        
    # 5. Ripped Jeans & Bare Dirty Feet
    lx = tx + 2
    ly = ty + 20
    if pose == 'walk1':
        pbox(arr, lx - 3, ly, 5, 23, G_JEAN)
        pbox(arr, lx - 2, ly + 8, 2, 3, G_SKIN) # knee tear
        pbox(arr, lx - 4, ly + 23, 7, 4, G_SKIN_DRK) # bare foot
        
        pbox(arr, lx + 4, ly, 5, 23, G_JEAN_DRK)
        pbox(arr, lx + 5, ly + 10, 2, 3, G_SKIN) # knee tear
        pbox(arr, lx + 4, ly + 23, 7, 4, G_SKIN_DRK) # bare foot
    elif pose == 'walk2':
        pbox(arr, lx, ly, 6, 23, G_JEAN)
        pbox(arr, lx - 1, ly + 23, 8, 4, G_SKIN_DRK)
    elif pose == 'crouch':
        pbox(arr, lx - 2, ly - 4, 10, 16, G_JEAN)
        pbox(arr, lx - 4, ly + 12, 12, 4, G_SKIN_DRK)

def make_gamin_sprites():
    sprites = {}
    
    # Walk 0
    c = empty_canvas(64, 84)
    draw_gamin_body(c, 8, 0, 'walk1')
    sprites['gamin_walk_0'] = Image.fromarray(c, 'RGBA')
    
    # Walk 1
    c = empty_canvas(64, 84)
    draw_gamin_body(c, 8, -1, 'walk2')
    sprites['gamin_walk_1'] = Image.fromarray(c, 'RGBA')
    
    # Sniff
    c = empty_canvas(64, 84)
    draw_gamin_body(c, 8, 6, 'crouch', action='sniff')
    sprites['gamin_sniff'] = Image.fromarray(c, 'RGBA')
    
    # Slash
    c = empty_canvas(64, 84)
    draw_gamin_body(c, 4, 0, 'walk1', action='slash')
    sprites['gamin_slash'] = Image.fromarray(c, 'RGBA')
    
    # Hurt
    c = empty_canvas(64, 84)
    draw_gamin_body(c, 8, 4, 'crouch')
    sprites['gamin_hurt'] = Image.fromarray(c, 'RGBA')
    
    # KO (Rotated onto back)
    ko_img = sprites['gamin_walk_0'].rotate(-90, expand=True, resample=Image.Resampling.NEAREST)
    sprites['gamin_ko'] = ko_img
    
    return sprites

# ------------------------------------------------------------------------------
# 3. RAPPI-GAMÍN MEDELLÍN (Enemy 2 - Casco + Gran Mochila Rappi + Celular)
# Feet at Y = 80
# ------------------------------------------------------------------------------
def draw_rappi_body(arr, ox, oy, pose='walk1', action='none'):
    bx = ox + 18
    by = oy + 2
    
    # 1. ORANGE MOTORCYCLE HELMET WITH VISOR RAISED
    pbox(arr, bx, by, 16, 15, R_HELMET_MID)
    pbox(arr, bx + 2, by + 1, 12, 4, R_HELMET_LGT)
    pbox(arr, bx + 1, by + 10, 14, 5, R_HELMET_DRK)
    # Open clear visor with glint
    pbox(arr, bx + 6, by - 3, 11, 6, R_VISOR)
    pbox(arr, bx + 5, by - 4, 13, 2, R_VISOR_FRAME)
    poutline(arr, bx - 1, by - 1, 18, 17, R_OUTLINE)
    
    # Face inside helmet
    pbox(arr, bx + 7, by + 6, 8, 7, R_SKIN)
    pbox(arr, bx + 10, by + 7, 2, 2, [0, 0, 0, 255]) # eye staring at phone
    pbox(arr, bx + 7, by + 10, 8, 4, [45, 30, 25, 255]) # scruffy beard
    
    # 2. HUGE ORANGE RAPPI DELIVERY BACKPACK
    tx = bx - 1
    ty = by + 16
    
    # Rappi bag on back (left side) unless charging!
    if action != 'charge':
        # Giant square orange bag on back
        pbox(arr, tx - 14, ty + 1, 15, 23, R_BAG_MID)
        pbox(arr, tx - 12, ty + 3, 11, 4, R_BAG_LGT)
        pbox(arr, tx - 14, ty + 18, 15, 6, R_BAG_DRK)
        # White Mustache Logo
        pbox(arr, tx - 11, ty + 12, 9, 4, R_MUSTACHE)
        poutline(arr, tx - 15, ty, 17, 25, R_OUTLINE)
    
    # Torso (Heather grey long sleeves under tattered orange Rappi tee)
    pbox(arr, tx, ty, 14, 18, R_BAG_MID)
    pbox(arr, tx + 1, ty + 1, 12, 14, R_BAG_LGT)
    poutline(arr, tx - 1, ty - 1, 16, 20, R_OUTLINE)
    
    # 3. HANDS & CRACKED PHONE / ACTIONS
    if action == 'charge':
        # Holds the gigantic Rappi bag in FRONT as a battering ram!
        pbox(arr, tx + 12, ty - 2, 20, 24, R_BAG_MID)
        pbox(arr, tx + 14, ty, 16, 4, R_BAG_LGT)
        pbox(arr, tx + 15, ty + 11, 14, 5, R_MUSTACHE) # Big mustache logo
        poutline(arr, tx + 11, ty - 3, 22, 26, R_OUTLINE)
    elif action == 'throw':
        # Arm flinging box forward
        pbox(arr, tx + 10, ty + 2, 12, 6, R_UNDER_GREY)
        pbox(arr, tx + 20, ty + 4, 5, 5, R_SKIN)
    else: # Staring at cracked smartphone
        pbox(arr, tx + 8, ty + 6, 8, 12, R_UNDER_GREY)
        pbox(arr, tx + 12, ty + 14, 5, 5, R_SKIN)
        # Smartphone with cracked screen
        pbox(arr, tx + 14, ty + 10, 5, 9, R_PHONE_CASE)
        pbox(arr, tx + 15, ty + 11, 3, 6, R_PHONE_RED)
        pbox(arr, tx + 15, ty + 12, 3, 2, R_PHONE_CRACK)
        
    # 4. RIPPED JEANS & CHANCLAS
    lx = tx + 2
    ly = ty + 19
    if pose == 'walk1':
        pbox(arr, lx - 3, ly, 6, 23, R_JEAN)
        pbox(arr, lx - 2, ly + 9, 3, 3, R_SKIN) # tear
        pbox(arr, lx - 5, ly + 23, 9, 3, R_SANDAL)
        
        pbox(arr, lx + 5, ly, 6, 23, R_JEAN_DRK)
        pbox(arr, lx + 6, ly + 11, 3, 3, R_SKIN)
        pbox(arr, lx + 4, ly + 23, 9, 3, R_SANDAL)
    else:
        pbox(arr, lx, ly, 6, 23, R_JEAN)
        pbox(arr, lx + 5, ly, 6, 23, R_JEAN_DRK)
        pbox(arr, lx - 1, ly + 23, 8, 3, R_SANDAL)
        pbox(arr, lx + 5, ly + 23, 8, 3, R_SANDAL)

def make_rappi_sprites():
    sprites = {}
    
    # Walk 0
    c = empty_canvas(72, 88)
    draw_rappi_body(c, 10, 0, 'walk1')
    sprites['rappi_walk_0'] = Image.fromarray(c, 'RGBA')
    
    # Walk 1
    c = empty_canvas(72, 88)
    draw_rappi_body(c, 10, -1, 'walk2')
    sprites['rappi_walk_1'] = Image.fromarray(c, 'RGBA')
    
    # Charge (Maletazo)
    c = empty_canvas(72, 88)
    draw_rappi_body(c, 4, 0, 'walk1', action='charge')
    sprites['rappi_charge'] = Image.fromarray(c, 'RGBA')
    
    # Throw (Pedido Volador)
    c = empty_canvas(72, 88)
    draw_rappi_body(c, 8, 0, 'walk2', action='throw')
    sprites['rappi_throw'] = Image.fromarray(c, 'RGBA')
    
    # Hurt
    c = empty_canvas(72, 88)
    draw_rappi_body(c, 8, 2, 'walk2')
    sprites['rappi_hurt'] = Image.fromarray(c, 'RGBA')
    
    # KO
    sprites['rappi_ko'] = sprites['rappi_walk_0'].rotate(-90, expand=True, resample=Image.Resampling.NEAREST)
    return sprites

# ==============================================================================
# 4. PARALLAX LAYERS GENERATION (Consistent Perspective & Palette)
# ==============================================================================
def generate_parallax_layers():
    W, H = 640, 360
    
    # --------------------------------------------------------------------------
    # LAYER 0: FAR (Sky gradient, mountains, setting sun, hillside lights)
    # --------------------------------------------------------------------------
    bg_far = Image.new('RGBA', (W, H))
    draw_far = ImageDraw.Draw(bg_far)
    
    # Sky gradient (Atardecer Paisa)
    for y in range(H):
        t = y / H
        if t < 0.35:
            r = int(32 + (100 - 32) * (t / 0.35))
            g = int(20 + (35 - 20) * (t / 0.35))
            b = int(55 + (75 - 55) * (t / 0.35))
        elif t < 0.7:
            nt = (t - 0.35) / 0.35
            r = int(100 + (225 - 100) * nt)
            g = int(35 + (90 - 35) * nt)
            b = int(75 + (35 - 75) * nt)
        else:
            nt = (t - 0.7) / 0.3
            r = int(225 + (245 - 225) * nt)
            g = int(90 + (165 - 90) * nt)
            b = int(35 + (40 - 35) * nt)
        draw_far.line([(0, y), (W, y)], fill=(r, g, b, 255))
        
    # Golden Sun setting behind valley pass
    draw_far.ellipse([W*0.62 - 25, 145, W*0.62 + 25, 195], fill=(255, 235, 175, 255))
    
    # Cordillera Central Mountain Silhouettes
    # Far mountain
    far_mtn = [(0, H)]
    for x in range(0, W + 20, 20):
        my = 145 + int(np.sin(x * 0.012) * 22 + np.cos(x * 0.025) * 12)
        far_mtn.append((x, my))
    far_mtn.append((W, H))
    draw_far.polygon(far_mtn, fill=(48, 25, 52, 255))
    
    # Mid-far mountain with glowing hillside lights
    mid_mtn = [(0, H)]
    for x in range(0, W + 20, 15):
        my = 175 + int(np.sin(x * 0.015 + 1.2) * 26 + np.cos(x * 0.03) * 15)
        mid_mtn.append((x, my))
    mid_mtn.append((W, H))
    draw_far.polygon(mid_mtn, fill=(62, 32, 60, 255))
    
    # Lit windows of hillside comunas
    np.random.seed(42)
    for _ in range(120):
        lx = np.random.randint(0, W)
        ly = np.random.randint(185, 250)
        draw_far.point((lx, ly), fill=(255, 235, 160, 240))
        draw_far.point((lx+1, ly), fill=(255, 200, 120, 240))
        
    bg_far.save(os.path.join(out_dir, 'bg_far.png'))
    print("Layer Far saved.")

    # --------------------------------------------------------------------------
    # LAYER 1: MID (Downtown Skyline, Coltejer needle tower, Metrocable line)
    # --------------------------------------------------------------------------
    bg_mid = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw_mid = ImageDraw.Draw(bg_mid)
    
    # Distant high-rise silhouettes
    for b in range(16):
        bx = b * 42 - 10
        bw = 28 + (b % 3) * 12
        bh = 70 + (b % 5) * 20
        by = 265 - bh
        draw_mid.rectangle([bx, by, bx + bw, 270], fill=(42, 24, 46, 255))
        # Windows
        for wy in range(by + 6, 260, 8):
            draw_mid.rectangle([bx + 4, wy, bx + 8, wy + 3], fill=(235, 150, 60, 180))
            draw_mid.rectangle([bx + bw - 9, wy, bx + bw - 5, wy + 3], fill=(235, 150, 60, 180))

    # ICONIC EDIFICIO COLTEJER (Needle / Textile spindle tower)
    cx = 360
    cw = 36
    ch = 130
    cy = 265 - ch
    # Needle apex
    for i in range(25):
        w_step = int(i * 1.4)
        draw_mid.line([(cx + 18 - w_step, cy + i), (cx + 18 + w_step, cy + i)], fill=(32, 18, 38, 255))
    # Body
    draw_mid.rectangle([cx, cy + 25, cx + cw, 265], fill=(32, 18, 38, 255))
    # Vertical window columns reflecting sunset
    for vy in range(cy + 30, 260, 6):
        draw_mid.rectangle([cx + 5, vy, cx + 11, vy + 3], fill=(255, 180, 80, 240))
        draw_mid.rectangle([cx + cw - 12, vy, cx + cw - 6, vy + 3], fill=(255, 180, 80, 240))
    # Antenna
    draw_mid.line([(cx + 18, cy - 8), (cx + 18, cy)], fill=(255, 255, 255, 255), width=2)
    
    # Metrocable Cable Lines & Towers
    draw_mid.line([(0, 110), (W, 60)], fill=(75, 55, 75, 200), width=1)
    draw_mid.line([(0, 113), (W, 63)], fill=(75, 55, 75, 200), width=1)
    
    bg_mid.save(os.path.join(out_dir, 'bg_mid.png'))
    print("Layer Mid saved.")

    # --------------------------------------------------------------------------
    # LAYER 2: NEAR (Midground red-brick stepped apartments, water tanks, balconies)
    # --------------------------------------------------------------------------
    bg_near = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw_near = ImageDraw.Draw(bg_near)
    
    # Stepped multifamily blocks in authentic exposed brick
    BRICK_BASE = (145, 58, 38, 255)
    BRICK_DRK = (105, 36, 22, 255)
    TILE_ROOF = (175, 70, 48, 255)
    
    for i in range(7):
        bx = i * 98 - 15
        bw = 88
        bh = 110 + (i % 3) * 25
        by = 285 - bh
        
        # Terracotta tiled roof
        draw_near.rectangle([bx - 3, by - 6, bx + bw + 3, by], fill=TILE_ROOF)
        # Brick facade
        draw_near.rectangle([bx, by, bx + bw, 285], fill=BRICK_BASE)
        
        # Brick textures & windows
        for wy in range(by + 12, 275, 24):
            # Window left
            draw_near.rectangle([bx + 8, wy, bx + 28, wy + 16], fill=(35, 35, 45, 255))
            draw_near.rectangle([bx + 10, wy + 2, bx + 26, wy + 14], fill=(245, 170, 75, 220)) # warm interior
            draw_near.line([(bx + 18, wy), (bx + 18, wy + 16)], fill=(255, 255, 255, 255))
            # Window right
            draw_near.rectangle([bx + bw - 30, wy, bx + bw - 10, wy + 16], fill=(35, 35, 45, 255))
            draw_near.rectangle([bx + bw - 28, wy + 2, bx + bw - 12, wy + 14], fill=(245, 170, 75, 220))
            
            # Brick balcony with flower planter
            draw_near.rectangle([bx + 6, wy + 16, bx + 30, wy + 21], fill=BRICK_DRK)
            draw_near.rectangle([bx + 8, wy + 14, bx + 28, wy + 17], fill=(46, 139, 87, 255)) # green plant
            draw_near.point((bx + 12, wy + 15), fill=(225, 55, 45, 255)) # geranium flower
            draw_near.point((bx + 22, wy + 15), fill=(225, 55, 45, 255))
            
        # Black water tank on roof (Tanque de agua tradicional)
        if i % 2 == 0:
            draw_near.rectangle([bx + 15, by - 16, bx + 35, by - 6], fill=(25, 28, 35, 255))
            draw_near.line([(bx + 15, by - 11), (bx + 35, by - 11)], fill=(50, 55, 65, 255))
        # Clothesline (Cuerda de ropa)
        if i % 3 == 1:
            draw_near.line([(bx + 40, by - 10), (bx + 80, by - 10)], fill=(200, 200, 210, 255))
            draw_near.rectangle([bx + 45, by - 9, bx + 52, by - 2], fill=(245, 245, 250, 255)) # white shirt
            draw_near.rectangle([bx + 60, by - 9, bx + 68, by - 1], fill=(55, 90, 145, 255)) # blue pants
            
    bg_near.save(os.path.join(out_dir, 'bg_near.png'))
    print("Layer Near saved.")

    # --------------------------------------------------------------------------
    # LAYER 3: GROUND PLATFORM (Rooftop viaduct / Street walkway)
    # Character baseline is exactly at Y = 310
    # --------------------------------------------------------------------------
    ground_w = 640
    ground_h = 70
    ground = Image.new('RGBA', (ground_w, ground_h), (0, 0, 0, 0))
    draw_g = ImageDraw.Draw(ground)
    
    # 1. Sidewalk brick paving (Adoquines de ladrillo rojo)
    BRICK_PAVE = (155, 62, 42, 255)
    MORTAR = (85, 32, 20, 255)
    
    draw_g.rectangle([0, 0, ground_w, 20], fill=BRICK_PAVE)
    for y in range(0, 20, 5):
        draw_g.line([(0, y), (ground_w, y)], fill=MORTAR)
        shift = 0 if (y % 10 == 0) else 6
        for x in range(shift, ground_w, 12):
            draw_g.line([(x, y), (x, y + 5)], fill=MORTAR)
            
    # Concrete curb (Bordillo)
    draw_g.rectangle([0, 20, ground_w, 25], fill=(85, 90, 100, 255))
    draw_g.rectangle([0, 21, ground_w, 23], fill=(135, 140, 150, 255)) # top bevel
    
    # 2. Rail Track Ballast (Gravel / Piedra picada de la vía del metro)
    draw_g.rectangle([0, 25, ground_w, ground_h], fill=(42, 38, 46, 255))
    # Stone gravel texture
    np.random.seed(99)
    for _ in range(350):
        gx = np.random.randint(0, ground_w)
        gy = np.random.randint(26, ground_h)
        col = (65, 60, 72, 255) if np.random.rand() > 0.5 else (30, 26, 34, 255)
        draw_g.rectangle([gx, gy, gx+2, gy+2], fill=col)
        
    # Wooden Railroad Ties (Durmientes de madera)
    for rx in range(0, ground_w, 28):
        draw_g.rectangle([rx, 30, rx + 14, 58], fill=(62, 40, 30, 255))
        draw_g.rectangle([rx + 2, 32, rx + 12, 56], fill=(78, 52, 40, 255))
        draw_g.line([(rx, 30), (rx + 14, 30)], fill=(35, 20, 15, 255))
        
    # 3. Steel Rails (Rieles del metro que brillan con el atardecer)
    # Rail 1 (Top rail)
    draw_g.rectangle([0, 34, ground_w, 38], fill=(155, 175, 195, 255))
    draw_g.rectangle([0, 35, ground_w, 36], fill=(235, 242, 250, 255)) # chrome highlight
    draw_g.rectangle([0, 38, ground_w, 40], fill=(55, 65, 80, 255)) # under shadow
    
    # Rail 2 (Bottom rail)
    draw_g.rectangle([0, 50, ground_w, 54], fill=(155, 175, 195, 255))
    draw_g.rectangle([0, 51, ground_w, 52], fill=(235, 242, 250, 255))
    draw_g.rectangle([0, 54, ground_w, 56], fill=(55, 65, 80, 255))
    
    ground.save(os.path.join(out_dir, 'ground_platform.png'))
    print("Layer Ground Platform saved.")

# ==============================================================================
# MAIN EXECUTION
# ==============================================================================
if __name__ == '__main__':
    print("=== Generating 100% Native Clean Pixel Art Sprites ===")
    
    # Player
    p_sprites = make_player_sprites()
    for name, img in p_sprites.items():
        img.save(os.path.join(out_dir, f'{name}.png'))
    print(f"Player sprites: {len(p_sprites)} created.")
    
    # Gamín
    g_sprites = make_gamin_sprites()
    for name, img in g_sprites.items():
        img.save(os.path.join(out_dir, f'{name}.png'))
    print(f"Gamín sprites: {len(g_sprites)} created.")
    
    # Rappi-Gamín
    r_sprites = make_rappi_sprites()
    for name, img in r_sprites.items():
        img.save(os.path.join(out_dir, f'{name}.png'))
    print(f"Rappi-Gamín sprites: {len(r_sprites)} created.")
    
    # Parallax Backgrounds
    print("Generating 3 distinct Parallax Background layers + Ground Platform...")
    generate_parallax_layers()
    
    print("\nSUCCESS! All assets generated natively from scratch with zero background fringe.")
