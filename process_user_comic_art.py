# -*- coding: utf-8 -*-
import os
from PIL import Image, ImageDraw, ImageFont

def process_user_comic():
    art_dir = r"C:\Users\Juanse\.gemini\antigravity\brain\865358c9-b025-436e-b613-f8eea032a59a"
    img1_path = os.path.join(art_dir, ".user_uploaded", "media_1793517860179_1046b862.jpg")
    img2_path = os.path.join(art_dir, ".user_uploaded", "media_1793517865939_6a90da16.jpg")

    im1 = Image.open(img1_path).convert('RGB')
    im2 = Image.open(img2_path).convert('RGB')

    # Native game resolution
    GW, GH = 640, 360

    font_impact_28 = ImageFont.truetype(r"C:\Windows\Fonts\impact.ttf", 28)
    font_impact_22 = ImageFont.truetype(r"C:\Windows\Fonts\impact.ttf", 22)
    font_impact_16 = ImageFont.truetype(r"C:\Windows\Fonts\impact.ttf", 16)
    font_tahoma_12 = ImageFont.truetype(r"C:\Windows\Fonts\tahomabd.ttf", 12)
    font_tahoma_10 = ImageFont.truetype(r"C:\Windows\Fonts\tahomabd.ttf", 10)

    # -------------------------------------------------------------
    # 1. GAME ASSET: PANEL 1 (AFUERA DEL SOTERRADO)
    # -------------------------------------------------------------
    # Scale image 1 crisply to 640x360
    p1_game = Image.new('RGB', (GW, GH), (12, 10, 18))
    im1_scaled = im1.resize((640, 357), Image.Resampling.LANCZOS)
    p1_game.paste(im1_scaled, (0, 1))

    d1 = ImageDraw.Draw(p1_game)
    # Yellow comic caption box in top-left
    d1.rectangle([12, 12, 12 + 360, 12 + 30], fill=(241, 196, 15), outline=(10, 10, 10), width=2)
    d1.text((20, 15), "AFUERA: VIADUCTO DE PARQUES DEL RÍO", fill=(10, 10, 10), font=font_impact_16)

    # Bottom caption box
    d1.rectangle([12, GH - 38, GW - 12, GH - 10], fill=(12, 14, 24), outline=(52, 152, 219), width=2)
    d1.text((20, GH - 34), "La tarde cae sobre Medellín. Sobre el viaducto la gente pasea en el parque,", fill=(255, 255, 255), font=font_tahoma_10)
    d1.text((20, GH - 22), "mientras los carros descienden por la Autopista Sur hacia el soterrado...", fill=(241, 196, 15), font=font_tahoma_10)

    p1_game.save('assets/comic_soterrado_1_exterior.png')
    p1_game.save(os.path.join(art_dir, 'comic_soterrado_1_exterior.png'))
    print("Saved comic_soterrado_1_exterior.png")

    # -------------------------------------------------------------
    # 2. GAME ASSET: PANEL 2 ("MIENTRAS TANTO EN EL SOTERRADO...")
    # -------------------------------------------------------------
    p2_game = Image.new('RGB', (GW, GH), (10, 8, 18))
    d2 = ImageDraw.Draw(p2_game)

    # Halftone background dots
    for x in range(0, GW, 8):
        for y in range(0, GH, 8):
            d2.point((x + (y % 16 == 0) * 4, y), fill=(30, 24, 48))

    # Comic radiating action rays
    cx, cy = GW // 2, GH // 2
    for angle in range(0, 360, 10):
        rad = (angle * 3.141592) / 180.0
        import math
        x1 = cx + math.cos(rad) * 160
        y1 = cy + math.sin(rad) * 100
        x2 = cx + math.cos(rad) * 400
        y2 = cy + math.sin(rad) * 260
        d2.line([(x1, y1), (x2, y2)], fill=(48, 36, 75), width=2)

    # Vintage comic card frame
    card_w, card_h = 540, 250
    card_x = (GW - card_w) // 2
    card_y = (GH - card_h) // 2 - 8

    d2.rectangle([card_x - 6, card_y - 6, card_x + card_w + 6, card_y + card_h + 6], fill=(0, 0, 0))
    d2.rectangle([card_x, card_y, card_x + card_w, card_y + card_h], fill=(16, 12, 30), outline=(241, 196, 15), width=3)
    d2.rectangle([card_x + 6, card_y + 6, card_x + card_w - 6, card_y + card_h - 6], outline=(231, 76, 60), width=1)

    # Giant Yellow Comic Caption Box: "MIENTRAS TANTO EN EL SOTERRADO..."
    box_w, box_h = 460, 62
    box_x = (GW - box_w) // 2
    box_y = card_y + 24
    # Shadow
    d2.rectangle([box_x + 6, box_y + 6, box_x + box_w + 6, box_y + box_h + 6], fill=(10, 10, 10))
    # Box
    d2.rectangle([box_x, box_y, box_x + box_w, box_y + box_h], fill=(241, 196, 15), outline=(10, 10, 10), width=3)
    d2.text((GW // 2, box_y + 14), "MIENTRAS TANTO, EN EL SOTERRADO...", fill=(10, 10, 10), font=font_impact_22, anchor="mt")

    # Narrative text
    d2.text((GW // 2, box_y + 82), "A pocos metros de allí, bajo la mole de concreto de la Autopista Sur,", fill=(255, 255, 255), font=font_tahoma_12, anchor="mt")
    d2.text((GW // 2, box_y + 104), "las fuertes lluvias torrenciales del Valle colapsaban el drenaje...", fill=(241, 196, 15), font=font_tahoma_12, anchor="mt")

    # Comic sound effect balloons
    b1_x, b1_y = card_x + 40, card_y + card_h - 68
    d2.rectangle([b1_x, b1_y, b1_x + 180, b1_y + 36], fill=(52, 152, 219), outline=(10, 10, 10), width=2)
    d2.text((b1_x + 90, b1_y + 8), "🌊 * GLUB... GLUB... *", fill=(255, 255, 255), font=font_impact_16, anchor="mt")

    b2_x, b2_y = card_x + card_w - 220, card_y + card_h - 68
    d2.rectangle([b2_x, b2_y, b2_x + 180, b2_y + 36], fill=(231, 76, 60), outline=(10, 10, 10), width=2)
    d2.text((b2_x + 90, b2_y + 8), "🚗 * ¡¡PIII-PIIIII!! *", fill=(255, 255, 255), font=font_impact_16, anchor="mt")

    # Advance button
    d2.rectangle([GW // 2 - 140, GH - 28, GW // 2 + 140, GH - 6], fill=(241, 196, 15), outline=(255, 255, 255), width=1)
    d2.text((GW // 2, GH - 25), "▶ [ESPACIO / ENTER / CLICK] CONTINUAR", fill=(10, 10, 10), font=font_tahoma_10, anchor="mt")

    p2_game.save('assets/comic_soterrado_2_mientras_tanto.png')
    p2_game.save(os.path.join(art_dir, 'comic_soterrado_2_mientras_tanto.png'))
    print("Saved comic_soterrado_2_mientras_tanto.png")

    # -------------------------------------------------------------
    # 3. GAME ASSET: PANEL 3 (ADENTRO DEL SOTERRADO INUNDADO)
    # -------------------------------------------------------------
    p3_game = Image.new('RGB', (GW, GH), (12, 10, 18))
    im2_scaled = im2.resize((640, 357), Image.Resampling.LANCZOS)
    p3_game.paste(im2_scaled, (0, 1))

    d3 = ImageDraw.Draw(p3_game)
    # Red comic caption box in top-left
    d3.rectangle([12, 12, 12 + 390, 12 + 30], fill=(231, 76, 60), outline=(10, 10, 10), width=2)
    d3.text((20, 15), "¡EL SOTERRADO ESTÁ COMPLETAMENTE INUNDADO!", fill=(255, 255, 255), font=font_impact_16)

    # Bottom caption box
    d3.rectangle([12, GH - 38, GW - 12, GH - 10], fill=(12, 14, 24), outline=(241, 196, 15), width=2)
    d3.text((20, GH - 34), "¡Más de dos metros de agua turbia! Motociclistas varados en la orilla,", fill=(255, 255, 255), font=font_tahoma_10)
    d3.text((20, GH - 22), "el bus Coometropol y los carros atascados entre olas y luces de emergencia...", fill=(241, 196, 15), font=font_tahoma_10)

    p3_game.save('assets/comic_soterrado_3_inundado.png')
    p3_game.save(os.path.join(art_dir, 'comic_soterrado_3_inundado.png'))
    print("Saved comic_soterrado_3_inundado.png")

    # -------------------------------------------------------------
    # 4. MASTER COMIC STRIP SPREAD (1280 x 720 PX)
    # Presentación editorial tipo página completa de cómic arcade
    # -------------------------------------------------------------
    SW, SH = 1280, 720
    spread = Image.new('RGB', (SW, SH), (10, 8, 16))
    ds = ImageDraw.Draw(spread)

    # Header
    ds.rectangle([0, 0, SW, 56], fill=(16, 12, 26))
    ds.line([(0, 56), (SW, 56)], fill=(241, 196, 15), width=2)
    ds.text((SW // 2, 8), "TRANSICIÓN CÓMIC: EL SOTERRADO DE MEDELLÍN", fill=(241, 196, 15), font=font_impact_28, anchor="mt")
    ds.text((SW // 2, 36), "Ilustraciones Pixel Art 16-Bit Oficiales & Secuencia Narrativa Entre Niveles", fill=(46, 204, 113), font=font_tahoma_12, anchor="mt")

    # Panel 1 (Top Left): 600 x 300
    p1_thumb = im1.resize((600, 300), Image.Resampling.LANCZOS)
    spread.paste(p1_thumb, (25, 75))
    ds.rectangle([23, 73, 627, 377], outline=(52, 152, 219), width=2)
    # Caption box
    ds.rectangle([30, 82, 350, 108], fill=(241, 196, 15), outline=(10, 10, 10), width=2)
    ds.text((36, 85), "AFUERA: PARQUES DEL RÍO (ATARDECER)", fill=(10, 10, 10), font=font_impact_16)

    # Panel 2 (Center Ribbon): "MIENTRAS TANTO EN EL SOTERRADO..."
    ribbon_w = 580
    rx = 675
    ds.rectangle([rx, 75, rx + ribbon_w, 200], fill=(18, 14, 32), outline=(241, 196, 15), width=3)
    ds.rectangle([rx + 4, 79, rx + ribbon_w - 4, 196], outline=(231, 76, 60), width=1)
    # Yellow banner
    ds.rectangle([rx + 30, 92, rx + ribbon_w - 30, 140], fill=(241, 196, 15), outline=(10, 10, 10), width=3)
    ds.text((rx + ribbon_w // 2, 102), "MIENTRAS TANTO, EN EL SOTERRADO...", fill=(10, 10, 10), font=font_impact_22, anchor="mt")
    ds.text((rx + ribbon_w // 2, 155), "Bajo la Autopista Sur, las fuertes lluvias torrenciales", fill=(255, 255, 255), font=font_tahoma_12, anchor="mt")
    ds.text((rx + ribbon_w // 2, 175), "inundaban el viaducto convirtiéndolo en un lago turbio...", fill=(241, 196, 15), font=font_tahoma_12, anchor="mt")

    # Sound effects balloons beside ribbon
    ds.rectangle([rx + 30, 212, rx + 270, 252], fill=(52, 152, 219), outline=(10, 10, 10), width=2)
    ds.text((rx + 150, 222), "🌊 * GLUB... GLUB... *", fill=(255, 255, 255), font=font_impact_16, anchor="mt")
    ds.rectangle([rx + 310, 212, rx + ribbon_w - 30, 252], fill=(231, 76, 60), outline=(10, 10, 10), width=2)
    ds.text((rx + 430, 222), "🚗 * ¡¡PIII-PIIIII!! *", fill=(255, 255, 255), font=font_impact_16, anchor="mt")

    # Panel 3 (Bottom): 1230 x 400 (or Full width lower panel)
    p2_thumb = im2.resize((1230, 390), Image.Resampling.LANCZOS)
    spread.paste(p2_thumb, (25, 290))
    ds.rectangle([23, 288, 1257, 682], outline=(231, 76, 60), width=3)
    # Red Warning Caption
    ds.rectangle([35, 300, 460, 330], fill=(231, 76, 60), outline=(10, 10, 10), width=2)
    ds.text((45, 304), "¡EL SOTERRADO ESTÁ COMPLETAMENTE INUNDADO!", fill=(255, 255, 255), font=font_impact_16)

    # Lower narrative bar
    ds.rectangle([35, 638, 1245, 670], fill=(12, 10, 22), outline=(241, 196, 15), width=2)
    ds.text((45, 646), "Los motociclistas contemplan atónitos el caudal. El bus Coometropol y los taxis flotan atrapados en el agua café con leche...", fill=(255, 255, 255), font=font_tahoma_12)

    master_spread_path = os.path.join(art_dir, "showcase_comic_soterrado_final.png")
    spread.save(master_spread_path, quality=95)
    print(f"Master comic spread saved to {master_spread_path}")

if __name__ == '__main__':
    process_user_comic()
