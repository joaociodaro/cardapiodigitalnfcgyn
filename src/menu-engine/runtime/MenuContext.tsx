"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Category, MenuDocument, Product, ProductOption } from "../types";
import { normalize } from "../format";
import { lineKey, type CartLine } from "../order";

interface MenuRuntime {
  doc: MenuDocument;
  query: string;
  setQuery: (q: string) => void;
  /** Categorias visíveis, já filtradas pela busca. */
  categories: Category[];
  /** Produtos marcados como destaque (em categorias visíveis). */
  featured: Product[];
  activeCategoryId: string | null;
  setActiveCategoryId: (id: string) => void;
  goToCategory: (id: string) => void;
  selected: Product | null;
  openProduct: (p: Product) => void;
  closeProduct: () => void;
  infoOpen: boolean;
  setInfoOpen: (open: boolean) => void;
  cart: CartLine[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (input: { product: Product; variation?: ProductOption; addons: ProductOption[]; quantity: number; note?: string }) => void;
  updateQuantity: (key: string, quantity: number) => void;
  /** Registra o elemento de cada categoria para navegação. */
  registerSection: (id: string) => (el: HTMLElement | null) => void;
}

const Ctx = createContext<MenuRuntime | null>(null);

export function useMenu(): MenuRuntime {
  const v = useContext(Ctx);
  if (!v) throw new Error("useMenu deve ser usado dentro de <MenuProvider>");
  return v;
}

export function MenuProvider({ doc, children }: { doc: MenuDocument; children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const visibleBase = useMemo(() => doc.categories.filter((c) => !c.hidden), [doc.categories]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(visibleBase[0]?.id ?? null);
  const sections = useRef(new Map<string, HTMLElement>());

  const categories = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return visibleBase;
    return visibleBase
      .map((c) => ({
        ...c,
        products: c.products.filter((p) =>
          normalize(`${p.name} ${p.description ?? ""} ${(p.ingredients ?? []).join(" ")} ${(p.tags ?? []).join(" ")}`).includes(q),
        ),
      }))
      .filter((c) => c.products.length > 0);
  }, [visibleBase, query]);

  const featured = useMemo(
    () => visibleBase.flatMap((c) => c.products.filter((p) => p.featured && p.available !== false)),
    [visibleBase],
  );

  const registerSection = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      if (el) sections.current.set(id, el);
      else sections.current.delete(id);
    },
    [],
  );

  const goToCategory = useCallback((id: string) => {
    setActiveCategoryId(id);
    const el = sections.current.get(id);
    if (!el) return;
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, []);

  const addToCart: MenuRuntime["addToCart"] = useCallback(({ product, variation, addons, quantity, note }) => {
    const key = lineKey(product.id, variation?.id, addons.map((a) => a.id), note);
    setCart((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) return prev.map((l) => (l.key === key ? { ...l, quantity: l.quantity + quantity } : l));
      return [...prev, { key, product, variation, addons, quantity, note }];
    });
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setCart((prev) => (quantity <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, quantity } : l))));
  }, []);

  const value: MenuRuntime = {
    doc,
    query,
    setQuery,
    categories,
    featured,
    activeCategoryId,
    setActiveCategoryId,
    goToCategory,
    selected,
    openProduct: setSelected,
    closeProduct: () => setSelected(null),
    infoOpen,
    setInfoOpen,
    cart,
    cartOpen,
    setCartOpen,
    addToCart,
    updateQuantity,
    registerSection,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
