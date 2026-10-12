"use client";

import { Clock, Info } from "lucide-react";
import type { TemplateProps } from "@/menu-engine/types";
import { useMenu } from "@/menu-engine/runtime/MenuContext";
import { MenuImage } from "@/menu-engine/runtime/MenuImage";
import { EmptySearch, SearchField } from "@/menu-engine/runtime/Overlays";
import { Price, ProductButton, Unavailable, useSection } from "../_shared";

/** Prime Steakhouse — cabeçalho dividido, controle segmentado e cortes como fichas técnicas. */
export default function PrimeSteakhouse({ doc, theme }: TemplateProps) {
  const { categories, activeCategoryId, goToCategory, setInfoOpen } = useMenu();
  const section = useSection();
  const e = doc.establishment;
  const L = theme.layout;
  const side = L.imagePosition === "side";

  return (
    <div className="pb-24">
      <header className="@3xl:grid @3xl:grid-cols-2" style={{ background: "var(--m-header)" }}>
        {L.headerStyle === "hero" && (
          <div className="relative aspect-[16/10] @3xl:order-2 @3xl:aspect-auto @3xl:min-h-[420px]">
            <MenuImage src={e.coverUrl} alt="" sizes="(max-width: 768px) 100vw, 50vw" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--m-header)] to-transparent @3xl:bg-gradient-to-r" />
          </div>
        )}
        <div className="m-pad flex flex-col justify-center py-10 @3xl:py-16 @3xl:pl-12">
          <span aria-hidden className="h-1 w-14" style={{ background: "var(--m-primary)" }} />
          <h1 className="m-h-xl mt-5 uppercase">{e.name}</h1>
          {e.tagline && <p className="mt-3 text-lg opacity-75">{e.tagline}</p>}
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            {e.hours?.[0] && (
              <span className="inline-flex items-center gap-1.5 opacity-75">
                <Clock className="size-4" style={{ color: "var(--m-primary)" }} /> {e.hours[0].days}: {e.hours[0].hours}
              </span>
            )}
            <button type="button" onClick={() => setInfoOpen(true)} className="inline-flex items-center gap-1.5 font-medium" style={{ color: "var(--m-highlight)" }}>
              <Info className="size-4" /> Mais informações
            </button>
          </div>
        </div>
      </header>

      <nav aria-label="Categorias" className="sticky z-30 px-3 py-3" style={{ top: "var(--m-sticky-top, 0px)", background: "var(--m-bg)" }}>
        <ul
          className="no-scrollbar mx-auto flex max-w-5xl overflow-x-auto p-1"
          style={{ background: "var(--m-card)", borderRadius: "var(--m-radius)", boxShadow: "inset 0 0 0 1px var(--m-border)" }}
        >
          {categories.map((c) => {
            const active = c.id === activeCategoryId;
            return (
              <li key={c.id} className="flex-1 shrink-0">
                <button
                  type="button"
                  onClick={() => goToCategory(c.id)}
                  aria-current={active ? "true" : undefined}
                  className="w-full whitespace-nowrap px-4 py-2 text-sm uppercase tracking-wider transition"
                  style={{
                    fontFamily: "var(--m-font-heading)",
                    borderRadius: "calc(var(--m-radius) - 2px)",
                    background: active ? "var(--m-primary)" : "transparent",
                    color: active ? "var(--m-button-text)" : "var(--m-text)",
                  }}
                >
                  {c.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="m-pad mx-auto max-w-5xl">
        <SearchField className="mt-3" placeholder="Buscar corte, acompanhamento ou bebida" />
        <EmptySearch />
        {categories.map((c) => (
          <section key={c.id} {...section(c.id, 76)} className="pt-12">
            <div className="flex items-end gap-4">
              <h2 className="m-h-lg uppercase">{c.name}</h2>
              <span className="mb-2 h-px flex-1" style={{ background: "var(--m-border)" }} />
            </div>
            {c.description && <p className="mt-2 text-sm opacity-65">{c.description}</p>}

            {L.productView === "large" ? (
              <ul className="mt-6 space-y-4">
                {c.products.map((p) => (
                  <li key={p.id}>
                    <ProductButton
                      product={p}
                      className={`overflow-hidden ${side ? "@md:grid @md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]" : ""}`}
                      style={{ background: "var(--m-card)", borderRadius: "var(--m-radius)", borderLeft: "3px solid var(--m-primary)" }}
                    >
                      {L.showImages && p.imageUrl && (
                        <div className={`relative ${side ? "aspect-[16/9] @md:aspect-auto @md:min-h-[180px]" : "aspect-[16/9]"}`}>
                          <MenuImage src={p.imageUrl} alt={p.name} sizes="(max-width: 768px) 100vw, 40vw" />
                        </div>
                      )}
                      <div className="p-4 @3xl:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="m-h-md uppercase">{p.name}</h3>
                          <Price product={p} className="shrink-0 text-lg font-semibold" />
                        </div>
                        {L.showDescriptions && p.description && <p className="mt-1.5 text-sm opacity-70">{p.description}</p>}
                        {!!p.tags?.length && (
                          <ul className="mt-4 flex flex-wrap gap-2">
                            {p.tags.map((t) => (
                              <li
                                key={t}
                                className="px-2.5 py-1 text-xs uppercase tracking-wider"
                                style={{ border: "1px solid var(--m-secondary)", color: "var(--m-highlight)", borderRadius: "calc(var(--m-radius) - 2px)" }}
                              >
                                {t}
                              </li>
                            ))}
                          </ul>
                        )}
                        <Unavailable product={p} className="mt-2 block" />
                      </div>
                    </ProductButton>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="mt-4">
                {c.products.map((p) => (
                  <li key={p.id} className="border-b" style={{ borderColor: "var(--m-border)" }}>
                    <ProductButton product={p} className="grid grid-cols-[1fr_auto] gap-x-4 py-3.5">
                      <h3 className="text-[1.05rem] uppercase" style={{ letterSpacing: "0.04em" }}>{p.name}</h3>
                      <Price product={p} className="font-semibold" />
                      {L.showDescriptions && <p className="col-span-2 mt-0.5 text-sm opacity-65">{[p.tags?.join(" · "), p.description].filter(Boolean).join(" — ")}</p>}
                      <Unavailable product={p} />
                    </ProductButton>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <footer className="mt-16 py-10" style={{ background: "var(--m-footer)" }}>
        <div className="m-pad mx-auto flex max-w-5xl flex-col gap-1 text-sm opacity-70">
          <p className="text-lg uppercase" style={{ fontFamily: "var(--m-font-heading)", color: "var(--m-heading)" }}>{e.name}</p>
          {e.address && <p>{e.address}</p>}
          {e.phone && <p>{e.phone}</p>}
        </div>
      </footer>
    </div>
  );
}
