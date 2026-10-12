import type { Metadata } from "next";
import { requireEstablishment } from "@/lib/dashboard/context";
import { PageBody, PageTitle } from "@/components/dashboard/ui";
import { MenuList, PlanRequiredNote } from "@/components/dashboard/MenuList";

export const metadata: Metadata = { title: "Personalização" };

export default async function Page() {
  const ctx = await requireEstablishment();
  return (
    <>
      <PageTitle
        title="Personalização"
        description="Cores, fontes, imagens e layout do seu cardápio, com prévia em tempo real."
      />
      <PageBody>
        {!ctx.entitlements.active && <PlanRequiredNote />}
        <MenuList
          establishmentId={ctx.current.id}
          hasPlan={ctx.entitlements.active}
          emptyText="A personalização é feita por cardápio. Crie seu primeiro cardápio para abrir o editor visual."
        />
      </PageBody>
    </>
  );
}
