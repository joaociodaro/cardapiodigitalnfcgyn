import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { requireEstablishment } from "@/lib/dashboard/context";
import { createClient } from "@/lib/supabase/server";
import { FormAlert } from "@/components/ui/form";
import { PageBody, PageTitle, Panel, formatDate } from "@/components/dashboard/ui";

const NOTICES: Record<string, string> = {
  "bem-vindo": "Estabelecimento criado. Agora escolha um plano para liberar o editor e a publicação.",
  "senha-atualizada": "Sua senha foi atualizada.",
};

export default async function DashboardHome({ searchParams }: { searchParams: Promise<{ aviso?: string }> }) {
  const { aviso } = await searchParams;
  const ctx = await requireEstablishment();
  const supabase = await createClient();
  const e = ctx.entitlements;

  const since = new Date(Date.now() - 30 * 86400_000).toISOString().slice(0, 10);
  const [{ data: menus }, { data: views }, { data: sub }] = await Promise.all([
    supabase.from("menus").select("id, status").eq("establishment_id", ctx.current.id).is("deleted_at", null),
    supabase.from("menu_views_daily").select("views, menus!inner(establishment_id)").eq("menus.establishment_id", ctx.current.id).gte("day", since),
    supabase
      .from("subscriptions")
      .select("status, current_period_end, cancel_at_period_end")
      .eq("establishment_id", ctx.current.id)
      .in("status", ["active", "past_due"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const total = menus?.length ?? 0;
  const published = menus?.filter((m) => m.status === "published").length ?? 0;
  const totalViews = (views ?? []).reduce((s, v) => s + v.views, 0);

  const est = ctx.current;
  const steps = [
    { done: true, label: "Criar sua conta", href: null },
    { done: !!(est.whatsapp && est.address), label: "Completar os dados do estabelecimento", href: "/dashboard/configuracoes" },
    { done: e.active, label: "Escolher um plano", href: "/dashboard/assinatura" },
    { done: total > 0, label: "Criar seu cardápio a partir de um modelo", href: "/dashboard/cardapios/novo" },
    { done: published > 0, label: "Publicar e imprimir o QR Code", href: "/dashboard/cardapios" },
  ];
  const doneCount = steps.filter((s) => s.done).length;

  const stats = [
    { label: "Plano", value: e.active ? e.planName : "Nenhum", note: e.active ? (e.source === "subscription" ? "Assinatura mensal" : e.source === "purchase" ? "Pagamento único" : "Licença concedida") : "Escolha um plano para publicar" },
    {
      label: e.source === "purchase" ? "Hospedagem até" : "Próxima cobrança",
      value: e.source === "subscription" ? formatDate(sub?.current_period_end) : e.active ? formatDate(e.validUntil) : "—",
      note: e.inGracePeriod ? "Pagamento pendente: regularize para não suspender" : sub?.cancel_at_period_end ? "Cancelamento agendado" : undefined,
    },
    { label: "Cardápios", value: String(total), note: `${published} publicado${published === 1 ? "" : "s"}` },
    { label: "Visualizações", value: totalViews.toLocaleString("pt-BR"), note: "Últimos 30 dias" },
  ];

  return (
    <>
      <PageTitle title={est.name} description="Visão geral do seu estabelecimento." />
      <PageBody>
        {aviso && NOTICES[aviso] && (
          <div className="mb-6">
            <FormAlert tone="success">{NOTICES[aviso]}</FormAlert>
          </div>
        )}

        <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface p-5">
              <dt className="text-sm text-muted">{s.label}</dt>
              <dd className="mt-2 font-display text-2xl font-semibold text-ink">{s.value}</dd>
              {s.note && <dd className="mt-1 text-xs text-muted">{s.note}</dd>}
            </div>
          ))}
        </dl>

        {doneCount < steps.length && (
          <Panel title="Primeiros passos" description={`${doneCount} de ${steps.length} concluídos`} className="mt-8">
            <ol className="space-y-1">
              {steps.map((s) => (
                <li key={s.label}>
                  {s.href && !s.done ? (
                    <Link href={s.href} className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-ink hover:bg-surface-2">
                      <Circle className="size-4 text-muted" />
                      {s.label}
                    </Link>
                  ) : (
                    <span className={`flex items-center gap-3 px-2 py-2 text-sm ${s.done ? "text-muted line-through decoration-muted/40" : "text-ink"}`}>
                      {s.done ? <CheckCircle2 className="size-4 text-brand" /> : <Circle className="size-4 text-muted" />}
                      {s.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </Panel>
        )}
      </PageBody>
    </>
  );
}
