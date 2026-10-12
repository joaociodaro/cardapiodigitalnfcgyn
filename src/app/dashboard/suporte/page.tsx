import type { Metadata } from "next";
import { getDashboardContext } from "@/lib/dashboard/context";
import { createClient } from "@/lib/supabase/server";
import { PageBody, PageTitle, Panel, formatDate } from "@/components/dashboard/ui";
import { SupportForm } from "./SupportForm";

export const metadata: Metadata = { title: "Suporte" };

const STATUS: Record<string, string> = { open: "Aberto", in_progress: "Em atendimento", resolved: "Resolvido", closed: "Encerrado" };

export default async function SuportePage({ searchParams }: { searchParams: Promise<{ assunto?: string }> }) {
  const { assunto } = await searchParams;
  const ctx = await getDashboardContext();
  const supabase = await createClient();
  const { data: requests } = await supabase
    .from("support_requests")
    .select("id, subject, status, created_at")
    .eq("user_id", ctx.user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <>
      <PageTitle
        title="Suporte"
        description={ctx.entitlements.features.priority_support ? "Seu plano tem suporte prioritário." : "Respondemos pelo seu e-mail em até um dia útil."}
      />
      <PageBody narrow>
        <Panel title="Nova mensagem">
          <SupportForm subject={assunto?.slice(0, 120)} />
        </Panel>
        {!!requests?.length && (
          <section className="mt-10">
            <h2 className="font-display text-lg font-semibold text-ink">Suas solicitações</h2>
            <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
              {requests.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm">
                  <span className="min-w-0 truncate text-ink">{r.subject}</span>
                  <span className="shrink-0 text-muted">
                    {STATUS[r.status]} · {formatDate(r.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </PageBody>
    </>
  );
}
