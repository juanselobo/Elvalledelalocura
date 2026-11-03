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

EXTENDED_MOMENTS = [
    {
        "id": "scene_soterrado_08_minorista_duda",
        "title": "Momento 8: Duda de La Minorista & Bulto Desaparecido (Nodo N2)",
        "prompt": (
            "16-bit Capcom CPS-3 arcade pixel art cutscene screen, 16:9 widescreen, 90s Street Fighter 3 / SNK Neo-Geo arcade cutscene style with retro CRT curved monitor bezel and subtle scanlines. "
            "Characters in the foreground: "
            "On the left, Juancho: young athletic Colombian Paisa man, clean-shaven face (NO mustache, NO beard), dark sunglasses, tan khaki backwards cap, bright orange puffer jacket with vibrant glowing green rat acid slime splatters dripping on his sleeves and jacket, backpack straps. NO skateboard. He is pointing backwards towards where the giant rat attacked, relieved that the officer might believe him. "
            "On the right, Agente Hincapié (Medellín Transit Police): white peaked cap, neon-yellow-green reflective safety vest over dark blue police uniform. He is stroking his chin thoughtfully with a puzzled, wondering expression, recalling police radio rumors: ('Ave María... ¿Usted sabe que por radio dijeron que en La Minorista se desapareció un bulto de concentrado?... Bueno, supongamos que le creo'). Pointing with his other hand to the flooded tunnel where yellow taxis are submerged. "
            "Background: flooded entrance of the Soterrado underpass in Medellín at dusk under heavy rain, murky brown water, submerged yellow taxis with hazard lights, stuck green Coometropol bus, industrial ceiling ventilation fans."
        )
    },
    {
        "id": "scene_soterrado_09_la33_taxistas",
        "title": "Momento 9: Anécdota de La 33 & Taxistas Atrapados (Nodo N4)",
        "prompt": (
            "16-bit Capcom CPS-3 arcade pixel art cutscene screen, 16:9 widescreen, 90s retro arcade comic cutscene with CRT curved corners and scanlines. "
            "Characters in the foreground: "
            "On the left, Juancho: clean-shaven face (NO beard, NO mustache), dark sunglasses, backwards baseball cap, orange puffer jacket, backpack. NO skateboard. He is listening while looking towards the flooded tunnel with an awkward shrug. "
            "On the right, Agente Hincapié (Medellín Transit Police): white peaked cap, high-vis neon yellow-green reflective vest over dark blue uniform. Waving his hand dismissively in comic exasperation, venting about traffic: ('¡Eche! No me mente la 33 que ayer me tocó hacer ronda por allá y eso estaba más lleno que misa de Padre Marianito!'). He gestures towards the floodwaters where distressed stranded taxi drivers are waving from the car roofs. "
            "Background: flooded Soterrado highway tunnel entrance in Medellín, brown floodwaters, stranded yellow taxis, green bus, industrial turbine fans."
        )
    },
    {
        "id": "scene_soterrado_10_requisa_bolsillos",
        "title": "Momento 10: Buscando en los Bolsillos Pa La Colaboración (Nodo N_SOBORNO_1)",
        "prompt": (
            "16-bit Capcom CPS-3 arcade pixel art cutscene screen, 16:9 widescreen, 90s Capcom arcade cutscene with retro CRT curved bezel and scanlines. "
            "Characters in the foreground: "
            "On the left, Juancho: clean-shaven face (NO beard, NO mustache), dark sunglasses, backwards cap, bright orange puffer jacket, backpack. NO skateboard. He has his hands dug deep into his pockets pulling out the pocket linings to search for crumpled coins or notes with an anxious, comical look on his face. "
            "On the right, Agente Hincapié (Medellín Transit Police): white peaked cap, neon-yellow-green reflective safety vest. He has a broad, sly, greedy grin, rubbing his hands together in eager anticipation: ('¡Me gusta la gente pragmática! A ver, sáquese pues lo que tiene en los bolsillos a ver qué tan colaborador es...'). "
            "Background: flooded Soterrado underpass in Medellín, murky brown floodwater, submerged yellow taxi cab, stuck bus, industrial ventilation fans on ceiling."
        )
    },
    {
        "id": "scene_soterrado_11_panico_nequi",
        "title": "Momento 11: Pánico a Nequi & Furia de Impresora Térmica (Nodo N_SOBORNO_NEQUI)",
        "prompt": (
            "16-bit Capcom CPS-3 arcade pixel art cutscene screen, 16:9 widescreen, hilarious 90s Capcom arcade cutscene with retro CRT monitor curvature and scanlines. "
            "Characters in the foreground: "
            "On the left, Juancho: clean-shaven (NO mustache, NO beard), dark sunglasses, backwards cap, orange puffer jacket, backpack. Holding out his modern smartphone innocently displaying a purple Nequi QR transfer screen: ('¿Le sirve si le paso por Nequi?'). "
            "On the right, Agente Hincapié (Medellín Transit Police): white peaked cap, neon-yellow-green reflective vest. Horrified, recoiling in dramatic cartoon panic with bulging eyes as if the phone was a bomb, furiously brandishing a portable belt-mounted thermal ticket printer: ('¡¿A Nequi?! ¡¿Dejar un rastro digital con la Procuraduría?! ¡Usted lo que me quiere es tender una trampa! ¡Impresora térmica, actívese!'). "
            "Background: flooded Soterrado underpass in Medellín, murky water with floating debris, submerged taxis, tunnel ceiling fans."
        )
    },
    {
        "id": "scene_soterrado_12_billete_cincuenta",
        "title": "Momento 12: El Billete de Cincuenta de Gabo (Nodo N_SOBORNO_ALTO)",
        "prompt": (
            "16-bit Capcom CPS-3 arcade pixel art cutscene screen, 16:9 widescreen, 90s Capcom arcade cutscene with subtle CRT curvature and scanlines. "
            "Characters in the foreground: "
            "On the left, Juancho: clean-shaven face (NO beard, NO mustache), dark sunglasses, backwards baseball cap, orange puffer jacket, backpack. NO skateboard. Discreetly passing a crisp purple Colombian 50,000 peso banknote with a sly wink. "
            "On the right, Agente Hincapié (Medellín Transit Police): white peaked cap, neon yellow-green reflective vest. Looking sideways cautiously out of the corner of his eye to check if anyone is looking, while smoothly sliding the purple 50k Gabriel García Márquez bill into his inside vest pocket with a satisfied sneaky smile: ('Ese Gabriel García Márquez en el billete me convenció... Yo no lo vi, usted no me vio'). "
            "Background: flooded entrance of the Soterrado highway in Medellín at dusk, murky water, stranded yellow taxis, green bus, tunnel jet fans."
        )
    },
    {
        "id": "scene_soterrado_13_influencer_grabar",
        "title": "Momento 13: Influencer de Semáforo & Amenaza de Multas (Nodo N_GRABAR)",
        "prompt": (
            "16-bit Capcom CPS-3 arcade pixel art cutscene screen, 16:9 widescreen, 90s arcade cutscene with CRT curved corners and scanlines. "
            "Characters in the foreground: "
            "On the left, Juancho: clean-shaven (NO mustache, NO beard), dark sunglasses, backwards cap, orange puffer jacket, backpack. Holding up his smartphone with camera flash on, defiantly recording video like an investigative influencer ('¡Lo prendo con la cámara del celular y lo hago viral!'). "
            "On the right, Agente Hincapié (Medellín Transit Police): white peaked cap, neon yellow-green reflective vest over dark blue uniform. Posing cockily with arms crossed and holding a digital ticketing stylus, glaring mockingly at the camera lens: ('¿Me va a grabar, influencer de semáforo? Vaya abriendo TikTok que yo le dicto cinco comparendos en flagrancia!'). "
            "Background: flooded Soterrado underpass in Medellín, murky floodwater, floating yellow taxi, stuck bus, overhead tunnel fans."
        )
    },
    {
        "id": "scene_soterrado_14_furia_policial",
        "title": "Momento 14: Furia Policial & Amenaza de Tanqueta (Nodo N_TOREAR)",
        "prompt": (
            "16-bit Capcom CPS-3 arcade pixel art cutscene screen, 16:9 widescreen, dramatic funny 90s arcade cutscene with CRT frame and scanlines. "
            "Characters in the foreground: "
            "On the left, Juancho: clean-shaven (NO beard, NO mustache), dark sunglasses, backwards cap, orange puffer jacket, backpack. Backing away with hands raised in nervous surrender, huge anime sweat drop on his forehead: ('¡Uy mi cabo, era un chistecito paisa!'). "
            "On the right, Agente Hincapié (Medellín Transit Police): white peaked cap, neon-yellow-green reflective vest. Face flushed red with comic rage, shouting furiously into his shoulder walkie-talkie radio with an aggressive pointing finger: ('¡¿Atembado yo?! ¡Ahora va a probar agua pero con presión de tanqueta del ESMAD!'). Red alert sparks around his radio. "
            "Background: flooded Soterrado underpass in Medellín, murky brown water, submerged yellow taxis, tunnel ceiling exhaust fans."
        )
    },
    {
        "id": "scene_soterrado_15_briefing_tactico",
        "title": "Momento 15: Briefing Táctico de los 3 Carriles (Nodo N8B_TACTICA)",
        "prompt": (
            "16-bit Capcom CPS-3 arcade pixel art cutscene screen, 16:9 widescreen, heroic 90s Capcom arcade cutscene with retro CRT curved bezel and scanlines. "
            "Characters in the foreground: "
            "On the left, Juancho: clean-shaven (NO mustache, NO beard), dark sunglasses, backwards baseball cap, orange puffer jacket, backpack. Looking focused and determined, nodding attentively like an operative receiving mission orders. "
            "On the right, Agente Hincapié (Medellín Transit Police): white peaked cap, neon yellow-green reflective safety vest. Standing like a tactical commander, holding a small clipboard map with one hand and pointing out the 3 lanes across the flooded tunnel: ('Carril izquierdo taxis que flotan, centro buses Coometropol, derecha corriente rápida... ¡y agáchese bajo los ductos de ventilación!'). "
            "Background: flooded Soterrado tunnel in Medellín, clear view of the 3 flooded lanes with car roofs and bus roofs forming a parkour path across the murky water, overhead industrial jet fans."
        )
    }
]

def generate_all():
    print(f"=== GENERANDO 8 NUEVOS MOMENTOS DEL ÁRBOL DE DECISIONES ===")
    print(f"Directorio de destino: {ASSETS_DIR}\n")
    
    for i, m in enumerate(EXTENDED_MOMENTS, 1):
        filename = f"{m['id']}.png"
        out_path = os.path.join(ASSETS_DIR, filename)
        print(f"[{i}/{len(EXTENDED_MOMENTS)}] Generando {m['title']} -> {filename}...")
        
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash-image',
                contents=m['prompt']
            )
            
            image_bytes = None
            if response.candidates and response.candidates[0].content and response.candidates[0].content.parts:
                for part in response.candidates[0].content.parts:
                    if hasattr(part, 'inline_data') and part.inline_data:
                        image_bytes = part.inline_data.data
                        break
            
            if not image_bytes:
                print(f"  [ERROR] No se recibieron bytes de imagen para {filename}")
                continue
            
            raw_im = Image.open(BytesIO(image_bytes)).convert('RGB')
            clean_im = raw_im.resize((640, 360), Image.Resampling.LANCZOS)
            clean_im.save(out_path, format='PNG', optimize=True)
            print(f"  [OK] Guardado exitosamente: {out_path} ({clean_im.size})\n")
            
            time.sleep(2)
            
        except Exception as e:
            print(f"  [ERROR] Falló la generación de {filename}: {e}\n")

if __name__ == '__main__':
    generate_all()
