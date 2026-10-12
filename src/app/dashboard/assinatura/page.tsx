import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { requireEstablishment } from "@/lib/dashboard/context";
import { createClient } from "@/lib/supabase/server";
import { formatBRL } from "@/config/plans";
import { getTemplate } from "@/templates/registry";
import { PageBody, PageTitle, Panel, formatDate } from "@/components/dashboard/ui";
import type { PlanFeatures } from "@/lib/entitlements";

export const metadata: Metadata = { title: "Minha assinatura" };

const FEATURE_LABELS: Array<[keyof PlanFeatures, string]> = [
  ["advanced_layout", "Personalização avançada de layout"],
  ["whatsapp_orders", "Pedidos pelo WhatsApp"],
  ["analytics", "Estatísticas de acesso"],
  ["reports", "Relatórios por cardápio"],
  ["qr_styling", "QR Code personalizável"],
  ["priority_support", "Suporte prioritário"],
];

export default async function AssinaturaPage({ searchParams }: { searchParams: Promise<{ plano?: string; cobranca?: string; modelo?: string }> }) {
  const sp = await searchParams;
  const ctx = await requireEstablishment();
  const e = ctx.entitlements;
  const supabase = await createClient();
  const { data: plans } = await supabase.from("plans").select("*").eq("is_active", true).order("sort_order");
  const template = sp.modelo ? getTemplate(sp.modelo) : undefined;
  const billing = sp.cobranca === "unico" ? "unico" : "mensal";

  return (
    <>
      <PageTitle title="Minha assinatura" description="Seu plano atual, limites e opções de contratação." />
      <PageBody>
        <Panel title={e.active ? `Plano ${e.planName}` : "Nenhum plano ativo"}>
          {e.active ? (
            <dl className="grid gap-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-muted">Modalidade</dt>
                <dd className="mt-1 font-medium text-ink">
                  {e.source === "subscription" ? "Assinatura mensal" : e.source === "purchase" ? "Pagamento único" : "Licença concedida pela equipe"}
                </dd>
              </div>
              <div>
                <dt className="text-muted">{e.source === "subscription" ? "Período atual até" : "Hospedagem até"}</dt>
                <dd className="mt-1 font-medium text-ink">{e.validUntil ? formatDate(e.validUntil) : "Sem data de término"}</dd>
              </div>
              <div>
                <dt className="text-muted">Cardápios publicados</dt>
                <dd className="mt-1 font-medium text-ink">até {e.maxPublishedMenus}</dd>
              </div>
              {e.inGracePeriod && (
                <p className="text-sm font-medium text-red-700 sm:col-span-3 dark:text-red-400">
                  Há um pagamento pendente. Regularize até {formatDate(e.validUntil)} para evitar a suspensão do cardápio.
                </p>
              )}
            </dl>
          ) : (
            <p className="text-sm text-muted">
              Escolha um plano abaixo para liberar o editor, a publicação e o QR Code
              {template ? ` com o modelo ${template.meta.name}` : ""}.
            </p>
          )}
        </Panel>

        <h2 className="mt-12 font-display text-2xl font-semibold text-ink">Planos</h2>
        <p className="mt-1 text-sm text-muted">
          A contratação online pelo Mercado Pago está sendo ativada. Até lá, nossa equipe ativa o seu plano após o pagamento: escolha abaixo e
          enviaremos as instruções.
        </p>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {(plans ?? []).map((p) => {
            const features = (p.features ?? {}) as PlanFeatures;
            const current = e.planCode === p.code;
            const highlighted = sp.plano === p.code;
            return (
              <article key={p.id} className={`flex flex-col rounded-2xl border bg-surface p-6 ${highlighted ? "border-accent ring-2 ring-accent/40" : "border-line"}`}>
                <h3 className="font-display text-xl font-semibold text-ink">{p.name}</h3>
                <p className="mt-1 text-sm text-muted">{p.description}</p>
                <p className="mt-5 text-sm text-muted">
                  <span className="font-display text-3xl font-semibold text-ink">{formatBRL(p.monthly_price_cents ?? 0)}</span> /mês
                </p>
                <p className="mt-1 text-xs text-muted">
                  ou {formatBRL(p.one_time_price_cents ?? 0)} à vista, com {p.one_time_hosting_months} meses de hospedagem
                </p>
                <ul className="mt-5 flex-1 space-y-2 text-sm text-ink">
                  <li className="flex gap-2">
                    <Check className="mt-0.5 size-4 text-brand" />
                    {p.max_published_menus === 1 ? "1 cardápio publicado" : `Até ${p.max_published_menus} cardápios publicados`}
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 size-4 text-brand" />
                    {p.template_tier === "premium" ? "Todos os modelos" : `${p.max_essential_templates ?? 3} modelos`}
                  </li>
                  {FEATURE_LABELS.filter(([k]) => features[k]).map(([k, label]) => (
                    <li key={k} className="flex gap-2">
                      <Check className="mt-0.5 size-4 text-brand" />
                      {label}
                    </li>
                  ))}
                </ul>
                {current ? (
                  <p className="mt-6 rounded-full border border-line py-2.5 text-center text-sm font-medium text-muted">Seu plano atual</p>
                ) : (
                  <div className="mt-6 grid gap-2">
                    <Link
                      href={`/dashboard/suporte?assunto=${encodeURIComponent(`Contratar plano ${p.name} (${billing === "mensal" ? "mensal" : "pagamento único"})`)}`}
                      className="rounded-full bg-brand py-2.5 text-center text-sm font-semibold text-brand-ink hover:opacity-90"
                    >
                      Contratar {p.name}
                    </Link>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </PageBody>
    </>
  );
}
