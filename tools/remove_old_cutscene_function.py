# -*- coding: utf-8 -*-
LEVEL4_PATH = r"D:\Desktop\Juegos\villa-aburra-game\levels\level4.js"

with open(LEVEL4_PATH, "r", encoding="utf-8") as f:
    text = f.read()

idx = text.find("drawFloodedSoterradoCutscene(ctx) {")
if idx != -1:
    # Buscar el final de la función
    idx_end = text.rfind("};")
    replacement = """drawFloodedSoterradoCutscene(ctx) {
    this.switchStage(4);
  }

};"""
    text = text[:idx] + replacement
    with open(LEVEL4_PATH, "w", encoding="utf-8") as f:
        f.write(text)
    print("Cleaned drawFloodedSoterradoCutscene from level4.js")
