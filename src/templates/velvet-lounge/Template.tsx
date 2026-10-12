"use client";

import type { TemplateProps } from "@/menu-engine/types";
import { useMenu } from "@/menu-engine/runtime/MenuContext";
import { MenuImage } from "@/menu-engine/runtime/MenuImage";
import { EmptySearch, SearchField } from "@/menu-engine/runtime/Overlays";
import { Price, ProductButton, Unavailable, useSection } from "../_shared";

function DecoFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative p-[6px]" style={{ border: "1px solid var(--m-primary)" }}>
      <div className="relative px-6 py-10 text-center" style={{ border: "1px solid color-mix(in oklab, var(--m-primary) 55%, transparent)" }}>
        {["left-0 top-0", "right-0 top-0", "left-0 bottom-0", "right-0 bottom-0"].map((pos) => (
          <span
            key={pos}
            aria-hidden
            className={`absolute ${pos} size-3 -translate-x-1/2 -translate-y-1/2 rotate-45`}
            style={{
              background: "var(--m-bg)",
              border: "1px solid var(--m-primary)",
              transform: `translate(${pos.includes("right") ? "50%" : "-50%"}, ${pos.includes("bottom") ? "50%" : "-50%"}) rotate(45deg)`,
            }}
          />
        ))}
        {children}
      </div>
    </div>
  );
}

/** Velvet Lounge — moldura art déco, drinks em formato retrato e lista de ingredientes em itálico. */
export default function VelvetLounge({ doc, theme }: TemplateProps) {
  const { categories, activeCategoryId, goToCategory, setInfoOpen } = useMenu();
  const section = useSection();
  const e = doc.establishment;
  const L = theme.layout;

  return (
    <div className="pb-24">
      <header className="relative" style={{ background: "var(--m-header)" }}>
        {L.headerStyle === "hero" && (
          <div className="absolute inset-0">
            <MenuImage src={e.coverUrl} alt="" sizes="100vw" priority className="opacity-35" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent, var(--m-header))" }} />
          </div>
        )}
        <div className={`m-pad relative mx-auto max-w-xl ${L.headerStyle === "hero" ? "py-20" : "py-10"}`}>
          <DecoFrame>
            <p className="text-xs italic tracking-[0.3em] opacity-70">{e.tagline}</p>
            <h1 className="mt-3" style={{ fontSize: "calc(3.6rem * var(--m-heading-scale))", lineHeight: 1 }}>
              {e.name}
            </h1>
            <button type="button" onClick={() => setInfoOpen(true)} className="mt-5 text-sm italic underline underline-offset-4 opacity-80" style={{ textDecorationColor: "var(--m-primary)" }}>
              Horários e endereço
            </button>
          </DecoFrame>
        </div>
      </header>

      <nav aria-label="Categorias" className="sticky z-30 border-b" style={{ top: "var(--m-sticky-top, 0px)", background: "var(--m-header)", borderColor: "var(--m-border)" }}>
        <ul className="no-scrollbar mx-auto flex max-w-4xl gap-2 overflow-x-auto px-4 py-3 @3xl:justify-center">
          {categories.map((c) => {
            const active = c.id === activeCategoryId;
            return (
              <li key={c.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => goToCategory(c.id)}
                  aria-current={active ? "true" : undefined}
                  className="px-4 py-1.5 text-[0.95rem] transition"
                  style={{
                    fontFamily: "var(--m-font-heading)",
                    border: `1px solid ${active ? "var(--m-primary)" : "transparent"}`,
                    color: active ? "var(--m-heading)" : "var(--m-text)",
                    opacity: active ? 1 : 0.7,
                    borderRadius: "var(--m-radius)",
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
        <SearchField className="mx-auto mt-8 max-w-sm" placeholder="Buscar drink ou petisco" />
        <EmptySearch />
        {categories.map((c) => {
          const portrait = L.productView === "large" && L.showImages && c.products.some((p) => p.imageUrl);
          return (
            <section key={c.id} {...section(c.id, 64)} className="pt-14">
              <div className="mb-8 text-center">
                <span aria-hidden className="mx-auto block h-8 w-px" style={{ background: "var(--m-primary)" }} />
                <h2 className="m-h-lg mt-4">{c.name}</h2>
                {c.description && <p className="mx-auto mt-2 max-w-md text-sm italic opacity-70">{c.description}</p>}
              </div>
              {portrait ? (
                <ul className="grid grid-cols-2 m-gap @3xl:grid-cols-4">
                  {c.products.map((p) => (
                    <li key={p.id}>
                      <ProductButton product={p} className="group">
                        <div className="relative aspect-[3/4] overflow-hidden" style={{ borderRadius: "var(--m-radius)", outline: "1px solid var(--m-border)", outlineOffset: 4 }}>
                          <MenuImage src={p.imageUrl} alt={p.name} sizes="(max-width: 768px) 50vw, 25vw" className="transition duration-700 group-hover:scale-105" />
                          {p.featured && (
                            <span className="absolute left-0 top-3 px-2 py-0.5 text-[0.7rem] italic" style={{ background: "var(--m-highlight)", color: "var(--m-heading)" }}>
                              Assinatura
                            </span>
                          )}
                        </div>
                        <h3 className="mt-4 text-center text-[1.3rem] leading-tight">{p.name}</h3>
                        {L.showDescriptions && (
                          <p className="line-clamp-2 mt-1 text-center text-[0.8rem] italic leading-snug opacity-70">
                            {p.ingredients?.join(" · ") ?? p.description}
                          </p>
                        )}
                        <Price product={p} className="mt-2 block text-center" />
                        <div className="text-center"><Unavailable product={p} /></div>
                      </ProductButton>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mx-auto max-w-xl space-y-5">
                  {c.products.map((p) => (
                    <li key={p.id}>
                      <ProductButton product={p} className="text-center">
                        <h3 className="text-[1.25rem]">{p.name}</h3>
                        {L.showDescriptions && p.description && <p className="mt-0.5 text-sm italic opacity-70">{p.description}</p>}
                        <Price product={p} className="mt-1 inline-block text-sm" />
                        <Unavailable product={p} className="ml-2" />
                      </ProductButton>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      <footer className="mt-20 py-12 text-center" style={{ background: "var(--m-footer)" }}>
        <p className="text-3xl" style={{ fontFamily: "var(--m-font-heading)", color: "var(--m-heading)" }}>{e.name}</p>
        {e.extraInfo && <p className="m-pad mx-auto mt-4 max-w-sm text-xs italic opacity-60">{e.extraInfo}</p>}
      </footer>
    </div>
  );
}
