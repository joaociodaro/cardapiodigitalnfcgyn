import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { supabasePublicEnv } from "@/lib/env";

/**
 * Cliente Supabase para Server Components, Server Actions e Route Handlers.
 * Usa a sessão do usuário (cookies) — todas as consultas passam pelo RLS.
 */
export async function createClient() {
  const env = supabasePublicEnv();
  if (!env) throw new Error("Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  const cookieStore = await cookies();
  return createServerClient<Database>(env.url, env.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(toSet) {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Chamado a partir de um Server Component: o middleware renova a sessão.
        }
      },
    },
  });
}
