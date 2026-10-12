import Link from "next/link";
import {
  BarChart3,
  Brush,
  LayoutTemplate,
  MessageCircle,
  MousePointerClick,
  QrCode,
  RefreshCw,
  Smartphone,
  Sparkles,
  SquarePen,
} from "lucide-react";
import { HeroDemo } from "@/components/landing/HeroDemo";
import { Steps } from "@/components/landing/Steps";
import { TemplateCard } from "@/components/landing/TemplateCard";
import { PlanCards } from "@/components/landing/PlanCards";
import { FaqList } from "@/components/landing/FaqList";
import { TEMPLATES } from "@/templates/registry";

const BENEFITS = [
  { Icon: Smartphone, title: "Feito para o celular", body: "Abre rápido em qualquer aparelho, mesmo no 4G da mesa do canto." },
  { Icon: RefreshCw, title: "Preços atualizados na hora", body: "Mudou o preço do chope? Salve e o cardápio já mostra o novo valor." },
  { Icon: QrCode, title: "QR Code permanente", body: "Imprima uma vez. O código continua válido mesmo que você mude tudo no cardápio." },
  { Icon: Brush, title: "Personalização completa", body: "Cores, fontes, logotipo, fotos, layout dos produtos e estilo dos botões." },
  { Icon: LayoutTemplate, title: "Design profissional pronto", body: "Comece de um cardápio completo, não de uma tela em branco." },
  { Icon: MessageCircle, title: "Pedidos e contato pelo WhatsApp", body: "O cliente monta o pedido e envia pronto para o seu número." },
  { Icon: SquarePen, title: "Gerenciamento simples", body: "Produtos, categorias, adicionais e itens esgotados em poucos cliques." },
  { Icon: MousePointerClick, title: "Sem conhecimento técnico", body: "Se você usa WhatsApp e Instagram, consegue editar seu cardápio." },
  { Icon: Sparkles, title: "Modelos exclusivos", body: "Dez identidades criadas para segmentos diferentes da gastronomia." },
  { Icon: BarChart3, title: "Relatórios de visualizações", body: "Veja quantas pessoas abriram o cardápio e quando (planos Premium e Business)." },
];

const TESTIMONIALS = [
  {
    quote: "Trocamos o cardápio impresso pelo QR Code e paramos de reimprimir a cada ajuste de preço. A equipe atualiza tudo pelo celular.",
    who: "Proprietária de bistrô",
  },
  {
    quote: "O modelo já veio com a cara de hamburgueria. Só trocamos as fotos e o logotipo e publicamos no mesmo dia.",
    who: "Sócio de hamburgueria",
  },
  {
    quote: "Os pedidos chegam organizados no WhatsApp, com adicionais e observações. Diminuiu muito o vai e vem de mensagens.",
    who: "Gerente de cafeteria",
  },
];

export default function HomePage() {
  const gallery = ["royal-gold", "pure-minimal", "urban-black", "velvet-lounge", "italian-heritage", "ocean-signature"]
    .map((s) => TEMPLATES.find((t) => t.meta.slug === s)!)
    .filter(Boolean);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-12 lg:grid-cols-[1.1fr_1fr] lg:pt-16">
          <div>
            <h1 className="font-display text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink sm:text-6xl lg:text-[4.1rem]">
              Transforme seu cardápio em uma experiência digital extraordinária.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Crie cardápios digitais sofisticados, personalize cada detalhe e ofereça uma experiência moderna aos seus clientes. Sem precisar programar.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/cadastro" className="rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-brand-ink transition hover:opacity-90">
                Criar meu cardápio
              </Link>
              <Link href="/modelos" className="rounded-full border border-line bg-surface px-6 py-3.5 text-sm font-semibold text-ink transition hover:border-ink/40">
                Explorar modelos
              </Link>
            </div>
            <p className="mt-8 max-w-md text-sm text-muted">
              Toque nos produtos do celular de demonstração: é um cardápio de verdade, com busca, categorias e pedido pelo WhatsApp.
            </p>
          </div>
          <HeroDemo />
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="scroll-mt-20 border-t border-line bg-surface-2/50 py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Do modelo ao QR Code em uma tarde</h2>
            <p className="mt-4 text-lg text-muted">Cinco passos, sem instalar nada e sem depender de agência.</p>
          </div>
          <div className="mt-12">
            <Steps />
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section id="modelos" className="scroll-mt-20 py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Cardápios prontos, cada um com personalidade</h2>
              <p className="mt-4 text-lg text-muted">
                Abra qualquer demonstração, navegue pelas categorias e simule um pedido. Quando escolher, é só trocar pelos seus produtos.
              </p>
            </div>
            <Link href="/modelos" className="text-sm font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4">
              Ver os 10 modelos
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((t) => (
              <TemplateCard key={t.meta.slug} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="funcionalidades" className="scroll-mt-20 border-y border-line bg-surface py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1fr_1.6fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Tudo que um cardápio precisa, nada que atrapalhe</h2>
            <p className="mt-4 text-lg text-muted">Sem anúncios, sem aplicativo para baixar e sem cadastro para o seu cliente.</p>
          </div>
          <ul className="grid gap-x-10 sm:grid-cols-2">
            {BENEFITS.map(({ Icon, title, body }) => (
              <li key={title} className="flex gap-4 border-t border-line py-6">
                <Icon className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={1.75} />
                <div>
                  <h3 className="font-semibold text-ink">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="scroll-mt-20 py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Planos e preços</h2>
            <p className="mt-4 text-lg text-muted">Assine por mês ou pague uma vez. Você escolhe.</p>
          </div>
          <div className="mt-10">
            <PlanCards />
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="border-t border-line bg-surface-2/50 py-24">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">O que esperamos ouvir dos nossos clientes</h2>
          <p className="mt-2 text-sm text-muted">Depoimentos ilustrativos, criados como exemplo. Serão substituídos por relatos reais.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.who} className="rounded-3xl border border-dashed border-line bg-surface p-7">
                <blockquote className="font-display text-lg leading-snug text-ink">“{t.quote}”</blockquote>
                <figcaption className="mt-5 text-sm text-muted">{t.who} (exemplo)</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 className="font-display text-4xl font-semibold tracking-tight text-ink">Perguntas frequentes</h2>
            <Link href="/perguntas-frequentes" className="mt-4 inline-block text-sm font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4">
              Ver todas as perguntas
            </Link>
          </div>
          <FaqList limit={5} />
        </div>
      </section>

      {/* CTA final */}
      <section className="px-5 pb-24">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 rounded-[2rem] bg-brand px-8 py-14 text-brand-ink md:flex-row md:items-center md:justify-between md:px-14">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">Seu próximo cliente já está com o celular na mão.</h2>
            <p className="mt-3 opacity-80">Escolha um modelo e publique seu cardápio hoje.</p>
          </div>
          <Link href="/cadastro" className="shrink-0 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-accent-ink transition hover:brightness-105">
            Criar meu cardápio
          </Link>
        </div>
      </section>
    </>
  );
}
