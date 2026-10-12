import type { TemplateDefinition } from "../types";
import { cat, img, p } from "../_build";
import { PH } from "../_photos";

export const tokyoSignature: TemplateDefinition = {
  meta: {
    slug: "tokyo-signature",
    code: "04",
    name: "Tokyo Signature",
    segment: "Restaurantes japoneses",
    description: "Preto, branco e um único ponto vermelho. Grade precisa e navegação silenciosa.",
    previewImage: img(PH.sushi, 1200),
    tier: "premium",
    version: 1,
    capabilities: { productViews: ["grid", "list", "compact"], imagePositions: ["top", "side"], headerStyles: ["minimal", "hero"] },
  },
  theme: {
    colors: {
      primary: "#B3261E",
      secondary: "#6B6B6B",
      background: "#F7F6F3",
      text: "#1A1A1A",
      heading: "#0D0D0D",
      button: "#0D0D0D",
      buttonText: "#F7F6F3",
      border: "#D9D6D0",
      card: "#FFFFFF",
      highlight: "#B3261E",
      header: "#F7F6F3",
      footer: "#0D0D0D",
    },
    fonts: { heading: "jost", body: "jost", headingScale: 1, bodyScale: 0.96, headingWeight: 300, letterSpacing: 0.2 },
    layout: {
      productView: "grid",
      imagePosition: "top",
      radius: 0,
      spacing: "normal",
      showImages: true,
      showDescriptions: true,
      buttonStyle: "solid",
      headerStyle: "minimal",
    },
  },
  demo: {
    establishment: {
      name: "Kaze Omakase",
      tagline: "Cozinha japonesa contemporânea",
      description: "Balcão de sushi com peixes selecionados diariamente e pratos quentes de inspiração izakaya.",
      coverUrl: img(PH.sushi2, 1600),
      phone: "(62) 3000-0404",
      whatsapp: "5500000000000",
      address: "Alameda Ricardo Paranhos, 760 — Setor Marista, Goiânia - GO",
      instagram: "@kazeomakase.demo",
      hours: [
        { days: "Terça a domingo", hours: "18h30 – 23h30" },
        { days: "Sábado e domingo (almoço)", hours: "12h – 15h" },
      ],
    },
    settings: { whatsappOrders: true, whatsappButton: true, showSearch: true, demo: true },
    categories: [
      cat("Entradas", [
        p("Sunomono", "Pepino em conserva agridoce com gergelim.", 22, { img: PH.salad, allergens: ["gergelim"], tags: ["Vegano"] }),
        p("Guioza de porco", "Seis unidades, grelhadas e servidas com ponzu.", 34, { img: PH.skewers, tags: ["6 un."], allergens: ["gluten", "soja"] }),
        p("Edamame trufado", "Soja verde na manteiga trufada e flor de sal.", 28, { img: PH.bowl, allergens: ["soja", "lactose"] }),
        p("Ceviche nikkei", "Peixe branco, leite de tigre com missô e cebola roxa.", 46, { img: PH.fish, allergens: ["peixe", "soja"] }),
      ]),
      cat("Sushi", [
        p("Niguiri de salmão", "Duas unidades, salmão maçaricado e molho tarê.", 22, { img: PH.sushi, tags: ["2 un."], allergens: ["peixe", "soja"] }),
        p("Niguiri de atum", "Duas unidades com atum bluefin.", 28, { img: PH.sushi2, tags: ["2 un."], allergens: ["peixe"] }),
        p("Uramaki Kaze", "Salmão, cream cheese e crispy de couve, 8 peças.", 42, {
          img: PH.sushi3,
          featured: true,
          tags: ["8 peças"],
          allergens: ["peixe", "lactose", "gergelim"],
        }),
        p("Hossomaki de pepino", "Oito peças.", 18, { img: PH.sushi4, tags: ["Vegano"] }),
      ]),
      cat("Sashimi", [
        p("Sashimi de salmão", "Cinco fatias de salmão.", 38, { img: PH.salmon, allergens: ["peixe"] }),
        p("Sashimi de peixe branco", "Cinco fatias com raspas de yuzu.", 42, { img: PH.fish, allergens: ["peixe"] }),
        p("Sashimi de atum", "Cinco fatias de atum bluefin.", 54, { img: PH.sushi2, unavailable: true, allergens: ["peixe"] }),
      ]),
      cat("Combinados", [
        p("Omakase do chef", "Seleção do chef em 18 peças, conforme a pesca do dia.", 189, {
          img: PH.sushi,
          featured: true,
          notes: "Disponível somente no balcão, até as 22h.",
          allergens: ["peixe", "soja"],
        }),
        p("Combinado Kaze", "30 peças variadas entre sushi, sashimi e uramaki.", 159, {
          img: PH.sushi3,
          variations: [["20 peças", 119], ["30 peças", 159], ["40 peças", 199]],
          allergens: ["peixe", "soja", "gergelim"],
        }),
      ]),
      cat("Pratos quentes", [
        p("Lámen tonkotsu", "Caldo de porco cozido por 12 horas, chashu e ovo marinado.", 58, { img: PH.pasta2, allergens: ["gluten", "ovo", "soja"] }),
        p("Salmão teriyaki", "Salmão grelhado, arroz japonês e legumes salteados.", 64, { img: PH.salmonDish, allergens: ["peixe", "soja"] }),
        p("Yakisoba de legumes", "Macarrão salteado com legumes e molho shoyu.", 46, { img: PH.pasta3, tags: ["Vegano"], allergens: ["gluten", "soja"] }),
      ]),
      cat("Bebidas", [
        p("Saquê Junmai", "Dose de 120 ml, servido gelado.", 32),
        p("Chá verde gelado", "Sencha, 400 ml.", 14),
        p("Cerveja japonesa", "Lata 350 ml.", 18),
      ]),
    ],
  },
};
