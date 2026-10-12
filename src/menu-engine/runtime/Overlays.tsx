"use client";

import { useEffect, useState } from "react";
import { Clock, AtSign, MapPin, Minus, Phone, Plus, Search, ShoppingBag, X } from "lucide-react";
import { useMenu } from "./MenuContext";
import { Sheet } from "./Sheet";
import { ProductSheet } from "./ProductSheet";
import { formatPrice } from "../format";
import { buildOrderMessage, cartTotal, lineTotal, whatsappLink } from "../order";

/** Camadas comuns a todos os modelos: detalhe do produto, pedido, informações e contato. */
export function MenuOverlays() {
  return (
    <>
      <ScrollSpy />
      <ProductSheet />
      <CartSheet />
      <InfoSheet />
      <FloatingActions />
    </>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.9 9.9 0 0 0 12.04 2Zm5.79 14.12c-.24.68-1.42 1.3-1.95 1.35-.5.05-.97.23-3.27-.68-2.77-1.09-4.52-3.92-4.66-4.1-.13-.18-1.1-1.47-1.1-2.8 0-1.33.7-1.99.95-2.26.24-.27.53-.34.71-.34h.51c.16 0 .38-.06.6.46.23.54.77 1.87.84 2 .07.14.11.3.02.48-.09.18-.14.29-.27.45-.14.16-.29.36-.41.48-.14.14-.28.29-.12.56.16.27.7 1.16 1.51 1.88 1.04.93 1.92 1.21 2.19 1.35.27.14.43.11.59-.07.16-.18.68-.79.86-1.06.18-.27.36-.23.6-.14.25.09 1.57.74 1.84.88.27.13.45.2.52.31.07.11.07.65-.17 1.33Z" />
    </svg>
  );
}

function FloatingActions() {
  const { doc, cart, setCartOpen, setInfoOpen } = useMenu();
  const count = cart.reduce((s, l) => s + l.quantity, 0);
  const wa = doc.establishment.whatsapp;

  if (count > 0) {
    return (
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center p-3">
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="menu-button menu-rise pointer-events-auto flex h-13 w-full max-w-md items-center justify-between px-5 text-sm font-semibold shadow-xl"
        >
          <span className="flex items-center gap-2">
            <ShoppingBag className="size-4" />
            Ver pedido · {count} {count === 1 ? "item" : "itens"}
          </span>
          <span className="tabular-nums">{formatPrice(cartTotal(cart))}</span>
        </button>
      </div>
    );
  }
  if (doc.settings.whatsappButton && wa && doc.settings.demo) {
    return (
      <button
        type="button"
        onClick={() => setInfoOpen(true)}
        aria-label="Contato pelo WhatsApp (demonstração)"
        className="fixed bottom-4 right-4 z-40 grid size-13 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
      >
        <WhatsAppIcon className="size-6" />
      </button>
    );
  }
  if (doc.settings.whatsappButton && wa) {
    return (
      <a
        href={whatsappLink(wa, `Olá, ${doc.establishment.name}! Vim pelo cardápio digital.`)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar pelo WhatsApp"
        className="fixed bottom-4 right-4 z-40 grid size-13 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
      >
        <WhatsAppIcon className="size-6" />
      </a>
    );
  }
  return null;
}

function CartSheet() {
  const { doc, cart, cartOpen, setCartOpen, updateQuantity } = useMenu();
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const wa = doc.establishment.whatsapp;

  useEffect(() => {
    if (cart.length === 0) setCartOpen(false);
  }, [cart.length, setCartOpen]);

  const message = buildOrderMessage({ establishmentName: doc.establishment.name, lines: cart, customerName: name, generalNote: note });

  return (
    <Sheet open={cartOpen} onClose={() => setCartOpen(false)} label="Seu pedido">
      <div className="space-y-5 p-5 pt-6">
        <h2 className="text-xl" style={{ fontFamily: "var(--m-font-heading)", color: "var(--m-heading)" }}>
          Seu pedido
        </h2>
        <ul className="divide-y" style={{ borderColor: "var(--m-border)" }}>
          {cart.map((l) => (
            <li key={l.key} className="flex items-start justify-between gap-3 py-3" style={{ borderColor: "var(--m-border)" }}>
              <div className="min-w-0 text-sm">
                <p className="font-medium">
                  {l.product.name}
                  {l.variation && <span className="opacity-70"> · {l.variation.name}</span>}
                </p>
                {l.addons.length > 0 && <p className="text-xs opacity-65">+ {l.addons.map((a) => a.name).join(", ")}</p>}
                {l.note && <p className="text-xs italic opacity-65">Obs.: {l.note}</p>}
                <p className="mt-1 tabular-nums opacity-80">{formatPrice(lineTotal(l))}</p>
              </div>
              <div className="flex shrink-0 items-center rounded-full border" style={{ borderColor: "var(--m-border)" }}>
                <button
                  type="button"
                  aria-label={l.quantity === 1 ? `Remover ${l.product.name}` : "Diminuir"}
                  onClick={() => updateQuantity(l.key, l.quantity - 1)}
                  className="grid size-8 place-items-center"
                >
                  {l.quantity === 1 ? <X className="size-3.5" /> : <Minus className="size-3.5" />}
                </button>
                <span className="w-5 text-center text-sm tabular-nums">{l.quantity}</span>
                <button
                  type="button"
                  aria-label="Aumentar"
                  onClick={() => updateQuantity(l.key, l.quantity + 1)}
                  className="grid size-8 place-items-center"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex items-baseline justify-between border-t pt-4" style={{ borderColor: "var(--m-border)" }}>
          <span className="text-sm opacity-75">Total estimado</span>
          <span className="text-lg font-semibold tabular-nums">{formatPrice(cartTotal(cart))}</span>
        </div>
        <div className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            placeholder="Seu nome (opcional)"
            aria-label="Seu nome"
            className="h-11 w-full rounded-[var(--m-radius)] border bg-transparent px-3 text-sm outline-none focus:border-[var(--m-primary)]"
            style={{ borderColor: "var(--m-border)" }}
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={240}
            rows={2}
            placeholder="Observações gerais, mesa ou endereço (opcional)"
            aria-label="Observações"
            className="w-full resize-none rounded-[var(--m-radius)] border bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--m-primary)]"
            style={{ borderColor: "var(--m-border)" }}
          />
        </div>
        {doc.settings.demo ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold opacity-60">Mensagem que seria enviada ao WhatsApp do restaurante</p>
            <pre className="max-h-52 overflow-auto whitespace-pre-wrap rounded-[var(--m-radius)] border p-3 font-sans text-xs leading-relaxed" style={{ borderColor: "var(--m-border)" }}>
              {message}
            </pre>
            <p className="text-xs opacity-60">Demonstração: nos cardápios publicados, este botão abre o WhatsApp do estabelecimento.</p>
          </div>
        ) : wa ? (
          <a
            href={whatsappLink(wa, message)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-semibold text-white transition hover:brightness-95"
          >
            <WhatsAppIcon className="size-5" />
            Enviar pedido pelo WhatsApp
          </a>
        ) : (
          <p className="text-sm opacity-70">Este estabelecimento ainda não cadastrou um WhatsApp para pedidos.</p>
        )}
        <p className="text-center text-xs opacity-55">O pagamento é combinado diretamente com o estabelecimento.</p>
      </div>
    </Sheet>
  );
}

function InfoSheet() {
  const { doc, infoOpen, setInfoOpen } = useMenu();
  const e = doc.establishment;
  return (
    <Sheet open={infoOpen} onClose={() => setInfoOpen(false)} label={`Sobre ${e.name}`}>
      <div className="space-y-5 p-5 pt-6 text-sm">
        <div>
          <h2 className="text-xl" style={{ fontFamily: "var(--m-font-heading)", color: "var(--m-heading)" }}>
            {e.name}
          </h2>
          {e.description && <p className="mt-2 leading-relaxed opacity-80">{e.description}</p>}
        </div>
        {!!e.hours?.length && (
          <div className="flex gap-3">
            <Clock className="mt-0.5 size-4 shrink-0 opacity-60" />
            <dl className="grid flex-1 grid-cols-[auto_1fr] gap-x-4 gap-y-1">
              {e.hours.map((h) => (
                <div key={h.days} className="contents">
                  <dt className="opacity-70">{h.days}</dt>
                  <dd className="text-right tabular-nums">{h.hours}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        {e.address && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 underline-offset-4 hover:underline"
          >
            <MapPin className="mt-0.5 size-4 shrink-0 opacity-60" />
            {e.address}
          </a>
        )}
        {e.phone && (
          <a href={`tel:${e.phone.replace(/\D/g, "")}`} className="flex gap-3 underline-offset-4 hover:underline">
            <Phone className="mt-0.5 size-4 shrink-0 opacity-60" />
            {e.phone}
          </a>
        )}
        {e.instagram && (
          <a
            href={`https://instagram.com/${e.instagram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 underline-offset-4 hover:underline"
          >
            <AtSign className="mt-0.5 size-4 shrink-0 opacity-60" />
            {e.instagram}
          </a>
        )}
        {doc.settings.demo && (
          <p className="rounded-[var(--m-radius)] p-3 text-xs" style={{ background: "color-mix(in oklab, var(--m-primary) 14%, transparent)" }}>
            Este é um cardápio demonstrativo com dados fictícios. Nos cardápios publicados, o botão do WhatsApp abre a conversa com o estabelecimento.
          </p>
        )}
        {e.extraInfo && <p className="rounded-[var(--m-radius)] border p-3 opacity-80" style={{ borderColor: "var(--m-border)" }}>{e.extraInfo}</p>}
      </div>
    </Sheet>
  );
}

/** Campo de busca com estilo herdado do tema; cada modelo decide onde posicioná-lo. */
export function SearchField({ className, placeholder = "Buscar no cardápio" }: { className?: string; placeholder?: string }) {
  const { query, setQuery, doc } = useMenu();
  if (!doc.settings.showSearch) return null;
  return (
    <label className={`relative flex items-center ${className ?? ""}`}>
      <Search className="pointer-events-none absolute left-3 size-4 opacity-55" />
      <span className="sr-only">{placeholder}</span>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-[var(--m-radius)] border bg-transparent pl-9 pr-3 text-sm outline-none placeholder:opacity-60 focus:border-[var(--m-primary)]"
        style={{ borderColor: "var(--m-border)", color: "inherit" }}
      />
    </label>
  );
}

export function EmptySearch() {
  const { query, setQuery, categories } = useMenu();
  if (!query || categories.length > 0) return null;
  return (
    <div className="px-6 py-16 text-center">
      <p className="opacity-75">Nenhum item encontrado para “{query}”.</p>
      <button type="button" onClick={() => setQuery("")} className="mt-3 text-sm underline underline-offset-4">
        Limpar busca
      </button>
    </div>
  );
}

/** Atualiza a categoria ativa conforme a rolagem. */
function ScrollSpy() {
  const { categories, setActiveCategoryId } = useMenu();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-menu-section]"));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const id = visible[0]?.target.getAttribute("data-menu-section");
        if (id) setActiveCategoryId(id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [categories, setActiveCategoryId]);
  return null;
}
