# -*- coding: utf-8 -*-
import os
import math
import random
from PIL import Image, ImageDraw, ImageFont

def create_genuine_pixel_exterior(w=320, h=175):
    """
    Reinterpreta la Foto 1 (Exterior Parques del Río y portal del Soterrado)
    como Pixel Art 16-bit genuino hecho a mano estilo Capcom CPS-3 / Neo Geo.
    """
    img = Image.new('RGB', (w, h), (35, 45, 30))
    d = ImageDraw.Draw(img)

    # 1. Fondo superior y arboleda (Ladera de Medellín y Parques del Río)
    for y in range(0, 35):
        d.line([(0, y), (w, y)], fill=(40 + y // 3, 75 + y // 2, 45 + y // 4))
    # Árboles y copas tropicales en el horizonte
    random.seed(101)
    for tx in range(0, w, 14):
        th = random.randint(18, 30)
        tr_col = random.choice([(34, 110, 52), (46, 139, 87), (28, 90, 42), (58, 150, 70)])
        d.ellipse([tx - 10, 5, tx + 16, 5 + th], fill=tr_col)
        d.ellipse([tx - 6, 8, tx + 12, 8 + th - 6], fill=(tr_col[0] + 15, tr_col[1] + 20, tr_col[2] + 10))

    # 2. FLANCO IZQUIERDO: CANAL DEL RÍO MEDELLÍN
    # Canal de concreto inclinado
    canal_w = 85
    # Agua turbia del río fluyendo
    for y in range(25, h):
        t = (y - 25) / float(h - 25)
        r_w = int(18 + t * 45)
        # Borde de concreto inclinado del río
        d.line([(r_w, y), (r_w + 14, y)], fill=(120, 125, 115))
        d.point((r_w + 14, y), fill=(80, 85, 75))
        # Agua del río Medellín
        water_r = int(55 + math.sin(y * 0.4) * 8)
        water_g = int(75 + math.sin(y * 0.4) * 10)
        water_b = int(60 + math.sin(y * 0.4) * 8)
        d.line([(0, y), (r_w - 1, y)], fill=(water_r, water_g, water_b))
        # Espuma y ondas en la orilla
        if int(y + math.sin(y * 0.8) * 3) % 4 == 0:
            d.line([(max(0, r_w - 8), y), (r_w - 1, y)], fill=(175, 190, 170))

    # Puente peatonal oxidado sobre el río (en el fondo izquierdo, como en la foto)
    d.rectangle([0, 42, 65, 48], fill=(95, 55, 35))
    d.line([(0, 42), (65, 42)], fill=(130, 80, 50))
    d.line([(0, 48), (65, 48)], fill=(50, 30, 20))

    # 3. TERRAZA PEATONAL DE PARQUES DEL RÍO (SOBRE EL SOTERRADO)
    plaza_poly = [(canal_w + 8, 30), (w, 20), (w, 82), (canal_w + 8, 88)]
    d.polygon(plaza_poly, fill=(215, 210, 195)) # Adoquines color arena

    # Textura de cuadrícula de adoquines de la plaza
    for py in range(32, 86, 6):
        d.line([(canal_w + 10, py), (w, py - 4)], fill=(190, 185, 170), width=1)
    for px in range(canal_w + 15, w, 16):
        d.line([(px, 28), (px - 6, 88)], fill=(195, 190, 175), width=1)

    # Pérgola metálica oscura / Enrejado arquitectónico moderno
    perg_x, perg_y, perg_w, perg_h = canal_w + 35, 26, 85, 30
    d.rectangle([perg_x, perg_y, perg_x + perg_w, perg_y + perg_h], fill=(30, 32, 38))
    # Vigas transversales en celosía
    for vx in range(perg_x, perg_x + perg_w, 8):
        d.line([(vx, perg_y), (vx + 8, perg_y + perg_h)], fill=(65, 70, 80), width=1)
        d.line([(vx + 8, perg_y), (vx, perg_y + perg_h)], fill=(50, 55, 65), width=1)

    # AVISO ICÓNICO: "Medellín Aquí todo florece" (Pared verde con letras)
    sign_x, sign_y, sign_w, sign_h = canal_w + 42, 44, 72, 14
    d.rectangle([sign_x, sign_y, sign_x + sign_w, sign_y + sign_h], fill=(22, 120, 65), outline=(15, 70, 38))
    # Letras pixel art blancas
    d.text((sign_x + 6, sign_y + 1), "Medellín", fill=(255, 255, 255))
    d.text((sign_x + 8, sign_y + 7), "AQUÍ TODO FLORECE", fill=(240, 245, 230))

    # Estructura geodésica verde de juegos infantiles (Domo trepador a la izquierda del letrero)
    dome_x, dome_y = canal_w + 24, 45
    d.ellipse([dome_x - 8, dome_y - 8, dome_x + 8, dome_y + 8], fill=(39, 174, 96), outline=(20, 90, 45))
    d.line([(dome_x - 7, dome_y), (dome_x + 7, dome_y)], fill=(120, 220, 160))
    d.line([(dome_x, dome_y - 7), (dome_x, dome_y + 7)], fill=(120, 220, 160))

    # Jardineras y arbustos verdes en la terraza
    for jx in range(canal_w + 12, w - 20, 24):
        # Jardinera
        d.rectangle([jx, 70, jx + 18, 77], fill=(60, 55, 50))
        # Arbusto
        d.ellipse([jx - 2, 62, jx + 20, 72], fill=(46, 139, 87))
        d.ellipse([jx + 2, 64, jx + 16, 70], fill=(70, 175, 110))

    # Barandilla negra vertical sobre el dintel del viaducto
    rail_y = 82
    d.line([(canal_w + 8, rail_y), (w, rail_y - 3)], fill=(20, 20, 25), width=2)
    d.line([(canal_w + 8, rail_y - 7), (w, rail_y - 10)], fill=(30, 30, 35), width=1)
    for rx in range(canal_w + 10, w, 4):
        d.line([(rx, rail_y - 7), (rx, rail_y)], fill=(25, 25, 30), width=1)

    # Peatones caminando por la plaza (diminutos sprites 16-bit)
    pedestrians = [
        (canal_w + 90, 40, (231, 76, 60), (41, 128, 185)),
        (canal_w + 125, 48, (241, 196, 15), (50, 50, 60)),
        (canal_w + 160, 35, (46, 204, 113), (40, 40, 40)),
        (canal_w + 60, 66, (155, 89, 182), (52, 73, 94))
    ]
    for px, py, shirt_col, pant_col in pedestrians:
        d.point((px, py - 4), fill=(245, 205, 160)) # Cabeza
        d.line([(px, py - 3), (px, py)], fill=shirt_col) # Camisa
        d.line([(px, py + 1), (px, py + 4)], fill=pant_col) # Pantalón

    # 4. PORTAL DEL VIADUCTO SOTERRADO
    lintel_y = 86
    lintel_h = 14
    # Viga de concreto blanco / fascia superior
    d.rectangle([canal_w + 8, lintel_y, w, lintel_y + lintel_h], fill=(230, 235, 240), outline=(170, 175, 185))

    # Señalización de velocidad [60] y Gálibo 4.5m
    sign_positions = [canal_w + 35, canal_w + 75, canal_w + 115, canal_w + 155, canal_w + 195]
    for sp in sign_positions:
        # Pantalla LED verde [60]
        d.rectangle([sp - 7, lintel_y + 2, sp + 7, lintel_y + 11], fill=(15, 20, 25), outline=(60, 65, 75))
        d.text((sp - 5, lintel_y + 2), "60", fill=(46, 204, 113))
        # Señal circular roja 4.5m
        d.ellipse([sp + 14, lintel_y + 2, sp + 22, lintel_y + 10], fill=(231, 76, 60), outline=(255, 255, 255))
        d.text((sp + 15, lintel_y + 2), "4", fill=(255, 255, 255))

    # BOCA OSCURA DEL TÚNEL (Profundidad subterránea)
    tunnel_top = lintel_y + lintel_h
    tunnel_poly = [
        (canal_w + 14, tunnel_top), (w, tunnel_top - 2),
        (w, tunnel_top + 32), (canal_w + 14, tunnel_top + 32)
    ]
    d.polygon(tunnel_poly, fill=(12, 14, 18))
    # Luces amarillas industriales en la profundidad del túnel
    for lx in range(canal_w + 30, w, 28):
        d.rectangle([lx, tunnel_top + 3, lx + 12, tunnel_top + 6], fill=(255, 245, 180))
        d.ellipse([lx - 4, tunnel_top + 2, lx + 16, tunnel_top + 10], fill=(241, 196, 15, 70))

    # 5. AUTOPISTA SUR (RAMPA DE ENTRADA MULTICARRIL)
    road_top = tunnel_top + 18
    # Asfalto gris oscuro
    d.polygon([(canal_w + 14, road_top), (w, road_top), (w, h), (canal_w - 5, h)], fill=(45, 50, 58))

    # Muros de contención laterales de concreto
    # Muro izquierdo
    for y in range(road_top, h):
        t = (y - road_top) / float(h - road_top)
        wx = int(canal_w + 14 - t * 20)
        d.line([(wx - 8, y), (wx, y)], fill=(160, 165, 170))
        d.line([(wx, y), (wx + 2, y)], fill=(100, 105, 110))
    # Muro derecho
    d.line([(w - 1, road_top), (w - 1, h)], fill=(160, 165, 170), width=4)

    # Líneas blancas de carriles (5 carriles como en la foto)
    lane_xs = [0.2, 0.4, 0.6, 0.8]
    for frac in lane_xs:
        for ly in range(road_top + 6, h, 14):
            t = (ly - road_top) / float(h - road_top)
            lx1 = int((canal_w + 14) + frac * (w - canal_w - 14) - t * 6)
            d.line([(lx1, ly), (lx1, ly + 7)], fill=(235, 240, 245), width=1)

    # Flechas blancas direccionales pintadas en el suelo
    for ay in [road_top + 18, road_top + 36]:
        d.polygon([(canal_w + 65, ay), (canal_w + 69, ay + 6), (canal_w + 61, ay + 6)], fill=(220, 225, 230))
        d.polygon([(canal_w + 130, ay), (canal_w + 134, ay + 6), (canal_w + 126, ay + 6)], fill=(220, 225, 230))

    # Barreras rojas de seguridad vial en la berma izquierda (como en la foto real)
    for by in range(road_top + 4, road_top + 28, 6):
        d.rectangle([canal_w + 8, by, canal_w + 18, by + 4], fill=(231, 76, 60), outline=(150, 30, 20))

    # 6. VEHÍCULOS REALES ENTRANDO AL SOTERRADO (16-bit arcade sprites)
    # Vehículo 1: Camión furgón blanco en carril central
    d.rectangle([canal_w + 110, road_top + 8, canal_w + 130, road_top + 32], fill=(240, 245, 248), outline=(120, 130, 140))
    d.rectangle([canal_w + 114, road_top + 10, canal_w + 126, road_top + 14], fill=(44, 62, 80)) # Techo cabina
    d.rectangle([canal_w + 112, road_top + 30, canal_w + 115, road_top + 32], fill=(231, 76, 60)) # Stop rojo
    d.rectangle([canal_w + 125, road_top + 30, canal_w + 128, road_top + 32], fill=(231, 76, 60))

    # Vehículo 2: Taxi amarillo Hyundai
    d.rectangle([canal_w + 55, road_top + 28, canal_w + 70, road_top + 46], fill=(241, 196, 15), outline=(160, 130, 10))
    d.rectangle([canal_w + 58, road_top + 32, canal_w + 67, road_top + 38], fill=(52, 73, 94)) # Ventana
    d.rectangle([canal_w + 61, road_top + 34, canal_w + 64, road_top + 36], fill=(255, 255, 255)) # Letrero taxi
    d.rectangle([canal_w + 56, road_top + 44, canal_w + 58, road_top + 46], fill=(231, 76, 60))

    # Vehículo 3: Motocicletas con mototaxistas
    motos = [(canal_w + 88, road_top + 16), (canal_w + 40, road_top + 22), (canal_w + 148, road_top + 38)]
    for mx, my in motos:
        d.line([(mx, my), (mx, my + 8)], fill=(20, 20, 25), width=2)
        d.point((mx, my - 2), fill=(231, 76, 60)) # Casco
        d.point((mx, my + 1), fill=(41, 128, 185)) # Conductor
        d.point((mx, my + 8), fill=(231, 76, 60)) # Stop moto

    return img


def create_genuine_pixel_interior(w=320, h=175):
    """
    Reinterpreta la Foto 2 (Interior del Soterrado Inundado de agua turbia con carros y bus)
    como Pixel Art 16-bit genuino hecho a mano estilo Capcom CPS-3 / Neo Geo.
    """
    img = Image.new('RGB', (w, h), (12, 10, 18))
    d = ImageDraw.Draw(img)

    vp_x, vp_y = 150, 58

    # 1. TECHO DE CONCRETO Y ESTRUCTURA DEL TÚNEL
    for y in range(0, 68):
        t = y / 68.0
        r = int(22 + t * 24)
        g = int(26 + t * 28)
        b = int(32 + t * 34)
        d.line([(0, y), (w, y)], fill=(r, g, b))

    # Vigas de concreto en perspectiva
    for bx in [-20, 40, 100, 150, 200, 260, 320]:
        d.line([(bx, 0), (int(vp_x + (bx - vp_x) * 0.18), vp_y)], fill=(18, 22, 28), width=1)
        d.line([(bx + 2, 0), (int(vp_x + (bx - vp_x) * 0.18 + 1), vp_y)], fill=(45, 52, 62), width=1)

    # Costillas transversales del túnel
    for ry in [12, 28, 44, 58]:
        d.line([(0, ry), (w, ry)], fill=(38, 44, 54), width=1)

    # Turbinas Axiales de Ventilación (cilindros de techo de Medellín)
    turbines = [
        (105, 36, 12, 9), (195, 38, 13, 9),
        (125, 48, 8, 6), (175, 49, 8, 6),
        (138, 56, 5, 4), (162, 56, 5, 4)
    ]
    for tx, ty, rx, ry in turbines:
        # Soporte colgante
        d.line([(tx, ty - ry - 4), (tx, ty - ry)], fill=(20, 22, 28), width=2)
        # Carcasa cilíndrica
        d.ellipse([tx - rx, ty - ry, tx + rx, ty + ry], fill=(50, 58, 68), outline=(20, 24, 30))
        d.ellipse([tx - rx + 2, ty - ry + 1, tx + rx - 2, ty + ry - 1], fill=(18, 20, 25))
        # Núcleo de aspas
        d.point((tx, ty), fill=(180, 190, 205))
        d.arc([tx - rx, ty - ry, tx + rx, ty + ry], 0, 360, fill=(241, 196, 15), width=1)

    # Hileras dobles de lámparas fluorescentes en perspectiva
    light_tubes = [
        [(75, 0), (vp_x - 18, vp_y)],
        [(95, 0), (vp_x - 8, vp_y)],
        [(205, 0), (vp_x + 10, vp_y)],
        [(225, 0), (vp_x + 20, vp_y)]
    ]
    for p1, p2 in light_tubes:
        d.line([p1, p2], fill=(255, 240, 160), width=3)
        d.line([p1, p2], fill=(255, 255, 235), width=1)

    # 2. PAREDES LATERALES DE CONCRETO RANURADO
    # Pared izquierda
    d.polygon([(0, 0), (60, 0), (vp_x - 50, vp_y), (vp_x - 50, 75), (0, 140)], fill=(34, 40, 48))
    for sx in [10, 22, 34, 46]:
        d.line([(sx, 0), (int(sx * 0.3), 140)], fill=(22, 26, 32), width=1)
    # Teléfono de emergencia SOS rojo en la pared
    d.rectangle([14, 80, 22, 95], fill=(231, 76, 60), outline=(150, 30, 20))
    d.text((15, 82), "SOS", fill=(255, 255, 255))

    # Pared derecha
    d.polygon([(260, 0), (w, 0), (w, 140), (vp_x + 50, 75), (vp_x + 50, vp_y)], fill=(36, 42, 50))
    for cy in range(75, 140, 10):
        d.polygon([(w - 12, cy), (w, cy - 4), (w, cy + 4), (w - 12, cy + 8)], fill=(241, 196, 15))
        d.polygon([(w - 12, cy + 4), (w, cy), (w, cy + 8), (w - 12, cy + 12)], fill=(20, 20, 20))

    # Trancón en la distancia (siluetas con stops rojos en la penumbra)
    for cx, cy, cw in [(130, 60, 12), (145, 59, 10), (160, 61, 14), (138, 64, 15), (152, 65, 12)]:
        d.rectangle([cx, cy, cx + cw, cy + 6], fill=(24, 26, 32))
        d.point((cx + 1, cy + 4), fill=(231, 76, 60))
        d.point((cx + cw - 2, cy + 4), fill=(231, 76, 60))

    # 3. EL AGUA TURBIA INUNDADA DEL SOTERRADO ("Café con leche")
    water_y = 68
    for y in range(water_y, h - 18):
        t = (y - water_y) / float(h - 18 - water_y)
        # Gradiente café turbio de río desbordado
        r = int(55 + t * 65 + math.sin(y * 0.4) * 4)
        g = int(38 + t * 45 + math.sin(y * 0.4) * 3)
        b = int(22 + t * 24 + math.sin(y * 0.4) * 2)
        d.line([(0, y), (w, y)], fill=(r, g, b))

    # Ondas y rizos de agua en scanlines
    for y in range(water_y + 2, h - 20, 3):
        for x in range(0, w, 6):
            if math.sin(x * 0.12 + y * 0.2) > 0.4:
                d.line([(x, y), (x + 3, y)], fill=(145, 110, 70), width=1)
            elif math.sin(x * 0.12 + y * 0.2) < -0.4:
                d.line([(x, y), (x + 2, y)], fill=(32, 22, 12), width=1)

    # Reflejos verticales dorados de las luces fluorescentes sobre el agua
    for rx_c in [vp_x - 12, vp_x + 14, 110, 205]:
        for y in range(water_y + 2, h - 20, 2):
            t = (y - water_y) / float(h - 20 - water_y)
            spread = int(4 + t * 14 * abs(math.sin(y * 0.35 + rx_c)))
            d.line([(rx_c - spread, y), (rx_c + spread, y)], fill=(241, 196, 15, 80), width=1)
            d.line([(rx_c - spread // 3, y), (rx_c + spread // 3, y)], fill=(255, 255, 230, 110), width=1)

    # Reflejos rojos de luces traseras en el agua
    for tx in [130, 145, 160, 85, 225]:
        for y in range(water_y + 6, water_y + 35, 2):
            d.line([(tx - 2, y), (tx + 2, y)], fill=(231, 76, 60, 120), width=1)

    # 4. VEHÍCULOS SUMERGIDOS EN EL AGUA (16-bit arcade pixel sprites)

    # VEHÍCULO A: BUS COOMETROPOL (Circular Sur) en el centro
    bx, by, bw, bh = 135, 72, 48, 38
    # Desplazamiento y espuma de agua
    d.ellipse([bx - 4, by + bh - 6, bx + bw + 4, by + bh + 4], fill=(35, 25, 15))
    d.line([(bx - 2, by + bh - 3), (bx + bw + 2, by + bh - 3)], fill=(195, 180, 160), width=1)
    # Cuerpo sumergido (azul marino abajo, blanco arriba, franja verde)
    d.rectangle([bx, by + 18, bx + bw, by + bh], fill=(35, 75, 110))
    d.rectangle([bx, by + 15, bx + bw, by + 18], fill=(39, 174, 96)) # Franja verde
    d.rectangle([bx, by + 4, bx + bw, by + 15], fill=(235, 240, 245), outline=(170, 180, 190))
    # Techo blanco del bus
    d.rectangle([bx + 2, by, bx + bw - 2, by + 5], fill=(215, 222, 228))
    # Letrero LED verde [CIRCULAR SUR]
    d.rectangle([bx + 8, by + 1, bx + bw - 8, by + 5], fill=(15, 20, 18))
    d.text((bx + 10, by + 1), "CIRCULAR SUR", fill=(46, 204, 113))
    # Parabrisas y limpiabrisas
    d.rectangle([bx + 4, by + 6, bx + bw - 4, by + 14], fill=(44, 62, 80))
    d.line([(bx + 10, by + 12), (bx + 18, by + 8)], fill=(10, 10, 10))
    d.line([(bx + 30, by + 12), (bx + 38, by + 8)], fill=(10, 10, 10))
    # Farolas bajo el agua
    d.ellipse([bx + 4, by + 22, bx + 10, by + 28], fill=(255, 255, 210))
    d.ellipse([bx + bw - 10, by + 22, bx + bw - 4, by + 28], fill=(255, 255, 210))

    # VEHÍCULO B: TAXI HYUNDAI AMARILLO (Carril izquierdo, con agua a mitad de puertas)
    tx, ty, tw, th = 42, 95, 52, 34
    d.ellipse([tx - 4, ty + th - 5, tx + tw + 4, ty + th + 4], fill=(35, 25, 15))
    d.line([(tx - 2, ty + th - 2), (tx + tw + 2, ty + th - 2)], fill=(205, 190, 170), width=1)
    # Cuerpo amarillo sumergido
    d.rectangle([tx, ty + 10, tx + tw, ty + th], fill=(241, 196, 15), outline=(160, 130, 10))
    # Damero blanco y negro
    for cx in range(tx + 4, tx + tw - 4, 6):
        d.rectangle([cx, ty + 16, cx + 3, ty + 19], fill=(20, 20, 20))
        d.rectangle([cx + 3, ty + 16, cx + 6, ty + 19], fill=(255, 255, 255))
    # Cabina y ventanas
    d.polygon([(tx + 8, ty + 10), (tx + 16, ty + 2), (tx + tw - 12, ty + 2), (tx + tw - 6, ty + 10)], fill=(241, 196, 15))
    d.polygon([(tx + 12, ty + 9), (tx + 18, ty + 4), (tx + tw - 15, ty + 4), (tx + tw - 9, ty + 9)], fill=(44, 62, 80))
    # Letrero TAXI iluminado en el techo
    d.rectangle([tx + tw // 2 - 8, ty, tx + tw // 2 + 8, ty + 4], fill=(255, 255, 255), outline=(30, 30, 30))
    d.text((tx + tw // 2 - 7, ty), "TAXI", fill=(0, 0, 0))
    # Farolas bajo el agua proyectando luz en el barro
    d.ellipse([tx + 2, ty + 20, tx + 8, ty + 26], fill=(255, 255, 220))
    d.polygon([(tx + 2, ty + 23), (tx - 18, ty + 38), (tx - 6, ty + 42), (tx + 6, ty + 25)], fill=(255, 240, 150, 70))

    # VEHÍCULO C: CARRO PARTICULAR BLANCO (Carril derecho, como en la foto)
    wx, wy, ww, wh = 215, 92, 46, 30
    d.ellipse([wx - 4, wy + wh - 5, wx + ww + 4, wy + wh + 4], fill=(35, 25, 15))
    d.line([(wx - 2, wy + wh - 2), (wx + ww + 2, wy + wh - 2)], fill=(195, 185, 165), width=1)
    # Carrocería blanca sumergida
    d.rectangle([wx, wy + 9, wx + ww, wy + wh], fill=(245, 248, 252), outline=(170, 180, 190))
    d.polygon([(wx + 6, wy + 9), (wx + 13, wy + 2), (wx + ww - 10, wy + 2), (wx + ww - 4, wy + 9)], fill=(245, 248, 252))
    d.polygon([(wx + 9, wy + 8), (wx + 15, wy + 4), (wx + ww - 12, wy + 4), (wx + ww - 6, wy + 8)], fill=(44, 62, 80))
    # Luces estacionarias de emergencia parpadeando en ámbar
    d.ellipse([wx + 2, wy + 14, wx + 6, wy + 18], fill=(243, 156, 18))
    d.ellipse([wx + ww - 6, wy + 14, wx + ww - 2, wy + 18], fill=(243, 156, 18))

    # 5. UMBRAL DE PRIMER PLANO (ASFALTO SECO Y REJILLA DE DRENAJE)
    # Donde empieza el agua (como el punto de vista del motociclista en la foto)
    fg_y = h - 18
    # Rejilla de sumidero / drenaje de hierro fundido
    d.rectangle([0, fg_y, w, fg_y + 6], fill=(25, 28, 34))
    for gx in range(0, w, 4):
        d.line([(gx, fg_y), (gx, fg_y + 5)], fill=(10, 12, 15), width=1)
        d.line([(gx + 1, fg_y), (gx + 1, fg_y + 5)], fill=(65, 72, 82), width=1)
    # Espuma de agua desbordándose sobre la rejilla
    for fx in range(0, w, 3):
        d.line([(fx, fg_y - 1), (fx + 2, fg_y + 1)], fill=(220, 210, 190), width=1)

    # Asfalto seco en primer plano
    d.rectangle([0, fg_y + 6, w, h], fill=(42, 48, 56))
    for ly in range(fg_y + 8, h, 6):
        d.line([(0, ly), (w, ly)], fill=(52, 58, 68), width=1)

    return img


def build_final_comic_package():
    art_dir = r"C:\Users\Juanse\.gemini\antigravity\brain\865358c9-b025-436e-b613-f8eea032a59a"
    W, H = 640, 360

    font_impact_28 = ImageFont.truetype(r"C:\Windows\Fonts\impact.ttf", 28)
    font_impact_18 = ImageFont.truetype(r"C:\Windows\Fonts\impact.ttf", 18)
    font_impact_16 = ImageFont.truetype(r"C:\Windows\Fonts\impact.ttf", 16)
    font_tahoma_12 = ImageFont.truetype(r"C:\Windows\Fonts\tahomabd.ttf", 12)
    font_tahoma_10 = ImageFont.truetype(r"C:\Windows\Fonts\tahomabd.ttf", 10)

    # -------------------------------------------------------------
    # PANEL 1: AFUERA DEL SOTERRADO (GENUINO PIXEL ART)
    # -------------------------------------------------------------
    raw_ext = create_genuine_pixel_exterior(w=320, h=175)
    # Upscale pixel-perfect (NEAREST NEIGHBOR) a 600x328
    pixel_ext = raw_ext.resize((600, 328), Image.Resampling.NEAREST)

    panel1 = Image.new('RGB', (W, H), (14, 12, 22))
    d1 = ImageDraw.Draw(panel1)

    # Trama cómic halftone
    for x in range(0, W, 8):
        for y in range(0, H, 8):
            d1.point((x + (y % 16 == 0) * 4, y), fill=(24, 20, 36))

    px1, py1 = (W - 600) // 2, 8
    panel1.paste(pixel_ext, (px1, py1))

    # Marco negro y dorado estilo viñeta arcade
    d1.rectangle([px1 - 4, py1 - 4, px1 + 600 + 4, py1 + 328 + 4], outline=(15, 15, 20), width=4)
    d1.rectangle([px1 - 2, py1 - 2, px1 + 600 + 2, py1 + 328 + 2], outline=(241, 196, 15), width=2)

    # Cartela de cómic amarilla superior
    d1.rectangle([px1 + 8, py1 + 8, px1 + 340, py1 + 36], fill=(241, 196, 15), outline=(10, 10, 10), width=2)
    d1.text((px1 + 16, py1 + 12), "AFUERA: EL SOTERRADO DE PARQUES DEL RÍO", fill=(10, 10, 10), font=font_impact_16)

    # Cartela narrativa inferior
    d1.rectangle([px1 + 8, py1 + 328 - 32, px1 + 600 - 8, py1 + 328 - 8], fill=(15, 18, 28), outline=(52, 152, 219), width=2)
    d1.text((px1 + 16, py1 + 328 - 28), "Bajo la terraza de Parques del Río, los vehículos ingresan a la penumbra del viaducto...", fill=(255, 255, 255), font=font_tahoma_10)

    # Botón de avance
    d1.rectangle([W // 2 - 140, H - 26, W // 2 + 140, H - 6], fill=(241, 196, 15), outline=(255, 255, 255), width=1)
    d1.text((W // 2, H - 23), "▶ [ESPACIO / ENTER / CLICK] CONTINUAR", fill=(10, 10, 10), font=font_tahoma_10, anchor="mt")

    out_p1_asset = 'assets/comic_soterrado_1_exterior.png'
    out_p1_art = os.path.join(art_dir, 'comic_soterrado_1_exterior.png')
    panel1.save(out_p1_asset)
    panel1.save(out_p1_art)
    print(f"Saved genuine pixel art Panel 1 to {out_p1_asset}")


    # -------------------------------------------------------------
    # PANEL 2: "MIENTRAS TANTO..."
    # -------------------------------------------------------------
    panel2 = Image.new('RGB', (W, H), (10, 8, 18))
    d2 = ImageDraw.Draw(panel2)

    for x in range(0, W, 8):
        for y in range(0, H, 8):
            d2.point((x + (y % 16 == 0) * 4, y), fill=(30, 24, 48))

    cx, cy = W // 2, H // 2
    for angle in range(0, 360, 12):
        rad = math.radians(angle)
        x1 = cx + math.cos(rad) * 160
        y1 = cy + math.sin(rad) * 110
        x2 = cx + math.cos(rad) * 380
        y2 = cy + math.sin(rad) * 260
        d2.line([(x1, y1), (x2, y2)], fill=(45, 35, 70), width=2)

    card_w, card_h = 520, 240
    card_x = (W - card_w) // 2
    card_y = (H - card_h) // 2 - 10

    d2.rectangle([card_x - 6, card_y - 6, card_x + card_w + 6, card_y + card_h + 6], fill=(0, 0, 0))
    d2.rectangle([card_x, card_y, card_x + card_w, card_y + card_h], fill=(18, 14, 32), outline=(241, 196, 15), width=3)
    d2.rectangle([card_x + 6, card_y + 6, card_x + card_w - 6, card_y + card_h - 6], outline=(231, 76, 60), width=1)

    box_w, box_h = 360, 56
    box_x = (W - box_w) // 2
    box_y = card_y + 28
    d2.rectangle([box_x + 6, box_y + 6, box_x + box_w + 6, box_y + box_h + 6], fill=(10, 10, 10))
    d2.rectangle([box_x, box_y, box_x + box_w, box_y + box_h], fill=(241, 196, 15), outline=(10, 10, 10), width=3)
    d2.text((W // 2, box_y + 12), "MIENTRAS TANTO...", fill=(10, 10, 10), font=font_impact_28, anchor="mt")

    narrative_y = box_y + 78
    d2.text((W // 2, narrative_y), "Bajo la Autopista Sur, las fuertes lluvias torrenciales", fill=(255, 255, 255), font=font_tahoma_12, anchor="mt")
    d2.text((W // 2, narrative_y + 22), "desbordaban el Río Medellín y las quebradas aledañas...", fill=(241, 196, 15), font=font_tahoma_12, anchor="mt")

    b1_x, b1_y = card_x + 50, card_y + card_h - 65
    d2.rectangle([b1_x, b1_y, b1_x + 160, b1_y + 32], fill=(52, 152, 219), outline=(10, 10, 10), width=2)
    d2.text((b1_x + 80, b1_y + 7), "🌊 * GLUB... GLUB... *", fill=(255, 255, 255), font=font_impact_16, anchor="mt")

    b2_x, b2_y = card_x + card_w - 210, card_y + card_h - 65
    d2.rectangle([b2_x, b2_y, b2_x + 160, b2_y + 32], fill=(231, 76, 60), outline=(10, 10, 10), width=2)
    d2.text((b2_x + 80, b2_y + 7), "🚗 * ¡¡PIII-PIIIII!! *", fill=(255, 255, 255), font=font_impact_16, anchor="mt")

    d2.rectangle([W // 2 - 140, H - 32, W // 2 + 140, H - 8], fill=(241, 196, 15), outline=(255, 255, 255), width=1)
    d2.text((W // 2, H - 28), "▶ [ESPACIO / ENTER / CLICK] CONTINUAR", fill=(10, 10, 10), font=font_tahoma_10, anchor="mt")

    out_p2_asset = 'assets/comic_soterrado_2_mientras_tanto.png'
    out_p2_art = os.path.join(art_dir, 'comic_soterrado_2_mientras_tanto.png')
    panel2.save(out_p2_asset)
    panel2.save(out_p2_art)
    print(f"Saved Panel 2 to {out_p2_asset}")


    # -------------------------------------------------------------
    # PANEL 3: ADENTRO, INUNDADO (GENUINO PIXEL ART)
    # -------------------------------------------------------------
    raw_int = create_genuine_pixel_interior(w=320, h=175)
    pixel_int = raw_int.resize((600, 328), Image.Resampling.NEAREST)

    panel3 = Image.new('RGB', (W, H), (14, 12, 22))
    d3 = ImageDraw.Draw(panel3)

    for x in range(0, W, 8):
        for y in range(0, H, 8):
            d3.point((x + (y % 16 == 0) * 4, y), fill=(24, 20, 36))

    px3, py3 = (W - 600) // 2, 8
    panel3.paste(pixel_int, (px3, py3))

    d3.rectangle([px3 - 4, py3 - 4, px3 + 600 + 4, py3 + 328 + 4], outline=(15, 15, 20), width=4)
    d3.rectangle([px3 - 2, py3 - 2, px3 + 600 + 2, py3 + 328 + 2], outline=(231, 76, 60), width=2)

    # Cartela roja superior de alerta
    d3.rectangle([px3 + 8, py3 + 8, px3 + 370, py3 + 36], fill=(231, 76, 60), outline=(10, 10, 10), width=2)
    d3.text((px3 + 16, py3 + 12), "¡EL SOTERRADO ESTÁ COMPLETAMENTE INUNDADO!", fill=(255, 255, 255), font=font_impact_16)

    # Cartela narrativa inferior
    d3.rectangle([px3 + 8, py3 + 328 - 32, px3 + 600 - 8, py3 + 328 - 8], fill=(15, 18, 28), outline=(241, 196, 15), width=2)
    d3.text((px3 + 16, py3 + 328 - 28), "Taxis, carros y buses atrapados en 2 metros de agua turbia...", fill=(255, 255, 255), font=font_tahoma_10)

    # Botón de acción final
    d3.rectangle([W // 2 - 140, H - 26, W // 2 + 140, H - 6], fill=(46, 204, 113), outline=(255, 255, 255), width=1)
    d3.text((W // 2, H - 23), "▶ [ESPACIO / ENTER / CLICK] CONTINUAR", fill=(0, 0, 0), font=font_tahoma_10, anchor="mt")

    out_p3_asset = 'assets/comic_soterrado_3_inundado.png'
    out_p3_art = os.path.join(art_dir, 'comic_soterrado_3_inundado.png')
    panel3.save(out_p3_asset)
    panel3.save(out_p3_art)
    print(f"Saved genuine pixel art Panel 3 to {out_p3_asset}")

if __name__ == '__main__':
    build_final_comic_package()
