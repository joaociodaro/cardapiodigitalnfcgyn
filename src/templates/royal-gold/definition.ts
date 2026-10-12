import type { TemplateDefinition } from "../types";
import { cat, img, p } from "../_build";
import { PH } from "../_photos";

export const royalGold: TemplateDefinition = {
  meta: {
    slug: "royal-gold",
    code: "01",
    name: "Royal Gold",
    segment: "Restaurantes de luxo e steakhouses",
    description: "Preto profundo, dourado e fotografias amplas. Uma carta para casas de alta gastronomia.",
    previewImage: img(PH.fineDining, 1200),
    tier: "premium",
    version: 1,
    capabilities: { productViews: ["large", "list", "grid"], imagePositions: ["top"], headerStyles: ["hero", "minimal"] },
  },
  theme: {
    colors: {
      primary: "#C9A55C",
      secondary: "#8C7340",
      background: "#0A0A0A",
      text: "#E8E2D6",
      heading: "#F3E7C9",
      button: "#C9A55C",
      buttonText: "#0A0A0A",
      border: "#2E2A22",
      card: "#141311",
      highlight: "#E3C786",
      header: "#0A0A0A",
      footer: "#050505",
    },
    fonts: { heading: "cinzel", body: "cormorant", headingScale: 1, bodyScale: 1.08, headingWeight: 400, letterSpacing: 0.08 },
    layout: {
      productView: "large",
      imagePosition: "top",
      radius: 2,
      spacing: "airy",
      showImages: true,
      showDescriptions: true,
      buttonStyle: "outline",
      headerStyle: "hero",
    },
  },
  demo: {
    establishment: {
      name: "Maison Aurum",
      tagline: "Alta gastronomia e cortes nobres",
      description:
        "Cozinha autoral com brasa e técnica clássica. Carnes maturadas na casa, adega com mais de 300 rótulos e serviço à francesa.",
      coverUrl: img(PH.diningRoom, 1600),
      phone: "(62) 3000-0101",
      whatsapp: "5500000000000",
      address: "Av. das Palmeiras, 1200 — Setor Jardins, Goiânia - GO",
      instagram: "@maisonaurum.demo",
      hours: [
        { days: "Terça a sábado", hours: "19h – 00h" },
        { days: "Domingo", hours: "12h – 16h" },
      ],
      extraInfo: "Traje esporte fino. Reservas recomendadas para jantares de sexta e sábado.",
    },
    settings: { whatsappOrders: false, whatsappButton: true, showSearch: true, demo: true },
    categories: [
      cat("Entradas", [
        p("Steak tartare", "Filé-mignon picado na ponta da faca, gema curada, alcaparras e torradas de brioche.", 89, {
          img: PH.fineDining,
          featured: true,
          ingredients: ["filé-mignon", "gema curada", "alcaparras", "chalota", "mostarda Dijon", "brioche"],
          allergens: ["ovo", "gluten"],
        }),
        p("Carpaccio de wagyu", "Lâminas finas de wagyu, rúcula selvagem, parmesão de 24 meses e azeite trufado.", 112, {
          img: PH.plated,
          allergens: ["lactose"],
        }),
        p("Burrata com tomates confitados", "Burrata cremosa, tomates de três cores confitados e pesto de manjericão.", 76, {
          img: PH.salad,
          allergens: ["lactose", "castanhas"],
          tags: ["Vegetariano"],
        }),
        p("Vieiras na manteiga noisette", "Vieiras seladas, purê de couve-flor e farofa de avelã.", 118, {
          img: PH.shrimp,
          allergens: ["crustaceos", "lactose", "castanhas"],
        }),
      ]),
      cat(
        "Cortes especiais",
        [
          p("Tomahawk maturado 45 dias", "Corte com osso, maturado na casa, finalizado na brasa de lenha frutífera.", 489, {
            img: PH.steak,
            featured: true,
            tags: ["1,2 kg", "Serve 2"],
            notes: "Tempo de preparo: 35 minutos.",
          }),
          p("Filé Rossini", "Medalhão de filé, foie gras selado, molho Périgueux e brioche tostado.", 248, {
            img: PH.steak2,
            allergens: ["gluten", "lactose"],
          }),
          p("Ancho Black Angus", "Corte suculento e marmorizado, servido com flor de sal e chimichurri da casa.", 198, {
            img: PH.ribs,
            variations: [
              ["300 g", 198],
              ["450 g", 268],
            ],
          }),
          p("Wagyu A5 japonês", "Seleção limitada, servida em pedra quente com sal defumado.", 690, {
            img: PH.steak,
            tags: ["150 g"],
            unavailable: true,
          }),
        ],
        "Selecionados e maturados na casa. Escolha o ponto com o garçom.",
      ),
      cat("Acompanhamentos", [
        p("Batatas soufflé", "Clássico francês, crocantes e aeradas.", 42, { img: PH.fries }),
        p("Purê trufado", "Batata-baroa, manteiga de Isigny e trufa negra ralada.", 58, { allergens: ["lactose"] }),
        p("Aspargos grelhados", "Aspargos verdes, hollandaise e amêndoas laminadas.", 54, { allergens: ["ovo", "castanhas"] }),
        p("Arroz de alho negro", "Arroz cremoso com alho negro fermentado e parmesão.", 46, { allergens: ["lactose"] }),
      ]),
      cat("Sobremesas", [
        p("Soufflé de chocolate 70%", "Preparado na hora, com sorvete de baunilha de Madagascar.", 64, {
          img: PH.chocolateCake,
          featured: true,
          notes: "Preparo de 20 minutos.",
          allergens: ["ovo", "lactose", "gluten"],
        }),
        p("Crème brûlée de fava tonka", "Creme sedoso com crosta caramelizada no maçarico.", 48, {
          img: PH.cake,
          allergens: ["ovo", "lactose"],
        }),
        p("Pavlova de frutas vermelhas", "Merengue crocante, chantilly e frutas da estação.", 52, {
          img: PH.parfait,
          allergens: ["ovo", "lactose"],
        }),
      ]),
      cat("Bebidas", [
        p("Champagne Brut — taça", "Seleção do sommelier.", 89, { img: PH.wine }),
        p("Malbec reserva — garrafa", "Mendoza, notas de ameixa, violeta e carvalho tostado.", 340, { img: PH.wine }),
        p("Negroni", "Gin, vermute rosso e bitter italiano.", 52, { img: PH.cocktail }),
        p("Água mineral", "Com ou sem gás, 500 ml.", 14),
      ]),
    ],
  },
};
