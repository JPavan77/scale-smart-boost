create or replace function public.save_catalog_item(
  _id uuid,
  _business_id uuid,
  _name text,
  _description text,
  _price numeric,
  _duration_minutes integer,
  _category_id uuid,
  _image_url text,
  _is_active boolean,
  _sort_order integer,
  _variants jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
set search_path=public
as $fn$
declare
  v_item_id uuid;
begin
  if _id is null then
    insert into public.items(
      business_id,name,description,price,duration_minutes,category_id,image_url,is_active,sort_order
    )
    values(
      _business_id,_name,nullif(_description,''),_price,_duration_minutes,_category_id,nullif(_image_url,''),_is_active,_sort_order
    )
    returning id into v_item_id;
  else
    update public.items
    set
      business_id=_business_id,
      name=_name,
      description=nullif(_description,''),
      price=_price,
      duration_minutes=_duration_minutes,
      category_id=_category_id,
      image_url=nullif(_image_url,''),
      is_active=_is_active,
      sort_order=_sort_order
    where id=_id
    returning id into v_item_id;

    if v_item_id is null then
      raise exception 'Item não encontrado ou sem permissão.';
    end if;
  end if;

  delete from public.item_variants iv
  where iv.item_id=v_item_id;

  if jsonb_typeof(coalesce(_variants,'[]'::jsonb)) <> 'array' then
    raise exception 'Variações inválidas.';
  end if;

  insert into public.item_variants(item_id,name,price)
  select
    v_item_id,
    trim(v->>'name'),
    case when nullif(v->>'price','') is null then null else (v->>'price')::numeric end
  from jsonb_array_elements(coalesce(_variants,'[]'::jsonb)) v
  where trim(coalesce(v->>'name','')) <> '';

  return v_item_id;
end
$fn$;

revoke all on function public.save_catalog_item(uuid,uuid,text,text,numeric,integer,uuid,text,boolean,integer,jsonb) from public;
revoke all on function public.save_catalog_item(uuid,uuid,text,text,numeric,integer,uuid,text,boolean,integer,jsonb) from anon;
grant execute on function public.save_catalog_item(uuid,uuid,text,text,numeric,integer,uuid,text,boolean,integer,jsonb) to authenticated;
