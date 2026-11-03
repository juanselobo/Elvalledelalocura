# -*- coding: utf-8 -*-
import os

LEVEL4_PATH = r"D:\Desktop\Juegos\villa-aburra-game\levels\level4.js"

with open(LEVEL4_PATH, "r", encoding="utf-8") as f:
    text = f.read()

# Reemplazar drawStage4Soterrado
idx_draw = text.find("drawStage4Soterrado(ctx) {")
idx_dialog_start = text.find("const { NODES, ENDINGS } = this.getStage4DialogueData();", idx_draw)
idx_dialog_end = text.find("} else {", idx_dialog_start)
if idx_dialog_end == -1:
    idx_dialog_end = text.find("ctx.restore();\n  },", idx_dialog_start)
idx_wrap = text.find("wrapText(ctx, text, x, y, maxWidth, lineHeight) {")

# Extraer el bloque del diálogo (paso 3)
dialog_block = """      const { NODES, ENDINGS } = this.getStage4DialogueData();
      const isGameOver = !!this.stage4.gameOver;

      // 1. Imagen de fondo dinámica sincronizada con el momento emocional actual
      const curNode = NODES[this.stage4.currentNodeId || 'N0'] || NODES['N0'];
      const activeMomentKey = curNode.imageKey || 'scene_soterrado_01_encuentro';
      let bgKey = isGameOver ? (this.stage4.gameOver.imageKey || 'scene_soterrado_dialogue') : activeMomentKey;
      let bgImg = window.spriteManager.getImage(bgKey) || window.spriteManager.getImage(activeMomentKey) || window.spriteManager.getImage('scene_soterrado_dialogue');
      if (bgImg && bgImg.complete) {
        ctx.drawImage(bgImg, 0, 0, this.vWidth, this.vHeight);
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, this.vWidth, this.vHeight);
      }

      // Animaciones de fondo vivas y sutiles
      if (!isGameOver) {
        this.drawStage4AmbientAnimations(ctx, time);
      }

      // Si es Game Over o Éxito
      if (isGameOver) {
        const go = this.stage4.gameOver;
        const pY = 200;
        const pH = 150;
        ctx.fillStyle = 'rgba(8, 6, 18, 0.96)';
        ctx.fillRect(14, pY, this.vWidth - 28, pH);
        ctx.strokeStyle = go.isWin ? '#2ecc71' : '#f1c40f';
        ctx.lineWidth = 2;
        ctx.strokeRect(14, pY, this.vWidth - 28, pH);

        // Esquinas reforzadas
        ctx.fillStyle = go.isWin ? '#2ecc71' : '#f1c40f';
        ctx.fillRect(14, pY, 5, 5);
        ctx.fillRect(14 + this.vWidth - 28 - 5, pY, 5, 5);
        ctx.fillRect(14, pY + pH - 5, 5, 5);
        ctx.fillRect(14 + this.vWidth - 28 - 5, pY + pH - 5, 5, 5);

        // Subtítulo
        ctx.fillStyle = go.isWin ? '#2ecc71' : '#f39c12';
        ctx.font = '900 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(go.subtitle, this.vWidth / 2, pY + 20);

        // Descripción cómica
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'left';
        this.wrapText(ctx, go.desc, 28, pY + 40, this.vWidth - 56, 16);

        // Botón de acción (Reintentar o Continuar)
        const btnW = 340;
        const btnH = 28;
        const btnX = (this.vWidth - btnW) / 2;
        const btnY = pY + pH - 36;
        const pulse = Math.sin(time / 140) * 0.2 + 0.8;

        ctx.fillStyle = go.isWin ? `rgba(46, 204, 113, ${pulse})` : `rgba(231, 76, 60, ${pulse})`;
        ctx.fillRect(btnX, btnY, btnW, btnH);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(btnX, btnY, btnW, btnH);

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 10.5px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const label = go.isWin ? "▶  [ ENTER / CLIC ] INICIAR PARKOUR DE TECHOS 🌊" : "🔄  [ ENTER / CLIC ] PROBAR OTRA DECISIÓN 🔁";
        ctx.fillText(label, btnX + btnW / 2, btnY + btnH / 2);

        this.stage4._restartBtn = { x: btnX, y: btnY, w: btnW, h: btnH };
        this.stage4._choiceButtons = [];
      } else {
        // MODO NODO DE DIÁLOGO ACTIVO
        const node = NODES[this.stage4.currentNodeId || 'N0'] || NODES['N0'];
        
        // Caja de Diálogo Ampliada para Máxima Legibilidad
        const boxX = 12;
        const boxY = 158;
        const boxW = this.vWidth - 24;
        const boxH = 196;

        ctx.fillStyle = 'rgba(7, 5, 16, 0.96)';
        ctx.fillRect(boxX, boxY, boxW, boxH);
        ctx.strokeStyle = '#f1c40f';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(boxX, boxY, boxW, boxH);

        // Esquinas doradas
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(boxX, boxY, 5, 5);
        ctx.fillRect(boxX + boxW - 5, boxY, 5, 5);
        ctx.fillRect(boxX, boxY + boxH - 5, 5, 5);
        ctx.fillRect(boxX + boxW - 5, boxY + boxH - 5, 5, 5);

        // 1. Etiqueta del interlocutor (Izquierda)
        ctx.fillStyle = 'rgba(241, 196, 15, 0.18)';
        ctx.fillRect(boxX + 10, boxY + 6, 260, 16);
        ctx.strokeStyle = '#f1c40f';
        ctx.lineWidth = 1;
        ctx.strokeRect(boxX + 10, boxY + 6, 260, 16);

        ctx.fillStyle = '#f1c40f';
        ctx.font = '900 9.5px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`👮 ${node.speaker}`, boxX + 16, boxY + 14);

        // Guía de controles (Derecha)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(boxX + boxW - 270, boxY + 6, 260, 16);
        ctx.fillStyle = '#f1c40f';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'right';
        ctx.fillText("🎮 [▲/▼ o W/S] Mover | [ENTER/CLIC] Elegir", boxX + boxW - 16, boxY + 14);

        // 2. Texto del Diálogo con sombra
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10.5px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        const lineH = 14;
        const textLines = this.wrapText(ctx, node.text, boxX + 12, boxY + 26, boxW - 24, lineH);
        
        // 3. Botones de Selección Múltiple
        this.stage4._choiceButtons = [];
        const choices = node.choices || [];
        const numChoices = choices.length;
        const choicesStartY = boxY + 26 + textLines * lineH + 6;
        const availableH = (boxY + boxH - 6) - choicesStartY;
        const btnGap = 4;
        const btnH = Math.min(23, Math.max(18, Math.floor((availableH - (numChoices - 1) * btnGap) / numChoices)));

        choices.forEach((ch, idx) => {
          const cy = choicesStartY + idx * (btnH + btnGap);
          const isSelected = (idx === (this.stage4.selectedChoiceIndex || 0));

          // Fondo del botón
          if (isSelected) {
            ctx.fillStyle = 'rgba(241, 196, 15, 0.32)';
            ctx.fillRect(boxX + 10, cy, boxW - 20, btnH);
            ctx.strokeStyle = '#f1c40f';
            ctx.lineWidth = 2;
            ctx.strokeRect(boxX + 10, cy, boxW - 20, btnH);

            // Flecha arcade pulsante
            const arrowBounce = Math.sin(time / 110) * 2;
            ctx.fillStyle = '#f1c40f';
            ctx.font = '900 11px monospace';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText("▶", boxX + 14 + arrowBounce, cy + btnH / 2);
          } else {
            ctx.fillStyle = 'rgba(20, 16, 38, 0.90)';
            ctx.fillRect(boxX + 10, cy, boxW - 20, btnH);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
            ctx.lineWidth = 1;
            ctx.strokeRect(boxX + 10, cy, boxW - 20, btnH);
          }

          // Badge de número [1], [2], [3], [4]
          const badgeX = isSelected ? boxX + 28 : boxX + 16;
          ctx.fillStyle = isSelected ? '#f1c40f' : 'rgba(255, 255, 255, 0.15)';
          ctx.fillRect(badgeX, cy + 2, 18, btnH - 4);
          ctx.fillStyle = isSelected ? '#000000' : '#f1c40f';
          ctx.font = '900 9.5px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`[${idx + 1}]`, badgeX + 9, cy + btnH / 2);

          // Texto de la opción
          ctx.fillStyle = isSelected ? '#ffffff' : '#dcdde1';
          ctx.font = isSelected ? '900 10px monospace' : 'bold 9.5px monospace';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(ch.text, badgeX + 24, cy + btnH / 2);

          this.stage4._choiceButtons.push({
            x: boxX + 10,
            y: cy,
            w: boxW - 20,
            h: btnH,
            index: idx
          });
        });
      }"""

new_draw_stage4 = """drawStage4Soterrado(ctx) {
    if (!this.stage4) this.initStage4Soterrado();
    const step = this.stage4.comicStep || 1;
    const time = Date.now();

    ctx.save();

    // =========================================================================
    // IMAGEN 1: VISTA AÉREA EXTERIOR (Limpia sin textos sobrepuestos)
    // =========================================================================
    if (step === 1) {
      const img = window.spriteManager.getImage('comic_soterrado_1_exterior');
      if (img && img.complete) {
        ctx.drawImage(img, 0, 0, this.vWidth, this.vHeight);
      } else {
        ctx.fillStyle = '#110e20';
        ctx.fillRect(0, 0, this.vWidth, this.vHeight);
      }

      // Indicador inferior sutil
      const pulse = Math.sin(time / 140) * 0.2 + 0.8;
      const btnW = 280;
      const btnH = 24;
      const bx = (this.vWidth - btnW) / 2;
      const by = this.vHeight - 32;

      ctx.fillStyle = 'rgba(10, 8, 22, 0.88)';
      ctx.fillRect(bx, by, btnW, btnH);
      ctx.strokeStyle = `rgba(241, 196, 15, ${pulse})`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx, by, btnW, btnH);

      ctx.fillStyle = '#f1c40f';
      ctx.font = '900 10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText("▶  [ CLIC / ESPACIO ] CONTINUAR ▶", this.vWidth / 2, by + btnH / 2 + 1);
    }
    // =========================================================================
    // IMAGEN 2: CARROS INUNDADOS Y MOTO (Limpia sin textos sobrepuestos)
    // =========================================================================
    else if (step === 2) {
      const img = window.spriteManager.getImage('comic_soterrado_3_inundado');
      if (img && img.complete) {
        ctx.drawImage(img, 0, 0, this.vWidth, this.vHeight);
      } else {
        ctx.fillStyle = '#110e20';
        ctx.fillRect(0, 0, this.vWidth, this.vHeight);
      }

      // Indicador inferior sutil
      const pulse = Math.sin(time / 140) * 0.2 + 0.8;
      const btnW = 320;
      const btnH = 24;
      const bx = (this.vWidth - btnW) / 2;
      const by = this.vHeight - 32;

      ctx.fillStyle = 'rgba(10, 8, 22, 0.88)';
      ctx.fillRect(bx, by, btnW, btnH);
      ctx.strokeStyle = `rgba(46, 204, 113, ${pulse})`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx, by, btnW, btnH);

      ctx.fillStyle = '#2ecc71';
      ctx.font = '900 10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText("▶  [ CLIC / ESPACIO ] ENTRAR A LA CONVERSACIÓN ▶", this.vWidth / 2, by + btnH / 2 + 1);
    }
    // =========================================================================
    // IMAGEN 3 (DINÁMICA): EL ÁRBOL DE DECISIONES DE LA CONVERSACIÓN
    // =========================================================================
    else if (step === 3) {
""" + dialog_block + """
    }

    ctx.restore();
  },

  """

full_updated = text[:idx_draw] + new_draw_stage4 + text[idx_wrap:]
with open(LEVEL4_PATH, "w", encoding="utf-8") as f:
    f.write(full_updated)

print("level4.js cleaned from duplicated titles and intermediary black screen!")
