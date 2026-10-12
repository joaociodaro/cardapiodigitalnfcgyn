import type { TemplateDefinition } from "../types";
import { cat, img, p } from "../_build";
import { PH } from "../_photos";

export const velvetLounge: TemplateDefinition = {
  meta: {
    slug: "velvet-lounge",
    code: "05",
    name: "Velvet Lounge",
    segment: "Bares e coquetelarias",
    description: "Verde profundo, dourado e vinho, com moldura art déco. Os drinks ganham retrato próprio.",
    previewImage: img(PH.cocktail, 1200),
    tier: "premium",
    version: 1,
    capabilities: { productViews: ["large", "list"], imagePositions: ["top"], headerStyles: ["hero", "minimal"] },
  },
  theme: {
    colors: {
      primary: "#C6A15B",
      secondary: "#6E1F2B",
      background: "#0F2A22",
      text: "#E7DFCC",
      heading: "#F1E4C4",
      button: "#C6A15B",
      buttonText: "#0F2A22",
      border: "#2D4A40",
      card: "#14342A",
      highlight: "#8E2A3A",
      header: "#0C231C",
      footer: "#0A1D17",
    },
    fonts: { heading: "italiana", body: "bodoni", headingScale: 1.05, bodyScale: 0.98, headingWeight: 400, letterSpacing: 0.06 },
    layout: {
      productView: "large",
      imagePosition: "top",
      radius: 2,
      spacing: "normal",
      showImages: true,
      showDescriptions: true,
      buttonStyle: "outline",
      headerStyle: "hero",
    },
  },
  demo: {
    establishment: {
      name: "Velvet",
      tagline: "Coquetelaria de autor",
      description: "Bar intimista com coquetéis autorais, clássicos bem executados e uma carta curta de petiscos para dividir.",
      coverUrl: img(PH.bar, 1600),
      phone: "(62) 3000-0505",
      whatsapp: "5500000000000",
      address: "Rua 9, 1020 — Setor Marista, Goiânia - GO",
      instagram: "@velvetbar.demo",
      hours: [
        { days: "Quarta a sábado", hours: "19h – 02h" },
        { days: "Domingo", hours: "18h – 00h" },
      ],
      extraInfo: "Proibida a venda de bebidas alcoólicas para menores de 18 anos. Beba com moderação.",
    },
    settings: { whatsappOrders: false, whatsappButton: true, showSearch: true, demo: true },
    categories: [
      cat(
        "Drinks autorais",
        [
          p("Jardim Noturno", "Gin, licor de flor de sabugueiro, pepino e tônica de hibisco.", 46, {
            img: PH.cocktail,
            featured: true,
            ingredients: ["gin", "licor de sabugueiro", "pepino", "tônica de hibisco"],
          }),
          p("Ouro Velho", "Bourbon, mel de cacau, bitter de laranja e fumaça de canela.", 52, {
            img: PH.cocktail2,
            featured: true,
            ingredients: ["bourbon", "mel de cacau", "bitter de laranja", "canela"],
          }),
          p("Cerrado Sour", "Cachaça envelhecida, cagaita, limão e clara emulsionada.", 44, {
            img: PH.cocktail3,
            ingredients: ["cachaça envelhecida", "cagaita", "limão", "clara"],
            allergens: ["ovo"],
          }),
          p("Velvet Spritz", "Aperitivo de vinho, espumante, toranja e alecrim.", 42, { img: PH.cocktail }),
        ],
        "Criações da nossa equipe de bar, com ingredientes do cerrado.",
      ),
      cat("Clássicos", [
        p("Negroni", "Gin, vermute rosso e bitter.", 42, { img: PH.cocktail2 }),
        p("Dry Martini", "Gin ou vodka, vermute seco e azeitona ou twist.", 44, { img: PH.cocktail3 }),
        p("Old Fashioned", "Bourbon, açúcar demerara e bitters aromáticos.", 46, { img: PH.cocktail }),
        p("Whisky Sour", "Bourbon, limão-siciliano, açúcar e clara.", 44, { img: PH.cocktail2, allergens: ["ovo"] }),
      ]),
      cat("Sem álcool", [
        p("Hibisco tônico", "Chá de hibisco, xarope de gengibre e tônica.", 24, { img: PH.cocktail }),
        p("Limonada de manjericão", "Limão, manjericão e água com gás.", 22, { img: PH.cocktail3 }),
      ]),
      cat("Petiscos", [
        p("Croquetas de jamón", "Seis unidades com aioli de limão.", 42, { img: PH.skewers, allergens: ["gluten", "lactose", "ovo"] }),
        p("Tábua de queijos", "Três queijos artesanais, geleia e torradas.", 68, { img: PH.feast, allergens: ["lactose", "gluten"] }),
        p("Azeitonas temperadas", "Azeitonas marinadas em ervas e raspas de laranja.", 24, { img: PH.salad }),
        p("Steak tartare na torrada", "Porção para dividir.", 56, { img: PH.fineDining, allergens: ["gluten", "ovo"], unavailable: true }),
      ]),
      cat("Destilados", [
        p("Gin nacional premium", "Dose de 50 ml.", 32),
        p("Whisky single malt 12 anos", "Dose de 50 ml.", 58),
        p("Cachaça envelhecida em umburana", "Dose de 50 ml.", 26),
        p("Tequila reposado", "Dose de 50 ml.", 38),
      ]),
    ],
  },
};
