# -*- coding: utf-8 -*-
import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter, ImageOps

def grade_and_pixelate(im, target_w=320, num_colors=48, sat=1.35, con=1.4, sharp=2.2):
    # 1. Color Enhancement
    im = ImageEnhance.Color(im).enhance(sat)
    im = ImageEnhance.Contrast(im).enhance(con)
    im = ImageEnhance.Sharpness(im).enhance(sharp)

    orig_w, orig_h = im.size
    aspect = orig_h / float(orig_w)
    target_h = int(target_w * aspect)

    # 2. Edge detection for lineart
    edges = im.filter(ImageFilter.FIND_EDGES).convert('L')
    edges = ImageOps.invert(edges)
    edge_arr = np.array(edges)
    edge_mask = edge_arr < 135

    # 3. Downsample to native arcade resolution
    low_res = im.resize((target_w, target_h), Image.Resampling.BILINEAR)

    # 4. Quantize to retro arcade palette
    quantized = low_res.quantize(colors=num_colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)
    rgb_low = quantized.convert('RGB')

    # 5. Ink outlines on low res
    edge_low = Image.fromarray((~edge_mask * 255).astype(np.uint8)).resize((target_w, target_h), Image.Resampling.NEAREST)
    edge_arr_low = np.array(edge_low) < 180

    pix_arr = np.array(rgb_low)
    pix_arr[edge_arr_low] = (pix_arr[edge_arr_low] * 0.65).astype(np.uint8)

    clean_pixel = Image.fromarray(pix_arr)

    # 6. Upscale cleanly to fit within 600x310
    final_img = clean_pixel.resize((600, int(600 * aspect)), Image.Resampling.NEAREST)
    return final_img

def create_comic_panels():
    art_dir = r"C:\Users\Juanse\.gemini\antigravity\brain\865358c9-b025-436e-b613-f8eea032a59a"
    img1_path = os.path.join(art_dir, ".user_uploaded", "media_1793512193574_958dc00d.png")
    img2_path = os.path.join(art_dir, ".user_uploaded", "media_1793512295833_9a3505ec.png")

    W, H = 640, 360

    font_impact_28 = ImageFont.truetype(r"C:\Windows\Fonts\impact.ttf", 28)
    font_impact_20 = ImageFont.truetype(r"C:\Windows\Fonts\impact.ttf", 20)
    font_impact_16 = ImageFont.truetype(r"C:\Windows\Fonts\impact.ttf", 16)
    font_tahoma_12 = ImageFont.truetype(r"C:\Windows\Fonts\tahomabd.ttf", 12)
    font_tahoma_10 = ImageFont.truetype(r"C:\Windows\Fonts\tahomabd.ttf", 10)

    # -------------------------------------------------------------
    # PANEL 1: AFUERA DEL SOTERRADO (Image 1 as Comic Panel)
    # -------------------------------------------------------------
    raw_img1 = Image.open(img1_path).convert('RGB')
    pixel1 = grade_and_pixelate(raw_img1, target_w=320, num_colors=48, sat=1.4, con=1.45, sharp=2.0)

    panel1 = Image.new('RGB', (W, H), (14, 12, 22))
    d1 = ImageDraw.Draw(panel1)

    # Halftone background dots
    for x in range(0, W, 8):
        for y in range(0, H, 8):
            d1.point((x + (y % 16 == 0) * 4, y), fill=(24, 20, 36))

    # Center the pixel art inside a comic box
    pw1, ph1 = pixel1.size
    px1 = (W - pw1) // 2
    py1 = 46
    panel1.paste(pixel1, (px1, py1))

    # Comic frame
    d1.rectangle([px1 - 4, py1 - 4, px1 + pw1 + 4, py1 + ph1 + 4], outline=(20, 20, 20), width=4)
    d1.rectangle([px1 - 2, py1 - 2, px1 + pw1 + 2, py1 + ph1 + 2], outline=(241, 196, 15), width=2)

    # Yellow comic caption box in top-left
    d1.rectangle([px1 + 8, py1 + 8, px1 + 330, py1 + 36], fill=(241, 196, 15), outline=(10, 10, 10), width=2)
    d1.text((px1 + 16, py1 + 12), "AFUERA: EL SOTERRADO DE PARQUES DEL RÍO", fill=(10, 10, 10), font=font_impact_16)

    # Comic caption at bottom of panel
    d1.rectangle([px1 + 8, py1 + ph1 - 32, px1 + pw1 - 8, py1 + ph1 - 8], fill=(15, 18, 28), outline=(52, 152, 219), width=2)
    d1.text((px1 + 16, py1 + ph1 - 28), "Bajo la terraza peatonal, los vehículos ingresan al viaducto subterráneo...", fill=(255, 255, 255), font=font_tahoma_10)

    # Action prompt button
    d1.rectangle([W // 2 - 140, H - 28, W // 2 + 140, H - 6], fill=(241, 196, 15), outline=(255, 255, 255), width=1)
    d1.text((W // 2, H - 25), "▶ [ESPACIO / ENTER / CLICK] CONTINUAR", fill=(10, 10, 10), font=font_tahoma_10, anchor="mt")

    out_panel1 = os.path.join(art_dir, 'comic_soterrado_1_exterior.png')
    panel1.save('assets/comic_soterrado_1_exterior.png')
    panel1.save(out_panel1)
    print(f"Saved {out_panel1}")


    # -------------------------------------------------------------
    # PANEL 2: "MIENTRAS TANTO..." (The Comic Transition Card)
    # -------------------------------------------------------------
    panel2 = Image.new('RGB', (W, H), (10, 8, 18))
    d2 = ImageDraw.Draw(panel2)

    # Comic background: dark purple rays & halftones
    for x in range(0, W, 8):
        for y in range(0, H, 8):
            d2.point((x + (y % 16 == 0) * 4, y), fill=(30, 24, 48))

    # Dynamic comic impact lines (starburst radiating from center)
    cx, cy = W // 2, H // 2
    for angle in range(0, 360, 12):
        rad = math.radians(angle)
        x1 = cx + math.cos(rad) * 160
        y1 = cy + math.sin(rad) * 110
        x2 = cx + math.cos(rad) * 380
        y2 = cy + math.sin(rad) * 260
        d2.line([(x1, y1), (x2, y2)], fill=(45, 35, 70), width=2)

    # Outer vintage comic card frame
    card_w, card_h = 520, 240
    card_x = (W - card_w) // 2
    card_y = (H - card_h) // 2 - 10

    d2.rectangle([card_x - 6, card_y - 6, card_x + card_w + 6, card_y + card_h + 6], fill=(0, 0, 0))
    d2.rectangle([card_x, card_y, card_x + card_w, card_y + card_h], fill=(18, 14, 32), outline=(241, 196, 15), width=3)
    d2.rectangle([card_x + 6, card_y + 6, card_x + card_w - 6, card_y + card_h - 6], outline=(231, 76, 60), width=1)

    # Giant Yellow Comic Caption Box: "MIENTRAS TANTO..."
    box_w, box_h = 360, 56
    box_x = (W - box_w) // 2
    box_y = card_y + 28
    # Comic drop shadow
    d2.rectangle([box_x + 6, box_y + 6, box_x + box_w + 6, box_y + box_h + 6], fill=(10, 10, 10))
    # Main yellow box
    d2.rectangle([box_x, box_y, box_x + box_w, box_y + box_h], fill=(241, 196, 15), outline=(10, 10, 10), width=3)
    d2.text((W // 2, box_y + 12), "MIENTRAS TANTO...", fill=(10, 10, 10), font=font_impact_28, anchor="mt")

    # Comic narrative description
    narrative_y = box_y + 78
    d2.text((W // 2, narrative_y), "Bajo la Autopista Sur, las fuertes lluvias torrenciales", fill=(255, 255, 255), font=font_tahoma_12, anchor="mt")
    d2.text((W // 2, narrative_y + 22), "desbordaban el Río Medellín y las quebradas aledañas...", fill=(241, 196, 15), font=font_tahoma_12, anchor="mt")

    # Comic sound effects bubbles: * BLUB... BLUB... * and * ¡¡PIII-PIIIII!! *
    # Bubble 1: Water rising
    b1_x, b1_y = card_x + 50, card_y + card_h - 65
    d2.rectangle([b1_x, b1_y, b1_x + 160, b1_y + 32], fill=(52, 152, 219), outline=(10, 10, 10), width=2)
    d2.text((b1_x + 80, b1_y + 7), "🌊 * GLUB... GLUB... *", fill=(255, 255, 255), font=font_impact_16, anchor="mt")

    # Bubble 2: Car horns
    b2_x, b2_y = card_x + card_w - 210, card_y + card_h - 65
    d2.rectangle([b2_x, b2_y, b2_x + 160, b2_y + 32], fill=(231, 76, 60), outline=(10, 10, 10), width=2)
    d2.text((b2_x + 80, b2_y + 7), "🚗 * ¡¡PIII-PIIIII!! *", fill=(255, 255, 255), font=font_impact_16, anchor="mt")

    # Prompt button
    d2.rectangle([W // 2 - 140, H - 32, W // 2 + 140, H - 8], fill=(241, 196, 15), outline=(255, 255, 255), width=1)
    d2.text((W // 2, H - 28), "▶ [ESPACIO / ENTER / CLICK] CONTINUAR", fill=(10, 10, 10), font=font_tahoma_10, anchor="mt")

    out_panel2 = os.path.join(art_dir, 'comic_soterrado_2_mientras_tanto.png')
    panel2.save('assets/comic_soterrado_2_mientras_tanto.png')
    panel2.save(out_panel2)
    print(f"Saved {out_panel2}")


    # -------------------------------------------------------------
    # PANEL 3: ADENTRO DEL SOTERRADO INUNDADO (Image 2 as Comic Panel)
    # -------------------------------------------------------------
    raw_img2 = Image.open(img2_path).convert('RGB')
    pixel2 = grade_and_pixelate(raw_img2, target_w=320, num_colors=48, sat=1.45, con=1.45, sharp=2.0)

    panel3 = Image.new('RGB', (W, H), (14, 12, 22))
    d3 = ImageDraw.Draw(panel3)

    # Halftone background dots
    for x in range(0, W, 8):
        for y in range(0, H, 8):
            d3.point((x + (y % 16 == 0) * 4, y), fill=(24, 20, 36))

    # Center the pixel art inside comic box
    pw2, ph2 = pixel2.size
    px2 = (W - pw2) // 2
    py2 = 36
    panel3.paste(pixel2, (px2, py2))

    # Comic frame
    d3.rectangle([px2 - 4, py2 - 4, px2 + pw2 + 4, py2 + ph2 + 4], outline=(20, 20, 20), width=4)
    d3.rectangle([px2 - 2, py2 - 2, px2 + pw2 + 2, py2 + ph2 + 2], outline=(231, 76, 60), width=2)

    # Red/Yellow comic caption box in top-left
    d3.rectangle([px2 + 8, py2 + 8, px2 + 370, py2 + 36], fill=(231, 76, 60), outline=(10, 10, 10), width=2)
    d3.text((px2 + 16, py2 + 12), "¡EL SOTERRADO ESTÁ COMPLETAMENTE INUNDADO!", fill=(255, 255, 255), font=font_impact_16)

    # Comic caption at bottom of panel
    d3.rectangle([px2 + 8, py2 + ph2 - 32, px2 + pw2 - 8, py2 + ph2 - 8], fill=(15, 18, 28), outline=(241, 196, 15), width=2)
    d3.text((px2 + 16, py2 + ph2 - 28), "Taxis, carros y buses atrapados en 2 metros de agua turbia...", fill=(255, 255, 255), font=font_tahoma_10)

    # Action prompt button
    d3.rectangle([W // 2 - 140, H - 26, W // 2 + 140, H - 6], fill=(46, 204, 113), outline=(255, 255, 255), width=1)
    d3.text((W // 2, H - 23), "▶ [ESPACIO / ENTER / CLICK] CONTINUAR", fill=(0, 0, 0), font=font_tahoma_10, anchor="mt")

    out_panel3 = os.path.join(art_dir, 'comic_soterrado_3_inundado.png')
    panel3.save('assets/comic_soterrado_3_inundado.png')
    panel3.save(out_panel3)
    print(f"Saved {out_panel3}")

if __name__ == '__main__':
    create_comic_panels()
