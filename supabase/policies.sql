/* 
 * Estudiantes
 */
alter table public.estudiantes enable row level security;

create policy "Estudiantes autenticados y anónimos pueden ver sus datos" on public.estudiantes for
select
  to authenticated using (true);

create policy "Estudiantes autenticados y anónimos pueden modificar sus datos" on public.estudiantes for
update to authenticated using (true);

/* 
 * Minijuegos
 */
alter table public.minijuegos enable row level security;

create policy "Estudiantes autenticados y anónimos pueden ver los minijuegos" on public.minijuegos for
select
  to authenticated using (true);

/* 
 * Preguntas prueba
 */
alter table public.preguntas_prueba enable row level security;

create policy "Estudiantes autenticados y anónimos pueden ver las preguntas" on public.preguntas_prueba for
select
  to authenticated using (true);

/* 
 * Sesiones interactivas
 */
alter table public.sesiones_interactivas enable row level security;

create policy "Estudiantes autenticados y anónimos pueden crear sus sesiones interactivas" on public.sesiones_interactivas for
insert
  to authenticated using (true);

/* 
 * Preguntas minijuego
 */
alter table preguntas_minijuego enable row level security;

create policy "Estudiantes autenticados y anónimos pueden ver las preguntas de los minijuegos" on public.sesiones_interactivas for
insert
  to authenticated using (true);

/* 
 * Evaluación minijuego
 */
alter table evaluacion_minijuego enable row level security;

-- Políticas para sesiones_interactivas
create POLICY "Ver sesiones propias" on sesiones_interactivas for all using (
  estudiante_id in (
    select
      id
    from
      estudiantes
    where
      auth_id = auth.uid ()
      or (
        es_anonimo = true
        and auth_id is null
      )
  )
);

-- Políticas similares para las tablas relacionadas
create POLICY "Ver preguntas minijuego" on pregunta_minijuego for all using (
  sesion_interactiva_id in (
    select
      id
    from
      sesiones_interactivas
    where
      estudiante_id in (
        select
          id
        from
          estudiantes
        where
          auth_id = auth.uid ()
          or (
            es_anonimo = true
            and auth_id is null
          )
      )
  )
);

create POLICY "Ver evaluaciones minijuego" on evaluacion_minijuego for all using (
  sesion_interactiva_id in (
    select
      id
    from
      sesiones_interactivas
    where
      estudiante_id in (
        select
          id
        from
          estudiantes
        where
          auth_id = auth.uid ()
          or (
            es_anonimo = true
            and auth_id is null
          )
      )
  )
);
