# -*- coding: utf-8 -*-
import os
import time
from PIL import Image
from io import BytesIO
from google import genai

API_KEY = 'AIzaSyAwHtZmkhY33JXRbsVfYMPLy601QAnDEB0'
client = genai.Client(api_key=API_KEY)

ASSETS_DIR = r"D:\Desktop\Juegos\villa-aburra-game\assets"
BASE_IMG_PATH = os.path.join(ASSETS_DIR, "scene_soterrado_02_rata_incredulidad.png")
base_image = Image.open(BASE_IMG_PATH)

MOMENTS_SPECS = [
    {
        "id": "scene_soterrado_08_minorista_duda",
        "title": "Momento 8: Duda de La Minorista (Nodo N2)",
        "prompt": (
            "Based directly on this image: keep the EXACT same background, exact same flooded tunnel, vehicles, lighting, CRT monitor border, and 16-bit Capcom arcade pixel art style completely identical. "
            "Modify only the character poses to look like an animation frame: "
            "On the right, Agente Hincapié is rubbing his chin thoughtfully with a puzzled, wondering expression, looking down slightly as if recalling a rumor, while pointing to the flooded water with his other hand. "
            "On the left, Juancho has green acid slime on his orange jacket and is pointing back over his shoulder towards the tunnel exit with a relieved expression that the officer might believe him. "
            "CRITICAL: ABSOLUTELY NO TEXT, NO WORDS, NO LETTERS, NO SPEECH BUBBLES, NO DIALOGUE BOXES anywhere in the image. Pure game art illustration only."
        )
    },
    {
        "id": "scene_soterrado_09_la33_taxistas",
        "title": "Momento 9: Anécdota de La 33 & Taxistas (Nodo N4)",
        "prompt": (
            "Based directly on this image: keep the EXACT same background, tunnel, vehicles, lighting, CRT monitor border, and 16-bit Capcom arcade pixel art style completely identical. "
            "Modify only the character poses to look like an animation frame: "
            "On the right, Agente Hincapié has his right hand raised with an open palm in a dismissive, exasperated gesture as if complaining about bad traffic, mouth open speaking animatedly. "
            "On the left, Juancho is shrugging awkwardly with palms slightly out, looking towards the officer. "
            "CRITICAL: ABSOLUTELY NO TEXT, NO WORDS, NO LETTERS, NO SPEECH BUBBLES, NO DIALOGUE BOXES anywhere in the image. Pure game art illustration only."
        )
    },
    {
        "id": "scene_soterrado_10_requisa_bolsillos",
        "title": "Momento 10: Buscando en los Bolsillos (Nodo N_SOBORNO_1)",
        "prompt": (
            "Based directly on this image: keep the EXACT same background, tunnel, vehicles, lighting, CRT monitor border, and 16-bit Capcom arcade pixel art style completely identical. "
            "Modify only the character poses to look like an animation frame: "
            "On the right, Agente Hincapié has a sly, greedy grin, rubbing his thumb and fingers together in the classic money gesture, tilting his head slightly. "
            "On the left, Juancho has both hands searching his pockets, pulling the white pocket linings out of his jeans to show they are empty with a sheepish, funny expression. "
            "CRITICAL: ABSOLUTELY NO TEXT, NO WORDS, NO LETTERS, NO SPEECH BUBBLES, NO DIALOGUE BOXES anywhere in the image. Pure game art illustration only."
        )
    },
    {
        "id": "scene_soterrado_11_panico_nequi",
        "title": "Momento 11: Pánico a Nequi (Nodo N_SOBORNO_NEQUI)",
        "prompt": (
            "Based directly on this image: keep the EXACT same background, tunnel, vehicles, lighting, CRT monitor border, and 16-bit Capcom arcade pixel art style completely identical. "
            "Modify only the character poses to look like an animation frame: "
            "On the left, Juancho is holding out a sleek black smartphone in his hand showing a glowing purple screen (with NO readable text). "
            "On the right, Agente Hincapié is recoiling in dramatic cartoon panic with wide open eyes and an alarmed shouting mouth, backing away from the phone as if it were a bomb, one hand reaching down to unholster a small black belt device. "
            "CRITICAL: ABSOLUTELY NO TEXT, NO WORDS, NO LETTERS, NO SPEECH BUBBLES, NO DIALOGUE BOXES anywhere in the image. Pure game art illustration only."
        )
    },
    {
        "id": "scene_soterrado_12_billete_cincuenta",
        "title": "Momento 12: Billete de Cincuenta (Nodo N_SOBORNO_ALTO)",
        "prompt": (
            "Based directly on this image: keep the EXACT same background, tunnel, vehicles, lighting, CRT monitor border, and 16-bit Capcom arcade pixel art style completely identical. "
            "Modify only the character poses to look like an animation frame: "
            "On the left, Juancho is discreetly holding out a purple 50,000 Colombian peso bill between two fingers with a subtle sly smile. "
            "On the right, Agente Hincapié is glancing sideways cautiously out of the corner of his eye to make sure nobody is looking, slipping the purple bill into his neon vest chest pocket with a satisfied grin. "
            "CRITICAL: ABSOLUTELY NO TEXT, NO WORDS, NO LETTERS, NO SPEECH BUBBLES, NO DIALOGUE BOXES anywhere in the image. Pure game art illustration only."
        )
    },
    {
        "id": "scene_soterrado_13_influencer_grabar",
        "title": "Momento 13: Influencer de Semáforo (Nodo N_GRABAR)",
        "prompt": (
            "Based directly on this image: keep the EXACT same background, tunnel, vehicles, lighting, CRT monitor border, and 16-bit Capcom arcade pixel art style completely identical. "
            "Modify only the character poses to look like an animation frame: "
            "On the left, Juancho is holding up a smartphone facing forward as if recording video with camera flash on, looking defiant. "
            "On the right, Agente Hincapié stands tall with folded arms, raising one eyebrow with a smug, mocking smirk, completely unfazed by being filmed. "
            "CRITICAL: ABSOLUTELY NO TEXT, NO WORDS, NO LETTERS, NO SPEECH BUBBLES, NO DIALOGUE BOXES anywhere in the image. Pure game art illustration only."
        )
    },
    {
        "id": "scene_soterrado_14_furia_policial",
        "title": "Momento 14: Furia Policial & Tanqueta (Nodo N_TOREAR)",
        "prompt": (
            "Based directly on this image: keep the EXACT same background, tunnel, vehicles, lighting, CRT monitor border, and 16-bit Capcom arcade pixel art style completely identical. "
            "Modify only the character poses to look like an animation frame: "
            "On the right, Agente Hincapié has his face red with comical exaggerated rage, furiously pointing an accusing finger directly at Juancho, while holding his shoulder walkie-talkie to his mouth shouting orders. "
            "On the left, Juancho is recoiling backwards in surprise with both hands up defensively and an awkward sweat-drop on his forehead. "
            "CRITICAL: ABSOLUTELY NO TEXT, NO WORDS, NO LETTERS, NO SPEECH BUBBLES, NO DIALOGUE BOXES anywhere in the image. Pure game art illustration only."
        )
    },
    {
        "id": "scene_soterrado_15_briefing_tactico",
        "title": "Momento 15: Briefing Táctico de los 3 Carriles (Nodo N8B_TACTICA)",
        "prompt": (
            "Based directly on this image: keep the EXACT same background, tunnel, vehicles, lighting, CRT monitor border, and 16-bit Capcom arcade pixel art style completely identical. "
            "Modify only the character poses to look like an animation frame: "
            "On the right, Agente Hincapié is in a tactical officer pose, extending his arm and pointing straight down the flooded highway lanes, explaining the route with a focused commanding expression. "
            "On the left, Juancho is leaning forward slightly with one hand on his chin, intently analyzing the flooded car roofs in front of them with determined focus. "
            "CRITICAL: ABSOLUTELY NO TEXT, NO WORDS, NO LETTERS, NO SPEECH BUBBLES, NO DIALOGUE BOXES anywhere in the image. Pure game art illustration only."
        )
    }
]

def generate_multimodal():
    print("=== GENERACIÓN MULTIMODAL DE ESCENAS (ANIMATION FRAMES SIN TEXTO) ===")
    for i, m in enumerate(MOMENTS_SPECS, 1):
        filename = f"{m['id']}.png"
        out_path = os.path.join(ASSETS_DIR, filename)
        print(f"[{i}/{len(MOMENTS_SPECS)}] Generando {m['title']} -> {filename}...")
        
        try:
            res = client.models.generate_content(
                model='gemini-2.5-flash-image',
                contents=[base_image, m['prompt']]
            )
            
            image_bytes = None
            if res.candidates and res.candidates[0].content and res.candidates[0].content.parts:
                for part in res.candidates[0].content.parts:
                    if hasattr(part, 'inline_data') and part.inline_data:
                        image_bytes = part.inline_data.data
                        break
            
            if not image_bytes:
                print(f"  [ERROR] No se recibieron bytes de imagen para {filename}")
                continue
            
            im = Image.open(BytesIO(image_bytes)).convert('RGB').resize((640, 360), Image.Resampling.LANCZOS)
            im.save(out_path, format='PNG', optimize=True)
            print(f"  [OK] Guardado exitosamente: {out_path} ({im.size})")
            time.sleep(2)
        except Exception as e:
            print(f"  [ERROR] Excepción: {e}")

if __name__ == '__main__':
    generate_multimodal()
