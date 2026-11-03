# -*- coding: utf-8 -*-
import os

LEVEL4_PATH = r"D:\Desktop\Juegos\villa-aburra-game\levels\level4.js"
GAME_PATH = r"D:\Desktop\Juegos\villa-aburra-game\game.js"

# -------------------------------------------------------------
# 1. ACTUALIZAR LEVEL4.JS
# -------------------------------------------------------------
with open(LEVEL4_PATH, "r", encoding="utf-8") as f:
    l4 = f.read()

# Asegurarse de que selectStage4Choice y restartStage4Dialogue estén presentes
if "selectStage4Choice(choiceIndex) {" not in l4:
    idx_confirm = l4.find("confirmStage4Choice() {")
    idx_next_func = l4.find("handleMouseMoveStage4(mouseX, mouseY) {", idx_confirm)
    
    missing_funcs = """  selectStage4Choice(choiceIndex) {
    if (!this.stage4) return;
    const { NODES, ENDINGS } = this.getStage4DialogueData();
    const cur = NODES[this.stage4.currentNodeId || 'N0'];
    if (!cur || !cur.choices || !cur.choices[choiceIndex]) return;

    const chosen = cur.choices[choiceIndex];
    if (window.retroAudio && window.retroAudio.playCollect) window.retroAudio.playCollect();

    if (chosen.next.startsWith('END_')) {
      this.stage4.gameOver = ENDINGS[chosen.next];
      if (window.retroAudio && window.retroAudio.playHit) window.retroAudio.playHit();
    } else if (chosen.next === 'SUCCESS_PARKOUR') {
      this.stage4.gameOver = ENDINGS.SUCCESS_PARKOUR;
      if (window.retroAudio && window.retroAudio.playFanfare) window.retroAudio.playFanfare();
    } else {
      this.stage4.currentNodeId = chosen.next;
      this.stage4.selectedChoiceIndex = 0;
    }
  },

  restartStage4Dialogue() {
    if (!this.stage4) return;
    this.stage4.currentNodeId = 'N0';
    this.stage4.selectedChoiceIndex = 0;
    this.stage4.gameOver = null;
    if (window.retroAudio && window.retroAudio.playTransitChime) window.retroAudio.playTransitChime();
  },

  """
    # Insertar antes de handleMouseMoveStage4
    l4 = l4[:idx_next_func] + missing_funcs + l4[idx_next_func:]
    print("Added selectStage4Choice and restartStage4Dialogue into level4.js")

# Ajustar transparencia y posición de la caja de diálogo
# Reemplazar la caja de diálogo opaca (rgba(7, 5, 16, 0.96)) por semitransparente (0.62)
l4 = l4.replace("ctx.fillStyle = 'rgba(7, 5, 16, 0.96)';", "ctx.fillStyle = 'rgba(8, 6, 18, 0.62)';")
l4 = l4.replace("ctx.fillStyle = 'rgba(8, 6, 18, 0.96)';", "ctx.fillStyle = 'rgba(8, 6, 18, 0.65)';")
l4 = l4.replace("const boxY = 158;", "const boxY = 176;")
l4 = l4.replace("const boxH = 196;", "const boxH = 176;")

# Transparencia de los botones de opciones
l4 = l4.replace("ctx.fillStyle = 'rgba(20, 16, 38, 0.90)';", "ctx.fillStyle = 'rgba(16, 12, 30, 0.55)';")
l4 = l4.replace("ctx.fillStyle = 'rgba(241, 196, 15, 0.32)';", "ctx.fillStyle = 'rgba(241, 196, 15, 0.40)';")

with open(LEVEL4_PATH, "w", encoding="utf-8") as f:
    f.write(l4)
print("Updated level4.js styling and dialogue progression!")

# -------------------------------------------------------------
# 2. ACTUALIZAR GAME.JS (Touch D-Pad Game Boy controls)
# -------------------------------------------------------------
with open(GAME_PATH, "r", encoding="utf-8") as f:
    gj = f.read()

# Actualizar setupTouchControls para que btnUp, btnDown y botones de acción funcionen en step 3 y avancen en steps 1 y 2
idx_touch = gj.find("setupTouchControls() {")
idx_end_touch = gj.find("setupMobileLayout() {", idx_touch)

if idx_touch != -1 and idx_end_touch != -1:
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
    gj = gj[:idx_touch] + new_touch + gj[idx_end_touch:]
    with open(GAME_PATH, "w", encoding="utf-8") as f:
        f.write(gj)
    print("Updated game.js touch controls for Game Boy D-Pad and Action buttons successfully!")
