import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { PlanCards } from "@/components/landing/PlanCards";
import { FaqList } from "@/components/landing/FaqList";
import { PLANS } from "@/config/plans";

export const metadata: Metadata = {
  title: "Planos e preços",
  description: "Assinatura mensal a partir de R$ 39,90 ou pagamento único com 12 meses de hospedagem incluídos.",
};

const ROWS: Array<{ label: string; values: Array<string | boolean> }> = [
  { label: "Cardápios publicados", values: PLANS.map((p) => String(p.publishedMenus)) },
  { label: "Modelos disponíveis", values: PLANS.map((p) => (p.templates === "all" ? "Todos (10)" : "3")) },
  { label: "Editor de produtos e categorias", values: [true, true, true] },
  { label: "Cores, fontes e logotipo", values: [true, true, true] },
  { label: "Layout avançado (grade, cards, espaçamentos)", values: [false, true, true] },
  { label: "QR Code permanente", values: [true, true, true] },
  { label: "Personalização visual do QR Code", values: [false, true, true] },
  { label: "Pedidos pelo WhatsApp", values: [false, true, true] },
  { label: "Estatísticas de acesso", values: [false, true, true] },
  { label: "Relatórios por cardápio", values: [false, false, true] },
  { label: "Suporte prioritário", values: [false, true, true] },
];

export default function PlanosPage() {
  return (
    <>
      <PageHeader title="Planos e preços" lead="Todos os planos incluem hospedagem, HTTPS, QR Code permanente e cardápio sem anúncios." />
      <div className="mx-auto max-w-6xl px-5 py-14">
        <PlanCards />

        <section className="mt-24">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">Comparação completa</h2>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-surface">
            <table className="w-full min-w-[560px] text-sm">
              <caption className="sr-only">Recursos por plano</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="p-4 text-left font-medium text-muted">Recurso</th>
                  {PLANS.map((p) => (
                    <th key={p.code} scope="col" className="p-4 text-center font-display text-base font-semibold text-ink">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.label} className="border-b border-line last:border-0">
                    <th scope="row" className="p-4 text-left font-normal text-ink">{r.label}</th>
                    {r.values.map((v, i) => (
                      <td key={i} className="p-4 text-center">
                        {typeof v === "string" ? (
                          <span className="text-ink">{v}</span>
                        ) : v ? (
                          <Check className="mx-auto size-4 text-brand" aria-label="Incluído" />
                        ) : (
                          <Minus className="mx-auto size-4 text-muted/60" aria-label="Não incluído" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-24 grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">Sobre o pagamento único</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              O pagamento único dá direito de uso do modelo escolhido, com hospedagem incluída pelo período informado no plano. Ao final desse período,
              a hospedagem pode ser renovada anualmente. Se não houver renovação, o cardápio sai do ar, mas seus dados continuam guardados na sua conta.
            </p>
          </div>
          <FaqList limit={4} />
        </section>
      </div>
    </>
  );
}
