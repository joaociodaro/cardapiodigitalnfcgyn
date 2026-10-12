import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { FaqList } from "@/components/landing/FaqList";
import { FAQ } from "@/config/faq";

export const metadata: Metadata = {
  title: "Perguntas frequentes",
  description: "Dúvidas sobre planos, QR Code, pedidos pelo WhatsApp e personalização dos cardápios.",
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader title="Perguntas frequentes" lead="Não encontrou sua dúvida? Fale com a gente pela página de contato." />
      <div className="mx-auto max-w-3xl px-5 py-14">
        <FaqList />
        <p className="mt-10 text-sm text-muted">
          Ainda com dúvidas?{" "}
          <Link href="/contato" className="font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4">
            Entre em contato
          </Link>
          .
        </p>
      </div>
    </>
  );
}
