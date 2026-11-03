# -*- coding: utf-8 -*-
import os

LEVEL4_PATH = r"D:\Desktop\Juegos\villa-aburra-game\levels\level4.js"
GAME_PATH = r"D:\Desktop\Juegos\villa-aburra-game\game.js"

with open(LEVEL4_PATH, "r", encoding="utf-8") as f:
    text = f.read()

# 1. Asegurar comicStep inicial = 1
text = text.replace("comicStep: 2,", "comicStep: 1,")

# 2. Localizar drawStage4Soterrado
idx_draw = text.find("drawStage4Soterrado(ctx) {")
idx_dialog_start = text.find("const { NODES, ENDINGS } = this.getStage4DialogueData();", idx_draw)
idx_dialog_end = text.find("} else {", idx_dialog_start)
idx_wrap = text.find("wrapText(ctx, text, x, y, maxWidth, lineHeight) {")

if idx_draw != -1 and idx_dialog_start != -1 and idx_dialog_end != -1 and idx_wrap != -1:
    dialog_code = text[idx_dialog_start:idx_dialog_end].rstrip()

    new_draw_func = """drawStage4Soterrado(ctx) {
    if (!this.stage4) this.initStage4Soterrado();
    const step = this.stage4.comicStep || 1;
    const time = Date.now();

    ctx.save();

    // ==========================================
    // PASO 1: VISTA AÉREA EXTERIOR CON TÍTULO
    // ==========================================
    if (step === 1) {
      const img = window.spriteManager.getImage('comic_soterrado_1_exterior');
      if (img && img.complete) {
        ctx.drawImage(img, 0, 0, this.vWidth, this.vHeight);
      } else {
        ctx.fillStyle = '#110e20';
        ctx.fillRect(0, 0, this.vWidth, this.vHeight);
      }

      // Título estilo cómic arriba
      const titleW = 440;
      const titleH = 36;
      const tx = (this.vWidth - titleW) / 2;
      const ty = 14;

      ctx.fillStyle = 'rgba(8, 6, 18, 0.94)';
      ctx.fillRect(tx, ty, titleW, titleH);
      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(tx, ty, titleW, titleH);

      // Esquinas doradas
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(tx, ty, 5, 5);
      ctx.fillRect(tx + titleW - 5, ty, 5, 5);
      ctx.fillRect(tx, ty + titleH - 5, 5, 5);
      ctx.fillRect(tx + titleW - 5, ty + titleH - 5, 5, 5);

      ctx.fillStyle = '#f1c40f';
      ctx.font = '900 13px "Impact", "Arial Black", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText("★ MIENTRAS TANTO, EN EL SOTERRADO... ★", this.vWidth / 2, ty + titleH / 2 + 1);

      // Botón parpadeante abajo
      const pulse = Math.sin(time / 130) * 0.25 + 0.75;
      const btnW = 340;
      const btnH = 28;
      const bx = (this.vWidth - btnW) / 2;
      const by = this.vHeight - 42;

      ctx.fillStyle = 'rgba(10, 8, 22, 0.94)';
      ctx.fillRect(bx, by, btnW, btnH);
      ctx.strokeStyle = `rgba(241, 196, 15, ${pulse})`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx, by, btnW, btnH);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 10.5px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText("▶  [ ESPACIO / ENTER / CLIC ] CONTINUAR ▶", this.vWidth / 2, by + btnH / 2 + 1);
    }
    // ==========================================
    // PASO 2: CARROS INUNDADOS Y MOTO EN PRIMER PLANO
    // ==========================================
    else if (step === 2) {
      const img = window.spriteManager.getImage('comic_soterrado_3_inundado');
      if (img && img.complete) {
        ctx.drawImage(img, 0, 0, this.vWidth, this.vHeight);
      } else {
        ctx.fillStyle = '#110e20';
        ctx.fillRect(0, 0, this.vWidth, this.vHeight);
      }

      // Cintillo superior
      const titleW = 460;
      const titleH = 32;
      const tx = (this.vWidth - titleW) / 2;
      const ty = 14;

      ctx.fillStyle = 'rgba(8, 6, 18, 0.94)';
      ctx.fillRect(tx, ty, titleW, titleH);
      ctx.strokeStyle = '#3498db';
      ctx.lineWidth = 2;
      ctx.strokeRect(tx, ty, titleW, titleH);

      ctx.fillStyle = '#3498db';
      ctx.fillRect(tx, ty, 4, 4);
      ctx.fillRect(tx + titleW - 4, ty, 4, 4);
      ctx.fillRect(tx, ty + titleH - 4, 4, 4);
      ctx.fillRect(tx + titleW - 4, ty + titleH - 4, 4, 4);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 11.5px "Impact", "Arial Black", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText("★ EL SOTERRADO DE PARQUES DEL RÍO INUNDADO ★", this.vWidth / 2, ty + titleH / 2 + 1);

      // Botón parpadeante abajo
      const pulse = Math.sin(time / 130) * 0.25 + 0.75;
      const btnW = 360;
      const btnH = 28;
      const bx = (this.vWidth - btnW) / 2;
      const by = this.vHeight - 42;

      ctx.fillStyle = 'rgba(10, 8, 22, 0.94)';
      ctx.fillRect(bx, by, btnW, btnH);
      ctx.strokeStyle = `rgba(46, 204, 113, ${pulse})`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx, by, btnW, btnH);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 10.5px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText("▶  [ ESPACIO / ENTER / CLIC ] ENTRAR AL DIÁLOGO ▶", this.vWidth / 2, by + btnH / 2 + 1);
    }
    // ==========================================
    // PASO 3: DIÁLOGO INTERACTIVO CON EL AGENTE DE TRÁNSITO
    // ==========================================
    else if (step === 3) {
      """ + dialog_code + """
    }

    ctx.restore();
  },

  """
    text = text[:idx_draw] + new_draw_func + text[idx_wrap:]
    print("drawStage4Soterrado replaced successfully")

# 3. advanceFloodedCutscene
idx_adv_flood = text.find("advanceFloodedCutscene() {")
idx_flood_draw = text.find("drawFloodedSoterradoCutscene(ctx) {")
if idx_adv_flood != -1 and idx_flood_draw != -1:
    new_adv = """advanceFloodedCutscene() {
    this.switchStage(4);
  },

  """
    text = text[:idx_adv_flood] + new_adv + text[idx_flood_draw:]
    print("advanceFloodedCutscene replaced successfully")

with open(LEVEL4_PATH, "w", encoding="utf-8") as f:
    f.write(text)
print("Updated level4.js written!")
