import type { TemplateDefinition } from "../types";
import { cat, img, p } from "../_build";
import { PH } from "../_photos";

export const italianHeritage: TemplateDefinition = {
  meta: {
    slug: "italian-heritage",
    code: "07",
    name: "Italian Heritage",
    segment: "Restaurantes italianos e pizzarias",
    description: "Papel creme, oliva e terracota. Uma carta clássica de trattoria, com sugestões em molduras ovais.",
    previewImage: img(PH.pasta, 1200),
    tier: "premium",
    version: 1,
    capabilities: { productViews: ["list", "large"], imagePositions: ["side", "top"], headerStyles: ["minimal", "hero"] },
  },
  theme: {
    colors: {
      primary: "#B5552F",
      secondary: "#5D6B3A",
      background: "#F6EFE0",
      text: "#3A3226",
      heading: "#2F3A1C",
      button: "#5D6B3A",
      buttonText: "#F6EFE0",
      border: "#DCCFB4",
      card: "#FBF6EA",
      highlight: "#B5552F",
      header: "#F6EFE0",
      footer: "#2F3A1C",
    },
    fonts: { heading: "playfair", body: "baskerville", headingScale: 1, bodyScale: 0.94, headingWeight: 400, letterSpacing: 0 },
    layout: {
      productView: "list",
      imagePosition: "side",
      radius: 4,
      spacing: "normal",
      showImages: true,
      showDescriptions: true,
      buttonStyle: "solid",
      headerStyle: "minimal",
    },
  },
  demo: {
    establishment: {
      name: "Trattoria Oliveto",
      tagline: "Cucina di famiglia desde 1998",
      description: "Massas frescas feitas todos os dias, molhos de cozimento lento e forno a lenha para as pizzas.",
      coverUrl: img(PH.restaurant, 1600),
      phone: "(62) 3000-0707",
      whatsapp: "5500000000000",
      address: "Rua 1137, 55 — Setor Marista, Goiânia - GO",
      instagram: "@trattoriaoliveto.demo",
      hours: [
        { days: "Terça a sexta", hours: "18h30 – 23h" },
        { days: "Sábado e domingo", hours: "12h – 16h · 18h30 – 23h30" },
      ],
    },
    settings: { whatsappOrders: true, whatsappButton: true, showSearch: true, demo: true },
    categories: [
      cat("Antipasti", [
        p("Bruschetta al pomodoro", "Pão italiano tostado, tomate, manjericão e azeite extravirgem.", 32, { img: PH.salad, allergens: ["gluten"] }),
        p("Carpaccio di manzo", "Lâminas de filé, rúcula, alcaparras e lascas de grana padano.", 48, { img: PH.plated, allergens: ["lactose"] }),
        p("Caprese di bufala", "Muçarela de búfala, tomate e pesto genovês.", 44, { img: PH.salad, allergens: ["lactose", "castanhas"] }),
      ]),
      cat("Massas", [
        p("Tagliatelle al ragù", "Massa fresca com ragù de carne cozido por seis horas.", 69, {
          img: PH.pasta,
          featured: true,
          allergens: ["gluten", "ovo"],
        }),
        p("Spaghetti alla carbonara", "Guanciale, gema, pecorino romano e pimenta-do-reino.", 66, { img: PH.pasta2, allergens: ["gluten", "ovo", "lactose"] }),
        p("Ravioli di zucca", "Recheio de abóbora, manteiga de sálvia e amaretti.", 72, { img: PH.pasta3, allergens: ["gluten", "ovo", "lactose"] }),
        p("Lasagna della nonna", "Camadas de massa fresca, ragù e bechamel.", 74, { img: PH.pasta, allergens: ["gluten", "lactose", "ovo"] }),
      ]),
      cat("Risotos", [
        p("Risotto ai funghi porcini", "Arroz carnaroli e cogumelos porcini.", 78, { img: PH.pasta3, allergens: ["lactose"] }),
        p("Risotto al limone e gamberi", "Camarões, limão-siciliano e manteiga.", 89, { img: PH.shrimp, allergens: ["crustaceos", "lactose"] }),
      ]),
      cat("Pizzas", [
        p("Margherita", "Molho de tomate San Marzano, fior di latte e manjericão.", 59, {
          img: PH.margherita,
          featured: true,
          allergens: ["gluten", "lactose"],
          variations: [["Individual", 42], ["Inteira", 59]],
        }),
        p("Diavola", "Salame picante, muçarela e pimenta calabresa.", 66, {
          img: PH.pizza,
          tags: ["Picante"],
          allergens: ["gluten", "lactose"],
          variations: [["Individual", 46], ["Inteira", 66]],
        }),
        p("Quattro formaggi", "Muçarela, gorgonzola, parmesão e provolone.", 68, {
          img: PH.pizza2,
          allergens: ["gluten", "lactose"],
          variations: [["Individual", 48], ["Inteira", 68]],
        }),
      ]),
      cat("Sobremesas", [
        p("Tiramisù", "Mascarpone, café e cacau, receita tradicional.", 32, { img: PH.tiramisu, featured: true, allergens: ["lactose", "ovo", "gluten"] }),
        p("Panna cotta", "Calda de frutas vermelhas.", 28, { img: PH.parfait, allergens: ["lactose"] }),
        p("Cannoli siciliani", "Dois cannoli com ricota e pistache.", 30, { img: PH.pastries, allergens: ["gluten", "lactose", "castanhas"], unavailable: true }),
      ]),
      cat("Vinhos", [
        p("Chianti Classico DOCG", "Toscana — garrafa.", 210, { img: PH.wine, variations: [["Taça", 42], ["Garrafa", 210]] }),
        p("Pinot Grigio delle Venezie", "Vêneto — garrafa.", 165, { img: PH.wine, variations: [["Taça", 36], ["Garrafa", 165]] }),
        p("Prosecco DOC", "Espumante extra dry — garrafa.", 180, { img: PH.wine }),
      ]),
    ],
  },
};
