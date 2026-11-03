// ============================================================
// NIVEL 1: LA VILLA DEL ABURRÁ (PLAZOLETA Y VIADUCTO)
// ============================================================
window.Level1 = {
  setupLevel1() {
    if (this.quest.talkedGloria) {
      this.quest.gaminSpawned = false;
      this.spawnInitialEnemies();
    }
    if (window.retroAudio && window.retroAudio.stopCutsceneBgm) {
      window.retroAudio.stopCutsceneBgm();
    }
  },

  spawnInitialEnemies() {
    if (this.quest.gaminSpawned) return;
    this.quest.gaminSpawned = true;
    this.enemies.push({
      id: 'gamin',
      name: 'GAMÍN DEL ÉXITO',
      x: 750,
      z: 298,
      elevY: 0,
      vx: 0, vz: 0, vy: 0,
      width: 40, height: 96,
      facingRight: false,
      state: 'patrol',
      stateTimer: 0,
      frame: 0, animTimer: 0,
      hp: 100, maxHp: 100,
      patrolStartX: 620, patrolEndX: 950,
      patrolDir: -1,
      speedX: 95, speedZ: 55,
      zFlankOffset: -12,
      invulnerableTimer: 0, starsAngle: 0
    });
    this.enemies.push({
      id: 'rappi',
      name: 'RAPPI-GAMÍN',
      x: 1450,
      z: 326,
      elevY: 0,
      vx: 0, vz: 0, vy: 0,
      width: 40, height: 96,
      facingRight: false,
      state: 'patrol',
      stateTimer: 0,
      frame: 0, animTimer: 0,
      hp: 120, maxHp: 120,
      patrolStartX: 1250, patrolEndX: 1650,
      patrolDir: -1,
      speedX: 105, speedZ: 60,
      zFlankOffset: 14,
      throwCooldown: 3.2,
      invulnerableTimer: 0, starsAngle: 0
    });
    this.addFloatingText(650, this.floorZ - 140, "¡ALERTA! SECTOR DE LOS GAMINES", "#e74c3c");
  }

,

  drawStairsLevel1(ctx, x, z) {
    const img = window.spriteManager.getImage('stairs_level1');
    if (img && img.complete) {
      ctx.save();
      const sw = 185;
      const sh = Math.floor(sw * (img.naturalHeight / img.naturalWidth));
      const drawX = x - sw - 5;
      const drawY = z - sh + 12;

      // Hueco / portal arquitectónico de salida hacia la ladera (transición oscura)
      const portalGrad = ctx.createLinearGradient(drawX + 35, 0, drawX + sw, 0);
      portalGrad.addColorStop(0, 'rgba(10, 8, 20, 0.0)');
      portalGrad.addColorStop(0.35, 'rgba(10, 8, 20, 0.45)');
      portalGrad.addColorStop(1, 'rgba(10, 8, 20, 0.85)');
      ctx.fillStyle = portalGrad;
      ctx.fillRect(drawX + 35, 140, sw - 35, z - 140);

      // Sombra base de contacto
      ctx.fillStyle = 'rgba(10, 15, 25, 0.45)';
      ctx.beginPath();
      ctx.ellipse(drawX + sw * 0.5, z + 6, sw * 0.48, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Oclusión rasante en la unión con las baldosas
      ctx.fillStyle = 'rgba(5, 5, 10, 0.35)';
      ctx.fillRect(drawX + 15, z - 2, sw - 15, 6);

      // Escaleras pixel art CPS3 / Neo Geo nativas subiendo hacia el Mirador
      ctx.drawImage(img, drawX, drawY, sw, sh);

      // Prompt sutil según estado de la misión
      const dist = Math.abs(this.player.x - (drawX + 45));
      if (dist < 85) {
        const pulse = Math.sin(Date.now() / 140) * 0.25 + 0.75;
        if (this.quest.hasTicket) {
          ctx.fillStyle = 'rgba(10, 10, 25, 0.9)';
          ctx.fillRect(drawX + 10, z - 145, 130, 22);
          ctx.strokeStyle = `rgba(46, 204, 113, ${pulse})`;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(drawX + 10, z - 145, 130, 22);

          ctx.fillStyle = '#2ecc71';
          ctx.font = '900 8px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('¡SUBIR ESCALERAS! ↗', drawX + 75, z - 131);
        } else {
          ctx.fillStyle = 'rgba(10, 10, 25, 0.9)';
          ctx.fillRect(drawX + 5, z - 145, 140, 22);
          ctx.strokeStyle = `rgba(231, 76, 60, ${pulse})`;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(drawX + 5, z - 145, 140, 22);

          ctx.fillStyle = '#e74c3c';
          ctx.font = '900 7.5px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('🔒 TIQUETE REQUERIDO', drawX + 75, z - 131);
        }
      }
      ctx.restore();
    }
  }

,

  drawDialogueBox(ctx, x, y, text) {
    const boxW = 280;
    const boxH = 75;
    ctx.fillStyle = 'rgba(10, 10, 20, 0.92)';
    ctx.fillRect(x, y, boxW, boxH);
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, boxW, boxH);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.fillText("DOÑA GLORIA (EMPANADAS):", x + 10, y + 15);
    ctx.fillStyle = '#f1c40f';
    ctx.font = '8.5px monospace';

    const words = text.split(' ');
    let line = '';
    let lineY = y + 28;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > boxW - 20 && n > 0) {
        ctx.fillText(line, x + 10, lineY);
        line = words[n] + ' ';
        lineY += 11;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x + 10, lineY);
  }


};
