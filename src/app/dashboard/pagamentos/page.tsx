import type { Metadata } from "next";
import { Receipt } from "lucide-react";
import { requireEstablishment } from "@/lib/dashboard/context";
import { createClient } from "@/lib/supabase/server";
import { formatBRL } from "@/config/plans";
import { EmptyState, PageBody, PageTitle, formatDate } from "@/components/dashboard/ui";

export const metadata: Metadata = { title: "Pagamentos" };

const STATUS: Record<string, string> = {
  pending: "Pendente",
  in_process: "Em análise",
  approved: "Aprovado",
  rejected: "Recusado",
  refunded: "Reembolsado",
  charged_back: "Contestado",
  canceled: "Cancelado",
};
const METHOD: Record<string, string> = { credit_card: "Cartão de crédito", debit_card: "Cartão de débito", pix: "Pix", bank_transfer: "Pix", ticket: "Boleto" };

export default async function PagamentosPage() {
  const ctx = await requireEstablishment();
  const supabase = await createClient();
  const { data: payments } = await supabase
    .from("payments")
    .select("id, status, amount_cents, refunded_cents, method, paid_at, created_at")
    .eq("establishment_id", ctx.current.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <>
      <PageTitle title="Pagamentos" description="Histórico de cobranças do seu estabelecimento." />
      <PageBody>
        {!payments?.length ? (
          <EmptyState Icon={Receipt} title="Nenhum pagamento ainda" action={{ href: "/dashboard/assinatura", label: "Ver planos" }}>
            <p>As cobranças da assinatura ou do pagamento único aparecem aqui assim que forem processadas.</p>
          </EmptyState>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-muted">
                  <th scope="col" className="p-4 font-medium">Data</th>
                  <th scope="col" className="p-4 font-medium">Valor</th>
                  <th scope="col" className="p-4 font-medium">Forma</th>
                  <th scope="col" className="p-4 font-medium">Situação</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-line last:border-0">
                    <td className="p-4 text-ink">{formatDate(p.paid_at ?? p.created_at)}</td>
                    <td className="p-4 tabular-nums text-ink">
                      {formatBRL(p.amount_cents)}
                      {p.refunded_cents > 0 && <span className="ml-1 text-xs text-muted">({formatBRL(p.refunded_cents)} reembolsado)</span>}
                    </td>
                    <td className="p-4 text-muted">{p.method ? METHOD[p.method] ?? p.method : "—"}</td>
                    <td className="p-4 text-ink">{STATUS[p.status] ?? p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PageBody>
    </>
  );
}
