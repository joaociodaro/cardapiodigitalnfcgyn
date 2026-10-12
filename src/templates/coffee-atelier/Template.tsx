"use client";

import { useEffect, useState } from "react";
import { Cake, Coffee, Cookie, CupSoda, Croissant, MapPin, Utensils } from "lucide-react";
import type { TemplateProps } from "@/menu-engine/types";
import { useMenu } from "@/menu-engine/runtime/MenuContext";
import { MenuImage } from "@/menu-engine/runtime/MenuImage";
import { EmptySearch, SearchField } from "@/menu-engine/runtime/Overlays";
import { normalize } from "@/menu-engine/format";
import { Price, ProductButton, Unavailable, useSection } from "../_shared";

function iconFor(name: string) {
  const n = normalize(name);
  if (n.includes("gelad") || n.includes("suco") || n.includes("bebida")) return CupSoda;
  if (n.includes("cafe") || n.includes("cha")) return Coffee;
  if (n.includes("bolo")) return Cake;
  if (n.includes("doce") || n.includes("cookie")) return Cookie;
  if (n.includes("salgad") || n.includes("pao")) return Croissant;
  return Utensils;
}

function greeting(h: number) {
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

/** Coffee Atelier — cartões arredondados, fotos circulares e categorias com ícones. */
export default function CoffeeAtelier({ doc, theme }: TemplateProps) {
  const { categories, activeCategoryId, goToCategory, setInfoOpen } = useMenu();
  const section = useSection();
  const e = doc.establishment;
  const L = theme.layout;
  const [hello, setHello] = useState("Olá");
  useEffect(() => setHello(greeting(new Date().getHours())), []);

  return (
    <div className="pb-24">
      <header className="relative overflow-hidden" style={{ background: "var(--m-header)" }}>
        {L.headerStyle === "hero" && (
          <div className="relative h-44 @3xl:h-64">
            <MenuImage src={e.coverUrl} alt="" sizes="100vw" priority />
          </div>
        )}
        <div className={`m-pad mx-auto max-w-3xl pb-8 ${L.headerStyle === "hero" ? "-mt-10" : "pt-8"}`}>
          <div
            className="relative grid size-20 place-items-center overflow-hidden rounded-full border-4"
            style={{ borderColor: "var(--m-header)", background: "var(--m-primary)", color: "var(--m-button-text)" }}
          >
            {e.logoUrl ? (
              <MenuImage src={e.logoUrl} alt={e.name} sizes="80px" />
            ) : (
              <Coffee className="size-8" strokeWidth={1.5} />
            )}
          </div>
          <p className="mt-4 text-sm" style={{ color: "var(--m-highlight)" }}>
            {hello}! Que bom ter você aqui.
          </p>
          <h1 className="m-h-xl mt-1">{e.name}</h1>
          {e.tagline && <p className="mt-2 opacity-75">{e.tagline}</p>}
          <button type="button" onClick={() => setInfoOpen(true)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--m-primary)" }}>
            <MapPin className="size-4" /> Endereço e horários
          </button>
        </div>
      </header>

      <nav aria-label="Categorias" className="sticky z-30" style={{ top: "var(--m-sticky-top, 0px)", background: "var(--m-bg)" }}>
        <ul className="no-scrollbar mx-auto flex max-w-3xl gap-2 overflow-x-auto px-4 py-3">
          {categories.map((c) => {
            const active = c.id === activeCategoryId;
            const Icon = iconFor(c.name);
            return (
              <li key={c.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => goToCategory(c.id)}
                  aria-current={active ? "true" : undefined}
                  className="flex items-center gap-2 rounded-full py-2 pl-2 pr-4 text-sm font-semibold transition"
                  style={{
                    background: active ? "var(--m-primary)" : "var(--m-card)",
                    color: active ? "var(--m-button-text)" : "var(--m-text)",
                    boxShadow: active ? "none" : "inset 0 0 0 1px var(--m-border)",
                  }}
                >
                  <span className="grid size-7 place-items-center rounded-full" style={{ background: active ? "rgba(255,255,255,.15)" : "var(--m-header)" }}>
                    <Icon className="size-4" />
                  </span>
                  {c.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="m-pad mx-auto max-w-3xl">
        <SearchField className="mt-2" placeholder="Procurar no cardápio" />
        <EmptySearch />
        {categories.map((c) => (
          <section key={c.id} {...section(c.id, 72)} className="pt-10">
            <h2 className="m-h-lg">{c.name}</h2>
            {c.description && <p className="mt-1 text-sm opacity-70">{c.description}</p>}
            {L.productView === "grid" ? (
              <ul className="mt-5 grid grid-cols-2 m-gap @3xl:grid-cols-3">
                {c.products.map((p) => (
                  <li key={p.id}>
                    <ProductButton
                      product={p}
                      className="h-full p-4 text-center"
                      style={{ background: "var(--m-card)", borderRadius: "var(--m-radius)", boxShadow: "inset 0 0 0 1px var(--m-border)" }}
                    >
                      {L.showImages && (
                        <div className="relative mx-auto aspect-square w-3/4 overflow-hidden rounded-full">
                          <MenuImage src={p.imageUrl} alt={p.name} sizes="160px" />
                        </div>
                      )}
                      <h3 className="mt-3 text-[1rem] leading-tight">{p.name}</h3>
                      <Price product={p} className="mt-1 block text-sm font-bold" />
                      <Unavailable product={p} />
                    </ProductButton>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="mt-5 space-y-3">
                {c.products.map((p) => (
                  <li key={p.id}>
                    <ProductButton
                      product={p}
                      className="flex items-center gap-4 p-3"
                      style={{ background: "var(--m-card)", borderRadius: "var(--m-radius)", boxShadow: "inset 0 0 0 1px var(--m-border)" }}
                    >
                      {L.showImages && (
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-full">
                          <MenuImage src={p.imageUrl} alt="" sizes="80px" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[1.05rem] leading-tight">
                          {p.name}
                          {p.featured && <span className="ml-1.5" aria-label="Favorito">♥</span>}
                        </h3>
                        {L.showDescriptions && p.description && <p className="line-clamp-2 mt-1 text-sm leading-snug opacity-70">{p.description}</p>}
                        <div className="mt-1.5 flex items-center gap-2">
                          <Price product={p} className="text-sm font-bold" />
                          <Unavailable product={p} />
                        </div>
                      </div>
                    </ProductButton>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <footer className="mt-16 py-10 text-center text-sm" style={{ background: "var(--m-footer)", color: "var(--m-card)" }}>
        <p className="text-xl" style={{ fontFamily: "var(--m-font-heading)" }}>{e.name}</p>
        {e.address && <p className="m-pad mt-2 opacity-70">{e.address}</p>}
      </footer>
    </div>
  );
}
