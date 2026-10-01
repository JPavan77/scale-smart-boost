-- Keep item categories inside the same business.
create or replace function public.validate_item_category_business()
returns trigger
language plpgsql
set search_path=public
as $fn$
begin
  if new.category_id is not null and not exists(
    select 1
    from public.categories c
    where c.id=new.category_id
      and c.business_id=new.business_id
  ) then
    raise exception 'A categoria selecionada não pertence à empresa do item.';
  end if;
  return new;
end
$fn$;

drop trigger if exists validate_item_category_business_before_write on public.items;
create trigger validate_item_category_business_before_write
before insert or update of business_id,category_id on public.items
for each row execute function public.validate_item_category_business();

revoke all on function public.validate_item_category_business() from public;
revoke all on function public.validate_item_category_business() from anon;
revoke all on function public.validate_item_category_business() from authenticated;
