// game.js - Motor y Lógica Arcade "Aventura en Medellín: Villa del Aburrá"
// ENGINE: Streets of Rage 3 & 4 Belt-Scrolling Beat 'em Up Engine
// 7 Pilares: Belt-scrolling Z, 8 direcciones, Dash/Roll doble-tap, Combos 4 golpes,
// Agarres por proximidad y Súplex, Ataque Blitz, Especial 360° con vida verde recuperable SOR4,
// Flanqueo Z de enemigos, Hit-Freeze e Y-Sorting dinámico.

class MedellinGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    // Resolución interna 16:9 arcade HD (640 x 360)
    this.vWidth = 640;
    this.vHeight = 360;
    this.canvas.width = this.vWidth;
    this.canvas.height = this.vHeight;

    // Banda de profundidad de la calle / andén (Belt-Scrolling Z calibrado al andén)
    this.zMin = 286; // Límite superior exacto sobre el andén (evita flotar sobre muros/fondo)
    this.zMax = 340; // Límite inferior del andén y calzada
    this.floorZ = 310; // Centro de la banda caminable
    this.worldWidth = 2600; // Ancho del escenario de Nivel 1 (culmina en las escaleras)

    // Sistema de etapas y misiones de Medellín
    this.currentStage = 1; // 1: Villa del Aburrá / Viaducto, 2: Mirador Metrocable
    this.collectibles = [];
    this.quest = {
      active: true,
      talkedGloria: false,
      gaminSpawned: false,
      gaminKo: false,
      rappiKo: false,
      hasTicket: false
    };
    this.stageTransitionTimer = 0;

    // Cámara
    this.cameraX = 0;

    // Estado general del juego: 'TITLE' -> 'CHAR_SELECT' -> 'PLAYING'
    this.gameState = 'TITLE';
    this.titleTimer = 0;
    this.charSelectIndex = 0;
    this.charSelectConfirmTimer = 0;
    this.charSelectFlash = 0;

    // Roster de personajes para la pantalla de selección
    this.roster = [
      {
        id: 'juancho',
        name: 'JUANCHO',
        epithet: 'EL VENGADOR DE LA 80',
        alias: 'EL RAIL-WALKER',
        style: 'Acróbata Urbano / Patinador sobre Rieles',
        bio: 'Defensor de Belén y la Villa del Aburrá. Ágil y letal con su técnica de rieles.',
        special: '★ Súplex Callejero & Giro 360° Rompe-Huesos',
        speed: 4,
        power: 4,
        tech: 5,
        status: '★ LISTO ★',
        ready: true,
        color: '#2ecc71',
        portrait: 'portrait_juancho'
      },
      {
        id: 'lina',
        name: 'LINA',
        epithet: 'REINA DEL PATÍN DE BELÉN',
        alias: 'LA PATINADERA',
        style: 'Velocista Aérea / Patines en Línea',
        bio: 'Campeona callejera del patinódromo. Ataques aéreos y ráfagas de patadas sobre patines en línea.',
        special: '★ Huracán de Patines & Volea Aérea',
        speed: 5,
        power: 3,
        tech: 4,
        status: '★ LISTO ★',
        ready: true,
        color: '#2ecc71',
        portrait: 'portrait_lina'
      },
      {
        id: 'fuisioso',
        name: 'EL FUISIOSO',
        alias: 'EL HINCHA VIRAL DE MEDELLÍN',
        epithet: 'EL REY DEL CORTE 7',
        style: 'Agilidad Nea / Barra Brava Callejera',
        bio: '¡Todo bien, todo bonito, solo Nacional y fuisiosos! Flaco, eléctrico y letal con su botellazo y frenesí.',
        special: '★ Furia Verdiblanca & Patada Fuisiosa',
        speed: 5,
        power: 4,
        tech: 4,
        status: '🔒 NIVEL 3',
        ready: false,
        color: '#27ae60',
        portrait: 'portrait_fuisioso'
      },
      {
        id: 'gloria',
        name: 'DOÑA GLORIA',
        alias: 'LA FRITANGUERA',
        epithet: 'LA MATRIARCA DE LA VILLA',
        style: 'Fritanguera de Acero / Matriarca Brawler',
        bio: 'Alimenta al barrio con sus empanadas y castiga a los maleantes con su legendaria chancleta voladora.',
        special: '★ Tinto Hirviendo & Chancletazo Letal',
        speed: 3,
        power: 5,
        tech: 4,
        status: '★ LISTO ★',
        ready: true,
        color: '#f39c12',
        portrait: 'portrait_gloria'
      },
      {
        id: 'fico',
        name: 'EL ALCALDE',
        alias: 'FICO GUTIÉRREZ',
        epithet: 'EL GUARDIÁN DE LA ALCALDÍA',
        style: 'Brawler Institucional / Choque de Orden',
        bio: '¡Aquí estamos poniendo orden! Camisa abierta, mirada intensa y sonrisa incansable de campaña.',
        special: '★ Sonrisa de Campaña & Choque de Autoridad',
        speed: 3,
        power: 4,
        tech: 5,
        status: '🔒 CAMPAÑA',
        ready: false,
        color: '#2980b9',
        portrait: 'portrait_fico'
      }
    ];

    // Sistema de Hit-Freeze (Impact Stop estilo SOR4 / Arcade Capcom)
    this.hitFreezeTimer = 0;

    // Buffer de Doble Toque (Double-Tap) para Run y Rodadas Verticales
    this.inputBuffer = {
      lastTapKey: null,
      lastTapTime: 0
    };

    // ==========================================
    // 1. PROTAGONISTA: RAIL-WALKER (JUANCHO)
    // ==========================================
    this.player = {
      x: 80,
      z: this.floorZ,
      elevY: 0, // Altura en el aire sobre el suelo (salto/caída)
      vx: 0,
      vz: 0,
      vy: 0, // Velocidad vertical del salto/elevación
      width: 40,
      height: 108,
      facingRight: true,
      grounded: true,
      isDashing: false,
      action: 'idle', // idle, walk, run, roll, jump, jumpkick, punch, kick, blitz, grab, throw, special, hurt, sniff, eat
      actionTimer: 0,
      frame: 0,
      animTimer: 0,
      hp: 100,
      maxHp: 100,
      recoverableHp: 0, // Vida verde recuperable estilo Streets of Rage 4
      invulnerableTimer: 0,
      speedBoostTimer: 0,

      // Sistema de Combos Streets of Rage (4 golpes encadenados)
      comboStep: 0, // 0: neutro, 1: Jab Izq, 2: Recto Der, 3: Gancho al hígado, 4: Patada Dragón K.O.
      comboTimer: 0, // Ventana de cancelación para encadenar el siguiente golpe (0.38s)

      // Sistema de Agarre y Lanzamientos (Grappling & Suplex)
      grabbedEnemy: null,
      grabTimer: 0,
      grabHits: 0 // Rodillazos antes del lanzamiento automático (máx 2)
    };

    // ==========================================
    // 2. ENEMIGOS Y PROYECTILES
    // ==========================================
    this.enemies = [];
    this.projectiles = [];

    // Metrocable animado cruzando el cielo
    this.metrocable = {
      x: 200,
      y: 90,
      speed: 18,
      startX: -60,
      endX: 3000
    };

    // Moto de Rappi aparcada en el andén
    this.parkedMoto = {
      x: 1180,
      z: 330
    };

    // Palomas urbanas de Medellín (picoteando en el suelo y posadas en la baranda de parkour)
    this.pigeons = [
      { x: 360, z: 312, elevY: 0, flying: false, vx: 0, vy: 0, peckTimer: 0 },
      { x: 820, z: 288, elevY: 28, flying: false, vx: 0, vy: 0, peckTimer: 0 }, // Baranda de parkour
      { x: 1350, z: 308, elevY: 0, flying: false, vx: 0, vy: 0, peckTimer: 0 }, // Andén
      { x: 1920, z: 288, elevY: 28, flying: false, vx: 0, vy: 0, peckTimer: 0 }, // Baranda blanca
      { x: 2320, z: 320, elevY: 0, flying: false, vx: 0, vy: 0, peckTimer: 0 }  // Cerca al torniquete
    ];

    // Fauna urbana (Rata con De Todito / Cigarrillo o Cucarachas)
    this.critters = [];
    this.lastCritterSpawn = 0;

    // Efectos cómic y partículas
    this.floatingTexts = [];
    this.particles = [];

    // Puesto de empanadas "Doña Gloria"
    this.npc = {
      x: 260,
      z: 296,
      talking: false,
      dialogue: "¡Juancho mijo! Hable conmigo [F / Botón ACCIÓN] antes de meterse a los rieles..."
    };

    // ==========================================
    // 2.5. FINAL BOSS: TESTIGO DE JEHOVÁ (3 FASES)
    // ==========================================
    this.boss = {
      active: false,
      phase: 0, // 0: inactivo, 1: Hermano Fabio, 2: Trío Rezo, 3: Súper Testigo Titánico, 4: Derrotado
      phaseTimer: 0,
      phaseTransitionTimer: 0,
      screenShake: 0,
      flashTimer: 0,
      rainWarnings: [],
      shockwaves: [],
      defeated: false
    };

    // Sistema de Cinemática Graffiti y Estruendos de Entrada
    this.cutscene = {
      active: false,
      phase: 0,
      timer: 0,
      maxTimer: 0,
      animTimer: 0,
      title: "",
      subtitle: "",
      badge: "",
      fillColor: "#f1c40f",
      strokeColor: "#9b59b6"
    };

    // Puesto móvil de La Atalaya con revistas (Nivel 2)
    this.testigoCart = {
      x: 2180,
      z: this.floorZ - 10
    };

    // Cinemática de la Rata Mutante en la Canalización
    this.ratCutscene = {
      active: false,
      step: 1, // 1: Hotdog, 2: Rata comiendo, 3: Mutación, 4: Rata Mutante Gigante, 5: Salto / Intro N3
      timer: 0,
      stepTimer: 0,
      maxStepTimer: 4.5,
      shake: 0,
      flash: 0,
      panelsRevealed: 1
    };

    // Motor y dinámicas del Nivel 3: Descenso en bajada por la Canalización
    this.canal = {
      active: false,
      distance: 0,
      speed: 340,
      slopeAngle: 0.18, // Inclinación diagonal descendente (~10.5°)
      obstacles: [],
      spawnTimer: 0,
      ratChompAnim: 0,
      waterSplashTimer: 0
    };

    // Controles 8 Direcciones + Acciones Arcade
    this.keys = {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
      run: false
    };

    this.lastTime = performance.now();
    this.setupInputs();
    this.setupTouchControls();

    // Check URL parameters for direct scene navigation (debugging & character testing)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const screenParam = urlParams.get('screen');
      const charParam = urlParams.get('char');
      const playParam = urlParams.get('play');
      if (screenParam === 'char_select') {
        this.gameState = 'CHAR_SELECT';
        if (charParam === 'lina') this.charSelectIndex = 1;
        else if (charParam === 'fuisioso') this.charSelectIndex = 2;
        else if (charParam === 'gloria') this.charSelectIndex = 3;
        else if (charParam === 'fico') this.charSelectIndex = 4;
      } else if (playParam) {
        this.selectedCharId = playParam;
        this.gameState = 'PLAYING';
      }
    } catch (e) {}

    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  // ==========================================
  // CONFIGURACIÓN DE ENTRADAS Y DOBLE TOQUE
  // ==========================================
  advanceTitleScreen() {
    if (this.gameState !== 'TITLE') return;
    this.gameState = 'CHAR_SELECT';
    this.charSelectIndex = 0;
    this.charSelectConfirmTimer = 0;
    this.charSelectFlash = 0.5;
    if (window.retroAudio && window.retroAudio.playCollect) {
      window.retroAudio.playCollect();
    }
  }

  selectPrevChar() {
    if (this.gameState !== 'CHAR_SELECT') return;
    this.charSelectIndex = (this.charSelectIndex + this.roster.length - 1) % this.roster.length;
    if (window.retroAudio && window.retroAudio.playDash) {
      window.retroAudio.playDash();
    }
  }

  selectNextChar() {
    if (this.gameState !== 'CHAR_SELECT') return;
    this.charSelectIndex = (this.charSelectIndex + 1) % this.roster.length;
    if (window.retroAudio && window.retroAudio.playDash) {
      window.retroAudio.playDash();
    }
  }

  confirmCharSelect() {
    if (this.gameState !== 'CHAR_SELECT') return;
    const char = this.roster[this.charSelectIndex];
    if (char && char.ready) {
      this.charSelectConfirmTimer = 0.5;
      this.charSelectFlash = 1.0;
      if (window.retroAudio && window.retroAudio.playFanfare) {
        window.retroAudio.playFanfare();
      }
    } else {
      if (window.retroAudio && window.retroAudio.playHit) {
        window.retroAudio.playHit();
      }
    }
  }

  startGameWithCharacter(charId) {
    this.selectedCharId = charId || 'juancho';
    this.gameState = 'PLAYING';
    this.switchStage(1);
  }

  setupInputs() {
    const handleDoubleTap = (key) => {
      const now = performance.now();
      const dt = now - this.inputBuffer.lastTapTime;
      const isDouble = (this.inputBuffer.lastTapKey === key && dt < 280);
      this.inputBuffer.lastTapKey = key;
      this.inputBuffer.lastTapTime = now;
      return isDouble;
    };

    // Clic o toque en la pantalla
    this.canvas.addEventListener('click', (e) => {
      this.canvas.focus();
      if (this.gameState === 'TITLE') {
        this.advanceTitleScreen();
        return;
      }
      if (this.gameState === 'CHAR_SELECT') {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = (e.clientX - rect.left) * (this.vWidth / rect.width);
        const clickY = (e.clientY - rect.top) * (this.vHeight / rect.height);

        // Check if clicked on a character card
        const cardW = 92, cardH = 126, gap = 12;
        const totalW = this.roster.length * cardW + (this.roster.length - 1) * gap;
        const startX = (this.vWidth - totalW) / 2;
        const cardY = 44;

        for (let i = 0; i < this.roster.length; i++) {
          const cx = startX + i * (cardW + gap);
          if (clickX >= cx && clickX <= cx + cardW && clickY >= cardY && clickY <= cardY + cardH) {
            this.charSelectIndex = i;
            if (window.retroAudio && window.retroAudio.playDash) window.retroAudio.playDash();
            if (this.roster[i].ready) {
              this.confirmCharSelect();
            }
            return;
          }
        }

        // Check if clicked on bottom confirm button
        if (clickY >= this.vHeight - 44 && clickY <= this.vHeight - 8) {
          this.confirmCharSelect();
          return;
        }

        // Anywhere else confirms if ready
        this.confirmCharSelect();
        return;
      }

      if (this.ratCutscene && this.ratCutscene.active) {
        this.advanceRatCutscene();
      }
    });

    window.addEventListener('click', (e) => {
      if (this.ratCutscene && this.ratCutscene.active) {
        // Evitar que el clic en botones de UI interfiera
        if (e.target && e.target.tagName === 'BUTTON') return;
        this.advanceRatCutscene();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (window.retroAudio && window.retroAudio.init) { try { window.retroAudio.init(); } catch (err) {} }
      const k = e.key.toLowerCase();

      // Navegación en Pantalla de Título
      if (this.gameState === 'TITLE') {
        if (k === 'q' || k === 'j' || k === ' ' || k === 'enter' || k === 'f' || k === 'c' || k === 'e') {
          this.advanceTitleScreen();
          return;
        }
      }

      // Navegación en Menú de Selección de Personaje
      if (this.gameState === 'CHAR_SELECT') {
        if (k === 'arrowleft' || k === 'a') {
          this.selectPrevChar();
          return;
        }
        if (k === 'arrowright' || k === 'd') {
          this.selectNextChar();
          return;
        }
        if (k === 'q' || k === 'j' || k === ' ' || k === 'enter' || k === 'f' || k === 'c' || k === 'e') {
          this.confirmCharSelect();
          return;
        }
      }
      // Si la cinemática está activa, cualquier tecla de acción avanza el panel
      if (this.ratCutscene && this.ratCutscene.active) {
        if (k === ' ' || k === 'enter' || k === 'f' || k === 'c' || k === 'q' || k === 'e') {
          this.advanceRatCutscene();
          return;
        }
      }

      // Movimiento 8 direcciones
      if (k === 'arrowleft' || k === 'a') {
        if (!this.keys.left && handleDoubleTap('left')) {
          this.player.isDashing = true;
          if (window.retroAudio.playDash) window.retroAudio.playDash();
        }
        this.keys.left = true;
      }
      if (k === 'arrowright' || k === 'd') {
        if (!this.keys.right && handleDoubleTap('right')) {
          this.player.isDashing = true;
          if (window.retroAudio.playDash) window.retroAudio.playDash();
        }
        this.keys.right = true;
      }
      if (k === 'arrowup' || k === 'w') {
        if (!this.keys.up && handleDoubleTap('up')) {
          this.triggerVerticalRoll(-1);
        }
        this.keys.up = true;
      }
      if (k === 'arrowdown' || k === 's') {
        if (!this.keys.down && handleDoubleTap('down')) {
          this.triggerVerticalRoll(1);
        }
        this.keys.down = true;
      }

      // Salto
      if (k === ' ' || k === 'c') {
        this.triggerJump();
      }

      // Botón de Ataque / Combo / Blitz / Rodilla
      if (k === 'q' || k === 'j') {
        this.triggerAttack();
      }

      // Botón de Especial 360° / Súplex (Lanzamiento)
      if (k === 'e' || k === 'k' || k === 'x') {
        this.triggerSpecial();
      }

      // Correr / Dash
      if (k === 'shift') {
        this.keys.run = true;
      }

      // Interacción
      if (k === 'f' || k === 'enter') {
        this.interact();
      }

      // Atajos de desarrollo / cambio de nivel
      if (k === '1') this.switchStage(1);
      if (k === '2') this.switchStage(2);
      if (k === '3') this.switchStage(3);
      if (k === '4') this.startRatCutscene();
      if (k === 'm') {
        const playing = window.retroAudio.toggleBgm();
        this.addFloatingText(this.player.x, this.player.z - 100, playing ? "MÚSICA: ON" : "MÚSICA: OFF", "#f1c40f");
      }
    });

    window.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowleft' || k === 'a') {
        this.keys.left = false;
        if (!this.keys.right) this.player.isDashing = false;
      }
      if (k === 'arrowright' || k === 'd') {
        this.keys.right = false;
        if (!this.keys.left) this.player.isDashing = false;
      }
      if (k === 'arrowup' || k === 'w') this.keys.up = false;
      if (k === 'arrowdown' || k === 's') this.keys.down = false;
      if (k === 'shift') this.keys.run = false;
    });
  }

  setupTouchControls() {
    const bindBtn = (id, onDown, onUp) => {
      const el = document.getElementById(id);
      if (!el) return;
      let isPressed = false;

      const handleDown = (e) => {
        if (e && e.cancelable && e.type.startsWith('touch')) e.preventDefault();
        if (isPressed) return;
        isPressed = true;
        el.classList.add('pressed');
        if (window.retroAudio && window.retroAudio.init) { try { window.retroAudio.init(); } catch (err) {} }
        onDown();
      };

      const handleUp = (e) => {
        if (e && e.cancelable && e.type.startsWith('touch')) e.preventDefault();
        if (!isPressed) return;
        isPressed = false;
        el.classList.remove('pressed');
        if (onUp) onUp();
      };

      el.addEventListener('touchstart', handleDown, { passive: false });
      el.addEventListener('touchend', handleUp, { passive: false });
      el.addEventListener('touchcancel', handleUp, { passive: false });
      el.addEventListener('mousedown', handleDown);
      el.addEventListener('mouseup', handleUp);
      el.addEventListener('mouseleave', handleUp);
      el.addEventListener('click', (e) => {
        if (!isPressed) {
          handleDown(e);
          setTimeout(() => handleUp(e), 80);
        }
      });
    };

    // D-Pad Game Boy Color con soporte para selección de personaje
    bindBtn('btnLeft', () => {
      if (this.gameState === 'CHAR_SELECT') { this.selectPrevChar(); return; }
      this.keys.left = true;
    }, () => { this.keys.left = false; this.player.isDashing = false; });

    bindBtn('btnRight', () => {
      if (this.gameState === 'CHAR_SELECT') { this.selectNextChar(); return; }
      this.keys.right = true;
    }, () => { this.keys.right = false; this.player.isDashing = false; });

    bindBtn('btnUp', () => { this.keys.up = true; }, () => { this.keys.up = false; });
    bindBtn('btnDown', () => { this.keys.down = true; }, () => { this.keys.down = false; });

    // Botones de acción principales Game Boy Color
    bindBtn('btnJump', () => {
      if (this.gameState === 'TITLE') { this.advanceTitleScreen(); return; }
      if (this.gameState === 'CHAR_SELECT') { this.confirmCharSelect(); return; }
      this.triggerJump();
    });
    bindBtn('btnPunch', () => {
      if (this.gameState === 'TITLE') { this.advanceTitleScreen(); return; }
      if (this.gameState === 'CHAR_SELECT') { this.confirmCharSelect(); return; }
      this.triggerAttack();
    });
    bindBtn('btnKick', () => this.triggerSpecial());
    bindBtn('btnRun', () => { this.player.isDashing = !this.player.isDashing; });

    // Botón de ACCIÓN / HABLAR para celular
    bindBtn('btnInteract', () => {
      if (this.gameState === 'TITLE') { this.advanceTitleScreen(); return; }
      if (this.gameState === 'CHAR_SELECT') { this.confirmCharSelect(); return; }
      this.interact();
    });
    bindBtn('btnStart', () => {
      if (this.gameState === 'TITLE') { this.advanceTitleScreen(); return; }
      if (this.gameState === 'CHAR_SELECT') { this.confirmCharSelect(); return; }
      this.interact();
    });
    bindBtn('btnSelect', () => {
      if (window.retroAudio) {
        window.retroAudio.init();
        const isPlaying = window.retroAudio.toggleBgm();
        const musicBtn = document.getElementById('btnToggleMusic');
        if (musicBtn) {
          musicBtn.textContent = isPlaying ? "🎵 MÚSICA: ON" : "🎵 MÚSICA: OFF";
          musicBtn.style.color = isPlaying ? "#2ecc71" : "#f1c40f";
        }
      }
    });
  }

  // ==========================================
  // MOVILIDAD STREETS OF RAGE: SALTO Y RODADA VERTICAL
  // ==========================================
  triggerJump() {
    const p = this.player;
    if (p.action === 'grab' || p.action === 'throw' || p.action === 'special' || p.action === 'hurt') return;

    if (p.grounded) {
      // 1. Salto inicial desde el suelo
      p.vy = (this.currentStage === 3) ? -390 : -420;
      p.grounded = false;
      p.action = 'jump';
      p.canDoubleJump = true;
      p.doubleJumped = false;
      p.lastJumpTime = Date.now();
      if (window.retroAudio && window.retroAudio.playJump) window.retroAudio.playJump();
      if (this.currentStage !== 3) this.addDust(p.x, p.z);
    } else if (!p.doubleJumped && p.canDoubleJump) {
      // 2. Doble Salto Aéreo con Vuelta 360° y Sostén en el Aire (Hang-time acrobático)
      p.doubleJumped = true;
      p.canDoubleJump = false;
      p.action = 'doublejump';
      p.actionTimer = 0.42;
      p.doubleJumpDuration = 0.42;
      p.vy = (this.currentStage === 3) ? -160 : -180;
      if (window.retroAudio && window.retroAudio.playRoll) window.retroAudio.playRoll();
      if (window.retroAudio && window.retroAudio.playJump) window.retroAudio.playJump();

      if (this.currentStage === 3) {
        const ringPos = this.canalToWorldCoords(p.slopeX || 350, 30 + (p.laneY || 16) - (p.elevY || 0) - 20);
        this.addFloatingText(ringPos.x, ringPos.y - 15, "¡DOBLE SALTO AÉREO!", "#f1c40f");
        this.particles.push({
          x: ringPos.x,
          y: ringPos.y,
          color: '#f1c40f',
          isRing: true,
          life: 0.28,
          maxLife: 0.28
        });
      } else {
        this.addFloatingText(p.x, p.z - (p.elevY || 0) - 65, "¡DOBLE SALTO AÉREO!", "#f1c40f");
        this.particles.push({
          x: p.x,
          y: p.z - (p.elevY || 0) - 50,
          color: '#f1c40f',
          isRing: true,
          life: 0.28,
          maxLife: 0.28
        });
      }
    }
  }

  triggerVerticalRoll(dirZ) {
    const p = this.player;
    if (!p.grounded || p.action === 'grab' || p.action === 'throw' || p.action === 'special' || p.action === 'hurt') return;
    p.action = 'roll';
    p.actionTimer = 0.28;
    p.invulnerableTimer = 0.28;
    p.vz = dirZ * 220;
    if (window.retroAudio.playRoll) window.retroAudio.playRoll();
    this.addDust(p.x, p.z);
    this.addFloatingText(p.x, p.z - 80, dirZ < 0 ? "¡RODADA ARRIBA!" : "¡RODADA ABAJO!", "#3498db");
  }

  // ==========================================
  // COMBATE STREETS OF RAGE: COMBO, BLITZ, RODILLAZOS
  // ==========================================
  triggerAttack() {
    const p = this.player;

    // Nivel 3: Descenso en canalización (patada de barrido o patada aérea para destruir obstáculos)
    if (this.currentStage === 3) {
      if (p.actionTimer <= 0 && p.action !== 'hurt') {
        p.action = p.grounded ? 'kick' : 'jumpkick';
        p.actionTimer = 0.32;
        if (window.retroAudio && window.retroAudio.playKick) window.retroAudio.playKick();
      }
      return;
    }

    // 1. Si está agarrando a un enemigo -> RODILLAZO
    if (p.action === 'grab' && p.grabbedEnemy) {
      this.executeKneeStrike();
      return;
    }

    if (p.action === 'hurt' || p.action === 'throw' || p.action === 'special' || p.action === 'roll') return;

    // 2. Si está en el aire -> PATADA VOLADORA (Flying Jump Kick en pleno aire)
    if (!p.grounded) {
      p.action = 'jumpkick';
      p.actionTimer = 0.35;
      if (window.retroAudio.playKick) window.retroAudio.playKick();
      this.checkPlayerAttackHit('jumpkick');
      return;
    }

    // 3. Si está corriendo / dashing -> ATAQUE BLITZ (Embestida con hombro)
    if (p.action === 'run' || p.isDashing || this.keys.run) {
      p.action = 'blitz';
      p.actionTimer = 0.38;
      p.invulnerableTimer = 0.22;
      p.vx = (p.facingRight ? 1 : -1) * 340;
      if (window.retroAudio.playSpecial) window.retroAudio.playSpecial();
      this.addFloatingText(p.x, p.z - 110, "¡ATAQUE BLITZ!", "#e67e22");
      for (let i = 0; i < 4; i++) {
        this.addDust(p.x + (p.facingRight ? -20 : 20), p.z);
      }
      this.checkPlayerAttackHit('blitz');
      return;
    }

    // 4. Si presiona ABAJO + ATAQUE -> PATADA BAJA (Barrida a ras de suelo)
    if (this.keys.down) {
      p.action = 'lowkick';
      p.actionTimer = 0.28;
      p.vx = (p.facingRight ? 1 : -1) * 60;
      if (window.retroAudio.playKick) window.retroAudio.playKick();
      this.checkPlayerAttackHit('lowkick');
      return;
    }

    // 4.5. Si presiona ARRIBA + ATAQUE -> PATADA MEDIA DIRECTA (Roundhouse al pecho)
    if (this.keys.up) {
      p.action = 'midkick';
      p.actionTimer = 0.26;
      p.vx = (p.facingRight ? 1 : -1) * 45;
      if (window.retroAudio.playKick) window.retroAudio.playKick();
      this.checkPlayerAttackHit('midkick');
      return;
    }

    // 5. Cadena de Combos en el suelo (4 golpes diferenciados estilo Capcom CPS3 / SOR4):
    // Golpe 1: PUÑO DIRECTO (Jab frontal rápido)
    // Golpe 2: RECTO DE DERECHA (Cross potente con giro de cadera)
    // Golpe 3: PATADA MEDIA (Roundhouse lateral al pecho)
    // Golpe 4: GANCHO AL MENTÓN K.O. (Explosive Uppercut ascendente que lanza al enemigo)
    if (p.comboTimer > 0 && p.comboStep < 4) {
      p.comboStep++;
    } else {
      p.comboStep = 1;
    }
    p.comboTimer = 0.46; // Ventana para conectar el siguiente eslabón

    if (p.comboStep === 1) {
      p.action = 'punch'; // PUÑO DIRECTO (player_punch_jab)
      p.actionTimer = 0.20;
      if (window.retroAudio.playPunch) window.retroAudio.playPunch();
      this.checkPlayerAttackHit('combo1');
    } else if (p.comboStep === 2) {
      p.action = 'cross'; // RECTO DE DERECHA (player_punch_cross)
      p.actionTimer = 0.22;
      if (window.retroAudio.playPunch) window.retroAudio.playPunch();
      this.checkPlayerAttackHit('combo2');
    } else if (p.comboStep === 3) {
      p.action = 'midkick'; // PATADA MEDIA (player_kick_roundhouse)
      p.actionTimer = 0.25;
      if (window.retroAudio.playKick) window.retroAudio.playKick();
      this.checkPlayerAttackHit('combo3');
    } else if (p.comboStep === 4) {
      p.action = 'uppercut'; // GANCHO AL MENTÓN K.O. (player_punch_hook)
      p.actionTimer = 0.34;
      if (window.retroAudio.playHeavyHit) window.retroAudio.playHeavyHit();
      else if (window.retroAudio.playPunch) window.retroAudio.playPunch();
      this.checkPlayerAttackHit('combo4');
    }
  }

  // ==========================================
  // ESPECIAL 360° (VIDA VERDE SOR4) & SÚPLEX
  // ==========================================
  triggerSpecial() {
    const p = this.player;

    // Nivel 3: Descenso en canalización (giro acrobático 360° en el aire que destruye obstáculos)
    if (this.currentStage === 3) {
      if (p.actionTimer <= 0 && p.action !== 'hurt') {
        p.action = 'doublejump';
        p.actionTimer = 0.42;
        p.doubleJumpDuration = 0.42;
        p.vy = -200;
        p.grounded = false;
        p.canDoubleJump = false;
        p.doubleJumped = true;
        if (window.retroAudio && window.retroAudio.playRoll) window.retroAudio.playRoll();
        if (window.retroAudio && window.retroAudio.playJump) window.retroAudio.playJump();
        const ringPos = this.canalToWorldCoords(p.slopeX || 350, 30 + (p.laneY || 16) - (p.elevY || 0) - 20);
        this.addFloatingText(ringPos.x, ringPos.y - 15, "¡GIRO ACROBÁTICO 360°!", "#f1c40f");
        this.particles.push({
          x: ringPos.x,
          y: ringPos.y,
          color: '#f1c40f',
          isRing: true,
          life: 0.28,
          maxLife: 0.28
        });
      }
      return;
    }

    // Si está agarrando a un enemigo -> SÚPLEX TRASERO / LANZAMIENTO
    if (p.action === 'grab' && p.grabbedEnemy) {
      this.executeSuplex();
      return;
    }

    if (p.action === 'hurt' || p.action === 'throw' || p.action === 'special' || p.action === 'roll') return;

    // Ataque Especial Neutro 360° (Streets of Rage 4 Style)
    // Invulnerabilidad total de giro, daño en 360 grados
    // Costo: 15 HP que se convierten en "Vida Verde Recuperable"
    const hpCost = 15;
    if (p.hp > 18) {
      p.hp -= hpCost;
      p.recoverableHp = Math.min(p.maxHp - p.hp, p.recoverableHp + hpCost);
    } else {
      // Si tiene poca vida, consume lo que quede dejando 3 HP
      const available = Math.max(0, p.hp - 3);
      p.hp = 3;
      p.recoverableHp = Math.min(p.maxHp - p.hp, p.recoverableHp + available);
    }

    p.action = 'special';
    p.actionTimer = 0.46;
    p.invulnerableTimer = 0.50;
    if (window.retroAudio.playSpecial) window.retroAudio.playSpecial();

    this.addFloatingText(p.x, p.z - 120, "★ ESPECIAL 360° ★", "#f1c40f");
    this.boss.screenShake = 0.4;

    // Onda visual de choque 360°
    for (let a = 0; a < Math.PI * 2; a += 0.4) {
      this.particles.push({
        x: p.x + Math.cos(a) * 20,
        y: p.z - 45 + Math.sin(a) * 12,
        vx: Math.cos(a) * 180,
        vy: Math.sin(a) * 70,
        color: '#f1c40f',
        life: 0.28,
        size: 4
      });
    }

    this.checkPlayerAttackHit('special');
  }

  // ==========================================
  // SISTEMA DE AGARRES (GRAPPLE & SUPLEX)
  // ==========================================
  executeKneeStrike() {
    const p = this.player;
    const e = p.grabbedEnemy;
    if (!e || e.state === 'ko') {
      p.action = 'idle';
      p.grabbedEnemy = null;
      return;
    }

    p.grabHits++;
    p.actionTimer = 0.26;
    e.hp = Math.max(0, e.hp - 18);
    e.stateTimer = 0.35;
    e.invulnerableTimer = 0.25;

    if (window.retroAudio.playKick) window.retroAudio.playKick();
    this.hitFreezeTimer = 0.04;
    this.addHitSparks(e.x, e.z - 45);
    this.addFloatingText(e.x, e.z - 95, `¡RODILLAZO! (${p.grabHits}/2)`, "#f39c12");

    // Recuperar vida verde
    if (p.recoverableHp > 0) {
      const recovered = Math.min(p.recoverableHp, 6);
      p.recoverableHp -= recovered;
      p.hp = Math.min(p.maxHp, p.hp + recovered);
      this.addFloatingText(p.x, p.z - 135, `+${recovered} HP RECUPERADO`, "#2ecc71");
    }

    if (e.hp <= 0 || p.grabHits >= 2) {
      // Lanzamiento automático tras dos rodillazos
      setTimeout(() => {
        if (p.action === 'grab' && p.grabbedEnemy === e) {
          this.executeSuplex();
        }
      }, 120);
    }
  }

  executeSuplex() {
    const p = this.player;
    const e = p.grabbedEnemy;
    if (!e) {
      p.action = 'idle';
      return;
    }

    p.action = 'throw';
    p.actionTimer = 0.42;
    p.invulnerableTimer = 0.45;
    p.grabbedEnemy = null;

    const throwDir = p.facingRight ? -1 : 1; // Se lanza hacia la espalda de Juancho
    e.hp = Math.max(0, e.hp - 45);
    e.state = 'ko';
    e.stateTimer = 1.2;
    e.isFlyingBody = true; // Activa daño de bolos colateral contra multitudes
    e.vx = throwDir * 320;
    e.vy = -220;
    e.elevY = 40;
    e.facingRight = (throwDir > 0);

    if (window.retroAudio.playThrow) window.retroAudio.playThrow();
    this.hitFreezeTimer = 0.06;
    this.boss.screenShake = 0.5;

    this.addFloatingText(p.x, p.z - 120, "¡SÚPLEX CALLEJERO! 💥", "#e74c3c");
    this.addHitSparks(p.x + throwDir * 35, p.z - 30);
    for (let k = 0; k < 8; k++) {
      this.addDust(p.x + throwDir * 40, p.z);
    }

    // Recuperar vida verde por lanzamiento exitoso
    if (p.recoverableHp > 0) {
      const recovered = Math.min(p.recoverableHp, 12);
      p.recoverableHp -= recovered;
      p.hp = Math.min(p.maxHp, p.hp + recovered);
      this.addFloatingText(p.x, p.z - 140, `+${recovered} HP RECUPERADO`, "#2ecc71");
    }

    if (e.hp <= 0) {
      if (e.id === 'gamin' && !this.quest.gaminKo) {
        this.quest.gaminKo = true;
        this.spawnCollectible('item_sacol', e.x, e.z, 'sacol');
      } else if (e.id === 'rappi' && !this.quest.rappiKo) {
        this.quest.rappiKo = true;
        this.spawnCollectible('item_ticket', e.x - 15, e.z, 'ticket');
        this.spawnCollectible('delivery_box', e.x + 15, e.z, 'box');
      } else if (e.id === 'testigo') {
        this.handleTestigoDefeat(e);
      }
    }
  }

  // ==========================================
  // DETECCIÓN DE IMPACTOS EN 2.5D BELT-SCROLLING
  // ==========================================
  checkPlayerAttackHit(attackType) {
    const p = this.player;
    let reachX = 65;
    let reachZ = 18; // Tolerancia en la banda de profundidad (Z)
    let damage = 15;
    let isHeavy = false;
    let knockback = 120;
    let hitText = "¡POW!";
    let hitColor = "#f1c40f";

    if (attackType === 'combo1') {
      reachX = 64; damage = 14; knockback = 45; hitText = "¡PUÑO DIRECTO!"; hitColor = "#f1c40f";
    } else if (attackType === 'combo2') {
      reachX = 68; damage = 18; knockback = 70; hitText = "¡RECTO CRUZADO!"; hitColor = "#f39c12";
    } else if (attackType === 'combo3' || attackType === 'midkick') {
      reachX = 74; damage = 22; knockback = 110; hitText = "¡PATADA MEDIA!"; hitColor = "#e67e22";
    } else if (attackType === 'combo4') {
      reachX = 76; damage = 40; knockback = 310; hitText = "¡GANCHO AL MENTÓN K.O.!"; hitColor = "#e74c3c"; isHeavy = true;
    } else if (attackType === 'lowkick') {
      reachX = 76; damage = 20; knockback = 120; hitText = "¡PATADA BAJA!"; hitColor = "#f39c12"; isHeavy = true;
    } else if (attackType === 'jumpkick') {
      reachX = 74; damage = 30; knockback = 280; hitText = "¡PATADA VOLADORA!"; hitColor = "#e74c3c"; isHeavy = true;
    } else if (attackType === 'blitz') {
      reachX = 82; reachZ = 24; damage = 35; knockback = 340; hitText = "¡BLITZ TRAIL!"; hitColor = "#e67e22"; isHeavy = true;
    } else if (attackType === 'special') {
      reachX = 85; reachZ = 36; damage = 36; knockback = 320; hitText = "¡360° TOTAL!"; hitColor = "#9b59b6"; isHeavy = true;
    }

    let connected = false;

    this.enemies.forEach(e => {
      if (e.state === 'ko' && e.elevY <= 0) return;
      if (e === p.grabbedEnemy) return;

      const isFacing = (attackType === 'special') 
        ? true 
        : (p.facingRight && e.x >= p.x - 18) || (!p.facingRight && e.x <= p.x + 18);
      const distX = Math.abs(p.x - e.x);
      const distZ = Math.abs(p.z - e.z);
      const distElev = Math.abs(p.elevY - (e.elevY || 0));

      const effectiveReachX = reachX + (e.width ? Math.max(0, (e.width / 2) - 15) : 0);
      const effectiveReachElev = e.id === 'titan' ? 220 : 45;

      if (isFacing && distX <= effectiveReachX && distZ <= reachZ && distElev <= effectiveReachElev) {
        connected = true;
        e.hp = Math.max(0, e.hp - damage);
        e.invulnerableTimer = 0.28;

        if (window.retroAudio.playHit) window.retroAudio.playHit();
        this.addHitSparks(e.x, e.z - (e.id === 'titan' ? 140 : 50) - (e.elevY || 0));
        this.addFloatingText(e.x, e.z - (e.id === 'titan' ? 280 : 95) - (e.elevY || 0), hitText, hitColor);

        // Regeneración de Vida Verde (SOR4)
        if (p.recoverableHp > 0) {
          const recovered = Math.min(p.recoverableHp, 6);
          p.recoverableHp -= recovered;
          p.hp = Math.min(p.maxHp, p.hp + recovered);
          this.addFloatingText(p.x, p.z - 135, `+${recovered} HP`, "#2ecc71");
        }

        // Empuje y derribo (Knockdown)
        const knockDir = (e.x >= p.x) ? 1 : -1;
        if (isHeavy || e.hp <= 0) {
          e.state = 'ko';
          e.stateTimer = 1.05;
          e.vx = knockDir * knockback;
          e.vy = (attackType === 'combo4') ? -245 : -180;
          e.elevY = (attackType === 'combo4') ? 44 : 32;
        } else {
          e.state = 'hurt';
          e.stateTimer = 0.32;
          e.vx = knockDir * knockback;
        }

        // Suministros durante el combate con jefes
        if ((e.id === 'testigo' || e.id === 'titan') && e.lastDropHp) {
          const dropThreshold = e.id === 'titan' ? 70 : 45;
          if (e.lastDropHp - e.hp >= dropThreshold) {
            e.lastDropHp = e.hp;
            const dropKey = Math.random() < 0.5 ? 'item_sacol' : 'delivery_box';
            const dropType = dropKey === 'item_sacol' ? 'sacol' : 'box';
            this.spawnCollectible(dropKey, e.x + (Math.random() * 40 - 20), this.floorZ - 8, dropType);
            this.addFloatingText(e.x, e.z - (e.id === 'titan' ? 160 : 130), "¡SOLTÓ SUMINISTROS! 🎁", "#2ecc71");
          }
        }

        if (e.hp <= 0) {
          if (window.retroAudio.playKo) window.retroAudio.playKo();
          this.addFloatingText(e.x, e.z - (e.id === 'titan' ? 295 : 105), "¡K.O.!", "#ffffff");

          if (e.id === 'gamin' && !this.quest.gaminKo) {
            this.quest.gaminKo = true;
            this.spawnCollectible('item_sacol', e.x, this.floorZ - 8, 'sacol');
            this.addFloatingText(e.x, e.z - 150, "¡SOLTÓ EL SACOL! (BOOST VELOCIDAD)", "#f1c40f");
          } else if (e.id === 'rappi' && !this.quest.rappiKo) {
            this.quest.rappiKo = true;
            this.spawnCollectible('item_ticket', e.x - 15, this.floorZ - 8, 'ticket');
            this.spawnCollectible('delivery_box', e.x + 15, this.floorZ - 8, 'box');
            this.addFloatingText(e.x, e.z - 150, "¡SOLTÓ CAJA DE COMIDA (+HP) Y TIQUETE!", "#2ecc71");
          } else if (e.id === 'testigo') {
            this.handleTestigoDefeat(e);
          } else if (e.id === 'titan') {
            this.handleTitanDefeat(e);
          }
        }
      }
    });

    if (connected) {
      this.hitFreezeTimer = isHeavy ? 0.06 : 0.04;
    }
  }

  // ==========================================
  // SISTEMA DE RECOMPENSAS Y TRANSICIÓN DE ZONAS
  // ==========================================
  spawnCollectible(spriteKey, x, z, itemType) {
    this.collectibles.push({
      spriteKey,
      x,
      z: z || this.floorZ,
      itemType,
      bounceOffset: 0,
      bounceTimer: Math.random() * Math.PI
    });
  }

  switchStage(stageNum) {
    this.currentStage = stageNum;
    this.stageTransitionTimer = 1.0;
    if (window.updateActiveStageButton) window.updateActiveStageButton(stageNum);
    this.worldWidth = stageNum === 1 ? 2600 : (stageNum === 2 ? 2650 : 2800);
    this.zMin = 286;
    this.zMax = 340;
    this.floorZ = 310;
    this.player.x = stageNum === 2 ? 140 : (stageNum === 3 ? 200 : 80);
    this.player.z = this.floorZ;
    this.player.elevY = 0;
    this.player.vx = 0;
    this.player.vz = 0;
    this.player.vy = 0;
    this.player.grabbedEnemy = null;
    if (window.retroAudio.playFanfare) window.retroAudio.playFanfare();

    let banner = "★ NIVEL 1: LA VILLA DEL ABURRÁ ★";
    if (stageNum === 2) banner = "★ NIVEL 2: MIRADOR DE LA LADERA ★";
    else if (stageNum === 3) banner = "★ NIVEL 3: DESCENSO POR LA CANALIZACIÓN ★";
    this.addFloatingText(this.player.x, this.player.z - 140, banner, "#f1c40f");

    this.enemies = [];
    this.projectiles = [];
    this.boss.active = false;
    this.boss.phase = 0;
    this.boss.phaseTimer = 0;
    this.boss.phaseTransitionTimer = 0;
    this.boss.screenShake = 0;
    this.boss.flashTimer = 0;
    this.cameraX = 0;
    this.boss.rainWarnings = [];
    this.boss.shockwaves = [];
    this.boss.defeated = false;
    this.cutscene.active = false;
    if (this.ratCutscene) this.ratCutscene.active = false;
    if (stageNum === 3) {
      this.initCanalDescent();
      if (window.retroAudio && window.retroAudio.startCanalChaseBgm) window.retroAudio.startCanalChaseBgm();
    } else {
      if (window.retroAudio && window.retroAudio.stopCutsceneBgm) window.retroAudio.stopCutsceneBgm();
    }

    if (stageNum === 2) {
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
    } else if (stageNum === 3) {
      this.initCanalDescent();
    } else {
      if (this.quest.talkedGloria) {
        this.quest.gaminSpawned = false;
        this.spawnInitialEnemies();
      }
    }
  }

  interact() {
    // Si la cinemática de la rata está activa, avanzar panel
    if (this.ratCutscene && this.ratCutscene.active) {
      this.advanceRatCutscene();
      return;
    }

    // 1. Interacción con Doña Gloria
    const distToNpc = Math.hypot(this.player.x - this.npc.x, this.player.z - this.npc.z);
    if (distToNpc < 90) {
      this.npc.talking = !this.npc.talking;
      if (this.npc.talking) {
        if (!this.quest.talkedGloria) {
          this.quest.talkedGloria = true;
          this.npc.dialogue = "Bueno, me presento, mijo. Yo me llamo doña Gloria. Estaba vendiendo mis empanaditas y esos gamines me robaron el producido. ¡Necesito que me ayudes a despejar el camino hacia las escaleras del mirador, esto está muy peligroso!";
          this.addFloatingText(this.player.x, this.player.z - 120, "+35 HP (TINTO) | ¡MISIÓN ACTIVADA!", "#2ecc71");
          if (window.retroAudio.playCollect) window.retroAudio.playCollect();
          this.spawnInitialEnemies();
        } else if (this.quest.gaminKo && this.quest.rappiKo) {
          this.npc.dialogue = "¡Ave María mijo, qué verraquera! Suba las escaleras con cuidado pal mirador, mijo.";
        } else {
          this.npc.dialogue = "¡Ánimo Juancho! Use Q para Combo/Blitz y E para Especial/Súplex. ¡Despeja el camino a las escaleras!";
        }

        if (this.player.hp < this.player.maxHp) {
          this.player.hp = Math.min(this.player.maxHp, this.player.hp + 35);
        }
      }
    }

    // 2. Transición Nivel 1 -> Escaleras hacia arriba (extremo derecho x ~ 2460)
    if (this.currentStage === 1) {
      const distToStairs = Math.abs(this.player.x - 2460);
      if (distToStairs < 90) {
        if (this.quest.hasTicket) {
          this.switchStage(2);
        } else {
          this.addFloatingText(2410, this.floorZ - 120, "¡NECESITAS EL TIQUETE DEL METROCABLE! 🔒", "#e74c3c");
          if (window.retroAudio && window.retroAudio.playHit) window.retroAudio.playHit();
        }
      }
    }

    // 3. Transición Nivel 2 -> Salto a la Canalización (x ~ 2440)
    if (this.currentStage === 2) {
      const distToCanal = Math.abs(this.player.x - 2440);
      if (distToCanal < 85) {
        if (this.boss.defeated) {
          this.startRatCutscene();
        } else {
          this.addFloatingText(2440, this.floorZ - 120, "¡DERROTA PRIMERO A LA CONGREGACIÓN!", "#e74c3c");
          if (window.retroAudio.playHit) window.retroAudio.playHit();
        }
      }
    }
  }

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

  spawnCritter() {
    const rand = Math.random();
    let item = 'todito';
    if (rand < 0.4) item = 'todito';
    else if (rand < 0.75) item = 'cigar';
    else item = 'cockroach';
    const isRat = item !== 'cockroach';
    const fromRight = Math.random() < 0.5;

    this.critters.push({
      type: isRat ? 'rat' : 'cockroach',
      itemType: item,
      x: fromRight ? this.cameraX + this.vWidth + 30 : this.cameraX - 30,
      z: this.floorZ + (Math.random() * 35),
      vx: (fromRight ? -1 : 1) * (item === 'cockroach' ? 120 : (75 + Math.random() * 40)),
      facingRight: !fromRight
    });

    if (window.retroAudio.playCritter) window.retroAudio.playCritter();
  }

  addFloatingText(x, y, text, color) {
    this.floatingTexts.push({ x, y, text, color, life: 1.0 });
  }

  addHitSparks(x, y) {
    // Anillo de impacto expansivo estilo Capcom CPS3 / Streets of Rage 4
    this.particles.push({
      x, y,
      vx: 0, vy: 0,
      color: '#f1c40f',
      life: 0.18,
      maxLife: 0.18,
      isRing: true
    });
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 130;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: Math.random() < 0.5 ? '#f1c40f' : '#ffffff',
        life: 0.24,
        size: 3
      });
    }
  }

  addDust(x, y) {
    this.particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 40,
      vy: -15 - Math.random() * 20,
      color: '#d5dbdb',
      life: 0.3,
      size: 4
    });
  }

  // ==========================================
  // BUCLE DE ACTUALIZACIÓN (UPDATE)
  // ==========================================
  update(dt) {
    if (this.gameState === 'TITLE') {
      this.titleTimer += dt;
      return;
    }

    if (this.gameState === 'CHAR_SELECT') {
      this.titleTimer += dt;
      if (this.charSelectFlash > 0) {
        this.charSelectFlash = Math.max(0, this.charSelectFlash - dt * 2.5);
      }
      if (this.charSelectConfirmTimer > 0) {
        this.charSelectConfirmTimer -= dt;
        if (this.charSelectConfirmTimer <= 0) {
          this.startGameWithCharacter(this.roster[this.charSelectIndex].id);
        }
      }
      return;
    }

    // Si la cinemática de la rata mutante está activa, actualizar y congelar juego
    if (this.ratCutscene && this.ratCutscene.active) {
      this.ratCutscene.stepTimer += dt;
      this.ratCutscene.shake = Math.max(0, this.ratCutscene.shake - dt * 2.0);
      this.ratCutscene.flash = Math.max(0, this.ratCutscene.flash - dt * 2.5);
      if (this.ratCutscene.step <= 4 && this.ratCutscene.stepTimer >= this.ratCutscene.maxStepTimer) {
        this.advanceRatCutscene();
      }
      return;
    }

    // Si estamos en el Nivel 3 (Canalización), actualizar física de bajada y partículas exclusivamente
    if (this.currentStage === 3) {
      this.pollGamepads();
      this.updateCanal(dt);

      // Actualización de partículas arcade
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const part = this.particles[i];
        part.x += (part.vx || 0) * dt;
        part.y += (part.vy || 0) * dt;
        part.life -= dt;
        if (part.life <= 0) this.particles.splice(i, 1);
      }

      // Actualización de textos flotantes
      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        const ft = this.floatingTexts[i];
        ft.y -= 28 * dt;
        ft.life -= dt;
        if (ft.life <= 0) this.floatingTexts.splice(i, 1);
      }
      return;
    }

    // Transición y bloqueo en escaleras de Nivel 1 (extremo derecho de la pantalla)
    if (this.currentStage === 1) {
      if (this.quest.hasTicket) {
        // Al pisar y subir los escalones, elevación física progresiva
        if (this.player.x >= 2415 && this.player.x < 2510) {
          const climb = (this.player.x - 2415) / (2510 - 2415);
          this.player.elevY = Math.max(this.player.elevY || 0, Math.round(climb * 22));
        }
        // Al cruzar el umbral superior hacia el Mirador
        if (this.player.x >= 2510) {
          this.switchStage(2);
          return;
        }
      } else {
        // Bloquear el paso al pie de las escaleras si no tiene el tiquete
        if (this.player.x >= 2410) {
          this.player.x = 2410;
          if (this.player.vx > 0) this.player.vx = 0;
          if (!this.lastStairsAlert || Date.now() - this.lastStairsAlert > 2200) {
            this.lastStairsAlert = Date.now();
            this.addFloatingText(2405, this.floorZ - 120, "¡NECESITAS EL TIQUETE DEL METROCABLE! 🔒", "#e74c3c");
            if (window.retroAudio && window.retroAudio.playHit) window.retroAudio.playHit();
          }
        }
      }
    }

    // Salto de fe automático hacia el vacío de la canalización en Nivel 2 (sin oprimir botón)
    if (this.currentStage === 2) {
      if (this.boss.defeated) {
        if (this.player.x >= 2435) {
          this.player.vy = 260;
          this.player.elevY = 22;
          this.startRatCutscene();
          return;
        }
      } else {
        // Bloquear el borde del abismo mientras el jefe siga con vida
        if (this.player.x >= 2415) {
          this.player.x = 2415;
          if (this.player.vx > 0) this.player.vx = 0;
          if (!this.lastChasmAlert || Date.now() - this.lastChasmAlert > 2200) {
            this.lastChasmAlert = Date.now();
            this.addFloatingText(2410, this.floorZ - 120, "¡CANALIZACIÓN BLOQUEADA! DERROTA A LA CONGREGACIÓN 🔒", "#e74c3c");
            if (window.retroAudio && window.retroAudio.playHit) window.retroAudio.playHit();
          }
        }
      }
    }

    // 0. HIT-FREEZE (Micro-impact stop arcade que no congela la entrada)
    if (this.hitFreezeTimer > 0) {
      this.hitFreezeTimer -= dt;
    }

    // 0.2. AVISO CINEMÁTICO GRAFFITI (Overlay estilo arcade fluido sin bloquear el juego)
    if (this.cutscene && this.cutscene.active) {
      this.cutscene.timer -= dt;
      this.cutscene.animTimer += dt;
      if (this.boss.screenShake > 0) this.boss.screenShake -= dt * 1.8;
      // Nota: boss.flashTimer se decrementa una sola vez abajo en la sección general
      if (this.cutscene.timer <= 0) {
        this.cutscene.active = false;
      }
      // El banner se dibuja al frente pero NO congela los controles del jugador
    }

    // 0.5. ACTIVADOR Y ACTUALIZADOR DEL BOSS (NIVEL 2)
    if (this.currentStage === 2) {
      if (!this.boss.active && this.boss.phase === 0 && this.player.x >= 1450) {
        this.startBossPhase1();
      }
      if (this.boss.active) {
        this.updateBoss(dt);
      }
    }

    // Actualizar marcadores de lluvia celestial de biblias
    for (let i = this.boss.rainWarnings.length - 1; i >= 0; i--) {
      const rw = this.boss.rainWarnings[i];
      rw.timer -= dt;
      if (rw.timer <= 0 && !rw.spawned) {
        rw.spawned = true;
        this.projectiles.push({
          spriteKey: 'proj_bible',
          x: rw.x,
          z: rw.z || this.floorZ,
          y: -25,
          vx: (Math.random() - 0.5) * 20,
          vy: 390,
          rotation: 0,
          rotSpeed: 18,
          isBossProj: true,
          damage: 20
        });
        this.boss.rainWarnings.splice(i, 1);
      }
    }

    // Actualizar ondas expansivas de terremoto
    for (let i = this.boss.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.boss.shockwaves[i];
      sw.x += sw.vx * dt;
      sw.life -= dt;

      const distX = Math.abs(this.player.x - sw.x);
      const distZ = Math.abs(this.player.z - sw.z);
      if (distX < 38 && distZ < 22 && this.player.elevY < 18 && this.player.invulnerableTimer <= 0 && !sw.hit) {
        sw.hit = true;
        this.player.hp = Math.max(0, this.player.hp - 25);
        this.player.recoverableHp = 0; // Se pierde la vida verde si recibe golpe
        this.player.action = 'hurt';
        this.player.actionTimer = 0.45;
        this.player.invulnerableTimer = 0.8;
        this.player.vx = (sw.vx > 0 ? 1 : -1) * 260;
        this.player.vy = -180;
        this.player.elevY = 15;
        this.player.grounded = false;
        if (window.retroAudio.playHit) window.retroAudio.playHit();
        this.addFloatingText(this.player.x, this.player.z - 120, "¡TERREMOTO! -25 HP (SALTA)", "#e74c3c");
      }

      if (sw.life <= 0 || sw.x < 1400 || sw.x > 2750) {
        this.boss.shockwaves.splice(i, 1);
      }
    }

    if (this.boss.screenShake > 0) this.boss.screenShake -= dt * 1.8;
    if (this.boss.flashTimer > 0) this.boss.flashTimer -= dt;

    // Fauna urbana
    this.lastCritterSpawn += dt;
    if (this.lastCritterSpawn > 8) {
      this.spawnCritter();
      this.lastCritterSpawn = 0;
    }

    for (let i = this.critters.length - 1; i >= 0; i--) {
      const c = this.critters[i];
      c.x += c.vx * dt;
      if (c.x < this.cameraX - 100 || c.x > this.cameraX + this.vWidth + 100) {
        this.critters.splice(i, 1);
      }
    }

    // Metrocable y palomas
    this.metrocable.x += this.metrocable.speed * dt;
    if (this.metrocable.x > this.worldWidth + 100) this.metrocable.x = -80;

    this.pigeons.forEach(b => {
      if (!b.flying) {
        b.peckTimer = (b.peckTimer || 0) + dt;
        // Asustarse si Juancho se acerca
        const distPigeon = Math.hypot(this.player.x - b.x, this.player.z - b.z);
        if (distPigeon < 65) {
          b.flying = true;
          b.vx = (this.player.x < b.x ? 1 : -1) * (85 + Math.random() * 30);
          b.vy = -95;
        }
      } else {
        b.x += b.vx * dt;
        b.elevY = (b.elevY || 0) - b.vy * dt;
        b.vy += 25 * dt; // Planeo ascendente
      }
    });

    // ==========================================
    // 1. FÍSICAS Y MOVIMIENTO DEL JUGADOR (JUANCHO)
    // ==========================================
    const p = this.player;

    if (p.actionTimer > 0) {
      p.actionTimer -= dt;
      if (p.actionTimer <= 0) {
        if (p.action !== 'grab') p.action = 'idle';
      }
    }
    if (p.comboTimer > 0) {
      p.comboTimer -= dt;
      if (p.comboTimer <= 0) p.comboStep = 0;
    }
    if (p.invulnerableTimer > 0) p.invulnerableTimer -= dt;
    if (p.speedBoostTimer > 0) {
      p.speedBoostTimer -= dt;
      if (Math.random() < 0.35) {
        this.addHitSparks(p.x + (Math.random() * 24 - 12), p.z - 30);
      }
    }

    // Control del agarre activo
    if (p.action === 'grab') {
      p.grabTimer -= dt;
      if (!p.grabbedEnemy || p.grabbedEnemy.state === 'ko' || p.grabTimer <= 0) {
        p.action = 'idle';
        if (p.grabbedEnemy) p.grabbedEnemy.state = 'patrol';
        p.grabbedEnemy = null;
      } else {
        // Mantener al enemigo pegado al pecho de Juancho
        p.grabbedEnemy.x = p.x + (p.facingRight ? 26 : -26);
        p.grabbedEnemy.z = p.z;
        p.grabbedEnemy.facingRight = !p.facingRight;
      }
    }

    // Movimiento 8 direcciones
    const canMove = p.action !== 'punch' && p.action !== 'cross' && p.action !== 'kick' && p.action !== 'midkick' && 
                    p.action !== 'lowkick' && p.action !== 'uppercut' && p.action !== 'jumpkick' &&
                    p.action !== 'hurt' && p.action !== 'sniff' && p.action !== 'eat' && 
                    p.action !== 'throw' && p.action !== 'special' && p.action !== 'grab' && 
                    p.action !== 'blitz' && p.action !== 'roll';

    if (canMove) {
      const isRunning = p.isDashing || this.keys.run;
      const baseSpeedX = isRunning ? 230 : 140;
      const baseSpeedZ = isRunning ? 150 : 95;
      const mult = p.speedBoostTimer > 0 ? 3.5 : 1.0;
      const speedX = baseSpeedX * mult;
      const speedZ = baseSpeedZ * mult;

      p.vx = 0;
      p.vz = 0;

      if (this.keys.left) {
        p.vx = -speedX;
        p.facingRight = false;
      } else if (this.keys.right) {
        p.vx = speedX;
        p.facingRight = true;
      }

      if (this.keys.up) {
        p.vz = -speedZ;
      } else if (this.keys.down) {
        p.vz = speedZ;
      }

      if (p.vx !== 0 || p.vz !== 0) {
        p.action = isRunning ? 'run' : 'walk';
        if (isRunning && Math.random() < 0.25) this.addDust(p.x + (p.facingRight ? -15 : 15), p.z);
      } else {
        if (p.grounded) {
          p.action = (Math.floor(Date.now() / 900) % 5 === 0) ? 'rail' : 'idle';
        }
      }
    }

    // Desplazamiento por Blitz
    if (p.action === 'blitz') {
      p.x += p.vx * dt;
      if (Math.random() < 0.4) this.addDust(p.x, p.z);
    } else if (p.action === 'roll') {
      // Rodada vertical evasiva
      p.z += p.vz * dt;
      p.z = Math.max(this.zMin, Math.min(this.zMax, p.z));
      if (Math.random() < 0.3) this.addDust(p.x, p.z);
    } else {
      p.x += p.vx * dt;
      p.z += p.vz * dt;
      p.z = Math.max(this.zMin, Math.min(this.zMax, p.z));
    }

    // Salto y física aérea (elevY) con doble salto
    if (!p.grounded) {
      if (p.action === 'doublejump') {
        p.elevY = Math.min(110, p.elevY + 28 * dt);
        if (p.actionTimer <= 0) {
          p.action = 'jump';
          p.vy = 80;
        }
      } else {
        p.vy += 1050 * dt;
        p.elevY -= p.vy * dt;
        if (p.elevY <= 0) {
          p.elevY = 0;
          p.vy = 0;
          p.grounded = true;
          p.doubleJumped = false;
          p.canDoubleJump = false;
          if (p.action === 'jump' || p.action === 'jumpkick' || p.action === 'doublejump') p.action = 'idle';
          this.addDust(p.x, p.z);
        }
      }
    }

    // Límites del escenario en X (desembarque en x=85, arena boss en x=1480)
    const minPlayerX = (this.currentStage === 2 && this.boss.active && !this.boss.defeated) ? 1480 : (this.currentStage === 2 ? 85 : 30);
    p.x = Math.max(minPlayerX, Math.min(this.worldWidth - 50, p.x));

    p.animTimer += dt;
    const animRate = (p.action === 'run') ? 0.07 : 0.12;
    if (p.animTimer > animRate) {
      p.frame = (p.frame + 1) % 12;
      p.animTimer = 0;
    }

    // Actualizar frames de animación para todos los enemigos
    this.enemies.forEach(en => {
      en.animTimer = (en.animTimer || 0) + dt;
      const rate = (en.state === 'charge') ? 0.08 : 0.14;
      if (en.animTimer > rate) {
        en.frame = ((en.frame || 0) + 1) % 12;
        en.animTimer = 0;
      }
    });

    // Detección automática de AGARRE POR PROXIMIDAD (Streets of Rage Core Mechanic)
    if (canMove && (p.action === 'walk' || p.action === 'run') && p.grounded) {
      this.enemies.forEach(e => {
        if (e.state === 'ko' || e.id === 'titan' || e.invulnerableTimer > 0) return;
        const dx = Math.abs(p.x - e.x);
        const dz = Math.abs(p.z - e.z);
        if (dx < 26 && dz < 14 && p.elevY < 10 && (e.elevY || 0) < 10) {
          p.action = 'grab';
          p.grabbedEnemy = e;
          p.grabTimer = 2.4;
          p.grabHits = 0;
          p.vx = 0; p.vz = 0;
          e.state = 'grabbed';
          e.vx = 0; e.vz = 0;
          if (window.retroAudio.playGrab) window.retroAudio.playGrab();
          this.addFloatingText(p.x, p.z - 110, "¡AGARRE! [Q: Rodilla | E: Súplex]", "#f1c40f");
        }
      });
    }

    // Límite de Doña Gloria (exclusivo de Nivel 1)
    if (this.currentStage === 1 && !this.quest.talkedGloria && p.x > 460) {
      p.x = 460;
      p.vx = 0;
      if (!this.lastGloriaAlert || Date.now() - this.lastGloriaAlert > 2200) {
        this.lastGloriaAlert = Date.now();
        this.addFloatingText(460, p.z - 120, "¡HABLA CON DOÑA GLORIA! [F / ACCIÓN]", "#f1c40f");
      }
    }

    // Revivir al jugador si su HP llega a cero
    if (p.hp <= 0 && p.action !== 'hurt') {
      p.hp = 100;
      p.recoverableHp = 0;
      p.x = 80;
      p.z = this.floorZ;
      p.elevY = 0;
      p.vx = 0; p.vz = 0; p.vy = 0;
      p.action = 'idle';
      this.addFloatingText(p.x, p.z - 120, "¡DOÑA GLORIA TE REVIVIÓ CON UN TINTO!", "#f1c40f");
      if (window.retroAudio.playCollect) window.retroAudio.playCollect();
    }

    // ==========================================
    // 2. IA DE ENEMIGOS CON FLANQUEO EN EL EJE Z
    // ==========================================
    this.enemies.forEach(e => {
      if (e.invulnerableTimer > 0) e.invulnerableTimer -= dt;
      const distX = Math.abs(p.x - e.x);
      const distZ = Math.abs(p.z - e.z);

      // Animación fluida de pasos y carrera para todos los enemigos
      if (e.state === 'patrol' || e.state === 'charge') {
        e.animTimer = (e.animTimer || 0) + dt;
        if (e.animTimer >= 0.13) {
          e.animTimer = 0;
          e.frame = ((e.frame || 0) + 1) % 12;
        }
      }

      // Físicas de derribo en el aire (Knockdown / Lanzamiento)
      if (e.state === 'ko') {
        if (e.elevY > 0 || e.vy < 0) {
          e.vy += 950 * dt;
          e.elevY -= e.vy * dt;
          e.x += e.vx * dt;
          if (e.elevY <= 0) {
            e.elevY = 0;
            e.vy = 0;
            e.vx *= 0.3;
            this.addDust(e.x, e.z);
            this.boss.screenShake = 0.25;

            // Daño de bolos colateral: el cuerpo impacta a otros enemigos
            if (e.isFlyingBody) {
              e.isFlyingBody = false;
              this.enemies.forEach(other => {
                if (other === e || other.state === 'ko') return;
                const hitDistX = Math.abs(e.x - other.x);
                const hitDistZ = Math.abs(e.z - other.z);
                if (hitDistX < 45 && hitDistZ < 22) {
                  other.hp = Math.max(0, other.hp - 25);
                  other.state = 'ko';
                  other.stateTimer = 0.9;
                  other.elevY = 25;
                  other.vy = -160;
                  other.vx = Math.sign(other.x - e.x || 1) * 220;
                  this.addHitSparks(other.x, other.z - 40);
                  this.addFloatingText(other.x, other.z - 90, "¡STRIKE! 🎳 -25 HP", "#e74c3c");
                }
              });
            }
          }
        } else {
          e.vx *= 0.8;
          e.starsAngle = (e.starsAngle || 0) + dt * 5;
          e.stateTimer -= dt;
          if (e.stateTimer <= 0) {
            if (e.hp > 0) {
              // Se levanta con invulnerabilidad temporal
              e.state = 'patrol';
              e.invulnerableTimer = 0.5;
            } else {
              // Desaparece en chispas
              for (let s = 0; s < 10; s++) {
                this.addHitSparks(e.x + (Math.random() * 30 - 15), e.z - 40 + (Math.random() * 30 - 15));
              }
              const idx = this.enemies.indexOf(e);
              if (idx !== -1) this.enemies.splice(idx, 1);
            }
          }
        }
        return;
      }

      // IA: GAMÍN DE MEDELLÍN
      if (e.id === 'gamin') {
        switch (e.state) {
          case 'patrol':
            e.vx = (e.patrolDir || -1) * (e.speedX || 60);
            e.facingRight = (e.patrolDir > 0);
            e.x += e.vx * dt;
            if (e.x < e.patrolStartX) e.patrolDir = 1;
            if (e.x > e.patrolEndX) e.patrolDir = -1;

            if (distX < 210 && distZ < 65) {
              e.state = 'sniff';
              e.stateTimer = 1.3;
              e.vx = 0; e.vz = 0;
              e.facingRight = (p.x > e.x);
              if (window.retroAudio.playSniff) window.retroAudio.playSniff();
              this.addFloatingText(e.x, e.z - 120, "*SNIFF SACOL...*", "#f1c40f");
            }
            break;

          case 'sniff':
            e.stateTimer -= dt;
            if (e.stateTimer <= 0) {
              e.state = 'charge';
              e.stateTimer = 2.8;
              this.addFloatingText(e.x, e.z - 120, "¡ECHE PA' ACÁ!", "#e74c3c");
            }
            break;

          case 'charge':
            // Flanqueo Z: intenta alinearse con el jugador + un pequeño desvío
            e.facingRight = (p.x > e.x);
            const targetZ = p.z + (e.zFlankOffset || 0);
            const dz = targetZ - e.z;
            e.vx = (e.facingRight ? 1 : -1) * (e.speedX || 120);
            e.vz = Math.sign(dz) * (e.speedZ || 65);
            e.x += e.vx * dt;
            e.z += e.vz * dt;
            e.z = Math.max(this.zMin, Math.min(this.zMax, e.z));
            e.stateTimer -= dt;

            if (distX < 50 && distZ < 16) {
              e.state = 'slash';
              e.stateTimer = 0.42;
              if (window.retroAudio.playSlash) window.retroAudio.playSlash();
            } else if (e.stateTimer <= 0) {
              e.state = 'patrol';
            }
            break;

          case 'slash':
            e.stateTimer -= dt;
            if (distX < 52 && distZ < 18 && p.elevY < 18 && p.invulnerableTimer <= 0) {
              p.hp = Math.max(0, p.hp - 18);
              p.recoverableHp = 0; // Pérdida de vida verde
              p.action = 'hurt';
              p.actionTimer = 0.35;
              p.invulnerableTimer = 0.6;
              p.vx = (e.facingRight ? 1 : -1) * 200;
              p.vy = -140;
              p.elevY = 10;
              p.grounded = false;
              if (window.retroAudio.playHit) window.retroAudio.playHit();
              this.addFloatingText(p.x, p.z - 100, "¡AUCH! CUCHILLAZO", "#e74c3c");
            }
            if (e.stateTimer <= 0) e.state = 'patrol';
            break;

          case 'hurt':
            e.x += e.vx * dt;
            e.vx *= 0.85;
            e.stateTimer -= dt;
            if (e.stateTimer <= 0) e.state = 'charge';
            break;
        }
      }

      // IA: RAPPI-GAMÍN MEDELLÍN
      if (e.id === 'rappi') {
        if (e.throwCooldown > 0) e.throwCooldown -= dt;

        switch (e.state) {
          case 'patrol':
            e.vx = (e.patrolDir || -1) * (e.speedX || 70);
            e.facingRight = (e.patrolDir > 0);
            e.x += e.vx * dt;
            if (e.x < e.patrolStartX) e.patrolDir = 1;
            if (e.x > e.patrolEndX) e.patrolDir = -1;

            if (distX < 240) {
              if (distX > 130 && e.throwCooldown <= 0) {
                e.state = 'throw';
                e.stateTimer = 0.5;
                e.vx = 0; e.vz = 0;
                e.facingRight = (p.x > e.x);
                this.throwDeliveryBox(e);
                e.throwCooldown = 3.8;
              } else {
                e.state = 'charge';
                e.stateTimer = 2.2;
                this.addFloatingText(e.x, e.z - 125, "¡MALETAZO RAPPI!", "#e67e22");
              }
            }
            break;

          case 'throw':
            e.stateTimer -= dt;
            if (e.stateTimer <= 0) e.state = 'charge';
            break;

          case 'charge':
            e.facingRight = (p.x > e.x);
            const rappiTargetZ = p.z + (e.zFlankOffset || 0);
            const rdz = rappiTargetZ - e.z;
            e.vx = (e.facingRight ? 1 : -1) * (e.speedX || 135);
            e.vz = Math.sign(rdz) * (e.speedZ || 70);
            e.x += e.vx * dt;
            e.z += e.vz * dt;
            e.z = Math.max(this.zMin, Math.min(this.zMax, e.z));
            e.stateTimer -= dt;

            if (distX < 55 && distZ < 18 && p.elevY < 18 && p.invulnerableTimer <= 0) {
              p.hp = Math.max(0, p.hp - 22);
              p.recoverableHp = 0;
              p.action = 'hurt';
              p.actionTimer = 0.4;
              p.invulnerableTimer = 0.7;
              p.vx = (e.facingRight ? 1 : -1) * 240;
              p.vy = -160;
              p.elevY = 12;
              p.grounded = false;
              if (window.retroAudio.playHit) window.retroAudio.playHit();
              this.addFloatingText(p.x, p.z - 100, "¡PEDIDO ENTREGADO!", "#e74c3c");
            }
            if (e.stateTimer <= 0) e.state = 'patrol';
            break;

          case 'hurt':
            e.x += e.vx * dt;
            e.vx *= 0.85;
            e.stateTimer -= dt;
            if (e.stateTimer <= 0) e.state = 'charge';
            break;
        }
      }

      // IA: TESTIGO DE JEHOVÁ (FASE 1 Y FASE 2)
      if (e.id === 'testigo') {
        if (e.attackCooldown > 0) e.attackCooldown -= dt;

        switch (e.state) {
          case 'stand':
          case 'patrol':
            e.facingRight = (p.x > e.x);
            const tdz = p.z - e.z;
            e.vx = (e.facingRight ? 1 : -1) * (e.speedX || 70);
            e.vz = Math.sign(tdz) * (e.speedZ || 50);
            e.x += e.vx * dt;
            e.z += e.vz * dt;
            e.z = Math.max(this.zMin, Math.min(this.zMax, e.z));
            if (e.patrolStartX && e.x < e.patrolStartX) e.x = e.patrolStartX;
            if (e.patrolEndX && e.x > e.patrolEndX) e.x = e.patrolEndX;

            if (e.attackCooldown <= 0) {
              const isTrio = e.role === 'trio_unit';
              const meleeReach = isTrio ? 85 : 65;
              if (distX < meleeReach && distZ < 22) {
                e.state = 'throw';
                e.stateTimer = isTrio ? 0.55 : 0.45;
                e.vx = 0; e.vz = 0;
                e.attackCooldown = 2.4;
                this.addFloatingText(e.x, e.z - 120, isTrio ? "¡SALVA CELESTIAL!" : "¡FOLLETAZO BENDITO!", "#f1c40f");
                if (p.invulnerableTimer <= 0 && p.elevY < 18) {
                  p.hp = Math.max(0, p.hp - (isTrio ? 22 : 16));
                  p.recoverableHp = 0;
                  p.action = 'hurt';
                  p.actionTimer = 0.35;
                  p.invulnerableTimer = 0.6;
                  p.vx = (e.facingRight ? 1 : -1) * (isTrio ? 240 : 200);
                  if (window.retroAudio.playHit) window.retroAudio.playHit();
                }
              } else {
                e.state = 'throw';
                e.stateTimer = isTrio ? 0.65 : 0.5;
                e.vx = 0; e.vz = 0;
                e.attackCooldown = isTrio ? 2.6 : 2.9;

                this.throwTestigoProjectile(e, 'proj_bible');
                if (isTrio) {
                  setTimeout(() => {
                    if (this.boss.phase === 2 && this.enemies.includes(e)) {
                      this.throwTestigoProjectile(e, 'proj_crucifix');
                    }
                  }, 120);
                }

                const phrases = isTrio ? [
                  "¡EL CORO DE LA CONGREGACIÓN!",
                  "¡SALVA DE ATALAYAS Y SALMOS!",
                  "¡DESPIERTEN AL MENSAJE DIVINO!",
                  "¡TRINIDAD DE LA BUENA NUEVA!"
                ] : [
                  "¡LEA LA ATALAYA, HERMANO!",
                  "¡VENGO A HABLARLE DEL SEÑOR!",
                  "¡BUENAS TARDES VECINO!",
                  "¡UN MENSAJE DE PAZ!"
                ];
                const phrase = phrases[Math.floor(Math.random() * phrases.length)];
                this.addFloatingText(e.x, e.z - 125, phrase, isTrio ? "#f1c40f" : "#3498db");
              }
            }
            break;

          case 'pray':
            e.vx = 0; e.vz = 0;
            if (e.attackCooldown <= 0) {
              e.attackCooldown = 3.5;
              if (window.retroAudio.playChant) window.retroAudio.playChant();
              this.addFloatingText(e.x, e.z - 125, "¡PUM, PUM, PUM! ¡DESPIERTE!", "#f1c40f");
              for (let i = 0; i < 8; i++) {
                this.addHitSparks(e.x + (Math.random() * 40 - 20), e.z - 40 + (Math.random() * 40 - 20));
              }
            }
            break;

          case 'throw':
            e.stateTimer -= dt;
            if (e.stateTimer <= 0) {
              e.state = (e.role === 'trio_chanter') ? 'pray' : 'patrol';
            }
            break;

          case 'hurt':
            e.x += e.vx * dt;
            e.vx *= 0.85;
            e.stateTimer -= dt;
            if (e.stateTimer <= 0) {
              e.state = (e.role === 'trio_chanter') ? 'pray' : 'patrol';
            }
            break;
        }
      }

      // IA: SÚPER TESTIGO TITÁNICO (FASE 3)
      if (e.id === 'titan') {
        if (e.attackCooldown > 0) e.attackCooldown -= dt;

        switch (e.state) {
          case 'idle':
            e.facingRight = (p.x > e.x);
            if (distX > 130) {
              e.vx = (e.facingRight ? 1 : -1) * 45;
              e.x += e.vx * dt;
            } else {
              e.vx = 0;
            }

            if (e.attackCooldown <= 0) {
              e.attackStep = ((e.attackStep || 0) + 1) % 2;
              if (e.attackStep === 0) {
                e.state = 'slam';
                e.stateTimer = 1.1;
                e.hasSlammed = false;
                e.vx = 0;
                this.addFloatingText(e.x, e.z - 190, "¡TERREMOTO DE FE! ¡SALTEN!", "#e74c3c");
              } else {
                e.state = 'rain';
                e.stateTimer = 1.5;
                e.vx = 0;
                this.triggerBibleRain(e);
                this.addFloatingText(e.x, e.z - 190, "¡LLUVIA CELESTIAL DE ATALAYAS!", "#f1c40f");
              }
            }
            break;

          case 'slam':
            e.stateTimer -= dt;
            if (e.stateTimer < 0.6 && !e.hasSlammed) {
              e.hasSlammed = true;
              this.boss.screenShake = 0.8;
              if (window.retroAudio.playThunderSlam) window.retroAudio.playThunderSlam();

              const shockDir = (p.x < e.x) ? -1 : 1;
              this.boss.shockwaves.push({
                x: e.x + shockDir * 40,
                z: this.floorZ,
                vx: shockDir * 290,
                life: 1.8,
                hit: false
              });

              for (let k = 0; k < 18; k++) {
                this.addDust(e.x + (Math.random() * 80 - 40), this.floorZ);
                this.addHitSparks(e.x + (Math.random() * 60 - 30), this.floorZ - 15);
              }
            }
            if (e.stateTimer <= 0) {
              e.state = 'idle';
              e.hasSlammed = false;
              e.attackCooldown = 3.2;
            }
            break;

          case 'rain':
            e.stateTimer -= dt;
            if (e.stateTimer <= 0) {
              e.state = 'idle';
              e.attackCooldown = 3.4;
            }
            break;

          case 'hurt':
            e.stateTimer -= dt;
            if (e.stateTimer <= 0) e.state = 'idle';
            break;
        }
      }
    });

    // Separación orgánica entre enemigos para evitar apilamiento (Crowd Separation Streets of Rage)
    for (let i = 0; i < this.enemies.length; i++) {
      for (let j = i + 1; j < this.enemies.length; j++) {
        const e1 = this.enemies[i];
        const e2 = this.enemies[j];
        if (e1.state === 'ko' || e2.state === 'ko' || e1.state === 'grabbed' || e2.state === 'grabbed') continue;
        if (e1.id === 'titan' || e2.id === 'titan') continue;
        const dx = e2.x - e1.x;
        const dz = e2.z - e1.z;
        if (Math.abs(dx) < 28 && Math.abs(dz) < 12) {
          const pushX = (dx >= 0 ? 1 : -1) * 35 * dt;
          const pushZ = (dz >= 0 ? 1 : -1) * 18 * dt;
          e1.x -= pushX;
          e2.x += pushX;
          e1.z = Math.max(this.zMin, Math.min(this.zMax, e1.z - pushZ));
          e2.z = Math.max(this.zMin, Math.min(this.zMax, e2.z + pushZ));
        }
      }
    }

    // ==========================================
    // 3. ACTUALIZAR PROYECTILES
    // ==========================================
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.x += proj.vx * dt;
      proj.y += proj.vy * dt;
      if (!proj.isBossProj || proj.vy < 300) {
        proj.vy += 420 * dt;
      }
      if (proj.rotation !== undefined) {
        proj.rotation += (proj.rotSpeed || 12) * dt;
      }

      // Impacto con Juancho
      const distP = Math.hypot(proj.x - p.x, proj.y - (p.z - 45 - p.elevY));
      const distZ = Math.abs((proj.z || p.z) - p.z);
      if (distP < 36 && distZ < 25 && p.invulnerableTimer <= 0) {
        const dmg = proj.damage || 15;
        p.hp = Math.max(0, p.hp - dmg);
        p.recoverableHp = 0;
        p.action = 'hurt';
        p.actionTimer = 0.3;
        p.invulnerableTimer = 0.55;
        if (window.retroAudio.playHit) window.retroAudio.playHit();

        let hitLabel = "¡BURGER VOLADORA!";
        if (proj.spriteKey === 'proj_bible') hitLabel = "¡ATALAYAZO EN LA CARA! 📖";
        if (proj.spriteKey === 'proj_crucifix') hitLabel = "¡CRUCIFIJO SAGRADO! ✝";
        this.addFloatingText(p.x, p.z - 90, hitLabel, "#f1c40f");
        this.projectiles.splice(i, 1);
        continue;
      }

      // Impacto con el suelo
      if (proj.y >= (proj.z || this.floorZ) - 5) {
        this.addDust(proj.x, proj.z || this.floorZ);
        if (proj.spriteKey === 'proj_bible' || proj.spriteKey === 'proj_crucifix') {
          this.addHitSparks(proj.x, (proj.z || this.floorZ) - 10);
        }
        this.projectiles.splice(i, 1);
      }
    }

    // ==========================================
    // 4. ACTUALIZAR COLECCIONABLES
    // ==========================================
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const c = this.collectibles[i];
      c.bounceTimer += dt * 4;
      c.bounceOffset = Math.sin(c.bounceTimer) * 4;

      const distPlayer = Math.hypot(p.x - c.x, p.z - c.z);
      if (distPlayer < 40 && p.elevY < 20) {
        if (window.retroAudio.playCollect) window.retroAudio.playCollect();

        if (c.itemType === 'arepa') {
          p.hp = Math.min(p.maxHp, p.hp + 40);
          this.addFloatingText(p.x, p.z - 120, "+40 HP (AREPA CON MANTEQUILLA)", "#f1c40f");
        } else if (c.itemType === 'ticket') {
          this.quest.hasTicket = true;
          if (window.retroAudio.playFanfare) window.retroAudio.playFanfare();
          this.addFloatingText(p.x, p.z - 130, "¡TIQUETE METROCABLE OBTENIDO!", "#e74c3c");
        } else if (c.itemType === 'box') {
          p.action = 'eat';
          p.actionTimer = 0.5;
          p.vx = 0; p.vz = 0;
          p.hp = Math.min(p.maxHp, p.hp + 50);
          this.addFloatingText(p.x, p.z - 120, "+50 HP (PEDIDO DE COMIDA RAPPI) 🍔", "#2ecc71");
        } else if (c.itemType === 'sacol') {
          p.action = 'sniff';
          p.actionTimer = 0.55;
          p.vx = 0; p.vz = 0;
          p.speedBoostTimer = 10.0;
          if (window.retroAudio.playSniff) window.retroAudio.playSniff();
          this.addFloatingText(p.x, p.z - 120, "¡SNIFFF! ¡VELOCIDAD SACOL 5X (10s)! ⚡⚡", "#f1c40f");
        }

        this.addHitSparks(c.x, c.z - 10);
        this.collectibles.splice(i, 1);
      }
    }

    if (this.stageTransitionTimer > 0) {
      this.stageTransitionTimer -= dt;
    }

    // Partículas y textos
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const part = this.particles[i];
      part.x += part.vx * dt;
      part.y += part.vy * dt;
      part.life -= dt;
      if (part.life <= 0) this.particles.splice(i, 1);
    }

    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y -= 25 * dt;
      ft.life -= dt;
      if (ft.life <= 0) this.floatingTexts.splice(i, 1);
    }

    // Cámara con seguimiento suave
    const targetCamX = p.x - this.vWidth / 2 + 30;
    this.cameraX += (targetCamX - this.cameraX) * 0.12;
    const minCamX = (this.currentStage === 2 && this.boss.active && !this.boss.defeated) ? 1450 : 0;
    this.cameraX = Math.max(minCamX, Math.min(this.worldWidth - this.vWidth, this.cameraX));

    this.pollGamepads();
  }

  throwDeliveryBox(enemy) {
    const dir = enemy.facingRight ? 1 : -1;
    this.projectiles.push({
      spriteKey: 'flying_burger',
      x: enemy.x + dir * 30,
      z: enemy.z,
      y: enemy.z - 65,
      vx: dir * 260,
      vy: -180
    });
    this.addFloatingText(enemy.x, enemy.z - 120, "¡TOME SU PEDIDO!", "#e67e22");
  }

  pollGamepads() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = gamepads[0];
    if (!gp) return;

    this.prevGpButtons = this.prevGpButtons || {};
    window.retroAudio.init();
    const stickX = gp.axes[0] || 0;
    const stickY = gp.axes[1] || 0;
    this.keys.left = stickX < -0.3 || gp.buttons[14]?.pressed;
    this.keys.right = stickX > 0.3 || gp.buttons[15]?.pressed;
    this.keys.up = stickY < -0.3 || gp.buttons[12]?.pressed;
    this.keys.down = stickY > 0.3 || gp.buttons[13]?.pressed;

    const b0 = !!gp.buttons[0]?.pressed;
    const b1 = !!(gp.buttons[1]?.pressed || gp.buttons[3]?.pressed);
    const b2 = !!gp.buttons[2]?.pressed;

    if (b0 && !this.prevGpButtons.b0) this.triggerJump();
    if (b2 && !this.prevGpButtons.b2) this.triggerAttack();
    if (b1 && !this.prevGpButtons.b1) this.triggerSpecial();

    this.prevGpButtons.b0 = b0;
    this.prevGpButtons.b1 = b1;
    this.prevGpButtons.b2 = b2;
    this.player.isDashing = !!gp.buttons[5]?.pressed;
  }

  // ==========================================
  // JEFES: TESTIGO DE JEHOVÁ & TITÁN
  // ==========================================
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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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
  }

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

  // ==========================================
  // RENDERIZADO CON DYNAMIC Y/Z-SORTING (SOK/SOR)
  // ==========================================
  render() {
    const ctx = this.ctx;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, this.vWidth, this.vHeight);

    if (this.gameState === 'TITLE') {
      this.drawTitleScreen(ctx);
      return;
    }

    if (this.gameState === 'CHAR_SELECT') {
      this.drawCharSelectScreen(ctx);
      return;
    }

    // 1. Fondos con Paralaje
    const isStage2 = this.currentStage === 2;
    const isStage3 = this.currentStage === 3;
    const farKey = isStage3 ? 'bg3_far' : (isStage2 ? 'bg2_far' : 'bg_far');
    const midKey = isStage3 ? 'bg3_mid' : (isStage2 ? 'bg2_mid' : 'bg_mid');
    const nearKey = isStage3 ? null : (isStage2 ? 'bg2_near' : 'bg_near');

    const bgFar = window.spriteManager.getImage(farKey);
    if (bgFar && bgFar.complete) {
      const farWidth = bgFar.naturalWidth || this.vWidth;
      const farScrollBase = isStage3 ? (this.canal.distance * 0.18) : (this.cameraX * 0.06);
      const farOffset = Math.floor(farScrollBase % farWidth);
      ctx.drawImage(bgFar, -farOffset, 0, farWidth, this.vHeight);
      ctx.drawImage(bgFar, farWidth - farOffset, 0, farWidth, this.vHeight);
    }

    // Cabina animada del Metrocable de Medellín deslizándose sobre las montañas
    // Metrocable eliminado por completo

    const bgMid = window.spriteManager.getImage(midKey);
    if (bgMid && bgMid.complete) {
      const midWidth = bgMid.naturalWidth || this.vWidth;
      const midScrollBase = isStage3 ? (this.canal.distance * 0.45) : (this.cameraX * 0.20);
      const midOffset = Math.floor(midScrollBase % midWidth);
      ctx.drawImage(bgMid, -midOffset, 0, midWidth, this.vHeight);
      ctx.drawImage(bgMid, midWidth - midOffset, 0, midWidth, this.vHeight);
    }

    const bgNear = nearKey ? window.spriteManager.getImage(nearKey) : null;
    if (bgNear && bgNear.complete) {
      const nearWidth = bgNear.naturalWidth || this.vWidth;
      const nearOffset = Math.floor((this.cameraX * 0.45) % nearWidth);
      ctx.drawImage(bgNear, -nearOffset, 0, nearWidth, this.vHeight);
      ctx.drawImage(bgNear, nearWidth - nearOffset, 0, nearWidth, this.vHeight);
    }

    // 2. Plano de juego en coordenadas del mundo (fijo y nítido)
    ctx.save();
    const isShaking = this.boss.screenShake > 0.04;
    const shakeMagnitude = isShaking ? this.boss.screenShake : 0;
    const shakeMultX = isStage3 ? 4 : 8;
    const shakeMultY = isStage3 ? 3 : 6;
    const shakeX = isShaking ? Math.round((Math.random() - 0.5) * shakeMagnitude * shakeMultX) : 0;
    const shakeY = isShaking ? Math.round((Math.random() - 0.5) * shakeMagnitude * shakeMultY) : 0;
    const camX = isStage3 ? 0 : Math.floor(this.cameraX);
    ctx.translate(-camX + shakeX, shakeY);

    // Plataforma / Andén base (en Nivel 2 termina en x=2430 abriendo un vacío real hacia el canal)
    if (!isStage3) {
      const groundImg = window.spriteManager.getImage('ground_platform');
      const maxGroundX = isStage2 ? 2430 : this.worldWidth;
      const groundH = this.vHeight - 280; // 80px: cubre exactamente de Y=280 a Y=360 sin huecos inferiores
      if (groundImg && groundImg.complete) {
        const gw = groundImg.naturalWidth || 640;
        for (let gx = 0; gx < maxGroundX; gx += gw) {
          const drawW = Math.min(gw, maxGroundX - gx);
          if (drawW > 0) {
            ctx.drawImage(groundImg, 0, 0, drawW, groundImg.naturalHeight, gx, 280, drawW, groundH);
          }
        }
      } else {
        ctx.fillStyle = '#9b3e2a';
        ctx.fillRect(0, 280, maxGroundX, groundH);
      }

    // Marcadores de lluvia de biblias en el suelo (Aislado con save/restore)
    this.boss.rainWarnings.forEach(rw => {
      ctx.save();
      const pulse = Math.sin(Date.now() / 80) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(231, 76, 60, ${0.45 * pulse})`;
      ctx.beginPath();
      ctx.ellipse(rw.x, rw.z || this.floorZ, 24, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#f1c40f';
      ctx.font = 'bold 11px monospace';
      ctx.fillText("¡!", rw.x - 4, (rw.z || this.floorZ) - 12);
      ctx.restore();
    });

    // Ondas expansivas terrestres
    this.boss.shockwaves.forEach(sw => {
      ctx.save();
      ctx.fillStyle = '#f1c40f';
      ctx.beginPath();
      ctx.ellipse(sw.x, sw.z || this.floorZ, 16, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(sw.x, sw.z || this.floorZ, 9, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    }

    // Estación Metrocable
    if (this.currentStage === 1) {
      this.drawStairsLevel1(ctx, this.worldWidth, this.floorZ);
    } else if (this.currentStage === 2) {
      this.drawStairsLandingLevel2(ctx, 80, this.floorZ);
      this.drawCanalLedgeLevel2(ctx, 2450, this.floorZ);
    } else if (this.currentStage === 3) {
      this.drawCanalStage3(ctx);
    }

    // ==========================================
    // 3. LISTA UNIFICADA Y ORDENADA POR PROFUNDIDAD (Y/Z-SORTING)
    // ==========================================
    const renderList = [];

    if (this.currentStage !== 3) {
      // Moto aparcada
      renderList.push({
        type: 'moto',
        x: this.parkedMoto.x,
        z: this.parkedMoto.z,
        elevY: 0
      });

      // Puesto de empanadas Doña Gloria
      if (this.currentStage === 1) {
        renderList.push({
          type: 'empanadas',
          x: this.npc.x,
          z: this.npc.z,
          elevY: 0
        });
      }

      // Carrito de La Atalaya y props de advertencia
      if (this.currentStage === 2) {
        renderList.push({
          type: 'testigo_cart',
          x: this.testigoCart.x,
          z: this.testigoCart.z,
          elevY: 0
        });
        renderList.push({
          type: 'prop_hotdog',
          x: 2410,
          z: this.floorZ - 12,
          elevY: 0
        });
        renderList.push({
          type: 'prop_sign_canal',
          x: 2455,
          z: this.floorZ - 28,
          elevY: 0
        });
      }

      // Fauna urbana
      this.critters.forEach(c => {
        renderList.push({
          type: 'critter',
          data: c,
          x: c.x,
          z: c.z,
          elevY: 0
        });
      });

      // Palomas ancladas al suelo o baranda física
      this.pigeons.forEach(b => {
        renderList.push({
          type: 'pigeon',
          data: b,
          x: b.x,
          z: b.z,
          elevY: b.elevY || 0
        });
      });

      // Coleccionables en el suelo
      this.collectibles.forEach(col => {
        renderList.push({
          type: 'collectible',
          data: col,
          x: col.x,
          z: col.z,
          elevY: col.bounceOffset || 0
        });
      });

      // Enemigos
      this.enemies.forEach(e => {
        renderList.push({
          type: 'enemy',
          data: e,
          x: e.x,
          z: e.z,
          elevY: e.elevY || 0
        });
      });

      // Jugador (Juancho)
      renderList.push({
        type: 'player',
        data: this.player,
        x: this.player.x,
        z: this.player.z,
        elevY: this.player.elevY
      });
    }

    renderList.sort((a, b) => a.z - b.z);

    // DIBUJAR SOMBRAS EN EL SUELO PRIMERO, LUEGO SPRITES (Protegido contra excepciones)
    renderList.forEach(item => {
      try {
        this.drawEntityShadow(ctx, item);
      } catch (err) {
        console.warn('Error en drawEntityShadow:', err);
      }
    });

    renderList.forEach(item => {
      try {
        this.drawEntitySprite(ctx, item);
      } catch (err) {
        console.warn('Error en drawEntitySprite:', err);
      }
    });

    // Proyectiles en vuelo
    this.projectiles.forEach(proj => {
      const pKey = proj.spriteKey || 'flying_burger';
      window.spriteManager.drawSprite(ctx, pKey, proj.x, proj.y, true, 1.0, proj.rotation || 0);
    });

    // Partículas, anillos de impacto y textos cómic
    this.particles.forEach(part => {
      if (part.isRing) {
        const prog = 1 - Math.max(0, part.life / (part.maxLife || 0.18));
        const rad = 6 + prog * 26;
        ctx.save();
        ctx.strokeStyle = prog < 0.5 ? '#ffffff' : part.color;
        ctx.globalAlpha = Math.max(0, 1 - prog);
        ctx.lineWidth = 2.5 - prog * 1.5;
        ctx.beginPath();
        ctx.arc(Math.floor(part.x), Math.floor(part.y), rad, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else {
        ctx.fillStyle = part.color;
        ctx.fillRect(Math.floor(part.x), Math.floor(part.y), part.size, part.size);
      }
    });

    this.floatingTexts.forEach(ft => {
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#000000';
      ctx.fillText(ft.text, Math.floor(ft.x - 24), Math.floor(ft.y + 1));
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, Math.floor(ft.x - 25), Math.floor(ft.y));
    });

    if (this.npc.talking) {
      this.drawDialogueBox(ctx, this.npc.x - 50, this.npc.z - 150, this.npc.dialogue);
    }

    ctx.restore();

    // 4. HUD / INTERFAZ ARCADE
    this.drawHUD(ctx);

    // 5. CINEMÁTICA GRAFFITI
    this.drawGraffitiCutscene(ctx);
    // 6. Cinemática cómic de la Rata Mutante en la Canalización
    this.drawRatCutscene(ctx);
  }

  // ==========================================
  // SOMBRAS DE CONTACTO Y RENDERIZADO DE ENTIDADES
  // ==========================================
  drawEntityShadow(ctx, item) {
    if (!item) return;
    try {
      const elev = Number.isFinite(item.elevY) ? Math.max(0, item.elevY) : 0;
      const scale = Math.max(0.2, Math.min(1.0, 1 / (1 + elev * 0.01)));
      let rx = 18 * scale;
      let rz = 6 * scale;

      if (item.type === 'enemy' && item.data && item.data.id === 'titan') {
        rx = 75 * scale;
        rz = 22 * scale;
      } else if (item.type === 'enemy' && item.data && item.data.role === 'trio_unit') {
        rx = 42 * scale;
        rz = 12 * scale;
      } else if (item.type === 'moto' || item.type === 'empanadas' || item.type === 'testigo_cart') {
        rx = 32;
        rz = 8;
      } else if (item.type === 'critter' || item.type === 'collectible') {
        rx = 10 * scale;
        rz = 4 * scale;
      }

      const ix = Number.isFinite(item.x) ? item.x : 0;
      const iz = Number.isFinite(item.z) ? item.z : (this.floorZ || 315);
      rx = Math.max(1, rx);
      rz = Math.max(1, rz);

      ctx.save();
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.4, 0.32 * scale)})`;
      ctx.beginPath();
      ctx.ellipse(ix, iz, rx, rz, 0, 0, Math.PI * 2);
      ctx.fill();
    } catch (e) {
      console.warn('drawEntityShadow error:', e);
    } finally {
      ctx.restore();
    }
  }

  drawEntitySprite(ctx, item) {
    const renderY = item.z - (item.elevY || 0);

    if (item.type === 'moto') {
      window.spriteManager.drawSprite(ctx, 'rappi_moto', item.x, renderY, true);
    } else if (item.type === 'empanadas') {
      this.drawEmpanadaCart(ctx, item.x, renderY);
    } else if (item.type === 'prop_hotdog') {
      const hotdogImg = window.spriteManager.getImage('prop_hotdog');
      if (hotdogImg && hotdogImg.complete) {
        ctx.save();
        ctx.fillStyle = 'rgba(10, 10, 15, 0.45)';
        ctx.beginPath();
        ctx.ellipse(item.x, renderY, 16, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        const hw = 36;
        const hh = Math.floor(hw * (hotdogImg.naturalHeight / hotdogImg.naturalWidth));
        ctx.drawImage(hotdogImg, item.x - hw / 2, renderY - hh + 4, hw, hh);
        ctx.restore();
      }
    } else if (item.type === 'prop_sign_canal') {
      const signImg = window.spriteManager.getImage('prop_sign_canal');
      if (signImg && signImg.complete) {
        ctx.save();
        ctx.fillStyle = '#4a5568';
        ctx.fillRect(item.x - 3, renderY - 70, 6, 70);
        ctx.fillStyle = '#718096';
        ctx.fillRect(item.x - 2, renderY - 70, 2, 70);
        const sw = 64;
        const sh = Math.floor(sw * (signImg.naturalHeight / signImg.naturalWidth));
        ctx.drawImage(signImg, item.x - sw / 2, renderY - 70 - sh, sw, sh);
        ctx.restore();
      }
    } else if (item.type === 'testigo_cart') {
      window.spriteManager.drawSprite(ctx, 'testigo_cart', item.x, renderY, true);
      if (Math.abs(this.player.x - item.x) < 70) {
        ctx.fillStyle = 'rgba(15, 12, 28, 0.88)';
        ctx.fillRect(item.x - 48, renderY - 82, 96, 16);
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 1;
        ctx.strokeRect(item.x - 48, renderY - 82, 96, 16);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 7.5px monospace';
        ctx.fillText("LA ATALAYA / GRATIS", item.x - 44, renderY - 77);
      }
    } else if (item.type === 'pigeon') {
      const b = item.data;
      let pKey = b.flying ? 'pigeon_fly' : 'pigeon';
      // Picoteo ocasional en el suelo
      let offsetY = 0;
      if (!b.flying && Math.floor(b.peckTimer * 3) % 4 === 0) {
        offsetY = 1.5;
      }
      window.spriteManager.drawSprite(ctx, pKey, item.x, renderY + offsetY, (b.vx >= 0));
    } else if (item.type === 'critter') {
      const c = item.data;
      let spriteKey = 'rat_todito';
      if (c.itemType === 'cigar') spriteKey = 'rat_cigar';
      else if (c.itemType === 'cockroach') spriteKey = 'cockroach';
      window.spriteManager.drawSprite(ctx, spriteKey, item.x, renderY, c.facingRight);
    } else if (item.type === 'collectible') {
      const col = item.data;
      window.spriteManager.drawSprite(ctx, col.spriteKey, item.x, renderY, true);
    } else if (item.type === 'player') {
      const p = item.data;
      // Parpadeo arcade nítido sin huecos transparentes (flicker a 60ms)
      const isPlayerBlink = p.invulnerableTimer > 0 && Math.floor(Date.now() / 65) % 2 === 0;
      const pAlpha = isPlayerBlink ? 0.65 : 1.0;

      let pSprite = 'player_idle1';
      let scaleX = 1.0;
      let scaleY = 1.0;
      let offsetX = 0;
      let offsetY = 0;
      let rotation = 0;

      // 1. REPOSO (IDLE): Respiración viva rítmica
      if (p.action === 'idle') {
        const idleCycle = ['player_idle1', 'player_idle2', 'player_idle3', 'player_idle2'];
        const idleIdx = Math.floor(Date.now() / 220) % 4;
        pSprite = idleCycle[idleIdx];

        const breathe = Math.sin(Date.now() / 240);
        scaleY = 1.0 + breathe * 0.022;
        scaleX = 1.0 - breathe * 0.012;
        offsetY = breathe * 0.8;
      } 
      // 2. CAMINATA (WALK): Ciclo fluido de 6 cuadros
      else if (p.action === 'walk') {
        const walkCycle = ['player_walk1', 'player_walk2', 'player_walk3', 'player_walk2', 'player_walk1', 'player_walk3'];
        pSprite = walkCycle[p.frame % 6];
        offsetY = (p.frame % 2 === 0 ? -1 : 1);
      } 
      // 3. CARRERA (RUN / DASH): SPRINT DE 6 CUADROS COMPLETAMENTE DEDICADOS
      else if (p.action === 'run') {
        const runCycle = ['player_run_1', 'player_run_2', 'player_run_3', 'player_run_4', 'player_run_5', 'player_run_6'];
        pSprite = runCycle[p.frame % 6];
        rotation = (p.facingRight ? 0.08 : -0.08); // Inclinación aerodinámica (~4.5°)
        offsetY = (p.frame % 2 === 0 ? -2 : 0);
      } 
      else if (p.action === 'rail') {
        pSprite = 'player_rail';
        rotation = Math.sin(Date.now() / 180) * 0.04;
      } 
      // 4. SALTO CON 4 FASES VERTICALES REALES
      else if (p.action === 'jump') {
        if (p.vy < -120) {
          pSprite = 'player_jump_ascend'; // Impulso ascendente
        } else if (Math.abs(p.vy) <= 120) {
          pSprite = 'player_jump_peak'; // Cúspide del salto
        } else {
          pSprite = 'player_jump_descend'; // Descenso en gravedad
        }
      } 
      // 5. PATADA VOLADORA (JUMPKICK AÉREA HORIZONTAL)
      else if (p.action === 'jumpkick') {
        pSprite = 'player_jumpkick';
        scaleX = 1.0;
        scaleY = 1.0;
        offsetX = (p.facingRight ? 8 : -8);
      } 
      // 6. PUÑO DIRECTO (JAB FRONTAL SÓLIDO)
      else if (p.action === 'punch') {
        pSprite = 'player_punch_jab';
        offsetX = (p.facingRight ? 4 : -4);
      } 
      // 6.5. RECTO DE DERECHA (CROSS POTENTE CON GIRO DE TORSO)
      else if (p.action === 'cross') {
        pSprite = 'player_punch_cross';
        offsetX = (p.facingRight ? 6 : -6);
      }
      // 7. GANCHO AL MENTÓN (EXPLOSIVE UPPERCUT ASCENDENTE)
      else if (p.action === 'uppercut') {
        pSprite = 'player_punch_hook';
        offsetX = (p.facingRight ? 3 : -3);
      }
      // 8. PATADA MEDIA (ROUNDHOUSE AL PECHO)
      else if (p.action === 'midkick') {
        pSprite = 'player_kick_roundhouse';
        offsetX = (p.facingRight ? 6 : -6);
      }
      // 9. PATADA BAJA (BARRIDA A RAS DE SUELO)
      else if (p.action === 'lowkick') {
        pSprite = 'player_kick_low';
        offsetX = (p.facingRight ? 6 : -6);
      }
      // 10. PATADA DRAGÓN FINISHER (K.O.)
      else if (p.action === 'kick') {
        pSprite = 'player_kick_dragon';
        offsetX = (p.facingRight ? 8 : -8);
      } 
      // 11. ATAQUE BLITZ (EMBESTIDA DE HOMBRO A ESCALA 1.0 PURA)
      else if (p.action === 'blitz') {
        pSprite = 'player_blitz';

        const blitzSpr = (this.selectedCharId && this.selectedCharId !== 'juancho') ? (this.selectedCharId + '_blitz') : pSprite;
        const finalBlitz = (window.spriteManager && window.spriteManager.images[blitzSpr]) ? blitzSpr : pSprite;
        ctx.save();
        ctx.globalAlpha = 0.35;
        window.spriteManager.drawSprite(ctx, finalBlitz, item.x + (p.facingRight ? -24 : 24), renderY, p.facingRight);
        ctx.globalAlpha = 0.18;
        window.spriteManager.drawSprite(ctx, finalBlitz, item.x + (p.facingRight ? -46 : 46), renderY, p.facingRight);
        ctx.restore();
      } 
      // 12. RODADA EVASIVA CON VOLTERETA 360° REAL O DOBLE SALTO AÉREO
      else if (p.action === 'roll' || p.action === 'doublejump') {
        pSprite = 'player_jump_peak';
        const dur = (p.action === 'doublejump') ? (p.doubleJumpDuration || 0.42) : 0.28;
        const rollProgress = Math.max(0, Math.min(1, (dur - p.actionTimer) / dur));
        rotation = (p.facingRight ? 1 : -1) * rollProgress * Math.PI * 2;
      } 
      // 13. AGARRE Y RODILLAZOS (DE PIE A ESCALA 1.0 PURA)
      else if (p.action === 'grab') {
        pSprite = (p.grabHits > 0) ? 'player_punch_cross' : 'player_punch_jab';
      } 
      // 14. SÚPLEX CALLEJERO (PUENTE ARQUEADO A ESCALA 1.0 PURA)
      else if (p.action === 'throw') {
        pSprite = 'player_suplex';
      } 
      // 15. ESPECIAL 360° (ESCALA 1.0 PURA)
      else if (p.action === 'special') {
        const specToggle = (Math.floor(Date.now() / 75) % 2 === 0);
        pSprite = specToggle ? 'player_kick_roundhouse' : 'player_punch_cross';

        ctx.save();
        ctx.strokeStyle = 'rgba(241, 196, 15, 0.55)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(item.x, renderY - 45, 42, 16, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } 
      // 13. REACCIÓN DE DAÑO (HURT)
      else if (p.action === 'hurt') {
        pSprite = 'player_hurt';
        offsetX = Math.sin(p.actionTimer * 45) * 4;
        rotation = (p.facingRight ? -0.14 : 0.14);
      } 
      else if (p.action === 'sniff') {
        pSprite = 'player_sniff';
      } 
      else if (p.action === 'eat') {
        pSprite = 'player_eat';
      }

      // Resolución dinámica de sprite por personaje (Juancho / Lina)
      let resolvedPlayerSprite = pSprite;
      if (this.selectedCharId && this.selectedCharId !== 'juancho') {
        const charSpecific = pSprite.replace(/^player_/, this.selectedCharId + '_');
        if (window.spriteManager && window.spriteManager.images[charSpecific]) {
          resolvedPlayerSprite = charSpecific;
        }
      }

      window.spriteManager.drawSprite(ctx, resolvedPlayerSprite, item.x, renderY, p.facingRight, pAlpha, rotation, scaleX, scaleY, offsetX, offsetY);

    } else if (item.type === 'enemy') {
      const e = item.data;
      // Parpadeo arcade nítido (alpha 0.65) para que nunca se vuelva transparente ni glitcheado
      const isBlinking = e.invulnerableTimer > 0 && Math.floor(Date.now() / 65) % 2 === 0;
      const alpha = isBlinking ? 0.65 : 1.0;

      let eSprite = '';
      let scaleX = 1.0;
      let scaleY = 1.0;
      let offsetX = 0;
      let offsetY = 0;
      let rotation = 0;

      // ==========================================
      // GAMÍN DE MEDELLÍN (100% SÓLIDO, CERO GLITCHES)
      // ==========================================
      if (e.id === 'gamin') {
        if (e.state === 'patrol') {
          const gaminWalk = ['gamin_walk_1', 'gamin_walk_2', 'gamin_walk_3', 'gamin_walk_4', 'gamin_walk_5', 'gamin_walk_6'];
          eSprite = gaminWalk[(e.frame || 0) % 6];
        } else if (e.state === 'charge') {
          // Si está a corta distancia, lanza la estocada baja
          const distToP = Math.hypot(this.player.x - e.x, this.player.z - e.z);
          if (distToP < 70) {
            eSprite = 'gamin_knife_stab'; // Estocada baja agachada a escala 1.0 limpia
            offsetX = (e.facingRight ? 6 : -6);
          } else {
            const gaminWalk = ['gamin_walk_1', 'gamin_walk_2', 'gamin_walk_3', 'gamin_walk_4', 'gamin_walk_5', 'gamin_walk_6'];
            eSprite = gaminWalk[(e.frame || 0) % 6];
          }
        } else if (e.state === 'sniff') {
          const isSniffIn = Math.floor(Date.now() / 250) % 2 === 0;
          eSprite = isSniffIn ? 'gamin_sniff_inhale' : 'gamin_sniff_exhale';
        } else if (e.state === 'slash') {
          if (e.stateTimer > 0.22) {
            eSprite = 'gamin_knife_ready'; // Cuchillo alzado
            offsetX = (e.facingRight ? -4 : 4);
          } else {
            eSprite = 'gamin_knife_slash'; // Zarpazo con estela plateada a escala 1.0 limpia
            offsetX = (e.facingRight ? 7 : -7);
          }
        } else if (e.state === 'crouch') {
          eSprite = 'gamin_crouch';
        } else if (e.state === 'hurt' || e.state === 'grabbed') {
          eSprite = 'gamin_hurt';
          offsetX = Math.sin((e.stateTimer || 0) * 45) * 4;
        } else if (e.state === 'ko') {
          eSprite = 'gamin_ko';
          if (e.isFlyingBody && e.elevY > 0) {
            rotation = (e.vx > 0 ? 1 : -1) * (1.2 - (e.stateTimer || 0)) * Math.PI * 3.5;
          }
        }

        window.spriteManager.drawSprite(ctx, eSprite, item.x, renderY, e.facingRight, alpha, rotation, scaleX, scaleY, offsetX, offsetY);

      } 
      // ==========================================
      // RAPPI-GAMÍN MEDELLÍN (ESCALA 1.0 PURA)
      // ==========================================
      else if (e.id === 'rappi') {
        if (e.state === 'patrol') {
          const rappiWalk = ['rappi_walk_1', 'rappi_walk_2', 'rappi_walk_3', 'rappi_walk_4'];
          eSprite = rappiWalk[(e.frame || 0) % 4];
        } else if (e.state === 'charge') {
          eSprite = 'rappi_box_ram'; // Embestida frontal con caja a escala 1.0
          offsetX = (e.facingRight ? 5 : -5);
        } else if (e.state === 'throw') {
          eSprite = 'rappi_box_throw'; // Lanzamiento en arco a escala 1.0
        } else if (e.state === 'eat') {
          eSprite = 'rappi_eat';
        } else if (e.state === 'hurt' || e.state === 'grabbed') {
          eSprite = 'rappi_hurt';
          offsetX = Math.sin((e.stateTimer || 0) * 45) * 4;
        } else if (e.state === 'ko') {
          eSprite = 'rappi_ko';
          if (e.isFlyingBody && e.elevY > 0) {
            rotation = (e.vx > 0 ? 1 : -1) * (1.2 - (e.stateTimer || 0)) * Math.PI * 3.5;
          }
        }

        window.spriteManager.drawSprite(ctx, eSprite, item.x, renderY, e.facingRight, alpha, rotation, scaleX, scaleY, offsetX, offsetY);

      } 
      // ==========================================
      // HERMANO FABIO Y TRÍO DE TESTIGOS (CPS3 100% LIMPIOS)
      // ==========================================
      else if (e.id === 'testigo') {
        if (e.role === 'trio_unit') {
          if (e.state === 'throw') {
            eSprite = 'testigo_trio_attack';
            offsetX = (e.facingRight ? 5 : -5);
          } else if (e.state === 'hurt' || e.state === 'grabbed') {
            eSprite = 'testigo_trio_hurt';
            offsetX = Math.sin((e.stateTimer || 0) * 45) * 4;
          } else if (e.state === 'ko') {
            eSprite = 'testigo_trio_hurt';
            if (e.isFlyingBody && e.elevY > 0) {
              rotation = (e.vx > 0 ? 1 : -1) * (1.2 - (e.stateTimer || 0)) * Math.PI * 3.5;
            }
          } else {
            eSprite = 'testigo_trio_march';
            offsetY = ((e.frame || 0) % 2 === 0 ? -1 : 1);
          }
        } else {
          if (e.state === 'stand') {
            eSprite = 'testigo_stand';
          } else if (e.state === 'patrol') {
            const testigoWalk = ['testigo_walk_1', 'testigo_walk_2', 'testigo_walk_3', 'testigo_walk_4'];
            eSprite = testigoWalk[(e.frame || 0) % 4];
          } else if (e.state === 'throw') {
            if (e.stateTimer > 0.22) {
              eSprite = 'testigo_bible_raise';
              offsetY = -2;
            } else {
              eSprite = 'testigo_bible_strike';
              offsetX = (e.facingRight ? 6 : -6);
            }
          } else if (e.state === 'pray') {
            eSprite = 'testigo_pray';
            offsetY = Math.sin(Date.now() / 160) * 4 - 3;
            const auraPulse = Math.sin(Date.now() / 120) * 8 + 26;
            ctx.fillStyle = 'rgba(241, 196, 15, 0.25)';
            ctx.beginPath();
            ctx.arc(item.x, renderY - 48 + offsetY, auraPulse, 0, Math.PI * 2);
            ctx.fill();
          } else if (e.state === 'hurt' || e.state === 'grabbed') {
            eSprite = 'testigo_hurt';
            offsetX = Math.sin((e.stateTimer || 0) * 45) * 4;
          } else if (e.state === 'ko') {
            eSprite = 'testigo_ko';
            if (e.isFlyingBody && e.elevY > 0) {
              rotation = (e.vx > 0 ? 1 : -1) * (1.2 - (e.stateTimer || 0)) * Math.PI * 3.5;
            }
          }
        }

        window.spriteManager.drawSprite(ctx, eSprite, item.x, renderY, e.facingRight, alpha, rotation, scaleX, scaleY, offsetX, offsetY);

      } 
      // ==========================================
      // SÚPER TESTIGO TITÁNICO (GÓLEM HUMANOIDE CPS3)
      // ==========================================
      else if (e.id === 'titan') {
        eSprite = 'titan_idle';
        if (e.state === 'idle') {
          scaleY = 1.0;
          scaleX = 1.0;
        } else if (e.state === 'slam') {
          eSprite = 'titan_slam';
        } else if (e.state === 'rain') {
          eSprite = 'titan_rain';
          ctx.fillStyle = 'rgba(255, 240, 180, 0.28)';
          ctx.fillRect(item.x - 45, 0, 90, this.floorZ);
        } else if (e.state === 'hurt') {
          eSprite = 'titan_idle';
          offsetX = Math.sin(Date.now() / 30) * 3;
        } else if (e.state === 'ko') {
          eSprite = 'titan_slam';
        }

        window.spriteManager.drawSprite(ctx, eSprite, item.x, renderY, e.facingRight, alpha, rotation, scaleX, scaleY, offsetX, offsetY);
      }

      // Estrellas orbitales de KO
      if (e.state === 'ko' && e.elevY <= 0) {
        for (let i = 0; i < 3; i++) {
          const angle = (e.starsAngle || 0) + (i * (Math.PI * 2 / 3));
          const starX = item.x + Math.cos(angle) * 22;
          const starY = renderY - 110 + Math.sin(angle) * 8;
          ctx.fillStyle = '#f1c40f';
          ctx.fillRect(Math.floor(starX), Math.floor(starY), 5, 5);
        }
      }
    }
  }

  drawEmpanadaCart(ctx, x, y) {
    window.spriteManager.drawSprite(ctx, 'empanadas_cart', x - 25, y, true);
    
    // Doña Gloria respira sutilmente de pie atendiendo el puesto (sin tirones de caminata estática)
    const breathe = Math.sin(Date.now() / 320);
    const gScaleY = 1.0 + breathe * 0.018;
    const gScaleX = 1.0 - breathe * 0.01;
    window.spriteManager.drawSprite(ctx, 'gloria_idle', x + 35, y, false, 1.0, 0, gScaleX, gScaleY);
    window.spriteManager.drawSprite(ctx, 'item_tinto', x - 10, y - 52, true);

    if (Math.abs(this.player.x - x) < 80) {
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(x - 20, y - 110, 100, 18);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 9px monospace';
      ctx.fillText("[F / ACCIÓN] HABLAR", x - 16, y - 98);
    }
  }

  drawMetrocableCabin(ctx) {
    // Metrocable eliminado de todos los niveles
  }

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
  }

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
  }

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

  drawTitleScreen(ctx) {
    const time = Date.now();

    // 1. Fondo de Medellín al atardecer (con el Edificio Coltejer reconocible)
    const bg = window.spriteManager.getImage('title_bg');
    if (bg && bg.complete) {
      ctx.drawImage(bg, 0, 0, this.vWidth, this.vHeight);
    } else {
      ctx.fillStyle = '#1a0c2e';
      ctx.fillRect(0, 0, this.vWidth, this.vHeight);
    }

    // 2. Luces nocturnas titilantes sobre el valle
    ctx.fillStyle = 'rgba(255, 230, 150, 0.7)';
    for (let i = 0; i < 18; i++) {
      const lx = 140 + (i * 26) % 360;
      const ly = 195 + (i * 17) % 65;
      const tw = Math.sin(time / 200 + i) * 0.5 + 0.5;
      if (tw > 0.4) {
        ctx.fillRect(lx, ly, 1.5, 1.5);
      }
    }

    // 3. Título en Grafiti Colorido: "LA CIUDAD DE LA ETERNA PELEADERA"
    const logo = window.spriteManager.getImage('title_logo_graffiti');
    const bobY = Math.sin(time / 550) * 3;
    const lw = 315;
    const lh = logo && logo.complete ? Math.floor(lw * (logo.naturalHeight / logo.naturalWidth)) : 194;
    const lx = Math.floor((this.vWidth - lw) / 2);
    const ly = 16 + bobY;

    if (logo && logo.complete) {
      ctx.save();
      ctx.shadowColor = 'rgba(8, 4, 18, 0.95)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;
      ctx.drawImage(logo, lx, ly, lw, lh);
      ctx.restore();
    } else {
      ctx.fillStyle = '#f1c40f';
      ctx.font = '900 18px monospace';
      ctx.textAlign = 'center';
      ctx.fillText("LA CIUDAD DE LA ETERNA PELEADERA", this.vWidth / 2, 70);
    }

    // 4. Subtítulo Arcade Edición Medellín
    ctx.fillStyle = '#f1c40f';
    ctx.font = '900 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText("★ ARCADE BEAT 'EM UP • EDICIÓN MEDELLÍN ★", this.vWidth / 2, ly + lh + 18);

    // 5. Botón pulsante: "Haz clic en Acción o la tecla de golpe para comenzar"
    const pulse = Math.sin(time / 140) * 0.35 + 0.65;
    const pBoxW = 460;
    const pBoxH = 26;
    const pBoxX = Math.floor((this.vWidth - pBoxW) / 2);
    const pBoxY = this.vHeight - 54;

    ctx.fillStyle = 'rgba(12, 8, 26, 0.92)';
    ctx.fillRect(pBoxX, pBoxY, pBoxW, pBoxH);
    ctx.strokeStyle = `rgba(241, 196, 15, ${pulse})`;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pBoxX, pBoxY, pBoxW, pBoxH);

    ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
    ctx.font = 'bold 8.5px monospace';
    ctx.textAlign = 'center';
    ctx.fillText("HAZ CLIC EN ACCIÓN O LA TECLA DE GOLPE PARA COMENZAR", this.vWidth / 2, pBoxY + 16);

    // 6. Leyenda de controles
    ctx.fillStyle = 'rgba(240, 240, 240, 0.8)';
    ctx.font = '7px monospace';
    ctx.fillText("[ Q / J ] GOLPE   •   [ F / ENTER / ESPACIO ] ACCIÓN   •   [ CLICK / TOUCH ] COMENZAR", this.vWidth / 2, this.vHeight - 12);
  }

  drawCharSelectScreen(ctx) {
    const time = Date.now();

    // 1. Fondo atardecer Medellín con filtro oscuro arcade
    const bg = window.spriteManager.getImage('title_bg');
    if (bg && bg.complete) {
      ctx.drawImage(bg, 0, 0, this.vWidth, this.vHeight);
    }
    ctx.fillStyle = 'rgba(10, 8, 22, 0.88)';
    ctx.fillRect(0, 0, this.vWidth, this.vHeight);

    // 2. Encabezado Arcade
    ctx.fillStyle = '#f1c40f';
    ctx.font = '900 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText("★ SELECCIONA TU LUCHADOR ★", this.vWidth / 2, 22);

    ctx.fillStyle = '#bdc3c7';
    ctx.font = '7px monospace';
    ctx.fillText("[ ← / → / D-PAD ] ELEGIR   •   [ GOLPE / ACCIÓN / CLICK ] CONFIRMAR", this.vWidth / 2, 34);

    // 3. Tarjetas del Roster de Luchadores
    const cardW = 92;
    const cardH = 126;
    const gap = 12;
    const totalW = this.roster.length * cardW + (this.roster.length - 1) * gap;
    const startX = (this.vWidth - totalW) / 2;
    const cardY = 44;

    this.roster.forEach((c, i) => {
      const cx = startX + i * (cardW + gap);
      const isSel = (i === this.charSelectIndex);

      ctx.fillStyle = isSel ? 'rgba(25, 20, 50, 0.95)' : 'rgba(15, 12, 30, 0.85)';
      ctx.fillRect(cx, cardY, cardW, cardH);

      if (isSel) {
        const pulse = Math.sin(time / 120) * 0.3 + 0.7;
        ctx.strokeStyle = `rgba(241, 196, 15, ${pulse})`;
        ctx.lineWidth = 2.5;
        ctx.strokeRect(cx - 2, cardY - 2, cardW + 4, cardH + 4);
      } else {
        ctx.strokeStyle = c.ready ? 'rgba(46, 204, 113, 0.4)' : 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx, cardY, cardW, cardH);
      }

      // Foto de perfil / Mugshot
      const pImg = window.spriteManager.getImage(c.portrait);
      if (pImg && pImg.complete) {
        ctx.drawImage(pImg, cx + 8, cardY + 8, cardW - 16, cardW - 16);
        if (!c.ready) {
          ctx.fillStyle = 'rgba(8, 6, 18, 0.55)';
          ctx.fillRect(cx + 8, cardY + 8, cardW - 16, cardW - 16);
        }
      }

      // Nombre
      ctx.fillStyle = isSel ? '#f1c40f' : '#ffffff';
      ctx.font = '900 8.5px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(c.name, cx + cardW / 2, cardY + 102);

      // Etiqueta de Estado
      ctx.fillStyle = c.color;
      ctx.font = 'bold 7px monospace';
      ctx.fillText(c.status, cx + cardW / 2, cardY + 116);
    });

    // 4. Panel de Detalles del Personaje Seleccionado
    const selChar = this.roster[this.charSelectIndex];
    const panX = 40;
    const panY = 180;
    const panW = 560;
    const panH = 135;

    ctx.fillStyle = 'rgba(14, 10, 28, 0.94)';
    ctx.fillRect(panX, panY, panW, panH);
    ctx.strokeStyle = selChar.ready ? '#2ecc71' : 'rgba(241, 196, 15, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(panX, panY, panW, panH);

    // Biografía & Estilo
    ctx.fillStyle = selChar.color;
    ctx.font = '900 11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`${selChar.name}: ${selChar.epithet}`, panX + 16, panY + 22);

    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 7.5px monospace';
    ctx.fillText(`ESTILO: ${selChar.style}`, panX + 16, panY + 38);

    ctx.fillStyle = '#ecf0f1';
    ctx.font = '7.5px monospace';
    ctx.fillText(selChar.bio, panX + 16, panY + 54);
    ctx.fillText(`MOVIMIENTO ESPECIAL: ${selChar.special}`, panX + 16, panY + 68);

    // Barras de Estadísticas
    const stats = [
      { name: 'VELOCIDAD', val: selChar.speed, max: 5 },
      { name: 'PODER',     val: selChar.power, max: 5 },
      { name: 'TÉCNICA',   val: selChar.tech, max: 5 }
    ];
    stats.forEach((st, idx) => {
      const sy = panY + 88 + idx * 14;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(st.name, panX + 16, sy);

      const bx = panX + 85;
      const bw = 100;
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fillRect(bx, sy - 7, bw, 8);
      ctx.fillStyle = selChar.color;
      ctx.fillRect(bx, sy - 7, (st.val / st.max) * bw, 8);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(bx, sy - 7, bw, 8);
    });

    // Vista previa animada del sprite (Juancho)
    const sprX = panX + 440;
    const sprY = panY + 115;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.ellipse(sprX, sprY - 4, 30, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    if (selChar.id === 'juancho') {
      const idleFrames = ['player_idle1', 'player_idle2', 'player_idle3', 'player_idle2'];
      const fIdx = Math.floor(time / 220) % idleFrames.length;
      window.spriteManager.drawSprite(ctx, idleFrames[fIdx], sprX, sprY, true, 1.0, 0, 1.6, 1.6);
    } else if (selChar.id === 'lina') {
      const idleFrames = ['lina_idle1', 'lina_idle2', 'lina_idle3', 'lina_idle2'];
      const fIdx = Math.floor(time / 220) % idleFrames.length;
      window.spriteManager.drawSprite(ctx, idleFrames[fIdx], sprX, sprY, true, 1.0, 0, 1.6, 1.6);
    } else if (selChar.id === 'gloria') {
      const idleFrames = ['gloria_idle1', 'gloria_idle2', 'gloria_idle3', 'gloria_idle2'];
      const fIdx = Math.floor(time / 220) % idleFrames.length;
      window.spriteManager.drawSprite(ctx, idleFrames[fIdx], sprX, sprY, true, 1.0, 0, 1.6, 1.6);
    } else {
      const pImg = window.spriteManager.getImage(selChar.portrait);
      if (pImg && pImg.complete) {
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.drawImage(pImg, sprX - 35, sprY - 80, 70, 70);
        ctx.restore();
      }
      ctx.fillStyle = '#e74c3c';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText("🔒 BLOQUEADO", sprX, sprY - 4);
    }

    // 5. Botón de Confirmación en la parte inferior
    const btnW = 460;
    const btnH = 24;
    const btnX = (this.vWidth - btnW) / 2;
    const btnY = this.vHeight - 34;

    if (selChar.ready) {
      const pulse = Math.sin(time / 140) * 0.25 + 0.75;
      ctx.fillStyle = `rgba(46, 204, 113, ${pulse})`;
      ctx.fillRect(btnX, btnY, btnW, btnH);
      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(btnX, btnY, btnW, btnH);

      ctx.fillStyle = '#0a0a14';
      ctx.font = '900 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('➔ [ ENTER / GOLPE / ACCIÓN ] INICIAR MISIÓN: LA VILLA DEL ABURRÁ', this.vWidth / 2, btnY + 15);
    } else {
      ctx.fillStyle = 'rgba(30, 20, 40, 0.9)';
      ctx.fillRect(btnX, btnY, btnW, btnH);
      ctx.strokeStyle = 'rgba(231, 76, 60, 0.7)';
      ctx.lineWidth = 1;
      ctx.strokeRect(btnX, btnY, btnW, btnH);

      ctx.fillStyle = '#e74c3c';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🔒 LUCHADOR BLOQUEADO • ELIGE A JUANCHO PARA COMENZAR', this.vWidth / 2, btnY + 15);
    }

    // Flash de selección al confirmar
    if (this.charSelectFlash > 0) {
      ctx.fillStyle = `rgba(255, 240, 180, ${this.charSelectFlash * 0.85})`;
      ctx.fillRect(0, 0, this.vWidth, this.vHeight);
    }
  }

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
  }

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
  }

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
  }

  updateCanal(dt) {
    if (!this.canal.active) return;

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

    // Mecánica de Mordisco de la Rata Colosal si Juancho se rezaga demasiado cerca de sus fauces
    const ratCycle = (this.canal.ratChompAnim % 2.4);
    if (ratCycle < 1.1) {
      this.canal.ratBiteHit = false;
    } else if (ratCycle >= 1.7 && !this.canal.ratBiteHit) {
      // Fase de Mordisco Snap: si Juancho está en el rango de alcance de la boca
      if (p.slopeX <= 315 && p.invulnerableTimer <= 0 && p.action !== 'hurt') {
        this.canal.ratBiteHit = true;
        p.hp = Math.max(0, p.hp - 25);
        p.invulnerableTimer = 1.0;
        p.action = 'hurt';
        p.actionTimer = 0.45;
        p.slopeX = Math.min(460, p.slopeX + 80); // Empuje hacia adelante para escapar del mordisco
        this.boss.screenShake = 0.75;
        if (window.retroAudio && window.retroAudio.playHit) window.retroAudio.playHit();
        const bitePos = this.canalToWorldCoords(p.slopeX, 30 + (p.laneY || 16) - 35);
        this.addFloatingText(bitePos.x, bitePos.y, "-25 HP ¡MORDISCO DE RATA COLOSAL!", "#e74c3c");
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
  }

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
          let drawW = obs.w;
          let drawH = obs.h;
          let drawY = obsLocalY - obs.h + 2;
          if (isHit) {
            // Proporción de aspecto nativa del sprite para evitar cualquier aplastamiento o deformación
            const aspect = (obsImg.naturalWidth && obsImg.naturalHeight) ? (obsImg.naturalWidth / obsImg.naturalHeight) : 1.0;
            const targetDim = Math.max(obs.w, obs.h) * 1.08;
            if (aspect >= 1.0) {
              drawW = Math.round(targetDim);
              drawH = Math.round(targetDim / aspect);
            } else {
              drawH = Math.round(targetDim);
              drawW = Math.round(targetDim * aspect);
            }
            drawY = obsLocalY - drawH + 2;
            if (obs.hitTimer > 0 && obs.hitType === 'kick') {
              drawY -= Math.sin((obs.hitTimer / 0.65) * Math.PI) * 28; // Salto en el aire al patearlo
            }
          }
          ctx.drawImage(obsImg, Math.round(obsX - drawW / 2), Math.round(drawY), drawW, drawH);
        } else {
          ctx.fillStyle = '#e67e22';
          ctx.fillRect(Math.round(obsX - obs.w / 2), Math.round(obsLocalY - obs.h), obs.w, obs.h);
        }
      }
    });

    // 4. JUGADOR (JUANCHO) - JUGABLE Y CON EL MISMO DISEÑO GRÁFICO DE PIXEL ART QUE LOS OTROS NIVELES
    const p = this.player;
    let pSprite = 'player_kick_low'; // Sprite nativo oficial de agachado / deslizamiento
    const isPlayerBlink = p.invulnerableTimer > 0 && Math.floor(Date.now() / 65) % 2 === 0;
    const pAlpha = isPlayerBlink ? 0.5 : 1.0;
    let rotation = 0;

    if (p.action === 'hurt') {
      pSprite = 'player_hurt';
    } else if (p.action === 'doublejump') {
      // Vuelta 360° en el aire con giro acrobático (usando player_jump_peak)
      pSprite = 'player_jump_peak';
      const dur = p.doubleJumpDuration || 0.42;
      const spinProgress = Math.max(0, Math.min(1, 1 - (p.actionTimer / dur)));
      rotation = spinProgress * Math.PI * 2;
    } else if (!p.grounded) {
      if (p.action === 'jumpkick') {
        pSprite = 'player_jumpkick';
      } else if (p.vy < -80) {
        pSprite = 'player_jump_ascend';
      } else if (Math.abs(p.vy) <= 80) {
        pSprite = 'player_jump_peak';
      } else {
        pSprite = 'player_jump_descend';
      }
    } else if (p.action === 'kick') {
      pSprite = 'player_kick_dragon';
    } else {
      // Posición de deslizamiento / crouching oficial del personaje
      pSprite = 'player_kick_low';
    }

    const pDrawX = Math.round(p.slopeX || 260);
    const pDrawY = Math.round(30 + (p.laneY || 16) - (p.elevY || 0));

    // Chispas de fricción bajo los tenis cuando raspa el concreto
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

    // Dibujar a Juancho con el motor nativo de sprites (misma escala, anclaje y arte pixel)
    window.spriteManager.drawSprite(ctx, pSprite, pDrawX, pDrawY, true, pAlpha, rotation);

    ctx.restore(); // Fin del plano rotado de la rampa

    // 5. Rata Mutante Colosal persiguiendo dinámicamente (3 Poses Auténticas CPS-3)
    // Ciclo de animación: Rugido -> Furia Rabiosa -> Mordisco Feroz Snap
    const ratCycle = (this.canal.ratChompAnim % 2.4);
    let currentRatKey = 'rata_colosal_open';
    let lungeProgress = 0;

    if (ratCycle < 1.1) {
      // Fase 1: Rugido con fauces bien abiertas
      currentRatKey = 'rata_colosal_open';
      lungeProgress = Math.sin((ratCycle / 1.1) * Math.PI) * 0.35;
    } else if (ratCycle < 1.7) {
      // Fase 2: Rabiosa con vena palpitante de furia y espuma tóxica
      currentRatKey = 'rata_colosal_rabid';
      lungeProgress = 0.35 + ((ratCycle - 1.1) / 0.6) * 0.45;
    } else {
      // Fase 3: Mordisco violento Snap / Chomp cerrando las mandíbulas con estallido de saliva
      currentRatKey = 'rata_colosal_snap';
      const snapT = (ratCycle - 1.7) / 0.7;
      lungeProgress = 0.8 + (1 - snapT) * 0.2;
    }

    const ratImg = window.spriteManager.getImage(currentRatKey) || window.spriteManager.getImage('rata_colosal_maw');
    if (ratImg && ratImg.complete) {
      const lungeDist = lungeProgress * 26;
      const ratCos = Math.cos(slopeAngle);
      const ratSin = Math.sin(slopeAngle);
      const ratBob = Math.sin(this.canal.ratChompAnim * 3.2) * 5;

      const ratDrawX = Math.round(-175 + lungeDist * ratCos);
      const ratDrawY = Math.round(-55 + lungeDist * ratSin + ratBob);
      const ratDrawW = 460;
      const ratDrawH = 425;

      ctx.drawImage(ratImg, ratDrawX, ratDrawY, ratDrawW, ratDrawH);
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

    ctx.restore();
  }

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

  // ==========================================
  // HUD ARCADE: VIDA VERDE SOR4 & COMBOS
  // ==========================================
  drawHUD(ctx) {
    const p = this.player;

    if (this.currentStage === 3) {
      // Marcador HUD Retro Arcade Completo (Fijo, nunca sacudido por vibración de cámara)
      ctx.fillStyle = 'rgba(10, 15, 25, 0.88)';
      ctx.fillRect(this.vWidth / 2 - 170, 8, 340, 26);
      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(this.vWidth / 2 - 170, 8, 340, 26);

      // Barra de vida de Juancho
      const hpRatio = Math.max(0, p.hp / (p.maxHp || 100));
      ctx.fillStyle = '#c0392b';
      ctx.fillRect(this.vWidth / 2 - 160, 14, 90, 14);
      ctx.fillStyle = hpRatio > 0.4 ? '#2ecc71' : '#e74c3c';
      ctx.fillRect(this.vWidth / 2 - 160, 14, 90 * hpRatio, 14);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(this.vWidth / 2 - 160, 14, 90, 14);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText("JUANCHO", this.vWidth / 2 - 115, 24);

      // Telemetría de descenso
      ctx.fillStyle = '#f1c40f';
      ctx.font = '900 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText("DESCENSO: " + Math.floor(this.canal.distance / 10) + "m | VEL: " + Math.round(this.canal.speed) + " KM/H", this.vWidth / 2 - 58, 24);
      return;
    }

    // 1. Barra de Vida de JUANCHO (1P)
    ctx.fillStyle = 'rgba(15, 12, 28, 0.88)';
    ctx.fillRect(12, 10, 175, 34);
    ctx.strokeStyle = '#e67e22';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(12, 10, 175, 34);

    ctx.fillStyle = '#f39c12';
    ctx.font = 'bold 9px monospace';
    const activeHero = this.roster.find(c => c.id === this.selectedCharId) || this.roster[0];
    const heroTitle = `1P ${activeHero.name} (${activeHero.alias || activeHero.epithet || 'LUCHADOR'})`;
    ctx.fillText(heroTitle, 18, 22);

    // Fondo rojo de vida perdida
    ctx.fillStyle = '#7a1d1d';
    ctx.fillRect(18, 26, 150, 10);

    // Vida Verde Recuperable (SOR4 Green Health)
    if (p.recoverableHp > 0) {
      const totalWidth = Math.min(150, (p.hp + p.recoverableHp) * 1.5);
      const isPulse = Math.floor(Date.now() / 150) % 2 === 0;
      ctx.fillStyle = isPulse ? '#1abc9c' : '#16a085';
      ctx.fillRect(18, 26, totalWidth, 10);
    }

    // Vida real sólida verde
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(18, 26, Math.max(0, p.hp * 1.5), 10);

    // Contador de Combo Encadenado (Streets of Rage Style)
    if (p.comboStep > 1 && p.comboTimer > 0) {
      const comboLabels = ["", "", "★ COMBO x2 ★", "★ COMBO x3 (GANCHO) ★", "★★★ FINISHER K.O. ★★★"];
      ctx.fillStyle = '#f1c40f';
      ctx.font = '900 10px monospace';
      ctx.fillText(comboLabels[p.comboStep] || "COMBO", 18, 58);
    }

    // Badge de Boost de Velocidad Sacol
    if (p.speedBoostTimer > 0) {
      ctx.fillStyle = 'rgba(15, 12, 28, 0.92)';
      ctx.fillRect(12, 64, 165, 15);
      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 1;
      ctx.strokeRect(12, 64, 165, 15);
      ctx.fillStyle = '#f1c40f';
      ctx.font = 'bold 8px monospace';
      ctx.fillText(`⚡ SACOL 5X: ${p.speedBoostTimer.toFixed(1)}s`, 18, 75);
    }

    // 2. Barra de Vida: JEFE FINAL o ENEMIGO COMÚN
    if (this.boss.active && !this.boss.defeated) {
      const eBoxW = 210;
      const eBoxX = this.vWidth - eBoxW - 12;
      ctx.fillStyle = 'rgba(20, 14, 34, 0.94)';
      ctx.fillRect(eBoxX, 8, eBoxW, 34);
      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 2;
      ctx.strokeRect(eBoxX, 8, eBoxW, 34);

      let bName = "HERMANO FABIO (PREDICADOR)";
      let bPct = 1.0;
      let bColor = '#f39c12';

      if (this.boss.phase === 1) {
        const f = this.enemies.find(en => en.role === 'phase1_boss');
        if (f) bPct = f.hp / f.maxHp;
      } else if (this.boss.phase === 2) {
        bName = "EL REZO DE LOS 3 TESTIGOS";
        const trio = this.enemies.filter(en => en.id === 'testigo');
        const curHp = trio.reduce((acc, en) => acc + Math.max(0, en.hp), 0);
        bPct = curHp / 270;
        bColor = '#9b59b6';
      } else if (this.boss.phase === 3) {
        bName = "★ SÚPER TESTIGO TITÁNICO ★";
        const t = this.enemies.find(en => en.id === 'titan');
        if (t) bPct = t.hp / t.maxHp;
        bColor = '#e74c3c';
      }

      ctx.fillStyle = '#f1c40f';
      ctx.font = 'bold 8.5px monospace';
      ctx.fillText(bName, eBoxX + 8, 20);

      ctx.fillStyle = '#2c1e3d';
      ctx.fillRect(eBoxX + 8, 24, eBoxW - 16, 10);
      ctx.fillStyle = bColor;
      ctx.fillRect(eBoxX + 8, 24, Math.max(0, bPct * (eBoxW - 16)), 10);

    } else {
      const nearestEnemy = this.enemies.reduce((prev, curr) => {
        const d1 = Math.abs(curr.x - this.player.x);
        const d2 = Math.abs(prev.x - this.player.x);
        return d1 < d2 ? curr : prev;
      }, this.enemies[0]);

      if (nearestEnemy && (nearestEnemy.state !== 'ko' || nearestEnemy.stateTimer > 0)) {
        const eBoxX = this.vWidth - 177;
        ctx.fillStyle = 'rgba(15, 12, 28, 0.88)';
        ctx.fillRect(eBoxX, 10, 165, 30);
        ctx.strokeStyle = nearestEnemy.id === 'rappi' ? '#e67e22' : '#f1c40f';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(eBoxX, 10, 165, 30);

        ctx.fillStyle = nearestEnemy.id === 'rappi' ? '#e67e22' : '#f1c40f';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(nearestEnemy.name, eBoxX + 8, 22);

        ctx.fillStyle = '#c0392b';
        ctx.fillRect(eBoxX + 8, 26, 150, 8);
        ctx.fillStyle = '#e67e22';
        const pct = nearestEnemy.hp / nearestEnemy.maxHp;
        ctx.fillRect(eBoxX + 8, 26, Math.max(0, pct * 150), 8);
      }
    }

    // 3. SEGUIDOR DE MISIÓN ARCADE
    const mBoxW = 200;
    const mBoxX = Math.floor(this.vWidth / 2 - mBoxW / 2);
    ctx.fillStyle = 'rgba(15, 12, 28, 0.92)';
    ctx.fillRect(mBoxX, 8, mBoxW, 34);
    ctx.strokeStyle = this.quest.hasTicket ? '#2ecc71' : '#f1c40f';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(mBoxX, 8, mBoxW, 34);

    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 8.5px monospace';
    const zoneLabel = this.currentStage === 1 ? "MISIÓN: VILLA DEL ABURRÁ" : (this.currentStage === 2 ? "MISIÓN: MIRADOR DE LA LADERA" : "MISIÓN: DESCENSO POR LA CANALIZACIÓN");
    ctx.fillText(zoneLabel, mBoxX + 10, 20);

    ctx.fillStyle = '#ffffff';
    ctx.font = '7.5px monospace';
    let statusText = "• Habla con Doña Gloria [F / Botón ACCIÓN]";
    if (this.currentStage === 2) {
      if (this.boss.defeated) {
        statusText = "★ ¡VICTORIA! ¡Salta al vacío del canal! ⬇";
      } else if (this.boss.phase === 3) {
        statusText = "★ ¡Fase 3: Destruye al Titán!";
      } else if (this.boss.phase === 2) {
        statusText = "★ ¡Fase 2: Rompe el Rezo de los 3!";
      } else if (this.boss.phase === 1) {
        statusText = "★ ¡Fase 1: Derrota al Predicador!";
      } else {
        statusText = "★ Avanza hacia el Mirador";
      }
    } else if (this.quest.hasTicket) {
      statusText = "• ¡Tiquete listo! Ve a la Estación";
    } else if (this.quest.gaminKo && this.quest.rappiKo) {
      statusText = "• ¡Recoge el Tiquete rojo del suelo!";
    } else if (!this.quest.talkedGloria) {
      statusText = "• Habla con Doña Gloria [F / Botón ACCIÓN]";
    } else if (!this.quest.gaminKo) {
      statusText = "• Derrota al Gamín del Éxito [Q/J]";
    } else {
      statusText = "• Derrota al Rappi-Gamín [Q/J]";
    }
    ctx.fillText(statusText, mBoxX + 10, 32);

    if (this.stageTransitionTimer > 0) {
      ctx.fillStyle = `rgba(255, 240, 200, ${this.stageTransitionTimer * 0.8})`;
      ctx.fillRect(0, 0, this.vWidth, this.vHeight);
    }
    if (this.boss.flashTimer > 0) {
      const fAlpha = Math.min(0.35, this.boss.flashTimer * 0.45);
      ctx.fillStyle = `rgba(255, 235, 140, ${fAlpha})`;
      ctx.fillRect(0, 0, this.vWidth, this.vHeight);
    }
  }

  loop(currentTime) {
    try {
      const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
      this.lastTime = currentTime;

      this.update(dt);
      this.render();
    } catch (loopErr) {
      console.error('Error in game loop:', loopErr);
    } finally {
      requestAnimationFrame(this.loop.bind(this));
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.medellinGame = new MedellinGame();
});
