import Link from "next/link";
import { Lock } from "lucide-react";
import { TEMPLATES } from "@/templates/registry";
import { fontStack } from "@/menu-engine/fonts";
import { canUseTemplate, type Entitlements } from "@/lib/entitlements";
import "@/menu-engine/fonts.css";

/**
 * Grade de modelos no painel. Cada card mostra se o modelo está incluído
 * no plano atual. A decisão vem do servidor (direitos calculados das licenças).
 */
export function TemplatePicker({
  entitlements,
  highlight,
  mode,
}: {
  entitlements: Entitlements;
  highlight?: string;
  mode: "browse" | "create";
}) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {TEMPLATES.map((t) => {
        const allowed = canUseTemplate(entitlements, t.meta.tier);
        const c = t.theme.colors;
        return (
          <li
            key={t.meta.slug}
            className={`flex flex-col overflow-hidden rounded-2xl border bg-surface ${highlight === t.meta.slug ? "border-accent ring-2 ring-accent/40" : "border-line"}`}
          >
            <div className="px-5 pb-5 pt-6" style={{ background: c.background, color: c.text }}>
              <div className="flex h-1.5 overflow-hidden rounded-full">
                {[c.primary, c.secondary, c.highlight, c.heading].map((x, i) => (
                  <span key={i} className="flex-1" style={{ background: x }} />
                ))}
              </div>
              <p className="mt-5 text-2xl leading-tight" style={{ fontFamily: fontStack(t.theme.fonts.heading), color: c.heading }}>
                {t.meta.name}
              </p>
              <p className="mt-1 text-xs opacity-75">{t.meta.segment}</p>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="flex-1 text-sm text-muted">{t.meta.description}</p>
              <p className="mt-4 text-xs font-medium">
                {allowed ? (
                  <span className="text-brand">Incluído no seu plano</span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-muted">
                    <Lock className="size-3" />
                    {t.meta.tier === "premium" ? "Planos Premium e Business" : "Todos os planos"}
                  </span>
                )}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link href={`/modelos/${t.meta.slug}`} target="_blank" className="rounded-full border border-line px-3 py-2 text-center text-sm font-medium text-ink hover:border-ink/40">
                  Demonstração
                </Link>
                {mode === "create" && allowed ? (
                  <Link href={`/dashboard/cardapios/novo?modelo=${t.meta.slug}`} className="rounded-full bg-brand px-3 py-2 text-center text-sm font-semibold text-brand-ink">
                    Usar este
                  </Link>
                ) : (
                  <Link
                    href={`/dashboard/assinatura?modelo=${t.meta.slug}${t.meta.tier === "premium" ? "&plano=premium" : ""}`}
                    className="rounded-full bg-brand px-3 py-2 text-center text-sm font-semibold text-brand-ink"
                  >
                    {allowed ? "Ver plano" : "Liberar"}
                  </Link>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
