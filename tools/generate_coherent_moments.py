# -*- coding: utf-8 -*-
import os
import time
from PIL import Image, ImageDraw, ImageFilter
from io import BytesIO
from google import genai

API_KEY = 'AIzaSyAwHtZmkhY33JXRbsVfYMPLy601QAnDEB0'
client = genai.Client(api_key=API_KEY)

ASSETS_DIR = r"D:\Desktop\Juegos\villa-aburra-game\assets"
os.makedirs(ASSETS_DIR, exist_ok=True)

# 1. Base reference image (the authentic original Level 4 cutscene)
BASE_PATH = os.path.join(ASSETS_DIR, "scene_soterrado_dialogue.png")
base_img_orig = Image.open(BASE_PATH).convert('RGB')
base_img_640 = base_img_orig.resize((640, 360), Image.Resampling.LANCZOS)

# Soft feather mask for the central background (where moving ambient sprites live)
# Center & upper tunnel background: x from 205 to 435, y from 0 to 215
feather_mask = Image.new('L', (640, 360), 0)
draw_mask = ImageDraw.Draw(feather_mask)
draw_mask.rectangle([205, 0, 435, 215], fill=255)
blurred_mask = feather_mask.filter(ImageFilter.GaussianBlur(10))

MOMENTS = [
    {
        "id": "scene_soterrado_01_encuentro",
        "title": "Momento 1: Encuentro Inicial & Desconcierto",
        "is_base": True
    },
    {
        "id": "scene_soterrado_02_rata_incredulidad",
        "title": "Momento 2: Incredulidad de la Rata Mutante",
        "prompt": (
            "This image is the exact reference frame of our 16-bit Capcom CPS-3 retro arcade cutscene. "
            "You MUST keep the exact identical background, perspective, camera framing, CRT border, flooded water, bus, taxi, and lighting. "
            "Animate ONLY the foreground characters for this dialogue moment: "
            "1. On the left, Juancho (man in orange puffer jacket, backwards tan cap, dark sunglasses, clean-shaven face with NO facial hair) is wildly gesturing with both arms wide apart, eyes wide behind his glasses, comically exaggerating the colossal size of a giant mutant sewer rat ('¡Una rata mutante gigante del tamaño de un bus!'). "
            "2. On the right, Agente Hincapié (transit police in neon green vest and white peaked cap) is looking at Juancho with hilarious skepticism, one eyebrow cocked high, tapping his temple with an exasperated smirk as if saying: ('¿Usted me cree pendejo o le dio por oler sacol?'). "
            "Keep the exact same pixel art style, character anatomy, and clothing so it looks like an authentic animation frame of the reference image."
        )
    },
    {
        "id": "scene_soterrado_03_fotocopiadora_facepalm",
        "title": "Momento 3: Confusión de la Fotocopiadora & Facepalm",
        "prompt": (
            "This image is the exact reference frame of our 16-bit Capcom CPS-3 retro arcade cutscene. "
            "You MUST keep the exact identical background, perspective, camera framing, CRT border, flooded water, bus, taxi, and lighting. "
            "Animate ONLY the foreground characters for this dialogue moment: "
            "1. On the left, Juancho (orange puffer jacket, backwards cap, dark sunglasses, clean-shaven face) is shrugging comically with an awkward goofy smile, hands held up innocently with palms up, a tiny anime sweat drop near his temple, innocently asking where he can find an open copy shop in the middle of a flood. "
            "2. On the right, Agente Hincapié (transit police in neon green vest and white peaked cap) is doing a dramatic, hilarious, epic FACEPALM! He has his palm slapped over his forehead and eyes in utter disbelief, exhaustion, and groaning misery: ('¿Una fotocopiadora ampliada al 150% en medio del fin del mundo?!'). "
            "Keep the exact same pixel art style, character anatomy, and clothing so it looks like an authentic animation frame of the reference image."
        )
    },
    {
        "id": "scene_soterrado_04_inundacion_sarcasmo",
        "title": "Momento 4: Sarcasmo del Diluvio & Ingeniero de Esquina",
        "prompt": (
            "This image is the exact reference frame of our 16-bit Capcom CPS-3 retro arcade cutscene. "
            "You MUST keep the exact identical background, perspective, camera framing, CRT border, flooded water, bus, taxi, and lighting. "
            "Animate ONLY the foreground characters for this dialogue moment: "
            "1. On the left, Juancho (orange puffer jacket, backwards cap, dark sunglasses, clean-shaven face) is pointing sarcastically with a smug smirk at the murky water like a street critic: ('¡La obra del siglo decían! ¡Cae un sereno y esto parece piscina olímpica!'). "
            "2. On the right, Agente Hincapié (transit police in neon green vest and white peaked cap) has his arms crossed over his chest, rolling his eyes with a deadpan sarcastic grimace: ('Ah claro, llegó el ingeniero de esquina a dar cátedra...'). "
            "Keep the exact same pixel art style, character anatomy, and clothing so it looks like an authentic animation frame of the reference image."
        )
    },
    {
        "id": "scene_soterrado_05_soborno_negociacion",
        "title": "Momento 5: Negociación del Soborno ('Pa la gaseosa')",
        "prompt": (
            "This image is the exact reference frame of our 16-bit Capcom CPS-3 retro arcade cutscene. "
            "You MUST keep the exact identical background, perspective, camera framing, CRT border, flooded water, bus, taxi, and lighting. "
            "Animate ONLY the foreground characters for this dialogue moment: "
            "1. On the left, Juancho (orange puffer jacket, backwards cap, dark sunglasses, clean-shaven face) is leaning forward conspiratorially with a sly smirk, his hand slipping into his orange jacket pocket pulling out money to negotiate: ('Hablemos en números, mi cabo...'). "
            "2. On the right, Agente Hincapié (transit police in neon green vest and white peaked cap) has a mischievous greedy grin, rubbing his thumb and index finger together in the classic Colombian street gesture of 'platica / pa la gaseosa', glancing sideways out of the corner of his eye to make sure nobody is looking. "
            "Keep the exact same pixel art style, character anatomy, and clothing so it looks like an authentic animation frame of the reference image."
        )
    },
    {
        "id": "scene_soterrado_06_radio_panico",
        "title": "Momento 6: Alarma por Radio & Pánico Doña Gloria / Fico",
        "prompt": (
            "This image is the exact reference frame of our 16-bit Capcom CPS-3 retro arcade cutscene. "
            "You MUST keep the exact identical background, perspective, camera framing, CRT border, flooded water, bus, taxi, and lighting. "
            "Animate ONLY the foreground characters for this dialogue moment: "
            "1. On the right, Agente Hincapié's shoulder walkie-talkie radio is crackling with comic static sparks ('¡Doña Gloria amotinó el Coometropol con megáfono y Fico viene en cuatrimoto!'). The police officer has both hands on the sides of his head in hilarious cartoon panic, screaming with mouth wide open: ('¡Ave María Purísima, se me armó el mierdero del siglo!'). "
            "2. On the left, Juancho (orange puffer jacket, dark sunglasses, clean-shaven) looks startled and alarmed, mouth open in comic shock pointing towards the tunnel. "
            "Keep the exact same pixel art style, character anatomy, and clothing so it looks like an authentic animation frame of the reference image."
        )
    },
    {
        "id": "scene_soterrado_07_alianza_parkour",
        "title": "Momento 7: Alianza Táctica & Salto Parkour",
        "prompt": (
            "This image is the exact reference frame of our 16-bit Capcom CPS-3 retro arcade cutscene. "
            "You MUST keep the exact identical background, perspective, camera framing, CRT border, flooded water, bus, taxi, and lighting. "
            "Animate ONLY the foreground characters for this dialogue moment: "
            "1. On the left, Juancho (orange puffer jacket, backwards cap, dark sunglasses, clean-shaven face) is in an athletic dynamic parkour runner stance, pushing up his sunglasses with a confident heroic smirk, ready to sprint across car roofs: ('¡Trato hecho! ¡Voy a salvar a la gente por los techos!'). "
            "2. On the right, Agente Hincapié (transit police in neon green vest and white peaked cap) is smiling wide in relief, giving an enthusiastic thumbs-up with one hand and pointing to the flooded car roofs with the other: ('¡Trato hecho socio! ¡Péguele al brinco pues, mijo!'). "
            "Keep the exact same pixel art style, character anatomy, and clothing so it looks like an authentic animation frame of the reference image."
        )
    }
]

def generate_coherent_moments():
    print("=== INICIANDO GENERACIÓN COHERENTE BASADA EN SCENE_SOTERRADO_DIALOGUE.PNG ===\n")
    
    for i, m in enumerate(MOMENTS, 1):
        filename = f"{m['id']}.png"
        out_path = os.path.join(ASSETS_DIR, filename)
        print(f"[{i}/7] Procesando {m['title']} -> {filename}...")
        
        if m.get('is_base'):
            # Momento 1 es exactamente la imagen base oficial en 640x360
            base_img_640.save(out_path, format='PNG', optimize=True)
            print(f"  [OK] Guardado como imagen base: {out_path}\n")
            continue
        
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash-image',
                contents=[base_img_orig, m['prompt']]
            )
            
            image_bytes = None
            for part in response.candidates[0].content.parts:
                if hasattr(part, 'inline_data') and part.inline_data:
                    image_bytes = part.inline_data.data
                    break
            
            if not image_bytes:
                print(f"  [ERROR] No se recibieron bytes de imagen para {filename}")
                continue
            
            gen_im = Image.open(BytesIO(image_bytes)).convert('RGB')
            gen_640 = gen_im.resize((640, 360), Image.Resampling.LANCZOS)
            
            # Componer el fondo central 100% idéntico para alinear perfectamente los sprites ambientales
            final_composite = Image.composite(base_img_640, gen_640, blurred_mask)
            final_composite.save(out_path, format='PNG', optimize=True)
            print(f"  [OK] Generado y compuesto perfectamente: {out_path} ({final_composite.size})\n")
            
            time.sleep(2)
            
        except Exception as e:
            print(f"  [ERROR] Falló la generación de {filename}: {e}\n")

if __name__ == '__main__':
    generate_coherent_moments()
