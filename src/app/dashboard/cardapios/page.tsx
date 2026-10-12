import type { Metadata } from "next";
import { requireEstablishment } from "@/lib/dashboard/context";
import { ButtonLink, PageBody, PageTitle } from "@/components/dashboard/ui";
import { MenuList, PlanRequiredNote } from "@/components/dashboard/MenuList";

export const metadata: Metadata = { title: "Meus cardápios" };

export default async function Page() {
  const ctx = await requireEstablishment();
  return (
    <>
      <PageTitle
        title="Meus cardápios"
        description="Cada cardápio tem seu link, seu QR Code e seu próprio rascunho."
      actions={ctx.entitlements.active ? <ButtonLink href="/dashboard/cardapios/novo">Criar cardápio</ButtonLink> : undefined}
      />
      <PageBody>
        {!ctx.entitlements.active && <PlanRequiredNote />}
        <MenuList
          establishmentId={ctx.current.id}
          hasPlan={ctx.entitlements.active}
          emptyText="Escolha um modelo pronto e ele vira o seu cardápio, com seus produtos, cores e logotipo."
        />
      </PageBody>
    </>
  );
}
