// ============================================================
// NIVEL 2: MIRADOR DE LA LADERA & CONGREGACIÓN
// ============================================================
window.Level2 = {
  setupLevel2() {
    if (window.retroAudio && window.retroAudio.stopCutsceneBgm) {
      window.retroAudio.stopCutsceneBgm();
    }
      this.enemies.push({
        id: 'gamin',
        name: 'GAMÍN DE LA LADERA',
        x: 650,
        z: this.floorZ - 20,
        elevY: 0,
        vx: 0, vz: 0, vy: 0,
        width: 40, height: 96,
        facingRight: false,
        state: 'patrol',
        stateTimer: 0,
        frame: 0, animTimer: 0,
        hp: 120, maxHp: 120,
        patrolStartX: 500, patrolEndX: 850,
        speedX: 95, speedZ: 60,
        zFlankOffset: -16,
        invulnerableTimer: 0, starsAngle: 0
      });
      this.enemies.push({
        id: 'gamin',
        name: 'GAMÍN DEL PARKOUR',
        x: 1200,
        z: this.floorZ + 20,
        elevY: 0,
        vx: 0, vz: 0, vy: 0,
        width: 40, height: 96,
        facingRight: false,
        state: 'patrol',
        stateTimer: 0,
        frame: 0, animTimer: 0,
        hp: 120, maxHp: 120,
        patrolStartX: 1050, patrolEndX: 1400,
        speedX: 110, speedZ: 65,
        zFlankOffset: 16,
        invulnerableTimer: 0, starsAngle: 0
      });
      this.enemies.push({
        id: 'rappi',
        name: 'RAPPI VELOZ #1',
        x: 900,
        z: this.floorZ - 10,
        elevY: 0,
        vx: 0, vz: 0, vy: 0,
        width: 45, height: 96,
        facingRight: false,
        state: 'patrol',
        stateTimer: 0,
        frame: 0, animTimer: 0,
        hp: 150, maxHp: 150,
        patrolStartX: 750, patrolEndX: 1100,
        speedX: 100, speedZ: 60,
        zFlankOffset: -20,
        throwCooldown: 2.5,
        invulnerableTimer: 0, starsAngle: 0
      });
      this.enemies.push({
        id: 'rappi',
        name: 'RAPPI VELOZ #2',
        x: 1650,
        z: this.floorZ + 15,
        elevY: 0,
        vx: 0, vz: 0, vy: 0,
        width: 45, height: 96,
        facingRight: false,
        state: 'patrol',
        stateTimer: 0,
        frame: 0, animTimer: 0,
        hp: 150, maxHp: 150,
        patrolStartX: 1500, patrolEndX: 1950,
        speedX: 115, speedZ: 70,
        zFlankOffset: 18,
        throwCooldown: 3.0,
        invulnerableTimer: 0, starsAngle: 0
      });

  },

  drawMetrocableCabin(ctx) {
    // Metrocable eliminado de todos los niveles
  }

,

  drawStairsLandingLevel2(ctx, x, z) {
    const img = window.spriteManager.getImage('stairs_landing_level2');
    if (img && img.complete) {
      ctx.save();
      const sw = 185;
      const sh = Math.floor(sw * (img.naturalHeight / img.naturalWidth));
      const drawX = x - 75;
      const drawY = z - sh + 8;

      // Contact shadow beneath landing structure
      ctx.fillStyle = 'rgba(10, 15, 25, 0.42)';
      ctx.beginPath();
      ctx.ellipse(drawX + sw * 0.48, z + 6, sw * 0.46, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Desembarque superior con escaleras reales descendiendo hacia la villa
      ctx.drawImage(img, drawX, drawY, sw, sh);
      ctx.restore();
    }
  },

  drawCanalLedgeLevel2(ctx, x, z) {
    const img = window.spriteManager.getImage('canal_chasm_ledge');
    if (img && img.complete) {
      ctx.save();
      // Borde roto pixel art con rebar expuesto y abismo hacia la canalización
      // Se posiciona exactamente sobre el corte del andén para fusión seamless
      const sw = 175;
      const sh = Math.floor(sw * (img.naturalHeight / img.naturalWidth));
      ctx.drawImage(img, x - 25, z - 65, sw, sh);

      // Indicador de advertencia dinámico sobre el abismo
      if (this.boss.defeated) {
        const pulse = Math.sin(Date.now() / 120) * 0.3 + 0.7;
        ctx.fillStyle = 'rgba(15, 10, 30, 0.94)';
        ctx.fillRect(x - 70, z - 115, 140, 26);
        ctx.strokeStyle = `rgba(231, 76, 60, ${pulse})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 70, z - 115, 140, 26);

        ctx.fillStyle = '#f1c40f';
        ctx.font = '900 8.5px monospace';
        ctx.textAlign = 'center';
        ctx.fillText("★ SALTO DE FE ★", x, z - 104);
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 8px monospace';
        ctx.fillText("¡SALTA AL VACÍO! ⬇", x, z - 93);
      } else {
        ctx.fillStyle = 'rgba(15, 10, 30, 0.85)';
        ctx.fillRect(x - 65, z - 95, 130, 18);
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 65, z - 95, 130, 18);
        ctx.fillStyle = '#e74c3c';
        ctx.font = '900 7.5px monospace';
        ctx.textAlign = 'center';
        ctx.fillText("¡CANALIZACIÓN BLOQUEADA!", x, z - 83);
      }
      ctx.restore();
    }
  }

,

  startBossPhase1() {
    this.boss.active = true;
    this.boss.phase = 1;
    this.boss.phaseTimer = 0;
    this.boss.phaseTransitionTimer = 0;
    this.triggerGraffitiCutscene(1);

    this.addFloatingText(this.player.x, this.player.z - 140, "★ ¡UN TESTIGO DE JEHOVÁ TE ABORDA EN EL ANDÉN! ★", "#f1c40f");

    this.enemies.push({
      id: 'testigo',
      name: 'HERMANO FABIO (PREDICADOR)',
      role: 'phase1_boss',
      x: 2050,
      z: this.floorZ,
      elevY: 0,
      vx: 0, vz: 0, vy: 0,
      width: 50, height: 100,
      facingRight: false,
      state: 'stand',
      stateTimer: 1.2,
      attackCooldown: 2.2,
      hp: 160, maxHp: 160,
      invulnerableTimer: 0,
      patrolStartX: 1750, patrolEndX: 2350,
      patrolDir: -1,
      speedX: 75, speedZ: 45,
      starsAngle: 0,
      lastDropHp: 160
    });
  },

  startBossPhase2() {
    this.boss.phase = 2;
    this.boss.phaseTimer = 0;
    this.boss.phaseTransitionTimer = 0;
    this.triggerGraffitiCutscene(2);

    this.addFloatingText(this.player.x, this.player.z - 140, "★ FASE 2: ¡EL TRÍO DE LA CONGREGACIÓN! ★", "#f1c40f");

    this.enemies.push({
      id: 'testigo',
      name: 'EL TRÍO DE LA CONGREGACIÓN',
      role: 'trio_unit',
      x: 2050,
      z: this.floorZ,
      elevY: 0,
      vx: 0, vz: 0, vy: 0,
      width: 90, height: 100,
      facingRight: false,
      state: 'patrol',
      stateTimer: 0,
      attackCooldown: 2.2,
      hp: 270, maxHp: 270,
      invulnerableTimer: 0,
      patrolStartX: 1750, patrolEndX: 2350,
      patrolDir: -1,
      speedX: 75, speedZ: 45,
      starsAngle: 0,
      lastDropHp: 270
    });
  },

  startBossPhase3() {
    this.boss.phase = 3;
    this.boss.phaseTimer = 0;
    this.boss.phaseTransitionTimer = 0;
    this.triggerGraffitiCutscene(3);

    this.addFloatingText(this.player.x, this.player.z - 150, "★ FASE 3: ¡EL TITÁN GÓLEM DE LA FE! ★", "#f1c40f");

    this.enemies.push({
      id: 'titan',
      name: 'TITÁN GÓLEM DE LA FE',
      role: 'titan',
      x: 2100,
      z: this.floorZ,
      elevY: 0,
      vx: 0, vz: 0, vy: 0,
      width: 195, height: 240,
      facingRight: false,
      state: 'idle',
      stateTimer: 1.5,
      attackCooldown: 3.2,
      attackStep: 0,
      hp: 360, maxHp: 360,
      invulnerableTimer: 0,
      starsAngle: 0,
      lastDropHp: 360
    });
  },

  handleTestigoDefeat(e) {
    if (this.boss.phase === 1 && e.role === 'phase1_boss') {
      e.state = 'pray';
      e.stateTimer = 1.8;
      this.addFloatingText(e.x, e.z - 130, "¡HERMANOS, VENGAN EN ORACIÓN!", "#f1c40f");
      if (window.retroAudio.playDivineChime) window.retroAudio.playDivineChime();
      this.boss.phaseTransitionTimer = 1.6;
      this.spawnCollectible('item_sacol', e.x, e.z, 'sacol');
    } else if (this.boss.phase === 2) {
      e.state = 'ko';
      e.stateTimer = 2.4;
      this.spawnCollectible('item_sacol', e.x - 30, e.z, 'sacol');
      this.spawnCollectible('delivery_box', e.x + 30, e.z, 'box');
      this.addFloatingText(2050, this.floorZ - 140, "¡POR EL PODER DE LA CONGREGACIÓN... FUSIÓN CELESTIAL!", "#f1c40f");
      if (window.retroAudio.playDivineChime) window.retroAudio.playDivineChime();
      this.boss.screenShake = 1.3;
      this.boss.phaseTransitionTimer = 2.0;
    }
  },

  handleTitanDefeat(e) {
    this.boss.phase = 4;
    this.boss.defeated = true;
    if (this.cutscene) this.cutscene.active = false;
    e.state = 'ko';
    e.stateTimer = 6.0;
    this.boss.screenShake = 1.0;
    this.boss.flashTimer = 1.2;
    if (window.retroAudio.playFanfare) window.retroAudio.playFanfare();

    this.addFloatingText(e.x, e.z - 170, "★ ¡VICTORIA TOTAL! ¡VENCISTE AL TESTIGO TITÁNICO! ★", "#f1c40f");
    this.addFloatingText(this.player.x, this.player.z - 120, "★ ¡METROCABLE TOTALMENTE LIBERADO! ★", "#2ecc71");

    const rewards = [
      { key: 'item_sacol', type: 'sacol', off: -60 },
      { key: 'delivery_box', type: 'box', off: -20 },
      { key: 'item_arepa', type: 'arepa', off: 20 },
      { key: 'delivery_box', type: 'box', off: 60 }
    ];
    rewards.forEach(r => {
      this.spawnCollectible(r.key, e.x + r.off, e.z, r.type);
    });

    const tumblingX = [e.x - 70, e.x - 25, e.x + 25, e.x + 70];
    tumblingX.forEach(tx => {
      this.enemies.push({
        id: 'testigo',
        name: 'TESTIGO ATURDIDO',
        role: 'fallen',
        x: tx,
        z: this.floorZ + (Math.random() * 20 - 10),
        elevY: 0,
        vx: 0, vz: 0, vy: 0,
        width: 48, height: 48,
        facingRight: Math.random() < 0.5,
        state: 'ko',
        stateTimer: 999,
        hp: 0, maxHp: 1,
        invulnerableTimer: 999,
        starsAngle: Math.random() * Math.PI * 2
      });
    });

    for (let k = 0; k < 40; k++) {
      this.addHitSparks(e.x + (Math.random() * 100 - 50), e.z - 80 + (Math.random() * 100 - 50));
    }
  },

  throwTestigoProjectile(enemy, spriteKey) {
    const dir = enemy.facingRight ? 1 : -1;
    this.projectiles.push({
      spriteKey: spriteKey,
      x: enemy.x + dir * 25,
      z: enemy.z,
      y: enemy.z - 65,
      vx: dir * (spriteKey === 'proj_crucifix' ? 290 : 230),
      vy: -110,
      rotation: 0,
      rotSpeed: spriteKey === 'proj_crucifix' ? 16 : 12,
      isBossProj: true,
      damage: spriteKey === 'proj_crucifix' ? 18 : 15
    });
    if (window.retroAudio.playBibleWhoosh) window.retroAudio.playBibleWhoosh();
  },

  triggerBibleRain(titan) {
    if (window.retroAudio.playDivineChime) window.retroAudio.playDivineChime();
    const offsets = [-140, -50, 45, 135];
    offsets.forEach((off, idx) => {
      const targetX = Math.max(1500, Math.min(2650, this.player.x + off + (Math.random() * 30 - 15)));
      const targetZ = Math.max(this.zMin, Math.min(this.zMax, this.player.z + (Math.random() * 40 - 20)));
      this.boss.rainWarnings.push({
        x: targetX,
        z: targetZ,
        y: targetZ,
        timer: 0.75 + (idx * 0.18),
        spawned: false
      });
    });
  },

  updateBoss(dt) {
    if (this.boss.phaseTransitionTimer > 0) {
      this.boss.phaseTransitionTimer -= dt;
      if (this.boss.phaseTransitionTimer <= 0) {
        if (this.boss.phase === 1) {
          this.enemies = this.enemies.filter(en => en.id !== 'testigo');
          this.startBossPhase2();
        } else if (this.boss.phase === 2) {
          this.enemies = this.enemies.filter(en => en.id !== 'testigo');
          this.startBossPhase3();
        }
      }
    }
  },

  // ==========================================
  // CINEMÁTICA GRAFFITI DE BOSS
  // ==========================================
  triggerGraffitiCutscene(phase) {
    this.cutscene = {
      active: true,
      phase: phase,
      timer: 1.5,
      maxTimer: 1.5,
      animTimer: 0,
      title: "",
      subtitle: "",
      badge: "",
      fillColor: "#f1c40f",
      strokeColor: "#9b59b6"
    };

    if (phase === 1) {
      this.cutscene.title = "¿TIENES UN MINUTO PARA HABLAR";
      this.cutscene.subtitle = "SOBRE EL SEÑOR?";
      this.cutscene.badge = "★ ENCUENTRO EN EL ANDÉN ★";
      this.cutscene.fillColor = "#f1c40f";
      this.cutscene.strokeColor = "#2980b9";
    } else if (phase === 2) {
      this.cutscene.title = "¡POR EL CUERPO DE CRISTO!";
      this.cutscene.subtitle = "REZO DE LA CONGREGACIÓN";
      this.cutscene.badge = "★ FASE 2: TRÍO CELESTIAL ★";
      this.cutscene.fillColor = "#e67e22";
      this.cutscene.strokeColor = "#8e44ad";
    } else if (phase === 3) {
      this.cutscene.title = "¡PREPÁRATE PARA LA LIMPIEZA";
      this.cutscene.subtitle = "DEL TITÁN DEL SEÑOR!";
      this.cutscene.badge = "★ JEFE FINAL TITÁNICO ★";
      this.cutscene.fillColor = "#e74c3c";
      this.cutscene.strokeColor = "#d35400";
    }

    this.boss.screenShake = 1.3;
    this.boss.flashTimer = 0.45;
    if (window.retroAudio.playBossSting) {
      window.retroAudio.playBossSting(phase);
    }
  },

  drawGraffitiCutscene(ctx) {
    if (!this.cutscene || !this.cutscene.active) return;
    const c = this.cutscene;
    const progress = (c.maxTimer - c.timer) / c.maxTimer;

    let popScale = 1.0;
    if (progress < 0.15) {
      popScale = (progress / 0.15) * 1.15;
    } else if (progress < 0.25) {
      popScale = 1.15 - ((progress - 0.15) / 0.1) * 0.15;
    } else if (progress > 0.85) {
      popScale = 1.0 + ((progress - 0.85) / 0.15) * 0.2;
    }

    let alpha = 1.0;
    if (progress < 0.1) alpha = progress / 0.1;
    else if (progress > 0.85) alpha = (1.0 - progress) / 0.15;

    ctx.save();
    // En lugar de oscurecer toda la pantalla con un velo negro al 72%, usamos
    // letterbox cinematográfico sutil (14px) arriba y abajo, dejando ver el juego y enemigos con total nitidez
    const letterboxH = Math.round(14 * alpha);
    if (letterboxH > 0) {
      ctx.fillStyle = 'rgba(8, 6, 16, 0.7)';
      ctx.fillRect(0, 0, this.vWidth, letterboxH);
      ctx.fillRect(0, this.vHeight - letterboxH, this.vWidth, letterboxH);
    }

    const cx = this.vWidth / 2;
    const cy = this.vHeight / 2 - 10;
    ctx.translate(cx, cy);
    ctx.scale(popScale, popScale);

    const bannerW = 440;
    const bannerH = 110;
    ctx.fillStyle = `rgba(20, 15, 36, ${0.94 * alpha})`;
    ctx.beginPath();
    ctx.roundRect(-bannerW / 2, -bannerH / 2, bannerW, bannerH, 14);
    ctx.fill();
    ctx.strokeStyle = c.strokeColor;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = c.fillColor;
    ctx.font = '900 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(c.badge, 0, -bannerH / 2 + 18);

    ctx.font = '900 16px "Impact", "Arial Black", monospace';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 5;
    ctx.strokeText(c.title, 0, 5);
    ctx.fillStyle = c.fillColor;
    ctx.fillText(c.title, 0, 5);

    ctx.font = '900 17px "Impact", "Arial Black", monospace';
    ctx.strokeText(c.subtitle, 0, 32);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(c.subtitle, 0, 32);

    ctx.restore();
  }

};
