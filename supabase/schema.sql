-- ============================================================================
-- Aurelia House catalog — Supabase schema, storage buckets, and RLS policies
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query)
-- ============================================================================

-- Extensions ------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ============================================================================
-- Tables
-- ============================================================================

create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  image_url   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text not null unique,
  description  text,
  price        numeric(12, 2) not null check (price >= 0),
  category_id  uuid references categories (id) on delete set null,
  images       text[] not null default '{}',
  sizes        text[] default '{}',
  colors       text[] default '{}',
  is_featured  boolean not null default false,
  is_available boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists products_category_id_idx on products (category_id);
create index if not exists products_is_available_idx on products (is_available);
create index if not exists products_is_featured_idx on products (is_featured);

-- One row per admin user, so we can distinguish admins from ordinary
-- authenticated users if you ever add customer accounts later.
create table if not exists profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  role       text not null default 'admin' check (role in ('admin', 'staff')),
  created_at timestamptz not null default now()
);

create table if not exists store_settings (
  id             uuid primary key default gen_random_uuid(),
  store_name     text not null default 'My Store',
  description    text,
  whatsapp_number text not null,
  email          text,
  address        text,
  logo_url       text,
  social_links   jsonb not null default '{}',
  updated_at     timestamptz not null default now()
);

-- Keep updated_at fresh automatically
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at before update on products
  for each row execute function set_updated_at();

drop trigger if exists trg_categories_updated_at on categories;
create trigger trg_categories_updated_at before update on categories
  for each row execute function set_updated_at();

drop trigger if exists trg_settings_updated_at on store_settings;
create trigger trg_settings_updated_at before update on store_settings
  for each row execute function set_updated_at();

-- Seed one settings row (edit the WhatsApp number for your business)
insert into store_settings (store_name, description, whatsapp_number, email, address)
select 'Aurelia House', 'Curated home & lifestyle goods.', '923001234567', 'hello@aureliahouse.pk', 'Blue Area, Islamabad, Pakistan'
where not exists (select 1 from store_settings);

-- ============================================================================
-- Row Level Security
-- ============================================================================
-- Design: the public (anon) role may only READ available products and all
-- categories/settings. Only rows in `profiles` (i.e. users who logged in and
-- were provisioned as admins) may write. Writing to `profiles` itself is
-- restricted to service-role only (done from the Supabase dashboard), so a
-- signed-up user can't grant themselves admin.

alter table categories      enable row level security;
alter table products        enable row level security;
alter table store_settings  enable row level security;
alter table profiles        enable row level security;

-- Helper: is the current JWT holder an admin?
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role in ('admin', 'staff')
  );
$$ language sql stable security definer;

-- Categories: public read, admin write
create policy "categories_public_read" on categories
  for select using (true);
create policy "categories_admin_write" on categories
  for insert with check (is_admin());
create policy "categories_admin_update" on categories
  for update using (is_admin()) with check (is_admin());
create policy "categories_admin_delete" on categories
  for delete using (is_admin());

-- Products: public read only available items, admin full access
create policy "products_public_read_available" on products
  for select using (is_available = true or is_admin());
create policy "products_admin_write" on products
  for insert with check (is_admin());
create policy "products_admin_update" on products
  for update using (is_admin()) with check (is_admin());
create policy "products_admin_delete" on products
  for delete using (is_admin());

-- Store settings: public read, admin write
create policy "settings_public_read" on store_settings
  for select using (true);
create policy "settings_admin_update" on store_settings
  for update using (is_admin()) with check (is_admin());

-- Profiles: a user may read their own profile only; no client-side inserts
-- (add admins via the Supabase dashboard's Table editor, or a server-side
-- script using the service-role key, never from the frontend).
create policy "profiles_self_read" on profiles
  for select using (auth.uid() = id);

-- ============================================================================
-- Storage buckets (run in SQL editor OR create via Dashboard > Storage)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('category-images', 'category-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('store-assets', 'store-assets', true)
on conflict (id) do nothing;

-- Public read for all three buckets, admin-only writes
create policy "public_read_product_images" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "admin_write_product_images" on storage.objects
  for insert with check (bucket_id = 'product-images' and is_admin());
create policy "admin_update_product_images" on storage.objects
  for update using (bucket_id = 'product-images' and is_admin());
create policy "admin_delete_product_images" on storage.objects
  for delete using (bucket_id = 'product-images' and is_admin());

create policy "public_read_category_images" on storage.objects
  for select using (bucket_id = 'category-images');
create policy "admin_write_category_images" on storage.objects
  for insert with check (bucket_id = 'category-images' and is_admin());
create policy "admin_update_category_images" on storage.objects
  for update using (bucket_id = 'category-images' and is_admin());
create policy "admin_delete_category_images" on storage.objects
  for delete using (bucket_id = 'category-images' and is_admin());

create policy "public_read_store_assets" on storage.objects
  for select using (bucket_id = 'store-assets');
create policy "admin_write_store_assets" on storage.objects
  for insert with check (bucket_id = 'store-assets' and is_admin());
create policy "admin_update_store_assets" on storage.objects
  for update using (bucket_id = 'store-assets' and is_admin());
create policy "admin_delete_store_assets" on storage.objects
  for delete using (bucket_id = 'store-assets' and is_admin());

-- ============================================================================
-- After running this file:
-- 1. Create your admin user under Authentication > Users (email + password).
-- 2. Insert a matching row into `profiles` with that user's id and
--    role = 'admin' (Table editor, or a one-off SQL insert using the id
--    shown in the Users list). This is what is_admin() checks.
-- 3. Insert your real products/categories, or adapt src/lib/sampleData.js
--    into INSERT statements.
-- ============================================================================
