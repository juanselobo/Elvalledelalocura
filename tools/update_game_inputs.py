# -*- coding: utf-8 -*-
import os

GAME_PATH = r"D:\Desktop\Juegos\villa-aburra-game\game.js"

with open(GAME_PATH, "r", encoding="utf-8") as f:
    text = f.read()

idx_c = text.find("window.addEventListener('click', (e) => {")
idx_ku = text.find("window.addEventListener('keyup', (e) => {")

if idx_c != -1 and idx_ku != -1:
    replacement = """window.addEventListener('click', (e) => {
      if (this.currentStage === 3 && this.canal && this.canal.climax) {
        if (this.canal.climax.state === 'victory' || this.canal.climax.state === 'flooded_cutscene') {
          if (e.target && e.target.tagName === 'BUTTON') return;
          this.switchStage(4);
          return;
        }
      }
      if (this.currentStage === 4 && this.handleClickStage4) {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = (e.clientX - rect.left) * (this.vWidth / rect.width);
        const clickY = (e.clientY - rect.top) * (this.vHeight / rect.height);
        this.handleClickStage4(clickX, clickY);
        return;
      }
    });

    window.addEventListener('keydown', (e) => {
      if (window.retroAudio && window.retroAudio.init) {
        try { window.retroAudio.init(); } catch (err) {}
      }
      const k = e.key.toLowerCase();

      // Nivel 3: Victoria final de la rata -> Pasar a Nivel 4 con cualquier tecla de avance
      if (this.currentStage === 3 && this.canal && this.canal.climax) {
        if (this.canal.climax.state === 'victory' || this.canal.climax.state === 'flooded_cutscene') {
          if (k === ' ' || k === 'enter' || k === 'f' || k === 'c' || k === 'q' || k === 'e') {
            this.switchStage(4);
            return;
          }
        }
      }

      // Nivel 4: Manejo de cómic y diálogo interactivo
      if (this.currentStage === 4 && this.stage4) {
        // En los pasos 1 y 2 (aérea e interior con moto): avanzar con cualquier tecla de acción
        if (this.stage4.comicStep === 1 || this.stage4.comicStep === 2) {
          if (k === ' ' || k === 'enter' || k === 'f' || k === 'c' || k === 'arrowright' || k === 'd') {
            this.advanceStage4Comic(1);
            return;
          }
          if (k === 'arrowleft' || k === 'a') {
            this.advanceStage4Comic(-1);
            return;
          }
        } else if (this.stage4.comicStep === 3) {
          // Paso 3: Diálogo interactivo con el Agente de Tránsito
          if (this.stage4.gameOver) {
            if (k === ' ' || k === 'enter' || k === 'f' || k === 'q' || k === 'e' || k === 'z' || k === 'x' || k === 'c' || k === 'j' || k === 'k') {
              if (this.confirmStage4Choice) this.confirmStage4Choice();
              return;
            }
          } else {
            // Teclas numéricas directas 1, 2, 3, 4
            if (k === '1') { this.selectStage4Choice(0); return; }
            if (k === '2') { this.selectStage4Choice(1); return; }
            if (k === '3') { this.selectStage4Choice(2); return; }
            if (k === '4') { this.selectStage4Choice(3); return; }

            // Navegación con flechas / W / S
            if (k === 'arrowup' || k === 'w') {
              if (this.navigateStage4Choice) this.navigateStage4Choice(-1);
              return;
            }
            if (k === 'arrowdown' || k === 's') {
              if (this.navigateStage4Choice) this.navigateStage4Choice(1);
              return;
            }

            // Confirmar opción seleccionada
            if (k === ' ' || k === 'enter' || k === 'f' || k === 'q' || k === 'e' || k === 'z' || k === 'x' || k === 'c' || k === 'j' || k === 'k') {
              if (this.confirmStage4Choice) this.confirmStage4Choice();
              return;
            }
          }
        }
      }

      // Si la cinemática de la rata está activa, cualquier tecla de acción avanza el panel
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
      if (k === '4') this.switchStage(4);
      if (k === '5') this.startRatCutscene();
      if (k === 'm') {
        const playing = window.retroAudio.toggleBgm();
        this.addFloatingText(this.player.x, this.player.z - 100, playing ? "MÚSICA: ON" : "MÚSICA: OFF", "#f1c40f");
      }
    });

    """
    text = text[:idx_c] + replacement + text[idx_ku:]
    with open(GAME_PATH, "w", encoding="utf-8") as f:
        f.write(text)
    print("Fixed game.js input listeners successfully!")
else:
    print("Could not find delimiters in game.js")
