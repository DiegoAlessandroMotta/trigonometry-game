create trigger update_estudiantes_updated_at before
update on public.estudiantes for each row
execute function public.update_updated_at_column ();

create trigger update_minijuegos_updated_at before
update on public.minijuegos for each row
execute function public.update_updated_at_column ();

create trigger update_sesiones_minijuego_updated_at before
update on public.sesiones_minijuego for each row
execute function public.update_updated_at_column ();
