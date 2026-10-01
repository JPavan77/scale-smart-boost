create type public.business_type as enum ('products','services','both');
create type public.app_role as enum ('super_admin');

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
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
  sort_order integer not null default 0,
  unique (business_id, name)
);

create table public.items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  description text,
  price numeric(12,2) check (price is null or price >= 0),
  duration_minutes integer check (duration_minutes is null or duration_minutes >= 0),
  image_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.item_variants (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  name text not null,
  price numeric(12,2) check (price is null or price >= 0)
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

create index categories_business_idx on public.categories(business_id, sort_order);
create index items_business_idx on public.items(business_id, sort_order);
create index item_variants_item_idx on public.item_variants(item_id);
create index business_members_user_idx on public.business_members(user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select exists(
    select 1 from public.user_roles
    where user_id=_user_id and role=_role
  )
$$;

alter table public.businesses enable row level security;
alter table public.categories enable row level security;
alter table public.items enable row level security;
alter table public.item_variants enable row level security;
alter table public.business_members enable row level security;
alter table public.user_roles enable row level security;

-- Público: somente catálogos ativos.
create policy "public active businesses"
on public.businesses for select
using (is_active);

create policy "public categories"
on public.categories for select
using (
  exists(
    select 1 from public.businesses b
    where b.id=business_id and b.is_active
  )
);

create policy "public active items"
on public.items for select
using (
  is_active and exists(
    select 1 from public.businesses b
    where b.id=business_id and b.is_active
  )
);

create policy "public variants"
on public.item_variants for select
using (
  exists(
    select 1
    from public.items i
    join public.businesses b on b.id=i.business_id
    where i.id=item_id and i.is_active and b.is_active
  )
);

-- Dono: lê e altera somente a própria empresa.
create policy "members read own businesses"
on public.businesses for select
using (
  exists(
    select 1 from public.business_members bm
    where bm.business_id=id and bm.user_id=auth.uid()
  )
  or public.has_role(auth.uid(),'super_admin')
);

create policy "members update own business"
on public.businesses for update
using (
  exists(
    select 1 from public.business_members bm
    where bm.business_id=id and bm.user_id=auth.uid()
  )
  or public.has_role(auth.uid(),'super_admin')
)
with check (
  exists(
    select 1 from public.business_members bm
    where bm.business_id=id and bm.user_id=auth.uid()
  )
  or public.has_role(auth.uid(),'super_admin')
);

create or replace function public.protect_business_admin_fields()
returns trigger
language plpgsql
security definer
set search_path=public
as $
begin
  if public.has_role(auth.uid(),'super_admin') then
    return new;
  end if;

  if new.slug is distinct from old.slug
    or new.name is distinct from old.name
    or new.subtitle is distinct from old.subtitle
    or new.primary_color is distinct from old.primary_color
    or new.accent_color is distinct from old.accent_color
    or new.logo_url is distinct from old.logo_url
    or new.type is distinct from old.type
    or new.is_active is distinct from old.is_active then
    raise exception 'Somente o super admin pode alterar identidade, tipo, link ou status da empresa.';
  end if;

  return new;
end
$;

create trigger protect_business_admin_fields_before_update
before update on public.businesses
for each row execute function public.protect_business_admin_fields();

create policy "members read categories"
on public.categories for select
using (
  exists(
    select 1 from public.business_members bm
    where bm.business_id=business_id and bm.user_id=auth.uid()
  )
  or public.has_role(auth.uid(),'super_admin')
);

create policy "members manage categories"
on public.categories for all
using (
  exists(
    select 1 from public.business_members bm
    where bm.business_id=business_id and bm.user_id=auth.uid()
  )
  or public.has_role(auth.uid(),'super_admin')
)
with check (
  exists(
    select 1 from public.business_members bm
    where bm.business_id=business_id and bm.user_id=auth.uid()
  )
  or public.has_role(auth.uid(),'super_admin')
);

create policy "members read items"
on public.items for select
using (
  exists(
    select 1 from public.business_members bm
    where bm.business_id=business_id and bm.user_id=auth.uid()
  )
  or public.has_role(auth.uid(),'super_admin')
);

create policy "members manage items"
on public.items for all
using (
  exists(
    select 1 from public.business_members bm
    where bm.business_id=business_id and bm.user_id=auth.uid()
  )
  or public.has_role(auth.uid(),'super_admin')
)
with check (
  exists(
    select 1 from public.business_members bm
    where bm.business_id=business_id and bm.user_id=auth.uid()
  )
  or public.has_role(auth.uid(),'super_admin')
);

create policy "members read variants"
on public.item_variants for select
using (
  exists(
    select 1
    from public.items i
    join public.business_members bm on bm.business_id=i.business_id
    where i.id=item_id and bm.user_id=auth.uid()
  )
  or public.has_role(auth.uid(),'super_admin')
);

create policy "members manage variants"
on public.item_variants for all
using (
  exists(
    select 1
    from public.items i
    join public.business_members bm on bm.business_id=i.business_id
    where i.id=item_id and bm.user_id=auth.uid()
  )
  or public.has_role(auth.uid(),'super_admin')
)
with check (
  exists(
    select 1
    from public.items i
    join public.business_members bm on bm.business_id=i.business_id
    where i.id=item_id and bm.user_id=auth.uid()
  )
  or public.has_role(auth.uid(),'super_admin')
);

-- Super admin: cadastro completo e vínculos.
create policy "admin insert businesses"
on public.businesses for insert
with check (public.has_role(auth.uid(),'super_admin'));

create policy "admin delete businesses"
on public.businesses for delete
using (public.has_role(auth.uid(),'super_admin'));

create policy "admin members"
on public.business_members for all
using (public.has_role(auth.uid(),'super_admin'))
with check (public.has_role(auth.uid(),'super_admin'));

create policy "own memberships"
on public.business_members for select
using (
  user_id=auth.uid()
  or public.has_role(auth.uid(),'super_admin')
);

create policy "own roles"
on public.user_roles for select
using (
  user_id=auth.uid()
  or public.has_role(auth.uid(),'super_admin')
);

create policy "admin roles"
on public.user_roles for all
using (public.has_role(auth.uid(),'super_admin'))
with check (public.has_role(auth.uid(),'super_admin'));

-- Imagens públicas, gravação restrita ao diretório da empresa.
insert into storage.buckets(id,name,public)
values('catalog-images','catalog-images',true)
on conflict (id) do update set public=true;

create policy "catalog images public read"
on storage.objects for select
using (bucket_id='catalog-images');

create policy "members upload catalog images"
on storage.objects for insert
with check (
  bucket_id='catalog-images'
  and (
    public.has_role(auth.uid(),'super_admin')
    or exists(
      select 1 from public.business_members bm
      where bm.user_id=auth.uid()
        and bm.business_id::text=(storage.foldername(name))[1]
    )
  )
);

create policy "members update catalog images"
on storage.objects for update
using (
  bucket_id='catalog-images'
  and (
    public.has_role(auth.uid(),'super_admin')
    or exists(
      select 1 from public.business_members bm
      where bm.user_id=auth.uid()
        and bm.business_id::text=(storage.foldername(name))[1]
    )
  )
);

create policy "members delete catalog images"
on storage.objects for delete
using (
  bucket_id='catalog-images'
  and (
    public.has_role(auth.uid(),'super_admin')
    or exists(
      select 1 from public.business_members bm
      where bm.user_id=auth.uid()
        and bm.business_id::text=(storage.foldername(name))[1]
    )
  )
);

-- Empresa de demonstração.
insert into public.businesses(
  slug,name,subtitle,description,primary_color,accent_color,type,whatsapp,business_hours,is_active
) values (
  'barbearia-do-ze',
  'Barbearia do Zé',
  'Cortes, barba e cuidado sem enrolação.',
  'Atendimento de bairro com acabamento de respeito. Escolha seu serviço e envie o pedido pelo WhatsApp.',
  '#294a41',
  '#f4c96b',
  'services',
  '5511999999999',
  'Hoje até 19h',
  true
);

insert into public.categories(business_id,name,sort_order)
select id,'Cortes',1 from public.businesses where slug='barbearia-do-ze';
insert into public.categories(business_id,name,sort_order)
select id,'Barba',2 from public.businesses where slug='barbearia-do-ze';
insert into public.categories(business_id,name,sort_order)
select id,'Combos',3 from public.businesses where slug='barbearia-do-ze';
insert into public.categories(business_id,name,sort_order)
select id,'Especiais',4 from public.businesses where slug='barbearia-do-ze';

insert into public.items(business_id,category_id,name,description,price,duration_minutes,image_url,is_active,sort_order)
select b.id,c.id,'Corte clássico','Tesoura e máquina, acabamento e finalização.',45,45,'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=80',true,1
from public.businesses b join public.categories c on c.business_id=b.id and c.name='Cortes'
where b.slug='barbearia-do-ze';

insert into public.items(business_id,category_id,name,description,price,duration_minutes,image_url,is_active,sort_order)
select b.id,c.id,'Corte + barba','Pacote completo para sair pronto.',75,75,'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80',true,2
from public.businesses b join public.categories c on c.business_id=b.id and c.name='Combos'
where b.slug='barbearia-do-ze';

insert into public.items(business_id,category_id,name,description,price,duration_minutes,image_url,is_active,sort_order)
select b.id,c.id,'Barba completa','Desenho, acabamento e hidratação.',35,30,'https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?auto=format&fit=crop&w=900&q=80',true,3
from public.businesses b join public.categories c on c.business_id=b.id and c.name='Barba'
where b.slug='barbearia-do-ze';

insert into public.items(business_id,category_id,name,description,price,duration_minutes,image_url,is_active,sort_order)
select b.id,c.id,'Acabamento','Pezinho e contorno para segurar o corte por mais tempo.',20,15,'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&q=80',true,4
from public.businesses b join public.categories c on c.business_id=b.id and c.name='Cortes'
where b.slug='barbearia-do-ze';

insert into public.items(business_id,category_id,name,description,price,duration_minutes,image_url,is_active,sort_order)
select b.id,c.id,'Dia do noivo','Atendimento especial com horário reservado e preparação completa.',null,120,'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=80',true,5
from public.businesses b join public.categories c on c.business_id=b.id and c.name='Especiais'
where b.slug='barbearia-do-ze';

insert into public.item_variants(item_id,name,price)
select id,'Tradicional',null from public.items where name='Corte clássico'
union all
select id,'Degradê',55 from public.items where name='Corte clássico'
union all
select id,'Tradicional',null from public.items where name='Corte + barba'
union all
select id,'Toalha quente',85 from public.items where name='Corte + barba';
