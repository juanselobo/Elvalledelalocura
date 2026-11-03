# -*- coding: utf-8 -*-
with open('D:/Desktop/Juegos/villa-aburra-game/game.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx_touch = text.find("setupTouchControls() {")
idx_end = text.find("bindBtn('btnSelect', () => {", idx_touch)
# El final de setupTouchControls es después del bloque de btnSelect
idx_close = text.find("\n  // ====================", idx_end)

new_touch = """setupTouchControls() {
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
          if (window.retroAudio && window.retroAudio.init) { try { window.retroAudio.init(); } catch (err) {} }
          onDown();
          if (onUp) onUp();
        }
      });
    };

    // D-Pad Game Boy Color con soporte para selección de personaje y navegación de diálogo Nivel 4
    bindBtn('btnLeft', () => {
      if (this.gameState === 'CHAR_SELECT') { this.selectPrevChar(); return; }
      if (this.currentStage === 4 && this.stage4 && (this.stage4.comicStep === 1 || this.stage4.comicStep === 2)) {
        this.advanceStage4Comic(-1);
        return;
      }
      this.keys.left = true;
    }, () => { this.keys.left = false; this.player.isDashing = false; });

    bindBtn('btnRight', () => {
      if (this.gameState === 'CHAR_SELECT') { this.selectNextChar(); return; }
      if (this.currentStage === 4 && this.stage4 && (this.stage4.comicStep === 1 || this.stage4.comicStep === 2)) {
        this.advanceStage4Comic(1);
        return;
      }
      this.keys.right = true;
    }, () => { this.keys.right = false; this.player.isDashing = false; });

    bindBtn('btnUp', () => {
      if (this.currentStage === 4 && this.stage4 && this.stage4.comicStep === 3) {
        if (this.navigateStage4Choice) this.navigateStage4Choice(-1);
        return;
      }
      this.keys.up = true;
    }, () => { this.keys.up = false; });

    bindBtn('btnDown', () => {
      if (this.currentStage === 4 && this.stage4 && this.stage4.comicStep === 3) {
        if (this.navigateStage4Choice) this.navigateStage4Choice(1);
        return;
      }
      this.keys.down = true;
    }, () => { this.keys.down = false; });

    // Botones de acción principales Game Boy Color (A, B, Jump, etc.)
    bindBtn('btnJump', () => {
      if (this.gameState === 'TITLE') { this.advanceTitleScreen(); return; }
      if (this.gameState === 'CHAR_SELECT') { this.confirmCharSelect(); return; }
      if (this.currentStage === 4 && this.stage4) {
        if (this.stage4.comicStep === 3) {
          if (this.confirmStage4Choice) this.confirmStage4Choice();
        } else {
          this.advanceStage4Comic(1);
        }
        return;
      }
      this.triggerJump();
    });

    bindBtn('btnPunch', () => {
      if (this.gameState === 'TITLE') { this.advanceTitleScreen(); return; }
      if (this.gameState === 'CHAR_SELECT') { this.confirmCharSelect(); return; }
      if (this.currentStage === 4 && this.stage4) {
        if (this.stage4.comicStep === 3) {
          if (this.confirmStage4Choice) this.confirmStage4Choice();
        } else {
          this.advanceStage4Comic(1);
        }
        return;
      }
      this.triggerAttack();
    });

    bindBtn('btnKick', () => {
      if (this.gameState === 'TITLE') { this.advanceTitleScreen(); return; }
      if (this.gameState === 'CHAR_SELECT') { this.confirmCharSelect(); return; }
      if (this.currentStage === 4 && this.stage4) {
        if (this.stage4.comicStep === 3) {
          if (this.confirmStage4Choice) this.confirmStage4Choice();
        } else {
          this.advanceStage4Comic(1);
        }
        return;
      }
      this.triggerSpecial();
    });

    bindBtn('btnRun', () => { this.player.isDashing = !this.player.isDashing; });

    // Botón de ACCION / HABLAR / ACEPTAR para celular
    bindBtn('btnInteract', () => {
      if (this.gameState === 'TITLE') { this.advanceTitleScreen(); return; }
      if (this.gameState === 'CHAR_SELECT') { this.confirmCharSelect(); return; }
      if (this.currentStage === 4 && this.stage4) {
        if (this.stage4.comicStep === 3) {
          if (this.confirmStage4Choice) this.confirmStage4Choice();
        } else {
          this.advanceStage4Comic(1);
        }
        return;
      }
      this.interact();
    });

    bindBtn('btnStart', () => {
      if (this.gameState === 'TITLE') { this.advanceTitleScreen(); return; }
      if (this.gameState === 'CHAR_SELECT') { this.confirmCharSelect(); return; }
      if (this.currentStage === 4 && this.stage4) {
        if (this.stage4.comicStep === 3) {
          if (this.confirmStage4Choice) this.confirmStage4Choice();
        } else {
          this.advanceStage4Comic(1);
        }
        return;
      }
      this.interact();
    });

    bindBtn('btnSelect', () => {
      if (this.gameState === 'CHAR_SELECT') { this.selectNextChar(); return; }
      if (this.currentStage === 4 && this.stage4) {
        if (this.stage4.comicStep === 3) {
          if (this.navigateStage4Choice) this.navigateStage4Choice(1);
        } else {
          this.advanceStage4Comic(1);
        }
        return;
      }
    });
  }
"""

updated_text = text[:idx_touch] + new_touch + text[idx_close:]
with open('D:/Desktop/Juegos/villa-aburra-game/game.js', 'w', encoding='utf-8') as f:
    f.write(updated_text)

print("game.js touch controls updated successfully!")
