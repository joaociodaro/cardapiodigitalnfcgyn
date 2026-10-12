-- Testes de isolamento entre estabelecimentos (multi-tenant) e de leitura
-- pública. Falha com exceção se alguma regra for violada.
\set ON_ERROR_STOP on

-- Dados de teste (como superusuário)
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000000a', 'ana@teste.dev', '{"full_name":"Ana"}'),
  ('00000000-0000-0000-0000-00000000000b', 'bruno@teste.dev', '{"full_name":"Bruno"}'),
  ('00000000-0000-0000-0000-0000000000ad', 'admin@teste.dev', '{"full_name":"Admin"}');

insert into public.user_roles (user_id, role_id)
select '00000000-0000-0000-0000-0000000000ad', id from public.roles where code = 'platform_admin';

insert into public.establishments (id, name, created_by) values
  ('10000000-0000-0000-0000-00000000000a', 'Restaurante da Ana', '00000000-0000-0000-0000-00000000000a'),
  ('10000000-0000-0000-0000-00000000000b', 'Bar do Bruno', '00000000-0000-0000-0000-00000000000b');
insert into public.establishment_members values
  ('10000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-00000000000a', 'owner', now()),
  ('10000000-0000-0000-0000-00000000000b', '00000000-0000-0000-0000-00000000000b', 'owner', now());

insert into public.menus (id, establishment_id, template_id, template_version, name, slug, status)
select '20000000-0000-0000-0000-00000000000a', '10000000-0000-0000-0000-00000000000a', id, 1, 'Cardápio Ana', 'restaurante-da-ana', 'published'
from public.menu_templates where slug = 'royal-gold';
insert into public.menus (id, establishment_id, template_id, template_version, name, slug)
select '20000000-0000-0000-0000-00000000000b', '10000000-0000-0000-0000-00000000000b', id, 1, 'Cardápio Bruno', 'bar-do-bruno'
from public.menu_templates where slug = 'velvet-lounge';

insert into public.menu_categories (id, menu_id, name) values
  ('30000000-0000-0000-0000-00000000000a', '20000000-0000-0000-0000-00000000000a', 'Entradas'),
  ('30000000-0000-0000-0000-00000000000b', '20000000-0000-0000-0000-00000000000b', 'Drinks');

insert into public.menu_versions (id, menu_id, version_number, document, theme, template_slug)
values ('40000000-0000-0000-0000-00000000000a', '20000000-0000-0000-0000-00000000000a', 1, '{"establishment":{"name":"Ana"}}', '{}', 'royal-gold');
update public.menus set published_version_id = '40000000-0000-0000-0000-00000000000a' where id = '20000000-0000-0000-0000-00000000000a';

insert into public.licenses (establishment_id, plan_id, source, hosting_until)
select '10000000-0000-0000-0000-00000000000a', id, 'purchase', now() + interval '12 months' from public.plans where code = 'premium';

-- ------------------------------------------------------------------
-- 1. Ana só enxerga os próprios dados
-- ------------------------------------------------------------------
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', false);

do $$
begin
  if (select count(*) from public.establishments) <> 1 then raise exception 'Ana deveria ver 1 estabelecimento'; end if;
  if (select count(*) from public.menus) <> 1 then raise exception 'Ana deveria ver 1 cardápio'; end if;
  if exists (select 1 from public.menu_categories where menu_id = '20000000-0000-0000-0000-00000000000b') then
    raise exception 'Ana não pode ler categorias do Bruno';
  end if;
  if (select count(*) from public.payment_events) <> 0 then raise exception 'payment_events deve ser invisível'; end if;
end $$;

-- 2. Ana não consegue gravar no cardápio do Bruno
do $$
begin
  begin
    insert into public.menu_categories (menu_id, name) values ('20000000-0000-0000-0000-00000000000b', 'Invasão');
    raise exception 'FALHA: insert em cardápio alheio foi permitido';
  exception when insufficient_privilege then null;
  end;
  update public.menus set name = 'hackeado' where id = '20000000-0000-0000-0000-00000000000b';
  if found then raise exception 'FALHA: update em cardápio alheio foi permitido'; end if;
end $$;

-- 3. Ana não move produto para categoria de outro cardápio
do $$
begin
  begin
    insert into public.menu_products (menu_id, category_id, name, price_cents)
    values ('20000000-0000-0000-0000-00000000000a', '30000000-0000-0000-0000-00000000000b', 'x', 100);
    raise exception 'FALHA: produto em categoria de outro cardápio';
  exception when insufficient_privilege then null;
  end;
end $$;

-- 4. Cliente não concede licença a si mesmo
do $$
begin
  begin
    insert into public.licenses (establishment_id, plan_id, source)
    select '10000000-0000-0000-0000-00000000000a', id, 'admin_grant' from public.plans limit 1;
    raise exception 'FALHA: cliente criou licença';
  exception when insufficient_privilege then null;
  end;
end $$;

-- 4b. …mas edita normalmente o próprio cardápio
do $$
begin
  insert into public.menu_categories (menu_id, name) values ('20000000-0000-0000-0000-00000000000a', 'Sobremesas');
  update public.menus set name = 'Cardápio da Ana' where id = '20000000-0000-0000-0000-00000000000a';
  if not found then raise exception 'Ana deveria conseguir editar o próprio cardápio'; end if;
end $$;

-- ------------------------------------------------------------------
-- 5. Admin enxerga tudo
-- ------------------------------------------------------------------
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000ad', false);
do $$
begin
  if (select count(*) from public.establishments) <> 2 then raise exception 'Admin deveria ver 2 estabelecimentos'; end if;
end $$;

-- ------------------------------------------------------------------
-- 6. Visitante anônimo: só o snapshot publicado, via função
-- ------------------------------------------------------------------
reset role;
set role anon;
select set_config('request.jwt.claim.sub', '', false);
do $$
declare r record;
begin
  begin
    perform count(*) from public.menus;
    raise exception 'FALHA: anon conseguiu consultar menus';
  exception when insufficient_privilege then null;  -- negado explicitamente
  end;
  select * into r from public.get_published_menu('restaurante-da-ana');
  if r.available is not true then raise exception 'cardápio da Ana deveria estar disponível'; end if;
  select * into r from public.get_published_menu('bar-do-bruno');
  if r.document is not null then raise exception 'rascunho do Bruno não pode vazar'; end if;
end $$;
reset role;

-- 7. Licença expirada tira o cardápio do ar sem apagar dados
update public.licenses set hosting_until = now() - interval '1 day' where establishment_id = '10000000-0000-0000-0000-00000000000a';
set role anon;
do $$
declare r record;
begin
  select * into r from public.get_published_menu('restaurante-da-ana');
  if r.available is not false then raise exception 'licença vencida deveria indisponibilizar'; end if;
end $$;
reset role;

-- 8. Slug antigo redireciona
insert into public.menu_slug_history (slug, menu_id) values ('ana-antigo', '20000000-0000-0000-0000-00000000000a');
set role anon;
do $$
declare r record;
begin
  select * into r from public.get_published_menu('ana-antigo');
  if r.redirect_to is distinct from 'restaurante-da-ana' then raise exception 'slug antigo deveria redirecionar'; end if;
end $$;
reset role;

-- 9. Onboarding: cria estabelecimento + vínculo de proprietário
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000b', false);
do $$
declare est uuid;
begin
  est := public.create_establishment('Segunda unidade do Bruno', '+55 (62) 99999-0000');
  if public.member_role_of(est) is distinct from 'owner' then raise exception 'Bruno deveria ser owner'; end if;
  if (select whatsapp from public.establishments where id = est) <> '5562999990000' then raise exception 'whatsapp não normalizado'; end if;
end $$;

-- 10. Exclusão de conta anonimiza e despublica
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', false);
select public.request_account_deletion();
reset role;
do $$
begin
  if (select deleted_at from public.profiles where id = '00000000-0000-0000-0000-00000000000a') is null then raise exception 'perfil deveria estar excluído'; end if;
  if (select status from public.menus where id = '20000000-0000-0000-0000-00000000000a') <> 'unpublished' then raise exception 'cardápio deveria ser despublicado'; end if;
end $$;

\echo 'RLS: todos os testes passaram'
