"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Minus } from "lucide-react";
import clsx from "clsx";
import { PLANS, formatBRL } from "@/config/plans";

type Billing = "mensal" | "unico";

export function PlanCards() {
  const [billing, setBilling] = useState<Billing>("mensal");

  return (
    <div>
      <div className="flex justify-center">
        <div role="radiogroup" aria-label="Forma de pagamento" className="inline-flex rounded-full border border-line bg-surface p-1">
          {(
            [
              ["mensal", "Assinatura mensal"],
              ["unico", "Pagamento único"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={billing === id}
              onClick={() => setBilling(id)}
              className={clsx(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                billing === id ? "bg-brand text-brand-ink" : "text-muted hover:text-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {PLANS.map((p) => (
          <article
            key={p.code}
            className={clsx(
              "relative flex flex-col rounded-3xl border p-7",
              p.highlight ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface text-ink",
            )}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-ink">Mais escolhido</span>
            )}
            <h3 className="font-display text-2xl font-semibold">{p.name}</h3>
            <p className={clsx("mt-2 text-sm leading-relaxed", p.highlight ? "opacity-80" : "text-muted")}>{p.pitch}</p>

            <div className="mt-6">
              {billing === "mensal" ? (
                <p>
                  <span className="font-display text-4xl font-semibold tabular-nums">{formatBRL(p.monthlyCents)}</span>
                  <span className={clsx("ml-1 text-sm", p.highlight ? "opacity-75" : "text-muted")}>/mês</span>
                </p>
              ) : (
                <>
                  <p>
                    <span className="font-display text-4xl font-semibold tabular-nums">{formatBRL(p.oneTimeCents)}</span>
                    <span className={clsx("ml-1 text-sm", p.highlight ? "opacity-75" : "text-muted")}>à vista</span>
                  </p>
                  <p className={clsx("mt-2 text-xs leading-relaxed", p.highlight ? "opacity-75" : "text-muted")}>
                    Inclui {p.oneTimeHostingMonths} meses de hospedagem. Depois, renovação opcional por {formatBRL(p.hostingRenewalCents)}/ano.
                  </p>
                </>
              )}
            </div>

            <ul className="mt-6 flex-1 space-y-2.5 text-sm">
              {p.features.map((f) => (
                <li key={f.label} className={clsx("flex items-start gap-2.5", !f.included && "opacity-50")}>
                  {f.included ? (
                    <Check className={clsx("mt-0.5 size-4 shrink-0", p.highlight ? "text-accent" : "text-brand")} />
                  ) : (
                    <Minus className="mt-0.5 size-4 shrink-0" />
                  )}
                  <span>
                    {f.label}
                    {!f.included && <span className="sr-only"> (não incluído)</span>}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href={`/cadastro?plano=${p.code}&cobranca=${billing}`}
              className={clsx(
                "mt-8 rounded-full py-3 text-center text-sm font-semibold transition",
                p.highlight ? "bg-accent text-accent-ink hover:brightness-105" : "bg-brand text-brand-ink hover:opacity-90",
              )}
            >
              {billing === "mensal" ? `Assinar o ${p.name}` : `Comprar o ${p.name}`}
            </Link>
          </article>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-muted">
        Valores em reais. Assinaturas podem ser canceladas a qualquer momento; o acesso continua até o fim do período pago.
      </p>
    </div>
  );
}
