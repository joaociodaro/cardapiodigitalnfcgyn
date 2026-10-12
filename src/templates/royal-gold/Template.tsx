"use client";

import { Info } from "lucide-react";
import type { TemplateProps } from "@/menu-engine/types";
import { useMenu } from "@/menu-engine/runtime/MenuContext";
import { MenuImage } from "@/menu-engine/runtime/MenuImage";
import { EmptySearch, SearchField } from "@/menu-engine/runtime/Overlays";
import { Price, ProductButton, Unavailable, useSection } from "../_shared";

function Ornament() {
  return (
    <div aria-hidden className="flex items-center justify-center gap-3" style={{ color: "var(--m-primary)" }}>
      <span className="h-px w-10 bg-current opacity-60" />
      <span className="size-1.5 rotate-45 bg-current" />
      <span className="h-px w-10 bg-current opacity-60" />
    </div>
  );
}

export default function RoyalGold({ doc, theme }: TemplateProps) {
  const { categories, featured, activeCategoryId, goToCategory, setInfoOpen, query } = useMenu();
  const section = useSection();
  const e = doc.establishment;
  const L = theme.layout;
  const hero = L.headerStyle === "hero";

  return (
    <div className="pb-24">
      {hero ? (
        <header className="relative flex min-h-[540px] items-end justify-center overflow-hidden @3xl:min-h-[680px]">
          <MenuImage src={e.coverUrl} alt="" sizes="100vw" priority />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,.25), rgba(0,0,0,.35) 40%, var(--m-bg) 96%)" }}
          />
          <div className="relative z-10 m-pad pb-12 text-center">
            {e.logoUrl && (
              <div className="relative mx-auto mb-6 size-20">
                <MenuImage src={e.logoUrl} alt={e.name} className="object-contain" sizes="80px" />
              </div>
            )}
            <Ornament />
            <h1 className="m-h-xl mt-6 @3xl:text-[4.5rem]">{e.name}</h1>
            {e.tagline && <p className="mt-4 text-xl italic opacity-85">{e.tagline}</p>}
            <button
              type="button"
              onClick={() => setInfoOpen(true)}
              className="mt-8 inline-flex items-center gap-2 border-b pb-1 text-sm tracking-[0.18em] transition hover:opacity-80"
              style={{ borderColor: "var(--m-primary)", color: "var(--m-highlight)", fontFamily: "var(--m-font-heading)" }}
            >
              <Info className="size-3.5" /> Horários e endereço
            </button>
          </div>
        </header>
      ) : (
        <header className="m-pad flex items-center justify-between py-6" style={{ background: "var(--m-header)" }}>
          <h1 className="m-h-md">{e.name}</h1>
          <button type="button" onClick={() => setInfoOpen(true)} aria-label="Informações" className="opacity-80">
            <Info className="size-5" />
          </button>
        </header>
      )}

      <nav
        aria-label="Categorias"
        className="sticky z-30 border-y backdrop-blur-md"
        style={{ top: "var(--m-sticky-top, 0px)", background: "color-mix(in oklab, var(--m-header) 88%, transparent)", borderColor: "var(--m-border)" }}
      >
        <ul className="no-scrollbar mx-auto flex max-w-5xl gap-7 overflow-x-auto px-5 @3xl:justify-center">
          {categories.map((c) => {
            const active = c.id === activeCategoryId;
            return (
              <li key={c.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => goToCategory(c.id)}
                  aria-current={active ? "true" : undefined}
                  className="relative py-4 text-[0.78rem] tracking-[0.16em] transition"
                  style={{ fontFamily: "var(--m-font-heading)", color: active ? "var(--m-highlight)" : "var(--m-text)", opacity: active ? 1 : 0.6 }}
                >
                  {c.name}
                  <span
                    className="absolute inset-x-0 bottom-0 h-px origin-center transition-transform duration-300"
                    style={{ background: "var(--m-primary)", transform: active ? "scaleX(1)" : "scaleX(0)" }}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="m-pad mx-auto max-w-5xl pt-8">
        <SearchField className="mx-auto max-w-md" placeholder="Buscar pratos e bebidas" />
      </div>

      {!query && featured.length > 0 && (
        <section aria-label="Seleção do chef" className="mx-auto max-w-5xl pt-12">
          <h2 className="m-h-sm m-pad text-center opacity-90">Seleção do chef</h2>
          <div className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 @3xl:justify-center">
            {featured.map((p) => (
              <ProductButton key={p.id} product={p} className="relative w-[68%] shrink-0 snap-center overflow-hidden @3xl:w-64">
                <div className="relative aspect-[3/4]" style={{ borderRadius: "var(--m-radius)", overflow: "hidden" }}>
                  <MenuImage src={p.imageUrl} alt={p.name} sizes="300px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-lg leading-tight" style={{ fontFamily: "var(--m-font-heading)", color: "var(--m-heading)" }}>
                      {p.name}
                    </p>
                    <Price product={p} className="mt-1 block text-base" />
                  </div>
                </div>
              </ProductButton>
            ))}
          </div>
        </section>
      )}

      <div className="m-stack mx-auto max-w-5xl pt-14">
        <EmptySearch />
        {categories.map((c) => (
          <section key={c.id} {...section(c.id, 64)} className="m-pad">
            <div className="mb-8 text-center">
              <h2 className="m-h-lg">{c.name}</h2>
              <div className="mt-4">
                <Ornament />
              </div>
              {c.description && <p className="mx-auto mt-4 max-w-md italic opacity-75">{c.description}</p>}
            </div>

            {L.productView === "list" || !L.showImages ? (
              <ul className="mx-auto max-w-2xl space-y-6">
                {c.products.map((p) => (
                  <li key={p.id}>
                    <ProductButton product={p}>
                      <div className="flex items-baseline gap-3">
                        <span className="text-[1.15rem]" style={{ color: "var(--m-heading)" }}>
                          {p.name}
                        </span>
                        <span aria-hidden className="mb-1 flex-1 border-b border-dotted" style={{ borderColor: "var(--m-secondary)" }} />
                        <Price product={p} className="text-[1.05rem]" />
                      </div>
                      {L.showDescriptions && p.description && <p className="mt-1 pr-16 text-[0.98rem] opacity-70">{p.description}</p>}
                      <Unavailable product={p} />
                    </ProductButton>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className={`grid m-gap ${L.productView === "grid" ? "grid-cols-2 @3xl:grid-cols-3" : "@3xl:grid-cols-2"}`}>
                {c.products.map((p) => (
                  <li key={p.id}>
                    <ProductButton product={p} className="group h-full">
                      <div
                        className="relative aspect-[16/10] overflow-hidden"
                        style={{ borderRadius: "var(--m-radius)", border: "1px solid var(--m-border)" }}
                      >
                        <MenuImage
                          src={p.imageUrl}
                          alt={p.name}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                        {p.featured && (
                          <span
                            className="absolute left-3 top-3 px-2 py-1 text-[0.65rem] tracking-[0.18em]"
                            style={{ background: "var(--m-primary)", color: "var(--m-button-text)", fontFamily: "var(--m-font-heading)" }}
                          >
                            Destaque
                          </span>
                        )}
                      </div>
                      <div className="pt-4">
                        <div className="flex items-baseline gap-3">
                          <h3 className={L.productView === "grid" ? "m-h-sm" : "m-h-md"}>{p.name}</h3>
                          <span aria-hidden className="mb-1 hidden flex-1 border-b border-dotted @md:block" style={{ borderColor: "var(--m-secondary)" }} />
                          {L.productView !== "grid" && <Price product={p} className="ml-auto shrink-0 text-lg" />}
                        </div>
                        {L.productView === "grid" && <Price product={p} className="mt-1 block" />}
                        {L.showDescriptions && p.description && (
                          <p className="line-clamp-2 mt-2 text-[0.98rem] leading-snug opacity-70">{p.description}</p>
                        )}
                        {!!p.tags?.length && (
                          <p className="mt-2 text-sm" style={{ color: "var(--m-primary)" }}>
                            {p.tags.join("  ·  ")}
                          </p>
                        )}
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

      <footer className="mt-20 border-t py-12 text-center" style={{ background: "var(--m-footer)", borderColor: "var(--m-border)" }}>
        <Ornament />
        <p className="m-h-md mt-6" style={{ fontFamily: "var(--m-font-heading)", color: "var(--m-heading)" }}>
          {e.name}
        </p>
        {e.address && <p className="m-pad mt-3 text-sm opacity-65">{e.address}</p>}
        {e.hours?.map((h) => (
          <p key={h.days} className="mt-1 text-sm opacity-65">
            {h.days}: {h.hours}
          </p>
        ))}
      </footer>
    </div>
  );
}
