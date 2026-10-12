import type { TemplateDefinition } from "../types";
import { cat, img, p } from "../_build";
import { PH } from "../_photos";

export const pureMinimal: TemplateDefinition = {
  meta: {
    slug: "pure-minimal",
    code: "02",
    name: "Pure Minimal",
    segment: "Bistrôs e cafeterias premium",
    description: "Branco, areia e muito respiro. O texto conduz e as fotos aparecem só onde importam.",
    previewImage: img(PH.breakfast, 1200),
    tier: "essential",
    version: 1,
    capabilities: { productViews: ["list", "compact", "grid"], imagePositions: ["side", "top"], headerStyles: ["minimal", "hero"] },
  },
  theme: {
    colors: {
      primary: "#2B2A27",
      secondary: "#A8987C",
      background: "#FBFAF7",
      text: "#3A3833",
      heading: "#1F1E1B",
      button: "#2B2A27",
      buttonText: "#FBFAF7",
      border: "#E6E1D7",
      card: "#FFFFFF",
      highlight: "#B9A27A",
      header: "#FBFAF7",
      footer: "#F2EEE6",
    },
    fonts: { heading: "manrope", body: "manrope", headingScale: 1, bodyScale: 1, headingWeight: 300, letterSpacing: -0.01 },
    layout: {
      productView: "list",
      imagePosition: "side",
      radius: 6,
      spacing: "airy",
      showImages: true,
      showDescriptions: true,
      buttonStyle: "solid",
      headerStyle: "minimal",
    },
  },
  demo: {
    establishment: {
      name: "Atelier Areia",
      tagline: "Café, brunch e cozinha de estação",
      description: "Bistrô de bairro com pães de fermentação natural, cafés especiais e pratos que mudam com a feira da semana.",
      coverUrl: img(PH.bistroRoom, 1600),
      phone: "(62) 3000-0202",
      whatsapp: "5500000000000",
      address: "Rua das Acácias, 88 — Setor Oeste, Goiânia - GO",
      instagram: "@atelierareia.demo",
      hours: [
        { days: "Terça a sexta", hours: "8h – 18h" },
        { days: "Sábado e domingo", hours: "8h – 15h" },
      ],
    },
    settings: { whatsappOrders: true, whatsappButton: true, showSearch: true, demo: true },
    categories: [
      cat("Cafés", [
        p("Espresso", "Blend da casa, notas de caramelo e cacau.", 8, { img: PH.coffee, variations: [["Simples", 8], ["Duplo", 12]] }),
        p("Flat white", "Espresso duplo e leite vaporizado em microespuma.", 16, {
          img: PH.latte,
          allergens: ["lactose"],
          addons: [["Leite de aveia", 3], ["Dose extra", 5]],
        }),
        p("Coado do dia", "Método V60 com grão especial da semana. Pergunte a origem.", 14, { img: PH.coffee3, featured: true }),
        p("Cold brew", "Extração a frio por 18 horas, servido com gelo.", 17, { img: PH.icedCoffee }),
      ]),
      cat("Brunch", [
        p("Ovos mexidos cremosos", "Ovos caipiras, ciboulette e pão de fermentação natural.", 38, {
          img: PH.breakfast,
          featured: true,
          allergens: ["ovo", "gluten", "lactose"],
          addons: [["Bacon crocante", 9], ["Abacate", 7]],
        }),
        p("Tartine de abacate", "Abacate, limão-siciliano, rabanete e sementes tostadas.", 36, {
          img: PH.salad,
          tags: ["Vegano"],
          allergens: ["gluten", "gergelim"],
        }),
        p("Panqueca de ricota", "Panquecas altas, ricota fresca, frutas vermelhas e mel.", 34, { img: PH.parfait, allergens: ["ovo", "lactose", "gluten"] }),
        p("Granola da casa", "Iogurte natural, granola artesanal e frutas da estação.", 26, { img: PH.bowl, allergens: ["lactose", "castanhas"] }),
      ]),
      cat("Pratos artesanais", [
        p("Risoto de cogumelos", "Arroz arbóreo, mix de cogumelos frescos e parmesão.", 62, { img: PH.pasta3, allergens: ["lactose"] }),
        p("Salmão com legumes", "Salmão grelhado, legumes assados e molho de ervas.", 72, { img: PH.salmonDish, allergens: ["peixe"] }),
        p("Bowl de grãos", "Quinoa, grão-de-bico, legumes tostados e tahine.", 44, { img: PH.bowl, tags: ["Vegano"], allergens: ["gergelim"] }),
      ]),
      cat("Sobremesas", [
        p("Bolo de laranja", "Fatia generosa com calda de laranja-baía.", 18, { img: PH.cake, allergens: ["ovo", "gluten", "lactose"] }),
        p("Cookie de chocolate", "Massa amanteigada com chocolate 54%.", 14, { img: PH.cookies, allergens: ["gluten", "lactose", "ovo"] }),
        p("Croissant de amêndoas", "Massa folhada na manteiga e creme de amêndoas.", 19, {
          img: PH.croissant,
          unavailable: true,
          allergens: ["gluten", "lactose", "castanhas"],
        }),
      ]),
      cat("Bebidas", [
        p("Suco verde", "Couve, maçã, gengibre e limão.", 16),
        p("Kombucha da casa", "Fermentação própria, sabor da semana.", 18),
        p("Água com gás", "Garrafa de 300 ml.", 7),
      ]),
    ],
  },
};
