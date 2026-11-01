import os
import math
from PIL import Image, ImageDraw

def create_level4_sprites():
    out_dir = 'villa-aburra-game/assets'
    os.makedirs(out_dir, exist_ok=True)

    # -------------------------------------------------------------
    # 1. TAXI HYUNDAI FLOODED PLATFORM (car_taxi_flooded.png)
    # -------------------------------------------------------------
    tw, th = 84, 52
    taxi = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    d = ImageDraw.Draw(taxi)

    # Water displacement shadow & ripples
    d.ellipse([2, th - 12, tw - 2, th - 1], fill=(40, 28, 16, 200))
    for rx in range(4, tw - 4, 3):
        d.line([(rx, th - 5 + int(math.sin(rx)*1.2)), (rx + 2, th - 5)], fill=(190, 175, 150, 220), width=1)

    # Yellow taxi lower body (half submerged)
    d.rectangle([6, 18, tw - 6, th - 6], fill=(241, 196, 15, 255), outline=(180, 140, 10, 255))
    # Checkerboard stripe
    for cx in range(8, tw - 8, 8):
        d.rectangle([cx, 26, cx + 4, 30], fill=(20, 20, 20, 255))
        d.rectangle([cx + 4, 26, cx + 8, 30], fill=(255, 255, 255, 255))

    # Cabin & Roof (Solid jumping platform for Juancho!)
    d.polygon([(14, 18), (24, 6), (tw - 20, 6), (tw - 10, 18)], fill=(241, 196, 15, 255))
    # Roof platform highlight (indicating landable surface)
    d.line([(24, 6), (tw - 20, 6)], fill=(255, 235, 120, 255), width=2)
    # Windshield and side windows
    d.polygon([(17, 17), (25, 8), (42, 8), (39, 17)], fill=(52, 73, 94, 255))
    d.polygon([(44, 17), (46, 8), (tw - 22, 8), (tw - 14, 17)], fill=(44, 62, 80, 255))
    d.line([(22, 14), (32, 9)], fill=(189, 195, 199, 220), width=1)

    # TAXI roof beacon
    d.rectangle([tw // 2 - 10, 2, tw // 2 + 10, 7], fill=(255, 255, 255, 255), outline=(40, 40, 40, 255))
    d.text((tw // 2 - 8, 2), "TAXI", fill=(0, 0, 0, 255))

    # Murky water line wash over bottom
    d.polygon([(6, th - 10), (tw - 6, th - 10), (tw - 6, th - 6), (6, th - 6)], fill=(110, 85, 35, 190))

    taxi.save(os.path.join(out_dir, 'car_taxi_flooded.png'))
    print("Saved car_taxi_flooded.png")


    # -------------------------------------------------------------
    # 2. SEDAN BLANCO FLOODED PLATFORM (car_sedan_flooded.png)
    # -------------------------------------------------------------
    sw, sh = 80, 48
    sedan = Image.new('RGBA', (sw, sh), (0, 0, 0, 0))
    d = ImageDraw.Draw(sedan)

    # Water displacement shadow
    d.ellipse([2, sh - 10, sw - 2, sh - 1], fill=(35, 25, 15, 200))
    for rx in range(4, sw - 4, 3):
        d.line([(rx, sh - 4 + int(math.sin(rx)*1.2)), (rx + 2, sh - 4)], fill=(190, 180, 160, 220), width=1)

    # White body
    d.rectangle([6, 16, sw - 6, sh - 5], fill=(240, 243, 246, 255), outline=(180, 190, 200, 255))
    # Roof platform
    d.polygon([(14, 16), (22, 5), (sw - 18, 5), (sw - 10, 16)], fill=(245, 248, 252, 255))
    d.line([(22, 5), (sw - 18, 5)], fill=(255, 255, 255, 255), width=2)
    # Windows
    d.polygon([(17, 15), (24, 7), (40, 7), (38, 15)], fill=(52, 73, 94, 255))
    d.polygon([(42, 15), (44, 7), (sw - 20, 7), (sw - 13, 15)], fill=(44, 62, 80, 255))

    # Flashing hazard lights (amber)
    d.ellipse([4, 20, 9, 25], fill=(243, 156, 18, 255))
    d.ellipse([sw - 9, 20, sw - 4, 25], fill=(243, 156, 18, 255))

    # Murky water wash
    d.polygon([(6, sh - 9), (sw - 6, sh - 9), (sw - 6, sh - 5), (6, sh - 5)], fill=(110, 85, 35, 190))

    sedan.save(os.path.join(out_dir, 'car_sedan_flooded.png'))
    print("Saved car_sedan_flooded.png")


    # -------------------------------------------------------------
    # 3. BUS COOMETROPOL FLOODED (bus_coometropol_flooded.png)
    # -------------------------------------------------------------
    bw, bh = 140, 68
    bus = Image.new('RGBA', (bw, bh), (0, 0, 0, 0))
    d = ImageDraw.Draw(bus)

    # Water displacement shadow
    d.ellipse([4, bh - 12, bw - 4, bh - 1], fill=(30, 22, 14, 220))
    for rx in range(6, bw - 6, 4):
        d.line([(rx, bh - 5 + int(math.sin(rx)*1.5)), (rx + 2, bh - 5)], fill=(195, 180, 160, 230), width=1)

    # Bus Submerged lower skirt (Navy Blue)
    d.rectangle([6, 36, bw - 6, bh - 6], fill=(35, 75, 110, 255))
    # Green transit stripe
    d.rectangle([6, 30, bw - 6, 36], fill=(39, 174, 96, 255))
    # White main body
    d.rectangle([6, 12, bw - 6, 30], fill=(235, 240, 245, 255), outline=(180, 190, 200, 255))

    # Bus Roof (High, long platform!)
    d.rectangle([8, 4, bw - 8, 12], fill=(215, 222, 228, 255))
    d.line([(8, 4), (bw - 8, 4)], fill=(255, 255, 255, 255), width=2) # Platform edge

    # LED Route Sign
    d.rectangle([bw // 2 - 32, 5, bw // 2 + 32, 11], fill=(15, 20, 18, 255))
    d.text((bw // 2 - 28, 5), "CIRCULAR SUR", fill=(46, 204, 113, 255))

    # Bus Windows (row of passenger windows)
    for wx in range(12, bw - 20, 20):
        d.rectangle([wx, 15, wx + 16, 28], fill=(44, 62, 80, 255), outline=(25, 35, 45, 255))
        d.line([(wx + 2, 26), (wx + 10, 17)], fill=(127, 140, 141, 180), width=1)

    # Headlights & tail lights
    d.ellipse([8, 38, 16, 46], fill=(255, 255, 200, 240))
    d.rectangle([bw - 12, 38, bw - 8, 46], fill=(231, 76, 60, 255))

    bus.save(os.path.join(out_dir, 'bus_coometropol_flooded.png'))
    print("Saved bus_coometropol_flooded.png")


    # -------------------------------------------------------------
    # 4. STRANDED TAXISTA NPC (npc_stranded_taxista.png)
    # -------------------------------------------------------------
    nw, nh = 28, 36
    taxista = Image.new('RGBA', (nw, nh), (0, 0, 0, 0))
    d = ImageDraw.Draw(taxista)

    # Blue shirt
    d.rectangle([8, 12, 20, 25], fill=(52, 152, 219, 255), outline=(30, 100, 160, 255))
    # Jeans
    d.rectangle([7, 24, 21, 34], fill=(41, 128, 185, 255))
    # Head & Cap
    d.ellipse([9, 2, 19, 12], fill=(245, 205, 160, 255))
    d.rectangle([8, 0, 20, 5], fill=(50, 50, 50, 255))
    d.line([(11, 8), (17, 8)], fill=(40, 20, 10, 255), width=1) # Mustache
    # Waving white cloth
    d.line([(8, 14), (2, 4)], fill=(245, 205, 160, 255), width=2)
    d.polygon([(2, 4), (-3, -3), (3, -2)], fill=(255, 255, 255, 255), outline=(200, 200, 200, 255))
    # Right arm shouting
    d.line([(20, 14), (25, 7)], fill=(245, 205, 160, 255), width=2)

    taxista.save(os.path.join(out_dir, 'npc_stranded_taxista.png'))
    print("Saved npc_stranded_taxista.png")


    # -------------------------------------------------------------
    # 5. STRANDED DOÑA GLORIA NPC (npc_stranded_gloria.png)
    # -------------------------------------------------------------
    gw, gh = 28, 38
    gloria = Image.new('RGBA', (gw, gh), (0, 0, 0, 0))
    d = ImageDraw.Draw(gloria)

    # Green floral dress
    d.rectangle([7, 12, 21, 32], fill=(39, 174, 96, 255))
    d.point((10, 16), fill=(231, 76, 60, 255))
    d.point((17, 22), fill=(241, 196, 15, 255))
    # Head & curly brown hair
    d.ellipse([9, 2, 19, 12], fill=(245, 205, 160, 255))
    d.ellipse([7, 0, 21, 7], fill=(110, 60, 30, 255))
    # Shouting mouth
    d.rectangle([11, 7, 17, 11], fill=(120, 20, 20, 255))
    d.point((14, 8), fill=(255, 255, 255, 255))
    # Waving handbag
    d.line([(8, 14), (2, 5)], fill=(245, 205, 160, 255), width=2)
    d.line([(20, 14), (26, 4)], fill=(245, 205, 160, 255), width=2)
    d.rectangle([23, 0, 28, 6], fill=(142, 68, 173, 255)) # Handbag

    gloria.save(os.path.join(out_dir, 'npc_stranded_gloria.png'))
    print("Saved npc_stranded_gloria.png")


    # -------------------------------------------------------------
    # 6. OVERHEAD CLEARANCE HAZARD (hazard_low_pipe.png)
    # -------------------------------------------------------------
    # Low hanging ventilation pipe / clearance beam (requires slide/duck)
    hw, hh = 130, 26
    hazard = Image.new('RGBA', (hw, hh), (0, 0, 0, 0))
    d = ImageDraw.Draw(hazard)

    # Steel hanger rods
    d.line([(18, 0), (18, 8)], fill=(60, 65, 72, 255), width=2)
    d.line([(hw - 18, 0), (hw - 18, 8)], fill=(60, 65, 72, 255), width=2)

    # Main pipe / gantry bar with diagonal hazard yellow & black stripes
    d.rectangle([4, 8, hw - 4, 22], fill=(241, 196, 15, 255), outline=(30, 30, 30, 255), width=1)
    for hx in range(6, hw - 6, 12):
        d.polygon([(hx, 8), (hx + 6, 8), (hx + 2, 22), (hx - 4, 22)], fill=(20, 20, 20, 255))

    # Warning text plaque in center
    d.rectangle([hw // 2 - 34, 10, hw // 2 + 34, 20], fill=(192, 57, 43, 255), outline=(255, 255, 255, 255))
    d.text((hw // 2 - 30, 10), "¡GÁLIBO BAJO!", fill=(255, 255, 255, 255))

    hazard.save(os.path.join(out_dir, 'hazard_low_pipe.png'))
    print("Saved hazard_low_pipe.png")

if __name__ == '__main__':
    create_level4_sprites()
