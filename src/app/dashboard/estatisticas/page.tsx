import type { Metadata } from "next";
import { requireEstablishment } from "@/lib/dashboard/context";
import { PageBody, PageTitle } from "@/components/dashboard/ui";
import { MenuList, PlanRequiredNote } from "@/components/dashboard/MenuList";

export const metadata: Metadata = { title: "Estatísticas" };

export default async function Page() {
  const ctx = await requireEstablishment();
  return (
    <>
      <PageTitle
        title="Estatísticas"
        description="Visualizações por dia, origem (QR Code ou link) e dispositivo."
      />
      <PageBody>
        {!ctx.entitlements.active && <PlanRequiredNote />}
        <MenuList
          establishmentId={ctx.current.id}
          hasPlan={ctx.entitlements.active}
          emptyText="As estatísticas aparecem depois que seu primeiro cardápio é publicado e começa a receber visitas."
        />
      </PageBody>
    </>
  );
}
