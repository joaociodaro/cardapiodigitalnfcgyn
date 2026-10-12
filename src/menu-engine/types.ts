/**
 * Modelo de dados de um cardápio.
 *
 * O mesmo formato serve para:
 *  - os dados demonstrativos de cada modelo (templates/<id>/demo.ts);
 *  - o snapshot publicado (menu_versions.document, JSONB) que /menu/[slug] lê;
 *  - o estado do editor visual (pré-visualização em tempo real).
 *
 * Preços sempre em centavos (inteiros) para evitar erros de ponto flutuante.
 */

export type Allergen =
  | "gluten"
  | "lactose"
  | "ovo"
  | "amendoim"
  | "castanhas"
  | "soja"
  | "peixe"
  | "crustaceos"
  | "gergelim"
  | "sulfitos";

export interface ProductOption {
  id: string;
  name: string;
  /** Para variações: preço final. Para adicionais: acréscimo. */
  priceCents: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  priceCents: number;
  promoPriceCents?: number;
  imageUrl?: string;
  ingredients?: string[];
  notes?: string;
  featured?: boolean;
  available?: boolean;
  /** Etiquetas curtas exibidas no card: "Vegano", "Picante", "500 g"… */
  tags?: string[];
  allergens?: Allergen[];
  /** Variações excludentes (tamanho, ponto…). Se existir, o preço vem daqui. */
  variations?: ProductOption[];
  /** Adicionais opcionais, somados ao preço. */
  addons?: ProductOption[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  hidden?: boolean;
  products: Product[];
}

export interface OpeningHours {
  days: string;
  hours: string;
}

export interface EstablishmentInfo {
  name: string;
  tagline?: string;
  description?: string;
  logoUrl?: string;
  coverUrl?: string;
  phone?: string;
  /** Somente dígitos com DDI, ex.: 5562999990000 */
  whatsapp?: string;
  address?: string;
  instagram?: string;
  hours?: OpeningHours[];
  extraInfo?: string;
}

export interface MenuSettings {
  /** Pedidos pelo WhatsApp (recurso liberado conforme o plano). */
  whatsappOrders: boolean;
  /** Botão flutuante de contato pelo WhatsApp. */
  whatsappButton: boolean;
  showSearch: boolean;
  /** Cardápio demonstrativo: não envia mensagens a números fictícios. */
  demo?: boolean;
}

export interface MenuDocument {
  establishment: EstablishmentInfo;
  categories: Category[];
  settings: MenuSettings;
}

/* ------------------------------------------------------------------ */
/* Tema                                                                */
/* ------------------------------------------------------------------ */

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  heading: string;
  button: string;
  buttonText: string;
  border: string;
  card: string;
  highlight: string;
  header: string;
  footer: string;
}

export type ProductView = "list" | "grid" | "large" | "compact";

export interface ThemeFonts {
  heading: string; // id de FONT_OPTIONS
  body: string; // id de FONT_OPTIONS
  /** Multiplicador do tamanho dos títulos (0.8 – 1.4). */
  headingScale: number;
  /** Multiplicador do tamanho das descrições (0.85 – 1.25). */
  bodyScale: number;
  headingWeight: 300 | 400 | 500 | 600 | 700;
  /** Espaçamento entre letras dos títulos, em em (-0.05 – 0.3). */
  letterSpacing: number;
}

export interface ThemeLayout {
  productView: ProductView;
  imagePosition: "top" | "side";
  /** Raio das bordas em px. */
  radius: number;
  spacing: "compact" | "normal" | "airy";
  showImages: boolean;
  showDescriptions: boolean;
  buttonStyle: "solid" | "outline" | "pill";
  headerStyle: "hero" | "minimal";
}

export interface ThemeConfig {
  colors: ThemeColors;
  fonts: ThemeFonts;
  layout: ThemeLayout;
}

/* ------------------------------------------------------------------ */
/* Modelos                                                             */
/* ------------------------------------------------------------------ */

/** Nível mínimo de plano exigido para usar o modelo. */
export type TemplateTier = "essential" | "premium";

export interface TemplateCapabilities {
  productViews: ProductView[];
  imagePositions: Array<ThemeLayout["imagePosition"]>;
  headerStyles: Array<ThemeLayout["headerStyle"]>;
}

export interface TemplateMeta {
  /** Identificador exclusivo e estável — também usado na URL /modelos/[slug]. */
  slug: string;
  code: string; // "01", "02"…
  name: string;
  segment: string;
  description: string;
  previewImage: string;
  tier: TemplateTier;
  version: number;
  capabilities: TemplateCapabilities;
}

export interface TemplateProps {
  doc: MenuDocument;
  theme: ThemeConfig;
}
