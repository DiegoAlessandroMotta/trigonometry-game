/* 
 * Estudiantes
 */
alter table public.estudiantes enable row level security;

create policy "Estudiantes solo pueden ver sus propios datos" on public.estudiantes for
select
  to authenticated using (
    id = (
      select
        auth.uid ()
    )
  );

create policy "Estudiantes pueden modificar sus datos permitidos" on public.estudiantes for
update to authenticated using (
  id = (
    select
      auth.uid ()
  )
)
with
  check (
    id = (
      select
        auth.uid ()
    )
  );

/* 
 * Minijuegos
 */
alter table public.minijuegos enable row level security;

create policy "Estudiantes pueden ver los minijuegos" on public.minijuegos for
select
  to authenticated using (true);

/* 
 * Preguntas
 */
alter table public.preguntas enable row level security;

create policy "Estudiantes pueden ver las preguntas" on public.preguntas for
select
  to authenticated using (true);

/* 
 * Sesiones interactivas
 */
alter table public.sesiones_interactivas enable row level security;

create policy "Estudiantes pueden crear sus propias sesiones interactivas" on public.sesiones_interactivas for
insert
  to authenticated
with
  check (
    estudiante_id = (
      select
        auth.uid ()
    )
  );

create policy "Estudiantes pueden ver sus propias sesiones interactivas" on public.sesiones_interactivas for
select
  to authenticated using (
    estudiante_id = (
      select
        auth.uid ()
    )
  );

/* 
 * Respuestas evaluación
 */
alter table public.respuestas_evaluacion enable row level security;

create policy "Estudiantes pueden registrar sus respuestas de la evaluación" on public.respuestas_evaluacion for
insert
  to authenticated
with
  check (
    exists (
      select
        1
      from
        public.sesiones_interactivas si
      where
        si.id = respuestas_evaluacion.sesion_interactiva_id
        and si.estudiante_id = auth.uid ()
    )
  );

create policy "Estudiantes ver sus respuestas de evaluaciones pasadas" on public.respuestas_evaluacion for
select
  to authenticated using (
    exists (
      select
        1
      from
        public.sesiones_interactivas si
      where
        si.id = respuestas_evaluacion.sesion_interactiva_id
        and si.estudiante_id = auth.uid ()
    )
  );

/* 
 * Respuestas minijuego
 */
alter table public.respuestas_minijuego enable row level security;

create policy "Estudiantes pueden registrar sus respuestas a las preguntas mostradas en los minijuegos" on public.respuestas_minijuego for
insert
  to authenticated
with
  check (
    exists (
      select
        1
      from
        public.sesiones_interactivas si
      where
        si.id = respuestas_minijuego.sesion_interactiva_id
        and si.estudiante_id = auth.uid ()
    )
  );

create policy "Estudiantes ver sus respuestas de evaluaciones en minijuegos pasadas" on public.respuestas_minijuego for
select
  to authenticated using (
    exists (
      select
        1
      from
        public.sesiones_interactivas si
      where
        si.id = respuestas_minijuego.sesion_interactiva_id
        and si.estudiante_id = auth.uid ()
    )
  );

/* 
 * Sesiones minijuego
 */
alter table public.sesiones_minijuego enable row level security;

create policy "Estudiantes pueden registrar sus sesiones de juego" on public.sesiones_minijuego for
insert
  to authenticated
with
  check (
    exists (
      select
        1
      from
        public.sesiones_interactivas si
      where
        si.id = sesiones_minijuego.sesion_interactiva_id
        and si.estudiante_id = auth.uid ()
    )
  );

create policy "Estudiantes pueden modificar sus sesiones de juego" on public.sesiones_minijuego for
update to authenticated
with
  check (
    exists (
      select
        1
      from
        public.sesiones_interactivas si
      where
        si.id = sesiones_minijuego.sesion_interactiva_id
        and si.estudiante_id = auth.uid ()
    )
  );
