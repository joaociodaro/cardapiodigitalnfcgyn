import type { Allergen, Category, Product, ProductOption } from "@/menu-engine/types";

/** Fotos de demonstração do Unsplash (licença Unsplash: uso comercial livre, sem atribuição obrigatória). */
export function img(id: string, w = 900): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;
}

export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const reais = (v: number) => Math.round(v * 100);

type ProdInput = {
  img?: string;
  promo?: number;
  ingredients?: string[];
  notes?: string;
  featured?: boolean;
  unavailable?: boolean;
  tags?: string[];
  allergens?: Allergen[];
  variations?: Array<[string, number]>;
  addons?: Array<[string, number]>;
};

const opts = (prefix: string, list?: Array<[string, number]>): ProductOption[] | undefined =>
  list?.map(([name, price]) => ({ id: `${prefix}-${slugify(name)}`, name, priceCents: reais(price) }));

/** Atalho para escrever produtos demonstrativos de forma legível. */
export function p(name: string, description: string, price: number, o: ProdInput = {}): Product {
  const id = slugify(name);
  return {
    id,
    name,
    description,
    priceCents: reais(price),
    promoPriceCents: o.promo != null ? reais(o.promo) : undefined,
    imageUrl: o.img ? img(o.img) : undefined,
    ingredients: o.ingredients,
    notes: o.notes,
    featured: o.featured,
    available: o.unavailable ? false : true,
    tags: o.tags,
    allergens: o.allergens,
    variations: opts(`${id}-v`, o.variations),
    addons: opts(`${id}-a`, o.addons),
  };
}

export function cat(name: string, products: Product[], description?: string): Category {
  return { id: slugify(name), name, description, products };
}
