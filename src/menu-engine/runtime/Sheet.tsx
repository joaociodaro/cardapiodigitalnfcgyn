"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

/**
 * Painel modal usado por todos os modelos (detalhe do produto, pedido, informações).
 * É renderizado no lugar (sem portal) para ficar contido na moldura do celular
 * nas prévias da landing page e do editor.
 */
export function Sheet({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center @3xl:items-center" role="presentation">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="menu-fade absolute inset-0 cursor-default bg-black/55 backdrop-blur-[2px]"
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className="menu-rise relative flex max-h-[92%] w-full flex-col overflow-hidden outline-none @3xl:max-h-[85%] @3xl:max-w-lg"
        style={{
          background: "var(--m-card)",
          color: "var(--m-text)",
          borderTopLeftRadius: "calc(var(--m-radius) + 10px)",
          borderTopRightRadius: "calc(var(--m-radius) + 10px)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/65"
        >
          <X className="size-4" />
        </button>
        <div className="overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  );
}
