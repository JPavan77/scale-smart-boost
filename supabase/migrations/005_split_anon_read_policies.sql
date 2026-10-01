-- Split public and authenticated read policies so anon never needs has_role().

drop policy if exists "businesses readable" on public.businesses;
create policy "businesses anon read"
on public.businesses for select
to anon
using (is_active);

create policy "businesses authenticated read"
on public.businesses for select
to authenticated
using (
  is_active
  or exists(
    select 1
    from public.business_members bm
    where bm.business_id=id
      and bm.user_id=(select auth.uid())
  )
  or public.has_role((select auth.uid()), 'super_admin')
);

drop policy if exists "categories readable" on public.categories;
create policy "categories anon read"
on public.categories for select
to anon
using (
  exists(
    select 1
    from public.businesses b
    where b.id=business_id and b.is_active
  )
);

create policy "categories authenticated read"
on public.categories for select
to authenticated
using (
  exists(
    select 1
    from public.businesses b
    where b.id=business_id and b.is_active
  )
  or exists(
    select 1
    from public.business_members bm
    where bm.business_id=business_id
      and bm.user_id=(select auth.uid())
  )
  or public.has_role((select auth.uid()), 'super_admin')
);

drop policy if exists "items readable" on public.items;
create policy "items anon read"
on public.items for select
to anon
using (
  is_active
  and exists(
    select 1
    from public.businesses b
    where b.id=business_id and b.is_active
  )
);

create policy "items authenticated read"
on public.items for select
to authenticated
using (
  (
    is_active
    and exists(
      select 1
      from public.businesses b
      where b.id=business_id and b.is_active
    )
  )
  or exists(
    select 1
    from public.business_members bm
    where bm.business_id=business_id
      and bm.user_id=(select auth.uid())
  )
  or public.has_role((select auth.uid()), 'super_admin')
);

drop policy if exists "variants readable" on public.item_variants;
create policy "variants anon read"
on public.item_variants for select
to anon
using (
  exists(
    select 1
    from public.items i
    join public.businesses b on b.id=i.business_id
    where i.id=item_id
      and i.is_active
      and b.is_active
  )
);

create policy "variants authenticated read"
on public.item_variants for select
to authenticated
using (
  exists(
    select 1
    from public.items i
    join public.businesses b on b.id=i.business_id
    where i.id=item_id
      and i.is_active
      and b.is_active
  )
  or exists(
    select 1
    from public.items i
    join public.business_members bm on bm.business_id=i.business_id
    where i.id=item_id
      and bm.user_id=(select auth.uid())
  )
  or public.has_role((select auth.uid()), 'super_admin')
);
