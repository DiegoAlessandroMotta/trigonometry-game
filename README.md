# Juegos de Trigonometría

Una colección de mini juegos educativos para aprender los fundamentos de la trigonometría de manera interactiva y divertida.

## 🎮 Mini Juegos Incluidos

### 1. Círculo Unitario
- **Objetivo**: Aprender los valores de seno, coseno y tangente en el círculo unitario
- **Mecánica**: Se muestra un ángulo en el círculo unitario y debes identificar qué función trigonométrica corresponde al valor dado
- **Conceptos**: Seno, coseno, tangente, coordenadas polares

### 2. Triángulos Rectángulos
- **Objetivo**: Practicar el teorema de Pitágoras y las razones trigonométricas
- **Mecánica**: Se muestra un triángulo rectángulo y debes calcular lados o ángulos usando trigonometría
- **Conceptos**: Teorema de Pitágoras, seno, coseno, tangente, ángulos

### 3. Conversión de Ángulos
- **Objetivo**: Convertir entre grados y radianes
- **Mecánica**: Se presenta un ángulo en una unidad y debes convertirlo a la otra
- **Conceptos**: Grados, radianes, π, conversiones

### 4. Identidades Trigonométricas
- **Objetivo**: Aprender las identidades trigonométricas fundamentales
- **Mecánica**: Preguntas de opción múltiple sobre identidades trigonométricas
- **Conceptos**: Identidad fundamental, identidades recíprocas, identidades pitagóricas, ángulos dobles

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 16 o superior)
- pnpm (recomendado) o npm

### Instalación
```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd trigonometry-game

# Instalar dependencias
pnpm install

# Ejecutar el juego
pnpm dev
```

### Construcción para producción
```bash
pnpm build
```

## 🎯 Cómo Jugar

1. **Iniciar el juego**: Ejecuta `pnpm dev` y abre tu navegador
2. **Seleccionar juego**: En el menú principal, elige el mini juego que quieres practicar
3. **Responder preguntas**: Cada juego tiene diferentes tipos de preguntas y mecánicas
4. **Ver puntuación**: Tu puntuación se muestra en tiempo real
5. **Repetir**: Puedes jugar múltiples veces para mejorar tu puntuación

## 📚 Conceptos Educativos

### Círculo Unitario
- **Radio**: 1 unidad
- **Coordenadas**: (cos θ, sin θ)
- **Valores especiales**: 0°, 30°, 45°, 60°, 90°, etc.

### Triángulos Rectángulos
- **Teorema de Pitágoras**: a² + b² = c²
- **Razones trigonométricas**:
  - sen θ = opuesto/hipotenusa
  - cos θ = adyacente/hipotenusa
  - tan θ = opuesto/adyaente

### Conversión de Ángulos
- **Fórmula**: 1 radian = 180°/π
- **Ángulos comunes**:
  - 30° = π/6 radianes
  - 45° = π/4 radianes
  - 60° = π/3 radianes
  - 90° = π/2 radianes

### Identidades Trigonométricas
- **Identidad fundamental**: sin²(x) + cos²(x) = 1
- **Identidades recíprocas**:
  - csc(x) = 1/sin(x)
  - sec(x) = 1/cos(x)
  - cot(x) = 1/tan(x)
- **Identidades pitagóricas**:
  - 1 + tan²(x) = sec²(x)
  - 1 + cot²(x) = csc²(x)

## 🛠️ Tecnologías Utilizadas

- **Phaser.js**: Motor de juegos 2D
- **TypeScript**: Lenguaje de programación
- **Vite**: Herramienta de construcción
- **pnpm**: Gestor de paquetes

## 🎨 Características

- **Interfaz intuitiva**: Diseño limpio y fácil de usar
- **Feedback inmediato**: Respuestas correctas e incorrectas con explicaciones
- **Puntuación**: Sistema de puntuación para motivar el aprendizaje
- **Múltiples niveles**: Diferentes tipos de preguntas y dificultades
- **Visualización**: Gráficos interactivos para mejor comprensión

## 📖 Aprendizaje

Estos juegos están diseñados para:
- **Estudiantes de matemáticas**: Practicar conceptos de trigonometría
- **Profesores**: Usar como herramienta educativa en el aula
- **Autodidactas**: Aprender trigonometría de manera autónoma
- **Repaso**: Refrescar conocimientos de trigonometría

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- Phaser.js por el excelente motor de juegos
- La comunidad de desarrolladores de juegos educativos
- Todos los contribuidores que han ayudado a mejorar este proyecto 