import type { Metadata } from "next";
import { requireEstablishment } from "@/lib/dashboard/context";
import { PageBody, PageTitle } from "@/components/dashboard/ui";
import { MenuList, PlanRequiredNote } from "@/components/dashboard/MenuList";

export const metadata: Metadata = { title: "Produtos e categorias" };

export default async function Page() {
  const ctx = await requireEstablishment();
  return (
    <>
      <PageTitle
        title="Produtos e categorias"
        description="Cadastre, reordene e marque produtos como destaque ou indisponíveis."
      />
      <PageBody>
        {!ctx.entitlements.active && <PlanRequiredNote />}
        <MenuList
          establishmentId={ctx.current.id}
          hasPlan={ctx.entitlements.active}
          emptyText="Os produtos ficam dentro de um cardápio. Crie seu primeiro cardápio para começar a cadastrar."
        />
      </PageBody>
    </>
  );
}
