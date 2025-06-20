create type estudiantes_genero as enum('M', 'F');

create table
  public.estudiantes (
    id uuid primary key default gen_random_uuid (),
    auth_id uuid unique references auth.users (id) on delete cascade,
    nombre_usuario text not null unique,
    edad integer check (edad > 0),
    genero estudiantes_genero,
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
  public.preguntas_prueba (
    id uuid primary key default gen_random_uuid (),
    codigo text not null,
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
    puntuacion_prueba integer not null check (puntuacion_prueba >= 0),
    created_at timestamp
    with
      time zone default current_timestamp not null
  );

create table
  public.preguntas_minijuego (
    id uuid primary key default gen_random_uuid (),
    minijuego_id uuid not null,
    sesion_interactiva_id uuid not null,
    pregunta_prueba_id uuid not null,
    created_at timestamp
    with
      time zone default current_timestamp not null,
      foreign key (minijuego_id) references public.minijuegos (id),
      foreign key (sesion_interactiva_id) references public.sesiones_interactivas (id),
      foreign key (pregunta_prueba_id) references public.preguntas_prueba (id)
  );

create table
  public.evaluacion_minijuego (
    id uuid primary key default gen_random_uuid (),
    minijuego_id uuid not null,
    sesion_interactiva_id uuid not null,
    inicio timestamp not null,
    final timestamp not null,
    created_at timestamp
    with
      time zone default current_timestamp not null,
      foreign key (minijuego_id) references public.minijuegos (id),
      foreign key (sesion_interactiva_id) references public.sesiones_interactivas (id)
  );
