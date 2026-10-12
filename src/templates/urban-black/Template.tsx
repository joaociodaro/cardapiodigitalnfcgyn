"use client";

import { Flame, Info } from "lucide-react";
import type { TemplateProps } from "@/menu-engine/types";
import { useMenu } from "@/menu-engine/runtime/MenuContext";
import { MenuImage } from "@/menu-engine/runtime/MenuImage";
import { EmptySearch, SearchField } from "@/menu-engine/runtime/Overlays";
import { Price, ProductButton, Unavailable, useSection } from "../_shared";

/** Urban Black — nome gigante condensado, faixa diagonal vermelha e cards de foto cheia. */
export default function UrbanBlack({ doc, theme }: TemplateProps) {
  const { categories, activeCategoryId, goToCategory, setInfoOpen } = useMenu();
  const section = useSection();
  const e = doc.establishment;
  const L = theme.layout;
  const words = e.name.split(" ");

  return (
    <div className="pb-24">
      <header className="relative overflow-hidden" style={{ background: "var(--m-header)" }}>
        {L.headerStyle === "hero" && (
          <div className="absolute inset-0">
            <MenuImage src={e.coverUrl} alt="" sizes="100vw" priority className="opacity-45" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--m-bg)] via-transparent to-black/40" />
          </div>
        )}
        <div className={`m-pad relative mx-auto max-w-6xl ${L.headerStyle === "hero" ? "pb-10 pt-24 @3xl:pt-40" : "py-8"}`}>
          <h1
            className="uppercase leading-[0.85]"
            style={{ fontSize: `calc(${L.headerStyle === "hero" ? "4.6rem" : "2.6rem"} * var(--m-heading-scale))` }}
          >
            {words.map((w, i) => (
              <span key={i} className="block" style={{ color: i === words.length - 1 ? "var(--m-primary)" : undefined }}>
                {w}
              </span>
            ))}
          </h1>
          {e.tagline && <p className="mt-4 max-w-sm text-[0.95rem] opacity-80">{e.tagline}</p>}
          <button
            type="button"
            onClick={() => setInfoOpen(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider"
            style={{ borderColor: "var(--m-border)" }}
          >
            <Info className="size-3.5" /> Info e horários
          </button>
        </div>
        <div
          aria-hidden
          className="relative h-10 -rotate-2 scale-x-110 overflow-hidden whitespace-nowrap py-2 text-lg uppercase"
          style={{ background: "var(--m-primary)", color: "var(--m-button-text)", fontFamily: "var(--m-font-heading)" }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mx-4">
              {e.tagline ?? e.name} ✦
            </span>
          ))}
        </div>
      </header>

      <nav
        aria-label="Categorias"
        className="sticky z-30 mt-2"
        style={{ top: "var(--m-sticky-top, 0px)", background: "var(--m-bg)" }}
      >
        <ul className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3">
          {categories.map((c) => {
            const active = c.id === activeCategoryId;
            return (
              <li key={c.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => goToCategory(c.id)}
                  aria-current={active ? "true" : undefined}
                  className="h-10 px-4 text-xl uppercase tracking-wide transition"
                  style={{
                    fontFamily: "var(--m-font-heading)",
                    borderRadius: "var(--m-radius)",
                    background: active ? "var(--m-primary)" : "var(--m-card)",
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

      <div className="m-pad mx-auto max-w-6xl">
        <SearchField className="mt-3" placeholder="Qual é a fome de hoje?" />
        <EmptySearch />
        <div className="mt-8 space-y-12">
          {categories.map((c) => (
            <section key={c.id} {...section(c.id, 72)}>
              <h2 className="flex items-center gap-3 uppercase" style={{ fontSize: "calc(2.4rem * var(--m-heading-scale))" }}>
                {c.name}
                <span className="h-1 flex-1" style={{ background: "var(--m-primary)" }} />
              </h2>
              {c.description && <p className="mt-1 text-sm opacity-70">{c.description}</p>}

              {L.productView === "list" ? (
                <ul className="mt-5 space-y-2">
                  {c.products.map((p) => (
                    <li key={p.id}>
                      <ProductButton
                        product={p}
                        className="flex items-center gap-3 p-2"
                        style={{ background: "var(--m-card)", borderRadius: "var(--m-radius)" }}
                      >
                        {L.showImages && (
                          <div className="relative size-16 shrink-0 overflow-hidden" style={{ borderRadius: "calc(var(--m-radius) - 4px)" }}>
                            <MenuImage src={p.imageUrl} alt="" sizes="64px" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xl uppercase leading-none">{p.name}</h3>
                          {L.showDescriptions && <p className="line-clamp-2 mt-1 text-xs opacity-65">{p.description}</p>}
                          <Unavailable product={p} />
                        </div>
                        <Price product={p} className="shrink-0 pr-2 text-sm font-bold" />
                      </ProductButton>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className={`mt-5 grid m-gap ${L.productView === "grid" ? "grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4" : "@3xl:grid-cols-2"}`}>
                  {c.products.map((p) => (
                    <li key={p.id}>
                      <ProductButton
                        product={p}
                        className="group relative h-full overflow-hidden"
                        style={{ background: "var(--m-card)", borderRadius: "var(--m-radius)" }}
                      >
                        {L.showImages && (
                          <div className={`relative ${L.productView === "grid" ? "aspect-square" : "aspect-[16/10]"} overflow-hidden`}>
                            <MenuImage src={p.imageUrl} alt={p.name} sizes="(max-width: 768px) 50vw, 25vw" className="transition duration-500 group-hover:scale-105" />
                            <span
                              className="absolute bottom-2 left-2 px-2.5 py-1 text-sm font-extrabold"
                              style={{ background: "var(--m-primary)", color: "var(--m-button-text)", borderRadius: "calc(var(--m-radius) - 6px)" }}
                            >
                              <Price product={p} />
                            </span>
                            {(p.tags?.length || p.featured) && (
                              <span
                                className="absolute right-2 top-2 inline-flex items-center gap-1 px-2 py-1 text-[0.65rem] font-bold uppercase"
                                style={{ background: "var(--m-highlight)", color: "#000", borderRadius: 999 }}
                              >
                                <Flame className="size-3" /> {p.tags?.[0] ?? "Destaque"}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="p-3">
                          <h3 className="text-[1.45rem] uppercase leading-none">{p.name}</h3>
                          {!L.showImages && <Price product={p} className="mt-1 block font-bold" />}
                          {L.showDescriptions && p.description && <p className="line-clamp-2 mt-1.5 text-xs leading-snug opacity-65">{p.description}</p>}
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
      </div>

      <footer className="mt-16 py-10 text-center" style={{ background: "var(--m-footer)" }}>
        <p className="text-3xl uppercase" style={{ fontFamily: "var(--m-font-heading)", color: "var(--m-heading)" }}>
          {e.name}
        </p>
        {e.address && <p className="m-pad mt-2 text-xs opacity-60">{e.address}</p>}
      </footer>
    </div>
  );
}
