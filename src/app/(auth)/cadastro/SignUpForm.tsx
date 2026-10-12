"use client";

import Link from "next/link";
import { useActionState } from "react";
import { MailCheck } from "lucide-react";
import { Field, FormAlert, SubmitButton, type ActionState } from "@/components/ui/form";
import { resendConfirmationAction, signUpAction } from "../actions";

export function SignUpForm({ next }: { next: string }) {
  const [state, action] = useActionState<ActionState, FormData>(signUpAction, {});
  const [resend, resendAction] = useActionState<ActionState, FormData>(resendConfirmationAction, {});

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6">
        <MailCheck className="size-8 text-accent" strokeWidth={1.5} />
        <h2 className="mt-4 font-display text-xl font-semibold text-ink">Confirme seu e-mail</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{state.message}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">Não chegou? Confira a caixa de spam ou reenvie.</p>
        <form action={resendAction} className="mt-5">
          <input type="hidden" name="email" value={state.values?.email ?? ""} />
          {resend.message ? (
            <p className="text-sm text-muted">{resend.message}</p>
          ) : (
            <SubmitButton variant="ghost" pendingLabel="Enviando…">
              Reenviar e-mail
            </SubmitButton>
          )}
        </form>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="next" value={next} />
      {/* Campo armadilha contra robôs: invisível para pessoas */}
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Empresa
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state.message && <FormAlert tone="error">{state.message}</FormAlert>}
      <Field label="Seu nome" name="fullName" autoComplete="name" required defaultValue={state.values?.fullName} error={state.errors?.fullName} />
      <Field label="E-mail" name="email" type="email" autoComplete="email" required defaultValue={state.values?.email} error={state.errors?.email} />
      <Field
        label="Senha"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        error={state.errors?.password}
        hint="Pelo menos 8 caracteres, com letras e números."
      />
      <div>
        <label className="flex items-start gap-2.5 text-sm text-muted">
          <input type="checkbox" name="terms" className="mt-0.5 size-4 accent-[var(--brand)]" />
          <span>
            Li e aceito os{" "}
            <Link href="/termos" target="_blank" className="font-medium text-ink underline underline-offset-2">
              termos de uso
            </Link>{" "}
            e a{" "}
            <Link href="/privacidade" target="_blank" className="font-medium text-ink underline underline-offset-2">
              política de privacidade
            </Link>
            .
          </span>
        </label>
        {state.errors?.terms && <p className="mt-1.5 text-xs font-medium text-red-700 dark:text-red-400">{state.errors.terms}</p>}
      </div>
      <SubmitButton pendingLabel="Criando conta…" className="w-full">
        Criar conta
      </SubmitButton>
    </form>
  );
}
