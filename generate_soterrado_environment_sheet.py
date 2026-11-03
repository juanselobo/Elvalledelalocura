# -*- coding: utf-8 -*-
import os
import math
import random
from PIL import Image, ImageDraw, ImageFont

def draw_option_1_interior_depth(w=480, h=270):
    """
    OPCIÓN 1: VISTA INTERIOR PROFUNDA (The Flooded Catacomb)
    Perspectiva longitudinal central hacia el fondo del túnel.
    Enfoque: Atmósfera cinematográfica, profundidad, tensión y reflejos en agua turbia.
    """
    img = Image.new('RGB', (w, h), (14, 12, 20))
    d = ImageDraw.Draw(img)
    vp_x, vp_y = w // 2, int(h * 0.38) # (240, 102)

    # 1. Techo de concreto y estructura
    for y in range(0, vp_y + 10):
        t = y / float(vp_y + 10)
        r = int(20 + t * 25)
        g = int(24 + t * 28)
        b = int(30 + t * 34)
        d.line([(0, y), (w, y)], fill=(r, g, b))

    # Vigas de concreto longitudinales en perspectiva
    for bx in [-40, 20, 90, 160, 220, 260, 320, 390, 460, 520]:
        t_x = int(vp_x + (bx - vp_x) * 0.15)
        d.line([(bx, 0), (t_x, vp_y)], fill=(16, 20, 26), width=2)
        d.line([(bx + 2, 0), (t_x + 1, vp_y)], fill=(45, 52, 62), width=1)

    # Juntas transversales de dilatación
    for ry in [20, 45, 70, 90]:
        d.line([(0, ry), (w, ry)], fill=(35, 42, 52), width=1)

    # Turbinas axiales de ventilación (en perspectiva a ambos lados)
    turbines = [
        # (x, y, rx, ry)
        (155, 60, 18, 13), (325, 60, 18, 13),
        (190, 78, 12, 9), (290, 78, 12, 9),
        (215, 92, 8, 6), (265, 92, 8, 6),
    ]
    for tx, ty, rx, ry in turbines:
        d.line([(tx, ty - ry - 6), (tx, ty - ry)], fill=(20, 22, 28), width=2)
        d.ellipse([tx - rx, ty - ry, tx + rx, ty + ry], fill=(48, 55, 65), outline=(18, 22, 28))
        d.ellipse([tx - rx + 2, ty - ry + 1, tx + rx - 2, ty + ry - 1], fill=(16, 18, 24))
        d.point((tx, ty), fill=(180, 195, 210))
        d.arc([tx - rx, ty - ry, tx + rx, ty + ry], 0, 360, fill=(241, 196, 15), width=1)

    # Lámparas fluorescentes industriales en perspectiva
    light_tubes = [
        [(110, 0), (vp_x - 30, vp_y - 8)],
        [(140, 0), (vp_x - 12, vp_y - 8)],
        [(340, 0), (vp_x + 12, vp_y - 8)],
        [(370, 0), (vp_x + 30, vp_y - 8)]
    ]
    for p1, p2 in light_tubes:
        d.line([p1, p2], fill=(255, 240, 160), width=4)
        d.line([p1, p2], fill=(255, 255, 235), width=2)

    # 2. Paredes laterales de concreto ranurado
    # Pared izquierda
    d.polygon([(0, 0), (85, 0), (vp_x - 70, vp_y), (vp_x - 70, 120), (0, 220)], fill=(32, 38, 46))
    for sx in [15, 32, 50, 68]:
        d.line([(sx, 0), (int(sx * 0.28), 220)], fill=(20, 24, 30), width=1)
    # Caja SOS
    d.rectangle([22, 130, 34, 155], fill=(231, 76, 60), outline=(140, 30, 20))
    d.text((24, 135), "SOS", fill=(255, 255, 255))

    # Pared derecha
    d.polygon([(w - 85, 0), (w, 0), (w, 220), (vp_x + 70, 120), (vp_x + 70, vp_y)], fill=(34, 40, 48))
    for cy in range(110, 220, 16):
        d.polygon([(w - 18, cy), (w, cy - 6), (w, cy + 6), (w - 18, cy + 12)], fill=(241, 196, 15))
        d.polygon([(w - 18, cy + 6), (w, cy), (w, cy + 12), (w - 18, cy + 18)], fill=(20, 20, 20))

    # Trancón en la distancia (siluetas oscuras con stops rojos en la penumbra)
    for cx, cy, cw, ch in [
        (vp_x - 50, vp_y + 8, 22, 10), (vp_x - 22, vp_y + 7, 18, 9),
        (vp_x + 5, vp_y + 8, 24, 11), (vp_x + 32, vp_y + 9, 20, 10),
        (vp_x - 12, vp_y + 14, 25, 12), (vp_x + 16, vp_y + 15, 22, 11)
    ]:
        d.rectangle([cx, cy, cx + cw, cy + ch], fill=(24, 26, 32))
        d.rectangle([cx + 1, cy + ch - 4, cx + 4, cy + ch - 1], fill=(231, 76, 60))
        d.rectangle([cx + cw - 4, cy + ch - 4, cx + cw - 1, cy + ch - 1], fill=(231, 76, 60))

    # 3. El agua turbia del soterrado (Café con leche)
    water_y = 110
    for y in range(water_y, h):
        t = (y - water_y) / float(h - water_y)
        r = int(50 + t * 65 + math.sin(y * 0.4) * 4)
        g = int(35 + t * 45 + math.sin(y * 0.4) * 3)
        b = int(20 + t * 24 + math.sin(y * 0.4) * 2)
        d.line([(0, y), (w, y)], fill=(r, g, b))

    # Ondas y rizos de agua en scanlines
    for y in range(water_y + 2, h, 3):
        for x in range(0, w, 8):
            if math.sin(x * 0.08 + y * 0.25) > 0.35:
                d.line([(x, y), (x + 4, y)], fill=(140, 105, 68), width=1)
            elif math.sin(x * 0.08 + y * 0.25) < -0.35:
                d.line([(x, y), (x + 3, y)], fill=(28, 18, 10), width=1)

    # Reflejos verticales de las luces fluorescentes
    for rx_c in [vp_x - 18, vp_x + 18, 155, 325]:
        for y in range(water_y + 2, h, 2):
            t = (y - water_y) / float(h - water_y)
            spread = int(5 + t * 20 * abs(math.sin(y * 0.35 + rx_c)))
            d.line([(rx_c - spread, y), (rx_c + spread, y)], fill=(241, 196, 15), width=1)
            d.line([(rx_c - spread // 3, y), (rx_c + spread // 3, y)], fill=(255, 255, 230), width=1)

    # Reflejos rojos de stops en el agua
    for tx in [vp_x - 45, vp_x - 18, vp_x + 12, vp_x + 42, 110, 370]:
        for y in range(water_y + 6, water_y + 45, 2):
            d.line([(tx - 2, y), (tx + 2, y)], fill=(231, 76, 60), width=1)

    # 4. Vehículos sumergidos principales (Capcom 90s sprite pixel art)

    # BUS COOMETROPOL (Circular Sur) - Centro
    bx, by, bw, bh = 205, 115, 75, 58
    d.ellipse([bx - 6, by + bh - 8, bx + bw + 6, by + bh + 6], fill=(32, 22, 14))
    d.line([(bx - 2, by + bh - 4), (bx + bw + 2, by + bh - 4)], fill=(195, 180, 160), width=2)
    # Cuerpo del bus
    d.rectangle([bx, by + 26, bx + bw, by + bh], fill=(35, 75, 110))
    d.rectangle([bx, by + 22, bx + bw, by + 26], fill=(39, 174, 96)) # Franja verde
    d.rectangle([bx, by + 8, bx + bw, by + 22], fill=(235, 240, 245), outline=(160, 170, 180))
    d.rectangle([bx + 2, by + 2, bx + bw - 2, by + 8], fill=(215, 222, 228)) # Techo
    # Letrero LED verde [CIRCULAR SUR 302]
    d.rectangle([bx + 12, by + 3, bx + bw - 12, by + 8], fill=(15, 20, 18))
    d.text((bx + 14, by + 2), "CIRCULAR SUR", fill=(46, 204, 113))
    # Parabrisas y limpiabrisas
    d.rectangle([bx + 6, by + 9, bx + bw - 6, by + 20], fill=(44, 62, 80))
    d.line([(bx + 14, by + 18), (bx + 24, by + 12)], fill=(15, 15, 15), width=1)
    d.line([(bx + 48, by + 18), (bx + 58, by + 12)], fill=(15, 15, 15), width=1)
    # Farolas bajo el agua
    d.ellipse([bx + 6, by + 30, bx + 16, by + 40], fill=(255, 255, 210))
    d.ellipse([bx + bw - 16, by + 30, bx + bw - 6, by + 40], fill=(255, 255, 210))
    d.polygon([(bx + 6, by + 35), (bx - 25, by + 65), (bx + 10, by + 70), (bx + 16, by + 35)], fill=(255, 245, 160))

    # TAXI HYUNDAI AMARILLO - Izquierda
    tx, ty, tw, th = 65, 150, 78, 48
    d.ellipse([tx - 6, ty + th - 8, tx + tw + 6, ty + th + 6], fill=(32, 22, 14))
    d.line([(tx - 2, ty + th - 4), (tx + tw + 2, ty + th - 4)], fill=(205, 190, 170), width=2)
    # Cuerpo amarillo sumergido
    d.rectangle([tx, ty + 14, tx + tw, ty + th], fill=(241, 196, 15), outline=(160, 130, 10))
    # Damero blanco y negro
    for cx in range(tx + 6, tx + tw - 6, 8):
        d.rectangle([cx, ty + 22, cx + 4, ty + 26], fill=(20, 20, 20))
        d.rectangle([cx + 4, ty + 22, cx + 8, ty + 26], fill=(255, 255, 255))
    # Cabina y ventanas
    d.polygon([(tx + 12, ty + 14), (tx + 22, ty + 4), (tx + tw - 16, ty + 4), (tx + tw - 8, ty + 14)], fill=(241, 196, 15))
    d.polygon([(tx + 16, ty + 13), (tx + 25, ty + 6), (tx + tw - 20, ty + 6), (tx + tw - 12, ty + 13)], fill=(44, 62, 80))
    # Letrero TAXI iluminado en el techo
    d.rectangle([tx + tw // 2 - 12, ty + 1, tx + tw // 2 + 12, ty + 6], fill=(255, 255, 255), outline=(30, 30, 30))
    d.text((tx + tw // 2 - 10, ty + 1), "TAXI", fill=(0, 0, 0))
    # Farolas bajo el agua
    d.ellipse([tx + 4, ty + 26, tx + 12, ty + 34], fill=(255, 255, 220))

    # CARRO BLANCO PARTICULAR - Derecha
    wx, wy, ww, wh = 340, 145, 70, 44
    d.ellipse([wx - 6, wy + wh - 8, wx + ww + 6, wy + wh + 6], fill=(32, 22, 14))
    d.line([(wx - 2, wy + wh - 4), (wx + ww + 2, wy + wh - 4)], fill=(195, 185, 165), width=2)
    d.rectangle([wx, wy + 13, wx + ww, wy + wh], fill=(245, 248, 252), outline=(165, 175, 185))
    d.polygon([(wx + 8, wy + 13), (wx + 18, wy + 4), (wx + ww - 14, wy + 4), (wx + ww - 6, wy + 13)], fill=(245, 248, 252))
    d.polygon([(wx + 12, wy + 12), (wx + 20, wy + 6), (wx + ww - 16, wy + 6), (wx + ww - 9, wy + 12)], fill=(44, 62, 80))
    # Estacionarias ámbar parpadeando
    d.ellipse([wx + 4, wy + 20, wx + 10, wy + 26], fill=(243, 156, 18))
    d.ellipse([wx + ww - 10, wy + 20, wx + ww - 4, wy + 26], fill=(243, 156, 18))

    return img


def draw_option_2_submerged_threshold(w=480, h=270):
    """
    OPCIÓN 2: VISTA DE UMBRAL / DESCENSO SUBTERRÁNEO (The Submerged Threshold)
    Vista desde la rampa exterior hacia la boca del soterrado donde el asfalto se hunde.
    Enfoque: Contraste dramático entre el exterior urbano y la entrada sumergida.
    """
    img = Image.new('RGB', (w, h), (25, 30, 38))
    d = ImageDraw.Draw(img)

    # 1. Cielo y terraza superior de Parques del Río
    d.rectangle([0, 0, w, 55], fill=(70, 95, 80))
    # Adoquines de la terraza
    d.rectangle([0, 35, w, 65], fill=(210, 205, 190))
    # Barandilla negra
    d.line([(0, 62), (w, 62)], fill=(20, 20, 25), width=3)
    for rx in range(0, w, 8):
        d.line([(rx, 52), (rx, 62)], fill=(30, 30, 35), width=1)
    # Arbustos y jardineras
    for jx in range(15, w - 20, 45):
        d.ellipse([jx, 40, jx + 35, 58], fill=(39, 174, 96))

    # 2. Dintel blanco del portal del viaducto
    lintel_y = 65
    lintel_h = 28
    d.rectangle([0, lintel_y, w, lintel_y + lintel_h], fill=(235, 240, 245), outline=(170, 175, 185))

    # Señalización de velocidad [60] y Gálibo 4.5m
    for sp in [70, 160, 250, 340, 420]:
        d.rectangle([sp - 14, lintel_y + 4, sp + 14, lintel_y + 24], fill=(15, 20, 25), outline=(60, 65, 75))
        d.text((sp - 8, lintel_y + 6), "60", fill=(46, 204, 113))
        d.ellipse([sp + 20, lintel_y + 5, sp + 36, lintel_y + 21], fill=(231, 76, 60), outline=(255, 255, 255))
        d.text((sp + 23, lintel_y + 6), "4.5", fill=(255, 255, 255))

    # 3. Boca del túnel inundada
    tunnel_y = lintel_y + lintel_h
    # Fondo oscuro del interior del túnel
    d.rectangle([0, tunnel_y, w, tunnel_y + 55], fill=(12, 14, 18))
    # Turbinas visibles en el techo interior
    for tx in [120, 240, 360]:
        d.ellipse([tx - 16, tunnel_y + 4, tx + 16, tunnel_y + 22], fill=(45, 52, 62), outline=(18, 20, 25))

    # 4. Masa de agua inundada que entra al túnel
    water_start_y = tunnel_y + 35
    for y in range(water_start_y, h - 35):
        t = (y - water_start_y) / float(h - 35 - water_start_y)
        r = int(55 + t * 60)
        g = int(38 + t * 42)
        b = int(22 + t * 20)
        d.line([(0, y), (w, y)], fill=(r, g, b))

    # Ondas de agua entrando hacia el túnel
    for y in range(water_start_y + 2, h - 35, 4):
        for x in range(0, w, 10):
            d.line([(x, y), (x + 5, y)], fill=(135, 102, 65), width=1)

    # Carros semisumergidos en la rampa de entrada
    # Taxi amarillo inclinado en el desnivel del agua
    d.polygon([(70, water_start_y + 10), (145, water_start_y + 10), (155, water_start_y + 48), (60, water_start_y + 48)], fill=(241, 196, 15))
    d.polygon([(82, water_start_y + 10), (95, water_start_y - 4), (135, water_start_y - 4), (142, water_start_y + 10)], fill=(44, 62, 80))
    d.rectangle([105, water_start_y - 8, 125, water_start_y - 4], fill=(255, 255, 255))
    d.text((107, water_start_y - 8), "TAXI", fill=(0, 0, 0))

    # Bus Coometropol sumergido más profundo en el centro
    d.rectangle([200, water_start_y - 12, 305, water_start_y + 40], fill=(235, 240, 245), outline=(160, 170, 180))
    d.rectangle([200, water_start_y + 12, 305, water_start_y + 20], fill=(39, 174, 96)) # Franja verde
    d.rectangle([220, water_start_y - 10, 285, water_start_y - 2], fill=(15, 20, 18))
    d.text((225, water_start_y - 9), "CIRCULAR SUR", fill=(46, 204, 113))

    # 5. Rampa seca en primer plano con rejilla de sumidero desbordada
    fg_y = h - 35
    d.rectangle([0, fg_y, w, fg_y + 10], fill=(25, 28, 35))
    for gx in range(0, w, 5):
        d.line([(gx, fg_y), (gx, fg_y + 8)], fill=(12, 14, 18), width=2)
    # Agua rebosándose por la rejilla con espuma
    for fx in range(0, w, 4):
        d.line([(fx, fg_y - 2), (fx + 3, fg_y + 3)], fill=(215, 210, 195), width=1)
    # Asfalto seco inferior
    d.rectangle([0, fg_y + 10, w, h], fill=(45, 50, 58))
    # Flecha blanca pintada
    d.polygon([(w // 2 - 10, fg_y + 16), (w // 2 + 10, fg_y + 16), (w // 2, fg_y + 28)], fill=(230, 235, 240))

    return img


def draw_option_3_arcade_side_stage(w=480, h=270):
    """
    OPCIÓN 3: VISTA LATERAL 2.5D / ARCADE STAGE (Stage Layout Estilo Final Fight / Street Fighter)
    Corte transversal lateral donde se aprecian los vehículos alineados como plataformas de parkour.
    Enfoque: Claridad geométrica para juego de plataformas, legibilidad de siluetas arcade.
    """
    img = Image.new('RGB', (w, h), (18, 16, 26))
    d = ImageDraw.Draw(img)

    # 1. Techo y vigas horizontales superiores
    d.rectangle([0, 0, w, 32], fill=(32, 38, 48))
    for vx in range(0, w, 60):
        d.rectangle([vx, 0, vx + 12, 32], fill=(22, 26, 34))
    # Tuberías industriales y bandejas de cables
    d.line([(0, 36), (w, 36)], fill=(192, 57, 43), width=4) # Tubería contra incendios roja
    d.line([(0, 44), (w, 44)], fill=(241, 196, 15), width=2) # Tubería de gas amarilla
    # Lámparas fluorescentes horizontales
    for lx in range(25, w, 90):
        d.rectangle([lx, 46, lx + 45, 52], fill=(255, 255, 230))
        d.ellipse([lx - 10, 44, lx + 55, 58], fill=(255, 240, 150))

    # 2. Pared de fondo del soterrado con paneles acústicos verticales
    for px in range(0, w, 16):
        d.rectangle([px, 54, px + 14, 165], fill=(42, 48, 58))
        d.line([(px + 15, 54), (px + 15, 165)], fill=(20, 24, 30), width=1)
    # Franjas de advertencia amarillas y negras en la base de la pared
    for hx in range(0, w, 20):
        d.polygon([(hx, 150), (hx + 10, 150), (hx + 4, 165), (hx - 6, 165)], fill=(241, 196, 15))
        d.polygon([(hx + 10, 150), (hx + 20, 150), (hx + 14, 165), (hx + 4, 165)], fill=(20, 20, 20))
    # Caja de alarma y extintor
    d.rectangle([110, 85, 126, 115], fill=(231, 76, 60), outline=(120, 20, 15))
    d.text((112, 90), "SOS", fill=(255, 255, 255))

    # 3. Nivel del agua turbia inundada (Línea horizontal a y=165)
    water_y = 165
    for y in range(water_y, h):
        t = (y - water_y) / float(h - water_y)
        d.line([(0, y), (w, y)], fill=(int(60 + t * 50), int(42 + t * 35), int(25 + t * 20)))

    # Ondas y reflejos en la superficie del agua
    for y in range(water_y + 2, h, 4):
        for x in range(0, w, 10):
            d.line([(x, y), (x + 6, y)], fill=(145, 110, 72), width=1)

    # 4. VEHÍCULOS COMO PLATAFORMAS (Corte lateral arcade)

    # VEHÍCULO 1: TAXI HYUNDAI AMARILLO (Izquierda - Plataforma media)
    tx, ty, tw, th = 30, 130, 95, 60
    # Plataforma de techo
    d.rectangle([tx + 20, ty, tx + tw - 20, ty + 12], fill=(241, 196, 15), outline=(160, 130, 10))
    d.line([(tx + 20, ty), (tx + tw - 20, ty)], fill=(255, 245, 180), width=2) # Borde de salto
    d.rectangle([tx + 40, ty - 6, tx + 65, ty], fill=(255, 255, 255)) # Letrero TAXI
    d.text((tx + 44, ty - 6), "TAXI", fill=(0, 0, 0))
    # Carrocería sumergida
    d.polygon([(tx, ty + 25), (tx + 20, ty + 12), (tx + tw - 20, ty + 12), (tx + tw, ty + 25), (tx + tw, ty + th), (tx, ty + th)], fill=(241, 196, 15))
    # Damero
    for cx in range(tx + 4, tx + tw - 4, 8):
        d.rectangle([cx, ty + 28, cx + 4, ty + 34], fill=(20, 20, 20))
        d.rectangle([cx + 4, ty + 28, cx + 8, ty + 34], fill=(255, 255, 255))
    # Espuma de agua alrededor
    d.line([(tx - 6, water_y), (tx + tw + 6, water_y)], fill=(205, 195, 175), width=2)

    # VEHÍCULO 2: BUS COOMETROPOL (Centro - Plataforma alta y larga)
    bx, by, bw, bh = 150, 95, 185, 95
    # Techo largo y elevado del bus (ideal para esprintar)
    d.rectangle([bx + 8, by, bx + bw - 8, by + 16], fill=(220, 228, 235), outline=(160, 170, 180))
    d.line([(bx + 8, by), (bx + bw - 8, by)], fill=(255, 255, 255), width=3) # Plataforma blanca
    # Letrero LED verde [CIRCULAR SUR 302]
    d.rectangle([bx + 45, by + 3, bx + 140, by + 12], fill=(15, 20, 18))
    d.text((bx + 55, by + 3), "CIRCULAR SUR", fill=(46, 204, 113))
    # Ventanas de pasajeros
    d.rectangle([bx + 4, by + 16, bx + bw - 4, by + 45], fill=(235, 240, 245))
    for wx in range(bx + 10, bx + bw - 20, 26):
        d.rectangle([wx, by + 20, wx + 20, by + 38], fill=(44, 62, 80))
    # Franja verde y cuerpo inferior sumergido
    d.rectangle([bx, by + 45, bx + bw, by + 55], fill=(39, 174, 96)) # Franja verde
    d.rectangle([bx, by + 55, bx + bw, by + bh], fill=(35, 75, 110)) # Azul marino
    d.line([(bx - 8, water_y), (bx + bw + 8, water_y)], fill=(205, 195, 175), width=3)

    # VEHÍCULO 3: CARRO PARTICULAR BLANCO (Derecha - Plataforma corta)
    sx, sy, sw, sh = 360, 138, 85, 55
    d.rectangle([sx + 15, sy, sx + sw - 15, sy + 10], fill=(245, 248, 252), outline=(165, 175, 185))
    d.line([(sx + 15, sy), (sx + sw - 15, sy)], fill=(255, 255, 255), width=2)
    d.polygon([(sx, sy + 22), (sx + 15, sy + 10), (sx + sw - 15, sy + 10), (sx + sw, sy + 22), (sx + sw, sy + sh), (sx, sy + sh)], fill=(245, 248, 252))
    # Luces estacionarias ámbar parpadeando
    d.ellipse([sx + 2, sy + 25, sx + 8, sy + 31], fill=(243, 156, 18))
    d.ellipse([sx + sw - 8, sy + 25, sx + sw - 2, sy + 31], fill=(243, 156, 18))
    d.line([(sx - 6, water_y), (sx + sw + 6, water_y)], fill=(205, 195, 175), width=2)

    return img


def draw_option_4_props_breakdown(w=480, h=270):
    """
    OPCIÓN 4: DESPIECE DE PROPS & PALETA DE COLOR ARCADE (Environment Assets Sheet)
    Estudio detallado de los objetos urbanos paisas individuales y sus rampas de color.
    Enfoque: Hoja técnica de diseño de arte para entender la paleta y los modelos 16-bit.
    """
    img = Image.new('RGB', (w, h), (12, 10, 18))
    d = ImageDraw.Draw(img)

    # Cuadrícula técnica de fondo (blueprint oscuro)
    for x in range(0, w, 20):
        d.line([(x, 0), (x, h)], fill=(18, 16, 28))
    for y in range(0, h, 20):
        d.line([(0, y), (w, y)], fill=(18, 16, 28))

    # Título técnico
    d.rectangle([10, 8, w - 10, 26], fill=(20, 18, 32), outline=(241, 196, 15))
    d.text((16, 11), "ENVIRONMENT SHEET: SOTERRADO DE MEDELLÍN (CPS-3 / NEO GEO)", fill=(241, 196, 15))

    # PROP 1: BUS COOMETROPOL (Isolado)
    b_box = [15, 34, 235, 130]
    d.rectangle(b_box, fill=(16, 14, 24), outline=(52, 152, 219))
    d.text((20, 38), "PROP A: BUS COOMETROPOL (CIRCULAR SUR)", fill=(52, 152, 219))
    # Bus pixel art
    bx, by, bw, bh = 25, 58, 190, 62
    d.rectangle([bx, by + 6, bx + bw, by + 16], fill=(215, 222, 230))
    d.rectangle([bx + 40, by + 8, bx + 150, by + 15], fill=(15, 20, 18))
    d.text((bx + 50, by + 8), "CIRCULAR SUR", fill=(46, 204, 113))
    d.rectangle([bx, by + 16, bx + bw, by + 34], fill=(235, 240, 245))
    for wx in range(bx + 8, bx + bw - 15, 24):
        d.rectangle([wx, by + 19, wx + 18, by + 30], fill=(44, 62, 80))
    d.rectangle([bx, by + 34, bx + bw, by + 42], fill=(39, 174, 96)) # Franja verde
    d.rectangle([bx, by + 42, bx + bw, by + bh], fill=(35, 75, 110)) # Azul marino
    # Línea de agua turbia
    d.line([(bx - 5, by + 48), (bx + bw + 5, by + 48)], fill=(140, 105, 65), width=2)

    # PROP 2: TAXI HYUNDAI AMARILLO (Isolado)
    t_box = [245, 34, 465, 130]
    d.rectangle(t_box, fill=(16, 14, 24), outline=(241, 196, 15))
    d.text((250, 38), "PROP B: TAXI HYUNDAI DE MEDELLÍN", fill=(241, 196, 15))
    # Taxi pixel art
    tx, ty, tw, th = 265, 60, 120, 58
    d.rectangle([tx + 25, ty, tx + tw - 25, ty + 14], fill=(241, 196, 15))
    d.rectangle([tx + 45, ty - 6, tx + 75, ty], fill=(255, 255, 255))
    d.text((tx + 50, ty - 6), "TAXI", fill=(0, 0, 0))
    d.polygon([(tx, ty + 24), (tx + 25, ty + 14), (tx + tw - 25, ty + 14), (tx + tw, ty + 24), (tx + tw, ty + th), (tx, ty + th)], fill=(241, 196, 15))
    for cx in range(tx + 6, tx + tw - 6, 8):
        d.rectangle([cx, ty + 28, cx + 4, ty + 33], fill=(20, 20, 20))
        d.rectangle([cx + 4, ty + 28, cx + 8, ty + 33], fill=(255, 255, 255))
    d.line([(tx - 5, ty + 42), (tx + tw + 5, ty + 42)], fill=(140, 105, 65), width=2)

    # PROP 3: TURBINA AXIAL DE VENTILACIÓN
    turb_box = [15, 136, 160, 260]
    d.rectangle(turb_box, fill=(16, 14, 24), outline=(46, 204, 113))
    d.text((20, 140), "TURBINA AXIAL DE TECHO", fill=(46, 204, 113))
    # Turbina detallada
    d.line([(85, 155), (85, 175)], fill=(60, 65, 75), width=3)
    d.ellipse([50, 175, 120, 235], fill=(50, 58, 68), outline=(20, 24, 30), width=2)
    d.ellipse([58, 183, 112, 227], fill=(18, 20, 26))
    d.ellipse([80, 200, 90, 210], fill=(160, 175, 190))
    d.arc([50, 175, 120, 235], 0, 360, fill=(241, 196, 15), width=2)

    # PROP 4: SEÑALÉTICA VIAL Y GÁLIBO
    sign_box = [168, 136, 315, 260]
    d.rectangle(sign_box, fill=(16, 14, 24), outline=(231, 76, 60))
    d.text((172, 140), "SEÑALIZACIÓN Y GÁLIBO", fill=(231, 76, 60))
    # Avisos [60] y 4.5m
    d.rectangle([180, 165, 230, 205], fill=(15, 20, 25), outline=(60, 65, 75), width=2)
    d.text((195, 175), "60", fill=(46, 204, 113))
    d.ellipse([250, 165, 290, 205], fill=(231, 76, 60), outline=(255, 255, 255), width=2)
    d.text((258, 175), "4.5m", fill=(255, 255, 255))
    d.text((175, 220), "Máx 60 km/h • Gálibo 4.5m", fill=(200, 205, 215))

    # PROP 5: COLOR RAMPS (Paleta oficial CPS-3)
    ramp_box = [323, 136, 465, 260]
    d.rectangle(ramp_box, fill=(16, 14, 24), outline=(155, 89, 182))
    d.text((328, 140), "PALETAS ARCADE 16-BIT", fill=(155, 89, 182))

    ramps = [
        ("Agua Turbia", [(35, 20, 12), (68, 40, 20), (110, 68, 35), (155, 105, 55), (200, 150, 90)]),
        ("Taxi Amarillo", [(60, 40, 5), (120, 80, 10), (190, 135, 15), (241, 196, 15), (255, 235, 120)]),
        ("Concreto Túnel", [(25, 30, 38), (45, 52, 62), (75, 85, 98), (115, 125, 140), (170, 180, 195)]),
        ("Neón LED", [(15, 60, 30), (25, 120, 55), (46, 204, 113), (120, 235, 160), (200, 255, 220)])
    ]
    for r_idx, (r_name, cols) in enumerate(ramps):
        ry = 160 + r_idx * 24
        d.text((328, ry), r_name[:10], fill=(200, 205, 215))
        for c_idx, col in enumerate(cols):
            d.rectangle([395 + c_idx * 13, ry, 395 + c_idx * 13 + 11, ry + 12], fill=col)

    return img


def build_all_environment_assets():
    art_dir = r"C:\Users\Juanse\.gemini\antigravity\brain\865358c9-b025-436e-b613-f8eea032a59a"
    os.makedirs(art_dir, exist_ok=True)
    os.makedirs('assets', exist_ok=True)

    # Generate 4 options at 480x270, then upscale 2x to 960x540 for crystal clear pixel viewing
    opt1_raw = draw_option_1_interior_depth(480, 270)
    opt1_hd = opt1_raw.resize((960, 540), Image.Resampling.NEAREST)
    opt1_hd.save(os.path.join(art_dir, 'env_option_1_interior_depth.png'))
    print("Generated env_option_1_interior_depth.png")

    opt2_raw = draw_option_2_submerged_threshold(480, 270)
    opt2_hd = opt2_raw.resize((960, 540), Image.Resampling.NEAREST)
    opt2_hd.save(os.path.join(art_dir, 'env_option_2_submerged_threshold.png'))
    print("Generated env_option_2_submerged_threshold.png")

    opt3_raw = draw_option_3_arcade_side_stage(480, 270)
    opt3_hd = opt3_raw.resize((960, 540), Image.Resampling.NEAREST)
    opt3_hd.save(os.path.join(art_dir, 'env_option_3_arcade_side_stage.png'))
    print("Generated env_option_3_arcade_side_stage.png")

    opt4_raw = draw_option_4_props_breakdown(480, 270)
    opt4_hd = opt4_raw.resize((960, 540), Image.Resampling.NEAREST)
    opt4_hd.save(os.path.join(art_dir, 'env_option_4_props_breakdown.png'))
    print("Generated env_option_4_props_breakdown.png")

    # ASSEMBLE MASTER ENVIRONMENT SHEET (2x2 Grid: 1320 x 860 px)
    sheet_w, sheet_h = 1320, 860
    sheet = Image.new('RGB', (sheet_w, sheet_h), (10, 8, 16))
    d_sh = ImageDraw.Draw(sheet)

    # Master Header
    d_sh.rectangle([0, 0, sheet_w, 60], fill=(16, 12, 26))
    d_sh.line([(0, 60), (sheet_w, 60)], fill=(241, 196, 15), width=3)

    font_title = ImageFont.truetype(r"C:\Windows\Fonts\impact.ttf", 26)
    font_sub = ImageFont.truetype(r"C:\Windows\Fonts\tahomabd.ttf", 12)
    font_panel = ImageFont.truetype(r"C:\Windows\Fonts\tahomabd.ttf", 13)

    d_sh.text((sheet_w // 2, 10), "ENVIRONMENT SHEET: EL SOTERRADO DE MEDELLÍN (ESTILO ARCADE AÑOS 90)", fill=(241, 196, 15), font=font_title, anchor="mt")
    d_sh.text((sheet_w // 2, 38), "Exploración de Dirección de Arte y Opciones de Escenario (Capcom CPS-2 / CPS-3 / Neo Geo)", fill=(46, 204, 113), font=font_sub, anchor="mt")

    # Grid 2x2: each quadrant 620 x 360 px
    qw, qh = 620, 360
    grid = [
        # (img, x, y, label, border_color)
        (opt1_raw, 25, 80, "OPCIÓN 1: VISTA INTERIOR PROFUNDA (THE FLOODED CATACOMB)", (52, 152, 219)),
        (opt2_raw, 675, 80, "OPCIÓN 2: VISTA DE UMBRAL / DESCENSO (THE SUBMERGED THRESHOLD)", (241, 196, 15)),
        (opt3_raw, 25, 470, "OPCIÓN 3: VISTA LATERAL 2.5D / ARCADE STAGE (PLATFORM RUNNER)", (46, 204, 113)),
        (opt4_raw, 675, 470, "OPCIÓN 4: DESPIECE DE PROPS & COLOR RAMPS (ASSETS SHEET)", (155, 89, 182))
    ]

    for im, gx, gy, label, col in grid:
        # Resize to fit quadrant
        q_img = im.resize((qw, qh), Image.Resampling.NEAREST)
        sheet.paste(q_img, (gx, gy))
        d_sh.rectangle([gx - 2, gy - 2, gx + qw + 2, gy + qh + 2], outline=col, width=2)
        # Header banner
        d_sh.rectangle([gx, gy - 20, gx + qw, gy], fill=col)
        d_sh.text((gx + 12, gy - 16), label, fill=(0, 0, 0), font=font_panel)

    master_path = os.path.join(art_dir, 'environment_sheet_soterrado_medellin.png')
    sheet.save(master_path, quality=95)
    print(f"Master Environment Sheet saved to {master_path}")

if __name__ == '__main__':
    build_all_environment_assets()
