import type { Metadata } from "next";
import { requireEstablishment } from "@/lib/dashboard/context";
import { PageBody, PageTitle, Panel } from "@/components/dashboard/ui";
import { DeleteAccountForm, EstablishmentForm, PasswordForm, ProfileForm, SessionsForm } from "./forms";

export const metadata: Metadata = { title: "Configurações" };

export default async function ConfiguracoesPage() {
  const ctx = await requireEstablishment();
  const e = ctx.current;
  const links = (e.social_links ?? {}) as { website?: string | null };
  const hours = Array.isArray(e.opening_hours) ? (e.opening_hours as Array<{ days: string; hours: string }>) : [];

  return (
    <>
      <PageTitle title="Configurações" description="Dados do estabelecimento, da sua conta e segurança." />
      <PageBody narrow>
        <div className="space-y-8">
          <Panel title="Dados do estabelecimento" description="Estas informações aparecem nos seus cardápios.">
            <EstablishmentForm
              canEdit={ctx.role === "owner" || ctx.role === "manager"}
              initial={{
                name: e.name,
                description: e.description ?? "",
                phone: e.phone ?? "",
                whatsapp: e.whatsapp ? formatPhone(e.whatsapp) : "",
                address: e.address ?? "",
                instagram: e.instagram ?? "",
                website: links.website ?? "",
                extra_info: e.extra_info ?? "",
                hours,
              }}
            />
          </Panel>

          <Panel title="Minha conta">
            <ProfileForm fullName={ctx.profile?.full_name ?? ""} phone={ctx.profile?.phone ?? ""} email={ctx.user.email} />
          </Panel>

          <Panel title="Senha">
            <PasswordForm />
          </Panel>

          <Panel title="Sessões" description="Encerra o acesso em todos os computadores e celulares onde você entrou, inclusive este.">
            <SessionsForm />
          </Panel>

          <Panel title="Excluir conta" description="Seus cardápios saem do ar e seus dados pessoais são apagados. Registros de pagamentos são mantidos pelo prazo exigido em lei.">
            <DeleteAccountForm />
          </Panel>
        </div>
      </PageBody>
    </>
  );
}

function formatPhone(digits: string): string {
  const d = digits.startsWith("55") ? digits.slice(2) : digits;
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return digits;
}
