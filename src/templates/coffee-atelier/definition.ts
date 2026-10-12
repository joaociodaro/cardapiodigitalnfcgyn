import type { TemplateDefinition } from "../types";
import { cat, img, p } from "../_build";
import { PH } from "../_photos";

export const coffeeAtelier: TemplateDefinition = {
  meta: {
    slug: "coffee-atelier",
    code: "06",
    name: "Coffee Atelier",
    segment: "Cafeterias e confeitarias",
    description: "Tons de café e creme, fotos redondas e um clima de balcão de bairro.",
    previewImage: img(PH.latte, 1200),
    tier: "essential",
    version: 1,
    capabilities: { productViews: ["list", "grid"], imagePositions: ["side", "top"], headerStyles: ["hero", "minimal"] },
  },
  theme: {
    colors: {
      primary: "#6B4226",
      secondary: "#C89B6D",
      background: "#F5EDE1",
      text: "#3B2A1E",
      heading: "#2C1D12",
      button: "#6B4226",
      buttonText: "#FFF8EE",
      border: "#E2D3BE",
      card: "#FFF9F0",
      highlight: "#B5651D",
      header: "#EADBC6",
      footer: "#3B2A1E",
    },
    fonts: { heading: "fraunces", body: "nunito", headingScale: 1, bodyScale: 1, headingWeight: 600, letterSpacing: -0.01 },
    layout: {
      productView: "list",
      imagePosition: "side",
      radius: 18,
      spacing: "normal",
      showImages: true,
      showDescriptions: true,
      buttonStyle: "pill",
      headerStyle: "hero",
    },
  },
  demo: {
    establishment: {
      name: "Grão & Forno",
      tagline: "Café de especialidade e fornadas do dia",
      description: "Torramos nossos grãos semanalmente e assamos pães e bolos todas as manhãs.",
      coverUrl: img(PH.coffee2, 1600),
      phone: "(62) 3000-0606",
      whatsapp: "5500000000000",
      address: "Av. T-10, 300 — Setor Bueno, Goiânia - GO",
      instagram: "@graoeforno.demo",
      hours: [
        { days: "Segunda a sábado", hours: "7h – 20h" },
        { days: "Domingo", hours: "8h – 13h" },
      ],
    },
    settings: { whatsappOrders: true, whatsappButton: true, showSearch: true, demo: true },
    categories: [
      cat("Cafés", [
        p("Cappuccino", "Espresso, leite vaporizado e cacau.", 14, {
          img: PH.latte,
          featured: true,
          variations: [["Pequeno", 14], ["Grande", 18]],
          addons: [["Leite vegetal", 3], ["Chantilly", 3]],
          allergens: ["lactose"],
        }),
        p("Espresso", "Grão da casa, torra média.", 7, { img: PH.coffee }),
        p("Mocha", "Espresso, chocolate belga e leite.", 18, { img: PH.coffee3, allergens: ["lactose"] }),
        p("Café na prensa", "Para dois, 500 ml.", 22, { img: PH.coffee2 }),
      ]),
      cat("Bebidas geladas", [
        p("Iced latte", "Espresso duplo, leite e gelo.", 17, { img: PH.icedCoffee, allergens: ["lactose"] }),
        p("Frappé de caramelo", "Café batido com gelo, caramelo salgado e chantilly.", 22, { img: PH.icedCoffee, allergens: ["lactose"] }),
        p("Chá gelado de pêssego", "Chá preto, pêssego e hortelã.", 13),
      ]),
      cat("Bolos", [
        p("Bolo de cenoura com brigadeiro", "Fatia com cobertura cremosa de chocolate.", 15, {
          img: PH.chocolateCake,
          featured: true,
          allergens: ["gluten", "ovo", "lactose"],
        }),
        p("Bolo de fubá com goiabada", "Receita de família, fatia.", 12, { img: PH.cake, allergens: ["gluten", "ovo", "lactose"] }),
        p("Red velvet", "Massa aveludada e cream cheese.", 18, { img: PH.cake, allergens: ["gluten", "ovo", "lactose"] }),
      ]),
      cat("Doces", [
        p("Cookie de pistache", "Com chocolate branco.", 13, { img: PH.cookies, allergens: ["gluten", "lactose", "castanhas"] }),
        p("Brigadeiro de colher", "Pote de 120 g.", 12, { img: PH.parfait, allergens: ["lactose"] }),
        p("Croissant de chocolate", "Massa folhada na manteiga.", 14, { img: PH.croissant, allergens: ["gluten", "lactose"], unavailable: true }),
      ]),
      cat("Salgados", [
        p("Pão de queijo", "Porção com 4 unidades.", 12, { img: PH.pastries, allergens: ["lactose", "ovo"] }),
        p("Croissant de presunto e queijo", "Gratinado na hora.", 19, { img: PH.croissant, allergens: ["gluten", "lactose"] }),
        p("Quiche de alho-poró", "Fatia com salada verde.", 24, { img: PH.breakfast, allergens: ["gluten", "lactose", "ovo"] }),
      ]),
    ],
  },
};
