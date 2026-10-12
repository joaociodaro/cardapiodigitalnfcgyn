-- Endurecimento apontado pelo Security Advisor do Supabase:
-- funções auxiliares não precisam ser chamáveis por visitantes anônimos.
-- (is_platform_admin continua liberada a anon porque as políticas de leitura
-- pública de planos e modelos a referenciam.)
revoke execute on function public.is_member(uuid, uuid) from public, anon;
revoke execute on function public.member_role_of(uuid, uuid) from public, anon;
revoke execute on function public.establishment_has_hosting(uuid) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.is_member(uuid, uuid) to authenticated;
grant execute on function public.member_role_of(uuid, uuid) to authenticated;
