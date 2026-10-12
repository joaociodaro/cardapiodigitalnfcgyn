import type { Metadata } from "next";
import Link from "next/link";
import { getTemplate } from "@/templates/registry";
import { PLANS } from "@/config/plans";
import { SignUpForm } from "./SignUpForm";

export const metadata: Metadata = { title: "Criar conta", robots: { index: false } };

export default async function CadastroPage({ searchParams }: { searchParams: Promise<{ modelo?: string; plano?: string; cobranca?: string }> }) {
  const { modelo, plano, cobranca } = await searchParams;
  const template = modelo ? getTemplate(modelo) : undefined;
  const plan = PLANS.find((p) => p.code === plano);

  // Guarda a intenção (modelo/plano escolhidos na vitrine) para o onboarding.
  const intent = new URLSearchParams();
  if (template) intent.set("modelo", template.meta.slug);
  if (plan) intent.set("plano", plan.code);
  if (cobranca === "mensal" || cobranca === "unico") intent.set("cobranca", cobranca);
  const next = `/dashboard/bem-vindo${intent.size ? `?${intent}` : ""}`;

  return (
    <>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Criar sua conta</h1>
      <p className="mt-2 text-sm text-muted">
        Já tem conta?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4">
          Entrar
        </Link>
      </p>
      {(template || plan) && (
        <p className="mt-6 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted">
          Você escolheu {template && <strong className="text-ink">o modelo {template.meta.name}</strong>}
          {template && plan && " e "}
          {plan && <strong className="text-ink">o plano {plan.name}</strong>}. Continuamos daqui depois do cadastro.
        </p>
      )}
      <div className="mt-8">
        <SignUpForm next={next} />
      </div>
    </>
  );
}
