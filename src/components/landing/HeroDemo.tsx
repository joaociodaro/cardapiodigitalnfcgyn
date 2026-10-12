"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { MenuRenderer } from "@/menu-engine/MenuRenderer";
import { TEMPLATES } from "@/templates/registry";
import { DeviceFrame } from "@/components/menu/DeviceFrame";

const FEATURED = ["royal-gold", "urban-black", "tokyo-signature", "coffee-atelier", "sweet-boutique"];

/** Celular com um cardápio de verdade: o visitante troca o modelo e navega. */
export function HeroDemo() {
  const options = TEMPLATES.filter((t) => FEATURED.includes(t.meta.slug));
  const [slug, setSlug] = useState(options[0].meta.slug);
  const t = options.find((o) => o.meta.slug === slug)!;
  const [scale, setScale] = useState(0.78);

  useEffect(() => {
    const update = () => setScale(window.innerWidth < 640 ? Math.min(0.78, (window.innerWidth - 48) / 390) : 0.78);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <DeviceFrame device="mobile" scale={scale}>
        <MenuRenderer key={slug} templateSlug={slug} doc={t.demo} theme={t.theme} />
      </DeviceFrame>
      <div role="radiogroup" aria-label="Trocar modelo na demonstração" className="mt-6 flex max-w-sm flex-wrap justify-center gap-2">
        {options.map((o) => (
          <button
            key={o.meta.slug}
            type="button"
            role="radio"
            aria-checked={o.meta.slug === slug}
            onClick={() => setSlug(o.meta.slug)}
            className={clsx(
              "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition",
              o.meta.slug === slug ? "border-ink bg-ink text-paper" : "border-line text-muted hover:border-ink/40 hover:text-ink",
            )}
          >
            <span className="size-2.5 rounded-full ring-1 ring-black/10" style={{ background: o.theme.colors.primary }} aria-hidden />
            {o.meta.name}
          </button>
        ))}
      </div>
    </div>
  );
}
