create trigger trg_update_estudiantes_updated_at before
update on public.estudiantes for each row
execute function public.update_updated_at_column ();

create trigger trg_update_minijuegos_updated_at before
update on public.minijuegos for each row
execute function public.update_updated_at_column ();

create trigger trg_update_sesiones_minijuego_updated_at before
update on public.sesiones_minijuego for each row
execute function public.update_updated_at_column ();

create trigger trg_update_puntos_evaluacion after
insert on public.respuestas_evaluacion for each row 
execute function public.actualizar_puntos_estudiante ();

create trigger trg_update_puntos_minijuego after
insert on public.respuestas_minijuego for each row 
execute function public.actualizar_puntos_estudiante ();
