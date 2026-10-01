create or replace function public.bootstrap_self_admin()
returns boolean
language plpgsql
security definer
set search_path=public
as $fn$
declare
  current_user_id uuid;
begin
  current_user_id := (select auth.uid());

  if current_user_id is null then
    raise exception 'Usuário não autenticado.';
  end if;

  if exists(select 1 from public.user_roles where role='super_admin') then
    return false;
  end if;

  insert into public.user_roles(user_id, role)
  values (current_user_id, 'super_admin')
  on conflict (user_id, role) do nothing;

  return true;
end
$fn$;

revoke all on function public.bootstrap_self_admin() from public;
revoke all on function public.bootstrap_self_admin() from anon;
grant execute on function public.bootstrap_self_admin() to authenticated;
