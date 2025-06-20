create index idx_estudiantes_auth_id on estudiantes (auth_id);

create index idx_sesiones_estudiante on sesiones_interactivas (estudiante_id);

create index idx_pregunta_minijuego_sesion on pregunta_minijuego (sesion_interactiva_id);

create index idx_pregunta_minijuego_pregunta on pregunta_minijuego (pregunta_prueba_id);
