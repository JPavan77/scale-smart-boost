create type public.business_type as enum ('products','services','both');
create type public.app_role as enum ('super_admin');

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  subtitle text,
  description text,
  primary_color text not null default '#294a41',
  accent_color text not null default '#f4c96b',
  logo_url text,
  type public.business_type not null default 'both',
  whatsapp text,
  business_hours text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0
);

create table public.items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  description text,
  price numeric(12,2),
  duration_minutes integer,
  image_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create table public.item_variants (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  name text not null,
  price numeric(12,2)
);

create table public.business_members (
  user_id uuid not null references auth.users(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  primary key(user_id,business_id)
);

create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  primary key(user_id,role)
);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.user_roles where user_id=_user_id and role=_role)
$$;

alter table public.businesses enable row level security;
alter table public.categories enable row level security;
alter table public.items enable row level security;
alter table public.item_variants enable row level security;
alter table public.business_members enable row level security;
alter table public.user_roles enable row level security;

create policy "public active businesses" on public.businesses for select using (is_active);
create policy "public active items" on public.items for select using (is_active and exists(select 1 from public.businesses b where b.id=business_id and b.is_active));
create policy "public categories" on public.categories for select using (exists(select 1 from public.businesses b where b.id=business_id and b.is_active));
create policy "public variants" on public.item_variants for select using (exists(select 1 from public.items i join public.businesses b on b.id=i.business_id where i.id=item_id and i.is_active and b.is_active));

create policy "member business update" on public.businesses for update using (
  exists(select 1 from public.business_members bm where bm.business_id=id and bm.user_id=auth.uid())
  or public.has_role(auth.uid(),'super_admin')
);

create policy "member categories" on public.categories for all using (
  exists(select 1 from public.business_members bm where bm.business_id=business_id and bm.user_id=auth.uid())
  or public.has_role(auth.uid(),'super_admin')
) with check (
  exists(select 1 from public.business_members bm where bm.business_id=business_id and bm.user_id=auth.uid())
  or public.has_role(auth.uid(),'super_admin')
);

create policy "member items" on public.items for all using (
  exists(select 1 from public.business_members bm where bm.business_id=business_id and bm.user_id=auth.uid())
  or public.has_role(auth.uid(),'super_admin')
) with check (
  exists(select 1 from public.business_members bm where bm.business_id=business_id and bm.user_id=auth.uid())
  or public.has_role(auth.uid(),'super_admin')
);

create policy "member variants" on public.item_variants for all using (
  exists(select 1 from public.items i join public.business_members bm on bm.business_id=i.business_id where i.id=item_id and bm.user_id=auth.uid())
  or public.has_role(auth.uid(),'super_admin')
) with check (
  exists(select 1 from public.items i join public.business_members bm on bm.business_id=i.business_id where i.id=item_id and bm.user_id=auth.uid())
  or public.has_role(auth.uid(),'super_admin')
);

create policy "admin businesses" on public.businesses for all using (public.has_role(auth.uid(),'super_admin')) with check (public.has_role(auth.uid(),'super_admin'));
create policy "admin members" on public.business_members for all using (public.has_role(auth.uid(),'super_admin')) with check (public.has_role(auth.uid(),'super_admin'));
create policy "own memberships" on public.business_members for select using (user_id=auth.uid() or public.has_role(auth.uid(),'super_admin'));
create policy "own roles" on public.user_roles for select using (user_id=auth.uid() or public.has_role(auth.uid(),'super_admin'));

insert into storage.buckets(id,name,public) values('catalog-images','catalog-images',true) on conflict (id) do nothing;

insert into public.businesses(slug,name,subtitle,description,primary_color,accent_color,type,whatsapp,business_hours,is_active)
values('barbearia-do-ze','Barbearia do Zé','Cortes, barba e cuidado sem enrolação.','Atendimento de bairro com acabamento de respeito. Escolha seu serviço e envie o pedido pelo WhatsApp.','#294a41','#f4c96b','services','5511999999999','Hoje até 19h',true);
