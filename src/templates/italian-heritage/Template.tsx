"use client";

import type { TemplateProps } from "@/menu-engine/types";
import { useMenu } from "@/menu-engine/runtime/MenuContext";
import { MenuImage } from "@/menu-engine/runtime/MenuImage";
import { EmptySearch, SearchField } from "@/menu-engine/runtime/Overlays";
import { Price, ProductButton, Unavailable, useSection } from "../_shared";

function Sprig({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 60 20" className="h-4 w-12" style={{ color: "var(--m-secondary)", transform: flip ? "scaleX(-1)" : undefined }} aria-hidden>
      <path d="M2 10 H40" stroke="currentColor" strokeWidth="1" fill="none" />
      {[10, 20, 30].map((x) => (
        <g key={x} fill="currentColor">
          <ellipse cx={x} cy="6" rx="4" ry="1.8" transform={`rotate(-30 ${x} 6)`} />
          <ellipse cx={x + 4} cy="14" rx="4" ry="1.8" transform={`rotate(30 ${x + 4} 14)`} />
        </g>
      ))}
      <circle cx="46" cy="10" r="3" fill="var(--m-primary)" />
    </svg>
  );
}

/** Italian Heritage — carta impressa de trattoria: títulos centrais com ramos de oliva e lista em duas colunas. */
export default function ItalianHeritage({ doc, theme }: TemplateProps) {
  const { categories, featured, activeCategoryId, goToCategory, setInfoOpen, query } = useMenu();
  const section = useSection();
  const e = doc.establishment;
  const L = theme.layout;

  return (
    <div className="pb-24">
      {L.headerStyle === "hero" && (
        <div className="relative aspect-[16/9] @3xl:aspect-[21/7]">
          <MenuImage src={e.coverUrl} alt="" sizes="100vw" priority className="sepia-[25%]" />
        </div>
      )}
      <header className="m-pad mx-auto max-w-3xl py-12 text-center" style={{ background: "var(--m-header)" }}>
        <div className="flex items-center justify-center gap-3">
          <Sprig />
          <Sprig flip />
        </div>
        <h1 className="m-h-xl mt-4 italic">{e.name}</h1>
        {e.tagline && <p className="mt-3 text-sm tracking-[0.2em]" style={{ color: "var(--m-primary)" }}>{e.tagline}</p>}
        <button type="button" onClick={() => setInfoOpen(true)} className="mt-5 text-sm italic underline underline-offset-4 opacity-75">
          Horários, endereço e reservas
        </button>
      </header>

      <nav
        aria-label="Categorias"
        className="sticky z-30 border-y-2 border-double"
        style={{ top: "var(--m-sticky-top, 0px)", background: "var(--m-bg)", borderColor: "var(--m-secondary)" }}
      >
        <ul className="no-scrollbar mx-auto flex max-w-3xl items-center overflow-x-auto px-3 @3xl:justify-center">
          {categories.map((c, i) => {
            const active = c.id === activeCategoryId;
            return (
              <li key={c.id} className="flex shrink-0 items-center">
                {i > 0 && <span aria-hidden className="size-1 rounded-full" style={{ background: "var(--m-primary)" }} />}
                <button
                  type="button"
                  onClick={() => goToCategory(c.id)}
                  aria-current={active ? "true" : undefined}
                  className="px-3 py-3 text-[0.95rem] italic transition"
                  style={{ fontFamily: "var(--m-font-heading)", color: active ? "var(--m-primary)" : "var(--m-text)", textDecoration: active ? "underline" : "none", textUnderlineOffset: 6 }}
                >
                  {c.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="m-pad mx-auto max-w-4xl">
        <SearchField className="mx-auto mt-8 max-w-sm" placeholder="Cerca un piatto…" />
        <EmptySearch />

        {!query && featured.length > 0 && L.showImages && (
          <section aria-label="Sugestões do chef" className="mt-12 text-center">
            <h2 className="m-h-md italic">Sugestões do chef</h2>
            <ul className="no-scrollbar mt-6 flex justify-start gap-6 overflow-x-auto pb-2 @3xl:justify-center">
              {featured.map((p) => (
                <li key={p.id} className="w-32 shrink-0">
                  <ProductButton product={p} className="text-center">
                    <div className="relative mx-auto aspect-[3/4] w-28 overflow-hidden rounded-[50%] border-4" style={{ borderColor: "var(--m-card)", outline: "1px solid var(--m-secondary)" }}>
                      <MenuImage src={p.imageUrl} alt={p.name} sizes="112px" />
                    </div>
                    <p className="mt-3 text-sm italic leading-tight" style={{ fontFamily: "var(--m-font-heading)" }}>{p.name}</p>
                  </ProductButton>
                </li>
              ))}
            </ul>
          </section>
        )}

        {categories.map((c) => (
          <section key={c.id} {...section(c.id, 60)} className="pt-14">
            <div className="mb-8 text-center">
              <h2 className="m-h-lg italic">{c.name}</h2>
              <div className="mt-3 flex justify-center">
                <Sprig />
              </div>
              {c.description && <p className="mt-2 text-sm italic opacity-70">{c.description}</p>}
            </div>
            <ul className={`grid gap-x-12 ${L.productView === "large" ? "gap-y-10 @3xl:grid-cols-2" : "gap-y-6 @3xl:grid-cols-2"}`}>
              {c.products.map((p) => (
                <li key={p.id}>
                  <ProductButton product={p}>
                    {L.productView === "large" && L.showImages && (
                      <div className="relative mb-4 aspect-[4/3] overflow-hidden" style={{ borderRadius: "var(--m-radius)", border: "6px solid var(--m-card)", boxShadow: "0 0 0 1px var(--m-border)" }}>
                        <MenuImage src={p.imageUrl} alt={p.name} sizes="(max-width: 768px) 100vw, 50vw" />
                      </div>
                    )}
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-[1.08rem] font-bold" style={{ fontFamily: "var(--m-font-heading)" }}>{p.name}</h3>
                      <span aria-hidden className="mb-1 flex-1 border-b border-dashed" style={{ borderColor: "var(--m-border)" }} />
                      <Price product={p} className="shrink-0 text-[0.95rem]" />
                    </div>
                    {L.showDescriptions && p.description && <p className="mt-1 text-[0.88rem] italic leading-relaxed opacity-75">{p.description}</p>}
                    {!!p.tags?.length && <p className="mt-1 text-xs" style={{ color: "var(--m-primary)" }}>{p.tags.join(" · ")}</p>}
                    <Unavailable product={p} />
                  </ProductButton>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <footer className="mt-20 py-12 text-center" style={{ background: "var(--m-footer)", color: "var(--m-bg)" }}>
        <p className="text-2xl italic" style={{ fontFamily: "var(--m-font-heading)" }}>{e.name}</p>
        <p className="mt-2 text-sm opacity-70">Grazie e buon appetito</p>
        {e.address && <p className="m-pad mt-4 text-xs opacity-60">{e.address}</p>}
      </footer>
    </div>
  );
}
