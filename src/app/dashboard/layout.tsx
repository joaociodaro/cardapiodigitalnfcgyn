import type { Metadata } from "next";
import { getDashboardContext } from "@/lib/dashboard/context";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: { default: "Painel", template: "%s · Painel" }, robots: { index: false } };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return <p className="p-10 text-sm text-muted">Configure as variáveis do Supabase para usar o painel (veja o README).</p>;
  }
  const ctx = await getDashboardContext();
  const planLabel = ctx.entitlements.active
    ? `Plano ${ctx.entitlements.planName}${ctx.entitlements.inGracePeriod ? " (pagamento pendente)" : ""}`
    : "Sem plano ativo";

  return (
    <DashboardShell
      userName={ctx.profile?.full_name ?? ""}
      userEmail={ctx.user.email}
      isAdmin={ctx.isAdmin}
      establishments={ctx.establishments}
      currentId={ctx.current?.id ?? null}
      planLabel={planLabel}
    >
      {children}
    </DashboardShell>
  );
}
