"use client";

import { Anchor, Fish } from "lucide-react";
import type { TemplateProps } from "@/menu-engine/types";
import { useMenu } from "@/menu-engine/runtime/MenuContext";
import { MenuImage } from "@/menu-engine/runtime/MenuImage";
import { EmptySearch, SearchField } from "@/menu-engine/runtime/Overlays";
import { Price, ProductButton, Unavailable, useSection } from "../_shared";

function Wave({ fill, flip = false }: { fill: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block h-8 w-full @3xl:h-14" style={{ transform: flip ? "rotate(180deg)" : undefined }} aria-hidden>
      <path d="M0 30 C 240 60 480 0 720 30 C 960 60 1200 0 1440 30 L1440 60 L0 60 Z" fill={fill} />
    </svg>
  );
}

const SAND = "color-mix(in oklab, var(--m-highlight) 12%, var(--m-bg))";

/** Ocean Signature — capa marinha com onda, seções alternadas em tom de areia. */
export default function OceanSignature({ doc, theme }: TemplateProps) {
  const { categories, activeCategoryId, goToCategory, setInfoOpen } = useMenu();
  const section = useSection();
  const e = doc.establishment;
  const L = theme.layout;

  return (
    <div className="pb-24">
      <header className="relative text-white" style={{ background: "var(--m-header)" }}>
        {L.headerStyle === "hero" && (
          <div className="absolute inset-0">
            <MenuImage src={e.coverUrl} alt="" sizes="100vw" priority className="opacity-40 mix-blend-luminosity" />
          </div>
        )}
        <div className={`m-pad relative mx-auto max-w-4xl ${L.headerStyle === "hero" ? "pb-16 pt-24" : "py-10"}`}>
          <Anchor className="size-6" style={{ color: "var(--m-highlight)" }} />
          <h1 className="m-h-xl mt-4" style={{ color: "#fff" }}>{e.name}</h1>
          {e.tagline && <p className="mt-2 opacity-85">{e.tagline}</p>}
          <button type="button" onClick={() => setInfoOpen(true)} className="mt-6 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur transition hover:bg-white/25">
            Horários e localização
          </button>
        </div>
        <div className="relative">
          <Wave fill="var(--m-bg)" />
        </div>
      </header>

      <nav aria-label="Categorias" className="sticky z-30 border-b" style={{ top: "var(--m-sticky-top, 0px)", background: "var(--m-bg)", borderColor: "var(--m-border)" }}>
        <ul className="no-scrollbar mx-auto flex max-w-4xl gap-6 overflow-x-auto px-5">
          {categories.map((c) => {
            const active = c.id === activeCategoryId;
            return (
              <li key={c.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => goToCategory(c.id)}
                  aria-current={active ? "true" : undefined}
                  className="relative py-3.5 text-sm font-medium transition"
                  style={{ color: active ? "var(--m-primary)" : "var(--m-text)", opacity: active ? 1 : 0.6 }}
                >
                  {c.name}
                  <svg viewBox="0 0 40 6" className="absolute -bottom-px left-0 h-1.5 w-full transition-opacity" style={{ opacity: active ? 1 : 0 }} preserveAspectRatio="none" aria-hidden>
                    <path d="M0 3 Q5 0 10 3 T20 3 T30 3 T40 3" fill="none" stroke="var(--m-secondary)" strokeWidth="1.6" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="m-pad mx-auto max-w-4xl">
        <SearchField className="my-6" placeholder="Buscar peixe, prato ou bebida" />
        <EmptySearch />
      </div>

      {categories.map((c, idx) => {
        const sand = idx % 2 === 1;
        const sp = section(c.id, 52);
        return (
          <section key={c.id} {...sp} style={{ ...sp.style, background: sand ? SAND : "transparent" }}>
            {sand && <Wave fill="var(--m-bg)" flip />}
            <div className="m-pad mx-auto max-w-4xl py-10">
              <div className="flex items-center gap-3">
                <Fish className="size-5" style={{ color: "var(--m-secondary)" }} />
                <h2 className="m-h-lg">{c.name}</h2>
              </div>
              {c.description && <p className="mt-1 text-sm opacity-70">{c.description}</p>}

              {L.productView === "grid" ? (
                <ul className="mt-6 grid grid-cols-2 m-gap @3xl:grid-cols-3">
                  {c.products.map((p) => (
                    <li key={p.id}>
                      <ProductButton product={p} className="h-full overflow-hidden" style={{ background: "var(--m-card)", borderRadius: "var(--m-radius)", boxShadow: "0 0 0 1px var(--m-border)" }}>
                        {L.showImages && (
                          <div className="relative aspect-[4/3]">
                            <MenuImage src={p.imageUrl} alt={p.name} sizes="(max-width: 768px) 50vw, 33vw" />
                          </div>
                        )}
                        <div className="p-3">
                          <h3 className="text-[1.05rem] leading-tight">{p.name}</h3>
                          <Price product={p} className="mt-1 block text-sm font-semibold" />
                          <Unavailable product={p} />
                        </div>
                      </ProductButton>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-6 grid m-gap @3xl:grid-cols-2">
                  {c.products.map((p) => (
                    <li key={p.id}>
                      <ProductButton product={p} className="flex h-full gap-4 p-3" style={{ background: "var(--m-card)", borderRadius: "var(--m-radius)", boxShadow: "0 0 0 1px var(--m-border)" }}>
                        {L.showImages && p.imageUrl && (
                          <div className="relative size-24 shrink-0 overflow-hidden" style={{ borderRadius: "calc(var(--m-radius) - 4px)" }}>
                            <MenuImage src={p.imageUrl} alt="" sizes="96px" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1 py-0.5">
                          {p.tags?.includes("Pesca do dia") && (
                            <span className="mb-1 inline-block rounded-full px-2 py-0.5 text-[0.68rem] font-semibold" style={{ background: "var(--m-highlight)", color: "#fff" }}>
                              Pesca do dia
                            </span>
                          )}
                          <h3 className="text-[1.1rem] leading-tight">{p.name}</h3>
                          {L.showDescriptions && p.description && <p className="line-clamp-2 mt-1 text-sm leading-snug opacity-70">{p.description}</p>}
                          <div className="mt-2 flex items-center gap-2">
                            <Price product={p} className="font-semibold" />
                            <Unavailable product={p} />
                          </div>
                        </div>
                      </ProductButton>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {sand && <Wave fill="var(--m-bg)" />}
          </section>
        );
      })}

      <footer style={{ background: "var(--m-footer)", color: "#fff" }}>
        <Wave fill="var(--m-bg)" flip />
        <div className="m-pad mx-auto max-w-4xl pb-12 pt-6 text-sm">
          <p className="text-2xl" style={{ fontFamily: "var(--m-font-heading)" }}>{e.name}</p>
          {e.address && <p className="mt-2 opacity-75">{e.address}</p>}
          {e.phone && <p className="mt-1 opacity-75">{e.phone}</p>}
        </div>
      </footer>
    </div>
  );
}
