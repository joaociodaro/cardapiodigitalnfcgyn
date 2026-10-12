"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Monitor, Smartphone, Tablet } from "lucide-react";
import clsx from "clsx";
import { MenuRenderer } from "@/menu-engine/MenuRenderer";
import { getTemplate } from "@/templates/registry";
import { DeviceFrame, type Device } from "./DeviceFrame";

const DEVICES: Array<{ id: Device; label: string; Icon: typeof Monitor }> = [
  { id: "mobile", label: "Celular", Icon: Smartphone },
  { id: "tablet", label: "Tablet", Icon: Tablet },
  { id: "desktop", label: "Tela cheia", Icon: Monitor },
];

export function DemoViewer({ slug }: { slug: string }) {
  const t = getTemplate(slug)!;
  const [device, setDevice] = useState<Device>("desktop");
  const [scale, setScale] = useState(1);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const update = () => {
      const isWide = window.innerWidth >= 900;
      setWide(isWide);
      const h = device === "tablet" ? 1000 : 800;
      const w = device === "tablet" ? 820 : 390;
      setScale(Math.min(1, (window.innerHeight - 110) / h, (window.innerWidth - 32) / w));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [device]);

  useEffect(() => {
    if (window.innerWidth >= 900) setDevice("mobile");
  }, []);

  const framed = wide && device !== "desktop";

  return (
    <div className={clsx("min-h-svh", framed && "bg-paper")}>
      <div className="sticky top-0 z-[45] border-b border-line bg-surface/90 text-ink backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <Link href="/modelos" className="flex items-center gap-1.5 text-sm text-muted transition hover:text-ink">
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Modelos</span>
          </Link>
          <div className="min-w-0 flex-1 truncate text-sm">
            <span className="font-medium">{t.meta.name}</span>
            <span className="hidden text-muted sm:inline"> — demonstração com dados fictícios</span>
          </div>
          {wide && (
            <div role="group" aria-label="Dispositivo" className="flex rounded-full border border-line p-0.5">
              {DEVICES.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDevice(id)}
                  aria-pressed={device === id}
                  title={label}
                  className={clsx(
                    "grid size-8 place-items-center rounded-full transition",
                    device === id ? "bg-brand text-brand-ink" : "text-muted hover:text-ink",
                  )}
                >
                  <Icon className="size-4" />
                  <span className="sr-only">{label}</span>
                </button>
              ))}
            </div>
          )}
          <Link
            href={`/cadastro?modelo=${t.meta.slug}`}
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink transition hover:brightness-105"
          >
            Usar este modelo
          </Link>
        </div>
      </div>

      {framed ? (
        <div className="flex justify-center px-4 py-6">
          <DeviceFrame device={device as "mobile" | "tablet"} scale={scale}>
            <MenuRenderer templateSlug={t.meta.slug} doc={t.demo} theme={t.theme} />
          </DeviceFrame>
        </div>
      ) : (
        <div style={{ ["--m-sticky-top" as string]: "56px" }}>
          <MenuRenderer templateSlug={t.meta.slug} doc={t.demo} theme={t.theme} />
        </div>
      )}
    </div>
  );
}
