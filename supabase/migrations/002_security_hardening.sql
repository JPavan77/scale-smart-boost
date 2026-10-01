-- Security and RLS hardening after initial catalog platform migration.

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path=public
as $fn$
  select
    _user_id = (select auth.uid())
    and exists(
      select 1
      from public.user_roles
      where user_id=_user_id and role=_role
    )
$fn$;

revoke all on function public.has_role(uuid, public.app_role) from public;
revoke all on function public.has_role(uuid, public.app_role) from anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;

revoke all on function public.protect_business_admin_fields() from public;
revoke all on function public.protect_business_admin_fields() from anon;
revoke all on function public.protect_business_admin_fields() from authenticated;

create index if not exists business_members_business_idx
  on public.business_members(business_id);

create index if not exists items_category_idx
  on public.items(category_id);

-- Replace broad permissive policies with one read policy per table
-- and mutation-only policies for authenticated members/admins.

drop policy if exists "public active businesses" on public.businesses;
drop policy if exists "members read own businesses" on public.businesses;
drop policy if exists "members update own business" on public.businesses;
drop policy if exists "admin insert businesses" on public.businesses;
drop policy if exists "admin delete businesses" on public.businesses;

create policy "businesses readable"
on public.businesses for select
to anon, authenticated
using (
  is_active
  or (
    (select auth.uid()) is not null
    and (
      exists(
        select 1
        from public.business_members bm
        where bm.business_id=id
          and bm.user_id=(select auth.uid())
      )
      or public.has_role((select auth.uid()), 'super_admin')
    )
  )
);

create policy "businesses member update"
on public.businesses for update
to authenticated
using (
  exists(
    select 1
    from public.business_members bm
    where bm.business_id=id
      and bm.user_id=(select auth.uid())
  )
  or public.has_role((select auth.uid()), 'super_admin')
)
with check (
  exists(
    select 1
    from public.business_members bm
    where bm.business_id=id
      and bm.user_id=(select auth.uid())
  )
  or public.has_role((select auth.uid()), 'super_admin')
);

create policy "businesses admin insert"
on public.businesses for insert
to authenticated
with check (public.has_role((select auth.uid()), 'super_admin'));

create policy "businesses admin delete"
on public.businesses for delete
to authenticated
using (public.has_role((select auth.uid()), 'super_admin'));

drop policy if exists "public categories" on public.categories;
drop policy if exists "members read categories" on public.categories;
drop policy if exists "members manage categories" on public.categories;

create policy "categories readable"
on public.categories for select
to anon, authenticated
using (
  exists(
    select 1
    from public.businesses b
    where b.id=business_id and b.is_active
  )
  or (
    (select auth.uid()) is not null
    and (
      exists(
        select 1
        from public.business_members bm
        where bm.business_id=business_id
          and bm.user_id=(select auth.uid())
      )
      or public.has_role((select auth.uid()), 'super_admin')
    )
  )
);

create policy "categories member insert"
on public.categories for insert
to authenticated
with check (
  exists(
    select 1
    from public.business_members bm
    where bm.business_id=business_id
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
    where bm.business_id=business_id
      and bm.user_id=(select auth.uid())
  )
  or public.has_role((select auth.uid()), 'super_admin')
)
with check (
  exists(
    select 1
    from public.business_members bm
    where bm.business_id=business_id
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
    where bm.business_id=business_id
      and bm.user_id=(select auth.uid())
  )
  or public.has_role((select auth.uid()), 'super_admin')
);

drop policy if exists "public active items" on public.items;
drop policy if exists "members read items" on public.items;
drop policy if exists "members manage items" on public.items;

create policy "items readable"
on public.items for select
to anon, authenticated
using (
  (
    is_active
    and exists(
      select 1
      from public.businesses b
      where b.id=business_id and b.is_active
    )
  )
  or (
    (select auth.uid()) is not null
    and (
      exists(
        select 1
        from public.business_members bm
        where bm.business_id=business_id
          and bm.user_id=(select auth.uid())
      )
      or public.has_role((select auth.uid()), 'super_admin')
    )
  )
);

create policy "items member insert"
on public.items for insert
to authenticated
with check (
  exists(
    select 1
    from public.business_members bm
    where bm.business_id=business_id
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
    where bm.business_id=business_id
      and bm.user_id=(select auth.uid())
  )
  or public.has_role((select auth.uid()), 'super_admin')
)
with check (
  exists(
    select 1
    from public.business_members bm
    where bm.business_id=business_id
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
    where bm.business_id=business_id
      and bm.user_id=(select auth.uid())
  )
  or public.has_role((select auth.uid()), 'super_admin')
);

drop policy if exists "public variants" on public.item_variants;
drop policy if exists "members read variants" on public.item_variants;
drop policy if exists "members manage variants" on public.item_variants;

create policy "variants readable"
on public.item_variants for select
to anon, authenticated
using (
  exists(
    select 1
    from public.items i
    join public.businesses b on b.id=i.business_id
    where i.id=item_id
      and i.is_active
      and b.is_active
  )
  or (
    (select auth.uid()) is not null
    and (
      exists(
        select 1
        from public.items i
        join public.business_members bm on bm.business_id=i.business_id
        where i.id=item_id
          and bm.user_id=(select auth.uid())
      )
      or public.has_role((select auth.uid()), 'super_admin')
    )
  )
);

create policy "variants member insert"
on public.item_variants for insert
to authenticated
with check (
  exists(
    select 1
    from public.items i
    join public.business_members bm on bm.business_id=i.business_id
    where i.id=item_id
      and bm.user_id=(select auth.uid())
  )
  or public.has_role((select auth.uid()), 'super_admin')
);

create policy "variants member update"
on public.item_variants for update
to authenticated
using (
  exists(
    select 1
    from public.items i
    join public.business_members bm on bm.business_id=i.business_id
    where i.id=item_id
      and bm.user_id=(select auth.uid())
  )
  or public.has_role((select auth.uid()), 'super_admin')
)
with check (
  exists(
    select 1
    from public.items i
    join public.business_members bm on bm.business_id=i.business_id
    where i.id=item_id
      and bm.user_id=(select auth.uid())
  )
  or public.has_role((select auth.uid()), 'super_admin')
);

create policy "variants member delete"
on public.item_variants for delete
to authenticated
using (
  exists(
    select 1
    from public.items i
    join public.business_members bm on bm.business_id=i.business_id
    where i.id=item_id
      and bm.user_id=(select auth.uid())
  )
  or public.has_role((select auth.uid()), 'super_admin')
);

drop policy if exists "admin members" on public.business_members;
drop policy if exists "own memberships" on public.business_members;

create policy "memberships readable"
on public.business_members for select
to authenticated
using (
  user_id=(select auth.uid())
  or public.has_role((select auth.uid()), 'super_admin')
);

create policy "memberships admin insert"
on public.business_members for insert
to authenticated
with check (public.has_role((select auth.uid()), 'super_admin'));

create policy "memberships admin update"
on public.business_members for update
to authenticated
using (public.has_role((select auth.uid()), 'super_admin'))
with check (public.has_role((select auth.uid()), 'super_admin'));

create policy "memberships admin delete"
on public.business_members for delete
to authenticated
using (public.has_role((select auth.uid()), 'super_admin'));

drop policy if exists "own roles" on public.user_roles;
drop policy if exists "admin roles" on public.user_roles;

create policy "roles readable"
on public.user_roles for select
to authenticated
using (
  user_id=(select auth.uid())
  or public.has_role((select auth.uid()), 'super_admin')
);

create policy "roles admin insert"
on public.user_roles for insert
to authenticated
with check (public.has_role((select auth.uid()), 'super_admin'));

create policy "roles admin update"
on public.user_roles for update
to authenticated
using (public.has_role((select auth.uid()), 'super_admin'))
with check (public.has_role((select auth.uid()), 'super_admin'));

create policy "roles admin delete"
on public.user_roles for delete
to authenticated
using (public.has_role((select auth.uid()), 'super_admin'));

drop policy if exists "catalog images public read" on storage.objects;
drop policy if exists "members upload catalog images" on storage.objects;
drop policy if exists "members update catalog images" on storage.objects;
drop policy if exists "members delete catalog images" on storage.objects;

create policy "catalog images public read"
on storage.objects for select
to anon, authenticated
using (bucket_id='catalog-images');

create policy "members upload catalog images"
on storage.objects for insert
to authenticated
with check (
  bucket_id='catalog-images'
  and (
    public.has_role((select auth.uid()), 'super_admin')
    or exists(
      select 1
      from public.business_members bm
      where bm.user_id=(select auth.uid())
        and bm.business_id::text=(storage.foldername(name))[1]
    )
  )
);

create policy "members update catalog images"
on storage.objects for update
to authenticated
using (
  bucket_id='catalog-images'
  and (
    public.has_role((select auth.uid()), 'super_admin')
    or exists(
      select 1
      from public.business_members bm
      where bm.user_id=(select auth.uid())
        and bm.business_id::text=(storage.foldername(name))[1]
    )
  )
)
with check (
  bucket_id='catalog-images'
  and (
    public.has_role((select auth.uid()), 'super_admin')
    or exists(
      select 1
      from public.business_members bm
      where bm.user_id=(select auth.uid())
        and bm.business_id::text=(storage.foldername(name))[1]
    )
  )
);

create policy "members delete catalog images"
on storage.objects for delete
to authenticated
using (
  bucket_id='catalog-images'
  and (
    public.has_role((select auth.uid()), 'super_admin')
    or exists(
      select 1
      from public.business_members bm
      where bm.user_id=(select auth.uid())
        and bm.business_id::text=(storage.foldername(name))[1]
    )
  )
);
