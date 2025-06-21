create index idx_preguntas_tema on public.preguntas (tema);

create index idx_minijuegos_tema on public.minijuegos (tema);

create index idx_estudiantes_puntos_totales on public.estudiantes (puntos_totales desc);

-- create index idx_sesiones_minijuego_sesion_minijuego on public.sesiones_minijuego (sesion_interactiva_id, minijuego_id);
-- create index idx_preguntas_alternativas_gin on public.preguntas using gin (alternativas);
