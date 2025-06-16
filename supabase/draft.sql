create type estudiantes_genero as enum('M', 'F');

create table
  public.estudiantes (
    id uuid primary key default gen_random_uuid (),
    auth_id uuid unique references auth.users on delete cascade,
    nombre_usuario text not null unique,
    edad integer check (edad > 0),
    genero categories_type,
    es_anonimo boolean not null default true,
    puntos_totales integer not null default 0,
    created_at timestamp
    with
      time zone default current_timestamp not null,
      updated_at timestamp
    with
      time zone default current_timestamp not null,
      constraint estudiantes_auth_id_fkey foreign key (auth_id) references auth.users (id)
  );

create table
  public.minijuegos (
    id uuid primary key default gen_random_uuid (),
    nombre text not null unique,
    created_at timestamp
    with
      time zone default current_timestamp not null,
      updated_at timestamp
    with
      time zone default current_timestamp not null
  );

create table
  public.preguntas_prueba (
    id uuid primary key default gen_random_uuid (),
    codigo text not null,
    titulo text not null,
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
          )
        from
          jsonb_array_elements (alternativas)
      )
    )
  );

create table
  public.sesiones_interactivas (
    id uuid primary key default gen_random_uuid (),
    estudiante_id uuid not null,
    duracion_total_sesion integer not null check (duracion_total_sesion >= 0),
    puntuacion_prueba integer not null check (puntuacion_prueba >= 0),
    fecha_sesion timestamp
    with
      time zone default current_timestamp not null,
      created_at timestamp
    with
      time zone default current_timestamp not null,
      constraint sesiones_interactivas_estudiante_id_fkey foreign key (estudiante_id) references public.estudiantes (id)
  );

create table
  public.sesiones_interactivas_minijuegos (
    sesion_interactiva_id uuid not null,
    sesion_minijuego_id uuid not null,
    constraint sesiones_interactivas_minijuegos_pkey primary key (sesion_interactiva_id, sesion_minijuego_id),
    constraint sesiones_interactivas_minijuegos_sesion_interactiva_id_fkey foreign key (sesion_interactiva_id) references public.sesiones_interactivas (id),
    constraint sesiones_interactivas_minijuegos_sesion_minijuego_id_fkey foreign key (sesion_minijuego_id) references public.sesiones_minijuego (id)
  );

create table
  public.sesiones_minijuego (
    id uuid primary key default gen_random_uuid (),
    minijuego_id uuid not null,
    duracion_sesion integer not null check (duracion_sesion >= 0),
    puntuacion_juego integer not null check (puntuacion_juego >= 0),
    created_at timestamp
    with
      time zone default current_timestamp not null,
      updated_at timestamp
    with
      time zone default current_timestamp not null,
      constraint sesiones_minijuego_minijuego_id_fkey foreign key (minijuego_id) references public.minijuegos (id)
  );
