import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDashboardContext } from "@/lib/dashboard/context";
import { getTemplate } from "@/templates/registry";
import { PLANS } from "@/config/plans";
import { OnboardingForm } from "./OnboardingForm";

export const metadata: Metadata = { title: "Bem-vindo" };

export default async function BemVindoPage({ searchParams }: { searchParams: Promise<{ modelo?: string; plano?: string; cobranca?: string; nova?: string }> }) {
  const sp = await searchParams;
  const ctx = await getDashboardContext();
  const template = sp.modelo ? getTemplate(sp.modelo) : undefined;
  const plan = PLANS.find((p) => p.code === sp.plano);

  // Para onde ir depois de criar: a intenção vinda da vitrine (modelo/plano) tem prioridade.
  let next = "/dashboard?aviso=bem-vindo";
  if (plan) next = `/dashboard/assinatura?plano=${plan.code}${sp.cobranca ? `&cobranca=${sp.cobranca}` : ""}${template ? `&modelo=${template.meta.slug}` : ""}`;
  else if (template) next = `/dashboard/cardapios/novo?modelo=${template.meta.slug}`;

  if (ctx.current && !sp.nova) redirect(next);

  const firstName = (ctx.profile?.full_name ?? "").split(" ")[0];

  return (
    <div className="mx-auto max-w-xl px-5 py-14 sm:py-20">
      <p className="text-sm font-medium text-accent">{sp.nova ? "Novo estabelecimento" : "Etapa 1 de 2"}</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink">
        {sp.nova ? "Adicionar estabelecimento" : `Bem-vindo${firstName ? `, ${firstName}` : ""}!`}
      </h1>
      <p className="mt-3 text-muted">
        {sp.nova
          ? "Cada estabelecimento tem seus próprios cardápios, plano e QR Codes."
          : "Conte o nome do seu estabelecimento. Em seguida você escolhe o plano e o modelo do cardápio."}
      </p>
      {template && (
        <p className="mt-6 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted">
          Modelo escolhido: <strong className="text-ink">{template.meta.name}</strong>
        </p>
      )}
      <div className="mt-8">
        <OnboardingForm next={next} />
      </div>
    </div>
  );
}
