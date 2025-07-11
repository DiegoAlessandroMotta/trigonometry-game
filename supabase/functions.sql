create or replace 
function public.fn_update_updated_at_column () 
returns trigger 
language plpgsql security definer set search_path = "public" as $$ 
begin 
  new.updated_at = current_timestamp;

  return new;
end;
$$;

create or replace 
function public.fn_update_puntos_totales () 
returns trigger 
language plpgsql security definer set search_path = "public" as $$ 
declare 
  puntos_a_sumar int;
  id_estudiante uuid;
begin 
  if new.respuesta_correcta = true then
    select
      puntos into puntos_a_sumar
    from
      public.preguntas
    where
      id = new.pregunta_id;

    select
      estudiante_id into id_estudiante
    from
      public.sesiones_interactivas
    where
      id = new.sesion_interactiva_id;

    if puntos_a_sumar is not null and id_estudiante is not null then
      update public.estudiantes
      set
        puntos_totales = puntos_totales + puntos_a_sumar
      where
        id = id_estudiante;
    end if;
  end if;

  return null;
end;
$$;
