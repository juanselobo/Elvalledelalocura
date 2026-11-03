# -*- coding: utf-8 -*-
import os
import sys
import time
from PIL import Image
from io import BytesIO
from google import genai

API_KEY = 'AIzaSyAwHtZmkhY33JXRbsVfYMPLy601QAnDEB0'
client = genai.Client(api_key=API_KEY)

ASSETS_DIR = r"D:\Desktop\Juegos\villa-aburra-game\assets"
os.makedirs(ASSETS_DIR, exist_ok=True)

MOMENTS = [
    {
        "id": "scene_soterrado_01_encuentro",
        "title": "Momento 1: Encuentro Inicial & Desconcierto",
        "prompt": (
            "16-bit Capcom CPS-3 arcade pixel art cutscene screen, 16:9 widescreen, styled like a 90s Street Fighter 3 / SNK Neo-Geo arcade cutscene with a subtle retro CRT monitor curved border and scanlines. "
            "Characters in the foreground: "
            "On the left, Juancho: young athletic Colombian Paisa man, clean-shaven face with absolutely NO mustache, NO beard, NO goatee. Wearing dark sunglasses, tan khaki backwards baseball cap, bright orange puffer jacket, backpack straps on chest. NO skateboard. He is standing at the edge of the water, startled and catching his breath, pointing in shock at the flooded highway. "
            "On the right, Agente Hincapié (Medellín Transit Police): wearing white peaked officer cap with gold badge, neon-yellow-green high-visibility reflective safety vest over dark blue police uniform, shoulder walkie-talkie. He stands with hands on his hips and a stern, demanding expression, interrogating Juancho: ('¡Buenas noches, joven! ¿Para dónde va con ese afán? ¿No ve el chicharrón que tenemos aquí montado?'). "
            "Background: flooded entrance of the Soterrado underpass in Medellín at dusk under heavy rain, murky brown water, submerged yellow taxis, stuck green Coometropol bus, industrial ceiling ventilation jet fans."
        )
    },
    {
        "id": "scene_soterrado_02_rata_incredulidad",
        "title": "Momento 2: Incredulidad de la Rata Mutante",
        "prompt": (
            "16-bit Capcom CPS-3 arcade pixel art cutscene screen, 16:9 widescreen, 90s retro arcade fighting game cutscene with CRT curved corners and scanlines. "
            "Characters in the foreground: "
            "On the left, Juancho: clean-shaven face (NO beard, NO mustache), dark sunglasses, tan backwards baseball cap, bright orange puffer jacket, backpack straps. NO skateboard. He is wildly gesturing with both hands wide apart, eyes wide behind his shades, comically exaggerating the colossal size of a giant sewer rat ('¡Una rata mutante gigante del tamaño de un bus Coometropol!'). "
            "On the right, Agente Hincapié (Medellín Transit Police): white peaked officer cap, high-vis neon yellow-green reflective vest over dark blue uniform. He is looking at Juancho with extreme skepticism and incredulity, one eyebrow cocked sky-high, tapping his temple with an exasperated smirk as if saying: ('¿Usted me cree pendejo o le dio por oler sacol con los del viaducto?'). "
            "Background: flooded Soterrado highway tunnel entrance in Medellín, muddy water, floating yellow taxi, stuck Coometropol bus, overhead industrial turbine fans."
        )
    },
    {
        "id": "scene_soterrado_03_fotocopiadora_facepalm",
        "title": "Momento 3: Confusión de la Fotocopiadora & Facepalm",
        "prompt": (
            "16-bit Capcom CPS-3 arcade pixel art cutscene screen, 16:9 widescreen, 90s Capcom arcade cutscene with subtle CRT monitor curvature and scanlines. "
            "Characters in the foreground: "
            "On the left, Juancho: clean-shaven (NO mustache, NO beard), dark sunglasses, backwards baseball cap, bright orange puffer jacket, backpack. NO skateboard. He is shrugging comically with an awkward goofy smile, hands held up innocently with palms up, a tiny arcade sweat drop near his temple, innocently asking where he can find an open copy shop to photocopy his ID enlarged to 150%. "
            "On the right, Agente Hincapié (Medellín Transit Police): white peaked cap, neon-yellow-green reflective safety vest over dark blue uniform. He is doing a dramatic, hilarious, epic FACEPALM! He has his palm slapped over his forehead and eyes in utter disbelief, exhaustion, and groaning misery: ('¿Una fotocopiadora ampliada al 150% en medio de un diluvio bíblico?!'). "
            "Background: flooded entrance of the Soterrado highway in Medellín at dusk, murky brown floodwaters, stranded cars, ventilation fans hanging from concrete ceiling."
        )
    },
    {
        "id": "scene_soterrado_04_inundacion_sarcasmo",
        "title": "Momento 4: Sarcasmo del Diluvio & Ingeniero de Esquina",
        "prompt": (
            "16-bit Capcom CPS-3 arcade pixel art cutscene screen, 16:9 widescreen, 90s Capcom arcade cutscene with retro CRT curved border. "
            "Characters in the foreground: "
            "On the left, Juancho: clean-shaven face (NO beard, NO mustache), dark sunglasses, backwards baseball cap, orange puffer jacket, backpack. NO skateboard. He is pointing sarcastically with a smirk at the flooded highway like a street engineer giving a critique: ('¡La obra del siglo decían! ¡Cae un sereno y esto parece piscina olímpica! ¿Y las motobombas de tres mil millones?'). "
            "On the right, Agente Hincapié (Medellín Transit Police): white peaked cap, neon-yellow-green reflective vest, dark blue uniform. He has his arms crossed over his chest, rolling his eyes with a sarcastic grimace and deadpan face: ('Ah claro, llegó el ingeniero de esquina a dar cátedra...'). "
            "Background: flooded Soterrado underpass in Medellín at dusk, deep murky brown water with ripples, submerged yellow taxi cab with hazard flashers, stuck bus, tunnel jet fans."
        )
    },
    {
        "id": "scene_soterrado_05_soborno_negociacion",
        "title": "Momento 5: Negociación del Soborno ('Pa la gaseosa')",
        "prompt": (
            "16-bit Capcom CPS-3 arcade pixel art cutscene screen, 16:9 widescreen, retro 90s Capcom arcade cutscene aesthetic with CRT bezel and scanlines. "
            "Characters in the foreground: "
            "On the left, Juancho: clean-shaven (NO mustache, NO beard), dark sunglasses, tan backwards cap, bright orange puffer jacket, backpack. NO skateboard. Leaning forward conspiratorially with a sly, knowing smirk, his hand slipping into his orange jacket pocket pulling out a banknote to negotiate: ('Hablemos en números, mi cabo... pa que me deje pasar'). "
            "On the right, Agente Hincapié (Medellín Transit Police): white peaked transit cap, neon yellow-green reflective vest over dark blue uniform. He has a sly, mischievous, greedy grin, rubbing his thumb and index finger together in the classic Colombian street gesture of 'platica / pa la gaseosa', glancing sideways out of the corner of his eye to make sure nobody is looking. "
            "Background: flooded Soterrado underpass in Medellín, murky waters, half-submerged taxis, Coometropol bus, overhead tunnel fans."
        )
    },
    {
        "id": "scene_soterrado_06_radio_panico",
        "title": "Momento 6: Alarma por Radio & Pánico Doña Gloria / Fico",
        "prompt": (
            "16-bit Capcom CPS-3 arcade pixel art cutscene screen, 16:9 widescreen, vibrant 90s arcade comic cutscene with retro CRT curved corners and scanlines. "
            "Characters in the foreground: "
            "On the left, Juancho: clean-shaven (NO beard, NO mustache), dark sunglasses, backwards cap, orange puffer jacket, backpack. Shocked and alarmed, mouth open in comic surprise, pointing towards the flooded tunnel. "
            "On the right, Agente Hincapié (Medellín Transit Police): white peaked cap, neon yellow-green reflective vest. The walkie-talkie radio on his shoulder is crackling with comic static sparks ('¡Doña Gloria amotinó el Coometropol con megáfono y Fico viene en cuatrimoto a transmitir en vivo!'). The officer has both hands on the sides of his head in hilarious cartoon panic, screaming with wide eyes: ('¡Ave María Purísima, se me armó el mierdero del siglo!'). "
            "Background: inside the flooded Soterrado underpass, in the distance on the roof of the green bus, a comical silhouette of Doña Gloria with a megaphone and flashing red and blue emergency lights."
        )
    },
    {
        "id": "scene_soterrado_07_alianza_parkour",
        "title": "Momento 7: Alianza Táctica & Salto Parkour",
        "prompt": (
            "16-bit Capcom CPS-3 arcade pixel art cutscene screen, 16:9 widescreen, triumphant 90s Capcom arcade cutscene with retro CRT frame and scanlines. "
            "Characters in the foreground: "
            "On the left, Juancho: clean-shaven (NO beard, NO mustache), dark sunglasses, backwards baseball cap, orange puffer jacket, backpack. ABSOLUTELY NO SKATEBOARD! He is in an athletic dynamic parkour runner ready pose, adjusting his sunglasses with a confident heroic smirk, ready to sprint and leap across car roofs like an urban ninja: ('¡Trato hecho! ¡Voy a salvar a la gente por los techos!'). "
            "On the right, Agente Hincapié (Medellín Transit Police): white peaked cap, neon yellow-green reflective vest over dark blue uniform. Smiling wide in relief and excitement, giving a solid, enthusiastic THUMBS-UP with one hand and pointing to the flooded car roofs with the other: ('¡Trato hecho socio! ¡Péguele al brinco pues, mijo!'). "
            "Background: flooded Soterrado tunnel in Medellín, car roofs aligned like stepping stones across murky water, golden reflections, spinning industrial ventilation jet fans."
        )
    }
]

def generate_all():
    print(f"=== INICIANDO GENERACIÓN DE LOS 7 MOMENTOS EMOCIONALES ===")
    print(f"Directorio de destino: {ASSETS_DIR}\n")
    
    for i, m in enumerate(MOMENTS, 1):
        filename = f"{m['id']}.png"
        out_path = os.path.join(ASSETS_DIR, filename)
        print(f"[{i}/7] Generando {m['title']} -> {filename}...")
        
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash-image',
                contents=m['prompt']
            )
            
            image_bytes = None
            for part in response.candidates[0].content.parts:
                if hasattr(part, 'inline_data') and part.inline_data:
                    image_bytes = part.inline_data.data
                    break
            
            if not image_bytes:
                print(f"  [ERROR] No se recibieron bytes de imagen para {filename}")
                continue
            
            # Abrir con PIL, redimensionar limpiamente a 640x360 arcade
            raw_im = Image.open(BytesIO(image_bytes)).convert('RGB')
            clean_im = raw_im.resize((640, 360), Image.Resampling.LANCZOS)
            clean_im.save(out_path, format='PNG', optimize=True)
            print(f"  [OK] Guardado exitosamente: {out_path} ({clean_im.size})\n")
            
            # Pequeña pausa de 2 segundos para evitar rate limits
            time.sleep(2)
            
        except Exception as e:
            print(f"  [ERROR] Falló la generación de {filename}: {e}\n")

if __name__ == '__main__':
    generate_all()
