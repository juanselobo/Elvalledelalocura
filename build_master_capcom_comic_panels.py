# -*- coding: utf-8 -*-
import os
import math
import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageDraw, ImageFont

def process_capcom_layer(image_path, target_w=300, num_colors=36, sigma_s=50, sigma_r=0.42):
    bgr = cv2.imread(image_path)
    h, w = bgr.shape[:2]
    aspect = h / float(w)
    target_h = int(target_w * aspect)

    # 1. Bilateral & Edge-preserving cell filter
    smoothed = cv2.edgePreservingFilter(bgr, flags=cv2.RECURS_FILTER, sigma_s=sigma_s, sigma_r=sigma_r)
    bilateral = cv2.bilateralFilter(smoothed, d=7, sigmaColor=85, sigmaSpace=85)

    # 2. Rich Arcade Contrast & Saturation Boost
    hsv = cv2.cvtColor(bilateral, cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[:, :, 1] = np.clip(hsv[:, :, 1] * 1.45, 0, 255) # Rich vivid saturation
    hsv[:, :, 2] = np.clip((hsv[:, :, 2] - 128) * 1.30 + 138, 0, 255) # High arcade contrast
    boosted = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)

    # 3. Clean Directional Canny Ink outlines
    gray = cv2.cvtColor(bilateral, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, threshold1=40, threshold2=120)
    kernel = np.ones((2, 2), np.uint8)
    edges_dil = cv2.dilate(edges, kernel, iterations=1)

    inked = boosted.copy()
    ink_color = np.array([16, 12, 22], dtype=np.uint8) # Dark indigo ink
    inked[edges_dil > 0] = (inked[edges_dil > 0] * 0.30 + ink_color * 0.70).astype(np.uint8)

    # 4. Downscale to genuine 16-bit arcade framebuffer
    rgb = cv2.cvtColor(inked, cv2.COLOR_BGR2RGB)
    pil_im = Image.fromarray(rgb)
    low_res = pil_im.resize((target_w, target_h), Image.Resampling.BOX)

    # 5. Quantize to Capcom CPS-3 palette with Floyd-Steinberg dither
    quantized = low_res.quantize(colors=num_colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)
    rgb_quant = quantized.convert('RGB')
    return rgb_quant, target_w, target_h

def build_capcom_comic_panels():
    art_dir = r"C:\Users\Juanse\.gemini\antigravity\brain\865358c9-b025-436e-b613-f8eea032a59a"
    img1_path = os.path.join(art_dir, ".user_uploaded", "media_1793512193574_958dc00d.png")
    img2_path = os.path.join(art_dir, ".user_uploaded", "media_1793512295833_9a3505ec.png")

    W, H = 640, 360

    font_impact_28 = ImageFont.truetype(r"C:\Windows\Fonts\impact.ttf", 28)
    font_impact_16 = ImageFont.truetype(r"C:\Windows\Fonts\impact.ttf", 16)
    font_tahoma_12 = ImageFont.truetype(r"C:\Windows\Fonts\tahomabd.ttf", 12)
    font_tahoma_10 = ImageFont.truetype(r"C:\Windows\Fonts\tahomabd.ttf", 10)

    # -------------------------------------------------------------
    # PANEL 1: AFUERA DEL SOTERRADO (Capcom CPS-3 Aesthetic)
    # -------------------------------------------------------------
    ext_quant, ew, eh = process_capcom_layer(img1_path, target_w=300, num_colors=38, sigma_s=45, sigma_r=0.40)

    # Hand-pixel embellishments on low-res layer before upscaling
    d_low = ImageDraw.Draw(ext_quant)
    # Embellish "Medellín AQUÍ TODO FLORECE" sign on terrace
    # Green wall sign at ~(118, 22, 142, 32)
    d_low.rectangle([115, 21, 145, 30], fill=(22, 120, 65), outline=(15, 60, 32))
    d_low.text((118, 21), "Medellin", fill=(255, 255, 255))
    d_low.text((117, 25), "FLORECE", fill=(240, 245, 230))
    # Embellish speed limit digital LED signs on tunnel lintel at ~(120-190, 78)
    for sp in [128, 148, 168, 188]:
        d_low.rectangle([sp, 76, sp + 9, 83], fill=(15, 20, 25), outline=(50, 55, 65))
        d_low.text((sp + 1, 76), "60", fill=(46, 204, 113))

    # Nearest-neighbor 2x pixel upscale to fit 590px width
    target_display_w = 590
    aspect = eh / float(ew)
    target_display_h = int(target_display_w * aspect)
    ext_scaled = ext_quant.resize((target_display_w, target_display_h), Image.Resampling.NEAREST)

    panel1 = Image.new('RGB', (W, H), (14, 12, 22))
    d1 = ImageDraw.Draw(panel1)

    # Halftone background
    for x in range(0, W, 8):
        for y in range(0, H, 8):
            d1.point((x + (y % 16 == 0) * 4, y), fill=(26, 22, 38))

    px1 = (W - target_display_w) // 2
    py1 = (H - target_display_h) // 2 - 8
    panel1.paste(ext_scaled, (px1, py1))

    # Bold retro comic frame
    d1.rectangle([px1 - 4, py1 - 4, px1 + target_display_w + 4, py1 + target_display_h + 4], outline=(15, 15, 20), width=4)
    d1.rectangle([px1 - 2, py1 - 2, px1 + target_display_w + 2, py1 + target_display_h + 2], outline=(241, 196, 15), width=2)

    # Yellow comic caption box
    d1.rectangle([px1 + 8, py1 + 8, px1 + 330, py1 + 36], fill=(241, 196, 15), outline=(10, 10, 10), width=2)
    d1.text((px1 + 16, py1 + 12), "AFUERA: EL SOTERRADO DE PARQUES DEL RÍO", fill=(10, 10, 10), font=font_impact_16)

    # Narrative caption
    d1.rectangle([px1 + 8, py1 + target_display_h - 32, px1 + target_display_w - 8, py1 + target_display_h - 8], fill=(15, 18, 28), outline=(52, 152, 219), width=2)
    d1.text((px1 + 16, py1 + target_display_h - 28), "Bajo la terraza peatonal, los vehículos ingresan a la penumbra del viaducto...", fill=(255, 255, 255), font=font_tahoma_10)

    # Button
    d1.rectangle([W // 2 - 140, H - 24, W // 2 + 140, H - 4], fill=(241, 196, 15), outline=(255, 255, 255), width=1)
    d1.text((W // 2, H - 21), "▶ [ESPACIO / ENTER / CLICK] CONTINUAR", fill=(10, 10, 10), font=font_tahoma_10, anchor="mt")

    panel1.save('assets/comic_soterrado_1_exterior.png')
    panel1.save(os.path.join(art_dir, 'comic_soterrado_1_exterior.png'))
    print("Saved Capcom CPS-3 Panel 1")


    # -------------------------------------------------------------
    # PANEL 2: "MIENTRAS TANTO..." (Vintage Comic Transition Card)
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

    panel2.save('assets/comic_soterrado_2_mientras_tanto.png')
    panel2.save(os.path.join(art_dir, 'comic_soterrado_2_mientras_tanto.png'))
    print("Saved Panel 2")


    # -------------------------------------------------------------
    # PANEL 3: ADENTRO DEL SOTERRADO INUNDADO (Capcom CPS-3 Aesthetic)
    # -------------------------------------------------------------
    int_quant, iw, ih = process_capcom_layer(img2_path, target_w=300, num_colors=38, sigma_s=45, sigma_r=0.40)

    # Hand-pixel embellishments on low-res layer before upscaling
    d_low3 = ImageDraw.Draw(int_quant)
    # Embellish Coometropol bus route sign at ~(145, 54, 168, 60)
    d_low3.rectangle([142, 53, 166, 58], fill=(15, 20, 18), outline=(40, 45, 50))
    d_low3.text((144, 53), "CIRCULAR", fill=(46, 204, 113))
    # Embellish headlights of white car at ~(260, 68)
    d_low3.ellipse([258, 66, 264, 71], fill=(255, 255, 220))
    # Embellish amber hazard flashers
    d_low3.point((256, 65), fill=(243, 156, 18))
    d_low3.point((274, 65), fill=(243, 156, 18))
    # Embellish illuminated fluorescent tubes in ceiling
    for p1, p2 in [([(65, 0), (135, 45)]), ([(195, 0), (155, 45)])]:
        d_low3.line([p1, p2], fill=(255, 255, 230), width=1)

    target_display_w3 = 590
    aspect3 = ih / float(iw)
    target_display_h3 = int(target_display_w3 * aspect3)
    int_scaled = int_quant.resize((target_display_w3, target_display_h3), Image.Resampling.NEAREST)

    panel3 = Image.new('RGB', (W, H), (14, 12, 22))
    d3 = ImageDraw.Draw(panel3)

    for x in range(0, W, 8):
        for y in range(0, H, 8):
            d3.point((x + (y % 16 == 0) * 4, y), fill=(26, 22, 38))

    px3 = (W - target_display_w3) // 2
    py3 = (H - target_display_h3) // 2 - 8
    panel3.paste(int_scaled, (px3, py3))

    d3.rectangle([px3 - 4, py3 - 4, px3 + target_display_w3 + 4, py3 + target_display_h3 + 4], outline=(15, 15, 20), width=4)
    d3.rectangle([px3 - 2, py3 - 2, px3 + target_display_w3 + 2, py3 + target_display_h3 + 2], outline=(231, 76, 60), width=2)

    # Red comic caption box
    d3.rectangle([px3 + 8, py3 + 8, px3 + 370, py3 + 36], fill=(231, 76, 60), outline=(10, 10, 10), width=2)
    d3.text((px3 + 16, py3 + 12), "¡EL SOTERRADO ESTÁ COMPLETAMENTE INUNDADO!", fill=(255, 255, 255), font=font_impact_16)

    # Narrative caption
    d3.rectangle([px3 + 8, py3 + target_display_h3 - 32, px3 + target_display_w3 - 8, py3 + target_display_h3 - 8], fill=(15, 18, 28), outline=(241, 196, 15), width=2)
    d3.text((px3 + 16, py3 + target_display_h3 - 28), "Taxis, carros y buses atrapados en 2 metros de agua turbia...", fill=(255, 255, 255), font=font_tahoma_10)

    # Button
    d3.rectangle([W // 2 - 140, H - 24, W // 2 + 140, H - 4], fill=(46, 204, 113), outline=(255, 255, 255), width=1)
    d3.text((W // 2, H - 21), "▶ [ESPACIO / ENTER / CLICK] CONTINUAR", fill=(0, 0, 0), font=font_tahoma_10, anchor="mt")

    panel3.save('assets/comic_soterrado_3_inundado.png')
    panel3.save(os.path.join(art_dir, 'comic_soterrado_3_inundado.png'))
    print("Saved Capcom CPS-3 Panel 3")

if __name__ == '__main__':
    build_capcom_comic_panels()
