import type { TemplateDefinition } from "../types";
import { cat, img, p } from "../_build";
import { PH } from "../_photos";

export const urbanBlack: TemplateDefinition = {
  meta: {
    slug: "urban-black",
    code: "03",
    name: "Urban Black",
    segment: "Hamburguerias gourmet",
    description: "Tipografia condensada, vermelho intenso e fotos que ocupam o card inteiro. Feito para dar fome.",
    previewImage: img(PH.burger, 1200),
    tier: "essential",
    version: 1,
    capabilities: { productViews: ["grid", "large", "list"], imagePositions: ["top"], headerStyles: ["hero", "minimal"] },
  },
  theme: {
    colors: {
      primary: "#C8102E",
      secondary: "#7A0A1C",
      background: "#0E0E0E",
      text: "#EDEDED",
      heading: "#FFFFFF",
      button: "#C8102E",
      buttonText: "#FFFFFF",
      border: "#2A2A2A",
      card: "#181818",
      highlight: "#FFC93C",
      header: "#0E0E0E",
      footer: "#000000",
    },
    fonts: { heading: "bebas", body: "inter", headingScale: 1.1, bodyScale: 0.95, headingWeight: 400, letterSpacing: 0.02 },
    layout: {
      productView: "grid",
      imagePosition: "top",
      radius: 14,
      spacing: "normal",
      showImages: true,
      showDescriptions: true,
      buttonStyle: "solid",
      headerStyle: "hero",
    },
  },
  demo: {
    establishment: {
      name: "Brasa Street Burger",
      tagline: "Smash na chapa, pão brioche e molho da casa",
      description: "Hamburgueria de bairro com blends próprios moídos todo dia e chapa de ferro fundido.",
      coverUrl: img(PH.burger2, 1600),
      phone: "(62) 3000-0303",
      whatsapp: "5500000000000",
      address: "Rua T-55, 410 — Setor Bueno, Goiânia - GO",
      instagram: "@brasastreet.demo",
      hours: [
        { days: "Segunda a quinta", hours: "18h – 23h" },
        { days: "Sexta a domingo", hours: "18h – 01h" },
      ],
    },
    settings: { whatsappOrders: true, whatsappButton: true, showSearch: true, demo: true },
    categories: [
      cat("Hambúrgueres", [
        p("Brasa Classic", "Blend 160 g, cheddar inglês, picles, cebola e molho Brasa no brioche.", 34, {
          img: PH.burger,
          featured: true,
          tags: ["Mais pedido"],
          allergens: ["gluten", "lactose", "ovo"],
          addons: [["Bacon", 6], ["Cheddar extra", 5], ["Ovo", 4], ["Blend extra 160 g", 14]],
        }),
        p("Double Smash", "Dois smash de 90 g, queijo americano duplo e cebola caramelizada.", 39, {
          img: PH.burger2,
          featured: true,
          allergens: ["gluten", "lactose"],
          addons: [["Bacon", 6], ["Jalapeño", 4]],
        }),
        p("Bacon Lovers", "Blend 160 g, bacon artesanal, maionese defumada e cheddar.", 42, {
          img: PH.burger3,
          allergens: ["gluten", "lactose", "ovo"],
          addons: [["Bacon extra", 6]],
        }),
        p("Hot Brasa", "Pimenta jalapeño, pepper jack e maionese de chipotle.", 38, {
          img: PH.burger,
          tags: ["Picante"],
          allergens: ["gluten", "lactose", "ovo"],
        }),
        p("Veggie Smash", "Blend de grão-de-bico e cogumelos, queijo vegano e rúcula.", 36, {
          img: PH.burger3,
          tags: ["Vegano"],
          allergens: ["gluten", "soja"],
        }),
      ]),
      cat("Combos", [
        p("Combo Classic", "Brasa Classic + fritas médias + refrigerante lata.", 52, {
          img: PH.burger2,
          promo: 47.9,
          tags: ["Promoção"],
        }),
        p("Combo Dupla", "2 hambúrgueres à escolha + fritas grandes + 2 refrigerantes.", 98, { img: PH.fries }),
      ]),
      cat("Acompanhamentos", [
        p("Fritas da casa", "Batatas rústicas com páprica defumada.", 16, {
          img: PH.fries,
          variations: [["Média", 16], ["Grande", 24]],
        }),
        p("Onion rings", "Anéis de cebola empanados na cerveja.", 22, { img: PH.fries, allergens: ["gluten"] }),
        p("Fritas com cheddar e bacon", "Fritas grandes cobertas com cheddar cremoso e bacon.", 32, { img: PH.fries, allergens: ["lactose"] }),
      ]),
      cat("Sobremesas", [
        p("Brownie com sorvete", "Brownie de chocolate meio amargo, sorvete de creme e calda.", 24, {
          img: PH.chocolateCake,
          allergens: ["gluten", "lactose", "ovo"],
        }),
        p("Milkshake", "Baunilha, chocolate ou morango, 400 ml.", 22, {
          img: PH.parfait,
          variations: [["Baunilha", 22], ["Chocolate", 22], ["Morango", 22]],
          allergens: ["lactose"],
        }),
      ]),
      cat("Bebidas", [
        p("Refrigerante lata", "350 ml.", 7, { variations: [["Cola", 7], ["Cola zero", 7], ["Guaraná", 7]] }),
        p("Limonada suíça", "Limão, leite condensado e gelo, 500 ml.", 14, { allergens: ["lactose"] }),
        p("Cerveja artesanal IPA", "Long neck 355 ml.", 19),
      ]),
    ],
  },
};
