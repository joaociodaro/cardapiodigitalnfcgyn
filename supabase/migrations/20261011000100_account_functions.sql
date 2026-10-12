-- =====================================================================
-- Etapa 3 — funções de conta e onboarding
-- =====================================================================

-- Cria o estabelecimento e o vínculo de proprietário numa única transação.
create or replace function public.create_establishment(p_name text, p_whatsapp text default null, p_phone text default null)
returns uuid
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  est_id uuid;
  owned integer;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if exists (select 1 from public.profiles where id = uid and (blocked_at is not null or deleted_at is not null)) then
    raise exception 'account_unavailable' using errcode = '42501';
  end if;
  if char_length(trim(coalesce(p_name, ''))) < 2 then
    raise exception 'invalid_name' using errcode = '22023';
  end if;

  select count(*) into owned from public.establishment_members where user_id = uid and role = 'owner';
  if owned >= 5 then
    raise exception 'establishment_limit' using errcode = '54000';
  end if;

  insert into public.establishments (name, whatsapp, phone, created_by)
  values (trim(p_name), nullif(regexp_replace(coalesce(p_whatsapp, ''), '\D', '', 'g'), ''), nullif(trim(coalesce(p_phone, '')), ''), uid)
  returning id into est_id;

  insert into public.establishment_members (establishment_id, user_id, role) values (est_id, uid, 'owner');
  return est_id;
end $$;

revoke all on function public.create_establishment(text, text, text) from public, anon;
grant execute on function public.create_establishment(text, text, text) to authenticated;

-- Exclusão de conta (LGPD): anonimiza o perfil e tira os cardápios do ar.
-- Registros financeiros e fiscais dos estabelecimentos são mantidos pelo
-- prazo legal. O usuário de autenticação é removido pelo backend (service role).
create or replace function public.request_account_deletion()
returns void
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  update public.menus m set status = 'unpublished'
  where m.establishment_id in (
    select establishment_id from public.establishment_members where user_id = uid and role = 'owner'
  ) and m.status = 'published';

  update public.profiles
     set full_name = 'Conta excluída', phone = null, avatar_url = null, deleted_at = now()
   where id = uid;

  insert into public.audit_logs (actor_id, action, target_type, target_id)
  values (uid, 'account.delete_requested', 'user', uid::text);
end $$;

revoke all on function public.request_account_deletion() from public, anon;
grant execute on function public.request_account_deletion() to authenticated;
