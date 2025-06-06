interface Sesion_minijuego {
  id: string;
  nombre: string;
  duracion_sesion: number;
  puntuacion_juego: number;
}

interface Estudiante {
  id: string;
  nombre_usuario: string;
  edad?: number;
  genero?: string;
}

interface Sesion_interactiva {
  estudiante: Estudiante;
  duracion_total_sesion: number;
  minijuegos: Sesion_minijuego[];
  puntuacion_prueba: number;
  fecha_sesion: string; // ISO timestamp
}

interface Minijuegos {
  id: string;
  nombre: string;
  puntos_totales: number;
}
