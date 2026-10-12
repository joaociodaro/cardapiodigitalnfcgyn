import type { Metadata } from "next";
import { requireEstablishment } from "@/lib/dashboard/context";
import { PageBody, PageTitle } from "@/components/dashboard/ui";
import { MenuList, PlanRequiredNote } from "@/components/dashboard/MenuList";

export const metadata: Metadata = { title: "QR Codes" };

export default async function Page() {
  const ctx = await requireEstablishment();
  return (
    <>
      <PageTitle
        title="QR Codes"
        description="Um QR Code permanente para cada cardápio, em PNG e SVG."
      />
      <PageBody>
        {!ctx.entitlements.active && <PlanRequiredNote />}
        <MenuList
          establishmentId={ctx.current.id}
          hasPlan={ctx.entitlements.active}
          emptyText="O QR Code é gerado quando você publica um cardápio. Ele nunca muda, mesmo que você altere preços ou o link."
        />
      </PageBody>
    </>
  );
}
