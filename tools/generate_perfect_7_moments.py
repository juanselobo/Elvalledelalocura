# -*- coding: utf-8 -*-
import os
import time
from PIL import Image
from io import BytesIO
from google import genai

API_KEY = 'AIzaSyAwHtZmkhY33JXRbsVfYMPLy601QAnDEB0'
client = genai.Client(api_key=API_KEY)

ASSETS_DIR = r"D:\Desktop\Juegos\villa-aburra-game\assets"
os.makedirs(ASSETS_DIR, exist_ok=True)

# Master pristine base image (Momento 1) with NO dialog boxes and NO text
CLEAN_BASE_PATH = os.path.join(ASSETS_DIR, "clean_base_test.png")
ref_img = Image.open(CLEAN_BASE_PATH).convert('RGB')

MOMENTS = [
    {
        "id": "scene_soterrado_01_encuentro",
        "title": "Momento 1: Encuentro Inicial & Desconcierto",
        "is_clean_base": True
    },
    {
        "id": "scene_soterrado_02_rata_incredulidad",
        "title": "Momento 2: Incredulidad de la Rata Mutante",
        "is_test_m2": True
    },
    {
        "id": "scene_soterrado_03_fotocopiadora_facepalm",
        "title": "Momento 3: Confusión de la Fotocopiadora & Facepalm",
        "prompt": (
            "This reference image is the exact master frame of our 16-bit Capcom CPS-3 retro arcade cutscene. "
            "Keep the EXACT identical background (the flooded tunnel underpass, water, cars, bus, ceiling fans), camera angle, lighting, and CRT border. "
            "Animate ONLY the character poses in the foreground: "
            "1. Left character (Juancho in orange puffer jacket): He is shrugging comically with an awkward goofy smile, hands held up innocently with palms up. Exactly two arms only, natural anatomy. "
            "2. Right character (Transit Officer in green vest): He is doing a dramatic, hilarious, epic FACEPALM! He has his right palm slapped over his forehead and eyes in utter disbelief, exhaustion, and groaning misery, while his left hand rests on his duty belt holding his radio. Exactly two arms only, natural anatomy. "
            "3. STRICT NEGATIVE RULES: ABSOLUTELY NO TEXT. NO LETTERS, NO WORDS, NO SPEECH BUBBLES, NO DIALOGUE BOXES, NO SUBTITLES, NO CAPTIONS ANYWHERE. No ghost hands, no floating limbs, no extra arms. Exactly two arms per person. Pure pixel art illustration only."
        )
    },
    {
        "id": "scene_soterrado_04_inundacion_sarcasmo",
        "title": "Momento 4: Sarcasmo del Diluvio & Ingeniero de Esquina",
        "prompt": (
            "This reference image is the exact master frame of our 16-bit Capcom CPS-3 retro arcade cutscene. "
            "Keep the EXACT identical background (the flooded tunnel underpass, water, cars, bus, ceiling fans), camera angle, lighting, and CRT border. "
            "Animate ONLY the character poses in the foreground: "
            "1. Left character (Juancho in orange jacket): He is pointing sarcastically with his right index finger at the murky water with a smug mocking smirk, his left hand relaxed at his side. Exactly two arms only. "
            "2. Right character (Transit Officer in green vest): He has both arms firmly crossed over his chest, deadpan sarcastic unimpressed face, rolling his eyes in silence. Exactly two arms only, natural anatomy. "
            "3. STRICT NEGATIVE RULES: ABSOLUTELY NO TEXT. NO LETTERS, NO WORDS, NO SPEECH BUBBLES, NO DIALOGUE BOXES, NO SUBTITLES, NO CAPTIONS ANYWHERE. No ghost hands, no floating limbs, no extra arms. Pure pixel art illustration only."
        )
    },
    {
        "id": "scene_soterrado_05_soborno_negociacion",
        "title": "Momento 5: Negociación del Soborno ('Pa la gaseosa')",
        "prompt": (
            "This reference image is the exact master frame of our 16-bit Capcom CPS-3 retro arcade cutscene. "
            "Keep the EXACT identical background (the flooded tunnel underpass, water, cars, bus, ceiling fans), camera angle, lighting, and CRT border. "
            "Animate ONLY the character poses in the foreground: "
            "1. Left character (Juancho in orange jacket): Leaning slightly forward with a conspiratorial smirk, his right hand slipping into his orange jacket pocket pulling out green banknotes, his left hand relaxed. Exactly two arms only. "
            "2. Right character (Transit Officer in green vest): He has a sly, mischievous, greedy grin, his right hand rubbing his thumb and index finger together in the classic Colombian street gesture of money, looking sideways out of the corner of his eye, his left hand on his belt. Exactly two arms only, natural anatomy. "
            "3. STRICT NEGATIVE RULES: ABSOLUTELY NO TEXT. NO LETTERS, NO WORDS, NO SPEECH BUBBLES, NO DIALOGUE BOXES, NO SUBTITLES, NO CAPTIONS ANYWHERE. No ghost hands, no floating limbs, no extra arms. Pure pixel art illustration only."
        )
    },
    {
        "id": "scene_soterrado_06_radio_panico",
        "title": "Momento 6: Alarma por Radio & Pánico Doña Gloria / Fico",
        "prompt": (
            "This reference image is the exact master frame of our 16-bit Capcom CPS-3 retro arcade cutscene. "
            "Keep the EXACT identical background (the flooded tunnel underpass, water, cars, bus, ceiling fans), camera angle, lighting, and CRT border. "
            "Animate ONLY the character poses in the foreground: "
            "1. Left character (Juancho in orange jacket): Startled and alarmed, mouth open in comic surprise, hands slightly raised in shock, looking towards the tunnel. Exactly two arms only. "
            "2. Right character (Transit Officer in green vest): In hilarious cartoon panic, he has BOTH hands clutched on the sides of his head/officer cap, mouth open in a wide terrified scream, eyes wide with alarm. His shoulder radio has a subtle comic lightning spark. Exactly two arms only, natural anatomy. "
            "3. STRICT NEGATIVE RULES: ABSOLUTELY NO TEXT. NO LETTERS, NO WORDS, NO SPEECH BUBBLES, NO DIALOGUE BOXES, NO SUBTITLES, NO CAPTIONS ANYWHERE. No ghost hands, no floating limbs, no extra arms. Pure pixel art illustration only."
        )
    },
    {
        "id": "scene_soterrado_07_alianza_parkour",
        "title": "Momento 7: Alianza Táctica & Salto Parkour",
        "prompt": (
            "This reference image is the exact master frame of our 16-bit Capcom CPS-3 retro arcade cutscene. "
            "Keep the EXACT identical background (the flooded tunnel underpass, water, cars, bus, ceiling fans), camera angle, lighting, and CRT border. "
            "Animate ONLY the character poses in the foreground: "
            "1. Left character (Juancho in orange jacket): In an athletic dynamic parkour runner ready stance, using his right hand to push up his dark sunglasses with a confident heroic smirk, ready to sprint across car roofs. Exactly two arms only. "
            "2. Right character (Transit Officer in green vest): Smiling broadly in camaraderie and relief, giving an enthusiastic, clear THUMBS-UP with his right hand, while his left hand rests on his belt. Exactly two arms only, natural anatomy. "
            "3. STRICT NEGATIVE RULES: ABSOLUTELY NO TEXT. NO LETTERS, NO WORDS, NO SPEECH BUBBLES, NO DIALOGUE BOXES, NO SUBTITLES, NO CAPTIONS ANYWHERE. No ghost hands, no floating limbs, no extra arms. Pure pixel art illustration only."
        )
    }
]

def generate_perfect():
    print("=== INICIANDO GENERACIÓN LIMPIA SIN TEXTOS NI ARTEFACTOS ===\n")
    
    for i, m in enumerate(MOMENTS, 1):
        filename = f"{m['id']}.png"
        out_path = os.path.join(ASSETS_DIR, filename)
        print(f"[{i}/7] Procesando {m['title']} -> {filename}...")
        
        if m.get('is_clean_base'):
            ref_img.resize((640, 360), Image.Resampling.LANCZOS).save(out_path, format='PNG', optimize=True)
            print(f"  [OK] Guardado Momento 1 limpio: {out_path}\n")
            continue
            
        if m.get('is_test_m2'):
            test_m2 = Image.open(os.path.join(ASSETS_DIR, "test_m2.png")).convert('RGB')
            test_m2.resize((640, 360), Image.Resampling.LANCZOS).save(out_path, format='PNG', optimize=True)
            print(f"  [OK] Guardado Momento 2 limpio: {out_path}\n")
            continue
        
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash-image',
                contents=[ref_img, m['prompt']]
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
            clean_640 = gen_im.resize((640, 360), Image.Resampling.LANCZOS)
            clean_640.save(out_path, format='PNG', optimize=True)
            print(f"  [OK] Generado limpiamente: {out_path} ({clean_640.size})\n")
            
            time.sleep(2)
            
        except Exception as e:
            print(f"  [ERROR] Falló la generación de {filename}: {e}\n")

if __name__ == '__main__':
    generate_perfect()
