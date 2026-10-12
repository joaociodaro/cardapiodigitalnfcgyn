import "server-only";
import { headers } from "next/headers";

/**
 * Limite de requisições em memória por instância (janela deslizante simples).
 * Protege formulários públicos contra abuso básico. As rotas de autenticação
 * também contam com os limites nativos do Supabase Auth.
 * Em escala, troque por um armazenamento compartilhado (ex.: Upstash Redis).
 */
const buckets = new Map<string, number[]>();

export async function rateLimit(scope: string, limit: number, windowMs: number): Promise<boolean> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  }
  return true;
}
