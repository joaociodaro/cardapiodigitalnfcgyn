import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { STEPS } from "@/components/landing/Steps";

export const metadata: Metadata = {
  title: "Como funciona",
  description: "Escolha um modelo, crie sua conta, contrate um plano, personalize e publique seu cardápio com QR Code permanente.",
};

const DETAILS = [
  ["Dez modelos com identidades diferentes: luxo, minimalista, urbano, japonês, coquetelaria, cafeteria, italiano, churrascaria, confeitaria e frutos do mar.", "Todas as demonstrações podem ser abertas sem cadastro."],
  ["Use seu e-mail e uma senha. Confirmamos o e-mail para proteger sua conta.", "Você pode criar a conta antes de decidir o plano."],
  ["Assinatura mensal ou pagamento único, processados pelo Mercado Pago.", "O acesso ao editor é liberado automaticamente após a confirmação do pagamento."],
  ["O editor mostra a prévia em celular, tablet e computador enquanto você altera cores, fontes, fotos e produtos.", "As alterações ficam em rascunho até você publicar, e o rascunho é salvo automaticamente."],
  ["Seu cardápio fica em um endereço como seudominio.com/menu/seu-restaurante.", "Baixe o QR Code em PNG ou SVG para imprimir. Ele nunca muda."],
];

export default function ComoFuncionaPage() {
  return (
    <>
      <PageHeader title="Como funciona" lead="Do modelo escolhido ao QR Code na mesa, em cinco passos." />
      <ol className="mx-auto max-w-4xl px-5 py-14">
        {STEPS.map((s, i) => (
          <li key={s.title} className="grid gap-4 border-b border-line py-10 last:border-0 sm:grid-cols-[96px_1fr]">
            <span className="font-display text-6xl font-semibold leading-none text-accent tabular-nums" aria-hidden>
              {i + 1}
            </span>
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">{s.title}</h2>
              <p className="mt-3 leading-relaxed text-muted">{s.body}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-muted">
                {DETAILS[i].map((d) => (
                  <li key={d} className="border-l-2 border-accent/60 pl-3">{d}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
      <div className="mx-auto mb-24 flex max-w-4xl flex-wrap gap-3 px-5">
        <Link href="/modelos" className="rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-brand-ink">Explorar modelos</Link>
        <Link href="/planos" className="rounded-full border border-line px-6 py-3.5 text-sm font-semibold text-ink">Ver planos</Link>
      </div>
    </>
  );
}
