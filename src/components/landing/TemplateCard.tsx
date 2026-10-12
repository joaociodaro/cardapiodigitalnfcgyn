import Link from "next/link";
import type { TemplateDefinition } from "@/templates/types";
import { fontStack } from "@/menu-engine/fonts";
import "@/menu-engine/fonts.css";
import { PreviewImage } from "./PreviewImage";

/**
 * Card de vitrine: a parte inferior é desenhada com as cores e a fonte do
 * próprio modelo, para o visitante sentir a identidade antes de abrir.
 */
export function TemplateCard({ t }: { t: Pick<TemplateDefinition, "meta" | "theme"> }) {
  const c = t.theme.colors;
  const swatches = [c.background, c.primary, c.secondary, c.heading, c.highlight];
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="relative aspect-[4/3] overflow-hidden" style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})` }}>
        <PreviewImage src={t.meta.previewImage} alt={`Prévia do modelo ${t.meta.name}`} />
        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[0.7rem] font-medium text-white backdrop-blur">
          {t.meta.tier === "essential" ? "Todos os planos" : "Premium e Business"}
        </span>
      </div>
      <div className="px-5 pb-5 pt-4" style={{ background: c.background, color: c.text }}>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-2xl leading-tight" style={{ fontFamily: fontStack(t.theme.fonts.heading), color: c.heading, letterSpacing: `${Math.min(t.theme.fonts.letterSpacing, 0.12)}em` }}>
            {t.meta.name}
          </h3>
          <div className="flex -space-x-1.5" aria-hidden>
            {swatches.map((s, i) => (
              <span key={i} className="size-4 rounded-full ring-2" style={{ background: s, ["--tw-ring-color" as string]: c.background }} />
            ))}
          </div>
        </div>
        <p className="mt-1 text-xs opacity-70" style={{ fontFamily: fontStack(t.theme.fonts.body) }}>{t.meta.segment}</p>
      </div>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <p className="flex-1 text-sm leading-relaxed text-muted">{t.meta.description}</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link
            href={`/modelos/${t.meta.slug}`}
            className="rounded-full border border-line px-3 py-2.5 text-center text-sm font-medium text-ink transition hover:border-ink/40"
          >
            Ver demonstração
          </Link>
          <Link
            href={`/cadastro?modelo=${t.meta.slug}`}
            className="rounded-full bg-brand px-3 py-2.5 text-center text-sm font-semibold text-brand-ink transition hover:opacity-90"
          >
            Usar este modelo
          </Link>
        </div>
      </div>
    </article>
  );
}
