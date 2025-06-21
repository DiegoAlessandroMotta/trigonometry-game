create type tipo_genero_estudiante as enum('M', 'F');

create table
  public.estudiantes (
    id uuid primary key unique references auth.users (id) on delete cascade,
    nombre_usuario text not null unique,
    edad integer check (edad > 0),
    genero tipo_genero_estudiante,
    es_anonimo boolean not null default true,
    puntos_totales integer not null default 0,
    created_at timestamp
    with
      time zone default current_timestamp not null,
      updated_at timestamp
    with
      time zone default current_timestamp not null
  );

create table
  public.minijuegos (
    id uuid primary key default gen_random_uuid (),
    tema text not null,
    codigo text not null unique,
    nombre text not null unique,
    created_at timestamp
    with
      time zone default current_timestamp not null,
      updated_at timestamp
    with
      time zone default current_timestamp not null
  );

create table
  public.preguntas (
    id uuid primary key default gen_random_uuid (),
    codigo text not null,
    tema text not null,
    titulo text not null,
    enunciado text not null,
    puntos integer not null,
    nivel_estimado integer not null,
    alternativas jsonb not null check (
      jsonb_typeof (alternativas) = 'array'
      and jsonb_array_length (alternativas) > 0
      and (
        select
          bool_and (
            (value ->> 'texto' is not null)
            and (value ->> 'esCorrecta' is not null)
            and (value ->> 'feedback' is not null)
          )
        from
          jsonb_array_elements (alternativas)
      )
    )
  );

create table
  public.sesiones_interactivas (
    id uuid primary key default gen_random_uuid (),
    estudiante_id uuid references public.estudiantes (id) on delete set null,
    created_at timestamp
    with
      time zone default current_timestamp not null
  );

create table
  public.respuestas_evaluacion (
    id uuid primary key default gen_random_uuid (),
    sesion_interactiva_id uuid not null references public.sesiones_interactivas (id) on delete cascade,
    pregunta_id uuid references public.preguntas (id) on delete set null,
    respuesta_correcta boolean not null default false,
    respuesta_dada text,
    tiempo_respuesta int not null,
    created_at timestamp
    with
      time zone default current_timestamp not null
  );

create table
  public.respuestas_minijuego (
    id uuid primary key default gen_random_uuid (),
    minijuego_id uuid not null references public.minijuegos (id),
    sesion_interactiva_id uuid not null references public.sesiones_interactivas (id) on delete cascade,
    pregunta_id uuid references public.preguntas (id) on delete set null,
    respuesta_correcta boolean not null default false,
    tiempo_respuesta int not null,
    respuesta_dada text,
    created_at timestamp
    with
      time zone default current_timestamp not null
  );

create table
  public.sesiones_minijuego (
    id uuid primary key default gen_random_uuid (),
    minijuego_id uuid not null references public.minijuegos (id) on delete cascade,
    sesion_interactiva_id uuid not null references public.sesiones_interactivas (id) on delete cascade,
    intentos integer not null default 1,
    inicio timestamp not null,
    final timestamp not null,
    created_at timestamp
    with
      time zone default current_timestamp not null,
      updated_at timestamp
    with
      time zone default current_timestamp not null
  );
