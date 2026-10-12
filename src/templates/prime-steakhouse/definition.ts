import type { TemplateDefinition } from "../types";
import { cat, img, p } from "../_build";
import { PH } from "../_photos";

export const primeSteakhouse: TemplateDefinition = {
  meta: {
    slug: "prime-steakhouse",
    code: "08",
    name: "Prime Steakhouse",
    segment: "Churrascarias premium",
    description: "Grafite e cobre, cortes apresentados como fichas técnicas: peso, origem e maturação.",
    previewImage: img(PH.steak, 1200),
    tier: "premium",
    version: 1,
    capabilities: { productViews: ["large", "list"], imagePositions: ["side", "top"], headerStyles: ["hero", "minimal"] },
  },
  theme: {
    colors: {
      primary: "#C47A45",
      secondary: "#8A5530",
      background: "#1B1C1E",
      text: "#D9D6D1",
      heading: "#F2EEE8",
      button: "#C47A45",
      buttonText: "#151515",
      border: "#34363A",
      card: "#232427",
      highlight: "#E09A62",
      header: "#141517",
      footer: "#0F1011",
    },
    fonts: { heading: "oswald", body: "barlow", headingScale: 1, bodyScale: 1, headingWeight: 500, letterSpacing: 0.03 },
    layout: {
      productView: "large",
      imagePosition: "side",
      radius: 6,
      spacing: "normal",
      showImages: true,
      showDescriptions: true,
      buttonStyle: "solid",
      headerStyle: "hero",
    },
  },
  demo: {
    establishment: {
      name: "Ferro & Brasa",
      tagline: "Churrascaria de cortes nobres",
      description: "Parrilla argentina, fogo de chão e carnes maturadas a seco em câmara própria.",
      coverUrl: img(PH.ribs, 1600),
      phone: "(62) 3000-0808",
      whatsapp: "5500000000000",
      address: "Av. 85, 2500 — Setor Sul, Goiânia - GO",
      instagram: "@ferroebrasa.demo",
      hours: [
        { days: "Segunda a sexta", hours: "11h30 – 15h · 18h30 – 23h" },
        { days: "Sábado e domingo", hours: "11h30 – 23h" },
      ],
    },
    settings: { whatsappOrders: false, whatsappButton: true, showSearch: true, demo: true },
    categories: [
      cat(
        "Cortes",
        [
          p("Picanha Black Angus", "Capa de gordura generosa, assada na grelha alta.", 159, {
            img: PH.steak,
            featured: true,
            tags: ["400 g", "Brasil", "Maturação 21 dias"],
          }),
          p("Bife ancho", "Corte do contrafilé com marmoreio intenso.", 142, { img: PH.steak2, tags: ["350 g", "Uruguai", "Maturação 28 dias"] }),
          p("Costela fogo de chão", "Assada lentamente por 12 horas.", 129, { img: PH.ribs, tags: ["600 g", "Brasil", "Serve 2"] }),
          p("T-bone dry aged", "Filé e contrafilé no mesmo corte, maturado a seco.", 219, {
            img: PH.steak,
            tags: ["700 g", "EUA", "Dry aged 40 dias"],
            notes: "Preparo de 30 minutos.",
          }),
          p("Fraldinha", "Suculenta e macia, com chimichurri.", 98, { img: PH.steak2, tags: ["400 g", "Brasil"], unavailable: true }),
        ],
        "Pesos aproximados, antes do preparo. Pergunte pelo ponto ideal de cada corte.",
      ),
      cat("Entradas", [
        p("Provoleta", "Provolone grelhado na parrilla com orégano e mel.", 42, { img: PH.skewers, allergens: ["lactose"] }),
        p("Linguiça artesanal", "Linguiça de pernil com pão de alho.", 38, { img: PH.skewers, allergens: ["gluten", "lactose"] }),
        p("Empanadas", "Três unidades: carne, frango e queijo.", 36, { img: PH.pastries, allergens: ["gluten", "lactose", "ovo"] }),
      ]),
      cat("Acompanhamentos", [
        p("Batata rústica", "Com alecrim e alho assado.", 28, { img: PH.fries }),
        p("Farofa da casa", "Farofa de manteiga com bacon e ovos.", 22, { allergens: ["lactose", "ovo"] }),
        p("Arroz biro-biro", "Arroz com ovos, batata palha e cebolinha.", 26, { allergens: ["ovo"] }),
        p("Salada da horta", "Folhas, tomate, cebola roxa e vinagrete.", 24, { img: PH.salad, tags: ["Vegano"] }),
      ]),
      cat("Sobremesas", [
        p("Petit gâteau", "Com sorvete de doce de leite.", 34, { img: PH.chocolateCake, allergens: ["gluten", "lactose", "ovo"] }),
        p("Pudim de leite", "Receita tradicional, fatia generosa.", 22, { img: PH.cake, allergens: ["lactose", "ovo"] }),
      ]),
      cat("Bebidas", [
        p("Chopp pilsen", "Caneca de 400 ml.", 16),
        p("Caipirinha de limão", "Cachaça artesanal, limão e açúcar.", 28),
        p("Malbec da casa", "Taça ou garrafa.", 44, { img: PH.wine, variations: [["Taça", 44], ["Garrafa", 190]] }),
        p("Refrigerante", "Lata 350 ml.", 8),
      ]),
    ],
  },
};
