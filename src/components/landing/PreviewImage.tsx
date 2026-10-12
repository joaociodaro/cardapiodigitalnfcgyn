"use client";

import Image from "next/image";
import { useState } from "react";

/** Imagem de vitrine que some silenciosamente se falhar, deixando o gradiente do modelo. */
export function PreviewImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      sizes="(max-width: 768px) 100vw, 33vw"
      onError={() => setFailed(true)}
      className="object-cover transition duration-700 group-hover:scale-[1.03]"
    />
  );
}
