-- Trigger to update updated_at timestamp
create
or
replace
  function public.update_updated_at_column () returns trigger language plpgsql security definer
set
  search_path = "" as $$ begin new.updated_at = current_timestamp;

return new;

end;

$$;
