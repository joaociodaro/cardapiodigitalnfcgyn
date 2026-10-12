/** Variáveis públicas do Supabase (seguras no navegador). */
export function supabasePublicEnv(): { url: string; key: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export function isSupabaseConfigured(): boolean {
  return supabasePublicEnv() !== null;
}

export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return raw.replace(/\/$/, "");
}
