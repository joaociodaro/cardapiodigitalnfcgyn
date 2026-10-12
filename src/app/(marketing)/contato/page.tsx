import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { site } from "@/config/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a equipe: contratação, criação personalizada de cardápios e suporte.",
};

export default function ContatoPage() {
  return (
    <>
      <PageHeader title="Fale com a gente" lead="Contratação, criação personalizada do seu cardápio ou suporte. Respondemos em até um dia útil." />
      <div className="mx-auto grid max-w-6xl gap-14 px-5 py-14 lg:grid-cols-[1.5fr_1fr]">
        <ContactForm />
        <aside className="space-y-6 text-sm">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-lg font-semibold text-ink">Criação personalizada</h2>
            <p className="mt-2 leading-relaxed text-muted">
              Envie seu cardápio atual (foto, PDF ou planilha) e nossa equipe monta tudo no modelo escolhido, com seus produtos, preços e fotos.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-lg font-semibold text-ink">E-mail</h2>
            <a href={`mailto:${site.email}`} className="mt-2 block text-muted hover:text-ink">{site.email}</a>
            <p className="mt-3 text-muted">{site.city}</p>
          </div>
        </aside>
      </div>
    </>
  );
}
