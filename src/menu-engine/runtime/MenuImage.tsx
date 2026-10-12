"use client";

import Image from "next/image";
import { useState } from "react";
import { UtensilsCrossed } from "lucide-react";
import clsx from "clsx";

/**
 * Imagem de cardápio com fallback elegante: se a foto não existir ou falhar,
 * mostra um bloco com a cor de destaque do tema, nunca um ícone quebrado.
 */
export function MenuImage({
  src,
  alt,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
  priority,
}: {
  src?: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        aria-hidden
        className={clsx("absolute inset-0 grid place-items-center", className)}
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--m-primary) 22%, var(--m-card)), color-mix(in oklab, var(--m-secondary) 18%, var(--m-card)))",
          color: "color-mix(in oklab, var(--m-primary) 70%, transparent)",
        }}
      >
        {/* Imagens decorativas (alt vazio, como capas) não mostram ícone */}
        {alt && <UtensilsCrossed className="size-6 opacity-60" strokeWidth={1.25} />}
      </div>
    );
  }
  const isUnsplash = src.includes("images.unsplash.com");
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={isUnsplash}
      onError={() => setFailed(true)}
      className={clsx("object-cover", className)}
    />
  );
}
