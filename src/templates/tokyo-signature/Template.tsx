"use client";

import type { TemplateProps } from "@/menu-engine/types";
import { useMenu } from "@/menu-engine/runtime/MenuContext";
import { MenuImage } from "@/menu-engine/runtime/MenuImage";
import { EmptySearch, SearchField } from "@/menu-engine/runtime/Overlays";
import { Price, ProductButton, Unavailable, useSection } from "../_shared";

/** Tokyo Signature — selo vermelho, grade de linhas finas e tipografia leve e espaçada. */
export default function TokyoSignature({ doc, theme }: TemplateProps) {
  const { categories, activeCategoryId, goToCategory, setInfoOpen } = useMenu();
  const section = useSection();
  const e = doc.establishment;
  const L = theme.layout;

  return (
    <div className="pb-24">
      {L.headerStyle === "hero" && (
        <div className="relative aspect-[4/3] @3xl:aspect-[21/8]">
          <MenuImage src={e.coverUrl} alt="" sizes="100vw" priority className="grayscale-[35%]" />
        </div>
      )}
      <header className="m-pad mx-auto max-w-5xl pb-8 pt-10" style={{ background: "var(--m-header)" }}>
        <div className="flex items-center gap-5">
          <div className="grid size-14 shrink-0 place-items-center rounded-full" style={{ background: "var(--m-primary)" }} aria-hidden>
            <span className="text-xl font-light text-white" style={{ fontFamily: "var(--m-font-heading)" }}>
              {e.name.charAt(0)}
            </span>
          </div>
          <div className="min-w-0">
            <h1 className="m-h-lg uppercase">{e.name}</h1>
            {e.tagline && <p className="mt-1 text-xs uppercase tracking-[0.25em] opacity-55">{e.tagline}</p>}
          </div>
        </div>
      </header>

      <nav
        aria-label="Categorias"
        className="sticky z-30 border-y"
        style={{ top: "var(--m-sticky-top, 0px)", background: "var(--m-header)", borderColor: "var(--m-heading)" }}
      >
        <ul className="no-scrollbar mx-auto flex max-w-5xl overflow-x-auto">
          {categories.map((c, i) => {
            const active = c.id === activeCategoryId;
            return (
              <li key={c.id} className="shrink-0" style={{ borderLeft: i === 0 ? "none" : "1px solid var(--m-border)" }}>
                <button
                  type="button"
                  onClick={() => goToCategory(c.id)}
                  aria-current={active ? "true" : undefined}
                  className="relative flex items-center gap-2 px-5 py-3.5 text-[0.72rem] uppercase tracking-[0.22em]"
                  style={{ fontFamily: "var(--m-font-heading)" }}
                >
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full transition"
                    style={{ background: active ? "var(--m-primary)" : "transparent" }}
                  />
                  {c.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="m-pad mx-auto max-w-5xl">
        <div className="flex items-center gap-3 py-6">
          <SearchField className="flex-1" placeholder="Buscar" />
          <button type="button" onClick={() => setInfoOpen(true)} className="h-10 shrink-0 border px-3 text-[0.7rem] uppercase tracking-[0.2em]" style={{ borderColor: "var(--m-border)" }}>
            Sobre
          </button>
        </div>
        <EmptySearch />

        {categories.map((c) => (
          <section key={c.id} {...section(c.id, 56)} className="pb-14">
            <div className="flex items-end justify-between border-b pb-3" style={{ borderColor: "var(--m-heading)" }}>
              <h2 className="m-h-lg uppercase">{c.name}</h2>
              <span aria-hidden className="mb-2 size-2.5" style={{ background: "var(--m-primary)" }} />
            </div>
            {c.description && <p className="mt-3 text-sm opacity-60">{c.description}</p>}

            {L.productView === "grid" ? (
              <ul className="mt-px grid grid-cols-2 @3xl:grid-cols-3">
                {c.products.map((p) => (
                  <li key={p.id} className="border-b border-r [&:nth-child(2n)]:border-r-0 @3xl:[&:nth-child(2n)]:border-r @3xl:[&:nth-child(3n)]:border-r-0" style={{ borderColor: "var(--m-border)" }}>
                    <ProductButton product={p} className="h-full p-3 @3xl:p-4">
                      {L.showImages && (
                        <div className="relative aspect-square overflow-hidden" style={{ borderRadius: "var(--m-radius)" }}>
                          <MenuImage src={p.imageUrl} alt={p.name} sizes="(max-width: 768px) 50vw, 33vw" />
                        </div>
                      )}
                      <h3 className="mt-3 text-[0.95rem] font-normal tracking-wide" style={{ letterSpacing: "0.04em" }}>
                        {p.name}
                      </h3>
                      <div className="mt-1 flex items-center justify-between text-xs">
                        <span className="opacity-55">{p.tags?.[0]}</span>
                        <Price product={p} className="text-sm" />
                      </div>
                      <Unavailable product={p} />
                    </ProductButton>
                  </li>
                ))}
              </ul>
            ) : (
              <ul>
                {c.products.map((p) => (
                  <li key={p.id} className="border-b" style={{ borderColor: "var(--m-border)" }}>
                    <ProductButton product={p} className="flex gap-4 py-4">
                      {L.showImages && L.productView !== "compact" && (
                        <div className="relative size-20 shrink-0 overflow-hidden" style={{ borderRadius: "var(--m-radius)" }}>
                          <MenuImage src={p.imageUrl} alt="" sizes="80px" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="text-[0.98rem] font-normal">{p.name}</h3>
                          <Price product={p} className="shrink-0 text-sm" />
                        </div>
                        {L.showDescriptions && L.productView !== "compact" && <p className="mt-1 text-xs leading-relaxed opacity-60">{p.description}</p>}
                        <Unavailable product={p} />
                      </div>
                    </ProductButton>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <footer className="py-12 text-center text-xs uppercase tracking-[0.3em]" style={{ background: "var(--m-footer)", color: "var(--m-bg)" }}>
        <span aria-hidden className="mx-auto mb-5 block size-3 rounded-full" style={{ background: "var(--m-primary)" }} />
        {e.name}
        {e.address && <p className="m-pad mt-3 normal-case tracking-normal opacity-60">{e.address}</p>}
      </footer>
    </div>
  );
}
