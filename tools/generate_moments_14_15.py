# -*- coding: utf-8 -*-
import os
from PIL import Image
from io import BytesIO
from google import genai

API_KEY = 'AIzaSyAwHtZmkhY33JXRbsVfYMPLy601QAnDEB0'
client = genai.Client(api_key=API_KEY)
ASSETS_DIR = r"D:\Desktop\Juegos\villa-aburra-game\assets"
BASE_PATH = os.path.join(ASSETS_DIR, "scene_soterrado_01_encuentro.png")
base_img = Image.open(BASE_PATH).convert('RGB')

prompt_14 = (
    "This reference image is the exact master frame of our 16-bit Capcom CPS-3 retro arcade cutscene. "
    "Keep the EXACT identical background (the flooded tunnel underpass, murky brown water, submerged yellow taxis, bus, ceiling exhaust fans), CRT curved monitor bezel, lighting, colors, and 16-bit pixel art style completely identical. "
    "Animate ONLY the character poses and expressions in the foreground: "
    "1. Left character (Juancho in bright orange puffer jacket, dark sunglasses, backwards baseball cap, backpack): Backing away nervously with both hands raised open in comical surrender and pacifying gesture, sweat drop on temple, mouth open in an apologetic grimace. Exactly two arms only, natural anatomy. "
    "2. Right character (Transit Officer in green reflective vest and white police peaked cap): Face flushed red with comic exaggerated rage and indignation, furiously pointing an accusing index finger straight at Juancho with his right hand, while holding his shoulder walkie-talkie radio to his mouth with his left hand, yelling orders to call the ESMAD riot water cannon. Red alert sparks near his radio. Exactly two arms only, natural anatomy. "
    "3. STRICT NEGATIVE RULES: ABSOLUTELY NO TEXT. NO WORDS, NO LETTERS, NO NUMBERS, NO SPEECH BUBBLES, NO DIALOGUE BOXES, NO SUBTITLES, NO CAPTIONS ANYWHERE. No extra arms, no ghost limbs. Exactly two arms per character. Pure pixel art illustration only."
)

prompt_15 = (
    "This reference image is the exact master frame of our 16-bit Capcom CPS-3 retro arcade cutscene. "
    "Keep the EXACT identical background (the flooded tunnel underpass, murky brown water, submerged yellow taxis, bus, ceiling exhaust fans), CRT curved monitor bezel, lighting, colors, and 16-bit pixel art style completely identical. "
    "Animate ONLY the character poses and expressions in the foreground: "
    "1. Left character (Juancho in bright orange puffer jacket, dark sunglasses, backwards baseball cap, backpack): Leaning forward slightly, looking determined and focused, one hand on his chin in an attentive tactical pose, carefully analyzing the flooded tunnel and vehicle roofs in front of him. Exactly two arms only, natural anatomy. "
    "2. Right character (Transit Officer in green reflective vest and white police peaked cap): In a commanding tactical officer pose, extending his right arm to point straight forward into the 3 lanes across the flooded highway tunnel, explaining the route with a serious, focused, authoritative expression, his left hand on his belt. Exactly two arms only, natural anatomy. "
    "3. STRICT NEGATIVE RULES: ABSOLUTELY NO TEXT. NO WORDS, NO LETTERS, NO NUMBERS, NO SPEECH BUBBLES, NO DIALOGUE BOXES, NO SUBTITLES, NO CAPTIONS ANYWHERE. No extra arms, no ghost limbs. Exactly two arms per character. Pure pixel art illustration only."
)

def run():
    # Momento 14
    print("Generando Momento 14 (Furia Policial & Tanqueta)...")
    resp14 = client.models.generate_content(
        model='gemini-2.5-flash-image',
        contents=[base_img, prompt_14]
    )
    b14 = None
    for part in resp14.candidates[0].content.parts:
        if hasattr(part, 'inline_data') and part.inline_data:
            b14 = part.inline_data.data
            break
    if b14:
        im14 = Image.open(BytesIO(b14)).convert('RGB')
        out14 = im14.resize((640, 360), Image.Resampling.LANCZOS)
        p14 = os.path.join(ASSETS_DIR, 'scene_soterrado_14_furia_policial.png')
        out14.save(p14, format='PNG', optimize=True)
        print("SUCCESS 14:", p14, out14.size)
    else:
        print("ERROR: No image bytes for 14")

    # Momento 15
    print("\nGenerando Momento 15 (Briefing Táctico de los 3 Carriles)...")
    resp15 = client.models.generate_content(
        model='gemini-2.5-flash-image',
        contents=[base_img, prompt_15]
    )
    b15 = None
    for part in resp15.candidates[0].content.parts:
        if hasattr(part, 'inline_data') and part.inline_data:
            b15 = part.inline_data.data
            break
    if b15:
        im15 = Image.open(BytesIO(b15)).convert('RGB')
        out15 = im15.resize((640, 360), Image.Resampling.LANCZOS)
        p15 = os.path.join(ASSETS_DIR, 'scene_soterrado_15_briefing_tactico.png')
        out15.save(p15, format='PNG', optimize=True)
        print("SUCCESS 15:", p15, out15.size)
    else:
        print("ERROR: No image bytes for 15")

if __name__ == '__main__':
    run()
