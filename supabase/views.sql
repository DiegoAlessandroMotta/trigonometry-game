/* 
 * Estudiantes
 */
create or replace view
  public.estudiantes_publicos as
select
  id,
  nombre_usuario,
  puntos_totales
from
  public.estudiantes;
