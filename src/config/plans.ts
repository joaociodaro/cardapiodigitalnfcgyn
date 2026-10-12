/**
 * Planos iniciais. Estes valores são os mesmos do seed do banco
 * (supabase/seed.sql). A partir da etapa de pagamentos, as páginas públicas
 * passam a ler a tabela `plans`, editável no painel administrativo.
 */
export type PlanCode = "essencial" | "premium" | "business";

export interface PlanFeature {
  label: string;
  included: boolean;
}

export interface Plan {
  code: PlanCode;
  name: string;
  pitch: string;
  monthlyCents: number;
  oneTimeCents: number;
  /** Meses de hospedagem incluídos no pagamento único. */
  oneTimeHostingMonths: number;
  /** Valor anual de renovação de hospedagem após o período incluído. */
  hostingRenewalCents: number;
  publishedMenus: number;
  templates: "3" | "all";
  highlight?: boolean;
  features: PlanFeature[];
}

export const PLANS: Plan[] = [
  {
    code: "essencial",
    name: "Essencial",
    pitch: "Para começar com um cardápio bonito e sempre atualizado.",
    monthlyCents: 3990,
    oneTimeCents: 14990,
    oneTimeHostingMonths: 12,
    hostingRenewalCents: 11990,
    publishedMenus: 1,
    templates: "3",
    features: [
      { label: "1 cardápio publicado", included: true },
      { label: "3 modelos à escolha", included: true },
      { label: "Editor de produtos e categorias", included: true },
      { label: "Personalização de cores, fontes e logotipo", included: true },
      { label: "QR Code permanente", included: true },
      { label: "Personalização avançada de layout", included: false },
      { label: "Estatísticas de acesso", included: false },
      { label: "Pedidos pelo WhatsApp", included: false },
    ],
  },
  {
    code: "premium",
    name: "Premium",
    pitch: "Todos os modelos e personalização completa da sua marca.",
    monthlyCents: 6990,
    oneTimeCents: 29990,
    oneTimeHostingMonths: 12,
    hostingRenewalCents: 17990,
    publishedMenus: 1,
    templates: "all",
    highlight: true,
    features: [
      { label: "1 cardápio publicado", included: true },
      { label: "Todos os 10 modelos premium", included: true },
      { label: "Personalização avançada de layout", included: true },
      { label: "Pedidos pelo WhatsApp", included: true },
      { label: "Estatísticas de acesso", included: true },
      { label: "QR Code permanente e personalizável", included: true },
      { label: "Suporte prioritário", included: true },
    ],
  },
  {
    code: "business",
    name: "Business",
    pitch: "Para grupos, várias unidades ou cardápios diferentes por turno.",
    monthlyCents: 12990,
    oneTimeCents: 49990,
    oneTimeHostingMonths: 12,
    hostingRenewalCents: 29990,
    publishedMenus: 3,
    templates: "all",
    features: [
      { label: "Até 3 cardápios publicados", included: true },
      { label: "Todos os modelos", included: true },
      { label: "Personalização avançada de layout", included: true },
      { label: "Pedidos pelo WhatsApp", included: true },
      { label: "Relatórios por cardápio", included: true },
      { label: "Suporte prioritário", included: true },
    ],
  },
];

export function formatBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}
