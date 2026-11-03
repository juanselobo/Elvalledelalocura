// ============================================================
// NIVEL 3: DESCENSO POR LA CANALIZACIÓN & RATA MUTANTE
// ============================================================
window.Level3 = {
  setupLevel3() {
    this.initCanalDescent();
    if (window.retroAudio && window.retroAudio.startCanalChaseBgm) {
      window.retroAudio.startCanalChaseBgm();
    }
  },

  startRatCutscene() {
    this.ratCutscene = {
      active: true,
      step: 1,
      timer: 0,
      stepTimer: 0,
      maxStepTimer: 4.5,
      shake: 0.5,
      flash: 0.8,
      panelsRevealed: 1
    };

    this.player.vx = 0;
    this.player.vz = 0;
    this.player.vy = 0;
    this.player.action = 'idle';

    if (window.retroAudio && window.retroAudio.playCollect) {
      window.retroAudio.playCollect();
    }
    if (window.retroAudio && window.retroAudio.startCutsceneBgm) {
      window.retroAudio.startCutsceneBgm();
    }
  },

  advanceRatCutscene() {
    if (!this.ratCutscene || !this.ratCutscene.active) return;
    this.ratCutscene.step++;
    this.ratCutscene.stepTimer = 0;

    if (this.ratCutscene.step <= 4) {
      this.ratCutscene.panelsRevealed = Math.max(this.ratCutscene.panelsRevealed, this.ratCutscene.step);
    }
    if (window.retroAudio && window.retroAudio.setCutsceneStep) {
      window.retroAudio.setCutsceneStep(this.ratCutscene.step);
    }

    if (this.ratCutscene.step === 2) {
      if (window.retroAudio && window.retroAudio.playChomp) window.retroAudio.playChomp();
      this.ratCutscene.shake = 0.4;
    } else if (this.ratCutscene.step === 3) {
      if (window.retroAudio && window.retroAudio.playMutationSparks) window.retroAudio.playMutationSparks();
      this.ratCutscene.shake = 0.9;
      this.ratCutscene.flash = 0.9;
    } else if (this.ratCutscene.step === 4) {
      if (window.retroAudio && window.retroAudio.playMonsterRoar) window.retroAudio.playMonsterRoar();
      this.ratCutscene.shake = 1.4;
      this.ratCutscene.flash = 1.0;
    } else if (this.ratCutscene.step > 5) {
      this.ratCutscene.active = false;
      this.switchStage(3);
    }
  }

,

  drawRatCutscene(ctx) {
    if (!this.ratCutscene || !this.ratCutscene.active) return;
    const rc = this.ratCutscene;

    ctx.save();
    ctx.fillStyle = 'rgba(8, 6, 16, 0.94)';
    ctx.fillRect(0, 0, this.vWidth, this.vHeight);

    let shakeX = 0, shakeY = 0;
    if (rc.shake > 0) {
      shakeX = Math.floor((Math.random() - 0.5) * rc.shake * 12);
      shakeY = Math.floor((Math.random() - 0.5) * rc.shake * 10);
    }
    ctx.translate(shakeX, shakeY);

    if (rc.step <= 4) {
      ctx.fillStyle = '#f1c40f';
      ctx.font = '900 11px "Impact", "Arial Black", monospace';
      ctx.textAlign = 'center';
      ctx.fillText("★ CANALIZACIÓN DE MEDELLÍN: EL ORIGEN DEL MONSTRUO ★", this.vWidth / 2, 16);

      const panelW = 122;
      const panelH = 205;
      const startX = 40;
      const gap = 20;
      const panelY = 22;

      const panelKeys = ['cutscene_rat_1', 'cutscene_rat_2', 'cutscene_rat_3', 'cutscene_rat_4'];
      const panelTitles = ["I. ALIMENTO TÍPICO", "II. CRIATURA INOCENTE", "III. REACCIÓN EN CADENA", "IV. RATA MUTANTE GIGANTE"];

      for (let i = 0; i < 4; i++) {
        const px = startX + i * (panelW + gap);
        const isCurrent = (i + 1 === rc.step);
        const isRevealed = (i + 1 <= rc.panelsRevealed);

        const borderCol = isCurrent ? '#f1c40f' : (isRevealed ? '#3498db' : '#2c3e50');
        const borderW = isCurrent ? 3 : 1.5;

        ctx.fillStyle = '#110e20';
        ctx.fillRect(px, panelY, panelW, panelH);

        if (isRevealed) {
          const img = window.spriteManager.getImage(panelKeys[i]);
          if (img && img.complete) {
            ctx.drawImage(img, px + 2, panelY + 2, panelW - 4, panelH - 4);
          }
          if (isCurrent && i === 2) {
            ctx.strokeStyle = `rgba(46, 204, 113, ${Math.random() * 0.7 + 0.3})`;
            ctx.lineWidth = 2;
            ctx.strokeRect(px + 3, panelY + 3, panelW - 6, panelH - 6);
          } else if (isCurrent && i === 3) {
            ctx.strokeStyle = `rgba(231, 76, 60, ${Math.random() * 0.7 + 0.3})`;
            ctx.lineWidth = 3;
            ctx.strokeRect(px + 2, panelY + 2, panelW - 4, panelH - 4);
          }
        } else {
          ctx.fillStyle = '#1e1a30';
          ctx.fillRect(px + 2, panelY + 2, panelW - 4, panelH - 4);
          ctx.fillStyle = '#55506a';
          ctx.font = '900 28px monospace';
          ctx.textAlign = 'center';
          ctx.fillText("?", px + panelW / 2, panelY + panelH / 2 + 10);
        }

        ctx.strokeStyle = borderCol;
        ctx.lineWidth = borderW;
        ctx.strokeRect(px, panelY, panelW, panelH);

        ctx.fillStyle = isCurrent ? '#f1c40f' : '#7f8c8d';
        ctx.font = '900 7px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(panelTitles[i], px + panelW / 2, panelY + panelH + 10);
      }

      const boxW = 560;
      const boxH = 92;
      const boxX = (this.vWidth - boxW) / 2;
      const boxY = 252;

      ctx.fillStyle = 'rgba(16, 12, 28, 0.96)';
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 8);
      ctx.fill();
      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 2;
      ctx.stroke();

      let stepHeader = "";
      let stepDesc1 = "";
      let stepDesc2 = "";

      if (rc.step === 1) {
        stepHeader = "★ UN ALIMENTO TÍPICO DE LA METRÓPOLIS ★";
        stepDesc1 = "Se encuentra un alimento típico de esta zona de la metrópolis abandonado en el andén:";
        stepDesc2 = "Pan esponjoso, salchicha, ripio crocante de papa, salsas caseras y un huevito de codorniz intacto.";
      } else if (rc.step === 2) {
        stepHeader = "★ LA INOCENTE CRIATURA SE ACERCA ★";
        stepDesc1 = "Como una inocente criatura de las alcantarillas se acerca curiosa para deleitarse con el manjar.";
        stepDesc2 = "¡Clava sus pequeños dientes en el embutido y mastica sin sospechar lo que está por ocurrir!";
      } else if (rc.step === 3) {
        stepHeader = "★ ¡¡COMBUSTIÓN METABÓLICA Y REACCIÓN EN CADENA!! ★";
        stepDesc1 = "¡Y es tanto el sabor y deliciosas miles de calorías que se metabolizan en una inesperada reacción en cadena!";
        stepDesc2 = "¡Rayos verdes recorren sus venas, sus ojos hierven de luz y su ADN se altera a velocidad extrema!";
      } else if (rc.step === 4) {
        stepHeader = "★ ¡¡CRIATURA JAMÁS VISTA: LA RATA MUTANTE GIGANTE!! ★";
        stepDesc1 = "¡Generando una criatura colosal jamás vista anteriormente en la historia de la metrópolis!";
        stepDesc2 = "¡¡LA FAMOSA RATA MUTANTE GIGANTE DE LA VILLA DEL ABURRÁ RUGE EN LA CANALIZACIÓN CON HAMBRE VORAZ!!";
      }

      ctx.fillStyle = '#f1c40f';
      ctx.font = '900 9.5px "Impact", "Arial Black", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(stepHeader, boxX + 16, boxY + 18);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px monospace';
      ctx.fillText(stepDesc1, boxX + 16, boxY + 36);

      ctx.fillStyle = '#bdc3c7';
      ctx.fillText(stepDesc2, boxX + 16, boxY + 50);

      const pulse = Math.sin(Date.now() / 120) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(241, 196, 15, ${pulse})`;
      ctx.font = '900 8.5px monospace';
      ctx.textAlign = 'right';
      ctx.fillText("[ ESPACIO / CLICK ] CONTINUAR ▶", boxX + boxW - 16, boxY + 82);
    } else if (rc.step === 5) {
      const chaserImg = window.spriteManager.getImage('rata_mutante_chase');
      if (chaserImg && chaserImg.complete) {
        ctx.save();
        ctx.globalAlpha = 0.45;
        ctx.drawImage(chaserImg, 320, 20, 310, 340);
        ctx.restore();
      }

      const modalW = 480;
      const modalH = 220;
      const mx = (this.vWidth - modalW) / 2;
      const my = (this.vHeight - modalH) / 2;

      ctx.fillStyle = 'rgba(12, 10, 24, 0.97)';
      ctx.beginPath();
      ctx.roundRect(mx, my, modalW, modalH, 12);
      ctx.fill();
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#f1c40f';
      ctx.font = '900 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText("★ SALTO DE FE COMPLETADO ★", this.vWidth / 2, my + 28);

      ctx.font = '900 16px "Impact", "Arial Black", monospace';
      ctx.fillStyle = '#e74c3c';
      ctx.fillText("NIVEL 3: DESCENSO POR LA CANALIZACIÓN", this.vWidth / 2, my + 54);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8.5px monospace';
      ctx.fillText("¡Juancho cayó deslizándose a toda velocidad por la rampa diagonal!", this.vWidth / 2, my + 82);
      ctx.fillText("¡Detrás de ti ruge la RATA MUTANTE GIGANTE con sus fauces abiertas!", this.vWidth / 2, my + 100);
      ctx.fillStyle = '#f39c12';
      ctx.fillText("¡Esquiva los obstáculos y la basura del canal antes de que te trague entero!", this.vWidth / 2, my + 122);

      const pulse = Math.sin(Date.now() / 100) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(231, 76, 60, ${pulse})`;
      ctx.fillRect(this.vWidth / 2 - 160, my + 150, 320, 36);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(this.vWidth / 2 - 160, my + 150, 320, 36);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 10px "Impact", monospace';
      ctx.fillText("▶ [ ESPACIO / ENTER / CLICK ] INICIAR DESCENSO ◀", this.vWidth / 2, my + 173);
    }

    if (rc.flash > 0) {
      ctx.fillStyle = `rgba(46, 204, 113, ${rc.flash * 0.4})`;
      ctx.fillRect(0, 0, this.vWidth, this.vHeight);
    }

    ctx.restore();
  },

  canalToWorldCoords(rx, ry) {
    const rampStartX = -60;
    const rampStartY = 110;
    const slopeAngle = 0.36; // radianes (~20.6°)
    const cosA = Math.cos(slopeAngle);
    const sinA = Math.sin(slopeAngle);
    return {
      x: Math.round(rampStartX + rx * cosA - ry * sinA),
      y: Math.round(rampStartY + rx * sinA + ry * cosA)
    };
  },

  initCanalDescent() {
    this.canal.active = true;
    this.canal.distance = 0;
    this.canal.elapsedTime = 0;
    this.canal.initialSpeed = 30;  // Comienza a 30 km/h (controlable y medible)
    this.canal.speed = 30;
    this.canal.maxSpeed = 300;     // Acelera progresivamente hasta 300 km/h
    this.canal.acceleration = 6.75; // Incremento progresivo (~40s para alcanzar 300 km/h)
    this.canal.ratChompAnim = 0;
    this.canal.ratBiteHit = false;
    this.canal.rat = {
      state: 'waiting',       // 'waiting' (0-3s sin ataque para acostumbrarse), 'entering' (0.85s dash-in con escombros), 'chasing'
      introTimer: 3.0,        // 3 segundos de gracia inicial
      enterDuration: 0.85,    // Entrada rápida de izquierda a derecha
      enterTimer: 0,
      x: -650,                // Comienza totalmente fuera de pantalla a la izquierda
      y: -55,
      debrisParticles: [],
      roarPlayed: false
    };
    this.boss.screenShake = 0;      // Asegurar pantalla 100% fija sin vibraciones residuales
    this.boss.flashTimer = 0;
    this.cameraX = 0;
    this.canal.loopLength = 3000;
    this.canal.obstacles = [
      { u: 650,  laneY: 10, type: 'gamin_dormido',     sprite: 'obs_gamin_dormido',     w: 74, h: 28, label: 'GAMIN DORMIDO', hit: false },
      { u: 1100, laneY: 26, type: 'inodoro_destruido', sprite: 'obs_inodoro_destruido', w: 44, h: 48, label: 'INODORO ROTO', hit: false },
      { u: 1550, laneY: 16, type: 'prepago',           sprite: 'obs_prepago',           w: 36, h: 74, label: 'MODELO PREPAGO', hit: false },
      { u: 2000, laneY: 6,  type: 'taxista_cruceta',   sprite: 'obs_taxista_cruceta',   w: 54, h: 66, label: 'TAXISTA CON CRUCETA', hit: false },
      { u: 2450, laneY: 24, type: 'colchon_viejo',     sprite: 'obs_colchon_viejo',     w: 70, h: 38, label: 'COLCHON VIEJO', hit: false },
      { u: 2900, laneY: 14, type: 'gallinazo',         sprite: 'obs_gallinazo',         w: 46, h: 42, label: 'GALLINAZO', hit: false }
    ];
    this.player.slopeX = 350;
    this.player.laneY = 16;
    this.player.elevY = 0;
    this.player.vy = 0;
    this.player.grounded = true;
    this.player.action = 'slide';
    this.player.actionTimer = 0;
    this.player.invulnerableTimer = 0;
    this.player.canDoubleJump = false;
    this.player.doubleJumped = false;
    this.player.facingRight = true;

    // Sistema de Señalización Vial Cuadrada Simplificada (Soterrado Medellín)
    this.canal.highwaySigns = {
      signs: [
        {
          id: '5km',
          triggerTime: 25.5,
          spriteKey: 'sign_soterrado_5km',
          title: 'SOTERRADO A 5 KM',
          subtext: 'AUTOPISTA SUR',
          triggered: false
        },
        {
          id: '3km',
          triggerTime: 30.5, // 5 segundos después de 5 km
          spriteKey: 'sign_soterrado_3km',
          title: 'SOTERRADO A 3 KM',
          subtext: 'AUTOPISTA SUR',
          triggered: false
        },
        {
          id: '2km',
          triggerTime: 33.5, // 3 segundos después de 3 km
          spriteKey: 'sign_soterrado_2km',
          title: 'SOTERRADO A 2 KM',
          subtext: 'AUTOPISTA SUR',
          triggered: false
        },
        {
          id: '1km',
          triggerTime: 36.1, // ~2.6 segundos después de 2 km
          spriteKey: 'sign_soterrado_1km',
          title: 'SOTERRADO A 1 KM',
          subtext: 'AUTOPISTA SUR',
          triggered: false
        },
        {
          id: '50m',
          triggerTime: 40.7, // +4.6 segundos (2 segundos más de espera tras 1 km)
          spriteKey: 'sign_soterrado_50m',
          title: 'SOTERRADO A 50 M',
          subtext: '¡ENTRADA INMINENTE!',
          isFinal: true,
          triggered: false
        }
      ],
      activeSignIndex: -1,
      activeTimer: 0,
      cornerSlide: 0,
      cornerAlpha: 0
    };

    // Sistema del Clímax: Ingreso al Soterrado y Choque de la Rata Mutante
    this.canal.climax = {
      state: 'none',          // 'none', 'approaching', 'entered', 'crashed', 'victory'
      triggerTime: 43.5,      // ~2.8s tras la señal de 50 m (con 40.7s para el aviso de 50 m)
      portalX: 1150,          // Comienza a la derecha en la rampa
      portalY: -190,          // Nivel alineado de la rampa del canal
      portalW: 320,           // Viaducto elaborado
      portalH: 260,
      hitstopTimer: 0,
      victoryTimer: 0,
      ratCrashed: false,
      debrisSpawned: false
    };
  },

  spawnCanalDebrisExplosion() {
    if (!this.canal.rat) return;
    const debrisKeys = [
      'debris_concrete_slab',
      'debris_concrete_chunk',
      'debris_pipe_shard',
      'debris_asphalt_rock',
      'debris_sludge_splash'
    ];
    
    // Generar 28 fragmentos de material volando dramáticamente en arco parabólico
    for (let i = 0; i < 28; i++) {
      const key = debrisKeys[i % debrisKeys.length];
      const speed = 230 + Math.random() * 380;
      const angle = (Math.random() * 0.65 - 0.22) * Math.PI; // Dispersión hacia la derecha y hacia arriba
      this.canal.rat.debrisParticles.push({
        spriteKey: key,
        x: 130 + (Math.random() * 50 - 25),
        y: 85 + (Math.random() * 40 - 20),
        vx: Math.cos(angle) * speed + 90,
        vy: -Math.abs(Math.sin(angle)) * speed - 70,
        gravity: 580 + Math.random() * 180,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 15,
        scale: 0.65 + Math.random() * 0.55,
        life: 2.2 + Math.random() * 0.9,
        bounces: 0
      });
    }

    // Partículas adicionales de polvo y lodo
    for (let k = 0; k < 22; k++) {
      this.particles.push({
        x: 140 + Math.random() * 60,
        y: 110 + Math.random() * 50,
        vx: 140 + Math.random() * 240,
        vy: -150 - Math.random() * 190,
        size: 3 + Math.random() * 4,
        color: Math.random() < 0.4 ? '#7f8c8d' : (Math.random() < 0.5 ? '#e67e22' : '#16a085'),
        life: 0.8 + Math.random() * 0.7,
        maxLife: 1.5
      });
    }
  },

  spawnSoterradoCrashDebris(originSlopeX, originSlopeY) {
    if (!this.canal.rat) return;
    const debrisKeys = [
      'debris_concrete_slab',
      'debris_concrete_chunk',
      'debris_pipe_shard',
      'debris_asphalt_rock',
      'debris_sludge_splash'
    ];
    const worldPos = this.canalToWorldCoords(originSlopeX, originSlopeY);
    for (let i = 0; i < 42; i++) {
      const key = debrisKeys[i % debrisKeys.length];
      const speed = 260 + Math.random() * 460;
      const angle = (Math.random() * 0.8 - 0.4) * Math.PI;
      this.canal.rat.debrisParticles.push({
        spriteKey: key,
        x: worldPos.x + (Math.random() * 40 - 20),
        y: worldPos.y + (Math.random() * 40 - 20),
        vx: -Math.cos(angle) * speed - 80, // Hacia la izquierda rebotando del muro
        vy: -Math.abs(Math.sin(angle)) * speed - 90,
        gravity: 620 + Math.random() * 180,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 22,
        scale: 0.75 + Math.random() * 0.75,
        life: 3.2 + Math.random() * 1.0,
        bounces: 0
      });
    }

    // Nubes densas de polvo de cemento y esquirlas
    for (let k = 0; k < 35; k++) {
      this.particles.push({
        x: worldPos.x + (Math.random() - 0.5) * 60,
        y: worldPos.y + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.75) * 320,
        vy: -70 - Math.random() * 220,
        size: 4 + Math.random() * 6,
        color: Math.random() < 0.6 ? '#bdc3c7' : (Math.random() < 0.5 ? '#f1c40f' : '#7f8c8d'),
        life: 1.4 + Math.random() * 0.8,
        maxLife: 2.2
      });
    }
  },

  updateCanal(dt) {
    if (!this.canal.active) return;

    // Pausa dramática por hitstop en el choque del soterrado
    if (this.canal.climax && this.canal.climax.hitstopTimer > 0) {
      this.canal.climax.hitstopTimer -= dt;
      return;
    }

    // Decaimiento suave y rápido del temblor de impacto
    if (this.boss.screenShake > 0) {
      this.boss.screenShake -= dt * 4.5;
      if (this.boss.screenShake < 0.02) {
        this.boss.screenShake = 0;
      }
    }

    // Aceleración Progresiva del Descenso: empieza a 30 km/h y escala hasta 300 km/h
    this.canal.elapsedTime = (this.canal.elapsedTime || 0) + dt;
    const currentAcc = this.canal.acceleration || 6.75;
    const initSpd = this.canal.initialSpeed || 30;
    const maxSpd = this.canal.maxSpeed || 300;
    this.canal.speed = Math.min(maxSpd, initSpd + this.canal.elapsedTime * currentAcc);

    this.canal.distance += this.canal.speed * dt;
    this.canal.ratChompAnim += dt * (2.6 + (this.canal.speed / maxSpd) * 1.6);

    const p = this.player;

    // Actualización de la Rata Mutante y su entrada dramática
    if (this.canal.rat) {
      const rat = this.canal.rat;

      // Actualizar escombros y partículas de material
      for (let i = rat.debrisParticles.length - 1; i >= 0; i--) {
        const dp = rat.debrisParticles[i];
        dp.x += dp.vx * dt;
        dp.y += dp.vy * dt;
        dp.vy += dp.gravity * dt;
        dp.rotation += dp.rotSpeed * dt;
        dp.life -= dt;

        // Rebote elástico en el fondo de concreto del canal
        if (dp.y >= 270 && dp.vy > 0 && dp.bounces < 2) {
          dp.y = 270;
          dp.vy = -dp.vy * 0.45;
          dp.vx *= 0.72;
          dp.bounces++;
        }

        if (dp.life <= 0 || dp.x > 800) {
          rat.debrisParticles.splice(i, 1);
        }
      }

      // FASE 1: 3 segundos iniciales de gracia (sin atacar) para que el jugador se acostumbre a la dinámica
      if (rat.state === 'waiting') {
        rat.introTimer -= dt;
        if (rat.introTimer <= 0) {
          rat.state = 'entering';
          rat.enterTimer = 0;
          this.boss.screenShake = 1.35;
          if (window.retroAudio && window.retroAudio.playHeavyHit) window.retroAudio.playHeavyHit();
          if (window.retroAudio && window.retroAudio.playBossSting) window.retroAudio.playBossSting(3);
          this.spawnCanalDebrisExplosion();
          const pCoords = this.canalToWorldCoords(p.slopeX || 350, 30);
          this.addFloatingText(pCoords.x, pCoords.y - 20, "¡¡¡ALERTA: LA RATA GIGANTE SURGE DEL DRENAJE!!! 🐀💥", "#e74c3c");
        }
      }
      // FASE 2: Aparición veloz de izquierda a derecha con estallido de escombros de material
      else if (rat.state === 'entering') {
        rat.enterTimer += dt;
        const t = Math.min(1.0, rat.enterTimer / rat.enterDuration);
        const ease = 1 - Math.pow(1 - t, 3); // Aceleración cúbica hacia adentro y desaceleración impactante
        rat.x = -650 + ease * 390; // Rápida transición de -650 hasta -260

        if (rat.enterTimer >= rat.enterDuration) {
          rat.state = 'chasing';
        }
      }
      // FASE 3: Persecución dinámica: a medida que aumenta la velocidad se acerca más y se aleja un poco; hacia el final a máxima velocidad se acerca cada vez más
      else if (rat.state === 'chasing') {
        const spdRatio = Math.max(0, Math.min(1.0, (this.canal.speed - initSpd) / (maxSpd - initSpd)));

        // Base progresiva: a baja velocidad (-270, lejos) hasta (-115 a alta velocidad)
        const baseOffset = -270 + (spdRatio * 155);

        // Dinámica depredadora ("se acerca más y se aleja un poco"):
        const ratCycle = (this.canal.ratChompAnim % 2.4);
        const chompCycle = ratCycle;
        let lungeDist = 0;
        if (chompCycle < 1.1) {
          // Fase rugido / acecho: retrocede ligeramente para tomar impulso (-16px)
          lungeDist = Math.sin((chompCycle / 1.1) * Math.PI) * 16 - 16;
        } else if (chompCycle < 1.7) {
          // Fase carrera rabiosa: se abalanza ganando terreno (+48px)
          lungeDist = ((chompCycle - 1.1) / 0.6) * 48;
        } else {
          // Fase mordisco voraz: embestida máxima hacia las ruedas/pies
          const snapT = (chompCycle - 1.7) / 0.7;
          lungeDist = 48 + (1 - snapT) * 36;
        }

        // Hacia el final, cuando ya está alcanzando la velocidad máxima (240 a 300 km/h), se acerca cada vez más y más
        const climaxRush = Math.pow(spdRatio, 2.5) * 58;

        const targetRatX = baseOffset + lungeDist + climaxRush;
        rat.x += (targetRatX - rat.x) * 0.16; // Suavizado orgánico arcade

        // Mecánica de mordisco snap sincronizada con la posición real de las fauces
        if (ratCycle >= 1.7 && !this.canal.ratBiteHit) {
          const ratSnoutX = rat.x + 405; // Extremo frontal de las fauces
          if (p.slopeX <= ratSnoutX + 22 && p.invulnerableTimer <= 0 && p.action !== 'hurt') {
            this.canal.ratBiteHit = true;
            p.hp = Math.max(0, p.hp - 25);
            p.invulnerableTimer = 1.0;
            p.action = 'hurt';
            p.actionTimer = 0.45;
            p.slopeX = Math.min(460, p.slopeX + 80); // Empuje hacia adelante para darle oportunidad de acelerar
            this.boss.screenShake = 0.75;
            if (window.retroAudio && window.retroAudio.playHit) window.retroAudio.playHit();
            const bitePos = this.canalToWorldCoords(p.slopeX, 30 + (p.laneY || 16) - 35);
            this.addFloatingText(bitePos.x, bitePos.y, "-25 HP ¡MORDISCO DE RATA COLOSAL!", "#e74c3c");
          }
        } else if (ratCycle < 1.1) {
          this.canal.ratBiteHit = false;
        }
      }
    }

    // Revivir a Juancho si la vida llega a cero en la canalización
    if (p.hp <= 0 && p.action !== 'hurt') {
      p.hp = 100;
      p.slopeX = 380;
      p.invulnerableTimer = 2.0;
      this.boss.screenShake = 0.5;
      const respawnPos = this.canalToWorldCoords(p.slopeX, 30 + (p.laneY || 16) - 35);
      this.addFloatingText(respawnPos.x, respawnPos.y, "¡REVIVISTE! ¡NO DEJES QUE LA RATA TE ALCANCE! 🔥", "#e74c3c");
      if (window.retroAudio && window.retroAudio.playHeavyHit) window.retroAudio.playHeavyHit();
    }

    // 1. Temporizadores de acción e invulnerabilidad
    if (p.invulnerableTimer > 0) p.invulnerableTimer -= dt;
    if (p.actionTimer > 0) {
      p.actionTimer -= dt;
      if (p.actionTimer <= 0 && p.action !== 'slide') {
        p.action = p.grounded ? 'slide' : 'jump';
      }
    }

    // 2. Control de Movimiento Horizontal sobre la Rampa (A / D, Flechas Izq / Der)
    if (this.keys.left) {
      p.slopeX = Math.max(260, p.slopeX - 220 * dt);
    }
    if (this.keys.right) {
      p.slopeX = Math.min(480, p.slopeX + 220 * dt);
    }

    // 3. Control de Carril a lo ancho de la Canalización (W / S, Flechas Arriba / Abajo)
    if (this.keys.up && p.grounded && !this.keys.jump) {
      p.laneY = Math.max(2, p.laneY - 95 * dt);
    }
    if (this.keys.down && p.grounded) {
      p.laneY = Math.min(34, p.laneY + 95 * dt);
    }

    // 4. Salto y Doble Salto de Juancho (Espacio, W o Tecla de Salto)
    if ((this.keys.jump || (this.keys.up && !p.grounded)) && p.action !== 'hurt') {
      if (p.grounded) {
        this.triggerJump();
      } else if (!p.doubleJumped && p.canDoubleJump && p.actionTimer <= 0.28) {
        this.triggerJump();
      }
    }

    // Físicas verticales del salto y doble salto con sostén en el aire
    if (!p.grounded) {
      if (p.action === 'doublejump') {
        // Fase de Sostén en el Aire durante la Vuelta 360° (Hang-Time Acrobático):
        // Se sostiene en el aire brevemente mientras completa el giro
        p.elevY = Math.min(96, p.elevY + 22 * dt);
        if (p.actionTimer <= 0) {
          p.action = 'jump';
          p.vy = 80; // Comienza a descender suavemente tras completar el giro
        }
      } else {
        // Gravedad normal de descenso
        p.vy += 980 * dt;
        p.elevY -= p.vy * dt;
        if (p.elevY <= 0) {
          p.elevY = 0;
          p.vy = 0;
          p.grounded = true;
          p.doubleJumped = false;
          p.canDoubleJump = false;
          p.action = 'slide';
          if (window.retroAudio && window.retroAudio.playLand) window.retroAudio.playLand();
        }
      }
    }

    // 5. Ataque / Patada para destruir obstáculos (J, Z, Botón de Ataque)
    if (this.keys.attack && p.actionTimer <= 0 && p.action !== 'hurt') {
      p.action = p.grounded ? 'kick' : 'jumpkick';
      p.actionTimer = 0.28;
      if (window.retroAudio && window.retroAudio.playKick) window.retroAudio.playKick();
    }

    // 6. Colisión y Destrucción de Obstáculos en el Descenso
    const loopLen = this.canal.loopLength || 2600;
    const currentScroll = (this.canal.distance * 2.8) % loopLen;

    this.canal.obstacles.forEach(obs => {
      // Manejo de temporizador de impacto / destrucción
      if (obs.hitTimer > 0) {
        obs.hitTimer -= dt;
        if (obs.hitTimer <= 0) {
          obs.hit = false;
          obs.u = (obs.u + loopLen) % (loopLen * 2); // Recicla el obstáculo tanto en patada como en choque
        }
      }

      let obsX = (obs.u - currentScroll + loopLen) % loopLen;
      if (obsX > 900) obsX -= loopLen;

      const distX = Math.abs(p.slopeX - obsX);
      const distLane = Math.abs(p.laneY - obs.laneY);
      const hitDistX = (obs.w / 2) + 12;
      const hitDistLane = 16;

      if (distX < hitDistX && distLane < hitDistLane) {
        // Interacción especial: Rebote elástico en colchón viejo
        if (obs.type === 'colchon_viejo' && !p.grounded && p.vy > 0 && p.elevY < obs.h + 20) {
          p.vy = -440;
          const bouncePos = this.canalToWorldCoords(p.slopeX, 30 + (p.laneY || 16) - (p.elevY || 0) - 25);
          this.addFloatingText(bouncePos.x, bouncePos.y, "+100 BOING (RESORTES)!", "#2ecc71");
          if (window.retroAudio && window.retroAudio.playJump) window.retroAudio.playJump();
        } else if ((p.action === 'kick' || p.action === 'jumpkick' || p.action === 'doublejump') && p.actionTimer > 0) {
          // Destrucción o desarme de obstáculo con patada o giro acrobático
          if (!obs.hit) {
            obs.hit = true;
            obs.hitTimer = 0.65;
            obs.hitType = 'kick';
            this.score += 200;
            this.boss.screenShake = 0.35;
            if (window.retroAudio && window.retroAudio.playHit) window.retroAudio.playHit();
            const hitLabels = {
              'taxista_cruceta': "+200 ¡DESARMADO (PATAS PA' ARRIBA)!",
              'gamin_dormido': '+150 ¡ASUSTADO EN EL AIRE!',
              'prepago': '+200 ¡DESPELUCADA (TACONES VOLANDO)!',
              'inodoro_destruido': '+200 ¡PORCELANA POR LOS AIRES!',
              'colchon_viejo': '+200 ¡RESORTES DISPARADOS!',
              'gallinazo': '+180 ¡DESPELUCADO / OJOS SALIDOS!'
            };
            const hitLabel = hitLabels[obs.type] || '+200 ¡DESTRUIDO!';
            const hitPos = this.canalToWorldCoords(obsX, 30 + obs.laneY - 35);
            this.addFloatingText(hitPos.x, hitPos.y, hitLabel, "#f1c40f");
            for (let k = 0; k < 8; k++) {
              const pPos = this.canalToWorldCoords(
                obsX + (Math.random() - 0.5) * 20,
                30 + obs.laneY - 12 + (Math.random() - 0.5) * 15
              );
              this.particles.push({
                x: pPos.x,
                y: pPos.y,
                vx: (Math.random() - 0.5) * 60,
                vy: -30 - Math.random() * 50,
                color: obs.type === 'inodoro_destruido' ? '#3498db' : '#f39c12',
                size: 4,
                life: 0.35,
                maxLife: 0.35
              });
            }
          }
        } else if (p.elevY > obs.h + 4) {
          // Salto limpio por encima del obstáculo
        } else if (p.invulnerableTimer <= 0 && !obs.hit) {
          // Impacto recibido contra obstáculo urbano (único obstáculo del escenario con daño)
          obs.hit = true;
          obs.hitTimer = 0.7;
          obs.hitType = 'crash';
          p.hp = Math.max(0, p.hp - 15);
          p.slopeX = Math.max(260, p.slopeX - 35); // El choque frena a Juancho hacia la rata
          p.invulnerableTimer = 0.85;
          p.action = 'hurt';
          p.actionTimer = 0.35;
          this.boss.screenShake = 0.55;
          if (window.retroAudio && window.retroAudio.playHit) window.retroAudio.playHit();
          const crashPos = this.canalToWorldCoords(p.slopeX, 30 + (p.laneY || 16) - 30);
          this.addFloatingText(crashPos.x, crashPos.y, "-15 HP (" + obs.label + ")", "#e74c3c");
        }
      }
    });

    // Actualización del Clímax del Nivel 3: Entrada al Soterrado y Choque de la Rata Mutante
    if (this.canal.climax) {
      const cl = this.canal.climax;
      if (cl.state === 'none' && this.canal.elapsedTime >= cl.triggerTime) {
        cl.state = 'approaching';
        const pCoords = this.canalToWorldCoords(p.slopeX || 350, 30);
        this.addFloatingText(pCoords.x, pCoords.y - 30, "🚨 ¡¡VIADUCTO SOTERRADO A LA VISTA!!", "#f1c40f");
        if (window.retroAudio && window.retroAudio.playTransitChime) {
          window.retroAudio.playTransitChime();
        }
      }

      if (cl.state === 'approaching') {
        // El portal se aproxima a alta velocidad hacia la izquierda
        cl.portalX -= (this.canal.speed * 2.25) * dt;

        // Obligar al personaje a deslizarse a ras de suelo para entrar por el gálibo
        if (cl.portalX < (p.slopeX || 350) + 260) {
          p.action = 'slide';
          p.grounded = true;
          p.elevY = 0;
          p.vy = 0;
        }

        // El héroe ingresa al viaducto soterrado a salvo
        if (cl.portalX <= (p.slopeX || 350) + 70) {
          cl.state = 'entered';
          p.action = 'slide';
          p.invulnerableTimer = 6.0;
          const pCoords = this.canalToWorldCoords(p.slopeX || 350, 30);
          this.addFloatingText(pCoords.x, pCoords.y - 25, "¡ENTRASTE AL SOTERRADO A SALVO! 🏎️💨", "#2ecc71");
        }
      } else if (cl.state === 'entered') {
        cl.portalX -= (this.canal.speed * 2.25) * dt;

        // La Rata Colosal alcanza el muro frontal del soterrado (no cabe por su gran tamaño)
        if (cl.portalX <= 380) {
          cl.state = 'crashed';
          cl.hitstopTimer = 0.35;
          this.boss.screenShake = 2.0;
          cl.ratCrashed = true;

          // Detener y noquear permanentemente a la rata contra el muro
          if (this.canal.rat) {
            this.canal.rat.state = 'crashed';
            this.canal.rat.x = cl.portalX - 380;
          }

          // Sonidos masivos de colisión y rugido noqueado
          if (window.retroAudio) {
            if (window.retroAudio.playHeavyHit) window.retroAudio.playHeavyHit();
            if (window.retroAudio.playThunderSlam) window.retroAudio.playThunderSlam();
            if (window.retroAudio.playMonsterRoar) window.retroAudio.playMonsterRoar();
          }

          // Explosión de escombros de concreto y polvo
          this.spawnSoterradoCrashDebris(cl.portalX + 40, cl.portalY + 120);

          const crashWorld = this.canalToWorldCoords(cl.portalX + 40, cl.portalY + 120);
          this.addFloatingText(crashWorld.x, crashWorld.y - 40, "💥 ¡¡BOOOOOOM!! ¡LA RATA SE ESTRELLÓ CONTRA EL SOTERRADO!", "#e74c3c");
        }
      } else if (cl.state === 'crashed') {
        cl.victoryTimer += dt;
        // Desaceleración suave del héroe deslizándose seguro dentro del túnel
        this.canal.speed = Math.max(0, this.canal.speed - 150 * dt);

        if (cl.victoryTimer >= 2.2) {
          cl.state = 'victory';
          this.canal.speed = 0;
          if (window.retroAudio && window.retroAudio.playFanfare) {
            window.retroAudio.playFanfare();
          }
        }
      }
    }

    // Actualización de los letreros viales cuadrados en esquina superior (Tránsito Medellín)
    if (this.canal.highwaySigns) {
      const hs = this.canal.highwaySigns;

      // 1. Verificación secuencial de activación por tiempo
      for (let idx = 0; idx < hs.signs.length; idx++) {
        const s = hs.signs[idx];
        if (!s.triggered && this.canal.elapsedTime >= s.triggerTime) {
          s.triggered = true;
          hs.activeSignIndex = idx;
          hs.activeTimer = 0;
          hs.cornerSlide = 0;

          // Chime sonoro auténtico de anuncio vial del Metro
          if (window.retroAudio && window.retroAudio.playTransitChime) {
            window.retroAudio.playTransitChime();
          }

          // Notificación flotante de tránsito breve
          const pCoords = this.canalToWorldCoords(p.slopeX || 350, 20);
          const alertColor = idx === 3 ? '#e74c3c' : '#2ecc71';
          this.addFloatingText(pCoords.x, pCoords.y - 30, `🚦 ${s.title}`, alertColor);
          break;
        }
      }

      // 2. Animación fluida de entrada, sostén estático y salida en la esquina superior
      if (hs.activeSignIndex >= 0) {
        hs.activeTimer += dt;
        const dur = 2.45; // Duración cómoda en pantalla
        if (hs.activeTimer < 0.2) {
          // Entrada elástica desde la derecha
          const t = hs.activeTimer / 0.2;
          hs.cornerSlide = 1 - Math.pow(1 - t, 3);
          hs.cornerAlpha = t;
        } else if (hs.activeTimer < dur - 0.25) {
          // Sostén 100% estático para lectura clara e inmediata
          hs.cornerSlide = 1.0;
          hs.cornerAlpha = 1.0;
        } else if (hs.activeTimer < dur) {
          // Salida suave hacia la derecha
          const t = (hs.activeTimer - (dur - 0.25)) / 0.25;
          hs.cornerSlide = 1.0 - t;
          hs.cornerAlpha = 1.0 - t;
        } else {
          hs.cornerSlide = 0;
          hs.cornerAlpha = 0;
        }
      }
    }
  },

  drawCanalStage3(ctx) {
    ctx.save();

    // Geometría del plano inclinado de la canalización (~20.6 grados)
    const rampStartX = -60;
    const rampStartY = 110;
    const slopeAngle = 0.36; // radianes (~20.6°)
    const slopeLength = 1000;

    ctx.save();
    ctx.translate(rampStartX, rampStartY);
    ctx.rotate(slopeAngle);

    // 1. CAPA RAPIDA DE LA RIBERA SUPERIOR (Baranda limpia, bancos y farol del Nivel 2, sin arbolitos)
    const promW = 1024;
    const scrollPromenade = Math.floor((this.canal.distance * 4.6) % promW);
    const promImg = window.spriteManager.getImage('canal_upper_promenade');
    if (promImg && promImg.complete) {
      for (let px = -promW; px < slopeLength + promW; px += promW) {
        ctx.drawImage(promImg, px - scrollPromenade, -65, promW, 110);
      }
    }

    // 2. SUELO DE LA CANALIZACIÓN CONTINUO (Pendiente de concreto, torrente y espuma)
    const bedW = 512;
    const scrollBed = Math.floor((this.canal.distance * 2.8) % bedW);
    const bedImg = window.spriteManager.getImage('canal_sliding_bed');
    if (bedImg && bedImg.complete) {
      for (let bx = -bedW; bx < slopeLength + bedW; bx += bedW) {
        ctx.drawImage(bedImg, bx - scrollBed, 30, bedW, 120);
      }
    }

    // 3. Obstáculos deslizándose a lo largo del plano diagonal
    const loopLenDraw = this.canal.loopLength || 2600;
    const currentScrollDraw = (this.canal.distance * 2.8) % loopLenDraw;

    this.canal.obstacles.forEach(obs => {
      let obsX = (obs.u - currentScrollDraw + loopLenDraw) % loopLenDraw;
      if (obsX > 900) obsX -= loopLenDraw;
      if (obsX > -80 && obsX < slopeLength) {
        const obsLocalY = 30 + obs.laneY;

        // 1. Sombra de contacto suave sobre el plano inclinado
        ctx.save();
        ctx.fillStyle = 'rgba(10, 15, 25, 0.45)';
        ctx.beginPath();
        ctx.ellipse(obsX, obsLocalY + 2, obs.w * 0.46, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 2. Renderizado del Sprite Auténtico CPS-3 (Intacto vs Hit / Destruido)
        let sprKey = obs.sprite;
        const isHit = obs.hit || (obs.hitTimer && obs.hitTimer > 0);
        if (isHit) {
          sprKey = obs.sprite + '_hit';
        } else if (obs.type === 'gallinazo') {
          const flap = Math.floor(Date.now() / 220) % 2 === 0;
          sprKey = flap ? 'obs_gallinazo' : 'obs_gallinazo_perched';
        }

        const obsImg = window.spriteManager.getImage(sprKey);
        if (obsImg && obsImg.complete) {
          // Relación de aspecto nativa del sprite para evitar cualquier deformación tanto intacto como destruido
          const aspect = (obsImg.naturalWidth && obsImg.naturalHeight) ? (obsImg.naturalWidth / obsImg.naturalHeight) : 1.0;
          const targetDim = Math.max(obs.w, obs.h) * (isHit ? 1.08 : 1.0);
          let drawW, drawH;
          if (aspect >= 1.0) {
            drawW = Math.round(targetDim);
            drawH = Math.round(targetDim / aspect);
          } else {
            drawH = Math.round(targetDim);
            drawW = Math.round(targetDim * aspect);
          }
          let drawY = obsLocalY - drawH + 2;
          if (isHit && obs.hitTimer > 0 && obs.hitType === 'kick') {
            drawY -= Math.sin((obs.hitTimer / 0.65) * Math.PI) * 28; // Salto en el aire al patearlo
          }
          ctx.drawImage(obsImg, Math.round(obsX - drawW / 2), Math.round(drawY), drawW, drawH);
        } else {
          ctx.fillStyle = '#e67e22';
          ctx.fillRect(Math.round(obsX - obs.w / 2), Math.round(obsLocalY - obs.h), obs.w, obs.h);
        }
      }
    });

    // 4. JUGADOR PLAYABLE (JUANCHO, LINA, DOÑA GLORIA, ETC.) CON SPRITES NATIVOS Y AUTÉNTICOS
    const p = this.player;
    const isPlayerBlink = p.invulnerableTimer > 0 && Math.floor(Date.now() / 65) % 2 === 0;
    const pAlpha = isPlayerBlink ? 0.5 : 1.0;
    let rotation = 0;

    const charId = this.selectedCharId || 'juancho';
    const charPrefix = (charId !== 'juancho') ? (charId + '_') : 'player_';

    let baseAction = 'downhill_slide';
    if (p.action === 'hurt') {
      baseAction = 'hurt';
    } else if (p.action === 'doublejump') {
      // Vuelta 360° en el aire con giro acrobático (usando jump_peak)
      baseAction = 'jump_peak';
      const dur = p.doubleJumpDuration || 0.42;
      const spinProgress = Math.max(0, Math.min(1, 1 - (p.actionTimer / dur)));
      rotation = spinProgress * Math.PI * 2;
    } else if (!p.grounded) {
      if (p.action === 'jumpkick') {
        baseAction = 'jumpkick';
      } else if (p.vy < -80) {
        baseAction = 'jump_ascend';
      } else if (Math.abs(p.vy) <= 80) {
        baseAction = 'jump_peak';
      } else {
        baseAction = 'jump_descend';
      }
    } else if (p.action === 'kick') {
      baseAction = 'kick_dragon';
    } else {
      // Posición oficial de descenso / deslizamiento por la rampa
      baseAction = 'downhill_slide';
    }

    // Resolver sprite de personaje auténtico CPS-3 con consistencia total
    let pSprite;
    if (baseAction === 'downhill_slide') {
      if (charId === 'juancho') {
        pSprite = 'player_kick_low';
      } else {
        pSprite = window.spriteManager.getImage(charPrefix + 'downhill_slide')
          ? (charPrefix + 'downhill_slide')
          : (window.spriteManager.getImage(charPrefix + 'kick_low') ? (charPrefix + 'kick_low') : 'player_kick_low');
      }
    } else {
      pSprite = charPrefix + baseAction;
      if (!window.spriteManager.getImage(pSprite)) {
        pSprite = 'player_' + baseAction;
      }
    }

    const pDrawX = Math.round(p.slopeX || 260);
    const pDrawY = Math.round(30 + (p.laneY || 16) - (p.elevY || 0));

    // Chispas de fricción bajo los tenis / patines cuando raspa el concreto
    if (p.grounded) {
      const sparkCycle = Math.floor(Date.now() / 50) % 3;
      ctx.fillStyle = '#f1c40f';
      for (let s = 0; s < 5; s++) {
        const sx = pDrawX - 26 - s * 7 - sparkCycle * 4;
        const sy = pDrawY - 3 + (Math.sin(s * 1.5 + Date.now() / 60) * 3);
        ctx.fillRect(sx, sy, 3, 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(sx + 1, sy, 2, 1);
      }
    }

    // 4.5. VIADUCTO SOTERRADO (PORTAL Y TÚNEL DE CONCRETO)
    if (this.canal.climax && this.canal.climax.state !== 'none') {
      const cl = this.canal.climax;
      const portalImg = window.spriteManager.getImage('soterrado_tunnel_portal');
      if (portalImg && portalImg.complete) {
        ctx.drawImage(portalImg, Math.round(cl.portalX), Math.round(cl.portalY), cl.portalW, cl.portalH);
      }
    }

    // Dibujar al personaje con el motor nativo de sprites (misma escala, anclaje y arte pixel)
    window.spriteManager.drawSprite(ctx, pSprite, pDrawX, pDrawY, true, pAlpha, rotation);

    // Si el jugador ya ingresó al túnel del soterrado, aplicar sombra y haz de luz de túnel
    if (this.canal.climax && (this.canal.climax.state === 'entered' || this.canal.climax.state === 'crashed' || this.canal.climax.state === 'victory')) {
      const cl = this.canal.climax;
      if (pDrawX >= cl.portalX + 40) {
        ctx.save();
        ctx.fillStyle = 'rgba(10, 15, 25, 0.45)';
        ctx.fillRect(cl.portalX + 40, cl.portalY + 140, 260, 95);
        ctx.restore();
      }
    }

    // (Pista de concreto del canal despejada para máxima legibilidad sin elementos móviles obstructivos)

    ctx.restore(); // Fin del plano rotado de la rampa

    // 5. Rata Mutante Colosal y Escombros de Material
    // Solo se dibuja si NO está en el periodo de espera de los 3s iniciales
    if (this.canal.rat && this.canal.rat.state !== 'waiting') {
      const rat = this.canal.rat;
      const ratCycle = (this.canal.ratChompAnim % 2.4);
      let currentRatKey = 'rata_colosal_open';

      if (ratCycle < 1.1) {
        currentRatKey = 'rata_colosal_open';
      } else if (ratCycle < 1.7) {
        currentRatKey = 'rata_colosal_rabid';
      } else {
        currentRatKey = 'rata_colosal_snap';
      }

      // Si la rata ya se estrelló contra el muro del soterrado, usar sprite noqueado y estrellas
      const cl = this.canal.climax;
      const isCrashed = cl && (cl.state === 'crashed' || cl.state === 'victory');
      if (isCrashed) {
        currentRatKey = 'rata_colosal_crashed';
      }

      const ratImg = window.spriteManager.getImage(currentRatKey) || window.spriteManager.getImage('rata_colosal_maw');
      if (ratImg && ratImg.complete) {
        const ratCos = Math.cos(slopeAngle);
        const ratSin = Math.sin(slopeAngle);
        const ratBob = isCrashed ? 0 : Math.sin(this.canal.ratChompAnim * 3.2) * 5;

        const ratDrawX = Math.round(rat.x * ratCos);
        const ratDrawY = Math.round(rat.x * ratSin + ratBob + (rat.y || -55));
        const ratDrawW = 460;
        const ratDrawH = 425;

        ctx.drawImage(ratImg, ratDrawX, ratDrawY, ratDrawW, ratDrawH);

        // Estrellas mareadas girando en órbita sobre la cabeza noqueada de la rata
        if (isCrashed) {
          const starTime = Date.now() / 140;
          const starCenterX = ratDrawX + 270;
          const starCenterY = ratDrawY + 90;
          ctx.save();
          ctx.fillStyle = '#f1c40f';
          for (let st = 0; st < 4; st++) {
            const stAngle = starTime + (st * Math.PI / 2);
            const stX = starCenterX + Math.cos(stAngle) * 45;
            const stY = starCenterY + Math.sin(stAngle) * 18;
            ctx.beginPath();
            ctx.arc(stX, stY, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          ctx.restore();
        }
      }
    }

    // Dibujar escombros de material (concreto reforzado, tubería rota, asfalto y lodo) saliendo despedidos
    if (this.canal.rat && this.canal.rat.debrisParticles && this.canal.rat.debrisParticles.length > 0) {
      this.canal.rat.debrisParticles.forEach(dp => {
        const dAlpha = Math.max(0, Math.min(1.0, dp.life / 0.5));
        window.spriteManager.drawSprite(ctx, dp.spriteKey, dp.x, dp.y, true, dAlpha, dp.rotation, dp.scale, dp.scale);
      });
    }

    // Banner de ayuda durante los 3 segundos iniciales de adaptación a la dinámica
    if (this.canal.rat && this.canal.rat.state === 'waiting') {
      ctx.save();
      ctx.fillStyle = 'rgba(15, 12, 28, 0.88)';
      ctx.fillRect(this.vWidth / 2 - 205, 48, 410, 24);
      ctx.strokeStyle = '#2ecc71';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(this.vWidth / 2 - 205, 48, 410, 24);
      ctx.fillStyle = '#f1c40f';
      ctx.font = '900 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText("★ CANALIZACIÓN DEL RÍO MEDELLÍN ★ [A/D] Maniobra • [W/S] Carril • [ESPACIO] Salto", this.vWidth / 2, 63);
      ctx.restore();
    }

    // 6. Ráfagas de viento y estelas de velocidad sincronizadas con la aceleración (30 a 300 KM/H)
    const spdRatio = Math.max(0.1, Math.min(1.0, this.canal.speed / 300));
    const windAlpha = 0.12 + spdRatio * 0.45;
    ctx.strokeStyle = 'rgba(210, 240, 255, ' + windAlpha.toFixed(2) + ')';
    ctx.lineWidth = 1.2 + spdRatio * 0.8;
    const timeSpeed = (Date.now() / 20) * (0.6 + spdRatio * 0.8);
    const cosA = Math.cos(slopeAngle);
    const sinA = Math.sin(slopeAngle);
    for (let i = 0; i < 9; i++) {
      const lineDist = ((slopeLength - (timeSpeed * 15 + i * 95) % 1100) + 1100) % 1100 - 100;
      const localY = 40 + (i * 18) % 120;
      const lineLen = 50 + (i * 14) % 45;
      const lx = rampStartX + lineDist * cosA - localY * sinA;
      const ly = rampStartY + lineDist * sinA + localY * cosA;
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx - lineLen * cosA, ly - lineLen * sinA);
      ctx.stroke();
    }

    // 7. AVISOS DEL SOTERRADO SIMPLIFICADOS EN ESQUINA SUPERIOR DERECHA (TRÁNSITO MEDELLÍN)
    if (this.canal.highwaySigns && this.canal.highwaySigns.cornerAlpha > 0 && this.canal.highwaySigns.activeSignIndex >= 0) {
      const hs = this.canal.highwaySigns;
      const activeSign = hs.signs[hs.activeSignIndex];
      const signImg = window.spriteManager.getImage(activeSign.spriteKey);

      if (signImg && signImg.complete) {
        ctx.save();
        ctx.globalAlpha = hs.cornerAlpha;

        const signW = 112;
        const signH = 98;
        // Posición compacta en la esquina superior derecha (no estorba la visión del juego)
        const targetX = this.vWidth - signW - 12; // 640 - 112 - 12 = 516
        const startX = this.vWidth + 10;
        const currentX = Math.round(startX + hs.cornerSlide * (targetX - startX));
        const currentY = 10;

        // Renderizado del letrero cuadrado oficial simplificado del soterrado
        ctx.drawImage(signImg, currentX, currentY, signW, signH);

        // Balizas intermitentes para el aviso de alerta inminente (A 50 M)
        if (activeSign.isFinal || hs.activeSignIndex === 4) {
          const blink = Math.floor(Date.now() / 130) % 2 === 0;
          if (blink) {
            ctx.fillStyle = '#f39c12';
            ctx.beginPath();
            ctx.arc(currentX + 11, currentY + 11, 4.5, 0, Math.PI * 2);
            ctx.arc(currentX + signW - 11, currentY + 11, 4.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(currentX + 11, currentY + 11, 2, 0, Math.PI * 2);
            ctx.arc(currentX + signW - 11, currentY + 11, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.restore();
      }
    }

    // 8. PANTALLA MODAL DE VICTORIA FINAL DEL NIVEL 3 (SOTERRADO SUPERADO)
    if (this.canal.climax && this.canal.climax.state === 'victory') {
      this.drawSoterradoVictoryModal(ctx);
    } else if (this.canal.climax && this.canal.climax.state === 'flooded_cutscene') {
      this.drawFloodedSoterradoCutscene(ctx);
    }

    ctx.restore();
  },

  drawSoterradoVictoryModal(ctx) {
    const modalW = 520;
    const modalH = 260;
    const mx = (this.vWidth - modalW) / 2;
    const my = (this.vHeight - modalH) / 2;

    ctx.save();
    // Oscurecimiento de fondo
    ctx.fillStyle = 'rgba(6, 5, 14, 0.88)';
    ctx.fillRect(0, 0, this.vWidth, this.vHeight);

    // Caja principal
    ctx.fillStyle = 'rgba(12, 10, 24, 0.98)';
    ctx.beginPath();
    ctx.roundRect(mx, my, modalW, modalH, 12);
    ctx.fill();
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Ribete interno
    ctx.strokeStyle = 'rgba(46, 204, 113, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(mx + 6, my + 6, modalW - 12, modalH - 12);

    // Título y Trofeo
    ctx.fillStyle = '#f1c40f';
    ctx.font = '900 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText("★ ★ ★ ¡¡ETAPA 3 SUPERADA!! ★ ★ ★", this.vWidth / 2, my + 26);

    ctx.fillStyle = '#2ecc71';
    ctx.font = '900 16px "Impact", "Arial Black", monospace';
    ctx.fillText("¡¡VICTORIA EN EL SOTERRADO DE MEDELLÍN!! 🏆", this.vWidth / 2, my + 50);

    // Cuadro de Diálogo del Héroe
    const activeHero = this.roster.find(c => c.id === this.selectedCharId) || this.roster[0];
    const heroQuotes = {
      'juancho': '"¡Esa rata no cupo por el gálibo del viaducto y se dio tremendo totazo contra el concreto! ¡Aprenda a respetar a la gente de la Villa!"',
      'lina': '"¡A 300 por hora nadie me gana en estos patines! ¡La rata se quedó con las ganas y un chichón gigante!"',
      'gloria': '"¡Ave María purísima, tremendo totazo se pegó ese animal! ¡Por fin quedó esa plaga aplastada contra el viaducto!"',
      'fuisioso': '"¡Todo bien, todo bonito! ¡Ni la rata más gigante puede con la furia fuisiosa de Medellín!"',
      'fico': '"¡Aquí estamos poniendo orden! Cero tolerancia con las ratas gigantes en el soterrado."'
    };
    const quote = heroQuotes[activeHero.id] || heroQuotes['juancho'];

    ctx.fillStyle = 'rgba(25, 20, 42, 0.9)';
    ctx.fillRect(mx + 18, my + 66, modalW - 36, 54);
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 1;
    ctx.strokeRect(mx + 18, my + 66, modalW - 36, 54);

    ctx.fillStyle = '#f1c40f';
    ctx.font = '900 9px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(activeHero.name + ":", mx + 28, my + 82);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.fillText(quote, mx + 28, my + 98, modalW - 56);

    // Tarjeta de Telemetría y Estadísticas
    const statsY = my + 130;
    ctx.fillStyle = 'rgba(18, 15, 30, 0.9)';
    ctx.fillRect(mx + 18, statsY, modalW - 36, 62);
    ctx.strokeStyle = '#2ecc71';
    ctx.strokeRect(mx + 18, statsY, modalW - 36, 62);

    ctx.font = '900 9px monospace';
    ctx.fillStyle = '#f1c40f';
    ctx.textAlign = 'left';
    ctx.fillText("🏁 DISTANCIA DESCENDIDA: " + Math.floor(this.canal.distance / 10) + " METROS", mx + 32, statsY + 20);
    ctx.fillText("⚡ VELOCIDAD MÁXIMA: 300 KM/H (MÁXIMA VELOCIDAD)", mx + 32, statsY + 38);

    ctx.fillStyle = '#2ecc71';
    ctx.fillText("🏆 PUNTUACIÓN TOTAL: " + this.score + " PTS", mx + 280, statsY + 20);
    ctx.fillText("❤️ SALUD: " + this.player.hp + " / " + this.player.maxHp + " HP (A SALVO)", mx + 280, statsY + 38);

    // Botón interactivo palpitante
    const pulse = Math.sin(Date.now() / 110) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(46, 204, 113, ${pulse})`;
    ctx.fillRect(this.vWidth / 2 - 180, my + 204, 360, 36);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(this.vWidth / 2 - 180, my + 204, 360, 36);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 11px "Impact", monospace';
    ctx.textAlign = 'center';
    ctx.fillText("▶  [ ESPACIO / ENTER / CLICK ] INGRESAR AL SOTERRADO ▶", this.vWidth / 2, my + 227);

    ctx.restore();
  }


};
