import type { Metadata } from "next";
import { Hammer } from "lucide-react";
import { requireEstablishment } from "@/lib/dashboard/context";
import { getTemplate } from "@/templates/registry";
import { canUseTemplate } from "@/lib/entitlements";
import { EmptyState, PageBody, PageTitle } from "@/components/dashboard/ui";
import { TemplatePicker } from "@/components/dashboard/TemplatePicker";
import { PlanRequiredNote } from "@/components/dashboard/MenuList";

export const metadata: Metadata = { title: "Criar cardápio" };

export default async function NovoCardapioPage({ searchParams }: { searchParams: Promise<{ modelo?: string }> }) {
  const { modelo } = await searchParams;
  const ctx = await requireEstablishment();
  const chosen = modelo ? getTemplate(modelo) : undefined;
  const allowed = chosen ? canUseTemplate(ctx.entitlements, chosen.meta.tier) : false;

  return (
    <>
      <PageTitle title="Criar cardápio" description="Escolha o modelo. Ele chega completo, com categorias e produtos de exemplo, para você substituir pelos seus." />
      <PageBody>
        {!ctx.entitlements.active && <PlanRequiredNote />}
        {chosen && allowed && (
          <div className="mb-8">
            <EmptyState Icon={Hammer} title={`Modelo ${chosen.meta.name} selecionado`}>
              <p>
                A cópia do modelo para a sua conta e o editor visual estão na próxima atualização da plataforma. Assim que forem liberados, este botão
                criará o cardápio imediatamente com o modelo escolhido.
              </p>
            </EmptyState>
          </div>
        )}
        <TemplatePicker entitlements={ctx.entitlements} highlight={chosen?.meta.slug} mode="create" />
      </PageBody>
    </>
  );
}
