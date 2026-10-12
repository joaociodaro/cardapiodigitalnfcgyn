import type { Metadata } from "next";
import { requireEstablishment } from "@/lib/dashboard/context";
import { PageBody, PageTitle } from "@/components/dashboard/ui";
import { TemplatePicker } from "@/components/dashboard/TemplatePicker";

export const metadata: Metadata = { title: "Modelos disponíveis" };

export default async function ModelosDashboardPage() {
  const ctx = await requireEstablishment();
  const e = ctx.entitlements;
  return (
    <>
      <PageTitle
        title="Modelos disponíveis"
        description={
          e.active
            ? e.templateTier === "premium"
              ? `Seu plano ${e.planName} inclui todos os modelos.`
              : `Seu plano ${e.planName} inclui os modelos Pure Minimal, Urban Black e Coffee Atelier.`
            : "Abra as demonstrações e escolha o seu favorito. Os modelos são liberados ao ativar um plano."
        }
      />
      <PageBody>
        <TemplatePicker entitlements={e} mode="browse" />
      </PageBody>
    </>
  );
}
