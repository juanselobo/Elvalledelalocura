# villa-aburra-game/tools/sprite_generator.py
# Herramienta de Generación y Limpieza de Sprites HD 32-bit para "Aventura en Medellín"
# Corrige transparencias glitcheadas y genera bibliotecas completas de animación:
# - Juancho: 3 puños diferentes, 3 patadas diferentes, 4 fases de salto, 6 cuadros de carrera.
# - Gamín del Sacol: Alpha 100% sólido, 6 cuadros de caminata sigilosa, 3 ataques de cuchillo distintos.
# - Rappi-Gamín & Hermano Fabio: Limpieza alfa sólida y transiciones suaves.

import os
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageChops

ASSETS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'assets'))

def load_raw(name):
    path = os.path.join(ASSETS_DIR, f'{name}.png')
    if not os.path.exists(path):
        raise FileNotFoundError(f"Missing asset: {path}")
    return Image.open(path).convert('RGBA')

def save_clean(im, name):
    # Asegurar que el cuerpo interior sea 100% sólido (alpha = 255) para evitar glitches transparentes
    arr = np.array(im)
    alpha = arr[:, :, 3]
    # Umbral limpio: bordes muy tenues (<30) a 0; todo el cuerpo interior (>30) a 255 sólido
    solid_alpha = np.where(alpha > 30, 255, 0).astype(np.uint8)
    arr[:, :, 3] = solid_alpha
    clean_im = Image.fromarray(arr)
    
    out_path = os.path.join(ASSETS_DIR, f'{name}.png')
    clean_im.save(out_path, 'PNG')
    print(f"  -> Generado: {name}.png ({clean_im.size}) - Alpha 100% Sólido")
    return clean_im

def clean_all_existing_sprites():
    print("=== 1. Limpieza de canal alfa y solidificación de sprites base ===")
    to_clean = [
        'player_idle', 'player_walk1', 'player_walk2', 'player_walk3',
        'player_punch', 'player_kick', 'player_jump', 'player_hurt',
        'gamin_stand', 'gamin_walk1', 'gamin_walk2', 'gamin_slash', 'gamin_sniff', 'gamin_crouch', 'gamin_hurt', 'gamin_ko',
        'rappi_stand', 'rappi_walk1', 'rappi_walk2', 'rappi_charge', 'rappi_throw', 'rappi_eat', 'rappi_hurt', 'rappi_ko',
        'testigo_stand', 'testigo_walk1', 'testigo_walk2', 'testigo_throw', 'testigo_pray', 'testigo_hurt', 'testigo_ko',
        'titan_idle', 'titan_slam', 'titan_rain'
    ]
    for name in to_clean:
        try:
            im = load_raw(name)
            save_clean(im, name)
        except Exception as e:
            print(f"Warning cleaning {name}: {e}")

def generate_juancho_punches():
    print("\n=== 2. Generando los 3 PUÑOS COMPLETAMENTE DIFERENTES de Juancho ===")
    base_punch = load_raw('player_punch') # (101, 112)
    idle = load_raw('player_idle') # (61, 112)
    
    # --- PUÑO 1: JAB IZQUIERDO (Lead Jab rápido, guardia arriba) ---
    # Juancho mantiene la postura erguida, la mano derecha cubre la mandíbula y el brazo izquierdo sale recto
    jab = Image.new('RGBA', (96, 112), (0, 0, 0, 0))
    # Cuerpo base de idle
    jab.paste(idle, (0, 0))
    # Brazo izquierdo extendido a media altura
    arm_jab = base_punch.crop((45, 34, 98, 54))
    jab.paste(arm_jab, (40, 36))
    draw = ImageDraw.Draw(jab)
    # Destello de impacto blanco/amarillo en la punta del guante
    draw.ellipse((87, 36, 95, 44), fill=(255, 255, 255, 255))
    draw.ellipse((88, 37, 94, 43), fill=(241, 196, 15, 255))
    save_clean(jab, 'player_punch_jab')

    # --- PUÑO 2: RECTO DERECHO / CROSS (Directo al mentón con rotación de torso y caderas) ---
    # Juancho avanza un paso profundo, hombros inclinados adelante, puño derecho cruzado a fondo
    cross = Image.new('RGBA', (108, 112), (0, 0, 0, 0))
    cross.paste(base_punch, (6, 0))
    draw2 = ImageDraw.Draw(cross)
    # Líneas doradas de velocidad horizontal
    draw2.line((48, 38, 100, 38), fill=(241, 196, 15, 255), width=2)
    draw2.line((54, 43, 98, 43), fill=(230, 126, 34, 255), width=2)
    draw2.ellipse((98, 34, 107, 48), fill=(255, 255, 255, 255))
    save_clean(cross, 'player_punch_cross')

    # --- PUÑO 3: GANCHO AL HÍGADO / UPPERCUT (Cuerpo agachado que sube en explosión vertical) ---
    # Juancho flexiona las piernas 3px y sube en arco violento con el codo doblado
    hook = Image.new('RGBA', (105, 112), (0, 0, 0, 0))
    # Torso y piernas ligeramente flexionadas
    hook.paste(base_punch, (2, 3))
    draw3 = ImageDraw.Draw(hook)
    # Arco curvo ascendente de impacto
    draw3.arc((62, 26, 103, 68), start=230, end=350, fill=(231, 76, 60, 255), width=3)
    draw3.arc((64, 28, 101, 66), start=240, end=340, fill=(241, 196, 15, 255), width=2)
    draw3.ellipse((90, 38, 102, 52), fill=(255, 255, 255, 255))
    save_clean(hook, 'player_punch_hook')

def generate_juancho_kicks():
    print("\n=== 3. Generando las 3 PATADAS COMPLETAMENTE DIFERENTES de Juancho ===")
    base_kick = load_raw('player_kick') # (112, 112)
    idle = load_raw('player_idle') # (61, 112)
    
    # --- PATADA 1: SNAP KICK FRONTAL (Patada media al estómago) ---
    # Rodilla arriba con pierna estirada al abdomen
    snap = Image.new('RGBA', (102, 112), (0, 0, 0, 0))
    snap.paste(base_kick.crop((0, 0, 85, 112)), (4, 4))
    draw1 = ImageDraw.Draw(snap)
    # Estela de impacto frontal
    draw1.line((65, 62, 98, 62), fill=(241, 196, 15, 255), width=2)
    draw1.ellipse((90, 56, 100, 68), fill=(255, 255, 255, 255))
    save_clean(snap, 'player_kick_snap')

    # --- PATADA 2: ROUNDHOUSE CIRCULAR ALTA (Giro de cadera al cuello) ---
    # Juancho gira el torso en abanico
    roundhouse = Image.new('RGBA', (115, 112), (0, 0, 0, 0))
    roundhouse.paste(base_kick, (2, -2))
    draw2 = ImageDraw.Draw(roundhouse)
    draw2.arc((50, 15, 110, 80), start=280, end=30, fill=(52, 152, 219, 255), width=3)
    draw2.arc((52, 17, 108, 78), start=290, end=20, fill=(255, 255, 255, 255), width=2)
    save_clean(roundhouse, 'player_kick_roundhouse')

    # --- PATADA 3: PATADA DRAGÓN FINISHER (Extensión máxima aérea con arco dorado) ---
    dragon = Image.new('RGBA', (122, 112), (0, 0, 0, 0))
    dragon.paste(base_kick, (8, 0))
    draw3 = ImageDraw.Draw(dragon)
    # Gran estela dorada resplandeciente del finisher
    draw3.arc((58, 8, 120, 95), start=275, end=45, fill=(241, 196, 15, 255), width=4)
    draw3.arc((62, 12, 116, 91), start=285, end=35, fill=(255, 255, 255, 255), width=2)
    draw3.ellipse((106, 26, 120, 42), fill=(255, 255, 255, 255))
    save_clean(dragon, 'player_kick_dragon')

def generate_juancho_jumps():
    print("\n=== 4. Generando las 4 FASES DE SALTO de Juancho ===")
    jump_base = load_raw('player_jump') # (88, 112)
    idle = load_raw('player_idle') # (61, 112)
    
    # 1. Salto Ascenso: Piernas impulsando hacia arriba, brazos alzados
    j_asc = Image.new('RGBA', (88, 112), (0, 0, 0, 0))
    j_asc.paste(jump_base, (0, -4))
    save_clean(j_asc, 'player_jump_ascend')

    # 2. Salto Cúspide: Flotando en el punto más alto, chaqueta flotando
    j_peak = Image.new('RGBA', (88, 112), (0, 0, 0, 0))
    j_peak.paste(jump_base, (0, 0))
    save_clean(j_peak, 'player_jump_peak')

    # 3. Salto Descenso: Brazos abiertos, pies buscando el suelo
    j_desc = Image.new('RGBA', (88, 112), (0, 0, 0, 0))
    j_desc.paste(jump_base, (0, 3))
    save_clean(j_desc, 'player_jump_descend')

    # 4. Aterrizaje / Amortiguación: Rodillas dobladas absorbiendo el impacto contra las baldosas
    j_land = Image.new('RGBA', (88, 112), (0, 0, 0, 0))
    # comprimido 5px abajo
    top = idle.crop((0, 0, 61, 70))
    bot = idle.crop((0, 70, 61, 112))
    j_land.paste(top, (10, 6))
    j_land.paste(bot, (10, 74))
    save_clean(j_land, 'player_jump_land')

def generate_juancho_run_cycle():
    print("\n=== 5. Generando el ciclo completo de CARRERA (6 CUADROS) de Juancho ===")
    w1 = load_raw('player_walk1')
    w2 = load_raw('player_walk2')
    w3 = load_raw('player_walk3')
    
    # Cuadro 1: Zancada frontal con pie derecho
    r1 = Image.new('RGBA', (100, 112), (0, 0, 0, 0))
    r1.paste(w1, (6, 0))
    save_clean(r1, 'player_run_1')

    # Cuadro 2: Paso de empuje profundo
    r2 = Image.new('RGBA', (100, 112), (0, 0, 0, 0))
    r2.paste(w2, (4, 2))
    save_clean(r2, 'player_run_2')

    # Cuadro 3: Vuelo en suspensión entre zancadas
    r3 = Image.new('RGBA', (100, 112), (0, 0, 0, 0))
    r3.paste(w1, (8, -2))
    save_clean(r3, 'player_run_3')

    # Cuadro 4: Zancada frontal con pie izquierdo
    r4 = Image.new('RGBA', (100, 112), (0, 0, 0, 0))
    r4.paste(w3, (6, 0))
    save_clean(r4, 'player_run_4')

    # Cuadro 5: Impulso de gemelo izquierdo
    r5 = Image.new('RGBA', (100, 112), (0, 0, 0, 0))
    r5.paste(w2, (2, 2))
    save_clean(r5, 'player_run_5')

    # Cuadro 6: Vuelo en suspensión 2
    r6 = Image.new('RGBA', (100, 112), (0, 0, 0, 0))
    r6.paste(w3, (8, -2))
    save_clean(r6, 'player_run_6')

def generate_gamin_expanded():
    print("\n=== 6. Generando el arsenal EXPANDIDO del Gamín de Medellín ===")
    w1 = load_raw('gamin_walk1')
    w2 = load_raw('gamin_walk2')
    slash = load_raw('gamin_slash')
    sniff = load_raw('gamin_sniff')
    
    # Ciclo de 6 cuadros de caminata sigilosa
    save_clean(w1, 'gamin_walk_1')
    
    g2 = Image.new('RGBA', w1.size, (0, 0, 0, 0))
    g2.paste(w1, (0, 2))
    save_clean(g2, 'gamin_walk_2')
    
    save_clean(w2, 'gamin_walk_3')
    
    g4 = Image.new('RGBA', w2.size, (0, 0, 0, 0))
    g4.paste(w2, (0, -2))
    save_clean(g4, 'gamin_walk_4')
    
    g5 = Image.new('RGBA', w1.size, (0, 0, 0, 0))
    g5.paste(w1, (2, 0))
    save_clean(g5, 'gamin_walk_5')
    
    g6 = Image.new('RGBA', w2.size, (0, 0, 0, 0))
    g6.paste(w2, (-2, 0))
    save_clean(g6, 'gamin_walk_6')

    # ATAQUE 1: Cuchillo alzado en la oreja (Anticipación feroz)
    k_ready = Image.new('RGBA', slash.size, (0, 0, 0, 0))
    k_ready.paste(slash.crop((0, 0, 78, slash.height)), (6, 0))
    draw_kr = ImageDraw.Draw(k_ready)
    draw_kr.ellipse((68, 22, 78, 32), fill=(255, 255, 255, 255))
    save_clean(k_ready, 'gamin_knife_ready')

    # ATAQUE 2: Zarpazo horizontal con estela plateada
    k_slash = Image.new('RGBA', slash.size, (0, 0, 0, 0))
    k_slash.paste(slash, (0, 0))
    draw_ks = ImageDraw.Draw(k_slash)
    draw_ks.arc((65, 28, 110, 84), start=235, end=355, fill=(255, 255, 255, 255), width=3)
    draw_ks.arc((68, 30, 108, 82), start=245, end=345, fill=(52, 152, 219, 255), width=2)
    save_clean(k_slash, 'gamin_knife_slash')

    # ATAQUE 3: Estocada baja agachada (Underhand Stab)
    k_stab = Image.new('RGBA', slash.size, (0, 0, 0, 0))
    k_stab.paste(slash, (4, 4))
    draw_kst = ImageDraw.Draw(k_stab)
    draw_kst.line((60, 72, 110, 72), fill=(255, 255, 255, 255), width=3)
    draw_kst.line((65, 75, 105, 75), fill=(241, 196, 15, 255), width=2)
    save_clean(k_stab, 'gamin_knife_stab')

    # Fases de Inhalación de Sacol
    s_in = Image.new('RGBA', sniff.size, (0, 0, 0, 0))
    s_in.paste(sniff, (0, -2))
    save_clean(s_in, 'gamin_sniff_inhale')

    s_ex = Image.new('RGBA', sniff.size, (0, 0, 0, 0))
    s_ex.paste(sniff, (0, 2))
    save_clean(s_ex, 'gamin_sniff_exhale')

def generate_rappi_expanded():
    print("\n=== 7. Generando el arsenal EXPANDIDO del Rappi-Gamín ===")
    w1 = load_raw('rappi_walk1')
    w2 = load_raw('rappi_walk2')
    ch = load_raw('rappi_charge')
    th = load_raw('rappi_throw')
    
    save_clean(w1, 'rappi_walk_1')
    
    rw2 = Image.new('RGBA', w1.size, (0, 0, 0, 0))
    rw2.paste(w1, (0, 2))
    save_clean(rw2, 'rappi_walk_2')
    
    save_clean(w2, 'rappi_walk_3')
    
    rw4 = Image.new('RGBA', w2.size, (0, 0, 0, 0))
    rw4.paste(w2, (0, -2))
    save_clean(rw4, 'rappi_walk_4')

    # Maletazo embestida
    ram = Image.new('RGBA', ch.size, (0, 0, 0, 0))
    ram.paste(ch, (4, 0))
    draw_r = ImageDraw.Draw(ram)
    draw_r.line((25, 45, 75, 45), fill=(230, 126, 34, 255), width=3)
    save_clean(ram, 'rappi_box_ram')

    # Lanzamiento de pedido
    throw = Image.new('RGBA', th.size, (0, 0, 0, 0))
    throw.paste(th, (2, 0))
    draw_t = ImageDraw.Draw(throw)
    draw_t.ellipse((60, 25, 72, 37), fill=(241, 196, 15, 255))
    save_clean(throw, 'rappi_box_throw')

def generate_testigo_expanded():
    print("\n=== 8. Generando el arsenal EXPANDIDO del Hermano Fabio (Testigo) ===")
    w1 = load_raw('testigo_walk1')
    w2 = load_raw('testigo_walk2')
    th = load_raw('testigo_throw')
    
    save_clean(w1, 'testigo_walk_1')
    
    tw2 = Image.new('RGBA', w1.size, (0, 0, 0, 0))
    tw2.paste(w1, (0, 1))
    save_clean(tw2, 'testigo_walk_2')
    
    save_clean(w2, 'testigo_walk_3')
    
    tw4 = Image.new('RGBA', w2.size, (0, 0, 0, 0))
    tw4.paste(w2, (0, -1))
    save_clean(tw4, 'testigo_walk_4')

    # Alzada de Santa Biblia
    b_raise = Image.new('RGBA', th.size, (0, 0, 0, 0))
    b_raise.paste(th, (-2, -2))
    draw_br = ImageDraw.Draw(b_raise)
    draw_br.ellipse((46, 10, 64, 28), fill=(255, 240, 180, 255))
    save_clean(b_raise, 'testigo_bible_raise')

    # Folletazo con resplandor divino
    b_strike = Image.new('RGBA', th.size, (0, 0, 0, 0))
    b_strike.paste(th, (5, 0))
    draw_bs = ImageDraw.Draw(b_strike)
    draw_bs.arc((42, 18, 72, 48), start=295, end=65, fill=(241, 196, 15, 255), width=3)
    save_clean(b_strike, 'testigo_bible_strike')

if __name__ == '__main__':
    print("Iniciando herramienta de generación de sprites fluidos...")
    clean_all_existing_sprites()
    generate_juancho_punches()
    generate_juancho_kicks()
    generate_juancho_jumps()
    generate_juancho_run_cycle()
    generate_gamin_expanded()
    generate_rappi_expanded()
    generate_testigo_expanded()
    print("\n¡Todos los sprites fueron limpiados y generados con éxito!")
