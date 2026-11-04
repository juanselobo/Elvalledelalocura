// ============================================================
// NIVEL 4: EL SOTERRADO INUNDADO (CÓMIC & FICO)
// ============================================================
var Level4 = window.Level4 = {
  setupLevel4() {
    this.initStage4Soterrado();
  },

    initStage4Soterrado() {
    this.stage4 = {
      comicStep: 1, // Inicia directamente en el diálogo interactivo
      totalSteps: 3,
      timer: 0,
      currentNodeId: 'N0',
      selectedChoiceIndex: 0,
      gameOver: null,
      _choiceButtons: [],
      _restartBtn: null
    };
    if (this.canal) this.canal.active = false;
    if (window.retroAudio) {
      if (window.retroAudio.stopCutsceneBgm) window.retroAudio.stopCutsceneBgm();
      if (window.retroAudio.playTransitChime) window.retroAudio.playTransitChime();
    }
  },

  getStage4DialogueData() {
    const NODES = {
      N0: {
        imageKey: 'scene_soterrado_01_encuentro',
        speaker: "AGENTE HINCAPIÉ (TRÁNSITO MEDELLÍN)",
        text: "¡Buenas noches, joven! ¿Para dónde va con ese afán y esa tabla bajo el brazo? ¿No está viendo el chicharrón tan berraco que tenemos aquí montado? Esto está colapsado hasta San Juan. ¿En qué le puedo colaborar o qué hace por acá?",
        choices: [
          { text: "1. Vengo huyendo de una rata mutante gigante que casi me come en la rampa.", next: "N1" },
          { text: "2. Buenas oficial... ¿Por acá cerquita dónde consigo una fotocopiadora abierta?", next: "N3" },
          { text: "3. ¿El soterrado inundado? ¡Qué novedad! ¡Cae un sereno y esto se vuelve piscina!", next: "N5" }
        ]
      },
      N1: {
        imageKey: 'scene_soterrado_02_rata_incredulidad',
        speaker: "AGENTE HINCAPIÉ",
        text: "¿Una rata gigante del tamaño de un bus Coometropol? Joven, ¿usted me está tomando el pelo o es que le dio por oler sacol con los del viaducto? Respete el uniforme, que llevo doce horas de turno sin almorzar.",
        choices: [
          { text: "1. Claro que le estoy tomando el pelo, mi cabo. ¡Hay que ser muy pelotudo!", next: "END_DESACATO" },
          { text: "2. ¡Oficial, hablo en serio! La bestia quedó noqueada contra el muro afuera.", next: "N2" },
          { text: "3. Mire mi morral: tiene baba ácida verde y pelos como cables de EPM.", next: "N2" }
        ]
      },
      N2: {
        imageKey: 'scene_soterrado_08_minorista_duda',
        speaker: "AGENTE HINCAPIÉ",
        text: "Ave María... ¿Usted sabe que por radio dijeron que en La Minorista se desapareció un bulto de concentrado?... Bueno, supongamos que le creo. Pero igual aquí no puede pasar: el agua tapó los taxis y los choferes están que linchan.",
        choices: [
          { text: "1. ¿Y qué hacemos entonces con la gente atrapada, mi cabo?", next: "N6" }
        ]
      },
      N3: {
        imageKey: 'scene_soterrado_03_fotocopiadora_facepalm',
        speaker: "AGENTE HINCAPIÉ",
        text: "¿Una... fotocopiadora? Mijo, estamos en medio de un diluvio bíblico con media ciudad bajo el lodo y ¿usted buscando dónde sacar la cédula ampliada al 150%? ¿Es que no tiene ojos en la cara?",
        choices: [
          { text: "1. Es que me dijeron que en La Bayadera solucionan cualquier papel.", next: "END_BAYADERA" },
          { text: "2. Pues por la 33 todo abre hasta tarde... allá le sacan copia a lo que sea.", next: "N4" },
          { text: "3. No, mentiras oficial, el susto me tiene hablando bobadas. ¡Mire ese trancón!", next: "N6" }
        ]
      },
      N4: {
        imageKey: 'scene_soterrado_09_la33_taxistas',
        speaker: "AGENTE HINCAPIÉ",
        text: "¡Eche! No me mente la 33 que ayer me tocó hacer ronda por allá y eso estaba más concurrido que la misa del Padre Marianito. Pero bueno, no me cambie el tema, que aquí abajo los taxistas están desesperados en los techos.",
        choices: [
          { text: "1. ¿Y cómo piensa solucionar este enredo, mi cabo?", next: "N6" }
        ]
      },
      N5: {
        imageKey: 'scene_soterrado_04_inundacion_sarcasmo',
        speaker: "AGENTE HINCAPIÉ",
        text: "Ah, claro, el ingeniero de esquina vino a dar cátedra. Siempre que cae un aguacero en Guarne o en Caldas, el agua baja con rabia y termina metida aquí. La obra del siglo, decían... ¡y ahora parece piscina olímpica!",
        choices: [
          { text: "1. Lo peor es que esa agua del Río Medellín huele a puro desagüe podrido.", next: "N6" },
          { text: "2. Hermoso Parques del Río arriba pa' fotos, pero aquí abajo tenemos Venecia.", next: "N6" },
          { text: "3. ¿Y las motobombas de tres mil millones? ¿Las empeñaron en El Hueco?", next: "N6" }
        ]
      },
      N6: {
        imageKey: 'scene_soterrado_05_soborno_negociacion',
        speaker: "AGENTE HINCAPIÉ (TRÁNSITO MEDELLÍN)",
        text: "Vea, joven... La situación está muy peluda. Tengo reporte de grúas varadas y el alcalde pidiendo orden por redes. Si usted quiere que yo 'mire pa\' otro lado' y lo deje pasar a hacer maromas por los techos... hablemos de una colaboración pa\' la gaseosa.",
        choices: [
          { text: "1. Hablemos en números, mi cabo: todo en esta vida se arregla por las buenas.", next: "N_SOBORNO_1" },
          { text: "2. Oficial, no sea atembado: si yo saco a la gente, usted se lleva la medalla.", next: "N7_RADIO" },
          { text: "3. ¿Soborno descarado? ¡Lo prendo con la cámara del celular y lo hago viral!", next: "N_GRABAR" },
          { text: "4. ¡A mí no me viene a sacar plata! ¡Cuadremos esto a los puños ya mismo!", next: "END_TANQUETA" }
        ]
      },
      N_SOBORNO_1: {
        imageKey: 'scene_soterrado_10_requisa_bolsillos',
        speaker: "AGENTE HINCAPIÉ",
        text: "¡¿Ah sí?! ¿Conque colaborador el muchacho? Me gusta la gente pragmática que entiende cómo funciona este platanal. A ver, sáquese pues lo que tiene en los bolsillos para ver qué tan 'colaborador' es...",
        choices: [
          { text: "1. Tengo $2.000 pesos arrugados y media empanada con ají del desayuno.", next: "END_SOBORNO" },
          { text: "2. Mire mi cabo: tengo este billete de $50.000 nuevecito pa\' que corone.", next: "N_SOBORNO_ALTO" },
          { text: "3. ¿Le sirve si le hago una transferencia rápida por Nequi o Daviplata?", next: "N_SOBORNO_NEQUI" }
        ]
      },
      N_SOBORNO_NEQUI: {
        imageKey: 'scene_soterrado_11_panico_nequi',
        speaker: "AGENTE HINCAPIÉ",
        text: "¡¿A Nequi?! ¡¿Usted es guevón o es que le gusta tentar al demonio?! ¡¿Dejar un rastro digital con mi cédula y el logo de la Alcaldía en una cuenta bancaria?! ¡No mijo, usted lo que me quiere es tender una trampa de la Procuraduría! ¡Impresora térmica, actívese!",
        choices: [
          { text: "1. ¡No, oficial, espere, era una propuesta moderna!", next: "END_COMPARENDOS" }
        ]
      },
      N_SOBORNO_ALTO: {
        imageKey: 'scene_soterrado_12_billete_cincuenta',
        speaker: "AGENTE HINCAPIÉ",
        text: "(Mira a ambos lados de la autopista con disimulo y engulle el billete de cincuenta en el bolsillo con agilidad de mago). Ese Gabriel García Márquez en el billete me convenció... Vea socio: yo no lo vi, usted no me vio, y si se ahoga en ese charco yo digo que era un deportista independiente. ¿Listo para el salto?",
        choices: [
          { text: "1. Listo mi cabo, me deslizo por los techos antes de que alguien mire.", next: "SUCCESS_PARKOUR" },
          { text: "2. Venga oficial, explíqueme rápido cómo están los carriles allá adentro.", next: "N8B_TACTICA" }
        ]
      },
      N_GRABAR: {
        imageKey: 'scene_soterrado_13_influencer_grabar',
        speaker: "AGENTE HINCAPIÉ",
        text: "¿Me va a grabar? Saque el celular pues, 'influencer de semáforo'. Que mientras usted abre la cámara de TikTok, yo le voy dictando al sistema cinco infracciones en flagrancia por obstaculizar vía pluvial en contingencia.",
        choices: [
          { text: "1. ¡No me asuste con multas que yo conozco mis derechos constitucionales!", next: "END_COMPARENDOS" },
          { text: "2. Bueno mi cabo, bajémosle a la calentura... ¿Necesita una mano con los atrapados?", next: "N7_RADIO" },
          { text: "3. ¡A mí no me hable golpeado que le boto ese celular en la cara!", next: "END_TANQUETA" }
        ]
      },
      N7_RADIO: {
        imageKey: 'scene_soterrado_06_radio_panico',
        speaker: "AGENTE HINCAPIÉ",
        text: "(Suena el radio policial con chicharra y estática: '¡Atención móvil 14! ¡Doña Gloria se subió al techo del bus Circular Sur con un megáfono y el Alcalde Fico viene en cuatrimoto a transmitir en vivo!'). ¡Ave María Purísima! Se me armó el mierdero del siglo. Doña Gloria amotinó el Coometropol y Fico va a grabar TikToks. Joven, ¿usted dijo que podía cruzar los techos? ¿Cuál es su plan?",
        choices: [
          { text: "1. Conozco a Doña Gloria: si le recupero el producido de empanadas, calmo el motín.", next: "N8A_GLORIA" },
          { text: "2. Mire mi agilidad: cruzo en parkour por los 3 carriles esquivando ductos de aire.", next: "N8B_TACTICA" },
          { text: "3. Relájese mi cabo... ¿o es que le tiemblan las piernas de meterse a esa agua sucia?", next: "N_TOREAR" }
        ]
      },
      N_TOREAR: {
        imageKey: 'scene_soterrado_14_furia_policial',
        speaker: "AGENTE HINCAPIÉ",
        text: "¿Miedo yo? ¿Atembado yo? ¿Usted le está faltando al respeto a la autoridad de tránsito de la capital antioqueña? Vea mijo, usted quería ver agua... ¡Pues ahora va a probar agua pero con presión de tanqueta!",
        choices: [
          { text: "1. ¡Uy mi cabo, era un chistecito paisa!", next: "END_TANQUETA" }
        ]
      },
      N8A_GLORIA: {
        imageKey: 'scene_soterrado_07_alianza_parkour',
        speaker: "AGENTE HINCAPIÉ",
        text: "¡Si usted calma a esa fiera de Doña Gloria me salva el puesto, el sueldo y la prima de diciembre! Péguele al brinco pues, mijo. Yo reporto al PMU que usted es nuestro agente cívico encubierto.",
        choices: [
          { text: "1. ¡Trato hecho! Préndame las balizas de la patrulla para alumbrarme el camino.", next: "SUCCESS_PARKOUR" }
        ]
      },
      N8B_TACTICA: {
        imageKey: 'scene_soterrado_15_briefing_tactico',
        speaker: "AGENTE HINCAPIÉ",
        text: "Bueno, escúcheme bien: el carril izquierdo es de taxis que rebotan con el oleaje, el del centro tiene buses Coometropol altos donde toca saltar duro, y por la derecha el agua corre con corriente rápida. Y agáchese bajo los ductos de ventilación si no quiere quedar sin cabeza.",
        choices: [
          { text: "1. ¡Entendido oficial! Salto entre techos y slide bajo las vigas. ¡Voy pa\' esa!", next: "SUCCESS_PARKOUR" }
        ]
      }
    };

        const ENDINGS = {
      END_TANQUETA: {
        id: 'tanqueta',
        imageKey: 'ending_tanqueta_esmad',
        title: '★ GAME OVER PARCE ★',
        subtitle: '¡LA TANQUETA DEL ESMAD & DESACATO TOTAL!',
        desc: 'Te paraste a los puños contra el guardia, pero el agente oprimió el botón rojo de su radio riéndose a carcajadas. Una tanqueta blindada del ESMAD apareció disparando un chorro de 500 PSI que te mandó peinado en reversa hasta el cerro Nutibara.'
      },
      END_DESACATO: {
        id: 'desacato',
        imageKey: 'ending_desacato_autoridad',
        title: '★ GAME OVER PARCE ★',
        subtitle: '¡DESACATO A LA AUTORIDAD!',
        desc: 'Le dijiste pelotudo al oficial. Te clavaron comparendo por Código de Policía, trabajo comunitario barriendo La Alpujarra y te decomisaron la patineta por tres meses.'
      },
      END_BAYADERA: {
        id: 'bayadera',
        imageKey: 'ending_desvalijado_bayadera',
        title: '★ GAME OVER PARCE ★',
        subtitle: '¡DESVALIJADO EN LA BAYADERA!',
        desc: 'Te fuiste a buscar fotocopias a La Bayadera. En 45 segundos te desvalijaron: se llevaron la ropa, los tenis, la billetera y te dejaron en calzoncillos rascándote la cabeza en plena calle.'
      },
      END_SOBORNO: {
        id: 'soborno',
        imageKey: 'ending_soborno_empanada',
        title: '★ GAME OVER PARCE ★',
        subtitle: '¡COHECHO DE POBRE CALAÑA!',
        desc: 'Le ofreciste dos mil barras y media empanada masticada. El agente se ofendió por semejante miseria: "¡A mí no me venga con limosnas!" y te puso los ganchos.'
      },
      END_COMPARENDOS: {
        id: 'comparendos',
        imageKey: 'ending_embargado_simit',
        title: '★ GAME OVER PARCE ★',
        subtitle: '¡EMBARGADO POR EL SIMIT!',
        desc: 'Amenazaste con denunciarlo. El agente sacó la impresora térmica y te sacó una tira de 4 metros de multas. Ahora tu deuda asciende a 18 salarios mínimos.'
      },
      SUCCESS_PARKOUR: {
        id: 'success',
        imageKey: 'scene_soterrado_07_alianza_parkour',
        title: '★ ¡PACTO ACORDADO: RUMBO AL RESCATE! ★',
        subtitle: '¡EL HÉROE ENTRA EN ACCIÓN!',
        desc: 'El Agente Hincapié sonríe y te choca la mano: "¡Negocio socio! ¡Eso es lo que yo llamo liderazgo comunitario! ¡Péguele al brinco pues, mijo, que si rescata las empanadas le perdono dos fotomultas!"',
        isWin: true
      }
    };

    return { NODES, ENDINGS };
  },

  advanceStage4Comic(dir = 1) {
    if (!this.stage4) this.initStage4Soterrado();
    const now = performance.now ? performance.now() : Date.now();
    if (this.stage4._lastActionTime && (now - this.stage4._lastActionTime < 140)) return;
    this.stage4._lastActionTime = now;

    const cur = this.stage4.comicStep || 1;
    // Solo permitir avanzar hacia adelante: nunca retroceder
    const stepDir = Math.max(1, dir || 1);
    const next = Math.max(cur, Math.min(3, cur + stepDir));
    this.stage4.comicStep = next;
    if (window.retroAudio) {
      if (next === 2 && window.retroAudio.playCarHorn) window.retroAudio.playCarHorn();
      else if (next === 3 && window.retroAudio.playWaterSplash) window.retroAudio.playWaterSplash();
    }
  },

  navigateStage4Choice(dir = 1) {
    if (!this.stage4) this.initStage4Soterrado();
    if (this.stage4.comicStep !== 3) return;
    if (this.stage4.gameOver) return;

    const now = performance.now ? performance.now() : Date.now();
    if (this.stage4._lastNavTime && (now - this.stage4._lastNavTime < 55)) return;
    this.stage4._lastNavTime = now;

    const { NODES } = this.getStage4DialogueData();
    const cur = NODES[this.stage4.currentNodeId || 'N0'] || NODES['N0'];
    const choices = cur.choices || [];
    const num = choices.length || 1;
    const prev = (typeof this.stage4.selectedChoiceIndex === 'number') ? this.stage4.selectedChoiceIndex : 0;
    this.stage4.selectedChoiceIndex = (prev + dir + num) % num;
    if (window.retroAudio && window.retroAudio.playDash) {
      try { window.retroAudio.playDash(); } catch (e) {}
    }
  },

  confirmStage4Choice() {
    if (!this.stage4) this.initStage4Soterrado();
    if (this.stage4.comicStep !== 3) return;
    const now = performance.now ? performance.now() : Date.now();
    if (this.stage4._lastActionTime && (now - this.stage4._lastActionTime < 140)) return;
    this.stage4._lastActionTime = now;

    if (this.stage4.gameOver) {
      this.restartStage4Dialogue();
      return;
    }
    const idx = (typeof this.stage4.selectedChoiceIndex === 'number') ? this.stage4.selectedChoiceIndex : 0;
    this.selectStage4Choice(idx);
  },

  selectStage4Choice(choiceIndex) {
    if (!this.stage4) this.initStage4Soterrado();
    const { NODES, ENDINGS } = this.getStage4DialogueData();
    const cur = NODES[this.stage4.currentNodeId || 'N0'];
    if (!cur || !cur.choices) return;

    const safeIdx = Math.max(0, Math.min(cur.choices.length - 1, choiceIndex || 0));
    const chosen = cur.choices[safeIdx];
    if (!chosen) return;

    if (window.retroAudio && window.retroAudio.playCollect) {
      try { window.retroAudio.playCollect(); } catch (e) {}
    }

    if (chosen.next.startsWith('END_')) {
      this.stage4.gameOver = ENDINGS[chosen.next];
      if (window.retroAudio && window.retroAudio.playHit) {
        try { window.retroAudio.playHit(); } catch (e) {}
      }
    } else if (chosen.next === 'SUCCESS_PARKOUR') {
      this.stage4.gameOver = ENDINGS.SUCCESS_PARKOUR;
      if (window.retroAudio && window.retroAudio.playFanfare) {
        try { window.retroAudio.playFanfare(); } catch (e) {}
      }
    } else {
      this.stage4.currentNodeId = chosen.next;
      this.stage4.selectedChoiceIndex = 0;
    }
  },

  restartStage4Dialogue() {
    if (!this.stage4) this.initStage4Soterrado();
    this.stage4.currentNodeId = 'N0';
    this.stage4.selectedChoiceIndex = 0;
    this.stage4.gameOver = null;
    if (window.retroAudio && window.retroAudio.playTransitChime) {
      try { window.retroAudio.playTransitChime(); } catch (e) {}
    }
  },

  handleMouseMoveStage4(mouseX, mouseY) {
    if (!this.stage4 || this.stage4.comicStep !== 3) return;
    if (this.stage4.gameOver) {
      if (this.stage4._restartBtn) {
        const b = this.stage4._restartBtn;
        if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) {
          if (this.canvas) this.canvas.style.cursor = 'pointer';
          return;
        }
      }
      if (this.canvas) this.canvas.style.cursor = 'default';
      return;
    }
    if (this.stage4._choiceButtons) {
      for (const b of this.stage4._choiceButtons) {
        if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) {
          if (this.canvas) this.canvas.style.cursor = 'pointer';
          return;
        }
      }
    }
    if (this.canvas) this.canvas.style.cursor = 'default';
  },

  handleClickStage4(clickX, clickY) {
    if (!this.stage4) this.initStage4Soterrado();
    const step = this.stage4.comicStep || 1;

    // Pasos 1 y 2: Cinemática contextual previa (Aérea e Inundado)
    if (step === 1 || step === 2) {
      this.advanceStage4Comic(1);
      return;
    }

    // Paso 3: Diálogo interactivo
    if (step === 3) {
      if (this.stage4.gameOver) {
        if (this.stage4._restartBtn) {
          const btn = this.stage4._restartBtn;
          if (clickX >= btn.x && clickX <= btn.x + btn.w && clickY >= btn.y && clickY <= btn.y + btn.h) {
            this.restartStage4Dialogue();
            return;
          }
        }
        return;
      }

      // Clic en botones de opciones de diálogo
      if (this.stage4._choiceButtons && this.stage4._choiceButtons.length > 0) {
        for (let i = 0; i < this.stage4._choiceButtons.length; i++) {
          const b = this.stage4._choiceButtons[i];
          if (clickX >= b.x && clickX <= b.x + b.w && clickY >= b.y && clickY <= b.y + b.h) {
            this.stage4.selectedChoiceIndex = i;
            this.selectStage4Choice(i);
            return;
          }
        }
      }
    }
  },

  drawStage4AmbientAnimations(ctx, time) {
    ctx.save();

    // -------------------------------------------------------------
    // 1. REFLEJOS DE BALIZAS POLICIALES (Atmósfera de Emergencia)
    // -------------------------------------------------------------
    const policePhase = Math.sin(time / 200);
    const isBlue = Math.sin(time / 450) > 0;
    if (policePhase > 0.2) {
      const grad = ctx.createRadialGradient(520, 160, 20, 520, 160, 240);
      const col = isBlue ? 'rgba(41, 128, 185, 0.12)' : 'rgba(231, 76, 60, 0.12)';
      grad.addColorStop(0, col);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(200, 40, 360, 180);
    }

    // -------------------------------------------------------------
    // 2. TAXISTA EN EL TECHO PIDIENDO AUXILIO (Agitando linterna/celular)
    // -------------------------------------------------------------
    const waveX = Math.sin(time / 220) * 3.5;
    const waveY = Math.cos(time / 220) * 2;
    const flarePulse = Math.sin(time / 140) * 0.35 + 1.1;
    const fx = 205 + waveX;
    const fy = 112 + waveY;

    // Brazo en movimiento con linterna
    ctx.strokeStyle = '#2d2a26';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(198, 126);
    ctx.lineTo(fx - 2, fy + 4);
    ctx.lineTo(fx, fy);
    ctx.stroke();

    // Destello de la linterna / pantalla del celular
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(fx, fy, 2, 0, Math.PI * 2);
    ctx.fill();

    // Halo y destellos cruzados
    ctx.strokeStyle = 'rgba(255, 245, 180, 0.85)';
    ctx.lineWidth = 1;
    const flSize = 6 * flarePulse;
    ctx.beginPath();
    ctx.moveTo(fx - flSize, fy); ctx.lineTo(fx + flSize, fy);
    ctx.moveTo(fx, fy - flSize); ctx.lineTo(fx, fy + flSize);
    ctx.stroke();

    const flareGrad = ctx.createRadialGradient(fx, fy, 1, fx, fy, 12 * flarePulse);
    flareGrad.addColorStop(0, 'rgba(255, 250, 200, 0.7)');
    flareGrad.addColorStop(0.5, 'rgba(255, 215, 80, 0.25)');
    flareGrad.addColorStop(1, 'rgba(255, 200, 50, 0)');
    ctx.fillStyle = flareGrad;
    ctx.beginPath();
    ctx.arc(fx, fy, 12 * flarePulse, 0, Math.PI * 2);
    ctx.fill();

    // -------------------------------------------------------------
    // 3. MULTITUD EN EL TECHO DEL BUS COOMETROPOL (Agitación & Pañuelo)
    // -------------------------------------------------------------
    // Persona de blanco agitando trapo/pañuelo de auxilio
    const ragX = 345 + Math.sin(time / 190) * 3;
    const ragY = 104 + Math.cos(time / 190) * 2;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(ragX, ragY, 5, 4);
    ctx.fillStyle = 'rgba(240, 240, 240, 0.8)';
    ctx.fillRect(ragX - 1, ragY + 2, 4, 3);

    // Persona de rojo agitando el puño arriba y abajo
    const fistY = 76 + Math.abs(Math.sin(time / 170)) * 3;
    ctx.fillStyle = '#b92d28';
    ctx.fillRect(373, fistY + 4, 3, 5); // manga roja
    ctx.fillStyle = '#d78250';
    ctx.fillRect(372, fistY, 4, 4);     // puño levantado

    // -------------------------------------------------------------
    // 4. LUCES ESTACIONARIAS DEL TAXI SUMERGIDO (Destellos ámbar y rojo)
    // -------------------------------------------------------------
    const amberBlink = (Math.floor(time / 320) % 2 === 0);
    if (amberBlink) {
      // Luz ámbar techo del taxi
      const hGrad = ctx.createRadialGradient(72, 174, 1, 72, 174, 8);
      hGrad.addColorStop(0, 'rgba(255, 210, 40, 0.9)');
      hGrad.addColorStop(1, 'rgba(255, 170, 10, 0)');
      ctx.fillStyle = hGrad;
      ctx.beginPath();
      ctx.arc(72, 174, 8, 0, Math.PI * 2);
      ctx.fill();

      // Reflejo ámbar en el agua sucia
      ctx.fillStyle = 'rgba(241, 196, 15, 0.35)';
      ctx.fillRect(66, 185, 14, 2);
      ctx.fillRect(68, 189, 10, 1.5);

      // Luz roja trasera en auto del medio
      ctx.fillStyle = 'rgba(231, 76, 60, 0.75)';
      ctx.fillRect(362, 185, 5, 3);
      ctx.fillStyle = 'rgba(231, 76, 60, 0.3)';
      ctx.fillRect(358, 190, 12, 2);
    }

    // -------------------------------------------------------------
    // 5. ONDULACIONES Y CORRIENTE DEL AGUA SUCIA (Ripples en el río)
    // -------------------------------------------------------------
    ctx.lineWidth = 1;
    for (let r = 0; r < 4; r++) {
      const baseY = 192 + r * 10;
      const speed = (r + 1) * 0.04;
      const phase = (time * speed) % 60;
      const alpha = 0.25 + Math.sin(time / 280 + r) * 0.15;

      ctx.strokeStyle = `rgba(235, 210, 140, ${alpha})`;
      ctx.beginPath();
      for (let rx = 180; rx < 440; rx += 14) {
        const ry = baseY + Math.sin((rx + phase * 6) * 0.08) * 1.8;
        if (rx === 180) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx, ry);
      }
      ctx.stroke();
    }

    // -------------------------------------------------------------
    // 6. TURBINAS AXIALES DE TECHO GIRATORIAS (Jet Fans)
    // -------------------------------------------------------------
    const fanAngle = (time * 0.012) % (Math.PI * 2);
    const fans = [{ x: 268, y: 38 }, { x: 342, y: 38 }];
    fans.forEach(fan => {
      ctx.strokeStyle = 'rgba(200, 210, 220, 0.4)';
      ctx.lineWidth = 1.5;
      for (let b = 0; b < 4; b++) {
        const ang = fanAngle + b * (Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(fan.x, fan.y);
        ctx.lineTo(fan.x + Math.cos(ang) * 9, fan.y + Math.sin(ang) * 9);
        ctx.stroke();
      }
    });

    ctx.restore();
  },

drawStage4Soterrado(ctx) {
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

      ctx.fillStyle = 'rgba(10, 8, 22, 0.70)';
      ctx.fillRect(bx, by, btnW, btnH);
      ctx.strokeStyle = `rgba(241, 196, 15, ${pulse})`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx, by, btnW, btnH);

      ctx.fillStyle = '#f1c40f';
      ctx.font = '900 10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText("▶  [ GOLPE (B) / ACCIÓN (F) ] CONTINUAR ▶", this.vWidth / 2, by + btnH / 2 + 1);
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

      ctx.fillStyle = 'rgba(10, 8, 22, 0.70)';
      ctx.fillRect(bx, by, btnW, btnH);
      ctx.strokeStyle = `rgba(46, 204, 113, ${pulse})`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx, by, btnW, btnH);

      ctx.fillStyle = '#2ecc71';
      ctx.font = '900 10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText("▶  [ GOLPE (B) / ACCIÓN (F) ] ENTRAR AL DIÁLOGO ▶", this.vWidth / 2, by + btnH / 2 + 1);
    }
    // =========================================================================
    // IMAGEN 3 (DINÁMICA): EL ÁRBOL DE DECISIONES DE LA CONVERSACIÓN
    // =========================================================================
    else if (step === 3) {
      const { NODES, ENDINGS } = this.getStage4DialogueData();
      const isGameOver = !!this.stage4.gameOver;

      // 1. Imagen de fondo dinámica sincronizada con el momento emocional actual
      const curNode = NODES[this.stage4.currentNodeId || 'N0'] || NODES['N0'];
      const activeMomentKey = curNode.imageKey || 'scene_soterrado_01_encuentro';
      let bgKey = isGameOver ? (this.stage4.gameOver.imageKey || 'scene_soterrado_dialogue') : activeMomentKey;
      let bgImg = window.spriteManager.getImage(bgKey) || window.spriteManager.getImage(activeMomentKey) || window.spriteManager.getImage('scene_soterrado_dialogue') || window.spriteManager.getImage('comic_soterrado_3_inundado');
      
      if (bgImg && bgImg.complete && bgImg.naturalWidth !== 0) {
        ctx.drawImage(bgImg, 0, 0, this.vWidth, this.vHeight);
      } else {
        const fallback = window.spriteManager.getImage('scene_soterrado_dialogue') || window.spriteManager.getImage('comic_soterrado_3_inundado');
        if (fallback && fallback.complete && fallback.naturalWidth !== 0) {
          ctx.drawImage(fallback, 0, 0, this.vWidth, this.vHeight);
        } else {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, this.vWidth, this.vHeight);
        }
      }

      // Animaciones de fondo vivas y sutiles (balizas, auxilio)
      if (!isGameOver) {
        this.drawStage4AmbientAnimations(ctx, time);
      }

      // Si es Game Over o Éxito
      if (isGameOver) {
        const go = this.stage4.gameOver;
        const pY = 194;
        const pH = 158;

        // Fondo verdaderamente translúcido para apreciar la escena
        const gradGo = ctx.createLinearGradient(0, pY, 0, pY + pH);
        gradGo.addColorStop(0, 'rgba(6, 10, 24, 0.35)');
        gradGo.addColorStop(1, 'rgba(10, 14, 32, 0.48)');
        ctx.fillStyle = gradGo;
        ctx.fillRect(14, pY, this.vWidth - 28, pH);

        ctx.strokeStyle = go.isWin ? '#2ecc71' : '#f1c40f';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(14, pY, this.vWidth - 28, pH);

        // Esquinas reforzadas
        ctx.fillStyle = go.isWin ? '#2ecc71' : '#f1c40f';
        ctx.fillRect(14, pY, 4, 4);
        ctx.fillRect(14 + this.vWidth - 28 - 4, pY, 4, 4);
        ctx.fillRect(14, pY + pH - 4, 4, 4);
        ctx.fillRect(14 + this.vWidth - 28 - 4, pY + pH - 4, 4, 4);

        // Subtítulo con sombra
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 4;
        ctx.fillStyle = go.isWin ? '#2ecc71' : '#f39c12';
        ctx.font = '900 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(go.subtitle, this.vWidth / 2, pY + 20);

        // Descripción cómica
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'left';
        this.wrapText(ctx, go.desc, 28, pY + 38, this.vWidth - 56, 15);
        ctx.restore();

        // Botón de acción (Reintentar o Continuar)
        const btnW = 340;
        const btnH = 26;
        const btnX = (this.vWidth - btnW) / 2;
        const btnY = pY + pH - 34;
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
        const label = go.isWin ? "▶  [ GOLPE (B) / ACCIÓN (F) ] INICIAR PARKOUR DE TECHOS 🌊" : "🔄  [ GOLPE (B) / ACCIÓN (F) ] PROBAR OTRA DECISIÓN 🔁";
        ctx.fillText(label, btnX + btnW / 2, btnY + btnH / 2);

        this.stage4._restartBtn = { x: btnX, y: btnY, w: btnW, h: btnH };
        this.stage4._choiceButtons = [];
      } else {
        // MODO NODO DE DIÁLOGO ACTIVO
        const node = NODES[this.stage4.currentNodeId || 'N0'] || NODES['N0'];
        
        // Caja de Diálogo Ultratranslúcida (Permite ver el fondo, personajes y carros)
        const boxX = 12;
        const boxY = 192;
        const boxW = this.vWidth - 24;
        const boxH = 160;

        // Fondo degradado sutil con solo 30%-40% de opacidad para total visibilidad del arte
        const bgGrad = ctx.createLinearGradient(0, boxY, 0, boxY + boxH);
        bgGrad.addColorStop(0, 'rgba(6, 10, 24, 0.30)');
        bgGrad.addColorStop(1, 'rgba(8, 12, 28, 0.42)');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(boxX, boxY, boxW, boxH);

        // Borde dorado arcade brillante
        ctx.strokeStyle = 'rgba(241, 196, 15, 0.85)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(boxX, boxY, boxW, boxH);

        // Esquinas doradas
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(boxX, boxY, 4, 4);
        ctx.fillRect(boxX + boxW - 4, boxY, 4, 4);
        ctx.fillRect(boxX, boxY + boxH - 4, 4, 4);
        ctx.fillRect(boxX + boxW - 4, boxY + boxH - 4, 4, 4);

        // 1. Etiqueta del interlocutor (Izquierda)
        ctx.fillStyle = 'rgba(241, 196, 15, 0.25)';
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
        ctx.fillText("🎮 [▲/▼] Subir/Bajar | [GOLPE / ACCIÓN] Elegir", boxX + boxW - 16, boxY + 14);

        // 2. Texto del Diálogo con sombra negra de alto contraste (para perfecta lectura sobre fondo translúcido)
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10.5px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        const lineH = 13.5;
        const textLines = this.wrapText(ctx, node.text, boxX + 12, boxY + 25, boxW - 24, lineH);
        ctx.restore();
        
        // 3. Botones de Selección Múltiple Translúcidos
        this.stage4._choiceButtons = [];
        const choices = node.choices || [];
        const numChoices = choices.length;
        const choicesStartY = boxY + 25 + textLines * lineH + 5;
        const availableH = (boxY + boxH - 5) - choicesStartY;
        const btnGap = 3.5;
        const btnH = Math.min(22, Math.max(17, Math.floor((availableH - (numChoices - 1) * btnGap) / numChoices)));

        choices.forEach((ch, idx) => {
          const cy = choicesStartY + idx * (btnH + btnGap);
          const isSelected = (idx === (this.stage4.selectedChoiceIndex || 0));

          // Fondo del botón
          if (isSelected) {
            ctx.save();
            ctx.shadowColor = '#f1c40f';
            ctx.shadowBlur = 8;
            ctx.fillStyle = 'rgba(241, 196, 15, 0.45)';
            ctx.fillRect(boxX + 10, cy, boxW - 20, btnH);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(boxX + 10, cy, boxW - 20, btnH);
            ctx.restore();

            // Flecha arcade dorada brillante
            const arrowBounce = Math.sin(time / 100) * 3;
            ctx.fillStyle = '#f1c40f';
            ctx.font = '900 12px monospace';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText("▶", boxX + 14 + arrowBounce, cy + btnH / 2);
          } else {
            ctx.fillStyle = 'rgba(6, 10, 24, 0.38)';
            ctx.fillRect(boxX + 10, cy, boxW - 20, btnH);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
            ctx.lineWidth = 1;
            ctx.strokeRect(boxX + 10, cy, boxW - 20, btnH);
          }

          // Badge de número [1], [2], [3], [4]
          const badgeX = isSelected ? boxX + 28 : boxX + 16;
          ctx.fillStyle = isSelected ? '#f1c40f' : 'rgba(255, 255, 255, 0.18)';
          ctx.fillRect(badgeX, cy + 2, 18, btnH - 4);
          ctx.fillStyle = isSelected ? '#000000' : '#f1c40f';
          ctx.font = '900 9.5px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`[${idx + 1}]`, badgeX + 9, cy + btnH / 2);

          // Texto de la opción con sombra protectora
          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
          ctx.shadowBlur = 3;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;

          ctx.fillStyle = isSelected ? '#ffffff' : '#e6e6e6';
          ctx.font = isSelected ? '900 10px monospace' : 'bold 9.5px monospace';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(ch.text, badgeX + 24, cy + btnH / 2);
          ctx.restore();

          this.stage4._choiceButtons.push({
            x: boxX + 10,
            y: cy,
            w: boxW - 20,
            h: btnH,
            index: idx
          });
        });
      }
    }

    ctx.restore();
  },

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    if (!text) return 0;
    const words = text.split(' ');
    let line = '';
    let lineCount = 0;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y + lineCount * lineHeight);
        line = words[n] + ' ';
        lineCount++;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y + lineCount * lineHeight);
    return lineCount + 1;
  },

  drawFloodedSoterradoCutscene(ctx) {
    this.switchStage(4);
  }

};
if (typeof MedellinGame !== 'undefined' && MedellinGame.prototype) {
  Object.assign(MedellinGame.prototype, Level4);
}
