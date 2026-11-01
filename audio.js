// audio.js - Retro 8-bit/16-bit Web Audio Synthesizer
// Genera efectos de sonido y música chiptune en tiempo real sin requerir archivos externos.

class RetroAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.tempo = 124;
    this.step = 0;
    this.cutsceneBgmPlaying = false;
    this.cutsceneBgmTimer = null;
    this.cutsceneStep = 1;
    this.cutsceneNoteIndex = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted && this.bgmPlaying) {
      this.stopBgm();
      this.bgmPlaying = true; // recordar para reactivar al desmutear
    } else if (!this.muted && this.bgmPlaying) {
      this.startBgm();
    }
    return this.muted;
  }

  playPunch() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Tono descendente rápido (golpe seco de puño)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);
    
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);

    // Pequeño estallido de ruido blanco (impacto de tela/carne)
    this.playNoise(0.06, 0.25, 400);
  }

  playKick() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Patada pesada (onda cuadrada con subgrave)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.18);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);

    this.playNoise(0.12, 0.4, 250);
  }

  playJump() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playSlash() {
    if (this.muted || !this.ctx) return;
    // Cuchillazo filoso y rápido
    this.playNoise(0.14, 0.45, 1800, 'highpass');
  }

  playSniff() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Sonido de inhalación profunda del pegamento Sacol
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.35);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.25);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.38);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.38);

    // Tono psicodélico de ojos torcidos
    setTimeout(() => {
      if (this.muted || !this.ctx) return;
      const t = this.ctx.currentTime;
      const wildOsc = this.ctx.createOscillator();
      const wildGain = this.ctx.createGain();
      wildOsc.type = 'sawtooth';
      wildOsc.frequency.setValueAtTime(440, t);
      // Vibrato alocado
      for (let i = 0; i < 6; i++) {
        wildOsc.frequency.linearRampToValueAtTime(i % 2 === 0 ? 580 : 380, t + (i * 0.05));
      }
      wildGain.gain.setValueAtTime(0.15, t);
      wildGain.gain.linearRampToValueAtTime(0.01, t + 0.35);
      wildOsc.connect(wildGain);
      wildGain.connect(this.ctx.destination);
      wildOsc.start(t);
      wildOsc.stop(t + 0.35);
    }, 320);
  }

  playHit() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  playKo() {
    if (this.muted || !this.ctx) return;
    const notes = [300, 260, 220, 180, 130];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      }, idx * 80);
    });
  }

  playCollect() {
    if (this.muted || !this.ctx) return;
    const notes = [587, 880, 1174, 1760]; // D5, A5, D6, A6 (brillante)
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
      }, idx * 45);
    });
  }

  playFanfare() {
    if (this.muted || !this.ctx) return;
    const fanfareNotes = [523, 659, 783, 1046, 1318, 1567, 2093]; // C mayor arcade
    fanfareNotes.forEach((freq, idx) => {
      setTimeout(() => {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      }, idx * 65);
    });
  }

  playCritter() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.linearRampToValueAtTime(2400, now + 0.05);
    osc.frequency.linearRampToValueAtTime(1900, now + 0.09);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  // ==========================================
  // EFECTOS STREETS OF RAGE (SOR3 / SOR4)
  // ==========================================
  playDash() {
    if (this.muted || !this.ctx) return;
    this.playNoise(0.09, 0.28, 600, 'bandpass');
  }

  playRoll() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.16);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.16);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
    this.playNoise(0.12, 0.22, 500, 'lowpass');
  }

  playGrab() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.08);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
    this.playNoise(0.07, 0.35, 800, 'lowpass');
  }

  playThrow() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.25);
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
    this.playNoise(0.22, 0.5, 300, 'lowpass');
  }

  playSpecial() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.32);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.32);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.32);
    this.playNoise(0.28, 0.45, 1200, 'bandpass');
  }

  playHeavyHit() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.2);
    gain.gain.setValueAtTime(0.55, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
    this.playNoise(0.18, 0.55, 350, 'lowpass');
  }

  playNoise(duration, volume, filterFreq = 1000, filterType = 'lowpass') {
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(filterFreq, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start();
  }

  // Música de fondo estilo beat 'em up retro de los 80s/90s (Streets of Rage / TMNT)
  toggleBgm() {
    if (this.bgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  startBgm() {
    this.init();
    if (!this.ctx || this.muted) return;
    this.stopBgm();
    this.bgmPlaying = true;
    this.step = 0;

    // Patrón de bajo estilo sintetizador ochentero (Pentaradio menor en Mi)
    const bassline = [
      82.4, 0, 82.4, 98.0, 110.0, 0, 98.0, 82.4,
      73.4, 0, 73.4, 82.4, 98.0, 110.0, 123.5, 98.0
    ];

    // Patrón de batería retro (bombo en pasos 0, 8; caja en 4, 12; hi-hat en todos los impares)
    const stepTimeMs = (60 / this.tempo / 4) * 1000;

    this.bgmTimer = setInterval(() => {
      if (!this.bgmPlaying || this.muted || !this.ctx) return;
      const s = this.step % 16;
      const t = this.ctx.currentTime;

      // Bajo
      const note = bassline[s];
      if (note > 0) {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(note, t);
        g.gain.setValueAtTime(0.12, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + (stepTimeMs / 1000) * 0.9);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + (stepTimeMs / 1000) * 0.95);
      }

      // Bombo (Kick) en 0 y 8
      if (s === 0 || s === 8) {
        const kickOsc = this.ctx.createOscillator();
        const kickG = this.ctx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(130, t);
        kickOsc.frequency.exponentialRampToValueAtTime(35, t + 0.1);
        kickG.gain.setValueAtTime(0.3, t);
        kickG.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        kickOsc.connect(kickG);
        kickG.connect(this.ctx.destination);
        kickOsc.start(t);
        kickOsc.stop(t + 0.1);
      }

      // Caja (Snare) en 4 y 12
      if (s === 4 || s === 12) {
        this.playNoise(0.08, 0.18, 1200);
      }

      // Hi-Hat en cada tiempo impar
      if (s % 2 === 1) {
        this.playNoise(0.03, 0.06, 4000, 'highpass');
      }

      this.step++;
    }, stepTimeMs);
  }

  stopBgm() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  // ==========================================
  // BGM DINÁMICO CINEMÁTICA Y DESCENSO CANALIZACIÓN
  // ==========================================
  startCutsceneBgm() {
    this.init();
    if (!this.ctx || this.muted) return;
    this.stopBgm();
    this.stopCutsceneBgm();
    this.cutsceneBgmPlaying = true;
    this.cutsceneStep = 1;
    this.cutsceneNoteIndex = 0;
    this.runCutsceneAudioLoop();
  }

  setCutsceneStep(step) {
    this.cutsceneStep = step;
    if (this.cutsceneBgmPlaying) {
      if (this.cutsceneBgmTimer) {
        clearInterval(this.cutsceneBgmTimer);
        this.cutsceneBgmTimer = null;
      }
      this.runCutsceneAudioLoop();
    }
  }

  runCutsceneAudioLoop() {
    if (!this.ctx || this.muted || !this.cutsceneBgmPlaying) return;

    // Tempos dinámicos según el dramatismo narrativo:
    // 1: 106 BPM (Misterio), 2: 118 BPM (Curiosidad), 3: 132 BPM (Mutación/Alarma), 4/5: 144 BPM (Acción/Monstruo)
    const bpm = this.cutsceneStep === 1 ? 106 :
                this.cutsceneStep === 2 ? 118 :
                this.cutsceneStep === 3 ? 132 : 144;
    const stepMs = (60 / bpm / 4) * 1000;

    this.cutsceneBgmTimer = setInterval(() => {
      if (!this.cutsceneBgmPlaying || this.muted || !this.ctx) return;
      const s = this.cutsceneNoteIndex % 16;
      const t = this.ctx.currentTime;
      const step = this.cutsceneStep;

      if (step === 1) {
        // --- PASO 1: MISTERIO EN EL ANDÉN (Arpegios oscuros en D menor) ---
        const arp = [146.83, 174.61, 220.0, 261.63, 293.66, 261.63, 220.0, 174.61];
        if (s % 2 === 0) {
          const note = arp[(s / 2) % arp.length];
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(note, t);
          g.gain.setValueAtTime(0.08, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
          osc.connect(g);
          g.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.18);
        }
        if (s === 0 || s === 8) {
          const sub = this.ctx.createOscillator();
          const sg = this.ctx.createGain();
          sub.type = 'sine';
          sub.frequency.setValueAtTime(73.42, t);
          sg.gain.setValueAtTime(0.18, t);
          sg.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
          sub.connect(sg);
          sg.connect(this.ctx.destination);
          sub.start(t);
          sub.stop(t + 0.35);
        }
        if (s % 4 === 2) {
          this.playNoise(0.02, 0.04, 3500, 'highpass');
        }

      } else if (step === 2) {
        // --- PASO 2: LA INOCENTE CRIATURA (Groove juguetón y sigiloso) ---
        const bass = [73.42, 0, 87.31, 98.0, 110.0, 0, 98.0, 87.31, 73.42, 0, 87.31, 116.54, 110.0, 0, 98.0, 73.42];
        const bNote = bass[s];
        if (bNote > 0) {
          const bOsc = this.ctx.createOscillator();
          const bg = this.ctx.createGain();
          bOsc.type = 'sawtooth';
          bOsc.frequency.setValueAtTime(bNote, t);
          bg.gain.setValueAtTime(0.12, t);
          bg.gain.exponentialRampToValueAtTime(0.005, t + (stepMs / 1000) * 0.9);
          bOsc.connect(bg);
          bg.connect(this.ctx.destination);
          bOsc.start(t);
          bOsc.stop(t + (stepMs / 1000) * 0.95);
        }
        if (s % 4 === 1) {
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(293.66 + (s * 30), t);
          g.gain.setValueAtTime(0.06, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
          osc.connect(g);
          g.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.05);
        }
        if (s === 4 || s === 12) this.playNoise(0.05, 0.12, 1400);
        if (s % 2 === 1) this.playNoise(0.02, 0.05, 4200, 'highpass');

      } else if (step === 3) {
        // --- PASO 3: REACCIÓN EN CADENA Y MUTACIÓN (Alarma, tensión electro y aceleración) ---
        const chrom = [73.42, 73.42, 77.78, 82.41, 87.31, 92.5, 98.0, 103.83, 110.0, 110.0, 116.54, 123.47, 130.81, 138.59, 146.83, 164.81];
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(chrom[s], t);
        g.gain.setValueAtTime(0.15, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + (stepMs / 1000) * 0.85);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + (stepMs / 1000) * 0.9);

        const electric = [293.66, 349.23, 415.3, 493.88, 587.33, 493.88, 415.3, 349.23];
        const elOsc = this.ctx.createOscillator();
        const elG = this.ctx.createGain();
        elOsc.type = 'square';
        elOsc.frequency.setValueAtTime(electric[s % 8], t);
        elG.gain.setValueAtTime(0.08, t);
        elG.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        elOsc.connect(elG);
        elG.connect(this.ctx.destination);
        elOsc.start(t);
        elOsc.stop(t + 0.06);

        if (s === 0 || s === 8) {
          const k = this.ctx.createOscillator();
          const kg = this.ctx.createGain();
          k.type = 'sine';
          k.frequency.setValueAtTime(140, t);
          k.frequency.exponentialRampToValueAtTime(40, t + 0.09);
          kg.gain.setValueAtTime(0.32, t);
          kg.gain.exponentialRampToValueAtTime(0.01, t + 0.09);
          k.connect(kg);
          kg.connect(this.ctx.destination);
          k.start(t);
          k.stop(t + 0.09);
        }
        if (s === 4 || s === 12) this.playNoise(0.08, 0.22, 1600);
        this.playNoise(0.02, 0.04, 4500, 'highpass');

      } else {
        // --- PASO 4 Y 5: RATA MUTANTE GIGANTE & DESCENSO (Beat de acción y adrenalina total) ---
        const bossRiff = [
          55.0, 55.0, 0, 58.27, 55.0, 0, 65.41, 61.74,
          55.0, 55.0, 0, 73.42, 65.41, 58.27, 61.74, 55.0
        ];
        const bFreq = bossRiff[s];
        if (bFreq > 0) {
          const b1 = this.ctx.createOscillator();
          const b2 = this.ctx.createOscillator();
          const bg = this.ctx.createGain();
          b1.type = 'sawtooth';
          b2.type = 'square';
          b1.frequency.setValueAtTime(bFreq, t);
          b2.frequency.setValueAtTime(bFreq * 0.5, t);
          bg.gain.setValueAtTime(0.2, t);
          bg.gain.exponentialRampToValueAtTime(0.01, t + (stepMs / 1000) * 0.9);
          b1.connect(bg);
          b2.connect(bg);
          bg.connect(this.ctx.destination);
          b1.start(t);
          b2.start(t);
          b1.stop(t + (stepMs / 1000) * 0.95);
          b2.stop(t + (stepMs / 1000) * 0.95);
        }

        if (s === 0 || s === 3 || s === 8 || s === 11) {
          const k = this.ctx.createOscillator();
          const kg = this.ctx.createGain();
          k.type = 'sine';
          k.frequency.setValueAtTime(160, t);
          k.frequency.exponentialRampToValueAtTime(32, t + 0.12);
          kg.gain.setValueAtTime(0.4, t);
          kg.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
          k.connect(kg);
          kg.connect(this.ctx.destination);
          k.start(t);
          k.stop(t + 0.12);
        }

        if (s === 4 || s === 12 || s === 14 || s === 15) {
          const vol = (s >= 14) ? 0.14 : 0.28;
          this.playNoise(0.09, vol, 1800);
        }

        if (s === 0 || s === 8) {
          const stabNotes = (s === 0) ? [220.0, 261.63, 329.63] : [196.0, 233.08, 293.66];
          stabNotes.forEach(freq => {
            const stab = this.ctx.createOscillator();
            const sg = this.ctx.createGain();
            stab.type = 'sawtooth';
            stab.frequency.setValueAtTime(freq, t);
            sg.gain.setValueAtTime(0.09, t);
            sg.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
            stab.connect(sg);
            sg.connect(this.ctx.destination);
            stab.start(t);
            stab.stop(t + 0.25);
          });
        }

        this.playNoise(0.025, 0.05, 5000, 'highpass');
      }

      this.cutsceneNoteIndex++;
    }, stepMs);
  }

  stopCutsceneBgm() {
    this.cutsceneBgmPlaying = false;
    if (this.cutsceneBgmTimer) {
      clearInterval(this.cutsceneBgmTimer);
      this.cutsceneBgmTimer = null;
    }
  }

  startCanalChaseBgm() {
    this.init();
    if (!this.ctx || this.muted) return;
    this.stopBgm();
    this.stopCutsceneBgm();
    this.cutsceneStep = 5;
    this.cutsceneBgmPlaying = true;
    this.cutsceneNoteIndex = 0;
    this.runCutsceneAudioLoop();
  }

  // ==========================================
  // EFECTOS DE SONIDO: BOSS TESTIGO & TITÁN
  // ==========================================
  playDivineChime() {
    if (this.muted || !this.ctx) return;
    const notes = [587.33, 739.99, 880.00, 1174.66, 1479.98]; // D Mayor resplandor celestial
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      }, idx * 55);
    });
  }

  playThunderSlam() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Subgrave temblor de tierra
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.45);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);

    // Estruendo sordo
    this.playNoise(0.35, 0.6, 220, 'lowpass');
  }

  playBibleWhoosh() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.linearRampToValueAtTime(750, now + 0.08);
    osc.frequency.linearRampToValueAtTime(320, now + 0.16);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
    this.playNoise(0.12, 0.2, 1400, 'bandpass');
  }

  playChant() {
    if (this.muted || !this.ctx) return;
    const chords = [330, 392, 494]; // Acorde de rezo
    const now = this.ctx.currentTime;
    chords.forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    });
  }

  playBossSting(phase = 1) {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. Estruendo Sísmico / Sub-Bass Impact
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'triangle';
    const startFreq = phase === 3 ? 120 : (phase === 2 ? 100 : 90);
    const endFreq = phase === 3 ? 18 : 25;
    subOsc.frequency.setValueAtTime(startFreq, now);
    subOsc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.7);

    subGain.gain.setValueAtTime(phase === 3 ? 0.9 : 0.7, now);
    subGain.gain.linearRampToValueAtTime(0.01, now + 0.75);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.75);

    // 2. Ruido sordo de impacto callejero (estruendo)
    this.playNoise(phase === 3 ? 0.6 : 0.45, phase === 3 ? 0.8 : 0.5, 300, 'lowpass');

    // 3. Acorde arcade dramático según la fase
    let notes = [];
    if (phase === 1) {
      // Tono dramático de telenovela / arcade ("¿Tienes un minuto?")
      notes = [196.00, 246.94, 293.66, 392.00]; // Sol mayor dramático
    } else if (phase === 2) {
      // Acorde eclesiástico ("Por el cuerpo de Cristo")
      notes = [220.00, 261.63, 329.63, 440.00, 523.25]; // La menor solemne
    } else {
      // Apocalipsis Titánico ("Limpieza celestial")
      notes = [146.83, 174.61, 220.00, 293.66, 440.00, 587.33]; // Re menor triunfal
    }

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = phase === 2 ? 'sine' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + 0.05);
      
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + 0.05);
      osc.stop(now + 1.2);
    });
  }

  // Sonido de mordisco voraz al perro caliente
  playChomp() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.playNoise(0.08, 0.45, 1200, 'bandpass');
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.12);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Chispas y rayos de mutación tóxica
  playMutationSparks() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.playNoise(0.25, 0.4, 3000, 'highpass');
    for (let i = 0; i < 4; i++) {
      const t = now + i * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400 + Math.random() * 800, t);
      osc.frequency.exponentialRampToValueAtTime(150 + Math.random() * 200, t + 0.05);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    }
  }

  // Rugido monstruoso de la Rata Mutante Gigante
  playMonsterRoar() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.playNoise(0.9, 0.7, 350, 'lowpass');
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(110, now);
    osc1.frequency.linearRampToValueAtTime(180, now + 0.3);
    osc1.frequency.exponentialRampToValueAtTime(45, now + 0.9);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(65, now);
    osc2.frequency.linearRampToValueAtTime(120, now + 0.25);
    osc2.frequency.exponentialRampToValueAtTime(30, now + 0.9);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.9);
    osc2.stop(now + 0.9);
  }

  // Chime de anuncio de tránsito vial / Metro de Medellín
  playTransitChime() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    // Secuencia de dos tonos armoniosos y resonantes de señal vial / metro
    const chords = [
      { freq: 659.25, time: 0.0, dur: 0.38, gain: 0.22 },
      { freq: 880.00, time: 0.20, dur: 0.48, gain: 0.26 }
    ];
    chords.forEach(c => {
      const osc = this.ctx.createOscillator();
      const oscHarmonic = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      oscHarmonic.type = 'triangle';
      osc.frequency.setValueAtTime(c.freq, now + c.time);
      oscHarmonic.frequency.setValueAtTime(c.freq * 2, now + c.time);

      gain.gain.setValueAtTime(0.001, now + c.time);
      gain.gain.linearRampToValueAtTime(c.gain, now + c.time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + c.time + c.dur);

      osc.connect(gain);
      oscHarmonic.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + c.time);
      oscHarmonic.start(now + c.time);
      osc.stop(now + c.time + c.dur);
      oscHarmonic.stop(now + c.time + c.dur);
    });
  }
}

window.retroAudio = new RetroAudio();
