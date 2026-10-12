/**
 * Dados da marca da plataforma. "Carta" é um nome provisório — troque aqui
 * e o site inteiro se atualiza.
 */
export const site = {
  name: "Carta",
  description:
    "Cardápios digitais sofisticados, prontos para usar e personalizar. Escolha um modelo, ajuste à sua marca e publique com QR Code permanente.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "contato@seudominio.com.br",
  whatsapp: "", // ex.: 5562999990000 — usado na página de contato
  city: "Goiânia - GO",
};

export const nav = [
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/modelos", label: "Modelos" },
  { href: "/#funcionalidades", label: "Funcionalidades" },
  { href: "/planos", label: "Planos e preços" },
  { href: "/perguntas-frequentes", label: "Perguntas frequentes" },
];
