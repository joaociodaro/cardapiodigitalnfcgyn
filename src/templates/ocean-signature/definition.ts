import type { TemplateDefinition } from "../types";
import { cat, img, p } from "../_build";
import { PH } from "../_photos";

export const oceanSignature: TemplateDefinition = {
  meta: {
    slug: "ocean-signature",
    code: "10",
    name: "Ocean Signature",
    segment: "Frutos do mar",
    description: "Azul-marinho, areia e ondas desenhadas. Seções alternadas como faixas de praia.",
    previewImage: img(PH.salmonDish, 1200),
    tier: "premium",
    version: 1,
    capabilities: { productViews: ["list", "grid"], imagePositions: ["side", "top"], headerStyles: ["hero", "minimal"] },
  },
  theme: {
    colors: {
      primary: "#123A5E",
      secondary: "#4F86A8",
      background: "#FFFFFF",
      text: "#22313F",
      heading: "#0D2B47",
      button: "#123A5E",
      buttonText: "#FFFFFF",
      border: "#DCE5EC",
      card: "#FFFFFF",
      highlight: "#D9A441",
      header: "#0D2B47",
      footer: "#0D2B47",
    },
    fonts: { heading: "dm-serif", body: "dm-sans", headingScale: 1, bodyScale: 1, headingWeight: 400, letterSpacing: 0 },
    layout: {
      productView: "list",
      imagePosition: "side",
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
      name: "Maré Alta",
      tagline: "Peixes e frutos do mar frescos",
      description: "Peixes recebidos diariamente do litoral, preparados na brasa, no forno ou crus, do jeito que o mar pede.",
      coverUrl: img(PH.fish, 1600),
      phone: "(62) 3000-1010",
      whatsapp: "5500000000000",
      address: "Av. República do Líbano, 1500 — Setor Oeste, Goiânia - GO",
      instagram: "@marealta.demo",
      hours: [
        { days: "Terça a sábado", hours: "11h30 – 15h · 19h – 23h" },
        { days: "Domingo", hours: "11h30 – 16h" },
      ],
    },
    settings: { whatsappOrders: true, whatsappButton: true, showSearch: true, demo: true },
    categories: [
      cat("Entradas", [
        p("Ceviche clássico", "Peixe branco, leite de tigre, cebola roxa e milho peruano.", 54, { img: PH.fish, featured: true, allergens: ["peixe"] }),
        p("Bolinho de bacalhau", "Seis unidades com aioli de limão.", 42, { img: PH.skewers, allergens: ["peixe", "gluten", "ovo"] }),
        p("Lula à dorê", "Anéis de lula empanados e molho tártaro.", 48, { img: PH.shrimp, allergens: ["crustaceos", "gluten", "ovo"] }),
      ]),
      cat("Peixes", [
        p("Pesca do dia na brasa", "Filé do peixe do dia, legumes grelhados e manteiga de ervas.", 89, {
          img: PH.fish,
          tags: ["Pesca do dia"],
          allergens: ["peixe", "lactose"],
        }),
        p("Salmão em crosta de ervas", "Purê de mandioquinha e aspargos.", 96, { img: PH.salmon, allergens: ["peixe", "lactose"] }),
        p("Moqueca de peixe", "Leite de coco, dendê, pimentões, arroz e pirão. Serve 2.", 168, {
          img: PH.salmonDish,
          featured: true,
          tags: ["Serve 2"],
          allergens: ["peixe"],
        }),
      ]),
      cat("Frutos do mar", [
        p("Camarão na moranga", "Camarões no creme de requeijão, servido na abóbora.", 139, { img: PH.shrimp, allergens: ["crustaceos", "lactose"] }),
        p("Polvo grelhado", "Batatas ao murro, azeite e páprica.", 142, { img: PH.plated, allergens: ["crustaceos"] }),
        p("Ostras frescas", "Meia dúzia com limão e mignonette.", 78, { img: PH.fineDining, allergens: ["crustaceos"], unavailable: true }),
      ]),
      cat("Pratos especiais", [
        p("Paella marinera", "Arroz bomba, frutos do mar e açafrão. Serve 2.", 219, { img: PH.feast, tags: ["Serve 2"], allergens: ["crustaceos", "peixe"] }),
        p("Risoto de frutos do mar", "Camarão, lula, mexilhão e limão-siciliano.", 112, { img: PH.pasta3, allergens: ["crustaceos", "lactose"] }),
      ]),
      cat("Sobremesas", [
        p("Cocada cremosa", "Com sorvete de tapioca.", 28, { img: PH.parfait, allergens: ["lactose"] }),
        p("Pudim de coco", "Calda de caramelo.", 24, { img: PH.cake, allergens: ["lactose", "ovo"] }),
      ]),
      cat("Bebidas", [
        p("Caipirinha de caju", "Cachaça, caju e limão.", 29, { img: PH.cocktail }),
        p("Vinho branco Sauvignon Blanc", "Taça.", 39, { img: PH.wine }),
        p("Água de coco", "Natural, 400 ml.", 12),
        p("Suco de abacaxi com hortelã", "500 ml.", 15),
      ]),
    ],
  },
};
