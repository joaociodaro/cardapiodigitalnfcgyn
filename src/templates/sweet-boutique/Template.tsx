"use client";

import { Gift, Heart } from "lucide-react";
import type { TemplateProps } from "@/menu-engine/types";
import { useMenu } from "@/menu-engine/runtime/MenuContext";
import { MenuImage } from "@/menu-engine/runtime/MenuImage";
import { EmptySearch, SearchField } from "@/menu-engine/runtime/Overlays";
import { Price, ProductButton, Unavailable, useSection } from "../_shared";

/** Sweet Boutique — capa em arco, nome caligráfico e vitrine em mosaico (colunas). */
export default function SweetBoutique({ doc, theme }: TemplateProps) {
  const { categories, activeCategoryId, goToCategory, setInfoOpen } = useMenu();
  const section = useSection();
  const e = doc.establishment;
  const L = theme.layout;

  return (
    <div className="pb-24">
      <header className="pb-8 pt-8 text-center" style={{ background: "var(--m-header)" }}>
        {L.headerStyle === "hero" && (
          <div className="relative mx-auto aspect-[4/5] w-[72%] max-w-xs overflow-hidden rounded-t-full border-[6px]" style={{ borderColor: "var(--m-card)" }}>
            <MenuImage src={e.coverUrl} alt="" sizes="320px" priority />
          </div>
        )}
        <h1 className="m-pad mt-6" style={{ fontSize: "calc(3.4rem * var(--m-heading-scale))", lineHeight: 1 }}>
          {e.name}
        </h1>
        {e.tagline && <p className="mt-2 text-sm tracking-[0.25em]" style={{ color: "var(--m-highlight)" }}>{e.tagline}</p>}
        <button type="button" onClick={() => setInfoOpen(true)} className="menu-button mt-5 px-5 py-2 text-sm font-semibold">
          Horários e encomendas
        </button>
      </header>

      <nav aria-label="Categorias" className="sticky z-30" style={{ top: "var(--m-sticky-top, 0px)", background: "color-mix(in oklab, var(--m-bg) 92%, transparent)", backdropFilter: "blur(8px)" }}>
        <ul className="no-scrollbar mx-auto flex max-w-4xl gap-2 overflow-x-auto px-4 py-3 @3xl:justify-center">
          {categories.map((c) => {
            const active = c.id === activeCategoryId;
            return (
              <li key={c.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => goToCategory(c.id)}
                  aria-current={active ? "true" : undefined}
                  className="rounded-full px-4 py-1.5 text-sm font-medium transition"
                  style={{
                    background: active ? "var(--m-primary)" : "var(--m-card)",
                    color: active ? "var(--m-button-text)" : "var(--m-heading)",
                    boxShadow: active ? "none" : "inset 0 0 0 1px var(--m-border)",
                  }}
                >
                  {c.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="m-pad mx-auto max-w-4xl">
        <SearchField className="mt-2" placeholder="Qual doce você procura?" />
        <EmptySearch />
        {categories.map((c) => (
          <section key={c.id} {...section(c.id, 64)} className="pt-10">
            <h2 className="text-center" style={{ fontSize: "calc(2.5rem * var(--m-heading-scale))" }}>{c.name}</h2>
            {c.description && <p className="mt-1 text-center text-sm opacity-70">{c.description}</p>}

            {L.productView === "grid" ? (
              <ul className="mt-6 columns-2 m-gap @3xl:columns-3" style={{ columnGap: "calc(1rem * var(--m-space))" }}>
                {c.products.map((p, i) => (
                  <li key={p.id} className="mb-4 break-inside-avoid">
                    <ProductButton
                      product={p}
                      className="overflow-hidden"
                      style={{ background: "var(--m-card)", borderRadius: "var(--m-radius)", boxShadow: "0 8px 24px -16px color-mix(in oklab, var(--m-primary) 60%, transparent)" }}
                    >
                      {L.showImages && (
                        <div className={`relative ${i % 3 === 0 ? "aspect-[4/5]" : "aspect-square"}`}>
                          <MenuImage src={p.imageUrl} alt={p.name} sizes="(max-width: 768px) 50vw, 33vw" />
                          {p.tags?.includes("Presente") && (
                            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold" style={{ background: "var(--m-highlight)", color: "#fff" }}>
                              <Gift className="size-3" /> Presente
                            </span>
                          )}
                          {p.featured && (
                            <span className="absolute right-3 top-3 grid size-7 place-items-center rounded-full bg-white/90" style={{ color: "var(--m-primary)" }} aria-label="Favorito">
                              <Heart className="size-3.5 fill-current" />
                            </span>
                          )}
                        </div>
                      )}
                      <div className="p-3.5">
                        <h3 className="text-[0.98rem] font-semibold leading-snug" style={{ fontFamily: "var(--m-font-body)", letterSpacing: 0 }}>
                          {p.name}
                        </h3>
                        {L.showDescriptions && p.description && <p className="line-clamp-2 mt-1 text-xs opacity-70">{p.description}</p>}
                        <Price product={p} className="mt-2 block text-sm font-semibold" />
                        <Unavailable product={p} />
                      </div>
                    </ProductButton>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="mx-auto mt-6 max-w-xl space-y-3">
                {c.products.map((p) => (
                  <li key={p.id}>
                    <ProductButton product={p} className="flex items-center gap-4 p-2.5" style={{ background: "var(--m-card)", borderRadius: "var(--m-radius)" }}>
                      {L.showImages && (
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-full">
                          <MenuImage src={p.imageUrl} alt="" sizes="64px" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--m-font-body)", letterSpacing: 0 }}>{p.name}</h3>
                        {L.showDescriptions && <p className="line-clamp-2 text-xs opacity-70">{p.description}</p>}
                        <Unavailable product={p} />
                      </div>
                      <Price product={p} className="shrink-0 pr-2 text-sm font-semibold" />
                    </ProductButton>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <footer className="mt-16 py-10 text-center" style={{ background: "var(--m-footer)" }}>
        <p style={{ fontFamily: "var(--m-font-heading)", color: "var(--m-heading)", fontSize: "2.2rem" }}>{e.name}</p>
        {e.extraInfo && <p className="m-pad mt-2 text-sm opacity-70">{e.extraInfo}</p>}
        {e.address && <p className="m-pad mt-1 text-xs opacity-60">{e.address}</p>}
      </footer>
    </div>
  );
}
