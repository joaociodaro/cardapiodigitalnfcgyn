import type { TemplateDefinition } from "../types";
import { cat, img, p } from "../_build";
import { PH } from "../_photos";

export const sweetBoutique: TemplateDefinition = {
  meta: {
    slug: "sweet-boutique",
    code: "09",
    name: "Sweet Boutique",
    segment: "Confeitarias e docerias premium",
    description: "Rosa suave, champagne e tipografia caligráfica. Vitrine em mosaico para doces que se vendem pela foto.",
    previewImage: img(PH.cake, 1200),
    tier: "premium",
    version: 1,
    capabilities: { productViews: ["grid", "list"], imagePositions: ["top"], headerStyles: ["hero", "minimal"] },
  },
  theme: {
    colors: {
      primary: "#C46A86",
      secondary: "#D8B98A",
      background: "#FFF7F8",
      text: "#5A3E46",
      heading: "#7A3E55",
      button: "#C46A86",
      buttonText: "#FFFFFF",
      border: "#F1DCE2",
      card: "#FFFFFF",
      highlight: "#D8B98A",
      header: "#FBE9EE",
      footer: "#F7E3E8",
    },
    fonts: { heading: "parisienne", body: "quicksand", headingScale: 1.15, bodyScale: 0.98, headingWeight: 400, letterSpacing: 0 },
    layout: {
      productView: "grid",
      imagePosition: "top",
      radius: 22,
      spacing: "normal",
      showImages: true,
      showDescriptions: true,
      buttonStyle: "pill",
      headerStyle: "hero",
    },
  },
  demo: {
    establishment: {
      name: "Doce Marie",
      tagline: "Ateliê de doces finos",
      description: "Bolos, doces finos e kits presenteáveis feitos à mão, com encomendas para eventos.",
      coverUrl: img(PH.pastries, 1600),
      phone: "(62) 3000-0909",
      whatsapp: "5500000000000",
      address: "Rua 15, 210 — Setor Oeste, Goiânia - GO",
      instagram: "@docemarie.demo",
      hours: [
        { days: "Terça a sábado", hours: "10h – 19h" },
        { days: "Domingo", hours: "10h – 14h" },
      ],
      extraInfo: "Encomendas de bolos com 48 horas de antecedência.",
    },
    settings: { whatsappOrders: true, whatsappButton: true, showSearch: true, demo: true },
    categories: [
      cat("Bolos", [
        p("Bolo de morango com chantininho", "Massa de baunilha, morangos frescos e creme leve.", 22, {
          img: PH.cake,
          featured: true,
          variations: [["Fatia", 22], ["Inteiro (1,5 kg)", 189]],
          allergens: ["gluten", "lactose", "ovo"],
        }),
        p("Bolo de chocolate belga", "Ganache 54% e raspas de chocolate.", 24, {
          img: PH.chocolateCake,
          variations: [["Fatia", 24], ["Inteiro (1,5 kg)", 199]],
          allergens: ["gluten", "lactose", "ovo"],
        }),
        p("Naked cake de frutas vermelhas", "Encomenda para até 20 pessoas.", 260, { img: PH.cake, tags: ["Sob encomenda"], allergens: ["gluten", "lactose", "ovo"] }),
      ]),
      cat("Doces finos", [
        p("Brigadeiro belga", "Unidade com chocolate 70%.", 6.5, { img: PH.cookies, allergens: ["lactose"] }),
        p("Bem-casado", "Pão de ló e doce de leite, embalado à mão.", 7, { img: PH.pastries, allergens: ["gluten", "lactose", "ovo"] }),
        p("Trufa de maracujá", "Chocolate branco e maracujá.", 7.5, { img: PH.cookies, allergens: ["lactose"] }),
        p("Macaron", "Sabores do dia, unidade.", 9, { img: PH.pastries, allergens: ["castanhas", "ovo"], unavailable: true }),
      ]),
      cat("Sobremesas", [
        p("Pavlova de frutas", "Merengue, creme e frutas frescas.", 28, { img: PH.parfait, featured: true, allergens: ["ovo", "lactose"] }),
        p("Torta de limão", "Base crocante, creme de limão e merengue maçaricado.", 19, { img: PH.cake, allergens: ["gluten", "lactose", "ovo"] }),
        p("Cheesecake de frutas vermelhas", "Fatia.", 21, { img: PH.parfait, allergens: ["gluten", "lactose", "ovo"] }),
      ]),
      cat("Cafés", [
        p("Cappuccino da casa", "Com canela e cacau.", 13, { img: PH.latte, allergens: ["lactose"] }),
        p("Chocolate quente", "Cremoso, com chantilly.", 16, { img: PH.coffee3, allergens: ["lactose"] }),
        p("Espresso", "Grão especial.", 7, { img: PH.coffee }),
      ]),
      cat("Kits e presentes", [
        p("Caixa com 12 doces finos", "Sortidos, em caixa com laço de cetim.", 84, { img: PH.cookies, featured: true, tags: ["Presente"] }),
        p("Kit café da tarde", "Bolo inteiro pequeno, 6 doces e cartão personalizado.", 129, { img: PH.pastries, tags: ["Presente"] }),
      ]),
    ],
  },
};
