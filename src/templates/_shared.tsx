"use client";

import { useMenu } from "@/menu-engine/runtime/MenuContext";
import { basePrice, formatPrice, hasPromo, isAvailable } from "@/menu-engine/format";
import type { Product } from "@/menu-engine/types";

/** Props para a <section> de cada categoria (navegação e scroll-spy). */
export function useSection() {
  const { registerSection } = useMenu();
  return (id: string, offset = 72) => ({
    ref: registerSection(id),
    "data-menu-section": id,
    id: `cat-${id}`,
    style: { scrollMarginTop: `calc(var(--m-sticky-top, 0px) + ${offset}px)` },
  });
}

export function Price({ product, className }: { product: Product; className?: string }) {
  const from = !!product.variations?.length;
  return (
    <span className={`tabular-nums ${className ?? ""}`}>
      {from && <span className="mr-1 text-[0.8em] opacity-70">a partir de</span>}
      {formatPrice(basePrice(product))}
      {hasPromo(product) && <s className="ml-1.5 text-[0.82em] opacity-50">{formatPrice(product.priceCents)}</s>}
    </span>
  );
}

export function Unavailable({ product, className }: { product: Product; className?: string }) {
  if (isAvailable(product)) return null;
  return <span className={`text-[0.72rem] font-medium opacity-70 ${className ?? ""}`}>Indisponível</span>;
}

/** Botão acessível que abre o detalhe do produto. */
export function ProductButton({
  product,
  className,
  children,
  style,
}: {
  product: Product;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const { openProduct } = useMenu();
  const off = !isAvailable(product);
  return (
    <button
      type="button"
      onClick={() => openProduct(product)}
      className={`block w-full ${/\btext-(center|right)\b/.test(className ?? "") ? "" : "text-left"} ${off ? "opacity-55" : ""} ${className ?? ""}`}
      style={style}
      aria-label={`${product.name}${off ? " (indisponível)" : ""}`}
    >
      {children}
    </button>
  );
}
