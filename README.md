# ★ El Valle de la Locura (Aventura en Medellín) ★
### Arcade Beat 'em Up & Endless Slope Runner (Estilo Streets of Rage & Capcom CPS-3 16-Bit)

¡Juega en línea directamente en tu navegador o celular!  
🌐 **Enlace Oficial GitHub Pages:** [https://juanselobo.github.io/Elvalledelalocura/](https://juanselobo.github.io/Elvalledelalocura/)

---

## 🎮 Acerca del Juego
Videojuego retro arcade de plataformas y combate callejero ambientado en la ciudad de Medellín, Colombia. Desarrollado con HTML5 Canvas, Web Audio API y físicas nativas en JavaScript puro a 60 FPS, con soporte para teclado en PC y mandos táctiles virtuales adaptados para smartphones y tablets.

### 🏙️ Los 3 Niveles del Juego:
1. **Nivel 1: La Villa del Aburrá & El Viaducto del Metro**
   - Combate callejero contra Gamines y fauna urbana en el andén superior con fondos de 3 capas de paralaje crepuscular (Coltejer, comunas y Metrocable).
   - Puesto de empanadas de Doña Gloria para recuperar salud.
2. **Nivel 2: El Pastor Testigo de Jehová & El Abismo**
   - Jefe de etapa: El Pastor Testigo de Jehová con su carrito de La Atalaya, lluvia de biblias sagradas y sermones expansivos.
   - Escaleras reales de descenso y salto de fe hacia el vacío de la canalización.
3. **Nivel 3: El Descenso de la Canalización & La Rata Colosal**
   - Descenso a alta velocidad en un plano inclinado diagonal (~20.6°).
   - Aceleración progresiva desde $30\text{ km/h}$ hasta $300\text{ km/h}$ con estelas de viento dinámicas.
   - Persecución de la Rata Mutante Colosal con 3 poses animadas (Rugido, Rabiosa, Mordisco Snap con daño de $-25\text{ HP}$).
   - 6 Obstáculos urbanos icónicos (Gamín dormido, Modelo prepago, Taxista con cruceta, Inodoro roto, Colchón floreado y Gallinazo carroñero) con variantes de impacto y destrucción auténticas de 16 bits.
   - **Doble Salto Aéreo Acrobático ($360^\circ$):** Voltereta en el aire con sostén y hang-time para esquivar los obstáculos más altos.

---

## 🕹️ Controles de Juego

### 📱 En Celular o Tablet (Táctil)
- **D-Pad Virtual (Izquierda):** Mover a Juancho en todas las direcciones o cambiar de carril en la rampa.
- **Botón SALTO (⬆):** Saltar. Oprime **dos veces seguidas rápidamente** para realizar el **Doble Salto Acrobático 360°**.
- **Botón GOLPE (Q):** Golpear o patear obstáculos en la bajada.
- **Botón ESPECIAL (E):** Giro 360° invulnerable (consumo de vida verde).
- **Botón RUN (⚡):** Correr (Dash).

### 💻 En Computador (Teclado)
| Acción | Teclas |
| :--- | :--- |
| **Moverse / Cambiar Carril** | `W`, `A`, `S`, `D` o `Flechas Direccionales` |
| **Correr (Dash)** | Doble toque `→ →` o tecla `Shift` |
| **Rodada Evasiva** | Doble toque `↑ ↑` o `↓ ↓` |
| **Salto** | Barra `Espaciadora` o tecla `C` |
| **Doble Salto Aéreo 360°** | Doble toque rápido de la barra `Espaciadora` |
| **Combo / Ataque / Patada** | `Q` o `J` |
| **Ataque Especial 360°** | `E`, `K` o `X` |
| **Interacción (Empanadas)** | `F` o `Enter` |
| **Música Chiptune** | `M` o botón 🎵 en pantalla |
| **Selección de Nivel** | Teclas `1`, `2` o `3` |

---

## 🚀 Cómo Jugar Localmente
1. Clona el repositorio:
   ```bash
   git clone https://github.com/juanselobo/Elvalledelalocura.git
   ```
2. Abre `index.html` en tu navegador favorito, o ejecuta:
   ```bash
   iniciar_juego.bat
   ```
3. Para jugar en tu celular dentro de tu red Wi-Fi local:
   ```bash
   servidor_celular.bat
   ```

---

## 🎨 Créditos y Estética
- **Motor:** Custom JavaScript Canvas Belt-Scrolling & Slope Engine a 60 FPS.
- **Audio:** Web Audio API retro chiptune procedural con BGM temático.
- **Arte:** Pixel art 16-bit estilo Capcom CPS-3 / Streets of Rage.
