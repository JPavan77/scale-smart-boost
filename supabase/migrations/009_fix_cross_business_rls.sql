-- Fix outer-table references in RLS policies for categories and items.

drop policy if exists "categories authenticated read" on public.categories;
drop policy if exists "categories member insert" on public.categories;
drop policy if exists "categories member update" on public.categories;
drop policy if exists "categories member delete" on public.categories;

create policy "categories authenticated read"
on public.categories for select
to authenticated
using (
  exists(
    select 1
    from public.businesses b
    where b.id=categories.business_id and b.is_active
  )
  or exists(
    select 1
    from public.business_members bm
    where bm.business_id=categories.business_id
      and bm.user_id=(select auth.uid())
  )
  or public.has_role((select auth.uid()), 'super_admin')
);

create policy "categories member insert"
on public.categories for insert
to authenticated
with check (
  exists(
    select 1
    from public.business_members bm
    where bm.business_id=categories.business_id
      and bm.user_id=(select auth.uid())
  )
  or public.has_role((select auth.uid()), 'super_admin')
);

create policy "categories member update"
on public.categories for update
to authenticated
using (
  exists(
    select 1
    from public.business_members bm
    where bm.business_id=categories.business_id
      and bm.user_id=(select auth.uid())
  )
  or public.has_role((select auth.uid()), 'super_admin')
)
with check (
  exists(
    select 1
    from public.business_members bm
    where bm.business_id=categories.business_id
      and bm.user_id=(select auth.uid())
  )
  or public.has_role((select auth.uid()), 'super_admin')
);

create policy "categories member delete"
on public.categories for delete
to authenticated
using (
  exists(
    select 1
    from public.business_members bm
    where bm.business_id=categories.business_id
      and bm.user_id=(select auth.uid())
  )
  or public.has_role((select auth.uid()), 'super_admin')
);

drop policy if exists "items authenticated read" on public.items;
drop policy if exists "items member insert" on public.items;
drop policy if exists "items member update" on public.items;
drop policy if exists "items member delete" on public.items;

create policy "items authenticated read"
on public.items for select
to authenticated
using (
  (
    items.is_active
    and exists(
      select 1
      from public.businesses b
      where b.id=items.business_id and b.is_active
    )
  )
  or exists(
    select 1
    from public.business_members bm
    where bm.business_id=items.business_id
      and bm.user_id=(select auth.uid())
  )
  or public.has_role((select auth.uid()), 'super_admin')
);

create policy "items member insert"
on public.items for insert
to authenticated
with check (
  exists(
    select 1
    from public.business_members bm
    where bm.business_id=items.business_id
      and bm.user_id=(select auth.uid())
  )
  or public.has_role((select auth.uid()), 'super_admin')
);

create policy "items member update"
on public.items for update
to authenticated
using (
  exists(
    select 1
    from public.business_members bm
    where bm.business_id=items.business_id
      and bm.user_id=(select auth.uid())
  )
  or public.has_role((select auth.uid()), 'super_admin')
)
with check (
  exists(
    select 1
    from public.business_members bm
    where bm.business_id=items.business_id
      and bm.user_id=(select auth.uid())
  )
  or public.has_role((select auth.uid()), 'super_admin')
);

create policy "items member delete"
on public.items for delete
to authenticated
using (
  exists(
    select 1
    from public.business_members bm
    where bm.business_id=items.business_id
      and bm.user_id=(select auth.uid())
  )
  or public.has_role((select auth.uid()), 'super_admin')
);
