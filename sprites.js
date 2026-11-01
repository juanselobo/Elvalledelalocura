// sprites.js - Asset Loader y Manejo de Sprites HD para "Aventura en Medellín"
// Carga los sprites y fondos generados 100% nativos para una alineación y escala perfectas.

class SpriteManager {
  constructor() {
    this.images = {};
    this.loaded = false;
    this.loadCount = 0;
    this.totalImages = 0;
    this.init();
  }

  init() {
    const assetList = {
      // 1. Fondos con Paralaje (3 capas de profundidad + suelo)
      'bg_far': 'assets/bg_far.png',
      'bg_mid': 'assets/bg_mid.png',
      'bg_near': 'assets/bg_near.png',
      'ground_platform': 'assets/ground_platform.png',

      // 2. Props y fauna urbana
      'delivery_box': 'assets/delivery_box.png',
      'pigeon': 'assets/pigeon.png',
      'pigeon_fly': 'assets/pigeon_fly.png',
      'rat_todito': 'assets/rat_todito.png',
      'rat_cigar': 'assets/rat_cigar.png',
      'cockroach': 'assets/cockroach.png',

      // 3. Protagonista: Rail-Walker (Juancho) - Animaciones Fluidas & Ataques Diferenciados
      'player_idle': 'assets/player_idle.png',
      'player_idle1': 'assets/player_idle1.png',
      'player_idle2': 'assets/player_idle2.png',
      'player_idle3': 'assets/player_idle3.png',
      'player_walk1': 'assets/player_walk1.png',
      'player_walk2': 'assets/player_walk2.png',
      'player_walk3': 'assets/player_walk3.png',
      'player_run1': 'assets/player_run1.png',
      'player_run2': 'assets/player_run2.png',
      'player_run3': 'assets/player_run3.png',
      'player_run4': 'assets/player_run4.png',
      'player_run_1': 'assets/player_run_1.png',
      'player_run_2': 'assets/player_run_2.png',
      'player_run_3': 'assets/player_run_3.png',
      'player_run_4': 'assets/player_run_4.png',
      'player_run_5': 'assets/player_run_5.png',
      'player_run_6': 'assets/player_run_6.png',
      'player_rail': 'assets/player_rail.png',
      'player_jump': 'assets/player_jump.png',
      'player_jump_ascend': 'assets/player_jump_ascend.png',
      'player_jump_peak': 'assets/player_jump_peak.png',
      'player_jump_descend': 'assets/player_jump_descend.png',
      'player_jump_land': 'assets/player_jump_land.png',
      'player_punch': 'assets/player_punch.png',
      'player_punch1': 'assets/player_punch1.png',
      'player_punch2': 'assets/player_punch2.png',
      'player_punch3': 'assets/player_punch3.png',
      'player_punch_jab': 'assets/player_punch_jab.png',
      'player_punch_cross': 'assets/player_punch_cross.png',
      'player_punch_hook': 'assets/player_punch_hook.png',
      'player_kick': 'assets/player_kick.png',
      'player_kick1': 'assets/player_kick1.png',
      'player_kick2': 'assets/player_kick2.png',
      'player_kick_snap': 'assets/player_kick_snap.png',
      'player_kick_roundhouse': 'assets/player_kick_roundhouse.png',
      'player_kick_dragon': 'assets/player_kick_dragon.png',
      'player_kick_mid': 'assets/player_kick_mid.png',
      'player_kick_low': 'assets/player_kick_low.png',
      'player_jumpkick': 'assets/player_jumpkick.png',
      'player_uppercut': 'assets/player_uppercut.png',
      'player_blitz': 'assets/player_blitz.png',
      'player_suplex': 'assets/player_suplex.png',
      'player_hurt': 'assets/player_hurt.png',
      'player_sniff': 'assets/player_sniff.png',
      'player_eat': 'assets/player_eat.png',

      // 3.5. Protagonista 2: Lina (La Patinadera - Reina del Patín de Belén)
      'lina_idle': 'assets/lina_idle.png',
      'lina_idle1': 'assets/lina_idle1.png',
      'lina_idle2': 'assets/lina_idle2.png',
      'lina_idle3': 'assets/lina_idle3.png',
      'lina_walk1': 'assets/lina_walk1.png',
      'lina_walk2': 'assets/lina_walk2.png',
      'lina_walk3': 'assets/lina_walk3.png',
      'lina_run1': 'assets/lina_run1.png',
      'lina_run_1': 'assets/lina_run_1.png',
      'lina_run_2': 'assets/lina_run_2.png',
      'lina_run_3': 'assets/lina_run_3.png',
      'lina_run_4': 'assets/lina_run_4.png',
      'lina_run_5': 'assets/lina_run_5.png',
      'lina_run_6': 'assets/lina_run_6.png',
      'lina_jump': 'assets/lina_jump.png',
      'lina_jump_ascend': 'assets/lina_jump_ascend.png',
      'lina_jump_peak': 'assets/lina_jump_peak.png',
      'lina_jump_descend': 'assets/lina_jump_descend.png',
      'lina_jumpkick': 'assets/lina_jumpkick.png',
      'lina_punch': 'assets/lina_punch.png',
      'lina_punch_jab': 'assets/lina_punch_jab.png',
      'lina_punch_cross': 'assets/lina_punch_cross.png',
      'lina_punch_hook': 'assets/lina_punch_hook.png',
      'lina_kick': 'assets/lina_kick.png',
      'lina_kick_roundhouse': 'assets/lina_kick_roundhouse.png',
      'lina_kick_low': 'assets/lina_kick_low.png',
      'lina_kick_dragon': 'assets/lina_kick_dragon.png',
      'lina_blitz': 'assets/lina_blitz.png',
      'lina_suplex': 'assets/lina_suplex.png',
      'lina_hurt': 'assets/lina_hurt.png',
      'lina_rail': 'assets/lina_rail.png',
      'lina_downhill_slide': 'assets/lina_downhill_slide.png',
      'lina_hero_sheet': 'assets/lina_hero_sheet.png',
      'lina_spritesheet_actions': 'assets/lina_spritesheet_actions.png',

      // 3.6 Protagonista 3: Doña Gloria (La Matriarca de la Villa / Del Metrocable)
      'gloria_idle': 'assets/gloria_idle.png',
      'gloria_idle1': 'assets/gloria_idle1.png',
      'gloria_idle2': 'assets/gloria_idle2.png',
      'gloria_idle3': 'assets/gloria_idle3.png',
      'gloria_walk1': 'assets/gloria_walk1.png',
      'gloria_walk2': 'assets/gloria_walk2.png',
      'gloria_walk3': 'assets/gloria_walk3.png',
      'gloria_run1': 'assets/gloria_run1.png',
      'gloria_run_1': 'assets/gloria_run_1.png',
      'gloria_run_2': 'assets/gloria_run_2.png',
      'gloria_run_3': 'assets/gloria_run_3.png',
      'gloria_run_4': 'assets/gloria_run_4.png',
      'gloria_run_5': 'assets/gloria_run_5.png',
      'gloria_run_6': 'assets/gloria_run_6.png',
      'gloria_jump': 'assets/gloria_jump.png',
      'gloria_jump_ascend': 'assets/gloria_jump_ascend.png',
      'gloria_jump_peak': 'assets/gloria_jump_peak.png',
      'gloria_jump_descend': 'assets/gloria_jump_descend.png',
      'gloria_jumpkick': 'assets/gloria_jumpkick.png',
      'gloria_punch': 'assets/gloria_punch.png',
      'gloria_punch_jab': 'assets/gloria_punch_jab.png',
      'gloria_punch_cross': 'assets/gloria_punch_cross.png',
      'gloria_punch_hook': 'assets/gloria_punch_hook.png',
      'gloria_kick': 'assets/gloria_kick.png',
      'gloria_kick_roundhouse': 'assets/gloria_kick_roundhouse.png',
      'gloria_kick_low': 'assets/gloria_kick_low.png',
      'gloria_kick_dragon': 'assets/gloria_kick_dragon.png',
      'gloria_blitz': 'assets/gloria_blitz.png',
      'gloria_suplex': 'assets/gloria_suplex.png',
      'gloria_hurt': 'assets/gloria_hurt.png',
      'gloria_rail': 'assets/gloria_rail.png',
      'gloria_downhill_slide': 'assets/gloria_downhill_slide.png',
      'gloria_hero_sheet': 'assets/gloria_hero_sheet.png',
      'gloria_spritesheet_actions': 'assets/gloria_spritesheet_actions.png',

      // 4. Enemigo 1: Gamín de Medellín - Animaciones Fluidas Sólidas
      'gamin_stand': 'assets/gamin_stand.png',
      'gamin_walk1': 'assets/gamin_walk1.png',
      'gamin_walk2': 'assets/gamin_walk2.png',
      'gamin_walk3': 'assets/gamin_walk3.png',
      'gamin_walk4': 'assets/gamin_walk4.png',
      'gamin_walk_1': 'assets/gamin_walk_1.png',
      'gamin_walk_2': 'assets/gamin_walk_2.png',
      'gamin_walk_3': 'assets/gamin_walk_3.png',
      'gamin_walk_4': 'assets/gamin_walk_4.png',
      'gamin_walk_5': 'assets/gamin_walk_5.png',
      'gamin_walk_6': 'assets/gamin_walk_6.png',
      'gamin_sniff': 'assets/gamin_sniff.png',
      'gamin_sniff_inhale': 'assets/gamin_sniff_inhale.png',
      'gamin_sniff_exhale': 'assets/gamin_sniff_exhale.png',
      'gamin_slash': 'assets/gamin_slash.png',
      'gamin_slash1': 'assets/gamin_slash1.png',
      'gamin_slash2': 'assets/gamin_slash2.png',
      'gamin_knife_ready': 'assets/gamin_knife_ready.png',
      'gamin_knife_slash': 'assets/gamin_knife_slash.png',
      'gamin_knife_stab': 'assets/gamin_knife_stab.png',
      'gamin_crouch': 'assets/gamin_crouch.png',
      'gamin_hurt': 'assets/gamin_hurt.png',
      'gamin_ko': 'assets/gamin_ko.png',

      // Ítems nativos de personajes
      'item_arepa': 'assets/item_arepa.png',
      'item_gafas': 'assets/item_gafas.png',
      'item_chaqueta': 'assets/item_chaqueta.png',
      'item_sacol': 'assets/item_sacol.png',
      'item_knife': 'assets/item_knife.png',
      'item_bolsa_exito': 'assets/item_bolsa_exito.png',
      'item_smartphone': 'assets/item_smartphone.png',

      // 5. Enemigo 2: Rappi-Gamín Medellín - Animaciones Fluidas
      'rappi_stand': 'assets/rappi_stand.png',
      'rappi_walk1': 'assets/rappi_walk1.png',
      'rappi_walk2': 'assets/rappi_walk2.png',
      'rappi_walk3': 'assets/rappi_walk3.png',
      'rappi_walk4': 'assets/rappi_walk4.png',
      'rappi_walk_1': 'assets/rappi_walk_1.png',
      'rappi_walk_2': 'assets/rappi_walk_2.png',
      'rappi_walk_3': 'assets/rappi_walk_3.png',
      'rappi_walk_4': 'assets/rappi_walk_4.png',
      'rappi_charge': 'assets/rappi_charge.png',
      'rappi_charge1': 'assets/rappi_charge1.png',
      'rappi_charge2': 'assets/rappi_charge2.png',
      'rappi_box_ram': 'assets/rappi_box_ram.png',
      'rappi_throw': 'assets/rappi_throw.png',
      'rappi_throw1': 'assets/rappi_throw1.png',
      'rappi_throw2': 'assets/rappi_throw2.png',
      'rappi_box_throw': 'assets/rappi_box_throw.png',
      'rappi_eat': 'assets/rappi_eat.png',
      'rappi_hurt': 'assets/rappi_hurt.png',
      'rappi_ko': 'assets/rappi_ko.png',
      'rappi_moto': 'assets/rappi_moto.png',
      'flying_burger': 'assets/flying_burger.png',

      // 6. NPC / Aliada Especial: Doña Gloria del Metrocable
      'gloria_idle': 'assets/gloria_idle.png',
      'gloria_walk1': 'assets/gloria_walk1.png',
      'gloria_walk2': 'assets/gloria_walk2.png',
      'gloria_walk3': 'assets/gloria_walk3.png',
      'empanadas_cart': 'assets/empanadas_cart.png',

      // 7. Ítems Paisas Coleccionables
      'item_tinto': 'assets/item_tinto.png',
      'item_chancleta': 'assets/item_chancleta.png',
      'item_ticket': 'assets/item_ticket.png',

      // 8. Escenario 2 Alternativo: Atardecer Metrocable
      'bg2_far': 'assets/bg2_far.png',
      'bg2_mid': 'assets/bg2_mid.png',
      'bg2_near': 'assets/bg2_near.png',

      // 9. Boss Final: Testigo de Jehová y Súper Testigo Titánico - Animaciones Fluidas
      'testigo_stand': 'assets/testigo_stand.png',
      'testigo_walk1': 'assets/testigo_walk1.png',
      'testigo_walk2': 'assets/testigo_walk2.png',
      'testigo_walk3': 'assets/testigo_walk3.png',
      'testigo_walk4': 'assets/testigo_walk4.png',
      'testigo_walk_1': 'assets/testigo_walk_1.png',
      'testigo_walk_2': 'assets/testigo_walk_2.png',
      'testigo_walk_3': 'assets/testigo_walk_3.png',
      'testigo_walk_4': 'assets/testigo_walk_4.png',
      'testigo_throw': 'assets/testigo_throw.png',
      'testigo_throw1': 'assets/testigo_throw1.png',
      'testigo_throw2': 'assets/testigo_throw2.png',
      'testigo_bible_raise': 'assets/testigo_bible_raise.png',
      'testigo_bible_strike': 'assets/testigo_bible_strike.png',
      'testigo_pray': 'assets/testigo_pray.png',
      'testigo_hurt': 'assets/testigo_hurt.png',
      'testigo_ko': 'assets/testigo_ko.png',
      'testigo_cart': 'assets/testigo_cart.png',
      'testigo_trio_march': 'assets/testigo_trio_march.png',
      'testigo_trio_attack': 'assets/testigo_trio_attack.png',
      'testigo_trio_hurt': 'assets/testigo_trio_hurt.png',
      'titan_idle': 'assets/titan_idle.png',
      'titan_slam': 'assets/titan_slam.png',
      'titan_rain': 'assets/titan_rain.png',
      'proj_bible': 'assets/proj_bible.png',
      'proj_crucifix': 'assets/proj_crucifix.png',
      'prop_hotdog': 'assets/prop_hotdog.png',
      'prop_sign_canal': 'assets/prop_sign_canal.png',
      'rata_mutante_chase': 'assets/rata_mutante_chase.png',
      'rata_mutante_roar': 'assets/rata_mutante_roar.png',
      'rata_mutante_bite': 'assets/rata_mutante_bite.png',
      'cutscene_rat_1': 'assets/cutscene_rat_1.png',
      'cutscene_rat_2': 'assets/cutscene_rat_2.png',
      'cutscene_rat_3': 'assets/cutscene_rat_3.png',
      'cutscene_rat_4': 'assets/cutscene_rat_4.png',
      'stairs_level1': 'assets/stairs_level1.png',
      'stairs_landing_level2': 'assets/stairs_landing_level2.png',
      'canal_chasm_ledge': 'assets/canal_chasm_ledge.png',
      'bg3_far': 'assets/bg3_far.png',
      'bg3_mid': 'assets/bg3_mid.png',
      'canal_wall_slope': 'assets/canal_wall_slope.png',
      'canal_ramp_floor': 'assets/canal_ramp_floor.png',
      'canal_continuous_surface': 'assets/canal_continuous_surface.png',
      'canal_sliding_bed': 'assets/canal_sliding_bed.png',
      'canal_upper_promenade': 'assets/canal_upper_promenade.png',
      'rata_colosal_maw': 'assets/rata_colosal_maw.png',
      'rata_colosal_open': 'assets/rata_colosal_open.png',
      'rata_colosal_snap': 'assets/rata_colosal_snap.png',
      'rata_colosal_rabid': 'assets/rata_colosal_rabid.png',
      'obs_gamin_dormido': 'assets/obs_gamin_dormido.png',
      'obs_prepago': 'assets/obs_prepago.png',
      'obs_taxista_cruceta': 'assets/obs_taxista_cruceta.png',
      'obs_inodoro_destruido': 'assets/obs_inodoro_destruido.png',
      'obs_colchon_viejo': 'assets/obs_colchon_viejo.png',
      'obs_gamin_dormido_hit': 'assets/obs_gamin_dormido_hit.png',
      'obs_prepago_hit': 'assets/obs_prepago_hit.png',
      'obs_taxista_cruceta_hit': 'assets/obs_taxista_cruceta_hit.png',
      'obs_inodoro_destruido_hit': 'assets/obs_inodoro_destruido_hit.png',
      'obs_colchon_viejo_hit': 'assets/obs_colchon_viejo_hit.png',
      'obs_gallinazo': 'assets/obs_gallinazo.png',
      'obs_gallinazo_perched': 'assets/obs_gallinazo_perched.png',
      'obs_gallinazo_hit': 'assets/obs_gallinazo_hit.png',
      'player_downhill_slide': 'assets/player_downhill_slide.png',
      'player_downhill_slide_1': 'assets/player_downhill_slide_1.png',
      'player_downhill_slide_2': 'assets/player_downhill_slide_2.png',
      'player_downhill_slide_3': 'assets/player_downhill_slide_3.png',
      'showcase_level3_descent_scheme': 'assets/showcase_level3_descent_scheme.png',
      'title_bg': 'assets/title_bg.png',
      'title_logo_graffiti': 'assets/title_logo_graffiti.png',
      'portrait_juancho': 'assets/portrait_juancho.png',
      'portrait_lina': 'assets/portrait_lina.png',
      'portrait_brayan': 'assets/portrait_brayan.png',
      'portrait_fuisioso': 'assets/portrait_fuisioso.png',
      'portrait_gloria': 'assets/portrait_gloria.png',
      'portrait_fico': 'assets/portrait_fico.png'
    };

    const keys = Object.keys(assetList);
    this.totalImages = keys.length;
    const assetVersion = 'v1.4.6';

    keys.forEach(key => {
      const img = new Image();
      img.src = assetList[key] + "?v=" + assetVersion;
      img.onload = () => {
        this.loadCount++;
        if (this.loadCount >= this.totalImages) {
          this.loaded = true;
          console.log("Todos los assets HD nativos cargados con éxito.");
        }
      };
      img.onerror = () => {
        console.warn(`No se pudo cargar: ${assetList[key]}`);
        this.loadCount++;
      };
      this.images[key] = img;
    });
  }

  getImage(key) {
    return this.images[key] || null;
  }

  // Dibuja un sprite con soporte para orientación, rotación, squash & stretch, sub-pixel bobbing y anclaje a ras de suelo (Protegido contra fallos)
  drawSprite(ctx, key, x, y, facingRight = true, alpha = 1.0, rotation = 0, scaleX = 1.0, scaleY = 1.0, offsetX = 0, offsetY = 0) {
    const img = this.images[key];
    if (!img || !img.complete || img.naturalWidth === 0) return;
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;

    ctx.save();
    try {
      ctx.imageSmoothingEnabled = false;
      const safeAlpha = Number.isFinite(alpha) ? Math.max(0, Math.min(1, alpha)) : 1.0;
      if (safeAlpha < 1.0) ctx.globalAlpha = safeAlpha;

      const w = img.naturalWidth;
      const h = img.naturalHeight;

      const tx = Math.floor(x + (Number.isFinite(offsetX) ? offsetX : 0));
      const ty = Math.floor(y + (Number.isFinite(offsetY) ? offsetY : 0));
      ctx.translate(tx, ty);

      if (!facingRight) {
        ctx.scale(-1, 1);
      }

      if (Number.isFinite(rotation) && rotation !== 0) {
        ctx.translate(0, -Math.floor(h / 2));
        ctx.rotate(rotation);
        ctx.translate(0, Math.floor(h / 2));
      }

      const sx = Number.isFinite(scaleX) && Math.abs(scaleX) > 0.001 ? scaleX : 1.0;
      const sy = Number.isFinite(scaleY) && Math.abs(scaleY) > 0.001 ? scaleY : 1.0;
      if (sx !== 1.0 || sy !== 1.0) {
        ctx.scale(sx, sy);
      }

      ctx.drawImage(img, -Math.floor(w / 2), -h);
    } catch (e) {
      console.warn('drawSprite error on key:', key, e);
    } finally {
      ctx.restore();
    }
  }
}

window.spriteManager = new SpriteManager();
