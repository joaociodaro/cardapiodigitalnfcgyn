"use client";

import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useMenu } from "./MenuContext";
import { Sheet } from "./Sheet";
import { MenuImage } from "./MenuImage";
import { ALLERGEN_LABELS, formatPrice, hasPromo, isAvailable } from "../format";
import { unitPrice } from "../order";
import type { ProductOption } from "../types";

export function ProductSheet() {
  const { selected, closeProduct, doc, addToCart, setCartOpen } = useMenu();
  const [variation, setVariation] = useState<ProductOption | undefined>();
  const [addons, setAddons] = useState<ProductOption[]>([]);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");

  useEffect(() => {
    setVariation(selected?.variations?.[0]);
    setAddons([]);
    setQty(1);
    setNote("");
  }, [selected]);

  const p = selected;
  const ordering = doc.settings.whatsappOrders && !!doc.establishment.whatsapp;
  const available = p ? isAvailable(p) : false;

  return (
    <Sheet open={!!p} onClose={closeProduct} label={p?.name ?? "Produto"}>
      {p && (
        <div>
          {p.imageUrl && (
            <div className="relative aspect-[4/3] w-full">
              <MenuImage src={p.imageUrl} alt={p.name} sizes="(max-width: 768px) 100vw, 512px" />
            </div>
          )}
          <div className="space-y-5 p-5 pb-6">
            <div>
              <h2
                className="text-2xl leading-tight"
                style={{
                  fontFamily: "var(--m-font-heading)",
                  color: "var(--m-heading)",
                  fontWeight: "var(--m-heading-weight)" as unknown as number,
                  letterSpacing: "var(--m-tracking)",
                }}
              >
                {p.name}
              </h2>
              <div className="mt-2 flex items-baseline gap-2">
                {!p.variations?.length && (
                  <>
                    <span className="text-lg font-semibold" style={{ color: "var(--m-primary)" }}>
                      {formatPrice(p.promoPriceCents ?? p.priceCents)}
                    </span>
                    {hasPromo(p) && <s className="text-sm opacity-60">{formatPrice(p.priceCents)}</s>}
                  </>
                )}
                {!available && (
                  <span className="rounded-full border px-2 py-0.5 text-xs" style={{ borderColor: "var(--m-border)" }}>
                    Indisponível no momento
                  </span>
                )}
              </div>
              {p.description && <p className="mt-3 text-[0.95rem] leading-relaxed opacity-85">{p.description}</p>}
            </div>

            {!!p.ingredients?.length && (
              <Section title="Ingredientes">
                <p className="text-sm leading-relaxed opacity-80">{p.ingredients.join(", ")}.</p>
              </Section>
            )}

            {!!p.allergens?.length && (
              <Section title="Contém alergênicos">
                <ul className="flex flex-wrap gap-1.5">
                  {p.allergens.map((a) => (
                    <li key={a} className="rounded-full border px-2.5 py-1 text-xs" style={{ borderColor: "var(--m-border)" }}>
                      {ALLERGEN_LABELS[a]}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {p.notes && <p className="text-sm italic opacity-70">{p.notes}</p>}

            {!!p.variations?.length && (
              <Section title="Escolha uma opção">
                <div className="space-y-2">
                  {p.variations.map((v) => (
                    <label
                      key={v.id}
                      className="flex cursor-pointer items-center justify-between gap-3 rounded-[var(--m-radius)] border px-3 py-2.5 text-sm"
                      style={{
                        borderColor: variation?.id === v.id ? "var(--m-primary)" : "var(--m-border)",
                      }}
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="variation"
                          checked={variation?.id === v.id}
                          onChange={() => setVariation(v)}
                          className="accent-[var(--m-primary)]"
                        />
                        {v.name}
                      </span>
                      <span className="font-medium">{formatPrice(v.priceCents)}</span>
                    </label>
                  ))}
                </div>
              </Section>
            )}

            {ordering && available && !!p.addons?.length && (
              <Section title="Adicionais">
                <div className="space-y-2">
                  {p.addons.map((a) => {
                    const on = addons.some((x) => x.id === a.id);
                    return (
                      <label
                        key={a.id}
                        className="flex cursor-pointer items-center justify-between gap-3 rounded-[var(--m-radius)] border px-3 py-2.5 text-sm"
                        style={{ borderColor: on ? "var(--m-primary)" : "var(--m-border)" }}
                      >
                        <span className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={() => setAddons(on ? addons.filter((x) => x.id !== a.id) : [...addons, a])}
                            className="accent-[var(--m-primary)]"
                          />
                          {a.name}
                        </span>
                        <span className="opacity-75">+ {formatPrice(a.priceCents)}</span>
                      </label>
                    );
                  })}
                </div>
              </Section>
            )}

            {!ordering && !!p.addons?.length && (
              <Section title="Adicionais disponíveis">
                <ul className="space-y-1 text-sm opacity-80">
                  {p.addons.map((a) => (
                    <li key={a.id} className="flex justify-between">
                      <span>{a.name}</span>
                      <span>+ {formatPrice(a.priceCents)}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {ordering && available && (
              <>
                <Section title="Observação">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={140}
                    rows={2}
                    placeholder="Ex.: sem cebola, ponto da carne…"
                    className="w-full resize-none rounded-[var(--m-radius)] border bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--m-primary)]"
                    style={{ borderColor: "var(--m-border)" }}
                  />
                </Section>
                <div className="flex items-center gap-3 pt-1">
                  <div
                    className="flex items-center rounded-full border"
                    style={{ borderColor: "var(--m-border)" }}
                  >
                    <button
                      type="button"
                      aria-label="Diminuir quantidade"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="grid size-10 place-items-center"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold tabular-nums" aria-live="polite">
                      {qty}
                    </span>
                    <button
                      type="button"
                      aria-label="Aumentar quantidade"
                      onClick={() => setQty(Math.min(50, qty + 1))}
                      className="grid size-10 place-items-center"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart({ product: p, variation, addons, quantity: qty, note });
                      closeProduct();
                      setCartOpen(false);
                    }}
                    className="menu-button flex h-11 flex-1 items-center justify-between px-4 text-sm font-semibold"
                  >
                    <span>Adicionar ao pedido</span>
                    <span className="tabular-nums">{formatPrice(unitPrice({ product: p, variation, addons }) * qty)}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold opacity-60">{title}</h3>
      {children}
    </section>
  );
}
