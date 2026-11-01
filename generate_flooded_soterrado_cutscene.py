import os
import math
import random
from PIL import Image, ImageDraw, ImageFont

def create_flooded_soterrado_art():
    # 640x360 16:9 Master arcade resolution
    W, H = 640, 360
    img = Image.new('RGBA', (W, H), (0, 0, 0, 255))
    draw = ImageDraw.Draw(img)

    # Vanishing Point
    vp_x, vp_y = 295, 128

    # -------------------------------------------------------------
    # 1. TUNNEL CEILING & CONCRETE STRUCTURE
    # -------------------------------------------------------------
    # Deep tunnel background gradient
    for y in range(0, 140):
        t = y / 140.0
        r = int(18 + t * 25)
        g = int(22 + t * 28)
        b = int(28 + t * 32)
        draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

    # Concrete ceiling beams and ribs receding in perspective
    ceiling_beams = [
        # (startX, endX)
        (-40, 80), (80, 160), (160, 220), (220, 270),
        (320, 370), (370, 430), (430, 510), (510, 680)
    ]
    for bx1, bx2 in ceiling_beams:
        poly = [
            (bx1, 0), (bx2, 0),
            (vp_x + int((bx2 - vp_x) * 0.15), vp_y - 20),
            (vp_x + int((bx1 - vp_x) * 0.15), vp_y - 20)
        ]
        draw.polygon(poly, fill=(28, 34, 42, 255))
        draw.line([poly[0], poly[3]], fill=(45, 55, 68, 255), width=1)
        draw.line([poly[1], poly[2]], fill=(16, 20, 26, 255), width=1)

    # Concrete transverse expansion joint ribs (horizontal arcs)
    for ry in [25, 55, 85, 110]:
        draw.line([(0, ry), (W, ry)], fill=(38, 46, 56, 255), width=2)
        draw.line([(0, ry + 2), (W, ry + 2)], fill=(12, 16, 22, 255), width=1)

    # Axial Ventilation Jet Fans (Turbinas de ventilación cilíndricas de Medellín)
    fan_positions = [
        # (x, y, radiusX, radiusY)
        (210, 72, 16, 12),
        (380, 74, 17, 13),
        (245, 96, 11, 8),
        (350, 97, 12, 9),
        (272, 112, 7, 5),
        (324, 113, 7, 5),
    ]
    for fx, fy, rx, ry in fan_positions:
        # Fan mounting hanger bracket
        draw.line([(fx, fy - ry - 8), (fx, fy - ry)], fill=(15, 18, 22, 255), width=2)
        # Cylinder body
        draw.ellipse([fx - rx, fy - ry, fx + rx, fy + ry], fill=(42, 48, 56, 255), outline=(15, 18, 24, 255), width=1)
        # Interior turbine intake circle
        draw.ellipse([fx - rx + 3, fy - ry + 2, fx + rx - 3, fy + ry - 2], fill=(12, 14, 18, 255))
        # Center bullet nosecone
        draw.ellipse([fx - 2, fy - 2, fx + 2, fy + 2], fill=(70, 80, 95, 255))
        # Blades
        draw.line([(fx, fy - ry + 3), (fx, fy + ry - 3)], fill=(55, 65, 78, 255), width=1)
        draw.line([(fx - rx + 3, fy), (fx + rx - 3, fy)], fill=(55, 65, 78, 255), width=1)
        # Safety warning ring / yellow ring
        draw.arc([fx - rx, fy - ry, fx + rx, fy + ry], 0, 360, fill=(241, 196, 15, 220), width=1)

    # Overhead Fluorescent Lighting Strips (recidive into VP)
    light_tracks = [
        # Left track: (startX, startY) -> (endX, endY)
        [(150, 0), (vp_x - 30, vp_y - 12)],
        [(195, 0), (vp_x - 15, vp_y - 12)],
        # Right track:
        [(390, 0), (vp_x + 18, vp_y - 12)],
        [(440, 0), (vp_x + 35, vp_y - 12)],
    ]
    for p1, p2 in light_tracks:
        # Soft ambient glow
        draw.line([p1, p2], fill=(255, 240, 160, 60), width=6)
        # Intense core light
        draw.line([p1, p2], fill=(255, 255, 230, 240), width=2)

    # Individual fluorescent tube fixtures along tracks
    for t_step in [0.15, 0.35, 0.55, 0.75, 0.92]:
        for p1, p2 in light_tracks:
            lx = int(p1[0] + (p2[0] - p1[0]) * t_step)
            ly = int(p1[1] + (p2[1] - p1[1]) * t_step)
            sz = int(3 + (1.0 - t_step) * 5)
            draw.rectangle([lx - sz, ly - 1, lx + sz, ly + 2], fill=(255, 255, 255, 255))
            # Light halo
            draw.ellipse([lx - sz*2, ly - sz, lx + sz*2, ly + sz], fill=(241, 196, 15, 45))

    # -------------------------------------------------------------
    # 2. TUNNEL SIDE WALLS (CONCRETE ACOUSTIC PANELS)
    # -------------------------------------------------------------
    # Left Wall
    left_wall_poly = [(0, 0), (120, 0), (vp_x - 80, vp_y), (vp_x - 80, 145), (0, 275)]
    draw.polygon(left_wall_poly, fill=(32, 38, 46, 255))
    # Vertical panel slat joints
    for sx, ex in [(15, 30), (35, 50), (55, 70), (75, 90), (95, 110)]:
        draw.line([(sx, 0), (int(vp_x - 80 + sx*0.3), int(vp_y + 15)), (int(sx*0.2), 275)], fill=(20, 24, 30, 255), width=1)
    # Red emergency phone box on left wall
    draw.rectangle([35, 150, 48, 175], fill=(192, 57, 43, 255), outline=(231, 76, 60, 255))
    draw.text((38, 155), "SOS", fill=(255, 255, 255, 255))

    # Right Wall
    right_wall_poly = [(520, 0), (W, 0), (W, 280), (vp_x + 95, 145), (vp_x + 95, vp_y)]
    draw.polygon(right_wall_poly, fill=(34, 40, 48, 255))
    # Hazard yellow/black curb base along right wall
    for cy in range(160, 280, 16):
        draw.polygon([(W - 25, cy), (W, cy - 8), (W, cy + 6), (W - 25, cy + 14)], fill=(241, 196, 15, 200))
        draw.polygon([(W - 25, cy + 7), (W, cy - 1), (W, cy + 13), (W - 25, cy + 21)], fill=(20, 20, 20, 200))

    # Distant traffic jam silhouette (vanishing point cars)
    for cx, cy, cw, ch in [
        (vp_x - 45, vp_y + 8, 22, 10),
        (vp_x - 20, vp_y + 6, 18, 9),
        (vp_x + 5, vp_y + 7, 24, 11),
        (vp_x + 35, vp_y + 9, 20, 10),
        (vp_x - 10, vp_y + 14, 25, 12),
        (vp_x + 18, vp_y + 15, 22, 11)
    ]:
        draw.rectangle([cx, cy, cx + cw, cy + ch], fill=(25, 28, 35, 255))
        # Red tail lights
        draw.rectangle([cx + 2, cy + ch - 4, cx + 5, cy + ch - 1], fill=(231, 76, 60, 255))
        draw.rectangle([cx + cw - 5, cy + ch - 4, cx + cw - 2, cy + ch - 1], fill=(231, 76, 60, 255))
        # Tail light glow
        draw.ellipse([cx, cy + ch - 6, cx + 7, cy + ch + 1], fill=(231, 76, 60, 80))
        draw.ellipse([cx + cw - 7, cy + ch - 6, cx + cw, cy + ch + 1], fill=(231, 76, 60, 80))

    # -------------------------------------------------------------
    # 3. THE FLOODWATERS (AGUA TURBIA CAFÉ CON LECHE DEL SOTERRADO)
    # -------------------------------------------------------------
    water_top = 138
    water_bottom = 285

    # Depth gradient for flooded river water
    for y in range(water_top, water_bottom + 1):
        t = (y - water_top) / float(water_bottom - water_top)
        # Deep muddy brown tone to richer illuminated caramel brown
        r = int(45 + t * 65 + math.sin(y * 0.4) * 4)
        g = int(32 + t * 45 + math.sin(y * 0.4) * 3)
        b = int(20 + t * 24 + math.sin(y * 0.4) * 2)
        draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

    # Fine horizontal water ripples (authentic 16-bit scanlines)
    for y in range(water_top, water_bottom, 3):
        phase = y * 0.18
        for x in range(0, W, 8):
            ripple_intensity = math.sin(x * 0.06 + phase)
            if ripple_intensity > 0.4:
                # Highlighted wave crest
                rw = int(min(6, 3 + (y - water_top) * 0.04))
                draw.line([(x, y), (x + rw, y)], fill=(138, 102, 64, 180), width=1)
            elif ripple_intensity < -0.4:
                # Wave trough shadow
                draw.line([(x, y), (x + 4, y)], fill=(28, 20, 12, 140), width=1)

    # Massive Fluorescent Light Golden Reflections on Water (vertical shimmering beams)
    for rx_center, r_width in [(vp_x - 18, 24), (vp_x + 22, 28), (210, 36), (410, 40)]:
        for y in range(water_top, water_bottom, 2):
            t = (y - water_top) / float(water_bottom - water_top)
            w_spread = int(r_width * (0.4 + t * 1.6))
            alpha = int(90 * (1.0 - t * 0.45) * (0.6 + 0.4 * math.sin(y * 0.5 + rx_center)))
            gold_color = (241, 196, 15, alpha)
            white_color = (255, 255, 230, int(alpha * 0.8))
            draw.line([(rx_center - w_spread // 2, y), (rx_center + w_spread // 2, y)], fill=gold_color, width=1)
            draw.line([(rx_center - w_spread // 5, y), (rx_center + w_spread // 5, y)], fill=white_color, width=1)

    # Red Taillight water reflection streaks
    for tx in [vp_x - 40, vp_x - 18, vp_x + 8, vp_x + 38, 185, 455]:
        for y in range(water_top + 4, water_top + 45, 2):
            r_w = int(2 + (y - water_top) * 0.35 * abs(math.sin(y * 0.6)))
            r_a = int(120 * (1.0 - (y - water_top) / 45.0))
            draw.line([(tx - r_w, y), (tx + r_w, y)], fill=(231, 76, 60, r_a), width=1)

    # -------------------------------------------------------------
    # 4. SUBMERGED VEHICLES IN DETAIL
    # -------------------------------------------------------------

    # VEHICLE A: BUS COOMETROPOL / CIRCULAR SUR (Center-right lane, midground)
    # -------------------------------------------------------------
    bx, by = 280, 142
    bw, bh = 82, 60  # Only upper half is above water!

    # Bus shadow / water displacement foam
    draw.ellipse([bx - 6, by + bh - 6, bx + bw + 6, by + bh + 8], fill=(30, 22, 14, 220))
    # Water contact foam line
    for fx in range(bx - 4, bx + bw + 5, 3):
        draw.line([(fx, by + bh - 2 + int(math.sin(fx)*1.5)), (fx + 2, by + bh - 2)], fill=(185, 170, 150, 220), width=1)

    # Bus Lower Submerged Body (murky under water)
    draw.rectangle([bx, by + 30, bx + bw, by + bh], fill=(35, 75, 110, 255)) # Dark navy blue skirt
    # Upper body (Coometropol White with Green stripe)
    draw.rectangle([bx, by + 12, bx + bw, by + 30], fill=(235, 240, 242, 255)) # White
    draw.rectangle([bx, by + 26, bx + bw, by + 30], fill=(39, 174, 96, 255))   # Green transit stripe
    # Bus Roof
    draw.rectangle([bx + 2, by + 4, bx + bw - 2, by + 12], fill=(210, 218, 222, 255))
    draw.arc([bx, by + 2, bx + 12, by + 14], 180, 270, fill=(180, 190, 195, 255))
    draw.arc([bx + bw - 12, by + 2, bx + bw, by + 14], 270, 360, fill=(180, 190, 195, 255))

    # Bus Route LED Sign (Top Center)
    draw.rectangle([bx + 14, by + 6, bx + bw - 14, by + 13], fill=(15, 20, 18, 255), outline=(50, 60, 55, 255))
    # LED Matrix text glowing green
    draw.text((bx + 16, by + 6), "CIRCULAR SUR", fill=(46, 204, 113, 255))

    # Bus Front Windshield
    draw.rectangle([bx + 6, by + 14, bx + bw - 6, by + 26], fill=(44, 62, 80, 255), outline=(25, 35, 45, 255))
    # Windshield reflection
    draw.line([(bx + 8, by + 24), (bx + 25, by + 15)], fill=(127, 140, 141, 200), width=2)
    draw.line([(bx + bw - 25, by + 24), (bx + bw - 8, by + 15)], fill=(127, 140, 141, 200), width=2)
    # Dual windshield wipers
    draw.line([(bx + 18, by + 25), (bx + 28, by + 18)], fill=(10, 10, 10, 255), width=1)
    draw.line([(bx + 52, by + 25), (bx + 62, by + 18)], fill=(10, 10, 10, 255), width=1)

    # Headlights glowing under muddy water
    draw.ellipse([bx + 8, by + 34, bx + 18, by + 44], fill=(255, 255, 200, 230))
    draw.ellipse([bx + bw - 18, by + 34, bx + bw - 8, by + 44], fill=(255, 255, 200, 230))
    # Underwater headlight light beams
    draw.polygon([(bx + 8, by + 39), (bx - 20, by + 68), (bx + 15, by + 72), (bx + 18, by + 39)], fill=(255, 245, 170, 75))
    draw.polygon([(bx + bw - 18, by + 39), (bx + bw - 15, by + 72), (bx + bw + 20, by + 68), (bx + bw - 8, by + 39)], fill=(255, 245, 170, 75))

    # STRANDED CHARACTER ON BUS: DOÑA GLORIA!
    # Standing on bus roof waving handbag and shouting
    gx, gy = bx + 36, by - 16
    # Body / Green floral dress
    draw.rectangle([gx - 4, gy + 8, gx + 4, gy + 20], fill=(39, 174, 96, 255))
    # Red flower dots on dress
    draw.point((gx - 2, gy + 11), fill=(231, 76, 60, 255))
    draw.point((gx + 2, gy + 14), fill=(231, 76, 60, 255))
    draw.point((gx, gy + 17), fill=(241, 196, 15, 255))
    # Head & curly brown hair
    draw.ellipse([gx - 4, gy, gx + 4, gy + 8], fill=(245, 205, 160, 255))
    draw.ellipse([gx - 6, gy - 2, gx + 6, gy + 4], fill=(110, 60, 30, 255)) # Curly hair
    # Wide open shouting mouth (classic Doña Gloria scream!)
    draw.rectangle([gx - 2, gy + 4, gx + 2, gy + 7], fill=(120, 20, 20, 255))
    draw.point((gx, gy + 5), fill=(255, 255, 255, 255)) # Teeth
    # Arms in the air waving handbag
    draw.line([(gx - 3, gy + 10), (gx - 10, gy + 2)], fill=(245, 205, 160, 255), width=2) # Left arm up
    draw.line([(gx + 3, gy + 10), (gx + 10, gy + 1)], fill=(245, 205, 160, 255), width=2) # Right arm waving
    # Handbag swinging
    draw.rectangle([gx + 9, gy - 3, gx + 15, gy + 3], fill=(142, 68, 173, 255), outline=(20, 20, 20, 255))
    draw.line([(gx + 10, gy + 1), (gx + 12, gy - 2)], fill=(20, 20, 20, 255), width=1)
    # Speech bubble above Doña Gloria
    draw.polygon([(gx - 2, gy - 6), (gx + 4, gy - 6), (gx + 1, gy - 3)], fill=(255, 255, 255, 255))
    draw.rectangle([gx - 42, gy - 24, gx + 46, gy - 7], fill=(255, 255, 255, 255), outline=(20, 20, 20, 255), width=1)
    draw.text((gx - 39, gy - 23), "¡HIJUEMADRE AGUA!", fill=(192, 57, 43, 255))


    # VEHICLE B: TAXI HYUNDAI AMARILLO DE MEDELLÍN (Left lane foreground/midground)
    # -------------------------------------------------------------
    tx, ty = 100, 185
    tw, th = 92, 55

    # Submerged taxi displacement shadow & foam
    draw.ellipse([tx - 8, ty + th - 8, tx + tw + 8, ty + th + 10], fill=(32, 22, 14, 230))
    for fx in range(tx - 6, tx + tw + 6, 2):
        draw.line([(fx, ty + th - 3 + int(math.sin(fx * 0.8) * 2)), (fx + 2, ty + th - 3)], fill=(200, 185, 165, 240), width=1)

    # Submerged yellow body (water level at mid-door)
    draw.rectangle([tx, ty + 16, tx + tw, ty + th], fill=(241, 196, 15, 255)) # Taxi yellow
    # Black and white checkered taxi stripe
    for cx in range(tx + 4, tx + tw - 4, 8):
        draw.rectangle([cx, ty + 24, cx + 4, ty + 28], fill=(20, 20, 20, 255))
        draw.rectangle([cx + 4, ty + 24, cx + 8, ty + 28], fill=(255, 255, 255, 255))
    # Submerged wheel arches and murky water wash
    draw.polygon([(tx, ty + 38), (tx + tw, ty + 38), (tx + tw, ty + th), (tx, ty + th)], fill=(120, 95, 30, 180))

    # Taxi Roof & Cabin
    draw.polygon([(tx + 12, ty + 16), (tx + 24, ty + 4), (tx + tw - 18, ty + 4), (tx + tw - 8, ty + 16)], fill=(241, 196, 15, 255))
    # Windshield & side windows
    draw.polygon([(tx + 16, ty + 15), (tx + 26, ty + 6), (tx + 48, ty + 6), (tx + 46, ty + 15)], fill=(52, 73, 94, 255)) # Front windshield
    draw.polygon([(tx + 50, ty + 15), (tx + 52, ty + 6), (tx + tw - 20, ty + 6), (tx + tw - 12, ty + 15)], fill=(44, 62, 80, 255)) # Side windows
    # Window glass reflection
    draw.line([(tx + 22, ty + 13), (tx + 34, ty + 7)], fill=(189, 195, 199, 220), width=2)

    # White illuminated "TAXI" roof sign
    draw.rectangle([tx + 40, ty, tx + 62, ty + 6], fill=(255, 255, 255, 255), outline=(40, 40, 40, 255))
    draw.text((tx + 42, ty), "TAXI", fill=(0, 0, 0, 255))

    # Headlights underwater
    draw.ellipse([tx + 4, ty + 28, tx + 14, ty + 38], fill=(255, 255, 220, 255))
    # Submerged beam shining through brown water
    draw.polygon([(tx + 4, ty + 33), (tx - 35, ty + 55), (tx - 15, ty + 65), (tx + 12, ty + 36)], fill=(255, 240, 150, 90))

    # STRANDED CHARACTER ON TAXI: EL TAXISTA PAISA!
    # Kneeling on the roof, waving white rag frantically
    kx, ky = tx + 38, ty - 18
    # Torso in light blue collared shirt
    draw.rectangle([kx - 5, ky + 8, kx + 5, ky + 19], fill=(52, 152, 219, 255))
    # Jeans
    draw.rectangle([kx - 6, ky + 17, kx + 6, ky + 22], fill=(41, 128, 185, 255))
    # Head with classic taxi cap / mustache
    draw.ellipse([kx - 4, ky, kx + 4, ky + 8], fill=(245, 205, 160, 255))
    draw.rectangle([kx - 5, ky - 2, kx + 5, ky + 2], fill=(50, 50, 50, 255)) # Cap
    draw.line([(kx - 2, ky + 5), (kx + 2, ky + 5)], fill=(40, 20, 10, 255), width=1) # Mustache
    # Arms: Left arm waving white handkerchief
    draw.line([(kx - 4, ky + 10), (kx - 12, ky + 2)], fill=(245, 205, 160, 255), width=2)
    # White cloth flapping
    draw.polygon([(kx - 12, ky + 2), (kx - 22, ky - 4), (kx - 18, ky + 5)], fill=(255, 255, 255, 255), outline=(200, 200, 200, 255))
    # Right arm cupping mouth shouting
    draw.line([(kx + 4, ky + 10), (kx + 9, ky + 5)], fill=(245, 205, 160, 255), width=2)
    # Taxista speech bubble
    draw.polygon([(kx + 2, ky - 5), (kx + 8, ky - 5), (kx + 5, ky - 2)], fill=(255, 255, 255, 255))
    draw.rectangle([kx - 35, gy - 3, kx + 65, gy + 14], fill=(255, 255, 255, 255), outline=(20, 20, 20, 255), width=1)
    draw.text((kx - 32, gy - 2), "¡EL AGUA ME LLEGA AL CUELLO!", fill=(180, 40, 40, 255))


    # VEHICLE C: CARRO PARTICULAR BLANCO (Right lane midground, matching real photo!)
    # -------------------------------------------------------------
    wx, wy = 415, 172
    ww, wh = 76, 44

    # Water displacement & foam
    draw.ellipse([wx - 6, wy + wh - 6, wx + ww + 6, wy + wh + 8], fill=(30, 22, 14, 220))
    for fx in range(wx - 4, wx + ww + 5, 2):
        draw.line([(fx, wy + wh - 2 + int(math.sin(fx)*1.5)), (fx + 2, wy + wh - 2)], fill=(195, 180, 160, 230), width=1)

    # Submerged white hatchback body
    draw.rectangle([wx, wy + 14, wx + ww, wy + wh], fill=(245, 248, 250, 255)) # White car body
    draw.polygon([(wx + 8, wy + 14), (wx + 18, wy + 4), (wx + ww - 14, wy + 4), (wx + ww - 4, wy + 14)], fill=(235, 240, 245, 255))
    # Windows
    draw.polygon([(wx + 12, wy + 13), (wx + 20, wy + 6), (wx + ww - 16, wy + 6), (wx + ww - 8, wy + 13)], fill=(52, 73, 94, 255))
    # Headlights glowing underwater
    draw.ellipse([wx + 4, wy + 22, wx + 12, wy + 30], fill=(255, 255, 230, 255))
    draw.ellipse([wx + ww - 12, wy + 22, wx + ww - 4, wy + 30], fill=(255, 255, 230, 255))
    # Flashing hazard lights (amber)
    draw.ellipse([wx + 2, wy + 18, wx + 8, wy + 24], fill=(243, 156, 18, 255))
    draw.ellipse([wx + ww - 8, wy + 18, wx + ww - 2, wy + 24], fill=(243, 156, 18, 255))

    # STRANDED CHARACTER ON CAR C: RAPPI REPARTIDOR CON MALETA NARANJA!
    rx, ry = wx + 38, wy - 14
    # Orange thermal box backpack
    draw.rectangle([rx + 2, ry + 2, rx + 14, ry + 16], fill=(230, 126, 34, 255), outline=(211, 84, 0, 255))
    draw.text((rx + 4, ry + 5), "R", fill=(255, 255, 255, 255))
    # Repartidor crouching on hood
    draw.rectangle([rx - 6, ry + 6, rx + 2, ry + 18], fill=(44, 62, 80, 255)) # Dark jacket
    draw.ellipse([rx - 5, ry, rx + 1, ry + 6], fill=(245, 205, 160, 255))
    draw.ellipse([rx - 6, ry - 2, rx + 2, ry + 3], fill=(230, 126, 34, 255)) # Orange helmet/cap
    # Hands protecting the delivery box
    draw.line([(rx - 2, ry + 8), (rx + 4, ry + 10)], fill=(245, 205, 160, 255), width=2)
    # Speech bubble
    draw.rectangle([rx - 48, ry - 20, rx + 32, ry - 6], fill=(255, 255, 255, 255), outline=(20, 20, 20, 255), width=1)
    draw.text((rx - 45, ry - 19), "¡LA SALCHIPAPA NO!", fill=(211, 84, 0, 255))


    # -------------------------------------------------------------
    # 5. FOREGROUND THRESHOLD (DRY ASPHALT & STORM DRAINAGE GRATE)
    # -------------------------------------------------------------
    # Matching the exact viewpoint of the motorcyclist in Image 2!
    fg_y = 280

    # Drainage storm grate (Rejilla de sumidero de hierro fundido)
    draw.rectangle([0, fg_y, W, fg_y + 9], fill=(25, 28, 32, 255))
    for gx in range(0, W, 7):
        draw.line([(gx, fg_y), (gx, fg_y + 8)], fill=(12, 14, 16, 255), width=2) # Iron bar slots
        draw.line([(gx + 2, fg_y), (gx + 2, fg_y + 8)], fill=(55, 62, 70, 255), width=2) # Metal rim highlight

    # Water spilling over the grate with white frothy foam
    for fx in range(0, W, 4):
        spill_h = int(math.sin(fx * 0.2) * 2 + 2)
        draw.line([(fx, fg_y - 2), (fx + 2, fg_y + spill_h)], fill=(225, 215, 195, 220), width=1)

    # Dry asphalt roadway in the immediate foreground
    for y in range(fg_y + 9, H):
        t = (y - fg_y - 9) / float(H - fg_y - 9)
        # Deep textured charcoal asphalt
        ar = int(38 + t * 12)
        ag = int(44 + t * 14)
        ab = int(52 + t * 16)
        draw.line([(0, y), (W, y)], fill=(ar, ag, ab, 255))

    # Asphalt aggregate texture speckles
    random.seed(42)
    for _ in range(800):
        px = random.randint(0, W - 1)
        py = random.randint(fg_y + 10, H - 1)
        draw.point((px, py), fill=(random.randint(55, 75), random.randint(62, 85), random.randint(70, 95), 255))

    # Painted road markings on dry asphalt (Dashed lane line)
    for ly in range(fg_y + 14, H, 28):
        draw.polygon([(260 + int((ly - fg_y)*0.3), ly), (266 + int((ly - fg_y)*0.3), ly),
                      (270 + int((ly - fg_y + 18)*0.3), ly + 18), (264 + int((ly - fg_y + 18)*0.3), ly + 18)],
                     fill=(240, 245, 250, 240))

    # -------------------------------------------------------------
    # 6. NUESTRO HÉROE: JUANCHO ARRIVING AT THE FLOODED SOTERRADO!
    # -------------------------------------------------------------
    # Standing on the dry asphalt threshold at the right, gazing into the vast flooded tunnel
    # Reimagining the motorcyclist with our 16-bit hero!
    hx, hy = 490, 235

    # Hero shadow on dry asphalt
    draw.ellipse([hx - 18, hy + 86, hx + 36, hy + 98], fill=(18, 22, 28, 200))

    # Skateboard resting vertically under his arm or tilted on ground
    # Skateboard deck (Green grip tape & wooden core)
    draw.polygon([(hx - 16, hy + 50), (hx - 8, hy + 46), (hx - 2, hy + 92), (hx - 10, hy + 95)], fill=(39, 174, 96, 255), outline=(20, 20, 20, 255))
    # Neon yellow wheels
    draw.ellipse([hx - 18, hy + 54, hx - 12, hy + 62], fill=(241, 196, 15, 255))
    draw.ellipse([hx - 7, hy + 86, hx - 1, hy + 94], fill=(241, 196, 15, 255))

    # Legs & Denim Jeans
    # Left leg forward
    draw.polygon([(hx, hy + 52), (hx + 8, hy + 52), (hx + 4, hy + 84), (hx - 4, hy + 84)], fill=(41, 62, 84, 255))
    # Right leg back
    draw.polygon([(hx + 10, hy + 52), (hx + 18, hy + 52), (hx + 18, hy + 86), (hx + 10, hy + 86)], fill=(32, 50, 70, 255))
    # Retro High-Top Sneakers (Red & White)
    draw.rectangle([hx - 5, hy + 84, hx + 5, hy + 92], fill=(231, 76, 60, 255), outline=(20, 20, 20, 255))
    draw.rectangle([hx - 6, hy + 90, hx + 6, hy + 93], fill=(255, 255, 255, 255))
    draw.rectangle([hx + 10, hy + 86, hx + 20, hy + 94], fill=(231, 76, 60, 255), outline=(20, 20, 20, 255))
    draw.rectangle([hx + 9, hy + 92, hx + 21, hy + 95], fill=(255, 255, 255, 255))

    # Torso: Juancho's iconic blue zip hoodie over red tee
    draw.polygon([(hx - 2, hy + 24), (hx + 20, hy + 24), (hx + 18, hy + 54), (hx - 1, hy + 54)], fill=(41, 128, 185, 255), outline=(20, 20, 20, 255))
    # Red shirt collar peek
    draw.polygon([(hx + 4, hy + 24), (hx + 11, hy + 24), (hx + 8, hy + 30)], fill=(231, 76, 60, 255))
    # Left arm holding the skateboard
    draw.polygon([(hx - 5, hy + 26), (hx + 1, hy + 26), (hx - 3, hy + 50), (hx - 9, hy + 48)], fill=(41, 128, 185, 255))
    draw.ellipse([hx - 12, hy + 48, hx - 5, hy + 56], fill=(245, 205, 160, 255)) # Hand grip
    # Right arm pointing forward towards the flooded cars
    draw.line([(hx + 17, hy + 28), (hx + 30, hy + 22)], fill=(41, 128, 185, 255), width=5)
    draw.ellipse([hx + 29, hy + 19, hx + 36, hy + 25], fill=(245, 205, 160, 255)) # Hand pointing finger
    draw.line([(hx + 34, hy + 21), (hx + 40, hy + 18)], fill=(245, 205, 160, 255), width=2) # Pointing index finger

    # Head & Face (3/4 profile looking into the flooded tunnel)
    draw.ellipse([hx + 2, hy + 4, hx + 18, hy + 22], fill=(245, 205, 160, 255), outline=(20, 20, 20, 255))
    # Eye looking left into the tunnel
    draw.rectangle([hx + 4, hy + 10, hx + 8, hy + 14], fill=(255, 255, 255, 255))
    draw.rectangle([hx + 4, hy + 11, hx + 6, hy + 13], fill=(20, 20, 20, 255)) # Pupil
    # Determined smirk / grin
    draw.line([(hx + 4, hy + 17), (hx + 9, hy + 16)], fill=(120, 40, 20, 255), width=1)
    # Dark brown spiky hair tufts
    draw.polygon([(hx + 1, hy + 10), (hx - 3, hy + 12), (hx + 2, hy + 15)], fill=(45, 25, 15, 255))
    # Backwards green snapback cap
    draw.polygon([(hx + 1, hy + 2), (hx + 19, hy + 2), (hx + 21, hy + 11), (hx + 2, hy + 10)], fill=(39, 174, 96, 255), outline=(20, 20, 20, 255))
    # Cap visor pointing backwards
    draw.polygon([(hx + 19, hy + 8), (hx + 27, hy + 12), (hx + 20, hy + 12)], fill=(30, 130, 75, 255), outline=(20, 20, 20, 255))

    # -------------------------------------------------------------
    # 7. RETRO ARCADE NARRATIVE PANEL & BANNER (CAPITULO IV INTRO)
    # -------------------------------------------------------------
    # Top Chapter Title Banner
    draw.rectangle([W//2 - 190, 8, W//2 + 190, 32], fill=(12, 10, 22, 235), outline=(241, 196, 15, 255), width=2)
    # Title Text
    draw.text((W//2, 12), "★ CAPÍTULO IV: LA GRAN INUNDACIÓN DEL SOTERRADO ★", fill=(241, 196, 15, 255), anchor="mt")

    # Bottom Comic Dialogue Banner
    dialog_y = 300
    dialog_h = 52
    draw.rectangle([16, dialog_y, W - 16, dialog_y + dialog_h], fill=(10, 12, 20, 245), outline=(46, 204, 113, 255), width=2)
    # Speaker Tag
    draw.rectangle([24, dialog_y - 10, 130, dialog_y + 6], fill=(46, 204, 113, 255))
    draw.text((77, dialog_y - 8), "JUANCHO", fill=(0, 0, 0, 255), anchor="mt")

    # Hero Quote
    dialog_text = '¡Ave María, nos salvamos de la rata pero el soterrado está hasta el copete de agua!\n¡Toca cruzar saltando por los techos de los carros y salvar a los paisas atrapados!'
    draw.text((30, dialog_y + 12), dialog_text, fill=(255, 255, 255, 255))

    # Action prompt button in corner
    draw.rectangle([W - 170, dialog_y + 16, W - 26, dialog_y + 40], fill=(241, 196, 15, 255), outline=(255, 255, 255, 255), width=1)
    draw.text((W - 98, dialog_y + 20), "▶ [ENTER] INICIAR RESCATE", fill=(10, 10, 10, 255), anchor="mt")

    # Save master image
    os.makedirs('villa-aburra-game/assets', exist_ok=True)
    out_path = 'villa-aburra-game/assets/cutscene_soterrado_inundado.png'
    img.save(out_path, format='PNG')
    print(f"Master Flooded Soterrado Cutscene saved to {out_path} ({W}x{H})")

    # Also save to artifact directory for presentation
    art_dir = r'C:/Users/Juanse/.gemini/antigravity/brain/865358c9-b025-436e-b613-f8eea032a59a'
    art_path = os.path.join(art_dir, 'cutscene_soterrado_inundado.png')
    img.save(art_path, format='PNG')
    print(f"Saved artifact preview to {art_path}")

if __name__ == '__main__':
    create_flooded_soterrado_art()
