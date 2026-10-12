import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { TemplateGallery } from "@/components/landing/TemplateGallery";
import { TEMPLATES } from "@/templates/registry";

export const metadata: Metadata = {
  title: "Modelos de cardápio",
  description: "Dez cardápios digitais completos para restaurantes, bares, cafeterias, hamburguerias e confeitarias. Veja as demonstrações.",
};

export default function ModelosPage() {
  return (
    <>
      <PageHeader
        title="Modelos de cardápio"
        lead="Cada modelo é um cardápio completo, com categorias, produtos, fotos e preços de exemplo. Abra a demonstração no celular para sentir a experiência do seu cliente."
      />
      <div className="mx-auto max-w-6xl px-5 py-14">
        <TemplateGallery templates={TEMPLATES.map(({ meta, theme }) => ({ meta, theme }))} />
      </div>
    </>
  );
}
