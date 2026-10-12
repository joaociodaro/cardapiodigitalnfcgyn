"use client";

import type { ReactNode } from "react";
import clsx from "clsx";

export type Device = "mobile" | "tablet" | "desktop";

const SIZES: Record<Exclude<Device, "desktop">, { w: number; h: number; r: number }> = {
  mobile: { w: 390, h: 800, r: 46 },
  tablet: { w: 820, h: 1000, r: 28 },
};

/**
 * Moldura de dispositivo para pré-visualizações.
 * O `transform` na moldura faz com que elementos `position: fixed` do cardápio
 * (painéis, botão do WhatsApp) fiquem contidos dentro do aparelho.
 */
export function DeviceFrame({
  device,
  children,
  className,
  scale = 1,
}: {
  device: Exclude<Device, "desktop">;
  children: ReactNode;
  className?: string;
  scale?: number;
}) {
  const s = SIZES[device];
  return (
    <div
      className={clsx("relative shrink-0", className)}
      style={{ width: s.w * scale, height: s.h * scale }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left overflow-hidden bg-black p-[10px] shadow-[0_40px_80px_-30px_rgba(0,0,0,.45)] ring-1 ring-black/20"
        style={{ width: s.w, height: s.h, borderRadius: s.r, transform: `scale(${scale})` }}
      >
        <div
          className="relative h-full w-full overflow-hidden bg-white"
          style={{ borderRadius: s.r - 10, transform: "translateZ(0)" }}
        >
          <div className="no-scrollbar h-full w-full overflow-y-auto overscroll-contain">{children}</div>
        </div>
      </div>
    </div>
  );
}
