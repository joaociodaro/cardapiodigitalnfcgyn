import type { Allergen, Product } from "./types";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatPrice(cents: number): string {
  return brl.format(cents / 100);
}

/** Preço "a partir de" quando há variações; senão o preço do produto. */
export function basePrice(p: Product): number {
  if (p.variations?.length) return Math.min(...p.variations.map((v) => v.priceCents));
  return p.promoPriceCents ?? p.priceCents;
}

export function hasPromo(p: Product): boolean {
  return p.promoPriceCents != null && p.promoPriceCents < p.priceCents && !p.variations?.length;
}

export function isAvailable(p: Product): boolean {
  return p.available !== false;
}

export const ALLERGEN_LABELS: Record<Allergen, string> = {
  gluten: "Glúten",
  lactose: "Lactose",
  ovo: "Ovo",
  amendoim: "Amendoim",
  castanhas: "Castanhas",
  soja: "Soja",
  peixe: "Peixe",
  crustaceos: "Crustáceos",
  gergelim: "Gergelim",
  sulfitos: "Sulfitos",
};

export function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}
