-- =====================================================================
-- Plataforma de cardápios digitais — schema inicial
-- Postgres 15+ / Supabase
--
-- Princípios:
--  * Multi-tenant: todo dado privado pertence a um `establishment`.
--  * RLS em todas as tabelas expostas. O papel `service_role` (backend)
--    ignora RLS e é usado SOMENTE em rotas de servidor (webhooks, admin).
--  * Preços sempre em centavos (integer).
--  * Cardápio público lê apenas o snapshot publicado (menu_versions).
-- =====================================================================

create schema if not exists extensions;
create extension if not exists "pgcrypto" with schema extensions;
create extension if not exists "citext" with schema extensions;

-- ---------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------
create type public.member_role as enum ('owner', 'manager', 'editor');
create type public.template_tier as enum ('essential', 'premium');
create type public.billing_type as enum ('subscription', 'one_time');
create type public.subscription_status as enum ('pending', 'active', 'past_due', 'suspended', 'canceled', 'expired');
create type public.license_status as enum ('active', 'expired', 'revoked');
create type public.license_source as enum ('purchase', 'subscription', 'admin_grant');
create type public.payment_status as enum ('pending', 'approved', 'rejected', 'refunded', 'charged_back', 'canceled', 'in_process');
create type public.menu_status as enum ('draft', 'published', 'unpublished', 'suspended');
create type public.discount_type as enum ('percent', 'fixed');
create type public.support_status as enum ('open', 'in_progress', 'resolved', 'closed');

-- ---------------------------------------------------------------------
-- Utilidades
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at() returns trigger
language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------------
-- Usuários e papéis da plataforma
-- `users` = auth.users (Supabase Auth). `profiles` guarda dados públicos.
-- ---------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  blocked_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();

-- Papéis globais (administração da plataforma)
create table public.roles (
  id smallserial primary key,
  code text not null unique,          -- 'platform_admin', 'support'
  description text
);

create table public.permissions (
  id smallserial primary key,
  code text not null unique,          -- 'clients.manage', 'payments.read', ...
  description text
);

create table public.role_permissions (
  role_id smallint references public.roles (id) on delete cascade,
  permission_id smallint references public.permissions (id) on delete cascade,
  primary key (role_id, permission_id)
);

create table public.user_roles (
  user_id uuid references auth.users (id) on delete cascade,
  role_id smallint references public.roles (id) on delete cascade,
  granted_by uuid references auth.users (id) on delete set null,
  granted_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

-- Cria o perfil automaticamente no cadastro
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- Estabelecimentos (tenants)
-- ---------------------------------------------------------------------
create table public.establishments (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  description text,
  logo_url text,
  phone text,
  whatsapp text check (whatsapp is null or whatsapp ~ '^[0-9]{10,15}$'),
  address text,
  instagram text,
  social_links jsonb not null default '{}'::jsonb,
  opening_hours jsonb not null default '[]'::jsonb,
  extra_info text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger establishments_updated before update on public.establishments for each row execute function public.set_updated_at();

create table public.establishment_members (
  establishment_id uuid references public.establishments (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  role public.member_role not null default 'owner',
  created_at timestamptz not null default now(),
  primary key (establishment_id, user_id)
);
create index establishment_members_user_idx on public.establishment_members (user_id);

-- Funções auxiliares de autorização (security definer para evitar recursão em RLS)
create or replace function public.is_platform_admin(uid uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id
    where ur.user_id = uid and r.code = 'platform_admin'
  );
$$;

create or replace function public.is_member(est uuid, uid uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.establishment_members m where m.establishment_id = est and m.user_id = uid);
$$;

create or replace function public.member_role_of(est uuid, uid uuid default auth.uid()) returns public.member_role
language sql stable security definer set search_path = public as $$
  select role from public.establishment_members m where m.establishment_id = est and m.user_id = uid;
$$;

-- ---------------------------------------------------------------------
-- Planos, licenças, assinaturas e pagamentos
-- ---------------------------------------------------------------------
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,                -- 'essencial', 'premium', 'business'
  name text not null,
  description text,
  monthly_price_cents integer check (monthly_price_cents >= 0),
  one_time_price_cents integer check (one_time_price_cents >= 0),
  one_time_hosting_months integer not null default 12 check (one_time_hosting_months between 0 and 120),
  hosting_renewal_price_cents integer check (hosting_renewal_price_cents >= 0),
  max_published_menus integer not null default 1 check (max_published_menus >= 0),
  template_tier public.template_tier not null default 'essential',
  max_essential_templates integer,          -- null = sem limite
  features jsonb not null default '{}'::jsonb, -- {"whatsapp_orders":true,"analytics":true,...}
  provider_plan_ids jsonb not null default '{}'::jsonb, -- {"mercadopago":"2c938..."} (preapproval_plan)
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger plans_updated before update on public.plans for each row execute function public.set_updated_at();

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code extensions.citext not null unique,
  description text,
  discount_type public.discount_type not null,
  discount_value integer not null check (discount_value > 0),
  applies_to public.billing_type,           -- null = ambos
  plan_ids uuid[],                          -- null = todos
  max_redemptions integer,
  redemptions integer not null default 0,
  valid_from timestamptz,
  valid_until timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check (discount_type <> 'percent' or discount_value <= 100)
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments (id) on delete restrict,
  plan_id uuid not null references public.plans (id),
  status public.subscription_status not null default 'pending',
  price_cents integer not null,             -- preço contratado (congelado)
  provider text not null default 'mercadopago',
  provider_subscription_id text,
  coupon_id uuid references public.coupons (id),
  current_period_start timestamptz,
  current_period_end timestamptz,
  grace_until timestamptz,
  cancel_at_period_end boolean not null default false,
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_subscription_id)
);
create index subscriptions_est_idx on public.subscriptions (establishment_id, status);
create trigger subscriptions_updated before update on public.subscriptions for each row execute function public.set_updated_at();

create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments (id) on delete restrict,
  plan_id uuid not null references public.plans (id),
  kind text not null default 'license' check (kind in ('license', 'hosting_renewal', 'custom_service')),
  amount_cents integer not null check (amount_cents >= 0),
  coupon_id uuid references public.coupons (id),
  status public.payment_status not null default 'pending',
  provider text not null default 'mercadopago',
  provider_preference_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index purchases_est_idx on public.purchases (establishment_id);
create trigger purchases_updated before update on public.purchases for each row execute function public.set_updated_at();

-- Licença = direito de uso efetivo. Toda liberação de recurso passa por aqui.
create table public.licenses (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments (id) on delete cascade,
  plan_id uuid not null references public.plans (id),
  source public.license_source not null,
  purchase_id uuid references public.purchases (id),
  subscription_id uuid references public.subscriptions (id),
  status public.license_status not null default 'active',
  starts_at timestamptz not null default now(),
  hosting_until timestamptz,                -- null = enquanto a assinatura estiver ativa
  limits_override jsonb,                    -- ajustes manuais do admin
  notes text,
  granted_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index licenses_est_idx on public.licenses (establishment_id, status);
create trigger licenses_updated before update on public.licenses for each row execute function public.set_updated_at();

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid references public.establishments (id) on delete set null,
  purchase_id uuid references public.purchases (id),
  subscription_id uuid references public.subscriptions (id),
  provider text not null default 'mercadopago',
  provider_payment_id text not null,
  status public.payment_status not null,
  status_detail text,
  amount_cents integer not null,
  refunded_cents integer not null default 0,
  method text,                               -- 'credit_card', 'pix', ...
  paid_at timestamptz,
  raw jsonb,                                 -- resposta da API do provedor (sem dados de cartão)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_payment_id)
);
create index payments_est_idx on public.payments (establishment_id, created_at desc);
create index payments_status_idx on public.payments (status, created_at desc);
create trigger payments_updated before update on public.payments for each row execute function public.set_updated_at();

-- Eventos de webhook — idempotência garantida pela chave única
create table public.payment_events (
  id bigserial primary key,
  provider text not null,
  event_id text not null,
  event_type text,
  resource_id text,
  payload jsonb not null,
  signature_valid boolean not null,
  processed_at timestamptz,
  error text,
  received_at timestamptz not null default now(),
  unique (provider, event_id)
);

-- ---------------------------------------------------------------------
-- Modelos e cardápios
-- ---------------------------------------------------------------------
create table public.menu_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,60}$'),
  name text not null,
  segment text not null,
  description text,
  preview_image_url text,
  tier public.template_tier not null default 'essential',
  version integer not null default 1,
  default_theme jsonb not null,
  demo_document jsonb not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger menu_templates_updated before update on public.menu_templates for each row execute function public.set_updated_at();

create table public.menus (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments (id) on delete cascade,
  template_id uuid not null references public.menu_templates (id),
  template_version integer not null,          -- versão do modelo no momento da cópia
  name text not null,
  slug extensions.citext not null unique check (slug ~ '^[a-z0-9](?:[a-z0-9-]{1,58}[a-z0-9])$'),
  status public.menu_status not null default 'draft',
  settings jsonb not null default '{"whatsappOrders":false,"whatsappButton":true,"showSearch":true}'::jsonb,
  published_version_id uuid,                  -- fk adicionada abaixo
  published_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index menus_est_idx on public.menus (establishment_id) where deleted_at is null;
create trigger menus_updated before update on public.menus for each row execute function public.set_updated_at();

-- Slugs antigos continuam redirecionando para o cardápio
create table public.menu_slug_history (
  slug extensions.citext primary key,
  menu_id uuid not null references public.menus (id) on delete cascade,
  replaced_at timestamptz not null default now()
);

create table public.menu_themes (
  menu_id uuid primary key references public.menus (id) on delete cascade,
  theme jsonb not null,                      -- ThemeConfig (cores, fontes, layout)
  updated_at timestamptz not null default now()
);
create trigger menu_themes_updated before update on public.menu_themes for each row execute function public.set_updated_at();

create table public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references public.menus (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  description text,
  position integer not null default 0,
  is_hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index menu_categories_menu_idx on public.menu_categories (menu_id, position);
create trigger menu_categories_updated before update on public.menu_categories for each row execute function public.set_updated_at();

create table public.menu_products (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references public.menus (id) on delete cascade,
  category_id uuid not null references public.menu_categories (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  description text check (description is null or char_length(description) <= 600),
  price_cents integer not null check (price_cents >= 0),
  promo_price_cents integer check (promo_price_cents is null or promo_price_cents >= 0),
  image_url text,
  ingredients text[],
  notes text,
  tags text[],
  allergens text[],
  is_featured boolean not null default false,
  is_available boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index menu_products_cat_idx on public.menu_products (category_id, position);
create index menu_products_menu_idx on public.menu_products (menu_id);
create trigger menu_products_updated before update on public.menu_products for each row execute function public.set_updated_at();

create table public.product_variations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.menu_products (id) on delete cascade,
  name text not null,
  price_cents integer not null check (price_cents >= 0),
  position integer not null default 0
);
create index product_variations_product_idx on public.product_variations (product_id);

create table public.product_addons (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.menu_products (id) on delete cascade,
  name text not null,
  price_cents integer not null check (price_cents >= 0),
  position integer not null default 0
);
create index product_addons_product_idx on public.product_addons (product_id);

-- Snapshots publicados (o que o público vê) + histórico para restauração
create table public.menu_versions (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references public.menus (id) on delete cascade,
  version_number integer not null,
  document jsonb not null,                   -- MenuDocument completo
  theme jsonb not null,                      -- ThemeConfig
  template_slug text not null,
  published_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (menu_id, version_number)
);
alter table public.menus
  add constraint menus_published_version_fk
  foreign key (published_version_id) references public.menu_versions (id) on delete set null;

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments (id) on delete cascade,
  bucket text not null default 'menu-media',
  path text not null,                        -- <establishment_id>/<uuid>.webp
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp', 'image/avif')),
  size_bytes integer not null check (size_bytes > 0 and size_bytes <= 5242880),
  width integer,
  height integer,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (bucket, path)
);
create index media_assets_est_idx on public.media_assets (establishment_id);

-- QR Code: código curto permanente que redireciona para o slug atual
create table public.qr_codes (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references public.menus (id) on delete cascade,
  code text not null unique check (code ~ '^[A-Za-z0-9]{6,12}$'),
  style jsonb not null default '{}'::jsonb,  -- cores, margem, logotipo central
  scans integer not null default 0,
  created_at timestamptz not null default now()
);
create unique index qr_codes_menu_unique on public.qr_codes (menu_id);

-- Visualizações (bruto, com retenção curta) e agregado diário
create table public.menu_views (
  id bigserial primary key,
  menu_id uuid not null references public.menus (id) on delete cascade,
  viewed_at timestamptz not null default now(),
  source text check (source in ('qr', 'link', 'whatsapp', 'other')),
  device text check (device in ('mobile', 'tablet', 'desktop')),
  visitor_hash text                          -- hash diário anônimo (sem IP armazenado)
);
create index menu_views_menu_time_idx on public.menu_views (menu_id, viewed_at desc);

create table public.menu_views_daily (
  menu_id uuid references public.menus (id) on delete cascade,
  day date not null,
  views integer not null default 0,
  unique_visitors integer not null default 0,
  qr_views integer not null default 0,
  primary key (menu_id, day)
);

-- ---------------------------------------------------------------------
-- Suporte e auditoria
-- ---------------------------------------------------------------------
create table public.support_requests (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid references public.establishments (id) on delete set null,
  user_id uuid references auth.users (id) on delete set null,
  name text not null,
  email extensions.citext not null,
  subject text not null,
  message text not null check (char_length(message) between 10 and 5000),
  status public.support_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger support_requests_updated before update on public.support_requests for each row execute function public.set_updated_at();

create table public.audit_logs (
  id bigserial primary key,
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,                      -- 'license.grant', 'plan.update', 'client.block', ...
  target_type text,
  target_id text,
  establishment_id uuid references public.establishments (id) on delete set null,
  before jsonb,
  after jsonb,
  ip inet,
  created_at timestamptz not null default now()
);
create index audit_logs_time_idx on public.audit_logs (created_at desc);
create index audit_logs_target_idx on public.audit_logs (target_type, target_id);

-- Configurações globais editáveis pelo admin (tolerância, etc.)
create table public.platform_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.user_roles enable row level security;
alter table public.establishments enable row level security;
alter table public.establishment_members enable row level security;
alter table public.plans enable row level security;
alter table public.coupons enable row level security;
alter table public.subscriptions enable row level security;
alter table public.purchases enable row level security;
alter table public.licenses enable row level security;
alter table public.payments enable row level security;
alter table public.payment_events enable row level security;
alter table public.menu_templates enable row level security;
alter table public.menus enable row level security;
alter table public.menu_slug_history enable row level security;
alter table public.menu_themes enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_products enable row level security;
alter table public.product_variations enable row level security;
alter table public.product_addons enable row level security;
alter table public.menu_versions enable row level security;
alter table public.media_assets enable row level security;
alter table public.qr_codes enable row level security;
alter table public.menu_views enable row level security;
alter table public.menu_views_daily enable row level security;
alter table public.support_requests enable row level security;
alter table public.audit_logs enable row level security;
alter table public.platform_settings enable row level security;

-- Perfis: o próprio usuário; admin vê todos
create policy profiles_self_read on public.profiles for select using (id = auth.uid() or public.is_platform_admin());
create policy profiles_self_update on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

-- Papéis: leitura apenas do próprio vínculo; escrita só via service_role
create policy user_roles_self_read on public.user_roles for select using (user_id = auth.uid() or public.is_platform_admin());
create policy roles_admin_read on public.roles for select using (public.is_platform_admin());
create policy permissions_admin_read on public.permissions for select using (public.is_platform_admin());
create policy role_permissions_admin_read on public.role_permissions for select using (public.is_platform_admin());

-- Estabelecimentos
create policy est_member_read on public.establishments for select using (public.is_member(id) or public.is_platform_admin());
create policy est_insert on public.establishments for insert with check (created_by = auth.uid());
create policy est_owner_update on public.establishments for update
  using (public.member_role_of(id) in ('owner', 'manager')) with check (public.member_role_of(id) in ('owner', 'manager'));

create policy members_read on public.establishment_members for select using (public.is_member(establishment_id) or public.is_platform_admin());
-- O criador do estabelecimento entra como owner (primeiro vínculo); demais vínculos via backend
create policy members_bootstrap on public.establishment_members for insert with check (
  user_id = auth.uid() and role = 'owner'
  and exists (select 1 from public.establishments e where e.id = establishment_id and e.created_by = auth.uid())
  and not exists (select 1 from public.establishment_members m where m.establishment_id = establishment_members.establishment_id)
);

-- Catálogo comercial: leitura pública do que está ativo
create policy plans_public_read on public.plans for select using (is_active or public.is_platform_admin());
create policy templates_public_read on public.menu_templates for select using (is_active or public.is_platform_admin());
create policy coupons_admin_read on public.coupons for select using (public.is_platform_admin());

-- Financeiro: membros leem o próprio; escrita somente pelo backend (service_role)
create policy subs_member_read on public.subscriptions for select using (public.is_member(establishment_id) or public.is_platform_admin());
create policy purchases_member_read on public.purchases for select using (public.is_member(establishment_id) or public.is_platform_admin());
create policy licenses_member_read on public.licenses for select using (public.is_member(establishment_id) or public.is_platform_admin());
create policy payments_member_read on public.payments for select using (public.is_member(establishment_id) or public.is_platform_admin());
-- payment_events: sem políticas => inacessível a clientes (apenas service_role)

-- Cardápios: membros editam; leitura pública passa pela view published_menus
create policy menus_member_read on public.menus for select using (public.is_member(establishment_id) or public.is_platform_admin());
create policy menus_member_write on public.menus for update
  using (public.is_member(establishment_id)) with check (public.is_member(establishment_id));
-- criação de cardápios e publicação: somente via backend, que verifica a licença

create policy themes_member_all on public.menu_themes for all
  using (exists (select 1 from public.menus m where m.id = menu_id and public.is_member(m.establishment_id)))
  with check (exists (select 1 from public.menus m where m.id = menu_id and public.is_member(m.establishment_id)));

create policy categories_member_all on public.menu_categories for all
  using (exists (select 1 from public.menus m where m.id = menu_id and public.is_member(m.establishment_id)))
  with check (exists (select 1 from public.menus m where m.id = menu_id and public.is_member(m.establishment_id)));

create policy products_member_all on public.menu_products for all
  using (exists (select 1 from public.menus m where m.id = menu_id and public.is_member(m.establishment_id)))
  with check (
    exists (select 1 from public.menus m where m.id = menu_id and public.is_member(m.establishment_id))
    and exists (select 1 from public.menu_categories c where c.id = category_id and c.menu_id = menu_products.menu_id)
  );

create policy variations_member_all on public.product_variations for all
  using (exists (select 1 from public.menu_products p join public.menus m on m.id = p.menu_id where p.id = product_id and public.is_member(m.establishment_id)))
  with check (exists (select 1 from public.menu_products p join public.menus m on m.id = p.menu_id where p.id = product_id and public.is_member(m.establishment_id)));

create policy addons_member_all on public.product_addons for all
  using (exists (select 1 from public.menu_products p join public.menus m on m.id = p.menu_id where p.id = product_id and public.is_member(m.establishment_id)))
  with check (exists (select 1 from public.menu_products p join public.menus m on m.id = p.menu_id where p.id = product_id and public.is_member(m.establishment_id)));

create policy versions_member_read on public.menu_versions for select
  using (exists (select 1 from public.menus m where m.id = menu_id and (public.is_member(m.establishment_id) or public.is_platform_admin())));

create policy media_member_read on public.media_assets for select using (public.is_member(establishment_id));
create policy media_member_delete on public.media_assets for delete using (public.is_member(establishment_id));

create policy qr_member_read on public.qr_codes for select
  using (exists (select 1 from public.menus m where m.id = menu_id and public.is_member(m.establishment_id)));
create policy qr_member_update on public.qr_codes for update
  using (exists (select 1 from public.menus m where m.id = menu_id and public.is_member(m.establishment_id)));

create policy views_daily_member_read on public.menu_views_daily for select
  using (exists (select 1 from public.menus m where m.id = menu_id and (public.is_member(m.establishment_id) or public.is_platform_admin())));
-- menu_views (bruto): apenas service_role grava e lê

create policy support_own_read on public.support_requests for select using (user_id = auth.uid() or public.is_platform_admin());
create policy support_insert on public.support_requests for insert with check (user_id is null or user_id = auth.uid());

create policy audit_admin_read on public.audit_logs for select using (public.is_platform_admin());
create policy settings_admin_read on public.platform_settings for select using (public.is_platform_admin());

-- =====================================================================
-- Leitura pública do cardápio publicado
-- Função security definer: devolve somente o snapshot, e só se o cardápio
-- estiver publicado e o estabelecimento tiver licença válida (com tolerância).
-- =====================================================================
create or replace function public.establishment_has_hosting(est uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.licenses l
    left join public.subscriptions s on s.id = l.subscription_id
    where l.establishment_id = est
      and l.status = 'active'
      and l.starts_at <= now()
      and (
        (l.source = 'subscription' and s.status in ('active', 'past_due')
           and (s.status = 'active' or coalesce(s.grace_until, now()) >= now()))
        or (l.source <> 'subscription' and (l.hosting_until is null or l.hosting_until >= now()))
      )
  );
$$;

create or replace function public.get_published_menu(p_slug text)
returns table (menu_id uuid, slug text, template_slug text, document jsonb, theme jsonb, available boolean, redirect_to text)
language plpgsql stable security definer set search_path = public, extensions as $$
declare
  m public.menus%rowtype;
begin
  select * into m from public.menus where menus.slug = p_slug and deleted_at is null;
  if not found then
    -- slug antigo? devolve o atual para redirecionamento 308
    return query
      select null::uuid, null::text, null::text, null::jsonb, null::jsonb, false, cur.slug::text
      from public.menu_slug_history h join public.menus cur on cur.id = h.menu_id
      where h.slug = p_slug and cur.deleted_at is null;
    return;
  end if;
  return query
    select m.id, m.slug::text, v.template_slug, v.document, v.theme,
           (m.status = 'published' and public.establishment_has_hosting(m.establishment_id)), null::text
    from public.menu_versions v
    where v.id = m.published_version_id;
end $$;

grant execute on function public.get_published_menu(text) to anon, authenticated;

-- =====================================================================
-- Storage: bucket público para imagens dos cardápios.
-- Upload é feito pelo backend após validação (tipo, tamanho, dimensões)
-- e conversão para WebP; clientes não escrevem direto no bucket.
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('menu-media', 'menu-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;
