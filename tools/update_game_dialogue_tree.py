# -*- coding: utf-8 -*-
import re

# 1. Update sprites.js
sprites_path = r"D:\Desktop\Juegos\villa-aburra-game\sprites.js"
with open(sprites_path, "r", encoding="utf-8") as f:
    sprites_content = f.read()

target_sprite = "'scene_soterrado_07_alianza_parkour': 'assets/scene_soterrado_07_alianza_parkour.png',"
new_sprites = """'scene_soterrado_07_alianza_parkour': 'assets/scene_soterrado_07_alianza_parkour.png',
      'scene_soterrado_08_minorista_duda': 'assets/scene_soterrado_08_minorista_duda.png',
      'scene_soterrado_09_la33_taxistas': 'assets/scene_soterrado_09_la33_taxistas.png',
      'scene_soterrado_10_requisa_bolsillos': 'assets/scene_soterrado_10_requisa_bolsillos.png',
      'scene_soterrado_11_panico_nequi': 'assets/scene_soterrado_11_panico_nequi.png',
      'scene_soterrado_12_billete_cincuenta': 'assets/scene_soterrado_12_billete_cincuenta.png',
      'scene_soterrado_13_influencer_grabar': 'assets/scene_soterrado_13_influencer_grabar.png',
      'scene_soterrado_14_furia_policial': 'assets/scene_soterrado_14_furia_policial.png',
      'scene_soterrado_15_briefing_tactico': 'assets/scene_soterrado_15_briefing_tactico.png',"""

if target_sprite in sprites_content and "'scene_soterrado_08_minorista_duda'" not in sprites_content:
    sprites_content = sprites_content.replace(target_sprite, new_sprites)
    with open(sprites_path, "w", encoding="utf-8") as f:
        f.write(sprites_content)
    print("sprites.js successfully updated!")
else:
    print("sprites.js already has the new sprites or target not matched.")

# 2. Update levels/level4.js
level4_path = r"D:\Desktop\Juegos\villa-aburra-game\levels\level4.js"
with open(level4_path, "r", encoding="utf-8") as f:
    level4_content = f.read()

# Map nodes to new distinct image keys
replacements = [
    # N2 node
    (r"(N2:\s*\{\s*imageKey:\s*)'scene_soterrado_02_rata_incredulidad'", r"\1'scene_soterrado_08_minorista_duda'"),
    # N4 node
    (r"(N4:\s*\{\s*imageKey:\s*)'scene_soterrado_03_fotocopiadora_facepalm'", r"\1'scene_soterrado_09_la33_taxistas'"),
    # N_SOBORNO_1 node
    (r"(N_SOBORNO_1:\s*\{\s*imageKey:\s*)'scene_soterrado_05_soborno_negociacion'", r"\1'scene_soterrado_10_requisa_bolsillos'"),
    # N_SOBORNO_NEQUI node
    (r"(N_SOBORNO_NEQUI:\s*\{\s*imageKey:\s*)'scene_soterrado_05_soborno_negociacion'", r"\1'scene_soterrado_11_panico_nequi'"),
    # N_SOBORNO_ALTO node
    (r"(N_SOBORNO_ALTO:\s*\{\s*imageKey:\s*)'scene_soterrado_05_soborno_negociacion'", r"\1'scene_soterrado_12_billete_cincuenta'"),
    # N_GRABAR node
    (r"(N_GRABAR:\s*\{\s*imageKey:\s*)'scene_soterrado_04_inundacion_sarcasmo'", r"\1'scene_soterrado_13_influencer_grabar'"),
    # N_TOREAR node
    (r"(N_TOREAR:\s*\{\s*imageKey:\s*)'scene_soterrado_06_radio_panico'", r"\1'scene_soterrado_14_furia_policial'"),
    # N8B_TACTICA node
    (r"(N8B_TACTICA:\s*\{\s*imageKey:\s*)'scene_soterrado_07_alianza_parkour'", r"\1'scene_soterrado_15_briefing_tactico'")
]

for pattern, repl in replacements:
    new_content, count = re.subn(pattern, repl, level4_content)
    if count > 0:
        level4_content = new_content
        print(f"Applied replacement for {pattern} ({count} occurrences)")
    else:
        print(f"Warning: pattern {pattern} not matched")

with open(level4_path, "w", encoding="utf-8") as f:
    f.write(level4_content)
print("level4.js successfully updated!")
