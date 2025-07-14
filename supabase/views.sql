/* 
 * Estudiantes
 */
create or replace view
  public.estudiantes_publicos
with
  (security_invoker = true) as
select
  id,
  nombre_usuario,
  puntos_totales
from
  public.estudiantes;
