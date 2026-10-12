import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { supabasePublicEnv } from "@/lib/env";

/**
 * Cliente com a chave secreta: IGNORA o RLS.
 * Usar somente em código de servidor que já verificou permissões
 * (exclusão de conta, webhooks de pagamento, painel administrativo).
 */
export function createAdminClient() {
  const env = supabasePublicEnv();
  const secret = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!env || !secret) return null;
  return createClient<Database>(env.url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
