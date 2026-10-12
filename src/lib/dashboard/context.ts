import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeEntitlements, type Entitlements, type LicenseInput } from "@/lib/entitlements";
import type { Tables } from "@/lib/supabase/database.types";

export const CURRENT_EST_COOKIE = "est";

export interface DashboardContext {
  user: { id: string; email: string };
  profile: Tables<"profiles"> | null;
  isAdmin: boolean;
  establishments: Array<{ id: string; name: string; role: Tables<"establishment_members">["role"] }>;
  current: Tables<"establishments"> | null;
  role: Tables<"establishment_members">["role"] | null;
  entitlements: Entitlements;
}

/** Carrega (uma vez por requisição) o usuário, o estabelecimento atual e seus direitos. */
export const getDashboardContext = cache(async (): Promise<DashboardContext> => {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login?motivo=sessao");

  const [{ data: profile }, { data: memberships }, { data: admin }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", auth.user.id).maybeSingle(),
    supabase.from("establishment_members").select("role, establishment:establishments(id, name)").eq("user_id", auth.user.id),
    supabase.rpc("is_platform_admin"),
  ]);

  if (profile?.blocked_at || profile?.deleted_at) {
    await supabase.auth.signOut();
    redirect("/login?motivo=conta-indisponivel");
  }

  const establishments = (memberships ?? [])
    .filter((m) => m.establishment)
    .map((m) => ({ id: m.establishment!.id, name: m.establishment!.name, role: m.role }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  const preferred = (await cookies()).get(CURRENT_EST_COOKIE)?.value;
  const chosen = establishments.find((e) => e.id === preferred) ?? establishments[0];

  let current: Tables<"establishments"> | null = null;
  let entitlements = computeEntitlements([]);
  if (chosen) {
    const [{ data: est }, { data: licenses }] = await Promise.all([
      supabase.from("establishments").select("*").eq("id", chosen.id).single(),
      supabase
        .from("licenses")
        .select(
          "status, source, starts_at, hosting_until, limits_override, plan:plans(code, name, sort_order, max_published_menus, template_tier, max_essential_templates, features), subscription:subscriptions(status, grace_until, current_period_end)",
        )
        .eq("establishment_id", chosen.id),
    ]);
    current = est;
    entitlements = computeEntitlements((licenses ?? []).filter((l) => l.plan) as unknown as LicenseInput[]);
  }

  return {
    user: { id: auth.user.id, email: auth.user.email ?? "" },
    profile,
    isAdmin: admin === true,
    establishments,
    current,
    role: chosen?.role ?? null,
    entitlements,
  };
});

/** Para páginas que precisam de um estabelecimento: leva ao onboarding se ainda não houver. */
export async function requireEstablishment() {
  const ctx = await getDashboardContext();
  if (!ctx.current) redirect("/dashboard/bem-vindo");
  return ctx as DashboardContext & { current: Tables<"establishments"> };
}
