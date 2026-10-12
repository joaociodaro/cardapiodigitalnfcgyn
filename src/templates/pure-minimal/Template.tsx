"use client";

import type { TemplateProps } from "@/menu-engine/types";
import { useMenu } from "@/menu-engine/runtime/MenuContext";
import { MenuImage } from "@/menu-engine/runtime/MenuImage";
import { EmptySearch, SearchField } from "@/menu-engine/runtime/Overlays";
import { Price, ProductButton, Unavailable, useSection } from "../_shared";

/**
 * Pure Minimal — índice de categorias em coluna lateral (desktop) e texto
 * como protagonista; fotos pequenas e quadradas ao lado dos itens.
 */
export default function PureMinimal({ doc, theme }: TemplateProps) {
  const { categories, activeCategoryId, goToCategory, setInfoOpen } = useMenu();
  const section = useSection();
  const e = doc.establishment;
  const L = theme.layout;

  return (
    <div className="pb-24">
      {L.headerStyle === "hero" && e.coverUrl && (
        <div className="relative aspect-[16/9] w-full @3xl:aspect-[21/7]">
          <MenuImage src={e.coverUrl} alt="" sizes="100vw" priority />
        </div>
      )}
      <header className="m-pad mx-auto max-w-5xl pb-10 pt-14 @3xl:pt-20" style={{ background: "var(--m-header)" }}>
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="m-h-xl">{e.name}</h1>
            {e.tagline && <p className="mt-3 text-[1.05rem] opacity-65">{e.tagline}</p>}
          </div>
          {e.logoUrl && (
            <div className="relative size-14 shrink-0 overflow-hidden rounded-full">
              <MenuImage src={e.logoUrl} alt={e.name} sizes="56px" />
            </div>
          )}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          {e.hours?.[0] && (
            <span className="opacity-65">
              {e.hours[0].days}, {e.hours[0].hours}
            </span>
          )}
          <button type="button" onClick={() => setInfoOpen(true)} className="underline decoration-[var(--m-secondary)] underline-offset-4">
            Horários, endereço e contato
          </button>
        </div>
      </header>

      <div
        className="sticky z-30 border-y @5xl:hidden"
        style={{ top: "var(--m-sticky-top, 0px)", background: "var(--m-header)", borderColor: "var(--m-border)" }}
      >
        <nav aria-label="Categorias" className="no-scrollbar flex gap-1 overflow-x-auto px-3 py-2">
          {categories.map((c) => {
            const active = c.id === activeCategoryId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => goToCategory(c.id)}
                aria-current={active ? "true" : undefined}
                className="shrink-0 rounded-full px-3.5 py-1.5 text-sm transition"
                style={{ background: active ? "var(--m-primary)" : "transparent", color: active ? "var(--m-bg)" : "inherit" }}
              >
                {c.name}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="m-pad mx-auto grid max-w-5xl gap-12 pt-10 @5xl:grid-cols-[200px_1fr]">
        <aside className="hidden @5xl:block">
          <nav aria-label="Categorias" className="sticky space-y-1" style={{ top: "calc(var(--m-sticky-top, 0px) + 32px)" }}>
            {categories.map((c) => {
              const active = c.id === activeCategoryId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => goToCategory(c.id)}
                  className="flex w-full items-center gap-3 py-1.5 text-left text-sm transition"
                  style={{ opacity: active ? 1 : 0.5 }}
                >
                  <span className="h-px transition-all" style={{ width: active ? 24 : 10, background: "currentColor" }} />
                  {c.name}
                </button>
              );
            })}
          </nav>
        </aside>

        <div>
          <SearchField className="mb-12 max-w-sm" />
          <EmptySearch />
          <div className="space-y-16">
            {categories.map((c) => (
              <section key={c.id} {...section(c.id, 64)}>
                <div className="mb-6 flex items-baseline justify-between border-b pb-3" style={{ borderColor: "var(--m-border)" }}>
                  <h2 className="m-h-lg">{c.name}</h2>
                  <span className="text-sm tabular-nums opacity-45">{c.products.length}</span>
                </div>
                {c.description && <p className="-mt-2 mb-6 max-w-lg text-sm opacity-60">{c.description}</p>}

                {L.productView === "grid" ? (
                  <ul className="grid grid-cols-2 m-gap @3xl:grid-cols-3">
                    {c.products.map((p) => (
                      <li key={p.id}>
                        <ProductButton product={p}>
                          {L.showImages && (
                            <div className="relative aspect-square overflow-hidden" style={{ borderRadius: "var(--m-radius)", background: "var(--m-footer)" }}>
                              <MenuImage src={p.imageUrl} alt={p.name} sizes="(max-width: 768px) 50vw, 300px" />
                            </div>
                          )}
                          <h3 className="mt-3 text-[0.98rem] font-normal">{p.name}</h3>
                          <Price product={p} className="mt-0.5 block text-sm opacity-70" />
                          <Unavailable product={p} />
                        </ProductButton>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul>
                    {c.products.map((p) => (
                      <li key={p.id} className="border-b last:border-0" style={{ borderColor: "var(--m-border)" }}>
                        <ProductButton product={p} className={L.productView === "compact" ? "py-3" : "py-5"}>
                          <div className="flex gap-5">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline justify-between gap-4">
                                <h3 className="text-[1.05rem] font-normal" style={{ fontFamily: "var(--m-font-heading)" }}>
                                  {p.name}
                                  {p.featured && (
                                    <span className="ml-2 align-middle text-[0.7rem]" style={{ color: "var(--m-highlight)" }}>
                                      ● favorito da casa
                                    </span>
                                  )}
                                </h3>
                                <Price product={p} className="shrink-0 text-[0.95rem]" />
                              </div>
                              {L.showDescriptions && L.productView !== "compact" && p.description && (
                                <p className="mt-1.5 max-w-md text-sm leading-relaxed opacity-60">{p.description}</p>
                              )}
                              {!!p.tags?.length && <p className="mt-1.5 text-xs opacity-55">{p.tags.join(", ")}</p>}
                              <Unavailable product={p} />
                            </div>
                            {L.showImages && L.productView !== "compact" && p.imageUrl && (
                              <div
                                className="relative size-20 shrink-0 overflow-hidden @3xl:size-24"
                                style={{ borderRadius: "var(--m-radius)", background: "var(--m-footer)" }}
                              >
                                <MenuImage src={p.imageUrl} alt="" sizes="96px" />
                              </div>
                            )}
                          </div>
                        </ProductButton>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>

      <footer className="mt-24 py-12" style={{ background: "var(--m-footer)" }}>
        <div className="m-pad mx-auto max-w-5xl text-sm opacity-70">
          <p style={{ fontFamily: "var(--m-font-heading)" }}>{e.name}</p>
          {e.address && <p className="mt-1">{e.address}</p>}
          {e.instagram && <p className="mt-1">{e.instagram}</p>}
        </div>
      </footer>
    </div>
  );
}
