# -*- coding: utf-8 -*-
with open('D:/Desktop/Juegos/villa-aburra-game/game.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx_touch = text.find("setupTouchControls() {")
idx_end = text.find("bindBtn('btnSelect', () => {", idx_touch)
# Buscar el cierre de la función después de btnSelect
idx_close = text.find("  }", idx_end)

print("idx_touch:", idx_touch, "idx_end:", idx_end, "idx_close:", idx_close)
print(text[idx_close:idx_close+50])
